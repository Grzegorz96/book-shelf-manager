export type BookReadingStatus = 'todo' | 'in-progress' | 'done';

export interface Book {
  id: string;
  userId: string;
  title: string;
  author: string;
  year: number;
  description: string;
  genre: string;
  isFavorite: boolean;
  status: BookReadingStatus;
  order: string;
}

export type BookFormData = Omit<Book, 'id' | 'status' | 'order' | 'userId'>;
