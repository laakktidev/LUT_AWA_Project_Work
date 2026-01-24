import { Editor } from "@tiptap/react";

interface Props {
  editor: Editor | null;
  onImageUpload: () => void;
}

export function DocumentEditorToolbar({ editor, onImageUpload }: Props) {
  if (!editor) return null;

  return (
    <div style={{ marginBottom: "10px", display: "flex", gap: "8px" }}>
      <button onClick={() => editor.chain().focus().toggleBold().run()}>
        Bold
      </button>

      <button onClick={() => editor.chain().focus().toggleItalic().run()}>
        Italic
      </button>

      <button onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>
        H2
      </button>

      <button onClick={() => editor.chain().focus().toggleBulletList().run()}>
        • List
      </button>

      <button onClick={onImageUpload}>
        Insert Image
      </button>
    </div>
  );
}
