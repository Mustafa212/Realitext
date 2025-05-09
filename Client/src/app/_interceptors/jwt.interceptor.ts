import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AccountService } from '../_services/account.service';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const accountservice = inject(AccountService)

  if (accountservice.currentuser()) {
    req = req.clone({
      setHeaders:{
        Authorization:`Bearer ${accountservice.currentuser()?.access_token}`
      }
    })
  }


  return next(req);
};
