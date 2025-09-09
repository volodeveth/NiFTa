/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // NiFTa Brand Colors
        brand: {
          primary: '#00D4FF', // Cyan
          secondary: '#8B5CF6', // Purple
          gradient: 'linear-gradient(135deg, #00D4FF 0%, #8B5CF6 100%)',
        },
        // Dark Theme (default)
        dark: {
          bg: '#0A0B14',
          surface: '#1A1B23',
          card: '#252730',
          border: '#3A3B47',
          text: {
            primary: '#FFFFFF',
            secondary: '#B4B6C7',
            muted: '#8B8D98',
          }
        },
        // Light Theme
        light: {
          bg: '#FFFFFF',
          surface: '#F8F9FA',
          card: '#FFFFFF',
          border: '#E5E7EB',
          text: {
            primary: '#1F2937',
            secondary: '#6B7280',
            muted: '#9CA3AF',
          }
        }
      },
      backgroundImage: {
        'gradient-brand': 'linear-gradient(135deg, #00D4FF 0%, #8B5CF6 100%)',
        'gradient-card': 'linear-gradient(135deg, #1A1B23 0%, #252730 100%)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'gradient': 'gradient 8s ease infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        gradient: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        }
      },
      backdropBlur: {
        xs: '2px',
      }
    },
  },
  plugins: [],
}