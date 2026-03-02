import { createActionGroup, emptyProps } from '@ngrx/store';

export const ScrollCoreActions = createActionGroup({
  source: 'Scroll/Core',
  events: {
    Lock: emptyProps(),
    Unlock: emptyProps(),
  },
});
