import { Injectable, inject, RendererFactory2 } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { tap } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { concatLatestFrom } from '@ngrx/operators';
import { ROOT_EFFECTS_INIT } from '@ngrx/effects';
import { ThemeCoreActions } from './theme.actions';
import { themeFeature } from './theme.feature';
import { THEME_KEY } from './theme.constants';

@Injectable()
export class ThemeEffects {
  private readonly actions$ = inject(Actions);
  private readonly store = inject(Store);
  private readonly renderer = inject(RendererFactory2).createRenderer(null, null);

  private applyThemeToDocument(isDark: boolean): void {
    if (isDark) {
      this.renderer.addClass(document.documentElement, 'dark');
    } else {
      this.renderer.removeClass(document.documentElement, 'dark');
    }
  }

  private persistTheme(isDark: boolean): void {
    localStorage.setItem(THEME_KEY, JSON.stringify(isDark));
  }

  persistTheme$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(ROOT_EFFECTS_INIT, ThemeCoreActions.toggle),
        concatLatestFrom(() => this.store.select(themeFeature.selectIsDark)),
        tap(([_, isDark]) => this.persistTheme(isDark)),
      ),
    { dispatch: false },
  );

  applyThemeToDom$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(ROOT_EFFECTS_INIT, ThemeCoreActions.toggle),
        concatLatestFrom(() => this.store.select(themeFeature.selectIsDark)),
        tap(([_, isDark]) => this.applyThemeToDocument(isDark)),
      ),
    { dispatch: false },
  );
}
