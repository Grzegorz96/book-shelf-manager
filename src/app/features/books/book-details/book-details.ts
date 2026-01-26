import { Component, input } from '@angular/core';
import { Book } from '../book.interface';
import { LucideAngularModule } from 'lucide-angular';
import { ReadingTimePipe } from './reading-time.pipe';

@Component({
  selector: 'app-book-details',
  imports: [LucideAngularModule, ReadingTimePipe, LucideAngularModule],
  templateUrl: './book-details.html',
  styleUrl: './book-details.scss',
})
export class BookDetailsComponent {
  readonly book = input.required<Book>();
}
