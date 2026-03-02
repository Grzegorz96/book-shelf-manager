import { createActionGroup, emptyProps, props } from '@ngrx/store';
import type { AuthCredentials } from './auth-credentials.interface';

export const AuthPageActions = createActionGroup({
  source: 'Auth/Page',
  events: {
    Login: props<{ credentials: AuthCredentials }>(),
    Logout: emptyProps(),
  },
});
