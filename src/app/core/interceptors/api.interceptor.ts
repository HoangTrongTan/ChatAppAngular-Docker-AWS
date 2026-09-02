import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const apiInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const username = auth.username();

  const cloned = req.clone({
    setHeaders: {
      'Content-Type': 'application/json',
      ...(username ? { 'X-Username': username } : {}),
    },
  });

  return next(cloned);
};
