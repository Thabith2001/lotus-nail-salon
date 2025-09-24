"use client";
import React, { useContext, useEffect, useState } from "react";
import { Check } from "lucide-react";
import { servicesContext } from "@/app/booking/page";
import axios from "axios";

const ServiceSelection = () => {
    const [services, setServices] = useState([]);
    const { setSelectedService, selectedService, getServiceIcon } =
        useContext(servicesContext);

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const res = await axios.get("/api/services");
                setServices(res.data.services);
            } catch (err) {
                console.error("Error fetching services:", err);
            }
        };

        fetchServices();
    }, []);

    return (
        <div className="p-8">
            <h2 className="text-3xl font-bold text-white mb-8 text-center">
                Choose Your Service
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {services.map((service) => (
                    <div
                        key={service._id}
                        onClick={() => setSelectedService(service)}
                        className={`relative cursor-pointer rounded-2xl group transition-all duration-300 ${
                            selectedService?._id === service._id
                                ? "scale-105 ring-3 ring-pink-400"
                                : "hover:scale-102"
                        }`}
                    >
                        {service.popular && (
                            <div className="absolute -top-2 -right-2 z-10 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                                Popular
                            </div>
                        )}
                        <div
                            className={`bg-white/10 backdrop-blur-sm rounded-2xl p-6 h-full transition-all duration-300 ${
                                selectedService?._id === service._id
                                    ? "ring-pink-400 bg-pink-500/10"
                                    : "ring-white/20 hover:ring-white/40"
                            }`}
                        >
                            <div
                                className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${
                                    selectedService?._id === service._id
                                        ? "bg-gradient-to-r from-pink-500 to-purple-600 text-white"
                                        : "bg-white/20 text-white/80"
                                }`}
                            >
                                {getServiceIcon(service.category)}
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">
                                {service.name}
                            </h3>
                            <p className="text-white/70 text-sm mb-4 line-clamp-3">
                                {service.description}
                            </p>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-2xl font-bold text-white">
                                        ${service.price}
                                    </p>
                                    {service.duration > 0 && (
                                        <p className="text-white/60 text-sm">
                                            {service.duration} min
                                        </p>
                                    )}
                                </div>
                                {selectedService?._id === service._id && (
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
