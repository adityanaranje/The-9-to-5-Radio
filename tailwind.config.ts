import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{js,ts,jsx,tsx,mdx}', './components/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      fontFamily: {
        serif: ['Georgia', 'Cambria', '"Times New Roman"', 'Times', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['"Space Mono"', 'monospace'],
      },
      colors: {
        ink: '#0a0a0b',
        paper: '#f5f0eb',
        amber: '#d48c2a',
        coral: '#e8774a',
        sage: '#5d7a5e',
        steel: '#3a4a5a',
        mist: '#eaebe9',
        cream: '#faf8f5',
        charcoal: '#18181b',
        warm: '#c4953a',
        deep: '#2a5a6e',
      },
    },
  },
  plugins: [],
};

export default config;
