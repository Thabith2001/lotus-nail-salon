'use client';

import React, {useContext, useEffect, useState} from "react";
import {servicesContext} from "@/app/booking/page";
import {timeSlots} from "@/data/data";
import {fetchBookingsForDate,normalizeTime} from "@/util/fetchBookingDates";
import {formatDate, formatTime,getLocalDateStr} from "@/util/timeValidations";
import {useTimezone}from "@/context/TimeZoneContext";


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
    const [loadingBookings, setLoadingBookings] = useState(false);
    const{userTimezone,loading}=useTimezone();


    // Generate next 30 days (local)
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

    useEffect(() => {
        if (!selectedDate) return;

        let mounted = true;
        const load = async () => {
            setLoadingBookings(true);
            const booked = await fetchBookingsForDate(selectedDate);
            if (!mounted) return;
            setBookedTimes(booked);
            setSelectedTime(null);
            setLoadingBookings(false);
        };

        load();

        const refresh = () => {
            if (selectedDate) load();
        };
        window.addEventListener("orientationchange", refresh);
        document.addEventListener("visibilitychange", refresh);

        return () => {
            mounted = false;
            window.removeEventListener("orientationchange", refresh);
            document.removeEventListener("visibilitychange", refresh);
        };
    }, [selectedDate]);

    // Check if a slot (dateStr + timeStr "HH:MM") is in the past (based on user's local timezone)
    const isPastTime = (dateStr, timeStr) => {
        if (!dateStr || !timeStr) return false;
        const now = new Date();
        const todayStr = getLocalDateStr(now);
        if (dateStr !== todayStr) return false;

        const [year, month, day] = dateStr.split("-").map(Number);
        const [h, m] = timeStr.split(":").map(Number);
        if ([year, month, day, h, m].some(v => Number.isNaN(v))) return false;

        // Build a local Date safely
        const slot = new Date(year, month - 1, day, h, m, 0);
        return slot < now;
    };

    const handleDateSelection = (dateStr) => {
        setSelectedDate(dateStr);
        setSelectedTime(null);
    };

    const handleTimeSelection = (time) => {
        const norm = normalizeTime(time);
        if (!norm) return;
        if (!bookedTimes.includes(norm) && !isPastTime(selectedDate, norm)) {
            setSelectedTime(norm);
        }
    };

    // UI rendering guards
    if (!selectedService) {
        return (
            <div className="min-h-[400px] flex items-center justify-center">
                <div className="text-center p-8">
                    <div
                        className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd"
                                  d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                                  clipRule="evenodd"/>
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
                    <div
                        className="w-12 h-12 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mx-auto mb-4"></div>
                    <div className="text-white font-medium">Detecting your timezone...</div>
                    <div className="text-white/60 text-sm mt-1">Please wait a moment</div>
                </div>
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

            <div className="grid xl:grid-cols-2 gap-8">
                {/* Date Column */}
                <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 shadow-xl">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-semibold flex items-center gap-2">📅 Select Date</h3>
                        {selectedDate && (
                            <span className="text-sm text-purple-400 font-medium">
                                {formatDate(new Date(selectedDate + "T00:00:00"), userTimezone)}
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
                                    {isToday && <span
                                        className="absolute top-1 right-1 w-2 h-2 bg-green-400 rounded-full"></span>}
                                    <div className="font-medium">{formatDate(date, userTimezone)}</div>
                                    {isToday && <div className="text-xs text-green-400 mt-1">Today</div>}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Time Column */}
                <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 shadow-xl">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-semibold flex items-center gap-2">⏰ Select Time</h3>
                        {selectedTime && (
                            <span className="text-sm text-green-400 font-medium">{formatTime(selectedTime,userTimezone)}</span>
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
                                    const norm = normalizeTime(time);
                                    const isBooked = norm ? bookedTimes.includes(norm) : false;
                                    const isPast = norm ? isPastTime(selectedDate, norm) : false;
                                    const disabled = isBooked || isPast;
                                    const isSelected = selectedTime === norm;

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
                                            <div className="font-medium">{norm ? formatTime(norm,userTimezone) : time}</div>
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