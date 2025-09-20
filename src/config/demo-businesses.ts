// Centralized configuration for all demo businesses
// This follows the DRY principle and enables automated JSON-LD generation

export interface BusinessInfo {
  name: string;
  phone: string;
  email: string;
  address: string;
  hours: string;
  heroImage: string;
  heroSlogan: string;
  type: 'Dental' | 'Salon' | 'PetCare' | 'Spa' | 'RealEstate';
  schemaType: string;
  description: string;
  imageUrls?: {
    services: string[];
  };
}

export interface Service {
  title: string;
  description: string;
  icon?: string;
}

export interface Testimonial {
  name: string;
  review: string;
  rating: number;
  ratingIcon: string;
}

// Dental Business Configuration
export const dentalBusiness: BusinessInfo = {
  name: 'Pearly Whites Dental',
  phone: '(555) 123-4567',
  email: 'info@pearlywhitesdental.com',
  address: '123 Dental Ave, Smile City, ST 12345',
  hours: 'Mon - Fri: 9:00 AM - 5:00 PM',
  heroImage: 'https://images.unsplash.com/photo-1616391182219-e080b4d1043a?q=80&w=2766&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  heroSlogan: 'Modern Dentistry, Exceptional Care.',
  type: 'Dental',
  schemaType: 'Dentist',
  description: 'Experience a new standard of dental care with our state-of-the-art technology and patient-focused approach.'
};

export const dentalServices: Service[] = [
  {
    title: 'General Dentistry',
    description: 'Routine check-ups, cleanings, and fillings to maintain your oral health.'
  },
  {
    title: 'Cosmetic Dentistry',
    description: 'Transform your smile with teeth whitening, veneers, and smile makeovers.'
  },
  {
    title: 'Restorative Care',
    description: 'Advanced solutions like dental implants, crowns, and bridges.'
  }
];

export const dentalTestimonials: Testimonial[] = [
  {
    name: 'Sarah Johnson',
    review: 'Best dental experience ever! The staff was incredibly professional and caring.',
    rating: 5,
    ratingIcon: '★★★★★'
  },
  {
    name: 'Michael Chen',
    review: 'Dr. Reed is amazing! She made me feel completely at ease during my procedure.',
    rating: 5,
    ratingIcon: '★★★★★'
  },
  {
    name: 'Emily Rodriguez',
    review: 'The technology here is state-of-the-art. My smile has never looked better!',
    rating: 5,
    ratingIcon: '★★★★★'
  }
];

// Salon Business Configuration
export const salonBusiness: BusinessInfo = {
  name: 'Vintage Vibe Salon',
  phone: '555-987-6543',
  email: 'hello@vintagevibesalon.com',
  address: '456 Retro Avenue, City, State 12345',
  hours: 'Tue-Sat: 9AM-7PM, Sun: 10AM-4PM',
  heroImage: 'https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?q=80&w=2070&auto=format&fit=crop',
  heroSlogan: 'Experience Your Best Look with Our Expert Stylists',
  type: 'Salon',
  schemaType: 'HairSalon',
  description: 'Cutting-edge Haircuts, Vibrant Colors & Personalized Beauty Services'
};

export const salonServices: Service[] = [
  {
    title: 'Haircuts',
    description: 'Expert cuts for women, men, and kids with personalized styling advice.',
    icon: '✂️'
  },
  {
    title: 'Hair Coloring',
    description: 'Balayage, highlights, and vibrant color transformations with keratin treatments.',
    icon: '🎨'
  },
  {
    title: 'Styling',
    description: 'Wedding hair, blowouts, updos, and special occasion styling.',
    icon: '💇‍♀️'
  }
];

export const salonTestimonials: Testimonial[] = [
  {
    name: 'Jessica Taylor',
    review: 'Best color service I\'ve ever had! The balayage turned out perfectly and lasted months.',
    rating: 5,
    ratingIcon: '★★★★★'
  },
  {
    name: 'Marcus Rodriguez',
    review: 'The stylists really listen to what you want. Got the perfect cut that suits my face shape.',
    rating: 5,
    ratingIcon: '★★★★★'
  },
  {
    name: 'Sophia Chen',
    review: 'Love the retro vibe and the amazing service. My wedding hair was absolutely stunning!',
    rating: 5,
    ratingIcon: '★★★★★'
  }
];

