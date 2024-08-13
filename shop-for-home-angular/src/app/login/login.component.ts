import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, RouterOutlet, Router } from '@angular/router';
import { User } from '../model/user';
import { UserService } from '../service/user.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, RouterOutlet, HttpClientModule],
  providers: [UserService],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  constructor(private userService: UserService, private router: Router) { }

  user: User = { id: 0, email: '', firstName: '', lastName: '', password: '', isAdmin: false, address: null, coupon: null }

  attemptLogin(user: User) {
    console.log("User details entered:");
    console.log(user);

    this.userService.getUserByEmail(user.email).subscribe(
      (foundUser: User) => {

        console.log("User details found:");
        console.log(foundUser);

        if (!foundUser) {
          alert("User not found");
          return;
        }
        
        if (foundUser.password !== user.password) {
          alert("Incorrect password");
          return;
        }

        if ((foundUser.isAdmin && !user.isAdmin) || (!foundUser.isAdmin && user.isAdmin)) {
          alert("Incorrect role");
          return;
        }

         // Store user info in local storage
         localStorage.setItem('user', JSON.stringify(foundUser));

        if (foundUser.isAdmin) {
          this.router.navigate(['/admin']);
        } else if (!foundUser.isAdmin) {
          this.router.navigate(['/user']);
        }
        
      },
      (error) => {
        console.error('There was an error fetching user details: ', error);
        alert("Unable to find user");
  });
  }

}
