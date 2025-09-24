'use client';

import React, { useContext, useEffect, useState } from "react";
import { useStripe, useElements, PaymentElement } from "@stripe/react-stripe-js";
import axios from "axios";
import { paymentContext } from "@/app/billing/[...slug]/page";
import { servicesContext } from "@/app/booking/page";

const CheckOut = ({ onPaymentResult }) => {
    const paymentDetails = useContext(paymentContext);
    const { handleSubmitBooking } = useContext(servicesContext);

    const amount = paymentDetails?.price ?? 0;

    const stripe = useStripe();
    const elements = useElements();

    const [clientSecret, setClientSecret] = useState("");
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [success, setSuccess] = useState(false);
    const [customerEmail, setCustomerEmail] = useState("");

    useEffect(() => {
        const fetchClientSecret = async () => {
            try {
                const { data } = await axios.post("/api/create-payment-intent", { amount });
                setClientSecret(data.clientSecret);
            } catch (error) {
                setErrorMessage("Failed to initialize payment.");
            }
        };

        if (amount > 0) fetchClientSecret();
    }, [amount]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!stripe || !elements || !clientSecret) return;

        setLoading(true);
        setErrorMessage("");

        try {
            const { error: submitError } = await elements.submit();
            if (submitError) {
                setErrorMessage(submitError.message);
                setLoading(false);
                onPaymentResult?.("failed", submitError.message);
                return;
            }

            const { error, paymentIntent } = await stripe.confirmPayment({
                elements,
                clientSecret,
                confirmParams: {
                    return_url: `${window.location.origin}/payment-success`,
                    receipt_email: customerEmail,
                },
                redirect: "if_required",
            });

            if (error) {
                setErrorMessage(error.message);
                onPaymentResult?.("failed", error.message);
            } else if (paymentIntent?.status === "succeeded") {
                setSuccess(true);
                onPaymentResult?.("success", paymentIntent);


                handleSubmitBooking();
            } else {
                onPaymentResult?.("pending", paymentIntent?.status);
            }
        } catch (err) {
            setErrorMessage(err.message);
            onPaymentResult?.("failed", err.message);
        }

        setLoading(false);
    };

    const handlePaymentElementChange = (event) => {
        if (event.value?.billingDetails?.email) {
            setCustomerEmail(event.value.billingDetails.email);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col w-auto">
            {clientSecret ? (
                <PaymentElement
                    options={{ layout: "tabs" }}
                    onChange={handlePaymentElementChange}
                    className="mb-4"
                />
            ) : (
                <p>Loading payment...</p>
            )}

            {customerEmail && (
                <p className="text-white/70 mb-2">
                    Email detected: <span className="font-semibold">{customerEmail}</span>
                </p>
            )}

            {errorMessage && <p className="text-red-500 mb-2">{errorMessage}</p>}

            <button
                type="submit"
                disabled={!stripe || !clientSecret || loading}
                className="bg-black text-white text-xl font-bold px-6 py-2 rounded disabled:opacity-50"
            >
                {loading ? "Processing..." : `Pay $${amount}`}
            </button>
        </form>
    );
};

export default CheckOut;
