import {
  ApplicationConfig,
  inject,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';

import { provideRouter, withViewTransitions } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideToastr } from 'ngx-toastr';
import { errorInterceptor } from '../core/_interceptors/error.interceptor';
import { InitService } from '../core/_services/init-service';
import { lastValueFrom } from 'rxjs';
import { jwtInterceptor } from '../core/_interceptors/jwt-interceptor';
import { loadingInterceptor } from '../core/_interceptors/loading-interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withViewTransitions()),
    provideHttpClient(
      withInterceptors([errorInterceptor, jwtInterceptor, loadingInterceptor])
    ),
    provideBrowserGlobalErrorListeners(),
    provideAnimations(),
    provideAppInitializer(async () => {
      const initService = inject(InitService);

      return new Promise<void>((resolve) => {
        setTimeout(async () => {
          try {
            await lastValueFrom(initService.init());
          } catch (error) {
            console.error('Initialization failed:', error);
          } finally {
            const splash = document.getElementById('initial-splash');
            if (splash) {
              splash.remove();
            }
            resolve();
          }
        }, 500);
      });
    }),
  ],
};
