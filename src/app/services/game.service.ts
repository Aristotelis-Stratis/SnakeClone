import { Injectable } from '@angular/core';
import { SnakeService } from './snake.service';

@Injectable({ providedIn: 'root' })
export class GameService {
  private intervalId: any;

  constructor(private snakeService: SnakeService) {}

  start(callback: () => void) {
    this.stop();
    this.intervalId = setInterval(() => {
      this.snakeService.move();
      callback();
    }, 150);
  }

  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }
}
