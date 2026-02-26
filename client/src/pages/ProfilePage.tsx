import { useAuth } from "../context/AuthContext";
import { ProfilePictureUploader } from "../components/ProfilePictureUploader";
import { Typography, Box, IconButton } from "@mui/material";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import PageContainer from "../layout/PageContainer";

/**
 * User profile page.
 *
 * @remarks
 * This page allows the authenticated user to:
 * - view their profile information (name, email)
 * - update their profile picture
 * - navigate back to the previous page
 *
 * It uses the global authentication context to access and update user data.
 *
 * @returns JSX element representing the profile page.
 */
export function ProfilePage() {
  const { t } = useTranslation();
  const { user, token, updateUser } = useAuth();
  const navigate = useNavigate();

  return (
    <PageContainer>
      {/* Back button */}
      <IconButton onClick={() => navigate(-1)}>
        <ArrowBackIcon />
      </IconButton>

      {/* Page title */}
      <Typography variant="h4" mb={3}>
        {t("profile.title")}
      </Typography>

      {/* Profile picture uploader */}
      <ProfilePictureUploader
        token={token!}
        currentPicture={user?.profilePicture}
        /**
         * Called when a new profile picture has been uploaded.
         *
         * @param newPath - The server path of the uploaded profile picture.
         */
        onUploaded={(newPath: string) => {
          updateUser({ ...user!, profilePicture: newPath });
        }}
      />

      {/* User info */}
      <Box mt={4}>
        <Typography variant="h6">
          {t("profile.name")}: {user?.username}
        </Typography>
        <Typography variant="h6">
          {t("profile.email")}: {user?.email}
        </Typography>
      </Box>
    </PageContainer>
  );
}
