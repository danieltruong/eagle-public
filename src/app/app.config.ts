import { ApplicationConfig, provideBrowserGlobalErrorListeners, ErrorHandler, inject, provideAppInitializer } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors, HttpInterceptorFn } from '@angular/common/http';

import { routes } from './app.routes';
import { httpCacheInterceptor } from './interceptors/http-cache.interceptor';
import { loggingInterceptor } from './interceptors/logging.interceptor';
import { GlobalErrorHandler } from './services/global-error-handler';
import { ConfigService } from './services/config.service';

interface EnvConfig {
  ENVIRONMENT?: string;
}

declare const window: Window & { __env?: EnvConfig };

/**
 * Detect if the application is running in production environment
 */
function isProduction(): boolean {
  const env = window.__env || {};
  return env.ENVIRONMENT === 'prod';
}

/**
 * Build interceptors array based on environment
 * Production: only cache interceptor (logging overhead is removed)
 * Non-production: cache + logging interceptors for debugging
 */
function getHttpInterceptors(): HttpInterceptorFn[] {
  const interceptors: HttpInterceptorFn[] = [httpCacheInterceptor];
  
  // Only include logging interceptor in non-production environments
  if (!isProduction()) {
    interceptors.push(loggingInterceptor);
  }
  
  return interceptors;
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(withInterceptors(getHttpInterceptors())),
    { provide: ErrorHandler, useClass: GlobalErrorHandler },
    provideAppInitializer(() => {
      const configService = inject(ConfigService);
      return configService.init();
    })
  ]
};
