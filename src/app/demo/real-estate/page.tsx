"use client";

import { motion } from 'framer-motion';
import Image from 'next/image';
import { realEstateBusiness, realEstateServices, realEstateTestimonials } from '@/config/demo-businesses';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.1,
    },
  },
};

const fadeInUp = {
  hidden: { y: 40, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.6,
    },
  },
};

export default function RealEstatePage() {
  const { name, heroImage, heroSlogan, description, imageUrls, phone, email, address } = realEstateBusiness;

  return (
    <div className="bg-soft-cream text-charcoal-gray font-sans">
      {/* --- Hero Section --- */}
      <section className="relative min-h-screen w-full flex items-center justify-start text-white pt-28">
        <Image
          src={heroImage}
          alt="Luxurious modern home exterior"
          fill
          style={{ objectFit: 'cover' }}
          quality={100}
          priority
          className="z-0"
        />
        <div className="absolute inset-0 bg-black/50 z-10" />
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="relative z-20 p-8 md:p-16 lg:p-24 max-w-4xl"
        >
          <motion.h1 variants={fadeInUp} className="font-serif text-5xl md:text-7xl lg:text-8xl font-bold leading-tight drop-shadow-lg">
            {heroSlogan}
          </motion.h1>
          <motion.p variants={fadeInUp} className="mt-4 text-lg md:text-xl max-w-2xl text-soft-cream/90 drop-shadow-md">
            {description.split('. We specialize')[0]}
          </motion.p>
          <motion.div variants={fadeInUp} className="mt-8 flex flex-col sm:flex-row gap-4">
            <Button size="lg" className="bg-gold text-charcoal-gray hover:bg-gold/90 font-bold text-base px-8 py-6">
              Explore Projects
            </Button>
            <Button size="lg" variant="outline" className="border-gold text-gold hover:bg-gold hover:text-charcoal-gray font-bold text-base px-8 py-6">
              Schedule a Consultation
            </Button>
          </motion.div>
        </motion.div>
      </section>

      {/* --- Featured Projects Showcase --- */}
      <section className="py-20 md:py-32 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
            variants={fadeInUp}
            className="text-center mb-16"
          >
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-charcoal-gray">Featured Projects</h2>
            <p className="mt-4 text-lg text-charcoal-gray/70 max-w-3xl mx-auto">A glimpse into our portfolio of architectural excellence and timeless design.</p>
          </motion.div>
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6"
          >
            {imageUrls?.services.map((src, index) => {
              const spans = [
                'md:col-span-7 md:row-span-2', // Large main image
                'md:col-span-5',             // Horizontal image
                'md:col-span-5',             // Horizontal image
                'md:col-span-12'             // Full-width banner image
              ];
              return (
                <motion.div
                  key={src}
                  variants={fadeInUp}
                  className={`relative h-64 md:h-96 overflow-hidden rounded-lg group ${spans[index % spans.length]}`}
                >
                  <Image
                    src={src}
                    alt={`Featured Project ${index + 1}`}
                    fill
                    style={{ objectFit: 'cover' }}
                    className="transform group-hover:scale-105 transition-transform duration-500 ease-in-out"
                  />
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors duration-300" />
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* --- Our Services & Expertise --- */}
      <section className="py-20 md:py-32 bg-soft-cream">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-24 items-center">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.5 }}
              variants={fadeInUp}
              className="lg:col-span-1"
            >
              <h2 className="font-serif text-4xl md:text-5xl font-bold text-charcoal-gray leading-tight">
                Our Expertise
              </h2>
              <div className="w-24 h-1 bg-gold mt-6 mb-8"></div>
              <p className="text-lg text-charcoal-gray/70">
                From visionary master plans to the finest details of construction, we deliver comprehensive solutions that redefine luxury development.
              </p>
            </motion.div>
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8"
            >
              {realEstateServices.map((service) => (
                <motion.div key={service.title} variants={fadeInUp} className="p-6 border-l-4 border-emerald-green bg-white/50 rounded-r-lg">
                  <h3 className="font-serif text-2xl font-semibold text-charcoal-gray">{service.title}</h3>
                  <p className="mt-3 text-base text-charcoal-gray/80">{service.description}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* --- Why Choose Us Section --- */}
      <section className="relative py-20 md:py-40 bg-charcoal-gray text-soft-cream">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1542324227-865a299819b3?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="Architectural detail"
            fill
            style={{ objectFit: 'cover' }}
            className="opacity-10"
          />
        </div>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
          variants={fadeInUp}
          className="container mx-auto px-4 relative z-10 text-center"
        >
          <h2 className="font-serif text-4xl md:text-5xl font-bold">
            The Apex Advantage
          </h2>
          <p className="mt-6 text-lg md:text-xl max-w-4xl mx-auto text-soft-cream/80">
            Our foundation is built on an <span className="text-gold">award-winning</span> track record, architectural innovation, and a deeply <span className="text-gold">client-centric</span> approach. We forge transparent and collaborative partnerships to ensure every project is not just built, but masterfully crafted.
          </p>
        </motion.div>
      </section>

      {/* --- Client Testimonials --- */}
      <section className="py-20 md:py-32 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
            variants={fadeInUp}
            className="text-center mb-16"
          >
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-charcoal-gray">Words of Trust</h2>
            <p className="mt-4 text-lg text-charcoal-gray/70">Hear from clients and partners who have experienced our commitment to excellence.</p>
          </motion.div>
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full max-w-5xl mx-auto"
          >
            <CarouselContent>
              {realEstateTestimonials.map((testimonial, index) => (
                <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                  <div className="p-1 h-full">
                    <Card className="h-full flex flex-col justify-between bg-white border-gray-200 shadow-lg">
                      <CardContent className="pt-6">
                        <p className="text-lg font-serif italic text-gray-800">"{testimonial.review}"</p>
                      </CardContent>
                      <CardHeader>
                        <h4 className="text-base font-sans font-bold text-emerald-green">{testimonial.name}</h4>
                        <span className="text-gold text-xl">{testimonial.ratingIcon}</span>
                      </CardHeader>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden md:flex bg-white text-black hover:bg-gray-100" />
            <CarouselNext className="hidden md:flex bg-white text-black hover:bg-gray-100" />
          </Carousel>
        </div>
      </section>

      {/* --- Meet The Team & News (Placeholder) --- */}
      <section className="py-20 md:py-24 bg-soft-cream">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeInUp}
          className="container mx-auto px-4 text-center"
        >
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-charcoal-gray">Visionaries & Insights</h2>
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto"
          >
            <motion.div variants={fadeInUp} className="text-left p-8 border-t-4 border-burgundy bg-white rounded-lg shadow-xl">
              <h3 className="font-serif text-3xl font-semibold">Meet The Team</h3>
              <p className="mt-4 text-charcoal-gray/80">Discover the architects, project managers, and executives whose passion and expertise drive our success. Their collective vision shapes the future of luxury living.</p>
              <Button variant="link" className="text-burgundy p-0 mt-4 font-bold">Learn More &rarr;</Button>
            </motion.div>
            <motion.div variants={fadeInUp} className="text-left p-8 border-t-4 border-burgundy bg-white rounded-lg shadow-xl">
              <h3 className="font-serif text-3xl font-semibold">News & Insights</h3>
              <p className="mt-4 text-charcoal-gray/80">Explore our thoughts on market trends, sustainable development, and architectural innovation. Stay informed on company updates and our latest achievements.</p>
              <Button variant="link" className="text-burgundy p-0 mt-4 font-bold">Read Our Journal &rarr;</Button>
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      {/* --- Contact & Consultation Section --- */}
      <footer className="bg-charcoal-gray text-soft-cream py-20 md:py-24">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={fadeInUp}
            >
              <h2 className="font-serif text-4xl font-bold">Begin Your Journey</h2>
              <p className="mt-4 text-soft-cream/70 max-w-lg">
                Connect with us to explore investment opportunities, discuss a project, or schedule a private consultation with our expert team.
              </p>
              <div className="mt-10 space-y-4 text-lg">
                <p><strong className="text-gold">Phone:</strong> {phone}</p>
                <p><strong className="text-gold">Email:</strong> {email}</p>
                <p><strong className="text-gold">Address:</strong> {address}</p>
              </div>
            </motion.div>
            <motion.form
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={fadeInUp}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="name" className="text-soft-cream/80">Full Name</Label>
                  <Input id="name" type="text" placeholder="John Doe" className="bg-charcoal-gray/50 border-soft-cream/20 mt-2" />
                </div>
                <div>
                  <Label htmlFor="email" className="text-soft-cream/80">Email Address</Label>
                  <Input id="email" type="email" placeholder="you@example.com" className="bg-charcoal-gray/50 border-soft-cream/20 mt-2" />
                </div>
              </div>
              <div>
                <Label htmlFor="inquiry" className="text-soft-cream/80">Inquiry Type</Label>
                <Input id="inquiry" type="text" placeholder="e.g., Investment, Custom Design" className="bg-charcoal-gray/50 border-soft-cream/20 mt-2" />
              </div>
              <div>
                <Label htmlFor="message" className="text-soft-cream/80">Message</Label>
                <Textarea id="message" placeholder="Tell us about your project or question..." className="bg-charcoal-gray/50 border-soft-cream/20 mt-2" />
              </div>
              <Button type="submit" size="lg" className="w-full bg-gold text-charcoal-gray hover:bg-gold/90 font-bold">
                Send Inquiry
              </Button>
            </motion.form>
          </div>
          <div className="text-center mt-20 border-t border-soft-cream/20 pt-8">
            <p className="text-soft-cream/60">&copy; {new Date().getFullYear()} {name}. All Rights Reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}


