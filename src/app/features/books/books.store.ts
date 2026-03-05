import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Actions, ofType } from '@ngrx/effects';
import { concatLatestFrom } from '@ngrx/operators';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ComponentStore } from '@ngrx/component-store';
import { BookApiActions, BookPageActions } from './state/book.actions';
import { bookFeature } from './state';

interface BooksListState {
  isLoading: boolean;
  error: string | null;
  filterGenre: string;
  skeletons: number[];
}

@Injectable()
export class BooksStore extends ComponentStore<BooksListState> {
  private readonly actions$ = inject(Actions);
  private readonly store = inject(Store);

  private readonly books = this.store.selectSignal(bookFeature.selectAll);

  readonly filteredBooks = this.selectSignal((state) => {
    const books = this.books();
    const filter = state.filterGenre.toLowerCase().trim();
    if (!filter) return books;
    return books.filter((book) => book.genre.toLowerCase().includes(filter));
  });

  readonly vm = this.selectSignal((state) => ({
    ...state,
    books: this.filteredBooks(),
  }));

  constructor() {
    super({ isLoading: false, error: null, filterGenre: '', skeletons: Array(9).fill(0) });

    this.actions$
      .pipe(
        ofType(BookPageActions.loadBooks),
        concatLatestFrom(() => this.store.select(bookFeature.selectLastFetchedAt)),
        takeUntilDestroyed(),
      )
      .subscribe(([_, lastFetchedAt]) => {
        this.patchState({
          isLoading: lastFetchedAt === null,
          error: null,
        });
      });

    this.actions$
      .pipe(ofType(BookApiActions.loadBooksSuccess), takeUntilDestroyed())
      .subscribe(() => this.patchState({ isLoading: false, error: null }));

    this.actions$
      .pipe(ofType(BookApiActions.loadBooksFailure), takeUntilDestroyed())
      .subscribe(({ error }) => this.patchState({ isLoading: false, error }));
  }

  setFilterGenre(genre: string): void {
    this.patchState({ filterGenre: genre });
  }
}
