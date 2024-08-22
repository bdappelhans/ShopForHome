import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { RouterModule, RouterOutlet, Router } from '@angular/router';
import { ProductService } from '../service/product.service';
import { Product } from '../model/product';
import { Order } from '../model/order';
import { User } from '../model/user';
import { AuthService } from '../service/auth.service';
import { OrderService } from '../service/order.service';
import { FormsModule } from '@angular/forms';
import { OrderProduct } from '../model/order-product';

interface OrderProductDetails {
    orderProduct: OrderProduct,
    alreadyInCart: boolean
}

@Component({
  selector: 'app-admin-product-list',
  standalone: true,
  imports: [CommonModule, RouterOutlet, HttpClientModule, RouterModule, FormsModule],
  providers: [ProductService, AuthService, OrderService],
  templateUrl: './user-product-list.component.html',
  styleUrls: ['./user-product-list.component.css']
})
export class UserProductListComponent implements OnInit {
  products: Product[] = [];
  user: User | null = null;
  currentOrder: Order | null = null;
  opDetails: { [productId: number]: OrderProductDetails } = {};

  constructor(private productService: ProductService, private authService: AuthService, private orderService: OrderService, private router: Router) {}

  ngOnInit(): void {
    this.fetchUser();
  }

  fetchProducts(): void {
    this.productService.getActiveProducts().subscribe(
      (products: Product[]) => {
        console.log('Products:', products);
        this.products = products;
        this.createProductDetailsMap();
      },
      (error) => {
        console.error('Error fetching products:', error);
      }
    );
  }

  createProductDetailsMap(): void {
    for (const product of this.products) {
      let orderProduct = this.currentOrder?.orderProducts.find(op => op.id.productId === product.id);
      let opDetails: OrderProductDetails;

      if (orderProduct) {
        opDetails = { orderProduct, alreadyInCart: true };
        this.opDetails[product.id] = opDetails;
      } else {
        if (this.currentOrder) {
          let orderProduct = {id: { orderId: this.currentOrder?.id, productId: product.id}, quantity: 1 };
          opDetails = { orderProduct: orderProduct, alreadyInCart: false };
          this.opDetails[product.id] = opDetails;
        }
      }
    }
  }

  fetchUser(): void {
    if (typeof window !== 'undefined') {
      const userString = localStorage.getItem('user');

      if (userString) {
        this.user = JSON.parse(userString);
        console.log("Retrieved user " + this.user?.id);
        this.fetchUnplacedOrder();
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
          this.fetchProducts();
        },
        (error) => {
          console.error('Error fetching order:', error);
        }
      );
    }
  }

  updateCart(productId: number): void {
    const opDetails: OrderProductDetails = this.opDetails[productId];
    const op = opDetails.orderProduct;

    if (this.currentOrder) {
      if (opDetails.alreadyInCart) {

        let index = this.currentOrder.orderProducts.findIndex(op => op.id.productId === productId);
  
        if (index != -1) {
          this.currentOrder.orderProducts[index] = op;
        }
      } else {
        this.currentOrder.orderProducts.push(op);
        this.opDetails[productId].alreadyInCart = true;
      }

      this.orderService.updateOrder(this.currentOrder).subscribe(
        () => {
          alert("Cart successfully updated!");
        },
        (error) =>  { 
          console.error('Error updating order:', error);
        }
      );
    }
  }

  viewProduct(productId: number): void {
    this.router.navigate(['/user/shop/product', productId])
  }
}