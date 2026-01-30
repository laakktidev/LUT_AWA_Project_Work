export interface ISlide {
  header: string;
  bullets: string[];
}

export interface ISlideDeck {
  _id?: string;
  title: string;
  slides: ISlide[];
  userId?: string;
  createdAt?: string;
}
