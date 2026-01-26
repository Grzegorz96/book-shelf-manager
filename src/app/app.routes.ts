import { Routes } from '@angular/router';
import { authGuard } from '@core/guards';

export const routes: Routes = [
  {
    path: '',
    title: 'Home',
    loadComponent: () => import('@features/home/home.component').then((m) => m.HomeComponent),
  },
  {
    path: 'books',
    title: 'Books',
    canActivate: [authGuard],
    loadComponent: () => import('@features/books/books.component').then((m) => m.BooksComponent),
  },
  {
    path: 'auth',
    title: 'Auth',
    loadComponent: () => import('@features/auth/auth.component').then((m) => m.AuthComponent),
  },
];
