var xmlns = "http://www.w3.org/2000/svg";

/**
 * Histogram
 * @param {Array.<Object>} data
 * @param {Number}         maxY Easier to calculate them in one go while parsing
 * @param {Number}         minY
 * @param {Object}         options
 * @constructor
 */
function Histogram(data, maxY, minY, options) {

    /**
     * @type {Object}
     */
    this.options = options;

    /**
     * @type {Canvas}
     */
    this._container = document.getElementById('histogram');

    /**
     * @type {Number}
     */
    this.w = this._container.getAttributeNS(null, 'width');

    /**
     * @type {Number}
     */
    this.h = this._container.getAttributeNS(null, 'height');

    /**
     * @type {Number}
     */
    this.padding = options.padding || 10;

    /**
     * @type {Number}
     */
    this.opacity = options.opacity || 0.7;

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
    this._axis = this.padding + this._dy * Math.min(Math.abs(maxY), Math.abs(minY));

    this.render(data, options.colors, options.bg);
};

/**
 * @param  {Array.<Object>} data
 * @param  {Array.<String>} colors
 */
Histogram.prototype.render = function(data, colors, bg) {
    this.createBackground(bg);

    for (var i = 0; i < data.length; i++) {
        this.drawGraph(data[i], 0, colors[i]);
    }

    this.drawAxis(this.options.axis);
};

/**
 * Horizontal axis
 * @param {String} color
 * @param {Number} weight
 */
Histogram.prototype.drawAxis = function(options) {
    var element = document.createElementNS(xmlns, 'path');
    element.setAttributeNS(null, 'd', [
        "M", [this.padding, this._axis].join(','),
        "L", [this.w - this.padding, this._axis].join(','), "Z"
    ].join(' '));
    element.setAttributeNS(null, 'stroke', options.color);
    element.setAttributeNS(null, 'stroke-width', options.weight);

    this._container.appendChild(element);
};

/**
 * Background
 * @param  {String} color
 */
Histogram.prototype.createBackground = function(color) {
    var element = document.createElementNS(xmlns, 'path');
    element.setAttributeNS(null, "d", ["M", [0, 0].join(','),
        "L", [this.w, 0].join(','),
        "L", [this.w, this.h].join(','),
        "L", [0, this.h].join(','),
        "L", [0, 0].join(','), "Z"
    ].join(' '));

    element.setAttributeNS(null, 'fill', color);

    this._container.appendChild(element);
};

/**
 * Draws graph, negative or positive
 *
 * @param  {Array}  data
 * @param  {Number} smooth
 * @param  {String} color
 */
Histogram.prototype.drawGraph = function(data, smooth, color) {
    var h = this._axis,
        x = this.padding;

    var element = document.createElementNS(xmlns, 'path'),
        path = ["M ", [x, h].join(',')];

    for (var i = 0; i < data.length; i++) {
        var d = data[i].value,
            bh = h + this._dy * d;
        path.push("L", [x += this._dx, bh].join(','));
    }
    path.push("L", [x, h].join(','), "Z");

    element.setAttributeNS(null, 'd', path.join(' '));
    element.setAttributeNS(null, 'stroke', color);
    element.setAttributeNS(null, 'fill', color);
    element.setAttributeNS(null, 'fill-opacity', this.opacity);

    this._container.appendChild(element);
};

module.exports = Histogram;
