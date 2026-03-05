import { Component, signal, inject } from '@angular/core';
import { RouterLinkActive, RouterLink } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { Store } from '@ngrx/store';
import { LogoComponent } from '@shared/logo';
import { AuthPageActions, authFeature } from '@app/core/state/auth';
import { themeFeature, ThemeCoreActions } from '@app/core/state/theme';
import { HeaderStore } from './header.store';

@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive, LucideAngularModule, LogoComponent],
  providers: [HeaderStore],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  private readonly store = inject(Store);
  private readonly headerStore = inject(HeaderStore);

  protected readonly isAuthenticated = this.store.selectSignal(authFeature.selectIsAuthenticated);
  protected readonly isDark = this.store.selectSignal(themeFeature.selectIsDark);
  protected readonly vm = this.headerStore.state;

  protected toggleMenu(): void {
    this.headerStore.toggleMenu();
  }

  protected closeMenu(): void {
    this.headerStore.closeMenu();
  }

  protected closeMenuIfOpen(): void {
    this.headerStore.closeMenuIfOpen();
  }

  protected toggleTheme(): void {
    this.store.dispatch(ThemeCoreActions.toggle());
  }

  protected handleSignOut(): void {
    this.store.dispatch(AuthPageActions.signOut());
  }
}
