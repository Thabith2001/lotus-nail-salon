"use client";
import React from 'react';
import {useSparkles} from "@/hooks/useSparkles";
import { Scissors } from "lucide-react";

const Services = () => {
    const sparkles = useSparkles(25);
    return (
        <section className="relative col-span-12 h-screen w-full flex flex-col items-center justify-center
        bg-gradient-to-br from-slate-900 via-purple-900 to-pink-900 overflow-hidden">
                {/* Sparkles */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    {sparkles.map((s, i) => (
                        <div
                            key={i}
                            className="absolute w-1 h-1 bg-pink-300 rounded-full opacity-20 animate-twinkle"
                            style={{
                                left: s.left,
                                top: s.top,
                                animationDelay: s.delay,
                                animationDuration: s.duration,
                            }}
                        />
                    ))}
                </div>
            <div className="inline-flex items-center px-6 py-2 mb-8 bg-white/10 backdrop-blur-lg border border-white/20 rounded-full">
                <Scissors className="w-4 h-4 text-pink-400 mr-3" />
                <span className="text-sm font-medium text-white/90 tracking-wide">OUR SERVICES</span>
            </div>

            {/* Title */}
            <h2 className="text-5xl md:text-8xl font-black leading-tight mb-8 text-center fade-in">
                        <span className="block bg-gradient-to-r from-white via-pink-200 to-purple-200 bg-clip-text text-transparent drop-shadow-2xl">
                            Premium Nail
                        </span>
                <span className="block bg-gradient-to-r from-pink-300 via-rose-200 to-white bg-clip-text text-transparent drop-shadow-2xl">
                            Experiences
                        </span>
            </h2>

            <p className="text-xl text-white/70 max-w-3xl mx-auto leading-relaxed font-extralight text-center">
                Discover our comprehensive range of luxury nail services, each designed to enhance your natural beauty
            </p>

        </section>
    );
};

export default Services;
