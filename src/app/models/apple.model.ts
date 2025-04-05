import { Point } from './point.model';
import { SnakeSegment } from './snake-segment.model';

export class Apple {
    position: Point = { x: 5, y: 5 };

    /**
     * Respawns the apple on a free tile.
     */
    respawn(width: number, height: number, snakeSegments: SnakeSegment[]) {
        let newPosition: Point;
        do {
            newPosition = {
                x: Math.floor(Math.random() * width),
                y: Math.floor(Math.random() * height),
            };
        } while (snakeSegments.some(seg => seg.x === newPosition.x && seg.y === newPosition.y));
        this.position = newPosition;
    }

    /**
     * Checks if the apple is at a given position.
     */
    isAt(point: Point): boolean {
        return this.position.x === point.x && this.position.y === point.y;
    }

    /**
     * Draws the apple on canvas.
     * @param ctx Canvas rendering context
     * @param tileSize Size of one tile in pixels
     * @param image HTMLImageElement for the apple graphic
     */
    draw(ctx: CanvasRenderingContext2D, tileSize: number, image: HTMLImageElement) {
        ctx.drawImage(
            image,
            this.position.x * tileSize,
            this.position.y * tileSize,
            tileSize,
            tileSize
        );
    }
}
