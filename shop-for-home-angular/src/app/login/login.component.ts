import { CommonModule, isPlatformBrowser } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms'; // Import FormsModule here
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../service/auth.service';
import { LoginUserDto } from '../model/login-user-dto';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, RouterModule], // Include FormsModule here
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginUser: LoginUserDto = { email: '', password: '' };
  admin: boolean = false;
  nullEmail: boolean = false;
  nullPassword: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    }
  }

  validateInput(): void {
    if (this.loginUser.email === '') {
      this.nullEmail = true;
    } else {
      this.nullEmail = false;
    }

    if (this.loginUser.password === '') {
      this.nullPassword = true;
    } else {
      this.nullPassword = false;
    }

    if (!this.nullEmail && !this.nullPassword) {
      this.attemptLogin();
    }
  }

  attemptLogin(): void {
    this.authService.login(this.loginUser).subscribe(
      () => {
        this.authService.fetchUserDetails().subscribe(storedUser => {
          if (storedUser && storedUser.admin === this.admin) {
            this.router.navigate([storedUser.admin ? '/admin' : '/user']);
          } else {
            alert('Incorrect role');
            this.authService.logout();
          }
        });
      },
      error => {
        console.error('Login failed:', error);
        alert('Login failed. Please check your credentials and try again.');
      }
    );
  }

  navigateToRegister(): void {
    this.router.navigate(['/register']);
  }
}
