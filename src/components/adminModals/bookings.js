'use client';
import React, {useContext, useEffect, useMemo, useState} from 'react';
import {adminContext} from '@/app/admin/page';
import {Download, Plus, Edit, Trash2} from 'lucide-react';
import {HandleDelete} from '@/components/adminModals/deleteToast'


const Bookings = () => {
    const {setActiveTab, searchTerm, mergedData} = useContext(adminContext);

    const handleExport = () => {
        const blob = new Blob([JSON.stringify(mergedData, null, 2)], {type: 'application/json'});
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'bookings.json';
        a.click();
        URL.revokeObjectURL(url);
    };


    const getStatusColor = (status) => {
        switch (status) {
            case 'confirmed':
                return 'text-green-400 border-green-400/40';
            case 'cancelled':
                return 'text-red-400 border-red-400/40';
            default:
                return 'text-yellow-400 border-yellow-400/40';
        }
    };

    // Update booking status
    const updateBookingStatus = (id, status) => {
        console.log(`Update booking ${id} to ${status}`);
        // TODO: send PATCH request to API here
    };

    // Filter bookings by search term
    const filteredBookings = useMemo(() => {
        if (!searchTerm) return mergedData || [];
        return mergedData?.filter(
            (b) =>
                b.user?.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                b.service?.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [searchTerm, mergedData]);
    return (
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 overflow-x-auto">
            {/* Header */}
            <div className="flex flex-wrap items-center justify-between mb-6 gap-3">
                <h3 className="text-xl font-bold">All Bookings</h3>
                <div className="flex gap-3">
                    <button
                        onClick={handleExport}
                        className="flex items-center gap-2 px-4 py-2 bg-white/10 border border-white/20 rounded-xl hover:bg-white/20 transition-colors"
                    >
                        <Download className="w-4 h-4"/>
                        Export
                    </button>
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead>
                    <tr className="border-b border-white/10 text-left text-white/80">
                        <th className="py-3 px-4 font-semibold">Customer</th>
                        <th className="py-3 px-4 font-semibold">Service</th>
                        <th className="py-3 px-4 font-semibold">Date</th>
                        <th className="py-3 px-4 font-semibold">Time</th>
                        <th className="py-3 px-4 font-semibold">Status</th>
                        <th className="py-3 px-4 font-semibold">Amount</th>
                        <th className="py-3 px-4 text-center font-semibold">Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {filteredBookings?.length ? (
                        filteredBookings.map((booking, i) => (

                            <tr
                                key={booking._id || i}
                                className="border-b border-white/5 hover:bg-white/5 transition-colors"
                            >
                                <td className="py-4 px-4">
                                    <div className="flex items-center gap-3">
                                        <div
                                            className=" w-10 h-10 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold uppercase">
                                            {booking.user?.username?.charAt(0) || 'U'}
                                        </div>
                                        <span className="font-medium">{booking.user?.username || 'Unknown'}</span>
                                    </div>
                                </td>
                                <td className="py-4 px-4">{booking.service || '—'}</td>
                                <td className="py-4 px-4">{booking.bookingDate || '—'}</td>
                                <td className="py-4 px-4">{booking.time || '—'}</td>
                                <td className="py-4 px-4">
                                    <select
                                        value={booking.status || 'pending'}
                                        onChange={(e) => updateBookingStatus(booking._id, e.target.value)}
                                        className={`px-3 py-1 rounded-full text-xs font-medium border cursor-pointer bg-transparent ${getStatusColor(
                                            booking.status
                                        )}`}
                                    >
                                        <option value="pending">Pending</option>
                                        <option value="confirmed">Confirmed</option>
                                        <option value="cancelled">Cancelled</option>
                                        <option value="completed">Completed</option>
                                    </select>
                                </td>
                                <td className="py-4 px-4 font-semibold text-white/90">
                                    {booking.payment?.amount && booking.membership ? `$${(booking.payment.amount / booking.membership?.sessions).toFixed(2)}` : `$${booking.payment.amount}`}
                                </td>
                                <td className="py-4 px-4 text-center">
                                    <div className="flex items-center justify-center gap-2">
                                        <button
                                            onClick={() => {
                                            }}
                                            className="p-2 hover:bg-green-500/20 rounded-lg transition-colors text-green-400"
                                        >
                                            <Edit className="w-4 h-4"/>
                                        </button>
                                        <button
                                            onClick={() => HandleDelete(booking._id)}
                                            className="p-2 hover:bg-red-500/20 rounded-lg transition-colors text-red-400"
                                        >
                                            <Trash2 className="w-4 h-4"/>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="7" className="text-center py-6 text-white/60">
                                No bookings found.
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Bookings;
