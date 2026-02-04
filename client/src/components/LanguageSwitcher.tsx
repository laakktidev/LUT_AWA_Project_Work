import i18n from "i18next";
import { Tabs, Tab } from "@mui/material";
import { useState } from "react";

export function LanguageSwitcher() {
  const currentLang = i18n.language === "fi" ? "fi" : "en";
  const [value, setValue] = useState(currentLang);

  const handleChange = (_: any, newValue: string) => {
    setValue(newValue);
    i18n.changeLanguage(newValue);
  };

  return (
    <Tabs
      value={value}
      onChange={handleChange}
      textColor="inherit"
      indicatorColor="secondary"
      sx={{
        minHeight: 0,
        "& .MuiTab-root": {
          minHeight: 0,
          paddingX: 1.5,
          paddingY: 0.5,
          fontSize: "0.8rem",
        },
      }}
    >
      <Tab label="EN" value="en" />
      <Tab label="FI" value="fi" />
    </Tabs>
  );
}
  