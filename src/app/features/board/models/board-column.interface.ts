export interface BoardItem {
  id: string;
  title: string;
  author: string;
  year: number;
  genre: string;
  isFavorite: boolean;
  order: string;
}

export interface BoardColumn {
  id: string;
  title: string;
  items: BoardItem[];
}
