/**
 * Props for controlling and displaying the public visibility
 * state of a document within the UI.
 */
export interface PublicVisibilityProps {
  /** Whether the current user is the owner of the document. */
  isOwner: boolean;

  /** Whether the document is currently publicly accessible. */
  isPublic: boolean;

  /** Unique identifier of the document. */
  documentId: string;

  /** Title of the document, used for UI display. */
  docTitle: string;

  /** Callback triggered when the public visibility is toggled. */
  onTogglePublic: (value: boolean) => void;
}
