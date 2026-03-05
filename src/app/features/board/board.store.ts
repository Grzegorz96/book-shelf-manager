import { inject, Injectable } from '@angular/core';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { Actions, ofType } from '@ngrx/effects';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ComponentStore } from '@ngrx/component-store';
import { BoardItem, BoardColumn } from './models';
import { getNewOrder } from '@app/core/utils';
import { Store } from '@ngrx/store';
import { BookApiActions, bookFeature, BookPageActions } from '@app/features/books/state';
import { BookReadingStatus } from '../books/models';
import { concatLatestFrom } from '@ngrx/operators';

interface BoardListState {
  isLoading: boolean;
  error: string | null;
}

@Injectable()
export class BoardStore extends ComponentStore<BoardListState> {
  private readonly store = inject(Store);
  private readonly actions$ = inject(Actions);

  private readonly books = this.store.selectSignal(bookFeature.selectAll);

  readonly columns = this.selectSignal<BoardColumn[]>(() => {
    const books = this.books();
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

  readonly vm = this.selectSignal((state) => ({
    ...state,
    columns: this.columns(),
  }));

  constructor() {
    super({ isLoading: false, error: null });

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
      .pipe(
        ofType(BookApiActions.loadBooksSuccess, BookApiActions.loadBooksFailure),
        takeUntilDestroyed(),
      )
      .subscribe(() => this.patchState({ isLoading: false, error: null }));

    this.actions$
      .pipe(ofType(BookApiActions.loadBooksFailure), takeUntilDestroyed())
      .subscribe(({ error }) => this.patchState({ isLoading: false, error }));
  }

  handleDrop(event: CdkDragDrop<BoardItem[]>): void {
    const { previousContainer, container, previousIndex, currentIndex, item } = event;
    const movedBook = item.data as BoardItem;

    if (previousContainer === container && previousIndex === currentIndex) {
      return;
    }

    const targetItems = container.data;
    let prevOrder: string | null = null;
    let nextOrder: string | null = null;

    if (previousContainer === container) {
      if (currentIndex < previousIndex) {
        prevOrder = targetItems[currentIndex - 1]?.order ?? null;
        nextOrder = targetItems[currentIndex]?.order ?? null;
      } else {
        prevOrder = targetItems[currentIndex]?.order ?? null;
        nextOrder = targetItems[currentIndex + 1]?.order ?? null;
      }
    } else {
      prevOrder = targetItems[currentIndex - 1]?.order ?? null;
      nextOrder = targetItems[currentIndex]?.order ?? null;
    }
    const newOrder = getNewOrder(prevOrder, nextOrder);

    this.store.dispatch(
      BookPageActions.updateBookPosition({
        id: movedBook.id,
        newStatus: container.id as BookReadingStatus,
        oldStatus: previousContainer.id as BookReadingStatus,
        newOrder,
        oldOrder: movedBook.order,
      }),
    );
  }
}
