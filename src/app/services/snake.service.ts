import { Injectable } from '@angular/core';
import { Point } from '../models/point.model';

@Injectable({ providedIn: 'root' })
export class SnakeService {
  snake: Point[] = [{ x: 10, y: 10 }];
  velocity: Point = { x: 1, y: 0 };

  getHead(): Point {
    return this.snake[0];
  }

  move(grow: boolean = false) {
    const newHead = {
      x: this.snake[0].x + this.velocity.x,
      y: this.snake[0].y + this.velocity.y
    };
  
    this.snake.unshift(newHead);
  
    if (!grow) {
      this.snake.pop();
    }
  }
  

  grow() {
    const tail = this.snake[this.snake.length - 1];
    this.snake.push({ ...tail }); // dummy-grow
  }

  reset() {
    this.snake = [{ x: 10, y: 10 }];
    this.velocity = { x: 1, y: 0 };
  }

  isCollision(point: Point): boolean {
    return this.snake.some(segment => segment.x === point.x && segment.y === point.y);
  }
}
