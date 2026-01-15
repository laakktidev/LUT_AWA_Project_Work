/*
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import "./i18n";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)*/

import React from 'react';
//import { useState } from 'react';
import ReactDOM from 'react-dom/client';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import App from './App';
//import { useColorScheme } from '@mui/material/styles';

const Root = () => {
  //const [mode, setMode] = useState<'light' | 'dark'>('light');
  //const { mode, setMode } = useColorScheme();

/*  const theme = createTheme({
  palette: {
    mode: mode,
    primary: { main: '#00897b' }, // teal-ish
  },
});*/



const theme = createTheme({
  cssVariables: { colorSchemeSelector: 'class',    
   },
  colorSchemes: {
    light: {
      palette: {
        primary: { main: '#00897b' },
      },
    },
    dark: {
      palette: {
        //primary: { main: '#4db6ac' },
        primary: { main: '#FF00FF' },
      },
    },
  },
});

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App/>
    </ThemeProvider>
  );
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>
);
