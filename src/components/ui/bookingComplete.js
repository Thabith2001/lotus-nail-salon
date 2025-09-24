"use client"
import React, {useContext} from 'react';
import {CheckCircle} from "lucide-react";
import {bookingContext, SparklesBackground} from "@/app/booking/page";
import {useSparkles} from "@/hooks/useSparkles";
import {useRouter} from "next/navigation";

const BookingComplete = () => {
    const router = useRouter();
    const {bookingId ,SparklesBackground} = useContext(bookingContext);
    const sparkles = useSparkles(50);
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

};

export default BookingComplete;
