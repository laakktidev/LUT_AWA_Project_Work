import React, { useState } from 'react';
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
import { Link as RouterLink, useNavigate } from "react-router-dom";

import { signupUser } from "../services/userService";

import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import PersonIcon from '@mui/icons-material/Person';

import { Toast } from "../components/Toast";

const SignUpPage: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  //const [error, setError] = useState<string | null>(null);
  
  const [toast, setToast] = useState<"success" | "error" | null>(null);
  //const [toast, setToast] = useState<"success" | "error" | null>("success");
  
  console.log("Registration successful!");
   
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    //setError(null);
 
    const result = await signupUser(email, password, username);

    if (!result) {
      //setError("Signup failed");
      setToast("error");
      return;
    }

    setToast("success");
    await new Promise(resolve => setTimeout(resolve, 2000));
    setToast(null);
    navigate("/login", { state: { email: result.email } });
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
            Create your account
          </Typography>
        </Box>

        <form onSubmit={handleSubmit}>
          <input type="text" name="fake-email" autoComplete="username" style={{ display: "none" }} />
          <input type="password" name="fake-password" autoComplete="new-password" style={{ display: "none" }} />
          <TextField
            fullWidth
            label="Username"
            margin="normal"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonIcon />
                  </InputAdornment>
                ),
              },
            }}
          />

          <TextField
            fullWidth
            label="E-mail address"
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon />
                  </InputAdornment>
                ),
              },
            }}
          />

          <TextField
            fullWidth
            label="Password"
            type="password"
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon />
                  </InputAdornment>
                ),
              },
            }}
          />

         {/*} {error && (
            <Typography color="error" sx={{ mt: 1 }}>
              {error}
            </Typography>
          )}*/}

          <Button
            fullWidth
            variant="contained"
            sx={{ mt: 3, bgcolor: "teal", ":hover": { bgcolor: "darkcyan" } }}
            type="submit"
          >
            Sign Up
          </Button>
        </form>

        <Box sx={{ textAlign: "center", mt: 2 }}>
          <Typography variant="body2">
            Already have an account?{" "}
            <Link
              component={RouterLink}
              to="/login"
              underline="hover"
              color="primary"
            >
              Login
            </Link>
          </Typography>
        </Box>
      </Box>
      <Toast
        open={toast !== null}
        message={toast === "success" ? "Registration successful!" : "Signup failed"}
        severity={toast === "success" ? "success" : "error"}
        autoHideDuration={toast === "error" ? 5000 : 0}
        onClose={() => setToast(null)}
      />

    </Grid>
  );
};
export default SignUpPage;