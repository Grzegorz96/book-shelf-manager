import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SignInStore } from './sign-in.store';
import { FormField } from '@angular/forms/signals';
import { Store } from '@ngrx/store';
import { authFeature } from '@app/core/state/auth';

@Component({
  selector: 'app-sign-in',
  imports: [RouterLink, FormField],
  providers: [SignInStore],
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.scss',
})
export class SignInComponent {
  // private readonly store = inject(Store);
  private readonly signInStore = inject(SignInStore);

  protected readonly signInForm = this.signInStore.signInForm;
  protected readonly vm = this.signInStore.state;

  // protected readonly vm = this.store.selectSignal(authFeature.selectAuthState);

  handleSubmit(event: Event): void {
    event.preventDefault();
    this.signInStore.handleSubmit();
  }
}
