import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { RouterModule, RouterOutlet, Router, ActivatedRoute } from '@angular/router';
import { Product } from '../model/product';
import { FormsModule } from '@angular/forms';
import { UserService } from '../service/user.service';
import { User } from '../model/user';

@Component({
  selector: 'app-admin-product-edit',
  standalone: true,
  imports: [CommonModule, RouterOutlet, HttpClientModule, RouterModule, FormsModule],
  providers: [UserService],
  templateUrl: './admin-user-edit.component.html',
  styleUrl: './admin-user-edit.component.css'
})
export class AdminUserEditComponent implements OnInit{
  user: User | null = null;

  constructor(private userService: UserService, private route: ActivatedRoute, 
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
      });
    } else {
      this.cancel();
    }
  }

  saveUser(): void {
    if (this.user) {

      this.userService.updateUser(this.user).subscribe(
        () => this.router.navigate(['/admin/user-list']),
        (error) => console.error('Error saving user:', error)
      );
    }
  }

  cancel(): void {
    this.router.navigate(['/admin/user-list']);
  }
}
