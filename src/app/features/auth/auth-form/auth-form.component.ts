import { Component, output, signal } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';
import { form, required, submit, minLength, FormField, email } from '@angular/forms/signals';
import type { AuthCredentials } from '@core/services';

@Component({
  selector: 'app-auth-form',
  imports: [LucideAngularModule, FormField],
  templateUrl: './auth-form.component.html',
  styleUrl: './auth-form.component.scss',
})
export class AuthFormComponent {
  readonly onSubmit = output<AuthCredentials>();
  private readonly _authFormSignal = signal<AuthCredentials>({
    email: '',
    password: '',
  });

  protected readonly authForm = form(this._authFormSignal, (fieldPath) => {
    required(fieldPath.email, { message: 'Email is required' });
    email(fieldPath.email, { message: 'Invalid email address' });
    required(fieldPath.password, { message: 'Password is required' });
    minLength(fieldPath.password, 8, { message: 'Password must be at least 8 characters' });
  });

  handleSubmit(event: Event): void {
    event.preventDefault();
    submit(this.authForm, async (form) => {
      const credentials = form().value();

      this.onSubmit.emit({
        email: credentials.email,
        password: credentials.password,
      });
    });
  }
}
