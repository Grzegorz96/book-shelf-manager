import { createFeature, createReducer, on } from '@ngrx/store';
import { ThemeCoreActions } from './theme.actions';
import { THEME_KEY } from './theme.constants';

function getInitialTheme(): boolean {
  if (typeof window === 'undefined') return false;

  const saved = localStorage.getItem(THEME_KEY);
  if (saved === null) return window.matchMedia('(prefers-color-scheme: dark)').matches;

  try {
    const parsed = JSON.parse(saved);
    return typeof parsed === 'boolean'
      ? parsed
      : window.matchMedia('(prefers-color-scheme: dark)').matches;
  } catch {
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }
}

export interface ThemeState {
  isDark: boolean;
}

export const initialState: ThemeState = {
  isDark: getInitialTheme(),
};

const reducer = createReducer(
  initialState,
  on(ThemeCoreActions.toggle, (state) => ({ ...state, isDark: !state.isDark })),
);

export const themeFeature = createFeature({
  name: 'theme',
  reducer,
});
