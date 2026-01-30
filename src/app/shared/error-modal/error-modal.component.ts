import { Component, inject } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';
import { ScrollLockDirective } from '@core/services';
import { BackdropClickDirective } from '@core/directives';
import { ErrorModalService } from './error-modal.service';

@Component({
  selector: 'app-error-modal',
  imports: [LucideAngularModule, ScrollLockDirective, BackdropClickDirective],
  templateUrl: './error-modal.component.html',
  styleUrl: './error-modal.component.scss',
})
export class ErrorModalComponent {
  private readonly errorModalService = inject(ErrorModalService);
  readonly modalState = this.errorModalService.state;

  protected handleDismiss(): void {
    this.errorModalService.closeErrorModal();
  }

  protected handleAction(): void {
    this.errorModalService.executeAction();
  }
}
