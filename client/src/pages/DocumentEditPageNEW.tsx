import { useState, useEffect } from "react";
import { Box, Button, IconButton, TextField, Container } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate, useParams } from "react-router-dom";
import { DocumentEditor } from "../components/DocumentEditor";
import {
    uploadDocumentImage,
    getDocumentById,
    updateDocument,
} from "../services/documentService";

export default function DocumentEditPage() {
    const navigate = useNavigate();
    const { id } = useParams();

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");

    const token = localStorage.getItem("token");

    // Load document on mount
    useEffect(() => {
        async function load() {
            if (!id || !token) return;
            const doc = await getDocumentById(id, token);
            setTitle(doc.title);
            setContent(doc.content);
        }
        load();
    }, [id, token]);

    async function handleImageUpload(file: File): Promise<string> {
        if (!id || !token) throw new Error("Missing id or token");
        return uploadDocumentImage(id, file, token);
    }

    async function handleSave() {
        if (!id || !token) return;

        await updateDocument(id, { title, content }, token);
        navigate(-1);
    }

    return (
        <Container maxWidth="md">
            <Box p={3}>
                {/* Top bar */}
                <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="space-between"
                    mb={2}
                >
                    {/* Back button */}
                    <IconButton onClick={() => navigate(-1)}>
                        <ArrowBackIcon />
                    </IconButton>

                    {/* Title input */}
                    <TextField
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Document title"
                        variant="outlined"
                        size="small"
                        sx={{
                            flexGrow: 1,
                            mx: 2,
                            "& .MuiOutlinedInput-root": {
                                borderRadius: "8px",
                                height: "48px",
                                fontSize: "1.5rem",
                                fontWeight: 600,
                                paddingLeft: "12px",
                                paddingRight: "12px",
                            },
                            "& input": {
                                padding: 0, // remove default padding so the font size looks clean
                            },
                        }}
                    />


                    {/* Save button */}
                    <Button variant="contained" color="primary" onClick={handleSave}>
                        Save
                    </Button>
                </Box>

                {/* Editor */}
                <DocumentEditor
                    value={content}
                    onChange={setContent}
                    onImageUpload={handleImageUpload}
                />
            </Box>
        </Container>
    );
}
