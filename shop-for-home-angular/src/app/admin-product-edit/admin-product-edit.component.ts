import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { RouterModule, RouterOutlet, Router, ActivatedRoute } from '@angular/router';
import { ProductService } from '../service/product.service';
import { Product } from '../model/product';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-product-edit',
  standalone: true,
  imports: [CommonModule, RouterOutlet, HttpClientModule, RouterModule, FormsModule],
  providers: [ProductService],
  templateUrl: './admin-product-edit.component.html',
  styleUrl: './admin-product-edit.component.css'
})
export class AdminProductEditComponent implements OnInit{
  product: Product | null = null;

  constructor(private productService: ProductService, private route: ActivatedRoute, 
    private router: Router) {}

  ngOnInit(): void {
    this.fetchProduct();
  }

  fetchProduct(): void {
    const productId = this.route.snapshot.paramMap.get('productId');
    if (productId) {
      this.productService.getProductById(Number(productId)).subscribe((product) => {
        this.product = product;
        console.log(this.product);
      });
    } else {
      this.cancel();
    }
  }

  // Method to handle stock change
  onStockChange() {
    if (this.product != null && this.product.stock < 0) {
      this.product.stock = 0;
    }
  }

    // Method to handle price change
    onPriceChange() {
      if (this.product != null && this.product.price < 0.01) {
        this.product.price = 0.01;
      }
    }

  saveProduct(): void {
    if (this.product) {

      if (this.product.description === '') {
        alert("Error: Description is required");
        return;
      }

      this.productService.updateProduct(this.product).subscribe(
        () => this.router.navigate(['/admin/product-list']),
        (error) => console.error('Error saving product:', error)
      );
    }
  }

  remove(): void {
    if (this.product) {
      this.product.active = false;

      this.productService.updateProduct(this.product).subscribe(
        () => this.router.navigate(['/admin/product-list']),
        (error) => console.error('Error saving product:', error)
      );
    }
  }

  cancel(): void {
    this.router.navigate(['/admin/product-list']);
  }
}
