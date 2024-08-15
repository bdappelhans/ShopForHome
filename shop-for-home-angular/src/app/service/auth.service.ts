import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { tap, catchError } from 'rxjs/operators';
import { API_BASE_URL } from "./api-base";
import { User } from "../model/user";
import { LoginUserDto } from "../model/login-user-dto";

@Injectable({
    providedIn: 'root',
  })
export class AuthService {
    private userSubject = new BehaviorSubject<User | null>(null);

    constructor(private http: HttpClient) {}

    login(loginUser: LoginUserDto): Observable<any> {
        return this.http.post<{ token: string }>(`${API_BASE_URL}/auth/login`, loginUser).pipe(
          tap(response => {
            localStorage.setItem('token', response.token);
            console.log("Stored token in local storage: " + localStorage.getItem('token'));
            this.fetchUserDetails();
          }), 
          catchError(error => {
            console.error('Login error:', error);
            throw error;
          })
        );
    }

    fetchUserDetails(): Observable<User> {
      return this.http.get<User>(`${API_BASE_URL}/api/users/me`).pipe(
        tap(user => {
          console.log("Found user details:");
          console.log(user);
          localStorage.setItem('user', JSON.stringify(user));
          this.userSubject.next(user);
        }),
        catchError(error => {
          console.error('Failed to fetch user details:', error);
          throw error;
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
    }
}