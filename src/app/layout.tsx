import React from 'react';
import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import '../styles/globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import { envConfig, isDevelopment } from '@/lib/env-config';

const inter = Inter({ subsets: ['latin'] });
const playfairDisplay = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair-display' });

export const metadata: Metadata = {
  metadataBase: new URL('https://robofy.uk'),
  title: 'Robofy AI Transformation for Small Medium Business',
  description: 'Transform your small and medium business with Robofy AI solutions. AI-powered business transformation - streamline operations, automate workflows, and drive growth with intelligent technology.',
  keywords: 'AI business transformation, small business automation, website building, SEO optimization, lead generation, marketing automation, AI chatbot, business growth',
  authors: [{ name: 'Robofy' }],
  openGraph: {
    title: 'Robofy AI Transformation for Small Medium Business',
    description: 'Transform your small and medium business with Robofy AI solutions. AI-powered business transformation - streamline operations, automate workflows, and drive growth with intelligent technology.',
    url: 'https://robofy.uk',
    siteName: 'Robofy',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Robofy AI Business Transformation Platform',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Robofy AI Transformation for Small Medium Business',
    description: 'Transform your small and medium business with Robofy AI solutions. AI-powered business transformation - streamline operations, automate workflows, and drive growth with intelligent technology.',
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
  const robofySchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Robofy AI Platform",
    "description": "AI-powered business transformation platform for small and medium businesses. Automate workflows, build websites, optimize SEO, and generate leads with intelligent technology.",
    "url": "https://robofy.uk",
    "applicationCategory": "BusinessApplication",
    "operatingSystem": "Web-based",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "featureList": [
      "AI Website Builder",
      "SEO Optimization",
      "Lead Generation",
      "Marketing Automation",
      "Business Intelligence",
      "Workflow Automation"
    ],
    "screenshot": "https://robofy.uk/og-image.jpg",
    "author": {
      "@type": "Organization",
      "name": "Robofy"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "reviewCount": "150"
    }
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(robofySchema),
          }}
        />
        {envConfig.chatwoot.enabled && (
          <script
            dangerouslySetInnerHTML={{
              __html: `(function(d,t) {
  var BASE_URL="${envConfig.chatwoot.baseUrl}";
  var g=d.createElement(t),s=d.getElementsByTagName(t)[0];
  g.src=BASE_URL+"/packs/js/sdk.js";
  g.defer = true;
  g.async = true;
  s.parentNode.insertBefore(g,s);
  g.onload=function(){
    window.chatwootSDK.run({
      websiteToken: '${envConfig.chatwoot.websiteToken}',
      baseUrl: BASE_URL
    })
    console.log('Chatwoot SDK loaded successfully from:', BASE_URL);
  }
  g.onerror=function(){
    console.warn('Chatwoot SDK failed to load from:', BASE_URL);
    console.warn('Make sure your Chatwoot instance is running and accessible from localhost');
    if (${isDevelopment}) {
      console.warn('For localhost development, you may need to use a different BASE_URL or disable CORS restrictions');
    }
  }
})(document,"script");`
            }}
          />
        )}
      </head>
      <body className={`${inter.className} ${playfairDisplay.variable}`} suppressHydrationWarning>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}