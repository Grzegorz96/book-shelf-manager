import { Injectable, inject, signal } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { tapResponse } from '@ngrx/operators';
import { Store } from '@ngrx/store';
import { Actions, ofType } from '@ngrx/effects';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter, switchMap, tap, EMPTY } from 'rxjs';
import { BooksApi } from '../books.api';
import { Book, BookFormData } from '../models';
import { BookApiActions, BookPageActions, bookFeature } from '@app/features/books/state';
import { ErrorModalActions } from '@app/shared/error-modal/state';
import { RouterActions, selectRouteParam } from '@app/core/state/router';
import { toErrorMessage } from '@app/core/utils';
import { form, required, minLength, max, submit } from '@angular/forms/signals';

interface BookFormState {
  data: Book | null;
  isLoading: boolean;
  error: string | null;
  isSaving: boolean;
}

@Injectable()
export class BookFormStore extends ComponentStore<BookFormState> {
  private readonly store = inject(Store);
  private readonly booksApi = inject(BooksApi);
  private readonly actions$ = inject(Actions);
  private readonly bookId = this.store.selectSignal(selectRouteParam('id'));
  private readonly currentBook = this.store.selectSignal(bookFeature.selectCurrentBook);

  private readonly _bookFormSignal = signal<BookFormData>({
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

  readonly vm = this.selectSignal((state) => ({
    ...state,
    bookForm: this.bookForm,
  }));

  private readonly bookForm = form(this._bookFormSignal, (fieldPath) => {
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

  constructor() {
    super({ data: null, isLoading: false, error: null, isSaving: false });

    this.actions$
      .pipe(ofType(BookPageActions.createBook, BookPageActions.updateBook), takeUntilDestroyed())
      .subscribe(() => this.patchState({ isSaving: true }));

    this.actions$
      .pipe(
        ofType(
          BookApiActions.createBookSuccess,
          BookApiActions.updateBookSuccess,
          BookApiActions.createBookFailure,
          BookApiActions.updateBookFailure,
        ),
        takeUntilDestroyed(),
      )
      .subscribe(() => this.patchState({ isSaving: false }));
  }

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

  handleSubmit(): void {
    submit(this.bookForm, async (form) => {
      const id = this.bookId();
      const formValue = form().value();

      if (id) {
        this.store.dispatch(BookPageActions.updateBook({ id, changes: formValue }));
      } else {
        this.store.dispatch(BookPageActions.createBook({ formData: formValue }));
      }
    });
  }

  handleCancel(): void {
    this.store.dispatch(RouterActions.navigate({ path: ['/books'] }));
  }
}
