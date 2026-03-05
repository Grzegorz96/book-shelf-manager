import { Component, inject } from '@angular/core';
import { CdkDrag, CdkDropList, CdkDropListGroup, type CdkDragDrop } from '@angular/cdk/drag-drop';
import { LucideAngularModule } from 'lucide-angular';
import { BookPageActions } from '@app/features/books/state';
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
  private readonly boardStore = inject(BoardStore);

  protected readonly vm = this.boardStore.vm;

  constructor() {
    this.store.dispatch(BookPageActions.loadBooks());
  }

  handleRetry(): void {
    this.store.dispatch(BookPageActions.loadBooks());
  }

  handleDrop(event: CdkDragDrop<BoardItem[]>): void {
    this.boardStore.handleDrop(event);
  }
}
