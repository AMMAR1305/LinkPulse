/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#00A88F',
          50: '#E6F7F4',
          100: '#CCF0EA',
          200: '#99E1D4',
          300: '#66D1BF',
          450: '#33C2AA',
          500: '#00A88F',
          600: '#00947E',
          700: '#007D6B',
          800: '#005C4F',
          900: '#003B33',
        },
        secondary: {
          DEFAULT: '#1A2F2B',
          500: '#1e293b',
        },
        accent: {
          DEFAULT: '#0EA5E9',
          500: '#0ea5e9',
        },
        background: '#FAF9F6',
        glass: '#FFFFFF',
        glassBorder: '#E4E3DF',
        success: { 500: '#10B981' },
        warning: { 500: '#F59E0B' },
        error: { 500: '#EF4444' },
      },
      backgroundImage: {
        'gradient-premium': 'linear-gradient(135deg, #00A88F 0%, #007D6B 100%)',
      },
      boxShadow: {
        'glass': '0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px -1px rgba(0, 0, 0, 0.05)',
        'glow': '0 4px 14px 0 rgba(0, 168, 143, 0.08)',
      },
      backdropBlur: {
        xl: '12px',
      },
      borderRadius: {
        xl: '1rem',
      },
    },
  },
  plugins: [],
};
