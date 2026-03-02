import { Component, inject } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';
import { FormField } from '@angular/forms/signals';
import { BookModalComponent } from '../book-modal';
import { BookFormStore } from './book-form.store';
import { Store } from '@ngrx/store';
import { selectRouteParam } from '@app/core/state/router';

@Component({
  selector: 'app-book-form',
  imports: [LucideAngularModule, FormField, BookModalComponent],
  templateUrl: './book-form.component.html',
  styleUrl: './book-form.component.scss',
  providers: [BookFormStore],
})
export class BookFormComponent {
  private readonly store = inject(Store);
  protected readonly bookFormStore = inject(BookFormStore);

  protected readonly vm = this.bookFormStore.vm;
  private readonly bookId$ = this.store.select(selectRouteParam('id'));

  constructor() {
    this.bookFormStore.loadBook(this.bookId$);
  }

  handleSubmit(event: Event): void {
    event.preventDefault();
    this.bookFormStore.handleSubmit();
  }

  handleCancel(): void {
    this.bookFormStore.handleCancel();
  }
}
