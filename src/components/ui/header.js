"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { links } from "@/data/data";
import { Menu, X } from "lucide-react";
import { useAuth } from "@/context/contextAuth";
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

    // Scroll handler
    const handleScroll = useCallback(() => {
        setIsScrolled(window.scrollY > 10);
    }, []);

    // Close menus
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
                element.scrollIntoView({ behavior: "smooth", block: "start" });
                setActiveSection(id);
                const newUrl = id === "home" ? "/" : `/#${id}`;
                if (window.location.pathname + window.location.hash !== newUrl) {
                    window.history.replaceState(null, "", newUrl);
                }
            }
        },
        [pathname, router]
    );

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Track sections via IntersectionObserver
    useEffect(() => {
        if (pathname !== "/") return;

        const sections = links
            .filter((link) => link.href.startsWith("#"))
            .map((link) => document.querySelector(link.href))
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

    // Scroll event
    useEffect(() => {
        const handleDebouncedScroll = () => {
            window.requestAnimationFrame(handleScroll);
        };
        window.addEventListener("scroll", handleDebouncedScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleDebouncedScroll);
    }, [handleScroll]);

    // Body overflow control
    useEffect(() => {
        if (isMenuOpen) {
            document.body.style.overflow = "hidden";
            document.body.style.position = "fixed";
            document.body.style.width = "100%";
        } else {
            document.body.style.overflow = "";
            document.body.style.position = "";
            document.body.style.width = "";
        }
    }, [isMenuOpen]);

    // Close menu on route change
    useEffect(() => setIsMenuOpen(false), [pathname]);

    // Set active section from URL hash
    useEffect(() => {
        if (pathname === "/") {
            const hash = window.location.hash.replace("#", "");
            if (hash && links.some((link) => link.href === `#${hash}`)) setActiveSection(hash);
            else if (!hash) setActiveSection("home");
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
                        <span className="text-[10px] text-gray-200 font-light tracking-wider">LUXURY NAILS</span>
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
                                        ? "text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400 bg-white/20"
                                        : "text-gray-200 hover:text-pink-400 hover:bg-white/10"
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
                                    theme="px-6 py-2 rounded-xl font-semibold text-white bg-gradient-to-r from-pink-400 to-purple-400 hover:scale-105 transition-all duration-200 shadow-lg"
                                    label={user.username || user.name || "Account"}
                                    aria-expanded={dropdownOpen}
                                    aria-haspopup="true"
                                />
                                {dropdownOpen && (
                                    <div className="absolute right-0 mt-2 w-56 bg-white/95 backdrop-blur-lg shadow-2xl rounded-2xl py-2 z-50 border border-white/20 animate-in slide-in-from-top-2 duration-200">
                                        <Link
                                            href={user.role === "admin" ? "/admin" : "/booking"}
                                            className="block px-6 py-3 text-sm text-gray-700 hover:bg-pink-50 hover:text-pink-600 transition-colors duration-150 font-medium"
                                            onClick={closeMenus}
                                        >
                                            {user.role === "admin" ? "Admin Dashboard" : "My Bookings"}
                                        </Link>
                                        <hr className="border-gray-200 my-1" />
                                        <button
                                            onClick={logoutHandler}
                                            className="w-full text-left px-6 py-3 text-sm text-red-500 hover:bg-red-50 hover:text-red-600 transition-colors duration-150 font-medium"
                                        >
                                            Logout
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <Button
                                onClick={loginHandler}
                                theme="px-6 py-2 rounded-xl font-semibold text-white bg-gradient-to-r from-pink-400 to-purple-400 hover:scale-105 transition-all duration-200 shadow-lg"
                                label="Login"
                            />
                        )}
                    </div>

                    {/* Mobile Menu Toggle */}
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="lg:hidden p-2 rounded-xl text-pink-400 hover:bg-white/10 transition-colors duration-200 z-50"
                        aria-label="Toggle mobile menu"
                        aria-expanded={isMenuOpen}
                    >
                        {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>
            </header>

            {/* Mobile Menu Overlay */}
            {isMenuOpen && (
                <div
                    className="lg:hidden fixed inset-0 z-30 bg-black/50 backdrop-blur-sm"
                    onClick={closeMenus}
                    aria-hidden="true"
                />
            )}

            {/* Mobile Menu */}
            {/* Mobile Menu */}
            <div
                className={`lg:hidden fixed inset-y-0 right-0 z-40 w-72 sm:w-80 max-w-full bg-gradient-to-br from-purple-950/95 to-pink-950/95 backdrop-blur-xl shadow-2xl transition-transform duration-300 ease-out border-l border-white/20 
    ${isMenuOpen ? "translate-x-0" : "translate-x-full"}`}
            >
                <div className="flex flex-col h-full overflow-y-auto max-h-[100vh]">

                    {/* Top bar inside menu */}
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
                            className="p-2 rounded-lg text-pink-400 hover:bg-white/10 transition-colors duration-200"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    {/* Navigation Links */}
                    <nav className="flex-1 px-4 py-6 space-y-3">
                        {links.map((item, index) => {
                            const sectionId = item.href.replace("#", "");
                            const isActive = activeSection === sectionId;
                            return (
                                <button
                                    key={index}
                                    onClick={() => handleScrollTo(sectionId)}
                                    className={`w-full text-left px-3 py-2 rounded-lg transition-all duration-200 ${
                                        isActive
                                            ? "text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400 font-semibold bg-white/20"
                                            : "text-gray-200 hover:text-pink-400 hover:bg-white/10"
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
                                    <p className="text-sm text-white/60 capitalize">{user.role} Account</p>
                                </div>

                                <Link
                                    href={user.role === "admin" ? "/admin" : "/booking"}
                                    onClick={closeMenus}
                                    className="block w-full"
                                >
                                    <Button
                                        theme="w-full px-6 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-pink-400 to-purple-400 hover:scale-105 transition-transform duration-200"
                                        label={user.role === "admin" ? "Dashboard" : "My Bookings"}
                                    />
                                </Link>

                                <Button
                                    onClick={logoutHandler}
                                    theme="w-full px-6 py-3 rounded-xl font-semibold text-red-400 bg-transparent border-2 border-red-400 hover:bg-red-400 hover:text-white transition-all duration-200"
                                    label="Logout"
                                />
                            </>
                        ) : (
                            <Button
                                onClick={loginHandler}
                                theme="w-full px-6 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-pink-400 to-purple-400 hover:scale-105 transition-transform duration-200"
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