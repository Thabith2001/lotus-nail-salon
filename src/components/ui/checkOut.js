'use client';

import React, { useContext, useEffect, useState } from "react";
import { useStripe, useElements, PaymentElement } from "@stripe/react-stripe-js";
import axios from "axios";
import { paymentContext } from "@/components/bookingSteps/paymentInformation";

const CheckOut = ({ onPaymentResult }) => {
    const paymentDetails = useContext(paymentContext);

    // Get amount from payment details with fallback
    const amount = paymentDetails?.price ?? 0;
    const itemName = paymentDetails?.name ?? "Service";
    const itemType = paymentDetails?.type ?? "service";

    const stripe = useStripe();
    const elements = useElements();

    const [clientSecret, setClientSecret] = useState("");
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [success, setSuccess] = useState(false);
    const [customerEmail, setCustomerEmail] = useState("");

    useEffect(() => {
        const fetchClientSecret = async () => {
            if (amount <= 0) {
                setErrorMessage("Invalid payment amount.");
                return;
            }

            try {
                const { data } = await axios.post("/api/create-payment-intent", {
                    amount,
                    metadata: {
                        item_name: itemName,
                        item_type: itemType,
                        timestamp: new Date().toISOString()
                    }
                });

                if (data.clientSecret) {
                    setClientSecret(data.clientSecret);
                    setErrorMessage(""); // Clear any previous errors
                } else {
                    setErrorMessage("Failed to initialize payment.");
                }
            } catch (error) {
                console.error("Payment initialization error:", error);
                setErrorMessage(
                    error.response?.data?.error ||
                    "Failed to initialize payment. Please try again."
                );
            }
        };

        fetchClientSecret();
    }, [amount, itemName, itemType]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!stripe || !elements) {
            setErrorMessage("Stripe is not ready. Please wait and try again.");
            return;
        }

        if (!clientSecret) {
            setErrorMessage("Payment not initialized. Please refresh and try again.");
            return;
        }

        setLoading(true);
        setErrorMessage("");

        try {
            // Submit payment element data
            const { error: submitError } = await elements.submit();
            if (submitError) {
                setErrorMessage(submitError.message);
                setLoading(false);
                onPaymentResult?.("failed", {
                    error: submitError.message,
                    code: submitError.code
                });
                return;
            }

            // Confirm payment
            const { error, paymentIntent } = await stripe.confirmPayment({
                elements,
                clientSecret,
                confirmParams: {
                    return_url: `${window.location.origin}/payment-success`,
                    receipt_email: customerEmail || undefined,
                },
                redirect: "if_required",
            });

            if (error) {
                console.error("Payment confirmation error:", error);
                setErrorMessage(error.message || "Payment failed. Please try again.");
                onPaymentResult?.("failed", {
                    error: error.message,
                    code: error.code,
                    paymentIntent: error.payment_intent
                });
            } else if (paymentIntent?.status === "succeeded") {
                setSuccess(true);
                setErrorMessage("");

                // Call success callback with payment details
                onPaymentResult?.("success", {
                    paymentIntentId: paymentIntent.id,
                    amount: paymentIntent.amount / 100, // Convert from cents
                    status: paymentIntent.status,
                    paymentMethod: "card",
                    customerEmail: customerEmail,
                    timestamp: new Date().toISOString(),
                    itemName,
                    itemType
                });
            } else {
                // Handle other statuses (requires_action, processing, etc.)
                const statusMessage = getStatusMessage(paymentIntent?.status);
                setErrorMessage(statusMessage);
                onPaymentResult?.("pending", {
                    status: paymentIntent?.status,
                    paymentIntentId: paymentIntent?.id,
                    message: statusMessage
                });
            }
        } catch (err) {
            console.error("Payment processing error:", err);
            const errorMsg = err.message || "An unexpected error occurred. Please try again.";
            setErrorMessage(errorMsg);
            onPaymentResult?.("failed", {
                error: errorMsg,
                originalError: err
            });
        }

        setLoading(false);
    };

    const getStatusMessage = (status) => {
        switch (status) {
            case "requires_action":
                return "Payment requires additional authentication.";
            case "requires_confirmation":
                return "Payment requires confirmation.";
            case "processing":
                return "Payment is being processed...";
            case "requires_payment_method":
                return "Please provide a valid payment method.";
            case "canceled":
                return "Payment was canceled.";
            default:
                return `Payment status: ${status}`;
        }
    };

    const handlePaymentElementChange = (event) => {
        // Extract email from payment element if available
        if (event.value?.billingDetails?.email) {
            setCustomerEmail(event.value.billingDetails.email);
        }

        // Clear error message when user starts typing
        if (event.complete && errorMessage) {
            setErrorMessage("");
        }
    };

    // Don't render if amount is invalid
    if (amount <= 0) {
        return (
            <div className="text-center p-6">
                <p className="text-red-400 mb-4">Invalid payment amount: ${amount}</p>
                <p className="text-white/70 text-sm">Please go back and select a valid item.</p>
            </div>
        );
    }

    return (
        <div className="w-full max-w-2xl mx-auto">
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Payment Element */}
                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                    {clientSecret ? (
                        <PaymentElement
                            options={{
                                layout: "tabs",
                                paymentMethodOrder: ['card', 'apple_pay', 'google_pay']
                            }}
                            onChange={handlePaymentElementChange}
                        />
                    ) : (
                        <div className="text-center py-8">
                            <div className="animate-pulse">
                                <div className="h-4 bg-white/20 rounded w-3/4 mx-auto mb-2"></div>
                                <div className="h-4 bg-white/20 rounded w-1/2 mx-auto"></div>
                            </div>
                            <p className="text-white/70 mt-4">Initializing payment...</p>
                        </div>
                    )}
                </div>

                {/* Customer Email Display */}
                {customerEmail && (
                    <div className="bg-blue-500/10 rounded-lg p-3 border border-blue-400/20">
                        <p className="text-blue-200 text-sm">
                            Receipt will be sent to:
                            <span className="font-semibold ml-1">{customerEmail}</span>
                        </p>
                    </div>
                )}

                {/* Error Message */}
                {errorMessage && (
                    <div className="bg-red-500/10 rounded-lg p-3 border border-red-400/20">
                        <p className="text-red-300 text-sm">{errorMessage}</p>
                    </div>
                )}

                {/* Success Message */}
                {success && (
                    <div className="bg-green-500/10 rounded-lg p-3 border border-green-400/20">
                        <p className="text-green-300 text-sm font-medium">
                            Payment successful! Processing your {itemType}...
                        </p>
                    </div>
                )}

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={!stripe || !clientSecret || loading || success}
                    className={`w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-300 ${
                        !stripe || !clientSecret || loading || success
                            ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                            : "bg-black text-white hover:scale-105 hover:shadow-lg"
                    }`}
                >
                    {loading ? (
                        <div className="flex items-center justify-center space-x-2">
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            <span>Processing...</span>
                        </div>
                    ) : success ? (
                        "Payment Successful!"
                    ) : (
                        `Pay $${amount.toFixed(2)}`
                    )}
                </button>

                {/* Loading State Info */}
                {loading && (
                    <div className="text-center">
                        <p className="text-white/70 text-sm">
                            Please don&#39;t close this window or refresh the page.
                        </p>
                    </div>
                )}
            </form>

            {/* Payment Security Info */}
            <div className="mt-6 text-center">
                <p className="text-white/50 text-xs">
                    Payments are processed securely by Stripe. Your card information is never stored on our servers.
                </p>
            </div>
        </div>
    );
};

export default CheckOut;