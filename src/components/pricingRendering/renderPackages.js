import {packages} from "@/data/data";
import {Calendar, Check, Clock, Gift, Sparkles} from "lucide-react";
import React from "react";

import DynamicButton from "@/components/buttons/dynamicButton";

const renderPackages = ({user, openAuth}) => {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {packages.map((pkg) => (
                <div
                    key={pkg.id}
                    className={`group relative bg-white/5 backdrop-blur-lg border rounded-3xl overflow-hidden hover:scale-105 transition-all duration-500 ${
                        pkg.recommended
                            ? 'border-pink-500/50 ring-2 ring-pink-500/30 transform scale-105'
                            : 'border-white/10'
                    }`}
                >
                    {/* Recommended Badge */}
                    {pkg.recommended && (
                        <div className="absolute top-3  left-1/5 -translate-x-1/2 z-10  flex">
                            <div className="px-4 py-1 bg-gradient-to-r from-pink-500 to-purple-600
                  text-white text-sm font-bold rounded-full shadow-lg flex">
                                Most Popular
                            </div>
                        </div>

                    )}

                    {/* Savings Badge */}
                    <div className={`absolute top-4 right-4 px-3 py-1 bg-gradient-to-r ${pkg.color} text-white text-xs font-bold rounded-full shadow-lg`}>
                        Save ${pkg.savings}
                    </div>

                    <div className="p-8">
                        {/* Package Header */}
                        <div className="text-center mb-8">
                            <div className={`w-16 h-16 bg-gradient-to-br ${pkg.color} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                                <Gift className="w-8 h-8 text-white" />
                            </div>

                            <h3 className="text-2xl font-bold text-white mb-2">{pkg.name}</h3>
                            <p className="text-white/70 text-sm mb-4">{pkg.description}</p>

                            <div className="flex items-center justify-center space-x-4 text-white/60 text-sm mb-6">
                                <div className="flex items-center space-x-1">
                                    <Clock className="w-4 h-4" />
                                    <span>{pkg.duration} min</span>
                                </div>
                            </div>

                            <div className="text-center mb-6">
                                <div className="flex items-center justify-center space-x-2">
                                    <span className="text-2xl text-white/50 line-through">${pkg.originalPrice}</span>
                                    <span className="text-4xl font-black bg-gradient-to-r from-pink-300 to-purple-300 bg-clip-text text-transparent">
                                        ${pkg.price}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Services Included */}
                        <div className="mb-6">
                            <h4 className="text-white font-semibold mb-3">Services Included:</h4>
                            <div className="space-y-2">
                                {pkg.services.map((service, idx) => (
                                    <div key={idx} className="flex items-center space-x-3">
                                        <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
                                        <span className="text-white/80 text-sm">{service}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Features */}
                        <div className="mb-8">
                            <h4 className="text-white font-semibold mb-3">Package Features:</h4>
                            <div className="space-y-2">
                                {pkg.features.map((feature, idx) => (
                                    <div key={idx} className="flex items-center space-x-3">
                                        <Sparkles className="w-4 h-4 text-pink-400 flex-shrink-0" />
                                        <span className="text-white/80 text-sm">{feature}</span>
                                    </div>
                                ))}
                            </div>
                        </div>


                        <DynamicButton
                            data={pkg}
                            hrefBase={user && "/billing/package"}
                            onClick={!user && openAuth}
                            label="Book Package"
                            icon={Calendar}
                        />

                    </div>
                </div>
            ))}
        </div>
    );
};

export default renderPackages;

