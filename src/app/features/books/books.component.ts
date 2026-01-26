import { Component, inject, signal, resource, effect } from '@angular/core';
import { BooksService } from './books.service';
import { Book } from './book.interface';
import { BookCardComponent } from './book-card/book-card';
import { BookCardSkeletonComponent } from './book-card-skeleton/book-card-skeleton';
import { BookFormComponent } from './book-form/book-form';
import { BookDetailsComponent } from './book-details/book-details';
import { LucideAngularModule } from 'lucide-angular';
import { ErrorModalService } from '@shared/error-modal';
import { ScrollLockDirective } from '@core/services';

@Component({
  selector: 'app-books',
  imports: [
    BookCardComponent,
    BookCardSkeletonComponent,
    BookFormComponent,
    BookDetailsComponent,
    LucideAngularModule,
    ScrollLockDirective,
  ],
  templateUrl: './books.component.html',
  styleUrl: './books.component.scss',
})
export class BooksComponent {
  private readonly booksService = inject(BooksService);
  private readonly errorModalService = inject(ErrorModalService);
  protected readonly booksResource = resource({
    loader: () => this.booksService.getBooks(),
  });
  protected readonly skeletons = Array(9).fill(0);

  protected readonly booksState = signal<{
    showForm: boolean;
    editingBook: Book | null;
    detailedBook: Book | null;
  }>({
    showForm: false,
    editingBook: null,
    detailedBook: null,
  });

  constructor() {
    effect(() => {
      const error = this.booksResource.error();

      if (error) {
        this.errorModalService.openErrorModal({
          title: 'Error loading books',
          message:
            this.booksResource.error()?.message ?? 'An error occurred while loading the books.',
          primaryActionLabel: 'Retry',
          onPrimaryAction: (): void => {
            this.booksResource.reload();
          },
        });
      }
    });
  }

  handleAddBook() {
    this.booksState.set({
      showForm: true,
      editingBook: null,
      detailedBook: null,
    });
  }

  handleEditBook(book: Book) {
    this.booksState.set({
      showForm: true,
      editingBook: book,
      detailedBook: null,
    });
  }

  async handleDeleteBook(id: string): Promise<void> {
    if (confirm('Are you sure you want to delete this book?')) {
      try {
        const deletedBook = await this.booksService.deleteBook(id);

        this.booksResource.update((books) => books!.filter((book) => book.id !== deletedBook.id));
      } catch {
        this.errorModalService.openErrorModal({
          title: 'Error deleting book',
          message: 'An error occurred while deleting the book.',
          primaryActionLabel: 'Retry',
          onPrimaryAction: (): Promise<void> => this.handleDeleteBook(id),
        });
      }
    }
  }

  async handleToggleFavorite(id: string, isFavorite: boolean): Promise<void> {
    try {
      const updatedBook = await this.booksService.toggleFavorite(id, isFavorite);
      this.booksResource.update((books) =>
        books!.map((book) => (book.id === id ? updatedBook : book)),
      );
    } catch {
      this.errorModalService.openErrorModal({
        title: 'Error updating favorite',
        message: 'An error occurred while updating the book.',
        primaryActionLabel: 'Retry',
        onPrimaryAction: (): Promise<void> => this.handleToggleFavorite(id, isFavorite),
      });
    }
  }

  async handleSaveBook(bookData: Omit<Book, 'id'>): Promise<void> {
    const editingBook = this.booksState().editingBook;

    try {
      if (editingBook) {
        const updatedBook = await this.booksService.updateBook(editingBook.id, bookData);
        this.booksResource.update((books) =>
          books!.map((book) => (book.id === editingBook.id ? updatedBook : book)),
        );
      } else {
        const createdBook = await this.booksService.createBook(bookData);
        this.booksResource.update((books) => [...books!, createdBook]);
      }

      this.booksState.update((state) => ({
        ...state,
        showForm: false,
        editingBook: null,
      }));
    } catch {
      this.errorModalService.openErrorModal({
        title: editingBook ? 'Error updating book' : 'Error creating book',
        message: editingBook
          ? 'An error occurred while updating the book.'
          : 'An error occurred while creating the book.',
        primaryActionLabel: 'Retry',
        onPrimaryAction: (): Promise<void> => this.handleSaveBook(bookData),
      });
    }
  }

  handleCancelForm() {
    this.booksState.update((state) => ({
      ...state,
      showForm: false,
      editingBook: null,
    }));
  }

  handleViewDetails(book: Book) {
    this.booksState.set({
      detailedBook: book,
      showForm: false,
      editingBook: null,
    });
  }

  handleCloseDetails() {
    this.booksState.update((state) => ({
      ...state,
      detailedBook: null,
    }));
  }
}
