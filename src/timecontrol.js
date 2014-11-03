"use strict";

var Histogram = require('./histogram');
var Hammer = global.Hammer = require('hammerjs');
var position = require('position');
var L = require('leaflet');
var Renderer = require('./renderer');
var DynamicLayer = require('./dynamic_layer');

/**
 * Time control
 * @param {Array.<Object>} data
 * @param {Number}         maxY Easier to calculate them in one go while parsing
 * @param {Number}         minY
 * @param {Object}         options
 * @constructor
 */
function TimeControl(data, options) {

    /**
     * @type {Object}
     */
    this.options = L.Util.extend(this.options, options);

    /**
     * @type {Element}
     */
    this._container = document.createElement('div');
    this._container.className = 'timecontrol';
    this._container.appendChild(document.getElementById('histogram'));

    /**
     * @type {Object}
     */
    this.position = null;

    /**
     * @type {Object}
     */
    this._data = data;

    /**
     * @type {Hammer.Manager}
     */
    this.eventEmitter = new Hammer.Manager(this._container);

    this.enable();

    L.Control.prototype.initialize.call(this, this.options);
};
TimeControl.prototype = Object.create(L.Control.prototype);

/**
 * @type {Object}
 */
TimeControl.prototype.options = {
    position: 'topright'
};

/**
 * @param  {L.Map} map
 * @return {Element}
 */
TimeControl.prototype.onAdd = function(map) {
    L.DomEvent
        .disableClickPropagation(this._container)
        .disableScrollPropagation(this._container);

    /**
     * @type {Histogram}
     */
    this.histogram = new Histogram(this._container.querySelector('svg'),
        this.getHistogramData(),
        this._maxcenter, this._maxoutskirts, {
            bg: this.options.histogramBg,
            colors: [this.options.centerColor, this.options.outskirtsColor],
            axis: {
                color: 'rgba(0,0,0,0.8)',
                weight: 1,
                opacity: 0.8
            }
        });

    var point;
    for (var i = 0, len = this._data.length; i < len; i++) {
        point = this._data[i];
        point.latlng = new L.LatLng(point.lat, point.long);
        point.radius = point.opacity = 0;
    }

    this._renderer = new Renderer({
        centerColor: this.options.centerColor,
        outskirtsColor: this.options.outskirtsColor,
        opacity: 0.7,
        dOpacity: 1 / (1 * 60),
        dR: 10 / (0.5 * 60),
        radius: 10
    });

    this._layer = new DynamicLayer(this._data, this._renderer).addTo(map);
    this.onRangeSelected(this.histogram.getStartDate(), this.histogram.getEndDate());

    map.on('zoomend', this.onZoomend, this);

    return this._container;
};

/**
 * TODO zoom animation
 */
TimeControl.prototype.onZoomend = function() {
    // var zoom = this._map.getZoom();
    // //this._renderer.options.radius = zoom * 2;
    // console.log(zoom)
    // this._layer.redraw();
};

/**
 * @param {L.Map} map
 */
TimeControl.prototype.addTo = function(map) {
    L.Control.prototype.addTo.call(this, map);
    this.position = position(this._container);
    return this;
};

/**
 * Groups data by days, calculates peaks
 * @return {Object}
 */
TimeControl.prototype.groupByDays = function() {
    var data = [],
        center = 0,
        outskirts = 0,
        maxCenter = 0,
        maxOutskirts = 0,
        row, dayData, date;

    for (var i = 0, ii = this._data.length; i < ii; i++) {

        row = this._data[i];

        if (row.center === '1') {
            center++;
        } else {
            outskirts++;
        }

        if (date !== row.date) {
            if (dayData) {
                data.push({

                    center: center,
                    outskirts: outskirts,

                    date: date,
                    data: dayData
                });

                maxCenter = Math.max(center, maxCenter);
                maxOutskirts = Math.max(outskirts, maxOutskirts);

                center = 0;
                outskirts = 0;

            }
            date = row.date;
            dayData = [];
        }
        dayData.push(row);
    }

    this._maxoutskirts = maxOutskirts;
    this._maxcenter = maxCenter;

    return {

        //center: maxCenter,
        //outskirts: maxOutskirts,

        //dateStart: data[0].date,
        //dateEnd: data[data.length - 1].date,

        data: data
    };
};

