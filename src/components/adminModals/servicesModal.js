"use client";
import React from "react";
import {Edit2, Package, X, Plus, Trash2, Sparkles} from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";

const ServicesIU = ({
                        activeTab,
                        modalMode,
                        formData,
                        setFormData,
                        closeModal,
                        selectedItem,
                        fetchData,
                    }) => {
    const handleInputChange = (e) => {
        const {name, value, type, checked} = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleArrayChange = (field, index, value) => {
        setFormData((prev) => ({
            ...prev,
            [field]: prev[field].map((item, i) => (i === index ? value : item)),
        }));
    };

    const addArrayField = (field) => {
        setFormData((prev) => ({
            ...prev,
            [field]: [...(prev[field] || []), ""],
        }));
    };

    const removeArrayField = (field, index) => {
        setFormData((prev) => ({
            ...prev,
            [field]: (prev[field] || []).filter((_, i) => i !== index),
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            if (modalMode === "add") {
                await axios.post(`/api/${activeTab}`, formData);
                toast.success(`${activeTab} added successfully!`, {
                    style: {background: "#10b981", color: "#fff"},
                });
            } else {
                await axios.patch(`/api/${activeTab}/${selectedItem?.id}`, formData);
                toast.success(`${activeTab} updated successfully!`, {
                    style: {background: "#10b981", color: "#fff"},
                });
            }

            closeModal();
            fetchData(activeTab);
        } catch (error) {
            console.error("Error saving data:", error);
            toast.error("Failed to save. Please try again.", {
                style: {background: "#ef4444", color: "#fff"},
            });
        }
    };

    const calculateSavings = () => {
        const orig = parseFloat(formData.originalPrice) || 0;
        const current = parseFloat(formData.price) || 0;
        const savings = orig - current;
        setFormData((prev) => ({
            ...prev,
            savings: savings > 0 ? savings.toString() : "0",
        }));
    };

    const categoryOptions = {
        services: ["manicure", "pedicure", "spa", "nails", "massage", "facial"],
        packages: ["basic", "premium", "deluxe", "ultimate"],
        membership: ["gold", "silver", "bronze", "platinum"],
    };

    const isPackageOrMembership =
        activeTab === "packages" || activeTab === "membership";

    return (
        <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
            <div
                className="bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 rounded-3xl border border-white/10 w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl shadow-violet-500/20">
                {/* Modal Header */}
                <div className="relative p-6 border-b border-white/10 overflow-hidden">
                    <div
                        className="absolute inset-0 bg-gradient-to-r from-violet-600/20 via-fuchsia-600/20 to-purple-600/20"></div>
                    <div className="relative flex items-center justify-between">
                        <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                            {modalMode === "add" ? (
                                <>
                                    <div className="p-2 bg-violet-500/20 rounded-xl">
                                        <Package className="w-6 h-6 text-violet-400"/>
                                    </div>
                                    <span>
                    Add New{" "}
                                        {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
                  </span>
                                </>
                            ) : (
                                <>
                                    <div className="p-2 bg-violet-500/20 rounded-xl">
                                        <Edit2 className="w-6 h-6 text-violet-400"/>
                                    </div>
                                    <span>
                    Edit {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
                  </span>
                                </>
                            )}
                        </h2>

                        <button
                            onClick={closeModal}
                            className="w-10 h-10 rounded-xl hover:bg-white/10 flex items-center justify-center transition-all duration-300 hover:rotate-90 group"
                        >
                            <X className="w-6 h-6 text-gray-400 group-hover:text-white"/>
                        </button>
                    </div>
                </div>

                {/* Form */}
                <form
                    onSubmit={handleSubmit}
                    className="p-6 overflow-y-auto max-h-[calc(90vh-140px)] space-y-6"
                >
                    {/* Basic Info */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                            <Sparkles className="w-5 h-5 text-violet-400"/>
                            Basic Information
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Name */}
                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-gray-300">
                                    {activeTab} Name*
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 border border-white/10 rounded-xl bg-slate-800/50 text-white focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                                    required
                                />
                            </div>

                            {/* Category */}
                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-gray-300">
                                    Category*
                                </label>
                                <select
                                    name="category"
                                    value={formData.category || ""}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 border border-white/10 rounded-xl bg-slate-800/50 text-white focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                                    required
                                >
                                    <option value="">Select category</option>
                                    {(categoryOptions[activeTab] || []).map((cat) => (
                                        <option key={cat} value={cat}>
                                            {cat.charAt(0).toUpperCase() + cat.slice(1)}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Duration */}
                            {(activeTab === "services" || activeTab === "packages") && (
                                <div className="space-y-2">
                                    <label className="block text-sm font-semibold text-gray-300">
                                        Duration (minutes)*
                                    </label>
                                    <input
                                        type="number"
                                        name="duration"
                                        value={formData.duration}
                                        onChange={handleInputChange}
                                        placeholder="50"
                                        className="w-full px-4 py-3 border border-white/10 rounded-xl bg-slate-800/50 text-white focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                                        required
                                    />
                                </div>
                            )}

                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-gray-300">
                                    subscription Type*
                                </label>
                                <input
                                    type="text"
                                    name="subscription"
                                    value={formData.subscription}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 border border-white/10 rounded-xl bg-slate-800/50 text-white focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    {/* Pricing Section */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                            <span className="text-violet-400">💰</span> Pricing
                        </h3>

                        {isPackageOrMembership ? (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {/* Original Price */}
                                <div className="space-y-2">
                                    <label className="block text-sm font-semibold text-gray-300">
                                        Original Price*
                                    </label>
                                    <input
                                        type="number"
                                        name="originalPrice"
                                        value={formData.originalPrice}
                                        onChange={handleInputChange}
                                        onBlur={calculateSavings}
                                        placeholder="320"
                                        className="w-full px-4 py-3 border border-white/10 rounded-xl bg-slate-800/50 text-white focus:ring-2 focus:ring-violet-500"
                                        required
                                    />
                                </div>

                                {/* Current Price */}
                                <div className="space-y-2">
                                    <label className="block text-sm font-semibold text-gray-300">
                                        Current Price*
                                    </label>
                                    <input
                                        type="number"
                                        name="price"
                                        value={formData.price}
                                        onChange={handleInputChange}
                                        onBlur={calculateSavings}
                                        placeholder="229"
                                        className="w-full px-4 py-3 border border-white/10 rounded-xl bg-slate-800/50 text-white focus:ring-2 focus:ring-violet-500"
                                        required
                                    />
                                </div>

                                {/* Savings */}
                                <div className="space-y-2">
                                    <label className="block text-sm font-semibold text-gray-300">
                                        Savings
                                    </label>
                                    <input
                                        type="number"
                                        name="savings"
                                        value={formData.savings}
                                        readOnly
                                        placeholder="91"
                                        className="w-full px-4 py-3 border border-white/10 rounded-xl bg-slate-800/30 text-emerald-400 font-semibold"
                                    />
                                </div>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Price */}
                                <div className="space-y-2">
                                    <label className="block text-sm font-semibold text-gray-300">
                                        Price*
                                    </label>
                                    <input
                                        type="number"
                                        name="price"
                                        value={formData.price}
                                        onChange={handleInputChange}
                                        placeholder="55"
                                        className="w-full px-4 py-3 border border-white/10 rounded-xl bg-slate-800/50 text-white focus:ring-2 focus:ring-violet-500"
                                        required
                                    />
                                </div>

                                {/* Popular Checkbox */}
                                <div className="space-y-2">
                                    <label className="block text-sm font-semibold text-gray-300">
                                        Popular Service
                                    </label>
                                    <label
                                        className="flex items-center gap-3 p-3 border border-white/10 rounded-xl cursor-pointer hover:bg-slate-800/50 transition-all group">
                                        <input
                                            type="checkbox"
                                            name="popularity"
                                            checked={formData.popularity || false}
                                            onChange={handleInputChange}
                                            className="w-5 h-5 text-violet-500 rounded focus:ring-violet-400"
                                        />
                                        <span className="text-sm text-gray-300 group-hover:text-white">
                      Mark as popular
                    </span>
                                    </label>
                                </div>
                            </div>
                        )}

                        {/* Description */}
                        <div className="space-y-2">
                            <label className="block text-sm font-semibold text-gray-300">
                                Description*
                            </label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 border border-white/10 rounded-xl bg-slate-800/50 text-white focus:ring-2 focus:ring-violet-500"
                                required
                            />
                        </div>

                        {/* Sessions (Membership only) */}
                        {activeTab === "membership" && (
                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-gray-300">
                                    Number of Sessions*
                                </label>
                                <input
                                    type="number"
                                    name="sessions"
                                    value={formData.sessions}
                                    onChange={handleInputChange}
                                    placeholder="4"
                                    className="w-full px-4 py-3 border border-white/10 rounded-xl bg-slate-800/50 text-white focus:ring-2 focus:ring-violet-500"
                                    required
                                />
                            </div>
                        )}
                    </div>

                    {/* Package / Membership Fields */}
                    {isPackageOrMembership && (
                        <>
                            {/* Features */}
                            {renderDynamicList("features", "Feature")}
                            {/* Membership Benefits */}
                            {activeTab === "membership" && renderDynamicList("benefits", "Benefit")}
                            {/* Package Services */}
                            {activeTab === "packages" && renderDynamicList("services", "Service")}

                            {/* Recommended */}
                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-gray-300">
                                    Recommended
                                </label>
                                <label
                                    className="flex items-center gap-3 p-3 border border-white/10 rounded-xl cursor-pointer hover:bg-slate-800/50 transition-all group">
                                    <input
                                        type="checkbox"
                                        name="recommended"
                                        checked={formData.recommended || false}
                                        onChange={handleInputChange}
                                        className="w-5 h-5 text-violet-500 rounded focus:ring-violet-400"
                                    />
                                    <span className="text-sm text-gray-300 group-hover:text-white">
                    Mark as recommended
                  </span>
                                </label>
                            </div>
                        </>
                    )}

                    {/* Actions */}
                    <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                        <button
                            type="button"
                            onClick={closeModal}
                            className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-xl font-semibold transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-6 py-3 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 text-white rounded-xl font-semibold transition-all shadow-lg shadow-violet-500/30"
                        >
                            {modalMode === "add" ? "Add" : "Update"}{" "}
                            {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );

    function renderDynamicList(field, label) {
        return (
            <div className="space-y-3">
                <label className="block text-sm font-semibold text-gray-300">
                    {label}s
                </label>
                {(formData[field] || [""]).map((value, index) => (
                    <div key={index} className="flex gap-2">
                        <input
                            type="text"
                            value={value}
                            onChange={(e) => handleArrayChange(field, index, e.target.value)}
                            placeholder={`Enter ${label.toLowerCase()}`}
                            className="flex-1 px-4 py-3 border border-white/10 rounded-xl bg-slate-800/50 text-white focus:ring-2 focus:ring-violet-500"
                        />
                        {(formData[field] || []).length > 1 && (
                            <button
                                type="button"
                                onClick={() => removeArrayField(field, index)}
                                className="px-4 py-3 bg-red-500/20 text-red-400 rounded-xl hover:bg-red-500/30 transition-all"
                            >
                                <Trash2 className="w-5 h-5"/>
                            </button>
                        )}
                    </div>
                ))}
                <button
                    type="button"
                    onClick={() => addArrayField(field)}
                    className="flex items-center gap-2 px-4 py-2 text-violet-400 hover:bg-violet-500/10 rounded-xl transition-all"
                >
                    <Plus className="w-5 h-5"/>
                    Add {label}
                </button>
            </div>
        );
    }
};

export default ServicesIU;
