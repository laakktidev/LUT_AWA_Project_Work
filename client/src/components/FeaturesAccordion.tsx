import { useState } from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemIcon
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";

interface FeatureGroup {
  /** Title of the feature group shown in the accordion header. */
  title: string;

  /** List of feature descriptions displayed inside the accordion. */
  items: string[];
}

/** Static list of grouped application features displayed in the accordion. */
const featureGroups: FeatureGroup[] = [
  {
    title: "Core Functionality",
    items: [
      "Full CRUD for documents and presentations",
      "Complete documentation of features",
      "React front‑end with Material‑UI",
      "WYSIWYG editor for document editing",
      "Presentation slide editor with titles and bullet lists",
      "PDF download for documents",
      "Creation and update timestamps",
      "Sorting options for documents",
      "Search functionality",
      "Pagination for large lists"
    ]
  },
  {
    title: "User & Media Features",
    items: [
      "User authentication",
      "Profile picture upload",
      "Upload images into documents",
      "Send public document link via email"
    ]
  },
  {
    title: "UI & UX Enhancements",
    items: [
      "Dark and light mode",
      "Recycle bin for deleted items",
      "Clone document feature",
      "Internationalization (English & Finnish)",
      "Modern Material‑UI interface"
    ]
  },
  {
    title: "Quality & Testing",
    items: ["Unit tests + automated tests"]
  }
];

/**
 * Displays an accordion list of grouped application features.
 *
 * @remarks
 * Used inside the **About** modal to present a structured overview of the
 * application's capabilities.  
 * Each accordion panel:
 * - expands independently  
 * - shows a list of bullet‑point features  
 * - uses Material‑UI components for consistent styling  
 *
 * The component is fully self‑contained and does not perform any side effects.
 *
 * @returns JSX element containing the grouped feature accordions.
 */
export function FeaturesAccordion() {
  /** ID of the currently expanded accordion panel (or false if none). */
  const [expanded, setExpanded] = useState<string | false>(false);

  /**
   * Handles accordion expand/collapse behavior.
   *
   * @param panel - ID of the accordion panel being toggled.
   */
  const handleChange =
    (panel: string) => (_event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false);
    };

  return (
    <>
      {featureGroups.map((group, index) => {
        const panelId = `panel-${index}`;

        return (
          <Accordion
            key={panelId}
            expanded={expanded === panelId}
            onChange={handleChange(panelId)}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="subtitle1" fontWeight={200}>
                {group.title}
              </Typography>
            </AccordionSummary>

            <AccordionDetails>
              <List dense>
                {group.items.map((item, i) => (
                  <ListItem key={i}>
                    <ListItemIcon sx={{ minWidth: 24 }}>
                      <FiberManualRecordIcon sx={{ fontSize: 8 }} />
                    </ListItemIcon>
                    <ListItemText primary={item} />
                  </ListItem>
                ))}
              </List>
            </AccordionDetails>
          </Accordion>
        );
      })}
    </>
  );
}
