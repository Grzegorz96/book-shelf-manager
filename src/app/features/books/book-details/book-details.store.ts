import { Injectable, computed, inject, effect } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { Book } from '../models';
import { Store } from '@ngrx/store';
import { BooksApi } from '../books.api';
import { RouterActions, selectRouteParam } from '@app/core/state/router';
import { EMPTY, filter, switchMap, tap } from 'rxjs';
import { tapResponse } from '@ngrx/operators';
import { toErrorMessage } from '@app/core/utils';
import { ErrorModalActions } from '@app/shared/error-modal/state';
import { bookFeature } from '../state/book.feature';

interface BookDetailsState {
  data: Book | null;
  isLoading: boolean;
  error: string | null;
}

@Injectable()
export class BookDetailsStore extends ComponentStore<BookDetailsState> {
  private readonly store = inject(Store);
  private readonly booksApi = inject(BooksApi);
  private readonly bookId = this.store.selectSignal(selectRouteParam('id'));
  private readonly currentBook = this.store.selectSignal(bookFeature.selectCurrentBook);

  readonly loadBook = this.effect<string | undefined>((id$) =>
    id$.pipe(
      filter((id): id is string => !!id),
      tap(() => this.patchState({ data: null, isLoading: true, error: null })),
      switchMap((id) => {
        const bookFromStore = this.currentBook();

        if (bookFromStore) {
          this.patchState({ data: bookFromStore, isLoading: false });
          return EMPTY;
        }

        return this.booksApi.getBook(id).pipe(
          tapResponse({
            next: (book) => this.patchState({ data: book, isLoading: false }),
            error: (err: unknown) => {
              this.patchState({ error: toErrorMessage(err), isLoading: false });
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

  handleClose(): void {
    this.store.dispatch(RouterActions.navigate({ path: ['/books'] }));
  }
}
