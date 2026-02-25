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
import PageContainer from "../layout/PageContainer";

/**
 * Page for creating a new user account.
 *
 * @remarks
 * This page:
 * - collects username, email, and password
 * - sends the data to the backend to create a new account
 * - displays success or error notifications
 * - redirects the user to the login page after successful signup
 *
 * It also includes:
 * - mobile‑friendly layout adjustments
 * - hidden autofill fields to prevent browser autofill issues
 *
 * @returns JSX element representing the signup page.
 */
const SignUpPage: React.FC = () => {
  const { t } = useTranslation();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();

  /** Username input field. */
  const [username, setUsername] = useState("");

  /** Email input field. */
  const [email, setEmail] = useState("");

  /** Password input field. */
  const [password, setPassword] = useState("");

  /** Controls toast visibility and type. */
  const [toast, setToast] = useState<"success" | "error" | null>(null);

  /**
   * Handles the signup form submission.
   *
   * @param e - Form submission event.
   * @returns Promise resolving when signup completes.
   */
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const result = await signupUser(email, password, username);

    if (!result) {
      setToast("error");
      return;
    }

    setToast("success");

    // Small delay so the user sees the success toast
    await new Promise(resolve => setTimeout(resolve, 2000));
    setToast(null);

    // Redirect to login with prefilled email
    navigate("/login", { state: { email: result.email } });
  }

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
              {t("signup.title")}
            </Typography>
          </Box>

          <form onSubmit={handleSubmit}>
            {/* Hidden fields to prevent browser autofill issues */}
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

        {toast && (
          <Toast
            open
            message={t(`signup.${toast}`)}
            severity={toast}
            autoHideDuration={toast === "error" ? 3000 : 2000}
            onClose={() => setToast(null)}
          />
        )}
      </Grid>
    </PageContainer>
  );
};

export default SignUpPage;
