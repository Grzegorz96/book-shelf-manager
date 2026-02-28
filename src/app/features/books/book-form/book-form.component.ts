import { Component, inject, VERSION } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';
import { FormField } from '@angular/forms/signals';
import { BookModalComponent } from '../book-modal';
import { BookFormStore } from './book-form.store';

@Component({
  selector: 'app-book-form',
  imports: [LucideAngularModule, FormField, BookModalComponent],
  templateUrl: './book-form.component.html',
  styleUrl: './book-form.component.scss',
  providers: [BookFormStore],
})
export class BookFormComponent {
  protected readonly bookFormStore = inject(BookFormStore);
  protected readonly vm = this.bookFormStore.vm;

  handleSubmit(event: Event): void {
    event.preventDefault();
    this.bookFormStore.handleSubmit();
  }

  handleCancel(): void {
    this.bookFormStore.handleCancel();
  }
}
