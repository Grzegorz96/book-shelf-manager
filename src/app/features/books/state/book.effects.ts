import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatLatestFrom, mapResponse } from '@ngrx/operators';
import { map, switchMap, exhaustMap } from 'rxjs/operators';
import { BooksApi } from '../books.api';
import { BookApiActions, BookPageActions } from './book.actions';
import { Store } from '@ngrx/store';
import { bookFeature } from './book.feature';
import { EMPTY } from 'rxjs';
import { ErrorModalActions } from '@app/shared/error-modal/state';
import { toErrorMessage } from '@app/core/utils';
import { RouterActions } from '@app/core/state/router';
import { BOOKS_STALE_TIME } from './book.constants';

@Injectable()
export class BooksEffects {
  private readonly actions$ = inject(Actions);
  private readonly store = inject(Store);
  private readonly booksApi = inject(BooksApi);

  loadBooks$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BookPageActions.loadBooks),
      concatLatestFrom(() => [
        this.store.select(bookFeature.selectLastFetchedAt),
        this.store.select(bookFeature.selectHasData),
      ]),
      switchMap(([_, lastFetchedAt, hasData]) => {
        const isDataStale = !lastFetchedAt || Date.now() - lastFetchedAt > BOOKS_STALE_TIME;

        if (!hasData) {
          return this.booksApi.getBooks().pipe(
            mapResponse({
              next: (books) => BookApiActions.loadBooksSuccess({ books }),
              error: (error: unknown) =>
                BookApiActions.loadBooksFailure({
                  error: toErrorMessage(error),
                }),
            }),
          );
        }

        if (!isDataStale) {
          return EMPTY;
        }

        return this.booksApi.getBooks().pipe(
          mapResponse({
            next: (books) => BookApiActions.loadBooksSuccess({ books }),
            error: () => BookApiActions.loadBooksBackgroundFailure(),
          }),
        );
      }),
    ),
  );

  deleteBook$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BookPageActions.deleteBook),
      exhaustMap(({ id }) =>
        this.booksApi.deleteBook(id).pipe(
          mapResponse({
            next: () => BookApiActions.deleteBookSuccess({ id }),
            error: (error: unknown) =>
              ErrorModalActions.open({
                title: 'Error deleting book',
                message: toErrorMessage(error),
                retryLabel: 'Retry',
                onRetry: BookPageActions.deleteBook({ id }),
              }),
          }),
        ),
      ),
    ),
  );

  toggleFavorite$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BookPageActions.toggleFavorite),
      concatLatestFrom(({ id }) =>
        this.store.select(bookFeature.selectEntities).pipe(map((entities) => entities[id])),
      ),
      exhaustMap(([{ id }, book]) => {
        if (!book) {
          return EMPTY;
        }

        return this.booksApi.toggleFavorite(id, !book.isFavorite).pipe(
          mapResponse({
            next: () => BookApiActions.toggleFavoriteSuccess({ id }),
            error: (error: unknown) =>
              ErrorModalActions.open({
                title: 'Error updating favorite',
                message: toErrorMessage(error),
                retryLabel: 'Retry',
                onRetry: BookPageActions.toggleFavorite({ id }),
              }),
          }),
        );
      }),
    ),
  );

  updateBook$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BookPageActions.updateBook),
      exhaustMap(({ id, changes }) =>
        this.booksApi.updateBook(id, changes).pipe(
          mapResponse({
            next: () => BookApiActions.updateBookSuccess({ id, changes }),
            error: (error: unknown) =>
              BookApiActions.updateBookFailure({
                error: toErrorMessage(error),
                retryAction: BookPageActions.updateBook({ id, changes }),
              }),
          }),
        ),
      ),
    ),
  );

  createBook$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BookPageActions.createBook),
      exhaustMap(({ newBook }) =>
        this.booksApi.createBook(newBook).pipe(
          mapResponse({
            next: (createdBook) => BookApiActions.createBookSuccess({ createdBook }),
            error: (error: unknown) =>
              BookApiActions.createBookFailure({
                error: toErrorMessage(error),
                retryAction: BookPageActions.createBook({ newBook }),
              }),
          }),
        ),
      ),
    ),
  );

  saveBookFailure$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BookApiActions.updateBookFailure, BookApiActions.createBookFailure),
      map((action) =>
        ErrorModalActions.open({
          title:
            action.type === BookApiActions.updateBookFailure.type
              ? 'Error updating book'
              : 'Error creating book',
          message: action.error,
          retryLabel: 'Retry',
          onRetry: action.retryAction,
        }),
      ),
    ),
  );

  $redirectAfterSuccessBookAction$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BookApiActions.updateBookSuccess, BookApiActions.createBookSuccess),
      map(() => RouterActions.navigate({ path: ['/books'] })),
    ),
  );
}
