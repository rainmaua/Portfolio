const { blackA, mauve, violet } = require("@radix-ui/colors"); // radix UI

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    // "./app/**/*.{js,ts,jsx,tsx}",
    // "./pages/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",

    "./components/**/*.{js,ts,jsx,tsx}",

    // Or if using `src` directory:
    // "./src/**/*.{js,ts,jsx,tsx}",
  ],
  // Use these colors instead of creating new colors.
  // If you really want to create new colors,
  // edit hex values of these colors instead.
  theme: {
    extend: {
      colors: {
        customTitleColor: "#283618", // dark green
        customSecondaryColor: "#886227", // yellowish brown
        customTertiaryColor: "#B34A36", // moderate red
        customLogoColor: "#6B9F33", // light green
        customGreyColor: "#E5E5E5", // light grey
        ...blackA,
        ...mauve,
        ...violet,
      },
      keyframes: {
        slideDownAndFade: {
          from: { opacity: 0, transform: "translateY(-2px)" },
          to: { opacity: 1, transform: "translateY(0)" },
        },
        slideLeftAndFade: {
          from: { opacity: 0, transform: "translateX(2px)" },
          to: { opacity: 1, transform: "translateX(0)" },
        },
        slideUpAndFade: {
          from: { opacity: 0, transform: "translateY(2px)" },
          to: { opacity: 1, transform: "translateY(0)" },
        },
        slideRightAndFade: {
          from: { opacity: 0, transform: "translateX(2px)" },
          to: { opacity: 1, transform: "translateX(0)" },
        },
      },
      animation: {
        slideDownAndFade:
          "slideDownAndFade 400ms cubic-bezier(0.16, 1, 0.3, 1)",
        slideLeftAndFade:
          "slideLeftAndFade 400ms cubic-bezier(0.16, 1, 0.3, 1)",
        slideUpAndFade: "slideUpAndFade 400ms cubic-bezier(0.16, 1, 0.3, 1)",
        slideRightAndFade:
          "slideRightAndFade 400ms cubic-bezier(0.16, 1, 0.3, 1)",
      },
    },
  },
  plugins: [],
  // Tailwind Preflight removes all of the default margins
  // from elements like headings, blockquotes, paragraphs, etc.
  // If you would like to stick with default values, then you can disable Preflight
  // corePlugins: {
  //   preflight: false,
  // },
};
