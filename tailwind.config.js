module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    fontSize: {
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
