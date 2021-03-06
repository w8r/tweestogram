"use strict";

var xmlns = "http://www.w3.org/2000/svg";
var throttle = require('throttleit');
var min = Math.min,
    max = Math.max,
    abs = Math.abs,
    round = Math.round,
    floor = Math.floor;

var MONTHS = 'Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec'.split(' ');

/**
 * DD.MM.YYYY -> MM YY
 * @param  {String} date
 * @return {String}
 */
function formatDate(date) {
    return date.replace(/(\d{2})\.(\d{2})\.(\d{4})$/g, function(date, d, m, y) {
        return '&nbsp;' + d + ' ' + MONTHS[parseInt(m)] + '&nbsp;';
    });
}

/**
 * Histogram
 * @param {Array.<Object>} data
 * @param {Number}         maxY Easier to calculate them in one go while parsing
 * @param {Number}         minY
 * @param {Object}         options
 * @constructor
 */
function Histogram(container, data, maxY, minY, options) {

    /**
     * Store the data
     * @type {Array.<Object>}
     */
    this.data = data;

    /**
     * @type {Object}
     */
    this.options = options;

    /**
     * @type {Canvas}
     */
    this._container = container;

    /**
     * @type {Number}
     */
    this.w = parseInt(this._container.getAttributeNS(null, 'width'));

    /**
     * Correct bottom space
     * @type {Number}
     */
    this.h = parseInt(this._container.getAttributeNS(null, 'height') - 40);

    /**
     * @type {Number}
     */
    this.padding = options.padding || 10;

    /**
     * @type {Number}
     */
    this.opacity = options.opacity || 0.5;

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
    this._axis = this.h - this.padding -
        this._dy * Math.min(Math.abs(maxY), Math.abs(minY));

    this.render(data, options.colors, options.bg);
    this.updateStats = /*throttle(*/ this.updateStats.bind(this) /*, 5)*/ ;
    this.update();
};

/**
 * @param  {Array.<Object>} data
 * @param  {Array.<String>} colors
 */
Histogram.prototype.render = function(data, colors, bg) {
    var handles = this._container.querySelectorAll('.handle');
    this.leftHandle = handles[0];
    this.rightHandle = handles[1];
    this._controls = this._container.querySelector('.controls');

    this.left = this.padding;
    this.right = this.w - this.padding;

    this.clip = this._container.querySelector('#clip');

    for (var i = 0; i < data.length; i++) {
        this.drawGraph(data[i], 0, colors[i]);
    }

    this.drawTotal();
    this.drawDates(this.getStartDate(), this.getEndDate());
    this.drawAxis(this.options.axis);
};

/**
 * Date text markers
 * @param  {String} startDate
 * @param  {String} endDate
 */
Histogram.prototype.drawDates = function(startDate, endDate) {
    this.startText = this.createText('date left', this.left,
        this.h, undefined, formatDate(startDate));
    this._container.insertBefore(this.startText, this._controls);

    this.endText = this.createText('date right', this.right,
        this.h, undefined, formatDate(endDate));
    this._container.insertBefore(this.endText, this._controls);
};

/**
 * Total number
 */
Histogram.prototype.drawTotal = function() {
    var element = this.createText('graph-total graph-total-sum',
        this.w / 2, this.h + this.padding * 2.5, 'baseline');
    this._container.insertBefore(element, this._controls);
    this.totals.push(element);
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
    ].join(''));

    element.setAttributeNS(null, 'stroke', options.color);
    element.setAttributeNS(null, 'stroke-width', options.weight);
    element.setAttributeNS(null, 'stroke-opacity', options.opacity);
    this._container.insertBefore(element, this._controls);
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
        x = this.padding,
        m = 0;

    var element = document.createElementNS(xmlns, 'path'),
        path = ["M ", [x, h].join(',')];

    for (var i = 0; i < data.length; i++) {
        var d = data[i].value,
            bh = h - this._dy * d;
        path.push("L", [x += this._dx, bh].join(','));

        if (abs(data[m].value) < abs(d)) {
            m = i;
        }
    }
    path.push("L", [x, h].join(','), "Z");

    m = this._axis - (data[m].value / 2) * this._dy;

    element.setAttributeNS(null, 'd', path.join(''));
    element.setAttributeNS(null, 'stroke', color);
    element.setAttributeNS(null, 'fill', color);
    element.setAttributeNS(null, 'class', 'graph-back');

    this._container.insertBefore(element, this._controls);

    // front copy
    element = element.cloneNode(element, true);
    element.setAttributeNS(null, 'clip-path', 'url(#current)');
    element.setAttributeNS(null, 'class', 'graph-front');
    this._container.insertBefore(element, this._controls);

    element = this.createText('graph-total', this.w / 2, m);
    this._container.insertBefore(element, this._controls);
    this.totals = this.totals || [];
    this.totals.push(element);
};

