import { Component, signal } from '@angular/core';
import { RouterLinkActive, RouterLink } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { LogoComponent } from '@shared/logo';

@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive, LucideAngularModule, LogoComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  protected readonly routes = signal([
    {
      label: 'Books',
      icon: 'LibraryBig',
      path: '/books',
    },
    {
      label: 'Login',
      icon: 'LogIn',
      path: '/login',
    },
    {
      label: 'Logout',
      icon: 'LogOut',
      path: '/logout',
    },
  ]);
}
