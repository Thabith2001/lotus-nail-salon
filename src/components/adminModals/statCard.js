import React from 'react';
import {ArrowUp} from "lucide-react";

const StatCard = ({icon, title, value, color, percent}) => {
    return (
        <div
            className={`bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:shadow-${color}-500/10 transition-all`}
        >
            <div className="flex justify-between items-start mb-4">
                <div
                    className={`w-12 h-12 bg-${color}-500/10 rounded-xl flex items-center justify-center`}
                >
                    {icon}
                </div>
                <div className={`flex items-center gap-1 text-sm font-semibold text-${color}-400`}>
                    <ArrowUp className="w-4 h-4"/>
                    {percent}
                </div>
            </div>
            <h3 className="text-white/60 text-sm mb-2">{title}</h3>
            <p className="text-3xl font-bold">{value}</p>
        </div>
    );
};

export default StatCard;
