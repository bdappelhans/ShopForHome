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
  templateUrl: './admin-product-add.component.html',
  styleUrl: './admin-product-add.component.css'
})
export class AdminProductAddComponent implements OnInit{
  product: Product = { id: 0, description: '', price: 0.01, stock: 0, active: false, imageUrl: '' };

  constructor(private productService: ProductService, private route: ActivatedRoute, 
    private router: Router) {}

  ngOnInit(): void {
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
      if (this.product.active && this.product.stock < 1) {
        alert("Error: Unable to set product to active with a stock of 0")
        return;
      }

      this.productService.addProduct(this.product).subscribe(
        () => this.router.navigate(['/admin/product-list']),
        (error) => console.error('Error saving product:', error)
      );
    }
  }

  cancel(): void {
    this.router.navigate(['/admin/product-list']);
  }
}
