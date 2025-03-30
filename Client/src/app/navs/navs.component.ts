import { NgIf } from '@angular/common';
import {  Component, inject, OnInit } from '@angular/core';
import { NavigationsService } from '../_services/navigations.service';

import AOS from 'aos';
import { Router } from '@angular/router';
@Component({
  selector: 'app-navs',
  standalone: true,
  imports: [NgIf],
  templateUrl: './navs.component.html',
  styleUrl: './navs.component.css',
})
export class NavsComponent implements OnInit {
  navService = inject(NavigationsService);
  router = inject(Router);
  ngOnInit(): void {
    AOS.init();
  }
  NavigatetoSignIn(){
    this.router.navigate(['/login']);
    this.navService.isLoggingIn.set(true);
  }
}
