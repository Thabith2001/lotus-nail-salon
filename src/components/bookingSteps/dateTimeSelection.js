'use client';

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

    // Detect user timezone
    useEffect(() => {
        try {
            const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
            setUserTimezone(tz || "UTC");
        } catch {
            setUserTimezone("UTC");
        } finally {
            setLoading(false);
        }
    }, []);

    // Format date for API query
    const getLocalDateStr = (date) => {
        return new Intl.DateTimeFormat("sv-SE", {
            timeZone: userTimezone,
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
        }).format(date);
    };

    // Generate next 30 days
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

    const formatDate = (date) =>
        date.toLocaleDateString("en-US", {
            weekday: "short",
            month: "short",
            day: "numeric",
            timeZone: userTimezone,
        });

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

    const normalizeTime = (timeString) => {
        try {
            const d = new Date(`2000-01-01 ${timeString}`);
            const hours = String(d.getHours()).padStart(2, "0");
            const minutes = String(d.getMinutes()).padStart(2, "0");
            return `${hours}:${minutes}`;
        } catch {
            return timeString;
        }
    };

    const fetchBookingsForDate = async (dateStr) => {
        try {
            const res = await axios.get(`/api/bookings/?date=${dateStr}`);
            const booked = res.data.bookedTimes || [];
            return booked.map((t) => normalizeTime(t));
        } catch (err) {
            console.error("Error fetching bookings:", err);
            return [];
        }
    };

    // Load bookings for selected date
    useEffect(() => {
        if (!selectedDate) return;

        const load = async () => {
            setLoadingBookings(true);
            const booked = await fetchBookingsForDate(selectedDate);
            setBookedTimes(booked);
            setSelectedTime(null); // reset time when changing date
            setLoadingBookings(false);
        };

        load();
        window.addEventListener("orientationchange", load); // refresh on mobile orientation change
        return () => window.removeEventListener("orientationchange", load);
    }, [selectedDate]);

    // Disable past slots for today
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

    // If no service selected
    if (!selectedService) {
        return (
            <div className="min-h-[400px] flex items-center justify-center">
                <p className="text-white">Please select a service first</p>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="min-h-[400px] flex items-center justify-center text-white">
                Detecting your timezone...
            </div>
        );
    }

    const availableDates = generateDates();
    const todayStr = getLocalDateStr(new Date());

    return (
        <div className="max-w-7xl mx-auto p-6 space-y-8 text-white">
            {/* Header */}
            <div className="text-center space-y-2">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                    Choose Your Appointment
                </h2>
                <p className="text-white/60">Select a date and time that works best for you</p>
            </div>

            {/* Date & Time Selection */}
            <div className="grid xl:grid-cols-2 gap-8">
                {/* Date Selection */}
                <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 shadow-xl">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-semibold flex items-center gap-2">
                            📅 Select Date
                        </h3>
                        {selectedDate && (
                            <span className="text-sm text-purple-400 font-medium">
                                {formatDate(new Date(selectedDate + "T00:00:00"))}
                            </span>
                        )}
                    </div>
                    <div className="grid grid-cols-3 gap-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                        {availableDates.map((date) => {
                            const dateStr = getLocalDateStr(date);
                            const isSelected = selectedDate === dateStr;
                            const isToday = dateStr === todayStr;
                            return (
                                <button
                                    key={dateStr}
                                    onClick={() => handleDateSelection(dateStr)}
                                    className={`p-4 rounded-xl text-center transition-all duration-200 transform hover:scale-105 relative ${
                                        isSelected
                                            ? "bg-gradient-to-br from-purple-600 to-purple-700 shadow-lg shadow-purple-500/50"
                                            : "bg-white/10 hover:bg-white/15"
                                    }`}
                                >
                                    {isToday && (
                                        <span className="absolute top-1 right-1 w-2 h-2 bg-green-400 rounded-full"></span>
                                    )}
                                    <div className="font-medium">{formatDate(date)}</div>
                                    {isToday && (
                                        <div className="text-xs text-green-400 mt-1">Today</div>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Time Selection */}
                <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 shadow-xl">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-semibold flex items-center gap-2">
                            ⏰ Select Time
                        </h3>
                        {selectedTime && (
                            <span className="text-sm text-green-400 font-medium">
                                {formatTime(selectedTime)}
                            </span>
                        )}
                    </div>

                    {selectedDate ? (
                        loadingBookings ? (
                            <div className="flex items-center justify-center h-[400px]">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-400"></div>
                            </div>
                        ) : (
                            <div className="grid grid-cols-3 gap-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                                {timeSlots.map((time) => {
                                    const isBooked = bookedTimes.includes(time);
                                    const isPast = isPastTime(selectedDate, time);
                                    const disabled = isBooked || isPast;
                                    const isSelected = selectedTime === time;

                                    return (
                                        <button
                                            key={time}
                                            onClick={() => handleTimeSelection(time)}
                                            disabled={disabled}
                                            className={`p-4 rounded-xl text-center transition-all duration-200 transform hover:scale-105 ${
                                                isSelected
                                                    ? "bg-gradient-to-br from-green-500 to-green-600 shadow-lg shadow-green-500/50"
                                                    : disabled
                                                        ? "bg-gray-700/50 cursor-not-allowed opacity-50"
                                                        : "bg-white/10 hover:bg-white/15"
                                            }`}
                                        >
                                            <div className="font-medium">{formatTime(time)}</div>
                                            <div className="text-xs mt-1 flex items-center justify-center gap-1">
                                                {isBooked ? (
                                                    <>
                                                        <span className="w-1.5 h-1.5 bg-red-400 rounded-full"></span>
                                                        Booked
                                                    </>
                                                ) : isPast ? (
                                                    <>
                                                        <span className="w-1.5 h-1.5 bg-gray-400 rounded-full"></span>
                                                        Past
                                                    </>
                                                ) : (
                                                    <>
                                                        <span className="w-1.5 h-1.5 bg-green-400 rounded-full"></span>
                                                        Available
                                                    </>
                                                )}
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        )
                    ) : (
                        <div className="flex flex-col items-center justify-center h-[400px] text-white/50">
                            <p>Select a date first to see available time slots</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DateTimeSelection;