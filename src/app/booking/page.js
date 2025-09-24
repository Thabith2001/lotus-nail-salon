"use client";
import React, { useState, createContext, useEffect } from "react";
import {
    Clock,
    Phone,
    Check,
    ChevronRight,
    ChevronLeft,
    Heart,
    Sparkles,
    Gift,
    Crown,
    Brush,
    Palette,
    MapPin,
    CheckCircle,
    ArrowLeft,
} from "lucide-react";
import { useSparkles } from "@/hooks/useSparkles";
import ServiceSelection from "@/components/bookingSteps/serviceSelection";
import DateTimeSelection from "@/components/bookingSteps/dateTimeSelection";
import CustomerInformation from "@/components/bookingSteps/customerInfomation";
import PaymentInformation from "@/components/bookingSteps/paymentInformation";
import { useRouter } from "next/navigation";
import { useAuthModal } from "@/context/authModelContext";

// Context
export const servicesContext = createContext(null);

// Step Indicator Component
const StepIndicator = ({ step, active, completed }) => (
    <div
        className={`flex items-center justify-center w-8 h-8 sm:w-12 sm:h-12 rounded-full border-2 text-sm sm:text-base transition-all duration-300 ${
            completed
                ? "bg-gradient-to-r from-green-400 to-emerald-500 border-transparent text-white"
                : active
                    ? "bg-gradient-to-r from-pink-500 to-purple-600 border-transparent text-white"
                    : "border-white/30 text-white/60"
        }`}
    >
        {completed ? <Check className="w-5 h-5 sm:w-6 sm:h-6" /> : step}
    </div>
);

