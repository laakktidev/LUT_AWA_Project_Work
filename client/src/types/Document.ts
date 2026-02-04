export interface Document {
  _id: string;
  title: string;
  type: "document";
  content: string;
  userId: string;
  editors: string[];
  isPublic: boolean;
  isDeleted?: boolean;
  deletedAt?: string;
  createdAt?: string;
  updatedAt?: string;
}
