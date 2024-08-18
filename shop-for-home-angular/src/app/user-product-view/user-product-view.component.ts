import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { RouterModule, RouterOutlet, Router, ActivatedRoute } from '@angular/router';
import { ProductService } from '../service/product.service';
import { Product } from '../model/product';
import { Order } from '../model/order';
import { User } from '../model/user';
import { AuthService } from '../service/auth.service';
import { OrderService } from '../service/order.service';
import { FormsModule } from '@angular/forms';
import { OrderProduct } from '../model/order-product';

@Component({
  selector: 'app-admin-product-list',
  standalone: true,
  imports: [CommonModule, RouterOutlet, HttpClientModule, RouterModule, FormsModule],
  providers: [ProductService, AuthService, OrderService],
  templateUrl: './user-product-view.component.html',
  styleUrls: ['./user-product-view.component.css']
})
export class UserProductViewComponent implements OnInit {

  product: Product | null = null;
  user: User | null = null;
  currentOrder: Order | null = null;
  orderProduct : OrderProduct | null = null;

  constructor(private productService: ProductService, private authService: AuthService, private orderService: OrderService, private router: Router,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.fetchUser();
    this.fetchProduct();
    this.fetchUnplacedOrder();
    this.establishOrderProduct();
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

  fetchUser(): void {
    if (typeof window !== 'undefined') {
      const userString = localStorage.getItem('user');

      if (userString) {
        this.user = JSON.parse(userString);
        console.log("Retrieved user " + this.user?.id);
      } else {
        console.log("No user found")
      }
     } else {
      console.error('localStorage is not available')
    }
  }

  fetchUnplacedOrder(): void {
    if (this.user) {
      this.orderService.getOrCreateUnplacedOrder(this.user?.id).subscribe(
        (order: Order) => {
          console.log("Unplaced order: ", order);
          this.currentOrder = order;
          this.establishOrderProduct();
        },
        (error) => {
          console.error('Error fetching order:', error);
        }
      );
    }
  }

  establishOrderProduct(): void {
    if (this.currentOrder && this.product) {
      this.orderProduct = { order: this.currentOrder, product: this.product, quantity: 1 };
    }
  }

  cancel(): void {
    this.router.navigate(['/user/shop']);
  }
}