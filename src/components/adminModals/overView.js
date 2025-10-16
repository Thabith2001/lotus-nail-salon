"use client";

import React, { useContext, useEffect, useMemo, useState } from "react";
import {DollarSign, Calendar, Users, Star, Sparkles} from "lucide-react";
import { adminContext } from "@/app/admin/page";
import StatCard from "@/components/adminModals/statCard";

const OverView = () => {
    const { setActiveTab, searchTerm, mergedData, selectedPeriod } =
        useContext(adminContext);

    const [totalRevenue, setTotalRevenue] = useState(0);
    const [totalBookings, setTotalBookings] = useState(0);
    const [activeCustomers, setActiveCustomers] = useState(0);

    //  Normalize booking data safely
    const allBookings = useMemo(() => {
        if (!Array.isArray(mergedData)) return [];
        return mergedData
            .filter((b) => b)
            .map((b) => ({
                id: b._id,
                customer: b?.user?.username || b?.customerName || "Unknown",
                service: b?.service || "N/A",
                date: b?.bookingDate || "-",
                time: b?.time || "-",
                status: b?.status || "N/A",
                amount: Number(b?.payment?.amount) || 0,
                membership: b?.membership || null,
                bookingDate: b?.bookingDate || "-",
            }));
    }, [mergedData]);

    //  Filter by search term
    const filteredBySearch = useMemo(() => {
        const s = searchTerm?.toLowerCase() || "";
        return allBookings.filter(
            (b) =>
                b.customer.toLowerCase().includes(s) ||
                b.service.toLowerCase().includes(s)
        );
    }, [allBookings, searchTerm]);

    //  Filter bookings by selected period
    const filterByPeriod = (bookings) => {
        const now = new Date();

        return bookings.filter((b) => {
            const bookingDate = new Date(b.date);

            if (isNaN(bookingDate)) return false;

            // Normalize times (ignore time part)
            const bookingDay = new Date(
                bookingDate.getFullYear(),
                bookingDate.getMonth(),
                bookingDate.getDate()
            );
            const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

            const diffTime = today - bookingDay;
            const diffDays = diffTime / (1000 * 60 * 60 * 24);

            switch (selectedPeriod?.toLowerCase()) {
                case "today":
                    return bookingDay.getTime() === today.getTime();

                case "this week": {
                    const startOfWeek = new Date(today);
                    startOfWeek.setDate(today.getDate() - today.getDay()); // Sunday
                    const endOfWeek = new Date(startOfWeek);
                    endOfWeek.setDate(startOfWeek.getDate() + 7);
                    return bookingDay >= startOfWeek && bookingDay < endOfWeek;
                }

                case "this month":
                    return (
                        bookingDate.getMonth() === now.getMonth() &&
                        bookingDate.getFullYear() === now.getFullYear()
                    );

                case "this year":
                    return bookingDate.getFullYear() === now.getFullYear();

                default:
                    return true;
            }
        });
    };
    const finalFilteredBookings = useMemo(() => {
        const bookings = filterByPeriod(filteredBySearch);
        return bookings.sort((a, b) => {
            const dateA = new Date(`${a.date} ${a.time}`);
            const dateB = new Date(`${b.date} ${b.time}`);
            return dateA.getTime() - dateB.getTime();
        });
    }, [filteredBySearch, selectedPeriod]);

    //  Update stats
    useEffect(() => {
        if (allBookings.length === 0) {
            setTotalRevenue(0);
            setTotalBookings(0);
            setActiveCustomers(0);
            return;
        }

        const periodBookings = filterByPeriod(allBookings);

        const total = periodBookings.reduce((sum, b) => sum + b.amount, 0);
        setTotalRevenue(total);

        setTotalBookings(periodBookings.length);

        const uniqueUsers = new Set(periodBookings.map((b) => b.customer));
        setActiveCustomers(uniqueUsers.size);
    }, [allBookings, selectedPeriod]);

    return (
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 overflow-x-auto">
            <div>
                <div className="flex items-center gap-2 mb-2">
                    <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
                        Overview
                    </h1>
                    <Sparkles className="w-6 h-6 text-purple-400 animate-pulse" />
                </div>
                <p className="text-white/60 text-sm">Manage your overview efficiently</p>
            </div>

            {/*  Stats Section */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4  mt-2 lg:gap-6">
                <StatCard
                    icon={<DollarSign className="w-6 h-6 text-green-400" />}
                    color="green"
                    title="Total Revenue"
                    value={`$${totalRevenue.toLocaleString()}`}
                    percent="12%"
                />
                <StatCard
                    icon={<Calendar className="w-6 h-6 text-blue-400" />}
                    color="blue"
                    title="Total Bookings"
                    value={totalBookings}
                    percent="8%"
                />
                <StatCard
                    icon={<Users className="w-6 h-6 text-purple-400" />}
                    color="purple"
                    title="Active Customers"
                    value={activeCustomers}
                    percent="15%"
                />
                <StatCard
                    icon={<Star className="w-6 h-6 text-yellow-400" />}
                    color="yellow"
                    title="Avg Rating"
                    value="5.0"
                    percent="3%"
                />
            </div>

            {/*  Recent Bookings Section */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 mt-6">
                <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
                    <h3 className="text-xl font-bold">Recent Bookings</h3>
                    <button
                        onClick={() => setActiveTab("bookings")}
                        className="text-pink-400 hover:text-pink-300 text-sm font-medium"
                    >
                        View All →
                    </button>
                </div>

                <div className="space-y-3">
                    {finalFilteredBookings.slice(0, 5).map((b) => (
                        <div
                            key={b.id}
                            className="flex items-center justify-between p-4 bg-white/5 rounded-xl hover:bg-white/10 transition"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center">
                  <span className="font-bold text-sm">
                    {b.customer?.charAt(0)?.toUpperCase() || "U"}
                  </span>
                                </div>
                                <div>
                                    <p className="font-medium text-sm sm:text-base truncate">
                                        {b.customer}
                                    </p>
                                    <p className="text-xs text-white/60 truncate">{b.service}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="font-semibold text-sm sm:text-base text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">
                                    {b.membership?.sessions
                                        ? `$${(b.amount / b.membership.sessions).toFixed(2)}`
                                        : `$${b.amount}`}
                                </p>
                                <p className="text-xs text-white/60">{b.date}</p>
                            </div>
                        </div>
                    ))}

                    {finalFilteredBookings.length === 0 && (
                        <p className="text-center text-white/50 text-sm py-4">
                            No bookings found for this filter.
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default OverView;