/**
 * Populates histogram data
 * @return {Array.<Object>}
 */
TimeControl.prototype.getHistogramData = function() {
    var data = this.groupByDays(),
        center = [],
        outskirts = [];

    for (var i = 0, len = data.data.length; i < len; i++) {
        center.push({
            value: data.data[i].center,
            date: data.data[i].date
        });
        outskirts.push({
            value: -data.data[i].outskirts,
            date: data.data[i].date
        });
    }
    return [center, outskirts];
};

/**
 * Enables handlers
 */
TimeControl.prototype.enable = function() {
    this._container.addEventListener('touchmove', function(e) {
        e.preventDefault();
    });

    this.eventEmitter.add(new Hammer.Pan({
        direction: Hammer.DIRECTION_HORIZONTAL,
        threshold: 0,
        pointers: 0
    }));

    this.onDragHandle = this.onDragHandle.bind(this);
    this.onDragStart = this.onDragStart.bind(this);
    this.onDragStop = this.onDragStop.bind(this);

    this.eventEmitter.on('panstart', this.onDragStart.bind(this));
};

/**
 * Dragging started somewhere on the histogram, select handle and
 * start interacting
 *
 * @param  {Event} evt
 */
TimeControl.prototype.onDragStart = function(evt) {
    var dragstart = false,
        handle;
    if (evt.target === this.histogram.leftHandle ||
        evt.target === this.histogram.rightHandle) {

        this.histogram._container.classList.add('dragging');
        this._handle = evt.target;
        this._handle.classList.add('dragging');

        this.move = evt.target === this.histogram.leftHandle ?
            this.histogram.moveLeftHandle.bind(this.histogram) :
            this.histogram.moveRightHandle.bind(this.histogram);

        this.eventEmitter.on('panmove', this.onDragHandle);
        this.eventEmitter.on('panend', this.onDragStop);
    }
};

/**
 * Dragging: normalize x pos
 * @param  {Event} evt
 */
TimeControl.prototype.onDragHandle = function(evt) {
    this.move(evt.center.x - this.position.left, evt.distance);
    this.onRangeSelected(this.histogram.getStartDate(), this.histogram.getEndDate());
};

/**
 * @param  {Event} evt
 */
TimeControl.prototype.onDragStop = function(evt) {
    this.eventEmitter.off('panmove', this.onDragHandle);
    this.eventEmitter.off('panend', this.onDragStop);

    this.histogram._container.classList.remove('dragging');
    this._handle.classList.remove('dragging');
    this._handle = null;

    this.onRangeSelected(this.histogram.getStartDate(), this.histogram.getEndDate());
};

/**
 * @param  {Number} start
 * @param  {Number} end
 * @return {Array}
 */
TimeControl.prototype.flattenData = function(start, end) {
    var data = this._data.data.slice(0, this._data.data.length - 1),
        copy = [],
        i, len;

    // for is x1.25 faster than Array.map()
    for (i = 0, len = data.length; i < len; i++) {
        copy.push(data[i].data);
    }
    data = [].concat.apply([], copy);

    return data;
};

/**
 * @param  {Number} start
 * @param  {Number} end
 * @return {Number}
 */
TimeControl.prototype.onRangeSelected = function(start, end) {
    var marker = start,
        active = false,
        data = this._data,
        o, i, len;

    if (start === end) {
        for (i = 0, len = this._data.length; i < len; i++) {
            data.active = false;
        }
    } else {
        // var h = 0;
        for (i = 0, len = this._data.length; i < len; i++) {
            o = data[i];
            if (o.date === marker) {
                if (marker === start) { // start - make visible
                    active = !active;
                    marker = end; // wait for end
                } else if (marker === end) { // end
                    marker = -1; // wait for next not end
                }
            }
            if (marker === -1 && o.date !== end) {
                marker = -2;
                active = !active;
            }
            // if (active) h++;
            o.active = active;
        }
    }

    // console.log(h, '/', this._data.length);
    this._layer.redraw();

};

/**
 * @param  {Map} map
 * @return {TimeControl}
 */
TimeControl.prototype.onRemove = function(map) {
    map.removeLayer(this._layer);
    this._layer = null;
    this._renderer = null;
    map.off('zoomend', this.onZoomend, this);
    return this;
};

module.exports = TimeControl;
