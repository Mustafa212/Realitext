import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import player from 'lottie-web';
import { provideLottieOptions } from 'ngx-lottie';
import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHotToastConfig } from '@ngneat/hot-toast';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { jwtInterceptor } from './_interceptors/jwt.interceptor';
import { errorInterceptor } from './_interceptors/error.interceptor';

export const appConfig: ApplicationConfig = {
  providers: 
  [
    provideZoneChangeDetection({ eventCoalescing: true }), 
    provideRouter(routes), 
    provideAnimationsAsync(),
    provideHotToastConfig(),
    provideHttpClient(withInterceptors([errorInterceptor,jwtInterceptor ])),
    provideLottieOptions({
      player: () => player,
    }),

  ]
};
