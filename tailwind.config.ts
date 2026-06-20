import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      boxShadow: {
        glow: '0 0 80px rgba(255, 255, 255, 0.15)',
        soft: '0 16px 80px rgba(0, 0, 0, 0.18)'
      },
      backgroundImage: {
        radialGlow: 'radial-gradient(circle at center, rgba(255,255,255,0.18), transparent 28%), radial-gradient(circle at top left, rgba(255, 160, 230, 0.2), transparent 30%), radial-gradient(circle at bottom right, rgba(120, 170, 255, 0.18), transparent 30%)'
      },
      colors: {
        surface: '#070B1F',
        accent: '#F9C74F',
        bloom: '#FFD9A8'
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' }
        }
      },
      animation: {
        float: 'float 4s ease-in-out infinite'
      }
    }
  },
  plugins: []
};

export default config;
