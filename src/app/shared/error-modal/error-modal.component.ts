import { Component, inject } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';
import { ErrorModalState } from './error-modal.interface';
import { ScrollLockDirective } from '@core/services/scroll';
import { ErrorModalService } from './error-modal.service';

const DEFAULT_PRIMARY_ACTION_LABEL: string = 'OK';
const DEFAULT_SECONDARY_ACTION_LABEL: string = 'Dismiss';

@Component({
  selector: 'app-error-modal',
  imports: [LucideAngularModule, ScrollLockDirective],
  templateUrl: './error-modal.component.html',
  styleUrl: './error-modal.component.scss',
})
export class ErrorModalComponent {
  private readonly errorModalService = inject(ErrorModalService);
  readonly modalState = this.errorModalService.state;

  protected handleDismiss(): void {
    this.errorModalService.closeErrorModal();
  }

  protected handlePrimaryActionClick(): void {
    this.errorModalService.executePrimaryAction();
  }

  protected getPrimaryActionLabel(modal: ErrorModalState): string {
    return modal.primaryActionLabel ?? DEFAULT_PRIMARY_ACTION_LABEL;
  }

  protected getSecondaryActionLabel(modal: ErrorModalState): string {
    return modal.secondaryActionLabel ?? DEFAULT_SECONDARY_ACTION_LABEL;
  }
}
