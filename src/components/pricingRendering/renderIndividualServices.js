import {individualServices} from "@/data/data";
import {Brush, Calendar, Check, Clock, Gem, Heart, Palette} from "lucide-react";
import React from "react";
import {getPopularityColor} from "@/data/data";
import DynamicButton from "@/components/buttons/dynamicButton";

const renderIndividualServices = ({user, openAuth}) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {individualServices.map((service, index) => (
                <div
                    key={service.id}
                    className={`group relative bg-white/5 backdrop-blur-lg border rounded-3xl overflow-hidden hover:scale-105 transition-all duration-500 ${
                        service.recommended
                            ? 'border-pink-500/50 ring-2 ring-pink-500/30'
                            : 'border-white/10'
                    }`}
                >
                    {/* Recommended Badge */}
                    {service.recommended && (
                        <div className="absolute top-3 left-1/5 transform -translate-x-1/2 z-10 ">
                            <div
                                className="px-4 py-1 bg-gradient-to-r from-pink-500 to-purple-600 text-white text-sm font-bold rounded-full shadow-lg">
                                Recommended
                            </div>
                        </div>
                    )}

                    {/* Popularity Badge */}
                    <div
                        className={`absolute top-4 right-4 px-3 py-1 bg-gradient-to-r ${getPopularityColor(service.popularity)} text-white text-xs font-bold rounded-full shadow-lg`}>
                        {service.popularity}
                    </div>

                    <div className="p-8">
                        {/* Service Header */}
                        <div className="text-center mb-6">
                            <div
                                className="w-16 h-16 bg-gradient-to-br from-pink-400 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                {service.category === 'manicure' && <Brush className="w-8 h-8 text-white"/>}
                                {service.category === 'pedicure' && <Heart className="w-8 h-8 text-white"/>}
                                {service.category === 'nail-art' && <Palette className="w-8 h-8 text-white"/>}
                                {service.category === 'extensions' && <Gem className="w-8 h-8 text-white"/>}
                            </div>

                            <h3 className="text-xl font-bold text-white mb-2">{service.name}</h3>
                            <p className="text-white/70 text-sm mb-4">{service.description}</p>

                            <div className="flex items-center justify-center space-x-4 text-white/60 text-sm mb-6">
                                <div className="flex items-center space-x-1">
                                    <Clock className="w-4 h-4"/>
                                    <span>{service.duration} min</span>
                                </div>
                            </div>

                            <div className="text-center mb-6">
                                <span
                                    className="text-4xl font-black bg-gradient-to-r from-pink-300 to-purple-300 bg-clip-text text-transparent">
                                    ${service.price}
                                </span>
                            </div>
                        </div>

                        {/* Features */}
                        <div className="space-y-3 mb-8">
                            {service.features.map((feature, idx) => (
                                <div key={idx} className="flex items-center space-x-3">
                                    <Check className="w-4 h-4 text-green-400 flex-shrink-0"/>
                                    <span className="text-white/80 text-sm">{feature}</span>
                                </div>
                            ))}
                        </div>
                        {/*book button*/}
                        <DynamicButton
                            data={service}
                            hrefBase={user && "/billing/service"}
                            onClick={!user && openAuth}
                            label="Book Now"
                            icon={Calendar}
                        />

                    </div>
                </div>
            ))}
        </div>
    );
};

export default renderIndividualServices;