/**
 * Creates text on graph
 *
 * @param  {String}  className
 * @param  {Number}  x
 * @param  {Number}  y
 * @param  {String=} textAnchor
 * @param  {String=} align
 * @param  {String=} text
 *
 * @return {SVGTextElement}
 */
Histogram.prototype.createText = function(className, x, y, align, text) {
    var element = document.createElementNS(xmlns, 'text');

    element.setAttributeNS(null, 'class', className);
    element.setAttributeNS(null, 'dominant-baseline', align || 'central');
    element.setAttributeNS(null, 'x', x);
    element.setAttributeNS(null, 'y', y);

    if (text) {
        element.innerHTML = text;
    }

    return element;
};

/**
 * @param  {Number} pos
 */
Histogram.prototype.moveLeftHandle = function(pos) {
    var w = this.w,
        padding = this.padding,
        textWidth = this.textWidth = this.textWidth || this.startText.offsetWidth,
        pos;
    this.left = max(padding, min(this.right - this._dx, pos));
    pos = (this.left - padding);
    this.leftHandle.setAttributeNS(null, 'transform',
        'translate(' + pos + ',0)');

    // move text
    pos = pos - textWidth;
    if (pos < 0) {
        pos += textWidth;
    }

    this.startText.innerHTML = formatDate(this.getStartDate());
    this.startText.setAttributeNS(null, 'transform', 'translate(' + pos + ',0)');
    this.update();
};

/**
 * @param  {Number} pos
 */
Histogram.prototype.moveRightHandle = function(pos) {
    var w = this.w,
        padding = this.padding,
        textWidth = this.textWidth = this.textWidth || this.startText.offsetWidth,
        pos;
    this.right = min(w - padding, max(pos, this.left + this._dx));
    pos = (this.right - w + padding);
    this.rightHandle.setAttributeNS(null, 'transform',
        'translate(' + pos + ',0)');

    pos += textWidth;
    // move text
    if ((w + pos) > (w)) {
        pos -= textWidth;
    }

    this.endText.innerHTML = formatDate(this.getEndDate());
    this.endText.setAttributeNS(null, 'transform', 'translate(' + pos + ',0)');
    this.update();
};

/**
 * Redraw
 */
Histogram.prototype.update = function() {
    this.updateStats();
    this.updateClip();
};

/**
 * Updates numbers
 */
Histogram.prototype.updateStats = function() {
    var start = this.getStart(),
        end = this.getEnd(),
        data = this.data,
        x = (this.left + this.right) / 2,
        scale = abs(this.left - this.right) / (this.w - this.padding * 2),
        total = 0,
        sums = [],
        text, i, len = data.length;

    for (i = 0; i < len; i++) {
        for (var j = start, sum = 0, row = this.data[i]; j <= end; j++) {
            sum += row[j].value;
        }
        sum = abs(sum);
        sums.push(sum);
        total += sum;
    }
    sums.push(total);

    // separate render and calc
    for (i = 0; i < len + 1; i++) {
        text = this.totals[i];
        text.innerHTML = sums[i];
        text.setAttributeNS(null, 'x', x);

        text.style.zoom = 0.55 + (0.45 * scale);
    }
};

/**
 * Start date pos in set
 * @return {Number}
 */
Histogram.prototype.getStart = function() {
    return max(0, floor((this.left - this.padding) / this._dx));
};

/**
 * End date position
 * @return {Number}
 */
Histogram.prototype.getEnd = function() {
    return min(this.data[0].length - 1,
        floor((this.right - this.padding) / this._dx));
};

/**
 * @return {String}
 */
Histogram.prototype.getStartDate = function() {
    return this.data[0][this.getStart()].date;
};

/**
 * @return {String}
 */
Histogram.prototype.getEndDate = function() {
    return this.data[0][this.getEnd()].date;
};

/**
 * Updates clip path to highlight selection
 */
Histogram.prototype.updateClip = function() {
    this.clip.setAttributeNS(null, 'd', 'M' + this.left + ',0L' +
        this.right + ',0L' +
        this.right + ',' + this.h + 'L' +
        this.left + ',' + this.h + 'Z');
};

module.exports = Histogram;