// Sparkles Background Component
const SparklesBackground = ({ sparkles }) => (
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
    const { openAuth } = useAuthModal();
    const router = useRouter();

    // Booking State
    const [currentStep, setCurrentStep] = useState(1);
    const [selectedService, setSelectedService] = useState(null);
    const [selectedDate, setSelectedDate] = useState("");
    const [selectedTime, setSelectedTime] = useState("");
    const [customerInfo, setCustomerInfo] = useState({
        name: "",
        email: "",
        phone: "",
        notes: "",
    });
    const [paymentInfo, setPaymentInfo] = useState({
        cardNumber: "",
        expiryDate: "",
        cvv: "",
        cardName: "",
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [bookingComplete, setBookingComplete] = useState(false);
    const [bookingId, setBookingId] = useState("");
    const [isAuthorized, setIsAuthorized] = useState(false);

    // Sparkles Hook
    const sparkles = useSparkles(50);

    // Auth check
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            openAuth();
        } else {
            setIsAuthorized(true);
        }
    }, [openAuth]);

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

    // Step Navigation
    const handleNextStep = () =>
        currentStep < 4 && setCurrentStep(currentStep + 1);
    const handlePrevStep = () =>
        currentStep > 1 && setCurrentStep(currentStep - 1);

    // Booking Submission
    const handleSubmitBooking = () => {
        setIsSubmitting(true);
        setTimeout(() => {
            setBookingId(`LSP-${Date.now()}`);
            setBookingComplete(true);
            setIsSubmitting(false);
        }, 2000);
    };

    // Validation
    const canProceedToNext = () => {
        switch (currentStep) {
            case 1:
                return selectedService !== null;
            case 2:
                return selectedDate && selectedTime;
            case 3:
                return (
                    customerInfo.name && customerInfo.email && customerInfo.phone
                );
            case 4:
                return (
                    paymentInfo.cardNumber &&
                    paymentInfo.expiryDate &&
                    paymentInfo.cvv &&
                    paymentInfo.cardName
                );
            default:
                return true;
        }
    };

    // Booking Complete Page
    if (bookingComplete) {
        return (
            <div className="min-h-screen w-full bg-gradient-to-br from-slate-900 via-purple-900 to-pink-900 flex items-center justify-center p-4 sm:p-6 relative overflow-hidden">
                <SparklesBackground sparkles={sparkles} />

                <div className="relative z-10 bg-white/10 backdrop-blur-xl rounded-2xl sm:rounded-3xl border border-white/20 shadow-2xl p-6 sm:p-12 text-center w-full max-w-sm sm:max-w-md">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                        <CheckCircle className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
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
                            {bookingId}
                        </p>
                    </div>
                    <button
                        onClick={() => window.location.reload()}
                        className="w-full px-4 py-2 sm:px-6 sm:py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold rounded-full hover:scale-105 transition-all text-sm sm:text-base"
                    >
                        Book Another Appointment
                    </button>
                </div>
            </div>
        );
    }

    // Main Booking Page
    return (
        <div className="min-h-screen w-full bg-gradient-to-br from-slate-900 via-purple-900 to-pink-900 relative overflow-hidden">
            <SparklesBackground sparkles={sparkles} />

            {/* Back Button */}
            <button
                onClick={() => router.back()}
                className="absolute top-3 left-3 sm:top-4 sm:left-4 flex items-center border border-gray-400 px-3 py-2 sm:px-6 sm:py-3 text-xs sm:text-sm text-white/70 hover:text-white hover:border-white transition-colors duration-300 group rounded-lg z-50"
            >
                <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 group-hover:-translate-x-1 transition-transform duration-300" />
                <span className="ml-1 sm:ml-2">Back</span>
            </button>

            {/* Header */}
            <div className="relative z-10 text-center pt-16 sm:pt-20 pb-6 sm:pb-8">
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-3 sm:mb-4">
                    Book Your{" "}
                    <span className="bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
            Appointment
          </span>
                </h1>
                <p className="text-white/70 text-sm sm:text-lg max-w-md sm:max-w-2xl mx-auto px-4">
                    Experience luxury nail care with our premium services and expert
                    technicians
                </p>
            </div>

            {/* Step Indicator */}
            <div className="relative z-10 flex justify-center mb-8 sm:mb-12 px-4">
                <div className="bg-white/10 backdrop-blur-xl rounded-full border border-white/20 p-3 sm:p-6">
                    <div className="flex items-center space-x-4 sm:space-x-8">
                        {[1, 2, 3, 4].map((step, index) => (
                            <React.Fragment key={step}>
                                <StepIndicator
                                    step={step}
                                    active={step === currentStep}
                                    completed={step < currentStep}
                                />
                                {index < 3 && (
                                    <div
                                        className={`w-8 sm:w-12 h-0.5 transition-colors duration-300 ${
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

            {/* Booking Steps */}
            <div className="relative z-10 max-w-md sm:max-w-4xl mx-auto px-4 sm:px-6 pb-12">
                <div className="bg-white/5 backdrop-blur-xl rounded-2xl sm:rounded-3xl border border-white/10 shadow-2xl overflow-hidden">
                    <servicesContext.Provider
                        value={{
                            selectedService,
                            setSelectedService,
                            selectedDate,
                            setSelectedDate,
                            selectedTime,
                            setSelectedTime,
                            customerInfo,
                            setCustomerInfo,
                            paymentInfo,
                            setPaymentInfo,
                            getServiceIcon,
                        }}
                    >
                        {currentStep === 1 && <ServiceSelection />}
                        {currentStep === 2 && <DateTimeSelection />}
                        {currentStep === 3 && <CustomerInformation />}
                        {currentStep === 4 && <PaymentInformation />}
                    </servicesContext.Provider>

                    {/* Navigation Buttons */}
                    <div className="px-4 sm:px-8 py-4 sm:py-6 bg-white/5 border-t border-white/10">
                        <div className="flex justify-between items-center">
                            <button
                                onClick={handlePrevStep}
                                disabled={currentStep === 1}
                                className={`flex items-center space-x-1 sm:space-x-2 px-4 sm:px-6 py-2 sm:py-3 rounded-full font-semibold text-xs sm:text-sm transition-all ${
                                    currentStep === 1
                                        ? "text-white/40 cursor-not-allowed"
                                        : "text-white hover:bg-white/10"
                                }`}
                            >
                                <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                                <span>Previous</span>
                            </button>

                            {currentStep === 4 ? (
                                <button
                                    onClick={handleSubmitBooking}
                                    disabled={!canProceedToNext() || isSubmitting}
                                    className={`flex items-center space-x-1 sm:space-x-2 px-6 sm:px-8 py-2 sm:py-3 rounded-full font-semibold text-xs sm:text-sm transition-all ${
                                        canProceedToNext() && !isSubmitting
                                            ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:scale-105"
                                            : "bg-gray-600 text-gray-400 cursor-not-allowed"
                                    }`}
                                >
                                    {isSubmitting ? (
                                        <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    ) : (
                                        <span>Complete Booking</span>
                                    )}
                                    {!isSubmitting && (
                                        <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                                    )}
                                </button>
                            ) : (
                                <button
                                    onClick={handleNextStep}
                                    disabled={!canProceedToNext()}
                                    className={`flex items-center space-x-1 sm:space-x-2 px-6 sm:px-8 py-2 sm:py-3 rounded-full font-semibold text-xs sm:text-sm transition-all ${
                                        canProceedToNext()
                                            ? "bg-gradient-to-r from-pink-500 to-purple-600 text-white hover:scale-105"
                                            : "bg-gray-600 text-gray-400 cursor-not-allowed"
                                    }`}
                                >
                                    <span>Next</span>
                                    <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="relative z-10 text-center py-6 sm:py-8 px-4">
                <div className="max-w-md sm:max-w-4xl mx-auto">
                    <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-4 sm:p-6">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 text-center">
                            <div className="flex flex-col items-center space-y-1 sm:space-y-2">
                                <MapPin className="w-6 h-6 sm:w-8 sm:h-8 text-pink-400" />
                                <div>
                                    <h3 className="text-white font-semibold text-sm sm:text-base">
                                        Location
                                    </h3>
                                    <p className="text-white/60 text-xs sm:text-sm">
                                        123 Beauty Lane
                                        <br />
                                        Luxury City, LC 12345
                                    </p>
                                </div>
                            </div>
                            <div className="flex flex-col items-center space-y-1 sm:space-y-2">
                                <Clock className="w-6 h-6 sm:w-8 sm:h-8 text-blue-400" />
                                <div>
                                    <h3 className="text-white font-semibold text-sm sm:text-base">
                                        Hours
                                    </h3>
                                    <p className="text-white/60 text-xs sm:text-sm">
                                        Mon-Sat: 9AM-6PM
                                        <br />
                                        Sunday: 10AM-5PM
                                    </p>
                                </div>
                            </div>
                            <div className="flex flex-col items-center space-y-1 sm:space-y-2">
                                <Phone className="w-6 h-6 sm:w-8 sm:h-8 text-green-400" />
                                <div>
                                    <h3 className="text-white font-semibold text-sm sm:text-base">
                                        Contact
                                    </h3>
                                    <p className="text-white/60 text-xs sm:text-sm">
                                        (555) 123-NAILS
                                        <br />
                                        info@lotusSalon.com
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookingSystem;