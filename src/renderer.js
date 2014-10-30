"use strict";

var min = Math.min,
    max = Math.max,
    abs = Math.abs,
    round = Math.round,
    floor = Math.floor;

function Renderer(options) {

    /**
     * @type {Object}
     */
    this.options = options;

    /**
     * @type {Canvas}
     */
    this._canvas = null;

    /**
     * @type {Number}
     */
    this._width = null;

    /**
     * @type {Number}
     */
    this._height = null;
}

Renderer.prototype.canvas = function(canvas) {
    this._canvas = canvas;
    this._ctx = canvas.getContext('2d');
    this.update();
    return this;
};

Renderer.prototype.update = function() {
    this._width = this._canvas.width;
    this._height = this._canvas.height;
    return this;
};

/**
 * Pre-renders points, separate calculations and rendering
 * @param  {Object} p
 * @return {Object}
 */
Renderer.prototype.prerender = function(p) {
    var outskirtsColor = this.options.outskirtsColor,
        centerColor = this.options.centerColor,
        dOpacity = this.options.dOpacity,
        opacity = this.options.opacity,
        dR = this.options.dR,
        radius = this.options.radius;

    if (!p.color) {
        p.color = p.center === '1' ? centerColor : outskirtsColor;
    }

    if (p.active) {
        p.opacity = min(opacity, p.opacity + dOpacity);
        p.radius = min(radius, p.radius + dR);
    } else {
        p.opacity = max(0, p.opacity - dOpacity);
        p.radius = max(0, p.radius - dR);
    }

    return p;
};

Renderer.prototype.draw = function(data) {
    var p;
    this._ctx.clearRect(0, 0, this._width, this._height);
    for (var i = 0, len = data.length; i < len; i++) {
        p = data[i];
        this.drawPoint(p.px, p.radius, p.color, p.opacity);
    }
    return this;
};

Renderer.prototype.drawPoint = function(p, r, c, o) {
    var context = this._ctx;
    context.globalAlpha = o;
    context.beginPath();
    context.arc(p.x, p.y, r, 0, 2 * Math.PI, false);
    context.fillStyle = c;
    context.fill();
    context.lineWidth = 1;
    context.strokeStyle = c;
    context.stroke();
};

module.exports = Renderer;
