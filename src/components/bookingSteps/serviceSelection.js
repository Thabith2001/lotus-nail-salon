import React, {useContext} from 'react';
import {services} from "@/data/data";
import {Check} from "lucide-react";
import {servicesContext} from "@/app/booking/page";

const ServiceSelection = () => {
    const {setSelectedService,selectedService,getServiceIcon}=useContext(servicesContext);


    return (
        <div className="p-8">
            <h2 className="text-3xl font-bold text-white mb-8 text-center">Choose Your Service</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {services.map((service) => (
                    <div
                        key={service.id}
                        onClick={() => setSelectedService(service)}
                        className={`relative cursor-pointer group transition-all duration-300 ${
                            selectedService?.id === service.id
                                ? 'scale-105 ring-2 ring-pink-400'
                                : 'hover:scale-102'
                        }`}
                    >
                        {service.popular && (
                            <div className="absolute -top-2 -right-2 z-10 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                                Popular
                            </div>
                        )}
                        <div className={`bg-white/10 backdrop-blur-sm rounded-2xl border p-6 h-full transition-all duration-300 ${
                            selectedService?.id === service.id
                                ? 'border-pink-400 bg-pink-500/10'
                                : 'border-white/20 hover:border-white/40'
                        }`}>
                            <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${
                                selectedService?.id === service.id
                                    ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white'
                                    : 'bg-white/20 text-white/80'
                            }`}>
                                {getServiceIcon(service.category)}
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">{service.name}</h3>
                            <p className="text-white/70 text-sm mb-4 line-clamp-3">{service.description}</p>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-2xl font-bold text-white">${service.price}</p>
                                    {service.duration > 0 && (
                                        <p className="text-white/60 text-sm">{service.duration} min</p>
                                    )}
                                </div>
                                {selectedService?.id === service.id && (
                                    <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center">
                                        <Check className="w-5 h-5 text-white" />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ServiceSelection;
