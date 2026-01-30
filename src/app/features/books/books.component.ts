import { Component, inject, signal, resource, effect, computed } from '@angular/core';
import { BooksService } from './books.service';
import { BookCardComponent } from './book-card/book-card.component';
import { BookCardSkeletonComponent } from './book-card-skeleton/book-card-skeleton.component';
import { LucideAngularModule } from 'lucide-angular';
import { ErrorModalService } from '@shared/error-modal';
import { FilterBarComponent } from './filter-bar/filter-bar.component';
import { Router, RouterOutlet } from '@angular/router';

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
  private readonly router = inject(Router);
  private readonly booksService = inject(BooksService);
  private readonly errorModalService = inject(ErrorModalService);
  protected readonly booksResource = this.booksService.booksResource;
  protected readonly skeletons = Array(9).fill(0);
  protected readonly filterGenre = signal<string>('');

  constructor() {
    effect(() => {
      if (this.booksResource.error()) {
        this.errorModalService.openErrorModal({
          title: 'Error loading books',
          message: 'An error occurred while loading the books.',
          actionLabel: 'Retry',
          onAction: (): void => {
            this.booksService.reloadCache();
          },
        });
      }
    });
  }

  protected readonly filteredBooks = computed(() => {
    if (!this.booksResource.hasValue()) return [];

    const allBooks = this.booksResource.value();
    const filter = this.filterGenre().toLowerCase().trim();

    if (!filter) return allBooks;

    return allBooks.filter((book) => book.genre.toLowerCase().includes(filter));
  });

  async handleDeleteBook(id: string): Promise<void> {
    if (confirm('Are you sure you want to delete this book?')) {
      try {
        const deletedBook = await this.booksService.deleteBook(id);
        this.booksService.updateCacheAfterDelete(deletedBook.id);
      } catch {
        this.errorModalService.openErrorModal({
          title: 'Error deleting book',
          message: 'An error occurred while deleting the book.',
          actionLabel: 'Retry',
          onAction: (): Promise<void> => this.handleDeleteBook(id),
        });
      }
    }
  }

  async handleToggleFavorite(id: string, isFavorite: boolean): Promise<void> {
    try {
      const updatedBook = await this.booksService.toggleFavorite(id, isFavorite);
      this.booksService.updateCacheAfterToggleFavorite(updatedBook);
    } catch {
      this.errorModalService.openErrorModal({
        title: 'Error updating favorite',
        message: 'An error occurred while updating the book.',
        actionLabel: 'Retry',
        onAction: (): Promise<void> => this.handleToggleFavorite(id, isFavorite),
      });
    }
  }

  handleFilterOutput(category: string) {
    this.filterGenre.set(category);
  }

  handleViewDetails(id: string) {
    this.router.navigate(['/books', id, 'details']);
  }

  handleAddBook() {
    this.router.navigate(['/books/new']);
  }

  handleEditBook(id: string) {
    this.router.navigate(['/books', id, 'edit']);
  }
}