// Pet Care Business Configuration
export const petCareBusiness: BusinessInfo = {
  name: 'Paws & Claws Pet Care',
  phone: '(555) 123-PAWS',
  email: 'care@pawsandclaws.com',
  address: '789 Pet Paradise Lane, Animal City, AC 12345',
  hours: 'Mon - Sat: 8:00 AM - 6:00 PM, Sun: 10:00 AM - 4:00 PM',
  heroImage: 'https://images.unsplash.com/photo-1581888227599-779811939961?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  heroSlogan: 'Compassionate Care for Your Furry Family Members',
  type: 'PetCare',
  schemaType: 'PetStore',
  description: 'Professional grooming, veterinary care, pet sitting, and training services for your beloved pets.'
};

export const petCareServices: Service[] = [
  {
    title: 'Pet Grooming',
    description: 'Bathing, haircuts, nail trimming, and ear cleaning for a fresh and healthy pet.',
    icon: '✂️'
  },
  {
    title: 'Veterinary Care',
    description: 'Vaccinations, checkups, emergency services, and health consultations.',
    icon: '🏥'
  },
  {
    title: 'Pet Sitting & Boarding',
    description: 'Safe and comfortable boarding with daily exercise and personalized attention.',
    icon: '🏠'
  },
  {
    title: 'Obedience Training',
    description: 'Professional training sessions for puppies and adult dogs of all breeds.',
    icon: '🎓'
  },
  {
    title: 'Nutrition Consulting',
    description: 'Personalized diet plans and nutritional advice for optimal pet health.',
    icon: '🍖'
  },
  {
    title: 'Pet Adoption Support',
    description: 'Guidance and resources for adopting and caring for rescue animals.',
    icon: '🐾'
  }
];

export const petCareTestimonials: Testimonial[] = [
  {
    name: 'Sarah Johnson',
    review: 'The grooming service is fantastic! My golden retriever always comes back happy and smelling great.',
    rating: 5,
    ratingIcon: '★★★★★'
  },
  {
    name: 'Michael Chen',
    review: 'Emergency vet service saved my cat\'s life. Professional and compassionate care 24/7.',
    rating: 5,
    ratingIcon: '★★★★★'
  },
  {
    name: 'Emily Rodriguez',
    review: 'The training classes transformed my rescue dog. Highly recommended for behavioral issues!',
    rating: 5,
    ratingIcon: '★★★★★'
  }
];


// Helper function to generate JSON-LD schema
export const generateBusinessSchema = (business: BusinessInfo, services: Service[], testimonials: Testimonial[]) => {
  return {
    '@context': 'https://schema.org',
    '@type': business.schemaType,
    name: business.name,
    telephone: business.phone,
    email: business.email,
    address: {
      '@type': 'PostalAddress',
      streetAddress: business.address.split(',')[0],
      addressLocality: business.address.split(',')[1]?.trim() || '',
      addressRegion: business.address.split(',')[2]?.trim() || '',
      postalCode: business.address.split(',')[3]?.trim() || ''
    },
    openingHours: business.hours,
    image: business.heroImage,
    description: business.description,
    makesOffer: services.map(service => ({
      '@type': 'Offer',
      itemOffered: {
        '@type': 'Service',
        name: service.title,
        description: service.description
      }
    })),
    review: testimonials.map(testimonial => ({
      '@type': 'Review',
      author: { '@type': 'Person', name: testimonial.name },
      reviewRating: { '@type': 'Rating', ratingValue: testimonial.rating },
      reviewBody: testimonial.review
    }))
  };
};

// Spa Business Configuration
export const spaBusiness: BusinessInfo = {
  name: 'Vintage Vibes Spa',
  phone: '555-123-4567',
  email: 'hello@vintagevibesspa.com',
  address: '789 Retro Lane, Serenity City, SC 12345',
  hours: 'Mo-Fr 09:00-20:00, Sa-Su 10:00-18:00',
  heroImage: 'https://images.unsplash.com/photo-1583416750470-965b2707b355?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  heroSlogan: 'Reawaken Your Senses with Our Vintage-Inspired Spa Experience',
  type: 'Spa',
  schemaType: 'HealthAndBeautyBusiness',
  description: 'Retro 70s inspired spa offering therapeutic massages, facials, and wellness treatments in a warm, vintage atmosphere.',
  imageUrls: {
    services: [
      'https://images.unsplash.com/photo-1598901986949-f593ff2a31a6?q=80&w=1794&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Therapeutic Massages
      'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Facials & Skincare
      'https://images.unsplash.com/photo-1675159364615-38e1f6b62282?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Foot & Reflexology
      'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Couples Packages
      'https://images.unsplash.com/photo-1591343395082-e120087004b4?q=80&w=1742&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Ayurvedic Treatments
      'https://images.unsplash.com/photo-1677682693087-711e24efaa69?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'  // Body Wraps & Scrubs
    ]
  }
};

