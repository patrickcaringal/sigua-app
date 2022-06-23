import { red } from "@mui/material/colors";
import { createTheme } from "@mui/material/styles";

export const defaultTheme = createTheme({
  palette: {
    primary: {
      // light: will be calculated from palette.primary.main,
      main: "#009FFE",
      // dark: will be calculated from palette.primary.main,
      contrastText: "#fff",
    },
    // secondary: {
    //   light: "#0066ff",
    //   main: "#0044ff",
    //   // dark: will be calculated from palette.secondary.main,
    //   contrastText: "#ffcc00",
    // },
  },
});
