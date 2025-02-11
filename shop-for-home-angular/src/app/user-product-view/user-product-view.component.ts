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
import { WishListService } from '../service/wish-list.service';
import { WishList } from '../model/wish-list';

@Component({
  selector: 'app-admin-product-list',
  standalone: true,
  imports: [CommonModule, RouterOutlet, HttpClientModule, RouterModule, FormsModule],
  providers: [ProductService, AuthService, OrderService, WishListService],
  templateUrl: './user-product-view.component.html',
  styleUrls: ['./user-product-view.component.css']
})
export class UserProductViewComponent implements OnInit {

  product: Product | null = null;
  user: User | null = null;
  currentOrder: Order | null = null;
  orderProduct : OrderProduct | null = null;
  orderProductIdx: number = -1; // updated to index of orderProduct in current order if already present
  cartButtonText: string = "Add to Cart"; // form submission text, changed if product already present in user order
  wishItem: WishList | null = null;

  constructor(private productService: ProductService, private authService: AuthService, private orderService: OrderService, private router: Router,
    private route: ActivatedRoute, private wishService: WishListService
  ) {}

  ngOnInit(): void {
    this.fetchUser();
  }

  fetchProduct(): void {
    const productId = this.route.snapshot.paramMap.get('productId');
    if (productId) {
      this.productService.getProductById(Number(productId)).subscribe((product) => {
        this.product = product;
        console.log(this.product);
        this.fetchUnplacedOrder();
        this.fetchWishList();
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
        this.fetchProduct();
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
      this.orderProductIdx = this.findOrderProductIndex(this.product.id);

      if (this.orderProductIdx != -1) {
        this.orderProduct = this.currentOrder.orderProducts[this.orderProductIdx];
        this.cartButtonText = "Update Cart";
      } else {
        this.orderProduct = {
          id: {
            orderId: this.currentOrder.id,
            productId: this.product.id
          },
          quantity: 1
        };
      }
      console.log(this.orderProduct);
    }
  }

  findOrderProductIndex(productId: number): number {
    return this.currentOrder?.orderProducts.findIndex(op => op.id.productId === productId) ?? -1;
  }

  fetchWishList(): void {
    if (this.user && this.product) {
      this.wishService.getWishListByUserId(this.user.id).subscribe(
        (wishList: WishList[]) => {
          console.log('Wish List:', wishList);
          const wishItem = wishList.find(wishItem => wishItem.id.productId === this.product?.id);

          if (wishItem) {
            this.wishItem = wishItem;
          }
        },
        (error) => {
          console.error('Error fetching wish list:', error);
        }
      );
    }
  }
  
  saveCart(): void {
    if (this.currentOrder && this.orderProduct && this.product) {
      if (!this.currentOrder.orderProducts) {
        this.currentOrder.orderProducts = [];
      }

      if (this.orderProduct.quantity > this.product.stock) {
        this.orderProduct.quantity = this.product.stock;
      }

      if (this.orderProductIdx !== -1) { // if product already present, update element in array
        this.currentOrder.orderProducts[this.orderProductIdx] = this.orderProduct;
      } else { // if product not already present, push element into array
        this.currentOrder.orderProducts.push(this.orderProduct);
      }

      this.updateOrder();
    } else {
      console.log("Error adding to cart")
    }
  }

  updateOrder(): void {
    if (this.currentOrder) {
      // update order through API
      this.orderService.updateOrder(this.currentOrder).subscribe(
        () => {
          alert("Cart successfully updated!");
          this.router.navigate(['/user/shop']);
        },
        (error) =>  { 
          console.error('Error updating order:', error);
        }
      );
    }
  }

  removeItem(): void {
    if (this.currentOrder && this.product && this.orderProductIdx !== -1) {
      this.currentOrder.orderProducts.splice(this.orderProductIdx, 1);
      console.log("Removed product ID " + this.product.id + " from order " + this.currentOrder.id);
      this.updateOrder();
    }
  }

  removeWishList(): void {
    if (this.wishItem) {
      this.wishService.deleteWishItem(this.wishItem).subscribe({
        next: () => {
          this.wishItem = null;
        },
        error: err => {
          console.error('Failed to remove wish item:', err);
        }
      });
    }
  }

  addWishList(): void {
    if (this.product && this.user) {
       const wishItem: WishList = { id: { productId: this.product.id, userId: this.user.id } };

       this.wishService.addWishItem(wishItem).subscribe(
        (response) => {
          console.log('Wish item added successfully:', response);
          this.wishItem = response;
        },
        (error) => {
          console.error('Error saving wish item:', error);
        }
      );
    }
  }

  cancel(): void {
    this.router.navigate(['/user/shop']);
  }
}