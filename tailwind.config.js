/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f5f5ff',
          100: '#ededff',
          200: '#dcdcff',
          300: '#b8b8ff',
          400: '#9191ff',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81',
        },
        secondary: {
          50: '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81',
        },
        background: '#f3f4f6',
      },
      boxShadow: {
        'mood': '0 4px 6px -1px rgba(99, 102, 241, 0.1), 0 2px 4px -1px rgba(99, 102, 241, 0.06)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
  safelist: [
    'bg-blue-100',
    'border-blue-300',
    'bg-yellow-100',
    'border-yellow-300',
    'bg-red-100',
    'border-red-300',
    'bg-green-50',
    'border-green-200',
    'bg-blue-50',
    'border-blue-200',
    'bg-purple-50',
    'border-purple-200',
    'bg-primary-50',
    'border-primary-500',
    'px-4', 'py-2', 'rounded-md', 'transition-all', 'duration-200', 'ease-in-out',
    'px-3', 'py-1', 'rounded-full',
    'px-6', 'py-3', 'rounded-lg'
  ]
}