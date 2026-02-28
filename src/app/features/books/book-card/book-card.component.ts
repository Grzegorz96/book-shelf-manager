import { Component, input, output } from '@angular/core';
import { type Book } from '../models';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-book-card',
  imports: [LucideAngularModule],
  templateUrl: './book-card.component.html',
  styleUrl: './book-card.component.scss',
})
export class BookCardComponent {
  readonly book = input.required<Book>();
  readonly onEdit = output<string>();
  readonly onDelete = output<string>();
  readonly onToggleFavorite = output<string>();
  readonly onViewDetails = output<string>();

  handleEdit() {
    this.onEdit.emit(this.book().id);
  }

  handleDelete() {
    this.onDelete.emit(this.book().id);
  }

  handleToggleFavorite() {
    this.onToggleFavorite.emit(this.book().id);
  }

  handleViewDetails() {
    this.onViewDetails.emit(this.book().id);
  }
}
