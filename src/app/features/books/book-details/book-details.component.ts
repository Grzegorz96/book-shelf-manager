import { Component, input } from '@angular/core';
import { Book } from '../book.interface';
import { LucideAngularModule } from 'lucide-angular';
import { ReadingTimePipe } from '@core/pipes';

@Component({
  selector: 'app-book-details',
  imports: [LucideAngularModule, ReadingTimePipe, LucideAngularModule],
  templateUrl: './book-details.component.html',
  styleUrl: './book-details.component.scss',
})
export class BookDetailsComponent {
  readonly book = input.required<Book>();
}
