import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Book } from './book.interface';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BooksService {
  private readonly baseUrl = 'http://localhost:3001';
  private readonly http = inject(HttpClient);

  getBooks() {
    return new Promise<Book[]>((resolve) => {
      setTimeout(() => {
        resolve(firstValueFrom(this.http.get<Book[]>(`${this.baseUrl}/books`)));
      }, 1000);
    });
  }

  getBook(id: string) {
    return firstValueFrom(this.http.get<Book>(`${this.baseUrl}/books/${id}`));
  }

  createBook(book: Omit<Book, 'id'>) {
    return firstValueFrom(this.http.post<Book>(`${this.baseUrl}/books`, book));
  }

  updateBook(id: string, book: Partial<Book>) {
    return firstValueFrom(this.http.patch<Book>(`${this.baseUrl}/books/${id}`, book));
  }

  deleteBook(id: string) {
    return firstValueFrom(this.http.delete<Book>(`${this.baseUrl}/books/${id}`));
  }

  toggleFavorite(id: string, isFavorite: boolean) {
    return firstValueFrom(this.http.patch<Book>(`${this.baseUrl}/books/${id}`, { isFavorite }));
  }
}
