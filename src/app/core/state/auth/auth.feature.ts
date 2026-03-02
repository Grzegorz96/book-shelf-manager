import { createFeature, createReducer, on } from '@ngrx/store';
import { AuthPageActions } from './auth.actions';
import { AUTH_KEY } from './auth.constants';

// private getInitialTheme(): boolean {
//   const savedTheme = localStorage.getItem(this.THEME_KEY);

//   if (savedTheme !== null) {
//     try {
//       const parsedTheme = JSON.parse(savedTheme);

//       if (typeof parsedTheme === 'boolean') return parsedTheme;
//     } catch {
//       return window.matchMedia('(prefers-color-scheme: dark)').matches;
//     }
//   }
//   return window.matchMedia('(prefers-color-scheme: dark)').matches;
// }

function getInitialAuthStatus(): boolean {
  if (typeof window === 'undefined') return false;

  const saved = localStorage.getItem(AUTH_KEY);
  if (!saved) return false;

  try {
    const parsed = JSON.parse(saved);
    return typeof parsed === 'boolean' ? parsed : false;
  } catch {
    return false;
  }
}

export interface AuthState {
  isAuthenticated: boolean;
}

export const initialState: AuthState = {
  isAuthenticated: getInitialAuthStatus(),
};

const reducer = createReducer(
  initialState,
  on(AuthPageActions.login, () => ({ isAuthenticated: true })),
  on(AuthPageActions.logout, () => ({ isAuthenticated: false })),
);

export const authFeature = createFeature({
  name: 'auth',
  reducer,
});
