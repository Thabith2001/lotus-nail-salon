"use client";

import React, { useRef, useEffect } from "react";
import {
    BookOpen,
    Clock,
    User,
    Heart,
    MessageCircle,
    Share2,
    Palette,
    Sparkles,
    Calendar,
    ArrowRight,
    ChevronRight,
    Eye,
    Bookmark,
    Search,
} from "lucide-react";
import { blogCategories, blogPosts } from "@/data/data";
import { useSparkles } from "@/hooks/useSparkles";
import {useGsap} from "@/hooks/useGsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import gsap from "gsap";

gsap.registerPlugin(ScrollTrigger);

const Blog = () => {
    const containerRef = useRef(null);
    const sparkles = useSparkles(25);

    const [selectedCategory, setSelectedCategory] = React.useState("all");
    const [featuredPost, setFeaturedPost] = React.useState(null);
    const [searchTerm, setSearchTerm] = React.useState("");

    useEffect(() => {
        const featured = blogPosts.find((post) => post.featured);
        if (featured) setFeaturedPost(featured);
    }, []);

    // Animate on scroll
    useGsap({
        ref: containerRef,
        animation: (gsap) => {
            const q = gsap.utils.selector(containerRef);

            gsap.fromTo(
                q(".fade-up"),
                { opacity: 0, y: 50 },
                {
                    opacity: 1,
                    y: 0,
                    stagger: 0.2,
                    duration: 1,
                    ease: "power4.out",
                    scrollTrigger: {
                        trigger: containerRef.current,
                        start: "top 80%",
                        toggleActions: "play none none reverse ",
                    },
                }
            );
        },
    });

    const filteredPosts = blogPosts.filter((post) => {
        const matchesCategory =
            selectedCategory === "all" || post.category === selectedCategory;
        const matchesSearch =
            post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
            post.tags.some((tag) =>
                tag.toLowerCase().includes(searchTerm.toLowerCase())
            );
        return matchesCategory && matchesSearch;
    });

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    return (
        <section
            id="blog"
            ref={containerRef}
            className="w-screen min-h-screen overflow-hidden relative py-20"
        >
            {/* Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-pink-900">
                <div className="absolute inset-0 overflow-hidden">
                    {sparkles.map((_, i) => (
                        <div
                            key={i}
                            className="absolute w-1 h-1 bg-pink-300 rounded-full opacity-30 animate-twinkle"
                            style={{
                                left: `${Math.random() * 100}%`,
                                top: `${Math.random() * 100}%`,
                                animationDelay: `${Math.random() * 3}s`,
                                animationDuration: `${2 + Math.random() * 2}s`,
                            }}
                        />
                    ))}
                </div>
                <div className="absolute top-1/4 right-1/6 w-96 h-96 bg-gradient-to-br from-pink-400/10 to-purple-400/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-1/3 left-1/6 w-80 h-80 bg-gradient-to-br from-purple-400/10 to-pink-400/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-6">
                {/* Header */}
                <div className="text-center mb-16 fade-up">
                    <div className="inline-flex items-center px-6 py-2 mb-8 bg-white/10 backdrop-blur-lg border border-white/20 rounded-full">
                        <BookOpen className="w-4 h-4 text-pink-400 mr-3" />
                        <span className="text-sm font-medium text-white/90 tracking-wide">
              BEAUTY INSIGHTS
            </span>
                    </div>
                    <h2 className="text-5xl md:text-7xl font-black leading-tight mb-8">
            <span className="block bg-gradient-to-r from-white via-pink-200 to-purple-200 bg-clip-text text-transparent drop-shadow-2xl">
              Beauty & Nail
            </span>
                        <span className="block bg-gradient-to-r from-pink-300 via-rose-200 to-white bg-clip-text text-transparent drop-shadow-2xl">
              Care Blog
            </span>
                    </h2>
                    <p className="text-xl font-extralight text-white/70 max-w-3xl mx-auto leading-relaxed">
                        Expert insights, tutorials, and trends from our master nail artists
                    </p>
                </div>

                {/* Search + Categories */}
                <div className="flex flex-col md:flex-row gap-4 mb-12 fade-up">
                    <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/50" />
                        <input
                            type="text"
                            placeholder="Search articles..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-white/10 backdrop-blur-lg border border-white/20 rounded-full text-white placeholder-white/50 focus:outline-none focus:border-pink-300/50 transition-colors duration-300"
                        />
                    </div>
                    <div className="flex flex-wrap gap-3">
                        {blogCategories.map((category) => (
                            <button
                                key={category.id}
                                onClick={() => setSelectedCategory(category.id)}
                                className={`flex items-center space-x-2 px-4 py-2 rounded-full font-medium transition-all duration-300 hover:scale-105 text-sm ${
                                    selectedCategory === category.id
                                        ? "bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg shadow-pink-500/25"
                                        : "bg-white/10 backdrop-blur-lg border border-white/20 text-white/80 hover:bg-white/20"
                                }`}
                            >
                                <category.icon className="w-4 h-4" />
                                <span>{category.name}</span>
                                <span className="text-xs opacity-75">({category.count})</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Featured */}
                {featuredPost && selectedCategory === "all" && !searchTerm && (
                    <div className="mb-16 fade-up">
                        {/* ... keep your featured article block ... */}
                    </div>
                )}

                {/* Blog Grid */}
                <div className="fade-up">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
                        {filteredPosts
                            .filter(
                                (post) =>
                                    !post.featured ||
                                    selectedCategory !== "all" ||
                                    searchTerm
                            )
                            .map((post) => (
                                <article
                                    key={post.id}
                                    className="group bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl overflow-hidden hover:scale-105 hover:shadow-2xl hover:shadow-pink-500/20 transition-all duration-500 cursor-pointer"
                                >
                                    {/* Article Image */}
                                    <div className="relative h-48 bg-gradient-to-br from-pink-200/20 to-purple-200/20 flex items-center justify-center overflow-hidden">
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                        <BookOpen className="w-12 h-12 text-white/30" />

                                        {/* Category Badge */}
                                        <div className="absolute top-4 left-4 px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-white text-xs font-medium">
                                            {blogCategories.find(cat => cat.id === post.category)?.name}
                                        </div>

                                        {/* Bookmark Icon */}
                                        <button className="absolute top-4 right-4 w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-pink-500/50">
                                            <Bookmark className="w-4 h-4" />
                                        </button>
                                    </div>

                                    {/* Article Content */}
                                    <div className="p-6">
                                        <div className="flex items-center space-x-4 text-white/60 text-sm mb-3">
                                            <div className="flex items-center space-x-1">
                                                <Calendar className="w-3 h-3" />
                                                <span>{formatDate(post.publishDate)}</span>
                                            </div>
                                            <div className="flex items-center space-x-1">
                                                <Clock className="w-3 h-3" />
                                                <span>{post.readTime} min</span>
                                            </div>
                                        </div>

                                        <h3 className="text-lg font-bold text-white mb-3 line-clamp-2 group-hover:text-pink-300 transition-colors duration-300">
                                            {post.title}
                                        </h3>

                                        <p className="text-white/70 text-sm leading-relaxed mb-4 line-clamp-3">
                                            {post.excerpt}
                                        </p>

                                        {/* Tags */}
                                        <div className="flex flex-wrap gap-2 mb-4">
                                            {post.tags.slice(0, 2).map((tag, tagIndex) => (
                                                <span key={tagIndex} className="px-2 py-1 bg-white/10 rounded-full text-white/60 text-xs">
                                                {tag}
                                            </span>
                                            ))}
                                        </div>

                                        {/* Article Footer */}
                                        <div className="flex items-center justify-between pt-4 border-t border-white/10">
                                            <div className="flex items-center space-x-4 text-white/60 text-sm">
                                                <div className="flex items-center space-x-1">
                                                    <Heart className="w-4 h-4" />
                                                    <span>{post.likes}</span>
                                                </div>
                                                <div className="flex items-center space-x-1">
                                                    <MessageCircle className="w-4 h-4" />
                                                    <span>{post.comments}</span>
                                                </div>
                                                <div className="flex items-center space-x-1">
                                                    <Eye className="w-4 h-4" />
                                                    <span>{post.views}</span>
                                                </div>
                                            </div>

                                            <button className="text-pink-300 hover:text-pink-200 transition-colors duration-300">
                                                <Share2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </article>
                            ))}
                    </div>

                    {/* Load More */}
                    <div className="text-center p-6 fade-up">
                        <button className="group px-10 py-4 bg-white/10 backdrop-blur-lg border border-white/20 text-white font-semibold rounded-full hover:bg-white/20 transition-all duration-300 hover:scale-105">
              <span className="flex items-center gap-2">
                Load More Articles
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
              </span>
                        </button>
                    </div>
                </div>

                {/* Newsletter */}
                <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-3xl p-8 md:p-12 text-center fade-up">
                    <Sparkles className="w-12 h-12 text-pink-400 mx-auto mb-6" />
                    <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
                        Never Miss a Beauty Tip
                    </h3>
                    <p className="text-white/70 mb-8 max-w-2xl mx-auto">
                        Subscribe to our newsletter and get the latest nail care tips,
                        trends, and exclusive tutorials delivered to your inbox.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                        <input
                            type="email"
                            placeholder="Enter your email"
                            className="flex-1 px-6 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-white placeholder-white/50 focus:outline-none focus:border-pink-300/50 transition-colors duration-300"
                        />
                        <button className="px-8 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold rounded-full hover:scale-105 transition-transform duration-300 whitespace-nowrap">
                            Subscribe
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Blog;