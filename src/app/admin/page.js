"use client"
import React, { useState } from 'react';
import {
    Calendar,
    Users,
    DollarSign,
    TrendingUp,
    Clock,
    CheckCircle,
    XCircle,
    AlertCircle,
    Menu,
    X,
    Bell,
    Search,
    Filter,
    Download,
    Eye,
    Edit,
    Trash2,
    MoreVertical,
    Package,
    Star,
    Activity,
    BarChart3,
    Settings,
    LogOut,
    ChevronDown,
    ArrowUp,
    ArrowDown
} from 'lucide-react';

const AdminDashboard = () => {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [activeTab, setActiveTab] = useState('overview');
    const [selectedPeriod, setSelectedPeriod] = useState('week');

    // Sample data
    const stats = [
        {
            title: 'Total Revenue',
            value: '$45,231',
            change: '+12.5%',
            trend: 'up',
            icon: DollarSign,
            color: 'from-green-500 to-emerald-600',
            bgColor: 'bg-green-500/10',
            iconColor: 'text-green-400'
        },
        {
            title: 'Total Bookings',
            value: '342',
            change: '+8.2%',
            trend: 'up',
            icon: Calendar,
            color: 'from-blue-500 to-cyan-600',
            bgColor: 'bg-blue-500/10',
            iconColor: 'text-blue-400'
        },
        {
            title: 'Active Members',
            value: '128',
            change: '+15.3%',
            trend: 'up',
            icon: Users,
            color: 'from-purple-500 to-pink-600',
            bgColor: 'bg-purple-500/10',
            iconColor: 'text-purple-400'
        },
        {
            title: 'Avg Rating',
            value: '4.8',
            change: '+0.3',
            trend: 'up',
            icon: Star,
            color: 'from-yellow-500 to-orange-600',
            bgColor: 'bg-yellow-500/10',
            iconColor: 'text-yellow-400'
        },
    ];

    const recentBookings = [
        { id: 1, customer: 'Sarah Johnson', service: 'Manicure & Pedicure', date: '2024-10-15', time: '10:00 AM', status: 'confirmed', amount: '$85' },
        { id: 2, customer: 'Emily Davis', service: 'Facial Treatment', date: '2024-10-15', time: '11:30 AM', status: 'pending', amount: '$120' },
        { id: 3, customer: 'Michael Brown', service: 'Massage Therapy', date: '2024-10-15', time: '02:00 PM', status: 'confirmed', amount: '$95' },
        { id: 4, customer: 'Jessica Wilson', service: 'Nail Art', date: '2024-10-15', time: '03:30 PM', status: 'cancelled', amount: '$65' },
        { id: 5, customer: 'David Miller', service: 'Hair Styling', date: '2024-10-16', time: '09:00 AM', status: 'confirmed', amount: '$75' },
    ];

    const getStatusColor = (status) => {
        switch (status) {
            case 'confirmed': return 'bg-green-500/20 text-green-400 border-green-400/30';
            case 'pending': return 'bg-yellow-500/20 text-yellow-400 border-yellow-400/30';
            case 'cancelled': return 'bg-red-500/20 text-red-400 border-red-400/30';
            default: return 'bg-gray-500/20 text-gray-400 border-gray-400/30';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'confirmed': return <CheckCircle className="w-3 h-3" />;
            case 'pending': return <Clock className="w-3 h-3" />;
            case 'cancelled': return <XCircle className="w-3 h-3" />;
            default: return <AlertCircle className="w-3 h-3" />;
        }
    };

    const menuItems = [
        { id: 'overview', label: 'Overview', icon: BarChart3 },
        { id: 'bookings', label: 'Bookings', icon: Calendar },
        { id: 'customers', label: 'Customers', icon: Users },
        { id: 'services', label: 'Services', icon: Package },
        { id: 'analytics', label: 'Analytics', icon: Activity },
        { id: 'settings', label: 'Settings', icon: Settings },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-pink-900 text-white">
            {/* Sidebar */}
            <aside className={`fixed left-0 top-0 h-full bg-slate-900/95 backdrop-blur-xl border-r border-white/10 transition-all duration-300 z-50 ${
                sidebarOpen ? 'w-64' : 'w-20'
            }`}>
                <div className="flex items-center justify-between p-6 border-b border-white/10">
                    {sidebarOpen && (
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-purple-600 rounded-xl flex items-center justify-center">
                                <span className="text-xl font-bold">S</span>
                            </div>
                            <div>
                                <h1 className="font-bold text-lg">Spa Admin</h1>
                                <p className="text-xs text-white/60">Management</p>
                            </div>
                        </div>
                    )}
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                    >
                        {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                    </button>
                </div>

                <nav className="p-4 space-y-2">
                    {menuItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                                activeTab === item.id
                                    ? 'bg-gradient-to-r from-pink-500 to-purple-600 shadow-lg'
                                    : 'hover:bg-white/10'
                            }`}
                        >
                            <item.icon className="w-5 h-5 flex-shrink-0" />
                            {sidebarOpen && <span className="font-medium">{item.label}</span>}
                        </button>
                    ))}
                </nav>

                {sidebarOpen && (
                    <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10">
                        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/10 transition-colors text-red-400">
                            <LogOut className="w-5 h-5" />
                            <span className="font-medium">Logout</span>
                        </button>
                    </div>
                )}
            </aside>

            {/* Main Content */}
            <div className={`transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-20'}`}>
                {/* Header */}
                <header className="bg-slate-900/50 backdrop-blur-xl border-b border-white/10 sticky top-0 z-40">
                    <div className="flex items-center justify-between p-6">
                        <div>
                            <h2 className="text-2xl font-bold">Dashboard Overview</h2>
                            <p className="text-white/60 text-sm mt-1">Welcome back, Admin!</p>
                        </div>

                        <div className="flex items-center gap-4">
                            {/* Search */}
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    className="pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:border-pink-400 transition-colors w-64"
                                />
                            </div>

                            {/* Period Selector */}
                            <select
                                value={selectedPeriod}
                                onChange={(e) => setSelectedPeriod(e.target.value)}
                                className="px-4 py-2 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:border-pink-400 cursor-pointer"
                            >
                                <option value="today">Today</option>
                                <option value="week">This Week</option>
                                <option value="month">This Month</option>
                                <option value="year">This Year</option>
                            </select>

                            {/* Notifications */}
                            <button className="relative p-2 hover:bg-white/10 rounded-xl transition-colors">
                                <Bell className="w-6 h-6" />
                                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                            </button>

                            {/* Profile */}
                            <button className="flex items-center gap-3 px-4 py-2 hover:bg-white/10 rounded-xl transition-colors">
                                <div className="w-8 h-8 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center">
                                    <span className="text-sm font-bold">A</span>
                                </div>
                                <ChevronDown className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </header>

                {/* Dashboard Content */}
                <main className="p-6 space-y-6">
                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {stats.map((stat, index) => (
                            <div
                                key={index}
                                className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:shadow-2xl hover:shadow-pink-500/10 transition-all duration-300 group"
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div className={`w-12 h-12 ${stat.bgColor} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                                        <stat.icon className={`w-6 h-6 ${stat.iconColor}`} />
                                    </div>
                                    <div className={`flex items-center gap-1 text-sm font-semibold ${
                                        stat.trend === 'up' ? 'text-green-400' : 'text-red-400'
                                    }`}>
                                        {stat.trend === 'up' ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
                                        {stat.change}
                                    </div>
                                </div>
                                <h3 className="text-white/60 text-sm mb-2">{stat.title}</h3>
                                <p className="text-3xl font-bold">{stat.value}</p>
                            </div>
                        ))}
                    </div>

                    {/* Recent Bookings */}
                    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h3 className="text-xl font-bold">Recent Bookings</h3>
                                <p className="text-white/60 text-sm mt-1">Latest appointment bookings</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <button className="flex items-center gap-2 px-4 py-2 bg-white/10 border border-white/20 rounded-xl hover:bg-white/20 transition-colors">
                                    <Filter className="w-4 h-4" />
                                    Filter
                                </button>
                                <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-600 rounded-xl hover:shadow-lg transition-all">
                                    <Download className="w-4 h-4" />
                                    Export
                                </button>
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                <tr className="border-b border-white/10">
                                    <th className="text-left py-3 px-4 text-sm font-semibold text-white/80">Customer</th>
                                    <th className="text-left py-3 px-4 text-sm font-semibold text-white/80">Service</th>
                                    <th className="text-left py-3 px-4 text-sm font-semibold text-white/80">Date</th>
                                    <th className="text-left py-3 px-4 text-sm font-semibold text-white/80">Time</th>
                                    <th className="text-left py-3 px-4 text-sm font-semibold text-white/80">Status</th>
                                    <th className="text-left py-3 px-4 text-sm font-semibold text-white/80">Amount</th>
                                    <th className="text-center py-3 px-4 text-sm font-semibold text-white/80">Actions</th>
                                </tr>
                                </thead>
                                <tbody>
                                {recentBookings.map((booking) => (
                                    <tr key={booking.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                        <td className="py-4 px-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center">
                                                    <span className="text-sm font-bold">{booking.customer.charAt(0)}</span>
                                                </div>
                                                <div>
                                                    <p className="font-medium">{booking.customer}</p>
                                                    <p className="text-xs text-white/60">ID: #{booking.id}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4 px-4 text-sm">{booking.service}</td>
                                        <td className="py-4 px-4 text-sm">{booking.date}</td>
                                        <td className="py-4 px-4 text-sm">{booking.time}</td>
                                        <td className="py-4 px-4">
                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(booking.status)}`}>
                          {getStatusIcon(booking.status)}
                            {booking.status}
                        </span>
                                        </td>
                                        <td className="py-4 px-4 text-sm font-semibold">{booking.amount}</td>
                                        <td className="py-4 px-4">
                                            <div className="flex items-center justify-center gap-2">
                                                <button className="p-2 hover:bg-blue-500/20 rounded-lg transition-colors text-blue-400">
                                                    <Eye className="w-4 h-4" />
                                                </button>
                                                <button className="p-2 hover:bg-green-500/20 rounded-lg transition-colors text-green-400">
                                                    <Edit className="w-4 h-4" />
                                                </button>
                                                <button className="p-2 hover:bg-red-500/20 rounded-lg transition-colors text-red-400">
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-400/30 rounded-2xl p-6 hover:shadow-xl hover:shadow-blue-500/20 transition-all cursor-pointer group">
                            <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                <Calendar className="w-6 h-6 text-blue-400" />
                            </div>
                            <h3 className="font-bold text-lg mb-2">New Booking</h3>
                            <p className="text-white/60 text-sm">Create a new appointment</p>
                        </div>

                        <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-400/30 rounded-2xl p-6 hover:shadow-xl hover:shadow-purple-500/20 transition-all cursor-pointer group">
                            <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                <Users className="w-6 h-6 text-purple-400" />
                            </div>
                            <h3 className="font-bold text-lg mb-2">Add Customer</h3>
                            <p className="text-white/60 text-sm">Register a new customer</p>
                        </div>

                        <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-400/30 rounded-2xl p-6 hover:shadow-xl hover:shadow-green-500/20 transition-all cursor-pointer group">
                            <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                <Package className="w-6 h-6 text-green-400" />
                            </div>
                            <h3 className="font-bold text-lg mb-2">New Service</h3>
                            <p className="text-white/60 text-sm">Add a new service offering</p>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default AdminDashboard;
