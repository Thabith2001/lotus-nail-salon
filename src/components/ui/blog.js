"use client";

import React, { useRef, useEffect } from "react";
import {
    BookOpen,
    Search,
} from "lucide-react";
import { blogCategories, blogPosts } from "@/data/data";
import { useSparkles } from "@/hooks/useSparkles";
import { useGsap } from "@/hooks/useGsap";

const Blog = () => {
    const containerRef = useRef(null);
    const sparkles = useSparkles(25);

    const [selectedCategory, setSelectedCategory] = React.useState("all");
    const [featuredPost, setFeaturedPost] = React.useState(null);
    const [searchTerm, setSearchTerm] = React.useState("");

    useGsap(containerRef, ".fade-up");

    useEffect(() => {
        const featured = blogPosts.find((post) => post.featured);
        if (featured) setFeaturedPost(featured);
    }, []);

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
                    <h2 className="text-5xl md:text-8xl font-black leading-tight mb-8">
            <span className="block bg-gradient-to-r from-white via-pink-200 to-purple-200 bg-clip-text text-transparent">
              Beauty & Nail
            </span>
                        <span className="block bg-gradient-to-r from-pink-300 via-rose-200 to-white bg-clip-text text-transparent">
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
                            className="w-full pl-12 pr-4 py-3 bg-white/10 backdrop-blur-lg border border-white/20 rounded-full text-white placeholder-white/50 focus:outline-none focus:border-pink-300/50"
                        />
                    </div>
                    <div className="flex flex-wrap gap-3">
                        {blogCategories.map((category) => {
                            const Icon = category.icon;
                            return (
                                <button
                                    key={category.id}
                                    onClick={() => setSelectedCategory(category.id)}
                                    className={`flex items-center space-x-2 px-4 py-2 rounded-full font-medium text-sm ${
                                        selectedCategory === category.id
                                            ? "bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg"
                                            : "bg-white/10 border border-white/20 text-white/80 hover:bg-white/20"
                                    }`}
                                >
                                    <Icon className="w-4 h-4" />
                                    <span>{category.name}</span>
                                    <span className="text-xs opacity-75">
                    ({category.count})
                  </span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Blog Grid */}
                <div className="fade-up">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
                        {filteredPosts.map((post) => (
                            <article
                                key={post.id}
                                className="group bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl overflow-hidden hover:scale-105 hover:shadow-pink-500/20 transition-all cursor-pointer"
                            >
                                {/* Article Image */}
                                <div className="relative h-48 bg-gradient-to-br from-pink-200/20 to-purple-200/20 flex items-center justify-center">
                                    <BookOpen className="w-12 h-12 text-white/30" />
                                    <div className="absolute top-4 left-4 px-3 py-1 bg-white/20 rounded-full text-white text-xs">
                                        {
                                            blogCategories.find(
                                                (cat) => cat.id === post.category
                                            )?.name
                                        }
                                    </div>
                                </div>

                                {/* Article Content */}
                                <div className="p-6">
                                    <h3 className="text-lg font-bold text-white mb-3">
                                        {post.title}
                                    </h3>
                                    <p className="text-white/70 text-sm mb-4">
                                        {post.excerpt}
                                    </p>
                                    <div className="flex justify-between text-white/60 text-sm">
                                        <span>{formatDate(post.publishDate)}</span>
                                        <span>{post.readTime} min</span>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Blog;
