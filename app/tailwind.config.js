/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}"
  ],
  darkMode: 'class', // Enable class-based dark mode
  safelist: [
    'bg-primary-600',
    'bg-primary-700',
    'focus:ring-primary-500',
    'focus:border-primary-500',
    'dark:bg-gray-900',
    'dark:text-white'
  ],
  theme: {
    fontFamily: {
      sans: ['var(--font-inter)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      heading: ['var(--font-outfit)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
    },
    extend: {
      colors: {
        primary: {
          50: '#f0f7ff',
          100: '#e0eefe',
          200: '#bae0fd',
          300: '#7cc8fb',
          400: '#36aef5',
          500: '#0c96e6',
          600: '#0078c3',
          700: '#00619f',
          800: '#065283',
          900: '#0a456d',
          950: '#062c49',
        },
        accent: {
          50: '#f4f7ff',
          100: '#e9eeff',
          200: '#d3deff',
          300: '#aec3ff',
          400: '#819dff',
          500: '#5a75ff',
          600: '#3a4cf5',
          700: '#2c3ad9',
          800: '#2832b0',
          900: '#252e8a',
          950: '#171c4d',
        },
        background: 'rgb(var(--background-end-rgb))',
      },
      backgroundColor: {
        'background': 'rgb(var(--background-end-rgb))',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'fade-in-up': 'fadeInUp 0.7s ease-out forwards',
        'fade-in-down': 'fadeInDown 0.7s ease-out forwards',
        'fade-in-left': 'fadeInLeft 0.7s ease-out forwards',
        'fade-in-right': 'fadeInRight 0.7s ease-out forwards',
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 6s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shimmer': 'shimmer 2.5s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeInDown: {
          '0%': { opacity: '0', transform: 'translateY(-20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeInLeft: {
          '0%': { opacity: '0', transform: 'translateX(-20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        fadeInRight: {
          '0%': { opacity: '0', transform: 'translateX(20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            color: theme('colors.gray.900'),
            a: {
              color: theme('colors.primary.600'),
              '&:hover': {
                color: theme('colors.primary.800'),
              },
            },
            h1: {
              color: theme('colors.gray.900'),
              fontWeight: '700',
            },
            h2: {
              color: theme('colors.gray.900'),
              fontWeight: '600',
            },
            h3: {
              color: theme('colors.gray.900'),
              fontWeight: '600',
            },
            blockquote: {
              borderLeftColor: theme('colors.gray.200'),
            },
            'code::before': {
              content: '""',
            },
            'code::after': {
              content: '""',
            },
          },
        },
        dark: {
          css: {
            color: theme('colors.gray.100'),
            a: {
              color: theme('colors.primary.400'),
              '&:hover': {
                color: theme('colors.primary.300'),
              },
            },
            h1: {
              color: theme('colors.gray.100'),
            },
            h2: {
              color: theme('colors.gray.100'),
            },
            h3: {
              color: theme('colors.gray.100'),
            },
            blockquote: {
              borderLeftColor: theme('colors.gray.700'),
            },
          },
        },
      }),
      // Glass morphism utilities
      backdropFilter: {
        'none': 'none',
        'blur': 'blur(20px)',
      },
      // Border gradients
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'gradient-border': 'linear-gradient(to right, var(--tw-gradient-stops))',
      },
      // Custom box shadows for depth
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
        'glow': '0 0 15px rgba(56, 189, 248, 0.3)',
        'inner-glow': 'inset 0 0 15px rgba(56, 189, 248, 0.2)',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    // Add plugin for backdrop blur
    function({ addUtilities }) {
      const newUtilities = {
        '.backdrop-blur-sm': {
          backdropFilter: 'blur(4px)',
        },
        '.backdrop-blur': {
          backdropFilter: 'blur(8px)',
        },
        '.backdrop-blur-md': {
          backdropFilter: 'blur(12px)',
        },
        '.backdrop-blur-lg': {
          backdropFilter: 'blur(16px)',
        },
        '.backdrop-blur-xl': {
          backdropFilter: 'blur(24px)',
        },
        '.backdrop-blur-2xl': {
          backdropFilter: 'blur(40px)',
        },
        '.backdrop-blur-3xl': {
          backdropFilter: 'blur(64px)',
        },
      }
      addUtilities(newUtilities)
    },
    // Add plugin for glass morphism
    function({ addComponents }) {
      const components = {
        '.glass': {
          backgroundColor: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(16px)',
          borderRadius: '0.5rem',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        },
        '.glass-dark': {
          backgroundColor: 'rgba(17, 24, 39, 0.7)',
          backdropFilter: 'blur(16px)',
          borderRadius: '0.5rem',
          border: '1px solid rgba(255, 255, 255, 0.05)',
        },
        '.glass-card': {
          backgroundColor: 'rgba(255, 255, 255, 0.7)',
          backdropFilter: 'blur(16px)',
          borderRadius: '0.75rem',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
        },
        '.glass-card-dark': {
          backgroundColor: 'rgba(17, 24, 39, 0.7)',
          backdropFilter: 'blur(16px)',
          borderRadius: '0.75rem',
          border: '1px solid rgba(255, 255, 255, 0.05)',
          boxShadow: '0 4px 30px rgba(0, 0, 0, 0.3)',
        },
      }
      addComponents(components)
    },
  ],
}