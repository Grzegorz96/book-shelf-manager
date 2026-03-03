import { ComponentStore } from '@ngrx/component-store';
import { Injectable } from '@angular/core';

export interface HeaderState {
  isMenuOpen: boolean;
  routes: { label: string; icon: string; path: string }[];
}

@Injectable()
export class HeaderStore extends ComponentStore<HeaderState> {
  constructor() {
    super({
      isMenuOpen: false,
      routes: [
        {
          label: 'Books',
          icon: 'LibraryBig',
          path: '/books',
        },
        {
          label: 'Board',
          icon: 'Kanban',
          path: '/board',
        },
      ],
    });
  }

  readonly toggleMenu = this.updater((state) => ({ ...state, isMenuOpen: !state.isMenuOpen }));
  readonly closeMenu = this.updater((state) => ({ ...state, isMenuOpen: false }));

  readonly closeMenuIfOpen = () => {
    if (this.state().isMenuOpen) {
      this.closeMenu();
    }
  };
}
