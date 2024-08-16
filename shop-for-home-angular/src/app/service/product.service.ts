import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { API_BASE_URL } from "./api-base";
import { User } from "../model/user";
import { Observable } from "rxjs";
import { Product } from "../model/product";

@Injectable({
    providedIn: 'root'
})
export class ProductService {
  private productApiUrl = `${API_BASE_URL}/api/products`;

  private httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
  
  constructor(private http: HttpClient) { }
  
  getProducts(): Observable<Product[]> {
    const url = `${this.productApiUrl}/all`;
    return this.http.get<Product[]>(url);
  }

  getProductById(productId: number): Observable<Product> {
    const url = `${this.productApiUrl}/${productId}`;
    return this.http.get<Product>(url);
  }

  updateProduct(product: Product): Observable<Product> {
    const url = `${this.productApiUrl}/update`;
    return this.http.put<Product>(url, product, this.httpOptions);
  }

  addProduct(product: Product): Observable<Product> {
    const url = `${this.productApiUrl}/add`;
    return this.http.post<Product>(url, product, this.httpOptions);
  }
}