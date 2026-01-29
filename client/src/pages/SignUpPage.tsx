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
import { useTranslation } from "react-i18next";

const SignUpPage: React.FC = () => {
  const { t } = useTranslation();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  const [toast, setToast] = useState<"success" | "error" | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const result = await signupUser(email, password, username);

    if (!result) {
      setToast("error");
      return;
    }

    setToast("success");
    await new Promise(resolve => setTimeout(resolve, 2000));
    setToast(null);

    navigate("/login", { state: { email: result.email } });
  }

// sx={{ mt: 3, bgcolor: "teal", ":hover": { bgcolor: "darkcyan" } }}

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
            {t("signup.title")}
          </Typography>
        </Box>

        <form onSubmit={handleSubmit}>
          <input type="text" name="fake-email" autoComplete="username" style={{ display: "none" }} />
          <input type="password" name="fake-password" autoComplete="new-password" style={{ display: "none" }} />

          <TextField
            fullWidth
            label={t("signup.username")}
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
            label={t("signup.email")}
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
            label={t("signup.password")}
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

          <Button
            fullWidth
            variant="contained"            
            sx={{ mt: 3 }}
            type="submit"
          >
            {t("signup.button")}
          </Button>
        </form>

        <Box sx={{ textAlign: "center", mt: 2 }}>
          <Typography variant="body2">
            {t("signup.haveAccount")}{" "}
            <Link
              component={RouterLink}
              to="/login"
              underline="hover"
              color="inherit"
            >
              {t("signup.login")}
            </Link>
          </Typography>
        </Box>
      </Box>

      <Toast
        open={toast !== null}
        message={
          toast === "success"
            ? t("signup.success")
            : t("signup.error")
        }
        severity={toast === "success" ? "success" : "error"}
        autoHideDuration={toast === "error" ? 5000 : 0}
        onClose={() => setToast(null)}
      />
    </Grid>
  );
};

export default SignUpPage;
