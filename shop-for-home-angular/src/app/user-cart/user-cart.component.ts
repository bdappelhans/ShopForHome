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
import { CartItem } from '../model/cart-item';
import { OrderProduct } from '../model/order-product';
import { Coupon } from '../model/coupon';

@Component({
  selector: 'app-admin-product-list',
  standalone: true,
  imports: [CommonModule, RouterOutlet, HttpClientModule, RouterModule],
  providers: [ProductService, AuthService, OrderService],
  templateUrl: './user-cart.component.html',
  styleUrls: ['./user-cart.component.css']
})
export class UserCartComponent implements OnInit {

  cartItems: CartItem[] = [];
  user: User | null = null;
  currentOrder: Order | null = null;
  currentUserCoupon: Coupon | null = null;

  constructor(private productService: ProductService, private authService: AuthService, private orderService: OrderService, private router: Router) {}

  ngOnInit(): void {
    this.fetchUser();
  }

  fetchCartItems(): void {
    if (this.currentOrder?.orderProducts) {

      const invalidIndices: number[] = [];
      let invalidCartItems: boolean = false;

      // iterate through current order's products, fetch them, and place them in cart array
      for (let i = 0; i < this.currentOrder.orderProducts.length; i++) {
        const op = this.currentOrder.orderProducts[i];

        this.productService.getProductById(op.id.productId).subscribe(
          (product: Product) => {
            // if item is no longer available, collect index of item
            if (!product.active || product.stock < 1) {
              invalidIndices.push(i);
              invalidCartItems = true;
            } else {

            // set quantity and total item price variables, create new cartItem from information
            const quantity: number = op.quantity;
            const itemTotal: number = op.quantity * product.price;

            const cartItem: CartItem = { product: product, quantity: quantity, totalItemPrice: itemTotal };

            // push cartItem into array
            this.cartItems.push(cartItem);
            }
          },
          (error) => {
            console.error('Error fetching product:', error)
          }
        )
      }

      // if any cart items are invalid, remove them from the order, display message, and update order
      setTimeout(() => {
        for (const index of invalidIndices.reverse()) {
          this.currentOrder?.orderProducts.splice(index, 1);
        }
  
        if (invalidCartItems) {
          alert("One or more items in your cart is no longer available. Cart has been updated.");
          this.updateOrderRefresh();
          invalidCartItems = false;
        }
  
        console.log("Cart Items: ", this.cartItems);
      }, 500); // Adjust delay based on the timing needs
    }
  }

  fetchUser(): void {
    this.authService.fetchUserDetails().subscribe(user => {
      this.user = user;
      this.fetchUnplacedOrder();
    });
  }

  fetchUnplacedOrder(): void {
    if (this.user) {
      this.orderService.getOrCreateUnplacedOrder(this.user?.id).subscribe(
        (order: Order) => {
          console.log("Unplaced order: ", order);
          this.currentOrder = order;
          this.fetchCartItems();
          this.checkCouponCompatibility();
        },
        (error) => {
          console.error('Error fetching order:', error);
        }
      );
    }
  }

  checkCouponCompatibility(): void {
    if (this.user && this.currentOrder) {
      if (!this.user.coupon && this.currentOrder.coupon) {
        this.currentOrder.coupon = null;
        this.updateOrderRefresh();
      } else if ((this.user.coupon && this.currentOrder.coupon) && (this.user.coupon.id != this.currentOrder.coupon.id)) {
        this.currentOrder.coupon = null;
        this.updateOrderRefresh();
      }
    }
  }

  applyCoupon(): void {
    if (this.user && this.currentOrder && this.user.coupon) {
      this.currentOrder.coupon = this.user.coupon;
      this.updateOrderRefresh();
    }
  }

  placeOrder(): void {
    if (this.cartItems && this.currentOrder) {
      for (let cartItem of this.cartItems) {
        let updatedProduct: Product = cartItem.product;
        // Subtract cartItem quantity from product stock
        updatedProduct.stock -= cartItem.quantity;
  
        this.productService.updateProduct(updatedProduct).subscribe(
          (response) => {
            console.log('Product updated successfully:', response);
          },
          (error) => console.error('Error saving product:', error)
        );
      }

      this.currentOrder.placed = true;

      this.orderService.placeOrder(this.currentOrder).subscribe(
        (updatedOrder: Order) => {
          console.log("Placing order");
          alert("Order successfully placed!")
          this.router.navigate(['/user/shop'])
        },
        (error) =>  { 
          console.error('Error updating order:', error);
        }
      );
    }
  }

  updateOrderRefresh(): void {
    if (this.currentOrder) {
      // update order through API
      this.orderService.updateOrder(this.currentOrder).subscribe(
        (updatedOrder: Order) => {
          console.log("Updating order");
          this.currentOrder = updatedOrder;
          console.log(this.currentOrder);
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