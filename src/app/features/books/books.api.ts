import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { type Book, type BookReadingStatus } from './models';

import { delay, Observable, timer, throwError } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class BooksApi {
  private readonly baseUrl = 'http://localhost:3000';
  private readonly http = inject(HttpClient);

  public getBooks(): Observable<Book[]> {
    return this.http.get<Book[]>(`${this.baseUrl}/books`).pipe(
      delay(500),
      // switchMap(() => throwError(() => new Error('Symulowany błąd ładowania książekxdddd'))),
    );
  }

  public getBook(id: string): Observable<Book> {
    // return timer(1000).pipe(
    //   switchMap(() => throwError(() => new Error('Symulowany błąd ładowania książki'))),
    // );
    return this.http.get<Book>(`${this.baseUrl}/books/${id}`).pipe(delay(500));
  }

  public createBook(book: Omit<Book, 'id'>): Observable<Book> {
    // return timer(1000).pipe(
    //   switchMap(() => throwError(() => new Error('Symulowany błąd tworzenia książki'))),
    // );
    return this.http.post<Book>(`${this.baseUrl}/books`, book).pipe(delay(2000));
  }

  public updateBook(id: string, book: Partial<Book>): Observable<Book> {
    // return timer(2000).pipe(
    //   switchMap(() =>
    //     throwError(() => new Error('Symulowany błąd aktualizacji ulubionej książki')),
    //   ),
    // );
    return this.http.patch<Book>(`${this.baseUrl}/books/${id}`, book).pipe(delay(2000));
  }

  public deleteBook(id: string): Observable<Book> {
    // return timer(1000).pipe(
    //   switchMap(() => throwError(() => new Error('Symulowany błąd usuwania książki'))),
    // );
    return this.http.delete<Book>(`${this.baseUrl}/books/${id}`).pipe(delay(500));
  }

  public toggleFavorite(id: string, isFavorite: boolean): Observable<Book> {
    // return timer(1000).pipe(
    //   switchMap(() =>
    //     throwError(() => new Error('Symulowany błąd aktualizacji ulubionej książki')),
    //   ),
    // );
    return this.http.patch<Book>(`${this.baseUrl}/books/${id}`, { isFavorite }).pipe(delay(200));
  }

  public updateBookPosition(
    id: string,
    status: BookReadingStatus,
    order: string,
  ): Observable<Book> {
    const position = { status, order };
    // return timer(1000).pipe(
    //   switchMap(() => throwError(() => new Error('Symulowany błąd aktualizacji pozycji książki'))),
    // );
    return this.http.patch<Book>(`${this.baseUrl}/books/${id}`, position).pipe(delay(300));
  }
}
