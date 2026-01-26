import { Injectable, signal } from '@angular/core';
import { ErrorModalState } from './error-modal.interface';

interface OpenErrorModalParams extends ErrorModalState {
  onPrimaryAction?: () => Promise<void> | void;
}

/**
 * Global state manager for `ErrorModalComponent`.
 * Allows opening the modal from any place in the app.
 */
@Injectable({
  providedIn: 'root',
})
export class ErrorModalService {
  private readonly _modalSignal = signal<ErrorModalState | null>(null);
  private primaryAction: (() => void) | null = null;

  readonly state = this._modalSignal.asReadonly();

  openErrorModal(params: OpenErrorModalParams): void {
    this.primaryAction = params.onPrimaryAction ?? null;
    const nextState: ErrorModalState = {
      title: params.title,
      message: params.message,
      primaryActionLabel: params.primaryActionLabel,
      secondaryActionLabel: params.secondaryActionLabel,
    };
    this._modalSignal.set(nextState);
  }

  closeErrorModal(): void {
    this.primaryAction = null;
    this._modalSignal.set(null);
  }

  executePrimaryAction(): void {
    const action: (() => void) | null = this.primaryAction;
    this.closeErrorModal();
    if (action) {
      action();
    }
  }
}
