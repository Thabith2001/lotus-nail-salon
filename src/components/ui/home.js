"use client";
import React, {useRef} from "react";
import Image from "next/image";
import { useSparkles } from "@/hooks/useSparkles";
import Hero from "@/components/sections/heroSection";
import {useGsap} from "@/hooks/useGsap";

const Home = () => {
    const sparkles = useSparkles(25);
    const containerRef = useRef(null);
    useGsap(containerRef, ".fade-up");
    return (
        <section className="relative col-span-12 h-screen w-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-pink-900 overflow-hidden">
            {/* Background Layer */}
            <div className="absolute inset-0 z-0">
                <Image
                    src="/images/hero_img.jpg"
                    alt="Luxury Nail Spa"
                    fill
                    className="object-cover object-center opacity-40"
                    priority
                />
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
            </div>

            {/* Main Content */}
            <div className="relative z-10 w-full">
                <Hero />
            </div>
            {/* Scroll indicator */}
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 z-20 ">
                <div className="flex flex-col items-center gap-2 text-white/60 animate-bounce">
                    <span className="text-sm tracking-wider">DISCOVER MORE</span>
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                              d="M19 14l-7 7m0 0l-7-7m7 7V3"/>
                    </svg>
                </div>
            </div>
        </section>
    );
};

export default Home;