import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { SnakeService } from '../services/snake.service';
import { GameService } from '../services/game.service';
import { CommonModule } from '@angular/common';
import { InputService } from '../services/input.service';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements AfterViewInit {
  @ViewChild('gameCanvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;
  private ctx!: CanvasRenderingContext2D;
  get tileSize(): number {
    return this.game.tileSize;
  }

  constructor(
    public snake: SnakeService,
    public game: GameService,
    private input: InputService
  ) { }

  ngAfterViewInit() {
    const canvas = this.canvasRef.nativeElement;
    this.ctx = canvas.getContext('2d')!;
    this.game.start(() => this.draw());
  }

  draw() {
    const canvas = this.canvasRef.nativeElement;
    this.ctx.fillStyle = '#eee';
    this.ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw snake
    this.snake.snake.forEach((segment, index) => {
      const sizeFactor = this.getSizeFactor(index);

      const offset = (1 - sizeFactor) * this.tileSize / 2;
      const size = this.tileSize * sizeFactor;

      this.ctx.fillStyle = 'green';
      this.ctx.fillRect(
        segment.x * this.tileSize + offset,
        segment.y * this.tileSize + offset,
        size,
        size
      );
    });

    // Draw apple
    this.ctx.fillStyle = 'red';
    this.ctx.fillRect(
      this.game.apple.x * this.tileSize,
      this.game.apple.y * this.tileSize,
      this.tileSize,
      this.tileSize
    );
  }

  restart() {
    this.game.restart(() => this.draw());
  }

  getSizeFactor(index: number): number {
    const length = this.snake.snake.length;

    if (index === 0) return 1.0; // Full size for the head
    if (index === length - 1) return 0.6; // Smaller size for the tail

    // Slightly smaller size for body segments to create a visual gradient
    return 0.85;
  }

}
