/**
 * PostCSS Configuration
 *
 * Configuration file for PostCSS, which is a tool for transforming CSS with JavaScript plugins.
 * This setup is required for Tailwind CSS and Autoprefixer to work properly with Next.js.
 *
 * @type {import('postcss').Config}
 */
module.exports = {
  plugins: {
    /**
     * Tailwind CSS plugin processes Tailwind directives and generates utility classes
     * based on the configuration in tailwind.config.js
     */
    tailwindcss: {},

    /**
     * Autoprefixer plugin automatically adds vendor prefixes to CSS rules
     * for better browser compatibility based on caniuse.com data
     */
    autoprefixer: {},
  },
}