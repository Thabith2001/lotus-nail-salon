"use client";

import React, { useState, useRef, useEffect } from "react";
import {
    Calendar,
    Clock,
    User,
    Phone,
    Mail,
    MapPin,
    Sparkles,
    Crown,
    Star,
    ChevronLeft,
    ChevronRight,
    Check,
    ArrowRight,
    Heart,
    Gift
} from "lucide-react";

// Mock data - replace with your actual data
const services = [
    {
        id: 'classic-manicure',
        name: 'Classic Manicure',
        duration: 45,
        price: 45,
        category: 'Manicure',
        description: 'Perfect nail shaping, cuticle care, and polish application',
        icon: Sparkles,
        color: 'from-pink-500 to-rose-500'
    },
    {
        id: 'gel-extensions',
        name: 'Gel Extensions',
        duration: 90,
        price: 85,
        category: 'Extensions',
        description: 'Long-lasting gel nail extensions with custom length',
        icon: Crown,
        color: 'from-purple-500 to-pink-500'
    },
    {
        id: 'luxury-pedicure',
        name: 'Luxury Pedicure',
        duration: 60,
        price: 65,
        category: 'Pedicure',
        description: 'Complete foot care with massage and relaxation',
        icon: Heart,
        color: 'from-rose-500 to-pink-500'
    },
    {
        id: 'nail-art',
        name: 'Custom Nail Art',
        duration: 30,
        price: 25,
        category: 'Art',
        description: 'Unique artistic designs tailored to your style',
        icon: Star,
        color: 'from-amber-500 to-orange-500'
    },
    {
        id: 'bridal-package',
        name: 'Bridal Package',
        duration: 120,
        price: 180,
        category: 'Package',
        description: 'Complete bridal nail care with trial session',
        icon: Gift,
        color: 'from-purple-600 to-pink-600'
    }
];

const timeSlots = [
    '9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
    '12:00 PM', '12:30 PM', '1:00 PM', '1:30 PM', '2:00 PM', '2:30 PM',
    '3:00 PM', '3:30 PM', '4:00 PM', '4:30 PM', '5:00 PM', '5:30 PM'
];

const specialists = [
    {
        id: 'sarah',
        name: 'Sarah Chen',
        specialty: 'Nail Art Specialist',
        rating: 4.9,
        image: '👩‍🎨',
        experience: '8 years'
    },
    {
        id: 'maria',
        name: 'Maria Rodriguez',
        specialty: 'Extension Expert',
        rating: 4.8,
        image: '👩‍💼',
        experience: '6 years'
    },
    {
        id: 'emma',
        name: 'Emma Johnson',
        specialty: 'Luxury Treatments',
        rating: 4.9,
        image: '👩‍⚕️',
        experience: '10 years'
    }
];

