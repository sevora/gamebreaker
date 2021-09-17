/*
 * This is literally just a square pointer. 
 * Mainly used to indicate what grid is active on the main program.
 */
class SquarePointer {
    /*
     * constructor accepts
     * rootX: where the pointer is anchored or rooted at in the x-axis (x=0)
     * rootY: where the pointer is anchored or rooted at in the y-axis (y=0)
     * stepX: represents how much the pointer moves along the x-axis when its x-coordinate is changed
     * stepY: represents how much the pointer moves along the y-axis when its y-coordinate is changed
     * width: the width of the pointer
     * height: the height of the pointer
     */
    constructor(rootX, rootY, stepX, stepY, width, height) {
        this.rootX = rootX;
        this.rootY = rootY;
        
        this.stepX = stepX;
        this.stepY = stepY;

        this.width = width;
        this.height = height;

        this.x = 0;
        this.y = 0;
    }

    // used to render the pointer using the canvas API
    render(context) {
        context.save();
        context.fillStyle = 'rgb(220, 220, 220)';
        context.translate(this.rootX, this.rootY);
        context.fillRect(this.x * this.stepX, this.y * this.stepY, this.width, this.height);
        context.restore();
    }
}
