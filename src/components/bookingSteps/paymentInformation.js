import React, { createContext, useContext } from "react";
import { Shield } from "lucide-react";
import { servicesContext } from "@/app/booking/page";
import convertToSubCurrency from "@/lib/convertToSubCurrency";
import CheckOut from "@/components/ui/checkOut";
import { Elements } from "@stripe/react-stripe-js";
import toast from "react-hot-toast";
import { loadStripe } from "@stripe/stripe-js";

export const paymentContext = createContext();

const PaymentInformation = ({ autoConfirm, onSuccess }) => {
    const {
        selectedService,
        selectedTime,
        selectedDate,
        setPaymentInfo,
        sharedData,
        hasSharedData,
    } = useContext(servicesContext);

    // Determine what we're paying for
    const getPaymentItem = () => {
        if (hasSharedData) {
            return {
                name: sharedData.name,
                price: sharedData.price || sharedData.monthlyPrice || 0,
                type: sharedData.type,
                description: sharedData.description,
                duration: sharedData.duration,
                services: sharedData.services,
            };
        } else if (selectedService) {
            return {
                name: selectedService.name,
                price: selectedService.price || 0,
                type: "service",
                description: selectedService.description,
                duration: selectedService.duration,
            };
        }
        return null;
    };

    const paymentItem = getPaymentItem();
    if (!paymentItem) {
        return (
            <div className="p-8 text-center">
                <p className="text-white">
                    {hasSharedData
                        ? "Payment information not available."
                        : "Please select a service first."}
                </p>
            </div>
        );
    }

    const stripePromise = loadStripe(
        process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
    );

    const paymentDetails = {
        price: paymentItem.price,
        name: paymentItem.name,
        type: paymentItem.type,
        subscription: paymentItem.subscription || false,
    };

    const formatDate = (dateString) => {
        try {
            return new Date(dateString).toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
            });
        } catch (error) {
            return dateString;
        }
    };

    const formatTime = (timeString) => {
        try {
            return new Date(`2024-01-01T${timeString}`).toLocaleTimeString("en-US", {
                hour: "numeric",
                minute: "2-digit",
                hour12: true,
            });
        } catch (error) {
            return timeString;
        }
    };

    return (
        <div className="p-8">
            <h2 className="text-3xl font-bold text-white mb-8 text-center">
                {hasSharedData
                    ? `Complete ${sharedData.subscription} Purchase`
                    : "Payment Details"}
            </h2>

            {/* Booking Summary */}
            <div className="bg-white/10 rounded-xl p-6 mb-8">
                <h3 className="text-xl font-bold text-white mb-4">
                    {hasSharedData ? "Purchase Summary" : "Booking Summary"}
                </h3>
                <div className="space-y-3">
                    <div className="flex justify-between items-center">
            <span className="text-white/80">
              {hasSharedData ? `${sharedData.subscription}` : "Service:"}
            </span>
                        <span className="text-white font-semibold">{paymentItem.name}</span>
                    </div>

                    {paymentItem.description && (
                        <div className="flex justify-between items-start">
                            <span className="text-white/80">Description:</span>
                            <span className="text-white/80 text-sm text-right max-w-xs">
                {paymentItem.description}
              </span>
                        </div>
                    )}

                    {paymentItem.services && paymentItem.services.length > 0 && (
                        <div className="flex justify-between items-start">
                            <span className="text-white/80">Includes:</span>
                            <div className="text-right">
                                {paymentItem.services.map((service, idx) => (
                                    <div key={idx} className="text-white/80 text-sm">
                                        {service}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {paymentItem.duration && (
                        <div className="flex justify-between items-center">
                            <span className="text-white/80">Duration:</span>
                            <span className="text-white font-semibold">
                {paymentItem.duration} min
              </span>
                        </div>
                    )}

                    {selectedDate && (
                        <div className="flex justify-between items-center">
                            <span className="text-white/80">Date:</span>
                            <span className="text-white font-semibold">
                {formatDate(selectedDate)}
              </span>
                        </div>
                    )}

                    {selectedTime && (
                        <div className="flex justify-between items-center">
                            <span className="text-white/80">Time:</span>
                            <span className="text-white font-semibold">
                {formatTime(selectedTime)}
              </span>
                        </div>
                    )}

                    {/* Original price and savings for shared data */}
                    {hasSharedData &&
                        sharedData.originalPrice &&
                        sharedData.originalPrice > paymentItem.price && (
                            <>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-white/60">Original Price:</span>
                                    <span className="text-white/60 line-through">
                    ${sharedData.originalPrice}
                  </span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-green-400">You Save:</span>
                                    <span className="text-green-400 font-semibold">
                    ${sharedData.originalPrice - paymentItem.price}
                  </span>
                                </div>
                            </>
                        )}

                    <div className="border-t border-white/20 pt-3 mt-3">
                        <div className="flex justify-between items-center">
                            <span className="text-xl font-bold text-white">Total:</span>
                            <span className="text-2xl font-bold text-white">
                ${paymentItem.price}
              </span>
                        </div>
                        {hasSharedData && paymentItem.type === "membership" && (
                            <div className="text-right">
                                <span className="text-white/60 text-sm">per month</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Payment Form */}
            <div className="max-w-2xl mx-auto space-y-6">
                <Elements
                    stripe={stripePromise}
                    options={{
                        mode: "payment",
                        amount: convertToSubCurrency(paymentItem.price),
                        currency: "usd",
                        appearance: {
                            theme: "night",
                            variables: {
                                colorPrimary: "#ec4899",
                                colorBackground: "rgba(255, 255, 255, 0.05)",
                                colorText: "#ffffff",
                                colorDanger: "#ef4444",
                                fontFamily: "Inter, system-ui, sans-serif",
                                spacingUnit: "4px",
                                borderRadius: "12px",
                            },
                        },
                    }}
                >
                    <paymentContext.Provider value={paymentDetails}>
                        <CheckOut
                            onPaymentResult={(status, data) => {
                                if (status === "success") {
                                    const paymentInfo = {
                                        status: "completed",
                                        paymentMethod: "card",
                                        id: data.paymentIntentId || `payment_${Date.now()}`,
                                        amount: paymentItem.price,
                                        ...data,
                                    };

                                    setPaymentInfo(paymentInfo);

                                    // ✅ Only call onSuccess once
                                    if (onSuccess) {
                                        onSuccess(paymentInfo);
                                    }

                                    toast.success(
                                        hasSharedData
                                            ? `Your purchase of ${paymentItem.name} was successful!`
                                            : "Payment successful!",
                                        {
                                            duration: 5000,
                                            position: "top-center",
                                            style: { background: "#10b981", color: "#fff" },
                                        }
                                    );
                                } else {
                                    toast.error("Payment Failed", {
                                        duration: 5000,
                                        position: "top-center",
                                        style: { background: "#ef4444", color: "#fff" },
                                    });
                                }
                            }}
                        />
                    </paymentContext.Provider>
                </Elements>

                <div className="flex items-center space-x-3 p-4 bg-blue-500/10 rounded-xl border border-blue-400/20">
                    <Shield className="w-6 h-6 text-blue-400" />
                    <p className="text-blue-200 text-sm">
                        Your payment information is secure and encrypted. We never store
                        your card details.
                    </p>
                </div>

                {/* Additional info for shared data purchases */}
                {hasSharedData && (
                    <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                        <div className="text-center">
                            <h4 className="text-white font-semibold mb-2">
                                What happens next?
                            </h4>
                            <p className="text-white/70 text-sm">
                                {paymentItem.type === "membership"
                                    ? "After payment, your membership will be activated and you can start booking appointments with your included sessions."
                                    : "After payment, your package will be available and you can book your appointment immediately."}
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PaymentInformation;