"use client";

import React, { useRef } from "react";
import { Tag } from "lucide-react";
import { pricing_categories } from "@/data/data";
import { useSparkles } from "@/hooks/useSparkles";
import RenderIndividualServices from "@/components/pricingRendering/renderIndividualServices";
import RenderPackages from "@/components/pricingRendering/renderPackages";
import RenderMemberships from "@/components/pricingRendering/renderMembership";
import { useGsap } from "@/hooks/useGsap";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useAuth } from "@/context/contextAuth";
import { useAuthModal } from "@/context/authModelContext";

gsap.registerPlugin(ScrollTrigger);

const Pricing = () => {
    const containerRef = useRef(null);
    const [activeCategory, setActiveCategory] = React.useState("individual");
    const sparkles = useSparkles(20);
    const { user } = useAuth();
    const { openAuth } = useAuthModal();

    useGsap(containerRef, ".fade-in");
    return (
        <section
            id="pricing"
            ref={containerRef}
            className="w-screen min-h-screen overflow-hidden relative py-20"
        >
            {/* Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-pink-900">
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
                <div className="absolute top-1/4 right-1/5 w-96 h-96 bg-gradient-to-br from-pink-400/10 to-purple-400/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-1/4 left-1/5 w-80 h-80 bg-gradient-to-br from-purple-400/10 to-pink-400/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-6">
                {/* Header */}
                <div className="text-center mb-16 fade-in">
                    <div className="inline-flex items-center px-6 py-2 mb-8 bg-white/10 backdrop-blur-lg border border-white/20 rounded-full">
                        <Tag className="w-4 h-4 text-pink-400 mr-3" />
                        <span className="text-sm font-medium text-white/90 tracking-wide">
              TRANSPARENT PRICING
            </span>
                    </div>

                    <h2 className="text-5xl md:text-8xl  text-center font-black leading-tight mb-8">
            <span className="block bg-gradient-to-r from-white via-pink-200 to-purple-200 bg-clip-text text-transparent drop-shadow-2xl">
              Luxury That&apos;s
            </span>
                        <span className="block bg-gradient-to-r from-pink-300 via-rose-200 to-white bg-clip-text text-transparent drop-shadow-2xl">
              Worth Every Penny
            </span>
                    </h2>

                    <p className="text-xl font-extralight text-white/70 max-w-3xl mx-auto leading-relaxed">
                        Discover our range of premium nail services designed to fit every
                        budget and preference
                    </p>
                </div>

                {/* Category Tabs */}
                <div className="flex flex-wrap justify-center gap-4 mb-16 fade-in">
                    {pricing_categories.map((category) => {
                        const Icon = category.icon;
                        return (
                            <button
                                key={category.id}
                                onClick={() => setActiveCategory(category.id)}
                                className={`flex items-center space-x-3 px-8 py-4 rounded-full font-semibold transition-all duration-300 hover:scale-105 ${
                                    activeCategory === category.id
                                        ? "bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg shadow-pink-500/25"
                                        : "bg-white/10 backdrop-blur-lg border border-white/20 text-white/80 hover:bg-white/20"
                                }`}
                            >
                                <Icon className="w-5 h-5" />
                                <span>{category.name}</span>
                            </button>
                        );
                    })}
                </div>

                {/* Content */}
                <div className="fade-in">
                    {activeCategory === "individual" && (
                        <RenderIndividualServices user={user} openAuth={openAuth} />
                    )}
                    {activeCategory === "packages" && (
                        <RenderPackages user={user} openAuth={openAuth} />
                    )}
                    {activeCategory === "membership" && (
                        <RenderMemberships user={user} openAuth={openAuth} />
                    )}
                </div>
            </div>
        </section>
    );
};

export default Pricing;