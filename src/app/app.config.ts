import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  importProvidersFrom,
} from '@angular/core';
import { provideRouter, TitleStrategy } from '@angular/router';
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
} from 'lucide-angular';
import { TemplatePageTitleStrategy } from '@core/services';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
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
      }),
    ),
  ],
};
