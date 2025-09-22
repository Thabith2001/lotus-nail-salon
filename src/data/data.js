export const links = [
    {name: 'Home', href: '#home'},
    {name: 'About Us', href: '#about'},
    {name: 'Services', href: '#services'},
    {name: 'Gallery', href: '#gallery'},
    {name: 'Pricing', href: '#pricing'},
    {name: 'Contact', href: '#contact'},
    {name: 'Blog', href: '#blog'}
];

import {
    Award,
    BookOpen, Brush, Clock, Crown,
    Facebook, Gift,
    Heart,
    Instagram, Mail, MapPin,
    Palette, PhoneCall, Shield,
    Sparkles,
    TrendingUp,
    Twitter,
    User,
    Youtube
} from "lucide-react";


export const businessHours = [
    {day: 'Monday - Friday', hours: '9:00 AM - 8:00 PM', status: 'open'},
    {day: 'Saturday', hours: '9:00 AM - 7:00 PM', status: 'open'},
    {day: 'Sunday', hours: '10:00 AM - 6:00 PM', status: 'open'},
];

export const services = [
    'Manicure & Pedicure',
    'Nail Art Design',
    'Gel Extensions',
    'Acrylic Nails',
    'Nail Repair',
    'Spa Treatments'
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
    '9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
    '12:00 PM', '12:30 PM', '1:00 PM', '1:30 PM', '2:00 PM', '2:30 PM',
    '3:00 PM', '3:30 PM', '4:00 PM', '4:30 PM', '5:00 PM', '5:30 PM',
    '6:00 PM', '6:30 PM', '7:00 PM', '7:30 PM'
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
    {id: 'individual', name: 'Individual Services', icon: Brush},
    {id: 'packages', name: 'Salon Packages', icon: Gift},
    {id: 'membership', name: 'Memberships', icon: Crown}
];

export const individualServices = [
    {
        id: 1,
        subscription: 'individual',
        category: 'manicure',
        name: 'Classic Manicure',
        description: 'Traditional nail care with cuticle treatment and polish',
        price: 45,
        duration: 45,
        popularity: 'Popular',
        features: ['Cuticle Care', 'Nail Shaping', 'Hand Massage', 'Polish Application', 'Aftercare Kit'],
        recommended: false
    },
    {
        id: 2,
        subscription: 'individual',
        category: 'manicure',
        name: 'Gel Manicure',
        description: 'Long-lasting gel polish with UV curing',
        price: 65,
        duration: 60,
        popularity: 'Best Seller',
        features: ['Gel Polish', 'UV Curing', '2-3 Week Duration', 'Chip Resistant', 'High Gloss Finish'],
        recommended: true
    },
    {
        id: 3,
        subscription: 'individual',
        category: 'pedicure',
        name: 'Luxury Spa Pedicure',
        description: 'Complete foot care with exfoliation and massage',
        price: 75,
        duration: 75,
        popularity: 'Premium',
        features: ['Foot Soak', 'Callus Removal', 'Exfoliation', '15min Massage', 'Hot Towel Treatment'],
        recommended: false
    },
    {
        id: 4,
        subscription: 'individual',
        category: 'nail-art',
        name: 'Custom Nail Art',
        description: 'Hand-painted designs tailored to your style',
        price: 85,
        duration: 90,
        popularity: 'Artist Special',
        features: ['Custom Design', 'Hand Painted', 'Consultation', 'Photo Session', 'Touch-up Kit'],
        recommended: false
    },
    {
        id: 5,
        subscription: 'individual',
        category: 'extensions',
        name: 'Acrylic Extensions',
        description: 'Durable extensions for length and strength',
        price: 95,
        duration: 120,
        popularity: 'New',
        features: ['Custom Length', 'Shape Options', '3-4 Week Duration', 'Fill-ins Available', 'Strength Enhancement'],
        recommended: false
    },
    {
        id: 6,
        subscription: 'individual',
        category: 'extensions',
        name: 'Gel Extensions',
        description: 'Natural-looking lightweight extensions',
        price: 105,
        duration: 105,
        popularity: 'Premium',
        features: ['Natural Look', 'Lightweight', 'Flexible', 'Damage-free', 'Easy Removal'],
        recommended: true
    }
];

