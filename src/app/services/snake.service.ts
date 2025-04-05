import { Injectable } from '@angular/core';
import { Snake } from '../models/snake.model';
import { SnakeSegment } from '../models/snake-segment.model';


@Injectable({ providedIn: 'root' })
export class SnakeService {
  snake = new Snake();

  /**
   * Returns the list of snake segments (head + body).
   */
  get snakeSegments(): SnakeSegment[] {
    return this.snake.segments;
  }

  /**
   * Returns the current head segment of the snake.
   */
  getHead(): SnakeSegment {
    return this.snake.head;
  }

  /**
   * Moves the snake in the current velocity direction.
   * @param grow Whether the snake should grow after moving
   */
  move(grow: boolean = false) {
    this.snake.move(grow);
  }

  /**
   * Adds a new segment to the tail.
   */
  grow() {
    this.snake.grow();
  }

  /**
   * Resets the snake to its initial state.
   */
  reset() {
    this.snake.reset();
  }

  /**
   * Checks whether the snake collides with a given point.
   * @param point The point to check collision against
   * @returns True if a segment occupies the point
   */
  isCollision(point: { x: number, y: number }): boolean {
    return this.snake.isCollision(point);
  }

  /**
   * Gets the current movement velocity.
   */
  get velocity() {
    return this.snake.velocity;
  }

  /**
   * Sets the snake's movement velocity.
   */
  set velocity(val) {
    this.snake.velocity = val;
  }

  get instance(): Snake {
    return this.snake;
  }
}
