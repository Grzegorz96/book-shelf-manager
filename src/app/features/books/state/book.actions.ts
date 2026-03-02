import { Action, createActionGroup, emptyProps, props } from '@ngrx/store';
import { Book } from '../models';

export const BookPageActions = createActionGroup({
  source: 'Books/Page',
  events: {
    'Load Books': emptyProps(),
    'Delete Book': props<{ id: string }>(),
    'Toggle Favorite': props<{ id: string }>(),
    'Update Book': props<{ id: string; changes: Partial<Omit<Book, 'id'>> }>(),
    'Create Book': props<{ newBook: Omit<Book, 'id'> }>(),
  },
});

export const BookApiActions = createActionGroup({
  source: 'Books/API',
  events: {
    'Load Books Success': props<{ books: Book[] }>(),
    'Load Books Failure': props<{ error: string }>(),
    'Delete Book Success': props<{ id: string }>(),
    'Toggle Favorite Success': props<{ id: string }>(),
    'Update Book Success': props<{ id: string; changes: Partial<Omit<Book, 'id'>> }>(),
    'Create Book Success': props<{ createdBook: Book }>(),
    'Update Book Failure': props<{ error: string; retryAction: Action }>(),
    'Create Book Failure': props<{ error: string; retryAction: Action }>(),
    'Load Books Background Failure': emptyProps(),
  },
});
