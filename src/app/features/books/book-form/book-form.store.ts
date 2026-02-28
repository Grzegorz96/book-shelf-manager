import { Injectable, computed, inject, signal, effect } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { tapResponse } from '@ngrx/operators';
import { Store } from '@ngrx/store';
import { filter, switchMap, tap, EMPTY } from 'rxjs';
import { BooksApi } from '../books.api';
import { Book } from '../models';
import { BookPageActions } from '../state/book.actions';
import { ErrorModalActions } from '@app/shared/error-modal/state';
import { RouterActions, selectRouteParam } from '@app/core/state/router';
import { toErrorMessage } from '@app/core/utils';
import { form, required, minLength, max, submit } from '@angular/forms/signals';
import { bookFeature } from '../state/book.feature';

interface BookFormState {
  data: Book | null;
  isLoading: boolean;
  error: string | null;
}

type BookFormModel = Omit<Book, 'id'>;

@Injectable()
export class BookFormStore extends ComponentStore<BookFormState> {
  private readonly store = inject(Store);
  private readonly booksApi = inject(BooksApi);
  private readonly bookId = this.store.selectSignal(selectRouteParam('id'));
  private readonly isSaving = this.store.selectSignal(bookFeature.selectIsSaving);
  private readonly currentBook = this.store.selectSignal(bookFeature.selectCurrentBook);

  private readonly _bookFormSignal = signal<BookFormModel>({
    title: '',
    author: '',
    year: new Date().getFullYear(),
    description: '',
    genre: '',
    isFavorite: false,
  });

  private setBook(book: Book): void {
    this.patchState({ data: book, isLoading: false });
    this._bookFormSignal.set({
      title: book.title,
      author: book.author,
      year: book.year,
      description: book.description,
      genre: book.genre,
      isFavorite: book.isFavorite,
    });
  }

  readonly vm = computed(() => ({
    data: this.state().data,
    isLoading: this.state().isLoading,
    error: this.state().error,
    isSaving: this.isSaving(),
    bookForm: this.bookForm,
  }));

  readonly bookForm = form(this._bookFormSignal, (fieldPath) => {
    const currentYear = new Date().getFullYear();

    required(fieldPath.title, { message: 'Title is required' });
    minLength(fieldPath.title, 2, { message: 'Title must be at least 2 character' });
    required(fieldPath.author, { message: 'Author is required' });
    minLength(fieldPath.author, 2, { message: 'Author must be at least 2 character' });
    required(fieldPath.year, { message: 'Year is required' });
    max(fieldPath.year, currentYear, { message: `Year must be in the past` });
    required(fieldPath.description, { message: 'Description is required' });
    minLength(fieldPath.description, 10, { message: 'Description must be at least 10 characters' });
    required(fieldPath.genre, { message: 'Genre is required' });
    minLength(fieldPath.genre, 2, { message: 'Genre must be at least 2 character' });
  });

  readonly loadBook = this.effect<string | undefined>((id$) =>
    id$.pipe(
      filter((id): id is string => !!id),
      tap(() => this.patchState({ data: null, isLoading: true, error: null })),
      switchMap((id) => {
        const bookFromStore = this.currentBook();

        if (bookFromStore) {
          this.setBook(bookFromStore);
          return EMPTY;
        }

        return this.booksApi.getBook(id).pipe(
          tapResponse({
            next: (book) => this.setBook(book),
            error: (err: unknown) => {
              this.patchState({ data: null, isLoading: false, error: toErrorMessage(err) });
              this.store.dispatch(
                ErrorModalActions.open({
                  title: 'Error getting book',
                  message: toErrorMessage(err),
                  dismissLabel: 'Back to Library',
                  onDismiss: RouterActions.navigate({ path: ['/books'] }),
                }),
              );
            },
          }),
        );
      }),
    ),
  );

  constructor() {
    super({ data: null, isLoading: false, error: null });

    effect(() => {
      this.loadBook(this.bookId());
    });
  }

  handleSubmit(): void {
    submit(this.bookForm, async (form) => {
      const id = this.bookId();
      const formValue = form().value();

      if (id) {
        this.store.dispatch(BookPageActions.updateBook({ id, changes: formValue }));
      } else {
        this.store.dispatch(BookPageActions.createBook({ newBook: formValue }));
      }
    });
  }

  handleCancel(): void {
    this.store.dispatch(RouterActions.navigate({ path: ['/books'] }));
  }
}
