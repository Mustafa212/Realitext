import { Injectable, signal } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';

@Injectable({
  providedIn: 'root',
})
export class NavigationsService {
  isAnimated = signal<boolean>(true);
  isLoggingIn = signal<boolean>(false);
}
