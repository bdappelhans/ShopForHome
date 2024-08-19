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
import { AdminUserListComponent } from './admin-user-list/admin-user-list.component';
import { AdminUserEditComponent } from './admin-user-edit/admin-user-edit.component';
import { AdminUserAddComponent } from './admin-user-add/admin-user-add.component';
import { UserProductListComponent } from './user-product-list/user-product-list.component';
import { UserProductViewComponent } from './user-product-view/user-product-view.component';
import { UserCartComponent } from './user-cart/user-cart.component';
import { UserWishListComponent } from './user-wish-list/user-wish-list.component';
import { AdminSalesComponent } from './admin-sales-report/admin-sales-report.component';

export const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'admin', component: AdminComponent, canActivate: [AdminGuard], children: [
        { path: 'product-list', component: AdminProductListComponent },
        { path: 'product-edit/:productId', component: AdminProductEditComponent },
        { path: 'product-add', component: AdminProductAddComponent },
        { path: 'user-list', component: AdminUserListComponent },
        { path: 'user-edit/:userId', component: AdminUserEditComponent },
        { path: 'user-add', component: AdminUserAddComponent },
        { path: 'sales-report', component: AdminSalesComponent },
        { path: '', redirectTo: 'product-list', pathMatch: 'full' }
    ] },
    { path: 'user', component: UserComponent, canActivate: [UserGuard], children: [
        { path: 'shop', component: UserProductListComponent },
        { path: 'shop/product/:productId', component: UserProductViewComponent },
        { path: 'cart', component: UserCartComponent },
        { path: 'wish-list', component: UserWishListComponent },
        { path: '', redirectTo: 'shop', pathMatch: 'full' }
    ] },
    { path: '', redirectTo: '/login', pathMatch: 'full' },
    { path: '**', redirectTo: '/login' }
];
