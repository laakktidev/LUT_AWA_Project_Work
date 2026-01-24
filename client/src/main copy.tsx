import React from "react";
import ReactDOM from "react-dom/client";
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import App from "./App";
import { AuthProvider } from "./context/AuthContext";

const Root = () => {
  const theme = createTheme({
    cssVariables: { colorSchemeSelector: "class" },
    colorSchemes: {
      light: {
        palette: {
          primary: { main: "#f2f6fc" },
          
        },
      },
      dark: {
        palette: {
          primary: { main: "#0000FF" },
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