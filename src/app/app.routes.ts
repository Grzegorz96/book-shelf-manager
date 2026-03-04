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
    path: 'board',
    title: 'Board',
    canActivate: [authGuard],
    loadComponent: () => import('@app/features/board').then((m) => m.BoardComponent),
  },
  {
    path: 'auth',
    loadComponent: () => import('@features/auth').then((m) => m.AuthComponent),
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'sign-in',
      },
      {
        path: 'sign-in',
        title: 'Sign In',
        loadComponent: () => import('@features/auth/sign-in').then((m) => m.SignInComponent),
      },
      {
        path: 'sign-up',
        title: 'Sign Up',
        loadComponent: () => import('@features/auth/sign-up').then((m) => m.SignUpComponent),
      },
    ],
  },
  {
    path: '**',
    title: 'Not Found',
    loadComponent: () => import('@features/not-found').then((m) => m.NotFoundComponent),
  },
];
