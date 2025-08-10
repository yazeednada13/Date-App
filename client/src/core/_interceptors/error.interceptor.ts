import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';

import { catchError } from 'rxjs';
import { ToastService } from '../_services/toast-service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const toastr = inject(ToastService);

  return next(req).pipe(
    // Handle errors from the HTTP request
    catchError((error) => {
      if (error) {
        switch (error.status) {
          case 400:
            if (error.error.errors) {
              const modalStateErrors = [];
              for (const key in error.error.errors) {
                if (error.error.errors[key]) {
                  modalStateErrors.push(error.error.errors[key]);
                }
              }
              throw modalStateErrors.flat();
            } else {
              toastr.error(error.error);
            }
            break;
          case 401:
            toastr.error('Unauthorized');
            break;
          case 404:
            toastr.error('Not found');
            router.navigateByUrl('/not-found');

            break;
          case 500:
            const navigationExtra: NavigationExtras = {
              state: { error: error.error },
            };
            router.navigateByUrl('/server-error', navigationExtra),
              toastr.error('Server Error');
            break;
          default:
            toastr.error('Something unexpected went wrong');
            break;
        }
      }
      throw error;
    })
  );
};
