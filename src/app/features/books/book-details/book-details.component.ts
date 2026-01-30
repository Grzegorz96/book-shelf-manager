import { Component, input, inject, resource, effect } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';
import { ReadingTimePipe } from '@core/pipes';
import { BooksService } from '../books.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { ErrorModalService } from '@shared/error-modal';
import { BookModalComponent } from '../book-modal';

@Component({
  selector: 'app-book-details',
  imports: [LucideAngularModule, ReadingTimePipe, BookModalComponent],
  templateUrl: './book-details.component.html',
  styleUrl: './book-details.component.scss',
})
export class BookDetailsComponent {
  readonly id = input.required<string>();
  private readonly booksService = inject(BooksService);
  private readonly router = inject(Router);
  private readonly errorModalService = inject(ErrorModalService);

  protected readonly bookResource = resource({
    params: () => ({ id: this.id() }),
    loader: ({ params }) => this.booksService.getBook(params.id),
  });

  constructor() {
    effect(() => {
      const err = this.bookResource.error();
      if (!err) return;
      const isNotFound = err instanceof HttpErrorResponse && err.status === 404;
      const title = isNotFound ? 'Book not found' : 'Error getting book';
      const message = isNotFound
        ? 'The book you are trying to view does not exist or has been removed.'
        : 'An error occurred while getting the book. Please try again later.';
      this.errorModalService.openErrorModal({
        title,
        message,
        dismissLabel: 'Back to Library',
        onDismiss: () => this.handleClose(),
      });
    });
  }

  handleClose() {
    this.router.navigate(['/books']);
  }
}
