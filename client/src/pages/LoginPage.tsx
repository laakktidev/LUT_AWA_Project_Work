import { useState,useEffect } from 'react';

import {
  Box,
  Button,
  Grid,
  Link,
  TextField,
  Typography,
  InputAdornment,
  useMediaQuery,
  useTheme,
} from '@mui/material';

import { Link as RouterLink, useLocation, useNavigate } from "react-router-dom";

import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import { loginUser } from "../services/userService";


import { LoginPageProps } from "../types/LoginPageprops";
//import { User } from '../types/User';

const LoginPage: React.FC<LoginPageProps> = ({ setToken, setUser }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const location = useLocation();

  useEffect(() => {
    const timer = setTimeout(() => {
      setEmail(location.state?.email ?? "");
    }, 50);

    return () => clearTimeout(timer);
  }, []);


  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const data = await loginUser(email, password);

    console.log("Login response data:", data);

    if (!data) {
      console.log("Invalid credentials");
      return;
    }
    
    // parametrin saadut funktiot
    setToken(data.token);
    setUser(data.user);
    navigate("/");
  }

  return (
    <Grid
      container
      justifyContent="center"
      alignItems="center"
      sx={{ minHeight: "100vh", px: 2 }}
    >
      <Box
        sx={{
          width: isMobile ? "100%" : 400,
          p: 4,
          boxShadow: 3,
          borderRadius: 2,
          bgcolor: "background.paper",
        }}
      >
        <Box sx={{ textAlign: "center", mb: 3 }}>
          <Typography variant="h5" fontWeight="bold">
            Log-in to your account
          </Typography>
        </Box>

        <form onSubmit={handleSubmit}>

          <input type="text" name="fake-email" autoComplete="username" style={{ display: "none" }} />
          <input type="password" name="fake-password" autoComplete="new-password" style={{ display: "none" }} />

          <TextField
            fullWidth
            label="E-mail address"
            margin="normal"
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon />
                  </InputAdornment>
                ),
              },
            }}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <TextField
            fullWidth
            label="Password"
            type="password"
            margin="normal"
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon />
                  </InputAdornment>
                ),
              },
            }}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <Button
            fullWidth
            variant="contained"
            sx={{ mt: 3 }}
            type="submit"   // <-- now triggers handleSubmit
          >
            Login
          </Button>
        </form>

        <Box sx={{ textAlign: "center", mt: 2 }}>
          <Typography variant="body2">
            New to us?{" "}
            <Link
              component={RouterLink}
              to="/signup"
              underline="hover"
              color="primary"
            >
              Sign Up
            </Link>
          </Typography>
        </Box>
      </Box>
    </Grid>
  );
};

export default LoginPage;