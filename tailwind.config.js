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
      // Custom color palette based on UI/UX specifications
      colors: {
        primary: {
          background: {
            dark: '#000000',    // Dark mode background color
            light: '#FFFFFF',   // Light mode background color
          },
          accent: {
            1: '#007BFF',       // Primary accent color for buttons and key elements
            2: '#00FF00',       // Secondary accent color for highlights and actions
            3: '#00FFFF',       // Tertiary accent color for notifications and special elements
          },
          status: {
            success: '#00CC00', // Success states and positive feedback
            warning: '#FF9900', // Warning states and cautions
            error: '#FF3333',   // Error states and destructive actions
          },
          neutral: '#666666',   // Neutral color for text, borders, and secondary elements
        },
      },
      // Custom font families
      fontFamily: {
        sans: ['Inter', 'sans-serif'],      // Primary sans-serif font from UI/UX spec
        mono: ['Monospace', 'monospace'],   // Monospace font for code and technical elements
        'source-code-pro': ['Source Code Pro', 'monospace'], // Source Code Pro for CTA elements
      },
      // Custom spacing scale based on 8px increments
      spacing: {
        '1': '8px',   // 8px
        '2': '16px',  // 16px
        '3': '24px',  // 24px
        '4': '32px',  // 32px
        '5': '40px',  // 40px
        '6': '48px',  // 48px
        '7': '56px',  // 56px
        '8': '64px',  // 64px
        '9': '72px',  // 72px
        '10': '80px', // 80px
      },
      // Custom box shadows for futuristic glow effects
      boxShadow: {
        'glow': '0 0 20px rgba(0, 123, 255, 0.5)',        // Blue glow effect
        'glow-accent': '0 0 20px rgba(0, 255, 0, 0.5)',   // Green glow effect
      },
    },
  },
  plugins: [], // Add Tailwind plugins here if needed
  darkMode: 'class', // Enable dark mode based on CSS class
}