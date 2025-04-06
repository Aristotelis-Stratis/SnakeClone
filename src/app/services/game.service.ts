import { Injectable } from '@angular/core';
import { Apple } from '../models/apple.model';
import { SnakeService } from './snake.service';
import { SoundService } from './sound.service';

@Injectable({ providedIn: 'root' })
export class GameService {
  private intervalId: any;
  apple = new Apple();
  score = 0;

  readonly tileSize = 25;
  readonly tileCountX = Math.floor(700 / this.tileSize); // 28 tiles wide
  readonly tileCountY = Math.floor(550 / this.tileSize); // 22 tiles tall

  isGameOver = false;

  constructor(
    private snakeService: SnakeService,
    private sound: SoundService
  ) {}

  /**
   * Starts the game loop and resets state.
   * @param callback draw callback
   */
  start(callback: () => void) {
    this.resetState();
    this.spawnApple();

    this.intervalId = setInterval(() => {
      const nextHead = this.getNextHeadPosition();
      if (this.checkGameOver(nextHead)) {
        this.handleGameOver(callback);
        return;
      }

      const ateApple = this.apple.isAt(nextHead);
      this.snakeService.move(ateApple);

      if (ateApple) {
        this.handleAppleEaten();
      }

      callback();
    }, 150);
  }

  /**
   * Stops the game loop and sets game over flag.
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
    this.sound.startMusic();
    this.start(callback);
  }

  /**
   * Respawns the apple avoiding the snake.
   */
  spawnApple() {
    const snake = this.snakeService.snakeSegments;
    this.apple.respawn(this.tileCountX, this.tileCountY, snake);
  }

  /**
   * Resets score and state before starting game loop.
   */
  private resetState() {
    this.score = 0;
    this.stop();
    this.isGameOver = false;
  }

  /**
   * Calculates the next head position of the snake.
   */
  private getNextHeadPosition() {
    const head = this.snakeService.getHead();
    const velocity = this.snakeService.velocity;
    return {
      x: head.x + velocity.x,
      y: head.y + velocity.y
    };
  }

  /**
   * Checks whether the snake hits the wall or itself.
   */
  private checkGameOver(nextHead: { x: number; y: number }): boolean {
    const outOfBounds =
      nextHead.x < 0 ||
      nextHead.y < 0 ||
      nextHead.x >= this.tileCountX ||
      nextHead.y >= this.tileCountY;

    const hitsSelf = this.snakeService.isCollision(nextHead);
    return outOfBounds || hitsSelf;
  }

  /**
   * Handles game over state, sound and reset.
   */
  private handleGameOver(callback: () => void) {
    this.sound.stopMusic();
    this.sound.playGameOver();
    this.stop();
    this.snakeService.reset();
    this.spawnApple();
    callback();
  }

  /**
   * Handles logic after an apple is eaten.
   */
  private handleAppleEaten() {
    this.score++;
    this.spawnApple();
    this.sound.playAppleBite();
  }
}
