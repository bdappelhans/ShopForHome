import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, RouterOutlet, Router } from '@angular/router';
import { AuthService } from '../service/auth.service';
import { RegisterUserDto } from '../model/register-user-dto';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [RouterOutlet, CommonModule, FormsModule, RouterModule, HttpClientModule],
  providers: [AuthService],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  registerUser: RegisterUserDto = { email: '', firstName: '', lastName: '', password: '' };

  nullFirstName: boolean = false;
  nullLastName: boolean = false;
  nullEmail: boolean = false;
  nullPassword: boolean = false;

  constructor(private authService: AuthService, private router: Router) { }

  attemptRegister(registerUser: RegisterUserDto) {
    console.log(registerUser);

    if (!this.validateFields(registerUser)) {
      return;
    }

    this.authService.register(registerUser).subscribe(
      () => {
        alert('You have successfully registered! You are now able to log into the user portal.');
        this.router.navigate(['/']);
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
}
