import { createReducer, on, createFeature, createSelector, Action } from '@ngrx/store';
import { ErrorModalActions } from './error.actions';

export interface ErrorModalState {
  isOpen: boolean;
  title: string;
  message: string;
  retryLabel: string | null;
  dismissLabel: string | null;
  onRetry: Action | null;
  onDismiss: Action | null;
}

const initialState: ErrorModalState = {
  isOpen: false,
  title: '',
  message: '',
  retryLabel: null,
  dismissLabel: null,
  onRetry: null,
  onDismiss: null,
};

const reducer = createReducer(
  initialState,
  on(
    ErrorModalActions.open,
    (_, { title, message, retryLabel, dismissLabel, onDismiss, onRetry }) => ({
      isOpen: true,
      title,
      message,
      retryLabel: retryLabel ?? null,
      dismissLabel: dismissLabel ?? null,
      onRetry: onRetry ?? null,
      onDismiss: onDismiss ?? null,
    }),
  ),
  on(ErrorModalActions.reset, () => initialState),
);

export const errorModalFeature = createFeature({
  name: 'errorModal',
  reducer,
  extraSelectors: ({ selectErrorModalState }) => ({
    selectVm: createSelector(selectErrorModalState, (s) =>
      s.isOpen
        ? {
            title: s.title,
            message: s.message,
            retryLabel: s.retryLabel,
            dismissLabel: s.dismissLabel,
            onRetry: s.onRetry,
            onDismiss: s.onDismiss,
          }
        : null,
    ),
  }),
});
