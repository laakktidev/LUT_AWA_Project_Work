import { useRef } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import { DocumentEditorToolbar } from "./DocumentEditorToolbar";

interface Props {
    value: string;
    onChange: (value: string) => void;
    onImageUpload: (file: File) => Promise<string>;
}

export function DocumentEditor({ value, onChange, onImageUpload }: Props) {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const editor = useEditor({
        extensions: [StarterKit, Image],
        content: value,
        onUpdate({ editor }) {
            onChange(editor.getHTML());
        },
    });

    async function handleImageUpload() {
        if (!fileInputRef.current) return;
        fileInputRef.current.click();
    }

    async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) return;

        const url = await onImageUpload(file);
        editor?.chain().focus().setImage({ src: url }).run();
    }

    return (
        <div>
            <DocumentEditorToolbar editor={editor} onImageUpload={handleImageUpload} />

            <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                style={{ display: "none" }}
                onChange={handleFileChange}
            />

            <EditorContent
                editor={editor}
                style={{
                    paddingLeft: "0px",
                    paddingRight: "0px",
                }}
            />


        </div>
    );
}
