import { useState, useEffect } from "react";
import { Button, Avatar, Stack } from "@mui/material";
import { uploadProfilePicture } from "../services/userService";
import { BASE_URL } from "../services/config";
import { useTranslation } from "react-i18next";

interface ProfilePictureUploaderProps {
  /** Auth token used for uploading the image. */
  token: string;

  /** Current profile picture path (relative from backend) or null. */
  currentPicture?: string | null;

  /**
   * Fired after a successful upload.
   * Provides the new image path returned by the backend.
   */
  onUploaded: (newUrl: string) => void;
}

/**
 * Allows the user to preview and upload a new profile picture.
 *
 * @remarks
 * This component:
 * - displays the current profile picture (if available)
 * - generates a local preview when the user selects a new file
 * - uploads the selected image to the backend
 * - notifies the parent component via `onUploaded` after a successful upload
 *
 * The component does not store the uploaded image permanently; it only handles
 * previewing and sending the file to the backend.
 *
 * @param token - Authentication token for upload requests.
 * @param currentPicture - Current profile picture path from backend.
 * @param onUploaded - Callback fired with the new image path after upload.
 *
 * @returns JSX element for selecting and uploading a profile picture.
 */
export function ProfilePictureUploader({
  token,
  currentPicture,
  onUploaded
}: ProfilePictureUploaderProps) {
  const { t } = useTranslation();

  /** Local preview URL for the selected or current profile picture. */
  const [preview, setPreview] = useState<string | null>(
    currentPicture ? `${BASE_URL}/..${currentPicture}` : null
  );

  /** The file selected by the user for upload. */
  const [file, setFile] = useState<File | null>(null);

  /**
   * Updates the preview when the parent updates the current picture.
   */
  useEffect(() => {
    if (currentPicture) {
      setPreview(`${BASE_URL}/..${currentPicture}`);
    } else {
      setPreview(null);
    }
  }, [currentPicture]);

  /**
   * Handles file selection from the hidden input.
   *
   * @param e - File input change event.
   */
  function handleSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = e.target.files?.[0];
    if (!selected) return;

    setFile(selected);
    setPreview(URL.createObjectURL(selected));
  }

  /**
   * Uploads the selected profile picture to the backend.
   *
   * @remarks
   * - Sends the file as multipart/form-data
   * - Updates the preview with the returned image path
   * - Notifies the parent via `onUploaded`
   */
  async function handleUpload() {
    if (!file || !token) return;

    const formData = new FormData();
    formData.append("image", file);

    const result = await uploadProfilePicture(formData, token);

    const newUrl = `${BASE_URL}/..${result.path}`;
    setPreview(newUrl);
    onUploaded(result.path);
  }

  return (
    <Stack spacing={2} alignItems="center">
      <Avatar
        src={preview || undefined}
        sx={{ width: 120, height: 120 }}
      />

      <Button variant="outlined" color="inherit" component="label">
        {t("profilePic.choose")}
        <input type="file" hidden accept="image/*" onChange={handleSelect} />
      </Button>

      {file && (
        <Button variant="contained" onClick={handleUpload}>
          {t("profilePic.upload")}
        </Button>
      )}
    </Stack>
  );
}
