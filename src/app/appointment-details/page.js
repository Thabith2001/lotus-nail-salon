
"use client";
import React, { useState, useEffect } from "react";
import {
    Calendar,
    Clock,
    Star,
    CreditCard,
    CheckCircle,
    AlertCircle,
    XCircle,
    Eye,
    Download,
    Filter,
    Search,
    ChevronDown,
    Sparkles,
    Crown,
    Gift,
    Brush,
    Heart,
    Palette,
    Receipt,
    Repeat,
    Plus,
} from "lucide-react";
import { useSparkles } from "@/hooks/useSparkles";

const BookingHistory = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [activeTab, setActiveTab] = useState("all");
    const [filterStatus, setFilterStatus] = useState("all");
    const [searchTerm, setSearchTerm] = useState("");
    const [showFilters, setShowFilters] = useState(false);

    const sparkles = useSparkles(20);

    const bookingHistory = [
        {
            id: "LSP-2024-001234",
            type: "booking",
            service: {
                name: "Luxury Gel Manicure",
                category: "manicure",
                duration: 60,
            },
            date: "2024-03-25",
            time: "14:30",
            status: "completed",
            amount: 65,
            paymentMethod: "Credit Card",
            rating: 5,
            review: "Amazing service! The nail art was exactly what I wanted.",
            canRebook: true,
            canReview: false,
        },
        {
            id: "LSP-2024-001235",
            type: "booking",
            service: {
                name: "Custom Nail Art",
                category: "nail-art",
                duration: 90,
            },
            date: "2024-04-15",
            time: "10:00",
            status: "upcoming",
            amount: 85,
            paymentMethod: "Credit Card",
            canRebook: false,
            canReview: false,
            canCancel: true,
        },
        {
            id: "LSP-MEM-2024-001",
            type: "membership",
            plan: {
                name: "Silver Membership",
                tier: "silver",
                duration: "Monthly",
            },
            purchaseDate: "2024-03-01",
            expiryDate: "2024-04-01",
            status: "active",
            amount: 149,
            paymentMethod: "Credit Card",
            servicesUsed: 2,
            servicesTotal: 3,
            autoRenewal: true,
        },
        {
            id: "LSP-2024-001236",
            type: "booking",
            service: {
                name: "Classic Pedicure",
                category: "pedicure",
                duration: 45,
            },
            date: "2024-02-20",
            time: "16:00",
            status: "cancelled",
            amount: 55,
            paymentMethod: "Credit Card",
            refundAmount: 55,
            canRebook: true,
            canReview: false,
        },
    ];

    const filteredHistory = bookingHistory.filter((item) => {
        const matchesTab =
            activeTab === "all" ||
            (activeTab === "bookings" && item.type === "booking") ||
            (activeTab === "memberships" && item.type === "membership");

        const matchesStatus = filterStatus === "all" || item.status === filterStatus;

        const matchesSearch =
            searchTerm === "" ||
            (item.type === "booking" &&
                item.service.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (item.type === "membership" &&
                item.plan.name.toLowerCase().includes(searchTerm.toLowerCase()));

        return matchesTab && matchesStatus && matchesSearch;
    });

    useEffect(() => {
        setIsVisible(true);
    }, []);

    const getStatusColor = (status) => {
        switch (status) {
            case "completed":
                return "from-green-400 to-emerald-500";
            case "upcoming":
                return "from-blue-400 to-cyan-500";
            case "cancelled":
                return "from-red-400 to-pink-500";
            case "active":
                return "from-green-400 to-emerald-500";
            case "expired":
                return "from-gray-400 to-gray-500";
            default:
                return "from-purple-400 to-pink-500";
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case "completed":
                return <CheckCircle className="w-5 h-5" />;
            case "upcoming":
                return <Clock className="w-5 h-5" />;
            case "cancelled":
                return <XCircle className="w-5 h-5" />;
            case "active":
                return <CheckCircle className="w-5 h-5" />;
            case "expired":
                return <AlertCircle className="w-5 h-5" />;
            default:
                return <Clock className="w-5 h-5" />;
        }
    };

    const getServiceIcon = (category) => {
        switch (category) {
            case "manicure":
                return <Brush className="w-5 h-5 text-pink-400" />;
            case "pedicure":
                return <Heart className="w-5 h-5 text-pink-400" />;
            case "nail-art":
                return <Palette className="w-5 h-5 text-pink-400" />;
            default:
                return <Sparkles className="w-5 h-5 text-pink-400" />;
        }
    };

    const getMembershipIcon = (tier) => {
        switch (tier) {
            case "gold":
                return <Crown className="w-5 h-5 text-yellow-400" />;
            case "silver":
                return <Star className="w-5 h-5 text-gray-300" />;
            case "bronze":
                return <Gift className="w-5 h-5 text-orange-400" />;
            default:
                return <Crown className="w-5 h-5 text-pink-400" />;
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    const formatTime = (timeString) => {
        return new Date(`2024-01-01T${timeString}`).toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
        });
    };

    return (
        <div className="min-h-screen w-full bg-gradient-to-br from-slate-900 via-purple-900 to-pink-900 relative overflow-hidden py-12">
            {/* Background Effects */}
            <div className="absolute inset-0 overflow-hidden">
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

                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-br from-pink-400/10 to-purple-400/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-br from-purple-400/10 to-pink-400/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-6">
                {/* Header */}
                <div
                    className={`text-center mb-12 transition-all duration-1000 ${
                        isVisible
                            ? "opacity-100 translate-y-0"
                            : "opacity-0 translate-y-10"
                    }`}
                >
                    <div className="inline-flex items-center px-6 py-2 mb-8 bg-white/10 backdrop-blur-lg border border-white/20 rounded-full">
                        <Receipt className="w-4 h-4 text-pink-400 mr-3" />
                        <span className="text-sm font-medium text-white/90 tracking-wide">
              BOOKING HISTORY
            </span>
                    </div>

                    <h1 className="text-4xl md:text-6xl font-black leading-tight mb-4">
            <span className="bg-gradient-to-r from-white via-pink-200 to-purple-200 bg-clip-text text-transparent drop-shadow-2xl">
              Your Beauty
            </span>
                        <br />
                        <span className="bg-gradient-to-r from-pink-300 via-rose-200 to-white bg-clip-text text-transparent drop-shadow-2xl">
              Journey
            </span>
                    </h1>

                    <p className="text-xl text-white/70 max-w-2xl mx-auto">
                        Track your appointments, memberships, and spa experiences
                    </p>
                </div>

                {/* Tabs and Filters */}
                <div
                    className={`mb-8 transition-all duration-1000 delay-200 ${
                        isVisible
                            ? "opacity-100 translate-y-0"
                            : "opacity-0 translate-y-10"
                    }`}
                >
                    {/* Tab Navigation */}
                    <div className="flex flex-wrap justify-center gap-4 mb-6">
                        {[
                            { id: "all", name: "All History", icon: Receipt },
                            { id: "bookings", name: "Appointments", icon: Calendar },
                            { id: "memberships", name: "Memberships", icon: Crown },
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
                                <tab.icon className="w-4 h-4" />
                                <span>{tab.name}</span>
                            </button>
                        ))}
                    </div>

                    {/* Search and Filters */}
                    <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                        {/* Search */}
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/50" />
                            <input
                                type="text"
                                placeholder="Search appointments or memberships..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 bg-white/10 backdrop-blur-lg border border-white/20 rounded-full text-white placeholder-white/50 focus:outline-none focus:border-pink-300/50 transition-colors duration-300"
                            />
                        </div>

                        {/* Filter Dropdown */}
                        <div className="relative">
                            <button
                                onClick={() => setShowFilters(!showFilters)}
                                className="flex items-center space-x-2 px-6 py-3 bg-white/10 backdrop-blur-lg border border-white/20 rounded-full text-white hover:bg-white/20 transition-colors duration-300"
                            >
                                <Filter className="w-4 h-4" />
                                <span>Status</span>
                                <ChevronDown
                                    className={`w-4 h-4 transition-transform duration-300 ${
                                        showFilters ? "rotate-180" : ""
                                    }`}
                                />
                            </button>

                            {showFilters && (
                                <div
                                    className="absolute top-full mt-2 right-0 bg-white/10 backdrop-blur-xl
                  border border-white/20 rounded-xl shadow-2xl p-2 min-w-48
                  z-[9999]"
                                >
                                    {["all", "completed", "upcoming", "cancelled", "active"].map(
                                        (status) => (
                                            <button
                                                key={status}
                                                onClick={() => {
                                                    setFilterStatus(status);
                                                    setShowFilters(false);
                                                }}
                                                className={`w-full text-left px-4 py-2 rounded-lg transition-colors duration-200 ${
                                                    filterStatus === status
                                                        ? "bg-pink-500/20 text-pink-300"
                                                        : "text-white/80 hover:bg-white/10"
                                                }`}
                                            >
                                                {status.charAt(0).toUpperCase() + status.slice(1)}
                                            </button>
                                        )
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* History Items */}
                <div className={`space-y-6 transition-all duration-1000 delay-400 z-20 ${
                    isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}>
                    {filteredHistory.length === 0 ? (
                        <div className="text-center py-16">
                            <div className="w-24 h-24 bg-white/5 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-6">
                                <Receipt className="w-12 h-12 text-white/30" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">No history found</h3>
                            <p className="text-white/60 mb-6">Try adjusting your filters or search terms</p>
                            <button className="px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold rounded-full hover:scale-105 transition-transform duration-300">
                                Book New Appointment
                            </button>
                        </div>
                    ) : (
                        filteredHistory.map((item, index) => (
                            <div
                                key={item.id}
                                className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden hover:shadow-2xl hover:shadow-pink-500/10 transition-all duration-300"
                            >
                                {item.type === 'booking' ? (
                                    /* Booking Item */
                                    <div className="p-6">
                                        <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                                            <div className="flex items-center space-x-4 mb-4 md:mb-0">
                                                <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-purple-500 rounded-xl flex items-center justify-center">
                                                    {getServiceIcon(item.service.category)}
                                                </div>
                                                <div>
                                                    <h3 className="text-lg font-bold text-white">{item.service.name}</h3>
                                                    <p className="text-white/60 text-sm">Booking ID: {item.id}</p>
                                                </div>
                                            </div>

                                            <div className={`inline-flex items-center space-x-2 px-3 py-1 bg-gradient-to-r ${getStatusColor(item.status)} rounded-full text-white text-sm font-medium`}>
                                                {getStatusIcon(item.status)}
                                                <span>{item.status.charAt(0).toUpperCase() + item.status.slice(1)}</span>
                                            </div>
                                        </div>

                                        <div className="grid md:grid-cols-4 gap-4 mb-6">
                                            <div className="flex items-center space-x-3">
                                                <Calendar className="w-4 h-4 text-pink-400" />
                                                <div>
                                                    <p className="text-white/80 text-sm">Date</p>
                                                    <p className="text-white font-medium">{formatDate(item.date)}</p>
                                                </div>
                                            </div>

                                            <div className="flex items-center space-x-3">
                                                <Clock className="w-4 h-4 text-pink-400" />
                                                <div>
                                                    <p className="text-white/80 text-sm">Time</p>
                                                    <p className="text-white font-medium">{formatTime(item.time)}</p>
                                                </div>
                                            </div>

                                            <div className="flex items-center space-x-3">
                                                <CreditCard className="w-4 h-4 text-pink-400" />
                                                <div>
                                                    <p className="text-white/80 text-sm">Amount</p>
                                                    <p className="text-white font-medium">${item.amount}</p>
                                                </div>
                                            </div>

                                            <div className="flex items-center space-x-3">
                                                <Clock className="w-4 h-4 text-pink-400" />
                                                <div>
                                                    <p className="text-white/80 text-sm">Duration</p>
                                                    <p className="text-white font-medium">{item.service.duration} min</p>
                                                </div>
                                            </div>
                                        </div>

                                        {item.rating && (
                                            <div className="mb-4 p-4 bg-white/5 rounded-xl border border-white/10">
                                                <div className="flex items-center space-x-2 mb-2">
                                                    <span className="text-white/80 text-sm">Your Rating:</span>
                                                    <div className="flex space-x-1">
                                                        {[...Array(5)].map((_, i) => (
                                                            <Star
                                                                key={i}
                                                                className={`w-4 h-4 ${i < item.rating ? 'text-yellow-400 fill-current' : 'text-white/30'}`}
                                                            />
                                                        ))}
                                                    </div>
                                                </div>
                                                {item.review && (
                                                    <p className="text-white/70 text-sm italic">&#34;{item.review}&#34;</p>
                                                )}
                                            </div>
                                        )}

                                        <div className="flex flex-wrap gap-3">
                                            <button className="flex items-center space-x-2 px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-white/80 hover:bg-white/20 transition-colors duration-300">
                                                <Eye className="w-4 h-4" />
                                                <span>View Details</span>
                                            </button>

                                            <button className="flex items-center space-x-2 px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-white/80 hover:bg-white/20 transition-colors duration-300">
                                                <Download className="w-4 h-4" />
                                                <span>Receipt</span>
                                            </button>

                                            {item.canRebook && (
                                                <button className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-full hover:scale-105 transition-transform duration-300">
                                                    <Repeat className="w-4 h-4" />
                                                    <span>Book Again</span>
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ) : (
                                    /* Membership Item */
                                    <div className="p-6">
                                        <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                                            <div className="flex items-center space-x-4 mb-4 md:mb-0">
                                                <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center">
                                                    {getMembershipIcon(item.plan.tier)}
                                                </div>
                                                <div>
                                                    <h3 className="text-lg font-bold text-white">{item.plan.name}</h3>
                                                    <p className="text-white/60 text-sm">Membership ID: {item.id}</p>
                                                </div>
                                            </div>

                                            <div className={`inline-flex items-center space-x-2 px-3 py-1 bg-gradient-to-r ${getStatusColor(item.status)} rounded-full text-white text-sm font-medium`}>
                                                {getStatusIcon(item.status)}
                                                <span>{item.status.charAt(0).toUpperCase() + item.status.slice(1)}</span>
                                            </div>
                                        </div>

                                        <div className="grid md:grid-cols-4 gap-4 mb-6">
                                            <div className="flex items-center space-x-3">
                                                <Calendar className="w-4 h-4 text-pink-400" />
                                                <div>
                                                    <p className="text-white/80 text-sm">Start Date</p>
                                                    <p className="text-white font-medium">{formatDate(item.purchaseDate)}</p>
                                                </div>
                                            </div>

                                            <div className="flex items-center space-x-3">
                                                <Clock className="w-4 h-4 text-pink-400" />
                                                <div>
                                                    <p className="text-white/80 text-sm">Expires</p>
                                                    <p className="text-white font-medium">{formatDate(item.expiryDate)}</p>
                                                </div>
                                            </div>

                                            <div className="flex items-center space-x-3">
                                                <CreditCard className="w-4 h-4 text-pink-400" />
                                                <div>
                                                    <p className="text-white/80 text-sm">Monthly Fee</p>
                                                    <p className="text-white font-medium">${item.amount}</p>
                                                </div>
                                            </div>

                                            <div className="flex items-center space-x-3">
                                                <Star className="w-4 h-4 text-pink-400" />
                                                <div>
                                                    <p className="text-white/80 text-sm">Services Used</p>
                                                    <p className="text-white font-medium">{item.servicesUsed}/{item.servicesTotal}</p>
                                                </div>
                                            </div>
                                        </div>

                                        {item.status === 'active' && (
                                            <div className="mb-4 p-4 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-xl border border-green-300/20">
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <p className="text-green-300 font-semibold text-sm">Membership Active</p>
                                                        <p className="text-white/70 text-sm">
                                                            {item.autoRenewal ? 'Auto-renewal enabled' : 'Manual renewal required'}
                                                        </p>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-green-300 text-sm">Services Remaining</p>
                                                        <p className="text-white font-bold">{item.servicesTotal - item.servicesUsed}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        <div className="flex flex-wrap gap-3">
                                            <button className="flex items-center space-x-2 px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-white/80 hover:bg-white/20 transition-colors duration-300">
                                                <Eye className="w-4 h-4" />
                                                <span>View Details</span>
                                            </button>

                                            <button className="flex items-center space-x-2 px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-white/80 hover:bg-white/20 transition-colors duration-300">
                                                <Download className="w-4 h-4" />
                                                <span>Invoice</span>
                                            </button>

                                            {item.status === 'active' && (
                                                <button className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-full hover:scale-105 transition-transform duration-300">
                                                    <Plus className="w-4 h-4" />
                                                    <span>Book Service</span>
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                </div>

                {/* Bottom CTA */}
                {filteredHistory.length > 0 && (
                    <div className={`text-center mt-12 transition-all duration-1000 delay-600 ${
                        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                    }`}>
                        <button className="px-8 py-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold rounded-full shadow-2xl hover:shadow-pink-500/25 transition-all duration-300 hover:scale-105">
                            <span className="flex items-center gap-2">
                                <Plus className="w-5 h-5" />
                                Book New Appointment
                            </span>
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BookingHistory;