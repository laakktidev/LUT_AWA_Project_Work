import i18n from "i18next";
import { Tabs, Tab } from "@mui/material";
import { useState } from "react";

/**
 * Switches the application's language between English and Finnish.
 *
 * @remarks
 * - Uses **i18next** as the underlying internationalization engine.
 * - Displays two tabs: **EN** and **FI**.
 * - Updates both the UI state and the active i18next language when changed.
 *
 * This component is intentionally simple and self‑contained. It does not
 * persist language settings; persistence is handled by i18next configuration.
 *
 * @returns JSX element containing the language switcher tabs.
 */
export function LanguageSwitcher() {
  /** Current language based on i18next state. Defaults to English. */
  const currentLang = i18n.language === "fi" ? "fi" : "en";

  /** Local UI state for the selected tab. */
  const [value, setValue] = useState(currentLang);

  /**
   * Handles language tab changes.
   *
   * @param _ - Unused event parameter.
   * @param newValue - Selected language code ("en" or "fi").
   */
  const handleChange = (_: unknown, newValue: string) => {
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
