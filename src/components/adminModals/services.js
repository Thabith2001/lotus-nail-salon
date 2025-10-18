'use client';
import React, {useContext, useEffect, useMemo, useState} from 'react';
import {adminContext} from '@/app/admin/page';
import axios from 'axios';
import {
    Award,
    Clock,
    DollarSign,
    Download,
    Edit2,
    Grid3x3,
    MoreVertical,
    Package,
    Search,
    Sparkles,
    Star,
    Tag,
    Trash2,
    TrendingUp,
    UserPlus,
    X
} from 'lucide-react';
import toast from 'react-hot-toast';
import ServicesIU from "@/components/adminModals/servicesModal";

const Services_admin = () => {
    const {searchTerm} = useContext(adminContext);
    const [activeTab, setActiveTab] = useState('services');
    const [data, setData] = useState([]);
    const [activeMenu, setActiveMenu] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState('add');
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        category: '',
        description: '',
        duration: '',
        price: '',
        subscription: '',
        benefits: [''],
        features: [''],
        sessions: '',
        recommended: false,
        originalPrice: '',
        savings: '',
        popularity: false,
        services: [''],
    });

    // Fetch data
    const fetchData = async (type) => {
        try {
            const resp = await axios.get(`/api/${type}`);
            let items = [];

            if (type === 'services') items = resp.data?.services || []; else if (type === 'packages') items = resp.data?.packages || []; else if (type === 'membership') items = resp.data?.memberships || [];

            // Normalize data
            items = items.map((item) => ({
                id: item._id,
                name: item?.name || '',
                category: item?.category || '',
                description: item?.description || '',
                duration: item?.duration || '',
                price: item?.price || '',
                subscription: item?.subscription || '',
                benefits: item?.benefits || [''],
                features: item?.features || [''],
                sessions: item?.sessions || '',
                recommended: item?.recommended || false,
                originalPrice: item?.originalPrice || '',
                savings: item?.savings || '',
                popularity: item?.popular || false,
                services: item?.services || [''],
            }));

            setData(items);
        } catch (error) {
            console.error(`Failed to fetch ${activeTab}:`, error);
            toast.error(`Failed to load ${activeTab} data. Please try again later.`, {
                style: {background: '#ef4444', color: '#fff'},
            });
        }
    };

    // Fetch data when activeTab changes
    useEffect(() => {
        const loadData = async () => {
            if (!activeTab) return;
            try {
                await fetchData(activeTab);
            } catch (err) {
                console.error(err);
            }
        };
        loadData();
    }, [activeTab]);

    // Calculate stats
    const stats = useMemo(() => {
        return {
            total: data.length,
           popularity: data.filter(d => d.popularity).length,
            avgPrice: data.length > 0 ? (data.reduce((sum, d) => sum + (parseFloat(d.price) || 0), 0) / data.length).toFixed(0) : 0
        };
    }, [data]);

    // Memoized filtered data
    const filteredData = useMemo(() => {
        const term = (searchTerm).toLowerCase();
        return data.filter((item) => item.name?.toLowerCase().includes(term) || item.description?.toLowerCase().includes(term) || item.category?.toLowerCase().includes(term));
    }, [data, searchTerm]);

    // Menu actions
    const openModal = (item) => {
        setFormData({
            name: item.name,
            category: item.category,
            description: item.description,
            duration: item.duration,
            price: item.price,
            subscription: item.subscription,
            benefits: item.benefits || [''],
            features: item.features || [''],
            sessions: item.sessions,
            recommended: item.recommended,
            originalPrice: item.originalPrice,
            savings: item.savings,
            popularity: item.popularity,
            services: item.services || [''],
        });
        setSelectedItem(item);
        setModalMode('edit');
        setIsModalOpen(true);
        setActiveMenu(null);
    };

    const openDeleteModal = (item) => {
        setSelectedItem(item);
        setIsDeleteModalOpen(true);
        setActiveMenu(null);
    };

    const handleExport = () => {
        console.log('Export data');
        toast.success('Exporting data...', {
            style: {background: '#10b981', color: '#fff'},
        });
    };

    const openAddModal = () => {
        setFormData({
            name: '',
            category: '',
            description: '',
            duration: '',
            price: '',
            subscription: '',
            benefits: [''],
            features: [''],
            sessions: '',
            recommended: false,
            originalPrice: '',
            savings: '',
            popularity: false,
            services: [''],
        });
        setModalMode('add');
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedItem(null);
    };

    const closeDeleteModal = () => {
        setIsDeleteModalOpen(false);
        setSelectedItem(null);
    };

    const handleDelete = async () => {
        try {
            await axios.delete(`/api/${activeTab}/${selectedItem.id}`);
            toast.success(`${activeTab.slice(0, -1)} deleted successfully!`, {
                style: {background: '#10b981', color: '#fff'},
            });
            closeDeleteModal();
            fetchData(activeTab);
        } catch (error) {
            console.error('Error deleting data:', error);
            toast.error('Failed to delete. Please try again.', {
                style: {background: '#ef4444', color: '#fff'},
            });
        }
    };

    const getTabIcon = (tab) => {
        switch (tab) {
            case 'services':
                return <Sparkles className="w-4 h-4"/>;
            case 'packages':
                return <Package className="w-4 h-4"/>;
            case 'membership':
                return <Award className="w-4 h-4"/>;
            default:
                return null;
        }
    };

    // Card content renderer
    const renderCardContent = (item) => {
        const hasContent = (item.price ?? '') !== '' || (item.duration ?? '') !== '' || (item.subscription ?? '') !== '' || item.recommended || (item.features?.length ?? 0) > 0 || (item.benefits?.length ?? 0) > 0 || (item.sessions ?? '') !== '' || (item.originalPrice ?? '') !== '';

        if (!hasContent) return null;

        return (<div className="space-y-3">
            {/* Price & Duration Row */}
            <div className="flex items-center justify-between">
                {item.price && (<div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-emerald-400">${item.price}</span>
                    {item.originalPrice && (
                        <span className="text-sm text-gray-400 line-through">${item.originalPrice}</span>)}
                </div>)}
                {item.duration && (<div
                    className="flex items-center gap-1 px-2 py-1 text-xs bg-purple-500/20 text-purple-300 rounded-lg">
                    <Clock className="w-3 h-3"/>
                    {item.duration}
                </div>)}
            </div>

            {/* Tags Row */}
            <div className="flex flex-wrap gap-2">
                {item.savings && (<div
                    className="inline-flex items-center gap-1 px-2 py-1 bg-green-500/20 text-green-400 text-xs font-semibold rounded-lg">
                    <TrendingUp className="w-3 h-3"/>
                    Save ${item.savings}
                </div>)}
                {item.subscription && (<div
                    className="flex items-center gap-1 px-2 py-1 text-xs bg-blue-500/20 text-blue-300 rounded-lg">
                    <Tag className="w-3 h-3"/>
                    {item.subscription}
                </div>)}
                {item.sessions && (<span className="px-2 py-1 text-xs bg-orange-500/20 text-orange-300 rounded-lg">
                            {item.sessions} Sessions
                        </span>)}
                {item.recommended && (<div
                    className="flex items-center gap-1 px-2 py-1 text-xs bg-yellow-500/20 text-yellow-300 rounded-lg font-semibold">
                    <Star className="w-3 h-3 fill-yellow-300"/>
                    Recommended
                </div>)}
            </div>

            {/* Features */}
            {item.features?.length > 0 && item.features[0] !== '' && (<div className="pt-2 border-t border-white/10">
                <p className="text-xs text-gray-400 mb-2 font-medium">Features</p>
                <div className="flex flex-wrap gap-1">
                    {item.features.slice(0, 3).map((f, idx) => (
                        <span key={idx} className="text-xs px-2 py-1 bg-white/5 text-gray-300 rounded">
                                    {f}
                                </span>))}
                    {item.features.length > 3 && (<span className="text-xs px-2 py-1 bg-white/5 text-gray-300 rounded">
                                    +{item.features.length - 3} more
                                </span>)}
                </div>
            </div>)}

            {/* Benefits */}
            {item.benefits?.length > 0 && item.benefits[0] !== '' && (<div className="pt-2 border-t border-white/10">
                <p className="text-xs text-gray-400 mb-2 font-medium">Benefits</p>
                <ul className="space-y-1">
                    {item.benefits.slice(0, 2).map((b, idx) => (
                        <li key={idx} className="text-xs text-gray-300 flex items-start gap-2">
                            <span className="text-emerald-400 mt-0.5">✓</span>
                            <span className="flex-1">{b}</span>
                        </li>))}
                    {item.benefits.length > 2 && (<li className="text-xs text-gray-400 italic">
                        +{item.benefits.length - 2} more benefits
                    </li>)}
                </ul>
            </div>)}
        </div>);
    };

    return (<div className="min-h-screen bg-white/5 border-white/10 rounded-2xl p-4 md:p-8">
        <div className="max-w-7xl mx-auto space-y-6">

            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div>
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
                                Service Management
                            </h1>
                            <Sparkles className="w-6 h-6 text-purple-400 animate-pulse"/>
                        </div>
                        <p className="text-white/50 text-sm">Manage your services , packages and memberships</p>
                    </div>
                </div>

                <div className="flex gap-3">
                    <button
                        onClick={handleExport}
                        className="px-4 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all flex items-center gap-2 text-white hover:scale-105 active:scale-95"
                    >
                        <Download className="w-4 h-4"/>
                        <span className="hidden sm:inline">Export</span>
                    </button>
                    <button
                        onClick={openAddModal}
                        className="px-4 py-2.5 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 rounded-xl transition-all flex items-center gap-2 text-white font-medium shadow-lg shadow-violet-500/25 hover:scale-105 active:scale-95"
                    >
                        <UserPlus className="w-4 h-4"/>
                        <span>Add New</span>
                    </button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div
                    className="p-5 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl hover:border-blue-500/30 transition-all group">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-400 text-sm mb-1">Total Items</p>
                            <p className="text-3xl font-bold text-white">{stats.total}</p>
                        </div>
                        <div
                            className="w-14 h-14 rounded-xl bg-blue-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Grid3x3 className="w-7 h-7 text-blue-400"/>
                        </div>
                    </div>
                </div>

                <div
                    className="p-5 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl hover:border-yellow-500/30 transition-all group">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-400 text-sm mb-1">Recommended</p>
                            <p className="text-3xl font-bold text-white">{stats.popularity}</p>
                        </div>
                        <div
                            className="w-14 h-14 rounded-xl bg-yellow-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Award className="w-7 h-7 text-yellow-400"/>
                        </div>
                    </div>
                </div>

                <div
                    className="p-5 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl hover:border-emerald-500/30 transition-all group">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-400 text-sm mb-1">Avg Price</p>
                            <p className="text-3xl font-bold text-white">${stats.avgPrice}</p>
                        </div>
                        <div
                            className="w-14 h-14 rounded-xl bg-emerald-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <DollarSign className="w-7 h-7 text-emerald-400"/>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabs & Controls */}
            <div className="p-6 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl space-y-4">

                {/* Tabs */}
                <div className="flex flex-wrap gap-2">
                    {['services', 'packages', 'membership'].map((tab) => (<button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-4 py-2.5 rounded-xl font-medium transition-all duration-200 flex items-center gap-2 ${activeTab === tab ? 'bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-lg shadow-violet-500/25 scale-105' : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white hover:scale-105'}`}
                    >
                        {getTabIcon(tab)}
                        {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>))}
                </div>
            </div>

            {/* Data Grid/List */}
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                {filteredData.length === 0 ? (<div
                    className="col-span-full p-12 text-center bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl">
                    <div
                        className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 flex items-center justify-center">
                        <Search className="w-10 h-10 text-gray-400"/>
                    </div>
                    <p className="text-gray-300 text-xl font-semibold mb-2">No {activeTab} found</p>
                    <p className="text-gray-500 text-sm">Try adjusting your search or filters</p>
                </div>) : (filteredData.map((item) => (<div
                    key={item.id}
                    className="group relative p-5 bg-white/5 backdrop-blur-xl border border-white/10 hover:border-violet-500/30 rounded-2xl transition-all hover:shadow-xl hover:shadow-violet-500/10 hover:scale-[1.02]"
                >
                    {/* Header */}
                    <div className="flex items-start justify-between mb-3">
                        <div className="flex-1 pr-2">
                            <h3 className="text-lg font-bold text-white mb-1 group-hover:text-violet-400 transition-colors line-clamp-1">
                                {item.name}
                            </h3>
                            {item.category && (<span
                                className="inline-block px-2 py-0.5 text-xs bg-white/10 text-gray-300 rounded">
                                                {item.category}
                                            </span>)}
                        </div>

                        {/* Menu */}
                        <div className="relative">
                            <button
                                onClick={() => setActiveMenu(activeMenu === item.id ? null : item.id)}
                                className="p-2 hover:bg-white/10 rounded-lg transition-all"
                            >
                                <MoreVertical className="w-5 h-5 text-gray-400"/>
                            </button>

                            {activeMenu === item.id && (<>
                                <div
                                    className="fixed inset-0 z-10"
                                    onClick={() => setActiveMenu(null)}
                                />
                                <div
                                    className="absolute right-0 mt-2 w-48 bg-slate-900/95 backdrop-blur-xl border border-white/20 rounded-xl shadow-2xl overflow-hidden z-20">
                                    <button
                                        onClick={() => openModal(item)}
                                        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-violet-500/20 transition-all text-left"
                                    >
                                        <div
                                            className="w-8 h-8 rounded-lg bg-violet-500/20 flex items-center justify-center">
                                            <Edit2 className="w-4 h-4 text-violet-400"/>
                                        </div>
                                        <span className="text-white font-medium">Edit</span>
                                    </button>
                                    <button
                                        onClick={() => openDeleteModal(item)}
                                        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-500/20 transition-all text-left border-t border-white/10"
                                    >
                                        <div
                                            className="w-8 h-8 rounded-lg bg-red-500/20 flex items-center justify-center">
                                            <Trash2 className="w-4 h-4 text-red-400"/>
                                        </div>
                                        <span className="text-red-400 font-medium">Delete</span>
                                    </button>
                                </div>
                            </>)}
                        </div>
                    </div>

                    {/* Description */}
                    <p className="text-sm text-gray-400 mb-4 line-clamp-2">
                        {item.description || 'No description available.'}
                    </p>

                    {/* Content */}
                    {renderCardContent(item)}
                </div>)))}
            </div>
        </div>
        {/* Add/Edit Modal */}
        {isModalOpen && (
            <ServicesIU modalMode={modalMode} activeTab={activeTab} formData={formData} setFormData={setFormData}
                        closeModal={closeModal} selectedItem={selectedItem} fetchData={fetchData}/>)}


        {/* Delete Confirmation Modal */}
        {isDeleteModalOpen && (<div
            className="fixed inset-0 bg-black/80 rounded-2xl backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div
                className="bg-gradient-to-r from-purple-950/80 to-via-fuchsia-600/75 rounded-2xl border border-white/10 w-full max-w-md shadow-2xl">
                {/* Modal Header */}
                <div className="p-6 border-b border-white/10 bg-gradient-to-r from-red-600/10 to-rose-600/10 rounded-t-2xl">
                    <div className="flex items-center justify-between">
                        {/* Title + Icon */}
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-xl bg-red-500/20 flex items-center justify-center">
                                <Trash2 className="w-6 h-6 text-red-400" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-white">
                                    Delete {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
                                </h2>
                                <p className="text-sm text-gray-400 mt-0.5">
                                    This action cannot be undone.
                                </p>
                            </div>
                        </div>

                        {/* Close Button */}
                        <button
                            onClick={() => closeDeleteModal()}
                            className="w-10 h-10 rounded-2xl hover:bg-white/10 flex items-center justify-center transition-all duration-300 hover:rotate-90"
                        >
                            <X className="w-6 h-6 text-gray-300" />
                        </button>
                    </div>
                </div>
                {/* Modal Body */}
                <div className="p-6">
                    <p className="text-gray-300">
                        Are you sure you want to delete <span
                        className="font-semibold text-white">&#34;{selectedItem?.name}&#34;</span>? This will
                        permanently remove this item from your system.
                    </p>
                </div>

                {/* Modal Footer */}
                <div className="p-6 border-t border-white/10 flex justify-end gap-3 bg-white/5">
                    <button
                        type="button"
                        onClick={closeDeleteModal}
                        className="px-6 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white transition-all"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleDelete}
                        className="px-6 py-2.5 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 rounded-xl text-white font-medium shadow-lg shadow-red-500/25 transition-all"
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>)}
    </div>);
};

export default Services_admin;