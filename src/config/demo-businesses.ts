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
  type: 'Dental' | 'Salon' | 'PetCare' | 'Spa' | 'RealEstate' | 'ChildCare' | 'Garden' | 'TravelAgency';
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
  name: 'Serenity Springs Spa',
  phone: '(555) 123-RELAX',
  email: 'escape@serenityspringsspa.com',
  address: '789 Tranquility Lane, Peaceful Valley, PV 12345',
  hours: 'Tue - Sun: 9:00 AM - 8:00 PM',
  heroImage: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?q=80&w=1740&auto=format&fit=crop',
  heroSlogan: 'Reawaken Your Senses with Our Vintage-Inspired Spa Experience',
  type: 'Spa',
  schemaType: 'HealthAndBeautyBusiness',
  description: 'Experience luxury and relaxation with our vintage-inspired spa treatments that blend 70s elegance with modern wellness practices.',
  imageUrls: {
    services: [
      'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?q=80&w=1740&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=1740&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=1740&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1515377905703-c4788e51af15?q=80&w=1740&auto=format&fit=crop'
    ]
  }
};

export const spaServices: Service[] = [
  {
    title: 'Therapeutic Massages',
    description: 'Deep tissue, Swedish, and hot stone massages to melt away tension and restore balance.'
  },
  {
    title: 'Facials & Skin Care',
    description: 'Customized facials using organic ingredients for radiant, rejuvenated skin.'
  },
  {
    title: 'Foot & Reflexology',
    description: 'Specialized foot treatments that promote overall wellness through pressure points.'
  },
  {
    title: 'Couples Packages',
    description: 'Shared relaxation experiences in our private couples suite.'
  },
  {
    title: 'Ayurvedic Treatments',
    description: 'Ancient healing practices tailored to your unique constitution.'
  },
  {
    title: 'Body Wraps',
    description: 'Detoxifying and hydrating treatments for silky smooth skin.'
  },
  {
    title: 'Aromatherapy',
    description: 'Custom essential oil blends to elevate mood and promote relaxation.'
  }
];

export const spaTestimonials: Testimonial[] = [
   {
     name: 'Sarah Mitchell',
     review: 'The most authentic spa experience I\'ve ever had. The attention to detail and warm atmosphere transport you to another era.',
     rating: 5,
     ratingIcon: '★★★★★'
   },
   {
     name: 'James Wilson',
     review: 'I was skeptical about the no-icons approach, but the elegant typography and spacing create such a sophisticated, calming experience.',
     rating: 5,
     ratingIcon: '★★★★★'
   },
   {
     name: 'Eleanor Chen',
     review: 'The 70s aesthetic is executed with such taste and luxury. Every treatment feels like a journey back in time with modern comforts.',
     rating: 5,
     ratingIcon: '★★★★★'
   }
 ];

// 70s Retro Salon Business Configuration
export const retroSalonBusiness: BusinessInfo = {
  name: 'Retro Glamour Studio',
  phone: '(555) STYLE-UP',
  email: 'hello@retroglamourstudio.com',
  address: '456 Glamour Avenue, Style District, SD 12345',
  hours: 'Tue - Sat: 9:00 AM - 7:00 PM, Sun: 10:00 AM - 5:00 PM',
  heroImage: 'https://images.unsplash.com/photo-1744095407400-aa337918bbb1?q=80&w=1932&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  heroSlogan: 'Retro Glamour Meets Modern Artistry - Transform Your Look',
  type: 'Salon',
  schemaType: 'BeautySalon',
  description: 'Premier hair salon and beauty studio specializing in vintage-inspired styling, expert cuts, vibrant colors, and personalized beauty services in a beautifully curated 70s aesthetic environment.',
  imageUrls: {
    services: [
      'https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80&w=1974&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1605497788044-5a32c7078486?q=80&w=1974&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=1974&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=1974&auto=format&fit=crop'
    ]
  }
};

