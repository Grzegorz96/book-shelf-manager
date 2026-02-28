import { Injectable, signal } from '@angular/core';
import { form, required, email, minLength, submit } from '@angular/forms/signals';
import { AuthCredentials } from '@core/state/auth';

@Injectable()
export class AuthFormStore {
  private readonly _credentials = signal<AuthCredentials>({ email: '', password: '' });

  readonly authForm = form(this._credentials, (fieldPath) => {
    required(fieldPath.email, { message: 'Email is required' });
    email(fieldPath.email, { message: 'Invalid email address' });
    required(fieldPath.password, { message: 'Password is required' });
    minLength(fieldPath.password, 8, { message: 'Password must be at least 8 characters' });
  });

  submit(callback: (creds: AuthCredentials) => void): void {
    submit(this.authForm, async (formInstance) => {
      callback(formInstance().value());
    });
  }
}
