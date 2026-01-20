export interface PublicVisibilityProps {
  isOwner: boolean;
  isPublic: boolean;
  documentId: string;
  onTogglePublic: (value: boolean) => void;
}
