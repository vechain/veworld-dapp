const plugin = require("tailwindcss/plugin")

module.exports = {
  content: ["./src/**/*.{ts,tsx}"],
  darkMode: "class",
  theme: {
    colors: {
      inherit: "inherit",
      transparent: "transparent",
      white: "var(--color-white)",
      black: "var(--color-black)",
      gray: {
        disabled: "var(--color-gray-disabled)",
        lighter: "var(--color-gray-lighter)",
        light: "var(--color-gray-light)",
        DEFAULT: "var(--color-gray)",
        dark: "var(--color-gray-dark)",
        darker: "var(--color-gray-darker)",
      },
      primary: {
        light: "var(--color-primary-light)",
        DEFAULT: "var(--color-primary)",
      },
      secondary: {
        lighter: "var(--color-secondary-light)",
        light: "var(--color-secondary)",
        DEFAULT: "var(--color-secondary-dark)",
        dark: "var(--color-secondary-dark)",
      },
      tertiary: {
        light: "var(--color-tertiary-light)",
        DEFAULT: "var(--color-tertiary)",
        dark: "var(--color-tertiary-dark)",
      },
      danger: {
        light: "var(--color-danger-light)",
        DEFAULT: "var(--color-danger)",
        dark: "var(--color-danger-dark)",
      },
    },
    fontSize: {
      xs: ["9px", "11.7px"],
      sm: ["12px", "15.84px"],
      base: ["14px", "21px"],
      md: ["16px", "24px"],
      lg: ["18px", "27px"],
      "2lg": ["20px", "29px"],
      "3lg": ["22px", "31px"],
      xl: ["28px", "33.89px"],
      "2xl": ["32px", "39px"],
    },
    fontFamily: {
      sans: "Inter",
      mono: "JetBrains Mono",
    },
    extend: {
      boxShadow: {
        light: "0px 2px 10px 0px #0000001A",
        "light-reverse": "0px -2px 10px 0px #0000001A",
        "box-primary": "0px 0px 5px 1px #28008C",
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: 0 },
          "100%": { opacity: 1 },
        },
      },
      animation: {
        "fade-in": "fade-in .5s ease-in-out",
      },
    },
  },
  safelist: [
    {
      pattern: /(ant|slick)-./,
    },
  ],
  plugins: [require("@headlessui/tailwindcss")],
}
