import { Component, signal } from '@angular/core';
import { RouterLinkActive, RouterLink } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive, LucideAngularModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  protected readonly appName = signal('Shelfy');

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