export const retroSalonServices: Service[] = [
  {
    title: 'Signature Haircuts',
    description: 'Expert cuts tailored to your face shape and lifestyle, from classic bobs to modern layers with personalized consultation.'
  },
  {
    title: 'Vibrant Color Services',
    description: 'Professional coloring techniques from subtle highlights to bold transformations using premium products.'
  },
  {
    title: 'Luxury Styling',
    description: 'Special occasion styling, bridal hair, and editorial looks for every event with trial runs included.'
  },
  {
    title: 'Hair Treatments',
    description: 'Deep conditioning, keratin treatments, and scalp therapies for healthy, beautiful hair.'
  },
  {
    title: 'Bridal Packages',
    description: 'Complete bridal party styling with rehearsal and wedding day services plus touch-up kits.'
  },
  {
    title: 'Men\'s Grooming',
    description: 'Classic cuts, beard styling, and modern grooming services for the modern gentleman.'
  }
];

export const retroSalonTestimonials: Testimonial[] = [
  {
    name: 'Sophia Martinez',
    review: 'Luna transformed my hair completely! The balayage is absolutely stunning and I\'ve never received so many compliments. The 70s vibe makes every visit special.',
    rating: 5,
    ratingIcon: '★★★★★'
  },
  {
    name: 'David Kim',
    review: 'Marco gave me the perfect cut for my wedding day. Professional, precise, and the hot towel treatment was incredible. The vintage atmosphere added such a cool touch.',
    rating: 5,
    ratingIcon: '★★★★★'
  },
  {
    name: 'Elena Rodriguez',
    review: 'Aria made me feel like a princess on my wedding day. The trial run and final styling were perfect. The attention to detail and retro elegance made it magical.',
    rating: 5,
    ratingIcon: '★★★★★'
  }
];

// Child Care Business Configuration
export const childCareBusiness: BusinessInfo = {
  name: 'Little Explorers Child Care',
  phone: '(555) 123-KIDS',
  email: 'hello@littleexplorers.com',
  address: '789 Sunshine Lane, Happy Valley, State 12345',
  hours: 'Mon-Fri: 6:30AM-6:30PM, Sat-Sun: Closed',
  heroImage: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?q=80&w=1772&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  heroSlogan: 'Nurturing Young Minds, Building Bright Futures',
  type: 'ChildCare',
  schemaType: 'ChildCare',
  description: 'Premium child care services for infants through school-age children with age-appropriate programs and family support services.'
};

export const childCareServices: Service[] = [
  {
    title: 'Infant Care',
    description: 'Gentle, nurturing care for babies 6 weeks to 12 months with individualized attention and sensory stimulation.',
    icon: '🍼'
  },
  {
    title: 'Toddler Programs',
    description: 'Active exploration and discovery for curious 1-2 year olds with motor skills development and social interaction.',
    icon: '👶'
  },
  {
    title: 'Preschool',
    description: 'Early learning through play and structured activities for 3-4 year olds with pre-literacy and math skills.',
    icon: '🧸'
  },
  {
    title: 'Pre-K',
    description: 'Kindergarten readiness for 4-5 year olds with letter recognition, phonics, and independence building.',
    icon: '🎨'
  },
  {
    title: 'School-Age Care',
    description: 'Before and after school programs with homework assistance and enrichment activities for 5-12 year olds.',
    icon: '📚'
  },
  {
    title: 'Family Support',
    description: 'Resources and support for families including parent education workshops and community partnerships.',
    icon: '👨‍👩‍👧‍👦'
  }
];

export const childCareTestimonials: Testimonial[] = [
   {
     name: 'Sarah Martinez',
     review: 'Little Explorers has been a second home for Emma. The teachers are so loving and patient, and I love getting daily updates about her activities!',
     rating: 5,
     ratingIcon: '★★★★★'
   },
   {
     name: 'Michael Chen',
     review: 'The Pre-K program prepared Alex so well for kindergarten. He learned so much and made wonderful friends. Couldn\'t ask for a better environment!',
     rating: 5,
     ratingIcon: '★★★★★'
   },
   {
     name: 'Jessica Williams',
     review: 'As a first-time mom, I was nervous about daycare. Little Explorers put all my worries at ease with their caring staff and excellent infant program.',
     rating: 5,
     ratingIcon: '★★★★★'
   }
];

