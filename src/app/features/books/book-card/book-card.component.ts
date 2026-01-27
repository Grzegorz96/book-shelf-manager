import { Component, input, output } from '@angular/core';
import { Book } from '../book.interface';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-book-card',
  imports: [LucideAngularModule],
  templateUrl: './book-card.component.html',
  styleUrl: './book-card.component.scss',
})
export class BookCardComponent {
  readonly book = input.required<Book>();
  readonly onEdit = output<Book>();
  readonly onDelete = output<string>();
  readonly onToggleFavorite = output<{ id: string; isFavorite: boolean }>();
  readonly onViewDetails = output<Book>();

  handleEdit() {
    this.onEdit.emit(this.book());
  }

  handleDelete() {
    this.onDelete.emit(this.book().id);
  }

  handleToggleFavorite() {
    this.onToggleFavorite.emit({
      id: this.book().id,
      isFavorite: !this.book().isFavorite,
    });
  }

  handleViewDetails() {
    this.onViewDetails.emit(this.book());
  }
}
