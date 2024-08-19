import { Injectable } from "@angular/core";
import { API_BASE_URL } from "./api-base";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { User } from "../model/user";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class UserService {
  private userApiUrl = `${API_BASE_URL}/api/users`

  private httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
  
  constructor(private http: HttpClient) { }

  getUserByEmail(email: string) {
    const url = `${this.userApiUrl}/email/${email}`;
    return this.http.get<User>(url);
  }

  getUserById(id: number) {
    const url = `${this.userApiUrl}/id/${id}`;
    return this.http.get<User>(url);
  }

  getAllUsers() {
    const url = `${this.userApiUrl}/all`;
    return this.http.get<User[]>(url);
  }

  getAllActiveUsers() {
    const url = `${this.userApiUrl}/active`;
    return this.http.get<User[]>(url);
  }

  updateUser(user: User): Observable<User> {
    const url = `${this.userApiUrl}/update`;
    return this.http.put<User>(url, user, this.httpOptions);
  }

}