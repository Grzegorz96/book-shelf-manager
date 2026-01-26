import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  importProvidersFrom,
} from '@angular/core';
import { provideRouter, TitleStrategy } from '@angular/router';
import {
  LucideAngularModule,
  LibraryBig,
  LogIn,
  LogOut,
  Mail,
  Phone,
  SquareCheck,
  Square,
  X,
  Heart,
  Star,
  Plus,
  BookPlus,
  Trash2,
  SquarePen,
  CalendarDays,
  NotebookPen,
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
      })
    ),
  ],
};