const BookingSystem = () => {
    const [currentStep, setCurrentStep] = useState(1);
    const [selectedService, setSelectedService] = useState(null);
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedTime, setSelectedTime] = useState(null);
    const [selectedSpecialist, setSelectedSpecialist] = useState(null);
    const [customerInfo, setCustomerInfo] = useState({
        name: '',
        email: '',
        phone: '',
        notes: ''
    });
    const [isVisible, setIsVisible] = useState(false);
    const containerRef = useRef(null);

    // Generate calendar dates
    const generateCalendarDates = () => {
        const dates = [];
        const today = new Date();
        for (let i = 0; i < 14; i++) {
            const date = new Date(today);
            date.setDate(today.getDate() + i);
            dates.push(date);
        }
        return dates;
    };

    const calendarDates = generateCalendarDates();

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => setIsVisible(entry.isIntersecting),
            { threshold: 0.1 }
        );

        if (containerRef.current) {
            observer.observe(containerRef.current);
        }

        return () => observer.disconnect();
    }, []);

    const nextStep = () => {
        if (currentStep < 5) setCurrentStep(currentStep + 1);
    };

    const prevStep = () => {
        if (currentStep > 1) setCurrentStep(currentStep - 1);
    };

    const formatDate = (date) => {
        return date.toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric'
        });
    };

    const handleBooking = () => {
        const booking = {
            service: selectedService,
            date: selectedDate,
            time: selectedTime,
            specialist: selectedSpecialist,
            customer: customerInfo,
            total: selectedService?.price || 0
        };
        console.log('Booking submitted:', booking);
        // Here you would typically send to your API
        alert('Booking confirmed! We\'ll send you a confirmation email shortly.');
    };

    // Step 1: Service Selection
    const ServiceSelection = () => (
        <div className="space-y-6">
            <div className="text-center mb-8">
                <h3 className="text-3xl font-bold text-white mb-4">Choose Your Service</h3>
                <p className="text-white/70">Select from our premium nail care services</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {services.map((service) => {
                    const Icon = service.icon;
                    return (
                        <div
                            key={service.id}
                            onClick={() => setSelectedService(service)}
                            className={`group relative cursor-pointer p-6 rounded-3xl border-2 transition-all duration-300 hover:scale-105 ${
                                selectedService?.id === service.id
                                    ? 'border-pink-400 bg-white/10'
                                    : 'border-white/20 bg-white/5 hover:bg-white/10'
                            }`}
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-r ${service.color} flex items-center justify-center`}>
                                    <Icon className="w-6 h-6 text-white" />
                                </div>
                                <div className="text-right">
                                    <span className="text-2xl font-bold text-white">${service.price}</span>
                                    <p className="text-white/60 text-sm">{service.duration} min</p>
                                </div>
                            </div>

                            <h4 className="text-xl font-bold text-white mb-2">{service.name}</h4>
                            <p className="text-white/70 text-sm mb-4">{service.description}</p>

                            <div className="flex items-center justify-between">
                <span className="text-xs text-white/50 bg-white/10 px-3 py-1 rounded-full">
                  {service.category}
                </span>
                                {selectedService?.id === service.id && (
                                    <div className="w-6 h-6 bg-pink-500 rounded-full flex items-center justify-center">
                                        <Check className="w-4 h-4 text-white" />
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );

    // Step 2: Date Selection
    const DateSelection = () => (
        <div className="space-y-6">
            <div className="text-center mb-8">
                <h3 className="text-3xl font-bold text-white mb-4">Select Date</h3>
                <p className="text-white/70">Choose your preferred appointment date</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
                {calendarDates.map((date, index) => {
                    const isToday = date.toDateString() === new Date().toDateString();
                    const isSelected = selectedDate?.toDateString() === date.toDateString();

                    return (
                        <div
                            key={index}
                            onClick={() => setSelectedDate(date)}
                            className={`group cursor-pointer p-4 rounded-2xl border-2 transition-all duration-300 hover:scale-105 text-center ${
                                isSelected
                                    ? 'border-pink-400 bg-gradient-to-br from-pink-500/20 to-purple-500/20'
                                    : 'border-white/20 bg-white/5 hover:bg-white/10'
                            }`}
                        >
                            <div className="text-white/60 text-xs uppercase mb-1">
                                {date.toLocaleDateString('en-US', { weekday: 'short' })}
                            </div>
                            <div className="text-2xl font-bold text-white mb-1">
                                {date.getDate()}
                            </div>
                            <div className="text-white/60 text-xs">
                                {date.toLocaleDateString('en-US', { month: 'short' })}
                            </div>
                            {isToday && (
                                <div className="text-xs text-pink-400 mt-1">Today</div>
                            )}
                            {isSelected && (
                                <div className="absolute -top-2 -right-2 w-6 h-6 bg-pink-500 rounded-full flex items-center justify-center">
                                    <Check className="w-3 h-3 text-white" />
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );

    // Step 3: Time Selection
    const TimeSelection = () => (
        <div className="space-y-6">
            <div className="text-center mb-8">
                <h3 className="text-3xl font-bold text-white mb-4">Choose Time</h3>
                <p className="text-white/70">
                    Available slots for {selectedDate && formatDate(selectedDate)}
                </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {timeSlots.map((time) => {
                    const isSelected = selectedTime === time;
                    const isBooked = Math.random() > 0.7; // Simulate some booked slots

                    return (
                        <button
                            key={time}
                            onClick={() => !isBooked && setSelectedTime(time)}
                            disabled={isBooked}
                            className={`p-4 rounded-2xl border-2 transition-all duration-300 font-medium ${
                                isBooked
                                    ? 'border-white/10 bg-white/5 text-white/30 cursor-not-allowed'
                                    : isSelected
                                        ? 'border-pink-400 bg-gradient-to-br from-pink-500/20 to-purple-500/20 text-white'
                                        : 'border-white/20 bg-white/5 text-white hover:bg-white/10 hover:scale-105'
                            }`}
                        >
                            <Clock className="w-4 h-4 mx-auto mb-2" />
                            {time}
                            {isBooked && (
                                <div className="text-xs mt-1 text-white/30">Booked</div>
                            )}
                        </button>
                    );
                })}
            </div>
        </div>
    );

    // Step 4: Specialist Selection
    const SpecialistSelection = () => (
        <div className="space-y-6">
            <div className="text-center mb-8">
                <h3 className="text-3xl font-bold text-white mb-4">Choose Specialist</h3>
                <p className="text-white/70">Select your preferred nail technician</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {specialists.map((specialist) => {
                    const isSelected = selectedSpecialist?.id === specialist.id;

                    return (
                        <div
                            key={specialist.id}
                            onClick={() => setSelectedSpecialist(specialist)}
                            className={`group cursor-pointer p-6 rounded-3xl border-2 transition-all duration-300 hover:scale-105 text-center ${
                                isSelected
                                    ? 'border-pink-400 bg-white/10'
                                    : 'border-white/20 bg-white/5 hover:bg-white/10'
                            }`}
                        >
                            <div className="text-6xl mb-4">{specialist.image}</div>
                            <h4 className="text-xl font-bold text-white mb-2">{specialist.name}</h4>
                            <p className="text-white/70 text-sm mb-3">{specialist.specialty}</p>

                            <div className="flex items-center justify-center space-x-4 mb-4">
                                <div className="flex items-center space-x-1">
                                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                    <span className="text-white text-sm">{specialist.rating}</span>
                                </div>
                                <div className="text-white/60 text-sm">{specialist.experience}</div>
                            </div>

                            {isSelected && (
                                <div className="w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center mx-auto">
                                    <Check className="w-5 h-5 text-white" />
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );

    // Step 5: Customer Information
    const CustomerForm = () => (
        <div className="space-y-6">
            <div className="text-center mb-8">
                <h3 className="text-3xl font-bold text-white mb-4">Your Information</h3>
                <p className="text-white/70">Please provide your contact details</p>
            </div>

            <div className="max-w-2xl mx-auto space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-white/80 text-sm font-medium">Full Name</label>
                        <div className="relative">
                            <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/40" />
                            <input
                                type="text"
                                value={customerInfo.name}
                                onChange={(e) => setCustomerInfo({...customerInfo, name: e.target.value})}
                                className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/20 rounded-2xl text-white placeholder-white/40 focus:border-pink-400 focus:outline-none transition-colors"
                                placeholder="Enter your name"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-white/80 text-sm font-medium">Phone Number</label>
                        <div className="relative">
                            <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/40" />
                            <input
                                type="tel"
                                value={customerInfo.phone}
                                onChange={(e) => setCustomerInfo({...customerInfo, phone: e.target.value})}
                                className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/20 rounded-2xl text-white placeholder-white/40 focus:border-pink-400 focus:outline-none transition-colors"
                                placeholder="Your phone number"
                            />
                        </div>
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-white/80 text-sm font-medium">Email Address</label>
                    <div className="relative">
                        <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/40" />
                        <input
                            type="email"
                            value={customerInfo.email}
                            onChange={(e) => setCustomerInfo({...customerInfo, email: e.target.value})}
                            className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/20 rounded-2xl text-white placeholder-white/40 focus:border-pink-400 focus:outline-none transition-colors"
                            placeholder="your@email.com"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-white/80 text-sm font-medium">Special Notes (Optional)</label>
                    <textarea
                        value={customerInfo.notes}
                        onChange={(e) => setCustomerInfo({...customerInfo, notes: e.target.value})}
                        rows={4}
                        className="w-full p-4 bg-white/5 border border-white/20 rounded-2xl text-white placeholder-white/40 focus:border-pink-400 focus:outline-none transition-colors resize-none"
                        placeholder="Any special requests or preferences..."
                    />
                </div>
            </div>
        </div>
    );

    // Booking Summary
    const BookingSummary = () => (
        <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/20">
            <h4 className="text-xl font-bold text-white mb-6">Booking Summary</h4>

            <div className="space-y-4">
                {selectedService && (
                    <div className="flex items-center justify-between">
                        <span className="text-white/70">Service:</span>
                        <span className="text-white font-medium">{selectedService.name}</span>
                    </div>
                )}

                {selectedDate && (
                    <div className="flex items-center justify-between">
                        <span className="text-white/70">Date:</span>
                        <span className="text-white font-medium">{formatDate(selectedDate)}</span>
                    </div>
                )}

                {selectedTime && (
                    <div className="flex items-center justify-between">
                        <span className="text-white/70">Time:</span>
                        <span className="text-white font-medium">{selectedTime}</span>
                    </div>
                )}

                {selectedSpecialist && (
                    <div className="flex items-center justify-between">
                        <span className="text-white/70">Specialist:</span>
                        <span className="text-white font-medium">{selectedSpecialist.name}</span>
                    </div>
                )}

                {selectedService && (
                    <>
                        <hr className="border-white/20 my-4" />
                        <div className="flex items-center justify-between text-xl font-bold">
                            <span className="text-white">Total:</span>
                            <span className="text-transparent bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text">
                ${selectedService.price}
              </span>
                        </div>
                    </>
                )}
            </div>
        </div>
    );

    const canProceed = () => {
        switch (currentStep) {
            case 1: return selectedService !== null;
            case 2: return selectedDate !== null;
            case 3: return selectedTime !== null;
            case 4: return selectedSpecialist !== null;
            case 5: return customerInfo.name && customerInfo.email && customerInfo.phone;
            default: return false;
        }
    };

    return (
        <section
            ref={containerRef}
            className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-pink-900 py-20 relative overflow-hidden"
        >
            {/* Background Effects */}
            <div className="absolute inset-0">
                <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-gradient-to-br from-pink-400/10 to-purple-400/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-gradient-to-br from-purple-400/10 to-pink-400/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
            </div>

            <div className={`relative z-10 max-w-7xl mx-auto px-6 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                {/* Header */}
                <div className="text-center mb-16">
                    <div className="inline-flex items-center px-8 py-3 mb-8 bg-white/10 backdrop-blur-2xl border border-white/20 rounded-full">
                        <Calendar className="w-4 h-4 text-pink-400 mr-3" />
                        <span className="text-sm font-medium text-white/90 tracking-wider uppercase">
              Book Your Appointment
            </span>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-black leading-tight mb-8">
            <span className="block bg-gradient-to-r from-white via-pink-200 to-purple-200 bg-clip-text text-transparent">
              Reserve Your
            </span>
                        <span className="block bg-gradient-to-r from-pink-300 via-rose-200 to-white bg-clip-text text-transparent">
              Perfect Moment
            </span>
                    </h1>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Main Booking Flow */}
                    <div className="lg:col-span-2">
                        <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/20">
                            {/* Progress Steps */}
                            <div className="flex items-center justify-between mb-12">
                                {[1, 2, 3, 4, 5].map((step) => (
                                    <div key={step} className="flex items-center">
                                        <div
                                            className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all duration-300 ${
                                                step <= currentStep
                                                    ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white'
                                                    : 'bg-white/10 text-white/40'
                                            }`}
                                        >
                                            {step < currentStep ? <Check className="w-5 h-5" /> : step}
                                        </div>
                                        {step < 5 && (
                                            <div
                                                className={`w-12 h-1 mx-2 transition-all duration-300 ${
                                                    step < currentStep ? 'bg-gradient-to-r from-pink-500 to-purple-600' : 'bg-white/20'
                                                }`}
                                            />
                                        )}
                                    </div>
                                ))}
                            </div>

                            {/* Step Content */}
                            <div className="min-h-[500px]">
                                {currentStep === 1 && <ServiceSelection />}
                                {currentStep === 2 && <DateSelection />}
                                {currentStep === 3 && <TimeSelection />}
                                {currentStep === 4 && <SpecialistSelection />}
                                {currentStep === 5 && <CustomerForm />}
                            </div>

                            {/* Navigation */}
                            <div className="flex items-center justify-between mt-12">
                                <button
                                    onClick={prevStep}
                                    className={`flex items-center space-x-2 px-6 py-3 rounded-2xl font-medium transition-all duration-300 ${
                                        currentStep === 1
                                            ? 'text-white/40 cursor-not-allowed'
                                            : 'text-white bg-white/10 hover:bg-white/20 hover:scale-105'
                                    }`}
                                    disabled={currentStep === 1}
                                >
                                    <ChevronLeft className="w-4 h-4" />
                                    <span>Back</span>
                                </button>

                                {currentStep === 5 ? (
                                    <button
                                        onClick={handleBooking}
                                        disabled={!canProceed()}
                                        className={`flex items-center space-x-2 px-8 py-4 rounded-2xl font-bold transition-all duration-300 ${
                                            canProceed()
                                                ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white hover:scale-105 hover:shadow-lg hover:shadow-pink-500/25'
                                                : 'bg-white/10 text-white/40 cursor-not-allowed'
                                        }`}
                                    >
                                        <span>Confirm Booking</span>
                                        <Check className="w-4 h-4" />
                                    </button>
                                ) : (
                                    <button
                                        onClick={nextStep}
                                        disabled={!canProceed()}
                                        className={`flex items-center space-x-2 px-8 py-4 rounded-2xl font-bold transition-all duration-300 ${
                                            canProceed()
                                                ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white hover:scale-105 hover:shadow-lg hover:shadow-pink-500/25'
                                                : 'bg-white/10 text-white/40 cursor-not-allowed'
                                        }`}
                                    >
                                        <span>Continue</span>
                                        <ArrowRight className="w-4 h-4" />
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Booking Summary Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-8">
                            <BookingSummary />

                            {/* Contact Info */}
                            <div className="mt-8 bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/20">
                                <h4 className="text-xl font-bold text-white mb-6">Need Help?</h4>

                                <div className="space-y-4">
                                    <div className="flex items-center space-x-3 text-white/70">
                                        <Phone className="w-5 h-5 text-pink-400" />
                                        <span>(555) 123-4567</span>
                                    </div>

                                    <div className="flex items-center space-x-3 text-white/70">
                                        <Mail className="w-5 h-5 text-pink-400" />
                                        <span>book@luxurynails.com</span>
                                    </div>

                                    <div className="flex items-center space-x-3 text-white/70">
                                        <MapPin className="w-5 h-5 text-pink-400" />
                                        <span>123 Beauty Lane, City</span>
                                    </div>
                                </div>

                                <div className="mt-6 p-4 bg-gradient-to-r from-pink-500/10 to-purple-500/10 rounded-2xl border border-pink-400/20">
                                    <p className="text-sm text-white/80">
                                        <strong className="text-pink-300">Cancellation Policy:</strong>
                                        Free cancellation up to 24 hours before appointment.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default BookingSystem;
