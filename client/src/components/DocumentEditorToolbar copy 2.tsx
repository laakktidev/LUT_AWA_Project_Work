import { Editor } from "@tiptap/react";
import { Box, IconButton, Tooltip } from "@mui/material";

import FormatBoldIcon from "@mui/icons-material/FormatBold";
import FormatItalicIcon from "@mui/icons-material/FormatItalic";
import TitleIcon from "@mui/icons-material/Title";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import ImageIcon from "@mui/icons-material/Image";

interface Props {
  editor: Editor | null;
  onImageUpload: () => void;
}

export function DocumentEditorToolbar({ editor, onImageUpload }: Props) {
  if (!editor) return null;

  return (
    <Box display="flex" gap={1} mb={1}>
      <Tooltip title="Bold">
        <IconButton onClick={() => editor.chain().focus().toggleBold().run()}>
          <FormatBoldIcon />
        </IconButton>
      </Tooltip>

      <Tooltip title="Italic">
        <IconButton onClick={() => editor.chain().focus().toggleItalic().run()}>
          <FormatItalicIcon />
        </IconButton>
      </Tooltip>

      <Tooltip title="Heading 2">
        <IconButton
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
        >
          <TitleIcon />
        </IconButton>
      </Tooltip>

      <Tooltip title="Bullet List">
        <IconButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          <FormatListBulletedIcon />
        </IconButton>
      </Tooltip>

      <Tooltip title="Insert Image">
        <IconButton onClick={onImageUpload}>
          <ImageIcon />
        </IconButton>
      </Tooltip>
    </Box>
  );
}
