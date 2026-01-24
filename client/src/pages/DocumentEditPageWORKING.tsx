import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { DocumentEditor } from "../components/DocumentEditor";
import { getDocumentById, updateDocument } from "../services/documentService";
import { useAuth } from "../context/AuthContext";

import { uploadDocumentImage } from "../services/documentService";


export default function DocumentEditPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { token } = useAuth();

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function load() {
            if (!id || !token) return;

            const doc = await getDocumentById(id, token);
            setTitle(doc.title || "");
            setContent(doc.content || "");
            setLoading(false);
        }

        load();
    }, [id, token]);

    async function handleImageUpload(file: File): Promise<string> {
        if (!id || !token) throw new Error("Missing id or token");
        return uploadDocumentImage(id, file, token);
    }


    /*async function uploadImage(file: File): Promise<string> {
      const formData = new FormData();
      formData.append("image", file);
    
      const res = await fetch(`http://localhost:8000/api/documents/${id}/images`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
    
      const data = await res.json();
      return data.url; // backend returns the image URL
    }*/



    async function handleSave() {
        if (!id || !token) return;

        await updateDocument(id, { title, content }, token);
        navigate(`/documents/${id}`);
    }

    if (loading) return <div>Loading…</div>;

    return (
        <div style={{ padding: "20px" }}>
            <h2>Edit Document</h2>

            <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Document title"
                style={{
                    width: "100%",
                    padding: "10px",
                    marginBottom: "20px",
                    fontSize: "18px"
                }}
            />


            <DocumentEditor
                value={content}
                onChange={setContent}
                onImageUpload={handleImageUpload}
            />


            <button
                onClick={handleSave}
                style={{
                    marginTop: "20px",
                    padding: "10px 20px",
                    fontSize: "16px"
                }}
            >
                Save
            </button>
        </div>
    );
}
