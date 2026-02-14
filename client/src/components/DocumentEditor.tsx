import { useRef } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import { Box } from "@mui/material";
import { DocumentEditorToolbar } from "./DocumentEditorToolbar";

interface Props {
  /** Current HTML content of the editor. */
  value: string;

  /** Fired whenever the editor content changes. */
  onChange: (value: string) => void;

  /**
   * Fired when the user inserts an image.
   * Provides both a local preview URL and the raw File object.
   */
  onImageAdd: (localUrl: string, file: File) => void;
}

/**
 * Rich text editor for documents, powered by Tiptap.
 *
 * @remarks
 * This component:
 * - uses Tiptap with `StarterKit` for basic formatting
 * - supports inline images via the `Image` extension
 * - exposes a toolbar for formatting and image insertion
 * - uses a hidden file input to allow image uploads
 * - calls `onChange` with updated HTML whenever the editor content changes
 * - calls `onImageAdd` when an image is inserted, allowing the parent to upload or process it
 *
 * The editor is fully controlled by the parent component through the `value` prop.
 *
 * @param value - Current HTML content.
 * @param onChange - Callback fired when content changes.
 * @param onImageAdd - Callback fired when an image is inserted.
 *
 * @returns JSX element containing the Tiptap editor and toolbar.
 */
export function DocumentEditor({ value, onChange, onImageAdd }: Props) {
  /** Hidden file input used for selecting images. */
  const fileInputRef = useRef<HTMLInputElement>(null);

  /**
   * Initializes the Tiptap editor instance.
   *
   * @remarks
   * - Loads initial content from `value`
   * - Registers update handler to propagate HTML changes
   */
  const editor = useEditor({
    extensions: [StarterKit, Image],
    content: value,
    onUpdate({ editor }) {
      onChange(editor.getHTML());
    },
  });

  /**
   * Opens the hidden file picker for image uploads.
   */
  function triggerImagePicker() {
    fileInputRef.current?.click();
  }

  /**
   * Handles image file selection.
   *
   * @remarks
   * - Creates a temporary preview URL
   * - Inserts the preview image into the editor
   * - Notifies the parent via `onImageAdd`
   *
   * @param e - File input change event.
   */
  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    // Create local preview URL
    const localUrl = URL.createObjectURL(file);

    // Insert preview image into editor
    editor?.chain().focus().setImage({ src: localUrl }).run();

    // Inform parent about this image
    onImageAdd(localUrl, file);

    // Reset input so same file can be selected again
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
      <DocumentEditorToolbar
        editor={editor}
        onImageAddRequest={triggerImagePicker}
      />

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
