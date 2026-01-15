export interface Document {
  _id: string;
  title: string;
  content: string;
  userId: string;
  editors: string[];
  createdAt?: string;
  updatedAt?: string;
}
