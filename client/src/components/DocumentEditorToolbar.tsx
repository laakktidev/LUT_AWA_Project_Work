import { Editor } from "@tiptap/react";
import { Box, IconButton, Tooltip } from "@mui/material";

import FormatBoldIcon from "@mui/icons-material/FormatBold";
import FormatItalicIcon from "@mui/icons-material/FormatItalic";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import FormatListNumberedIcon from "@mui/icons-material/FormatListNumbered";
import ImageIcon from "@mui/icons-material/Image";

interface Props {
  editor: Editor | null;
  onImageAddRequest: () => void; // NEW callback name
}

export function DocumentEditorToolbar({ editor, onImageAddRequest }: Props) {
  if (!editor) return null;

  return (
    <Box
      sx={{
        display: "flex",
        gap: 1,
        mb: 1,
        border: "1px solid #ccc",
        borderRadius: "8px",
        padding: "6px",
        backgroundColor: "#fafafa",
      }}
    >
      <Tooltip title="Bold">
        <IconButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          color={editor.isActive("bold") ? "primary" : "default"}
        >
          <FormatBoldIcon />
        </IconButton>
      </Tooltip>

      <Tooltip title="Italic">
        <IconButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          color={editor.isActive("italic") ? "primary" : "default"}
        >
          <FormatItalicIcon />
        </IconButton>
      </Tooltip>

      <Tooltip title="Bullet List">
        <IconButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          color={editor.isActive("bulletList") ? "primary" : "default"}
        >
          <FormatListBulletedIcon />
        </IconButton>
      </Tooltip>

      <Tooltip title="Numbered List">
        <IconButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          color={editor.isActive("orderedList") ? "primary" : "default"}
        >
          <FormatListNumberedIcon />
        </IconButton>
      </Tooltip>

      {/* Image button */}
      <Tooltip title="Insert Image">
        <IconButton onClick={onImageAddRequest}>
          <ImageIcon />
        </IconButton>
      </Tooltip>
    </Box>
  );
}
