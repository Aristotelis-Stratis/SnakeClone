import { Point } from '../models/point.model';
import { Injectable } from '@angular/core';
import { SnakeService } from './snake.service';

@Injectable({ providedIn: 'root' })
export class GameService {
  private intervalId: any;
  apple: Point = { x: 5, y: 5 }; // Startposition (wird später randomisiert)

  readonly tileCount = 20;

  constructor(private snakeService: SnakeService) {}

  start(callback: () => void) {
    this.spawnApple(); // Beim Start
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

  spawnApple() {
    let newApple: Point;
    do {
      newApple = {
        x: Math.floor(Math.random() * this.tileCount),
        y: Math.floor(Math.random() * this.tileCount),
      };
    } while (this.snakeService.snake.some(s => s.x === newApple.x && s.y === newApple.y));

    this.apple = newApple;
  }
}
