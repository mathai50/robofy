import React from 'react';
import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import '../styles/globals.css';
import { ThemeProvider } from '@/components/theme-provider';

const inter = Inter({ subsets: ['latin'] });
const playfairDisplay = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair-display' });

export const metadata: Metadata = {
  title: 'Robofy AI Transformation for Small Medium Business',
  description: 'Transform your small and medium business with Robofy AI solutions. From yoga studio to AI-powered business transformation - streamline operations, automate workflows, and drive growth with intelligent technology.',
  keywords: 'yoga studio [City], Hatha yoga, Vinyasa yoga, mindfulness classes, meditation [City], wellness workshops, yoga near me',
  authors: [{ name: 'Serenity Yoga Studio' }],
  openGraph: {
    title: 'Robofy AI Transformation for Small Medium Business',
    description: 'Transform your small and medium business with Robofy AI solutions. From yoga studio to AI-powered business transformation - streamline operations, automate workflows, and drive growth with intelligent technology.',
    url: 'https://serenity-yoga.com',
    siteName: 'Serenity Yoga Studio',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Serenity Yoga Studio - Peaceful yoga practice',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Robofy AI Transformation for Small Medium Business',
    description: 'Transform your small and medium business with Robofy AI solutions. From yoga studio to AI-powered business transformation - streamline operations, automate workflows, and drive growth with intelligent technology.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const yogaStudioSchema = {
    "@context": "https://schema.org",
    "@type": "HealthAndBeautyBusiness",
    "name": "Serenity Yoga Studio",
    "description": "Yoga, wellness, and mindfulness in the heart of the city. Join our community for transformation and inner peace.",
    "url": "https://serenity-yoga.com",
    "telephone": "(555) 123-YOGA",
    "email": "hello@serenityyogastudio.com",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "123 Peaceful Street",
      "addressLocality": "Mindful City",
      "addressRegion": "MC",
      "postalCode": "12345",
      "addressCountry": "US"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 40.7128,
      "longitude": -74.0060
    },
    "openingHours": [
      "Mo-Fr 06:00-21:00",
      "Sa-Su 08:00-20:00"
    ],
    "priceRange": "$$",
    "image": "https://serenity-yoga.com/og-image.jpg",
    "sameAs": [
      "https://instagram.com/serenityyogastudio"
    ],
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Yoga Classes",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Hatha Yoga",
            "description": "Gentle Hatha for beginners to improve flexibility and find inner peace"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Vinyasa Flow",
            "description": "Dynamic flowing sequences that build strength and cardiovascular health"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Restorative Yoga",
            "description": "Deep relaxation with supported poses to release tension and stress"
          }
        }
      ]
    }
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(yogaStudioSchema),
          }}
        />
      </head>
      <body className={`${inter.className} ${playfairDisplay.variable}`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}