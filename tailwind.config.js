export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        sit: {
          navy: '#003366',
          gold: '#C89520',
          ink: '#122033',
          mist: '#F4F7FB'
        }
      },
      fontFamily: {
        sans: ['DM Sans', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['DM Serif Display', 'Georgia', 'serif']
      },
      boxShadow: {
        soft: '0 16px 40px rgba(0, 51, 102, 0.10)'
      }
    }
  },
  plugins: []
};
