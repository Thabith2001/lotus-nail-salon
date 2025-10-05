"use client";
import React, { useEffect, useState } from "react";
import {
    Scissors,
    Sparkles,
    Crown,
    Heart,
    Palette,
    Clock,
    DollarSign,
    Calendar,
    Star,
} from "lucide-react";
import axios from "axios";
import {useSparkles} from "@/hooks/useSparkles";
import {useRouter} from "next/navigation";

const iconMap = {
    Scissors,
    Sparkles,
    Crown,
    Heart,
    Palette,
    Star,
};

const Services = () => {
    const [hoveredService, setHoveredService] = useState(null);
    const [services, setServices] = useState([]);
    const router = useRouter();

    const sparkles = useSparkles(20);

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const res = await axios.get("/api/services");
                setServices(res.data.services || []);
            } catch (err) {
                console.error("Error fetching services:", err);
            }
        };

        fetchServices();
    }, []);

    return (
        <section className="relative min-h-screen w-full py-20 bg-gradient-to-br from-slate-900 via-purple-900 to-pink-900 overflow-hidden">
            {/* Sparkles */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {sparkles.map((s, i) => (
                    <div
                        key={i}
                        className="absolute w-1 h-1 bg-pink-300 rounded-full opacity-20 animate-pulse"
                        style={{
                            left: s.left,
                            top: s.top,
                            animationDelay: s.delay,
                            animationDuration: s.duration,
                        }}
                    />
                ))}
            </div>

            {/* Gradient Orbs */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-br from-pink-400/10 to-purple-400/10 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-br from-purple-400/10 to-pink-400/10 rounded-full blur-3xl animate-pulse"></div>

            <div className="relative z-10 max-w-7xl mx-auto px-6">
                {/* Header */}
                <div className="text-center mb-16">
                    <div className="inline-flex items-center px-6 py-2 mb-8 bg-white/10 backdrop-blur-lg border border-white/20 rounded-full">
                        <Scissors className="w-4 h-4 text-pink-400 mr-3" />
                        <span className="text-sm font-medium text-white/90 tracking-wide">
              OUR SERVICES
            </span>
                    </div>

                    <h2 className="text-5xl md:text-7xl font-black leading-tight mb-6">
            <span className="block bg-gradient-to-r from-white via-pink-200 to-purple-200 bg-clip-text text-transparent drop-shadow-2xl">
              Premium Nail
            </span>
                        <span className="block bg-gradient-to-r from-pink-300 via-rose-200 to-white bg-clip-text text-transparent drop-shadow-2xl">
              Experiences
            </span>
                    </h2>

                    <p className="text-xl text-white/70 max-w-3xl mx-auto leading-relaxed">
                        Discover our comprehensive range of luxury nail services, each
                        designed to enhance your natural beauty
                    </p>
                </div>

                {/* Services Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">

                    {services.map((service, index) => {
                        const IconComponent = iconMap[service.icon] || Sparkles;
                        return (

                            <div
                                key={service._id}
                                className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 hover:shadow-2xl hover:shadow-pink-500/20 transition-all duration-500 hover:scale-105 cursor-pointer"
                                onMouseEnter={() => setHoveredService(service._id)}
                                onMouseLeave={() => setHoveredService(null)}
                                style={{
                                    animationDelay: `${index * 100}ms`,
                                }}
                             >
                                {/* Service Header */}
                                <div className="flex items-start justify-between mb-4">
                                    <div
                                        className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${
                                            service.color || "from-pink-500 to-purple-500"
                                        } flex items-center justify-center shadow-lg`}
                                    >
                                        <IconComponent className="w-7 h-7 text-white" />
                                    </div>
                                    <div className="text-right">
                                        <p className="text-2xl font-bold text-white">
                                            ${service.price}
                                        </p>
                                        <div className="flex items-center justify-end text-white/60 text-sm mt-1">
                                            <Clock className="w-3 h-3 mr-1" />
                                            {service.duration} mins
                                        </div>
                                    </div>
                                </div>

                                {/* Service Name */}
                                <h3 className="text-xl font-bold text-white mb-3">
                                    {service.name}
                                </h3>

                                {/* Description */}
                                <p className="text-white/70 text-sm mb-4 leading-relaxed">
                                    {service.description}
                                </p>

                                {/* Features */}
                                <div className="space-y-2 mb-4">
                                    {service.features?.map((feature, idx) => (
                                        <div
                                            key={idx}
                                            className="flex items-center text-white/60 text-sm"
                                        >
                                            <div className="w-1.5 h-1.5 rounded-full bg-pink-400 mr-2"></div>
                                            {feature}
                                        </div>
                                    ))}
                                </div>
                            </div>

                        );
                    })}
                </div>

                {/* CTA Section */}
                <div className="bg-gradient-to-r from-pink-500/10 via-purple-500/10 to-pink-500/10 backdrop-blur-xl border-2 border-white/20 rounded-3xl p-12 text-center">
                    <div className="max-w-3xl mx-auto">
                        <div className="inline-flex items-center px-4 py-2 mb-6 bg-white/10 backdrop-blur-lg border border-white/20 rounded-full">
                            <Star className="w-4 h-4 text-pink-400 mr-2" />
                            <span className="text-sm font-medium text-white/90">
                SAVE WITH MEMBERSHIP
              </span>
                        </div>

                        <h3 className="text-3xl md:text-5xl font-bold text-white mb-4">
                            Ready to Experience Luxury?
                        </h3>

                        <p className="text-lg text-white/70 mb-8 max-w-2xl mx-auto">
                            Book your appointment today or join our exclusive membership
                            program for special perks and savings
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                            <button
                                onClick={() => {router.push(`/booking`)}}
                                className="px-8 py-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold rounded-full shadow-2xl hover:shadow-pink-500/50 transition-all duration-300 hover:scale-105 flex items-center gap-2">
                                <Calendar className="w-5 h-5" />
                                Book an Appointment
                            </button>

                            <button
                                onClick={() => router.push("/#pricing")}
                                className="px-8 py-4 bg-white/10 backdrop-blur-lg border-2 border-white/30 text-white font-bold rounded-full hover:bg-white/20 transition-all duration-300 hover:scale-105 flex items-center gap-2">
                                <Crown className="w-5 h-5 text-pink-400" />
                                View Memberships
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Services;
