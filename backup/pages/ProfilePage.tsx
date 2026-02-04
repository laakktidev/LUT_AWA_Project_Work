import { useAuth } from "../context/AuthContext";
import { ProfilePictureUploader } from "../components/ProfilePictureUploader";
import { Container, Typography, Box, IconButton } from "@mui/material";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function ProfilePage() {
    const { t } = useTranslation();
    const { user, token, updateUser } = useAuth();
    const navigate = useNavigate();

    return (
        <Container maxWidth="sm">
            <IconButton onClick={() => navigate(-1)}>
                <ArrowBackIcon />
            </IconButton>

            <Typography variant="h4" mb={3}>
                {t("profile.title")}
            </Typography>

            <ProfilePictureUploader
                token={token}
                currentPicture={user?.profilePicture}
                onUploaded={(newPath: string) => {
                    updateUser({ ...user!, profilePicture: newPath });
                }}
            />

            <Box mt={4}>
                <Typography variant="h6">
                    {t("profile.name")}: {user?.username}
                </Typography>
                <Typography variant="h6">
                    {t("profile.email")}: {user?.email}
                </Typography>
            </Box>
        </Container>
    );
}
