import { Point } from '../models/point.model';
import { Injectable } from '@angular/core';
import { SnakeService } from './snake.service';

@Injectable({ providedIn: 'root' })
export class GameService {
  private intervalId: any;
  apple: Point = { x: 5, y: 5 }; // start position
  score = 0;
  readonly tileCount = 20;
  isGameOver = false;

  constructor(private snakeService: SnakeService) { }

  start(callback: () => void) {
    this.score = 0;
    this.stop();
    this.isGameOver = false;
    this.spawnApple();
    this.intervalId = setInterval(() => {
      const head = this.snakeService.getHead();
      const nextHead = {
        x: head.x + this.snakeService.velocity.x,
        y: head.y + this.snakeService.velocity.y
      };

      // Wallcollision
      const outOfBounds = nextHead.x < 0 || nextHead.y < 0 || nextHead.x >= this.tileCount || nextHead.y >= this.tileCount;

      // Selfcollision
      const hitsSelf = this.snakeService.isCollision(nextHead);

      if (outOfBounds || hitsSelf) {
        this.stop();
        this.snakeService.reset();
        this.spawnApple();
        callback(); // redraw
        return;
      }

      const ateApple = nextHead.x === this.apple.x && nextHead.y === this.apple.y;
      this.snakeService.move(ateApple);
      if (ateApple) {
        this.score++;
        this.spawnApple();
      }

      callback(); // redraw
    }, 150);
  }



  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.isGameOver = true;
  }


  restart(callback: () => void) {
    this.snakeService.reset();
    this.start(callback);
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
