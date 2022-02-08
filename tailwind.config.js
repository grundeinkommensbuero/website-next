module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    fontSize: {
      // MOBILE
      'm-xs': '0.625rem', // For very small hints - use wisely
      'm-sm': '0.75rem', // For small hints / captions
      'm-base': '1rem', // Normal body text size
      'm-lg': '1.125rem', // For smaller headlines and teaser texts
      'm-xl': '1.25rem', // For big headlines
      'm-2xl': '1.5rem', // Use wisely
      // DESKTOP
      'd-xs': '0.75rem', // For very small hints - use wisely
      'd-sm': '1rem', // For small hints / captions
      'd-base': '1rem', // Normal body text size
      'd-lg': '1.25rem', // For smaller headlines and teaser texts
      'd-xl': '1.75rem', // For big headlines
      'd-2xl': '3.375rem', // For big headlines
      'd-3xl': '4.5rem', // HUGE, Use only in special cases
      // EXTRA
      xs: '.75rem',
      sm: '.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem',
      '5xl': '3rem',
      '6xl': '4rem',
    },
    backgroundColor: (theme) => ({
      ...theme('colors'),
      violet: '#7d69f6',
      aqua: '#46b4b4',
      red: '#ff4664',
    }),
    textColor: (theme) => ({
      ...theme('colors'),
      violet: '#7d69f6',
      aqua: '#46b4b4',
      red: '#ff4664',
    }),
    borderColor: (theme) => ({
      ...theme('colors'),
      violet: '#7d69f6',
      aqua: '#46b4b4',
      red: '#ff4664',
    }),
    extend: {
      spacing: {
        '5%': '5%',
        '10%': '10%',
        '20%': '20%',
        '50%': '50%',
        128: '32rem',
        160: '40rem',
        192: '48rem',
      },
    },
  },
  plugins: [],
};
