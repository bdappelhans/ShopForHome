import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    console.log("Interception");
    
    // except for /login and /signup endpoints
    if (req.url.includes('/login') || req.url.includes('/signup')) {
      return next.handle(req);
    }

    const token = localStorage.getItem('token');

    if (token) {
      console.log("Token in Interception: " + token);
      const cloned = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log("Header set with token, attempting request");
      return next.handle(cloned);
    }

    return next.handle(req);
  }
}
