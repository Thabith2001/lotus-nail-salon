"use client";
import React, { useState, useRef } from "react";
import {
    X,
    ZoomIn,
    Heart,
    Star,
    ChevronLeft,
    ChevronRight,
    Instagram,
    Camera,
} from "lucide-react";
import { galleryItems, categories } from "@/data/data";
import { useSparkles } from "@/hooks/useSparkles";
import Button from "@/components/buttons/buttons";
import { useGsap } from "@/hooks/useGsap";

const Gallery = () => {
    const [selectedImage, setSelectedImage] = useState(null);
    const [activeCategory, setActiveCategory] = useState("all");
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const sparkles = useSparkles(25);
    const containerRef = useRef(null);

    const filteredItems =
        activeCategory === "all"
            ? galleryItems
            : galleryItems.filter((item) => item.category === activeCategory);

    const openModal = (image, index) => {
        setSelectedImage(image);
        setCurrentImageIndex(index);
        document.body.style.overflow = "hidden";
    };

    const closeModal = () => {
        setSelectedImage(null);
        document.body.style.overflow = "unset";
    };

    const navigateImage = (direction) => {
        const newIndex =
            direction === "next"
                ? (currentImageIndex + 1) % filteredItems.length
                : currentImageIndex === 0
                    ? filteredItems.length - 1
                    : currentImageIndex - 1;

        setCurrentImageIndex(newIndex);
        setSelectedImage(filteredItems[newIndex]);
    };

    // 🔥 Animate gallery sections with GSAP
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
            className="w-screen min-h-screen overflow-hidden relative py-20"
            id="gallery"
            ref={containerRef}
        >
            {/* Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-pink-900">
                {/* Animated sparkles */}
                <div className="absolute inset-0 overflow-hidden">
                    {sparkles.map((_, i) => (
                        <div
                            key={i}
                            className="absolute w-1 h-1 bg-pink-300 rounded-full opacity-30 animate-twinkle"
                            style={{
                                left: `${Math.random() * 100}%`,
                                top: `${Math.random() * 100}%`,
                                animationDelay: `${Math.random() * 3}s`,
                                animationDuration: `${2 + Math.random() * 2}s`,
                            }}
                        />
                    ))}
                </div>

                {/* Floating gradient orbs */}
                <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-gradient-to-br from-pink-400/10 to-purple-400/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-gradient-to-br from-purple-400/10 to-pink-400/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-6">
                {/* Header */}
                <div className="text-center mb-16 fade-in">
                    <div className="inline-flex items-center px-6 py-2 mb-8 bg-white/10 backdrop-blur-lg border border-white/20 rounded-full">
                        <Camera className="w-4 h-4 text-pink-400 mr-3" />
                        <span className="text-sm font-medium text-white/90 tracking-wide">
              OUR PORTFOLIO
            </span>
                    </div>

                    <h2 className="text-5xl md:text-7xl font-black leading-tight mb-8">
            <span className="block bg-gradient-to-r from-white via-pink-200 to-purple-200 bg-clip-text text-transparent drop-shadow-2xl">
              Artistry in
            </span>
                        <span className="block bg-gradient-to-r from-pink-300 via-rose-200 to-white bg-clip-text text-transparent drop-shadow-2xl">
              Every Detail
            </span>
                    </h2>

                    <p className="text-xl font-extralight text-white/70 max-w-3xl mx-auto leading-relaxed">
                        Discover our collection of exquisite nail artistry, where creativity
                        meets precision in every design
                    </p>
                </div>

                {/* Category Filter */}
                <div className="flex flex-wrap justify-center gap-4 mb-16 fade-in">
                    {categories.map((category) => (
                        <button
                            key={category.id}
                            onClick={() => setActiveCategory(category.id)}
                            className={`px-8 py-3 rounded-full font-semibold transition-all duration-300 hover:scale-105 ${
                                activeCategory === category.id
                                    ? "bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg shadow-pink-500/25"
                                    : "bg-white/10 backdrop-blur-lg border border-white/20 text-white/80 hover:bg-white/20"
                            }`}
                        >
                            {category.name}
                            <span className="ml-2 text-sm opacity-75">({category.count})</span>
                        </button>
                    ))}
                </div>

                {/* Gallery Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 fade-in">
                    {filteredItems.map((item, index) => (
                        <div
                            key={item.id}
                            className="group relative aspect-square bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl overflow-hidden hover:scale-105 hover:shadow-2xl hover:shadow-pink-500/20 transition-all duration-500 cursor-pointer"
                            onClick={() => openModal(item, index)}
                        >
                            <div className="w-full h-full bg-gradient-to-br from-pink-200 to-purple-200 flex items-center justify-center">
                                <Camera className="w-16 h-16 text-white/50" />
                                <span className="absolute inset-0 flex items-center justify-center text-white font-semibold">
                  {item.title}
                </span>
                            </div>

                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <div className="absolute bottom-4 left-4 right-4">
                                    <h3 className="text-white font-bold text-lg mb-2">
                                        {item.title}
                                    </h3>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-2">
                                            <Heart className="w-4 h-4 text-pink-400" />
                                            <span className="text-white/80 text-sm">{item.likes}</span>
                                        </div>
                                        <ZoomIn className="w-5 h-5 text-white/80" />
                                    </div>
                                </div>
                            </div>

                            <div className="absolute top-4 right-4 w-8 h-8 bg-white/20 backdrop-blur-lg rounded-full flex items-center justify-center text-white text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                {index + 1}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Social Media */}
                <div className="text-center mt-16 fade-in">
                    <p className="text-white/60 mb-6 text-lg">
                        Follow us for daily inspiration
                    </p>
                    <div className="flex justify-center space-x-6">
                        <Button
                            theme="group px-8 py-4 bg-white/10 backdrop-blur-lg border border-white/20 text-white rounded-full hover:bg-white/20 transition-all duration-300 hover:scale-105"
                            onClick={() =>
                                window.open("https://www.instagram.com/lotusspaNails", "_blank")
                            }
                            label={
                                <span className="flex items-center gap-3">
                  <Instagram className="w-5 h-5" />
                  @LotusSpaNails
                </span>
                            }
                        />
                    </div>
                </div>
            </div>

            {/* Modal */}
            {selectedImage && (
                <div className="fixed inset-0 bg-black/95 backdrop-blur-xl z-50 flex items-center justify-center p-4">
                    {/* Close */}
                    <button
                        onClick={closeModal}
                        className="absolute top-6 right-6 w-12 h-12 bg-white/10 backdrop-blur-lg border border-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors z-10"
                    >
                        <X className="w-6 h-6" />
                    </button>

                    {/* Prev */}
                    <button
                        onClick={() => navigateImage("prev")}
                        className="absolute left-6 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white/10 backdrop-blur-lg border border-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors z-10"
                    >
                        <ChevronLeft className="w-6 h-6" />
                    </button>

                    {/* Next */}
                    <button
                        onClick={() => navigateImage("next")}
                        className="absolute right-6 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white/10 backdrop-blur-lg border border-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors z-10"
                    >
                        <ChevronRight className="w-6 h-6" />
                    </button>

                    {/* Modal Content */}
                    <div className="max-w-4xl max-h-full flex flex-col items-center">
                        <div className="w-full max-w-3xl aspect-square bg-gradient-to-br from-pink-200 to-purple-200 rounded-2xl flex items-center justify-center mb-6">
                            <Camera className="w-24 h-24 text-white/50" />
                        </div>

                        <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 text-center max-w-lg">
                            <h3 className="text-2xl font-bold text-white mb-4">
                                {selectedImage.title}
                            </h3>
                            <div className="flex items-center justify-center space-x-6 text-white/70">
                                <div className="flex items-center space-x-2">
                                    <Heart className="w-5 h-5 text-pink-400" />
                                    <span>{selectedImage.likes} likes</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            className="w-4 h-4 text-yellow-400 fill-current"
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-white/10 backdrop-blur-lg border border-white/20 rounded-full px-4 py-2 text-white text-sm">
                        {currentImageIndex + 1} of {filteredItems.length}
                    </div>
                </div>
            )}
        </section>
    );
};

export default Gallery;