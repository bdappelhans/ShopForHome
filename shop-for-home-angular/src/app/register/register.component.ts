import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, RouterOutlet, Router } from '@angular/router';
import { UserService } from '../service/user.service';
import { User } from '../model/user';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [RouterOutlet, CommonModule, FormsModule, RouterModule, HttpClientModule],
  providers: [UserService],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  user: User = { id: 0, email: '', firstName: '', lastName: '', password: '', admin: false, address: null, coupon: null }

  nullFirstName: boolean = false;
  nullLastName: boolean = false;
  nullEmail: boolean = false;
  nullPassword: boolean = false;

  constructor(private userService: UserService, private router: Router) { }

  attemptRegister(user: User) {
    console.log(user);

    // check for empty input fields
    // if any are empty, update form to show errors and return
    if (!this.validateFields(user)) {
      return;
    }

    // if email already exists for a current user, send alert and return from function
    this.userService.getUserByEmail(user.email).subscribe(
      (foundUser) => {

        if (foundUser) {
          alert('User with email ' + user.email + ' already exists');
        } else {
          this.addUser(user);
        }
      },
      (error) => {
        console.error('There was an error fetching user details: ', error);
      });
  }

  addUser(user: User) {
    this.userService.addUser(user).subscribe(
      (newUser) => {
        console.log('User added successfully', newUser);
        alert('You have successfully registered! You are now able to log into the user portal.')
        this.router.navigate(['/'])
      },
      (error) => {
        console.error('There was an error adding user: ', error);
      }
    );
  }

  // checks all input fields to see if they're empty
  // if any fields are empty, set corresponding boolean to true and vice versa
  // return true if input is entered for every field, false otherwise
  validateFields(user: User) : boolean {
    if (user.firstName === '') {
      this.nullFirstName = true;
    } else {
      this.nullFirstName = false;
    }

    if (user.lastName === '') {
      this.nullLastName = true;
    } else {
      this.nullLastName = false;
    }

    if (user.email === '') {
      this.nullEmail = true;
    } else {
      this.nullEmail = false;
    }

    if (user.password === '') {
      this.nullPassword = true;
    } else {
      this.nullPassword = false;
    }

    if (!this.nullFirstName && !this.nullLastName && !this.nullEmail && !this.nullPassword) {
      return true;
    } else {
      return false;
    }
  }
}
