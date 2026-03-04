import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormField } from '@angular/forms/signals';
import { SignUpStore } from './sign-up.store';
import { Store } from '@ngrx/store';
import { authFeature } from '@core/state/auth';

@Component({
  selector: 'app-sign-up',
  imports: [RouterLink, FormField],
  providers: [SignUpStore],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.scss',
})
export class SignUpComponent {
  // private readonly store = inject(Store);
  private readonly signUpStore = inject(SignUpStore);

  // protected readonly vm = this.store.selectSignal(authFeature.selectAuthState);
  protected readonly signUpForm = this.signUpStore.signUpForm;
  protected readonly vm = this.signUpStore.state;

  handleSubmit(event: Event): void {
    event.preventDefault();
    this.signUpStore.handleSubmit();
  }
}
