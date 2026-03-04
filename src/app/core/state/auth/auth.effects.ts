import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map, tap, switchMap } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { AuthPageActions, AuthApiActions } from './auth.actions';
import { authFeature } from './auth.feature';
import { concatLatestFrom, mapResponse } from '@ngrx/operators';
import { AUTH_KEY, DEFAULT_ACCESS_TOKEN, DEFAULT_REFRESH_TOKEN } from './auth.constants';
import { ROOT_EFFECTS_INIT } from '@ngrx/effects';
import { RouterActions } from '@app/core/state/router';
import { AuthApi } from '@app/features/auth/auth.api';
import { toErrorMessage } from '@app/core/utils';
import { AuthenticatedUser, UserToSignUp } from './models';

@Injectable()
export class AuthEffects {
  private readonly actions$ = inject(Actions);
  private readonly store = inject(Store);
  private readonly authApi = inject(AuthApi);

  private persistUser(user: AuthenticatedUser | null): void {
    localStorage.setItem(AUTH_KEY, JSON.stringify(user));
  }

  signIn$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthPageActions.signIn),
      switchMap(({ credentials }) =>
        this.authApi.signIn(credentials).pipe(
          mapResponse({
            next: (user) => AuthApiActions.signInSuccess({ user }),
            error: (error: unknown) =>
              AuthApiActions.signInFailure({ error: toErrorMessage(error) }),
          }),
        ),
      ),
    ),
  );

  signUp$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthPageActions.signUp),
      switchMap(({ formUser }) => {
        const user: UserToSignUp = {
          ...formUser,
          accessToken: DEFAULT_ACCESS_TOKEN,
          refreshToken: DEFAULT_REFRESH_TOKEN,
        };

        return this.authApi.signUp(user).pipe(
          mapResponse({
            next: (user) => AuthApiActions.signUpSuccess({ user }),
            error: (error: unknown) =>
              AuthApiActions.signUpFailure({ error: toErrorMessage(error) }),
          }),
        );
      }),
    ),
  );

  persistUser$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(
          ROOT_EFFECTS_INIT,
          AuthApiActions.signInSuccess,
          AuthPageActions.signOut,
          AuthApiActions.signUpSuccess,
        ),
        concatLatestFrom(() => this.store.select(authFeature.selectUser)),
        tap(([_, user]) => this.persistUser(user)),
      ),
    { dispatch: false },
  );

  redirectToHome$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthApiActions.signInSuccess, AuthApiActions.signUpSuccess),
      map(() => RouterActions.navigate({ path: ['/'] })),
    ),
  );

  redirectToAuth$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthPageActions.signOut),
      map(() => RouterActions.navigate({ path: ['/auth'] })),
    ),
  );
}
