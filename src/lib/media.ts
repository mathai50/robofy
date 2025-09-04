/**
 * Media Library Helper
 * 
 * This module provides utilities for managing and accessing media assets
 * across the application. It handles image paths, fallbacks, and provides
 * a consistent interface for media management.
 */

/**
 * Interface for media asset configuration
 */
export interface MediaConfig {
  path: string;
  alt?: string;
  fallback?: string;
}

/**
 * Available media types in the application
 */
export const MediaTypes = {
  TESTIMONIALS: 'testimonials',
  CLIENTS: 'clients',
  BLOG: 'blog',
  CASE_STUDIES: 'case-studies',
} as const;

/**
 * Get the full path for a media asset
 * @param type - The media type (testimonials, clients, etc.)
 * @param filename - The filename of the asset
 * @returns The full path to the asset
 */
export function getMediaPath(type: keyof typeof MediaTypes, filename: string): string {
  return `/images/${MediaTypes[type]}/${filename}`;
}

/**
 * Get a testimonial photo path with fallback support
 * @param filename - The filename of the testimonial photo
 * @param useFallback - Whether to use a fallback if the image doesn't exist
 * @returns The photo path or fallback
 */
export function getTestimonialPhoto(filename: string, useFallback: boolean = true): string {
  const path = getMediaPath('TESTIMONIALS', filename);
  
  // In a real application, you might check if the file exists
  // For now, we'll assume the fallback is always available
  if (useFallback) {
    // You could implement a check here to see if the file exists
    // and return a fallback image if it doesn't
    return path;
  }
  
  return path;
}

/**
 * Generate initials-based avatar as fallback
 * @param name - The person's name
 * @returns Initials string (e.g., "JS" for Jessica Smith)
 */
export function getInitials(name: string): string {
  return name
    .split(' ')
    .map(part => part.charAt(0).toUpperCase())
    .join('')
    .slice(0, 2);
}

/**
 * Get a fallback avatar URL using DiceBear API
 * @param name - The person's name for initials
 * @returns URL to generated avatar
 */
export function getFallbackAvatar(name: string): string {
  const initials = getInitials(name);
  return `https://api.dicebear.com/8.x/initials/svg?seed=${initials}&backgroundColor=3b82f6&color=fff`;
}

/**
 * Media asset configuration for testimonials
 * This can be extended to include other media types
 */
export const testimonialMedia = {
  jessicaSmith: {
    path: getMediaPath('TESTIMONIALS', 'jessica-smith.jpg'),
    fallback: getFallbackAvatar('Jessica Smith'),
  },
  martinThompson: {
    path: getMediaPath('TESTIMONIALS', 'martin-thompson.jpg'),
    fallback: getFallbackAvatar('Martin Thompson'),
  },
  anitaRao: {
    path: getMediaPath('TESTIMONIALS', 'anita-rao.jpg'),
    fallback: getFallbackAvatar('Anita Rao'),
  },
  sandraPerez: {
    path: getMediaPath('TESTIMONIALS', 'david-perez.jpg'),
    fallback: getFallbackAvatar('Sandra Perez'),
  },
  lauraChen: {
    path: getMediaPath('TESTIMONIALS', 'laura-chen.jpg'),
    fallback: getFallbackAvatar('Laura Chen'),
  },
  rahulKapoor: {
    path: getMediaPath('TESTIMONIALS', 'rahul-kapoor.jpg'),
    fallback: getFallbackAvatar('Rahul Kapoor'),
  },
  emilyBrown: {
    path: getMediaPath('TESTIMONIALS', 'emily-brown.jpg'),
    fallback: getFallbackAvatar('Emily Brown'),
  },
  samuelTan: {
    path: getMediaPath('TESTIMONIALS', 'samuel-tan.jpg'),
    fallback: getFallbackAvatar('Samuel Tan'),
  },
  karenWu: {
    path: getMediaPath('TESTIMONIALS', 'karen-wu.jpg'),
    fallback: getFallbackAvatar('Karen Wu'),
  },
};