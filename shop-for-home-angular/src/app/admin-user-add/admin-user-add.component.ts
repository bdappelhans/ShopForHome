import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { RouterModule, RouterOutlet, Router, ActivatedRoute } from '@angular/router';
import { Product } from '../model/product';
import { FormsModule } from '@angular/forms';
import { UserService } from '../service/user.service';
import { User } from '../model/user';
import { AuthService } from '../service/auth.service';
import { LoginUserDto } from '../model/login-user-dto';
import { RegisterUserDto } from '../model/register-user-dto';

@Component({
  selector: 'app-admin-product-edit',
  standalone: true,
  imports: [CommonModule, RouterOutlet, HttpClientModule, RouterModule, FormsModule],
  providers: [UserService, AuthService],
  templateUrl: './admin-user-add.component.html',
  styleUrl: './admin-user-add.component.css'
})
export class AdminUserAddComponent implements OnInit{
  user: RegisterUserDto = { email: '', firstName: '', lastName: '', password: '' }

  nullFirstName: boolean = false;
  nullLastName: boolean = false;
  nullEmail: boolean = false;
  nullPassword: boolean = false;

  constructor(private userService: UserService, private authService: AuthService,private route: ActivatedRoute, 
    private router: Router) {}

  ngOnInit(): void {
  }


  saveUser(): void {
    if (!this.validateFields(this.user)) {
      alert("Error: All fields are required")
      return;
    }

    this.authService.register(this.user).subscribe(
      () => {
        alert('Registration successful');
        this.router.navigate(['/admin/user-list']);
      },
      (error) => {
        console.error('There was an error registering the user: ', error);
        alert('Registration failed. Ensure email address isn\'t already in use. Please try again.');
      }
    );
  }

  validateFields(user: RegisterUserDto): boolean {
    this.nullFirstName = user.firstName === '';
    this.nullLastName = user.lastName === '';
    this.nullEmail = user.email === '';
    this.nullPassword = user.password === '';

    return !this.nullFirstName && !this.nullLastName && !this.nullEmail && !this.nullPassword;
  }

  cancel(): void {
    this.router.navigate(['/admin/user-list']);
  }
}
