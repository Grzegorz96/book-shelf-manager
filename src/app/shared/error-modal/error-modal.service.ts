import { Injectable, signal } from '@angular/core';
import { ErrorModalState } from './error-modal.interface';

/** Callback for primary action; may be sync or async. */
type actionCallback = () => Promise<void> | void;

export interface OpenErrorModalParams extends ErrorModalState {
  onAction?: actionCallback;
  /** Called when modal is closed by dismiss (Cancel, X, overlay). Not called when primary action is used. */
  onDismiss?: () => void;
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
  private onAction: actionCallback | null = null;
  private onDismiss: (() => void) | null = null;

  readonly state = this._modalSignal.asReadonly();

  openErrorModal(params: OpenErrorModalParams): void {
    this.onAction = params.onAction ?? null;
    this.onDismiss = params.onDismiss ?? null;
    const nextState: ErrorModalState = {
      title: params.title,
      message: params.message,
      actionLabel: params.actionLabel,
      dismissLabel: params.dismissLabel,
    };
    this._modalSignal.set(nextState);
  }

  /**
   * Closes the modal. When `runDismissCallback` is true, invokes the optional
   * `onDismiss` callback (e.g. when user clicks Cancel, X, or overlay).
   */
  closeErrorModal(): void {
    this.onDismiss?.();

    this.onAction = null;
    this.onDismiss = null;
    this._modalSignal.set(null);
  }

  executeAction(): void {
    const action: actionCallback | null = this.onAction;

    this.onAction = null;
    this.onDismiss = null;
    this._modalSignal.set(null);

    action?.();
  }
}
