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
import { UserService } from '../service/user.service';
import { WishListService } from '../service/wish-list.service';
import { WishList } from '../model/wish-list';

@Component({
  selector: 'app-admin-product-list',
  standalone: true,
  imports: [CommonModule, RouterOutlet, HttpClientModule, RouterModule],
  providers: [ProductService, AuthService, OrderService, UserService, WishListService],
  templateUrl: './user-wish-list.component.html',
  styleUrls: ['./user-wish-list.component.css']
})
export class UserWishListComponent implements OnInit {

  products: Product[] = [];
  user: User | null = null;
  wishList: WishList[] = [];

  constructor(private productService: ProductService, private authService: AuthService, private orderService: OrderService, 
    private userService: UserService, private wishService: WishListService, private router: Router) {}

  ngOnInit(): void {
    this.fetchUser();
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

  fetchProducts(): void {
    if (this.user) {
      // iterate through current order's products, fetch them, and place them in cart array
      for (const wishItem of this.wishList) {

        this.productService.getProductById(wishItem.id.productId).subscribe(
          (product: Product) => {
            // push cartItem into array
            this.products.push(product);
          },
          (error) => {
            console.error('Error fetching product:', error)
          }
        )
      }
    }
  }

  fetchUser(): void {
    this.authService.fetchUserDetails().subscribe(user => {
      this.user = user;
      this.fetchWishList();
    });
  }

  viewProduct(productId: number): void {
    this.router.navigate(['/user/shop/product', productId])
  }

  removeFromWishList(productId: number): void {
    const wishItem = this.wishList.find(wishItem => wishItem.id.productId === productId);

    if (wishItem) {
      this.wishService.deleteWishItem(wishItem).subscribe({
        next: () => {
          // Update the local wishList after successful deletion
          this.wishList = this.wishList.filter(item => item.id.productId !== productId);
          // Remove the product from the products array as well
          this.products = this.products.filter(product => product.id !== productId);
        },
        error: err => {
          console.error('Failed to remove wish item:', err);
        }
      });
    }
  }
  
}