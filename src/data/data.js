export const links = [
    {name: 'Home', href: '#home'},
    {name: 'About Us', href: '#about'},
    {name: 'Services', href: '#services'},
    {name: 'Gallery', href: '#gallery'},
    {name: 'Pricing', href: '#pricing'},
    {name: 'Blog', href: '#blog'},
    {name: 'Contact', href: '#contact'}

];

import {
    Activity, ArrowLeft,
    Award, BarChart3,
    BookOpen, Brush, Calendar, Clock, Crown,
    Facebook, Gift,
    Heart,
    Instagram, Mail, MapPin, Package,
    Palette, PhoneCall, Settings, Shield,
    Sparkles,
    TrendingUp,
    Twitter,
    User, Users,
    Youtube
} from "lucide-react";


export const businessHours = [
    {day: 'Monday - Friday', hours: '9:00 AM - 8:00 PM', status: 'open'},
    {day: 'Saturday', hours: '9:00 AM - 7:00 PM', status: 'open'},
    {day: 'Sunday', hours: '10:00 AM - 6:00 PM', status: 'open'},
];


export const socialLinks = [
    {icon: Instagram, href: '#', label: 'Instagram', followers: '12.5K'},
    {icon: Facebook, href: '#', label: 'Facebook', followers: '8.2K'},
    {icon: Twitter, href: '#', label: 'Twitter', followers: '5.1K'},
    {icon: Youtube, href: '#', label: 'YouTube', followers: '3.8K'}
];

export const galleryItems = [
    {id: 1, src: '/images/nail-art-1.jpg', category: 'nail-art', title: 'Floral Elegance', likes: 245},
    {id: 2, src: '/images/manicure-1.jpg', category: 'manicure', title: 'Classic French', likes: 189},
    {id: 3, src: '/images/nail-art-2.jpg', category: 'nail-art', title: 'Geometric Dreams', likes: 312},
    {id: 4, src: '/images/pedicure-1.jpg', category: 'pedicure', title: 'Relaxing Spa', likes: 156},
    {id: 5, src: '/images/nail-art-3.jpg', category: 'nail-art', title: 'Gradient Sunset', likes: 278},
    {id: 6, src: '/images/manicure-2.jpg', category: 'manicure', title: 'Natural Glow', likes: 203},
    {id: 7, src: '/images/nail-art-4.jpg', category: 'nail-art', title: 'Jeweled Beauty', likes: 367},
    {id: 8, src: '/images/pedicure-2.jpg', category: 'pedicure', title: 'Summer Vibes', likes: 234},
    {id: 9, src: '/images/nail-art-5.jpg', category: 'nail-art', title: 'Marble Magic', likes: 298},
];

export const categories = [
    {id: 'all', name: 'All Work', count: galleryItems.length},
    {id: 'nail-art', name: 'Nail Art', count: galleryItems.filter(item => item.category === 'nail-art').length},
    {id: 'manicure', name: 'Manicure', count: galleryItems.filter(item => item.category === 'manicure').length},
    {id: 'pedicure', name: 'Pedicure', count: galleryItems.filter(item => item.category === 'pedicure').length},
];

export const blogCategories = [
    {id: 'all', name: 'All Posts', icon: BookOpen, count: 24},
    {id: 'nail-art', name: 'Nail Art', icon: Palette, count: 8},
    {id: 'trends', name: 'Trends', icon: TrendingUp, count: 6},
    {id: 'tips', name: 'Care Tips', icon: Sparkles, count: 5},
    {id: 'tutorials', name: 'Tutorials', icon: User, count: 5}
];

