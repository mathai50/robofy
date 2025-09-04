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
  					success: '#00CC00',
  					warning: '#FF9900',
  					error: '#FF3333'
  				},
  				neutral: '#666666',
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
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
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")], // Add Tailwind plugins here if needed
  darkMode: ['class', 'class'], // Enable dark mode based on CSS class
}