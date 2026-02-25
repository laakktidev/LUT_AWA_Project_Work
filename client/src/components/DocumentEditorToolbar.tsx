import { Editor } from "@tiptap/react";
import { Box, IconButton, Tooltip } from "@mui/material";

import FormatBoldIcon from "@mui/icons-material/FormatBold";
import FormatItalicIcon from "@mui/icons-material/FormatItalic";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import FormatListNumberedIcon from "@mui/icons-material/FormatListNumbered";
import ImageIcon from "@mui/icons-material/Image";

import { useTranslation } from "react-i18next";

/**
 * Props for {@link DocumentEditorToolbar}.
 *
 * @remarks
 * The toolbar is stateless and delegates all formatting actions
 * to the provided Tiptap {@link Editor} instance.
 */
export interface DocumentEditorToolbarProps {
  /**
   * Active Tiptap editor instance.
   *
   * @remarks
   * If this is `null`, the toolbar is not rendered.
   */
  editor: Editor | null;

  /**
   * Callback fired when the user clicks the “insert image” button.
   *
   * @remarks
   * The parent component is responsible for handling image selection
   * and inserting the image into the editor.
   */
  onImageAddRequest: () => void;
}

/**
 * Toolbar for the rich text document editor.
 *
 * @remarks
 * Provides formatting controls for:
 * - bold
 * - italic
 * - bullet list
 * - numbered list
 * - image insertion
 *
 * Icons automatically adapt to light/dark mode using theme colors.
 *
 * @param props - {@link DocumentEditorToolbarProps}
 * @returns A formatting toolbar for the document editor, or `null` if no editor is available.
 */
export function DocumentEditorToolbar({
  editor,
  onImageAddRequest,
}: DocumentEditorToolbarProps) {
  const { t } = useTranslation();

  if (!editor) return null;

  return (
    <Box
      sx={{
        display: "flex",
        gap: 1,
        mb: 1,
        border: "1px solid",
        borderColor: (theme) => theme.palette.divider,
        borderRadius: "8px",
        padding: "6px",
        backgroundColor: (theme) => theme.palette.background.paper,
        color: (theme) => theme.palette.text.primary,
      }}
    >
      <Tooltip title={t("editor.bold")}>
        <IconButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          color={editor.isActive("bold") ? "primary" : "inherit"}
        >
          <FormatBoldIcon sx={{ color: "inherit" }} />
        </IconButton>
      </Tooltip>

      <Tooltip title={t("editor.italic")}>
        <IconButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          color={editor.isActive("italic") ? "primary" : "inherit"}
        >
          <FormatItalicIcon sx={{ color: "inherit" }} />
        </IconButton>
      </Tooltip>

      <Tooltip title={t("editor.bulletList")}>
        <IconButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          color={editor.isActive("bulletList") ? "primary" : "inherit"}
        >
          <FormatListBulletedIcon sx={{ color: "inherit" }} />
        </IconButton>
      </Tooltip>

      <Tooltip title={t("editor.numberedList")}>
        <IconButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          color={editor.isActive("orderedList") ? "primary" : "inherit"}
        >
          <FormatListNumberedIcon sx={{ color: "inherit" }} />
        </IconButton>
      </Tooltip>

      <Tooltip title={t("editor.insertImage")}>
        <IconButton color="inherit" onClick={onImageAddRequest}>
          <ImageIcon sx={{ color: "inherit" }} />
        </IconButton>
      </Tooltip>
      
    </Box>
  );
}
