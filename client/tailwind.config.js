/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      textColor: {
        homeHeaderPrimary: "#ffffff",
        homeHeaderSecondary: "#5b5b5b",
        homeHeaderHistory: "#111111",
        buttonPrimary: "#1d90f5",
        buttonSecondary: "#146dbc",
      },
      backgroundColor: {
        buttonPrimary: "#1d90f5",
        buttonSecondary: "#146dbc",
        homeHeaderHistory: "#1c1d23",
        homeHeaderBtnPrimary: "#1df594",
        homeHeaderBtnSecondary: "#13a161",
        formInputPrimary: "#323644",
        formInputSecondary: "#5b5b5b",
      },
    },
  },
  plugins: [
    require("tailwind-scrollbar-hide"),
    // ...
  ],
};
