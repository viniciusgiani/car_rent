import { Routes } from '@angular/router';
import { LoginComponent } from './auth/components/login/login.component';
import { SignupComponent } from './auth/components/signup/signup.component';
import { HomeComponent } from './modules/home/home.component';

export const routes: Routes = [
    {path:"", component: HomeComponent},
    {path:"register", component: SignupComponent},
    {path:"login", component: LoginComponent},
    {path:"admin", loadChildren: () => import("./modules/admin/admin.module").then(m => m.AdminModule) },
    {path:"customer", loadChildren: () => import("./modules/customer/customer.module").then(m => m.CustomerModule)},
    {path: '**', redirectTo: ''}
];
