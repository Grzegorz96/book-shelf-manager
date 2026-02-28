import { createFeature, createReducer, on } from '@ngrx/store';
import { ScrollCoreActions } from './scroll.actions';

export interface ScrollState {
  blockedCount: number;
}

export const initialState: ScrollState = {
  blockedCount: 0,
};

const reducer = createReducer(
  initialState,
  on(ScrollCoreActions.lock, (state) => ({ ...state, blockedCount: state.blockedCount + 1 })),
  on(ScrollCoreActions.unlock, (state) => ({
    ...state,
    blockedCount: Math.max(0, state.blockedCount - 1),
  })),
);

export const scrollFeature = createFeature({
  name: 'scroll',
  reducer,
});
