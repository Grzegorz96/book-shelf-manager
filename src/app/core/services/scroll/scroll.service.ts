import { Injectable, signal, effect, RendererFactory2, inject } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ScrollService {
  private renderer = inject(RendererFactory2).createRenderer(null, null);

  private blockedCount = signal(0);

  constructor() {
    effect(() => {
      if (this.blockedCount() > 0) {
        this.renderer.setStyle(document.documentElement, 'overflow', 'hidden');
      } else {
        this.renderer.removeStyle(document.documentElement, 'overflow');
      }
    });
  }

  lock() {
    this.blockedCount.update((count) => count + 1);
  }

  unlock() {
    this.blockedCount.update((count) => Math.max(0, count - 1));
  }
}
