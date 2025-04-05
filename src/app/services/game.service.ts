import { Point } from '../models/point.model';
import { Injectable } from '@angular/core';
import { SnakeService } from './snake.service';

@Injectable({ providedIn: 'root' })
export class GameService {
  private intervalId: any;
  apple: Point = { x: 5, y: 5 }; // start position
  score = 0;
  readonly tileCount = 20;
  readonly tileSize = 25; // size of one tile in px
  readonly tileCountX = Math.floor(700 / this.tileSize); // 28
  readonly tileCountY = Math.floor(550 / this.tileSize); // 22
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
      const outOfBounds = nextHead.x < 0 || nextHead.y < 0 ||
      nextHead.x >= this.tileCountX || nextHead.y >= this.tileCountY;
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
        x: Math.floor(Math.random() * this.tileCountX),
        y: Math.floor(Math.random() * this.tileCountY),
      };
    } while (this.snakeService.snake.some(s => s.x === newApple.x && s.y === newApple.y));

    this.apple = newApple;
  }
}
