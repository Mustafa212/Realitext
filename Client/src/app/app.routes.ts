import { Routes } from '@angular/router';
import { LoginRegisterComponent } from './login-register/login-register.component';
import { HomeComponent } from './home/home.component';

export const routes: Routes = [
    {
        path: "login", component: LoginRegisterComponent
    },
    {
        path: "", component: HomeComponent
    },

];
