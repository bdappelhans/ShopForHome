import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { API_BASE_URL } from "./api-base";
import { User } from "../model/user";
import { Observable } from "rxjs";
import { Product } from "../model/product";
import { WishList } from "../model/wish-list";

@Injectable({
    providedIn: 'root'
})
export class WishListService {
  private wishApiUrl = `${API_BASE_URL}/api/wish`;

  private httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
  
  constructor(private http: HttpClient) { }
  
  getWishListByUserId(userId: number): Observable<WishList[]> {
    const url = `${this.wishApiUrl}/${userId}/all`;
    return this.http.get<WishList[]>(url);
  }

  addWishItem(wishList: WishList): Observable<WishList> {
    const url = `${this.wishApiUrl}/add`;
    return this.http.post<WishList>(url, wishList, this.httpOptions);
  }

  deleteWishItem(wishList: WishList): Observable<void> {
    const url = `${this.wishApiUrl}/remove`;
    return this.http.request<void>('DELETE', url, {
      body: wishList,
      headers: this.httpOptions.headers
    });
    }
}