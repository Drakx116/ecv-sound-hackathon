module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        creme: "#FFF",
        dusky: "#373B47"
      },
      width: {
        homecircle: "40rem"
      },
      height: {
        homecircle: "40rem"
      },
      spacing: {
        homecircle: "32rem"
      },
      scale: {
        '200': '2'
      }
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
