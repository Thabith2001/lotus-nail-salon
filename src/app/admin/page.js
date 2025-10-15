'use client'
import React, {useState, useEffect, createContext} from 'react';
import {Menu, X, Star, Bell, Search, LogOut, ArrowLeft} from 'lucide-react';
import OverView from "@/components/adminModals/overView";
import {useRouter} from "next/navigation";
import {useAuth} from "@/context/authContext";
import {useAuthModal} from "@/context/authModelContext";
import {useBookings} from "@/context/adminContext";
import {menuItems} from "@/data/data";
import axios from "axios";
import Bookings from "@/components/adminModals/bookings";
import Analytics from "@/components/adminModals/Analytics";
import {promise} from "bcrypt/promises";

export const adminContext = createContext();
const AdminDashBoard = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('overview');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedPeriod, setSelectedPeriod] = useState('today');
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [loadingAuth, setLoadingAuth] = useState(true);
    const [mergedData, setMergedData] = useState([]);
    const {user} = useAuth();
    const {openAuth} = useAuthModal();
    const {bookingData} = useBookings() || {};
    const router = useRouter();


    useEffect(() => {
        const token = localStorage.getItem("token");
        if (user) {
            if (user.role === "admin") {

                if (!token) {
                    openAuth();
                    setLoadingAuth(false);
                    return;
                }

                setIsAuthorized(true);
            } else {
                setIsAuthorized(false);
                router.push("/");
            }
            setLoadingAuth(false);
        }
    }, [user, openAuth, router]);


    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 1024) {
                setSidebarOpen(true);
            } else {
                setSidebarOpen(false);
            }
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const fetchBooking = async () => {
        try {
            if (!bookingData || bookingData.length === 0) return;

            const allBookings = [];

            for (const user of bookingData) {
                if (!user._id) continue;

                const bookingRes = await axios.get(`/api/bookings?userId=${user._id}`);
                const bookings = bookingRes.data.bookings || [];

                //  For each booking, fetch payment + membership details (if any)
                const bookingsWithDetails = await Promise.all(
                    bookings.map(async (b) => {
                        let payment = null;
                        let membership = null;

                        try {
                            if (b.paymentId) {
                                const payRes = await axios.get(`/api/payments/${b.paymentId}`);
                                payment = payRes.data.payment || null;
                            }
                        } catch (err) {
                            console.error(` Payment fetch failed for booking ${b._id}:`, err);
                        }

                        try {
                            if (b.userMembershipId) {
                                const memRes = await axios.get(
                                    `/api/user-membership/${b.userMembershipId}`
                                );
                                membership = memRes.data.membership || null;
                            }
                        } catch (err) {
                            console.error(` Membership fetch failed for booking ${b._id}:`, err);
                        }

                        // Merge all data together
                        return {...b, user, payment, membership};
                    })
                );

                allBookings.push(...bookingsWithDetails);
            }

            console.log("All bookings:", allBookings);
            setMergedData(allBookings);
        } catch (error) {
            console.error("Error fetching booking history:", error);
        }
    };

    useEffect(() => {
        fetchBooking();
    }, [bookingData]);


    const handleLogout = () => {
        localStorage.removeItem('token');
        router.refresh();
    }

    if (loadingAuth) {
        return (<div
            className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-pink-900">
            <div className="text-center">
                <div
                    className="w-16 h-16 border-4 border-pink-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-white/70">Loading...</p>
            </div>
        </div>)
    }

    return (<div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-pink-900 text-white">

        {/* Mobile Overlay */}
        {sidebarOpen && (<div
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
        />)}

        {/* Sidebar */}
        <aside
            className={`fixed left-0 top-0 h-full bg-slate-900/95 backdrop-blur-xl border-r border-white/10 transition-all duration-300 z-50 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 ${sidebarOpen ? 'w-64' : 'lg:w-20'}`}>
            <div className="flex items-center justify-between p-4 sm:p-6 border-b border-white/10">
                {sidebarOpen && (<div className="flex items-center gap-3">
                    <div
                        className="w-10 h-10 bg-gradient-to-br from-pink-500 to-purple-600 rounded-xl flex items-center justify-center">
                        <Star className="w-5 h-5"/>
                    </div>
                    <div>
                        <h1 className="font-bold text-base sm:text-lg uppercase">{user?.username || "employee"}</h1>
                        <p className="text-xs text-white/60 uppercase">{user?.role || "management"}</p>
                    </div>
                </div>)}
                <button
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                    {sidebarOpen ? <X className="w-5 h-5"/> : <Menu className="w-5 h-5"/>}
                </button>
            </div>

            <nav className="p-4 space-y-2">
                {menuItems.map((item) => (<button
                    key={item.id}
                    onClick={() => {
                        setActiveTab(item.id);
                        if (window.innerWidth < 1024) setSidebarOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === item.id ? 'bg-gradient-to-r from-pink-500 to-purple-600 shadow-lg' : 'hover:bg-white/10'}`}
                >
                    <item.icon className="w-5 h-5 flex-shrink-0"/>
                    {sidebarOpen && <span className="font-medium">{item.label}</span>}
                </button>))}
            </nav>

            {sidebarOpen && (<div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10">

                <button onClick={() => {
                    router.back()
                }}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/10 transition-colors text-gray-100">
                    <ArrowLeft className="w-5 h-5"/>
                    <span className="font-medium">Back</span>
                </button>

                <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/10 transition-colors text-red-400">
                    <LogOut className="w-5 h-5"/>
                    <span className="font-medium">Logout</span>
                </button>
            </div>)}
        </aside>

        {/* Main Content */}
        <div className={`transition-all duration-300 ${sidebarOpen ? 'lg:ml-64' : 'lg:ml-20'}`}>
            {/* Header */}
            <header className="bg-slate-900/50 backdrop-blur-xl border-b border-white/10 sticky top-0 z-30">
                <div className="p-4 sm:p-6">
                    <div className="flex items-center justify-between mb-4 sm:mb-0">
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="lg:hidden p-2 hover:bg-white/10 rounded-lg transition-colors"
                        >
                            <Menu className="w-6 h-6"/>
                        </button>

                        <div className="flex-1 lg:flex-none pb-1">
                            <h2 className="text-xl sm:text-2xl font-bold capitalize">{activeTab}</h2>
                            <p className="text-white/60 text-xs sm:text-sm mt-1">Manage your {activeTab}</p>
                        </div>

                        <button className="lg:hidden relative p-2 hover:bg-white/10 rounded-xl transition-colors">
                            <Bell className="w-6 h-6"/>
                            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                        </button>
                    </div>

                    <div
                        className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 mt-4 lg:mt-0">
                        {/* Search */}
                        <div className="relative flex-1 lg:flex-none">
                            <Search
                                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-white/50"/>
                            <input
                                type="text"
                                placeholder="Search..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full lg:w-64 pl-9 sm:pl-10 pr-4 py-2 text-sm sm:text-base bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:border-pink-400 transition-colors"
                            />
                        </div>
                        <div className="flex items-center gap-3 sm:gap-4">
                            {activeTab === "overview" && (
                                <select
                                    value={selectedPeriod}
                                    onChange={(e) => setSelectedPeriod(e.target.value)}
                                    className="flex-1 sm:flex-none px-3 sm:px-4 py-2 text-sm sm:text-base bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:border-pink-400 cursor-pointer"
                                >
                                    {["today", "this Week", "this Month", "this Year"].map((period) => (
                                        <option key={period} value={period}>
                                            {period.charAt(0).toUpperCase() + period.slice(1)}
                                        </option>
                                    ))}
                                </select>
                            )}

                            <button
                                className="hidden lg:block relative p-2 hover:bg-white/10 rounded-xl transition-colors">
                                <Bell className="w-6 h-6"/>
                                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                            </button>
                        </div>

                    </div>
                </div>
            </header>

            {/* Main Content Area */}
            <main className="p-4 sm:p-6 space-y-4 sm:space-y-6">
                <adminContext.Provider value={{setActiveTab, searchTerm, mergedData, bookingData, selectedPeriod,fetchBooking}}>
                    {activeTab === 'overview' && <OverView/>}
                    {activeTab === 'bookings' && <Bookings/>}
                    {activeTab === 'analytics' && <Analytics/>}
                </adminContext.Provider>
            </main>
        </div>
    </div>);
};

export default AdminDashBoard;