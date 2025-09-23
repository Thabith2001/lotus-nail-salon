import React, { useContext } from 'react';
import { servicesContext } from "@/app/booking/page";
import { timeSlots } from "@/data/data";

const DateTimeSelection = () => {
    const {
        selectedTime,
        setSelectedDate,
        selectedDate,
        selectedService,
        getServiceIcon,
        setSelectedTime
    } = useContext(servicesContext);

    const generateDates = () => {
        const dates = [];
        for (let i = 0; i < 30; i++) {
            const date = new Date();
            date.setDate(date.getDate() + i);
            dates.push(date);
        }
        return dates;
    };

    const availableDates = generateDates();

    const formatDate = (date) => {
        return date.toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric'
        });
    };

    const formatTime = (timeString) => {
        return new Date(`2024-01-01T${timeString}`).toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });
    };

    // Avoid errors if no service is selected
    if (!selectedService) return <p className="text-white text-center p-8">Please select a service first.</p>;

    return (
        <div className="p-8">
            <h2 className="text-3xl font-bold text-white mb-8 text-center">Select Date & Time</h2>

            {/* Selected Service Summary */}
            <div className="bg-white/10 rounded-xl p-4 mb-8 flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center">
                    {getServiceIcon(selectedService.category)}
                </div>
                <div className="flex-1">
                    <h3 className="text-white font-semibold">{selectedService.name}</h3>
                    <p className="text-white/60 text-sm">{selectedService.duration} min • ${selectedService.price}</p>
                </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
                {/* Date Selection */}
                <div>
                    <h3 className="text-xl font-bold text-white mb-4">Choose Date</h3>
                    <div className="grid grid-cols-3 gap-3 max-h-80 overflow-y-auto">
                        {availableDates.map((date, index) => {
                            const dateString = date.toISOString().split('T')[0];
                            const isSelected = selectedDate === dateString;
                            const isToday = index === 0;

                            return (
                                <button
                                    key={dateString}
                                    onClick={() => setSelectedDate(dateString)}
                                    className={`p-3 rounded-xl text-center transition-all duration-300 ${
                                        isSelected
                                            ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white scale-105'
                                            : 'bg-white/10 text-white hover:bg-white/20'
                                    }`}
                                >
                                    <div className="text-sm font-semibold">
                                        {isToday ? 'Today' : formatDate(date)}
                                    </div>
                                    <div className="text-xs opacity-70">{date.getDate()}</div>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Time Selection */}
                <div>
                    <h3 className="text-xl font-bold text-white mb-4">Choose Time</h3>
                    <div className="grid grid-cols-3 gap-3 max-h-80 overflow-y-auto">
                        {timeSlots.map((time) => {
                            const isSelected = selectedTime === time;
                            const isAvailable = Math.random() > 0.3; // Simulated availability

                            return (
                                <button
                                    key={time}
                                    onClick={() => isAvailable && setSelectedTime(time)}
                                    disabled={!isAvailable}
                                    className={`p-3 rounded-xl text-center transition-all duration-300 ${
                                        !isAvailable
                                            ? 'bg-gray-600/50 text-gray-400 cursor-not-allowed'
                                            : isSelected
                                                ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white scale-105'
                                                : 'bg-white/10 text-white hover:bg-white/20'
                                    }`}
                                >
                                    <div className="text-sm font-semibold">{formatTime(time)}</div>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DateTimeSelection;