import { useState, useEffect } from "react";
import { Button, Avatar, Stack } from "@mui/material";
import { uploadProfilePicture } from "../services/userService";
import { BASE_URL } from "../services/config";


export function ProfilePictureUploader({ token, currentPicture, onUploaded }) {
    const [preview, setPreview] = useState<string | null>(currentPicture || null);
    const [file, setFile] = useState<File | null>(null);


    useEffect(() => {
  
        //console.log("in useEffect currentPicture:", currentPicture);
        //setPreview(`http://localhost:8000${currentPicture}` || null);
        setPreview(`${BASE_URL}/..${currentPicture}` || null);
    }, [currentPicture]);

//console.log("currentPicture:", currentPicture);
//console.log("preview:", preview);



    function handleSelect(e: React.ChangeEvent<HTMLInputElement>) {
        const selected = e.target.files?.[0];
        if (!selected) return;

        setFile(selected);
        setPreview(URL.createObjectURL(selected));
    }

    async function XXXXhandleUpload() {
        if (!file || !token) return;

        const formData = new FormData();
        formData.append("image", file);

        const result = await uploadProfilePicture(formData, token);
        onUploaded(result.path);
    }

async function handleUpload() {
  if (!file || !token) return;

  const formData = new FormData();
  formData.append("image", file);

  const result = await uploadProfilePicture(formData, token);

  console.log(`XXXXXXX http://localhost:8000${result.path}`)
  console.log(`${BASE_URL}/..${result.path}`);
  // Switch preview to server image
  setPreview(`${BASE_URL}/..${result.path}`);
  
  onUploaded(result.path);
}



    console.log(`PREVIEW ${preview}`)

    return (
        <Stack spacing={2} alignItems="center">
            {/*<Avatar
                src={preview ? `http://localhost:8000${preview}` : undefined}

                sx={{ width: 120, height: 120 }}
            />*/}
<Avatar
  src={preview ? preview : undefined}
  sx={{ width: 120, height: 120 }}
/>

            <Button variant="outlined" component="label">
                Choose Image
                <input type="file" hidden accept="image/*" onChange={handleSelect} />
            </Button>

            {file && (
                <Button variant="contained" onClick={handleUpload}>
                    Upload
                </Button>
            )}
        </Stack>
    );
}
