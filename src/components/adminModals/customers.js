'use client'

import React, {useState, useEffect, useMemo, useContext} from 'react';
import {
    UserPlus,
    Download,
    X,
    Mail,
    Phone,
    User,
    Calendar,
    CheckCircle,
    Clock,
    XCircle,
    Edit2,
    Trash2,
    MoreVertical,
    Lock,
    Verified
} from "lucide-react";
import axios from "axios";
import {adminContext} from "@/app/admin/page";
import toast from "react-hot-toast";


const Customer = () => {
    const {searchTerm} = useContext(adminContext);
    const [customers, setCustomers] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [editingCustomer, setEditingCustomer] = useState(null);
    const [deletingCustomer, setDeletingCustomer] = useState(null);
    const [activeMenu, setActiveMenu] = useState(null);
    const [passwordField, setPasswordField] = useState(false)
    const [formData, setFormData] = useState({
        username: "", email: "", phone: "", password: "",
    });
    const fetchCustomers = async () => {
        try {
            const resp = await axios.get('/api/auth/user');
            const usersArray = resp.data?.users || [];

            const nonAdmins = usersArray.filter(user => user.role !== 'admin');

            const mappedUsers = nonAdmins.map(user => ({
                id: user._id,
                username: user.username || "Unknown",
                email: user.email || "N/A",
                phone: user.phone || "N/A",
                status: "active",
            }));
            setCustomers(mappedUsers);

        } catch (err) {
            console.error('Error fetching customers:', err);
        }
    };

    useEffect(() => {
        fetchCustomers();
    }, []);


    // Filtered customers based on search
    const filteredCustomers = useMemo(() => {
        if (!searchTerm) return customers;
        return customers.filter(c => c.username.toLowerCase().includes(searchTerm.toLowerCase()) || c.email.toLowerCase().includes(searchTerm.toLowerCase()) || c.phone.includes(searchTerm));
    }, [customers, searchTerm]);

    // Export customers as JSON
    const handleExport = () => {
        const blob = new Blob([JSON.stringify(customers, null, 2)], {type: 'application/json'});
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `customers_${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
    };

    // Modals
    const openAddModal = () => {
        setEditingCustomer(null);
        setFormData({username: '', email: '', phone: '', password: ''});
        setIsOpen(true);
        setActiveMenu(null);
        setPasswordField(true)
    };

    const openEditModal = (customer) => {
        setEditingCustomer(customer);
        setFormData({
            username: customer.username || "",
            email: customer.email || "",
            phone: customer.phone || "",
        });
        setIsOpen(true);
        setActiveMenu(null);
        setPasswordField(false)
    };


    const openDeleteModal = (customer) => {
        setDeletingCustomer(customer);
        setIsDeleteOpen(true);
        setActiveMenu(null);
    };

    const handleSubmit = async () => {
        try {
            if (editingCustomer) {
                console.log('Updating customer:', editingCustomer.id, formData);
                const resp = await axios.patch(`/api/auth/user/${editingCustomer.id}`, formData);
                if (resp.status === 200) {
                    toast.success(" successfully updated!", {
                        style: {
                            background: "#10b981", color: "#fff"
                        }
                    })
                    await fetchCustomers();
                }
            } else {
                console.log('Adding new customer:', formData);
                const resp = await axios.post("/api/auth/user/register", {
                    username: formData.username,
                    email: formData.email,
                    phone: formData.phone,
                    password: formData.password,
                });
                if (resp.status === 201) {
                    toast.success("successfully Added!", {
                        style: {
                            background: "#10b981", color: "#fff"
                        }
                    })
                    await fetchCustomers();
                }
            }
        } catch (err) {
            console.error('Error submitting form:', err);
        }

        setIsOpen(false);
        setEditingCustomer(null);
        setFormData({username: '', email: '', phone: '', password: ''});
    };

    const handleDelete = async () => {
        console.log('Deleting customer:', deletingCustomer.id);
        const resp = await axios.delete(`/api/auth/user/${deletingCustomer.id}`)
        if (resp.status === 200) {
            toast.success("successfully Deleted!", {
                style: {
                    background: "#10b981", color: "#fff"
                }
            })
            await fetchCustomers();
        }
        setIsDeleteOpen(false);
        setDeletingCustomer(null);
    };

    const getStatusIcon = (status) => {
        switch (status?.toLowerCase()) {
            case 'active':
                return <CheckCircle className="w-4 h-4 text-emerald-400"/>;
            case 'pending':
                return <Clock className="w-4 h-4 text-amber-400"/>;
            case 'inactive':
                return <XCircle className="w-4 h-4 text-red-400"/>;
            default:
                return <Clock className="w-4 h-4 text-gray-400"/>;
        }
    };

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'active':
                return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
            case 'pending':
                return 'bg-amber-500/20 text-amber-300 border-amber-500/30';
            case 'inactive':
                return 'bg-red-500/20 text-red-300 border-red-500/30';
            default:
                return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
        }
    };

    return (<>
        <div
            className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-2xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
                        All Customers
                    </h3>
                    <p className="text-sm text-white/60 mt-1">Manage and view all customer accounts</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={handleExport}
                        className="flex items-center gap-2 px-4 py-2 bg-white/10 border border-white/20 rounded-xl hover:bg-white/20 transition-all"
                    >
                        <Download className="w-4 h-4"/>
                        <span className="hidden sm:inline">Export</span>
                    </button>
                    <button
                        onClick={openAddModal}
                        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-600 rounded-xl hover:shadow-lg transition-all"
                    >
                        <UserPlus className="w-4 h-4"/>
                        <span className="hidden sm:inline">Add Customer</span>
                    </button>
                </div>
            </div>

            <div
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                {filteredCustomers.length > 0 ? (filteredCustomers.map((customer, index) => (<div
                    key={customer.id || index}
                    className="relative bg-gradient-to-br from-white/10 to-white/5 border border-white/10 rounded-xl p-5 hover:border-pink-400/30 transition-all group"
                >
                    <div className="absolute top-3 right-3">
                        <button
                            onClick={() => setActiveMenu(activeMenu === customer.id ? null : customer.id)}
                            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                        >
                            <MoreVertical className="w-4 h-4 text-white/60"/>
                        </button>

                        {activeMenu === customer.id && (<div
                            className="absolute right-0 mt-2 w-48 bg-gray-900 border border-white/20 rounded-xl shadow-2xl overflow-hidden z-10 animate-slideDown">
                            <button
                                onClick={() => openEditModal(customer)}
                                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/10 transition-colors text-left"
                            >
                                <Edit2 className="w-4 h-4 text-blue-400"/>
                                <span>Edit Customer</span>
                            </button>
                            <button
                                onClick={() => openDeleteModal(customer)}
                                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/10 transition-colors text-left border-t border-white/10"
                            >
                                <Trash2 className="w-4 h-4 text-red-400"/>
                                <span className="text-red-400">Delete Customer</span>
                            </button>
                        </div>)}
                    </div>

                    <div className="flex flex-col items-center text-center space-y-3 mt-2">
                        <div
                            className="w-16 h-16 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center ring-4 ring-white/10 text-3xl font-bold text-white">
                            {customer.username.charAt(0).toUpperCase()}
                        </div>

                        <div className="w-full">
                            <h4 className="font-bold  group-hover:text-pink-200 transition-colors truncate text-center text-xl uppercase">
                               <sapn className="font-medium">
                                   <Verified  className="inline-block mr-2 text-blue-700 w-5 h-5"/>
                                   {customer.username}
                               </sapn>

                            </h4>
                            <div className="flex items-center justify-center gap-2 mt-2">
                                {getStatusIcon(customer.status)}
                                <span
                                    className={`text-xs px-3 py-1 rounded-full border ${getStatusColor(customer.status)}`}>
                        {customer.status}
                      </span>
                            </div>
                        </div>

                        <div className="w-full space-y-2 pt-2 border-t border-white/10">
                            <div className="flex items-center gap-2 text-sm text-white/70 justify-center">
                                <Mail className="w-4 h-4 text-pink-400 flex-shrink-0"/>
                                <span className="truncate">{customer.email}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-white/70 justify-center">
                                <Phone className="w-4 h-4 text-purple-400 flex-shrink-0"/>
                                <span>{customer.phone}</span>
                            </div>
                        </div>

                        {customer.membership && (<div className="pt-2">
                      <span
                          className="inline-flex items-center gap-1 text-xs px-3 py-1.5 bg-gradient-to-r from-pink-500/20 to-purple-600/20 border border-pink-500/30 rounded-full">
                        <Calendar className="w-3 h-3"/>
                          {customer.membership}
                      </span>
                        </div>)}
                    </div>
                </div>))) : (<div className="col-span-full text-center py-12">
                    <User className="w-16 h-16 mx-auto text-white/20 mb-4"/>
                    <p className="text-white/60">No customers found</p>
                </div>)}
            </div>
        </div>

        {/* Add/Edit Modal */}
        {isOpen && (<div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
            <div
                className="bg-gradient-to-br from-gray-900 to-gray-800 border border-white/20 rounded-2xl p-6 w-full max-w-md shadow-2xl animate-slideUp">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-2xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
                        {editingCustomer ? "Edit Customer" : "Add New Customer"}
                    </h3>
                    <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-white/10 rounded-lg">
                        <X className="w-5 h-5"/>
                    </button>
                </div>

                <div className="space-y-4">
                    {/* Username */}
                    <div>
                        <label className="block text-sm font-medium mb-2 text-white/80">Full Name *</label>
                        <div className="relative">
                            <User
                                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/40"/>
                            <input
                                type="text"
                                required
                                value={formData.username || ""}
                                onChange={(e) => setFormData({...formData, username: e.target.value})}
                                className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl
                         focus:outline-none focus:border-pink-400 focus:bg-white/15 transition-all"
                                placeholder="Enter customer name"
                            />
                        </div>
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block text-sm font-medium mb-2 text-white/80">Email Address *</label>
                        <div className="relative">
                            <Mail
                                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/40"/>
                            <input
                                type="email"
                                required
                                value={formData.email || ""}
                                onChange={(e) => setFormData({...formData, email: e.target.value})}
                                className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl
                         focus:outline-none focus:border-pink-400 focus:bg-white/15 transition-all"
                                placeholder="customer@example.com"
                            />
                        </div>
                    </div>

                    {/* Phone */}
                    <div>
                        <label className="block text-sm font-medium mb-2 text-white/80">Phone Number *</label>
                        <div className="relative">
                            <Phone
                                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/40"/>
                            <input
                                type="tel"
                                required
                                value={formData.phone || ""}
                                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                                className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl
                         focus:outline-none focus:border-pink-400 focus:bg-white/15 transition-all"
                                placeholder="+1234567890"
                            />
                        </div>
                    </div>

                    {passwordField && (
                        <div>
                            <label className="block text-sm font-medium mb-2 text-white/80">Password *</label>
                            <div className="relative">
                                <Lock
                                    className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/40"/>
                                <input
                                    type="password"
                                    required
                                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                                    className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl
                               focus:outline-none focus:border-pink-400 focus:bg-white/15 transition-all"
                                    placeholder="password"
                                />
                            </div>
                        </div>
                    )}


                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={() => setIsOpen(false)}
                            className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-xl hover:bg-white/20 transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={handleSubmit}
                            className="flex-1 px-4 py-3 bg-gradient-to-r from-pink-500 to-purple-600 rounded-xl hover:shadow-lg transition-all"
                        >
                            {editingCustomer ? "Update" : "Add"} Customer
                        </button>
                    </div>
                </div>
            </div>
        </div>)}

        {/* Delete Modal */}
        {isDeleteOpen && (<div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
            <div
                className="bg-gradient-to-br from-gray-900 to-gray-800 border border-red-500/30 rounded-2xl p-6 w-full max-w-md shadow-2xl animate-slideUp">
                <div className="flex flex-col items-center text-center space-y-4">
                    <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center">
                        <Trash2 className="w-8 h-8 text-red-400"/>
                    </div>

                    <div>
                        <h3 className="text-2xl font-bold text-white mb-2">Delete Customer</h3>
                        <p className="text-white/60">
                            Are you sure you want to delete{' '}
                            <span className="text-pink-400 font-semibold">{deletingCustomer?.customer}</span>?
                            This action cannot be undone.
                        </p>
                    </div>

                    <div className="flex gap-3 w-full pt-4">
                        <button
                            onClick={() => setIsDeleteOpen(false)}
                            className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-xl hover:bg-white/20 transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleDelete}
                            className="flex-1 px-4 py-3 bg-gradient-to-r from-red-500 to-red-600 rounded-xl hover:shadow-lg transition-all"
                        >
                            Delete
                        </button>
                    </div>
                </div>
            </div>
        </div>)}
    </>);
};

export default Customer;
