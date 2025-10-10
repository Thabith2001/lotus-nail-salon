"use client";

import React, { useContext, useMemo } from "react";
import { adminContext } from "@/app/admin/page";
import { TrendingUp, DollarSign, Users, Star } from "lucide-react";

const Analytics = () => {
    const { mergedData } = useContext(adminContext);

    // Revenue by month (based on bookingDate)
    const revenueByMonth = useMemo(() => {
        if (!mergedData || mergedData.length === 0) return [];

        const monthMap = {
            0: "Jan", 1: "Feb", 2: "Mar", 3: "Apr", 4: "May", 5: "Jun",
            6: "Jul", 7: "Aug", 8: "Sep", 9: "Oct", 10: "Nov", 11: "Dec",
        };

        const data = {
            Jan: 0, Feb: 0, Mar: 0, Apr: 0, May: 0, Jun: 0,
            Jul: 0, Aug: 0, Sep: 0, Oct: 0, Nov: 0, Dec: 0,
        };

        mergedData.forEach((b) => {
            if (!b?.bookingDate || !b?.payment?.amount) return;
            try {
                const date = new Date(b.bookingDate);
                const monthIndex = date.getMonth();
                const month = monthMap[monthIndex];
                if (month && data[month] !== undefined) {
                    data[month] += b.payment.amount;
                }
            } catch (error) {
                console.error("Invalid date:", b.bookingDate);
            }
        });

        return Object.entries(data).map(([month, value]) => ({ month, value }));
    }, [mergedData]);

    //  Service popularity
    const serviceStats = useMemo(() => {
        const map = {};
        mergedData?.forEach((b) => {
            const service = b?.service || "Unknown";
            map[service] = (map[service] || 0) + 1;
        });

        const total = Object.values(map).reduce((a, b) => a + b, 0);
        return Object.entries(map)
            .map(([name, count]) => ({
                name,
                percentage: total ? ((count / total) * 100).toFixed(1) : 0,
            }))
            .sort((a, b) => b.percentage - a.percentage)
            .slice(0, 5);
    }, [mergedData]);

    // ⃣ Top customers
    const topCustomers = useMemo(() => {
        const map = {};
        mergedData?.forEach((b) => {
            const name = b?.user?.username || b?.customerName || "Unknown";
            if (!map[name]) map[name] = { name, totalSpent: 0, totalBookings: 0 };
            map[name].totalSpent += b?.payment?.amount || 0;
            map[name].totalBookings += 1;
        });

        return Object.values(map)
            .sort((a, b) => b.totalSpent - a.totalSpent)
            .slice(0, 5);
    }, [mergedData]);

    //  Calculate analytics
    const maxValue = revenueByMonth.length > 0
        ? Math.max(...revenueByMonth.map((d) => d.value), 1)
        : 1;

    const totalRevenue = revenueByMonth.reduce((sum, m) => sum + m.value, 0);
    const avgRevenue = totalRevenue / (revenueByMonth.filter(m => m.value > 0).length || 1);

    // Calculate growth
    const firstHalf = revenueByMonth.slice(0, 6).reduce((sum, m) => sum + m.value, 0);
    const secondHalf = revenueByMonth.slice(6).reduce((sum, m) => sum + m.value, 0);
    const growth = firstHalf > 0 ? ((secondHalf - firstHalf) / firstHalf * 100).toFixed(1) : 0;

    const serviceColors = [
        'from-pink-500 to-rose-500',
        'from-purple-500 to-indigo-500',
        'from-blue-500 to-cyan-500',
        'from-emerald-500 to-teal-500',
        'from-amber-500 to-orange-500',
    ];

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Revenue Trends - Redesigned */}
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-xl">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-6">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/30">
                                    <DollarSign className="w-5 h-5 text-white" />
                                </div>
                                <h3 className="text-xl font-bold">Revenue Trends</h3>
                            </div>
                            <p className="text-xs text-white/50 ml-13">Monthly performance</p>
                        </div>

                        <div className="text-right space-y-2">
                            <div>
                                <p className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600">
                                    ${totalRevenue.toFixed(2)}
                                </p>
                                <p className="text-xs text-white/60">Total Revenue</p>
                            </div>
                            {growth !== 0 && (
                                <div className="flex items-center gap-1 justify-end bg-green-500/10 border border-green-500/20 rounded-lg px-2 py-1">
                                    <TrendingUp className="w-3 h-3 text-green-400" />
                                    <span className="text-xs font-semibold text-green-400">+{growth}%</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Chart */}
                    {revenueByMonth.length > 0 ? (
                        <div className="relative">
                            {/* Average line */}
                            {avgRevenue > 0 && (
                                <div
                                    className="absolute left-0 right-0 border-t border-dashed border-purple-400/30 z-10"
                                    style={{ bottom: `${(avgRevenue / maxValue) * 240 + 32}px` }}
                                >
                                    <span className="absolute -top-2 right-0 text-xs text-purple-400/60 bg-slate-900/80 px-2 rounded">
                                        Avg: ${avgRevenue.toFixed(0)}
                                    </span>
                                </div>
                            )}

                            <div className="relative h-64 pt-4">
                                <div className="absolute inset-0 flex items-end justify-between gap-2">
                                    {revenueByMonth.map(({ month, value }) => {
                                        const heightPx = (value / maxValue) * 240;
                                        const hasValue = value > 0;
                                        const isHighest = value === maxValue && value > 0;

                                        return (
                                            <div
                                                key={month}
                                                className="flex-1 flex flex-col items-center gap-2 group cursor-pointer"
                                            >
                                                {/* Tooltip */}
                                                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 absolute -top-14 bg-slate-800/95 backdrop-blur-sm border border-purple-500/30 rounded-lg px-3 py-2 shadow-xl z-20">
                                                    <p className="text-xs font-semibold text-purple-300 whitespace-nowrap">
                                                        ${value.toFixed(2)}
                                                    </p>
                                                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 rotate-45 w-2 h-2 bg-slate-800 border-r border-b border-purple-500/30" />
                                                </div>

                                                {/* Bar container */}
                                                <div className="w-full relative" style={{ height: '240px' }}>
                                                    <div className="absolute bottom-0 left-0 right-0 flex flex-col">
                                                        {/* Glow effect */}
                                                        {hasValue && (
                                                            <div
                                                                className="absolute inset-0 bg-gradient-to-t from-purple-500/20 to-transparent blur-lg rounded-full"
                                                                style={{ height: `${heightPx}px` }}
                                                            />
                                                        )}

                                                        {/* Main bar */}
                                                        <div
                                                            className={`relative w-full rounded-t-xl transition-all duration-300 ${
                                                                isHighest
                                                                    ? 'bg-gradient-to-t from-pink-500 via-purple-500 to-purple-400'
                                                                    : 'bg-gradient-to-t from-purple-600 via-purple-500 to-purple-400'
                                                            } group-hover:from-pink-400 group-hover:via-purple-400 group-hover:to-purple-300 shadow-lg shadow-purple-500/30 group-hover:shadow-purple-500/50`}
                                                            style={{
                                                                height: `${Math.max(heightPx, hasValue ? 8 : 0)}px`,
                                                            }}
                                                        >
                                                            {/* Shine overlay */}
                                                            {hasValue && (
                                                                <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-transparent to-transparent rounded-t-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                                                            )}

                                                            {/* Peak indicator */}
                                                            {isHighest && (
                                                                <div className="absolute -top-6 left-1/2 -translate-x-1/2">
                                                                    <div className="w-5 h-5 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-lg shadow-yellow-500/50">
                                                                        <Star className="w-3 h-3 text-white fill-white" />
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Month label */}
                                                <span className="text-xs font-medium text-white/70 group-hover:text-white transition-colors">
                                                    {month}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Grid lines */}
                            <div className="absolute inset-0 pointer-events-none">
                                {[25, 50, 75].map(percent => (
                                    <div
                                        key={percent}
                                        className="absolute left-0 right-0 border-t border-white/5"
                                        style={{ bottom: `${percent}%` }}
                                    />
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-16">
                            <div className="w-16 h-16 rounded-full bg-purple-500/10 flex items-center justify-center mx-auto mb-4">
                                <DollarSign className="w-8 h-8 text-purple-400/50" />
                            </div>
                            <p className="text-sm text-white/60">No revenue data available</p>
                        </div>
                    )}
                </div>

                {/* Service Popularity - Redesigned */}
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-xl">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
                            <TrendingUp className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold">Service Popularity</h3>
                            <p className="text-xs text-white/50">Top performing services</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        {serviceStats.length > 0 ? (
                            serviceStats.map((service, i) => (
                                <div key={i} className="group">
                                    <div className="flex justify-between items-center mb-2">
                                        <div className="flex items-center gap-2">
                                            <div className={`w-6 h-6 rounded-lg bg-gradient-to-br ${serviceColors[i]} flex items-center justify-center shadow-lg`}>
                                                <span className="text-xs font-bold text-white">{i + 1}</span>
                                            </div>
                                            <span className="text-sm font-medium">{service.name}</span>
                                        </div>
                                        <span className="text-sm font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600">
                                            {service.percentage}%
                                        </span>
                                    </div>
                                    <div className="w-full bg-white/10 rounded-full h-2.5 overflow-hidden">
                                        <div
                                            className={`bg-gradient-to-r ${serviceColors[i]} h-2.5 rounded-full transition-all duration-500 shadow-lg group-hover:shadow-xl relative`}
                                            style={{ width: `${service.percentage}%` }}
                                        >
                                            <div className="absolute inset-0 bg-gradient-to-r from-white/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-12">
                                <div className="w-16 h-16 rounded-full bg-blue-500/10 flex items-center justify-center mx-auto mb-4">
                                    <TrendingUp className="w-8 h-8 text-blue-400/50" />
                                </div>
                                <p className="text-sm text-white/60">No services found</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Top Customers - Redesigned */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-xl">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/30">
                        <Users className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold">Top Customers</h3>
                        <p className="text-xs text-white/50">Highest spending customers</p>
                    </div>
                </div>

                <div className="space-y-3">
                    {topCustomers.length > 0 ? (
                        topCustomers.map((customer, i) => (
                            <div
                                key={i}
                                className="flex items-center justify-between p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-all duration-300 group border border-white/5 hover:border-white/10"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="relative">
                                        {/* Rank badge */}
                                        <div className="absolute -top-1 -left-1 w-5 h-5 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center font-bold text-xs shadow-lg z-10">
                                            {i + 1}
                                        </div>
                                        {/* Avatar */}
                                        <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg group-hover:shadow-purple-500/50 transition-shadow">
                                            <span className="text-lg font-bold">
                                                {customer.name.charAt(0).toUpperCase()}
                                            </span>
                                        </div>
                                    </div>
                                    <div>
                                        <p className="font-semibold text-white group-hover:text-purple-300 transition-colors">
                                            {customer.name}
                                        </p>
                                        <p className="text-xs text-white/60">
                                            {customer.totalBookings} bookings
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-lg text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">
                                        ${customer.totalSpent.toFixed(2)}
                                    </p>
                                    <p className="text-xs text-white/50">total spent</p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-12">
                            <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-4">
                                <Users className="w-8 h-8 text-emerald-400/50" />
                            </div>
                            <p className="text-center text-white/60 text-sm">
                                No customer data available.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Analytics;