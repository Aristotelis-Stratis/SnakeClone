export class SnakeSegment {
    constructor(public x: number, public y: number) {}
  
    isAt(point: { x: number; y: number }): boolean {
      return this.x === point.x && this.y === point.y;
    }
  
    copy(): SnakeSegment {
      return new SnakeSegment(this.x, this.y);
    }
  
    /**
     * Draws this segment on canvas.
     * @param ctx Canvas context
     * @param tileSize Size of tile in px
     * @param image Image to use
     * @param scale Optional scaling factor (1 = full size)
     */
    draw(ctx: CanvasRenderingContext2D, tileSize: number, image: HTMLImageElement, scale = 1.0) {
      const size = tileSize * scale;
      const offset = (tileSize - size) / 2;
      const x = this.x * tileSize + offset;
      const y = this.y * tileSize + offset;
      ctx.drawImage(image, x, y, size, size);
    }
  }
  