/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0b1220",
        muted: "#64748b",
        brand: "#0ea5a4",
        brandDark: "#0b3b3a",
        accent: "#f59e0b",
        danger: "#b42318",
        success: "#14804a",
      },
      boxShadow: {
        card: "0 30px 60px rgba(15, 23, 42, 0.15)",
      },
      fontFamily: {
        display: ["Space Grotesk", "system-ui", "sans-serif"],
        body: ["Sora", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
