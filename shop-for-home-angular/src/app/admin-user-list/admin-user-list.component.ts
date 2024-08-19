import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { RouterModule, RouterOutlet, Router } from '@angular/router';
import { ProductService } from '../service/product.service';
import { Product } from '../model/product';
import { UserService } from '../service/user.service';
import { User } from '../model/user';

@Component({
  selector: 'app-admin-user-list',
  standalone: true,
  imports: [CommonModule, RouterOutlet, HttpClientModule, RouterModule],
  providers: [UserService],
  templateUrl: './admin-user-list.component.html',
  styleUrls: ['./admin-user-list.component.css']
})
export class AdminUserListComponent implements OnInit {

  users: User[] = [];

  constructor(private userService: UserService, private router: Router) {}

  ngOnInit(): void {
    this.fetchUsers();
  }

  fetchUsers(): void {
    this.userService.getAllActiveUsers().subscribe(
      (users: User[]) => {
        console.log('Users:', users);
        this.users = users;
      },
      (error) => {
        console.error('Error fetching users:', error);
      }
    );
  }

  changeUserStatus(user: User): void {
    if (user.active) {
      user.active = false;
    } else {
      user.active = true;
    }

    this.userService.updateUser(user).subscribe(updatedUser => {
      const index = this.users.findIndex(e => e.id === updatedUser.id);
      if (index !== -1) {
        this.users.splice(index, 1);
      }
    });
  }

  editUser(userId: number): void {
    this.router.navigate(['/admin/user-edit', userId]);
  }

  addUser(): void {
    this.router.navigate(['/admin/user-add'])
  }
}
