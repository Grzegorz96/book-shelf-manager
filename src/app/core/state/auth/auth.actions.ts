import { createActionGroup, emptyProps, props } from '@ngrx/store';
import type { Credentials, AuthenticatedUser, SignUpFormData } from './models';

export const AuthPageActions = createActionGroup({
  source: 'Auth/Page',
  events: {
    SignIn: props<{ credentials: Credentials }>(),
    SignOut: emptyProps(),
    SignUp: props<{ formUser: SignUpFormData }>(),
  },
});

export const AuthApiActions = createActionGroup({
  source: 'Auth/API',
  events: {
    SignInSuccess: props<{ user: AuthenticatedUser }>(),
    SignInFailure: props<{ error: string }>(),
    SignUpSuccess: props<{ user: AuthenticatedUser }>(),
    SignUpFailure: props<{ error: string }>(),
  },
});
