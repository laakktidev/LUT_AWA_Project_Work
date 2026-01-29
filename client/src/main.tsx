import React from "react";
import ReactDOM from "react-dom/client";
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import App from "./App";
import { AuthProvider } from "./context/AuthContext";
import "./i18n";


const Root = () => {
  const theme = createTheme({
    cssVariables: { colorSchemeSelector: "class" },

    colorSchemes: {
      light: {
        palette: {
          primary: { main: "#f2f6fc" },
          background: {
            default: "#f6fffb",
            paper: "#ffffff",
          },
        },
      },

      dark: {
        palette: {
          primary: { main: "#0000FF" },
          background: {
            default: "#0d1117",
            paper: "#161b22",
          },
        },
      },
    },

    // IMPORTANT: components must be OUTSIDE colorSchemes
    components: {
      MuiSwitch: {
        styleOverrides: {
          root: { padding: 8 },

          switchBase: {
            "&.Mui-checked": {
              color: "var(--mui-palette-primary-main)",
              "& + .MuiSwitch-track": {
                backgroundColor: "var(--mui-palette-primary-light)",
                opacity: 1,
              },
            },
          },

          thumb: {
            boxShadow: "0 1px 2px rgba(0,0,0,0.25)",
          },

          track: {
            backgroundColor: "var(--mui-palette-grey-400)",
            opacity: 1,
          },
        },
      },
    },
  });



  return (
    <AuthProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <App />
      </ThemeProvider>
    </AuthProvider>
  );
};

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>
);