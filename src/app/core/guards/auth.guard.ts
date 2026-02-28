import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { Store } from '@ngrx/store';
import { first, map } from 'rxjs/operators';
import { authFeature } from '@app/core/state/auth';

export const authGuard: CanActivateFn = () => {
  const store = inject(Store);
  const router = inject(Router);

  return store.select(authFeature.selectIsAuthenticated).pipe(
    first(),
    map((isAuthenticated) => (isAuthenticated ? true : router.createUrlTree(['/auth']))),
  );
};
