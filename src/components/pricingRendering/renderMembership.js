"use client";

import { memberships } from "@/data/data";
import { Check, Crown, Star } from "lucide-react";
import React from "react";

import DynamicButton from "@/components/buttons/dynamicButton";

const RenderMemberships = ({user , openAuth}) => {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {memberships.map((membership) => (
                <div
                    key={membership.id}
                    className={`group relative bg-white/5 backdrop-blur-lg border rounded-3xl overflow-hidden hover:scale-105 transition-all duration-500 ${
                        membership.recommended
                            ? "border-pink-500/50 ring-2 ring-pink-500/30 transform scale-105"
                            : "border-white/10"
                    }`}
                >
                    {/* Recommended Badge */}
                    {membership.recommended && (
                        <div className="absolute top-3 left-1/5 transform -translate-x-1/2 z-10 flex">
                            <div className="px-4 py-1 bg-gradient-to-r from-pink-500 to-purple-600 text-white text-sm font-bold rounded-full shadow-lg">
                                Best Value
                            </div>
                        </div>
                    )}

                    {/* Savings Badge */}
                    <div
                        className={`absolute top-4 right-4 px-3 py-1 bg-gradient-to-r ${membership.color} text-white text-xs font-bold rounded-full shadow-lg`}
                    >
                        Save ${membership.savings}/mo
                    </div>

                    <div className="p-8">
                        {/* Membership Header */}
                        <div className="text-center mb-8">
                            <div
                                className={`w-16 h-16 bg-gradient-to-br ${membership.color} rounded-2xl flex items-center justify-center mx-auto mb-4`}
                            >
                                <Crown className="w-8 h-8 text-white" />
                            </div>

                            <h3 className="text-2xl font-bold text-white mb-2">
                                {membership.name}
                            </h3>
                            <p className="text-white/70 text-sm mb-4">
                                {membership.description}
                            </p>

                            <div className="text-center mb-6">
                                <div className="flex items-center justify-center space-x-2">
                  <span className="text-2xl text-white/50 line-through">
                    ${membership.originalPrice}
                  </span>
                                    <span className="text-4xl font-black bg-gradient-to-r from-pink-300 to-purple-300 bg-clip-text text-transparent">
                    ${membership.monthlyPrice}
                  </span>
                                </div>
                                <p className="text-white/60 text-sm mt-1">per month</p>
                                <p className="text-green-400 text-sm font-medium">
                                    {membership.services}
                                </p>
                            </div>
                        </div>

                        {/* Membership Features */}
                        <div className="mb-6">
                            <h4 className="text-white font-semibold mb-3">
                                Membership Includes:
                            </h4>
                            <div className="space-y-2">
                                {membership.features.map((feature, idx) => (
                                    <div key={idx} className="flex items-center space-x-3">
                                        <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
                                        <span className="text-white/80 text-sm">{feature}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Benefits */}
                        <div className="mb-8">
                            <h4 className="text-white font-semibold mb-3">
                                Exclusive Benefits:
                            </h4>
                            <div className="space-y-2">
                                {membership.benefits.map((benefit, idx) => (
                                    <div key={idx} className="flex items-center space-x-3">
                                        <Star className="w-4 h-4 text-yellow-400 flex-shrink-0" />
                                        <span className="text-white/80 text-sm">{benefit}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Join Button */}
                        <DynamicButton
                            data={membership}
                            hrefBase={user && "/billing/membership"}
                            onClick={!user && openAuth}
                            label="Join Membership"
                            icon={Crown}
                        />

                    </div>
                </div>
            ))}
        </div>
    );
};

export default RenderMemberships;

