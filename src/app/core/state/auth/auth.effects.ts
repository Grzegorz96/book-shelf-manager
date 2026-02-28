import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map, tap } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { AuthPageActions } from './auth.actions';
import { authFeature } from './auth.feature';
import { concatLatestFrom } from '@ngrx/operators';
import { AUTH_KEY } from './auth.constants';
import { ROOT_EFFECTS_INIT } from '@ngrx/effects';
import { RouterActions } from '@app/core/state/router';

@Injectable()
export class AuthEffects {
  private readonly actions$ = inject(Actions);
  private readonly store = inject(Store);

  private persistAuthStatus(isAuthenticated: boolean): void {
    localStorage.setItem(AUTH_KEY, JSON.stringify(isAuthenticated));
  }

  persistAuthStatus$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(ROOT_EFFECTS_INIT, AuthPageActions.login, AuthPageActions.logout),
        concatLatestFrom(() => this.store.select(authFeature.selectIsAuthenticated)),
        tap(([_, isAuthenticated]) => this.persistAuthStatus(isAuthenticated)),
      ),
    { dispatch: false },
  );

  redirectAfterLogin$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthPageActions.login),
      map(() => RouterActions.navigate({ path: ['/'] })),
    ),
  );

  redirectAfterLogout$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthPageActions.logout),
      map(() => RouterActions.navigate({ path: ['/auth'] })),
    ),
  );
}
