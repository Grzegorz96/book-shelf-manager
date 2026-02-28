import { Component, inject } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';
import { ReadingTimePipe } from '@core/pipes';
import { BookModalComponent } from '../book-modal';
import { BookDetailsStore } from './book-details.store';

@Component({
  selector: 'app-book-details',
  imports: [LucideAngularModule, ReadingTimePipe, BookModalComponent],
  providers: [BookDetailsStore],
  templateUrl: './book-details.component.html',
  styleUrl: './book-details.component.scss',
})
export class BookDetailsComponent {
  private readonly bookDetailsStore = inject(BookDetailsStore);
  protected readonly vm = this.bookDetailsStore.state;

  handleClose(): void {
    this.bookDetailsStore.handleClose();
  }
}
