import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { RouterModule, RouterOutlet, Router, ActivatedRoute } from '@angular/router';
import { Product } from '../model/product';
import { FormsModule } from '@angular/forms';
import { UserService } from '../service/user.service';
import { User } from '../model/user';
import { Coupon } from '../model/coupon';
import { CouponService } from '../service/coupon.service';

@Component({
  selector: 'app-admin-product-edit',
  standalone: true,
  imports: [CommonModule, RouterOutlet, HttpClientModule, RouterModule, FormsModule],
  providers: [UserService, CouponService],
  templateUrl: './admin-user-edit.component.html',
  styleUrl: './admin-user-edit.component.css'
})
export class AdminUserEditComponent implements OnInit{
  user: User | null = null;
  coupons: Coupon[] = [];

  nullFirstName: boolean = false;
  nullLastName: boolean = false;
  nullEmail: boolean = false;

  constructor(private userService: UserService, private couponService: CouponService, private route: ActivatedRoute, 
    private router: Router) {}

  ngOnInit(): void {
    this.fetchUser();
  }

  fetchUser(): void {
    const userId = this.route.snapshot.paramMap.get('userId');
    if (userId) {
      this.userService.getUserById(Number(userId)).subscribe((user) => {
        this.user = user;
        console.log(this.user);
        this.fetchCoupons();
      });
    } else {
      this.cancel();
    }
  }

  fetchCoupons(): void {
    this.couponService.getActiveCoupons().subscribe(
      (coupons: Coupon[]) => {
        console.log('Coupons:', coupons);
        this.coupons = coupons;
        this.assignCoupon();
      },
      (error) => {
        console.error('Error fetching coupons:', error);
      }
    );
  }

  assignCoupon(): void {
    if (this.user && this.coupons && this.user.coupon) {
      const couponIndex = this.coupons.findIndex(coupon => coupon.id === this.user?.coupon?.id);

      if (couponIndex !== -1) {
        this.user.coupon = this.coupons[couponIndex];
      }
    }
  }

  saveUser(): void {
    if (this.user) {

      if (!this.validateFields(this.user)) {
        alert("Error: All fields are required")
        return;
      }

      console.log("Attempting to save user:");
      console.log(this.user);

      this.userService.updateUser(this.user).subscribe(
        () => this.router.navigate(['/admin/user-list']),
        (error) => console.error('Error saving user:', error)
      );
    }
  }

  validateFields(user: User): boolean {
    this.nullFirstName = user.firstName === '';
    this.nullLastName = user.lastName === '';
    this.nullEmail = user.email === '';

    return !this.nullFirstName && !this.nullLastName && !this.nullEmail;
  }

  cancel(): void {
    this.router.navigate(['/admin/user-list']);
  }
}
