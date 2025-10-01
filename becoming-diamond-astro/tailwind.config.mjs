/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        primary: '#4fc3f7',
        secondary: '#1a1a2e',
        purple: {
          400: '#c084fc',
          600: '#9333ea',
          950: '#4a044e',
        }
      }
    }
  }
}
