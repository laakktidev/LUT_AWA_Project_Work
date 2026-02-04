export type ItemType = "document" | "slide";

export interface IListItem {
  _id: string;
  title: string;
  updatedAt: string;
  type: ItemType;
}
