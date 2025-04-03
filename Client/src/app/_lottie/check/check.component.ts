import { Component } from '@angular/core';
import { LottieComponent, AnimationOptions } from 'ngx-lottie';

@Component({
  selector: 'app-check',
  standalone: true,
  imports: [LottieComponent],
  templateUrl: './check.component.html',
  styleUrl: './check.component.css'
})
export class CheckComponent {
  options: AnimationOptions = {
    path: '/lotties/check.json',
    loop: false,
    autoplay: true,
  };
}
