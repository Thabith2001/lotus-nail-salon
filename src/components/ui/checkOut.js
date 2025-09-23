'use client';

import React, {useContext, useEffect, useState} from "react";
import {useStripe, useElements, PaymentElement} from "@stripe/react-stripe-js";
import axios from "axios";
import {paymentContext} from "@/app/billing/[...slug]/page";

const CheckOut = () => {

    const paymentDetails = useContext(paymentContext);
    const amount = paymentDetails?.price ?? 0;

    const stripe = useStripe();
    const elements = useElements();

    const [clientSecret, setClientSecret] = useState("");
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        const fetchClientSecret = async () => {
            try {
                const {data} = await axios.post("/api/create-payment-intent", {amount});
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
            //  First, submit the PaymentElement
            const {error: submitError} = await elements.submit();
            if (submitError) {
                setErrorMessage(submitError.message);
                setLoading(false);
                return;
            }

            //  Then confirm the payment
            const {error, paymentIntent} = await stripe.confirmPayment({
                elements,
                clientSecret,
                confirmParams: {
                    return_url: `${window.location.origin}/payment-success`,
                },
                redirect: "if_required",
            });

            if (error) setErrorMessage(error.message);
            else if (paymentIntent && paymentIntent.status === "succeeded") setSuccess(true);

        } catch (err) {
            setErrorMessage(err.message);
        }

        setLoading(false);
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col w-full p-4">

            {clientSecret ? <PaymentElement className="mb-4"/> : <p>Loading payment...</p>}

            {errorMessage && <p className="text-red-500 mb-2">{errorMessage}</p>}
            {success && <p className="text-green-500 mb-2">Payment successful 🎉</p>}

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