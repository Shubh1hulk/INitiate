module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          900: '#0a0a0a',
          800: '#1a1a1a',
          700: '#2a2a2a',
          600: '#3a3a3a',
        },
        neon: {
          cyan: '#00d9ff',
          purple: '#a64dff',
          pink: '#ff006e',
          green: '#00ff41',
        },
      },
      fontFamily: {
        sans: ['system-ui', 'sans-serif'],
      },
      boxShadow: {
        neon: '0 0 20px rgba(0, 217, 255, 0.3)',
        'neon-purple': '0 0 20px rgba(166, 77, 255, 0.3)',
      },
    },
  },
  plugins: [],
};
