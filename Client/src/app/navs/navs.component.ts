import { NgIf } from '@angular/common';
import {  Component, inject, OnInit } from '@angular/core';
import { NavigationsService } from '../_services/navigations.service';

import AOS from 'aos';
import { Router } from '@angular/router';
import { AccountService } from '../_services/account.service';
@Component({
  selector: 'app-navs',
  standalone: true,
  imports: [NgIf],
  templateUrl: './navs.component.html',
  styleUrl: './navs.component.css',
})
export class NavsComponent implements OnInit {
  navService = inject(NavigationsService);
  AccountService = inject(AccountService);

  router = inject(Router);
  ngOnInit(): void {
    AOS.init();
  }
  NavigatetoSignIn(){
    this.router.navigate(['/login']);
    this.navService.isLoggingIn.set(true);
    this.AccountService.logout()
  }
}
