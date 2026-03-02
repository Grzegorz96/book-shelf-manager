import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Action } from '@ngrx/store';

export const ErrorModalActions = createActionGroup({
  source: 'Error/Modal',
  events: {
    Open: props<{
      title: string;
      message: string;
      retryLabel?: string;
      dismissLabel?: string;
      onRetry?: Action;
      onDismiss?: Action;
    }>(),
    Close: emptyProps(),
    ExecuteAction: emptyProps(),
    Reset: emptyProps(),
  },
});
