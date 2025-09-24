"use client";

import React, { useContext, useEffect, useState } from "react";
import { servicesContext } from "@/app/booking/page";
import { timeSlots } from "@/data/data";
import axios from "axios";

const DateTimeSelection = () => {
    const {
        selectedTime,
        setSelectedDate,
        selectedDate,
        selectedService,
        getServiceIcon,
        setSelectedTime,
    } = useContext(servicesContext);

    const [bookedTimes, setBookedTimes] = useState([]);
    const [userTimezone, setUserTimezone] = useState("UTC");
    const [loading, setLoading] = useState(true);
    const [loadingBookings, setLoadingBookings] = useState(false);

    // ✅ Detect user's timezone
    useEffect(() => {
        try {
            const browserTz = Intl.DateTimeFormat().resolvedOptions().timeZone;
            setUserTimezone(browserTz || "UTC");
        } catch {
            setUserTimezone("UTC");
        } finally {
            setLoading(false);
        }
    }, []);

    // ✅ Get YYYY-MM-DD in user's timezone
    const getLocalDateStr = (date) => {
        return new Intl.DateTimeFormat("sv-SE", {
            timeZone: userTimezone,
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
        }).format(date);
    };

    // ✅ Generate next 30 days
    const generateDates = () => {
        const dates = [];
        const today = new Date();
        for (let i = 0; i < 30; i++) {
            const d = new Date(today);
            d.setDate(today.getDate() + i);
            dates.push(d);
        }
        return dates;
    };

    // ✅ Format date for display
    const formatDate = (date) =>
        date.toLocaleDateString("en-US", {
            weekday: "short",
            month: "short",
            day: "numeric",
            timeZone: userTimezone,
        });

    // ✅ Format time
    const formatTime = (timeString) => {
        const [h, m] = timeString.split(":");
        const d = new Date(2000, 0, 1, parseInt(h), parseInt(m));
        return d.toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
            timeZone: userTimezone,
        });
    };

    // ✅ Fetch bookings
    const fetchBookingsForDate = async (dateStr) => {
        try {
            const res = await axios.get(`/api/bookings?date=${dateStr}`);
            return res.data.map((b) => b.time.slice(0, 5));
        } catch (err) {
            console.error("Error fetching bookings:", err);
            return [];
        }
    };

    // ✅ Load booked times when date changes
    useEffect(() => {
        if (!selectedDate) return;
        const load = async () => {
            setLoadingBookings(true);
            const booked = await fetchBookingsForDate(selectedDate);
            setBookedTimes(booked);
            setLoadingBookings(false);
        };
        load();
    }, [selectedDate]);

    // ✅ Past-time check (only for today)
    const isPastTime = (dateStr, timeStr) => {
        const now = new Date();
        const todayStr = getLocalDateStr(now);

        if (dateStr !== todayStr) return false;

        const [year, month, day] = dateStr.split("-").map(Number);
        const [h, m] = timeStr.split(":").map(Number);

        const slot = new Date(year, month - 1, day, h, m);
        return slot < now;
    };

    const handleDateSelection = (dateStr) => {
        setSelectedDate(dateStr);
        setSelectedTime(null);
    };

    const handleTimeSelection = (time) => {
        if (!bookedTimes.includes(time) && !isPastTime(selectedDate, time)) {
            setSelectedTime(time);
        }
    };

    if (!selectedService) {
        return (
            <div className="min-h-[400px] flex items-center justify-center">
                <div className="text-center p-8">
                    <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">Select a Service First</h3>
                    <p className="text-white/60">Please choose a service before selecting your appointment time</p>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="min-h-[400px] flex items-center justify-center">
                <div className="text-center p-8">
                    <div className="w-12 h-12 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mx-auto mb-4"></div>
                    <div className="text-white font-medium">Detecting your timezone...</div>
                    <div className="text-white/60 text-sm mt-1">Please wait a moment</div>
                </div>
            </div>
        );
    }

    const availableDates = generateDates();
    const todayStr = getLocalDateStr(new Date());

    return (
        <div className="max-w-6xl mx-auto p-6 space-y-8">
            {/* Header */}
            <div className="text-center space-y-2">
                <h2 className="text-4xl font-bold bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent">
                    Book Your Appointment
                </h2>
                <p className="text-white/70 text-lg">Choose your preferred date and time</p>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full backdrop-blur-sm">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-white/60 text-sm">{userTimezone}</span>
                </div>
            </div>

            {/* Selected Service Card */}
            <div className="relative overflow-hidden">
                <div className="bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center text-2xl shadow-lg">
                                {getServiceIcon(selectedService.category)}
                            </div>
                            <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-400 rounded-full border-2 border-white"></div>
                        </div>
                        <div className="flex-1">
                            <h3 className="text-xl font-bold text-white mb-1">{selectedService.name}</h3>
                            <div className="flex items-center gap-4 text-white/60">
                                <span className="flex items-center gap-1">
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                                    </svg>
                                    {selectedService.duration} minutes
                                </span>
                                <span className="flex items-center gap-1">
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
                                    </svg>
                                    ${selectedService.price}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Date & Time Selection */}
            <div className="grid xl:grid-cols-2 gap-8">
                {/* Date Selection */}
                <div className="space-y-6">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <h3 className="text-2xl font-bold text-white">Select Date</h3>
                    </div>

                    <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
                        <div className="grid grid-cols-3 gap-3 max-h-80 overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/20">
                            {availableDates.map((date) => {
                                const dateStr = getLocalDateStr(date);
                                const isSelected = selectedDate === dateStr;
                                const isToday = dateStr === todayStr;

                                return (
                                    <button
                                        key={dateStr}
                                        onClick={() => handleDateSelection(dateStr)}
                                        className={`group relative p-4 rounded-xl text-center transition-all duration-300 transform hover:scale-105 ${
                                            isSelected
                                                ? "bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/25 scale-105"
                                                : "bg-white/10 text-white hover:bg-white/20 hover:shadow-lg"
                                        }`}
                                    >
                                        {isToday && (
                                            <div className="absolute -top-2 -right-2 w-4 h-4 bg-green-400 rounded-full border-2 border-white animate-pulse"></div>
                                        )}
                                        <div className="text-sm font-bold mb-1">
                                            {isToday ? "Today" : formatDate(date)}
                                        </div>
                                        <div className="text-2xl font-bold opacity-80">{date.getDate()}</div>
                                        {isSelected && (
                                            <div className="absolute inset-0 rounded-xl bg-white/10 animate-pulse"></div>
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Time Selection */}
                <div className="space-y-6">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
                            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                            Select Time
                            {loadingBookings && (
                                <div className="w-5 h-5 border-2 border-purple-300/30 border-t-purple-300 rounded-full animate-spin"></div>
                            )}
                        </h3>
                    </div>

                    <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
                        {selectedDate ? (
                            <div className="grid grid-cols-3 gap-3 max-h-80 overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/20">
                                {timeSlots.map((time) => {
                                    const isSelected = selectedTime === time;
                                    const isBooked = bookedTimes.includes(time);
                                    const isPast = isPastTime(selectedDate, time);
                                    const isDisabled = isBooked || isPast || loadingBookings;

                                    return (
                                        <button
                                            key={time}
                                            onClick={() => handleTimeSelection(time)}
                                            disabled={isDisabled}
                                            className={`group relative p-4 rounded-xl text-center transition-all duration-300 transform hover:scale-105 ${
                                                isDisabled
                                                    ? "bg-gray-800/50 text-gray-500 cursor-not-allowed opacity-50"
                                                    : isSelected
                                                        ? "bg-gradient-to-br from-purple-500 via-pink-500 to-red-500 text-white shadow-lg shadow-pink-500/25 scale-105"
                                                        : "bg-white/10 text-white hover:bg-white/20 hover:shadow-lg"
                                            }`}
                                        >
                                            <div className="text-base font-bold mb-1">{formatTime(time)}</div>

                                            {/* Status indicators */}
                                            {loadingBookings && (
                                                <div className="text-xs text-blue-300 font-medium">Loading...</div>
                                            )}
                                            {isBooked && !loadingBookings && (
                                                <div className="text-xs text-red-300 font-medium flex items-center justify-center gap-1">
                                                    <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                                                    Booked
                                                </div>
                                            )}
                                            {isPast && !isBooked && !loadingBookings && (
                                                <div className="text-xs text-yellow-300 font-medium flex items-center justify-center gap-1">
                                                    <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                                                    Past
                                                </div>
                                            )}
                                            {!isDisabled && !isSelected && !loadingBookings && (
                                                <div className="text-xs text-green-300 font-medium flex items-center justify-center gap-1">
                                                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                                                    Available
                                                </div>
                                            )}
                                            {isSelected && (
                                                <div className="absolute inset-0 rounded-xl bg-white/10 animate-pulse"></div>
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <svg className="w-8 h-8 text-white/60" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <h4 className="text-white font-semibold mb-2">Select a Date First</h4>
                                <p className="text-white/60 text-sm">Choose a date to see available time slots</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Confirmation Summary */}
            {selectedDate && selectedTime && (
                <div className="relative overflow-hidden">
                    <div className="bg-gradient-to-r from-green-500/10 via-emerald-500/10 to-teal-500/10 backdrop-blur-xl rounded-2xl border border-green-500/20 p-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="flex-1">
                                <h4 className="text-xl font-bold text-white mb-2">Appointment Confirmed</h4>
                                <div className="text-white/80 text-lg">
                                    {formatDate(new Date(selectedDate + 'T00:00:00'))} at {formatTime(selectedTime)}
                                </div>
                                <div className="text-white/60 text-sm mt-1">
                                    {userTimezone} • {selectedService.name} • {selectedService.duration} min
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="text-2xl font-bold text-white">${selectedService.price}</div>
                                <div className="text-white/60 text-sm">Total</div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DateTimeSelection;