"use strict";

var L = require('leaflet');

L.DynamicLayer = L.Class.extend({

    // options: {
    //     maxZoom: 18,
    //     radius: 25,
    //     blur: 15,
    //     max: 1.0
    // },

    initialize: function(data, renderer, options) {
        this._data = data;
        this._renderer = renderer;
        L.setOptions(this, options);
    },

    setData: function(data) {
        this._data = data;
        return this.redraw();
    },

    addPoint: function(point) {
        this._data.push(point);
        return this.redraw();
    },

    removePoint: function(point) {
        this._data.splice(this._data.indexOf(point), 1);
        return this.redraw();
    },

    setOptions: function(options) {
        L.setOptions(this, options);
        if (this._renderer) {
            this._updateOptions();
        }
        return this.redraw();
    },

    redraw: function() {
        if (this._renderer && !this._frame && !this._map._animating) {
            this._frame = L.Util.requestAnimFrame(this._redraw, this);
        }
        return this;
    },

    onAdd: function(map) {
        this._map = map;

        if (!this._canvas) {
            this._initCanvas();
            this._renderer.canvas(this._canvas);
        }

        map._panes.overlayPane.appendChild(this._canvas);

        map.on('moveend', this._reset, this);

        if (map.options.zoomAnimation && L.Browser.any3d) {
            map.on('zoomanim', this._animateZoom, this);
        }

        this._reset();
    },

    onRemove: function(map) {
        map.getPanes().overlayPane.removeChild(this._canvas);

        map.off('moveend', this._reset, this);

        if (map.options.zoomAnimation) {
            map.off('zoomanim', this._animateZoom, this);
        }
    },

    addTo: function(map) {
        map.addLayer(this);
        return this;
    },

    _initCanvas: function() {
        var canvas = this._canvas =
            L.DomUtil.create('canvas', 'leaflet-dynamic-layer leaflet-layer');

        var size = this._map.getSize();
        canvas.width = size.x;
        canvas.height = size.y;

        var animated = this._map.options.zoomAnimation && L.Browser.any3d;
        L.DomUtil.addClass(canvas, 'leaflet-zoom-' +
            (animated ? 'animated' : 'hide'));

        this._renderer.canvas(this._canvas);
        this._updateOptions();
    },

    _updateOptions: function() {
        // animation here
    },

    _reset: function() {
        var topLeft = this._map.containerPointToLayerPoint([0, 0]);
        L.DomUtil.setPosition(this._canvas, topLeft);

        var size = this._map.getSize();

        this._canvas.width = size.x;
        this._canvas.height = size.y;

        this._renderer.update();

        this._moved = true;
        this._redraw();
    },

    _redraw: function() {
        var i, len, data = [],
            r = 20,
            moved = this._moved,
            size = this._map.getSize(),
            bounds = new L.LatLngBounds(
                this._map.containerPointToLatLng(L.point([-r, -r])),
                this._map.containerPointToLatLng(size.add([r, r])));

        for (i = 0, len = this._data.length; i < len; i++) {
            if (bounds.contains(this._data[i].latlng)) {
                if (moved) {
                    this._data[i].px =
                        this._map.latLngToContainerPoint(this._data[i].latlng);
                }
                data.push(this._renderer.prerender(this._data[i]));
            }
        }
        this._renderer.draw(data);
        this._frame = this._moved = null;
        //console.log(data)
        this.redraw();
    },

    _animateZoom: function(e) {
        var scale = this._map.getZoomScale(e.zoom),
            offset = this._map._getCenterOffset(e.center)
            ._multiplyBy(-scale)
            .subtract(this._map._getMapPanePos());

        this._canvas.style[L.DomUtil.TRANSFORM] =
            L.DomUtil.getTranslateString(offset) + ' scale(' + scale + ')';
        // L.DomUtil.setTransform(this._canvas, offset, scale);
    }
});

// factory
L.dynamicLayer = function(data, options) {
    return new L.DynamicLayer(data, options);
};

module.exports = L.DynamicLayer;
