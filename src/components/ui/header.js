"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { links } from "@/data/data";
import { Menu, X } from "lucide-react";
import { useAuth } from "@/context/authContext";
import { useAuthModal } from "@/context/authModelContext";
import Button from "@/components/buttons/buttons";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";

const Header = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [activeSection, setActiveSection] = useState("home");

    const { user, logout } = useAuth();
    const { openAuth } = useAuthModal();
    const router = useRouter();
    const pathname = usePathname();
    const dropdownRef = useRef(null);

    // Scroll detection
    const handleScroll = useCallback(() => {
        setIsScrolled(window.scrollY > 10);
    }, []);

    const closeMenus = useCallback(() => {
        setIsMenuOpen(false);
        setDropdownOpen(false);
    }, []);

    const logoutHandler = useCallback(() => {
        logout();
        closeMenus();
        if (pathname !== "/") router.push("/");
    }, [logout, closeMenus, pathname, router]);

    const loginHandler = useCallback(() => {
        openAuth();
        setIsMenuOpen(false);
    }, [openAuth]);

    // Scroll to section (desktop + mobile)
    const handleScrollTo = useCallback(
        (id) => {
            if (pathname !== "/") {
                router.push(`/#${id}`);
                setIsMenuOpen(false);
                return;
            }

            const element = document.getElementById(id);
            if (element) {
                setIsMenuOpen(false);
                setTimeout(() => {
                    element.scrollIntoView({ behavior: "smooth", block: "start" });
                    setActiveSection(id);

                    const newUrl = id === "home" ? "/" : `/#${id}`;
                    if (window.location.pathname + window.location.hash !== newUrl) {
                        window.history.replaceState(null, "", newUrl);
                    }
                }, 200);
            }
        },
        [pathname, router]
    );

    // Click outside dropdown
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener("pointerdown", handleClickOutside);
        return () => document.removeEventListener("pointerdown", handleClickOutside);
    }, []);

    // Track active section with IntersectionObserver
    useEffect(() => {
        if (pathname !== "/") return;

        const sections = links
            .filter((link) => link.href.startsWith("#"))
            .map((link) => document.getElementById(link.href.replace("#", "")))
            .filter(Boolean);

        if (!sections.length) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const sectionId = entry.target.id;
                        setActiveSection((prev) => (prev !== sectionId ? sectionId : prev));
                        const newUrl = sectionId === "home" ? "/" : `/#${sectionId}`;
                        if (window.location.pathname + window.location.hash !== newUrl) {
                            window.history.replaceState(null, "", newUrl);
                        }
                    }
                });
            },
            { threshold: 0.4 }
        );

        sections.forEach((section) => observer.observe(section));
        return () => sections.forEach((section) => observer.unobserve(section));
    }, [pathname]);

    // Scroll listener for header style
    useEffect(() => {
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, [handleScroll]);

    // Lock body scroll when mobile menu open
    useEffect(() => {
        document.body.style.overflow = isMenuOpen ? "hidden" : "";
    }, [isMenuOpen]);

    // Reset menu on route change
    useEffect(() => setIsMenuOpen(false), [pathname]);

    // Scroll to hash on first load
    useEffect(() => {
        if (pathname === "/" && typeof window !== "undefined") {
            const hash = window.location.hash.replace("#", "");
            if (hash) {
                const element = document.getElementById(hash);
                if (element) {
                    setTimeout(() => {
                        element.scrollIntoView({ behavior: "smooth", block: "start" });
                    }, 200);
                    setActiveSection(hash);
                }
            } else {
                setActiveSection("home");
            }
        }
    }, [pathname]);

    return (
        <>
            <header
                className={`fixed w-full top-0 left-0 z-50 px-4 py-3 flex items-center justify-between transition-all duration-300 ${
                    isScrolled
                        ? "bg-white/10 backdrop-blur-xl border-b border-white/20 shadow-lg"
                        : "bg-transparent"
                }`}
            >
                {/* Logo */}
                <Link
                    href="/"
                    className="flex items-center space-x-2 z-10 hover:scale-105 transition-transform duration-200"
                    onClick={() => setActiveSection("home")}
                >
                    <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full blur opacity-70 animate-pulse"></div>
                        <div className="relative bg-white/20 backdrop-blur-sm rounded-full p-2 border border-white/30">
                            <Image
                                src="/images/lotus_logo.png"
                                alt="Lotus Logo"
                                width={32}
                                height={32}
                                className="w-8 h-8"
                                priority
                            />
                        </div>
                    </div>
                    <div className="flex flex-col leading-tight">
            <span className="text-lg font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
              Lotus Salon
            </span>
                        <span className="text-[10px] text-gray-200 font-light tracking-wider">
              LUXURY NAILS
            </span>
                    </div>
                </Link>

                {/* Desktop Nav */}
                <nav className="hidden lg:flex justify-center items-center space-x-4 bg-white/10 backdrop-blur-lg border border-white/20 rounded-full px-6 py-3 shadow-lg">
                    {links.map((item, index) => {
                        const sectionId = item.href.replace("#", "");
                        const isActive = activeSection === sectionId;
                        return (
                            <button
                                key={index}
                                onClick={() => handleScrollTo(sectionId)}
                                className={`text-md font-light transition-all duration-200 hover:scale-105 px-1 py-1 rounded-full ${
                                    isActive
                                        ? "text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400"
                                        : "text-gray-200 hover:text-pink-400"
                                }`}
                                aria-label={`Navigate to ${item.name}`}
                            >
                                {item.name}
                            </button>
                        );
                    })}
                </nav>

                {/* Right Side */}
                <div className="flex items-center space-x-4">
                    {/* Desktop Auth */}
                    <div className="hidden lg:block" ref={dropdownRef}>
                        {user ? (
                            <div className="relative">
                                <Button
                                    onClick={() => setDropdownOpen(!dropdownOpen)}
                                    theme="px-6 py-2 rounded-xl font-semibold text-white bg-gradient-to-r from-pink-400 to-purple-400 hover:scale-105 shadow-lg"
                                    label={user.username || user.name || "Account"}
                                    aria-expanded={dropdownOpen}
                                    aria-haspopup="true"
                                />
                                {dropdownOpen && (
                                    <div className="absolute right-0 mt-2 w-56 bg-purple-950/20 backdrop-blur-lg shadow-2xl rounded-2xl py-2 z-50 border border-purple-900/20 animate-in slide-in-from-top-2 duration-200">
                                        <Link
                                            href={user.role === "admin" ? "/admin" : "/appointment-details"}
                                            className="block px-6 py-3 text-sm text-gray-700 hover:bg-purple-900/30 hover:text-white font-medium"
                                            onClick={closeMenus}
                                        >
                                            {user.role === "admin" ? "Admin Dashboard" : "My Bookings"}
                                        </Link>
                                        <hr className="border-purple-900/20 my-1" />
                                        <button
                                            onClick={logoutHandler}
                                            className="w-full text-left px-6 py-3 text-sm text-red-900 hover:bg-purple-900/30 hover:text-red-400 font-medium"
                                        >
                                            Logout
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <Button
                                onClick={loginHandler}
                                theme="px-6 py-2 rounded-xl font-semibold text-white bg-gradient-to-r from-pink-400 to-purple-400 hover:scale-105 shadow-lg"
                                label="Login"
                            />
                        )}
                    </div>

                    {/* Mobile Menu Toggle */}
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="lg:hidden p-2 rounded-xl text-pink-400 hover:bg-white/10 z-50"
                        aria-label="Toggle mobile menu"
                        aria-expanded={isMenuOpen}
                    >
                        {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>
            </header>

            {/* Mobile Overlay */}
            {isMenuOpen && (
                <div
                    className="lg:hidden fixed inset-0 z-30 bg-black/50 backdrop-blur-sm"
                    onClick={closeMenus}
                    aria-hidden="true"
                />
            )}

            {/* Mobile Menu */}
            <div
                className={`lg:hidden fixed inset-y-0 right-0 z-40 w-72 sm:w-80 bg-gradient-to-br from-purple-950/95 to-pink-950/95 backdrop-blur-xl shadow-2xl transition-transform duration-300 border-l border-white/20 ${
                    isMenuOpen ? "translate-x-0" : "translate-x-full"
                }`}
            >
                <div className="flex flex-col h-full overflow-y-auto">
                    {/* Top bar */}
                    <div className="flex items-center justify-between px-4 py-4 border-b border-white/10">
                        <div className="flex items-center space-x-2">
                            <Image
                                src="/images/lotus_logo.png"
                                alt="Lotus Logo"
                                width={28}
                                height={28}
                                className="rounded-full"
                            />
                            <span className="text-lg font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
                Lotus Salon
              </span>
                        </div>
                        <button
                            onClick={closeMenus}
                            className="p-2 rounded-lg text-pink-400 hover:bg-white/10"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    {/* Nav Links */}
                    <nav className="flex-1 px-4 py-6 space-y-3">
                        {links.map((item, index) => {
                            const sectionId = item.href.replace("#", "");
                            const isActive = activeSection === sectionId;
                            return (
                                <button
                                    key={index}
                                    onClick={() => handleScrollTo(sectionId)}
                                    className={`w-full text-left px-3 py-2 rounded-lg transition-all ${
                                        isActive
                                            ? "text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400 font-semibold"
                                            : "text-gray-200 hover:text-pink-400"
                                    }`}
                                >
                                    {item.name}
                                </button>
                            );
                        })}
                    </nav>

                    {/* Auth Section */}
                    <div className="border-t border-white/20 px-4 py-6 space-y-4">
                        {user ? (
                            <>
                                <div className="text-center">
                                    <p className="text-lg text-white font-medium mb-1 truncate">
                                        Hi, {user.username || user.name}
                                    </p>
                                    <p className="text-sm text-white/60 capitalize">
                                        {user.role} Account
                                    </p>
                                </div>

                                <Link
                                    href={user.role === "admin" ? "/admin" : "/appointment-details"}
                                    onClick={closeMenus}
                                    className="block w-full"
                                >
                                    <Button
                                        theme="w-full px-6 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-pink-400 to-purple-400 hover:scale-105"
                                        label={user.role === "admin" ? "Dashboard" : "My Bookings"}
                                    />
                                </Link>

                                <Button
                                    onClick={logoutHandler}
                                    theme="w-full px-6 py-3 rounded-xl font-semibold text-red-400 border-2 border-red-400 hover:bg-red-400 hover:text-white"
                                    label="Logout"
                                />
                            </>
                        ) : (
                            <Button
                                onClick={loginHandler}
                                theme="w-full px-6 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-pink-400 to-purple-400 hover:scale-105"
                                label="Login / Sign Up"
                            />
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default Header;