/**
 * Represents a user‑created document within the system.
 * Includes ownership, visibility, deletion state, and metadata.
 */
export interface Document {
  /** Unique identifier for the document. */
  _id: string;

  /** Title displayed in the UI and used for search. */
  title: string;

  /** Fixed type identifier for this model. */
  type: "document";

  /** Rich‑text or HTML content of the document. */
  content: string;

  /** ID of the user who owns the document. */
  userId: string;

  /** List of user IDs with edit permissions. */
  editors: string[];

  /** Whether the document is publicly accessible. */
  isPublic: boolean;

  /** Whether the document is soft‑deleted. */
  isDeleted?: boolean;

  /** Timestamp when the document was soft‑deleted. */
  deletedAt?: string;

  /** Timestamp when the document was created. */
  createdAt?: string;

  /** Timestamp when the document was last updated. */
  updatedAt?: string;
}
