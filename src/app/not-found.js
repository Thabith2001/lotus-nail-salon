'use client';

import React, {useEffect, useState} from 'react';
import {useRouter} from "next/navigation";
import {Home, ArrowLeft, Search} from "lucide-react";
import {useSparkles} from "@/hooks/useSparkles";

const Not_Found = () => {
    const router = useRouter();
    const [mousePosition, setMousePosition] = useState({x: 0, y: 0});
    const sparkles = useSparkles(30);

    // Track mouse for parallax effect
    useEffect(() => {
        const handleMouseMove = (e) => {
            setMousePosition({
                x: (e.clientX / window.innerWidth - 0.5) * 20,
                y: (e.clientY / window.innerHeight - 0.5) * 20
            });
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    return (
        <div className="relative w-screen h-screen overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-pink-900">
            {/* Background Effects */}
            <div className="absolute inset-0">
                {/* Animated gradient orbs - responsive sizing */}
                <div
                    className="absolute top-1/4 right-1/4 w-48 h-48 sm:w-64 sm:h-64 md:w-80 md:h-80 lg:w-96 lg:h-96 bg-gradient-to-br from-pink-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse"
                    style={{
                        transform: `translate(${mousePosition.x}px, ${mousePosition.y}px)`
                    }}
                ></div>
                <div
                    className="absolute bottom-1/4 left-1/4 w-40 h-40 sm:w-56 sm:h-56 md:w-72 md:h-72 lg:w-80 lg:h-80 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse"
                    style={{
                        transform: `translate(${-mousePosition.x}px, ${-mousePosition.y}px)`,
                        animationDelay: '1s'
                    }}
                ></div>

                {/* Sparkles */}
                <div className="absolute inset-0 overflow-hidden">
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

                {/* Grid pattern overlay - hidden on mobile for cleaner look */}
                <div
                    className="absolute inset-0 opacity-5 hidden sm:block"
                    style={{
                        backgroundImage: `
                            linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)
                        `,
                        backgroundSize: '30px 30px'
                    }}
                ></div>
            </div>

            {/* Content - Fully Responsive */}
            <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 sm:px-6 md:px-8 lg:px-12 py-8 sm:py-12 text-center">

                {/* Badge - Responsive sizing and spacing */}
                <div className="inline-flex items-center mt-8 mb-4 sm:mb-6 md:mb-8 px-4 sm:px-6 py-2 sm:py-2.5 bg-white/10 backdrop-blur-lg border border-white/20 rounded-full shadow-lg">
                    <Search className="w-3 h-3 sm:w-4 sm:h-4 text-pink-400 mr-2" />
                    <span className="text-xs sm:text-sm font-medium text-white/90 tracking-wide uppercase">
                        Page Not Found
                    </span>
                </div>

                {/* 404 Text - Highly responsive */}
                <div className="mb-4 sm:mb-6 md:mb-8">
                    <h1 className="text-7xl sm:text-8xl md:text-9xl lg:text-[180px] xl:text-[200px] font-black bg-gradient-to-r from-pink-300 via-purple-300 to-pink-300 bg-clip-text text-transparent drop-shadow-2xl animate-shimmer bg-[length:200%_100%] leading-none">
                        404
                    </h1>
                </div>

                {/* Message - Responsive typography */}
                <div className="max-w-xs sm:max-w-md md:max-w-lg lg:max-w-2xl xl:max-w-3xl mb-6 sm:mb-8 md:mb-10 lg:mb-12">
                    <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-white mb-3 sm:mb-4 leading-tight px-2">
                        Oops! This page is getting a
                        <span className="block mt-1 sm:mt-2 bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
                            Beauty Treatment
                        </span>
                    </h2>
                    <p className="text-sm sm:text-base md:text-lg lg:text-xl text-white/70 leading-relaxed font-light px-2 sm:px-4">
                        The page you&#39;re looking for doesn&#39;t exist or has been moved.
                        Let&#39;s get you back to something beautiful.
                    </p>
                </div>

                {/* Action Buttons - Fully responsive layout */}
                <div className="flex flex-col xs:flex-row gap-3 sm:gap-4 w-full max-w-xs sm:max-w-none sm:w-auto px-4 sm:px-0">
                    <button
                        onClick={() => router.push('/')}
                        className="group flex items-center justify-center space-x-2 sm:space-x-3 px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white text-sm sm:text-base font-bold rounded-xl sm:rounded-2xl hover:scale-105 hover:shadow-2xl hover:shadow-pink-500/50 transition-all duration-300 w-full sm:w-auto"
                    >
                        <Home className="w-4 h-4 sm:w-5 sm:h-5 group-hover:rotate-12 transition-transform duration-300 flex-shrink-0" />
                        <span className="whitespace-nowrap">Return Home</span>
                    </button>

                    <button
                        onClick={() => router.back()}
                        className="group flex items-center justify-center space-x-2 sm:space-x-3 px-6 sm:px-8 py-3 sm:py-4 bg-white/10 backdrop-blur-lg border border-white/20 text-white text-sm sm:text-base font-bold rounded-xl sm:rounded-2xl hover:bg-white/20 hover:scale-105 transition-all duration-300 w-full sm:w-auto"
                    >
                        <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 group-hover:-translate-x-1 transition-transform duration-300 flex-shrink-0" />
                        <span className="whitespace-nowrap">Go Back</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Not_Found;