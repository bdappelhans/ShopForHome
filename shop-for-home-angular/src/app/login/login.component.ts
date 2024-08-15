import { CommonModule, isPlatformBrowser } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, RouterOutlet, Router } from '@angular/router';
import { User } from '../model/user';
import { UserService } from '../service/user.service';
import { AuthService } from '../service/auth.service';
import { LoginUserDto } from '../model/login-user-dto';
import { ProductService } from '../service/product.service';
import { Product } from '../model/product';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, RouterOutlet, HttpClientModule],
  providers: [UserService, AuthService, ProductService],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {

  constructor(private authService: AuthService, private productService: ProductService, 
    private router: Router, @Inject(PLATFORM_ID) private platformId: Object) { }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    }
  }

  loginUser: LoginUserDto = { email: '', password: '' };
  admin: boolean = false;

  attemptLogin(loginUser: LoginUserDto) {
    console.log("Attempting login with:", this.loginUser, "Admin role:", this.admin);
  
    this.authService.login(this.loginUser).pipe(
      // Chain the fetchUserDetails call after login
      switchMap(() => this.authService.fetchUserDetails())
    ).subscribe(
      (storedUser: User) => {
  
        // Check if the admin status matches
        if (storedUser.admin !== this.admin) {
          alert("Incorrect role");
          if (isPlatformBrowser(this.platformId)) {
            localStorage.removeItem('user');
            localStorage.removeItem('token');
          }
          return;
        }
  
        // Navigate based on user role
        if (storedUser.admin) {
          this.router.navigate(['/admin']);
        } else {
          this.router.navigate(['/user']);
        }
      },
      error => {
        console.error('Login or fetching user details failed:', error);
        alert("Login failed. Please check your credentials and try again.");
      }
    );
  }

  fetchUser() {
    this.authService.fetchUserDetails();
    console.log("User Details fetched:")
  }

  navigateToRegister() {
    this.router.navigate(['/register']);
  }

}
