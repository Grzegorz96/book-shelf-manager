import { EntityState, createEntityAdapter } from '@ngrx/entity';
import { Book } from '../models';
import { createReducer, on, createFeature, createSelector } from '@ngrx/store';
import { BookPageActions, BookApiActions } from './book.actions';
import { selectRouteParams } from '@app/core/state/router';

export interface State extends EntityState<Book> {
  error: string | null;
  isLoading: boolean;
  isSaving: boolean;
  lastFetchedAt: number | null;
}

const adapter = createEntityAdapter<Book>();

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

    return {
      ...adapterSelectors,
      selectHasData,
      selectCurrentBook,
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