export const spaServices: Service[] = [
  {
    title: 'Therapeutic Massages',
    description: 'Swedish, Deep Tissue, and Hot Stone massages to relieve tension and promote relaxation.',
    icon: '💆‍♀️'
  },
  {
    title: 'Facials & Skincare',
    description: 'Anti-Aging, Lumispa, and Silk Cocoon facials for radiant, rejuvenated skin.',
    icon: '✨'
  },
  {
    title: 'Foot & Reflexology',
    description: 'Specialized foot spa treatments and reflexology to balance your body\'s energy.',
    icon: '🦶'
  },
  {
    title: 'Couples Packages',
    description: 'Romantic couples massage packages in our private suite with champagne service.',
    icon: '👩‍❤️‍👨'
  },
  {
    title: 'Ayurvedic Treatments',
    description: 'Traditional Ayurvedic wellness treatments using natural herbs and oils.',
    icon: '🌿'
  },
  {
    title: 'Body Wraps & Scrubs',
    description: 'Detoxifying body wraps and exfoliating scrubs for silky smooth skin.',
    icon: '🧖‍♀️'
  }
];

// Real Estate Developer Configuration
export const realEstateBusiness: BusinessInfo = {
  name: 'Apex Luxury Developments',
  phone: '(555) 555-5555',
  email: 'contact@apexdevelopments.com',
  address: '100 Prestige Plaza, Metro City, ST 67890',
  hours: 'Mon - Fri: 9:00 AM - 6:00 PM',
  heroImage: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?q=80&w=2874&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  heroSlogan: 'Crafting Exceptional Spaces, Defining Luxury Living',
  type: 'RealEstate',
  schemaType: 'RealEstateAgent',
  description: 'Innovative Architecture | Strategic Locations | Timeless Design. We specialize in high-end residential and commercial properties, urban renewal, and sustainable building solutions.',
  imageUrls: {
    services: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Project 1
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2950&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Project 2
      'https://images.unsplash.com/photo-1568605114967-8130f3a36994?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Project 3
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'  // Project 4
    ]
  }
};

export const realEstateServices: Service[] = [
  {
    title: 'Residential & Commercial Developments',
    description: 'Crafting high-end properties that blend innovative architecture with strategic locations.'
  },
  {
    title: 'Urban Renewal Projects',
    description: 'Transforming urban landscapes into vibrant, sustainable communities for the future.'
  },
  {
    title: 'Sustainable Building Solutions',
    description: 'Integrating eco-friendly materials and green technologies for a smaller environmental footprint.'
  },
  {
    title: 'Custom Design Consultancy',
    description: 'A personalized, client-centric approach to bring your unique architectural visions to life.'
  },
  {
    title: 'Investment Advisory',
    description: 'Providing expert guidance and transparent partnership for real estate investment opportunities.'
  }
];

export const realEstateTestimonials: Testimonial[] = [
  {
    name: 'John & Jane Smith, Homeowners',
    review: 'Working with Apex was a seamless experience. Their commitment to quality and timeless design is evident in every detail of our new home.',
    rating: 5,
    ratingIcon: '★★★★★'
  },
  {
    name: 'Investor Group Inc.',
    review: 'Their strategic locations and innovative architecture have consistently delivered exceptional returns on our investments. A true partner in growth.',
    rating: 5,
    ratingIcon: '★★★★★'
  },
  {
    name: 'Eleanor Vance, Client',
    review: 'The custom design consultancy helped bring my vision to life, creating a space that is both luxurious and uniquely mine. Unparalleled craftsmanship.',
    rating: 5,
    ratingIcon: '★★★★★'
  }
];

export const spaTestimonials: Testimonial[] = [
  {
    name: 'Sarah Johnson',
    review: 'The hot stone massage was incredible! The retro ambiance made me feel like I traveled back in time to relax.',
    rating: 5,
    ratingIcon: '★★★★★'
  },
  {
    name: 'Michael & Lisa Chen',
    review: 'Our couples package was pure magic. The vintage champagne service and private suite made our anniversary special.',
    rating: 5,
    ratingIcon: '★★★★★'
  },
  {
    name: 'Dr. Emily Rodriguez',
    review: 'As a healthcare professional, I appreciate their attention to detail and authentic Ayurvedic treatments. Pure bliss!',
    rating: 5,
    ratingIcon: '★★★★★'
  }
];
