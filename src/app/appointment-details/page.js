"use client";
import React, {createContext, useEffect, useState} from "react";
import {useAuth} from "@/context/authContext";
import {useAuthModal} from "@/context/authModelContext";
import {useRouter} from "next/navigation";
import axios from "axios";
import BookingHistoryCard from "@/components/bookingHistory/bookingHistoryCard";
import {
    ArrowLeft,
    Calendar,
    Crown,
    Receipt,
    Search,
    X
} from "lucide-react";
import {useSparkles} from "@/hooks/useSparkles";

export const BookingHistoryContext = createContext();

const BookingHistory = () => {
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [loadingAuth, setLoadingAuth] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [history, setHistory] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [activeTab, setActiveTab] = useState("all");
    const [isVisible, setIsVisible] = useState(false);

    const {openAuth} = useAuthModal();
    const {user} = useAuth();
    const router = useRouter();
    const sparkles = useSparkles(50);

    // Trigger visibility animation
    useEffect(() => {
        setIsVisible(true);
    }, []);

    // Check authorization
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            openAuth();
        } else {
            setIsAuthorized(true);
        }
        setLoadingAuth(false);
    }, [openAuth]);


    const fetchBookingHistory = async () => {
        if (!user?._id) {
            setIsLoading(false);
            return;
        }

        setIsLoading(true);
        try {
            const bookingRes = await axios.get(`/api/bookings?userId=${user._id}`);
            const bookings = bookingRes.data.bookings || [];

            const bookingsWithDetails = await Promise.all(
                bookings.map(async (b) => {
                    let payment = null;
                    let membership = null;

                    try {
                        if (b.paymentId) {
                            const payRes = await axios.get(`/api/payments/${b.paymentId}`);
                            payment = payRes.data.payment || null;
                        }
                    } catch (err) {
                        console.error(`Payment fetch failed for ${b._id}:`, err);
                    }

                    try {
                        if (b.userMembershipId) {
                            const memRes = await axios.get(
                                `/api/user-membership/${b.userMembershipId}`
                            );
                            membership = memRes.data.membership || null;
                        }
                    } catch (err) {
                        console.error(`Membership fetch failed for ${b._id}:`, err);
                    }

                    return {...b, payment, membership};
                })
            );

            setHistory(bookingsWithDetails);
        } catch (error) {
            console.error("Error fetching booking history:", error);
        } finally {
            setIsLoading(false);
        }
    };
    // Fetch booking history
    useEffect(() => {
        fetchBookingHistory();
    }, [user]);

    // Filter and search logic
    const filteredHistory = history.filter((item) => {
        // Tab filtering
        const isMembership = !!item.membership;

        if (activeTab === "bookings" && isMembership) {
            return false;
        }
        if (activeTab === "memberships" && !isMembership) {
            return false;
        }

        // Search filtering
        if (searchTerm.trim() === "") {
            return true;
        }

        const searchLower = searchTerm.toLowerCase();


        const serviceName = (typeof item.service === 'string'
            ? item.service
            : item.service?.name || '').toLowerCase();


        const membershipName = (item.membership?.membershipId?.name || '').toLowerCase();

        // Get status
        const status = (item.status || item.paymentStatus || '').toLowerCase();

        // Get time
        const time = (item.time || '').toLowerCase();

        // Get ID
        const bookingId = (item._id || item.bookingId || '').toLowerCase();

        // Search in date
        let dateMatch = false;
        if (item.bookingDate) {
            const date = new Date(item.bookingDate);
            const dateStr = date.toLocaleDateString('en-US', {
                day: '2-digit',
                month: 'short',
                year: 'numeric'
            }).toLowerCase();
            const monthYear = date.toLocaleDateString('en-US', {
                month: 'long',
                year: 'numeric'
            }).toLowerCase();

            dateMatch = dateStr.includes(searchLower) || monthYear.includes(searchLower);
        }

        return (
            serviceName.includes(searchLower) ||
            membershipName.includes(searchLower) ||
            status.includes(searchLower) ||
            time.includes(searchLower) ||
            bookingId.includes(searchLower) ||
            dateMatch
        );
    });

    // Count items for each tab
    const allCount = history.length;
    const bookingsCount = history.filter(item => !item.membership).length;
    const membershipsCount = history.filter(item => item.membership).length;

    if (loadingAuth) {
        return (
            <div
                className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-pink-900">
                <div className="text-center">
                    <div
                        className="w-16 h-16 border-4 border-pink-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-white/70">Loading...</p>
                </div>
            </div>
        );
    }

    if (!isAuthorized) {
        return (
            <div
                className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-pink-900">
                <div className="text-center text-white">
                    <p className="text-xl mb-4">Please log in to view your booking history.</p>
                </div>
            </div>
        );
    }

    return (
        <div
            className="min-h-screen w-full bg-gradient-to-br from-slate-900 via-purple-900 to-pink-900 relative overflow-hidden py-12">
            {/* Back Button */}
            <button
                onClick={() => router.back()}
                className="absolute top-4 left-4 flex items-center px-3 py-2 text-white/70 hover:text-white z-50 group"
            >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform"/>
                <span className="ml-2">Back</span>
            </button>

            {/* Background Effects */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {sparkles.map((_, i) => (
                    <div
                        key={i}
                        className="absolute w-1 h-1 bg-pink-300 rounded-full opacity-30 animate-twinkle"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 3}s`,
                            animationDuration: `${2 + Math.random() * 2}s`,
                        }}
                    />
                ))}

                <div
                    className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-br from-pink-400/10 to-purple-400/10 rounded-full blur-3xl animate-pulse"></div>
                <div
                    className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-br from-purple-400/10 to-pink-400/10 rounded-full blur-3xl animate-pulse"></div>
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-6">
                {/* Header */}
                <div
                    className={`text-center mb-12 transition-all duration-1000 ${
                        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                    }`}
                >
                    <div
                        className="inline-flex items-center px-6 py-2 mb-8 bg-white/10 backdrop-blur-lg border border-white/20 rounded-full">
                        <Receipt className="w-4 h-4 text-pink-400 mr-3"/>
                        <span className="text-sm font-medium text-white/90 tracking-wide">
                            BOOKING HISTORY
                        </span>
                    </div>

                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-black leading-tight mb-4">
                        <span
                            className="bg-gradient-to-r from-white via-pink-200 to-purple-200 bg-clip-text text-transparent drop-shadow-2xl">
                            Your Beauty
                        </span>
                        <br/>
                        <span
                            className="bg-gradient-to-r from-pink-300 via-rose-200 to-white bg-clip-text text-transparent drop-shadow-2xl">
                            Journey
                        </span>
                    </h1>

                    <p className="text-xl text-white/70 max-w-2xl mx-auto font-extralight leading-relaxed mb-12">
                        Track your appointments, memberships, and spa experiences
                    </p>
                </div>

                {/* Tabs and Filters */}
                <div
                    className={`mb-8 transition-all duration-1000 delay-200 ${
                        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                    }`}
                >
                    {/* Tab Navigation */}
                    <div className="flex flex-wrap justify-center gap-4 mb-6">
                        {[
                            {id: "all", name: "All History", icon: Receipt, count: allCount},
                            {id: "bookings", name: "Appointments", icon: Calendar, count: bookingsCount},
                            {id: "memberships", name: "Memberships", icon: Crown, count: membershipsCount},
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center space-x-2 px-6 py-3 rounded-full font-semibold transition-all duration-300 hover:scale-105 ${
                                    activeTab === tab.id
                                        ? "bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg shadow-pink-500/25"
                                        : "bg-white/10 backdrop-blur-lg border border-white/20 text-white/80 hover:bg-white/20"
                                }`}
                            >
                                <tab.icon className="w-4 h-4"/>
                                <span>{tab.name}</span>
                                <span className={`ml-1 px-2 py-0.5 rounded-full text-xs font-bold ${
                                    activeTab === tab.id ? "bg-white/20" : "bg-white/10"
                                }`}>
                                    {tab.count}
                                </span>
                            </button>
                        ))}
                    </div>

                    {/* Search Bar */}
                    <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                        <div className="relative flex-1 max-w-md w-full">
                            <Search
                                className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/50"/>
                            <input
                                type="text"
                                placeholder="Search by service, date, status..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 bg-white/10 backdrop-blur-lg border border-white/20 rounded-full text-white placeholder-white/50 focus:outline-none focus:border-pink-300/50 transition-colors duration-300"
                            />
                        </div>

                        <div className="text-white/60 text-sm whitespace-nowrap">
                            Showing {filteredHistory.length} of {history.length} items
                        </div>
                    </div>

                    {/* Active Filters Display */}
                    {(searchTerm || activeTab !== "all") && (
                        <div
                            className="flex flex-wrap items-center gap-2 mt-4 p-3 bg-white/5 rounded-2xl border border-white/10">
                            <span className="text-white/60 text-sm">Active filters:</span>

                            {activeTab !== "all" && (
                                <span
                                    className="inline-flex items-center space-x-1 px-3 py-1 bg-pink-500/20 border border-pink-300/30 rounded-full text-pink-300 text-sm">
                                    <span>{activeTab === "bookings" ? "Appointments" : "Memberships"}</span>
                                    <button
                                        onClick={() => setActiveTab("all")}
                                        className="ml-1 hover:bg-pink-500/30 rounded-full p-0.5"
                                    >
                                        <X className="w-3 h-3"/>
                                    </button>
                                </span>
                            )}

                            {searchTerm && (
                                <span
                                    className="inline-flex items-center space-x-1 px-3 py-1 bg-purple-500/20 border border-purple-300/30 rounded-full text-purple-300 text-sm">
                                    <span>Search: &quot;{searchTerm}&quot;</span>
                                    <button
                                        onClick={() => setSearchTerm("")}
                                        className="ml-1 hover:bg-purple-500/30 rounded-full p-0.5"
                                    >
                                        <X className="w-3 h-3"/>
                                    </button>
                                </span>
                            )}

                            <button
                                onClick={() => {
                                    setSearchTerm("");
                                    setActiveTab("all");
                                }}
                                className="ml-auto text-xs text-white/50 hover:text-white/80 underline"
                            >
                                Clear all filters
                            </button>
                        </div>
                    )}
                </div>

                {/* Content */}
                {isLoading ? (
                    <div className="text-center py-16">
                        <div
                            className="w-16 h-16 border-4 border-pink-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-white/70">Loading your bookings...</p>
                    </div>
                ) : filteredHistory.length > 0 ? (

                        <BookingHistoryContext.Provider value={{bookingHistory: filteredHistory}}>
                            <BookingHistoryCard/>
                        </BookingHistoryContext.Provider>

                ) : (
                    <div className="text-center text-white/60 mt-8 py-16">
                        <Receipt className="w-16 h-16 mx-auto mb-4 opacity-50"/>
                        <p className="text-lg mb-2">
                            {searchTerm || activeTab !== "all"
                                ? "No matching bookings found."
                                : "No bookings found."}
                        </p>
                        {(searchTerm || activeTab !== "all") && (
                            <button
                                onClick={() => {
                                    setSearchTerm("");
                                    setActiveTab("all");
                                }}
                                className="mt-4 px-6 py-2 bg-pink-500/20 border border-pink-300/30 rounded-full text-pink-300 hover:bg-pink-500/30 transition-colors"
                            >
                                Clear filters
                            </button>
                        )}
                    </div>
                )}
            </div>

        </div>

    );
};

export default BookingHistory;