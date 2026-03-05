import { EntityState, createEntityAdapter } from '@ngrx/entity';
import { Book } from '../models';
import { createReducer, on, createFeature, createSelector } from '@ngrx/store';
import { BookPageActions, BookApiActions } from './book.actions';
import { AuthPageActions } from '@app/core/state/auth/auth.actions';
import { selectRouteParams } from '@app/core/state/router';
import { DEFAULT_BOOK_STATUS } from './book.constants';

export interface State extends EntityState<Book> {
  lastFetchedAt: number | null;
}

const adapter = createEntityAdapter<Book>();

export const initialState: State = adapter.getInitialState({
  lastFetchedAt: null,
});

const reducer = createReducer(
  initialState,
  on(BookApiActions.updateBookSuccess, (state, update) => adapter.updateOne(update, state)),
  on(BookApiActions.createBookSuccess, (state, { createdBook }) =>
    adapter.addOne(createdBook, state),
  ),
  on(BookApiActions.loadBooksSuccess, (state, { books }) =>
    adapter.setAll(books, {
      ...state,
      lastFetchedAt: Date.now(),
    }),
  ),
  on(BookApiActions.deleteBookSuccess, (state, { id }) => adapter.removeOne(id, state)),
  on(BookApiActions.toggleFavoriteSuccess, (state, { id }) =>
    adapter.updateOne({ id, changes: { isFavorite: !state.entities[id]?.isFavorite } }, state),
  ),
  on(BookPageActions.updateBookPosition, (state, { id, newStatus, newOrder }) =>
    adapter.updateOne({ id, changes: { status: newStatus, order: newOrder } }, state),
  ),
  on(BookApiActions.updateBookPositionFailure, (state, { id, oldStatus, oldOrder }) =>
    adapter.updateOne({ id, changes: { status: oldStatus, order: oldOrder } }, state),
  ),
  on(AuthPageActions.signOut, () => initialState),
);

export const bookFeature = createFeature({
  reducer,
  name: 'books',

  extraSelectors: ({ selectBooksState }) => {
    const adapterSelectors = adapter.getSelectors(selectBooksState);

    const selectCurrentBook = createSelector(
      selectRouteParams,
      adapterSelectors.selectEntities,
      (params, entities) => (params['id'] ? entities[params['id']] : undefined),
    );

    const selectLastOrderInTodo = createSelector(
      adapterSelectors.selectAll,
      (books): string | null => {
        const booksInStatus = books
          .filter((b) => b.status === DEFAULT_BOOK_STATUS)
          .sort((a, b) => (a.order < b.order ? -1 : 1));

        const lastBook = booksInStatus[booksInStatus.length - 1];

        return lastBook?.order ?? null;
      },
    );

    return {
      ...adapterSelectors,
      selectCurrentBook,
      selectLastOrderInTodo,
    };
  },
});
