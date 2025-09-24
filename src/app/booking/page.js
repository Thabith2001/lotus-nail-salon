'use client';

import React, { useState, createContext, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import {
    Check,
    ChevronRight,
    ChevronLeft,
    Brush,
    Heart,
    Palette,
    Gift,
    Crown,
    Sparkles,
    ArrowLeft,
    Calendar
} from "lucide-react";

import ServiceSelection from "@/components/bookingSteps/serviceSelection";
import DateTimeSelection from "@/components/bookingSteps/dateTimeSelection";
import PaymentInformation from "@/components/bookingSteps/paymentInformation";
import BookingComplete from "@/components/ui/bookingComplete";
import PurchasedItemDisplay from "@/components/bookingSteps/purchasedItems";

import { useAuthModal } from "@/context/authModelContext";
import { useAuth } from "@/context/contextAuth";
import { useData } from "@/helper/dataProvider";
import { useSparkles } from "@/hooks/useSparkles";

// Context
export const servicesContext = createContext(null);
export const bookingContext = createContext(null);

// Step indicator
const StepIndicator = ({ step, active, completed }) => (
    <div
        className={`flex items-center justify-center w-8 h-8 sm:w-12 sm:h-12 rounded-full border-2 text-sm sm:text-base transition-all duration-300 ${
            completed
                ? "bg-gradient-to-r from-green-400 to-emerald-500 border-transparent text-white"
                : active
                    ? "bg-gradient-to-r from-pink-500 to-purple-600 border-transparent text-white"
                    : "border-white/30 text-white/60"
        }`}>
        {completed ? <Check className="w-5 h-5 sm:w-6 sm:h-6" /> : step}
    </div>
);

// Sparkles background
export const SparklesBackground = ({ sparkles }) => (
    <div className="absolute inset-0 overflow-hidden">
        {sparkles.map((_, i) => (
            <div
                key={i}
                className="absolute w-1 h-1 bg-pink-300 rounded-full opacity-30 animate-pulse"
                style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 3}s`,
                    animationDuration: `${2 + Math.random() * 2}s`
                }}
            />
        ))}
    </div>
);

const BookingSystem = () => {
    const { openAuth } = useAuthModal();
    const { user } = useAuth();
    const router = useRouter();
    const { sharedData } = useData();

    const sparkles = useSparkles(50);
    const hasSharedData = !!sharedData;
    const isPaidSharedData = sharedData?.paid === true;

    const [currentStep, setCurrentStep] = useState(1);
    const [selectedService, setSelectedService] = useState(hasSharedData ? sharedData : null);
    const [selectedDate, setSelectedDate] = useState("");
    const [selectedTime, setSelectedTime] = useState("");
    const [paymentInfo, setPaymentInfo] = useState(isPaidSharedData ? {
        status: "paid",
        paymentMethod: sharedData?.type || "credit_card"
    } : null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [bookingComplete, setBookingComplete] = useState(false);
    const [bookingId, setBookingId] = useState("");
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [loadingAuth, setLoadingAuth] = useState(true);
    const [paymentsId , setPaymentsId] = useState( "");

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) openAuth();
        else setIsAuthorized(true);
        setLoadingAuth(false);
    }, [openAuth]);

    // Format time for UI display (keeps DB clean 24h)
    const formatTime = (timeString) => {
        const [h, m] = timeString.split(":");
        const d = new Date(2000, 0, 1, parseInt(h), parseInt(m));
        return d.toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
        });
    };

    const formatDate = (date) => {
        try {
            return new Date(date).toISOString().split("T")[0];
        } catch (error) {
            return date;
        }
    };


    if (loadingAuth)
        return <div className="min-h-screen flex items-center justify-center text-white">Checking authentication...</div>;
    if (!isAuthorized)
        return <div className="min-h-screen flex items-center justify-center text-white">Redirecting to login...</div>;

    const getServiceIcon = (category) => {
        switch (category) {
            case "manicure":
                return <Brush className="w-6 h-6" />;
            case "pedicure":
                return <Heart className="w-6 h-6" />;
            case "nail-art":
                return <Palette className="w-6 h-6" />;
            case "package":
                return <Gift className="w-6 h-6" />;
            case "membership":
                return <Crown className="w-6 h-6" />;
            default:
                return <Sparkles className="w-6 h-6" />;
        }
    };

    const getTotalSteps = () => hasSharedData ? (isPaidSharedData ? 1 : 2) : 3;
    const handleNextStep = () => {
        if (currentStep < getTotalSteps()) setCurrentStep(prev => prev + 1);
    };
    const handlePrevStep = () => {
        if (currentStep > 1) setCurrentStep(prev => prev - 1);
    };
    const canProceedToNext = () =>
        currentStep === 1
            ? !!selectedService || !!selectedDate
            : currentStep === 2
                ? !!selectedDate && !!selectedTime || !!paymentInfo
                : !!paymentInfo;

    const handleSubmitBooking = async (paymentDetails = null) => {
        if (isSubmitting) return;
        if (!selectedDate || !selectedService || !selectedTime) {
            alert("Please select a service, date, and time.");
            return;
        }

        setIsSubmitting(true);
        const bookingCode = `LST-${Date.now()}`;
        setBookingId(bookingCode);

        try {
            let newPaymentId = null;

            if (paymentDetails) {
                const paymentPayload = {
                    amount: selectedService.price,
                    method: paymentDetails.method || "credit_card",
                    status: paymentDetails.status || "pending",
                    transactionId: paymentDetails.id || null,
                };
                const payment = await axios.post("/api/payments", paymentPayload);
                newPaymentId = payment.data.payment._id;
            }

            const bookingPayload = {
                bookingId: bookingCode,
                userId: user._id,
                customerName: user.username,
                paymentId: newPaymentId,
                email: user.email,
                phone: user.phone || "",
                service: selectedService.name,
                bookingDate: formatDate(selectedDate),
                time: formatTime(selectedTime),
                paymentStatus: paymentDetails?.status || "pending",
            };

            const bookingRes = await axios.post("/api/bookings", bookingPayload);


            setBookingComplete(true);
        } catch (error) {
            console.error("POST booking error:", error?.response?.data?.error || error.message);
            alert(`Booking failed: ${error?.response?.data?.error || error.message || "Unknown error"}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (bookingComplete)
        return (
            <bookingContext.Provider value={{ bookingId, SparklesBackground }}>
                <BookingComplete />
            </bookingContext.Provider>
        );

    const steps = Array.from({ length: getTotalSteps() }, (_, i) => i + 1);
    const getStepLabel = (step) =>
        hasSharedData
            ? (isPaidSharedData ? "Date & Time" : step === 1 ? "Date & Time" : "Payment")
            : ["Service", "Date & Time", "Payment"][step - 1];

    return (
        <div className="min-h-screen w-full bg-gradient-to-br from-slate-900 via-purple-900 to-pink-900 relative overflow-hidden">
            <SparklesBackground sparkles={sparkles} />

            {/* Back Button */}
            <button
                onClick={() => router.back()}
                className="absolute top-4 left-4 flex items-center px-3 py-2 text-white/70 hover:text-white z-50 group">
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                <span className="ml-2">Back</span>
            </button>

            {/* Header */}
            <div className="relative z-10 text-center pt-20 pb-10 px-4">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-6">
                    <span className="block bg-gradient-to-r from-white via-pink-200 to-purple-200 bg-clip-text text-transparent">
                        {hasSharedData ? "Complete Your" : "Book Your"}
                    </span>
                    <span className="block bg-gradient-to-r from-pink-300 via-rose-200 to-white bg-clip-text text-transparent">
                        {hasSharedData ? "Booking" : "Appointment"}
                    </span>
                </h1>
                <p className="text-white/70">
                    {hasSharedData
                        ? `Book your appointment using your ${sharedData.subscription}`
                        : "Experience luxury nail care with our premium services and expert technicians"}
                </p>
            </div>

            {hasSharedData && <PurchasedItemDisplay sharedData={sharedData} />}

            {/* Step Indicator */}
            <div className="relative z-10 flex justify-center mb-10 px-6">
                <div className="bg-white/10 backdrop-blur-xl rounded-full border border-white/20 py-3 px-5 sm:px-8">
                    <div className="flex items-center space-x-4 sm:space-x-8">
                        {steps.map((step, index) => (
                            <React.Fragment key={step}>
                                <div className="flex flex-col items-center">
                                    <StepIndicator step={step} active={step === currentStep} completed={step < currentStep} />
                                    <span className="text-xs text-white/60 mt-1 hidden sm:block">{getStepLabel(step)}</span>
                                </div>
                                {index < steps.length - 1 && (
                                    <div
                                        className={`w-6 sm:w-10 h-0.5 ${
                                            step < currentStep
                                                ? "bg-gradient-to-r from-green-400 to-emerald-500"
                                                : "bg-white/30"
                                        }`}
                                    />
                                )}
                            </React.Fragment>
                        ))}
                    </div>
                </div>
            </div>

            {/* Booking Card */}
            <div className="relative z-10 max-w-lg sm:max-w-3xl lg:max-w-5xl mx-auto px-4 sm:px-6 pb-16">
                <div className="bg-white/5 backdrop-blur-xl rounded-2xl lg:rounded-3xl border border-white/10 shadow-2xl overflow-hidden">
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
                            isPaidSharedData
                        }}
                    >
                        {hasSharedData ? (
                            <>
                                {currentStep === 1 && <DateTimeSelection />}
                                {currentStep === 2 && !isPaidSharedData && (
                                    <PaymentInformation
                                        autoConfirm
                                        onSuccess={async (paymentDetails) => {
                                            setPaymentInfo(paymentDetails);
                                            await handleSubmitBooking(paymentDetails);
                                        }}
                                    />
                                )}
                            </>
                        ) : (
                            <>
                                {currentStep === 1 && <ServiceSelection />}
                                {currentStep === 2 && <DateTimeSelection />}
                                {currentStep === 3 && (
                                    <PaymentInformation
                                        autoConfirm
                                        onSuccess={async (paymentDetails) => {
                                            setPaymentInfo(paymentDetails);
                                            await handleSubmitBooking(paymentDetails);
                                        }}
                                    />
                                )}
                            </>
                        )}
                    </servicesContext.Provider>

                    {/* Navigation */}
                    <div className="px-4 sm:px-8 py-5 bg-white/5 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4">
                        {currentStep > 1 && (
                            <button
                                onClick={handlePrevStep}
                                className="flex items-center space-x-2 px-6 py-2 rounded-full font-semibold text-sm bg-white/10 text-white hover:bg-white/20">
                                <ChevronLeft className="w-4 h-4" /> <span>Previous</span>
                            </button>
                        )}

                        {currentStep < getTotalSteps() && (
                            <button
                                onClick={handleNextStep}
                                disabled={!canProceedToNext()}
                                className={`flex items-center space-x-2 px-6 py-2 rounded-full font-semibold text-sm ${
                                    canProceedToNext()
                                        ? "bg-gradient-to-r from-pink-500 to-purple-600 text-white"
                                        : "bg-gray-600 text-gray-400 cursor-not-allowed"
                                }`}
                            >
                                <span>Next</span> <ChevronRight className="w-4 h-4" />
                            </button>
                        )}

                        {hasSharedData && isPaidSharedData && currentStep === 1 && (
                            <button
                                onClick={() => handleSubmitBooking()}
                                disabled={!canProceedToNext() || isSubmitting}
                                className={`flex items-center space-x-2 px-6 py-2 rounded-full font-semibold text-sm ${
                                    canProceedToNext() && !isSubmitting
                                        ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white"
                                        : "bg-gray-600 text-gray-400 cursor-not-allowed"
                                }`}
                            >
                                <span>{isSubmitting ? "Booking..." : "Book Now"}</span>
                                <Calendar className="w-4 h-4" />
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookingSystem;