import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { API_BASE_URL } from "./api-base";
import { User } from "../model/user";
import { Observable } from "rxjs";
import { Product } from "../model/product";
import { Coupon } from "../model/coupon";

@Injectable({
    providedIn: 'root'
})
export class CouponService {
  private productApiUrl = `${API_BASE_URL}/api/coupons`;

  private httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
  
  constructor(private http: HttpClient) { }
  
  getActiveCoupons(): Observable<Coupon[]> {
    const url = `${this.productApiUrl}/active`;
    return this.http.get<Coupon[]>(url);
  }

}