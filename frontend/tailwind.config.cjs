module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        glass: '#f0f5f9',
        accent: '#2563eb',
        accentDark: '#1e40af'
      },
      fontFamily: {
        ui: ['Rubik', 'system-ui', 'sans-serif'],
        display: ['Space Grotesk', 'sans-serif']
      }
    }
  },
  plugins: [],
}
