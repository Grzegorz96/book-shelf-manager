import { Directive, OnInit, OnDestroy, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { ScrollCoreActions } from './scroll.actions';

@Directive({
  selector: '[appScrollLock]',
})
export class ScrollLockDirective implements OnInit, OnDestroy {
  private readonly store = inject(Store);

  ngOnInit(): void {
    this.store.dispatch(ScrollCoreActions.lock());
  }

  ngOnDestroy(): void {
    this.store.dispatch(ScrollCoreActions.unlock());
  }
}
