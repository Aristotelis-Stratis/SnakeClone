import { Injectable } from '@angular/core';
import { SnakeService } from './snake.service';

@Injectable({ providedIn: 'root' })
export class InputService {

  /** Tracks if direction was already changed in the current tick */
  private directionChanged = false;

  constructor(private snakeService: SnakeService) {
    window.addEventListener('keydown', this.onKey.bind(this));
  }


  /**
  * Handles keydown events to change the snake's direction.
  * Ensures only one direction change per tick to avoid instant self-collision.
  * @param event Keyboard event triggered by key press
  */
  onKey(event: KeyboardEvent) {
    if (this.directionChanged) return;

    switch (event.key) {
      case 'ArrowUp':
      case 'w':
        if (this.snakeService.velocity.y === 0) {
          this.snakeService.velocity = { x: 0, y: -1 };
          this.directionChanged = true;
        }
        break;
      case 'ArrowDown':
      case 's':
        if (this.snakeService.velocity.y === 0) {
          this.snakeService.velocity = { x: 0, y: 1 };
          this.directionChanged = true;
        }
        break;
      case 'ArrowLeft':
      case 'a':
        if (this.snakeService.velocity.x === 0) {
          this.snakeService.velocity = { x: -1, y: 0 };
          this.directionChanged = true;
        }
        break;
      case 'ArrowRight':
      case 'd':
        if (this.snakeService.velocity.x === 0) {
          this.snakeService.velocity = { x: 1, y: 0 };
          this.directionChanged = true;
        }
        break;
    }
  }

  /**
   * Resets the direction lock to allow input in the next tick.
   * Is called once per game frame after movement.
   */
  resetDirectionChanged() {
    this.directionChanged = false;
  }
}
