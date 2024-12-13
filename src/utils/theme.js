import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  breakpoints: {
    values: {
      xs: 540,
      sm: 750,
      md: 900,
      lg: 1200,
      xl: 1536,
      // Custom breakpoints
      tablet: 700,
      largeScreen: 1600,
    },
  },
});

export default theme;
