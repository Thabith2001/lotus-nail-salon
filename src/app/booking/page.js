'use client';

import React, {useState, createContext, useEffect} from "react";
import {
    Check,
    ChevronRight,
    Heart,
    Sparkles,
    Gift,
    Crown,
    Brush,
    Palette,
    CheckCircle,
    ArrowLeft, ChevronLeft,
} from "lucide-react";
import {useSparkles} from "@/hooks/useSparkles";
import ServiceSelection from "@/components/bookingSteps/serviceSelection";
import DateTimeSelection from "@/components/bookingSteps/dateTimeSelection";
import PaymentInformation from "@/components/bookingSteps/paymentInformation";
import {useRouter} from "next/navigation";
import {useAuthModal} from "@/context/authModelContext";
import {useAuth} from "@/context/contextAuth";
import axios from "axios";

// Context
export const servicesContext = createContext(null);

// Step Indicator Component
const StepIndicator = ({step, active, completed}) => (
    <div
        className={`flex items-center justify-center w-8 h-8 sm:w-12 sm:h-12 rounded-full border-2 text-sm sm:text-base transition-all duration-300 ${
            completed
                ? "bg-gradient-to-r from-green-400 to-emerald-500 border-transparent text-white"
                : active
                    ? "bg-gradient-to-r from-pink-500 to-purple-600 border-transparent text-white"
                    : "border-white/30 text-white/60"
        }`}
    >
        {completed ? <Check className="w-5 h-5 sm:w-6 sm:h-6"/> : step}
    </div>
);

