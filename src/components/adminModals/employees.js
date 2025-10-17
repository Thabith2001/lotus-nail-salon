'use client'

import React, {useState, useEffect, useMemo, useContext} from 'react';
import {
    UserPlus,
    Download,
    X,
    Mail,
    Phone,
    User,
    CheckCircle,
    Edit2,
    Trash2,
    MoreVertical,
    Lock,
    TrendingUp,
    Users,
    Activity,
    Briefcase,
    DollarSign,
    Award,
    Target,
    Star,
    Sparkles
} from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import {adminContext} from "@/app/admin/page";


const Employee = () => {
    const {searchTerm} = useContext(adminContext);
    const [employees, setEmployees] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [editingEmployee, setEditingEmployee] = useState(null);
    const [deletingEmployee, setDeletingEmployee] = useState(null);
    const [activeMenu, setActiveMenu] = useState(null);
    const [passwordField, setPasswordField] = useState(false);
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        phone: "",
        password: "",
        position: "",
        department: "",
        salary: "",
        performance: "",

    });

    // Fetch employees from API
    const fetchEmployees = async () => {
        try {
            const response = await axios.get("/api/employees");
            const employeesData = response.data?.data || [];

            const formatted = employeesData.map((employee) => ({
                id: employee._id,
                username: employee.employeeName || "Unknown",
                email: employee.email || "N/A",
                phone: employee.phone || "N/A",
                department: employee.department || "N/A",
                position: employee.position || "N/A",
                salary: employee.salary || "N/A",
                joinDate: employee.hireDate || new Date().toISOString(),
                status: employee.employeeStatus || "active",
                role: employee.role || "employee",
                performance: employee.performance || "good"
            }));

            setEmployees(formatted);
        } catch (error) {
            console.error("Failed to fetch employees:", error);
            toast.error("Failed to load employees", {
                style: {
                    background: "#ef4444",
                    color: "#fff"
                }
            });
        }
    };

    useEffect(() => {
        fetchEmployees();
    }, []);

    // Filtered employees based on search
    const filteredEmployees = useMemo(() => {
        if (!searchTerm) return employees;
        return employees.filter(e =>
            e.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
            e.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            e.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
            e.department.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [employees, searchTerm]);

    // Export employees as JSON
    const handleExport = () => {
        const blob = new Blob([JSON.stringify(employees, null, 2)], {type: 'application/json'});
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `employees_${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
    };

    // Modal functions
    const openAddModal = () => {
        setEditingEmployee(null);
        setFormData({
            username: '',
            email: '',
            phone: '',
            password: '',
            position: '',
            department: '',
            salary: '',
            performance: ''
        });
        setIsOpen(true);
        setActiveMenu(null);
        setPasswordField(true);
    };

    const openEditModal = (employee) => {
        setEditingEmployee(employee);
        setFormData({
            username: employee.username || "",
            email: employee.email || "",
            phone: employee.phone || "",
            position: employee.position || "",
            department: employee.department || "",
            salary: employee.salary || "",
            performance: employee.performance

        });
        setIsOpen(true);
        setActiveMenu(null);
        setPasswordField(false);
    };

    const openDeleteModal = (employee) => {
        setDeletingEmployee(employee);
        setIsDeleteOpen(true);
        setActiveMenu(null);
    };

    // Submit handler (Add/Edit)
    const handleSubmit = async () => {
        try {
            if (editingEmployee) {
                // Update employee
                const updateData = {
                    employeeName: formData.username,
                    email: formData.email,
                    phone: formData.phone,
                    position: formData.position,
                    department: formData.department,
                    salary: formData.salary,
                    performance: formData.performance,

                };

                const response = await axios.patch(`/api/employees/${editingEmployee.id}`, updateData);

                if (response.status === 200) {
                    toast.success("Employee updated successfully!", {
                        style: {
                            background: "#10b981",
                            color: "#fff"
                        }
                    });
                    await fetchEmployees();
                }
            } else {
                // Add new employee
                const newEmployeeData = {
                    employeeName: formData.username,
                    email: formData.email,
                    phone: formData.phone,
                    password: formData.password,
                    position: formData.position,
                    department: formData.department,
                    salary: formData.salary,
                    role: "employee",
                    hireDate: new Date().toISOString(),
                    performance: formData.performance,
                };

                const response = await axios.post("/api/employees", newEmployeeData);

                if (response.status === 201) {
                    toast.success("Employee added successfully!", {
                        style: {
                            background: "#10b981",
                            color: "#fff"
                        }
                    });
                    await fetchEmployees();
                }
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            toast.error(error.response?.data?.message || "Failed to save employee", {
                style: {
                    background: "#ef4444",
                    color: "#fff"
                }
            });
        }

        setIsOpen(false);
        setEditingEmployee(null);
        setFormData({
            username: '',
            email: '',
            phone: '',
            password: '',
            position: '',
            department: '',
            salary: '',
            performance: ''
        });
    };

    // Delete handler
    const handleDelete = async () => {
        try {
            const response = await axios.delete(`/api/employees/${deletingEmployee.id}`);

            if (response.status === 200) {
                toast.success("Employee deleted successfully!", {
                    style: {
                        background: "#10b981",
                        color: "#fff"
                    }
                });
                await fetchEmployees();
            }
        } catch (error) {
            console.error('Error deleting employee:', error);
            toast.error("Failed to delete employee", {
                style: {
                    background: "#ef4444",
                    color: "#fff"
                }
            });
        }

        setIsDeleteOpen(false);
        setDeletingEmployee(null);
    };

    const getPerformanceBadge = (performance) => {
        switch (performance?.toLowerCase()) {
            case 'experience':
                return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
            case 'good':
                return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
            case 'average':
                return 'bg-orange-600/20 text-orange-400 border-orange-600/30';
            case 'professional':
                return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
            default:
                return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
        }
    };

    const getDepartmentColor = (department) => {
        const colors = {
            'Nail Services Department': 'from-violet-500 to-purple-600',
            'Customer Service': 'from-fuchsia-500 to-pink-600',
            'Management': 'from-cyan-500 to-blue-600',
            'Marketing': 'from-orange-500 to-red-600',
            'Cleaning & Sanitation': 'from-emerald-500 to-teal-600',
            'HR': 'from-rose-500 to-pink-600',
            'Inventory & Supplies': 'from-sky-400 to-indigo-500',
            'Training & Quality': 'from-emerald-500 to-lime-600',
        };
        return colors[department] || 'from-gray-500 to-gray-600';
    };
    return (
        <div
            className="min-h-screen backdrop-blur-2xl bg-white/5 border-white/10 rounded-2xl p-4 md:p-8">
            <div className="max-w-[1600px] mx-auto space-y-6">
                {/* Modern Header */}
                <div className="flex flex-col gap-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
                                    Employee Management
                                </h1>
                                <Sparkles className="w-6 h-6 text-purple-400 animate-pulse"/>
                            </div>
                            <p className="text-white/50 text-sm">Manage your team members and their information</p>
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={handleExport}
                                className="group relative px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl transition-all duration-300 overflow-hidden"
                            >
                                <div
                                    className="absolute inset-0 bg-gradient-to-r from-violet-600/20 to-fuchsia-600/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                <div className="relative flex items-center gap-2">
                                    <Download className="w-5 h-5"/>
                                    <span className="font-medium">Export</span>
                                </div>
                            </button>
                            <button
                                onClick={openAddModal}
                                className="group relative px-6 py-3 bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-2xl transition-all duration-300 overflow-hidden hover:shadow-2xl hover:shadow-violet-500/50 hover:scale-105"
                            >
                                <div
                                    className="absolute inset-0 bg-gradient-to-r from-fuchsia-600 to-violet-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                <div className="relative flex items-center gap-2">
                                    <UserPlus className="w-5 h-5"/>
                                    <span className="font-semibold">Add Employee</span>
                                </div>
                            </button>
                        </div>
                    </div>

                    {/* Modern Stats Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div
                            className="group relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 hover:bg-white/10 transition-all duration-300">
                            <div
                                className="absolute inset-0 bg-gradient-to-br from-violet-600/10 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            <div className="relative">
                                <div className="flex items-center justify-between mb-4">
                                    <div
                                        className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                                        <Users className="w-6 h-6"/>
                                    </div>
                                    <TrendingUp className="w-5 h-5 text-emerald-400"/>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-white/50 text-sm font-medium">Total Employees</p>
                                    <p className="text-3xl font-bold text-white">{employees.length}</p>
                                </div>
                            </div>
                        </div>

                        <div
                            className="group relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 hover:bg-white/10 transition-all duration-300">
                            <div
                                className="absolute inset-0 bg-gradient-to-br from-emerald-600/10 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            <div className="relative">
                                <div className="flex items-center justify-between mb-4">
                                    <div
                                        className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                                        <Activity className="w-6 h-6"/>
                                    </div>
                                    <div className="flex items-center gap-1 text-emerald-400 text-sm">
                                        <span>100%</span>
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-white/50 text-sm font-medium">Active</p>
                                    <p className="text-3xl font-bold text-white">{employees.filter(e => e.status === 'active').length}</p>
                                </div>
                            </div>
                        </div>

                        <div
                            className="group relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 hover:bg-white/10 transition-all duration-300">
                            <div
                                className="absolute inset-0 bg-gradient-to-br from-fuchsia-600/10 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            <div className="relative">
                                <div className="flex items-center justify-between mb-4">
                                    <div
                                        className="w-12 h-12 rounded-2xl bg-gradient-to-br from-fuchsia-500 to-pink-600 flex items-center justify-center">
                                        <Briefcase className="w-6 h-6"/>
                                    </div>
                                    <Award className="w-5 h-5 text-fuchsia-400"/>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-white/50 text-sm font-medium">Departments</p>
                                    <p className="text-3xl font-bold text-white">{new Set(employees.map(e => e.department)).size}</p>
                                </div>
                            </div>
                        </div>

                        <div
                            className="group relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 hover:bg-white/10 transition-all duration-300">
                            <div
                                className="absolute inset-0 bg-gradient-to-br from-cyan-600/10 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            <div className="relative">
                                <div className="flex items-center justify-between mb-4">
                                    <div
                                        className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                                        <Target className="w-6 h-6"/>
                                    </div>
                                    <Star className="w-5 h-5 text-amber-400"/>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-white/50 text-sm font-medium">Avg Performance</p>
                                    <p className="text-3xl font-bold text-white">4.8</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Modern Employee Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                    {filteredEmployees.length > 0 ? (
                        filteredEmployees.map((employee) => (
                            <div
                                key={employee.id}
                                className="group relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 hover:bg-white/10 hover:border-violet-500/50 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-violet-500/20"
                            >
                                <div
                                    className="absolute inset-0 bg-gradient-to-br from-violet-600/0 via-fuchsia-600/0 to-cyan-600/0 group-hover:from-violet-600/10 group-hover:via-fuchsia-600/5 group-hover:to-cyan-600/10 rounded-3xl transition-all duration-500"></div>

                                <div className="relative flex items-start justify-between mb-4">
                                    <div className="relative">
                                        <div
                                            className={`w-16 h-16 rounded-full bg-gradient-to-br ${getDepartmentColor(employee.department)} flex items-center justify-center text-2xl font-bold shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                                            {employee.username.split(' ').map(n => n[0]).join('').toUpperCase()}
                                        </div>
                                        <div
                                            className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 border-4 border-slate-950 flex items-center justify-center">
                                            <CheckCircle className="w-3 h-3 text-white"/>
                                        </div>
                                    </div>

                                    <div className="relative">
                                        <button
                                            onClick={() => setActiveMenu(activeMenu === employee.id ? null : employee.id)}
                                            className="p-2 hover:bg-white/10 rounded-xl transition-all"
                                        >
                                            <MoreVertical className="w-5 h-5 text-white/60"/>
                                        </button>

                                        {activeMenu === employee.id && (
                                            <div
                                                className="absolute right-0 mt-2 w-56 bg-purple-900/90 backdrop-blur-2xl border border-white/20 rounded-2xl shadow-2xl overflow-hidden z-20">
                                                <button
                                                    onClick={() => openEditModal(employee)}
                                                    className="w-full flex items-center gap-3 px-5 py-3.5 hover:bg-violet-500/20 transition-all text-left group/item"
                                                >
                                                    <div
                                                        className="w-9 h-9 rounded-xl bg-violet-500/20 flex items-center justify-center group-hover/item:bg-violet-500/30 transition-colors">
                                                        <Edit2 className="w-4 h-4 text-violet-400"/>
                                                    </div>
                                                    <span className="text-white/90 font-medium">Edit Employee</span>
                                                </button>
                                                <button
                                                    onClick={() => openDeleteModal(employee)}
                                                    className="w-full flex items-center gap-3 px-5 py-3.5 hover:bg-red-500/20 transition-all text-left border-t border-white/10 group/item"
                                                >
                                                    <div
                                                        className="w-9 h-9 rounded-xl bg-red-500/20 flex items-center justify-center group-hover/item:bg-red-500/30 transition-colors">
                                                        <Trash2 className="w-4 h-4 text-red-400"/>
                                                    </div>
                                                    <span className="text-red-400 font-medium">Delete Employee</span>
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="relative space-y-4">
                                    <div>
                                        <h3 className="text-xl font-bold text-white mb-1 group-hover:text-violet-300 transition-colors">
                                            {employee.username.toUpperCase()}
                                        </h3>
                                        <p className="text-white/60 text-sm font-medium mb-2">{employee.position.charAt(0).toUpperCase() + employee.position.slice(1)}</p>
                                        <div className="flex items-center gap-2">
                                            <span
                                                className={`inline-flex items-center gap-1.5 px-3 py-1 ${getPerformanceBadge(employee.performance)} border rounded-full text-xs font-semibold`}>
                                                <Star className="w-3 h-3"/>
                                                {employee.performance || 'good'}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="space-y-2.5">
                                        <div className="flex items-center gap-3 text-sm group/item">
                                            <div
                                                className="w-9 h-9 rounded-xl bg-violet-500/10 flex items-center justify-center group-hover/item:bg-violet-500/20 transition-colors">
                                                <Mail className="w-4 h-4 text-violet-400"/>
                                            </div>
                                            <span
                                                className="text-white/70 truncate group-hover/item:text-white/90 transition-colors">{employee.email}</span>
                                        </div>
                                        <div className="flex items-center gap-3 text-sm group/item">
                                            <div
                                                className="w-9 h-9 rounded-xl bg-fuchsia-500/10 flex items-center justify-center group-hover/item:bg-fuchsia-500/20 transition-colors">
                                                <Phone className="w-4 h-4 text-fuchsia-400"/>
                                            </div>
                                            <span
                                                className="text-white/70 group-hover/item:text-white/90 transition-colors">{employee.phone}</span>
                                        </div>
                                        <div className="flex items-center gap-3 text-sm group/item">
                                            <div
                                                className="w-9 h-9 rounded-xl bg-cyan-500/10 flex items-center justify-center group-hover/item:bg-cyan-500/20 transition-colors">
                                                <Briefcase className="w-4 h-4 text-cyan-400"/>
                                            </div>
                                            <span
                                                className="text-white/70 group-hover/item:text-white/90 transition-colors">{employee.department}</span>
                                        </div>
                                        <div className="flex items-center gap-3 text-sm group/item">
                                            <div
                                                className="w-9 h-9 rounded-xl bg-emerald-500/10 flex items-center justify-center group-hover/item:bg-emerald-500/20 transition-colors">
                                                <DollarSign className="w-4 h-4 text-emerald-400"/>
                                            </div>
                                            <span
                                                className="text-white/70 font-semibold group-hover/item:text-white/90 transition-colors">{employee.salary}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div
                            className="col-span-full flex flex-col items-center justify-center py-24 bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10">
                            <div
                                className="w-20 h-20 rounded-3xl bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 flex items-center justify-center mb-6">
                                <Users className="w-10 h-10 text-white/40"/>
                            </div>
                            <p className="text-white/80 text-xl font-semibold mb-2">No employees found</p>
                            <p className="text-white/40">Try adjusting your search or add a new employee</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Add/Edit Modal */}
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 rounded-2xl bg-black/80 backdrop-blur-xl">
                    <div className="relative w-full max-w-2xl">
                        <div
                            className="absolute inset-0 bg-gradient-to-r from-violet-600 to-fuchsia-600   rounded-3xl blur-3xl opacity-20"></div>

                        <div
                            className="relative bg-gradient-to-r from-purple-950/80 to-via-fuchsia-600/75 backdrop-blur-2xl border border-white/20 rounded-3xl p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
                            <div className="flex items-center justify-between mb-8">
                                <div>
                                    <h2 className="text-3xl font-bold bg-gradient-to-r from-violet-400 to-fuchsia-400  bg-clip-text text-transparent mb-1">
                                        {editingEmployee ? "Edit Employee" : "Add New Employee"}
                                    </h2>
                                    <p className="text-white/50">Fill in the employee details below</p>
                                </div>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="w-10 h-10 rounded-2xl hover:bg-white/10 flex items-center justify-center transition-all hover:rotate-90 duration-300"
                                >
                                    <X className="w-6 h-6"/>
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div>
                                    <label className="block text-sm font-semibold mb-3 text-white/90">Full Name</label>
                                    <div className="relative group">
                                        <div
                                            className="absolute inset-0 bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-2xl opacity-0 group-focus-within:opacity-100 blur-xl transition-opacity"></div>
                                        <div className="relative flex items-center">
                                            <div
                                                className="absolute left-4 w-10 h-10 rounded-xl bg-violet-500/10 flex items-center justify-center">
                                                <User className="w-5 h-5 text-violet-400"/>
                                            </div>
                                            <input
                                                type="text"
                                                value={formData.username || ""}
                                                onChange={(e) => setFormData({...formData, username: e.target.value})}
                                                className="w-full pl-16 pr-5 py-4 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:border-violet-500 focus:bg-white/10 transition-all text-white placeholder-white/30"
                                                placeholder="Enter full name"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold mb-3 text-white/90">Email
                                        Address</label>
                                    <div className="relative group">
                                        <div
                                            className="absolute inset-0 bg-gradient-to-r from-fuchsia-600 to-pink-600 rounded-2xl opacity-0 group-focus-within:opacity-100 blur-xl transition-opacity"></div>
                                        <div className="relative flex items-center">
                                            <div
                                                className="absolute left-4 w-10 h-10 rounded-xl bg-fuchsia-500/10 flex items-center justify-center">
                                                <Mail className="w-5 h-5 text-fuchsia-400"/>
                                            </div>
                                            <input
                                                type="email"
                                                value={formData.email || ""}
                                                onChange={(e) => setFormData({...formData, email: e.target.value})}
                                                className="w-full pl-16 pr-5 py-4 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:border-fuchsia-500 focus:bg-white/10 transition-all text-white placeholder-white/30"
                                                placeholder="email@company.com"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold mb-3 text-white/90">Phone
                                        Number</label>
                                    <div className="relative group">
                                        <div
                                            className="absolute inset-0 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-2xl opacity-0 group-focus-within:opacity-100 blur-xl transition-opacity"></div>
                                        <div className="relative flex items-center">
                                            <div
                                                className="absolute left-4 w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center">
                                                <Phone className="w-5 h-5 text-cyan-400"/>
                                            </div>
                                            <input
                                                type="tel"
                                                value={formData.phone || ""}
                                                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                                                className="w-full pl-16 pr-5 py-4 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:border-cyan-500 focus:bg-white/10 transition-all text-white placeholder-white/30"
                                                placeholder="+1 (555) 000-0000"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold mb-3 text-white/90">Position</label>
                                    <div className="relative group">
                                        <div
                                            className="absolute inset-0 bg-gradient-to-r from-orange-600 to-red-600 rounded-2xl opacity-0 group-focus-within:opacity-100 blur-xl transition-opacity"></div>
                                        <div className="relative flex items-center">
                                            <div
                                                className="absolute left-4 w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center">
                                                <Briefcase className="w-5 h-5 text-orange-400"/>
                                            </div>
                                            <input
                                                type="text"
                                                value={formData.position || ""}
                                                onChange={(e) => setFormData({...formData, position: e.target.value})}
                                                className="w-full pl-16 pr-5 py-4 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:border-orange-500 focus:bg-white/10 transition-all text-white placeholder-white/30"
                                                placeholder="Job position"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold mb-3 text-white/90">Department</label>
                                    <div className="relative group">
                                        <div
                                            className="absolute inset-0 bg-gradient-to-r from-violet-600 to-purple-600 rounded-2xl opacity-0 group-focus-within:opacity-100 blur-xl transition-opacity"></div>
                                        <div className="relative flex items-center">
                                            <div
                                                className="absolute left-4 w-10 h-10 rounded-xl bg-violet-500/10 flex items-center justify-center">
                                                <Users className="w-5 h-5 text-violet-400"/>
                                            </div>
                                            <select
                                                value={formData.department || ""}
                                                onChange={(e) => setFormData({...formData, department: e.target.value})}
                                                className="w-full pl-16 pr-5 py-4 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:border-violet-500 focus:bg-white/10 transition-all text-white appearance-none cursor-pointer"
                                            >
                                                <option value="" className="bg-slate-900">Select Department</option>
                                                {["Nail Services Department", "Customer Service", "Management", "Cleaning & Sanitation", "Marketing", "Inventory & Supplies", "HR", "Training & Quality"].map(department => (
                                                    <option className="bg-slate-900" key={department}
                                                            value={department}>
                                                        {department}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold mb-3 text-white/90">Salary</label>
                                    <div className="relative group">
                                        <div
                                            className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl opacity-0 group-focus-within:opacity-100 blur-xl transition-opacity"></div>
                                        <div className="relative flex items-center">
                                            <div
                                                className="absolute left-4 w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                                                <DollarSign className="w-5 h-5 text-emerald-400"/>
                                            </div>
                                            <input
                                                type="text"
                                                value={formData.salary || ""}
                                                onChange={(e) => setFormData({...formData, salary: e.target.value})}
                                                className="w-full pl-16 pr-5 py-4 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:border-emerald-500 focus:bg-white/10 transition-all text-white placeholder-white/30"
                                                placeholder="$85,000"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label
                                        className="block text-sm font-semibold mb-3 text-white/90">Performance</label>
                                    <div className="relative group">
                                        <div
                                            className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-800 rounded-2xl opacity-0 group-focus-within:opacity-100 blur-xl transition-opacity"></div>
                                        <div className="relative flex items-center">
                                            <div
                                                className="absolute left-4 w-10 h-10 rounded-xl bg-violet-500/10 flex items-center justify-center">
                                                <Target className="w-5 h-5 text-green-500"/>
                                            </div>
                                            <select
                                                value={formData.performance || ""}
                                                onChange={(e) => setFormData({
                                                    ...formData,
                                                    performance: e.target.value
                                                })}
                                                className="w-full pl-16 pr-5 py-4 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:border-green-400 focus:bg-white/10 transition-all text-white appearance-none cursor-pointer"
                                            >
                                                <option value="" className="bg-slate-900">Select Performance</option>
                                                {["Experience", "Good", "Average", "professional"].map(performance => (
                                                    <option className="bg-slate-900" key={performance}
                                                            value={performance}>
                                                        {performance}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                {passwordField && (
                                    <div className="md:col-span-2">
                                        <label
                                            className="block text-sm font-semibold mb-3 text-white/90">Password</label>
                                        <div className="relative group">
                                            <div
                                                className="absolute inset-0 bg-gradient-to-r from-rose-600 to-pink-600 rounded-2xl opacity-0 group-focus-within:opacity-100 blur-xl transition-opacity"></div>
                                            <div className="relative flex items-center">
                                                <div
                                                    className="absolute left-4 w-10 h-10 rounded-xl bg-rose-500/10 flex items-center justify-center">
                                                    <Lock className="w-5 h-5 text-rose-400"/>
                                                </div>
                                                <input
                                                    type="password"
                                                    value={formData.password || ""}
                                                    onChange={(e) => setFormData({
                                                        ...formData,
                                                        password: e.target.value
                                                    })}
                                                    className="w-full pl-16 pr-5 py-4 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:border-rose-500 focus:bg-white/10 transition-all text-white placeholder-white/30"
                                                    placeholder="Enter secure password"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="flex gap-4 pt-8">
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="flex-1 px-6 py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl transition-all font-semibold text-lg"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSubmit}
                                    className="flex-1 px-6 py-4 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 rounded-2xl transition-all font-semibold text-lg shadow-lg shadow-violet-500/50 hover:shadow-2xl hover:shadow-violet-500/60 hover:scale-[1.02]"
                                >
                                    {editingEmployee ? "Update" : "Add"} Employee
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Modal */}
            {isDeleteOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center rounded-2xl p-4 bg-black/80 backdrop-blur-xl">
                    <div className="relative w-full max-w-md">
                        <div
                            className="absolute inset-0 bg-gradient-to-r from-red-600 to-rose-600 rounded-3xl blur-3xl opacity-20"></div>

                        <div
                            className="relative bg-gradient-to-r from-purple-950/80 to-via-fuchsia-600/75 backdrop-blur-2xl border border-red-500/20 rounded-3xl p-8 shadow-2xl">
                            <div className="flex flex-col items-center text-center space-y-6">
                                <div className="relative">
                                    <div
                                        className="w-20 h-20 rounded-3xl bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center">
                                        <Trash2 className="w-10 h-10"/>
                                    </div>
                                    <div
                                        className="absolute inset-0 bg-gradient-to-br from-red-500 to-rose-600 rounded-3xl blur-2xl opacity-50"></div>
                                </div>

                                <div>
                                    <h3 className="text-3xl font-bold text-white mb-3">Remove Employee?</h3>
                                    <p className="text-white/60 text-lg mb-2">
                                        You&#39;re about to remove
                                    </p>
                                    <p className="text-2xl font-bold bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
                                        {deletingEmployee?.username}
                                    </p>
                                    <p className="text-white/50 text-sm mt-2">{deletingEmployee?.position}</p>
                                    <p className="text-white/50 mt-4">This action cannot be undone.</p>
                                </div>

                                <div className="flex gap-4 w-full pt-4">
                                    <button
                                        onClick={() => setIsDeleteOpen(false)}
                                        className="flex-1 px-6 py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl transition-all font-semibold"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleDelete}
                                        className="flex-1 px-6 py-4 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 rounded-2xl transition-all font-semibold shadow-lg shadow-red-500/50 hover:shadow-2xl hover:shadow-red-500/60 hover:scale-[1.02]"
                                    >
                                        Remove
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
export default Employee;