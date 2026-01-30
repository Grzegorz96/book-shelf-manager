import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  importProvidersFrom,
} from '@angular/core';
import {
  provideRouter,
  TitleStrategy,
  withComponentInputBinding,
  withInMemoryScrolling,
} from '@angular/router';
import {
  LucideAngularModule,
  LibraryBig,
  ListFilter,
  LogIn,
  LogOut,
  Mail,
  Phone,
  SquareCheck,
  Square,
  X,
  Heart,
  Star,
  BookPlus,
  Trash2,
  SquarePen,
  CalendarDays,
  NotebookPen,
  Clock,
  Menu,
  House,
  Sun,
  Moon,
} from 'lucide-angular';
import { TemplatePageTitleStrategy } from '@core/services';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(
      routes,
      withComponentInputBinding(),
      withInMemoryScrolling({
        anchorScrolling: 'enabled',
        scrollPositionRestoration: 'enabled',
      }),
    ),
    { provide: TitleStrategy, useClass: TemplatePageTitleStrategy },
    importProvidersFrom(
      LucideAngularModule.pick({
        LibraryBig,
        ListFilter,
        LogIn,
        LogOut,
        Mail,
        Phone,
        X,
        Heart,
        Star,
        SquareCheck,
        Square,
        BookPlus,
        Trash2,
        SquarePen,
        CalendarDays,
        NotebookPen,
        Clock,
        Menu,
        House,
        Sun,
        Moon,
      }),
    ),
  ],
};
