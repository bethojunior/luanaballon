import type { Config } from 'tailwindcss';

const c = (v: string) => `rgb(var(--${v}) / <alpha-value>)`;

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        pink: { DEFAULT: c('pink'), dark: c('pink-dark'), soft: c('pink-soft') },
        sun: { DEFAULT: c('sun'), soft: c('sun-soft') },
        aqua: { DEFAULT: c('aqua'), soft: c('aqua-soft') },
        grape: { DEFAULT: c('grape'), soft: c('grape-soft') },
        ink: c('ink'),
        cream: c('cream'),
      },
      fontFamily: {
        display: ['var(--display)', 'cursive'],
        body: ['var(--body)', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
