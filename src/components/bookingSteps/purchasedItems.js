import {Crown, Gift, Sparkles} from "lucide-react";
import React from "react";

const PurchasedItemDisplay = ({ sharedData }) => {
    const getIcon = () => {
        if (sharedData.type === 'membership') return <Crown className="w-8 h-8 text-pink-400"/>;
        if (sharedData.type === 'package') return <Gift className="w-8 h-8 text-purple-400"/>;
        return <Sparkles className="w-8 h-8 text-blue-400"/>;
    };

    return (
        <div className="p-4 sm:p-8">
            <div className="max-w-2xl mx-auto">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        {getIcon()}
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                        Your {sharedData.type === 'membership' ? 'Membership' : 'Package'}
                    </h2>
                    <p className="text-white/70">
                        Ready to book your appointment
                    </p>
                </div>

                {/* Item Details */}
                <div className="bg-white/10 backdrop-blur-xl rounded-xl border border-white/20 p-6 mb-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                            {getIcon()}
                            <div>
                                <h3 className="text-xl font-semibold text-white">{sharedData.name}</h3>
                                <p className="text-white/60 capitalize">{sharedData.subscription}</p>
                            </div>
                        </div>

                        {/* Payment Status Badge */}
                        <div className={`px-4 py-2 rounded-full text-sm font-medium ${
                            sharedData.paid
                                ? 'bg-green-500/20 text-green-300 border border-green-500/30'
                                : 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30'
                        }`}>
                            {sharedData.paid ? 'Paid' : 'Payment Required'}
                        </div>
                    </div>

                    <p className="text-white/80 mb-4">{sharedData.description}</p>

                    {/* Item Details Grid */}
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                            <p className="text-white/60">Price</p>
                            <p className="text-white font-semibold">${sharedData.price || sharedData.monthlyPrice}</p>
                        </div>
                        {sharedData.duration && (
                            <div>
                                <p className="text-white/60">Duration</p>
                                <p className="text-white font-semibold">{sharedData.duration} min</p>
                            </div>
                        )}
                        {sharedData.subscription === 'membership' && sharedData.remainingSessions && (
                            <div>
                                <p className="text-white/60">Sessions Left</p>
                                <p className="text-pink-400 font-semibold">{sharedData.remainingSessions}</p>
                            </div>
                        )}
                        {sharedData.originalPrice && (
                            <div>
                                <p className="text-white/60">You Save</p>
                                <p className="text-green-400 font-semibold">${sharedData.originalPrice - (sharedData.price || sharedData.monthlyPrice)}</p>
                            </div>
                        )}
                    </div>

                    {/* Services/Features */}
                    {sharedData.services && (
                        <div className="mt-4 pt-4 border-t border-white/20">
                            <p className="text-white/60 text-sm mb-2">Includes:</p>
                            <div className="flex flex-wrap gap-2">
                                {sharedData.services.map((service, idx) => (
                                    <span key={idx} className="px-3 py-1 bg-white/10 rounded-full text-xs text-white/80">
                                        {service}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {sharedData.features && (
                        <div className="mt-4 pt-4 border-t border-white/20">
                            <p className="text-white/60 text-sm mb-2">Features:</p>
                            <div className="flex flex-wrap gap-2">
                                {sharedData.features.map((feature, idx) => (
                                    <span key={idx} className="px-3 py-1 bg-white/10 rounded-full text-xs text-white/80">
                                        {feature}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
export default PurchasedItemDisplay;
