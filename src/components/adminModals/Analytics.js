"use client";

import React, { useContext, useMemo } from "react";
import { adminContext } from "@/app/admin/page";
import { TrendingUp, DollarSign, Users, Star, ArrowUp, Activity, Award, Sparkles } from "lucide-react";

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

    // Service popularity
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
                count,
                percentage: total ? ((count / total) * 100).toFixed(1) : 0,
            }))
            .sort((a, b) => b.percentage - a.percentage)
            .slice(0, 5);
    }, [mergedData]);

    // Top customers
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

    // Calculate analytics
    const maxValue = revenueByMonth.length > 0
        ? Math.max(...revenueByMonth.map((d) => d.value), 1)
        : 1;

    const totalRevenue = revenueByMonth.reduce((sum, m) => sum + m.value, 0);
    const avgRevenue = totalRevenue / (revenueByMonth.filter(m => m.value > 0).length || 1);

    // Calculate growth
    const firstHalf = revenueByMonth.slice(0, 6).reduce((sum, m) => sum + m.value, 0);
    const secondHalf = revenueByMonth.slice(6).reduce((sum, m) => sum + m.value, 0);
    const growth = firstHalf > 0 ? ((secondHalf - firstHalf) / firstHalf * 100).toFixed(1) : 0;

    const totalCustomers = topCustomers.length;
    const totalBookings = topCustomers.reduce((sum, c) => sum + c.totalBookings, 0);

    const serviceColors = [
        'from-pink-500 to-rose-500',
        'from-purple-500 to-indigo-500',
        'from-blue-500 to-cyan-500',
        'from-emerald-500 to-teal-500',
        'from-amber-500 to-orange-500',
    ];

    return (
        <div className="space-y-6 backdrop-blur-2xl bg-white/5 border border-white/10 rounded-2xl p-6 shadow-xl">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-2">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
                            Analytics Dashboard
                        </h1>
                        <Sparkles className="w-6 h-6 text-purple-400 animate-pulse" />
                    </div>
                    <p className="text-white/60 text-sm">Real-time insights into your business performance</p>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Total Revenue */}
                <div className="group relative overflow-hidden bg-gradient-to-br from-purple-500/10 to-pink-500/10 backdrop-blur-xl border border-purple-500/20 rounded-2xl p-5 hover:scale-[1.02] hover:shadow-2xl hover:shadow-purple-500/20 transition-all duration-300 cursor-pointer">
                    <div className="absolute -top-10 -right-10 w-32 h-32 bg-purple-500/20 rounded-full blur-3xl group-hover:bg-purple-500/30 transition-all duration-300"></div>
                    <div className="relative">
                        <div className="flex items-start justify-between mb-3">
                            <div className="w-11 h-11 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/40 group-hover:scale-110 transition-transform duration-300">
                                <DollarSign className="w-5 h-5 text-white" />
                            </div>
                            {growth > 0 && (
                                <div className="flex items-center gap-1 bg-emerald-500/20 border border-emerald-500/30 rounded-lg px-2 py-1">
                                    <ArrowUp className="w-3 h-3 text-emerald-400" />
                                    <span className="text-xs font-bold text-emerald-400">+{growth}%</span>
                                </div>
                            )}
                        </div>
                        <p className="text-white/50 text-xs font-medium mb-1">Total Revenue</p>
                        <p className="text-2xl font-bold text-white mb-1">${totalRevenue.toFixed(2)}</p>
                        <p className="text-xs text-white/40">Year to date</p>
                    </div>
                </div>

                {/* Average Revenue */}
                <div className="group relative overflow-hidden bg-gradient-to-br from-blue-500/10 to-cyan-500/10 backdrop-blur-xl border border-blue-500/20 rounded-2xl p-5 hover:scale-[1.02] hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-300 cursor-pointer">
                    <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-500/20 rounded-full blur-3xl group-hover:bg-blue-500/30 transition-all duration-300"></div>
                    <div className="relative">
                        <div className="flex items-start justify-between mb-3">
                            <div className="w-11 h-11 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/40 group-hover:scale-110 transition-transform duration-300">
                                <Activity className="w-5 h-5 text-white" />
                            </div>
                        </div>
                        <p className="text-white/50 text-xs font-medium mb-1">Monthly Average</p>
                        <p className="text-2xl font-bold text-white mb-1">${avgRevenue.toFixed(2)}</p>
                        <p className="text-xs text-white/40">Per month</p>
                    </div>
                </div>

                {/* Total Customers */}
                <div className="group relative overflow-hidden bg-gradient-to-br from-emerald-500/10 to-teal-500/10 backdrop-blur-xl border border-emerald-500/20 rounded-2xl p-5 hover:scale-[1.02] hover:shadow-2xl hover:shadow-emerald-500/20 transition-all duration-300 cursor-pointer">
                    <div className="absolute -top-10 -right-10 w-32 h-32 bg-emerald-500/20 rounded-full blur-3xl group-hover:bg-emerald-500/30 transition-all duration-300"></div>
                    <div className="relative">
                        <div className="flex items-start justify-between mb-3">
                            <div className="w-11 h-11 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/40 group-hover:scale-110 transition-transform duration-300">
                                <Users className="w-5 h-5 text-white" />
                            </div>
                        </div>
                        <p className="text-white/50 text-xs font-medium mb-1">Total Customers</p>
                        <p className="text-2xl font-bold text-white mb-1">{totalCustomers || 0}</p>
                        <p className="text-xs text-white/40">Active clients</p>
                    </div>
                </div>

                {/* Total Bookings */}
                <div className="group relative overflow-hidden bg-gradient-to-br from-amber-500/10 to-orange-500/10 backdrop-blur-xl border border-amber-500/20 rounded-2xl p-5 hover:scale-[1.02] hover:shadow-2xl hover:shadow-amber-500/20 transition-all duration-300 cursor-pointer">
                    <div className="absolute -top-10 -right-10 w-32 h-32 bg-amber-500/20 rounded-full blur-3xl group-hover:bg-amber-500/30 transition-all duration-300"></div>
                    <div className="relative">
                        <div className="flex items-start justify-between mb-3">
                            <div className="w-11 h-11 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center shadow-lg shadow-amber-500/40 group-hover:scale-110 transition-transform duration-300">
                                <Award className="w-5 h-5 text-white" />
                            </div>
                        </div>
                        <p className="text-white/50 text-xs font-medium mb-1">Total Bookings</p>
                        <p className="text-2xl font-bold text-white mb-1">{totalBookings || 0}</p>
                        <p className="text-xs text-white/40">All time</p>
                    </div>
                </div>
            </div>

            {/* Main Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Revenue Trends Chart - Takes 2 columns */}
                <div className="lg:col-span-2 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-shadow duration-300">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-6 gap-3">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/30">
                                    <DollarSign className="w-5 h-5 text-white" />
                                </div>
                                <h3 className="text-xl font-bold text-white">Revenue Trends</h3>
                            </div>
                            <p className="text-xs text-white/50 sm:ml-13">Monthly performance breakdown</p>
                        </div>

                        <div className="flex items-center gap-2">
                           <span className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">${avgRevenue.toFixed(2)}</span>
                        </div>
                    </div>

                    {revenueByMonth.length > 0 ? (
                        <div className="relative">
                            {/* Average line */}
                            {avgRevenue > 0 && (
                                <div
                                    className="absolute left-0 right-0 border-t-2 border-dashed border-purple-400/40 z-10"
                                    style={{ bottom: `${(avgRevenue / maxValue) * 240 + 32}px` }}
                                >
                                    <span className="absolute -top-2.5 right-2 text-xs font-semibold text-purple-400 bg-slate-900/90 px-2 py-0.5 rounded-md border border-purple-400/30">
                                        Avg: ${avgRevenue.toFixed(0)}
                                    </span>
                                </div>
                            )}

                            <div className="relative h-64 pt-4 overflow-x-auto">
                                <div className="flex items-end justify-between gap-1 sm:gap-2 min-w-[600px] lg:min-w-full" style={{ height: '240px' }}>
                                    {revenueByMonth.map(({ month, value }) => {
                                        const heightPx = (value / maxValue) * 240;
                                        const hasValue = value > 0;
                                        const isHighest = value === maxValue && value > 0;

                                        return (
                                            <div
                                                key={month}
                                                className="flex-1 flex flex-col items-center gap-2 group cursor-pointer relative"
                                            >
                                                {/* Tooltip */}
                                                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 absolute -top-16 left-1/2 -translate-x-1/2 bg-slate-800/95 backdrop-blur-sm border border-purple-500/40 rounded-lg px-3 py-2 shadow-2xl z-20 pointer-events-none">
                                                    <p className="text-xs text-purple-300/70 mb-0.5 text-center">{month}</p>
                                                    <p className="text-sm font-bold text-white whitespace-nowrap">
                                                        ${value.toFixed(2)}
                                                    </p>
                                                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 rotate-45 w-2 h-2 bg-slate-800 border-r border-b border-purple-500/40" />
                                                </div>

                                                {/* Bar container */}
                                                <div className="w-full relative flex items-end" style={{ height: '240px' }}>
                                                    {/* Glow effect */}
                                                    {hasValue && (
                                                        <div
                                                            className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-purple-500/30 to-transparent blur-xl rounded-full"
                                                            style={{ height: `${heightPx + 20}px` }}
                                                        />
                                                    )}

                                                    {/* Main bar */}
                                                    <div
                                                        className={`relative w-full rounded-t-xl transition-all duration-500 ${
                                                            isHighest
                                                                ? 'bg-gradient-to-t from-pink-500 via-purple-500 to-purple-400'
                                                                : 'bg-gradient-to-t from-purple-700 via-purple-600 to-purple-500'
                                                        } group-hover:from-pink-400 group-hover:via-purple-400 group-hover:to-purple-300 shadow-lg shadow-purple-500/40 group-hover:shadow-purple-500/60`}
                                                        style={{
                                                            height: `${Math.max(heightPx, hasValue ? 8 : 0)}px`,
                                                        }}
                                                    >
                                                        {/* Shine overlay */}
                                                        {hasValue && (
                                                            <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-transparent rounded-t-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                                        )}

                                                        {/* Peak indicator */}
                                                        {isHighest && (
                                                            <div className="absolute -top-7 left-1/2 -translate-x-1/2 animate-bounce">
                                                                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-lg shadow-yellow-500/50">
                                                                    <Star className="w-3.5 h-3.5 text-white fill-white" />
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Month label */}
                                                <span className="text-xs font-medium text-white/60 group-hover:text-white transition-colors">
                                                    {month}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Grid lines */}
                            <div className="absolute inset-0 pointer-events-none pt-4">
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

                {/* Service Popularity */}
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-shadow duration-300">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
                            <TrendingUp className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-white">Top Services</h3>
                            <p className="text-xs text-white/50">Most booked services</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        {serviceStats.length > 0 ? (
                            serviceStats.map((service, i) => (
                                <div key={i} className="group">
                                    <div className="flex justify-between items-start mb-2 gap-2">
                                        <div className="flex items-center gap-2 flex-1 min-w-0">
                                            <div className={`w-7 h-7 rounded-lg bg-gradient-to-br ${serviceColors[i]} flex items-center justify-center shadow-lg flex-shrink-0`}>
                                                <span className="text-xs font-bold text-white">{i + 1}</span>
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <p className="text-sm font-semibold text-white truncate">{service.name}</p>
                                                <p className="text-xs text-white/40">{service.count} bookings</p>
                                            </div>
                                        </div>
                                        <span className={`text-base font-bold bg-gradient-to-r ${serviceColors[i]} bg-clip-text text-transparent flex-shrink-0`}>
                                            {service.percentage}%
                                        </span>
                                    </div>
                                    <div className="w-full bg-white/5 rounded-full h-2.5 overflow-hidden">
                                        <div
                                            className={`bg-gradient-to-r ${serviceColors[i]} h-2.5 rounded-full transition-all duration-700 shadow-lg relative group-hover:shadow-xl`}
                                            style={{ width: `${service.percentage}%` }}
                                        >
                                            <div className="absolute inset-0 bg-gradient-to-r from-white/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
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

            {/* Top Customers */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-shadow duration-300">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/30">
                            <Users className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-white">VIP Customers</h3>
                            <p className="text-xs text-white/50">Top spending clients</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="text-2xl font-bold text-white">{topCustomers.length}</p>
                        <p className="text-xs text-white/50">Featured</p>
                    </div>
                </div>

                {topCustomers.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                        {topCustomers.map((customer, i) => {
                            const gradients = [
                                { bg: 'from-yellow-400 via-yellow-500 to-amber-600', shadow: 'shadow-yellow-500/50' },
                                { bg: 'from-slate-300 via-slate-400 to-slate-500', shadow: 'shadow-slate-500/50' },
                                { bg: 'from-orange-400 via-amber-500 to-yellow-600', shadow: 'shadow-orange-500/50' },
                                { bg: 'from-purple-400 via-purple-500 to-indigo-600', shadow: 'shadow-purple-500/50' },
                                { bg: 'from-blue-400 via-blue-500 to-cyan-600', shadow: 'shadow-blue-500/50' }
                            ];

                            return (
                                <div
                                    key={i}
                                    className="relative group bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-sm border border-white/20 hover:border-white/40 rounded-2xl p-5 hover:scale-105 transition-all duration-300 cursor-pointer overflow-hidden"
                                >
                                    {/* Background glow */}
                                    <div className={`absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br ${gradients[i].bg} opacity-10 rounded-full blur-3xl group-hover:opacity-20 transition-opacity duration-300`}></div>

                                    {/* Avatar */}
                                    <div className="flex justify-center mb-4 relative">
                                        <div className={`w-20 h-20 bg-gradient-to-br ${gradients[i].bg} rounded-full flex items-center justify-center shadow-2xl ${gradients[i].shadow} border-4 border-white/20 group-hover:scale-110 transition-transform duration-300`}>
                                            <span className="text-2xl font-bold text-white">
                                                {customer.name.charAt(0).toUpperCase()}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Info */}
                                    <div className="text-center space-y-2 relative">
                                        <p className="font-bold text-white text-sm leading-tight line-clamp-1">
                                            {customer.name.toUpperCase()}
                                        </p>
                                        <div className="flex items-center justify-center gap-1 text-xs text-purple-300/70">
                                            <Star className="w-3 h-3 fill-purple-400 text-purple-400" />
                                            <span>{customer.totalBookings} Bookings</span>
                                        </div>
                                        <p className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
                                            ${customer.totalSpent.toFixed(2)}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
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
    );
};

export default Analytics;