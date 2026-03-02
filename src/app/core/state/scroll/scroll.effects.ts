import { Injectable, RendererFactory2, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { tap } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { concatLatestFrom } from '@ngrx/operators';

import { ScrollCoreActions } from './scroll.actions';
import { scrollFeature } from './scroll.feature';

@Injectable()
export class ScrollEffects {
  private readonly actions$ = inject(Actions);
  private readonly store = inject(Store);
  private readonly renderer = inject(RendererFactory2).createRenderer(null, null);

  private applyScrollLock(blockedCount: number): void {
    if (blockedCount > 0) {
      this.renderer.setStyle(document.documentElement, 'overflow', 'hidden');
    } else {
      this.renderer.removeStyle(document.documentElement, 'overflow');
    }
  }

  applyScrollLock$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(ScrollCoreActions.lock, ScrollCoreActions.unlock),
        concatLatestFrom(() => this.store.select(scrollFeature.selectBlockedCount)),
        tap(([_, blockedCount]) => this.applyScrollLock(blockedCount)),
      ),
    { dispatch: false },
  );
}
