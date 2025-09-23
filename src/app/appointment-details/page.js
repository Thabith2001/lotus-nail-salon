"use client";

import React, { useState, useEffect } from 'react';
import {
    ArrowLeft,
    Calendar,
    Clock,
    MapPin,
    User,
    Phone,
    Mail,
    CreditCard,
    CheckCircle,
    AlertCircle,
    X,
    Edit,
    Download,
    Share2,
    Heart,
    Sparkles,
    Gift,
    Crown,
    Brush,
    Palette,
    Shield,
    MessageCircle
} from 'lucide-react';
import {useRouter} from "next/navigation";
import {useSparkles} from "@/hooks/useSparkles";

const BookingDetails = () => {
    const router = useRouter();
    const [booking, setBooking] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isVisible, setIsVisible] = useState(false);
    const [error, setError] = useState(null);
    const [showCancelModal, setShowCancelModal] = useState(false);
    const sparkles = useSparkles(25);


    useEffect(() => {
        const fetchBooking = async () => {
            try {
                setLoading(true);
                // Simulate API call
                setTimeout(() => {
                    const sampleBooking = {
                        id: "LSP-2024-001234",
                        service: {
                            name: "Luxury Gel Manicure",
                            category: "manicure",
                            duration: 60,
                            price: 65,
                            description: "Premium gel manicure with custom color selection and nail art"
                        },
                        customer: {
                            name: "Sarah Johnson",
                            email: "sarah.johnson@email.com",
                            phone: "(555) 123-4567"
                        },
                        appointment: {
                            date: "2024-03-25",
                            time: "14:30",
                            status: "confirmed"
                        },
                        payment: {
                            amount: 65,
                            method: "Credit Card",
                            status: "paid",
                            transactionId: "txn_1234567890"
                        },
                        spa: {
                            name: "Lotus Spa",
                            address: "123 Beauty Lane, Spa District, Luxury City, LC 12345",
                            phone: "(555) 123-NAILS",
                            email: "bookings@lotusspa.com"
                        },
                        notes: "Customer requested pink and gold nail art design. Allergic to certain acrylics.",
                        createdAt: "2024-03-15T10:30:00Z",
                        updatedAt: "2024-03-15T10:30:00Z"
                    };
                    setBooking(sampleBooking);
                    setLoading(false);
                    setTimeout(() => setIsVisible(true), 100);
                }, 1000);
            } catch (err) {
                setError("Failed to load bookings details");
                setLoading(false);
            }
        };

        fetchBooking();
    }, []);

    const getServiceIcon = (category) => {
        switch (category) {
            case 'manicure': return <Brush className="w-6 h-6 text-white" />;
            case 'pedicure': return <Heart className="w-6 h-6 text-white" />;
            case 'nail-art': return <Palette className="w-6 h-6 text-white" />;
            case 'package': return <Gift className="w-6 h-6 text-white" />;
            case 'membership': return <Crown className="w-6 h-6 text-white" />;
            default: return <Sparkles className="w-6 h-6 text-white" />;
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'confirmed': return 'from-green-400 to-emerald-500';
            case 'pending': return 'from-yellow-400 to-orange-500';
            case 'cancelled': return 'from-red-400 to-red-500';
            case 'completed': return 'from-blue-400 to-blue-500';
            default: return 'from-gray-400 to-gray-500';
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case 'confirmed': return 'Confirmed';
            case 'pending': return 'Pending';
            case 'cancelled': return 'Cancelled';
            case 'completed': return 'Completed';
            default: return 'Unknown';
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const formatTime = (timeString) => {
        return new Date(`2024-01-01T${timeString}`).toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });
    };

    const handleCancelBooking = () => {
        setShowCancelModal(false);
        // Simulate cancellation
        setBooking(prev => ({
            ...prev,
            appointment: {
                ...prev.appointment,
                status: 'cancelled'
            }
        }));
    };

    const handleReschedule = () => {
        console.log("Reschedule bookings");
        // Add reschedule logic here
    };

    const handleDownload = () => {
        console.log("Download bookings confirmation");
        // Add download logic here
    };

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: 'Booking Confirmation',
                text: `Booking ${booking.id} at ${booking.spa.name}`,
                url: window.location.href
            });
        } else {
            navigator.clipboard.writeText(window.location.href);
            alert('Booking link copied to clipboard!');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen w-full bg-gradient-to-br from-slate-900 via-purple-900 to-pink-900 relative overflow-hidden">
                <div className="absolute inset-0 overflow-hidden">
                    {sparkles.map((_, i) => (
                        <div
                            key={i}
                            className="absolute w-1 h-1 bg-pink-300 rounded-full opacity-30 animate-pulse"
                            style={{
                                left: `${Math.random() * 100}%`,
                                top: `${Math.random() * 100}%`,
                                animationDelay: `${Math.random() * 3}s`,
                                animationDuration: `${2 + Math.random() * 2}s`
                            }}
                        />
                    ))}
                </div>
                <div className="relative z-10 flex h-screen items-center justify-center">
                    <div className="text-center">
                        <div className="w-16 h-16 border-4 border-pink-400/30 border-t-pink-400 rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-white/80 text-lg">Loading booking details...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error || !booking) {
        return (
            <div className="min-h-screen w-full bg-gradient-to-br from-slate-900 via-purple-900 to-pink-900 flex items-center justify-center p-6">
                <div className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl p-8 text-center max-w-md">
                    <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-white mb-4">Booking Not Found</h2>
                    <p className="text-white/70 mb-6">{error || "The bookings you're looking for doesn't exist or has been removed."}</p>
                    <button
                        onClick={() => window.history.back()}
                        className="px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold rounded-full hover:scale-105 transition-transform"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen w-full bg-gradient-to-br from-slate-900 via-purple-900 to-pink-900 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 overflow-hidden">
                {sparkles.map((_, i) => (
                    <div
                        key={i}
                        className="absolute w-1 h-1 bg-pink-300 rounded-full opacity-30 animate-pulse"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 3}s`,
                            animationDuration: `${2 + Math.random() * 2}s`
                        }}
                    />
                ))}
            </div>

            {/* Main Content */}
            <div className={`relative z-10 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                {/* Header */}
                <div className="sticky top-0 z-20 bg-black/20 backdrop-blur-xl border-b border-white/10">
                    <div className="max-w-4xl mx-auto px-6 py-4">
                        <div className="flex items-center justify-between">
                            <button
                                onClick={() => router.back()}
                                className="flex items-center space-x-2 text-white/80 hover:text-white transition-colors group"
                            >
                                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                                <span>Back</span>
                            </button>
                            <div className="flex items-center space-x-3">
                                <button
                                    onClick={handleShare}
                                    className="p-2 bg-white/10 backdrop-blur-sm rounded-full text-white/80 hover:text-white hover:bg-white/20 transition-all"
                                >
                                    <Share2 className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={handleDownload}
                                    className="p-2 bg-white/10 backdrop-blur-sm rounded-full text-white/80 hover:text-white hover:bg-white/20 transition-all"
                                >
                                    <Download className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="max-w-4xl mx-auto px-6 py-8 space-y-8">
                    {/* Booking Header */}
                    <div className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl overflow-hidden">
                        <div className="relative">
                            <div className={`absolute inset-0 bg-gradient-to-r ${getStatusColor(booking.appointment.status)} opacity-10`}></div>
                            <div className="relative p-8">
                                <div className="flex items-start justify-between mb-6">
                                    <div>
                                        <h1 className="text-3xl font-bold text-white mb-2">{booking.service.name}</h1>
                                        <p className="text-white/70 text-lg">{booking.service.description}</p>
                                    </div>
                                    <div className={`flex items-center space-x-2 px-4 py-2 bg-gradient-to-r ${getStatusColor(booking.appointment.status)} rounded-full`}>
                                        <CheckCircle className="w-5 h-5 text-white" />
                                        <span className="text-white font-semibold">{getStatusText(booking.appointment.status)}</span>
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-6 mb-6">
                                    <div className="space-y-4">
                                        <div className="flex items-center space-x-3">
                                            <div className={`p-3 bg-gradient-to-r ${getStatusColor(booking.appointment.status)} rounded-full`}>
                                                {getServiceIcon(booking.service.category)}
                                            </div>
                                            <div>
                                                <p className="text-white/60 text-sm">Service Category</p>
                                                <p className="text-white font-semibold capitalize">{booking.service.category.replace('-', ' ')}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center space-x-3">
                                            <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full">
                                                <Clock className="w-6 h-6 text-white" />
                                            </div>
                                            <div>
                                                <p className="text-white/60 text-sm">Duration</p>
                                                <p className="text-white font-semibold">{booking.service.duration} minutes</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="flex items-center space-x-3">
                                            <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full">
                                                <CreditCard className="w-6 h-6 text-white" />
                                            </div>
                                            <div>
                                                <p className="text-white/60 text-sm">Total Amount</p>
                                                <p className="text-white font-bold text-xl">${booking.payment.amount}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center space-x-3">
                                            <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full">
                                                <Shield className="w-6 h-6 text-white" />
                                            </div>
                                            <div>
                                                <p className="text-white/60 text-sm">Booking ID</p>
                                                <p className="text-white font-mono text-sm">{booking.id}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Appointment Details */}
                    <div className="grid lg:grid-cols-2 gap-8">
                        <div className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl p-8">
                            <h2 className="text-2xl font-bold text-white mb-6 flex items-center space-x-2">
                                <Calendar className="w-6 h-6 text-pink-400" />
                                <span>Appointment Details</span>
                            </h2>

                            <div className="space-y-6">
                                <div className="flex items-center space-x-4">
                                    <div className="p-3 bg-gradient-to-r from-pink-500 to-rose-600 rounded-full">
                                        <Calendar className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <p className="text-white/60 text-sm">Date</p>
                                        <p className="text-white font-semibold text-lg">{formatDate(booking.appointment.date)}</p>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-4">
                                    <div className="p-3 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full">
                                        <Clock className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <p className="text-white/60 text-sm">Time</p>
                                        <p className="text-white font-semibold text-lg">{formatTime(booking.appointment.time)}</p>
                                    </div>
                                </div>

                                <div className="flex items-start space-x-4">
                                    <div className="p-3 bg-gradient-to-r from-purple-500 to-violet-600 rounded-full">
                                        <MapPin className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <p className="text-white/60 text-sm">Location</p>
                                        <p className="text-white font-semibold">{booking.spa.name}</p>
                                        <p className="text-white/70 text-sm">{booking.spa.address}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Customer & Contact Info */}
                        <div className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl p-8">
                            <h2 className="text-2xl font-bold text-white mb-6 flex items-center space-x-2">
                                <User className="w-6 h-6 text-blue-400" />
                                <span>Contact Information</span>
                            </h2>

                            <div className="space-y-6">
                                <div className="flex items-center space-x-4">
                                    <div className="p-3 bg-gradient-to-r from-green-500 to-teal-600 rounded-full">
                                        <User className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <p className="text-white/60 text-sm">Customer</p>
                                        <p className="text-white font-semibold text-lg">{booking.customer.name}</p>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-4">
                                    <div className="p-3 bg-gradient-to-r from-orange-500 to-red-600 rounded-full">
                                        <Mail className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <p className="text-white/60 text-sm">Email</p>
                                        <p className="text-white font-semibold">{booking.customer.email}</p>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-4">
                                    <div className="p-3 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full">
                                        <Phone className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <p className="text-white/60 text-sm">Phone</p>
                                        <p className="text-white font-semibold">{booking.customer.phone}</p>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-4">
                                    <div className="p-3 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full">
                                        <MessageCircle className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <p className="text-white/60 text-sm">Spa Contact</p>
                                        <p className="text-white font-semibold">{booking.spa.phone}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Payment Information */}
                    <div className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl p-8">
                        <h2 className="text-2xl font-bold text-white mb-6 flex items-center space-x-2">
                            <CreditCard className="w-6 h-6 text-green-400" />
                            <span>Payment Information</span>
                        </h2>

                        <div className="grid md:grid-cols-3 gap-6">
                            <div className="flex items-center space-x-4">
                                <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full">
                                    <CreditCard className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <p className="text-white/60 text-sm">Payment Method</p>
                                    <p className="text-white font-semibold">{booking.payment.method}</p>
                                </div>
                            </div>

                            <div className="flex items-center space-x-4">
                                <div className="p-3 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-full">
                                    <CheckCircle className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <p className="text-white/60 text-sm">Payment Status</p>
                                    <p className="text-green-400 font-semibold capitalize">{booking.payment.status}</p>
                                </div>
                            </div>

                            <div className="flex items-center space-x-4">
                                <div className="p-3 bg-gradient-to-r from-purple-500 to-violet-600 rounded-full">
                                    <Shield className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <p className="text-white/60 text-sm">Transaction ID</p>
                                    <p className="text-white font-mono text-sm">{booking.payment.transactionId}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Special Notes */}
                    {booking.notes && (
                        <div className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl p-8">
                            <h2 className="text-2xl font-bold text-white mb-4 flex items-center space-x-2">
                                <MessageCircle className="w-6 h-6 text-yellow-400" />
                                <span>Special Notes</span>
                            </h2>
                            <p className="text-white/80 leading-relaxed bg-white/5 p-4 rounded-xl border border-white/10">
                                {booking.notes}
                            </p>
                        </div>
                    )}

                    {/* Action Buttons */}
                    {booking.appointment.status === 'confirmed' && (
                        <div className="flex flex-wrap gap-4 justify-center">
                            <button
                                onClick={handleReschedule}
                                className="flex items-center space-x-2 px-8 py-4 bg-gradient-to-r from-blue-500 to-cyan-600 text-white font-semibold rounded-full hover:scale-105 transition-all shadow-lg"
                            >
                                <Edit className="w-5 h-5" />
                                <span>Reschedule</span>
                            </button>

                            <button
                                onClick={() => setShowCancelModal(true)}
                                className="flex items-center space-x-2 px-8 py-4 bg-gradient-to-r from-red-500 to-pink-600 text-white font-semibold rounded-full hover:scale-105 transition-all shadow-lg"
                            >
                                <X className="w-5 h-5" />
                                <span>Cancel Booking</span>
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Cancel Confirmation Modal */}
            {showCancelModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl p-8 max-w-md w-full">
                        <div className="text-center">
                            <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
                            <h3 className="text-2xl font-bold text-white mb-4">Cancel Booking?</h3>
                            <p className="text-white/70 mb-6">
                                Are you sure you want to cancel your booking? This action cannot be undone.
                            </p>
                            <div className="flex space-x-4">
                                <button
                                    onClick={() => setShowCancelModal(false)}
                                    className="flex-1 px-6 py-3 bg-white/10 text-white font-semibold rounded-full hover:bg-white/20 transition-all"
                                >
                                    Keep Booking
                                </button>
                                <button
                                    onClick={handleCancelBooking}
                                    className="flex-1 px-6 py-3 bg-gradient-to-r from-red-500 to-pink-600 text-white font-semibold rounded-full hover:scale-105 transition-all"
                                >
                                    Cancel Booking
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BookingDetails;
