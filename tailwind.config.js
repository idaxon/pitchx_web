/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: "#F9F8F4",
        "intense-black": "#1A1A19",
        "royal-gold": "#F9BE08",
        "classic-yellow": "#EFD30B",
        "silver-feather": "#DFDFD9",
        card: "#FFFFFF",
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'Menlo', 'monospace'],
      },
      boxShadow: {
        'subtle': '0 1px 3px 0 rgba(26, 26, 25, 0.04), 0 1px 2px -1px rgba(26, 26, 25, 0.04)',
        'lift': '0 10px 25px -5px rgba(26, 26, 25, 0.06), 0 8px 10px -6px rgba(26, 26, 25, 0.04)',
      },
    },
  },
  plugins: [],
}
