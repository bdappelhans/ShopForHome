import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { map, tap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { User } from '../model/user';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {

  constructor(private router: Router) { }

  canActivate() {
    if (typeof localStorage !== 'undefined') {
        const userString = localStorage.getItem('user');
        if (!userString) {
            this.router.navigate(['/login']);
          return false; // Default role if no user is found
        } else {
            const user: User = JSON.parse(userString);
          return user.admin;
        }
    }
    return false;
  }
}
