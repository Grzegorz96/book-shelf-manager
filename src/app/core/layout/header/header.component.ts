import { Component, signal, inject } from '@angular/core';
import { RouterLinkActive, RouterLink, Router } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { LogoComponent } from '@shared/logo';
import { AuthService } from '@core/services';

@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive, LucideAngularModule, LogoComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  private readonly authService = inject(AuthService);
  protected readonly isAuthenticated = this.authService.isAuthenticated;
  private readonly router = inject(Router);
  protected readonly routes = signal([
    {
      label: 'Books',
      icon: 'LibraryBig',
      path: '/books',
    },
    {
      label: 'Mock 1',
      icon: 'Square',
      path: '/mock-1',
    },
    {
      label: 'Mock 2',
      icon: 'Square',
      path: '/mock-2',
    },
  ]);

  protected handleLogout(): void {
    const response = this.authService.logout();
    if (response.success) {
      this.router.navigate(['/']);
    }
  }
}
