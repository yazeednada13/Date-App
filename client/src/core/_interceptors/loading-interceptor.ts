import { HttpInterceptorFn, HttpParams } from '@angular/common/http';
import { inject } from '@angular/core';
import { BusyService } from '../_services/busy-service';
import { delay, finalize, of, tap } from 'rxjs';

const cache = new Map<string, any>();
export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  const busyService = inject(BusyService);

  const generateCachKey = (url: string, params: HttpParams): string => {
    const paramString = params
      .keys()
      .map((key) => `${key}=${params.get(key)}`)
      .join('&');
    return paramString ? `${url}?${paramString}` : url;
  };

  const cacheKey = generateCachKey(req.url, req.params);

  if (req.method === 'GET') {
    const cachedResponse = cache.get(cacheKey);
    if (cachedResponse) {
      return of(cachedResponse); // Return cached response if available
    }
  }
  busyService.busy();

  return next(req).pipe(
    delay(500), // Simulate a delay for demonstration purposes
    tap((response) => {
      cache.set(cacheKey, response); // Cache the response
    }),
    finalize(() => {
      busyService.idle();
    })
  );
};
