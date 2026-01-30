import { Component, input, output } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';
import { ScrollLockDirective } from '@core/services';
import { BackdropClickDirective } from '@core/directives';

/**
 * Reusable modal wrapper for book-related views (details, form).
 * Handles backdrop, dialog box, optional loader state, and close button.
 */
@Component({
  selector: 'app-book-modal',
  imports: [LucideAngularModule, ScrollLockDirective, BackdropClickDirective],
  templateUrl: './book-modal.component.html',
  styleUrl: './book-modal.component.scss',
})
export class BookModalComponent {
  /** When true, shows built-in loader instead of projected content and hides close button. */
  readonly loader = input<boolean>(false);
  /** Text shown below the spinner when loader is true. */
  readonly loaderText = input<string>('Loading...');
  /** Emitted when user closes the modal (close button or backdrop click). */
  readonly close = output<void>();

  protected onBackdropClick(): void {
    if (!this.loader()) {
      this.close.emit();
    }
  }
}
