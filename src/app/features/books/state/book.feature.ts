import { EntityState, createEntityAdapter } from '@ngrx/entity';
import { Book, BookReadingStatus } from '../models';
import { createReducer, on, createFeature, createSelector } from '@ngrx/store';
import { BookPageActions, BookApiActions } from './book.actions';
import { selectRouteParams } from '@app/core/state/router';
import { BoardColumn } from '@app/features/board/models';
import { DEFAULT_BOOK_STATUS } from './book.constants';

export interface State extends EntityState<Book> {
  error: string | null;
  isLoading: boolean;
  isSaving: boolean;
  lastFetchedAt: number | null;
}

const adapter = createEntityAdapter<Book>();

// const adapter = createEntityAdapter<Book>({
//   sortComparer: (a, b) => a.order.localeCompare(b.order)
// });

export const initialState: State = adapter.getInitialState({
  error: null,
  isLoading: false,
  isSaving: false,
  lastFetchedAt: null,
});

const reducer = createReducer(
  initialState,
  on(BookPageActions.updateBook, (state) => ({
    ...state,
    isSaving: true,
  })),
  on(BookPageActions.createBook, (state) => ({
    ...state,
    isSaving: true,
  })),
  on(BookApiActions.updateBookSuccess, (state, update) =>
    adapter.updateOne(update, { ...state, isSaving: false }),
  ),
  on(BookApiActions.createBookSuccess, (state, { createdBook }) =>
    adapter.addOne(createdBook, { ...state, isSaving: false }),
  ),
  on(BookApiActions.updateBookFailure, (state) => ({
    ...state,
    isSaving: false,
  })),
  on(BookApiActions.createBookFailure, (state) => ({
    ...state,
    isSaving: false,
  })),
  on(BookPageActions.loadBooks, (state) => ({
    ...state,
    error: null,
    isLoading: state.ids.length === 0,
  })),
  on(BookApiActions.loadBooksSuccess, (state, { books }) =>
    adapter.setAll(books, {
      ...state,
      error: null,
      isLoading: false,
      lastFetchedAt: Date.now(),
    }),
  ),
  on(BookApiActions.loadBooksFailure, (state, { error }) => ({
    ...state,
    error: error,
    isLoading: false,
  })),
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
);

export const bookFeature = createFeature({
  reducer,
  name: 'books',

  extraSelectors: ({ selectBooksState, selectIsLoading, selectError }) => {
    const adapterSelectors = adapter.getSelectors(selectBooksState);
    const selectHasData = createSelector(adapterSelectors.selectTotal, (total) => total > 0);

    const selectCurrentBook = createSelector(
      selectRouteParams,
      adapterSelectors.selectEntities,
      (params, entities) => (params['id'] ? entities[params['id']] : undefined),
    );

    const selectColumns = createSelector(adapterSelectors.selectAll, (books): BoardColumn[] => {
      const statuses: { id: BookReadingStatus; title: string }[] = [
        { id: 'todo', title: 'To do' },
        { id: 'in-progress', title: 'In progress' },
        { id: 'done', title: 'Done' },
      ];

      return statuses.map((status) => ({
        id: status.id,
        title: status.title,
        items: books
          .filter((book) => book.status === status.id)
          .sort((a, b) => (a.order < b.order ? -1 : a.order > b.order ? 1 : 0))
          .map((book) => ({
            id: book.id,
            title: book.title,
            author: book.author,
            year: book.year,
            genre: book.genre,
            isFavorite: book.isFavorite,
            order: book.order,
          })),
      }));
    });

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
      selectHasData,
      selectCurrentBook,
      selectColumns,
      selectLastOrderInTodo,
      selectVm: createSelector(
        adapterSelectors.selectAll,
        selectIsLoading,
        selectError,
        (books, isLoading, error) => ({
          books,
          isLoading,
          error,
        }),
      ),
    };
  },
});
