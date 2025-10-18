import { Calendar, Check, Clock, Gift, Sparkles, Zap } from "lucide-react";
import React, { useEffect, useState } from "react";
import DynamicButton from "@/components/buttons/dynamicButton";

const RenderPackages = ({ user, openAuth }) => {
    const [packages, setPackages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPackages = async () => {
            try {
                const res = await fetch("/api/packages");
                const data = await res.json();
                setPackages(data.packages || []);
            } catch (error) {
                console.error("Error fetching packages:", error);
                setError("Failed to load packages.");
            } finally {
                setLoading(false);
            }
        };
        fetchPackages();
    }, []);

    const getCardTheme = (index) => {
        const themes = [
            {
                gradient: "from-violet-500 to-purple-600",
                glow: "from-violet-500/20 to-purple-600/20",
                accent: "from-violet-400 to-purple-400",
            },
            {
                gradient: "from-pink-500 to-rose-600",
                glow: "from-pink-500/20 to-rose-600/20",
                accent: "from-pink-400 to-rose-400",
            },
            {
                gradient: "from-blue-500 to-cyan-600",
                glow: "from-blue-500/20 to-cyan-600/20",
                accent: "from-blue-400 to-cyan-400",
            },
        ];
        return themes[index % themes.length];
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="text-center space-y-4">
                    <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-purple-400 mx-auto"></div>
                    <p className="text-white/60 text-sm sm:text-base">Loading packages...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center py-20 px-4">
                <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-4 sm:p-6 text-center">
                    <p className="text-red-400 text-sm sm:text-base">{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {packages.map((pkg, index) => {
                const theme = getCardTheme(index);

                return (
                    <div
                        key={pkg._id}
                        className={`group relative bg-gradient-to-b from-white/5 to-white/[0.02] backdrop-blur-xl border rounded-2xl sm:rounded-3xl overflow-hidden transition-all duration-500 hover:shadow-2xl flex flex-col ${
                            pkg.recommended
                                ? "border-pink-500/50 ring-1 sm:ring-2 ring-pink-500/20 shadow-pink-500/20 hover:shadow-pink-500/40 md:scale-105"
                                : "border-white/10 hover:border-white/20 hover:-translate-y-1 sm:hover:-translate-y-2"
                        }`}
                    >
                        {/* Animated Background */}
                        <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br ${theme.glow} blur-2xl sm:blur-3xl -z-10`}></div>

                        {/* Recommended Badge */}
                        {pkg.recommended && (
                            <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 z-10">
                                <div className="relative">
                                    <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-purple-600 blur-md opacity-50"></div>
                                    <div className="relative px-3 mt-2 sm:px-4 py-1 sm:py-1.5 bg-gradient-to-r from-pink-500 to-purple-600 text-white text-[10px] sm:text-xs md:text-sm font-bold rounded-full shadow-lg flex items-center gap-1 sm:gap-1.5">
                                        <Sparkles className="w-3 h-3 sm:w-4 sm:h-4" />
                                        <span className="whitespace-nowrap">Most Popular</span>
                                        <Sparkles className="w-3 h-3 sm:w-4 sm:h-4" />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Savings Badge */}
                        {pkg.savings && (
                            <div className="absolute top-3 sm:top-4 right-3 sm:right-4 z-10">
                                <div className="relative">
                                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-500 blur-md opacity-50"></div>
                                    <div className="relative px-2 sm:px-3 py-0.5 sm:py-1 bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-[10px] sm:text-xs font-bold rounded-full shadow-lg flex items-center gap-1 sm:gap-1.5">
                                        <Zap className="w-3 h-3" />
                                        <span className="whitespace-nowrap">Save ${pkg.savings}</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="p-4 sm:p-6 lg:p-8 pt-8 sm:pt-10 flex-1 flex flex-col">
                            {/* Header */}
                            <div className="text-center mb-4 sm:mb-6">
                                <div className="relative inline-block mb-5">
                                    <div className={`absolute inset-0 bg-gradient-to-br ${theme.gradient} blur-xl sm:blur-2xl opacity-40 group-hover:opacity-60 transition-opacity duration-500`}></div>
                                    <div
                                        className={`relative mt-5 w-20 h-20 bg-gradient-to-br ${theme.gradient} rounded-xl sm:rounded-2xl flex items-center justify-center shadow-xl transform group-hover:scale-105 sm:group-hover:scale-110 group-hover:rotate-3 sm:group-hover:rotate-6 transition-all duration-500`}
                                    >
                                        <Gift className="w-15 h-15  text-white" />
                                    </div>
                                </div>

                                <h3 className="text-lg sm:text-2xl lg:text-3xl font-bold text-white mb-1 sm:mb-2 group-hover:scale-105 transition-transform duration-300">
                                    {pkg.name}
                                </h3>
                                <p className="text-white/60 text-xs sm:text-sm lg:text-base leading-relaxed mb-3 sm:mb-4 px-1 sm:px-2 line-clamp-3">
                                    {pkg.description}
                                </p>

                                {/* Duration */}
                                {pkg.duration && (
                                    <div className="flex items-center justify-center mb-3 sm:mb-4">
                                        <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1 sm:py-1.5 bg-blue-500/20 border border-blue-500/30 rounded-full">
                                            <Clock className="w-3 h-3 sm:w-4 sm:h-4 text-blue-400" />
                                            <span className="text-blue-400 text-xs sm:text-sm font-semibold">
                                                {pkg.duration} minutes
                                            </span>
                                        </div>
                                    </div>
                                )}

                                {/* Price */}
                                <div className="relative inline-block mb-4">
                                    <div className="flex items-baseline justify-center gap-1.5 sm:gap-3">
                                        {pkg.originalPrice && (
                                            <span className="text-sm sm:text-lg text-white/40 line-through font-medium">
                                                ${pkg.originalPrice}
                                            </span>
                                        )}
                                        <div className="relative">
                                            <div className={`absolute inset-0 bg-gradient-to-r ${theme.accent} blur-lg sm:blur-xl opacity-50`}></div>
                                            <span className={`relative text-2xl sm:text-4xl lg:text-5xl font-extrabold bg-gradient-to-r ${theme.accent} bg-clip-text text-transparent`}>
                                                ${pkg.price}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent mb-4 sm:mb-6"></div>

                            {/* Services */}
                            {pkg.services?.length > 0 && (
                                <div className="mb-4 sm:mb-6">
                                    <h4 className="text-white/90 font-bold text-xs sm:text-sm uppercase tracking-wider mb-2 sm:mb-4 flex items-center gap-1.5">
                                        <div className={`w-1 h-3 sm:h-4 bg-gradient-to-b ${theme.accent} rounded-full`}></div>
                                        Services Included
                                    </h4>
                                    <div className="space-y-2 sm:space-y-3">
                                        {pkg.services.map((service, idx) => (
                                            <div key={idx} className="flex items-start space-x-2 sm:space-x-3">
                                                <div className="flex-shrink-0 w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-green-500/20 flex items-center justify-center mt-0.5">
                                                    <Check className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-green-400" />
                                                </div>
                                                <span className="text-white/70 text-xs sm:text-sm lg:text-base leading-relaxed">
                                                    {service}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Features */}
                            {pkg.features?.length > 0 && (
                                <div className="mb-4 sm:mb-6">
                                    <h4 className="text-white/90 font-bold text-xs sm:text-sm uppercase tracking-wider mb-2 sm:mb-4 flex items-center gap-1.5">
                                        <div className="w-1 h-3 sm:h-4 bg-gradient-to-b from-pink-400 to-purple-400 rounded-full"></div>
                                        Package Features
                                    </h4>
                                    <div className="space-y-2 sm:space-y-3">
                                        {pkg.features.map((feature, idx) => (
                                            <div key={idx} className="flex items-start space-x-2 sm:space-x-3">
                                                <div className="flex-shrink-0 w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-pink-500/20 flex items-center justify-center mt-0.5">
                                                    <Sparkles className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-pink-400" />
                                                </div>
                                                <span className="text-white/70 text-xs sm:text-sm lg:text-base leading-relaxed">
                                                    {feature}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="flex-1"></div>

                            {/* Book Button */}

                            <DynamicButton
                                data={pkg}
                                hrefBase={user ? "/booking" : undefined}
                                onClick={!user ? openAuth : undefined}
                                theme={`w-full py-2.5 sm:py-3.5 px-4 sm:px-6 rounded-lg sm:rounded-xl font-bold text-white text-sm sm:text-base transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg bg-gradient-to-r ${theme.gradient} hover:shadow-2xl relative overflow-hidden mt-4 sm:mt-6`}
                                label={
                                    <span className="relative flex items-center  justify-center gap-1.5 sm:gap-2">
                                    <Calendar className="w-4 h-4 sm:w-5 sm:h-5" />
                                    Book Package
                                    </span>
                                }
                            />

                        </div>

                        <div className={`h-0.5 sm:h-1 bg-gradient-to-r ${theme.gradient} opacity-50 group-hover:opacity-100 transition-opacity duration-500`}></div>
                    </div>
                );
            })}
        </div>
    );
};

export default RenderPackages;
