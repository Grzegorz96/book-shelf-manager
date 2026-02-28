import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { mergeMap, tap } from 'rxjs/operators';
import { ErrorModalActions } from './error.actions';
import { concatLatestFrom } from '@ngrx/operators';
import { Store } from '@ngrx/store';
import { errorModalFeature } from './error.feature';

@Injectable()
export class ErrorModalEffects {
  private store = inject(Store);
  private actions$ = inject(Actions);

  dismiss$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ErrorModalActions.close),
      concatLatestFrom(() => this.store.select(errorModalFeature.selectOnDismiss)),
      mergeMap(([, action]) => [ErrorModalActions.reset(), ...(action ? [action] : [])]),
    ),
  );

  retry$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ErrorModalActions.executeAction),
      concatLatestFrom(() => this.store.select(errorModalFeature.selectOnRetry)),
      mergeMap(([, action]) => [ErrorModalActions.reset(), ...(action ? [action] : [])]),
    ),
  );
}
