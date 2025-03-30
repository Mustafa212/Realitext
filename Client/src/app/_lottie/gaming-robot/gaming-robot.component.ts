import { Component } from '@angular/core';
import { LottieComponent, AnimationOptions } from 'ngx-lottie';

@Component({
  selector: 'app-gaming-robot',
  standalone: true,
  imports: [LottieComponent],
  templateUrl: './gaming-robot.component.html',
  styleUrl: './gaming-robot.component.css',
})
export class GamingRobotComponent {
  options: AnimationOptions = {
    path: '/lotties/gaming.json',
    loop: true,
    autoplay: true,
  };
}
