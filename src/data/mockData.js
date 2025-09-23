import { Sparkles, Crown, Star, Heart, Gift } from "lucide-react";

export const services = [
    {
        id: 'classic-manicure',
        name: 'Classic Manicure',
        duration: 45,
        price: 45,
        category: 'Manicure',
        description: 'Perfect nail shaping, cuticle care, and polish application',
        icon: Sparkles,
        color: 'from-pink-500 to-rose-500'
    },
    {
        id: 'gel-extensions',
        name: 'Gel Extensions',
        duration: 90,
        price: 85,
        category: 'Extensions',
        description: 'Long-lasting gel nail extensions with custom length',
        icon: Crown,
        color: 'from-purple-500 to-pink-500'
    },
    // ... other services
];

export const timeSlots = [
    '9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
    '12:00 PM', '12:30 PM', '1:00 PM', '1:30 PM', '2:00 PM', '2:30 PM',
    '3:00 PM', '3:30 PM', '4:00 PM', '4:30 PM', '5:00 PM', '5:30 PM'
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
    // ... other specialists
];