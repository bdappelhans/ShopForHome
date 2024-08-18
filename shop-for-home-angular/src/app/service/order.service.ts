import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { API_BASE_URL } from "./api-base";
import { Observable, of, switchMap } from "rxjs";
import { Product } from "../model/product";
import { Order } from "../model/order";
import { stringify } from 'flatted';

@Injectable({
    providedIn: 'root'
})
export class OrderService {
  private orderApiUrl = `${API_BASE_URL}/api/orders`;

  private httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
  
  constructor(private http: HttpClient) { }
  
  getOrCreateUnplacedOrder(userId: number): Observable<Order> {
    return this.http.get<Order | null>(`${this.orderApiUrl}/${userId}/unplaced`).pipe(
      switchMap(order => {
        if (order === null) {
          return this.createUnplacedOrder(userId);
        } else {
          return of(order);
        }
      })
    );
  }

  private createUnplacedOrder(userId: number): Observable<Order> {
    const newOrder = {
      userId: userId,
    };
    return this.http.post<Order>(`${this.orderApiUrl}/create`, newOrder);
  }


  updateOrder(order: Order): Observable<Order> {
    const url = `${this.orderApiUrl}/update`;
    return this.http.put<Order>(url, order, this.httpOptions);
  }
/*
  addProduct(product: Product): Observable<Product> {
    const url = `${this.productApiUrl}/add`;
    return this.http.post<Product>(url, product, this.httpOptions);
  }*/
}