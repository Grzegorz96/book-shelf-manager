import { inject, Injectable } from '@angular/core';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { BoardItem } from './models';
import { getNewOrder } from '@app/core/utils';
import { Store } from '@ngrx/store';
import { BookPageActions } from '@app/features/books/state';
import { BookReadingStatus } from '../books/models';

@Injectable()
export class BoardStore {
  private readonly store = inject(Store);

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
