/**
 * @fileoverview TailwindCSS configuration for the Yard Renovator application
 * Includes custom colors for the application theme
 */

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary Color: Deep Green - Representing growth and nature
        primary: {
          50: '#e8f5e9',
          100: '#c8e6c9',
          200: '#a5d6a7',
          300: '#81c784',
          400: '#66bb6a',
          500: '#4caf50',
          600: '#43a047',
          700: '#388e3c',
          800: '#2d5f2d',
          900: '#1b5e20',
        },
        // Secondary Color: Earth Brown - Representing soil and foundation
        secondary: {
          50: '#efebe9',
          100: '#d7ccc8',
          200: '#bcaaa4',
          300: '#a1887f',
          400: '#8d6e63',
          500: '#795548',
          600: '#6d4c41',
          700: '#5d4037',
          800: '#4e342e',
          900: '#3e2723',
        },
        // Accent Colors
        accent: {
          // Light Green - For highlights and success states
          green: '#7CAA7C',
          // Sandy Beige - For backgrounds and neutral elements
          beige: '#D2B48C',
          // Terracotta - For calls-to-action and important elements
          terracotta: '#CD5C5C'
        }
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
} 