export const packages = [
    {
        id: 'basic',
        subscription: 'package',
        name: 'Essential Beauty',
        description: 'Perfect introduction to luxury nail care',
        price: 120,
        originalPrice: 140,
        savings: 20,
        duration: 120,
        popularity: 'Great Value',
        services: ['Classic Manicure', 'Express Pedicure', 'Hand Treatment'],
        features: ['Same-day bookingComponents', 'Complimentary refreshments', 'Aftercare products'],
        recommended: false,
        color: 'from-blue-500 to-cyan-500'
    },
    {
        id: 'premium',
        subscription: 'package',
        name: 'Luxury Spa Experience',
        description: 'Our most popular comprehensive package',
        price: 180,
        originalPrice: 220,
        savings: 40,
        duration: 180,
        popularity: 'Most Popular',
        services: ['Gel Manicure', 'Luxury Spa Pedicure', 'Mini Nail Art', 'Hand & Foot Massage'],
        features: ['Priority bookingComponents', 'Champagne service', 'Take-home kit', 'Photo session'],
        recommended: true,
        color: 'from-pink-500 to-purple-600'
    },
    {
        id: 'ultimate',
        subscription: 'package',
        name: 'Royal Treatment',
        description: 'The ultimate luxury nail experience',
        price: 280,
        originalPrice: 350,
        savings: 70,
        duration: 240,
        popularity: 'VIP Experience',
        services: ['Gel Extensions', 'Custom Nail Art', 'Full Spa Pedicure', 'Paraffin Treatment', 'Aromatherapy'],
        features: ['VIP suite', 'Personal nail artist', 'Luxury products', 'Complimentary valet'],
        recommended: false,
        color: 'from-yellow-500 to-orange-500'
    }
];

export const memberships = [
    {
        id: 'bronze',
        subscription: 'membership',
        name: 'Bronze Membership',
        description: 'Ideal for regular nail care enthusiasts',
        price: 89,
        originalPrice: 120,
        savings: 31,
        services: ['2 services per month'],
        features: [
            '2 gel manicures monthly',
            '10% off additional services',
            'Priority bookingComponents',
            'Member-only events',
            'Free nail consultations'
        ],
        benefits: ['Flexible scheduling', 'Carry-over unused services', 'Birthday bonus'],
        color: 'from-amber-600 to-orange-600',
        recommended: false
    },
    {
        id: 'silver',
        subscription: 'membership',
        name: 'Silver Membership',
        description: 'Perfect balance of luxury and value',
        price: 149,
        originalPrice: 200,
        savings: 51,
        services: ['3 services per month'],
        features: [
            '2 gel manicures monthly',
            '1 luxury pedicure monthly',
            '15% off additional services',
            'Express lane bookingComponents',
            'Complimentary upgrades'
        ],
        benefits: ['Guest privileges', 'Seasonal promotions', 'Premium aftercare'],
        color: 'from-slate-400 to-slate-600',
        recommended: true
    },
    {
        id: 'gold',
        subscription: 'membership',
        name: 'Gold Membership',
        description: 'Ultimate luxury nail care experience',
        price: 229,
        originalPrice: 320,
        savings: 91,
        services: ['4 services per month'],
        features: [
            'Unlimited basic services',
            '2 premium treatments monthly',
            '20% off all services',
            'VIP suite access',
            'Personal nail artist'
        ],
        benefits: ['Concierge service', 'Exclusive events', 'Premium gift boxes'],
        color: 'from-yellow-400 to-yellow-600',
        recommended: false
    }
];

export const getPopularityColor = (popularity) => {
    switch (popularity) {
        case 'Best Seller':
            return 'from-green-500 to-emerald-500';
        case 'Most Popular':
            return 'from-pink-500 to-rose-500';
        case 'Premium':
            return 'from-purple-500 to-indigo-500';
        case 'VIP Experience':
            return 'from-yellow-500 to-orange-500';
        case 'Great Value':
            return 'from-blue-500 to-cyan-500';
        case 'Artist Special':
            return 'from-teal-500 to-green-500';
        case 'Popular':
            return 'from-rose-500 to-pink-500';
        case 'New':
            return 'from-indigo-500 to-blue-500';
        default:
            return 'from-gray-500 to-slate-500';
    }
};

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


