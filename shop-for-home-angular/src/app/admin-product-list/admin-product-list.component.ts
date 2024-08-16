import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { RouterModule, RouterOutlet, Router } from '@angular/router';
import { ProductService } from '../service/product.service';
import { Product } from '../model/product';

@Component({
  selector: 'app-admin-product-list',
  standalone: true,
  imports: [CommonModule, RouterOutlet, HttpClientModule, RouterModule],
  providers: [ProductService],
  templateUrl: './admin-product-list.component.html',
  styleUrls: ['./admin-product-list.component.css']
})
export class AdminProductListComponent implements OnInit {

  products: Product[] = [];

  constructor(private productService: ProductService, private router: Router) {}

  ngOnInit(): void {
    this.fetchProducts();
  }

  fetchProducts(): void {
    this.productService.getProducts().subscribe(
      (products: Product[]) => {
        console.log('Products:', products);
        this.products = products;
      },
      (error) => {
        console.error('Error fetching products:', error);
      }
    );
  }

  changeProductStatus(product: Product): void {
    if (product.active) {
      product.active = false;
    } else {
      if (product.stock < 1) {
        alert('Error: Product can\'t be active if its current stock is 0. Update stock to activate.')
        return;
      }
      product.active = true;
    }

    this.productService.updateProduct(product).subscribe(updatedProduct => {
      const index = this.products.findIndex(e => e.id === updatedProduct.id);
      if (index !== -1) {
        this.products[index] = updatedProduct;
      }
    });
  }

  editProduct(productId: number): void {
    this.router.navigate(['/admin/product-edit', productId]);
  }

  addProduct(): void {
    this.router.navigate(['/admin/product-add'])
  }
}
