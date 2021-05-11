class SquarePointer {
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

    render(context) {
        context.save();
        context.fillStyle = 'rgb(220, 220, 220)';
        context.translate(this.rootX, this.rootY);
        // context.scale(this.stepX, this.stepY);
        context.fillRect(this.x * this.stepX, this.y * this.stepY, this.width, this.height);
        context.restore();
    }
}
