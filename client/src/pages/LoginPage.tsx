import { useState, useEffect } from "react";
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
} from "@mui/material";

import { Link as RouterLink, useLocation, useNavigate } from "react-router-dom";

import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import { loginUser } from "../services/userService";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const location = useLocation();
  const navigate = useNavigate();

  const { login } = useAuth();   // ← global login function

  useEffect(() => {
    const timer = setTimeout(() => {
      setEmail(location.state?.email ?? "");
    }, 50);

    return () => clearTimeout(timer);
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const data = await loginUser(email, password);

    if (!data) {
      console.log("Invalid credentials");
      return;
    }

    // Call global login()
    login(data.token, data.user);

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

          <Button fullWidth variant="contained" sx={{ mt: 3 }} type="submit">
            Login
          </Button>
        </form>

        <Box sx={{ textAlign: "center", mt: 2 }}>
          <Typography variant="body2">
            New to us?{" "}
            <Link component={RouterLink} to="/signup" underline="hover" color="primary">
              Sign Up
            </Link>
          </Typography>
        </Box>
      </Box>
    </Grid>
  );
}
