"use client"
import React, {useState, useEffect} from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
    MapPin,
    Phone,
    Mail,
    Clock,
    Heart,
    Star,
    Sparkles,
    ArrowUp,
    Send,
    Award,
    Users,
    Calendar
} from 'lucide-react';
import {links, businessHours, socialLinks, services} from "@/data/data";
import {useSparkles} from "@/hooks/useSparkles";

const Footer = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [email, setEmail] = useState('');
    const [showScrollTop, setShowScrollTop] = useState(false);
    const sparkle = useSparkles(15);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                }
            },
            {threshold: 0.2}
        );

        const handleScroll = () => {
            setShowScrollTop(window.scrollY > 500);
        };

        const footer = document.getElementById('footer');
        if (footer) observer.observe(footer);

        window.addEventListener('scroll', handleScroll);

        return () => {
            observer.disconnect();
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const scrollToTop = () => {
        window.scrollTo({top: 0, behavior: 'smooth'});
    };

    const handleNewsletterSubmit = (e) => {
        e.preventDefault();

        console.log('Newsletter subscription:', email);
        setEmail('');

    };


    return (
        <>
            <footer
                className="relative w-screen overflow-hidden"
                id="footer"
            >
                {/* Background */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-purple-950 to-slate-900">
                    {/* Animated sparkles */}
                    <div className="absolute inset-0 overflow-hidden">
                        {sparkle.map((s, i) => (
                            <div
                                key={i}
                                className="absolute w-1 h-1 bg-pink-300 rounded-full opacity-20 animate-twinkle"
                                style={{
                                    left: s.left,
                                    top: s.top,
                                    animationDelay: s.delay,
                                    animationDuration: s.duration,
                                }}
                            />
                        ))}
                    </div>

                    {/* Floating gradient orbs */}
                    <div
                        className="absolute -top-1/4 left-1/6 w-96 h-96 bg-gradient-to-br from-pink-500/5 to-purple-500/5 rounded-full blur-3xl"></div>
                    <div
                        className="absolute -bottom-1/4 right-1/6 w-80 h-80 bg-gradient-to-br from-purple-500/5 to-pink-500/5 rounded-full blur-3xl"></div>
                </div>

                <div className="relative z-10">
                    {/* Main Footer Content */}
                    <div className="max-w-7xl mx-auto px-6 pt-20 pb-12">
                        <div
                            className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 transition-all duration-1000 ${
                                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                            }`}>

                            {/* Brand Section */}
                            <div className="lg:col-span-1 space-y-6">
                                {/* Logo */}
                                <Link href="/" className="flex items-center space-x-3 group">
                                    <div className="relative">
                                        <div
                                            className="absolute inset-0 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full blur opacity-50 group-hover:opacity-75 transition-opacity duration-300"></div>
                                        <div
                                            className="relative bg-white/10 backdrop-blur-sm rounded-full p-3 border border-white/20">
                                            <Image
                                                src="/images/lotus_logo.png"
                                                alt="Lotus Logo"
                                                width={40}
                                                height={40}
                                                className="w-10 h-10"
                                            />
                                        </div>
                                    </div>
                                    <div className="flex flex-col">
                                        <span
                                            className="text-2xl font-bold bg-gradient-to-r from-white to-pink-200 bg-clip-text text-transparent">
                                            Lotus Salon
                                        </span>
                                        <span className="text-sm text-white/60 font-light tracking-wider">
                                            LUXURY NAIL ARTISTRY
                                        </span>
                                    </div>
                                </Link>

                                {/* Description */}
                                <p className="text-white/70 leading-relaxed">
                                    Where beauty meets artistry. Experience luxury nail care that transforms your nails
                                    into masterpieces of elegance and style.
                                </p>

                                {/* Awards */}
                                <div className="flex items-center space-x-4">
                                    <div
                                        className="flex items-center space-x-2 bg-white/5 backdrop-blur-sm rounded-full px-3 py-2 border border-white/10">
                                        <Award className="w-4 h-4 text-yellow-400"/>
                                        <span className="text-white/70 text-sm">Award Winner</span>
                                    </div>
                                    <div className="flex items-center space-x-1">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} className="w-4 h-4 text-yellow-400 fill-current"/>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/*  Links */}
                            <div className="space-y-6">
                                <h3 className="text-xl font-bold bg-gradient-to-r from-pink-300 to-purple-300 bg-clip-text text-transparent">
                                    links
                                </h3>
                                <div className="space-y-3">
                                    {links.map((link, index) => (
                                        <Link
                                            key={index}
                                            href={link.href}
                                            className="block text-white/70 hover:text-pink-300 transition-colors duration-300 hover:translate-x-2 transform"
                                        >
                                            {link.name}
                                        </Link>
                                    ))}
                                </div>

                                {/* Services */}
                                <div className="pt-4">
                                    <h4 className="text-lg font-semibold text-white mb-3">Our Services</h4>
                                    <div className="space-y-2">
                                        {services.slice(0, 4).map((service, index) => (
                                            <div key={index} className="text-white/60 text-sm">
                                                • {service.name}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Contact Info */}
                            <div className="space-y-6">
                                <h3 className="text-xl font-bold bg-gradient-to-r from-pink-300 to-purple-300 bg-clip-text text-transparent">
                                    Get in Touch
                                </h3>

                                <div className="space-y-4">
                                    <div className="flex items-start space-x-3 group">
                                        <div
                                            className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/20 group-hover:bg-pink-500/20 transition-colors duration-300">
                                            <MapPin className="w-5 h-5 text-pink-300"/>
                                        </div>
                                        <div>
                                            <p className="text-white font-medium">Visit Our Salon</p>
                                            <p className="text-white/70 text-sm">123 Beauty Lane, Salon District<br/>Luxury
                                                City, LC 12345</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center space-x-3 group">
                                        <div
                                            className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/20 group-hover:bg-pink-500/20 transition-colors duration-300">
                                            <Phone className="w-5 h-5 text-pink-300"/>
                                        </div>
                                        <div>
                                            <p className="text-white font-medium">(555) 123-NAILS</p>
                                            <p className="text-white/70 text-sm">Call for appointments</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center space-x-3 group">
                                        <div
                                            className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/20 group-hover:bg-pink-500/20 transition-colors duration-300">
                                            <Mail className="w-5 h-5 text-pink-300"/>
                                        </div>
                                        <div>
                                            <p className="text-white font-medium">hello@lotusspa.com</p>
                                            <p className="text-white/70 text-sm">We&#39;d love to hear from you</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Business Hours */}
                                <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                                    <h4 className="flex items-center text-white font-semibold mb-3">
                                        <Clock className="w-4 h-4 text-pink-300 mr-2"/>
                                        Business Hours
                                    </h4>
                                    <div className="space-y-2">
                                        {businessHours.map((schedule, index) => (
                                            <div key={index} className="flex justify-between text-sm">
                                                <span className="text-white/70">{schedule.day}</span>
                                                <span className="text-pink-300 font-medium">{schedule.hours}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Newsletter */}
                            <div className="space-y-6">
                                <h3 className="text-xl font-bold bg-gradient-to-r from-pink-300 to-purple-300 bg-clip-text text-transparent">
                                    Stay Connected
                                </h3>

                                {/* Newsletter Signup */}
                                <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                                    <h4 className="text-white font-semibold mb-3 flex items-center">
                                        <Sparkles className="w-4 h-4 text-pink-300 mr-2"/>
                                        Beauty Newsletter
                                    </h4>
                                    <p className="text-white/70 text-sm mb-4">
                                        Get exclusive tips, offers, and nail art inspiration delivered to your inbox.
                                    </p>

                                    <form onSubmit={handleNewsletterSubmit} className="space-y-3">
                                        <div className="relative">
                                            <input
                                                type="email"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                placeholder="Enter your email"
                                                className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-white placeholder-white/50 focus:outline-none focus:border-pink-300/50 transition-colors duration-300"
                                                required
                                            />
                                        </div>
                                        <button
                                            type="submit"
                                            className="w-full px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold rounded-full hover:scale-105 transition-transform duration-300 flex items-center justify-center space-x-2"
                                        >
                                            <Send className="w-4 h-4"/>
                                            <span>Subscribe</span>
                                        </button>
                                    </form>
                                </div>

                                {/* Social Media */}
                                <div>
                                    <h4 className="text-white font-semibold mb-4">Follow Our Journey</h4>
                                    <div className="grid grid-cols-2 gap-3">
                                        {socialLinks.map((social, index) => (
                                            <Link
                                                key={index}
                                                href={social.href}
                                                className="group flex items-center space-x-3 bg-white/5 backdrop-blur-sm rounded-lg p-3 border border-white/10 hover:bg-white/10 transition-all duration-300 hover:scale-105"
                                            >
                                                <social.icon className="w-5 h-5 text-pink-300"/>
                                                <div>
                                                    <p className="text-white text-sm font-medium">{social.label}</p>
                                                    <p className="text-white/60 text-xs">{social.followers}</p>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Bottom Bar */}
                    <div className="border-t border-white/10 bg-white/5 backdrop-blur-sm">
                        <div className="max-w-7xl mx-auto px-6 py-8">
                            <div
                                className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">

                                {/* Stats */}
                                <div className="flex items-center space-x-8">
                                    <div className="flex items-center space-x-2">
                                        <Users className="w-4 h-4 text-pink-300"/>
                                        <span className="text-white/70 text-sm">500+ Happy Clients</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Calendar className="w-4 h-4 text-pink-300"/>
                                        <span className="text-white/70 text-sm">1+ Years Experience</span>
                                    </div>
                                </div>

                                {/* Copyright */}
                                <div className="text-center">
                                    <p className="text-white/60 text-sm">
                                        © 2025 Lotus Salon. All rights reserved.<span className="mx-2">|</span>
                                        <span className="hover:text-pink-300 transition-colors">Privacy Policy</span>
                                        <span className="mx-2">|</span>
                                        <span className="hover:text-pink-300 transition-colors">Terms of Service</span>
                                    </p>
                                </div>

                                {/* Made with love */}
                                <div className="flex items-center space-x-2">
                                    <span className="text-white/60 text-sm">Made with</span>
                                    <Heart className="w-4 h-4 text-pink-400 fill-current animate-pulse"/>
                                    <span className="text-white/60 text-sm">for beautiful nails</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>

            {/* Scroll to Top Button */}
            {showScrollTop && (
                <button
                    onClick={scrollToTop}
                    className="fixed bottom-8 right-8 w-14 h-14 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-full shadow-2xl hover:shadow-pink-500/25 transition-all duration-300 hover:scale-110 z-40 flex items-center justify-center"
                >
                    <ArrowUp className="w-6 h-6"/>
                </button>
            )}

        </>
    );
};

export default Footer;