// Sparkles Background Component
const SparklesBackground = ({sparkles}) => (
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

    // Booking State
    const [currentStep, setCurrentStep] = useState(1);
    const [selectedService, setSelectedService] = useState(null);
    const [selectedDate, setSelectedDate] = useState("");
    const [selectedTime, setSelectedTime] = useState("");
    const [paymentInfo, setPaymentInfo] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [bookingComplete, setBookingComplete] = useState(false);
    const [bookingId, setBookingId] = useState("");
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [loadingAuth, setLoadingAuth] = useState(true);

    const sparkles = useSparkles(50);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            openAuth();
        } else {
            setIsAuthorized(true);
        }
        setLoadingAuth(false);
    }, [openAuth]);

    if (loadingAuth) {
        return (
            <div className="min-h-screen flex items-center justify-center text-white">
                <p>Checking authentication...</p>
            </div>
        );
    }

    if (!isAuthorized) {
        return (
            <div className="min-h-screen flex items-center justify-center text-white">
                <p>Redirecting to login...</p>
            </div>
        );
    }

    // Icons for services
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

    // Step Navigation
    const handleNextStep = () =>
        currentStep < 3 && setCurrentStep(currentStep + 1);
    const handlePrevStep = () =>
        currentStep > 1 && setCurrentStep(currentStep - 1);

    const handleSubmitBooking = async (paymentDetails = {status: "succeeded", paymentMethod: "credit_card"}) => {
        if (!selectedService || !selectedDate || !selectedTime) return;
        setIsSubmitting(true);

        const booking_id = `LST-${Date.now()}`;
        setBookingId(booking_id);

        const bookingData = {
            serviceId: selectedService.id,
            date: selectedDate,
            time: selectedTime,
            price: selectedService.price ?? 0,
            duration: selectedService.duration ?? 0,
            name: selectedService.name ?? "",
            category: selectedService.category ?? "",
            description: selectedService.description ?? "",
            username: user.username ?? "",
            email: user.email ?? "",
            phone: user.phone ?? "",
            rating: selectedService.rating ?? 0,
            status: "confirmed",
            bookingId:booking_id,
            paymentStatus: paymentDetails.status,
            paymentMethod: paymentDetails.paymentMethod,
        };
        console.log(bookingId);
        try {
            const res = await axios.post("/api/bookings", bookingData);
            if (res.status === 201) {
                setBookingComplete(true);
            } else {
                console.error("Booking failed", bookingId);
            }
        } catch (error) {
            console.error("Error saving booking:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Validation
    const canProceedToNext = () => {
        switch (currentStep) {
            case 1:
                return !!selectedService;
            case 2:
                return !!selectedDate && !!selectedTime;
            case 3:
                return !!paymentInfo;
            default:
                return true;
        }
    };

    // Booking Complete Page
    if (bookingComplete) {
        return (
            <div
                className="min-h-screen w-full bg-gradient-to-br from-slate-900 via-purple-900 to-pink-900 flex items-center justify-center p-4 sm:p-6 relative overflow-hidden">
                <SparklesBackground sparkles={sparkles}/>
                <div
                    className="relative z-10 bg-white/10 backdrop-blur-xl rounded-2xl sm:rounded-3xl border border-white/20 shadow-2xl p-6 sm:p-12 text-center w-full max-w-sm sm:max-w-md">
                    <div
                        className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                        <CheckCircle className="w-8 h-8 sm:w-10 sm:h-10 text-white"/>
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-white mb-3 sm:mb-4">
                        Booking Confirmed!
                    </h1>
                    <p className="text-white/80 text-sm sm:text-base mb-4 sm:mb-6">
                        Your appointment has been successfully booked.
                    </p>
                    <div className="bg-white/10 rounded-xl p-3 sm:p-4 mb-4 sm:mb-6">
                        <p className="text-white/60 text-xs sm:text-sm mb-1">Booking ID</p>
                        <p className="text-white font-mono text-base sm:text-lg">
                            {bookingId || "Saving..."}
                        </p>
                    </div>
                    <button
                        onClick={() => router.back()}
                        className="w-full px-4 py-2 sm:px-6 sm:py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold rounded-full hover:scale-105 transition-all text-sm sm:text-base"
                    >
                        Book Another Appointment
                    </button>
                </div>
            </div>
        );
    }

    const steps = [1, 2, 3];

    return (
        <div
            className="min-h-screen w-full bg-gradient-to-br from-slate-900 via-purple-900 to-pink-900 relative overflow-hidden">
            <SparklesBackground sparkles={sparkles}/>

            {/* Back Button */}
            <button
                onClick={() => router.back()}
                className="absolute top-4 left-4 flex items-center px-3 py-2 md:px-5 md:py-2.5 text-xs md:text-sm text-white/70 hover:text-white transition-all rounded-lg z-50 group"
            >
                <ArrowLeft className="w-4 h-4 md:w-5 md:h-5 group-hover:-translate-x-1 transition-transform"/>
                <span className="ml-2">Back</span>
            </button>

            {/* Header */}
            <div className="relative z-10 text-center pt-20 pb-10 px-4">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-6 leading-tight">
                    <span
                        className="block bg-gradient-to-r from-white via-pink-200 to-purple-200 bg-clip-text text-transparent">
                        Book Your
                    </span>
                    <span
                        className="block bg-gradient-to-r from-pink-300 via-rose-200 to-white bg-clip-text text-transparent">
                        Appointment
                    </span>
                </h1>
                <p className="text-white/70 text-sm sm:text-base lg:text-lg font-light max-w-2xl mx-auto">
                    Experience luxury nail care with our premium services and expert technicians
                </p>
            </div>

            {/* Step Indicator */}
            <div className="relative z-10 flex justify-center mb-10 px-6">
                <div className="bg-white/10 backdrop-blur-xl rounded-full border border-white/20 py-3 px-5 sm:px-8">
                    <div className="flex items-center space-x-4 sm:space-x-8">
                        {steps.map((step, index) => (
                            <React.Fragment key={step}>
                                <StepIndicator
                                    step={step}
                                    active={step === currentStep}
                                    completed={step < currentStep}
                                />
                                {index < steps.length - 1 && (
                                    <div
                                        className={`w-6 sm:w-10 md:w-16 h-0.5 transition-colors ${
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
                        }}
                    >
                        {currentStep === 1 && <ServiceSelection/>}
                        {currentStep === 2 && <DateTimeSelection/>}
                        {currentStep === 3 && (
                            <PaymentInformation
                                autoConfirm
                                onSuccess={async (paymentDetails) => {
                                    setPaymentInfo(paymentDetails);
                                    await handleSubmitBooking(paymentDetails);

                                }}
                            />
                        )}
                    </servicesContext.Provider>

                    {/* Navigation */}
                    {/* Navigation */}
                    <div
                        className="px-4 sm:px-8 py-5 bg-white/5 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4">
                        {/* Previous Button */}
                        {currentStep > 1 && (
                            <button
                                onClick={handlePrevStep}
                                disabled={!canProceedToNext()}
                                className={`flex items-center space-x-2 px-6 py-2 rounded-full font-semibold text-sm transition-all ${
                                    canProceedToNext()
                                        ? "bg-gradient-to-r from-pink-500 to-purple-600 text-white hover:scale-105"
                                        : "bg-gray-600 text-gray-400 cursor-not-allowed"
                                }`}
                            >
                                <ChevronLeft className="w-4 h-4"/>
                                <span>previous</span>
                            </button>

                        )}

                        {/* Next Button */}
                        {currentStep < steps.length && (
                            <button
                                onClick={handleNextStep}
                                disabled={!canProceedToNext()}
                                className={`flex items-center space-x-2 px-6 py-2 rounded-full font-semibold text-sm transition-all ${
                                    canProceedToNext()
                                        ? "bg-gradient-to-r from-pink-500 to-purple-600 text-white hover:scale-105"
                                        : "bg-gray-600 text-gray-400 cursor-not-allowed"
                                }`}
                            >
                                <span>Next</span>
                                <ChevronRight className="w-4 h-4"/>
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookingSystem;