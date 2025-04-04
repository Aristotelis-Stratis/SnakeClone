import { Injectable } from '@angular/core';
import { SnakeService } from './snake.service';

@Injectable({ providedIn: 'root' })
export class InputService {
  constructor(private snakeService: SnakeService) {
    window.addEventListener('keydown', this.onKey.bind(this));
  }

  onKey(event: KeyboardEvent) {
    switch (event.key) {
      case 'ArrowUp':
      case 'w':
        if (this.snakeService.velocity.y === 0) {
          this.snakeService.velocity = { x: 0, y: -1 };
        }
        break;
      case 'ArrowDown':
      case 's':
        if (this.snakeService.velocity.y === 0) {
          this.snakeService.velocity = { x: 0, y: 1 };
        }
        break;
      case 'ArrowLeft':
      case 'a':
        if (this.snakeService.velocity.x === 0) {
          this.snakeService.velocity = { x: -1, y: 0 };
        }
        break;
      case 'ArrowRight':
      case 'd':
        if (this.snakeService.velocity.x === 0) {
          this.snakeService.velocity = { x: 1, y: 0 };
        }
        break;
    }
  }
}
