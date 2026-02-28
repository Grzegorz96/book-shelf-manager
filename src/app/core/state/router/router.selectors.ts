import { RouterReducerState } from '@ngrx/router-store';
import { createSelector, createFeatureSelector } from '@ngrx/store';
import { Params } from '@angular/router';

const selectRouter = createFeatureSelector<RouterReducerState>('router');

export const selectRouteParams = createSelector(selectRouter, (router) => {
  const state = router?.state as { params?: Params } | undefined;
  return state?.params ?? {};
});

export const selectRouteParam = (param: string) =>
  createSelector(selectRouteParams, (params): string | undefined => params?.[param]);
