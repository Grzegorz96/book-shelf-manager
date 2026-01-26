import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    title: 'Home',
    loadComponent: () => import('@features/home/home.component').then((m) => m.HomeComponent),
  },
  {
    path: 'books',
    title: 'Books',
    loadComponent: () => import('@features/books/books.component').then((m) => m.BooksComponent),
  },
];
