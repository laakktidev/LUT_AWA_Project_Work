/**
 * Represents a user‑created presentation consisting of multiple slides.
 * Includes ownership, editor permissions, and metadata.
 */
export interface Presentation {
  /** Unique identifier for the presentation. */
  _id: string;

  /** Title displayed in the UI and used for search. */
  title: string;

  /** Fixed type identifier for this model. */
  type: "presentation";

  /** Ordered list of slides that make up the presentation. */
  slides: Slide[];

  /** ID of the user who owns the presentation. */
  userId: string;

  /** List of user IDs with edit permissions. */
  editors: string[];

  /** Timestamp when the presentation was created. */
  createdAt?: string;

  /** Timestamp when the presentation was last updated. */
  updatedAt?: string;
}

/**
 * Represents a single slide within a presentation.
 */
export interface Slide {
  /** Title displayed at the top of the slide. */
  title: string;

  /** Bullet points or key ideas shown on the slide. */
  bullets: string[];
}
