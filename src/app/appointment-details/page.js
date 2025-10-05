"use client";
import React, {useState, useEffect} from "react";
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
    CalendarClock,
    X, ArrowLeft,
} from "lucide-react";
import {useSparkles} from "@/hooks/useSparkles";
import {useAuth} from "@/context/contextAuth";
import axios from "axios";
import {timeSlots} from "@/data/data";
import {useRouter} from "next/navigation";
import {useAuthModal} from "@/context/authModelContext";

const BookingHistory = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [activeTab, setActiveTab] = useState("all");
    const [filterStatus, setFilterStatus] = useState("all");
    const [searchTerm, setSearchTerm] = useState("");
    const [showFilters, setShowFilters] = useState(false);
    const [bookedData, setBookedData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [showRescheduleModal, setShowRescheduleModal] = useState(false);
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [rescheduleDate, setRescheduleDate] = useState("");
    const [rescheduleTime, setRescheduleTime] = useState("");
    const [cancelReason, setCancelReason] = useState("");
    const [bookingDate, setBookingDate] = useState(null);
    const {user} = useAuth();
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [loadingAuth, setLoadingAuth] = useState(true);
    const {openAuth} = useAuthModal();
    const router = useRouter();
    const sparkles = useSparkles(20);


    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) openAuth(); else setIsAuthorized(true);
        setLoadingAuth(false);
    }, [openAuth]);


    useEffect(() => {
        const fetchBookingHistory = async () => {
            if (!user?._id) {
                setIsLoading(false);
                return;
            }

            setIsLoading(true);
            try {

                const bookingRes = await axios.get(`/api/bookings?userId=${user._id}`);
                const bookings = bookingRes.data.bookings || [];
                console.log("Bookings:", bookings);

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
                                const memRes = await axios.get(`/api/user-membership/${b.userMembershipId}`);
                                membership = memRes.data.membership || null;
                            }
                        } catch (err) {
                            console.error(`Membership fetch failed for ${b._id}:`, err);
                        }

                        return {...b, payment, membership};
                    })
                );


                setBookedData(bookingsWithDetails);
                console.log("Bookings with payment + membership:", bookingsWithDetails);

            } catch (error) {
                console.error("Error fetching booking history:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchBookingHistory();
    }, [user]);

    // Transform fetched data into display format
    const bookingHistory = React.useMemo(() => {
        if (!bookedData) return [];

        return bookedData.map(booking => {
            const isUpcoming = new Date(booking.bookingDate) > new Date();
            const isMembership = !!booking.userMembershipId;

            if (isMembership && booking.membership) {
                // Membership item
                return {
                    id: booking.bookingId,
                    type: "membership",
                    plan: {
                        name: booking.service || "Membership",
                        tier: booking.service?.toLowerCase().includes("gold") ? "gold" :
                            booking.service?.toLowerCase().includes("silver") ? "silver" : "bronze",
                        duration: "Monthly",
                    },
                    purchaseDate: booking.membership.startDate,
                    expiryDate: booking.membership.endDate,
                    status: booking.membership.status,
                    amount: booking.payment?.amount || 0,
                    paymentMethod: booking.payment?.method === "credit_card" ? "Credit Card" : "Other",
                    servicesUsed: (booking.membership.remainingSessions || 0) === 0 ? 3 : 3 - booking.membership.remainingSessions,
                    servicesTotal: 3,
                    autoRenewal: false,
                    canRebook: true,
                };
            } else {
                // Regular booking item
                return {
                    id: booking.bookingId,
                    type: "booking",
                    service: {
                        name: booking.service,
                        category: booking.service?.toLowerCase().includes("manicure") ? "manicure" :
                            booking.service?.toLowerCase().includes("pedicure") ? "pedicure" : "nail-art",
                        duration: 60,
                    },
                    date: booking.bookingDate,
                    time: booking.time,
                    status: isUpcoming ? "upcoming" :
                        booking.paymentStatus === "succeeded" ? "completed" : "cancelled",
                    amount: booking.payment?.amount || 0,
                    paymentMethod: booking.payment?.method === "credit_card" ? "Credit Card" : "Other",
                    canRebook: true,
                    canReview: !isUpcoming,
                };
            }
        });
    }, [bookedData]);


    const fetchBookings = async ({selectedDate}) => {
        if (!selectedDate) return null;

        try {
            const res = await axios.get(`/api/bookings?date=${selectedDate}`);
            const bookings = res.data.bookings;
            setBookingDate(bookings?.results);
            console.log("Bookings with payment + membership:", bookings);

        } catch (error) {

        }
    }

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
                return <CheckCircle className="w-5 h-5"/>;
            case "upcoming":
                return <Clock className="w-5 h-5"/>;
            case "cancelled":
                return <XCircle className="w-5 h-5"/>;
            case "active":
                return <CheckCircle className="w-5 h-5"/>;
            case "expired":
                return <AlertCircle className="w-5 h-5"/>;
            default:
                return <Clock className="w-5 h-5"/>;
        }
    };

    const getServiceIcon = (category) => {
        switch (category) {
            case "manicure":
                return <Brush className="w-5 h-5 text-pink-400"/>;
            case "pedicure":
                return <Heart className="w-5 h-5 text-pink-400"/>;
            case "nail-art":
                return <Palette className="w-5 h-5 text-pink-400"/>;
            default:
                return <Sparkles className="w-5 h-5 text-pink-400"/>;
        }
    };

    const getMembershipIcon = (tier) => {
        switch (tier) {
            case "gold":
                return <Crown className="w-5 h-5 text-yellow-400"/>;
            case "silver":
                return <Star className="w-5 h-5 text-gray-300"/>;
            case "bronze":
                return <Gift className="w-5 h-5 text-orange-400"/>;
            default:
                return <Crown className="w-5 h-5 text-pink-400"/>;
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

    const handleReschedule = (booking) => {
        setSelectedBooking(booking);
        setRescheduleDate(booking.date);
        setRescheduleTime(booking.time);
        setShowRescheduleModal(true);
    };

    const handleCancelBooking = (booking) => {
        setSelectedBooking(booking);
        setShowCancelModal(true);
    };

    const confirmReschedule = async () => {
        try {
            await axios.patch(`/api/bookings/${selectedBooking.id}`, {
                bookingDate: rescheduleDate,
                time: rescheduleTime
            });

            console.log("Rescheduling booking:", selectedBooking.id, {
                newDate: rescheduleDate,
                newTime: rescheduleTime
            });

            // Update local state
            setBookedData(prev =>
                prev.map(booking =>
                    booking.bookingId === selectedBooking.id
                        ? {...booking, bookingDate: rescheduleDate, time: rescheduleTime}
                        : booking
                )
            );

            setShowRescheduleModal(false);
            setSelectedBooking(null);
            setRescheduleDate("");
            setRescheduleTime("");
        } catch (error) {
            console.error("Error rescheduling booking:", error);
            alert("Failed to reschedule booking. Please try again.");
        }
    };

    const confirmCancel = async () => {
        try {
            // TODO: Replace with your actual API endpoint
            // await axios.put(`/api/bookings/${selectedBooking.id}`, {
            //     status: 'cancelled',
            //     cancelReason: cancelReason
            // });

            console.log("Cancelling booking:", selectedBooking.id, {
                reason: cancelReason
            });

            // Update local state
            setBookedData(prev =>
                prev.map(booking =>
                    booking.bookingId === selectedBooking.id
                        ? {...booking, paymentStatus: 'cancelled'}
                        : booking
                )
            );

            setShowCancelModal(false);
            setSelectedBooking(null);
            setCancelReason("");
        } catch (error) {
            console.error("Error cancelling booking:", error);
            alert("Failed to cancel booking. Please try again.");
        }
    };

    if (loadingAuth) return <div className="min-h-screen flex items-center justify-center text-white">Checking
        authentication...</div>;
    if (!isAuthorized) return <div className="min-h-screen flex items-center justify-center text-white">Redirecting to
        login...</div>;

    return (
        <div
            className="min-h-screen w-full bg-gradient-to-br from-slate-900 via-purple-900 to-pink-900 relative overflow-hidden py-12">
            <div className="grid-cols-12">
                <button
                    onClick={() => router.back()}
                    className="absolute top-4 left-4 flex items-center px-3 py-2 text-white/70 hover:text-white z-50 group"
                >
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform"/>
                    <span className="ml-2">Back</span>
                </button>
            </div>
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

                <div
                    className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-br from-pink-400/10 to-purple-400/10 rounded-full blur-3xl animate-pulse"></div>
                <div
                    className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-br from-purple-400/10 to-pink-400/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
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
                    <div
                        className="inline-flex items-center px-6 py-2 mb-8 bg-white/10 backdrop-blur-lg border border-white/20 rounded-full">
                        <Receipt className="w-4 h-4 text-pink-400 mr-3"/>
                        <span className="text-sm font-medium text-white/90 tracking-wide">
              BOOKING HISTORY
            </span>
                    </div>

                    <h1 className="text-4xl md:text-6xl font-black leading-tight mb-4">
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
                            {id: "all", name: "All History", icon: Receipt},
                            {id: "bookings", name: "Appointments", icon: Calendar},
                            {id: "memberships", name: "Memberships", icon: Crown},
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
                            </button>
                        ))}
                    </div>

                    {/* Search and Filters */}
                    <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                        {/* Search */}
                        <div className="relative flex-1 max-w-md">
                            <Search
                                className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/50"/>
                            <input
                                type="text"
                                placeholder="Search appointments or memberships..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 bg-white/10 backdrop-blur-lg border border-white/20 rounded-full text-white placeholder-white/50 focus:outline-none focus:border-pink-300/50 transition-colors duration-300"
                            />
                        </div>
                    </div>
                </div>

                {/* History Items */}
                <div className={`space-y-6 transition-all duration-1000 delay-400 z-20 ${
                    isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}>
                    {isLoading ? (
                        <div className="text-center py-16">
                            <div
                                className="w-16 h-16 border-4 border-pink-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                            <p className="text-white/70">Loading your booking history...</p>
                        </div>
                    ) : filteredHistory.length === 0 ? (
                        <div className="text-center py-16">
                            <div
                                className="w-24 h-24 bg-white/5 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-6">
                                <Receipt className="w-12 h-12 text-white/30"/>
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">No history found</h3>
                            <p className="text-white/60 mb-6">Try adjusting your filters or search terms</p>
                            <button
                                className="px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold rounded-full hover:scale-105 transition-transform duration-300">
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
                                                <div
                                                    className="w-12 h-12 bg-gradient-to-br from-pink-400 to-purple-500 rounded-xl flex items-center justify-center">
                                                    {getServiceIcon(item.service.category)}
                                                </div>
                                                <div>
                                                    <h3 className="text-lg font-bold text-white">{item.service.name}</h3>
                                                    <p className="text-white/60 text-sm">Booking ID: {item.id}</p>
                                                </div>
                                            </div>

                                            <div
                                                className={`inline-flex items-center space-x-2 px-3 py-1 bg-gradient-to-r ${getStatusColor(item.status)} rounded-full text-white text-sm font-medium`}>
                                                {getStatusIcon(item.status)}
                                                <span>{item.status.charAt(0).toUpperCase() + item.status.slice(1)}</span>
                                            </div>
                                        </div>

                                        <div className="grid md:grid-cols-4 gap-4 mb-6">
                                            <div className="flex items-center space-x-3">
                                                <Calendar className="w-4 h-4 text-pink-400"/>
                                                <div>
                                                    <p className="text-white/80 text-sm">Date</p>
                                                    <p className="text-white font-medium">{formatDate(item.date)}</p>
                                                </div>
                                            </div>

                                            <div className="flex items-center space-x-3">
                                                <Clock className="w-4 h-4 text-pink-400"/>
                                                <div>
                                                    <p className="text-white/80 text-sm">Time</p>
                                                    <p className="text-white font-medium">{item.time}</p>
                                                </div>
                                            </div>

                                            <div className="flex items-center space-x-3">
                                                <CreditCard className="w-4 h-4 text-pink-400"/>
                                                <div>
                                                    <p className="text-white/80 text-sm">Amount</p>
                                                    <p className="text-white font-medium">${item.amount}</p>
                                                </div>
                                            </div>

                                            <div className="flex items-center space-x-3">
                                                <Clock className="w-4 h-4 text-pink-400"/>
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
                                            <button
                                                className="flex items-center space-x-2 px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-white/80 hover:bg-white/20 transition-colors duration-300">
                                                <Eye className="w-4 h-4"/>
                                                <span>View Details</span>
                                            </button>

                                            <button
                                                className="flex items-center space-x-2 px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-white/80 hover:bg-white/20 transition-colors duration-300">
                                                <Download className="w-4 h-4"/>
                                                <span>Receipt</span>
                                            </button>

                                            {item.status === 'upcoming' && (
                                                <>
                                                    <button
                                                        onClick={() => handleReschedule(item)}
                                                        className="flex items-center space-x-2 px-4 py-2 bg-blue-500/20 backdrop-blur-sm border border-blue-300/30 rounded-full text-blue-300 hover:bg-blue-500/30 transition-colors duration-300">
                                                        <CalendarClock className="w-4 h-4"/>
                                                        <span>Reschedule</span>
                                                    </button>

                                                    <button
                                                        onClick={() => handleCancelBooking(item)}
                                                        className="flex items-center space-x-2 px-4 py-2 bg-red-500/20 backdrop-blur-sm border border-red-300/30 rounded-full text-red-300 hover:bg-red-500/30 transition-colors duration-300">
                                                        <X className="w-4 h-4"/>
                                                        <span>Cancel</span>
                                                    </button>
                                                </>
                                            )}

                                            {item.canRebook && item.status !== 'upcoming' && (
                                                <button
                                                    className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-full hover:scale-105 transition-transform duration-300">
                                                    <Repeat className="w-4 h-4"/>
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
                                                <div
                                                    className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center">
                                                    {getMembershipIcon(item.plan.tier)}
                                                </div>
                                                <div>
                                                    <h3 className="text-lg font-bold text-white">{item.plan.name}</h3>
                                                    <p className="text-white/60 text-sm">Membership ID: {item.id}</p>
                                                </div>
                                            </div>

                                            <div
                                                className={`inline-flex items-center space-x-2 px-3 py-1 bg-gradient-to-r ${getStatusColor(item.status)} rounded-full text-white text-sm font-medium`}>
                                                {getStatusIcon(item.status)}
                                                <span>{item.status.charAt(0).toUpperCase() + item.status.slice(1)}</span>
                                            </div>
                                        </div>

                                        <div className="grid md:grid-cols-4 gap-4 mb-6">
                                            <div className="flex items-center space-x-3">
                                                <Calendar className="w-4 h-4 text-pink-400"/>
                                                <div>
                                                    <p className="text-white/80 text-sm">Start Date</p>
                                                    <p className="text-white font-medium">{formatDate(item.purchaseDate)}</p>
                                                </div>
                                            </div>

                                            <div className="flex items-center space-x-3">
                                                <Clock className="w-4 h-4 text-pink-400"/>
                                                <div>
                                                    <p className="text-white/80 text-sm">Expires</p>
                                                    <p className="text-white font-medium">{formatDate(item.expiryDate)}</p>
                                                </div>
                                            </div>

                                            <div className="flex items-center space-x-3">
                                                <CreditCard className="w-4 h-4 text-pink-400"/>
                                                <div>
                                                    <p className="text-white/80 text-sm">Monthly Fee</p>
                                                    <p className="text-white font-medium">${item.amount}</p>
                                                </div>
                                            </div>

                                            <div className="flex items-center space-x-3">
                                                <Star className="w-4 h-4 text-pink-400"/>
                                                <div>
                                                    <p className="text-white/80 text-sm">Services Used</p>
                                                    <p className="text-white font-medium">{item.servicesUsed}/{item.servicesTotal}</p>
                                                </div>
                                            </div>
                                        </div>

                                        {item.status === 'active' && (
                                            <div
                                                className="mb-4 p-4 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-xl border border-green-300/20">
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <p className="text-green-300 font-semibold text-sm">Membership
                                                            Active</p>
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
                                            <button
                                                className="flex items-center space-x-2 px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-white/80 hover:bg-white/20 transition-colors duration-300">
                                                <Eye className="w-4 h-4"/>
                                                <span>View Details</span>
                                            </button>

                                            <button
                                                className="flex items-center space-x-2 px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-white/80 hover:bg-white/20 transition-colors duration-300">
                                                <Download className="w-4 h-4"/>
                                                <span>Invoice</span>
                                            </button>

                                            {item.status === 'active' && (
                                                <button
                                                    className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-full hover:scale-105 transition-transform duration-300">
                                                    <Plus className="w-4 h-4"/>
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
                {!isLoading && filteredHistory.length > 0 && (
                    <div className={`text-center mt-12 transition-all duration-1000 delay-600 ${
                        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                    }`}>
                        <button
                            className="px-8 py-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold rounded-full shadow-2xl hover:shadow-pink-500/25 transition-all duration-300 hover:scale-105">
                            <span className="flex items-center gap-2">
                                <Plus className="w-5 h-5"/>
                                Book New Appointment
                            </span>
                        </button>
                    </div>
                )}
            </div>

            {/* Reschedule Modal */}
            {showRescheduleModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div
                        className="bg-gradient-to-br from-slate-900/95 via-purple-900/95 to-pink-900/95 backdrop-blur-xl border border-white/20 rounded-3xl p-8 max-w-md w-full shadow-2xl">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-2xl font-bold text-white flex items-center gap-3">
                                <CalendarClock className="w-6 h-6 text-pink-400"/>
                                Reschedule Appointment
                            </h3>
                            <button
                                onClick={() => setShowRescheduleModal(false)}
                                className="text-white/60 hover:text-white transition-colors"
                            >
                                <X className="w-6 h-6"/>
                            </button>
                        </div>

                        <div className="space-y-4 mb-6">
                            <div>
                                <label className="block text-white/80 text-sm mb-2">Current Appointment</label>
                                <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                                    <p className="text-white font-semibold">{selectedBooking?.service?.name}</p>
                                    <p className="text-white/60 text-sm">{formatDate(selectedBooking?.date)} at {selectedBooking?.time}</p>
                                </div>
                            </div>

                            <div>
                                <label className="block text-white/80 text-sm mb-2">New Date</label>
                                <input
                                    type="date"
                                    value={rescheduleDate}
                                    onChange={(e) => setRescheduleDate(e.target.value)}
                                    min={new Date().toISOString().split('T')[0]}
                                    className="w-full px-4 py-3 bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl text-white focus:outline-none focus:border-pink-300/50 transition-colors duration-300"
                                />
                            </div>

                            <div>
                                <label className="block text-white/80 text-sm mb-2">New Time</label>
                                <select
                                    value={rescheduleTime}
                                    onChange={(e) => setRescheduleTime(e.target.value)}
                                    className="w-full px-4 py-3 bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl text-white focus:outline-none focus:border-pink-300/50 transition-colors duration-300"
                                >
                                    <option value="">Select time</option>
                                    {timeSlots
                                        // example filter: remove already booked times
                                        .filter((time) => !bookedTimes.includes(time))
                                        .map((time) => (
                                            <option key={time} value={time}>
                                                {time}
                                            </option>
                                        ))}
                                </select>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowRescheduleModal(false)}
                                className="flex-1 px-6 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-white hover:bg-white/20 transition-colors duration-300"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmReschedule}
                                disabled={!rescheduleDate || !rescheduleTime}
                                className="flex-1 px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-full hover:scale-105 transition-transform duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                            >
                                Confirm
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Cancel Modal */}
            {showCancelModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div
                        className="bg-gradient-to-br from-slate-900/95 via-purple-900/95 to-pink-900/95 backdrop-blur-xl border border-white/20 rounded-3xl p-8 max-w-md w-full shadow-2xl">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-2xl font-bold text-white flex items-center gap-3">
                                <AlertCircle className="w-6 h-6 text-red-400"/>
                                Cancel Appointment
                            </h3>
                            <button
                                onClick={() => setShowCancelModal(false)}
                                className="text-white/60 hover:text-white transition-colors"
                            >
                                <X className="w-6 h-6"/>
                            </button>
                        </div>

                        <div className="space-y-4 mb-6">
                            <div className="bg-red-500/10 border border-red-300/20 rounded-xl p-4">
                                <p className="text-red-300 text-sm mb-2">Are you sure you want to cancel this
                                    appointment?</p>
                                <p className="text-white font-semibold">{selectedBooking?.service?.name}</p>
                                <p className="text-white/60 text-sm">{formatDate(selectedBooking?.date)} at {selectedBooking?.time}</p>
                            </div>

                            <div>
                                <label className="block text-white/80 text-sm mb-2">Reason for cancellation
                                    (optional)</label>
                                <textarea
                                    value={cancelReason}
                                    onChange={(e) => setCancelReason(e.target.value)}
                                    placeholder="Let us know why you're cancelling..."
                                    rows={4}
                                    className="w-full px-4 py-3 bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-pink-300/50 transition-colors duration-300 resize-none"
                                />
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowCancelModal(false)}
                                className="flex-1 px-6 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-white hover:bg-white/20 transition-colors duration-300"
                            >
                                Keep Appointment
                            </button>
                            <button
                                onClick={confirmCancel}
                                className="flex-1 px-6 py-3 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-full hover:scale-105 transition-transform duration-300"
                            >
                                Cancel Appointment
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BookingHistory;