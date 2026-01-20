export interface Document {
  _id: string;
  title: string;
  content: string;
  userId: string;
  editors: string[];
  isPublic: boolean;
  createdAt?: string;
  updatedAt?: string;
}
