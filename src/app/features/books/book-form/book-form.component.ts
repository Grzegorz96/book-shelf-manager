import { Component, input, output, signal, effect } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';
import { Book } from '../book.interface';
import { form, required, submit, minLength, max, FormField } from '@angular/forms/signals';

type BookFormModel = Omit<Book, 'id'>;

@Component({
  selector: 'app-book-form',
  imports: [LucideAngularModule, FormField],
  templateUrl: './book-form.component.html',
  styleUrl: './book-form.component.scss',
})
export class BookFormComponent {
  private readonly _bookFormSignal = signal<BookFormModel>({
    title: '',
    author: '',
    year: new Date().getFullYear(),
    description: '',
    genre: '',
    isFavorite: false,
  });

  protected readonly bookForm = form(this._bookFormSignal, (fieldPath) => {
    const currentYear = new Date().getFullYear();

    required(fieldPath.title, { message: 'Title is required' });
    minLength(fieldPath.title, 2, { message: 'Title must be at least 2 character' });
    required(fieldPath.author, { message: 'Author is required' });
    minLength(fieldPath.author, 2, { message: 'Author must be at least 2 character' });
    required(fieldPath.year, { message: 'Year is required' });
    max(fieldPath.year, currentYear, { message: `Year must be in the past` });
    required(fieldPath.description, { message: 'Description is required' });
    minLength(fieldPath.description, 10, { message: 'Description must be at least 10 characters' });
    required(fieldPath.genre, { message: 'Genre is required' });
    minLength(fieldPath.genre, 2, { message: 'Genre must be at least 2 character' });
  });

  readonly book = input<Book | null>(null);
  readonly onSave = output<BookFormModel>();
  readonly onCancel = output<void>();

  constructor() {
    effect(() => {
      const bookValue = this.book();
      if (bookValue) {
        this._bookFormSignal.set({
          title: bookValue.title,
          author: bookValue.author,
          year: bookValue.year,
          description: bookValue.description,
          genre: bookValue.genre,
          isFavorite: bookValue.isFavorite,
        });
      }
    });
  }

  handleSubmit(event: Event): void {
    event.preventDefault();
    submit(this.bookForm, async (form) => {
      const formValue = form().value();

      this.onSave.emit({
        title: formValue.title,
        author: formValue.author,
        year: formValue.year,
        description: formValue.description,
        genre: formValue.genre,
        isFavorite: formValue.isFavorite,
      });
    });
  }

  handleCancel() {
    this.onCancel.emit();
  }
}
