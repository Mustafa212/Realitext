import { Component } from '@angular/core';
import { HomeComponent } from "../home/home.component";
import { QuickTipsComponent } from "../quick-tips/quick-tips.component";

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [HomeComponent, QuickTipsComponent],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.css'
})
export class LandingPageComponent {

}
