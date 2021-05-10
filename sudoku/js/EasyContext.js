// wrapper for the HTML5 Canvas API
// will only have the necessary functions in rendering this sudoku gamebreaker
class EasyContext {

    // this accepts an HTML5 canvas
    constructor(canvas) {
        this.context = canvas.getContext('2d');
    }

    get width() {
        return this.context.canvas.width;
    }

    get height() {
        return this.context.canvas.height;
    }

    // allows to easily change the attributes of the native context
    setProperty(key, value) {
        this.context[key] = value;
    }

    // this is meant to clear everything that the canvas has rendered
    clear() {
        let { context, width, height } = this;
        context.clearRect(0, 0, width, height);
    }

    // render a rectangle with this function
    rectangle(x, y, width, height) {
        this.context.fillRect(x, y, width, height);
    }

    // render a line with this function
    line(x1, y1, x2, y2) {
        let { context } = this;

        context.beginPath();
        context.moveTo(x1, y1)
        context.lineTo(x2, y2);
        context.stroke();
        context.closePath();
    }
}
