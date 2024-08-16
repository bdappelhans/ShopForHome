import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { AdminComponent } from './admin/admin.component';
import { UserComponent } from './user/user.component';
import { RegisterComponent } from './register/register.component';
import { AdminGuard } from './guards/admin.guard';
import { UserGuard } from './guards/user.guard';
import { AdminProductListComponent } from './admin-product-list/admin-product-list.component';
import { AdminProductEditComponent } from './admin-product-edit/admin-product-edit.component';
import { AdminProductAddComponent } from './admin-product-add/admin-product-add.component';

export const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'admin', component: AdminComponent, canActivate: [AdminGuard], children: [
        { path: 'product-list', component: AdminProductListComponent },
        { path: 'product-edit/:productId', component: AdminProductEditComponent },
        { path: 'product-add', component: AdminProductAddComponent },
        { path: '', redirectTo: 'product-list', pathMatch: 'full' }
    ] },
    { path: 'user', component: UserComponent, canActivate: [UserGuard] },
    { path: '', redirectTo: '/login', pathMatch: 'full' },
    { path: '**', redirectTo: '/login' }
];
