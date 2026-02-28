import { Component, inject } from '@angular/core';
import { AuthFormComponent } from './auth-form';
import type { AuthCredentials } from '@core/state/auth';
import { Store } from '@ngrx/store';
import { AuthPageActions } from '@core/state/auth';

@Component({
  selector: 'app-auth',
  imports: [AuthFormComponent],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.scss',
})
export class AuthComponent {
  private readonly store = inject(Store);

  handleSubmit(credentials: AuthCredentials): void {
    this.store.dispatch(AuthPageActions.login({ credentials }));
  }
}
