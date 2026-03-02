import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { Store } from '@ngrx/store';
import { authFeature } from '@app/core/state/auth';

@Component({
  selector: 'app-home',
  imports: [RouterLink, LucideAngularModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  private readonly store = inject(Store);

  protected readonly isAuthenticated = this.store.selectSignal(authFeature.selectIsAuthenticated);
}
