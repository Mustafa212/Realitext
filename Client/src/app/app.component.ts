import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavsComponent } from "./navs/navs.component";
import { NavigationsService } from './_services/navigations.service';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavsComponent,NgIf],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent  {
  
  navService = inject(NavigationsService);
  title = 'Client';

  
}
