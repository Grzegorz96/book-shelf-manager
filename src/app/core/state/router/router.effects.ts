import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { RouterActions } from './router.actions';

@Injectable()
export class RouterEffects {
  private actions$ = inject(Actions);
  private router = inject(Router);

  navigate$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(RouterActions.navigate),
        tap(({ path }) => this.router.navigate(path)),
      ),
    { dispatch: false },
  );
}
