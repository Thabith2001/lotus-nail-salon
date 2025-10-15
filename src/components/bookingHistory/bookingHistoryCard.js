"use client";
import React, {useContext, useMemo, useState, useEffect, createContext} from "react";
import {BookingHistoryContext} from "@/app/appointment-details/page";
import {
    AlertCircle,
    CheckCircle,
    Clock,
    XCircle,
    Brush,
    Heart,
    Crown,
    Gift,
    Palette,
    Star,
    Sparkles,
    Download,
    Calendar,
    CreditCard,
    CalendarClock,
    Eye,
    Repeat,
    X,
    Plus,
} from "lucide-react";
import {useRouter} from "next/navigation";
import RescheduleModal from "@/components/bookingHistory/rescheduleModal";
import CancelModal from "@/components/bookingHistory/cancelModal";
import {useTimezone} from "@/context/TimeZoneContext";
import {formatDate, formatTime} from "@/util/timeValidations";

export const modalContext = createContext();

const HistoryCard = () => {
    const {bookingHistory} = useContext(BookingHistoryContext);
    const [isVisible, setIsVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [reschedule, setReschedule] = useState(false);
    const [cancel, setCancel] = useState(false);
    const [data, setData] = useState(null);
    const router = useRouter();
    const {userTimezone} = useTimezone();

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(true);
            setIsLoading(false);
        }, 600);
        return () => clearTimeout(timer);
    }, []);

    // Helper function to combine booking date and time into a single Date object
    const getBookingDateTime = (dateString, timeString) => {
        if (!dateString || !timeString) {
            console.log('Missing date or time:', { dateString, timeString });
            return null;
        }

        try {
            // Create a new date object from the date string
            const bookingDate = new Date(dateString);

            // Log for debugging
            console.log('Original date string:', dateString);
            console.log('Original time string:', timeString);
            console.log('Parsed date object:', bookingDate);

            // Parse the time - handle multiple formats
            // Format 1: "14:30:00" or "14:30"
            // Format 2: "2:30 PM" or "2:30PM"
            // Format 3: "14:30:00.000Z"

            let hours = 0;
            let minutes = 0;

            // Try to match time with optional AM/PM
            const timeWithMeridiem = timeString.match(/(\d+):(\d+)(?::\d+)?(?:\s*([AP]M))?/i);

            if (timeWithMeridiem) {
                hours = parseInt(timeWithMeridiem[1], 10);
                minutes = parseInt(timeWithMeridiem[2], 10);
                const meridiem = timeWithMeridiem[3]?.toUpperCase();

                console.log('Parsed time - hours:', hours, 'minutes:', minutes, 'meridiem:', meridiem);

                // Convert to 24-hour format if AM/PM is present
                if (meridiem === 'PM' && hours !== 12) {
                    hours += 12;
                } else if (meridiem === 'AM' && hours === 12) {
                    hours = 0;
                }
            }

            // Set the hours and minutes to the date object
            bookingDate.setHours(hours, minutes, 0, 0);

            console.log('Final booking datetime:', bookingDate);
            console.log('Current datetime:', new Date());
            console.log('Is upcoming?', bookingDate > new Date());

            return bookingDate;
        } catch (error) {
            console.error('Error parsing booking date/time:', error, { dateString, timeString });
            return null;
        }
    };

    // Handle reschedule
    const handleReschedule = (item) => {
        setReschedule(true);
        setData(item);
        console.log("Reschedule booking:", item);
    };

    // Handle cancel booking
    const handleCancelBooking = (item) => {
        setCancel(true);
        setData(item);
        console.log("Cancel booking:", item);
    };

    // Handle booking/rebook
    const handleBooking = (item) => {
        if (item.membershipPackage === "membership") {
            router.push("/#pricing");
        } else {
            router.push("/booking");
        }
    };

    // Filter & format history
    const filteredHistory = useMemo(() => {
        if (!bookingHistory) return [];

        const now = new Date();

        return bookingHistory.map((booking) => {
            const bookingDateTime = getBookingDateTime(booking.bookingDate, booking.time);
            const isUpcoming = bookingDateTime && bookingDateTime > now;
            const isMembership = !!booking.userMembershipId;

            if (isMembership && booking.membership && booking.membership?.membershipPackage === "membership") {
                return {
                    id: booking?._id,
                    bookingId: booking?.bookingId,
                    type: "membership",
                    plan: {
                        name: booking.service || "Membership",
                        tier: booking.service?.toLowerCase().includes("gold")
                            ? "gold"
                            : booking.service?.toLowerCase().includes("silver")
                                ? "silver"
                                : "bronze",
                        duration: "Monthly",
                    },
                    purchaseDate: booking.membership.startDate,
                    expiryDate: booking.membership.endDate,
                    status: booking.membership.status,
                    amount: booking.payment?.amount || 0,
                    paymentMethod: booking.payment?.method === "credit_card" ? "Credit Card" : "Other",
                    servicesUsed: booking.membership.sessions
                        ? booking.membership.sessions - (booking.membership.remainingSessions || 0)
                        : 0,
                    servicesTotal: booking.membership.sessions || 0,
                    autoRenewal: false,
                    canRebook: true,
                    date: booking.bookingDate,
                    time: booking.time,
                    membershipPackage: booking.membership.membershipPackage,
                    bookingStatus: booking.status,
                    cancellationDate: booking.cancellationDate,
                };
            } else {
                // Determine status based on booking status and date/time
                let status;

                // Priority 1: Check if cancelled
                if (booking.status === "cancelled") {
                    status = "cancelled";
                }
                // Priority 2: Check if date/time has passed
                else if (!isUpcoming) {
                    // Booking date/time is in the past, so it's completed
                    status = "completed";
                }
                // Priority 3: Date/time is in the future
                else if (isUpcoming) {
                    // Check payment/confirmation status
                    if (booking.status === "confirmed" || booking.paymentStatus === "succeeded") {
                        status = "confirmed";
                    } else if (booking.status === "pending") {
                        status = "pending";
                    } else {
                        status = "upcoming";
                    }
                }
                // Fallback
                else {
                    status = "completed";
                }

                return {
                    id: booking?._id,
                    bookingId: booking?.bookingId,
                    type: "booking",
                    service: {
                        name: booking.service,
                        category: booking.service?.toLowerCase().includes("manicure")
                            ? "manicure"
                            : booking.service?.toLowerCase().includes("pedicure")
                                ? "pedicure"
                                : "nail-art",
                        duration: booking.duration || 60,
                    },
                    date: booking.bookingDate,
                    time: booking.time,
                    status: status,
                    bookingStatus: booking.status,
                    amount: booking.payment?.amount || 0,
                    paymentMethod: booking.payment?.method === "credit_card" ? "Credit Card" : "Other",
                    canRebook: true,
                    canReview: !isUpcoming && status === "completed",
                    cancellationDate: booking.cancellationDate,
                };
            }
        });
    }, [bookingHistory]);

    // Format cancellation date
    const formatCancellationDate = (dateString) => {
        if (!dateString) return "N/A";
        try {
            const date = new Date(dateString);
            return date.toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
            });
        } catch {
            return "N/A";
        }
    };

    // Status color
    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case "completed":
                return "from-green-400 to-emerald-500";
            case "upcoming":
            case "confirmed":
                return "from-blue-400 to-cyan-500";
            case "cancelled":
                return "from-red-400 to-pink-500";
            case "pending":
                return "from-yellow-400 to-orange-500";
            case "active":
                return "from-green-400 to-emerald-500";
            case "expired":
                return "from-gray-400 to-gray-500";
            default:
                return "from-purple-400 to-pink-500";
        }
    };

    // Status icon
    const getStatusIcon = (status) => {
        switch (status?.toLowerCase()) {
            case "completed":
                return <CheckCircle className="w-5 h-5"/>;
            case "upcoming":
            case "confirmed":
                return <Clock className="w-5 h-5"/>;
            case "cancelled":
                return <XCircle className="w-5 h-5"/>;
            case "pending":
                return <AlertCircle className="w-5 h-5"/>;
            case "active":
                return <CheckCircle className="w-5 h-5"/>;
            case "expired":
                return <AlertCircle className="w-5 h-5"/>;
            default:
                return <Clock className="w-5 h-5"/>;
        }
    };

    // Membership icon
    const getMembershipIcon = (tier) => {
        switch (tier?.toLowerCase()) {
            case "gold":
                return <Crown className="w-6 h-6 text-yellow-400"/>;
            case "silver":
                return <Star className="w-6 h-6 text-gray-300"/>;
            case "bronze":
                return <Gift className="w-6 h-6 text-orange-400"/>;
            default:
                return <Crown className="w-6 h-6 text-pink-400"/>;
        }
    };

    // Service icon
    const getServiceIcon = (category) => {
        const lower = category?.toLowerCase() || "";
        if (lower.includes("nail") || lower.includes("manicure"))
            return <Brush className="w-6 h-6 text-pink-400"/>;
        if (lower.includes("spa"))
            return <Heart className="w-6 h-6 text-pink-400"/>;
        if (lower.includes("art") || lower.includes("pedicure"))
            return <Palette className="w-6 h-6 text-pink-400"/>;
        return <Sparkles className="w-6 h-6 text-pink-400"/>;
    };

    if (!filteredHistory || filteredHistory.length === 0) {
        return (
            <div className="text-center text-white/60 mt-8">
                No booking history available.
            </div>
        );
    }

    return (
        <>
            <div
                className={`space-y-6 transition-all duration-1000 delay-400 ${
                    isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                }`}
            >
                {isLoading ? (
                    <div className="text-center py-16">
                        <div
                            className="w-16 h-16 border-4 border-pink-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-white/70">Loading your booking history...</p>
                    </div>
                ) : (
                    filteredHistory.map((item) => (
                        <div
                            key={item.id}
                            className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden hover:shadow-2xl hover:shadow-pink-500/10 transition-all duration-300"
                        >
                            {item.type === "booking" ? (
                                /* Regular Booking Item */
                                <div className="p-6">
                                    {/* Header */}
                                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                                        <div className="flex items-center space-x-4 mb-4 md:mb-0">
                                            <div
                                                className="w-12 h-12 bg-gradient-to-br from-pink-400 to-purple-500 rounded-xl flex items-center justify-center">
                                                {getServiceIcon(item.service.category)}
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-bold text-white">
                                                    {item.service.name}
                                                </h3>
                                                <p className="text-white/60 text-sm">
                                                    Booking ID: {item.bookingId || "N/A"}
                                                </p>
                                            </div>
                                        </div>

                                        <div
                                            className={`inline-flex items-center space-x-2 px-3 py-1 bg-gradient-to-r ${getStatusColor(
                                                item.status
                                            )} rounded-full text-white text-sm font-medium`}
                                        >
                                            {getStatusIcon(item.status)}
                                            <span className="capitalize">
                                                {item.status}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Details */}
                                    <div className="grid md:grid-cols-4 gap-4 mb-6">
                                        <div className="flex items-center space-x-3">
                                            <Calendar className="w-4 h-4 text-pink-400"/>
                                            <div>
                                                <p className="text-white/80 text-sm">Date</p>
                                                <p className="text-white font-medium">
                                                    {formatDate(item.date, userTimezone)}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center space-x-3">
                                            <Clock className="w-4 h-4 text-pink-400"/>
                                            <div>
                                                <p className="text-white/80 text-sm">
                                                    {item.status === "cancelled" ? "Cancelled At" : "Time"}
                                                </p>
                                                <p className="text-white font-medium">
                                                    {item.status === "cancelled"
                                                        ? formatCancellationDate(item.cancellationDate)
                                                        : formatTime(item.time, userTimezone)}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center space-x-3">
                                            <CreditCard className="w-4 h-4 text-pink-400"/>
                                            <div>
                                                <p className="text-white/80 text-sm">Amount</p>
                                                <p className="text-white font-medium">
                                                    ${Number(item.amount).toFixed(2)}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center space-x-3">
                                            <Clock className="w-4 h-4 text-pink-400"/>
                                            <div>
                                                <p className="text-white/80 text-sm">Duration</p>
                                                <p className="text-white font-medium">
                                                    {item.service.duration} min
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Buttons */}
                                    <div className="flex flex-wrap gap-3">
                                        <button
                                            className="flex items-center space-x-2 px-4 py-2 bg-white/10 border border-white/20 rounded-full text-white/80 hover:bg-white/20 transition-colors">
                                            <Eye className="w-4 h-4"/>
                                            <span>View Details</span>
                                        </button>

                                        <button
                                            className="flex items-center space-x-2 px-4 py-2 bg-white/10 border border-white/20 rounded-full text-white/80 hover:bg-white/20 transition-colors">
                                            <Download className="w-4 h-4"/>
                                            <span>Invoice</span>
                                        </button>

                                        {(item.status === "upcoming" || item.status === "confirmed") && (
                                            <>
                                                <button
                                                    onClick={() => handleReschedule(item)}
                                                    className="flex items-center space-x-2 px-4 py-2 bg-blue-500/20 border border-blue-300/30 rounded-full text-blue-300 hover:bg-blue-500/30 transition-colors"
                                                >
                                                    <CalendarClock className="w-4 h-4"/>
                                                    <span>Reschedule</span>
                                                </button>

                                                <button
                                                    onClick={() => handleCancelBooking(item)}
                                                    className="flex items-center space-x-2 px-4 py-2 bg-red-500/20 border border-red-300/30 rounded-full text-red-300 hover:bg-red-500/30 transition-colors"
                                                >
                                                    <X className="w-4 h-4"/>
                                                    <span>Cancel</span>
                                                </button>
                                            </>
                                        )}

                                        {item.canRebook && item.status !== "upcoming" && item.status !== "confirmed" && (
                                            <button
                                                onClick={() => handleBooking(item)}
                                                className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-full hover:scale-105 transition-transform"
                                            >
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
                                                <h3 className="text-lg font-bold text-white">
                                                    {item.plan.name}
                                                </h3>
                                                <p className="text-white/60 text-sm">
                                                    Membership ID: {item.bookingId || "N/A"}
                                                </p>
                                            </div>
                                        </div>

                                        <div
                                            className={`inline-flex items-center space-x-2 px-3 py-1 bg-gradient-to-r ${getStatusColor(
                                                item.status
                                            )} rounded-full text-white text-sm font-medium`}
                                        >
                                            {getStatusIcon(item.status)}
                                            <span className="capitalize">{item.status}</span>
                                        </div>
                                    </div>

                                    <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
                                        <div className="flex items-center space-x-3">
                                            <Calendar className="w-4 h-4 text-pink-400"/>
                                            <div>
                                                <p className="text-white/80 text-sm">Start Date</p>
                                                <p className="text-white font-medium">
                                                    {formatDate(item.purchaseDate, userTimezone)}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center space-x-3">
                                            <Clock className="w-4 h-4 text-pink-400"/>
                                            <div>
                                                <p className="text-white/80 text-sm">Expires</p>
                                                <p className="text-white font-medium">
                                                    {formatDate(item.expiryDate, userTimezone)}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center space-x-3">
                                            <Calendar className="w-4 h-4 text-pink-400"/>
                                            <div>
                                                <p className="text-white/80 text-sm">Booked Date</p>
                                                <p className="text-white font-medium">
                                                    {formatDate(item.date, userTimezone)}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center space-x-3">
                                            <Clock className="w-4 h-4 text-pink-400"/>
                                            <div>
                                                <p className="text-white/80 text-sm">Booked Time</p>
                                                <p className="text-white font-medium">
                                                    {formatTime(item.time, userTimezone)}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center space-x-3">
                                            <CreditCard className="w-4 h-4 text-pink-400"/>
                                            <div>
                                                <p className="text-white/80 text-sm">Monthly Fee</p>
                                                <p className="text-white font-medium">
                                                    ${Number(item.amount).toFixed(2)}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center space-x-3">
                                            <Star className="w-4 h-4 text-pink-400"/>
                                            <div>
                                                <p className="text-white/80 text-sm">Services Used</p>
                                                <p className="text-white font-medium">
                                                    {item.servicesUsed}/{item.servicesTotal}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {item.status !== "expired" &&
                                        item.status !== "cancelled" &&(
                                            <div
                                                className="mb-4 p-4 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-xl border border-green-300/20">
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <p className="text-green-300 font-semibold text-sm">
                                                            Membership Active
                                                        </p>
                                                        <p className="text-white/70 text-sm">
                                                            {item.autoRenewal ? "Auto-renewal enabled" : "Manual renewal required"}
                                                        </p>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-green-300 text-sm">Services Remaining</p>
                                                        <p className="text-white font-bold">
                                                            {item.servicesTotal - item.servicesUsed}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                    <div className="flex flex-wrap gap-3">
                                        <button
                                            className="flex items-center space-x-2 px-4 py-2 bg-white/10 border border-white/20 rounded-full text-white/80 hover:bg-white/20 transition-colors">
                                            <Eye className="w-4 h-4"/>
                                            <span>View Details</span>
                                        </button>

                                        <button
                                            className="flex items-center space-x-2 px-4 py-2 bg-white/10 border border-white/20 rounded-full text-white/80 hover:bg-white/20 transition-colors">
                                            <Download className="w-4 h-4"/>
                                            <span>Invoice</span>
                                        </button>

                                        {item.status !== "expired" &&
                                            item.status !== "cancelled" && (
                                                <>
                                                    <button
                                                        onClick={() => handleReschedule(item)}
                                                        className="flex items-center space-x-2 px-4 py-2 bg-blue-500/20 border border-blue-300/30 rounded-full text-blue-300 hover:bg-blue-500/30 transition-colors"
                                                    >
                                                        <CalendarClock className="w-4 h-4"/>
                                                        <span>Reschedule</span>
                                                    </button>

                                                    <button
                                                        onClick={() => handleCancelBooking(item)}
                                                        className="flex items-center space-x-2 px-4 py-2 bg-red-500/20 border border-red-300/30 rounded-full text-red-300 hover:bg-red-500/30 transition-colors"
                                                    >
                                                        <X className="w-4 h-4"/>
                                                        <span>Cancel</span>
                                                    </button>

                                                    <button
                                                        onClick={() => handleBooking(item)}
                                                        className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-full hover:scale-105 transition-transform"
                                                    >
                                                        <Plus className="w-4 h-4"/>
                                                        <span>Add your membership</span>
                                                    </button>
                                                </>
                                            )}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>

            {/* Modals */}
            <modalContext.Provider value={{setCancel, setReschedule, data, cancel, reschedule}}>
                {reschedule && <RescheduleModal/>}
                {cancel && <CancelModal/>}
            </modalContext.Provider>
        </>
    );
};

export default HistoryCard;