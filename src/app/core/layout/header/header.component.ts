import { Component, signal, inject } from '@angular/core';
import { RouterLinkActive, RouterLink, Router } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { LogoComponent } from '@shared/logo';
import { AuthService, ThemeService } from '@core/services';

@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive, LucideAngularModule, LogoComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  private readonly authService = inject(AuthService);
  private readonly themeService = inject(ThemeService);
  protected readonly isAuthenticated = this.authService.isAuthenticated;
  protected readonly isDark = this.themeService.isDark;
  private readonly router = inject(Router);
  protected readonly isMenuOpen = signal(false);

  protected toggleMenu(): void {
    this.isMenuOpen.update((open) => !open);
  }

  protected closeMenu(): void {
    this.isMenuOpen.set(false);
  }

  /** Closes the dropdown only when it is open (mobile view). No-op when nav is always visible. */
  protected closeMenuIfOpen(): void {
    if (this.isMenuOpen()) {
      this.closeMenu();
    }
  }

  protected toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  protected readonly routes = signal([
    {
      label: 'Books',
      icon: 'LibraryBig',
      path: '/books',
    },
  ]);

  protected handleLogout(): void {
    const response = this.authService.logout();
    if (response.success) {
      this.router.navigate(['/']);
    }
  }
}
