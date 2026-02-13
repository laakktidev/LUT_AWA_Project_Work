export interface Presentation {
  _id: string;
  title: string;
  type: "presentation";
  slides: Slide[];
  userId: string;
  editors: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface Slide {
  title: string;
  bullets: string[];
}
