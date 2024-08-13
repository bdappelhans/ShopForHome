import { Injectable } from "@angular/core";
import { API_BASE_URL } from "./api-base";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { User } from "../model/user";

@Injectable({
    providedIn: 'root'
})
export class UserService {
  private userApiUrl = `${API_BASE_URL}/users`

  private httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
  
  constructor(private http: HttpClient) { }

  getUserByEmail(email: string) {
    const url = `${this.userApiUrl}/email/${email}`;
    return this.http.get<User>(url);
  }

  getAllUsers() {
    const url = `${this.userApiUrl}/all`;
    return this.http.get<User[]>(url);
  }

  addUser(user: User) {
    const url = `${this.userApiUrl}/add`;
    return this.http.post<User>(url, user, this.httpOptions);
  }  
}