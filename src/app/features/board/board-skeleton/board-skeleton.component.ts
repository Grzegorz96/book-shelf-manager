import { Component } from '@angular/core';

function createSkeletonColumns(): { id: string; itemIndices: number[] }[] {
  return [
    { id: 'todo', itemIndices: [0, 1, 2] },
    { id: 'in-progress', itemIndices: [0, 1] },
    { id: 'done', itemIndices: [0, 1] },
  ];
}

@Component({
  selector: 'app-board-skeleton',
  standalone: true,
  imports: [],
  templateUrl: './board-skeleton.component.html',
  styleUrl: './board-skeleton.component.scss',
})
export class BoardSkeletonComponent {
  protected readonly columns = createSkeletonColumns();
}
