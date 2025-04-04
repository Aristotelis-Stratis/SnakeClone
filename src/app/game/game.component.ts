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
  readonly tileSize = 20;

  constructor(
    public snake: SnakeService,
    private game: GameService,
    private input: InputService
  ) {}

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
    this.ctx.fillStyle = 'green';
    for (const segment of this.snake.snake) {
      this.ctx.fillRect(segment.x * this.tileSize, segment.y * this.tileSize, this.tileSize, this.tileSize);
    }
  
    // Draw apple
    this.ctx.fillStyle = 'red';
    this.ctx.fillRect(
      this.game.apple.x * this.tileSize,
      this.game.apple.y * this.tileSize,
      this.tileSize,
      this.tileSize
    );
  }
  
}
