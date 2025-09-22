"use client";
import React, { useRef } from "react";
import { ArrowRight, Sparkles } from "lucide-react";
import Button from "@/components/buttons/buttons";
import { useGsap } from "@/hooks/useGsap";
import { useAuth } from "@/context/contextAuth";
import { useRouter } from "next/navigation";
import { useAuthModal } from "@/context/authModelContext";

const Hero = () => {
    const containerRef = useRef(null);
    const { user } = useAuth();
    const router = useRouter();
    const { openAuth } = useAuthModal();

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
        <div ref={containerRef} className="relative z-50 max-w-6xl mx-auto text-center px-6">
            {/* Premium badge */}
            <div className="fade-in inline-flex items-center px-6 py-2 mb-8 bg-white/10 backdrop-blur-lg border border-white/20 rounded-full">
                <span className="w-2 h-2 bg-pink-400 rounded-full mr-3 animate-pulse"></span>
                <span className="text-sm font-medium text-white/90 tracking-wide">
          LUXURY NAIL EXPERIENCE
        </span>
            </div>

            {/* Main headline */}
            <h1 className="fade-in text-5xl md:text-7xl lg:text-8xl font-black leading-tight mb-8">
        <span className="block bg-gradient-to-r from-white via-pink-200 to-purple-200 bg-clip-text text-transparent drop-shadow-2xl">
          Where Beauty
        </span>
                <span className="block bg-gradient-to-r from-pink-300 via-rose-200 to-white bg-clip-text text-transparent drop-shadow-2xl">
          Meets Artistry
        </span>
            </h1>

            {/* Subtitle */}
            <div className="fade-in max-w-3xl mx-auto mb-12">
                <p className="text-xl md:text-2xl text-white/80 leading-relaxed font-extralight">
                    Immerse yourself in a world of
                    <span className="font-light bg-gradient-to-r from-pink-300 to-purple-300 bg-clip-text text-transparent">
            {" "}
                        premium nail artistry{" "}
          </span>
                    where every detail is crafted to perfection
                </p>
            </div>

            {/* CTA */}
            <div className="fade-in flex flex-col sm:flex-row justify-center items-center gap-6">
                <Button
                    onClick={user ? () => router.push("/booking") : openAuth}
                    label={
                        <span className="flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              Book Your Appointment
              <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
            </span>
                    }
                    theme="group relative px-10 py-4 bg-gradient-to-r from-pink-400 to-purple-400 text-white font-bold rounded-full
          overflow-hidden shadow-2xl hover:shadow-pink-500/25 transition-all duration-300 hover:scale-105"
                />

                <Button
                    onClick={() => {
                        router.push("/#gallery");
                        window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    label={
                        <span className="flex items-center gap-2">
              View Gallery
              <ArrowRight className="w-5 h-5 " />
            </span>
                    }
                    theme="group px-10 py-4 bg-white/10 backdrop-blur-lg border border-white/30 text-white font-bold rounded-full hover:bg-white/20
          transition-all duration-300 hover:scale-105 hover:border-pink-300/50"
                />
            </div>

            {/* Social proof */}
            <div className="fade-in mt-16 flex flex-wrap justify-center items-center gap-8 opacity-70">
                <div className="text-center">
                    <div className="text-2xl font-bold text-white">500+</div>
                    <div className="text-sm text-white/70">Happy Clients</div>
                </div>
                <div className="w-px h-8 bg-white/30 hidden sm:block"></div>
                <div className="text-center">
                    <div className="text-2xl font-bold text-white">5★</div>
                    <div className="text-sm text-white/70">Average Rating</div>
                </div>
                <div className="w-px h-8 bg-white/30 hidden sm:block"></div>
                <div className="text-center">
                    <div className="text-2xl font-bold text-white">1+</div>
                    <div className="text-sm text-white/70">Years Experience</div>
                </div>
            </div>
        </div>
    );
};

export default Hero;
