import { Component } from '@angular/core';
import { CheckComponent } from "../_lottie/check/check.component";
import AOS from 'aos';

@Component({
  selector: 'app-quick-tips',
  standalone: true,
  imports: [CheckComponent],
  templateUrl: './quick-tips.component.html',
  styleUrl: './quick-tips.component.css'
})
export class QuickTipsComponent {
  ngOnInit(): void {
    AOS.init();
  }
}
