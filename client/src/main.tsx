import React from "react";
import ReactDOM from "react-dom/client";
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import App from "./App";
import { AuthProvider } from "./context/AuthContext";
import "./i18n";

/**
 * Root component that initializes global application providers.
 *
 * @remarks
 * This component wraps the entire application with:
 *
 * - **AuthProvider** — supplies authentication state and session handling  
 * - **ThemeProvider** — provides Material UI theming (light/dark modes, breakpoints, overrides)  
 * - **CssBaseline** — resets and normalizes browser styles  
 *
 * It also defines the custom MUI theme used across the app, including:
 * - responsive breakpoints
 * - light/dark color schemes
 * - component style overrides (e.g., switches)
 *
 * All routing and page rendering happens inside the nested `<App />` component.
 *
 * @returns The fully wrapped application tree.
 */
const Root = () => {
  const theme = createTheme({
    cssVariables: { colorSchemeSelector: "class" },

    // Custom breakpoints for better mobile/tablet/desktop behavior
    breakpoints: {
      values: {
        xs: 0,
        sm: 700,
        md: 1100,
        lg: 1400,
        xl: 1800,
      },
    },

    // Light + Dark mode palettes
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
          primary: { main: "#2dd4bf" },
          background: {
            default: "#0d1117",
            paper: "#161b22",
          },
        },
      },
    },

    // Component overrides
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

// Mount the React application
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>
);
