var Histogram = require('./histogram');
var Hammer = global.Hammer = require('hammerjs');
var position = require('position')

/**
 * Time control
 * @param {Array.<Object>} data
 * @param {Number}         maxY Easier to calculate them in one go while parsing
 * @param {Number}         minY
 * @param {Object}         options
 * @constructor
 */
function TimeControl(data, maxY, minY, options) {
    this.container = document.createElement('div');
    this.container.className = 'timecontrol';
    var svg = document.getElementById('histogram');
    this.container.appendChild(svg);
    document.body.appendChild(this.container);

    this.histogram = new Histogram(svg, data, maxY, minY, options);

    this.container.addEventListener('touchmove', function(e) {
        e.preventDefault();
    });

    /**
     * @type {Object}
     */
    this.position = position(this.container);

    this.handleTolerance = 10;

    /**
     * @type {Hammer.Manager}
     */
    this.eventEmitter = new Hammer.Manager(this.container);

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


TimeControl.prototype.onDragStart = function(evt) {
    var dragstart = false;
    if (evt.target === this.histogram.leftHandle ||
        evt.target === this.histogram.rightHandle) {

        this.move = evt.target === this.histogram.leftHandle ?
            this.histogram.moveLeftHandle.bind(this.histogram) :
            this.histogram.moveRightHandle.bind(this.histogram);

        this.eventEmitter.on('panmove', this.onDragHandle);
        this.eventEmitter.on('panend', this.onDragStop);
    }
};

TimeControl.prototype.onDragHandle = function(evt) {
    this.move(evt.center.x - this.position.left, evt.distance);
};

TimeControl.prototype.onDragStop = function(evt) {
    this.eventEmitter.off('panmove', this.onDragHandle);
    this.eventEmitter.off('panend', this.onDragStop);
};

TimeControl.prototype.onPinch = function(evt) {
    evt.preventDefault();
    console.log(evt);
};

module.exports = TimeControl;
