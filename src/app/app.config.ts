import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  importProvidersFrom,
  isDevMode,
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
  Kanban,
} from 'lucide-angular';
import { TemplatePageTitleStrategy } from '@core/strategies';
import { httpErrorInterceptor } from '@core/interceptors';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { routes } from './app.routes';
import { provideStore, provideState } from '@ngrx/store';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { provideEffects } from '@ngrx/effects';
import { provideRouterStore, routerReducer } from '@ngrx/router-store';
import { authFeature, AuthEffects } from '@app/core/state/auth';
import { themeFeature, ThemeEffects } from '@app/core/state/theme';
import { scrollFeature, ScrollEffects } from '@app/core/state/scroll';
import { CustomSerializer, RouterEffects } from '@app/core/state/router';
import { errorModalFeature, ErrorModalEffects } from '@shared/error-modal/state';
import { bookFeature, BookEffects } from '@app/features/books/state';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideHttpClient(withInterceptors([httpErrorInterceptor])),
    provideRouter(
      routes,
      // withComponentInputBinding(),
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
        Kanban,
      }),
    ),
    provideStore({ router: routerReducer }),
    provideStoreDevtools({ maxAge: 25, logOnly: !isDevMode() }),
    provideState(authFeature),
    provideState(themeFeature),
    provideState(scrollFeature),
    provideState(errorModalFeature),
    provideState(bookFeature),
    provideEffects([
      AuthEffects,
      ThemeEffects,
      ScrollEffects,
      ErrorModalEffects,
      RouterEffects,
      BookEffects,
    ]),
    provideRouterStore({
      serializer: CustomSerializer,
    }),
  ],
};
