import { useAuth } from "../context/AuthContext";
import { ProfilePictureUploader } from "../components/ProfilePictureUploader";
import { Container, Typography, Box } from "@mui/material";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { IconButton } from "@mui/material";
import { useNavigate } from "react-router-dom";


export default function ProfilePage() {
  const { user, token, updateUser } = useAuth();
  const navigate = useNavigate();

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" mb={3}>My Profile</Typography>

      <ProfilePictureUploader
        token={token}
        currentPicture={user?.profilePicture}
        onUploaded={(newPath:any) => {
          updateUser({ ...user!, profilePicture: newPath });
        }}
      />

      <Box mt={4}>
        <Typography variant="h6">Name: {user?.username}</Typography>
        <Typography variant="h6">Email: {user?.email}</Typography>
      </Box>
    </Container>
  );
}
