import { Component } from '@angular/core';
import { LottieComponent, AnimationOptions } from 'ngx-lottie';

@Component({
  selector: 'app-hi-robot',
  standalone: true,
  imports: [LottieComponent],
  templateUrl: './hi-robot.component.html',
  styleUrl: './hi-robot.component.css'
})
export class HiRobotComponent {
  options: AnimationOptions = {
    path: '/lotties/hi.json',
    loop: true,
    autoplay: true,
  };
}
