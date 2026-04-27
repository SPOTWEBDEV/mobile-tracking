/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      fontFamily: {
        poppinsLight: ["PoppinsLight"],
        poppinsMedium: ["PoppinsMedium"],
        poppinsSemiBold: ["PoppinsSemiBold"],
        poppinsBold: ["PoppinsBold"],
      },
      colors: {
        primary: "#0A145A",        // your main color
      },
    },

  },
  plugins: [],
};
