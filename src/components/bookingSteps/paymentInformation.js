import React, { useContext } from 'react';
import { CreditCard, Shield, User } from "lucide-react";
import { servicesContext } from "@/app/booking/page";

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
                <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">
                        <CreditCard className="w-4 h-4 inline mr-2" />
                        Card Number *
                    </label>
                    <input
                        type="text"
                        value={paymentInfo.cardNumber}
                        onChange={(e) => setPaymentInfo({ ...paymentInfo, cardNumber: e.target.value })}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:border-pink-400 focus:ring-2 focus:ring-pink-400/20 transition-all"
                        placeholder="1234 5678 9012 3456"
                        maxLength="19"
                    />
                </div>

                <div className="grid grid-cols-2 gap-6">
                    <div>
                        <label className="block text-white/80 text-sm font-medium mb-2">Expiry Date *</label>
                        <input
                            type="text"
                            value={paymentInfo.expiryDate}
                            onChange={(e) => setPaymentInfo({ ...paymentInfo, expiryDate: e.target.value })}
                            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:border-pink-400 focus:ring-2 focus:ring-pink-400/20 transition-all"
                            placeholder="MM/YY"
                            maxLength="5"
                        />
                    </div>

                    <div>
                        <label className="block text-white/80 text-sm font-medium mb-2">CVV *</label>
                        <input
                            type="password"
                            value={paymentInfo.cvv}
                            onChange={(e) => setPaymentInfo({ ...paymentInfo, cvv: e.target.value })}
                            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:border-pink-400 focus:ring-2 focus:ring-pink-400/20 transition-all"
                            placeholder="123"
                            maxLength="4"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">
                        <User className="w-4 h-4 inline mr-2" />
                        Cardholder Name *
                    </label>
                    <input
                        type="text"
                        value={paymentInfo.cardName}
                        onChange={(e) => setPaymentInfo({ ...paymentInfo, cardName: e.target.value })}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:border-pink-400 focus:ring-2 focus:ring-pink-400/20 transition-all"
                        placeholder="Name as it appears on card"
                    />
                </div>

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