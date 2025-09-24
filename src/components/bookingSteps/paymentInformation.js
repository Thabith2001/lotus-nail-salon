import React, { useContext } from 'react';
import { CreditCard, Shield, User } from "lucide-react";
import { servicesContext } from "@/app/booking/page";
import convertToSubCurrency from "@/lib/convertToSubCurrency";
import CheckOut from "@/components/ui/checkOut";
import {Elements} from "@stripe/react-stripe-js";
import {paymentContext, stripePromise} from "@/app/billing/[...slug]/page";
import toast from "react-hot-toast";

const PaymentInformation = () => {
    const { selectedService, selectedTime, selectedDate, paymentInfo, setPaymentInfo } = useContext(servicesContext);

    const formatTime = (timeString) => {
        if (!timeString) return '';
        return new Date(`2024-01-01T${timeString}`).toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'long',
            day: 'numeric'
        });
    };

    if (!selectedService) {
        return <p className="text-white text-center p-8">Please select a service first.</p>;
    }

    return (
        <div className="p-8">
            <h2 className="text-3xl font-bold text-white mb-8 text-center">Payment Details</h2>

            {/* Booking Summary */}
            <div className="bg-white/10 rounded-xl p-6 mb-8">
                <h3 className="text-xl font-bold text-white mb-4">Booking Summary</h3>
                <div className="space-y-3">
                    <div className="flex justify-between items-center">
                        <span className="text-white/80">Service:</span>
                        <span className="text-white font-semibold">{selectedService.name}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-white/80">Date:</span>
                        <span className="text-white font-semibold">{formatDate(selectedDate)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-white/80">Time:</span>
                        <span className="text-white font-semibold">{formatTime(selectedTime)}</span>
                    </div>
                    <div className="border-t border-white/20 pt-3 mt-3">
                        <div className="flex justify-between items-center">
                            <span className="text-xl font-bold text-white">Total:</span>
                            <span className="text-2xl font-bold text-white">${selectedService.price}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Payment Form */}
            <div className="max-w-2xl mx-auto space-y-6">
                <Elements
                    stripe={stripePromise}
                    options={{
                        mode: "payment",
                        amount: convertToSubCurrency(selectedService.price ?? 0),
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
                    <paymentContext.Provider value={selectedService}>
                        <CheckOut

                            onPaymentResult={(status, data) => {
                                if (status ==="success") {
                                    setPaymentInfo(data)
                                }else{
                                    toast.error("Payment Failed"
                                    ,{
                                        duration: 5000,
                                        position: "top-center",
                                        style: {
                                            background: "#333",
                                            color: "#fff",
                                        },
                                    })
                                }
                            }}
                        />
                    </paymentContext.Provider>

                </Elements>
                <div className="flex items-center space-x-3 p-4 bg-blue-500/10 rounded-xl border border-blue-400/20">
                    <Shield className="w-6 h-6 text-blue-400" />
                    <p className="text-blue-200 text-sm">
                        Your payment information is secure and encrypted. We never store your card details.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default PaymentInformation;