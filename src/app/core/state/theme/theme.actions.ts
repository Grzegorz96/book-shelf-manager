import { createActionGroup, emptyProps } from '@ngrx/store';

export const ThemeCoreActions = createActionGroup({
  source: 'Theme/Core',
  events: {
    Toggle: emptyProps(),
  },
});
