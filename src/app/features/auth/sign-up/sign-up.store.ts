import { inject, Injectable, signal } from '@angular/core';
import { form, required, email, minLength, submit } from '@angular/forms/signals';
import { Store } from '@ngrx/store';
import { AuthApiActions, AuthPageActions, SignUpFormData } from '@core/state/auth';
import { ComponentStore } from '@ngrx/component-store';
import { Actions, ofType } from '@ngrx/effects';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

interface SignUpFormState {
  isLoading: boolean;
  error: string | null;
}

const initialSignUpFormData: SignUpFormData = {
  firstName: '',
  lastName: '',
  email: '',
  password: '',
};

@Injectable()
export class SignUpStore extends ComponentStore<SignUpFormState> {
  private readonly store = inject(Store);
  private readonly actions$ = inject(Actions);
  private readonly _formData = signal<SignUpFormData>(initialSignUpFormData);

  readonly signUpForm = form(this._formData, (fieldPath) => {
    required(fieldPath.firstName, { message: 'First name is required' });
    minLength(fieldPath.firstName, 2, { message: 'First name must be at least 2 characters' });
    required(fieldPath.lastName, { message: 'Last name is required' });
    minLength(fieldPath.lastName, 2, { message: 'Last name must be at least 2 characters' });
    required(fieldPath.email, { message: 'Email is required' });
    email(fieldPath.email, { message: 'Invalid email address' });
    required(fieldPath.password, { message: 'Password is required' });
    minLength(fieldPath.password, 8, { message: 'Password must be at least 8 characters' });
  });

  constructor() {
    super({ isLoading: false, error: null });

    this.actions$
      .pipe(ofType(AuthPageActions.signUp), takeUntilDestroyed())
      .subscribe(() => this.patchState({ isLoading: true, error: null }));

    this.actions$
      .pipe(ofType(AuthApiActions.signUpSuccess), takeUntilDestroyed())
      .subscribe(() => this.patchState({ isLoading: false, error: null }));

    this.actions$
      .pipe(ofType(AuthApiActions.signUpFailure), takeUntilDestroyed())
      .subscribe(({ error }) => this.patchState({ isLoading: false, error }));
  }

  handleSubmit(): void {
    submit(this.signUpForm, async (formInstance) => {
      const formUser = formInstance().value();
      this.store.dispatch(AuthPageActions.signUp({ formUser }));
    });
  }
}