// Garden Supplier Business Configuration
export const gardenSupplierBusiness: BusinessInfo = {
  name: 'Bloom & Grow Garden Supplies',
  phone: '(555) GARDEN-1',
  email: 'hello@bloomandgrow.com',
  address: '456 Garden Way, Green Valley, GV 12345',
  hours: 'Mon - Sat: 8:00 AM - 6:00 PM, Sun: 10:00 AM - 4:00 PM',
  heroImage: 'https://images.unsplash.com/photo-1718166166019-85ac4df18717?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  heroSlogan: 'Cultivate Your Perfect Garden Oasis',
  type: 'Garden',
  schemaType: 'GardenStore',
  description: 'Premium garden supplies, organic seeds, expert tools, and seasonal plants delivered to your doorstep. From beginner gardeners to landscape professionals, we provide everything you need to create and maintain your dream garden.',
  imageUrls: {
    services: [
      'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Garden overview
      'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Plants and flowers
      'https://images.unsplash.com/photo-1604762511511-9e1d6d8206d7?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Garden tools
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0'  // Garden supplies
    ]
  }
};

export const gardenSupplierServices: Service[] = [
  {
    title: 'Premium Plants & Seeds',
    description: 'Organic seeds, seedlings, flowering plants, shrubs, and trees selected for your local climate and soil conditions.',
    icon: '🌱'
  },
  {
    title: 'Garden Tools & Equipment',
    description: 'Professional-grade tools, ergonomic hand tools, watering systems, and garden machinery for every gardening need.',
    icon: '🛠️'
  },
  {
    title: 'Soil & Fertilizers',
    description: 'Premium organic soils, compost, natural fertilizers, and soil amendments to nourish your garden naturally.',
    icon: '🌍'
  },
  {
    title: 'Garden Décor & Furniture',
    description: 'Beautiful garden ornaments, outdoor furniture, lighting, and decorative elements to enhance your outdoor space.',
    icon: '🏡'
  },
  {
    title: 'Pest Control & Plant Care',
    description: 'Organic pest control solutions, plant protection products, and expert advice for maintaining healthy plants.',
    icon: '🛡️'
  },
  {
    title: 'Seasonal Garden Planning',
    description: 'Expert consultation on seasonal planting schedules, garden design, and landscape planning services.',
    icon: '📅'
  }
];

export const gardenSupplierTestimonials: Testimonial[] = [
  {
    name: 'Margaret Thompson',
    review: 'Bloom & Grow transformed my backyard into a stunning oasis. Their plant recommendations were perfect for our climate, and the quality is outstanding!',
    rating: 5,
    ratingIcon: '★★★★★'
  },
  {
    name: 'David Rodriguez',
    review: 'As a professional landscaper, I rely on Bloom & Grow for consistent quality and expert knowledge. Their organic selection is unmatched in the area.',
    rating: 5,
    ratingIcon: '★★★★★'
  },
  {
    name: 'Sarah Kim',
    review: 'Just started gardening this year and the staff at Bloom & Grow made it so easy! They took time to explain everything and my vegetable garden is thriving.',
    rating: 5,
    ratingIcon: '★★★★★'
  }
];


// Dental Business Configuration
export const dentalBusiness: BusinessInfo = {
  name: 'Radiant Roots Dental',
  phone: '(555) 123-DENTAL',
  email: 'smile@radiantrootsdental.com',
  address: '123 Smile Avenue, Healthy City, HC 12345',
  hours: 'Mon - Thu: 8:00 AM - 6:00 PM, Fri: 8:00 AM - 5:00 PM, Sat: 9:00 AM - 3:00 PM',
  heroImage: 'https://images.unsplash.com/photo-1631248055158-edec7a3c072b?q=80&w=1722&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  heroSlogan: 'Healthy Smiles, Happy Lives - Advanced Dental Care for Modern Families',
  type: 'Dental',
  schemaType: 'Dentist',
  description: 'Comprehensive dental care with cutting-edge technology and personalized treatment plans. From routine cleanings to advanced cosmetic procedures, we create beautiful, healthy smiles that last a lifetime.',
  imageUrls: {
    services: [
      'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Dental office
      'https://images.unsplash.com/photo-1606815014909-9ebe8cc48e87?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Dental treatment
      'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Dental technology
      'https://images.unsplash.com/photo-1559059963-2e19b6c70243?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'  // Patient comfort
    ]
  }
};

