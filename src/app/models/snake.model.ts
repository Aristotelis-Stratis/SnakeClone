import { SnakeSegment } from './snake-segment.model';

/**
 * Represents the snake with movement, growth and drawing logic.
 */
export class Snake {
    segments!: SnakeSegment[];
    velocity = { x: 1, y: 0 };

    constructor() {
        this.reset();
    }

    /**
     * Returns the head of the snake.
     */
    get head(): SnakeSegment {
        return this.segments[0];
    }

    /**
     * Moves the snake forward in its current direction.
     * @param grow If true, the snake grows after moving
     */
    move(grow: boolean = false) {
        this.addHead();
        if (!grow) {
            this.removeTail();
        }
    }

    /**
     * Adds a new segment at the tail to grow the snake.
     */
    grow() {
        const tail = this.segments[this.segments.length - 1];
        this.segments.push(tail.copy());
    }

    /**
     * Resets the snake to its initial position and direction.
     */
    reset() {
        this.segments = [
            new SnakeSegment(10, 10),
            new SnakeSegment(9, 10),
            new SnakeSegment(8, 10)
        ];
        this.velocity = { x: 1, y: 0 };
    }

    /**
     * Checks if the given point collides with any segment.
     * @param point The point to check
     * @returns True if any segment matches the point
     */
    isCollision(point: { x: number; y: number }): boolean {
        return this.segments.some(s => s.isAt(point));
    }

    /**
     * Draws the snake to the canvas.
     * @param ctx Canvas rendering context
     * @param tileSize Size of a single tile
     * @param headImage Image for the snake head
     * @param bodyImage Image for the snake body
     * @param getSizeFactor Function to calculate size scale
     * @param getRotation Function to get current head rotation
     */
    draw(
        ctx: CanvasRenderingContext2D,
        tileSize: number,
        headImage: HTMLImageElement,
        bodyImage: HTMLImageElement,
        getSizeFactor: (index: number) => number,
        getRotation: () => number
    ) {
        this.segments.forEach((segment, index) => {
            const isHead = index === 0;
            const image = isHead ? headImage : bodyImage;
            const scale = isHead ? 1.3 : getSizeFactor(index);
            this.drawSegment(ctx, segment, tileSize, image, scale, isHead ? getRotation() : null);
        });
    }

    /**
     * Draws a single segment (rotated if head).
     * @param ctx Canvas rendering context
     * @param segment The segment to draw
     * @param tileSize Size of a single tile
     * @param image Image to draw
     * @param scale Scaling factor
     * @param rotation Rotation angle in radians (optional)
     */
    private drawSegment(
        ctx: CanvasRenderingContext2D,
        segment: SnakeSegment,
        tileSize: number,
        image: HTMLImageElement,
        scale: number,
        rotation: number | null
    ) {
        const size = tileSize * scale;
        const offset = (tileSize - size) / 2;
        const x = segment.x * tileSize + offset;
        const y = segment.y * tileSize + offset;

        if (rotation !== null) {
            ctx.save();
            ctx.translate(x + size / 2, y + size / 2);
            ctx.rotate(rotation);
            ctx.drawImage(image, -size / 2, -size / 2, size, size);
            ctx.restore();
        } else {
            segment.draw(ctx, tileSize, image, scale);
        }
    }

    /**
     * Adds a new head in the current movement direction.
     */
    private addHead() {
        const newHead = new SnakeSegment(
            this.head.x + this.velocity.x,
            this.head.y + this.velocity.y
        );
        this.segments.unshift(newHead);
    }

    /**
     * Removes the tail segment.
     */
    private removeTail() {
        this.segments.pop();
    }
}
