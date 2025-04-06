import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { SnakeService } from '../services/snake.service';
import { GameService } from '../services/game.service';
import { CommonModule } from '@angular/common';
import { InputService } from '../services/input.service';
import { Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements AfterViewInit {
  @ViewChild('gameCanvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;
  @Output() backToMenuEvent = new EventEmitter<void>();

  private ctx!: CanvasRenderingContext2D;

  appleImage = new Image();
  backgroundImage = new Image();
  snakeHeadImage = new Image();
  snakeBodyImage = new Image();

  get tileSize(): number {
    return this.game.tileSize;
  }

  constructor(
    public snake: SnakeService,
    public game: GameService,
    private input: InputService
  ) { }

  /**
   * Called after canvas is available. Loads images and starts the game.
   */
  ngAfterViewInit() {
    const canvas = this.canvasRef.nativeElement;
    this.ctx = canvas.getContext('2d')!;
    this.loadImages(() => this.game.start(() => this.draw()));
  }

  /**
   * Loads required game images, then triggers callback.
   * @param onAllLoaded Called when all images are loaded
   */
  loadImages(onAllLoaded: () => void) {
    const images = [
      { image: this.backgroundImage, src: 'assets/images/background_2.png' },
      { image: this.appleImage, src: 'assets/images/apple.png' },
      { image: this.snakeHeadImage, src: 'assets/images/snake_head_2.png' },
      { image: this.snakeBodyImage, src: 'assets/images/snake_body.png' }
    ];

    let loadedCount = 0;
    images.forEach(({ image, src }) => {
      image.src = src;
      image.onload = () => {
        if (++loadedCount === images.length) {
          onAllLoaded();
        }
      };
    });
  }

  /**
   * Draws the entire game scene and calls the direction lock for next tick.
   */
  draw() {
    this.drawBackground();
    this.drawSnake();
    this.drawApple();
    this.input.resetDirectionChanged();
  }

  /**
   * Draws the tiled background pattern.
   */
  drawBackground() {
    const canvas = this.canvasRef.nativeElement;
    const pattern = this.ctx.createPattern(this.backgroundImage, 'repeat');
    if (pattern) {
      this.ctx.fillStyle = pattern;
      this.ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
  }

  /**
   * Draws the snake, rotating the head and scaling body parts.
   */
  drawSnake() {
    this.snake.instance.draw(
      this.ctx,
      this.tileSize,
      this.snakeHeadImage,
      this.snakeBodyImage,
      (index) => this.getSizeFactor(index),
      () => this.getHeadRotation()
    );
  }


  /**
   * Draws an image with rotation around its center.
   * @param image The image to draw
   * @param x X position
   * @param y Y position
   * @param size Width and height
   * @param rotation Angle in radians
   */
  drawRotatedImage(image: HTMLImageElement, x: number, y: number, size: number, rotation: number) {
    this.ctx.save();
    this.ctx.translate(x + size / 2, y + size / 2);
    this.ctx.rotate(rotation);
    this.ctx.drawImage(image, -size / 2, -size / 2, size, size);
    this.ctx.restore();
  }

  /**
   * Calculates the current head rotation angle.
   * @returns Rotation in radians
   */
  getHeadRotation(): number {
    const { x, y } = this.snake.velocity;
    if (x === 0 && y === -1) return Math.PI;
    if (x === -1 && y === 0) return Math.PI / 2;
    if (x === 1 && y === 0) return -Math.PI / 2;
    return 0;
  }

  /**
   * Draws the apple image at its current position.
   */
  drawApple() {
    this.game.apple.draw(this.ctx, this.tileSize, this.appleImage);
  }

  /**
   * Restarts the game and redraws the scene.
   */
  restart() {
    this.game.restart(() => this.draw());
  }

  /**
   * Resumes the game.
   */
  resume() {
    this.game.resume(() => this.draw());
  }


  /**
 * Emits an event to navigate back to the main menu.
 */
  backToMenu() {
    this.backToMenuEvent.emit();
  }

  /**
   * Returns a scaling factor for the given snake segment.
   * @param index Segment index
   * @returns Size factor (0.6 - 1.0)
   */
  getSizeFactor(index: number): number {
    const length = this.snake.snakeSegments.length;
    if (index === 0) return 1.0;
    if (index === length - 1) return 0.6;
    return 0.85;
  }
}
