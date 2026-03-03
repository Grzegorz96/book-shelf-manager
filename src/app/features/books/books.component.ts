import { Component, inject, signal, computed } from '@angular/core';
import { BookCardComponent } from './book-card/book-card.component';
import { BookCardSkeletonComponent } from './book-card-skeleton/book-card-skeleton.component';
import { LucideAngularModule } from 'lucide-angular';
import { FilterBarComponent } from './filter-bar/filter-bar.component';
import { RouterOutlet } from '@angular/router';
import { Store } from '@ngrx/store';
import { bookFeature, BookPageActions } from '@app/features/books/state';
import { RouterActions } from '@app/core/state/router';

@Component({
  selector: 'app-books',
  imports: [
    BookCardComponent,
    BookCardSkeletonComponent,
    LucideAngularModule,
    FilterBarComponent,
    RouterOutlet,
  ],
  templateUrl: './books.component.html',
  styleUrl: './books.component.scss',
})
export class BooksComponent {
  private readonly store = inject(Store);

  protected readonly skeletons = Array(9).fill(0);
  protected readonly filterGenre = signal<string>('');

  protected readonly vm = this.store.selectSignal(bookFeature.selectVm);

  protected readonly filteredBooks = computed(() => {
    const books = this.vm().books ?? [];
    const filter = this.filterGenre().toLowerCase().trim();
    if (!filter) return books;
    return books.filter((book) => book.genre.toLowerCase().includes(filter));
  });

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
    this.filterGenre.set(category);
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
