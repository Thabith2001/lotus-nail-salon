"use client";
import React, {useContext, useState, useEffect} from "react";
import {modalContext} from "@/components/bookingHistory/bookingHistoryCard";
import {
    CalendarClock, X, Calendar, Clock, CheckCircle, AlertCircle, Sparkles, ArrowRight, Info,
} from "lucide-react";
import {timeSlots} from "@/data/data";
import {isPastTime, formatTime, formatDate} from "@/util/timeValidations";
import {fetchBookingsForDate, normalizeTime} from "@/util/fetchBookingDates";
import axios from "axios";
import {useTimezone} from "@/context/TimeZoneContext";

const RescheduleModal = () => {
    const {reschedule, setReschedule, data} = useContext(modalContext);

    const [rescheduleDate, setRescheduleDate] = useState("");
    const [rescheduleTime, setRescheduleTime] = useState("");
    const [bookedTimes, setBookedTimes] = useState([]);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [loadingBookings, setLoadingBookings] = useState(false);
    const {userTimezone, loading} = useTimezone();

    // Fetch bookings when date changes
    useEffect(() => {
        if (!rescheduleDate) return;

        let mounted = true;

        const load = async () => {
            try {
                setLoadingBookings(true);
                const booked = await fetchBookingsForDate(rescheduleDate);

                if (mounted) {
                    setBookedTimes(booked || []);
                    setRescheduleTime("");
                }
            } catch (err) {
                console.error("Error fetching booked times:", err);
                setError("Failed to load available times. Please try again.");
            } finally {
                if (mounted) setLoadingBookings(false);
            }
        };

        load();

        return () => {
            mounted = false;
        };
    }, [rescheduleDate]);

    // Reset modal when opened
    useEffect(() => {
        if (reschedule) {
            setRescheduleDate("");
            setRescheduleTime("");
            setError("");
            setSuccess(false);
            setBookedTimes([]);
        }
    }, [reschedule]);

    const confirmReschedule = async () => {
        if (!rescheduleDate || !rescheduleTime) {
            setError("Please select both date and time");
            return;
        }

        setIsLoading(true);
        setError("");

        try {
            const response = await axios.patch(`/api/bookings/${data.id}`, {
                bookingDate: rescheduleDate, time: rescheduleTime,
            });

            if (response.status !== 200) throw new Error("Failed to reschedule");

            setSuccess(true);

            setTimeout(() => {
                setReschedule(false);
                window.location.reload();
            }, 2000);
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || "Failed to reschedule appointment. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    if (loading) {
        return (<div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <div
                className="bg-gradient-to-br from-slate-900/95 via-purple-900/95 to-slate-900/95 backdrop-blur-xl rounded-2xl p-8 max-w-sm w-full border border-purple-500/30 shadow-2xl">
                <div className="text-center">
                    <div className="relative w-12 h-12 mx-auto mb-4">
                        <div className="absolute inset-0 border-4 border-purple-500/20 rounded-full"></div>
                        <div
                            className="absolute inset-0 border-4 border-t-purple-500 rounded-full animate-spin"></div>
                    </div>
                    <p className="text-white text-sm">Loading...</p>
                </div>
            </div>
        </div>);
    }

    if (!reschedule) return null;

    return (<div
        className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4"
        onClick={() => !success && !isLoading && setReschedule(false)}
    >
        <div
            className="bg-gradient-to-br from-slate-900/95 via-purple-900/95 to-slate-900/95 backdrop-blur-xl rounded-2xl border border-purple-500/30 shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto custom-scrollbar"
            onClick={(e) => e.stopPropagation()}
        >
            {success ? (// Success State
                <div className="p-8 text-center">
                    <div className="relative w-20 h-20 mx-auto mb-6">
                        <div
                            className="absolute inset-0 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full animate-pulse"></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <CheckCircle className="w-12 h-12 text-white" strokeWidth={2.5}/>
                        </div>
                    </div>
                    <h3 className="text-3xl font-bold mb-2 bg-gradient-to-r from-green-300 to-emerald-400 bg-clip-text text-transparent">
                        Success!
                    </h3>
                    <p className="text-white/70 mb-6">
                        Your appointment has been rescheduled
                    </p>
                    <div className="grid grid-cols-2 gap-3">
                        <div className="bg-white/10 rounded-xl p-4 border border-green-400/30">
                            <Calendar className="w-6 h-6 text-green-400 mx-auto mb-2"/>
                            <p className="text-white/60 text-xs mb-1">New Date</p>
                            <p className="text-white font-bold text-sm">
                                {formatDate(rescheduleDate, userTimezone)}
                            </p>
                        </div>
                        <div className="bg-white/10 rounded-xl p-4 border border-emerald-400/30">
                            <Clock className="w-6 h-6 text-emerald-400 mx-auto mb-2"/>
                            <p className="text-white/60 text-xs mb-1">New Time</p>
                            <p className="text-white font-bold text-sm">
                                {formatTime(rescheduleTime, userTimezone)}
                            </p>
                        </div>
                    </div>
                </div>) : (<>
                {/* Header */}
                <div
                    className="p-6 border-b border-purple-500/20 bg-gradient-to-r from-purple-500/5 to-pink-500/5">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div
                                className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                                <CalendarClock className="w-5 h-5 text-white"/>
                            </div>
                            <div>
                                <h3 className="text-xl font-bold bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent">
                                    Reschedule Appointment
                                </h3>
                                <p className="text-white/60 text-xs">Find your perfect time</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setReschedule(false)}
                            className="text-white/50 hover:text-white transition-all hover:rotate-90 p-2 hover:bg-white/10 rounded-lg"
                        >
                            <X className="w-5 h-5"/>
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-5">
                    {/* Current Appointment */}
                    <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                        <div className="flex items-center gap-2 text-white/60 text-xs mb-3">
                            <Info className="w-3 h-3"/>
                            <span>Current Appointment</span>
                        </div>
                        <div className="grid grid-cols-3 gap-3 text-sm">
                            <div>
                                <p className="text-white/50 text-xs mb-1">Service</p>
                                <p className="text-white font-semibold truncate">
                                    {data?.service?.name || data?.plan?.name || "Service"}
                                </p>
                            </div>
                            <div>
                                <p className="text-white/50 text-xs mb-1">Date</p>
                                <p className="text-purple-300 font-semibold">
                                    {data?.date ? formatDate(data.date, userTimezone).split(',')[0] : "N/A"}
                                </p>
                            </div>
                            <div>
                                <p className="text-white/50 text-xs mb-1">Time</p>
                                <p className="text-purple-300 font-semibold">
                                    {data?.time ? formatTime(data.time, userTimezone) : "N/A"}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Date Selection */}
                    {/* Date Selection */}
                    <div
                        className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-2xl p-4 sm:p-6 border border-purple-400/30 w-full">
                        <div className="flex items-center justify-between flex-wrap gap-3 mb-3">
                            <div className="flex items-center gap-2">
                                <Calendar className="w-5 h-5 text-purple-400 flex-shrink-0"/>
                                <h4 className="text-white font-semibold text-sm sm:text-base">
                                    Select New Date
                                </h4>
                            </div>
                            {/* Optional hint for users */}
                            <span className="text-xs text-white/40 hidden sm:block">
      Choose an available date
    </span>
                        </div>

                        <div className="w-full">
                            <input
                                type="date"
                                value={rescheduleDate}
                                onChange={(e) => {
                                    setRescheduleDate(e.target.value);
                                    setRescheduleTime("");
                                    setError("");
                                }}
                                min={new Date().toISOString().split("T")[0]}
                                className="
        w-full
        px-4 py-3
        bg-white/10
        border border-white/20
        rounded-xl
        text-white
        text-sm sm:text-base
        focus:outline-none
        focus:border-purple-400
        focus:ring-2
        focus:ring-purple-400/30
        transition-all
        cursor-pointer
        placeholder-white/50
        backdrop-blur-md
        hover:bg-white/15
        sm:hover:scale-[1.01]
        sm:transition-transform
        duration-300
      "
                            />
                        </div>
                    </div>


                    {/* Time Selection */}
                    {rescheduleDate && (<div
                        className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-xl p-5 border border-green-400/30">
                        <div className="flex items-center gap-2 mb-3">
                            <Clock className="w-5 h-5 text-green-400"/>
                            <h4 className="text-white font-bold">Select Time Slot</h4>
                        </div>

                        {loadingBookings ? (<div
                            className="flex flex-col items-center justify-center h-40 bg-white/5 rounded-lg">
                            <div
                                className="w-8 h-8 border-3 border-green-500/20 border-t-green-500 rounded-full animate-spin mb-2"></div>
                            <p className="text-white/70 text-xs">Loading times...</p>
                        </div>) : (<div
                            className="grid grid-cols-3 gap-2 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                            {timeSlots.map((time) => {
                                const normalizedTime = normalizeTime(time);
                                const isBooked = bookedTimes.includes(normalizedTime);
                                const isPast = isPastTime(rescheduleDate, normalizedTime);
                                const isDisabled = isBooked || isPast;
                                const isSelected = rescheduleTime === normalizedTime;

                                return (<button
                                    key={time}
                                    onClick={() => !isDisabled && setRescheduleTime(normalizedTime)}
                                    disabled={isDisabled}
                                    className={`p-3 rounded-lg text-center transition-all ${isSelected ? "bg-gradient-to-br from-green-500 to-emerald-600 shadow-lg scale-105" : isDisabled ? "bg-slate-800/50 cursor-not-allowed opacity-40" : "bg-white/10 hover:bg-white/20 border border-white/10 hover:scale-105"}`}
                                >
                                    <div className="font-semibold text-white text-sm">
                                        {formatTime(time, userTimezone)}
                                    </div>
                                    <div className="flex items-center justify-center gap-1 mt-1">
                                        {isBooked ? (<span
                                            className="text-red-300 text-xs">Booked</span>) : isPast ? (
                                            <span
                                                className="text-gray-400 text-xs">Past</span>) : isSelected ? (
                                            <span className="text-white text-xs">✓</span>) : (
                                            <span className="text-green-300 text-xs">•</span>)}
                                    </div>
                                </button>);
                            })}
                        </div>)}
                    </div>)}

                    {/* Confirmation Preview */}
                    {rescheduleDate && rescheduleTime && (<div
                        className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-xl p-5 border border-blue-400/30">
                        <div className="flex items-center gap-2 mb-3">
                            <CheckCircle className="w-5 h-5 text-blue-400"/>
                            <h4 className="text-white font-bold">New Appointment</h4>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="bg-white/10 rounded-lg p-3">
                                <p className="text-white/60 text-xs mb-1">Date</p>
                                <p className="text-white font-bold text-sm">
                                    {formatDate(rescheduleDate, userTimezone)}
                                </p>
                            </div>
                            <div className="bg-white/10 rounded-lg p-3">
                                <p className="text-white/60 text-xs mb-1">Time</p>
                                <p className="text-white font-bold text-sm">
                                    {formatTime(rescheduleTime, userTimezone)}
                                </p>
                            </div>
                        </div>
                    </div>)}

                    {/* Error Message */}
                    {error && (<div
                        className="p-4 bg-red-500/10 border border-red-400/40 rounded-xl flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0"/>
                        <p className="text-red-300 text-sm">{error}</p>
                    </div>)}
                </div>

                {/* Footer */}
                <div className="p-6 pt-0">
                    <div className="flex gap-3">
                        <button
                            onClick={() => setReschedule(false)}
                            disabled={isLoading}
                            className="flex-1 px-6 py-3 bg-white/10 border border-white/20 rounded-lg text-white font-semibold hover:bg-white/20 transition-all disabled:opacity-50"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={confirmReschedule}
                            disabled={!rescheduleDate || !rescheduleTime || isLoading}
                            className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (<span className="flex items-center justify-center gap-2">
                                            <div
                                                className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                            Processing...
                                        </span>) : (<span className="flex items-center justify-center gap-2">
                                            Confirm
                                            <ArrowRight className="w-4 h-4"/>
                                        </span>)}
                        </button>
                    </div>
                </div>
            </>)}
        </div>

    </div>);
};

export default RescheduleModal;