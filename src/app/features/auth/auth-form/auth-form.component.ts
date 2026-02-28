import { Component, output, inject } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';
import { FormField } from '@angular/forms/signals';
import type { AuthCredentials } from '@core/state/auth';
import { AuthFormStore } from './auth-form.store';

@Component({
  selector: 'app-auth-form',
  imports: [LucideAngularModule, FormField],
  providers: [AuthFormStore],
  templateUrl: './auth-form.component.html',
  styleUrl: './auth-form.component.scss',
})
export class AuthFormComponent {
  private readonly authFormStore = inject(AuthFormStore);
  readonly onSubmit = output<AuthCredentials>();

  protected readonly authForm = this.authFormStore.authForm;

  handleSubmit(event: Event): void {
    event.preventDefault();

    this.authFormStore.submit((credentials) => {
      this.onSubmit.emit(credentials);
    });
  }
}
