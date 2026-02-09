import NextLink from "next/link";
import { responsiveFontSizes } from "@mui/material";
import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#90caf9",
    },
    secondary: {
      main: "#f48fb1",
    },
    background: {
      default: "#0d1117",
      paper: "#161b22",
    },
  },
  typography: {
    fontFamily: 'inherit',
    h1: {
      fontSize: "2rem",
      lineHeight: 1.2,
    },
    h2: {
      fontSize: "1.75rem",
      lineHeight: 1.2,
    },
    h3: {
      fontSize: "1.5rem",
      lineHeight: 1.2,
    },
    h4: {
      fontSize: "1.25rem",
      lineHeight: 1.2,
    },
    h5: {
      fontSize: "1.1rem",
      lineHeight: 1.2,
    },
    h6: {
      fontSize: "1rem",
      lineHeight: 1.2,
    },
    body1: {
      fontSize: "1rem",
      lineHeight: 1.7,
    },
    body2: {
      fontSize: "0.875rem",
      lineHeight: 1.7,
    },
  },
  components: {
    MuiLink: {
      defaultProps: {
        component: NextLink,
        underline: "hover",
      },
    },
  },
});

export default responsiveFontSizes(theme);
