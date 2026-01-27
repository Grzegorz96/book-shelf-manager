import { Routes } from '@angular/router';
import { authGuard } from '@core/guards';
import { HomeComponent } from '@features/home';

export const routes: Routes = [
  {
    path: '',
    title: 'Home',
    component: HomeComponent,
  },
  {
    path: 'books',
    title: 'Books',
    canActivate: [authGuard],
    loadComponent: () => import('@features/books').then((m) => m.BooksComponent),
  },
  {
    path: 'auth',
    title: 'Auth',
    loadComponent: () => import('@features/auth').then((m) => m.AuthComponent),
  },
  {
    path: '**',
    title: 'Not Found',
    loadComponent: () => import('@features/not-found').then((m) => m.NotFoundComponent),
  },
];
