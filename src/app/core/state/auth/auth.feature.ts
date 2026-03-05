import { createFeature, createReducer, createSelector, on } from '@ngrx/store';
import { AuthPageActions, AuthApiActions } from './auth.actions';
import { AUTH_KEY } from './auth.constants';
import { AuthenticatedUser } from './models';

function getInitialUser(): AuthenticatedUser | null {
  if (typeof window === 'undefined') return null;

  const saved = localStorage.getItem(AUTH_KEY);
  if (!saved) return null;

  try {
    const parsed = JSON.parse(saved);
    return typeof parsed === 'object' ? parsed : null;
  } catch {
    return null;
  }
}

export interface AuthState {
  user: AuthenticatedUser | null;
}

export const initialState: AuthState = {
  user: getInitialUser(),
};

const reducer = createReducer(
  initialState,

  on(AuthApiActions.signInSuccess, (state, { user }) => ({ ...state, user })),
  on(AuthApiActions.signUpSuccess, (state, { user }) => ({ ...state, user })),
  on(AuthPageActions.signOut, () => ({ user: null })),
);

export const authFeature = createFeature({
  name: 'auth',
  reducer,

  extraSelectors: ({ selectUser }) => ({
    selectIsAuthenticated: createSelector(selectUser, (user) => user !== null),
  }),
});
