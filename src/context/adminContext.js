'use client';
import { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '@/context/authContext';

export const BookingsContext = createContext(null);

export const BookingsProvider = ({ children }) => {
    const [bookingData, setBookingData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);
    const { user } = useAuth();


    useEffect(() => {
        if (user) {
            setIsAdmin(user.role === 'admin');
        } else {
            setIsAdmin(false);
        }
    }, [user]);

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                setLoading(true);

                if (!isAdmin) {
                    setBookingData([]);
                    return;
                }


                const res = await axios.get('/api/auth/user');
                const data = res?.data?.users || [];

                setBookingData(data);
            } catch (err) {
                console.error(' Error fetching bookings:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchBookings();
    }, [isAdmin]);


    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-900 text-white">
                <p className="text-xl animate-pulse">Loading bookings...</p>
            </div>
        );
    }
    
    return (
        <BookingsContext.Provider value={{ bookingData, setBookingData, loading }}>
            {children}
        </BookingsContext.Provider>
    );
};


export const useBookings = () => {
    const context = useContext(BookingsContext);
    if (!context) throw new Error('useBookings must be used within a BookingsProvider');
    return context;
};
