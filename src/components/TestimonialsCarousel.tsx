'use client';

import React, { useState } from 'react';
import { testimonials } from '@/data/testimonials';
import { getFallbackAvatar } from '@/lib/media';

export default function TestimonialsCarousel() {
  const [imageErrors, setImageErrors] = useState<Record<number, boolean>>({});

  const handleImageError = (index: number) => {
    setImageErrors(prev => ({ ...prev, [index]: true }));
  };

  // Duplicate testimonials for seamless looping
  const duplicatedTestimonials = [...testimonials, ...testimonials];

  return (
    <div className="w-full py-8 overflow-hidden">
      <div className="relative">
        {/* Marquee container */}
        <div className="animate-marquee hover:animate-pause flex space-x-8">
          {duplicatedTestimonials.map((testimonial, index) => {
            const originalIndex = index % testimonials.length;
            const hasError = imageErrors[originalIndex];
            const imageSrc = hasError ? getFallbackAvatar(testimonial.name) : testimonial.photo;

            return (
              <div
                key={index}
                className="flex-shrink-0 w-80 bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-gray-700 hover:border-blue-400 transition-all duration-300 flex flex-col items-center text-center"
              >
                {/* Client Photo */}
                <div className="mb-6">
                  <img
                    src={imageSrc}
                    alt={testimonial.name}
                    width={150}
                    height={150}
                    className="rounded-full mx-auto"
                    onError={() => handleImageError(originalIndex)}
                  />
                </div>
                
                {/* Quote Text */}
                <blockquote className="text-gray-300 italic mb-6 leading-relaxed flex-1">
                  "{testimonial.quote}"
                </blockquote>
                
                {/* Name and Company */}
                <div className="mt-auto">
                  <h4 className="font-semibold text-white text-lg mb-1">
                    {testimonial.name}
                  </h4>
                  <p className="text-blue-400 text-sm">
                    {testimonial.company}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Marquee animation styles */}
      <style jsx>{`
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
        .hover\:animate-pause:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
}