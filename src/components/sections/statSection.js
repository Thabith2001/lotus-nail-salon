"use client";
import React, { useEffect, useState, useRef } from "react";
import { Users, Award, Star, Sparkles, ArrowRight } from "lucide-react";
import Button from "@/components/buttons/buttons";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/contextAuth";
import { useAuthModal } from "@/context/authModelContext";
import { useAnimatedCounters } from "@/hooks/useCounter";

const Stats = () => {
    const [isVisible, setIsVisible] = useState(false);
    const { counters, animateCounters } = useAnimatedCounters();

    const { user } = useAuth();
    const router = useRouter();
    const { openAuth } = useAuthModal();
    const sectionRef = useRef(null);

    // Detect when section enters viewport
    useEffect(() => {
        if (!sectionRef.current) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    animateCounters();
                    observer.disconnect(); // ensures it only runs once
                }
            },
            { threshold: 0.3 } // trigger when 30% visible
        );

        observer.observe(sectionRef.current);
        return () => observer.disconnect();
    }, [animateCounters]);

    return (
        <section
            id="stats-section"
            ref={sectionRef}
            className="bg-white/5 backdrop-blur-lg border-t border-white/10"
        >
            <div className="max-w-6xl mx-auto px-6 py-16">
                {/* Stats Grid */}
                <div className="grid md:grid-cols-4 gap-8 text-center">
                    {/* Happy Clients */}
                    <div
                        className={`transition-all duration-700 ${
                            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                        }`}
                    >
                        <div className="mb-4">
                            <div className="text-5xl md:text-6xl font-black bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
                                {counters.clients}+
                            </div>
                            <div className="text-white/60 font-light text-sm uppercase tracking-wider mt-2">
                                Happy Clients
                            </div>
                        </div>
                        <Users className="w-8 h-8 text-pink-300 mx-auto opacity-60" />
                    </div>

                    {/* Rating */}
                    <div
                        className={`transition-all duration-700 delay-200 ${
                            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                        }`}
                    >
                        <div className="mb-4">
                            <div className="text-5xl md:text-6xl font-black bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
                                5.0
                            </div>
                            <div className="text-white/60 font-light text-sm uppercase tracking-wider mt-2">
                                Average Rating
                            </div>
                        </div>
                        <div className="flex justify-center space-x-1">
                            {[...Array(5)].map((_, i) => (
                                <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                            ))}
                        </div>
                    </div>

                    {/* Specialists */}
                    <div
                        className={`transition-all duration-700 delay-300 ${
                            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                        }`}
                    >
                        <div className="mb-4">
                            <div className="text-5xl md:text-6xl font-black bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
                                {counters.specialists}+
                            </div>
                            <div className="text-white/60 font-light text-sm uppercase tracking-wider mt-2">
                                Nail Artists
                            </div>
                        </div>
                        <Award className="w-8 h-8 text-pink-300 mx-auto opacity-60" />
                    </div>

                    {/* Experience */}
                    <div
                        className={`transition-all duration-700 delay-400 ${
                            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                        }`}
                    >
                        <div className="mb-4">
                            <div className="text-5xl md:text-6xl font-black bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
                                {counters.experience}
                            </div>
                            <div className="text-white/60 font-light text-sm uppercase tracking-wider mt-2">
                                Years Experience
                            </div>
                        </div>
                        <Sparkles className="w-8 h-8 text-pink-300 mx-auto opacity-60" />
                    </div>
                </div>

                {/* Bottom CTA */}
                <div className="text-center mt-16">
                    <div
                        className={`transition-all duration-700 delay-500 ${
                            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                        }`}
                    >
                        <p className="text-white/60 mb-6 text-lg">
                            Ready to experience luxury nail care?
                        </p>

                        <Button
                            onClick={user ? () => router.push("/booking") : () => openAuth(true)}
                            label={
                                <span className="flex items-center gap-2">
                                    <Sparkles className="w-5 h-5" />
                                    Book Your Appointment
                                    <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
                                </span>
                            }
                            theme="group px-10 py-4 bg-gradient-to-r from-pink-500 to-purple-600
                                text-white font-bold rounded-full shadow-2xl
                                hover:shadow-pink-500/25 transition-all duration-300
                                hover:scale-105 inline-flex items-center gap-2"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Stats;
