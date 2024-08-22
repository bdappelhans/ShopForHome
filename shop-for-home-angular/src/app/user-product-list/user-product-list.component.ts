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
import { WishList } from '../model/wish-list';
import { WishListService } from '../service/wish-list.service';

interface OrderProductDetails {
    orderProduct: OrderProduct,
    alreadyInCart: boolean,
    alreadyInWishList: boolean
}

@Component({
  selector: 'app-admin-product-list',
  standalone: true,
  imports: [CommonModule, RouterOutlet, HttpClientModule, RouterModule, FormsModule],
  providers: [ProductService, AuthService, OrderService, WishListService],
  templateUrl: './user-product-list.component.html',
  styleUrls: ['./user-product-list.component.css']
})
export class UserProductListComponent implements OnInit {
  products: Product[] = [];
  user: User | null = null;
  currentOrder: Order | null = null;
  opDetails: { [productId: number]: OrderProductDetails } = {};
  wishList: WishList[] = [];

  constructor(private productService: ProductService, private authService: AuthService, private orderService: OrderService, 
    private router: Router, private wishService: WishListService) {}

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
      let alreadyInWishList = false;

      // check to see if item is already in wish list
      let wishIndex = this.wishList.findIndex(wishItem => wishItem.id.productId == product.id);

      // if product found in wish list, set alreadyInWishList property to true
      if (wishIndex != -1) {
        alreadyInWishList = true;
      }

      let opDetails: OrderProductDetails;

      if (orderProduct) {
        opDetails = { orderProduct, alreadyInCart: true, alreadyInWishList };
        this.opDetails[product.id] = opDetails;
      } else {
        if (this.currentOrder) {
          let orderProduct = {id: { orderId: this.currentOrder?.id, productId: product.id}, quantity: 1 };
          opDetails = { orderProduct: orderProduct, alreadyInCart: false, alreadyInWishList };
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
          this.fetchWishList();
        },
        (error) => {
          console.error('Error fetching order:', error);
        }
      );
    }
  }

  fetchWishList(): void {
    if (this.user) {
      this.wishService.getWishListByUserId(this.user.id).subscribe(
        (wishList: WishList[]) => {
          console.log('Wish List:', wishList);
          this.wishList = wishList;
          this.fetchProducts();
        },
        (error) => {
          console.error('Error fetching wish list:', error);
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
          this.currentOrder.orderProducts[index].quantity += op.quantity;
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

  removeFromCart(productId: number): void {
    if (this.currentOrder) {
      // Filter out the product from the order's products list
      this.currentOrder.orderProducts = this.currentOrder.orderProducts.filter(op => op.id.productId !== productId);
  
      // Update the order via the order service
      this.orderService.updateOrder(this.currentOrder).subscribe(
        () => {
          // Update the opDetails map if the currentOrder exists
          if (this.currentOrder) {
            this.opDetails[productId] = {
              orderProduct: {
                id: { orderId: this.currentOrder.id, productId: productId },
                quantity: 1
              },
              alreadyInCart: false,
              alreadyInWishList: this.opDetails[productId].alreadyInWishList
            };
          }
  
          // Alert the user that the cart was successfully updated
          alert("Cart successfully updated!");
        },
        (error) =>  { 
          console.error('Error updating order:', error);
        }
      );
    }
  }

  handleWishList(productId: number): void {

    if (this.user) {
      const wishItem: WishList = {id: {productId: productId, userId: this.user.id}}

      if (this.opDetails[productId].alreadyInWishList) {

        this.wishService.deleteWishItem(wishItem).subscribe({
          next: () => {
            this.opDetails[productId].alreadyInWishList = false;
            this.wishList.filter(wishItem => wishItem.id.productId === productId);
          },
          error: err => {
            console.error('Failed to remove wish item:', err);
          }
        });
  
      } else {
      
        this.wishService.addWishItem(wishItem).subscribe(
          (response) => {
            console.log('Wish item added successfully:', response);
            this.opDetails[productId].alreadyInWishList = true;
            this.wishList.push(wishItem);
          },
          (error) => {
            console.error('Error saving wish item:', error);
          }
        );
      }
    }

  }
  

  viewProduct(productId: number): void {
    this.router.navigate(['/user/shop/product', productId])
  }
}