'use client';

import React, {useContext, useEffect, useState} from "react";
import {servicesContext} from "@/app/booking/page";
import {timeSlots} from "@/data/data";
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

    const [bookedTimes, setBookedTimes] = useState([]); // normalized "HH:MM" strings
    const [userTimezone, setUserTimezone] = useState("UTC");
    const [loading, setLoading] = useState(true);
    const [loadingBookings, setLoadingBookings] = useState(false);

    // Detect user's timezone (fallback to UTC)
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

    // Returns YYYY-MM-DD for given JS Date using user's timezone
    const getLocalDateStr = (date) => {
        return new Intl.DateTimeFormat("sv-SE", {
            timeZone: userTimezone,
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
        }).format(date);
    };

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

    // UI helpers
    const formatDate = (date) =>
        date.toLocaleDateString("en-US", {
            weekday: "short",
            month: "short",
            day: "numeric",
            timeZone: userTimezone,
        });

    const formatTime = (timeString) => {
        // timeString expected "HH:MM" (24h)
        const [h, m] = timeString.split(":").map(Number);
        const d = new Date(2000, 0, 1, h, m);
        return d.toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
            timeZone: userTimezone,
        });
    };

    // Parse a time string to 24-hour "HH:MM".
    // Accepts many formats: "17:30", "5:30 pm", "5:30PM", "05:30", "5:30 p.m.", "5:30pm"
    const parseTimeTo24 = (raw) => {
        if (!raw && raw !== 0) return null;
        const s = String(raw).trim();

        // If it already looks like HH:MM (24h) — quick path
        const hhmm24 = /^(\d{1,2}):(\d{2})$/;
        const m24 = s.match(hhmm24);
        if (m24) {
            let hh = parseInt(m24[1], 10);
            let mm = parseInt(m24[2], 10);
            if (isNaN(hh) || isNaN(mm) || hh < 0 || hh > 23 || mm < 0 || mm > 59) return null;
            return `${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")}`;
        }

        // Look for AM/PM form
        const ampm = /^(.*?)(?:\s*)(am|pm|a\.m\.|p\.m\.|AM|PM|A\.M\.|P\.M\.)$/i;
        const foundAmpm = s.match(ampm);
        if (foundAmpm) {
            const timePart = foundAmpm[1].replace(/\./g, "").trim();
            const meridiem = foundAmpm[2].toLowerCase().includes("p") ? "pm" : "am";
            const parts = timePart.split(":").map(p => p.trim());
            let hh = parseInt(parts[0] || "0", 10);
            let mm = parseInt(parts[1] || "0", 10);
            if (isNaN(hh) || isNaN(mm)) return null;
            if (meridiem === "pm" && hh < 12) hh += 12;
            if (meridiem === "am" && hh === 12) hh = 0;
            return `${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")}`;
        }

        // Last attempt: numbers only or other variants like "530" => 05:30 or 17:30 ambiguous — treat 3-4 digits as HHMM
        const digitsOnly = s.replace(/\D/g, "");
        if (digitsOnly.length === 3 || digitsOnly.length === 4) {
            const hh = digitsOnly.length === 3 ? parseInt(digitsOnly.slice(0,1),10) : parseInt(digitsOnly.slice(0,2),10);
            const mm = parseInt(digitsOnly.slice(-2),10);
            if (hh >= 0 && hh <= 23 && mm >= 0 && mm <= 59) {
                return `${String(hh).padStart(2,"0")}:${String(mm).padStart(2,"0")}`;
            }
        }

        // Fallback: try Date parsing but do not rely on it for correctness
        try {
            const d = new Date(`2000-01-01T${s}`);
            if (!isNaN(d.getTime())) {
                const hh = d.getHours();
                const mm = d.getMinutes();
                return `${String(hh).padStart(2,"0")}:${String(mm).padStart(2,"0")}`;
            }
        } catch (e) {
            /* ignore */
        }

        return null;
    };

    // Always normalize a time string to "HH:MM" (24-hour). Returns null if can't parse.
    const normalizeTime = (timeString) => {
        return parseTimeTo24(timeString);
    };

    // Fetch bookings for a date and return normalized "HH:MM" times
    const fetchBookingsForDate = async (dateStr) => {
        try {
            const res = await axios.get(`/api/bookings?date=${dateStr}`);
            const data = res.data ?? {};

            // 3 possible shapes:
            // 1) { bookedTimes: ["15:30", ...] }
            // 2) { bookings: [{ time: "15:30" }, ...] }
            // 3) an array of bookings or times directly
            let raw = data.bookedTimes ?? data.bookings ?? data;
            // If server returned an object with date property, try bookings property
            if (!raw && typeof data === "object" && Array.isArray(data.bookings)) raw = data.bookings;

            let times = [];
            if (Array.isArray(raw)) {
                if (raw.length > 0 && typeof raw[0] === "object") {
                    // array of booking objects
                    times = raw.map((b) => b.time ?? b.t ?? b.slot ?? "").filter(Boolean);
                } else {
                    // array of strings or numbers
                    times = raw.map((t) => (t === null || t === undefined) ? "" : String(t));
                }
            } else if (typeof raw === "string") {
                times = [raw];
            } else {
                times = [];
            }

            // Normalize and dedupe
            const normalized = times
                .map((t) => normalizeTime(t))
                .filter(Boolean);

            // dedupe
            // for debugging:
            return Array.from(new Set(normalized));
        } catch (err) {
            console.error("Error fetching bookings:", err);
            return [];
        }
    };

    // Load booked times when selectedDate changes
    useEffect(() => {
        if (!selectedDate) return;

        let mounted = true;
        const load = async () => {
            setLoadingBookings(true);
            const booked = await fetchBookingsForDate(selectedDate);
            if (!mounted) return;
            setBookedTimes(booked);
            setSelectedTime(null); // reset selected time on date change
            setLoadingBookings(false);
        };

        load();
        // refresh on orientationchange (mobile) and on visibilitychange (tab switch)
        const refresh = () => { if (selectedDate) load(); };
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
                                    {isToday && <span className="absolute top-1 right-1 w-2 h-2 bg-green-400 rounded-full"></span>}
                                    <div className="font-medium">{formatDate(date)}</div>
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
                            <span className="text-sm text-green-400 font-medium">{formatTime(selectedTime)}</span>
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
                                            <div className="font-medium">{norm ? formatTime(norm) : time}</div>
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