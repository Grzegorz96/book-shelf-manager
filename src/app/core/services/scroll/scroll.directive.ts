import { Directive, OnInit, OnDestroy, inject } from '@angular/core';
import { ScrollService } from './scroll.service';

@Directive({
  selector: '[appScrollLock]',
})
export class ScrollLockDirective implements OnInit, OnDestroy {
  private scrollService = inject(ScrollService);

  ngOnInit() {
    this.scrollService.lock();
  }

  ngOnDestroy() {
    this.scrollService.unlock();
  }
}
