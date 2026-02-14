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
import { useTranslation } from "react-i18next";

import { User } from "../types/User";
import { Toast } from "../components/Toast";
import PageContainer from "../layout/PageContainer";

/**
 * Login page for authenticating users.
 *
 * @remarks
 * This page:
 * - handles user login
 * - displays validation errors via toast
 * - supports mobile‑friendly layout
 * - pre‑fills email if redirected from signup
 *
 * On successful login, the user is redirected to the home page.
 *
 * @returns JSX element representing the login page.
 */
export default function LoginPage() {
  const { t } = useTranslation();

  /** Email input field. */
  const [email, setEmail] = useState("");

  /** Password input field. */
  const [password, setPassword] = useState("");

  /** Controls visibility of the invalid credentials toast. */
  const [toastOpen, setToastOpen] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const location = useLocation();
  const navigate = useNavigate();

  const { login } = useAuth();

  // -----------------------------
  // PREFILL EMAIL (if redirected)
  // -----------------------------

  /**
   * Loads the email from navigation state (e.g., after signup redirect).
   *
   * @remarks
   * A small timeout is used to ensure React Router state is available.
   */
  useEffect(() => {
    const timer = setTimeout(() => {
      setEmail(location.state?.email ?? "");
    }, 50);

    return () => clearTimeout(timer);
  }, []);

  // -----------------------------
  // SUBMIT HANDLER
  // -----------------------------

  /**
   * Attempts to log the user in.
   *
   * @param e - Form submission event.
   * @returns Promise resolving when login succeeds or fails.
   */
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const data = await loginUser(email, password);

    if (!data) {
      setToastOpen(true);
      return;
    }

    login(data.token, data.user as User);
    navigate("/");
  }

  // -----------------------------
  // RENDER
  // -----------------------------
  return (
    <PageContainer>
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
              {t("login.title")}
            </Typography>
          </Box>

          <form onSubmit={handleSubmit}>
            {/* Hidden fields to prevent browser autofill issues */}
            <input type="text" name="fake-email" autoComplete="username" style={{ display: "none" }} />
            <input type="password" name="fake-password" autoComplete="new-password" style={{ display: "none" }} />

            <TextField
              fullWidth
              label={t("login.email")}
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
              label={t("login.password")}
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
              {t("login.button")}
            </Button>
          </form>

          <Box sx={{ textAlign: "center", mt: 2 }}>
            <Typography variant="body2">
              {t("login.noAccount")}{" "}
              <Link component={RouterLink} to="/signup" underline="hover" color="inherit">
                {t("login.signup")}
              </Link>
            </Typography>
          </Box>
        </Box>

        <Toast
          open={toastOpen}
          message={t("login.invalidCredentials")}
          severity="warning"
          autoHideDuration={3000}
          onClose={() => setToastOpen(false)}
        />
      </Grid>
    </PageContainer>
  );
}
