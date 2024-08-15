import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { provideClientHydration } from '@angular/platform-browser';
import { routes } from './app.routes';
import { AuthInterceptor } from './interceptors/auth.interceptor'; // Ensure this path is correct

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideClientHydration(),
    HttpClientModule, ([
      { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
    ])
  ]
};
