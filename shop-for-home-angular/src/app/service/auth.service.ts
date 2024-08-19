import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, of } from "rxjs";
import { tap, catchError } from 'rxjs/operators';
import { API_BASE_URL } from "./api-base";
import { User } from "../model/user";
import { LoginUserDto } from "../model/login-user-dto";
import { RegisterUserDto } from "../model/register-user-dto";
import { Router } from '@angular/router';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    private userSubject = new BehaviorSubject<User | null>(null);

    constructor(private http: HttpClient, private router: Router) {}

    login(loginUser: LoginUserDto): Observable<any> {
        return this.http.post<{ token: string }>(`${API_BASE_URL}/auth/login`, loginUser).pipe(
          tap(response => {
            localStorage.setItem('token', response.token);
            this.fetchUserDetails().subscribe();
          }), 
          catchError(error => {
            console.error('Login error:', error);
            throw error;
          })
        );
    }

    register(registerUser: RegisterUserDto): Observable<User> {
      return this.http.post<User>(`${API_BASE_URL}/auth/signup`, registerUser).pipe(
        tap(user => {
          console.log('User registered successfully:', user);
        }),
        catchError(error => {
          console.error('Registration error:', error);
          throw error;
        })
      );
    }

    fetchUserDetails(): Observable<User | null> {
      console.log("Fetching user details from authService")
      const token = localStorage.getItem('token');
      if (!token) {
        console.log("No token found")
        return of(null); // No token, return an observable of null
      }
      return this.http.get<User>(`${API_BASE_URL}/api/users/me`).pipe(
        tap(user => {
          console.log("Updating user in local storage");
          console.log("Found user details:");
          console.log(user);
          localStorage.setItem('user', JSON.stringify(user));
          this.userSubject.next(user);
        }),
        catchError(error => {
          console.error('Failed to fetch user details:', error);
          this.logout(); // Clear user data and token on error
          return of(null); // Return observable of null on error
        })
      );
    }

    getUser(): Observable<User | null> {
      return this.userSubject.asObservable();
    }

    logout(): void {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        this.userSubject.next(null);
        this.router.navigate(['/login']); // Redirect to login page
    }
}
