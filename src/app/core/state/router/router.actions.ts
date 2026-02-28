import { createActionGroup, props } from '@ngrx/store';

export const RouterActions = createActionGroup({
  source: 'Router/Core',
  events: {
    Navigate: props<{ path: string[] }>(),
  },
});
