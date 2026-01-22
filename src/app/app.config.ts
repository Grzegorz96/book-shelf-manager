import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  importProvidersFrom,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { LucideAngularModule, LibraryBig, LogIn, LogOut, Mail, Phone } from 'lucide-angular';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    importProvidersFrom(
      LucideAngularModule.pick({
        LibraryBig,
        LogIn,
        LogOut,
        Mail,
        Phone,
      })
    ),
  ],
};
