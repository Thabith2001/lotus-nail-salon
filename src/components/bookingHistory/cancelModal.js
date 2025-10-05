"use client";
import React, {useContext, useState, useEffect} from 'react';
import {AlertCircle, X, CheckCircle, Clock, Calendar, CreditCard, XCircle} from "lucide-react";
import {modalContext} from "@/components/bookingHistory/bookingHistoryCard";
import {formatDate, formatTime} from "@/util/timeValidations";
import {useTimezone} from "@/context/TimeZoneContext";
import axios from "axios";

const CancelModal = () => {
    const {cancel, setCancel, data} = useContext(modalContext);
    const {userTimezone} = useTimezone();

    const [cancelReason, setCancelReason] = useState("");
    const [selectedReason, setSelectedReason] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const [refundAmount, setRefundAmount] = useState(0);

    // Predefined cancellation reasons
    const cancellationReasons = [
        "Schedule conflict",
        "Personal emergency",
        "Feeling unwell",
        "Found another service",
        "Price concerns",
        "Other",
    ];

    // Calculate refund based on cancellation policy
    useEffect(() => {
        if (data?.date && data?.amount) {
            const bookingDate = new Date(data.date);
            const today = new Date();
            const daysUntilBooking = Math.ceil((bookingDate - today) / (1000 * 60 * 60 * 24));

            if (daysUntilBooking > 2) {
                setRefundAmount(data.amount);
            } else if (daysUntilBooking >= 1) {
                setRefundAmount(data.amount * 0.5);
            } else {
                setRefundAmount(0);
            }
        }
    }, [data]);

    // Reset form when modal opens
    useEffect(() => {
        if (cancel) {
            setCancelReason("");
            setSelectedReason("");
            setError("");
            setSuccess(false);
        }
    }, [cancel]);

    const newTime = new Date().toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
    });

    const confirmCancel = async () => {
        if (!selectedReason && !cancelReason) {
            setError("Please select or provide a reason for cancellation");
            return;
        }

        setIsLoading(true);
        setError("");

        try {
            const response = await axios.patch(`/api/bookings/${data.id}`, {
                reasons: selectedReason || cancelReason,
                status: "cancelled",
                cancellationDate: new Date().toISOString(),
                time: newTime,
            });

            if (response.status !== 200) throw new Error("Failed to cancel appointment");

            setSuccess(true);

            setTimeout(() => {
                setCancel(false);
                window.location.reload();
            }, 2500);
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || "Failed to cancel appointment. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    if (!cancel) return null;

    return (
        <div
            className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4"
            onClick={() => !success && !isLoading && setCancel(false)}
        >
            <div
                className="bg-gradient-to-br from-slate-900/95 via-red-900/95 to-slate-900/95 backdrop-blur-xl rounded-2xl border border-red-500/30 shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto custom-scrollbar"
                onClick={(e) => e.stopPropagation()}
            >
                {success ? (
                    // Success State
                    <div className="p-8 text-center">
                        <div className="relative w-20 h-20 mx-auto mb-6">
                            <div
                                className="absolute inset-0 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full animate-pulse"></div>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <CheckCircle className="w-12 h-12 text-white" strokeWidth={2.5}/>
                            </div>
                        </div>
                        <h3 className="text-3xl font-bold mb-2 bg-gradient-to-r from-green-300 to-emerald-400 bg-clip-text text-transparent">
                            Cancelled
                        </h3>
                        <p className="text-white/70 mb-6">
                            Your appointment has been cancelled
                        </p>

                        {refundAmount > 0 && (
                            <div className="bg-green-500/10 border border-green-300/20 rounded-xl p-4">
                                <p className="text-green-300 text-sm mb-2">Refund Amount</p>
                                <p className="text-white text-3xl font-bold mb-2">
                                    ${refundAmount.toFixed(2)}
                                </p>
                                <p className="text-white/60 text-xs">
                                    Processed within 5-7 business days
                                </p>
                            </div>
                        )}
                    </div>
                ) : (
                    <>
                        {/* Header */}
                        <div className="p-6 border-b border-red-500/20 bg-gradient-to-r from-red-500/5 to-pink-500/5">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div
                                        className="w-10 h-10 bg-gradient-to-br from-red-500 to-pink-600 rounded-xl flex items-center justify-center">
                                        <XCircle className="w-5 h-5 text-white"/>
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold bg-gradient-to-r from-red-300 to-pink-300 bg-clip-text text-transparent">
                                            Cancel Appointment
                                        </h3>
                                        <p className="text-white/60 text-xs">We&#39;re sorry to see you go</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setCancel(false)}
                                    className="text-white/50 hover:text-white transition-all hover:rotate-90 p-2 hover:bg-white/10 rounded-lg"
                                >
                                    <X className="w-5 h-5"/>
                                </button>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-6 space-y-5">
                            {/* Warning & Appointment Details */}
                            <div className="bg-red-500/10 border border-red-300/20 rounded-xl p-4">
                                <p className="text-red-300 text-sm font-medium mb-3 flex items-center gap-2">
                                    <AlertCircle className="w-4 h-4"/>
                                    Are you sure you want to cancel?
                                </p>

                                <div className="bg-white/5 border border-white/10 rounded-lg p-3 space-y-2">
                                    <p className="text-white font-bold">
                                        {data?.service?.name || data?.plan?.name || "Service"}
                                    </p>
                                    <div className="grid grid-cols-2 gap-2 text-sm">
                                        <div className="flex items-center gap-2">
                                            <Calendar className="w-3 h-3 text-pink-400"/>
                                            <span className="text-white/70 text-xs">
                                                {data?.date ? formatDate(data.date, userTimezone).split(',')[0] : "N/A"}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Clock className="w-3 h-3 text-pink-400"/>
                                            <span className="text-white/70 text-xs">
                                                {data?.time ? formatTime(data.time, userTimezone) : "N/A"}
                                            </span>
                                        </div>
                                    </div>
                                    {data?.amount && (
                                        <div className="flex items-center gap-2 pt-2 border-t border-white/10">
                                            <CreditCard className="w-3 h-3 text-pink-400"/>
                                            <span className="text-pink-300 font-semibold text-sm">
                                                ${Number(data.amount).toFixed(2)}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Refund Information */}
                            {data?.amount && (
                                <div className={`p-4 rounded-xl border ${
                                    refundAmount > 0
                                        ? "bg-green-500/10 border-green-300/20"
                                        : "bg-orange-500/10 border-orange-300/20"
                                }`}>
                                    <p className={`font-semibold mb-1 text-sm ${
                                        refundAmount > 0 ? "text-green-300" : "text-orange-300"
                                    }`}>
                                        Refund Policy
                                    </p>
                                    <p className="text-white/70 text-xs mb-2">
                                        {refundAmount === data.amount
                                            ? "Full refund (cancelled >48hrs ahead)"
                                            : refundAmount > 0
                                                ? "50% refund (cancelled 24-48hrs ahead)"
                                                : "No refund (cancelled <24hrs ahead)"
                                        }
                                    </p>
                                    <p className="text-white font-bold">
                                        Refund: ${refundAmount.toFixed(2)}
                                    </p>
                                </div>
                            )}

                            {/* Cancellation Reason */}
                            <div>
                                <label className="block text-white/80 text-sm font-medium mb-3">
                                    Reason for cancellation *
                                </label>
                                <div className="grid grid-cols-2 gap-2">
                                    {cancellationReasons.map((reason) => (
                                        <button
                                            key={reason}
                                            onClick={() => {
                                                setSelectedReason(reason);
                                                setError("");
                                            }}
                                            className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                                                selectedReason === reason
                                                    ? "bg-gradient-to-r from-red-500 to-pink-600 text-white shadow-lg scale-105"
                                                    : "bg-white/10 border border-white/20 text-white hover:bg-white/20 hover:scale-105"
                                            }`}
                                        >
                                            {reason}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Additional Comments */}
                            <div>
                                <label className="block text-white/80 text-sm font-medium mb-3">
                                    Additional comments (optional)
                                </label>
                                <textarea
                                    value={cancelReason}
                                    onChange={(e) => {
                                        setCancelReason(e.target.value);
                                        setError("");
                                    }}
                                    placeholder="Tell us more about why you're cancelling..."
                                    rows={3}
                                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 text-sm focus:outline-none focus:border-red-400 focus:ring-2 focus:ring-red-400/20 transition-all resize-none custom-scrollbar"
                                />
                            </div>

                            {/* Error Message */}
                            {error && (
                                <div
                                    className="p-4 bg-red-500/10 border border-red-400/30 rounded-xl flex items-start gap-3">
                                    <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0"/>
                                    <p className="text-red-300 text-sm">{error}</p>
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="p-6 pt-0">
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setCancel(false)}
                                    disabled={isLoading}
                                    className="flex-1 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
                                >
                                    Keep Appointment
                                </button>
                                <button
                                    onClick={confirmCancel}
                                    disabled={isLoading}
                                    className="flex-1 px-6 py-3 bg-gradient-to-r from-red-500 to-pink-600 text-white font-bold rounded-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isLoading ? (
                                        <span className="flex items-center justify-center gap-2">
                                            <div
                                                className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                            Cancelling...
                                        </span>
                                    ) : (
                                        "Confirm Cancel"
                                    )}
                                </button>
                            </div>
                            <p className="text-white/50 text-xs text-center mt-3">
                                Confirmation will be sent to your email
                            </p>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default CancelModal;