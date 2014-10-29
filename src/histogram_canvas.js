/**
 * Histogram
 * @param {Array.<Object>} data
 * @param {Number}         maxY
 * @param {Number}         minY
 * @param {Object}         options
 * @constructor
 */
function Histogram(data, maxY, minY, options) {

    /**
     * @type {Canvas}
     */
    this._canvas = document.getElementById('histogram');

    /**
     * @type {CanvasRenderingContext2D}
     */
    this._ctx = this._canvas.getContext('2d');

    /**
     * @type {Number}
     */
    this.w = this._canvas.offsetWidth;

    /**
     * @type {Number}
     */
    this.h = this._canvas.offsetHeight;

    /**
     * @type {Number}
     */
    this.padding = options.padding || 10;

    /**
     * @type {Number}
     */
    this.opacity = options.opacity || 1;

    /**
     * Max positive value
     * @type {Number}
     */
    this._minY = minY;

    /**
     * Max negative value
     * @type {[type]}
     */
    this._maxY = maxY;

    /**
     * Y step
     * @type {Number}
     */
    this._dy = (this.h - this.padding * 2) / (Math.abs(minY) + Math.abs(maxY));

    /**
     * X step
     * @type {Number}
     */
    this._dx = (this.w - this.padding * 2) / data.reduce(function(a, b) {
        return Math.max(a.length, b.length);
    });

    /**
     * Axis pos Y
     * @type {Number}
     */
    this._axis = this.padding + this._dy * Math.min(Math.abs(this._maxY), Math.abs(this._minY));

    this.render(data, options.colors, options.bg);
};

/**
 * @param  {Array.<Object>} data
 * @param  {Array.<String>} colors
 */
Histogram.prototype.render = function(data, colors, bg) {
    this._ctx.fillStyle = bg;
    this._ctx.fillRect(0, 0, this.w, this.h);

    for (var i = 0; i < data.length; i++) {
        this.drawGraph(data[i], 0, colors[i]);
    }

    this.drawAxis();
};

/**
 * Horizontal axis
 */
Histogram.prototype.drawAxis = function() {

};

/**
 * Draws graph, negative or positive
 *
 * @param  {Array}  data
 * @param  {Number} smooth
 * @param  {String} color
 */
Histogram.prototype.drawGraph = function(data, smooth, color) {
    var ctx = this._ctx,
        h = this._axis,
        x = this.padding;

    ctx.beginPath();
    ctx.fillStyle = ctx.strokeStyle = color;
    ctx.moveTo(x, h);

    for (var i = 0; i < data.length; i++) {
        console.log(data[i].value)
        var d = data[i].value,
            bh = h + this._dy * d;
        ctx.lineTo(x += this._dx, bh);
    }

    ctx.lineTo(x, h);
    ctx.fill();
    ctx.globalAlpha = 1;
    ctx.stroke();
};

module.exports = Histogram;
