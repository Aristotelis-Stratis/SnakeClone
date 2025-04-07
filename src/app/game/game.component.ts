import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { SnakeService } from '../services/snake.service';
import { GameService } from '../services/game.service';
import { CommonModule } from '@angular/common';
import { InputService } from '../services/input.service';
import { Output, EventEmitter } from '@angular/core';
import { LeaderboardService } from '../services/leaderboard.service';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements AfterViewInit {
  appleImage = new Image();
  @ViewChild('gameCanvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;
  @Output() backToMenuEvent = new EventEmitter<void>();

  private ctx!: CanvasRenderingContext2D;

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

    window.addEventListener('keydown', (event) => {
      if (event.key.toLowerCase() === '+') {
        this.triggerTestWin();
      }
    });
  }

  /**
   * Loads the apple image and calls the provided callback when finished.
   * This ensures that the game logic (e.g., start and rendering)
   * does not begin before the image is fully available, preventing rendering issues due to missing assets.
   * @param {() => void} onAllLoaded - Callback triggered after image load completes
   */
  private loadImages(onAllLoaded: () => void) {
    this.appleImage.src = 'assets/images/apple.png';
    this.appleImage.onload = onAllLoaded;
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
   * Draws a checkerboard tile background for the game.
   */
  drawBackground() {
    const cols = this.game.tileCountX;
    const rows = this.game.tileCountY;
    const tileSize = this.tileSize;

    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        this.drawTile(x, y, tileSize, this.getTileColor(x, y));
      }
    }
  }

  /**
   * Returns the alternating color for a tile.
   * @param x - Tile column index
   * @param y - Tile row index
   * @returns Hex color string
   */
  private getTileColor(x: number, y: number): string {
    const color1 = '#acde4c';
    const color2 = '#9dcb45';
    return (x + y) % 2 === 0 ? color1 : color2;
  }

  /**
   * Fills a single game tile at a specific location with a given color.
   * @param {number} x - Tile x index
   * @param {number} y - Tile y index
   * @param {number} size - Tile size in pixels
   * @param {string} color - Hex color string
   */
  private drawTile(x: number, y: number, size: number, color: string): void {
    this.ctx.fillStyle = color;
    this.ctx.fillRect(x * size, y * size, size, size);
  }

  /**
   * Draws the snake as a smooth gradient line with a distinct head.
   */
  drawSnake() {
    const segments = this.snake.snakeSegments;
    if (segments.length < 2) return;

    this.ctx.save();
    this.prepareSnakeStroke(segments);
    this.traceSnakePath(segments);
    this.ctx.stroke();
    this.ctx.restore();

    const head = segments[0];
    this.drawSnakeHead(head.x, head.y, 1.0);
  }


  /**
 * Prepares the canvas context for drawing the snake's path,
 * including stroke style, line width and stroke caps.
 * @param {Array<{ x: number, y: number }>} segments - Array of snake segments
 */
  private prepareSnakeStroke(segments: { x: number, y: number }[]) {
    this.ctx.strokeStyle = this.createSnakeGradient(segments);
    this.ctx.lineWidth = this.tileSize * 0.9;
    this.ctx.lineCap = 'round';
    this.ctx.lineJoin = 'round';
    this.ctx.beginPath();
  }


  /**
 * Draws the path of the snake by connecting all segment centers.
 * @param {Array<{ x: number, y: number }>} segments - Array of snake segments
 */
  private traceSnakePath(segments: { x: number, y: number }[]) {
    const start = this.getSegmentCenter(segments[0]);
    this.ctx.moveTo(start.x, start.y);

    for (let i = 1; i < segments.length; i++) {
      const point = this.getSegmentCenter(segments[i]);
      this.ctx.lineTo(point.x, point.y);
    }
  }

  /**
   * Creates a linear gradient from tail to head of the snake.
   * @param segments Array of snake segments
   * @returns CanvasGradient object
   */
  private createSnakeGradient(segments: { x: number; y: number }[]): CanvasGradient {
    const tail = this.getSegmentCenter(segments[segments.length - 1]);
    const head = this.getSegmentCenter(segments[0]);
    const gradient = this.ctx.createLinearGradient(tail.x, tail.y, head.x, head.y);
    gradient.addColorStop(0, '#2e571a');
    gradient.addColorStop(1, '#6fa930');
    return gradient;
  }


  /**
 * Calculates the center coordinates of a snake segment.
 * @param {{ x: number, y: number }} segment - Snake segment in tile coordinates
 * @returns {{ x: number, y: number }} Center pixel coordinates
 */
  private getSegmentCenter(segment: { x: number, y: number }) {
    return {
      x: segment.x * this.tileSize + this.tileSize / 2,
      y: segment.y * this.tileSize + this.tileSize / 2
    };
  }


  /**
   * Draws the snake head with eyes and pupils at the given tile position.
   * @param tileX X coordinate in tiles
   * @param tileY Y coordinate in tiles
   * @param scale Size factor
   */
  private drawSnakeHead(tileX: number, tileY: number, scale: number) {
    const size = this.tileSize * scale;
    const radius = size / 2;
    const centerX = tileX * this.tileSize + this.tileSize / 2;
    const centerY = tileY * this.tileSize + this.tileSize / 2;

    this.ctx.save();
    this.ctx.translate(centerX, centerY);
    this.ctx.rotate(this.getHeadRotation());

    this.drawHeadCircle(radius);
    this.drawEyes(radius);
    this.drawPupils(radius);

    this.ctx.restore();
  }


  /**
* Draws the snake head.
* @param {number} radius - Radius of the snake head used for eye scaling
*/
  private drawHeadCircle(radius: number) {
    this.ctx.fillStyle = '#6fa930';
    this.ctx.beginPath();
    this.ctx.arc(0, 0, radius, 0, Math.PI * 2);
    this.ctx.fill();
  }


  /**
 * Draws the eyes on the snake head.
 * @param {number} radius - Radius of the snake head used for eye scaling
 */
  private drawEyes(radius: number) {
    const eyeOffsetX = radius / 2.5;
    const eyeOffsetY = radius / 3;
    const eyeRadius = radius / 4;

    this.ctx.fillStyle = '#fff';
    this.ctx.beginPath();
    this.ctx.arc(-eyeOffsetX, -eyeOffsetY, eyeRadius, 0, Math.PI * 2);
    this.ctx.arc(eyeOffsetX, -eyeOffsetY, eyeRadius, 0, Math.PI * 2);
    this.ctx.fill();
  }

  /**
 * Draws the pupils inside the snake's eyes.
 * @param {number} radius - Radius of the snake head used for pupil scaling
 */
  private drawPupils(radius: number) {
    const pupilOffsetX = radius / 2.5;
    const pupilOffsetY = radius / 3;
    const pupilRadius = radius / 8;

    this.ctx.fillStyle = '#000';
    this.ctx.beginPath();
    this.ctx.arc(-pupilOffsetX, -pupilOffsetY, pupilRadius, 0, Math.PI * 2);
    this.ctx.arc(pupilOffsetX, -pupilOffsetY, pupilRadius, 0, Math.PI * 2);
    this.ctx.fill();
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
 * Emits an event to navigate back to the main menu.
 */
  backToMenu() {
    this.backToMenuEvent.emit();
  }


  /**
 * Triggers a simulated win condition for testing purposes.
 */
  private triggerTestWin() {
    const totalTiles = this.game.tileCountX * this.game.tileCountY;
    while (this.snake.snakeSegments.length < totalTiles) {
      this.snake.grow();
    }
    this.game.score = totalTiles;
    (this.game as any)['handleGameWon']?.();
    this.draw();
  }
}