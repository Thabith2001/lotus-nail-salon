"use client";
import React, {useState, useEffect} from "react";
import {
    X,
    ArrowLeft,
    Mail,
    Lock,
    User,
    Phone,
    Eye,
    EyeOff,
    Heart,
    LogIn,
    UserPlus,
    KeyRound,
    Shield,
    CheckCircle,
    AlertCircle
} from "lucide-react";
import axios from "axios";
import {useAuth} from "@/context/authContext";
import {useAuthModal} from "@/context/authModelContext";
import toast from "react-hot-toast";
import {useSparkles} from "@/hooks/useSparkles";

const Auth = () => {
    const [view, setView] = useState("signin");
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({
        name: "",
        email: "",
        phone: "",
        password: "",
        identifier: ""
    });
    const [showPassword, setShowPassword] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const [inputFocus, setInputFocus] = useState({});
    const [passwordStrength, setPasswordStrength] = useState(0);

    const {login} = useAuth();
    const {closeAuth} = useAuthModal();

    useEffect(() => {
        setIsVisible(true);

        // Calculate password strength for signup
        if (view === "signup" && form.password) {
            let strength = 0;
            if (form.password.length >= 8) strength++;
            if (/[A-Z]/.test(form.password)) strength++;
            if (/[0-9]/.test(form.password)) strength++;
            if (/[^A-Za-z0-9]/.test(form.password)) strength++;
            setPasswordStrength(strength);
        }
    }, [form.password, view]);

    const handleChange = (e) => setForm({...form, [e.target.name]: e.target.value});
    const closeModal = () => closeAuth();
    const sparkles = useSparkles(20);

    const handleInputFocus = (field, focused) => {
        setInputFocus(prev => ({...prev, [field]: focused}));
    };

    const getPasswordStrengthColor = () => {
        switch (passwordStrength) {
            case 0:
            case 1:
                return 'bg-red-400';
            case 2:
                return 'bg-yellow-400';
            case 3:
                return 'bg-blue-400';
            case 4:
                return 'bg-green-400';
            default:
                return 'bg-gray-400';
        }
    };

    const getPasswordStrengthText = () => {
        switch (passwordStrength) {
            case 0:
            case 1:
                return 'Weak';
            case 2:
                return 'Fair';
            case 3:
                return 'Good';
            case 4:
                return 'Strong';
            default:
                return '';
        }
    };

    const getViewIcon = () => {
        switch (view) {
            case "signin":
                return <LogIn className="w-8 h-8 text-white"/>;
            case "signup":
                return <UserPlus className="w-8 h-8 text-white"/>;
            case "forgot":
                return <KeyRound className="w-8 h-8 text-white"/>;
            default:
                return <LogIn className="w-8 h-8 text-white"/>;
        }
    };

    const getViewTitle = () => {
        switch (view) {
            case "signin":
                return "Welcome Back";
            case "signup":
                return "Join Lotus Spa";
            case "forgot":
                return "Reset Password";
            default:
                return "Welcome";
        }
    };

    const getViewSubtitle = () => {
        switch (view) {
            case "signin":
                return "Sign in to your account";
            case "signup":
                return "Create your luxury account";
            case "forgot":
                return "Recover your account";
            default:
                return "";
        }
    };


    const normalizePhone = (phone) => {
        let cleaned = phone.replace(/\s+/g, '').replace(/-/g, '');

        if (cleaned.startsWith('00')) {
            cleaned = cleaned.slice(2);
        }

        if (cleaned.startsWith('0')) {
            cleaned = '+94' + cleaned.slice(1);
        } else if (cleaned.startsWith('94')) {
            cleaned = '+' + cleaned;
        }

        return cleaned;
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        // Custom toast styles
        const successToast = {
            icon: "✨",
            style: {
                borderRadius: "12px",
                background: "linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)",
                color: "#fff",
                boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
            },
            duration: 4000,
        };

        const errorToast = {
            icon: "⚠️",
            style: {
                borderRadius: "12px",
                background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
                color: "#fff",
                boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
            },
        };

        try {
            let res;
            if (view === "signup") {

                let phone = form.phone.trim();
                    phone = normalizePhone(phone);
                res = await axios.post("/api/auth/user/register", {
                    username: form.name,
                    email: form.email,
                    phone: phone,
                    password: form.password,
                });
            } else if (view === "signin") {
                let identifier = form.identifier.trim();
                    identifier = normalizePhone(identifier);
                res = await axios.post("/api/auth/user/login", {
                    identifier: identifier,
                    password: form.password,
                });
            } else if (view === "forgot") {
                res = await axios.post("/api/auth/user/forgot", {
                    identifier: form.identifier,
                });
                toast.success(res.data.message, successToast);
                setView("signin");
                return setLoading(false);
            }

            if (view === "signin" || view === "signup") {
                const {user, token, message} = res.data;
                login(user, token);
                toast.success(message, successToast);
                closeAuth();
            }

        } catch (err) {
            toast.error(err.response?.data?.message || "Something went wrong", errorToast);
        } finally {
            setLoading(false);
        }
    };

    const backdropClick = (e) => {
        if (e.target === e.currentTarget) {
            closeModal();
        }
    };

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
                onClick={backdropClick}
            >
                {/* Floating sparkles */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    {sparkles.map((_, i) => (
                        <div
                            key={i}
                            className="absolute w-1 h-1 bg-pink-300 rounded-full opacity-40 animate-twinkle"
                            style={{
                                left: `${Math.random() * 100}%`,
                                top: `${Math.random() * 100}%`,
                                animationDelay: `${Math.random() * 3}s`,
                                animationDuration: `${2 + Math.random() * 2}s`
                            }}
                        />
                    ))}
                </div>

                {/* Modal */}
                <div
                    className={`bg-white/5 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl w-full max-w-md overflow-hidden transition-all duration-500 transform ${
                        isVisible
                            ? 'opacity-100 scale-100 translate-y-0'
                            : 'opacity-0 scale-95 translate-y-8'
                    }`}
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Close Button */}
                    <button
                        onClick={closeModal}
                        className="absolute top-6 right-6 w-10 h-10 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full flex items-center justify-center text-white/70 hover:text-white hover:bg-white/20 transition-all duration-300 z-10"
                    >
                        <X className="w-5 h-5"/>
                    </button>

                    {/* Header */}
                    <div className="text-center p-5 pb-2">
                        {/* Icon */}
                        <div
                            className="w-16 h-16 bg-gradient-to-br from-pink-400 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg">
                            {getViewIcon()}
                        </div>

                        {/* Badge */}
                        <div
                            className="inline-flex items-center px-4 py-2 mb-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full">
                            <Heart className="w-4 h-4 text-pink-400 mr-2"/>
                            <span className="text-sm font-medium text-white/90 tracking-wide">LOTUS SALON</span>
                        </div>

                        {/* Title */}
                        <h1 className="text-2xl md:text-3xl font-black leading-tight mb-2">
                            <span
                                className="bg-gradient-to-r from-white via-pink-200 to-purple-200 bg-clip-text text-transparent drop-shadow-2xl">
                                {getViewTitle()}
                            </span>
                        </h1>

                        <p className="text-white/70 text-sm">
                            {getViewSubtitle()}
                        </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className=" p-6 pt-3 space-y-3">

                        {/* Sign Up Fields */}
                        {view === "signup" && (
                            <>
                                {/* Full Name */}
                                <div>
                                    <label className="block text-white/80 text-sm font-medium mb-2">Full Name *</label>
                                    <div className="relative">
                                        <div
                                            className={`absolute left-4 top-1/2 transform -translate-y-1/2 transition-colors duration-300 ${
                                                inputFocus.name ? 'text-pink-400' : 'text-white/50'
                                            }`}>
                                            <User className="w-5 h-5"/>
                                        </div>
                                        <input
                                            type="text"
                                            name="name"
                                            placeholder="Enter your full name"
                                            value={form.name}
                                            onChange={handleChange}
                                            onFocus={() => handleInputFocus('name', true)}
                                            onBlur={() => handleInputFocus('name', false)}
                                            disabled={loading}
                                            required
                                            className={`w-full pl-12 pr-4 py-3 bg-white/10 backdrop-blur-sm border rounded-xl text-white placeholder-white/50 focus:outline-none transition-all duration-300 ${
                                                inputFocus.name
                                                    ? 'border-pink-300/50 shadow-lg shadow-pink-500/25'
                                                    : 'border-white/20 hover:border-white/30'
                                            } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                        />
                                        {form.name && !loading && (
                                            <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                                                <CheckCircle className="w-4 h-4 text-green-400"/>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Email */}
                                <div>
                                    <label className="block text-white/80 text-sm font-medium mb-2">Email *</label>
                                    <div className="relative">
                                        <div
                                            className={`absolute left-4 top-1/2 transform -translate-y-1/2 transition-colors duration-300 ${
                                                inputFocus.email ? 'text-pink-400' : 'text-white/50'
                                            }`}>
                                            <Mail className="w-5 h-5"/>
                                        </div>
                                        <input
                                            type="email"
                                            name="email"
                                            placeholder="Enter your email"
                                            value={form.email}
                                            onChange={handleChange}
                                            onFocus={() => handleInputFocus('email', true)}
                                            onBlur={() => handleInputFocus('email', false)}
                                            disabled={loading}
                                            required
                                            className={`w-full pl-12 pr-4 py-3 bg-white/10 backdrop-blur-sm border rounded-xl text-white placeholder-white/50 focus:outline-none transition-all duration-300 ${
                                                inputFocus.email
                                                    ? 'border-pink-300/50 shadow-lg shadow-pink-500/25'
                                                    : 'border-white/20 hover:border-white/30'
                                            } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                        />
                                    </div>
                                </div>

                                {/* Phone */}
                                <div>
                                    <label className="block text-white/80 text-sm font-medium mb-2">Phone *</label>
                                    <div className="relative">
                                        <div
                                            className={`absolute left-4 top-1/2 transform -translate-y-1/2 transition-colors duration-300 ${
                                                inputFocus.phone ? 'text-pink-400' : 'text-white/50'
                                            }`}>
                                            <Phone className="w-5 h-5"/>
                                        </div>
                                        <input
                                            type="text"
                                            name="phone"
                                            placeholder="(555) 123-4567"
                                            value={form.phone}
                                            onChange={handleChange}
                                            onFocus={() => handleInputFocus('phone', true)}
                                            onBlur={() => handleInputFocus('phone', false)}
                                            disabled={loading}
                                            required
                                            className={`w-full pl-12 pr-4 py-3 bg-white/10 backdrop-blur-sm border rounded-xl text-white placeholder-white/50 focus:outline-none transition-all duration-300 ${
                                                inputFocus.phone
                                                    ? 'border-pink-300/50 shadow-lg shadow-pink-500/25'
                                                    : 'border-white/20 hover:border-white/30'
                                            } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                        />
                                    </div>
                                </div>

                                {/* Password */}
                                <div>
                                    <label className="block text-white/80 text-sm font-medium mb-2">Password *</label>
                                    <div className="relative">
                                        <div
                                            className={`absolute left-4 top-1/2 transform -translate-y-1/2 transition-colors duration-300 ${
                                                inputFocus.password ? 'text-pink-400' : 'text-white/50'
                                            }`}>
                                            <Lock className="w-5 h-5"/>
                                        </div>
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            name="password"
                                            placeholder="Create a strong password"
                                            value={form.password}
                                            onChange={handleChange}
                                            onFocus={() => handleInputFocus('password', true)}
                                            onBlur={() => handleInputFocus('password', false)}
                                            disabled={loading}
                                            required
                                            className={`w-full pl-12 pr-12 py-3 bg-white/10 backdrop-blur-sm border rounded-xl text-white placeholder-white/50 focus:outline-none transition-all duration-300 ${
                                                inputFocus.password
                                                    ? 'border-pink-300/50 shadow-lg shadow-pink-500/25'
                                                    : 'border-white/20 hover:border-white/30'
                                            } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-white transition-colors duration-300"
                                            disabled={loading}
                                        >
                                            {showPassword ? <EyeOff className="w-4 h-4"/> : <Eye className="w-4 h-4"/>}
                                        </button>
                                    </div>

                                    {/* Password Strength Indicator */}
                                    {form.password && (
                                        <div className="mt-2">
                                            <div className="flex justify-between text-xs mb-1">
                                                <span className="text-white/60">Password Strength:</span>
                                                <span className={`font-medium ${
                                                    passwordStrength <= 1 ? 'text-red-400' :
                                                        passwordStrength <= 2 ? 'text-yellow-400' :
                                                            passwordStrength <= 3 ? 'text-blue-400' : 'text-green-400'
                                                }`}>
                                                    {getPasswordStrengthText()}
                                                </span>
                                            </div>
                                            <div className="w-full bg-white/10 rounded-full h-2">
                                                <div
                                                    className={`h-2 rounded-full transition-all duration-300 ${getPasswordStrengthColor()}`}
                                                    style={{width: `${(passwordStrength / 4) * 100}%`}}
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </>
                        )}

                        {/* Sign In Fields */}
                        {view === "signin" && (
                            <>
                                {/* Email or Phone */}
                                <div>
                                    <label className="block text-white/80 text-sm font-medium mb-2">Email or
                                        Phone</label>
                                    <div className="relative">
                                        <div
                                            className={`absolute left-4 top-1/2 transform -translate-y-1/2 transition-colors duration-300 ${
                                                inputFocus.identifier ? 'text-pink-400' : 'text-white/50'
                                            }`}>
                                            <Mail className="w-5 h-5"/>
                                        </div>
                                        <input
                                            type="text"
                                            name="identifier"
                                            placeholder="Enter email or phone"
                                            value={form.identifier}
                                            onChange={handleChange}
                                            onFocus={() => handleInputFocus('identifier', true)}
                                            onBlur={() => handleInputFocus('identifier', false)}
                                            disabled={loading}
                                            required
                                            className={`w-full pl-12 pr-4 py-3 bg-white/10 backdrop-blur-sm border rounded-xl text-white placeholder-white/50 focus:outline-none transition-all duration-300 ${
                                                inputFocus.identifier
                                                    ? 'border-pink-300/50 shadow-lg shadow-pink-500/25'
                                                    : 'border-white/20 hover:border-white/30'
                                            } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                        />
                                    </div>
                                </div>

                                {/* Password */}
                                <div>
                                    <label className="block text-white/80 text-sm font-medium mb-2">Password</label>
                                    <div className="relative">
                                        <div
                                            className={`absolute left-4 top-1/2 transform -translate-y-1/2 transition-colors duration-300 ${
                                                inputFocus.password ? 'text-pink-400' : 'text-white/50'
                                            }`}>
                                            <Lock className="w-5 h-5"/>
                                        </div>
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            name="password"
                                            placeholder="Enter your password"
                                            value={form.password}
                                            onChange={handleChange}
                                            onFocus={() => handleInputFocus('password', true)}
                                            onBlur={() => handleInputFocus('password', false)}
                                            disabled={loading}
                                            required
                                            className={`w-full pl-12 pr-12 py-3 bg-white/10 backdrop-blur-sm border rounded-xl text-white placeholder-white/50 focus:outline-none transition-all duration-300 ${
                                                inputFocus.password
                                                    ? 'border-pink-300/50 shadow-lg shadow-pink-500/25'
                                                    : 'border-white/20 hover:border-white/30'
                                            } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-white transition-colors duration-300"
                                            disabled={loading}
                                        >
                                            {showPassword ? <EyeOff className="w-4 h-4"/> : <Eye className="w-4 h-4"/>}
                                        </button>
                                    </div>
                                </div>
                            </>
                        )}

                        {/* Forgot Password Fields */}
                        {view === "forgot" && (
                            <div>
                                <label className="block text-white/80 text-sm font-medium mb-2">Email or Phone</label>
                                <div className="relative">
                                    <div
                                        className={`absolute left-4 top-1/2 transform -translate-y-1/2 transition-colors duration-300 ${
                                            inputFocus.identifier ? 'text-pink-400' : 'text-white/50'
                                        }`}>
                                        <Mail className="w-5 h-5"/>
                                    </div>
                                    <input
                                        type="text"
                                        name="identifier"
                                        placeholder="Enter email or phone"
                                        value={form.identifier}
                                        onChange={handleChange}
                                        onFocus={() => handleInputFocus('identifier', true)}
                                        onBlur={() => handleInputFocus('identifier', false)}
                                        disabled={loading}
                                        required
                                        className={`w-full pl-12 pr-4 py-3 bg-white/10 backdrop-blur-sm border rounded-xl text-white placeholder-white/50 focus:outline-none transition-all duration-300 ${
                                            inputFocus.identifier
                                                ? 'border-pink-300/50 shadow-lg shadow-pink-500/25'
                                                : 'border-white/20 hover:border-white/30'
                                        } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    />
                                </div>
                                <p className="text-white/60 text-sm mt-2">
                                    We&#39;ll send you a reset link to recover your account
                                </p>
                            </div>
                        )}

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full py-4 rounded-xl font-bold text-white shadow-2xl transition-all duration-300 flex items-center justify-center space-x-2 mt-6 ${
                                loading
                                    ? "bg-white/10 cursor-not-allowed opacity-50"
                                    : "bg-gradient-to-r from-pink-500 to-purple-600 hover:shadow-pink-500/25 hover:scale-105"
                            }`}
                        >
                            {loading ? (
                                <>
                                    <div
                                        className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    <span>Processing...</span>
                                </>
                            ) : (
                                <>
                                    {view === "signin" && <LogIn className="w-5 h-5"/>}
                                    {view === "signup" && <UserPlus className="w-5 h-5"/>}
                                    {view === "forgot" && <KeyRound className="w-5 h-5"/>}
                                    <span>
                                        {view === "signin" ? "Sign In" :
                                            view === "signup" ? "Sign Up" :
                                                "Send Reset Link"}
                                    </span>
                                </>
                            )}
                        </button>
                    </form>

                    {/* Footer */}
                    <div className="px-8 py-1">
                        {/* Security Badge */}
                        <div
                            className="flex items-center justify-center space-x-2 mb-2 p-3 bg-white/5 rounded-xl border border-white/10">
                            <Shield className="w-4 h-4 text-green-400"/>
                            <span className="text-white/70 text-sm">Secure & Encrypted</span>
                        </div>

                        {/* View Switchers */}
                        <div className="text-center text-sm py-2">
                            {view === "signin" && (
                                <div className="space-y-3">
                                    <p className="text-white/70">
                                        Don&#39;t have an account?{" "}
                                        <button
                                            onClick={() => setView("signup")}
                                            className="text-pink-300 font-semibold hover:text-pink-200 transition-colors duration-300"
                                        >
                                            Sign Up
                                        </button>
                                    </p>
                                    <p>
                                        <button
                                            onClick={() => setView("forgot")}
                                            className="text-white/60 hover:text-white/80 transition-colors duration-300"
                                        >
                                            Forgot Password?
                                        </button>
                                    </p>
                                </div>
                            )}

                            {view === "signup" && (
                                <p className="text-white/70">
                                    Already have an account?{" "}
                                    <button
                                        onClick={() => setView("signin")}
                                        className="text-pink-300 font-semibold hover:text-pink-200 transition-colors duration-300"
                                    >
                                        Sign In
                                    </button>
                                </p>
                            )}

                            {view === "forgot" && (
                                <button
                                    onClick={() => setView("signin")}
                                    className="flex items-center justify-center space-x-2 text-white/70 hover:text-white/90 transition-colors duration-300 mx-auto"
                                >
                                    <ArrowLeft className="w-4 h-4"/>
                                    <span>Back to Sign In</span>
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

        </>
    );
};

export default Auth;