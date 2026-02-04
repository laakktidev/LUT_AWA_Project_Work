import React from "react";
import ReactDOM from "react-dom/client";
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import App from "./App";
import { AuthProvider } from "./context/AuthContext";
import "./i18n";
//import "./styles/tiptap-theme.css";


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

        {/* ⭐ Inject theme colors as CSS variables */}
        <div
          style={{
            "--mui-text-primary": theme.palette.text.primary,
            "--mui-text-secondary": theme.palette.text.secondary,
            "--mui-background-default": theme.palette.background.default,
            "--mui-background-paper": theme.palette.background.paper,
            "--mui-primary-main": theme.palette.primary.main,
            "--mui-primary-light": theme.palette.primary.light,
            "--mui-divider": theme.palette.divider,
            "--mui-action-hover": theme.palette.action.hover,
          } as React.CSSProperties}
        >
          <App />
        </div>

      </ThemeProvider>
    </AuthProvider>
  );
};

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>
);