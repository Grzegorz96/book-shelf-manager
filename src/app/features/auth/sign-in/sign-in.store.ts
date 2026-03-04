import { inject, Injectable, signal } from '@angular/core';
import { form, required, email, minLength, submit } from '@angular/forms/signals';
import { Credentials } from '@core/state/auth';
import { Store } from '@ngrx/store';
import { AuthApiActions, AuthPageActions } from '@core/state/auth';
import { ComponentStore } from '@ngrx/component-store';
import { Actions, ofType } from '@ngrx/effects';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

interface SignInFormState {
  isLoading: boolean;
  error: string | null;
}

@Injectable()
export class SignInStore extends ComponentStore<SignInFormState> {
  private readonly store = inject(Store);
  private readonly actions$ = inject(Actions);

  private readonly _credentials = signal<Credentials>({ email: '', password: '' });

  readonly signInForm = form(this._credentials, (fieldPath) => {
    required(fieldPath.email, { message: 'Email is required' });
    email(fieldPath.email, { message: 'Invalid email address' });
    required(fieldPath.password, { message: 'Password is required' });
    minLength(fieldPath.password, 8, { message: 'Password must be at least 8 characters' });
  });

  constructor() {
    super({ isLoading: false, error: null });

    this.actions$
      .pipe(ofType(AuthPageActions.signIn), takeUntilDestroyed())
      .subscribe(() => this.patchState({ isLoading: true, error: null }));

    this.actions$
      .pipe(ofType(AuthApiActions.signInSuccess), takeUntilDestroyed())
      .subscribe(() => this.patchState({ isLoading: false, error: null }));

    this.actions$
      .pipe(ofType(AuthApiActions.signInFailure), takeUntilDestroyed())
      .subscribe(({ error }) => this.patchState({ isLoading: false, error }));
  }

  handleSubmit(): void {
    submit(this.signInForm, async (formInstance) => {
      const credentials = formInstance().value();
      this.store.dispatch(AuthPageActions.signIn({ credentials }));
    });
  }
}
