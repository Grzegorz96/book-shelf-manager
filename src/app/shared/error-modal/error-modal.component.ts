import { Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { LucideAngularModule } from 'lucide-angular';
import { ScrollLockDirective } from '@core/state/scroll';
import { BackdropClickDirective } from '@core/directives';
import { errorModalFeature } from './state';
import { ErrorModalActions } from './state/error.actions';

@Component({
  selector: 'app-error-modal',
  imports: [LucideAngularModule, ScrollLockDirective, BackdropClickDirective],
  templateUrl: './error-modal.component.html',
  styleUrl: './error-modal.component.scss',
})
export class ErrorModalComponent {
  private readonly store = inject(Store);
  readonly modalState = this.store.selectSignal(errorModalFeature.selectVm);

  protected handleDismiss(): void {
    this.store.dispatch(ErrorModalActions.close());
  }

  protected handleAction(): void {
    this.store.dispatch(ErrorModalActions.executeAction());
  }
}
