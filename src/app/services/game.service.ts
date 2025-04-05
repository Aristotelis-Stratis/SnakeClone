import { Injectable } from '@angular/core';
import { Apple } from '../models/apple.model';
import { SnakeService } from './snake.service';
import { SnakeSegment } from '../models/snake-segment.model';

@Injectable({ providedIn: 'root' })
export class GameService {
  private intervalId: any;
  apple = new Apple();
  score = 0;

  readonly tileSize = 25;
  readonly tileCountX = Math.floor(700 / this.tileSize); // 28
  readonly tileCountY = Math.floor(550 / this.tileSize); // 22

  isGameOver = false;

  constructor(private snakeService: SnakeService) {}

  /**
   * Starts the game loop and resets state.
   * @param callback draw callback
   */
  start(callback: () => void) {
    this.score = 0;
    this.stop();
    this.isGameOver = false;

    this.spawnApple();

    this.intervalId = setInterval(() => {
      const head = this.snakeService.getHead();
      const velocity = this.snakeService.velocity;

      const nextHead = {
        x: head.x + velocity.x,
        y: head.y + velocity.y
      };

      const outOfBounds =
        nextHead.x < 0 ||
        nextHead.y < 0 ||
        nextHead.x >= this.tileCountX ||
        nextHead.y >= this.tileCountY;

      const hitsSelf = this.snakeService.isCollision(nextHead);

      if (outOfBounds || hitsSelf) {
        this.stop();
        this.snakeService.reset();
        this.spawnApple();
        callback();
        return;
      }

      const ateApple = this.apple.isAt(nextHead);
      this.snakeService.move(ateApple);

      if (ateApple) {
        this.score++;
        this.spawnApple();
      }

      callback();
    }, 150);
  }

  /**
   * Stops the game loop.
   */
  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.isGameOver = true;
  }

  /**
   * Restarts the game state and loop.
   */
  restart(callback: () => void) {
    this.snakeService.reset();
    this.start(callback);
  }

  /**
   * Respawns the apple avoiding the snake.
   */
  spawnApple() {
    const snake = this.snakeService.snakeSegments;
    this.apple.respawn(this.tileCountX, this.tileCountY, snake);
  }
}
