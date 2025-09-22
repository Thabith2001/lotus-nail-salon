"use client";
import React, {useRef, useEffect, useState} from "react";
import { Heart } from "lucide-react";
import { useSparkles } from "@/hooks/useSparkles";
import Stats from "@/components/sections/statSection";
import { features } from "@/data/data";
import { useAnimatedCounters } from "@/hooks/useCounter";
import { useGsap } from "@/hooks/useGsap";


const About = () => {
    const sparkles = useSparkles(20);
    const containerRef = useRef(null);
    const [isVisible,setIsVisible] = useState(false);
    const { counters, animateCounters } = useAnimatedCounters();

    useEffect(() => { animateCounters(); }, []);

    useEffect(() => {
        animateCounters();
    }, [animateCounters]);

    useGsap({
        ref: containerRef,
        animation: (gsap) => {
            const q = gsap.utils.selector(containerRef);
            gsap.fromTo(
                q(".fade-in"),
                { opacity: 0, y: 50 },
                {
                    opacity: 1,
                    y: 0,
                    stagger: 0.2,
                    duration: 1,
                    ease: "power4.out",
                    scrollTrigger: {
                        trigger: containerRef.current,
                        start: "top 80%",
                    },
                }
            );

        },
    });

    return (
        <section
            className="w-screen min-h-screen overflow-hidden relative"
            id="about"
            ref={containerRef}
        >
            {/* BG Gradient & Sparkles */}
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

                {/* Floating orbs */}
                <div className="absolute top-1/4 left-1/6 w-64 h-64 bg-gradient-to-br from-pink-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-1/4 right-1/6 w-80 h-80 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
            </div>

            {/* Main Content */}
            <div className="relative z-10 flex flex-col min-h-screen">
                <div className="flex-1 flex flex-col justify-center items-center px-6 py-20">
                    <div className="max-w-6xl mx-auto text-center fade-in">
                        {/* Badge */}
                        <div className="inline-flex items-center px-6 py-2 mb-8 bg-white/10 backdrop-blur-lg border border-white/20 rounded-full">
                            <Heart className="w-4 h-4 text-pink-400 mr-3" />
                            <span className="text-sm font-medium text-white/90 tracking-wide">
                OUR STORY
              </span>
                        </div>

                        {/* Title */}
                        <h2 className="text-5xl md:text-7xl lg:text-8xl font-black leading-tight mb-12 fade-in">
              <span className="block bg-gradient-to-r from-white via-pink-200 to-purple-200 bg-clip-text text-transparent drop-shadow-2xl">
                Crafting Beauty
              </span>
                            <span className="block bg-gradient-to-r from-pink-300 via-rose-200 to-white bg-clip-text text-transparent drop-shadow-2xl">
                Since 2025
              </span>
                        </h2>

                        {/* Paragraphs */}
                        <div className="max-w-4xl mx-auto space-y-6 mb-16 font-extralight">
                            <p className="text-xl md:text-xl text-white/80 leading-relaxed ">
                                Welcome to <span className="font-semibold bg-gradient-to-r from-pink-300 to-purple-300 bg-clip-text text-transparent">Lotus Salon</span>, where artistry meets luxury in every detail. We&apos;ve dedicated ourselves to redefining nail care through exceptional service and innovative techniques.
                            </p>
                            <p className="text-lg md:text-xl text-white/70 leading-relaxed">
                                Our team of master nail artists combines years of expertise with cutting-edge techniques to deliver experiences that transcend ordinary nail care. Every visit is a journey of relaxation, creativity, and personal expression.
                            </p>
                            <p className="text-lg md:text-xl text-white/70 leading-relaxed">
                                From classic elegance to avant-garde designs, we believe your nails are a canvas for self-expression. Let us transform your vision into reality in our tranquil, luxury environment.
                            </p>
                        </div>

                        {/* Features */}
                        <div className="grid md:grid-cols-3 gap-8 mb-16">
                            {features.map((feature, index) => {
                                const FeatureIcon = feature.icon;
                                return (
                                    <div
                                        key={index}
                                        className=" group bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all duration-500 hover:scale-105 hover:border-pink-300/30"
                                    >
                                        <div className="mb-6">
                                            <div className="w-16 h-16 bg-gradient-to-br from-pink-400 to-purple-500 rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300">
                                                <FeatureIcon className="w-8 h-8 text-white" />
                                            </div>
                                        </div>
                                        <h3 className="text-xl font-bold text-white mb-4">
                                            {feature.title}
                                        </h3>
                                        <p className="text-white/70 leading-relaxed">{feature.description}</p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats */}
            <Stats counters={counters} isVisible={isVisible} setIsVisible={setIsVisible} />
        </section>
    );
};

export default About;
