import { Component, input, output } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';
import { ScrollLockDirective } from '@core/state/scroll';
import { BackdropClickDirective } from '@core/directives';

@Component({
  selector: 'app-book-modal',
  imports: [LucideAngularModule, ScrollLockDirective, BackdropClickDirective],
  templateUrl: './book-modal.component.html',
  styleUrl: './book-modal.component.scss',
})
export class BookModalComponent {
  readonly loader = input<boolean>(false);
  readonly loaderText = input<string>('Loading...');
  readonly close = output<void>();

  protected onBackdropClick(): void {
    if (!this.loader()) {
      this.close.emit();
    }
  }
}
