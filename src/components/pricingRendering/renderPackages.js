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
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {packages.map((pkg, index) => {
                    const theme = getCardTheme(index);

                    return (
                        <div
                            key={pkg._id}
                            className={`group relative h-[720px] bg-gradient-to-b from-white/5 to-white/[0.02] backdrop-blur-xl border rounded-3xl overflow-hidden transition-all duration-500 hover:shadow-2xl ${
                                pkg.recommended
                                    ? "border-pink-500/50 ring-2 ring-pink-500/20 shadow-pink-500/20 hover:shadow-pink-500/40 "
                                    : "border-white/10 hover:border-white/20 hover:-translate-y-2"
                            }`}
                        >
                            {/* Animated Background */}
                            <div
                                className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br ${theme.glow} blur-3xl -z-10`}
                            />

                            {pkg.recommended && (
                                <div className=" w-[190px] absolute text-center -top-1 left-1/2 transform -translate-x-1/2 z-10">
                                    <div className="relative">
                                        <div
                                            className="absolute inset-0 bg-gradient-to-r from-pink-500 to-purple-600 blur-lg opacity-50"/>
                                        <div
                                            className="relative  mt-2 px-6 py-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white text-sm font-bold rounded-full shadow-lg flex items-center gap-2">
                                            <Sparkles className="w-4 h-4"/>
                                            <span >Most Popular</span>
                                            <Sparkles className="w-4 h-4"/>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Savings Badge */}
                            {pkg.savings && (
                                <div className="absolute top-6 right-6 z-10">
                                    <div className="relative">
                                        <div
                                            className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-500 blur-md opacity-50"/>
                                        <div
                                            className="relative px-3 py-1.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-xs font-bold rounded-full shadow-lg flex items-center gap-1.5">
                                            <Zap className="w-3 h-3"/>
                                            <span>Save ${pkg.savings}</span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Content Container with fixed sections */}
                            <div className="flex flex-col h-full p-6">
                                {/* Header Section - Fixed height */}
                                <div className="text-center pt-8 pb-6">
                                    <div className="relative inline-block mb-4">
                                        <div
                                            className={`absolute inset-0 bg-gradient-to-br ${theme.gradient} blur-2xl opacity-40 group-hover:opacity-60 transition-opacity duration-500`}
                                        />
                                        <div
                                            className={`relative w-20 h-20 bg-gradient-to-br ${theme.gradient} rounded-2xl flex items-center justify-center shadow-xl transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}
                                        >
                                            <Gift className="w-10 h-10 text-white"/>
                                        </div>
                                    </div>

                                    <h3 className="text-2xl font-bold text-white mb-2 group-hover:scale-105 transition-transform duration-300">
                                        {pkg.name}
                                    </h3>
                                    <p className="text-white/60 text-sm leading-relaxed h-10 line-clamp-2">
                                        {pkg.description}
                                    </p>
                                </div>

                                {/* Duration & Price Section - Fixed height */}
                                <div className="text-center pb-6">
                                    {/* Duration */}
                                    {pkg.duration && (
                                        <div className="flex items-center justify-center mb-4">
                                            <div
                                                className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-500/20 border border-blue-500/30 rounded-full">
                                                <Clock className="w-4 h-4 text-blue-400"/>
                                                <span className="text-blue-400 text-sm font-semibold">
                                                        {pkg.duration} minutes
                                                    </span>
                                            </div>
                                        </div>
                                    )}

                                    {/* Price */}
                                    <div className="flex items-baseline justify-center gap-2 mb-2">
                                        {pkg.originalPrice && (
                                            <span className="text-lg text-white/40 line-through font-medium">
                                                    ${pkg.originalPrice}
                                                </span>
                                        )}
                                        <div className="relative">
                                            <div
                                                className={`absolute inset-0 bg-gradient-to-r ${theme.accent} blur-xl opacity-50`}
                                            />
                                            <span
                                                className={`relative text-5xl font-black bg-gradient-to-r ${theme.accent} bg-clip-text text-transparent`}
                                            >
                                                    ${pkg.price}
                                                </span>
                                        </div>
                                    </div>
                                    <p className="text-white/50 text-sm font-medium">one-time package</p>
                                </div>

                                {/* Divider */}
                                <div
                                    className="w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent mb-6"/>

                                {/* Services & Features Section - Scrollable with fixed height */}
                                <div
                                    className="flex-1 overflow-y-auto mb-6 pr-2 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
                                    {/* Services */}
                                    {pkg.services?.length > 0 && (
                                        <div className="mb-6">
                                            <h4 className="text-white/90 font-bold text-xs uppercase tracking-wider mb-3 flex items-center gap-2">
                                                <div
                                                    className={`w-1 h-4 bg-gradient-to-b ${theme.accent} rounded-full`}/>
                                                Services Included
                                            </h4>
                                            <div className="flex flex-col space-y-2.5">
                                                {pkg.services.map((service, idx) => (
                                                    <div key={idx} className="flex items-start space-x-3 group/item">
                                                        <div
                                                            className="flex-shrink-0 w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center mt-0.5 group-hover/item:bg-green-500/30 transition-colors">
                                                            <Check className="w-3 h-3 text-green-400"/>
                                                        </div>
                                                        <span
                                                            className="text-white/70 text-sm leading-relaxed group-hover/item:text-white/90 transition-colors">
                                                                {service}
                                                            </span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Features */}
                                    {pkg.features?.length > 0 && (
                                        <div>
                                            <h4 className="text-white/90 font-bold text-xs uppercase tracking-wider mb-3 flex items-center gap-2">
                                                <div
                                                    className="w-1 h-4 bg-gradient-to-b from-pink-400 to-purple-400 rounded-full"/>
                                                Package Features
                                            </h4>
                                            <div className="flex flex-col space-y-2.5">
                                                {pkg.features.map((feature, idx) => (
                                                    <div key={idx} className="flex items-start space-x-3 group/item">
                                                        <div
                                                            className="flex-shrink-0 w-5 h-5 rounded-full bg-pink-500/20 flex items-center justify-center mt-0.5 group-hover/item:bg-pink-500/30 transition-colors">
                                                            <Sparkles className="w-3 h-3 text-pink-400"/>
                                                        </div>
                                                        <span
                                                            className="text-white/70 text-sm leading-relaxed group-hover/item:text-white/90 transition-colors">
                                                                {feature}
                                                            </span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Button - Fixed at bottom */}
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

                            {/* Bottom Accent Line */}
                            <div
                                className={`h-1 bg-gradient-to-r ${theme.gradient} opacity-50 group-hover:opacity-100 transition-opacity duration-500`}
                            />
                        </div>
                    );
                })}
            </div>
        </>
    );

};

export default RenderPackages;
