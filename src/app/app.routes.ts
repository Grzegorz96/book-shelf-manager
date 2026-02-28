import { Routes } from '@angular/router';
import { authGuard } from '@core/guards';
import { HomeComponent } from '@features/home';
import { bookFeature } from './features/books/state';
import { provideState } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { BooksEffects } from './features/books/state/book.effects';

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
    providers: [provideState(bookFeature), provideEffects(BooksEffects)],
    loadComponent: () => import('@features/books').then((m) => m.BooksComponent),
    children: [
      {
        path: 'new',
        title: 'New Book',
        loadComponent: () =>
          import('@features/books/book-form/book-form.component').then((m) => m.BookFormComponent),
      },
      {
        path: ':id/details',
        title: 'Book Details',
        loadComponent: () =>
          import('@features/books/book-details/book-details.component').then(
            (m) => m.BookDetailsComponent,
          ),
      },
      {
        path: ':id/edit',
        title: 'Edit Book',
        loadComponent: () =>
          import('@features/books/book-form/book-form.component').then((m) => m.BookFormComponent),
      },
    ],
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
