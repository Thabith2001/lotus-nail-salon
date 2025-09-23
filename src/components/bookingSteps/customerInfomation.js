import React, {useContext} from 'react';
import {Info, Mail, Phone, User} from "lucide-react";
import {servicesContext} from "@/app/booking/page";

const CustomerInformation = () => {
    const {customerInfo ,setCustomerInfo}=useContext(servicesContext);
    return (
        <div className="p-8">
            <h2 className="text-3xl font-bold text-white mb-8 text-center">Your Information</h2>

            <div className="max-w-2xl mx-auto space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-white/80 text-sm font-medium mb-2">
                            <User className="w-4 h-4 inline mr-2" />
                            Full Name *
                        </label>
                        <input
                            type="text"
                            value={customerInfo.name}
                            onChange={(e) => setCustomerInfo({...customerInfo, name: e.target.value})}
                            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:border-pink-400 focus:ring-2 focus:ring-pink-400/20 transition-all"
                            placeholder="Enter your full name"
                        />
                    </div>

                    <div>
                        <label className="block text-white/80 text-sm font-medium mb-2">
                            <Phone className="w-4 h-4 inline mr-2" />
                            Phone Number *
                        </label>
                        <input
                            type="tel"
                            value={customerInfo.phone}
                            onChange={(e) => setCustomerInfo({...customerInfo, phone: e.target.value})}
                            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:border-pink-400 focus:ring-2 focus:ring-pink-400/20 transition-all"
                            placeholder="(555) 123-4567"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">
                        <Mail className="w-4 h-4 inline mr-2" />
                        Email Address *
                    </label>
                    <input
                        type="email"
                        value={customerInfo.email}
                        onChange={(e) => setCustomerInfo({...customerInfo, email: e.target.value})}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:border-pink-400 focus:ring-2 focus:ring-pink-400/20 transition-all"
                        placeholder="your.email@example.com"
                    />
                </div>

                <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">
                        <Info className="w-4 h-4 inline mr-2" />
                        Special Notes (Optional)
                    </label>
                    <textarea
                        value={customerInfo.notes}
                        onChange={(e) => setCustomerInfo({...customerInfo, notes: e.target.value})}
                        rows={4}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:border-pink-400 focus:ring-2 focus:ring-pink-400/20 transition-all resize-none"
                        placeholder="Any special requests, allergies, or preferences..."
                    />
                </div>
            </div>
        </div>
    );
};

export default CustomerInformation;
