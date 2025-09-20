/**
 * Tailwind CSS Configuration
 *
 * Custom Tailwind CSS configuration for Robofy website with design system based on UI/UX specifications.
 * Includes custom colors, spacing, fonts, and utilities for a consistent and modern look.
 *
 * @type {import('tailwindcss').Config}
 */
module.exports = {
  // Define the content paths for Tailwind to scan for class names
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
  	extend: {
  		colors: {
  			primary: {
  				600: '#2563eb',
  				700: '#1d4ed8',
  				background: {
  					dark: '#000000',
  					light: '#FFFFFF'
  				},
  				accent: {
  					'1': '#007BFF',
  					'2': '#00FF00',
  					'3': '#00FFFF'
  				},
  				status: {
  					success: '#059669',
  					warning: '#ea580c',
  					error: '#dc2626'
  				},
  				neutral: '#666666',
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			// Luxury real estate color palette
  			luxury: {
  				emerald: '#056D4F',
  				burgundy: '#800020',
  				gold: '#D4AF37',
  				cream: '#F5F1E9',
  				charcoal: '#2E2E2E'
  			},
  			blue: {
  				600: '#2563eb',
  				700: '#1d4ed8',
  			},
  			purple: {
  				500: '#8b5cf6',
  				600: '#7c3aed',
  			},
  			green: {
  				600: '#059669',
  				700: '#047857',
  			},
  			orange: {
  				600: '#ea580c',
  				700: '#c2410c',
  			},
  			red: {
  				600: '#dc2626',
  				700: '#b91c1c',
  			},
  			gray: {
  				100: '#f3f4f6',
  				200: '#e5e7eb',
  				300: '#d1d5db',
  				400: '#9ca3af',
  				500: '#6b7280',
  				600: '#4b5563',
  				700: '#374151',
  				800: '#1f2937',
  				900: '#111827',
  			},
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			}
  		},
  		fontFamily: {
  			sans: [
  				'Inter',
  				'sans-serif'
  			],
  			mono: [
  				'Monospace',
  				'monospace'
  			],
  			'source-code-pro': [
  				'Source Code Pro',
  				'monospace'
  			],
  			alegreya: [
  				'Alegreya',
  				'serif'
  			],
  			playfair: [
  				'Playfair Display',
  				'serif'
  			],
  			'source-sans': [
  				'Source Sans Pro',
  				'sans-serif'
  			],
  			montserrat: [
  				'Montserrat',
  				'sans-serif'
  			]
  		},
  		spacing: {
  			'1': '8px',
  			'2': '16px',
  			'3': '24px',
  			'4': '32px',
  			'5': '40px',
  			'6': '48px',
  			'7': '56px',
  			'8': '64px',
  			'9': '72px',
  			'10': '80px'
  		},
  		boxShadow: {
  			glow: '0 0 20px rgba(0, 123, 255, 0.5)',
  			'glow-accent': '0 0 20px rgba(0, 255, 0, 0.5)'
  		},
  		borderRadius: {
  		  lg: 'var(--radius)',
  		  md: 'calc(var(--radius) - 2px)',
  		  sm: 'calc(var(--radius) - 4px)'
  		},
  		animation: {
  		  'fade-in-up': 'fadeInUp 0.6s ease-out forwards'
  		},
  		keyframes: {
  		  fadeInUp: {
  		    '0%': {
  		      opacity: '0',
  		      transform: 'translateY(20px)'
  		    },
  		    '100%': {
  		      opacity: '1',
  		      transform: 'translateY(0)'
  		    }
  		  }
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")], // Add Tailwind plugins here if needed
  darkMode: ['class', 'class'], // Enable dark mode based on CSS class
}