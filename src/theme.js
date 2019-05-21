export default {
  breakpoints: ["40em", "52em", "64em"],
  colors: {
    blue: "blue",
    white: ["rgb(255, 255, 255)", "#f0f3f6", "rgb(240, 240, 240)"],
    gray: [
      "rgb(221, 221, 221)",
      "rgb(187, 187, 187)",
      "rgb(153, 153, 153)",
      "rgb(85, 85, 85)",
      "rgb(51, 51, 51)"
    ],
    red: ["rgb(255, 214, 214)", "rgb(247, 105, 105)", "rgb(238, 68, 68)"],
    purple: [
      "#E6E6FF",
      "#C4C6FF",
      "#A2A5FC",
      "#8888FC",
      "#7069FA",
      "#5D55FA",
      "#4D3DF7",
      "#3525E6",
      "#1D0EBE",
      "#0C008C"
    ]
  },
  fonts: {
    sans: "system-ui, sans-serif",
    mono: "Menlo, monospace"
  },
  shadows: {
    small: "0 0 4px rgba(0, 0, 0, .125)",
    medium: "0 0 8px rgba(0, 0, 0, .125)",
    large: "0 0 24px rgba(0, 0, 0, .125)"
  },
  text: {},
  buttons: {
    primary: {
      backgroundColor: "#eff3f6",
      backgroundImage: "linear-gradient(-180deg,#fafbfc,#eff3f6 90%)",
      color: "#24292e",
      cursor: "pointer"
    },
    copy: {
      backgroundColor: "#f0f3f6",
      border: "1px solid rgb(187, 187, 187)",
      cursor: "pointer",
      padding: "0 4px"
    }
  }
};
