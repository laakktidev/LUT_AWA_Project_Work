export interface PublicVisibilityProps {
  isOwner: boolean;
  isPublic: boolean;
  documentId: string;
  docTitle: string;
  onTogglePublic: (value: boolean) => void;
  //token: string;
}
