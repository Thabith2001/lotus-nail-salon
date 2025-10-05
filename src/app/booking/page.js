'use client';

import React, {createContext, useCallback, useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import axios from "axios";
import {ArrowLeft, Brush, Check, ChevronLeft, ChevronRight, Crown, Gift, Heart, Palette, Sparkles} from "lucide-react";

import ServiceSelection from "@/components/bookingSteps/serviceSelection";
import DateTimeSelection from "@/components/bookingSteps/dateTimeSelection";
import PaymentInformation from "@/components/bookingSteps/paymentInformation";
import BookingComplete from "@/components/ui/bookingComplete";
import PurchasedItemDisplay from "@/components/bookingSteps/purchasedItems";

import {useAuthModal} from "@/context/authModelContext";
import {useAuth} from "@/context/contextAuth";
import {useData} from "@/helper/dataProvider";
import {useSparkles} from "@/hooks/useSparkles";

// Context
export const servicesContext = createContext(null);
export const bookingContext = createContext(null);

//  Step Indicator
const StepIndicator = ({step, active, completed}) => (
    <div
        className={`flex items-center justify-center w-8 h-8 sm:w-12 sm:h-12 rounded-full border-2 text-sm sm:text-base transition-all duration-300
      ${completed ? "bg-gradient-to-r from-green-400 to-emerald-500 border-transparent text-white" : active ? "bg-gradient-to-r from-pink-500 to-purple-600 border-transparent text-white" : "border-white/30 text-white/60"}`}
    >
        {completed ? <Check className="w-5 h-5 sm:w-6 sm:h-6"/> : step}
    </div>
);

//  Sparkles Background
export const SparklesBackground = ({sparkles}) => (
    <div className="absolute inset-0 overflow-hidden">
        {sparkles.map((_, i) => (
            <div
                key={i}
                className="absolute w-1 h-1 bg-pink-300 rounded-full opacity-30 animate-pulse"
                style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 3}s`,
                    animationDuration: `${2 + Math.random() * 2}s`,
                }}
            />
        ))}
    </div>
);

const BookingSystem = () => {
    const {openAuth} = useAuthModal();
    const {user} = useAuth();
    const router = useRouter();
    const {sharedData} = useData();

    const sparkles = useSparkles(50);
    const hasSharedData = !!sharedData;
    const isPaidSharedData = sharedData?.paid === true;

    const [currentStep, setCurrentStep] = useState(1);
    const [selectedService, setSelectedService] = useState(hasSharedData ? sharedData : null);
    const [selectedDate, setSelectedDate] = useState("");
    const [selectedTime, setSelectedTime] = useState("");
    const [paymentInfo, setPaymentInfo] = useState(isPaidSharedData ? {
        status: "succeeded",
        paymentMethod: sharedData?.type || "credit_card"
    } : null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [bookingComplete, setBookingComplete] = useState(false);
    const [bookingId, setBookingId] = useState("");
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [loadingAuth, setLoadingAuth] = useState(true);
    const [subscription, setSubscription] = useState(null);
    const [usingMembership, setUsingMembership] = useState(false);
    const [usersId, setUsersId] = useState(null);


    //  Authentication
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) openAuth(); else setIsAuthorized(true);
        setLoadingAuth(false);
    }, [openAuth]);

    useEffect(() => {
        const fetchMembership = async () => {
            try {
                if (!user?._id) return;

                const resp = await axios.get(`/api/user-membership?userId=${user?._id}`);
                const membership = resp?.data?.results;
                setUsersId(membership?.userId || user?._id);

                if (!membership) {
                    setSubscription(null);
                    setUsingMembership(false);
                    return;
                }


                if (sharedData?.subscription === "membership" && membership.status === "active" && Number(membership.remainingSessions) > 0) {
                    setSubscription(membership);
                    setUsingMembership(true);
                } else if (membership.status !== "active" && Number(membership.remainingSessions) === 0) {
                    setUsingMembership(false);
                }


            } catch (err) {
                console.error("Error fetching membership:", err.message || err);
                setSubscription(null);
                setUsingMembership(false);
            }
        };

        fetchMembership();
    }, [user?._id, sharedData]);


    //  Utility formatters
    const formatTime = (timeString) => {
        if (!timeString) return "";
        const [h, m] = timeString.split(":");
        const d = new Date(2000, 0, 1, parseInt(h, 10), parseInt(m, 10));
        return d.toLocaleTimeString("en-US", {hour: "numeric", minute: "2-digit", hour12: true});
    };

    const formatDate = (date) => {
        if (!date) return "";
        const d = new Date(date);
        return isNaN(d) ? date : d.toISOString().split("T")[0];
    };

    if (loadingAuth) return <div className="min-h-screen flex items-center justify-center text-white">Checking
        authentication...</div>;
    if (!isAuthorized) return <div className="min-h-screen flex items-center justify-center text-white">Redirecting to
        login...</div>;

    //  Icons
    const getServiceIcon = (category) => {
        switch (category) {
            case "manicure":
                return <Brush className="w-6 h-6"/>;
            case "pedicure":
                return <Heart className="w-6 h-6"/>;
            case "nail-art":
                return <Palette className="w-6 h-6"/>;
            case "package":
                return <Gift className="w-6 h-6"/>;
            case "membership":
                return <Crown className="w-6 h-6"/>;
            default:
                return <Sparkles className="w-6 h-6"/>;
        }
    };


    const getTotalSteps = () => {
        // If user has active membership and NO shared data, only show date/time selection
        if (usingMembership && !hasSharedData) {
            return 1;
        }
        // If has shared data (from pricing)
        if (hasSharedData) {
            return isPaidSharedData ? 1 : 2;
        }
        // Regular flow
        return 3;
    };

    const handleNextStep = () => {
        if (currentStep < getTotalSteps()) setCurrentStep((prev) => prev + 1);
    };
    const handlePrevStep = () => {
        if (currentStep > 1) setCurrentStep((prev) => prev - 1);
    };

    const canProceedToNext = () => {
        // For membership users WITHOUT shared data, only need date and time
        if (usingMembership && !hasSharedData) {
            return !!selectedDate && !!selectedTime;
        }
        if (currentStep === 1) {
            return hasSharedData ? (!!selectedDate && !!selectedTime) : !!selectedService;
        }
        if (currentStep === 2) {
            return !!selectedDate && !!selectedTime;
        }
        return !!paymentInfo;
    };

    //  Submit booking
    const handleSubmitBooking = async (paymentDetails = {}) => {
        if (isSubmitting) return;

        // --- VALIDATION ---
        if (!selectedDate || !selectedTime) {
            alert("Please select a date and time.");
            return;
        }
        if (!usingMembership && !hasSharedData && !selectedService) {
            alert("Please select a service.");
            return;
        }

        setIsSubmitting(true);
        const bookingCode = `LST-${Date.now()}`;
        setBookingId(bookingCode);

        try {
            let membership = subscription;
            let newPayment = null;

            // --- Check membership state ---
            const noActiveMembership =
                !membership ||
                membership.status !== "active" ||
                membership.remainingSessions <= 0;


            if (!usingMembership || noActiveMembership) {
                const paymentPayload = {
                    amount: selectedService?.price || 0,
                    method: paymentDetails?.method || "credit_card",
                    status: paymentDetails?.status || "pending",
                    transactionId: paymentDetails?.id || null,
                    userId: usersId,
                };

                const paymentRes = await axios.post("/api/payments", paymentPayload);
                newPayment = paymentRes?.data;

                // --- Create membership if this service includes one ---
                if (selectedService?.subscription === "membership") {
                    const createMembership = await axios.post("/api/user-membership", {
                        userId: usersId,
                        membershipPackage: selectedService.subscription,
                        startDate: formatDate(new Date()),
                        endDate: formatDate(
                            new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
                        ),
                        service: selectedService.name,
                        sessions: Number(selectedService.sessions) || 1,
                        remainingSessions:
                            Math.max((Number(selectedService.sessions) || 1) - 1, 0),
                        status:
                            (Number(selectedService.sessions) || 1) > 1
                                ? "active"
                                : "expired",
                        paymentId: newPayment?.results?._id || null,
                    });

                    membership = createMembership?.data?.results;
                    setSubscription(membership);
                    setUsingMembership(true);
                }
            } else if (usingMembership && membership?.status === "active") {
                if (membership.service !== selectedService?.name) {
                    alert(
                        `Your current membership is for "${membership.service}", not "${selectedService.name}". Please purchase a new membership.`
                    );
                    setIsSubmitting(false);
                    router.push("/#pricing");
                    return;
                }

                const newRemaining = Math.max(
                    (membership.remainingSessions || 1) - 1,
                    0
                );
                const newStatus = newRemaining > 0 ? "active" : "expired";

                const resp = await axios.patch(
                    `/api/user-membership/${membership._id}`,
                    {
                        remainingSessions: newRemaining,
                        status: newStatus,
                    }
                );
                membership = resp.data?.results;
            }


            const bookingPayload = {
                bookingId: bookingCode,
                userId: usersId,
                customerName: user?.username || user?.name || "Guest",
                email: user?.email || "",
                phone: user?.phone || "",
                service: selectedService?.name || "Custom Service",
                bookingDate: formatDate(selectedDate),
                time: formatTime(selectedTime),
                membershipId: membership?._id || null,
                paymentId: newPayment?.results?._id || membership?.paymentId || null,
                paymentStatus:
                    membership && !newPayment
                        ? "covered by membership"
                        : newPayment?.results?.status || "pending",
                reasons: "empty",
                status: new Date(selectedDate) > new Date() ? "upcoming" : "completed",
            };

            const bookingRes = await axios.post("/api/bookings", bookingPayload);


            if (bookingRes?.status === 201 && usingMembership && membership?._id) {
                const updatedRemaining = Math.max(
                    membership?.remainingSessions || 0,
                    0
                );
                const updatedStatus = updatedRemaining > 0 ? "active" : "expired";

                await axios.patch(`/api/user-membership/${membership._id}`, {
                    remainingSessions: updatedRemaining,
                    status: updatedStatus,
                });
            }

            setBookingComplete(true);
        } catch (err) {
            console.error("Booking submission failed:", err);
            alert(
                err.response?.data?.message ||
                "Something went wrong while creating the booking."
            );
        } finally {
            setIsSubmitting(false);
        }
    };


    //  Booking complete page
    if (bookingComplete) {
        return (
            <bookingContext.Provider value={{bookingId, SparklesBackground}}>
                <BookingComplete/>
            </bookingContext.Provider>
        );
    }

    const steps = Array.from({length: getTotalSteps()}, (_, i) => i + 1);
    const getStepLabel = (step) => {
        if (usingMembership && !hasSharedData) {
            return "Date & Time";
        }
        if (hasSharedData) {
            return isPaidSharedData ? "Date & Time" : step === 1 ? "Date & Time" : "Payment";
        }
        return ["Service", "Date & Time", "Payment"][step - 1];
    };

    return (
        <div
            className="min-h-screen w-full bg-gradient-to-br from-slate-900 via-purple-900 to-pink-900 relative overflow-hidden">
            <SparklesBackground sparkles={sparkles}/>

            {/* Back Button */}
            <button
                onClick={() => router.back()}
                className="absolute top-4 left-4 flex items-center px-3 py-2 text-white/70 hover:text-white z-50 group"
            >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform"/>
                <span className="ml-2">Back</span>
            </button>

            {/* Header */}
            <div className="relative z-10 text-center pt-20 pb-10 px-4">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-6">
          <span
              className="block bg-gradient-to-r from-white via-pink-200 to-purple-200 bg-clip-text text-transparent">
            {usingMembership && !hasSharedData ? "Use Your Membership" : hasSharedData ? "Complete Your" : "Book Your"}
          </span>
                    <span
                        className="block bg-gradient-to-r from-pink-300 via-rose-200 to-white bg-clip-text text-transparent">
            {usingMembership && !hasSharedData ? "Session" : hasSharedData ? "Booking" : "Appointment"}
          </span>
                </h1>
                <p className="text-white/70">
                    {usingMembership && !hasSharedData
                        ? `Book your appointment using your membership (${subscription?.remainingSessions || 0} sessions remaining)`
                        : hasSharedData
                            ? `Complete your booking for ${sharedData?.name || "your selected service"}`
                            : "Experience luxury nail care with our premium services and expert technicians"}
                </p>
            </div>

            {hasSharedData && <PurchasedItemDisplay sharedData={sharedData}/>}

            {/* Step Indicator - Only show for non-membership flow */}
            {!(usingMembership && subscription?.status === "active") && (
                <div className="relative z-10 flex justify-center mb-10 px-6">
                    <div className="bg-white/10 backdrop-blur-xl rounded-full border border-white/20 py-3 px-5 sm:px-8">
                        <div className="flex items-center space-x-4 sm:space-x-8">
                            {steps.map((step, index) => (
                                <React.Fragment key={step}>
                                    <div className="flex flex-col items-center">
                                        <StepIndicator
                                            step={step}
                                            active={step === currentStep}
                                            completed={step < currentStep}
                                        />
                                        <span className="text-xs text-white/60 mt-1 hidden sm:block">
                    {getStepLabel(step)}
                  </span>
                                    </div>
                                    {index < steps.length - 1 && (
                                        <div
                                            className={`w-6 sm:w-10 h-0.5 ${step < currentStep ? "bg-gradient-to-r from-green-400 to-emerald-500" : "bg-white/30"}`}
                                        />
                                    )}
                                </React.Fragment>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Booking Card */}
            <div className="relative z-10 max-w-lg sm:max-w-3xl lg:max-w-5xl mx-auto px-4 sm:px-6 pb-16">
                <div
                    className="bg-white/5 backdrop-blur-xl rounded-2xl lg:rounded-3xl border border-white/10 shadow-2xl overflow-hidden">
                    <servicesContext.Provider
                        value={{
                            selectedService,
                            setSelectedService,
                            selectedDate,
                            setSelectedDate,
                            selectedTime,
                            setSelectedTime,
                            paymentInfo,
                            setPaymentInfo,
                            getServiceIcon,
                            handleSubmitBooking,
                            sharedData,
                            hasSharedData,
                            isPaidSharedData,
                            subscription,
                            usingMembership,
                        }}
                    >
                        {/* MEMBERSHIP USER FLOW - No service selection, only date/time */}
                        {usingMembership && subscription?.status === "active" ? (
                            <>
                                <div
                                    className="p-6 bg-gradient-to-r from-green-500/10 to-emerald-500/10 border-b border-white/10">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-3">
                                            <Crown className="w-8 h-8 text-yellow-400"/>
                                            <div>
                                                <h3 className="text-lg font-bold text-white">Active Membership</h3>
                                                <p className="text-sm text-white/70">
                                                    {subscription?.remainingSessions || 0} sessions remaining
                                                </p>
                                                <p className="text-xs text-white/50 mt-1">
                                                    Package: {subscription?.membershipPackage || "Standard"}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <DateTimeSelection/>

                                <div className="p-6 text-center border-t border-white/10">
                                    <button
                                        onClick={() => handleSubmitBooking()}
                                        disabled={!canProceedToNext() || isSubmitting}
                                        className={`px-8 py-3 rounded-full font-semibold text-sm transition-all ${canProceedToNext() && !isSubmitting ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:shadow-lg" : "bg-gray-600 text-gray-400 cursor-not-allowed"}`}
                                    >
                                        {isSubmitting ? "Booking..." : `Book Appointment (${subscription?.remainingSessions || 0} sessions left)`}
                                    </button>
                                </div>
                            </>
                        ) : hasSharedData ? (
                            <>
                                {/* SHARED DATA FLOW */}
                                {currentStep === 1 && <DateTimeSelection/>}
                                {currentStep === 2 && !isPaidSharedData && (
                                    <PaymentInformation
                                        autoConfirm
                                        onSuccess={async (paymentDetails) => {
                                            setPaymentInfo(paymentDetails);
                                            await handleSubmitBooking(paymentDetails);
                                        }}
                                    />
                                )}
                                {isPaidSharedData && currentStep === 1 && (
                                    <div className="p-6 text-center border-t border-white/10">
                                        <button
                                            onClick={() => handleSubmitBooking({
                                                method: sharedData?.type || "credit_card",
                                                status: "succeeded"
                                            })}
                                            disabled={!canProceedToNext() || isSubmitting}
                                            className={`px-8 py-3 rounded-full font-semibold text-sm transition-all ${canProceedToNext() && !isSubmitting ? "bg-gradient-to-r from-pink-500 to-purple-600 text-white hover:shadow-lg" : "bg-gray-600 text-gray-400 cursor-not-allowed"}`}
                                        >
                                            {isSubmitting ? "Booking..." : "Confirm Booking"}
                                        </button>
                                    </div>
                                )}
                            </>
                        ) : (
                            <>
                                {/* REGULAR USER FLOW */}
                                {currentStep === 1 && <ServiceSelection/>}
                                {currentStep === 2 && <DateTimeSelection/>}
                                {currentStep === 3 && (
                                    <PaymentInformation
                                        onSuccess={async (paymentDetails) => {
                                            setPaymentInfo(paymentDetails);
                                            await handleSubmitBooking(paymentDetails);
                                        }}
                                    />
                                )}
                            </>
                        )}
                    </servicesContext.Provider>

                    {/* Step Navigation - Only show for multi-step flows */}
                    {!(usingMembership && subscription?.subscription !== "active") && (
                        <div className="flex justify-between items-center p-6 border-t border-white/10">
                            <button
                                onClick={handlePrevStep}
                                disabled={currentStep === 1}
                                className={`flex items-center px-4 py-2 rounded-full text-sm font-medium transition-all ${currentStep === 1 ? "text-gray-500 cursor-not-allowed" : "text-white hover:bg-white/10"}`}
                            >
                                <ChevronLeft className="w-4 h-4 mr-1"/> Back
                            </button>

                            <button
                                onClick={handleNextStep}
                                disabled={!canProceedToNext() || currentStep === getTotalSteps()}
                                className={`flex items-center px-6 py-2 rounded-full text-sm font-medium transition-all ${canProceedToNext() && currentStep !== getTotalSteps() ? "bg-gradient-to-r from-pink-500 to-purple-600 text-white hover:shadow-lg" : "bg-gray-600 text-gray-400 cursor-not-allowed"}`}
                            >
                                Next <ChevronRight className="w-4 h-4 ml-1"/>
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BookingSystem;