"use client";

import React, { useEffect, useState } from "react";
import {Check, Crown, Star, Sparkles, Zap, Calendar} from "lucide-react";
import axios from "axios";
import DynamicButton from "@/components/buttons/dynamicButton";

const RenderMemberships = ({ user, openAuth }) => {
    const [memberships, setMemberships] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchMemberships = async () => {
            try {
                const res = await axios.get("/api/membership");
                // Normalize API response
                const data =
                    Array.isArray(res.data) ? res.data : res.data?.memberships || [];
                setMemberships(data);
            } catch (err) {
                console.error("Error fetching memberships:", err);
                setError("Failed to load memberships.");
            } finally {
                setLoading(false);
            }
        };

        fetchMemberships();
    }, []);

    // Assign unique gradient themes to each membership based on index
    const getCardTheme = (index) => {
        const themes = [
            {
                gradient: "from-violet-500 to-purple-600",
                glow: "from-violet-500/20 to-purple-600/20",
                glowHover: "from-violet-500/30 to-purple-600/30",
                accent: "from-violet-400 to-purple-400",
            },
            {
                gradient: "from-pink-500 to-rose-600",
                glow: "from-pink-500/20 to-rose-600/20",
                glowHover: "from-pink-500/30 to-rose-600/30",
                accent: "from-pink-400 to-rose-400",
            },
            {
                gradient: "from-blue-500 to-cyan-600",
                glow: "from-blue-500/20 to-cyan-600/20",
                glowHover: "from-blue-500/30 to-cyan-600/30",
                accent: "from-blue-400 to-cyan-400",
            },
        ];

        return themes[index % themes.length];
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="text-center space-y-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400 mx-auto"></div>
                    <p className="text-white/60">Loading memberships...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-6 text-center">
                    <p className="text-red-400">{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 max-w-7xl mx-auto px-4 sm:px-6">
            {memberships.map((membership, index) => {
                const theme = getCardTheme(index);

                return (
                    <div
                        key={membership._id || membership.id || index}
                        className={`group relative bg-gradient-to-b from-white/5 to-white/[0.02] m-3 backdrop-blur-xl border rounded-3xl overflow-hidden transition-all duration-500 hover:shadow-2xl ${
                            membership.recommended
                                ? "border-pink-500/50 ring-2 ring-pink-500/20 shadow-pink-500/20 hover:shadow-pink-500/40 md:scale-105"
                                : "border-white/10 hover:border-white/20 hover:-translate-y-2"
                        }`}
                    >
                        {/* Animated Background Gradient */}
                        <div
                            className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br ${theme.glow} blur-3xl -z-10`}
                        ></div>

                        {/* Recommended Badge */}
                        {membership.recommended && (
                            <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 z-10">
                                <div className="relative">
                                    <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-purple-600 blur-lg opacity-50"></div>
                                    <div className="relative mt-2 px-4 sm:px-6 py-1.5 sm:py-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white text-xs sm:text-sm font-bold rounded-full shadow-lg flex items-center gap-1.5 sm:gap-2">
                                        <Sparkles className="w-3 h-3 sm:w-4 sm:h-4" />
                                        <span className="whitespace-nowrap">Best Value</span>
                                        <Sparkles className="w-3 h-3 sm:w-4 sm:h-4" />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Savings Badge */}
                        {membership.savings > 0 && (
                            <div className="absolute top-4 sm:top-6 right-4 sm:right-6 z-10">
                                <div className="relative">
                                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-500 blur-md opacity-50"></div>
                                    <div className="relative px-3 sm:px-4 py-1 sm:py-1.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-xs font-bold rounded-full shadow-lg flex items-center gap-1 sm:gap-1.5">
                                        <Zap className="w-3 h-3" />
                                        <span className="whitespace-nowrap">
                                            Save ${membership.savings}/mo
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="p-4 sm:p-6 md:p-8 pt-8 sm:pt-10 md:pt-12">
                            {/* Membership Header */}
                            <div className="text-center mb-5 sm:mb-7 md:mb-8">
                                <div className="relative inline-block mb-5 sm:mb-6">
                                    <div
                                        className={`absolute inset-0 bg-gradient-to-br ${theme.gradient} blur-2xl opacity-40 group-hover:opacity-60 transition-opacity duration-500`}
                                    ></div>
                                    <div
                                        className={`relative w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-gradient-to-br ${theme.gradient} rounded-2xl flex items-center justify-center shadow-xl transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}
                                    >
                                        <Crown className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-white" />
                                    </div>
                                </div>

                                <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-2 sm:mb-3 group-hover:scale-105 transition-transform duration-300">
                                    {membership.name}
                                </h3>
                                <p className="text-white/60 text-xs sm:text-sm md:text-base leading-relaxed mb-4 sm:mb-6 px-1 sm:px-3">
                                    {membership.description}
                                </p>

                                {/* Price Section */}
                                <div className="relative inline-block mb-4 sm:mb-6">
                                    <div className="flex flex-wrap items-baseline justify-center gap-1.5 sm:gap-2 md:gap-3">
                                        {membership.originalPrice && (
                                            <span className="text-sm sm:text-lg md:text-xl text-white/40 line-through font-medium">
            ${membership.originalPrice}
          </span>
                                        )}
                                        <div className="relative">
                                            <div
                                                className={`absolute inset-0 bg-gradient-to-r ${theme.accent} blur-xl opacity-50`}
                                            ></div>
                                            <span
                                                className={`relative text-3xl sm:text-4xl md:text-5xl font-black bg-gradient-to-r ${theme.accent} bg-clip-text text-transparent`}
                                            >
            ${membership.price}
          </span>
                                        </div>
                                    </div>
                                    <p className="text-white/50 text-xs sm:text-sm font-medium mt-2">
                                        per month
                                    </p>
                                    {membership.sessions && (
                                        <div className="mt-3 inline-flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1 bg-green-500/20 border border-green-500/30 rounded-full">
                                            <div className="w-1.5 sm:w-2 h-1.5 sm:h-2 bg-green-400 rounded-full animate-pulse"></div>
                                            <span className="text-green-400 text-xs sm:text-sm font-semibold">
            {membership.sessions} sessions included
          </span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Divider */}
                            <div className="w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent mb-5 sm:mb-6 md:mb-8"></div>

                            {/* Membership Features */}
                            {Array.isArray(membership.features) && membership.features.length > 0 && (
                                <div className="mb-6 sm:mb-8">
                                    <h4 className="text-white/90 font-bold text-xs sm:text-sm uppercase tracking-wider mb-3 sm:mb-4 flex items-center gap-2">
                                        <div className={`w-1 h-4 bg-gradient-to-b ${theme.accent} rounded-full`}></div>
                                        What's Included
                                    </h4>
                                    <div className="flex flex-col space-y-2 sm:space-y-3 max-h-40 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
                                        {membership.features.map((feature, idx) => (
                                            <div key={idx} className="flex items-start space-x-2 sm:space-x-3 group/item">
                                                <div className="flex-shrink-0 w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-green-500/20 flex items-center justify-center mt-0.5 group-hover/item:bg-green-500/30 transition-colors">
                                                    <Check className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-green-400" />
                                                </div>
                                                <span className="text-white/70 text-xs sm:text-sm leading-relaxed group-hover/item:text-white/90 transition-colors">
              {feature}
            </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Benefits */}
                            {Array.isArray(membership.benefits) && membership.benefits.length > 0 && (
                                <div className="mb-8">
                                    <h4 className="text-white/90 font-bold text-xs sm:text-sm uppercase tracking-wider mb-3 sm:mb-4 flex items-center gap-2">
                                        <div className="w-1 h-4 bg-gradient-to-b from-yellow-400 to-orange-400 rounded-full"></div>
                                        Exclusive Perks
                                    </h4>
                                    <div className="flex flex-col space-y-2 sm:space-y-3 max-h-40 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
                                        {membership.benefits.map((benefit, idx) => (
                                            <div key={idx} className="flex items-start space-x-2 sm:space-x-3 group/item">
                                                <div className="flex-shrink-0 w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-yellow-500/20 flex items-center justify-center mt-0.5 group-hover/item:bg-yellow-500/30 transition-colors">
                                                    <Star className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-yellow-400 fill-yellow-400" />
                                                </div>
                                                <span className="text-white/70 text-xs sm:text-sm leading-relaxed group-hover/item:text-white/90 transition-colors">
              {benefit}
            </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Join Button */}
                            <div className="flex items-center justify-center mt-auto">
                                <DynamicButton
                                    data={membership}
                                    hrefBase={user ? "/booking" : undefined}
                                    onClick={!user ? openAuth : undefined}
                                    theme={`w-full py-2 sm:py-3 md:py-3.5 px-3 sm:px-6 rounded-lg sm:rounded-xl font-bold text-white text-sm sm:text-base transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg bg-gradient-to-r ${theme.gradient} hover:shadow-2xl relative overflow-hidden mt-4 sm:mt-6`}
                                    label={
                                        <span className="relative flex items-center justify-center gap-1.5 sm:gap-2">
          <Crown className="w-4 h-4 sm:w-5 sm:h-5" />
          Join Membership
        </span>
                                    }
                                />
                            </div>
                        </div>


                        {/* Bottom Accent Line */}
                        <div
                            className={` h-1 bg-gradient-to-r ${theme.gradient} opacity-50 group-hover:opacity-100 transition-opacity duration-500`}
                        ></div>
                    </div>
                );
            })}
        </div>
    );
};

export default RenderMemberships;