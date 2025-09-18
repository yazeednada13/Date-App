import { HttpEvent, HttpInterceptorFn, HttpParams } from '@angular/common/http';
import { inject } from '@angular/core';
import { BusyService } from '../_services/busy-service';
import { delay, finalize, identity, of, tap } from 'rxjs';
import { environment } from '../../environments/environment';

type CacheEntry = {
  response: HttpEvent<unknown>;
  timestamp: number;
};
const cache = new Map<string, CacheEntry>();
const CASHE_DURATION_MS = 5 * 60 * 1000; // 5 Mins
export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  const busyService = inject(BusyService);

  const generateCachKey = (url: string, params: HttpParams): string => {
    const paramString = params
      .keys()
      .map((key) => `${key}=${params.get(key)}`)
      .join('&');
    return paramString ? `${url}?${paramString}` : url;
  };

  const invalidateCache = (urlPattern: string) => {
    for (const key of cache.keys()) {
      if (key.includes(urlPattern)) {
        cache.delete(key);
      }
    }
  };

  const cacheKey = generateCachKey(req.url, req.params);

  if (req.method.includes('POST') && req.url.includes('/likes')) {
    invalidateCache('/likes');
  }
  if (req.method.includes('POST') && req.url.includes('/messages')) {
    invalidateCache('/messages');
  }
  if (req.method.includes('POST') && req.url.includes('/messages')) {
    cache.clear();
  }

  if (req.method === 'GET') {
    const cachedResponse = cache.get(cacheKey);
    if (cachedResponse) {
      const isExpired =
        Date.now() - cachedResponse.timestamp > CASHE_DURATION_MS;
      if (!isExpired) {
        return of(cachedResponse.response); // Return cached response if available
      } else {
        cache.delete(cacheKey);
      }
    }
  }
  busyService.busy();

  return next(req).pipe(
    environment.production ? identity : delay(500), // Simulate a delay for demonstration purposes
    tap((response) => {
      cache.set(cacheKey, {
        response,
        timestamp: Date.now(),
      }); // Cache the response
    }),
    finalize(() => {
      busyService.idle();
    })
  );
};
