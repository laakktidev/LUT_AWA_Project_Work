import { useState, useEffect } from "react";
import { Button, Avatar, Stack } from "@mui/material";
import { uploadProfilePicture } from "../services/userService";
import { BASE_URL } from "../services/config";
import { useTranslation } from "react-i18next";

export function ProfilePictureUploader({ token, currentPicture, onUploaded }) {
    const { t } = useTranslation();

    const [preview, setPreview] = useState<string | null>(currentPicture || null);
    const [file, setFile] = useState<File | null>(null);

    useEffect(() => {
        setPreview(`${BASE_URL}/..${currentPicture}` || null);
    }, [currentPicture]);

    function handleSelect(e: React.ChangeEvent<HTMLInputElement>) {
        const selected = e.target.files?.[0];
        if (!selected) return;

        setFile(selected);
        setPreview(URL.createObjectURL(selected));
    }

    async function handleUpload() {
        if (!file || !token) return;

        const formData = new FormData();
        formData.append("image", file);

        const result = await uploadProfilePicture(formData, token);

        setPreview(`${BASE_URL}/..${result.path}`);
        onUploaded(result.path);
    }

    return (
        <Stack spacing={2} alignItems="center">
            <Avatar
                src={preview ? preview : undefined}
                sx={{ width: 120, height: 120 }}
            />

            <Button variant="outlined" component="label">
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
