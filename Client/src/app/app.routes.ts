import { Routes } from '@angular/router';
import { LoginRegisterComponent } from './login-register/login-register.component';
import { HomeComponent } from './home/home.component';
import { LandingPageComponent } from './landing-page/landing-page.component';

export const routes: Routes = [
    {
        path: "login", component: LoginRegisterComponent
    },
    {
        path: "home", component: LandingPageComponent 
    },
    {
        path: "", component: LoginRegisterComponent 
    },

];
