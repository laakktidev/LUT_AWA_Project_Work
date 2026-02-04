import i18n from "i18next";
import { Button, Stack } from "@mui/material";

export function LanguageSwitcher() {
  return (
    <Stack direction="row" spacing={1}>
      <Button size="small" color="inherit" onClick={() => i18n.changeLanguage("en")}>
        EN
      </Button>
      <Button size="small" color="inherit" onClick={() => i18n.changeLanguage("fi")}>
        FI
      </Button>
    </Stack>
  );
}
