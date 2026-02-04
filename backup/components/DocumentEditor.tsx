import { useRef } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import { Box } from "@mui/material";
import { DocumentEditorToolbar } from "./DocumentEditorToolbar";

interface Props {
  value: string;
  onChange: (value: string) => void;
  onImageAdd: (localUrl: string, file: File) => void;
}

export function DocumentEditor({ value, onChange, onImageAdd }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const editor = useEditor({
    extensions: [StarterKit, Image],
    content: value,
    onUpdate({ editor }) {
      onChange(editor.getHTML());
    },
  });

  function triggerImagePicker() {
    fileInputRef.current?.click();
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    // Create local preview URL
    const localUrl = URL.createObjectURL(file);

    // Insert preview image into editor
    editor?.chain().focus().setImage({ src: localUrl }).run();

    // Inform parent about this image
    onImageAdd(localUrl, file);

    // Reset input so same file can be selected again if needed
    e.target.value = "";
  }

  return (
    <Box
      sx={{
        "& .tiptap": {
          border: "1px solid #ccc",
          borderRadius: "8px",
          padding: "16px",
          minHeight: "200px",
          outline: "none",
        },
        "& .tiptap:focus": {
          borderColor: "#90caf9",
          boxShadow: "0 0 0 2px rgba(144, 202, 249, 0.3)",
        },
      }}
    >

      <DocumentEditorToolbar editor={editor} onImageAddRequest={triggerImagePicker} />

      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={handleFileChange}
      />

      <EditorContent editor={editor} />
    </Box>
  );
}
