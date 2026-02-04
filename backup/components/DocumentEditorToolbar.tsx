import { Editor } from "@tiptap/react";
import { Box, IconButton, Tooltip } from "@mui/material";

import FormatBoldIcon from "@mui/icons-material/FormatBold";
import FormatItalicIcon from "@mui/icons-material/FormatItalic";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import FormatListNumberedIcon from "@mui/icons-material/FormatListNumbered";
import ImageIcon from "@mui/icons-material/Image";

import { useTranslation } from "react-i18next";

interface Props {
  editor: Editor | null;
  onImageAddRequest: () => void;
}

export function DocumentEditorToolbar({ editor, onImageAddRequest }: Props) {
  const { t } = useTranslation();

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
      <Tooltip title={t("editor.bold")}>
        <IconButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          color={editor.isActive("bold") ? "primary" : "default"}
        >
          <FormatBoldIcon />
        </IconButton>
      </Tooltip>

      <Tooltip title={t("editor.italic")}>
        <IconButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          color={editor.isActive("italic") ? "primary" : "default"}
        >
          <FormatItalicIcon />
        </IconButton>
      </Tooltip>

      <Tooltip title={t("editor.bulletList")}>
        <IconButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          color={editor.isActive("bulletList") ? "primary" : "default"}
        >
          <FormatListBulletedIcon />
        </IconButton>
      </Tooltip>

      <Tooltip title={t("editor.numberedList")}>
        <IconButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          color={editor.isActive("orderedList") ? "primary" : "default"}
        >
          <FormatListNumberedIcon />
        </IconButton>
      </Tooltip>

      <Tooltip title={t("editor.insertImage")}>
        <IconButton onClick={onImageAddRequest}>
          <ImageIcon />
        </IconButton>
      </Tooltip>
    </Box>
  );
}
