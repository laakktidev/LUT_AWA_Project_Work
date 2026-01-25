export interface Document {
  _id: string;
  title: string;
  type: "text" | "presentation";
  content?: string;
  slides?: Slide[];
  userId: string;
  editors: string[];
  isPublic: boolean;
  isDeleted?: boolean;
  deletedAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Slide {
  title: string;
  bullets: string[];
}
