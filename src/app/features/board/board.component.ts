import { Component, inject } from '@angular/core';
import { CdkDrag, CdkDropList, CdkDropListGroup, type CdkDragDrop } from '@angular/cdk/drag-drop';
import { LucideAngularModule } from 'lucide-angular';
import { BookPageActions, bookFeature } from '@app/features/books/state';
import { Store } from '@ngrx/store';
import { BoardSkeletonComponent } from './board-skeleton/board-skeleton.component';
import { BoardStore } from './board.store';
import { BoardItem } from './models';

@Component({
  selector: 'app-bookboard',
  imports: [CdkDropListGroup, CdkDropList, CdkDrag, LucideAngularModule, BoardSkeletonComponent],
  providers: [BoardStore],
  templateUrl: './board.component.html',
  styleUrl: './board.component.scss',
})
export class BoardComponent {
  private readonly store = inject(Store);
  protected readonly columns = this.store.selectSignal(bookFeature.selectColumns);
  protected readonly isLoading = this.store.selectSignal(bookFeature.selectIsLoading);

  private readonly boardStore = inject(BoardStore);

  constructor() {
    this.store.dispatch(BookPageActions.loadBooks());
  }

  handleDrop(event: CdkDragDrop<BoardItem[]>): void {
    this.boardStore.handleDrop(event);
  }
}
