import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../service/auth.service';
import { map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserGuard implements CanActivate {

  constructor(private router: Router) { }

  canActivate() {
    if (typeof localStorage !== 'undefined') {
      const userString = localStorage.getItem('user');
      if (!userString) {
        this.router.navigate(['/login']);
        return false; // Default role if no user is found
      } else {
        return true;
      }
    }
    return false;
  }
}