export const dentalServices: Service[] = [
  {
    title: 'General Dentistry',
    description: 'Comprehensive oral health examinations, cleanings, fillings, and preventive care to maintain optimal dental health.',
    icon: '🦷'
  },
  {
    title: 'Pediatric Dentistry',
    description: 'Specialized dental care for children including gentle cleanings, fluoride treatments, and early orthodontic guidance.',
    icon: '👶'
  },
  {
    title: 'Cosmetic Dentistry',
    description: 'Transform your smile with teeth whitening, veneers, bonding, and complete smile makeovers using advanced techniques.',
    icon: '✨'
  },
  {
    title: 'Surgical Dentistry',
    description: 'Wisdom teeth extractions, dental implants, bone grafting, and other oral surgery procedures with sedation options.',
    icon: '🔬'
  },
  {
    title: 'Emergency Dentistry',
    description: '24/7 emergency dental care for toothaches, broken teeth, lost fillings, and other urgent dental needs.',
    icon: '🚨'
  },
  {
    title: 'Orthodontic Treatment',
    description: 'Traditional braces, clear aligners, and other orthodontic solutions to straighten teeth and improve bite alignment.',
    icon: '📏'
  }
];

export const dentalTestimonials: Testimonial[] = [
   {
     name: 'Sarah Martinez',
     review: 'Dr. Sterling and her team are absolutely wonderful! They made my dental anxiety disappear with their gentle approach and modern techniques. My smile has never looked better!',
     rating: 5,
     ratingIcon: '★★★★★'
   },
   {
     name: 'Michael Chen',
     review: 'The emergency care I received was outstanding. They got me in immediately when I had a broken tooth and the entire process was painless. Highly recommend Radiant Roots!',
     rating: 5,
     ratingIcon: '★★★★★'
   },
   {
     name: 'Jennifer Walsh',
     review: 'My kids actually look forward to dentist appointments now! The pediatric care is fantastic - they make it fun while being thorough. Best dental experience ever.',
     rating: 5,
     ratingIcon: '★★★★★'
   }
];

// Property Developer Business Configuration
export const propertyDeveloperBusiness: BusinessInfo = {
  name: 'Aureum Properties',
  phone: '(555) LUXURY-HOME',
  email: 'info@aureumproperties.com',
  address: '888 Golden Gate Boulevard, Prestige Heights, PH 12345',
  hours: 'Mon - Fri: 9:00 AM - 6:00 PM, Sat: 10:00 AM - 4:00 PM',
  heroImage: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2075&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  heroSlogan: 'Architectural Excellence Meets Luxury Living',
  type: 'RealEstate',
  schemaType: 'RealEstateAgent',
  description: 'Award-winning property developer creating exceptional residential and commercial spaces that redefine luxury living. From innovative architectural designs to sustainable developments, we craft timeless properties that inspire and endure.',
  imageUrls: {
    services: [
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2075&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Luxury homes
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=2053&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Modern architecture
      'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Interior design
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'  // Property development
    ]
  }
};

export const propertyDeveloperServices: Service[] = [
  {
    title: 'Luxury Residential Development',
    description: 'Exclusive custom homes and high-end residential communities designed for discerning homeowners seeking unparalleled quality and sophistication.',
    icon: '🏘️'
  },
  {
    title: 'Commercial Property Development',
    description: 'Premium office spaces, retail centers, and mixed-use developments that combine functionality with architectural excellence.',
    icon: '🏢'
  },
  {
    title: 'Sustainable Building Solutions',
    description: 'Eco-friendly construction using cutting-edge green technologies and sustainable materials for environmentally conscious developments.',
    icon: '🌱'
  },
  {
    title: 'Architectural Design & Planning',
    description: 'Collaborative design process with world-renowned architects to create bespoke properties that reflect your vision and lifestyle.',
    icon: '✏️'
  },
  {
    title: 'Property Investment Advisory',
    description: 'Strategic investment guidance for high-net-worth individuals and institutional investors seeking premium property opportunities.',
    icon: '📈'
  },
  {
    title: 'Urban Renewal & Redevelopment',
    description: 'Transforming underutilized spaces into vibrant, modern communities that enhance the urban landscape and create lasting value.',
    icon: '🏙️'
  }
];

