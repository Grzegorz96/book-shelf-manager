import { Component, inject } from '@angular/core';
import { BookCardComponent } from './book-card/book-card.component';
import { BookCardSkeletonComponent } from './book-card-skeleton/book-card-skeleton.component';
import { LucideAngularModule } from 'lucide-angular';
import { FilterBarComponent } from './filter-bar/filter-bar.component';
import { RouterOutlet } from '@angular/router';
import { Store } from '@ngrx/store';
import { BookPageActions } from '@app/features/books/state';
import { RouterActions } from '@app/core/state/router';
import { BooksStore } from './books.store';

@Component({
  selector: 'app-books',
  imports: [
    BookCardComponent,
    BookCardSkeletonComponent,
    LucideAngularModule,
    FilterBarComponent,
    RouterOutlet,
  ],
  providers: [BooksStore],
  templateUrl: './books.component.html',
  styleUrl: './books.component.scss',
})
export class BooksComponent {
  private readonly store = inject(Store);
  protected readonly booksStore = inject(BooksStore);

  protected readonly vm = this.booksStore.vm;

  constructor() {
    this.store.dispatch(BookPageActions.loadBooks());
  }

  handleRetry(): void {
    this.store.dispatch(BookPageActions.loadBooks());
  }

  handleDeleteBook(id: string): void {
    if (confirm('Are you sure you want to delete this book?')) {
      this.store.dispatch(BookPageActions.deleteBook({ id }));
    }
  }

  handleToggleFavorite(id: string): void {
    this.store.dispatch(BookPageActions.toggleFavorite({ id }));
  }

  handleFilterOutput(category: string): void {
    this.booksStore.setFilterGenre(category);
  }

  handleViewDetails(id: string): void {
    this.store.dispatch(RouterActions.navigate({ path: ['/books', id, 'details'] }));
  }

  handleAddBook(): void {
    this.store.dispatch(RouterActions.navigate({ path: ['/books/new'] }));
  }

  handleEditBook(id: string): void {
    this.store.dispatch(RouterActions.navigate({ path: ['/books', id, 'edit'] }));
  }
}
