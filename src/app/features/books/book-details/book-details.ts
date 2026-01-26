import { Component, input } from '@angular/core';
import { Book } from '../book.interface';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-book-details',
  imports: [LucideAngularModule],
  templateUrl: './book-details.html',
  styleUrl: './book-details.scss',
})
export class BookDetailsComponent {
  readonly book = input.required<Book>();
}