export const propertyDeveloperTestimonials: Testimonial[] = [
  {
    name: 'Isabella Rodriguez',
    review: 'Aureum Properties exceeded every expectation. Our custom home is a masterpiece of design and craftsmanship. The attention to detail is extraordinary.',
    rating: 5,
    ratingIcon: '★★★★★'
  },
  {
    name: 'Alexander Thompson',
    review: 'Investing with Aureum was the best decision for our portfolio. Their developments consistently outperform the market with exceptional ROI.',
    rating: 5,
    ratingIcon: '★★★★★'
  },
  {
    name: 'Catherine Park',
    review: 'The sustainable building practices and innovative design make Aureum Properties stand apart. Our office complex is both beautiful and environmentally responsible.',
    rating: 5,
    ratingIcon: '★★★★★'
  }
];

export const smartGlassServices: Service[] = [
  {
    title: 'Clear View Technology',
    description: 'Crystal clear vision with adaptive brightness that automatically adjusts to any lighting condition.',
    icon: '👁️'
  },
  {
    title: 'Fast Sync Connectivity',
    description: 'Lightning-fast connectivity and seamless integration with all your devices and applications.',
    icon: '⚡'
  },
  {
    title: 'Active Mode Intelligence',
    description: 'Advanced sensors track your activity and provide intelligent insights for productivity and wellness.',
    icon: '🎯'
  },
  {
    title: 'Smart Touch Controls',
    description: 'Intuitive gesture controls and voice commands for seamless interaction with your smart glass.',
    icon: '👆'
  }
];

export const smartGlassTestimonials: Testimonial[] = [
   {
     name: 'Sarah Chen',
     review: 'Changed the way I work and live. The clarity and intelligence are unmatched. Worth every penny!',
     rating: 5,
     ratingIcon: '★★★★★'
   },
   {
     name: 'Marcus Rodriguez',
     review: 'The adaptive brightness is incredible. Perfect for both indoor meetings and outdoor activities.',
     rating: 5,
     ratingIcon: '★★★★★'
   },
   {
     name: 'Jennifer Walsh',
     review: 'Seamless integration with all my devices. The AI features actually make me more productive.',
     rating: 5,
     ratingIcon: '★★★★★'
   }
 ];

// Travel Agency Business Configuration
export const travelAgencyBusiness: BusinessInfo = {
  name: 'Horizon Explorers',
  phone: '(555) 123-WANDER',
  email: 'journey@horizonexplorers.com',
  address: '888 Adventure Avenue, Wanderlust City, WC 12345',
  hours: 'Mon-Fri: 9AM-8PM, Sat-Sun: 10AM-6PM',
  heroImage: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?q=80&w=2070&auto=format&fit=crop',
  heroSlogan: 'Where Dreams Meet Destinations - Curated Luxury Travel Experiences',
  type: 'TravelAgency',
  schemaType: 'TravelAgency',
  description: 'Luxury travel experiences with personalized service and exclusive access to the world\'s most extraordinary destinations.',
};

export const travelAgencyServices: Service[] = [
  {
    title: 'Luxury Travel Planning',
    description: 'Personalized travel itineraries crafted by expert advisors for seamless luxury experiences.'
  },
  {
    title: 'Destination Management',
    description: 'Exclusive access to premium destinations with VIP treatment and private experiences.'
  },
  {
    title: 'Custom Itineraries',
    description: 'Bespoke travel plans designed around your specific interests, preferences, and schedule.'
  },
  {
    title: 'VIP Travel Services',
    description: 'Premium concierge services, private jets, luxury accommodations, and exclusive experiences.'
  },
  {
    title: 'Adventure Tourism',
    description: 'Curated adventure experiences with expert guides and safety-first approach.'
  },
  {
    title: 'Cultural Experiences',
    description: 'Deep cultural immersion programs connecting you with local traditions and communities.'
  }
];

export const travelAgencyTestimonials: Testimonial[] = [
  {
    name: 'Isabella Santos',
    review: 'Horizon Explorers created the most magical honeymoon experience. Every detail was perfect, from the private villa in Bali to the sunset yacht cruise.',
    rating: 5,
    ratingIcon: '★★★★★'
  },
  {
    name: 'Marcus Thompson',
    review: 'The African safari organized by Horizon Explorers exceeded all expectations. The luxury lodges and wildlife encounters were absolutely breathtaking.',
    rating: 5,
    ratingIcon: '★★★★★'
  },
  {
    name: 'Elena Rodriguez',
    review: 'As a frequent traveler, I\'ve worked with many agencies, but Horizon Explorers stands apart. Their attention to detail and personal touch is unmatched.',
    rating: 5,
    ratingIcon: '★★★★★'
  }
];