export const blogPosts = [
    {
        id: 1,
        category: 'trends',
        title: 'Spring 2024 Nail Trends: What\'s Hot This Season',
        excerpt: 'Discover the most coveted nail trends that are taking the beauty world by storm this spring...',
        content: 'From pastel gradients to bold geometric patterns, spring 2024 brings a fresh perspective to nail art...',
        author: 'Sarah Martinez',
        authorRole: 'Senior Nail Artist',
        publishDate: '2024-03-15',
        readTime: 5,
        views: 1284,
        likes: 89,
        comments: 23,
        featured: true,
        tags: ['Spring', 'Trends', 'Colors', 'Inspiration'],
        image: '/images/blog/spring-trends-2024.jpg'
    },
    {
        id: 2,
        category: 'nail-art',
        title: 'Mastering the Perfect French Manicure: A Step-by-Step Guide',
        excerpt: 'Learn the secrets behind creating flawless French manicures that look professionally done...',
        content: 'The French manicure remains a timeless classic, but achieving that perfect white tip requires technique...',
        author: 'Emma Chen',
        authorRole: 'Master Technician',
        publishDate: '2024-03-12',
        readTime: 8,
        views: 2156,
        likes: 156,
        comments: 45,
        featured: false,
        tags: ['French Manicure', 'Tutorial', 'Classic', 'Technique'],
        image: '/images/blog/french-manicure-guide.jpg'
    },
    {
        id: 3,
        category: 'tips',
        title: 'How to Make Your Manicure Last Longer: Pro Tips',
        excerpt: 'Extend the life of your manicure with these professional tips and tricks from our expert team...',
        content: 'A beautiful manicure deserves to last. Here are the industry secrets we use to ensure longevity...',
        author: 'Lisa Rodriguez',
        authorRole: 'Spa Director',
        publishDate: '2024-03-10',
        readTime: 6,
        views: 1876,
        likes: 124,
        comments: 32,
        featured: false,
        tags: ['Care Tips', 'Longevity', 'Maintenance', 'Professional'],
        image: '/images/blog/manicure-longevity.jpg'
    },
    {
        id: 4,
        category: 'tutorials',
        title: 'DIY Nail Art: Creating Stunning Gradient Effects at Home',
        excerpt: 'Transform your nails with beautiful gradient effects using simple techniques and tools...',
        content: 'Gradient nails, also known as ombré nails, create a stunning visual effect that transitions...',
        author: 'Mia Thompson',
        authorRole: 'Creative Director',
        publishDate: '2024-03-08',
        readTime: 10,
        views: 3245,
        likes: 289,
        comments: 67,
        featured: false,
        tags: ['DIY', 'Gradient', 'Tutorial', 'Techniques'],
        image: '/images/blog/gradient-tutorial.jpg'
    },
    {
        id: 5,
        category: 'nail-art',
        title: 'Minimalist Nail Art: Less is More in 2024',
        excerpt: 'Explore the beauty of understated elegance with minimalist nail art designs...',
        content: 'Minimalist nail art proves that sometimes the most impactful designs are the simplest ones...',
        author: 'Zoe Williams',
        authorRole: 'Lead Artist',
        publishDate: '2024-03-05',
        readTime: 7,
        views: 1654,
        likes: 198,
        comments: 41,
        featured: false,
        tags: ['Minimalist', 'Modern', 'Elegant', 'Simple'],
        image: '/images/blog/minimalist-nails.jpg'
    },
    {
        id: 6,
        category: 'tips',
        title: 'Nail Health 101: Building Strong, Beautiful Nails',
        excerpt: 'Learn the fundamentals of nail health and how to maintain strong, healthy nails naturally...',
        content: 'Healthy nails are the foundation of any beautiful manicure. Understanding nail anatomy and care...',
        author: 'Dr. Rachel Kim',
        authorRole: 'Nail Health Expert',
        publishDate: '2024-03-03',
        readTime: 12,
        views: 2987,
        likes: 245,
        comments: 89,
        featured: false,
        tags: ['Health', 'Care', 'Natural', 'Foundation'],
        image: '/images/blog/nail-health.jpg'
    }
];

export const features = [
    {
        icon: Heart,
        title: "Passionate Artistry",
        description: "Every design is crafted with love and attention to detail"
    },
    {
        icon: Award,
        title: "Award-Winning Quality",
        description: "Recognized excellence in nail care and customer service"
    },
    {
        icon: Sparkles,
        title: "Luxury Experience",
        description: "Premium products and relaxing atmosphere for your comfort"
    }
];

export const timeSlots = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
    '15:00', '15:30', '16:00', '16:30', '17:00', '17:30'
];

export const contactMethods = [
    {
        id: 'phone',
        icon: PhoneCall,
        title: 'Call Us',
        description: 'Speak directly with our team',
        value: '(555) 123-NAILS',
        action: 'Call Now',
        primary: true
    },
    {
        id: 'email',
        icon: Mail,
        title: 'Email Us',
        description: 'Send us your questions',
        value: 'hello@lotusspa.com',
        action: 'Send Email',
        primary: false
    },
    {
        id: 'visit',
        icon: MapPin,
        title: 'Visit Us',
        description: 'Come to our luxury spa',
        value: '123 Beauty Lane, Spa District',
        action: 'Get Directions',
        primary: false
    }
];

export const pricing_categories = [
    {id: 'packages', name: 'Salon Packages', icon: Gift},
    {id: 'membership', name: 'Memberships', icon: Crown}
];


export const benefits = [
    {icon: Shield, text: "100% Satisfaction Guarantee"},
    {icon: Award, text: "Professional Certified Artists"},
    {icon: Heart, text: "Premium Quality Products"},
    {icon: Clock, text: "Flexible Scheduling"}
];

export const testimonials = [
    {
        name: "Sarah Johnson",
        rating: 5,
        text: "Absolutely amazing experience! The attention to detail is incredible.",
        service: "Gel Manicure"
    },
    {
        name: "Emma Davis",
        rating: 5,
        text: "Best nail salon in the city. Professional and luxurious.",
        service: "Spa Package"
    }
];
export const specialists = [
    {
        id: 'sarah',
        name: 'Sarah Chen',
        specialty: 'Nail Art Specialist',
        rating: 4.9,
        image: '👩‍🎨',
        experience: '8 years'
    },
    {
        id: 'maria',
        name: 'Maria Rodriguez',
        specialty: 'Extension Expert',
        rating: 4.8,
        image: '👩‍💼',
        experience: '6 years'
    },
    {
        id: 'emma',
        name: 'Emma Johnson',
        specialty: 'Luxury Treatments',
        rating: 4.9,
        image: '👩‍⚕️',
        experience: '10 years'
    }
];


export const menuItems = [
    {id: 'overview', label: 'Overview', icon: BarChart3},
    {id: 'bookings', label: 'Bookings', icon: Calendar},
    {id: 'customers', label: 'Customers', icon: Users},
    {id: 'services', label: 'Services', icon: Package},
    {id: 'analytics', label: 'Analytics', icon: Activity},
    {id: 'employees', label: 'Employees', icon: User},
];

