import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { BusyService } from '../_services/busy-service';
import { delay, finalize, of, tap } from 'rxjs';

const cache = new Map<string, any>();
export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  const busyService = inject(BusyService);

  if (req.method === 'GET') {
    const cachedResponse = cache.get(req.url);
    if (cachedResponse) {
      return of(cachedResponse); // Return cached response if available
    }
  }
  busyService.busy();

  return next(req).pipe(
    delay(500), // Simulate a delay for demonstration purposes
    tap((response) => {
      cache.set(req.url, response); // Cache the response
    }),
    finalize(() => {
      busyService.idle();
    })
  );
};
