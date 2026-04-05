import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Italmarket palette: editorial, premium, Italian heritage
        ivory: {
          50: "#FDFBF6",
          100: "#FAF6EC",
          200: "#F3ECD7",
          300: "#E9DEB9",
        },
        bosco: {
          // deep Italian forest green
          50: "#EEF3EF",
          100: "#D6E2D8",
          500: "#2E5B3E",
          600: "#234930",
          700: "#1A3724",
          800: "#122818",
          900: "#0B1A10",
        },
        rosso: {
          // Italian red accent
          500: "#B8312B",
          600: "#9B2520",
        },
        oro: {
          // warm gold
          400: "#C9A24B",
          500: "#B08836",
        },
        ink: "#0E0E0C",
      },
      fontFamily: {
        serif: ["var(--font-serif)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      letterSpacing: {
        "extra-wide": "0.22em",
      },
      container: {
        center: true,
        padding: {
          DEFAULT: "1rem",
          sm: "1.5rem",
          lg: "2rem",
        },
        screens: {
          "2xl": "1400px",
        },
      },
      animation: {
        "fade-in": "fadeIn 0.8s ease-out forwards",
        "fade-up": "fadeUp 0.9s ease-out forwards",
        "marquee": "marquee 40s linear infinite",
      },
      keyframes: {
        fadeIn: { "0%": { opacity: "0" }, "100%": { opacity: "1" } },
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        marquee: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
