(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"/Users/w8r/Projects/tweethistorgam/index.js":[function(require,module,exports){
(function (global){
var App = require('./src/app');

var app = global.app = new App(require('./settings.json'));

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./settings.json":"/Users/w8r/Projects/tweethistorgam/settings.json","./src/app":"/Users/w8r/Projects/tweethistorgam/src/app.js"}],"/Users/w8r/Projects/tweethistorgam/node_modules/hammerjs/hammer.js":[function(require,module,exports){
/*! Hammer.JS - v2.0.4 - 2014-09-28
 * http://hammerjs.github.io/
 *
 * Copyright (c) 2014 Jorik Tangelder;
 * Licensed under the MIT license */
(function(window, document, exportName, undefined) {
  'use strict';

var VENDOR_PREFIXES = ['', 'webkit', 'moz', 'MS', 'ms', 'o'];
var TEST_ELEMENT = document.createElement('div');

var TYPE_FUNCTION = 'function';

var round = Math.round;
var abs = Math.abs;
var now = Date.now;

/**
 * set a timeout with a given scope
 * @param {Function} fn
 * @param {Number} timeout
 * @param {Object} context
 * @returns {number}
 */
function setTimeoutContext(fn, timeout, context) {
    return setTimeout(bindFn(fn, context), timeout);
}

/**
 * if the argument is an array, we want to execute the fn on each entry
 * if it aint an array we don't want to do a thing.
 * this is used by all the methods that accept a single and array argument.
 * @param {*|Array} arg
 * @param {String} fn
 * @param {Object} [context]
 * @returns {Boolean}
 */
function invokeArrayArg(arg, fn, context) {
    if (Array.isArray(arg)) {
        each(arg, context[fn], context);
        return true;
    }
    return false;
}

/**
 * walk objects and arrays
 * @param {Object} obj
 * @param {Function} iterator
 * @param {Object} context
 */
function each(obj, iterator, context) {
    var i;

    if (!obj) {
        return;
    }

    if (obj.forEach) {
        obj.forEach(iterator, context);
    } else if (obj.length !== undefined) {
        i = 0;
        while (i < obj.length) {
            iterator.call(context, obj[i], i, obj);
            i++;
        }
    } else {
        for (i in obj) {
            obj.hasOwnProperty(i) && iterator.call(context, obj[i], i, obj);
        }
    }
}

/**
 * extend object.
 * means that properties in dest will be overwritten by the ones in src.
 * @param {Object} dest
 * @param {Object} src
 * @param {Boolean} [merge]
 * @returns {Object} dest
 */
function extend(dest, src, merge) {
    var keys = Object.keys(src);
    var i = 0;
    while (i < keys.length) {
        if (!merge || (merge && dest[keys[i]] === undefined)) {
            dest[keys[i]] = src[keys[i]];
        }
        i++;
    }
    return dest;
}

/**
 * merge the values from src in the dest.
 * means that properties that exist in dest will not be overwritten by src
 * @param {Object} dest
 * @param {Object} src
 * @returns {Object} dest
 */
function merge(dest, src) {
    return extend(dest, src, true);
}

/**
 * simple class inheritance
 * @param {Function} child
 * @param {Function} base
 * @param {Object} [properties]
 */
function inherit(child, base, properties) {
    var baseP = base.prototype,
        childP;

    childP = child.prototype = Object.create(baseP);
    childP.constructor = child;
    childP._super = baseP;

    if (properties) {
        extend(childP, properties);
    }
}

/**
 * simple function bind
 * @param {Function} fn
 * @param {Object} context
 * @returns {Function}
 */
function bindFn(fn, context) {
    return function boundFn() {
        return fn.apply(context, arguments);
    };
}

/**
 * let a boolean value also be a function that must return a boolean
 * this first item in args will be used as the context
 * @param {Boolean|Function} val
 * @param {Array} [args]
 * @returns {Boolean}
 */
function boolOrFn(val, args) {
    if (typeof val == TYPE_FUNCTION) {
        return val.apply(args ? args[0] || undefined : undefined, args);
    }
    return val;
}

/**
 * use the val2 when val1 is undefined
 * @param {*} val1
 * @param {*} val2
 * @returns {*}
 */
function ifUndefined(val1, val2) {
    return (val1 === undefined) ? val2 : val1;
}

/**
 * addEventListener with multiple events at once
 * @param {EventTarget} target
 * @param {String} types
 * @param {Function} handler
 */
function addEventListeners(target, types, handler) {
    each(splitStr(types), function(type) {
        target.addEventListener(type, handler, false);
    });
}

/**
 * removeEventListener with multiple events at once
 * @param {EventTarget} target
 * @param {String} types
 * @param {Function} handler
 */
function removeEventListeners(target, types, handler) {
    each(splitStr(types), function(type) {
        target.removeEventListener(type, handler, false);
    });
}

/**
 * find if a node is in the given parent
 * @method hasParent
 * @param {HTMLElement} node
 * @param {HTMLElement} parent
 * @return {Boolean} found
 */
function hasParent(node, parent) {
    while (node) {
        if (node == parent) {
            return true;
        }
        node = node.parentNode;
    }
    return false;
}

/**
 * small indexOf wrapper
 * @param {String} str
 * @param {String} find
 * @returns {Boolean} found
 */
function inStr(str, find) {
    return str.indexOf(find) > -1;
}

/**
 * split string on whitespace
 * @param {String} str
 * @returns {Array} words
 */
function splitStr(str) {
    return str.trim().split(/\s+/g);
}

/**
 * find if a array contains the object using indexOf or a simple polyFill
 * @param {Array} src
 * @param {String} find
 * @param {String} [findByKey]
 * @return {Boolean|Number} false when not found, or the index
 */
function inArray(src, find, findByKey) {
    if (src.indexOf && !findByKey) {
        return src.indexOf(find);
    } else {
        var i = 0;
        while (i < src.length) {
            if ((findByKey && src[i][findByKey] == find) || (!findByKey && src[i] === find)) {
                return i;
            }
            i++;
        }
        return -1;
    }
}

/**
 * convert array-like objects to real arrays
 * @param {Object} obj
 * @returns {Array}
 */
function toArray(obj) {
    return Array.prototype.slice.call(obj, 0);
}

/**
 * unique array with objects based on a key (like 'id') or just by the array's value
 * @param {Array} src [{id:1},{id:2},{id:1}]
 * @param {String} [key]
 * @param {Boolean} [sort=False]
 * @returns {Array} [{id:1},{id:2}]
 */
function uniqueArray(src, key, sort) {
    var results = [];
    var values = [];
    var i = 0;

    while (i < src.length) {
        var val = key ? src[i][key] : src[i];
        if (inArray(values, val) < 0) {
            results.push(src[i]);
        }
        values[i] = val;
        i++;
    }

    if (sort) {
        if (!key) {
            results = results.sort();
        } else {
            results = results.sort(function sortUniqueArray(a, b) {
                return a[key] > b[key];
            });
        }
    }

    return results;
}

/**
 * get the prefixed property
 * @param {Object} obj
 * @param {String} property
 * @returns {String|Undefined} prefixed
 */
function prefixed(obj, property) {
    var prefix, prop;
    var camelProp = property[0].toUpperCase() + property.slice(1);

    var i = 0;
    while (i < VENDOR_PREFIXES.length) {
        prefix = VENDOR_PREFIXES[i];
        prop = (prefix) ? prefix + camelProp : property;

        if (prop in obj) {
            return prop;
        }
        i++;
    }
    return undefined;
}

/**
 * get a unique id
 * @returns {number} uniqueId
 */
var _uniqueId = 1;
function uniqueId() {
    return _uniqueId++;
}

/**
 * get the window object of an element
 * @param {HTMLElement} element
 * @returns {DocumentView|Window}
 */
function getWindowForElement(element) {
    var doc = element.ownerDocument;
    return (doc.defaultView || doc.parentWindow);
}

var MOBILE_REGEX = /mobile|tablet|ip(ad|hone|od)|android/i;

var SUPPORT_TOUCH = ('ontouchstart' in window);
var SUPPORT_POINTER_EVENTS = prefixed(window, 'PointerEvent') !== undefined;
var SUPPORT_ONLY_TOUCH = SUPPORT_TOUCH && MOBILE_REGEX.test(navigator.userAgent);

var INPUT_TYPE_TOUCH = 'touch';
var INPUT_TYPE_PEN = 'pen';
var INPUT_TYPE_MOUSE = 'mouse';
var INPUT_TYPE_KINECT = 'kinect';

var COMPUTE_INTERVAL = 25;

var INPUT_START = 1;
var INPUT_MOVE = 2;
var INPUT_END = 4;
var INPUT_CANCEL = 8;

var DIRECTION_NONE = 1;
var DIRECTION_LEFT = 2;
var DIRECTION_RIGHT = 4;
var DIRECTION_UP = 8;
var DIRECTION_DOWN = 16;

var DIRECTION_HORIZONTAL = DIRECTION_LEFT | DIRECTION_RIGHT;
var DIRECTION_VERTICAL = DIRECTION_UP | DIRECTION_DOWN;
var DIRECTION_ALL = DIRECTION_HORIZONTAL | DIRECTION_VERTICAL;

var PROPS_XY = ['x', 'y'];
var PROPS_CLIENT_XY = ['clientX', 'clientY'];

/**
 * create new input type manager
 * @param {Manager} manager
 * @param {Function} callback
 * @returns {Input}
 * @constructor
 */
function Input(manager, callback) {
    var self = this;
    this.manager = manager;
    this.callback = callback;
    this.element = manager.element;
    this.target = manager.options.inputTarget;

    // smaller wrapper around the handler, for the scope and the enabled state of the manager,
    // so when disabled the input events are completely bypassed.
    this.domHandler = function(ev) {
        if (boolOrFn(manager.options.enable, [manager])) {
            self.handler(ev);
        }
    };

    this.init();

}

Input.prototype = {
    /**
     * should handle the inputEvent data and trigger the callback
     * @virtual
     */
    handler: function() { },

    /**
     * bind the events
     */
    init: function() {
        this.evEl && addEventListeners(this.element, this.evEl, this.domHandler);
        this.evTarget && addEventListeners(this.target, this.evTarget, this.domHandler);
        this.evWin && addEventListeners(getWindowForElement(this.element), this.evWin, this.domHandler);
    },

    /**
     * unbind the events
     */
    destroy: function() {
        this.evEl && removeEventListeners(this.element, this.evEl, this.domHandler);
        this.evTarget && removeEventListeners(this.target, this.evTarget, this.domHandler);
        this.evWin && removeEventListeners(getWindowForElement(this.element), this.evWin, this.domHandler);
    }
};

/**
 * create new input type manager
 * called by the Manager constructor
 * @param {Hammer} manager
 * @returns {Input}
 */
function createInputInstance(manager) {
    var Type;
    var inputClass = manager.options.inputClass;

    if (inputClass) {
        Type = inputClass;
    } else if (SUPPORT_POINTER_EVENTS) {
        Type = PointerEventInput;
    } else if (SUPPORT_ONLY_TOUCH) {
        Type = TouchInput;
    } else if (!SUPPORT_TOUCH) {
        Type = MouseInput;
    } else {
        Type = TouchMouseInput;
    }
    return new (Type)(manager, inputHandler);
}

/**
 * handle input events
 * @param {Manager} manager
 * @param {String} eventType
 * @param {Object} input
 */
function inputHandler(manager, eventType, input) {
    var pointersLen = input.pointers.length;
    var changedPointersLen = input.changedPointers.length;
    var isFirst = (eventType & INPUT_START && (pointersLen - changedPointersLen === 0));
    var isFinal = (eventType & (INPUT_END | INPUT_CANCEL) && (pointersLen - changedPointersLen === 0));

    input.isFirst = !!isFirst;
    input.isFinal = !!isFinal;

    if (isFirst) {
        manager.session = {};
    }

    // source event is the normalized value of the domEvents
    // like 'touchstart, mouseup, pointerdown'
    input.eventType = eventType;

    // compute scale, rotation etc
    computeInputData(manager, input);

    // emit secret event
    manager.emit('hammer.input', input);

    manager.recognize(input);
    manager.session.prevInput = input;
}

/**
 * extend the data with some usable properties like scale, rotate, velocity etc
 * @param {Object} manager
 * @param {Object} input
 */
function computeInputData(manager, input) {
    var session = manager.session;
    var pointers = input.pointers;
    var pointersLength = pointers.length;

    // store the first input to calculate the distance and direction
    if (!session.firstInput) {
        session.firstInput = simpleCloneInputData(input);
    }

    // to compute scale and rotation we need to store the multiple touches
    if (pointersLength > 1 && !session.firstMultiple) {
        session.firstMultiple = simpleCloneInputData(input);
    } else if (pointersLength === 1) {
        session.firstMultiple = false;
    }

    var firstInput = session.firstInput;
    var firstMultiple = session.firstMultiple;
    var offsetCenter = firstMultiple ? firstMultiple.center : firstInput.center;

    var center = input.center = getCenter(pointers);
    input.timeStamp = now();
    input.deltaTime = input.timeStamp - firstInput.timeStamp;

    input.angle = getAngle(offsetCenter, center);
    input.distance = getDistance(offsetCenter, center);

    computeDeltaXY(session, input);
    input.offsetDirection = getDirection(input.deltaX, input.deltaY);

    input.scale = firstMultiple ? getScale(firstMultiple.pointers, pointers) : 1;
    input.rotation = firstMultiple ? getRotation(firstMultiple.pointers, pointers) : 0;

    computeIntervalInputData(session, input);

    // find the correct target
    var target = manager.element;
    if (hasParent(input.srcEvent.target, target)) {
        target = input.srcEvent.target;
    }
    input.target = target;
}

function computeDeltaXY(session, input) {
    var center = input.center;
    var offset = session.offsetDelta || {};
    var prevDelta = session.prevDelta || {};
    var prevInput = session.prevInput || {};

    if (input.eventType === INPUT_START || prevInput.eventType === INPUT_END) {
        prevDelta = session.prevDelta = {
            x: prevInput.deltaX || 0,
            y: prevInput.deltaY || 0
        };

        offset = session.offsetDelta = {
            x: center.x,
            y: center.y
        };
    }

    input.deltaX = prevDelta.x + (center.x - offset.x);
    input.deltaY = prevDelta.y + (center.y - offset.y);
}

/**
 * velocity is calculated every x ms
 * @param {Object} session
 * @param {Object} input
 */
function computeIntervalInputData(session, input) {
    var last = session.lastInterval || input,
        deltaTime = input.timeStamp - last.timeStamp,
        velocity, velocityX, velocityY, direction;

    if (input.eventType != INPUT_CANCEL && (deltaTime > COMPUTE_INTERVAL || last.velocity === undefined)) {
        var deltaX = last.deltaX - input.deltaX;
        var deltaY = last.deltaY - input.deltaY;

        var v = getVelocity(deltaTime, deltaX, deltaY);
        velocityX = v.x;
        velocityY = v.y;
        velocity = (abs(v.x) > abs(v.y)) ? v.x : v.y;
        direction = getDirection(deltaX, deltaY);

        session.lastInterval = input;
    } else {
        // use latest velocity info if it doesn't overtake a minimum period
        velocity = last.velocity;
        velocityX = last.velocityX;
        velocityY = last.velocityY;
        direction = last.direction;
    }

    input.velocity = velocity;
    input.velocityX = velocityX;
    input.velocityY = velocityY;
    input.direction = direction;
}

/**
 * create a simple clone from the input used for storage of firstInput and firstMultiple
 * @param {Object} input
 * @returns {Object} clonedInputData
 */
function simpleCloneInputData(input) {
    // make a simple copy of the pointers because we will get a reference if we don't
    // we only need clientXY for the calculations
    var pointers = [];
    var i = 0;
    while (i < input.pointers.length) {
        pointers[i] = {
            clientX: round(input.pointers[i].clientX),
            clientY: round(input.pointers[i].clientY)
        };
        i++;
    }

    return {
        timeStamp: now(),
        pointers: pointers,
        center: getCenter(pointers),
        deltaX: input.deltaX,
        deltaY: input.deltaY
    };
}

/**
 * get the center of all the pointers
 * @param {Array} pointers
 * @return {Object} center contains `x` and `y` properties
 */
function getCenter(pointers) {
    var pointersLength = pointers.length;

    // no need to loop when only one touch
    if (pointersLength === 1) {
        return {
            x: round(pointers[0].clientX),
            y: round(pointers[0].clientY)
        };
    }

    var x = 0, y = 0, i = 0;
    while (i < pointersLength) {
        x += pointers[i].clientX;
        y += pointers[i].clientY;
        i++;
    }

    return {
        x: round(x / pointersLength),
        y: round(y / pointersLength)
    };
}

/**
 * calculate the velocity between two points. unit is in px per ms.
 * @param {Number} deltaTime
 * @param {Number} x
 * @param {Number} y
 * @return {Object} velocity `x` and `y`
 */
function getVelocity(deltaTime, x, y) {
    return {
        x: x / deltaTime || 0,
        y: y / deltaTime || 0
    };
}

/**
 * get the direction between two points
 * @param {Number} x
 * @param {Number} y
 * @return {Number} direction
 */
function getDirection(x, y) {
    if (x === y) {
        return DIRECTION_NONE;
    }

    if (abs(x) >= abs(y)) {
        return x > 0 ? DIRECTION_LEFT : DIRECTION_RIGHT;
    }
    return y > 0 ? DIRECTION_UP : DIRECTION_DOWN;
}

/**
 * calculate the absolute distance between two points
 * @param {Object} p1 {x, y}
 * @param {Object} p2 {x, y}
 * @param {Array} [props] containing x and y keys
 * @return {Number} distance
 */
function getDistance(p1, p2, props) {
    if (!props) {
        props = PROPS_XY;
    }
    var x = p2[props[0]] - p1[props[0]],
        y = p2[props[1]] - p1[props[1]];

    return Math.sqrt((x * x) + (y * y));
}

/**
 * calculate the angle between two coordinates
 * @param {Object} p1
 * @param {Object} p2
 * @param {Array} [props] containing x and y keys
 * @return {Number} angle
 */
function getAngle(p1, p2, props) {
    if (!props) {
        props = PROPS_XY;
    }
    var x = p2[props[0]] - p1[props[0]],
        y = p2[props[1]] - p1[props[1]];
    return Math.atan2(y, x) * 180 / Math.PI;
}

/**
 * calculate the rotation degrees between two pointersets
 * @param {Array} start array of pointers
 * @param {Array} end array of pointers
 * @return {Number} rotation
 */
function getRotation(start, end) {
    return getAngle(end[1], end[0], PROPS_CLIENT_XY) - getAngle(start[1], start[0], PROPS_CLIENT_XY);
}

/**
 * calculate the scale factor between two pointersets
 * no scale is 1, and goes down to 0 when pinched together, and bigger when pinched out
 * @param {Array} start array of pointers
 * @param {Array} end array of pointers
 * @return {Number} scale
 */
function getScale(start, end) {
    return getDistance(end[0], end[1], PROPS_CLIENT_XY) / getDistance(start[0], start[1], PROPS_CLIENT_XY);
}

var MOUSE_INPUT_MAP = {
    mousedown: INPUT_START,
    mousemove: INPUT_MOVE,
    mouseup: INPUT_END
};

var MOUSE_ELEMENT_EVENTS = 'mousedown';
var MOUSE_WINDOW_EVENTS = 'mousemove mouseup';

/**
 * Mouse events input
 * @constructor
 * @extends Input
 */
function MouseInput() {
    this.evEl = MOUSE_ELEMENT_EVENTS;
    this.evWin = MOUSE_WINDOW_EVENTS;

    this.allow = true; // used by Input.TouchMouse to disable mouse events
    this.pressed = false; // mousedown state

    Input.apply(this, arguments);
}

inherit(MouseInput, Input, {
    /**
     * handle mouse events
     * @param {Object} ev
     */
    handler: function MEhandler(ev) {
        var eventType = MOUSE_INPUT_MAP[ev.type];

        // on start we want to have the left mouse button down
        if (eventType & INPUT_START && ev.button === 0) {
            this.pressed = true;
        }

        if (eventType & INPUT_MOVE && ev.which !== 1) {
            eventType = INPUT_END;
        }

        // mouse must be down, and mouse events are allowed (see the TouchMouse input)
        if (!this.pressed || !this.allow) {
            return;
        }

        if (eventType & INPUT_END) {
            this.pressed = false;
        }

        this.callback(this.manager, eventType, {
            pointers: [ev],
            changedPointers: [ev],
            pointerType: INPUT_TYPE_MOUSE,
            srcEvent: ev
        });
    }
});

var POINTER_INPUT_MAP = {
    pointerdown: INPUT_START,
    pointermove: INPUT_MOVE,
    pointerup: INPUT_END,
    pointercancel: INPUT_CANCEL,
    pointerout: INPUT_CANCEL
};

// in IE10 the pointer types is defined as an enum
var IE10_POINTER_TYPE_ENUM = {
    2: INPUT_TYPE_TOUCH,
    3: INPUT_TYPE_PEN,
    4: INPUT_TYPE_MOUSE,
    5: INPUT_TYPE_KINECT // see https://twitter.com/jacobrossi/status/480596438489890816
};

var POINTER_ELEMENT_EVENTS = 'pointerdown';
var POINTER_WINDOW_EVENTS = 'pointermove pointerup pointercancel';

// IE10 has prefixed support, and case-sensitive
if (window.MSPointerEvent) {
    POINTER_ELEMENT_EVENTS = 'MSPointerDown';
    POINTER_WINDOW_EVENTS = 'MSPointerMove MSPointerUp MSPointerCancel';
}

/**
 * Pointer events input
 * @constructor
 * @extends Input
 */
function PointerEventInput() {
    this.evEl = POINTER_ELEMENT_EVENTS;
    this.evWin = POINTER_WINDOW_EVENTS;

    Input.apply(this, arguments);

    this.store = (this.manager.session.pointerEvents = []);
}

inherit(PointerEventInput, Input, {
    /**
     * handle mouse events
     * @param {Object} ev
     */
    handler: function PEhandler(ev) {
        var store = this.store;
        var removePointer = false;

        var eventTypeNormalized = ev.type.toLowerCase().replace('ms', '');
        var eventType = POINTER_INPUT_MAP[eventTypeNormalized];
        var pointerType = IE10_POINTER_TYPE_ENUM[ev.pointerType] || ev.pointerType;

        var isTouch = (pointerType == INPUT_TYPE_TOUCH);

        // get index of the event in the store
        var storeIndex = inArray(store, ev.pointerId, 'pointerId');

        // start and mouse must be down
        if (eventType & INPUT_START && (ev.button === 0 || isTouch)) {
            if (storeIndex < 0) {
                store.push(ev);
                storeIndex = store.length - 1;
            }
        } else if (eventType & (INPUT_END | INPUT_CANCEL)) {
            removePointer = true;
        }

        // it not found, so the pointer hasn't been down (so it's probably a hover)
        if (storeIndex < 0) {
            return;
        }

        // update the event in the store
        store[storeIndex] = ev;

        this.callback(this.manager, eventType, {
            pointers: store,
            changedPointers: [ev],
            pointerType: pointerType,
            srcEvent: ev
        });

        if (removePointer) {
            // remove from the store
            store.splice(storeIndex, 1);
        }
    }
});

var SINGLE_TOUCH_INPUT_MAP = {
    touchstart: INPUT_START,
    touchmove: INPUT_MOVE,
    touchend: INPUT_END,
    touchcancel: INPUT_CANCEL
};

var SINGLE_TOUCH_TARGET_EVENTS = 'touchstart';
var SINGLE_TOUCH_WINDOW_EVENTS = 'touchstart touchmove touchend touchcancel';

/**
 * Touch events input
 * @constructor
 * @extends Input
 */
function SingleTouchInput() {
    this.evTarget = SINGLE_TOUCH_TARGET_EVENTS;
    this.evWin = SINGLE_TOUCH_WINDOW_EVENTS;
    this.started = false;

    Input.apply(this, arguments);
}

inherit(SingleTouchInput, Input, {
    handler: function TEhandler(ev) {
        var type = SINGLE_TOUCH_INPUT_MAP[ev.type];

        // should we handle the touch events?
        if (type === INPUT_START) {
            this.started = true;
        }

        if (!this.started) {
            return;
        }

        var touches = normalizeSingleTouches.call(this, ev, type);

        // when done, reset the started state
        if (type & (INPUT_END | INPUT_CANCEL) && touches[0].length - touches[1].length === 0) {
            this.started = false;
        }

        this.callback(this.manager, type, {
            pointers: touches[0],
            changedPointers: touches[1],
            pointerType: INPUT_TYPE_TOUCH,
            srcEvent: ev
        });
    }
});

/**
 * @this {TouchInput}
 * @param {Object} ev
 * @param {Number} type flag
 * @returns {undefined|Array} [all, changed]
 */
function normalizeSingleTouches(ev, type) {
    var all = toArray(ev.touches);
    var changed = toArray(ev.changedTouches);

    if (type & (INPUT_END | INPUT_CANCEL)) {
        all = uniqueArray(all.concat(changed), 'identifier', true);
    }

    return [all, changed];
}

var TOUCH_INPUT_MAP = {
    touchstart: INPUT_START,
    touchmove: INPUT_MOVE,
    touchend: INPUT_END,
    touchcancel: INPUT_CANCEL
};

var TOUCH_TARGET_EVENTS = 'touchstart touchmove touchend touchcancel';

/**
 * Multi-user touch events input
 * @constructor
 * @extends Input
 */
function TouchInput() {
    this.evTarget = TOUCH_TARGET_EVENTS;
    this.targetIds = {};

    Input.apply(this, arguments);
}

inherit(TouchInput, Input, {
    handler: function MTEhandler(ev) {
        var type = TOUCH_INPUT_MAP[ev.type];
        var touches = getTouches.call(this, ev, type);
        if (!touches) {
            return;
        }

        this.callback(this.manager, type, {
            pointers: touches[0],
            changedPointers: touches[1],
            pointerType: INPUT_TYPE_TOUCH,
            srcEvent: ev
        });
    }
});

/**
 * @this {TouchInput}
 * @param {Object} ev
 * @param {Number} type flag
 * @returns {undefined|Array} [all, changed]
 */
function getTouches(ev, type) {
    var allTouches = toArray(ev.touches);
    var targetIds = this.targetIds;

    // when there is only one touch, the process can be simplified
    if (type & (INPUT_START | INPUT_MOVE) && allTouches.length === 1) {
        targetIds[allTouches[0].identifier] = true;
        return [allTouches, allTouches];
    }

    var i,
        targetTouches,
        changedTouches = toArray(ev.changedTouches),
        changedTargetTouches = [],
        target = this.target;

    // get target touches from touches
    targetTouches = allTouches.filter(function(touch) {
        return hasParent(touch.target, target);
    });

    // collect touches
    if (type === INPUT_START) {
        i = 0;
        while (i < targetTouches.length) {
            targetIds[targetTouches[i].identifier] = true;
            i++;
        }
    }

    // filter changed touches to only contain touches that exist in the collected target ids
    i = 0;
    while (i < changedTouches.length) {
        if (targetIds[changedTouches[i].identifier]) {
            changedTargetTouches.push(changedTouches[i]);
        }

        // cleanup removed touches
        if (type & (INPUT_END | INPUT_CANCEL)) {
            delete targetIds[changedTouches[i].identifier];
        }
        i++;
    }

    if (!changedTargetTouches.length) {
        return;
    }

    return [
        // merge targetTouches with changedTargetTouches so it contains ALL touches, including 'end' and 'cancel'
        uniqueArray(targetTouches.concat(changedTargetTouches), 'identifier', true),
        changedTargetTouches
    ];
}

/**
 * Combined touch and mouse input
 *
 * Touch has a higher priority then mouse, and while touching no mouse events are allowed.
 * This because touch devices also emit mouse events while doing a touch.
 *
 * @constructor
 * @extends Input
 */
function TouchMouseInput() {
    Input.apply(this, arguments);

    var handler = bindFn(this.handler, this);
    this.touch = new TouchInput(this.manager, handler);
    this.mouse = new MouseInput(this.manager, handler);
}

inherit(TouchMouseInput, Input, {
    /**
     * handle mouse and touch events
     * @param {Hammer} manager
     * @param {String} inputEvent
     * @param {Object} inputData
     */
    handler: function TMEhandler(manager, inputEvent, inputData) {
        var isTouch = (inputData.pointerType == INPUT_TYPE_TOUCH),
            isMouse = (inputData.pointerType == INPUT_TYPE_MOUSE);

        // when we're in a touch event, so  block all upcoming mouse events
        // most mobile browser also emit mouseevents, right after touchstart
        if (isTouch) {
            this.mouse.allow = false;
        } else if (isMouse && !this.mouse.allow) {
            return;
        }

        // reset the allowMouse when we're done
        if (inputEvent & (INPUT_END | INPUT_CANCEL)) {
            this.mouse.allow = true;
        }

        this.callback(manager, inputEvent, inputData);
    },

    /**
     * remove the event listeners
     */
    destroy: function destroy() {
        this.touch.destroy();
        this.mouse.destroy();
    }
});

var PREFIXED_TOUCH_ACTION = prefixed(TEST_ELEMENT.style, 'touchAction');
var NATIVE_TOUCH_ACTION = PREFIXED_TOUCH_ACTION !== undefined;

// magical touchAction value
var TOUCH_ACTION_COMPUTE = 'compute';
var TOUCH_ACTION_AUTO = 'auto';
var TOUCH_ACTION_MANIPULATION = 'manipulation'; // not implemented
var TOUCH_ACTION_NONE = 'none';
var TOUCH_ACTION_PAN_X = 'pan-x';
var TOUCH_ACTION_PAN_Y = 'pan-y';

/**
 * Touch Action
 * sets the touchAction property or uses the js alternative
 * @param {Manager} manager
 * @param {String} value
 * @constructor
 */
function TouchAction(manager, value) {
    this.manager = manager;
    this.set(value);
}

TouchAction.prototype = {
    /**
     * set the touchAction value on the element or enable the polyfill
     * @param {String} value
     */
    set: function(value) {
        // find out the touch-action by the event handlers
        if (value == TOUCH_ACTION_COMPUTE) {
            value = this.compute();
        }

        if (NATIVE_TOUCH_ACTION) {
            this.manager.element.style[PREFIXED_TOUCH_ACTION] = value;
        }
        this.actions = value.toLowerCase().trim();
    },

    /**
     * just re-set the touchAction value
     */
    update: function() {
        this.set(this.manager.options.touchAction);
    },

    /**
     * compute the value for the touchAction property based on the recognizer's settings
     * @returns {String} value
     */
    compute: function() {
        var actions = [];
        each(this.manager.recognizers, function(recognizer) {
            if (boolOrFn(recognizer.options.enable, [recognizer])) {
                actions = actions.concat(recognizer.getTouchAction());
            }
        });
        return cleanTouchActions(actions.join(' '));
    },

    /**
     * this method is called on each input cycle and provides the preventing of the browser behavior
     * @param {Object} input
     */
    preventDefaults: function(input) {
        // not needed with native support for the touchAction property
        if (NATIVE_TOUCH_ACTION) {
            return;
        }

        var srcEvent = input.srcEvent;
        var direction = input.offsetDirection;

        // if the touch action did prevented once this session
        if (this.manager.session.prevented) {
            srcEvent.preventDefault();
            return;
        }

        var actions = this.actions;
        var hasNone = inStr(actions, TOUCH_ACTION_NONE);
        var hasPanY = inStr(actions, TOUCH_ACTION_PAN_Y);
        var hasPanX = inStr(actions, TOUCH_ACTION_PAN_X);

        if (hasNone ||
            (hasPanY && direction & DIRECTION_HORIZONTAL) ||
            (hasPanX && direction & DIRECTION_VERTICAL)) {
            return this.preventSrc(srcEvent);
        }
    },

    /**
     * call preventDefault to prevent the browser's default behavior (scrolling in most cases)
     * @param {Object} srcEvent
     */
    preventSrc: function(srcEvent) {
        this.manager.session.prevented = true;
        srcEvent.preventDefault();
    }
};

/**
 * when the touchActions are collected they are not a valid value, so we need to clean things up. *
 * @param {String} actions
 * @returns {*}
 */
function cleanTouchActions(actions) {
    // none
    if (inStr(actions, TOUCH_ACTION_NONE)) {
        return TOUCH_ACTION_NONE;
    }

    var hasPanX = inStr(actions, TOUCH_ACTION_PAN_X);
    var hasPanY = inStr(actions, TOUCH_ACTION_PAN_Y);

    // pan-x and pan-y can be combined
    if (hasPanX && hasPanY) {
        return TOUCH_ACTION_PAN_X + ' ' + TOUCH_ACTION_PAN_Y;
    }

    // pan-x OR pan-y
    if (hasPanX || hasPanY) {
        return hasPanX ? TOUCH_ACTION_PAN_X : TOUCH_ACTION_PAN_Y;
    }

    // manipulation
    if (inStr(actions, TOUCH_ACTION_MANIPULATION)) {
        return TOUCH_ACTION_MANIPULATION;
    }

    return TOUCH_ACTION_AUTO;
}

/**
 * Recognizer flow explained; *
 * All recognizers have the initial state of POSSIBLE when a input session starts.
 * The definition of a input session is from the first input until the last input, with all it's movement in it. *
 * Example session for mouse-input: mousedown -> mousemove -> mouseup
 *
 * On each recognizing cycle (see Manager.recognize) the .recognize() method is executed
 * which determines with state it should be.
 *
 * If the recognizer has the state FAILED, CANCELLED or RECOGNIZED (equals ENDED), it is reset to
 * POSSIBLE to give it another change on the next cycle.
 *
 *               Possible
 *                  |
 *            +-----+---------------+
 *            |                     |
 *      +-----+-----+               |
 *      |           |               |
 *   Failed      Cancelled          |
 *                          +-------+------+
 *                          |              |
 *                      Recognized       Began
 *                                         |
 *                                      Changed
 *                                         |
 *                                  Ended/Recognized
 */
var STATE_POSSIBLE = 1;
var STATE_BEGAN = 2;
var STATE_CHANGED = 4;
var STATE_ENDED = 8;
var STATE_RECOGNIZED = STATE_ENDED;
var STATE_CANCELLED = 16;
var STATE_FAILED = 32;

/**
 * Recognizer
 * Every recognizer needs to extend from this class.
 * @constructor
 * @param {Object} options
 */
function Recognizer(options) {
    this.id = uniqueId();

    this.manager = null;
    this.options = merge(options || {}, this.defaults);

    // default is enable true
    this.options.enable = ifUndefined(this.options.enable, true);

    this.state = STATE_POSSIBLE;

    this.simultaneous = {};
    this.requireFail = [];
}

Recognizer.prototype = {
    /**
     * @virtual
     * @type {Object}
     */
    defaults: {},

    /**
     * set options
     * @param {Object} options
     * @return {Recognizer}
     */
    set: function(options) {
        extend(this.options, options);

        // also update the touchAction, in case something changed about the directions/enabled state
        this.manager && this.manager.touchAction.update();
        return this;
    },

    /**
     * recognize simultaneous with an other recognizer.
     * @param {Recognizer} otherRecognizer
     * @returns {Recognizer} this
     */
    recognizeWith: function(otherRecognizer) {
        if (invokeArrayArg(otherRecognizer, 'recognizeWith', this)) {
            return this;
        }

        var simultaneous = this.simultaneous;
        otherRecognizer = getRecognizerByNameIfManager(otherRecognizer, this);
        if (!simultaneous[otherRecognizer.id]) {
            simultaneous[otherRecognizer.id] = otherRecognizer;
            otherRecognizer.recognizeWith(this);
        }
        return this;
    },

    /**
     * drop the simultaneous link. it doesnt remove the link on the other recognizer.
     * @param {Recognizer} otherRecognizer
     * @returns {Recognizer} this
     */
    dropRecognizeWith: function(otherRecognizer) {
        if (invokeArrayArg(otherRecognizer, 'dropRecognizeWith', this)) {
            return this;
        }

        otherRecognizer = getRecognizerByNameIfManager(otherRecognizer, this);
        delete this.simultaneous[otherRecognizer.id];
        return this;
    },

    /**
     * recognizer can only run when an other is failing
     * @param {Recognizer} otherRecognizer
     * @returns {Recognizer} this
     */
    requireFailure: function(otherRecognizer) {
        if (invokeArrayArg(otherRecognizer, 'requireFailure', this)) {
            return this;
        }

        var requireFail = this.requireFail;
        otherRecognizer = getRecognizerByNameIfManager(otherRecognizer, this);
        if (inArray(requireFail, otherRecognizer) === -1) {
            requireFail.push(otherRecognizer);
            otherRecognizer.requireFailure(this);
        }
        return this;
    },

    /**
     * drop the requireFailure link. it does not remove the link on the other recognizer.
     * @param {Recognizer} otherRecognizer
     * @returns {Recognizer} this
     */
    dropRequireFailure: function(otherRecognizer) {
        if (invokeArrayArg(otherRecognizer, 'dropRequireFailure', this)) {
            return this;
        }

        otherRecognizer = getRecognizerByNameIfManager(otherRecognizer, this);
        var index = inArray(this.requireFail, otherRecognizer);
        if (index > -1) {
            this.requireFail.splice(index, 1);
        }
        return this;
    },

    /**
     * has require failures boolean
     * @returns {boolean}
     */
    hasRequireFailures: function() {
        return this.requireFail.length > 0;
    },

    /**
     * if the recognizer can recognize simultaneous with an other recognizer
     * @param {Recognizer} otherRecognizer
     * @returns {Boolean}
     */
    canRecognizeWith: function(otherRecognizer) {
        return !!this.simultaneous[otherRecognizer.id];
    },

    /**
     * You should use `tryEmit` instead of `emit` directly to check
     * that all the needed recognizers has failed before emitting.
     * @param {Object} input
     */
    emit: function(input) {
        var self = this;
        var state = this.state;

        function emit(withState) {
            self.manager.emit(self.options.event + (withState ? stateStr(state) : ''), input);
        }

        // 'panstart' and 'panmove'
        if (state < STATE_ENDED) {
            emit(true);
        }

        emit(); // simple 'eventName' events

        // panend and pancancel
        if (state >= STATE_ENDED) {
            emit(true);
        }
    },

    /**
     * Check that all the require failure recognizers has failed,
     * if true, it emits a gesture event,
     * otherwise, setup the state to FAILED.
     * @param {Object} input
     */
    tryEmit: function(input) {
        if (this.canEmit()) {
            return this.emit(input);
        }
        // it's failing anyway
        this.state = STATE_FAILED;
    },

    /**
     * can we emit?
     * @returns {boolean}
     */
    canEmit: function() {
        var i = 0;
        while (i < this.requireFail.length) {
            if (!(this.requireFail[i].state & (STATE_FAILED | STATE_POSSIBLE))) {
                return false;
            }
            i++;
        }
        return true;
    },

    /**
     * update the recognizer
     * @param {Object} inputData
     */
    recognize: function(inputData) {
        // make a new copy of the inputData
        // so we can change the inputData without messing up the other recognizers
        var inputDataClone = extend({}, inputData);

        // is is enabled and allow recognizing?
        if (!boolOrFn(this.options.enable, [this, inputDataClone])) {
            this.reset();
            this.state = STATE_FAILED;
            return;
        }

        // reset when we've reached the end
        if (this.state & (STATE_RECOGNIZED | STATE_CANCELLED | STATE_FAILED)) {
            this.state = STATE_POSSIBLE;
        }

        this.state = this.process(inputDataClone);

        // the recognizer has recognized a gesture
        // so trigger an event
        if (this.state & (STATE_BEGAN | STATE_CHANGED | STATE_ENDED | STATE_CANCELLED)) {
            this.tryEmit(inputDataClone);
        }
    },

    /**
     * return the state of the recognizer
     * the actual recognizing happens in this method
     * @virtual
     * @param {Object} inputData
     * @returns {Const} STATE
     */
    process: function(inputData) { }, // jshint ignore:line

    /**
     * return the preferred touch-action
     * @virtual
     * @returns {Array}
     */
    getTouchAction: function() { },

    /**
     * called when the gesture isn't allowed to recognize
     * like when another is being recognized or it is disabled
     * @virtual
     */
    reset: function() { }
};

/**
 * get a usable string, used as event postfix
 * @param {Const} state
 * @returns {String} state
 */
function stateStr(state) {
    if (state & STATE_CANCELLED) {
        return 'cancel';
    } else if (state & STATE_ENDED) {
        return 'end';
    } else if (state & STATE_CHANGED) {
        return 'move';
    } else if (state & STATE_BEGAN) {
        return 'start';
    }
    return '';
}

/**
 * direction cons to string
 * @param {Const} direction
 * @returns {String}
 */
function directionStr(direction) {
    if (direction == DIRECTION_DOWN) {
        return 'down';
    } else if (direction == DIRECTION_UP) {
        return 'up';
    } else if (direction == DIRECTION_LEFT) {
        return 'left';
    } else if (direction == DIRECTION_RIGHT) {
        return 'right';
    }
    return '';
}

/**
 * get a recognizer by name if it is bound to a manager
 * @param {Recognizer|String} otherRecognizer
 * @param {Recognizer} recognizer
 * @returns {Recognizer}
 */
function getRecognizerByNameIfManager(otherRecognizer, recognizer) {
    var manager = recognizer.manager;
    if (manager) {
        return manager.get(otherRecognizer);
    }
    return otherRecognizer;
}

/**
 * This recognizer is just used as a base for the simple attribute recognizers.
 * @constructor
 * @extends Recognizer
 */
function AttrRecognizer() {
    Recognizer.apply(this, arguments);
}

inherit(AttrRecognizer, Recognizer, {
    /**
     * @namespace
     * @memberof AttrRecognizer
     */
    defaults: {
        /**
         * @type {Number}
         * @default 1
         */
        pointers: 1
    },

    /**
     * Used to check if it the recognizer receives valid input, like input.distance > 10.
     * @memberof AttrRecognizer
     * @param {Object} input
     * @returns {Boolean} recognized
     */
    attrTest: function(input) {
        var optionPointers = this.options.pointers;
        return optionPointers === 0 || input.pointers.length === optionPointers;
    },

    /**
     * Process the input and return the state for the recognizer
     * @memberof AttrRecognizer
     * @param {Object} input
     * @returns {*} State
     */
    process: function(input) {
        var state = this.state;
        var eventType = input.eventType;

        var isRecognized = state & (STATE_BEGAN | STATE_CHANGED);
        var isValid = this.attrTest(input);

        // on cancel input and we've recognized before, return STATE_CANCELLED
        if (isRecognized && (eventType & INPUT_CANCEL || !isValid)) {
            return state | STATE_CANCELLED;
        } else if (isRecognized || isValid) {
            if (eventType & INPUT_END) {
                return state | STATE_ENDED;
            } else if (!(state & STATE_BEGAN)) {
                return STATE_BEGAN;
            }
            return state | STATE_CHANGED;
        }
        return STATE_FAILED;
    }
});

/**
 * Pan
 * Recognized when the pointer is down and moved in the allowed direction.
 * @constructor
 * @extends AttrRecognizer
 */
function PanRecognizer() {
    AttrRecognizer.apply(this, arguments);

    this.pX = null;
    this.pY = null;
}

inherit(PanRecognizer, AttrRecognizer, {
    /**
     * @namespace
     * @memberof PanRecognizer
     */
    defaults: {
        event: 'pan',
        threshold: 10,
        pointers: 1,
        direction: DIRECTION_ALL
    },

    getTouchAction: function() {
        var direction = this.options.direction;
        var actions = [];
        if (direction & DIRECTION_HORIZONTAL) {
            actions.push(TOUCH_ACTION_PAN_Y);
        }
        if (direction & DIRECTION_VERTICAL) {
            actions.push(TOUCH_ACTION_PAN_X);
        }
        return actions;
    },

    directionTest: function(input) {
        var options = this.options;
        var hasMoved = true;
        var distance = input.distance;
        var direction = input.direction;
        var x = input.deltaX;
        var y = input.deltaY;

        // lock to axis?
        if (!(direction & options.direction)) {
            if (options.direction & DIRECTION_HORIZONTAL) {
                direction = (x === 0) ? DIRECTION_NONE : (x < 0) ? DIRECTION_LEFT : DIRECTION_RIGHT;
                hasMoved = x != this.pX;
                distance = Math.abs(input.deltaX);
            } else {
                direction = (y === 0) ? DIRECTION_NONE : (y < 0) ? DIRECTION_UP : DIRECTION_DOWN;
                hasMoved = y != this.pY;
                distance = Math.abs(input.deltaY);
            }
        }
        input.direction = direction;
        return hasMoved && distance > options.threshold && direction & options.direction;
    },

    attrTest: function(input) {
        return AttrRecognizer.prototype.attrTest.call(this, input) &&
            (this.state & STATE_BEGAN || (!(this.state & STATE_BEGAN) && this.directionTest(input)));
    },

    emit: function(input) {
        this.pX = input.deltaX;
        this.pY = input.deltaY;

        var direction = directionStr(input.direction);
        if (direction) {
            this.manager.emit(this.options.event + direction, input);
        }

        this._super.emit.call(this, input);
    }
});

/**
 * Pinch
 * Recognized when two or more pointers are moving toward (zoom-in) or away from each other (zoom-out).
 * @constructor
 * @extends AttrRecognizer
 */
function PinchRecognizer() {
    AttrRecognizer.apply(this, arguments);
}

inherit(PinchRecognizer, AttrRecognizer, {
    /**
     * @namespace
     * @memberof PinchRecognizer
     */
    defaults: {
        event: 'pinch',
        threshold: 0,
        pointers: 2
    },

    getTouchAction: function() {
        return [TOUCH_ACTION_NONE];
    },

    attrTest: function(input) {
        return this._super.attrTest.call(this, input) &&
            (Math.abs(input.scale - 1) > this.options.threshold || this.state & STATE_BEGAN);
    },

    emit: function(input) {
        this._super.emit.call(this, input);
        if (input.scale !== 1) {
            var inOut = input.scale < 1 ? 'in' : 'out';
            this.manager.emit(this.options.event + inOut, input);
        }
    }
});

/**
 * Press
 * Recognized when the pointer is down for x ms without any movement.
 * @constructor
 * @extends Recognizer
 */
function PressRecognizer() {
    Recognizer.apply(this, arguments);

    this._timer = null;
    this._input = null;
}

inherit(PressRecognizer, Recognizer, {
    /**
     * @namespace
     * @memberof PressRecognizer
     */
    defaults: {
        event: 'press',
        pointers: 1,
        time: 500, // minimal time of the pointer to be pressed
        threshold: 5 // a minimal movement is ok, but keep it low
    },

    getTouchAction: function() {
        return [TOUCH_ACTION_AUTO];
    },

    process: function(input) {
        var options = this.options;
        var validPointers = input.pointers.length === options.pointers;
        var validMovement = input.distance < options.threshold;
        var validTime = input.deltaTime > options.time;

        this._input = input;

        // we only allow little movement
        // and we've reached an end event, so a tap is possible
        if (!validMovement || !validPointers || (input.eventType & (INPUT_END | INPUT_CANCEL) && !validTime)) {
            this.reset();
        } else if (input.eventType & INPUT_START) {
            this.reset();
            this._timer = setTimeoutContext(function() {
                this.state = STATE_RECOGNIZED;
                this.tryEmit();
            }, options.time, this);
        } else if (input.eventType & INPUT_END) {
            return STATE_RECOGNIZED;
        }
        return STATE_FAILED;
    },

    reset: function() {
        clearTimeout(this._timer);
    },

    emit: function(input) {
        if (this.state !== STATE_RECOGNIZED) {
            return;
        }

        if (input && (input.eventType & INPUT_END)) {
            this.manager.emit(this.options.event + 'up', input);
        } else {
            this._input.timeStamp = now();
            this.manager.emit(this.options.event, this._input);
        }
    }
});

/**
 * Rotate
 * Recognized when two or more pointer are moving in a circular motion.
 * @constructor
 * @extends AttrRecognizer
 */
function RotateRecognizer() {
    AttrRecognizer.apply(this, arguments);
}

inherit(RotateRecognizer, AttrRecognizer, {
    /**
     * @namespace
     * @memberof RotateRecognizer
     */
    defaults: {
        event: 'rotate',
        threshold: 0,
        pointers: 2
    },

    getTouchAction: function() {
        return [TOUCH_ACTION_NONE];
    },

    attrTest: function(input) {
        return this._super.attrTest.call(this, input) &&
            (Math.abs(input.rotation) > this.options.threshold || this.state & STATE_BEGAN);
    }
});

/**
 * Swipe
 * Recognized when the pointer is moving fast (velocity), with enough distance in the allowed direction.
 * @constructor
 * @extends AttrRecognizer
 */
function SwipeRecognizer() {
    AttrRecognizer.apply(this, arguments);
}

inherit(SwipeRecognizer, AttrRecognizer, {
    /**
     * @namespace
     * @memberof SwipeRecognizer
     */
    defaults: {
        event: 'swipe',
        threshold: 10,
        velocity: 0.65,
        direction: DIRECTION_HORIZONTAL | DIRECTION_VERTICAL,
        pointers: 1
    },

    getTouchAction: function() {
        return PanRecognizer.prototype.getTouchAction.call(this);
    },

    attrTest: function(input) {
        var direction = this.options.direction;
        var velocity;

        if (direction & (DIRECTION_HORIZONTAL | DIRECTION_VERTICAL)) {
            velocity = input.velocity;
        } else if (direction & DIRECTION_HORIZONTAL) {
            velocity = input.velocityX;
        } else if (direction & DIRECTION_VERTICAL) {
            velocity = input.velocityY;
        }

        return this._super.attrTest.call(this, input) &&
            direction & input.direction &&
            input.distance > this.options.threshold &&
            abs(velocity) > this.options.velocity && input.eventType & INPUT_END;
    },

    emit: function(input) {
        var direction = directionStr(input.direction);
        if (direction) {
            this.manager.emit(this.options.event + direction, input);
        }

        this.manager.emit(this.options.event, input);
    }
});

/**
 * A tap is ecognized when the pointer is doing a small tap/click. Multiple taps are recognized if they occur
 * between the given interval and position. The delay option can be used to recognize multi-taps without firing
 * a single tap.
 *
 * The eventData from the emitted event contains the property `tapCount`, which contains the amount of
 * multi-taps being recognized.
 * @constructor
 * @extends Recognizer
 */
function TapRecognizer() {
    Recognizer.apply(this, arguments);

    // previous time and center,
    // used for tap counting
    this.pTime = false;
    this.pCenter = false;

    this._timer = null;
    this._input = null;
    this.count = 0;
}

inherit(TapRecognizer, Recognizer, {
    /**
     * @namespace
     * @memberof PinchRecognizer
     */
    defaults: {
        event: 'tap',
        pointers: 1,
        taps: 1,
        interval: 300, // max time between the multi-tap taps
        time: 250, // max time of the pointer to be down (like finger on the screen)
        threshold: 2, // a minimal movement is ok, but keep it low
        posThreshold: 10 // a multi-tap can be a bit off the initial position
    },

    getTouchAction: function() {
        return [TOUCH_ACTION_MANIPULATION];
    },

    process: function(input) {
        var options = this.options;

        var validPointers = input.pointers.length === options.pointers;
        var validMovement = input.distance < options.threshold;
        var validTouchTime = input.deltaTime < options.time;

        this.reset();

        if ((input.eventType & INPUT_START) && (this.count === 0)) {
            return this.failTimeout();
        }

        // we only allow little movement
        // and we've reached an end event, so a tap is possible
        if (validMovement && validTouchTime && validPointers) {
            if (input.eventType != INPUT_END) {
                return this.failTimeout();
            }

            var validInterval = this.pTime ? (input.timeStamp - this.pTime < options.interval) : true;
            var validMultiTap = !this.pCenter || getDistance(this.pCenter, input.center) < options.posThreshold;

            this.pTime = input.timeStamp;
            this.pCenter = input.center;

            if (!validMultiTap || !validInterval) {
                this.count = 1;
            } else {
                this.count += 1;
            }

            this._input = input;

            // if tap count matches we have recognized it,
            // else it has began recognizing...
            var tapCount = this.count % options.taps;
            if (tapCount === 0) {
                // no failing requirements, immediately trigger the tap event
                // or wait as long as the multitap interval to trigger
                if (!this.hasRequireFailures()) {
                    return STATE_RECOGNIZED;
                } else {
                    this._timer = setTimeoutContext(function() {
                        this.state = STATE_RECOGNIZED;
                        this.tryEmit();
                    }, options.interval, this);
                    return STATE_BEGAN;
                }
            }
        }
        return STATE_FAILED;
    },

    failTimeout: function() {
        this._timer = setTimeoutContext(function() {
            this.state = STATE_FAILED;
        }, this.options.interval, this);
        return STATE_FAILED;
    },

    reset: function() {
        clearTimeout(this._timer);
    },

    emit: function() {
        if (this.state == STATE_RECOGNIZED ) {
            this._input.tapCount = this.count;
            this.manager.emit(this.options.event, this._input);
        }
    }
});

/**
 * Simple way to create an manager with a default set of recognizers.
 * @param {HTMLElement} element
 * @param {Object} [options]
 * @constructor
 */
function Hammer(element, options) {
    options = options || {};
    options.recognizers = ifUndefined(options.recognizers, Hammer.defaults.preset);
    return new Manager(element, options);
}

/**
 * @const {string}
 */
Hammer.VERSION = '2.0.4';

/**
 * default settings
 * @namespace
 */
Hammer.defaults = {
    /**
     * set if DOM events are being triggered.
     * But this is slower and unused by simple implementations, so disabled by default.
     * @type {Boolean}
     * @default false
     */
    domEvents: false,

    /**
     * The value for the touchAction property/fallback.
     * When set to `compute` it will magically set the correct value based on the added recognizers.
     * @type {String}
     * @default compute
     */
    touchAction: TOUCH_ACTION_COMPUTE,

    /**
     * @type {Boolean}
     * @default true
     */
    enable: true,

    /**
     * EXPERIMENTAL FEATURE -- can be removed/changed
     * Change the parent input target element.
     * If Null, then it is being set the to main element.
     * @type {Null|EventTarget}
     * @default null
     */
    inputTarget: null,

    /**
     * force an input class
     * @type {Null|Function}
     * @default null
     */
    inputClass: null,

    /**
     * Default recognizer setup when calling `Hammer()`
     * When creating a new Manager these will be skipped.
     * @type {Array}
     */
    preset: [
        // RecognizerClass, options, [recognizeWith, ...], [requireFailure, ...]
        [RotateRecognizer, { enable: false }],
        [PinchRecognizer, { enable: false }, ['rotate']],
        [SwipeRecognizer,{ direction: DIRECTION_HORIZONTAL }],
        [PanRecognizer, { direction: DIRECTION_HORIZONTAL }, ['swipe']],
        [TapRecognizer],
        [TapRecognizer, { event: 'doubletap', taps: 2 }, ['tap']],
        [PressRecognizer]
    ],

    /**
     * Some CSS properties can be used to improve the working of Hammer.
     * Add them to this method and they will be set when creating a new Manager.
     * @namespace
     */
    cssProps: {
        /**
         * Disables text selection to improve the dragging gesture. Mainly for desktop browsers.
         * @type {String}
         * @default 'none'
         */
        userSelect: 'none',

        /**
         * Disable the Windows Phone grippers when pressing an element.
         * @type {String}
         * @default 'none'
         */
        touchSelect: 'none',

        /**
         * Disables the default callout shown when you touch and hold a touch target.
         * On iOS, when you touch and hold a touch target such as a link, Safari displays
         * a callout containing information about the link. This property allows you to disable that callout.
         * @type {String}
         * @default 'none'
         */
        touchCallout: 'none',

        /**
         * Specifies whether zooming is enabled. Used by IE10>
         * @type {String}
         * @default 'none'
         */
        contentZooming: 'none',

        /**
         * Specifies that an entire element should be draggable instead of its contents. Mainly for desktop browsers.
         * @type {String}
         * @default 'none'
         */
        userDrag: 'none',

        /**
         * Overrides the highlight color shown when the user taps a link or a JavaScript
         * clickable element in iOS. This property obeys the alpha value, if specified.
         * @type {String}
         * @default 'rgba(0,0,0,0)'
         */
        tapHighlightColor: 'rgba(0,0,0,0)'
    }
};

var STOP = 1;
var FORCED_STOP = 2;

/**
 * Manager
 * @param {HTMLElement} element
 * @param {Object} [options]
 * @constructor
 */
function Manager(element, options) {
    options = options || {};

    this.options = merge(options, Hammer.defaults);
    this.options.inputTarget = this.options.inputTarget || element;

    this.handlers = {};
    this.session = {};
    this.recognizers = [];

    this.element = element;
    this.input = createInputInstance(this);
    this.touchAction = new TouchAction(this, this.options.touchAction);

    toggleCssProps(this, true);

    each(options.recognizers, function(item) {
        var recognizer = this.add(new (item[0])(item[1]));
        item[2] && recognizer.recognizeWith(item[2]);
        item[3] && recognizer.requireFailure(item[3]);
    }, this);
}

Manager.prototype = {
    /**
     * set options
     * @param {Object} options
     * @returns {Manager}
     */
    set: function(options) {
        extend(this.options, options);

        // Options that need a little more setup
        if (options.touchAction) {
            this.touchAction.update();
        }
        if (options.inputTarget) {
            // Clean up existing event listeners and reinitialize
            this.input.destroy();
            this.input.target = options.inputTarget;
            this.input.init();
        }
        return this;
    },

    /**
     * stop recognizing for this session.
     * This session will be discarded, when a new [input]start event is fired.
     * When forced, the recognizer cycle is stopped immediately.
     * @param {Boolean} [force]
     */
    stop: function(force) {
        this.session.stopped = force ? FORCED_STOP : STOP;
    },

    /**
     * run the recognizers!
     * called by the inputHandler function on every movement of the pointers (touches)
     * it walks through all the recognizers and tries to detect the gesture that is being made
     * @param {Object} inputData
     */
    recognize: function(inputData) {
        var session = this.session;
        if (session.stopped) {
            return;
        }

        // run the touch-action polyfill
        this.touchAction.preventDefaults(inputData);

        var recognizer;
        var recognizers = this.recognizers;

        // this holds the recognizer that is being recognized.
        // so the recognizer's state needs to be BEGAN, CHANGED, ENDED or RECOGNIZED
        // if no recognizer is detecting a thing, it is set to `null`
        var curRecognizer = session.curRecognizer;

        // reset when the last recognizer is recognized
        // or when we're in a new session
        if (!curRecognizer || (curRecognizer && curRecognizer.state & STATE_RECOGNIZED)) {
            curRecognizer = session.curRecognizer = null;
        }

        var i = 0;
        while (i < recognizers.length) {
            recognizer = recognizers[i];

            // find out if we are allowed try to recognize the input for this one.
            // 1.   allow if the session is NOT forced stopped (see the .stop() method)
            // 2.   allow if we still haven't recognized a gesture in this session, or the this recognizer is the one
            //      that is being recognized.
            // 3.   allow if the recognizer is allowed to run simultaneous with the current recognized recognizer.
            //      this can be setup with the `recognizeWith()` method on the recognizer.
            if (session.stopped !== FORCED_STOP && ( // 1
                    !curRecognizer || recognizer == curRecognizer || // 2
                    recognizer.canRecognizeWith(curRecognizer))) { // 3
                recognizer.recognize(inputData);
            } else {
                recognizer.reset();
            }

            // if the recognizer has been recognizing the input as a valid gesture, we want to store this one as the
            // current active recognizer. but only if we don't already have an active recognizer
            if (!curRecognizer && recognizer.state & (STATE_BEGAN | STATE_CHANGED | STATE_ENDED)) {
                curRecognizer = session.curRecognizer = recognizer;
            }
            i++;
        }
    },

    /**
     * get a recognizer by its event name.
     * @param {Recognizer|String} recognizer
     * @returns {Recognizer|Null}
     */
    get: function(recognizer) {
        if (recognizer instanceof Recognizer) {
            return recognizer;
        }

        var recognizers = this.recognizers;
        for (var i = 0; i < recognizers.length; i++) {
            if (recognizers[i].options.event == recognizer) {
                return recognizers[i];
            }
        }
        return null;
    },

    /**
     * add a recognizer to the manager
     * existing recognizers with the same event name will be removed
     * @param {Recognizer} recognizer
     * @returns {Recognizer|Manager}
     */
    add: function(recognizer) {
        if (invokeArrayArg(recognizer, 'add', this)) {
            return this;
        }

        // remove existing
        var existing = this.get(recognizer.options.event);
        if (existing) {
            this.remove(existing);
        }

        this.recognizers.push(recognizer);
        recognizer.manager = this;

        this.touchAction.update();
        return recognizer;
    },

    /**
     * remove a recognizer by name or instance
     * @param {Recognizer|String} recognizer
     * @returns {Manager}
     */
    remove: function(recognizer) {
        if (invokeArrayArg(recognizer, 'remove', this)) {
            return this;
        }

        var recognizers = this.recognizers;
        recognizer = this.get(recognizer);
        recognizers.splice(inArray(recognizers, recognizer), 1);

        this.touchAction.update();
        return this;
    },

    /**
     * bind event
     * @param {String} events
     * @param {Function} handler
     * @returns {EventEmitter} this
     */
    on: function(events, handler) {
        var handlers = this.handlers;
        each(splitStr(events), function(event) {
            handlers[event] = handlers[event] || [];
            handlers[event].push(handler);
        });
        return this;
    },

    /**
     * unbind event, leave emit blank to remove all handlers
     * @param {String} events
     * @param {Function} [handler]
     * @returns {EventEmitter} this
     */
    off: function(events, handler) {
        var handlers = this.handlers;
        each(splitStr(events), function(event) {
            if (!handler) {
                delete handlers[event];
            } else {
                handlers[event].splice(inArray(handlers[event], handler), 1);
            }
        });
        return this;
    },

    /**
     * emit event to the listeners
     * @param {String} event
     * @param {Object} data
     */
    emit: function(event, data) {
        // we also want to trigger dom events
        if (this.options.domEvents) {
            triggerDomEvent(event, data);
        }

        // no handlers, so skip it all
        var handlers = this.handlers[event] && this.handlers[event].slice();
        if (!handlers || !handlers.length) {
            return;
        }

        data.type = event;
        data.preventDefault = function() {
            data.srcEvent.preventDefault();
        };

        var i = 0;
        while (i < handlers.length) {
            handlers[i](data);
            i++;
        }
    },

    /**
     * destroy the manager and unbinds all events
     * it doesn't unbind dom events, that is the user own responsibility
     */
    destroy: function() {
        this.element && toggleCssProps(this, false);

        this.handlers = {};
        this.session = {};
        this.input.destroy();
        this.element = null;
    }
};

/**
 * add/remove the css properties as defined in manager.options.cssProps
 * @param {Manager} manager
 * @param {Boolean} add
 */
function toggleCssProps(manager, add) {
    var element = manager.element;
    each(manager.options.cssProps, function(value, name) {
        element.style[prefixed(element.style, name)] = add ? value : '';
    });
}

/**
 * trigger dom event
 * @param {String} event
 * @param {Object} data
 */
function triggerDomEvent(event, data) {
    var gestureEvent = document.createEvent('Event');
    gestureEvent.initEvent(event, true, true);
    gestureEvent.gesture = data;
    data.target.dispatchEvent(gestureEvent);
}

extend(Hammer, {
    INPUT_START: INPUT_START,
    INPUT_MOVE: INPUT_MOVE,
    INPUT_END: INPUT_END,
    INPUT_CANCEL: INPUT_CANCEL,

    STATE_POSSIBLE: STATE_POSSIBLE,
    STATE_BEGAN: STATE_BEGAN,
    STATE_CHANGED: STATE_CHANGED,
    STATE_ENDED: STATE_ENDED,
    STATE_RECOGNIZED: STATE_RECOGNIZED,
    STATE_CANCELLED: STATE_CANCELLED,
    STATE_FAILED: STATE_FAILED,

    DIRECTION_NONE: DIRECTION_NONE,
    DIRECTION_LEFT: DIRECTION_LEFT,
    DIRECTION_RIGHT: DIRECTION_RIGHT,
    DIRECTION_UP: DIRECTION_UP,
    DIRECTION_DOWN: DIRECTION_DOWN,
    DIRECTION_HORIZONTAL: DIRECTION_HORIZONTAL,
    DIRECTION_VERTICAL: DIRECTION_VERTICAL,
    DIRECTION_ALL: DIRECTION_ALL,

    Manager: Manager,
    Input: Input,
    TouchAction: TouchAction,

    TouchInput: TouchInput,
    MouseInput: MouseInput,
    PointerEventInput: PointerEventInput,
    TouchMouseInput: TouchMouseInput,
    SingleTouchInput: SingleTouchInput,

    Recognizer: Recognizer,
    AttrRecognizer: AttrRecognizer,
    Tap: TapRecognizer,
    Pan: PanRecognizer,
    Swipe: SwipeRecognizer,
    Pinch: PinchRecognizer,
    Rotate: RotateRecognizer,
    Press: PressRecognizer,

    on: addEventListeners,
    off: removeEventListeners,
    each: each,
    merge: merge,
    extend: extend,
    inherit: inherit,
    bindFn: bindFn,
    prefixed: prefixed
});

if (typeof define == TYPE_FUNCTION && define.amd) {
    define(function() {
        return Hammer;
    });
} else if (typeof module != 'undefined' && module.exports) {
    module.exports = Hammer;
} else {
    window[exportName] = Hammer;
}

})(window, document, 'Hammer');

},{}],"/Users/w8r/Projects/tweethistorgam/node_modules/leaflet/dist/leaflet-src.js":[function(require,module,exports){
/*
 Leaflet, a JavaScript library for mobile-friendly interactive maps. http://leafletjs.com
 (c) 2010-2013, Vladimir Agafonkin
 (c) 2010-2011, CloudMade
*/
(function (window, document, undefined) {
var oldL = window.L,
    L = {};

L.version = '0.7.2';

// define Leaflet for Node module pattern loaders, including Browserify
if (typeof module === 'object' && typeof module.exports === 'object') {
	module.exports = L;

// define Leaflet as an AMD module
} else if (typeof define === 'function' && define.amd) {
	define(L);
}

// define Leaflet as a global L variable, saving the original L to restore later if needed

L.noConflict = function () {
	window.L = oldL;
	return this;
};

window.L = L;


/*
 * L.Util contains various utility functions used throughout Leaflet code.
 */

L.Util = {
	extend: function (dest) { // (Object[, Object, ...]) ->
		var sources = Array.prototype.slice.call(arguments, 1),
		    i, j, len, src;

		for (j = 0, len = sources.length; j < len; j++) {
			src = sources[j] || {};
			for (i in src) {
				if (src.hasOwnProperty(i)) {
					dest[i] = src[i];
				}
			}
		}
		return dest;
	},

	bind: function (fn, obj) { // (Function, Object) -> Function
		var args = arguments.length > 2 ? Array.prototype.slice.call(arguments, 2) : null;
		return function () {
			return fn.apply(obj, args || arguments);
		};
	},

	stamp: (function () {
		var lastId = 0,
		    key = '_leaflet_id';
		return function (obj) {
			obj[key] = obj[key] || ++lastId;
			return obj[key];
		};
	}()),

	invokeEach: function (obj, method, context) {
		var i, args;

		if (typeof obj === 'object') {
			args = Array.prototype.slice.call(arguments, 3);

			for (i in obj) {
				method.apply(context, [i, obj[i]].concat(args));
			}
			return true;
		}

		return false;
	},

	limitExecByInterval: function (fn, time, context) {
		var lock, execOnUnlock;

		return function wrapperFn() {
			var args = arguments;

			if (lock) {
				execOnUnlock = true;
				return;
			}

			lock = true;

			setTimeout(function () {
				lock = false;

				if (execOnUnlock) {
					wrapperFn.apply(context, args);
					execOnUnlock = false;
				}
			}, time);

			fn.apply(context, args);
		};
	},

	falseFn: function () {
		return false;
	},

	formatNum: function (num, digits) {
		var pow = Math.pow(10, digits || 5);
		return Math.round(num * pow) / pow;
	},

	trim: function (str) {
		return str.trim ? str.trim() : str.replace(/^\s+|\s+$/g, '');
	},

	splitWords: function (str) {
		return L.Util.trim(str).split(/\s+/);
	},

	setOptions: function (obj, options) {
		obj.options = L.extend({}, obj.options, options);
		return obj.options;
	},

	getParamString: function (obj, existingUrl, uppercase) {
		var params = [];
		for (var i in obj) {
			params.push(encodeURIComponent(uppercase ? i.toUpperCase() : i) + '=' + encodeURIComponent(obj[i]));
		}
		return ((!existingUrl || existingUrl.indexOf('?') === -1) ? '?' : '&') + params.join('&');
	},
	template: function (str, data) {
		return str.replace(/\{ *([\w_]+) *\}/g, function (str, key) {
			var value = data[key];
			if (value === undefined) {
				throw new Error('No value provided for variable ' + str);
			} else if (typeof value === 'function') {
				value = value(data);
			}
			return value;
		});
	},

	isArray: Array.isArray || function (obj) {
		return (Object.prototype.toString.call(obj) === '[object Array]');
	},

	emptyImageUrl: 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs='
};

(function () {

	// inspired by http://paulirish.com/2011/requestanimationframe-for-smart-animating/

	function getPrefixed(name) {
		var i, fn,
		    prefixes = ['webkit', 'moz', 'o', 'ms'];

		for (i = 0; i < prefixes.length && !fn; i++) {
			fn = window[prefixes[i] + name];
		}

		return fn;
	}

	var lastTime = 0;

	function timeoutDefer(fn) {
		var time = +new Date(),
		    timeToCall = Math.max(0, 16 - (time - lastTime));

		lastTime = time + timeToCall;
		return window.setTimeout(fn, timeToCall);
	}

	var requestFn = window.requestAnimationFrame ||
	        getPrefixed('RequestAnimationFrame') || timeoutDefer;

	var cancelFn = window.cancelAnimationFrame ||
	        getPrefixed('CancelAnimationFrame') ||
	        getPrefixed('CancelRequestAnimationFrame') ||
	        function (id) { window.clearTimeout(id); };


	L.Util.requestAnimFrame = function (fn, context, immediate, element) {
		fn = L.bind(fn, context);

		if (immediate && requestFn === timeoutDefer) {
			fn();
		} else {
			return requestFn.call(window, fn, element);
		}
	};

	L.Util.cancelAnimFrame = function (id) {
		if (id) {
			cancelFn.call(window, id);
		}
	};

}());

// shortcuts for most used utility functions
L.extend = L.Util.extend;
L.bind = L.Util.bind;
L.stamp = L.Util.stamp;
L.setOptions = L.Util.setOptions;


/*
 * L.Class powers the OOP facilities of the library.
 * Thanks to John Resig and Dean Edwards for inspiration!
 */

L.Class = function () {};

L.Class.extend = function (props) {

	// extended class with the new prototype
	var NewClass = function () {

		// call the constructor
		if (this.initialize) {
			this.initialize.apply(this, arguments);
		}

		// call all constructor hooks
		if (this._initHooks) {
			this.callInitHooks();
		}
	};

	// instantiate class without calling constructor
	var F = function () {};
	F.prototype = this.prototype;

	var proto = new F();
	proto.constructor = NewClass;

	NewClass.prototype = proto;

	//inherit parent's statics
	for (var i in this) {
		if (this.hasOwnProperty(i) && i !== 'prototype') {
			NewClass[i] = this[i];
		}
	}

	// mix static properties into the class
	if (props.statics) {
		L.extend(NewClass, props.statics);
		delete props.statics;
	}

	// mix includes into the prototype
	if (props.includes) {
		L.Util.extend.apply(null, [proto].concat(props.includes));
		delete props.includes;
	}

	// merge options
	if (props.options && proto.options) {
		props.options = L.extend({}, proto.options, props.options);
	}

	// mix given properties into the prototype
	L.extend(proto, props);

	proto._initHooks = [];

	var parent = this;
	// jshint camelcase: false
	NewClass.__super__ = parent.prototype;

	// add method for calling all hooks
	proto.callInitHooks = function () {

		if (this._initHooksCalled) { return; }

		if (parent.prototype.callInitHooks) {
			parent.prototype.callInitHooks.call(this);
		}

		this._initHooksCalled = true;

		for (var i = 0, len = proto._initHooks.length; i < len; i++) {
			proto._initHooks[i].call(this);
		}
	};

	return NewClass;
};


// method for adding properties to prototype
L.Class.include = function (props) {
	L.extend(this.prototype, props);
};

// merge new default options to the Class
L.Class.mergeOptions = function (options) {
	L.extend(this.prototype.options, options);
};

// add a constructor hook
L.Class.addInitHook = function (fn) { // (Function) || (String, args...)
	var args = Array.prototype.slice.call(arguments, 1);

	var init = typeof fn === 'function' ? fn : function () {
		this[fn].apply(this, args);
	};

	this.prototype._initHooks = this.prototype._initHooks || [];
	this.prototype._initHooks.push(init);
};


/*
 * L.Mixin.Events is used to add custom events functionality to Leaflet classes.
 */

var eventsKey = '_leaflet_events';

L.Mixin = {};

L.Mixin.Events = {

	addEventListener: function (types, fn, context) { // (String, Function[, Object]) or (Object[, Object])

		// types can be a map of types/handlers
		if (L.Util.invokeEach(types, this.addEventListener, this, fn, context)) { return this; }

		var events = this[eventsKey] = this[eventsKey] || {},
		    contextId = context && context !== this && L.stamp(context),
		    i, len, event, type, indexKey, indexLenKey, typeIndex;

		// types can be a string of space-separated words
		types = L.Util.splitWords(types);

		for (i = 0, len = types.length; i < len; i++) {
			event = {
				action: fn,
				context: context || this
			};
			type = types[i];

			if (contextId) {
				// store listeners of a particular context in a separate hash (if it has an id)
				// gives a major performance boost when removing thousands of map layers

				indexKey = type + '_idx';
				indexLenKey = indexKey + '_len';

				typeIndex = events[indexKey] = events[indexKey] || {};

				if (!typeIndex[contextId]) {
					typeIndex[contextId] = [];

					// keep track of the number of keys in the index to quickly check if it's empty
					events[indexLenKey] = (events[indexLenKey] || 0) + 1;
				}

				typeIndex[contextId].push(event);


			} else {
				events[type] = events[type] || [];
				events[type].push(event);
			}
		}

		return this;
	},

	hasEventListeners: function (type) { // (String) -> Boolean
		var events = this[eventsKey];
		return !!events && ((type in events && events[type].length > 0) ||
		                    (type + '_idx' in events && events[type + '_idx_len'] > 0));
	},

	removeEventListener: function (types, fn, context) { // ([String, Function, Object]) or (Object[, Object])

		if (!this[eventsKey]) {
			return this;
		}

		if (!types) {
			return this.clearAllEventListeners();
		}

		if (L.Util.invokeEach(types, this.removeEventListener, this, fn, context)) { return this; }

		var events = this[eventsKey],
		    contextId = context && context !== this && L.stamp(context),
		    i, len, type, listeners, j, indexKey, indexLenKey, typeIndex, removed;

		types = L.Util.splitWords(types);

		for (i = 0, len = types.length; i < len; i++) {
			type = types[i];
			indexKey = type + '_idx';
			indexLenKey = indexKey + '_len';

			typeIndex = events[indexKey];

			if (!fn) {
				// clear all listeners for a type if function isn't specified
				delete events[type];
				delete events[indexKey];
				delete events[indexLenKey];

			} else {
				listeners = contextId && typeIndex ? typeIndex[contextId] : events[type];

				if (listeners) {
					for (j = listeners.length - 1; j >= 0; j--) {
						if ((listeners[j].action === fn) && (!context || (listeners[j].context === context))) {
							removed = listeners.splice(j, 1);
							// set the old action to a no-op, because it is possible
							// that the listener is being iterated over as part of a dispatch
							removed[0].action = L.Util.falseFn;
						}
					}

					if (context && typeIndex && (listeners.length === 0)) {
						delete typeIndex[contextId];
						events[indexLenKey]--;
					}
				}
			}
		}

		return this;
	},

	clearAllEventListeners: function () {
		delete this[eventsKey];
		return this;
	},

	fireEvent: function (type, data) { // (String[, Object])
		if (!this.hasEventListeners(type)) {
			return this;
		}

		var event = L.Util.extend({}, data, { type: type, target: this });

		var events = this[eventsKey],
		    listeners, i, len, typeIndex, contextId;

		if (events[type]) {
			// make sure adding/removing listeners inside other listeners won't cause infinite loop
			listeners = events[type].slice();

			for (i = 0, len = listeners.length; i < len; i++) {
				listeners[i].action.call(listeners[i].context, event);
			}
		}

		// fire event for the context-indexed listeners as well
		typeIndex = events[type + '_idx'];

		for (contextId in typeIndex) {
			listeners = typeIndex[contextId].slice();

			if (listeners) {
				for (i = 0, len = listeners.length; i < len; i++) {
					listeners[i].action.call(listeners[i].context, event);
				}
			}
		}

		return this;
	},

	addOneTimeEventListener: function (types, fn, context) {

		if (L.Util.invokeEach(types, this.addOneTimeEventListener, this, fn, context)) { return this; }

		var handler = L.bind(function () {
			this
			    .removeEventListener(types, fn, context)
			    .removeEventListener(types, handler, context);
		}, this);

		return this
		    .addEventListener(types, fn, context)
		    .addEventListener(types, handler, context);
	}
};

L.Mixin.Events.on = L.Mixin.Events.addEventListener;
L.Mixin.Events.off = L.Mixin.Events.removeEventListener;
L.Mixin.Events.once = L.Mixin.Events.addOneTimeEventListener;
L.Mixin.Events.fire = L.Mixin.Events.fireEvent;


/*
 * L.Browser handles different browser and feature detections for internal Leaflet use.
 */

(function () {

	var ie = 'ActiveXObject' in window,
		ielt9 = ie && !document.addEventListener,

	    // terrible browser detection to work around Safari / iOS / Android browser bugs
	    ua = navigator.userAgent.toLowerCase(),
	    webkit = ua.indexOf('webkit') !== -1,
	    chrome = ua.indexOf('chrome') !== -1,
	    phantomjs = ua.indexOf('phantom') !== -1,
	    android = ua.indexOf('android') !== -1,
	    android23 = ua.search('android [23]') !== -1,
		gecko = ua.indexOf('gecko') !== -1,

	    mobile = typeof orientation !== undefined + '',
	    msPointer = window.navigator && window.navigator.msPointerEnabled &&
	              window.navigator.msMaxTouchPoints && !window.PointerEvent,
		pointer = (window.PointerEvent && window.navigator.pointerEnabled && window.navigator.maxTouchPoints) ||
				  msPointer,
	    retina = ('devicePixelRatio' in window && window.devicePixelRatio > 1) ||
	             ('matchMedia' in window && window.matchMedia('(min-resolution:144dpi)') &&
	              window.matchMedia('(min-resolution:144dpi)').matches),

	    doc = document.documentElement,
	    ie3d = ie && ('transition' in doc.style),
	    webkit3d = ('WebKitCSSMatrix' in window) && ('m11' in new window.WebKitCSSMatrix()) && !android23,
	    gecko3d = 'MozPerspective' in doc.style,
	    opera3d = 'OTransition' in doc.style,
	    any3d = !window.L_DISABLE_3D && (ie3d || webkit3d || gecko3d || opera3d) && !phantomjs;


	// PhantomJS has 'ontouchstart' in document.documentElement, but doesn't actually support touch.
	// https://github.com/Leaflet/Leaflet/pull/1434#issuecomment-13843151

	var touch = !window.L_NO_TOUCH && !phantomjs && (function () {

		var startName = 'ontouchstart';

		// IE10+ (We simulate these into touch* events in L.DomEvent and L.DomEvent.Pointer) or WebKit, etc.
		if (pointer || (startName in doc)) {
			return true;
		}

		// Firefox/Gecko
		var div = document.createElement('div'),
		    supported = false;

		if (!div.setAttribute) {
			return false;
		}
		div.setAttribute(startName, 'return;');

		if (typeof div[startName] === 'function') {
			supported = true;
		}

		div.removeAttribute(startName);
		div = null;

		return supported;
	}());


	L.Browser = {
		ie: ie,
		ielt9: ielt9,
		webkit: webkit,
		gecko: gecko && !webkit && !window.opera && !ie,

		android: android,
		android23: android23,

		chrome: chrome,

		ie3d: ie3d,
		webkit3d: webkit3d,
		gecko3d: gecko3d,
		opera3d: opera3d,
		any3d: any3d,

		mobile: mobile,
		mobileWebkit: mobile && webkit,
		mobileWebkit3d: mobile && webkit3d,
		mobileOpera: mobile && window.opera,

		touch: touch,
		msPointer: msPointer,
		pointer: pointer,

		retina: retina
	};

}());


/*
 * L.Point represents a point with x and y coordinates.
 */

L.Point = function (/*Number*/ x, /*Number*/ y, /*Boolean*/ round) {
	this.x = (round ? Math.round(x) : x);
	this.y = (round ? Math.round(y) : y);
};

L.Point.prototype = {

	clone: function () {
		return new L.Point(this.x, this.y);
	},

	// non-destructive, returns a new point
	add: function (point) {
		return this.clone()._add(L.point(point));
	},

	// destructive, used directly for performance in situations where it's safe to modify existing point
	_add: function (point) {
		this.x += point.x;
		this.y += point.y;
		return this;
	},

	subtract: function (point) {
		return this.clone()._subtract(L.point(point));
	},

	_subtract: function (point) {
		this.x -= point.x;
		this.y -= point.y;
		return this;
	},

	divideBy: function (num) {
		return this.clone()._divideBy(num);
	},

	_divideBy: function (num) {
		this.x /= num;
		this.y /= num;
		return this;
	},

	multiplyBy: function (num) {
		return this.clone()._multiplyBy(num);
	},

	_multiplyBy: function (num) {
		this.x *= num;
		this.y *= num;
		return this;
	},

	round: function () {
		return this.clone()._round();
	},

	_round: function () {
		this.x = Math.round(this.x);
		this.y = Math.round(this.y);
		return this;
	},

	floor: function () {
		return this.clone()._floor();
	},

	_floor: function () {
		this.x = Math.floor(this.x);
		this.y = Math.floor(this.y);
		return this;
	},

	distanceTo: function (point) {
		point = L.point(point);

		var x = point.x - this.x,
		    y = point.y - this.y;

		return Math.sqrt(x * x + y * y);
	},

	equals: function (point) {
		point = L.point(point);

		return point.x === this.x &&
		       point.y === this.y;
	},

	contains: function (point) {
		point = L.point(point);

		return Math.abs(point.x) <= Math.abs(this.x) &&
		       Math.abs(point.y) <= Math.abs(this.y);
	},

	toString: function () {
		return 'Point(' +
		        L.Util.formatNum(this.x) + ', ' +
		        L.Util.formatNum(this.y) + ')';
	}
};

L.point = function (x, y, round) {
	if (x instanceof L.Point) {
		return x;
	}
	if (L.Util.isArray(x)) {
		return new L.Point(x[0], x[1]);
	}
	if (x === undefined || x === null) {
		return x;
	}
	return new L.Point(x, y, round);
};


/*
 * L.Bounds represents a rectangular area on the screen in pixel coordinates.
 */

L.Bounds = function (a, b) { //(Point, Point) or Point[]
	if (!a) { return; }

	var points = b ? [a, b] : a;

	for (var i = 0, len = points.length; i < len; i++) {
		this.extend(points[i]);
	}
};

L.Bounds.prototype = {
	// extend the bounds to contain the given point
	extend: function (point) { // (Point)
		point = L.point(point);

		if (!this.min && !this.max) {
			this.min = point.clone();
			this.max = point.clone();
		} else {
			this.min.x = Math.min(point.x, this.min.x);
			this.max.x = Math.max(point.x, this.max.x);
			this.min.y = Math.min(point.y, this.min.y);
			this.max.y = Math.max(point.y, this.max.y);
		}
		return this;
	},

	getCenter: function (round) { // (Boolean) -> Point
		return new L.Point(
		        (this.min.x + this.max.x) / 2,
		        (this.min.y + this.max.y) / 2, round);
	},

	getBottomLeft: function () { // -> Point
		return new L.Point(this.min.x, this.max.y);
	},

	getTopRight: function () { // -> Point
		return new L.Point(this.max.x, this.min.y);
	},

	getSize: function () {
		return this.max.subtract(this.min);
	},

	contains: function (obj) { // (Bounds) or (Point) -> Boolean
		var min, max;

		if (typeof obj[0] === 'number' || obj instanceof L.Point) {
			obj = L.point(obj);
		} else {
			obj = L.bounds(obj);
		}

		if (obj instanceof L.Bounds) {
			min = obj.min;
			max = obj.max;
		} else {
			min = max = obj;
		}

		return (min.x >= this.min.x) &&
		       (max.x <= this.max.x) &&
		       (min.y >= this.min.y) &&
		       (max.y <= this.max.y);
	},

	intersects: function (bounds) { // (Bounds) -> Boolean
		bounds = L.bounds(bounds);

		var min = this.min,
		    max = this.max,
		    min2 = bounds.min,
		    max2 = bounds.max,
		    xIntersects = (max2.x >= min.x) && (min2.x <= max.x),
		    yIntersects = (max2.y >= min.y) && (min2.y <= max.y);

		return xIntersects && yIntersects;
	},

	isValid: function () {
		return !!(this.min && this.max);
	}
};

L.bounds = function (a, b) { // (Bounds) or (Point, Point) or (Point[])
	if (!a || a instanceof L.Bounds) {
		return a;
	}
	return new L.Bounds(a, b);
};


/*
 * L.Transformation is an utility class to perform simple point transformations through a 2d-matrix.
 */

L.Transformation = function (a, b, c, d) {
	this._a = a;
	this._b = b;
	this._c = c;
	this._d = d;
};

L.Transformation.prototype = {
	transform: function (point, scale) { // (Point, Number) -> Point
		return this._transform(point.clone(), scale);
	},

	// destructive transform (faster)
	_transform: function (point, scale) {
		scale = scale || 1;
		point.x = scale * (this._a * point.x + this._b);
		point.y = scale * (this._c * point.y + this._d);
		return point;
	},

	untransform: function (point, scale) {
		scale = scale || 1;
		return new L.Point(
		        (point.x / scale - this._b) / this._a,
		        (point.y / scale - this._d) / this._c);
	}
};


/*
 * L.DomUtil contains various utility functions for working with DOM.
 */

L.DomUtil = {
	get: function (id) {
		return (typeof id === 'string' ? document.getElementById(id) : id);
	},

	getStyle: function (el, style) {

		var value = el.style[style];

		if (!value && el.currentStyle) {
			value = el.currentStyle[style];
		}

		if ((!value || value === 'auto') && document.defaultView) {
			var css = document.defaultView.getComputedStyle(el, null);
			value = css ? css[style] : null;
		}

		return value === 'auto' ? null : value;
	},

	getViewportOffset: function (element) {

		var top = 0,
		    left = 0,
		    el = element,
		    docBody = document.body,
		    docEl = document.documentElement,
		    pos;

		do {
			top  += el.offsetTop  || 0;
			left += el.offsetLeft || 0;

			//add borders
			top += parseInt(L.DomUtil.getStyle(el, 'borderTopWidth'), 10) || 0;
			left += parseInt(L.DomUtil.getStyle(el, 'borderLeftWidth'), 10) || 0;

			pos = L.DomUtil.getStyle(el, 'position');

			if (el.offsetParent === docBody && pos === 'absolute') { break; }

			if (pos === 'fixed') {
				top  += docBody.scrollTop  || docEl.scrollTop  || 0;
				left += docBody.scrollLeft || docEl.scrollLeft || 0;
				break;
			}

			if (pos === 'relative' && !el.offsetLeft) {
				var width = L.DomUtil.getStyle(el, 'width'),
				    maxWidth = L.DomUtil.getStyle(el, 'max-width'),
				    r = el.getBoundingClientRect();

				if (width !== 'none' || maxWidth !== 'none') {
					left += r.left + el.clientLeft;
				}

				//calculate full y offset since we're breaking out of the loop
				top += r.top + (docBody.scrollTop  || docEl.scrollTop  || 0);

				break;
			}

			el = el.offsetParent;

		} while (el);

		el = element;

		do {
			if (el === docBody) { break; }

			top  -= el.scrollTop  || 0;
			left -= el.scrollLeft || 0;

			el = el.parentNode;
		} while (el);

		return new L.Point(left, top);
	},

	documentIsLtr: function () {
		if (!L.DomUtil._docIsLtrCached) {
			L.DomUtil._docIsLtrCached = true;
			L.DomUtil._docIsLtr = L.DomUtil.getStyle(document.body, 'direction') === 'ltr';
		}
		return L.DomUtil._docIsLtr;
	},

	create: function (tagName, className, container) {

		var el = document.createElement(tagName);
		el.className = className;

		if (container) {
			container.appendChild(el);
		}

		return el;
	},

	hasClass: function (el, name) {
		if (el.classList !== undefined) {
			return el.classList.contains(name);
		}
		var className = L.DomUtil._getClass(el);
		return className.length > 0 && new RegExp('(^|\\s)' + name + '(\\s|$)').test(className);
	},

	addClass: function (el, name) {
		if (el.classList !== undefined) {
			var classes = L.Util.splitWords(name);
			for (var i = 0, len = classes.length; i < len; i++) {
				el.classList.add(classes[i]);
			}
		} else if (!L.DomUtil.hasClass(el, name)) {
			var className = L.DomUtil._getClass(el);
			L.DomUtil._setClass(el, (className ? className + ' ' : '') + name);
		}
	},

	removeClass: function (el, name) {
		if (el.classList !== undefined) {
			el.classList.remove(name);
		} else {
			L.DomUtil._setClass(el, L.Util.trim((' ' + L.DomUtil._getClass(el) + ' ').replace(' ' + name + ' ', ' ')));
		}
	},

	_setClass: function (el, name) {
		if (el.className.baseVal === undefined) {
			el.className = name;
		} else {
			// in case of SVG element
			el.className.baseVal = name;
		}
	},

	_getClass: function (el) {
		return el.className.baseVal === undefined ? el.className : el.className.baseVal;
	},

	setOpacity: function (el, value) {

		if ('opacity' in el.style) {
			el.style.opacity = value;

		} else if ('filter' in el.style) {

			var filter = false,
			    filterName = 'DXImageTransform.Microsoft.Alpha';

			// filters collection throws an error if we try to retrieve a filter that doesn't exist
			try {
				filter = el.filters.item(filterName);
			} catch (e) {
				// don't set opacity to 1 if we haven't already set an opacity,
				// it isn't needed and breaks transparent pngs.
				if (value === 1) { return; }
			}

			value = Math.round(value * 100);

			if (filter) {
				filter.Enabled = (value !== 100);
				filter.Opacity = value;
			} else {
				el.style.filter += ' progid:' + filterName + '(opacity=' + value + ')';
			}
		}
	},

	testProp: function (props) {

		var style = document.documentElement.style;

		for (var i = 0; i < props.length; i++) {
			if (props[i] in style) {
				return props[i];
			}
		}
		return false;
	},

	getTranslateString: function (point) {
		// on WebKit browsers (Chrome/Safari/iOS Safari/Android) using translate3d instead of translate
		// makes animation smoother as it ensures HW accel is used. Firefox 13 doesn't care
		// (same speed either way), Opera 12 doesn't support translate3d

		var is3d = L.Browser.webkit3d,
		    open = 'translate' + (is3d ? '3d' : '') + '(',
		    close = (is3d ? ',0' : '') + ')';

		return open + point.x + 'px,' + point.y + 'px' + close;
	},

	getScaleString: function (scale, origin) {

		var preTranslateStr = L.DomUtil.getTranslateString(origin.add(origin.multiplyBy(-1 * scale))),
		    scaleStr = ' scale(' + scale + ') ';

		return preTranslateStr + scaleStr;
	},

	setPosition: function (el, point, disable3D) { // (HTMLElement, Point[, Boolean])

		// jshint camelcase: false
		el._leaflet_pos = point;

		if (!disable3D && L.Browser.any3d) {
			el.style[L.DomUtil.TRANSFORM] =  L.DomUtil.getTranslateString(point);
		} else {
			el.style.left = point.x + 'px';
			el.style.top = point.y + 'px';
		}
	},

	getPosition: function (el) {
		// this method is only used for elements previously positioned using setPosition,
		// so it's safe to cache the position for performance

		// jshint camelcase: false
		return el._leaflet_pos;
	}
};


// prefix style property names

L.DomUtil.TRANSFORM = L.DomUtil.testProp(
        ['transform', 'WebkitTransform', 'OTransform', 'MozTransform', 'msTransform']);

// webkitTransition comes first because some browser versions that drop vendor prefix don't do
// the same for the transitionend event, in particular the Android 4.1 stock browser

L.DomUtil.TRANSITION = L.DomUtil.testProp(
        ['webkitTransition', 'transition', 'OTransition', 'MozTransition', 'msTransition']);

L.DomUtil.TRANSITION_END =
        L.DomUtil.TRANSITION === 'webkitTransition' || L.DomUtil.TRANSITION === 'OTransition' ?
        L.DomUtil.TRANSITION + 'End' : 'transitionend';

(function () {
    if ('onselectstart' in document) {
        L.extend(L.DomUtil, {
            disableTextSelection: function () {
                L.DomEvent.on(window, 'selectstart', L.DomEvent.preventDefault);
            },

            enableTextSelection: function () {
                L.DomEvent.off(window, 'selectstart', L.DomEvent.preventDefault);
            }
        });
    } else {
        var userSelectProperty = L.DomUtil.testProp(
            ['userSelect', 'WebkitUserSelect', 'OUserSelect', 'MozUserSelect', 'msUserSelect']);

        L.extend(L.DomUtil, {
            disableTextSelection: function () {
                if (userSelectProperty) {
                    var style = document.documentElement.style;
                    this._userSelect = style[userSelectProperty];
                    style[userSelectProperty] = 'none';
                }
            },

            enableTextSelection: function () {
                if (userSelectProperty) {
                    document.documentElement.style[userSelectProperty] = this._userSelect;
                    delete this._userSelect;
                }
            }
        });
    }

	L.extend(L.DomUtil, {
		disableImageDrag: function () {
			L.DomEvent.on(window, 'dragstart', L.DomEvent.preventDefault);
		},

		enableImageDrag: function () {
			L.DomEvent.off(window, 'dragstart', L.DomEvent.preventDefault);
		}
	});
})();


/*
 * L.LatLng represents a geographical point with latitude and longitude coordinates.
 */

L.LatLng = function (lat, lng, alt) { // (Number, Number, Number)
	lat = parseFloat(lat);
	lng = parseFloat(lng);

	if (isNaN(lat) || isNaN(lng)) {
		throw new Error('Invalid LatLng object: (' + lat + ', ' + lng + ')');
	}

	this.lat = lat;
	this.lng = lng;

	if (alt !== undefined) {
		this.alt = parseFloat(alt);
	}
};

L.extend(L.LatLng, {
	DEG_TO_RAD: Math.PI / 180,
	RAD_TO_DEG: 180 / Math.PI,
	MAX_MARGIN: 1.0E-9 // max margin of error for the "equals" check
});

L.LatLng.prototype = {
	equals: function (obj) { // (LatLng) -> Boolean
		if (!obj) { return false; }

		obj = L.latLng(obj);

		var margin = Math.max(
		        Math.abs(this.lat - obj.lat),
		        Math.abs(this.lng - obj.lng));

		return margin <= L.LatLng.MAX_MARGIN;
	},

	toString: function (precision) { // (Number) -> String
		return 'LatLng(' +
		        L.Util.formatNum(this.lat, precision) + ', ' +
		        L.Util.formatNum(this.lng, precision) + ')';
	},

	// Haversine distance formula, see http://en.wikipedia.org/wiki/Haversine_formula
	// TODO move to projection code, LatLng shouldn't know about Earth
	distanceTo: function (other) { // (LatLng) -> Number
		other = L.latLng(other);

		var R = 6378137, // earth radius in meters
		    d2r = L.LatLng.DEG_TO_RAD,
		    dLat = (other.lat - this.lat) * d2r,
		    dLon = (other.lng - this.lng) * d2r,
		    lat1 = this.lat * d2r,
		    lat2 = other.lat * d2r,
		    sin1 = Math.sin(dLat / 2),
		    sin2 = Math.sin(dLon / 2);

		var a = sin1 * sin1 + sin2 * sin2 * Math.cos(lat1) * Math.cos(lat2);

		return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
	},

	wrap: function (a, b) { // (Number, Number) -> LatLng
		var lng = this.lng;

		a = a || -180;
		b = b ||  180;

		lng = (lng + b) % (b - a) + (lng < a || lng === b ? b : a);

		return new L.LatLng(this.lat, lng);
	}
};

L.latLng = function (a, b) { // (LatLng) or ([Number, Number]) or (Number, Number)
	if (a instanceof L.LatLng) {
		return a;
	}
	if (L.Util.isArray(a)) {
		if (typeof a[0] === 'number' || typeof a[0] === 'string') {
			return new L.LatLng(a[0], a[1], a[2]);
		} else {
			return null;
		}
	}
	if (a === undefined || a === null) {
		return a;
	}
	if (typeof a === 'object' && 'lat' in a) {
		return new L.LatLng(a.lat, 'lng' in a ? a.lng : a.lon);
	}
	if (b === undefined) {
		return null;
	}
	return new L.LatLng(a, b);
};



/*
 * L.LatLngBounds represents a rectangular area on the map in geographical coordinates.
 */

L.LatLngBounds = function (southWest, northEast) { // (LatLng, LatLng) or (LatLng[])
	if (!southWest) { return; }

	var latlngs = northEast ? [southWest, northEast] : southWest;

	for (var i = 0, len = latlngs.length; i < len; i++) {
		this.extend(latlngs[i]);
	}
};

L.LatLngBounds.prototype = {
	// extend the bounds to contain the given point or bounds
	extend: function (obj) { // (LatLng) or (LatLngBounds)
		if (!obj) { return this; }

		var latLng = L.latLng(obj);
		if (latLng !== null) {
			obj = latLng;
		} else {
			obj = L.latLngBounds(obj);
		}

		if (obj instanceof L.LatLng) {
			if (!this._southWest && !this._northEast) {
				this._southWest = new L.LatLng(obj.lat, obj.lng);
				this._northEast = new L.LatLng(obj.lat, obj.lng);
			} else {
				this._southWest.lat = Math.min(obj.lat, this._southWest.lat);
				this._southWest.lng = Math.min(obj.lng, this._southWest.lng);

				this._northEast.lat = Math.max(obj.lat, this._northEast.lat);
				this._northEast.lng = Math.max(obj.lng, this._northEast.lng);
			}
		} else if (obj instanceof L.LatLngBounds) {
			this.extend(obj._southWest);
			this.extend(obj._northEast);
		}
		return this;
	},

	// extend the bounds by a percentage
	pad: function (bufferRatio) { // (Number) -> LatLngBounds
		var sw = this._southWest,
		    ne = this._northEast,
		    heightBuffer = Math.abs(sw.lat - ne.lat) * bufferRatio,
		    widthBuffer = Math.abs(sw.lng - ne.lng) * bufferRatio;

		return new L.LatLngBounds(
		        new L.LatLng(sw.lat - heightBuffer, sw.lng - widthBuffer),
		        new L.LatLng(ne.lat + heightBuffer, ne.lng + widthBuffer));
	},

	getCenter: function () { // -> LatLng
		return new L.LatLng(
		        (this._southWest.lat + this._northEast.lat) / 2,
		        (this._southWest.lng + this._northEast.lng) / 2);
	},

	getSouthWest: function () {
		return this._southWest;
	},

	getNorthEast: function () {
		return this._northEast;
	},

	getNorthWest: function () {
		return new L.LatLng(this.getNorth(), this.getWest());
	},

	getSouthEast: function () {
		return new L.LatLng(this.getSouth(), this.getEast());
	},

	getWest: function () {
		return this._southWest.lng;
	},

	getSouth: function () {
		return this._southWest.lat;
	},

	getEast: function () {
		return this._northEast.lng;
	},

	getNorth: function () {
		return this._northEast.lat;
	},

	contains: function (obj) { // (LatLngBounds) or (LatLng) -> Boolean
		if (typeof obj[0] === 'number' || obj instanceof L.LatLng) {
			obj = L.latLng(obj);
		} else {
			obj = L.latLngBounds(obj);
		}

		var sw = this._southWest,
		    ne = this._northEast,
		    sw2, ne2;

		if (obj instanceof L.LatLngBounds) {
			sw2 = obj.getSouthWest();
			ne2 = obj.getNorthEast();
		} else {
			sw2 = ne2 = obj;
		}

		return (sw2.lat >= sw.lat) && (ne2.lat <= ne.lat) &&
		       (sw2.lng >= sw.lng) && (ne2.lng <= ne.lng);
	},

	intersects: function (bounds) { // (LatLngBounds)
		bounds = L.latLngBounds(bounds);

		var sw = this._southWest,
		    ne = this._northEast,
		    sw2 = bounds.getSouthWest(),
		    ne2 = bounds.getNorthEast(),

		    latIntersects = (ne2.lat >= sw.lat) && (sw2.lat <= ne.lat),
		    lngIntersects = (ne2.lng >= sw.lng) && (sw2.lng <= ne.lng);

		return latIntersects && lngIntersects;
	},

	toBBoxString: function () {
		return [this.getWest(), this.getSouth(), this.getEast(), this.getNorth()].join(',');
	},

	equals: function (bounds) { // (LatLngBounds)
		if (!bounds) { return false; }

		bounds = L.latLngBounds(bounds);

		return this._southWest.equals(bounds.getSouthWest()) &&
		       this._northEast.equals(bounds.getNorthEast());
	},

	isValid: function () {
		return !!(this._southWest && this._northEast);
	}
};

//TODO International date line?

L.latLngBounds = function (a, b) { // (LatLngBounds) or (LatLng, LatLng)
	if (!a || a instanceof L.LatLngBounds) {
		return a;
	}
	return new L.LatLngBounds(a, b);
};


/*
 * L.Projection contains various geographical projections used by CRS classes.
 */

L.Projection = {};


/*
 * Spherical Mercator is the most popular map projection, used by EPSG:3857 CRS used by default.
 */

L.Projection.SphericalMercator = {
	MAX_LATITUDE: 85.0511287798,

	project: function (latlng) { // (LatLng) -> Point
		var d = L.LatLng.DEG_TO_RAD,
		    max = this.MAX_LATITUDE,
		    lat = Math.max(Math.min(max, latlng.lat), -max),
		    x = latlng.lng * d,
		    y = lat * d;

		y = Math.log(Math.tan((Math.PI / 4) + (y / 2)));

		return new L.Point(x, y);
	},

	unproject: function (point) { // (Point, Boolean) -> LatLng
		var d = L.LatLng.RAD_TO_DEG,
		    lng = point.x * d,
		    lat = (2 * Math.atan(Math.exp(point.y)) - (Math.PI / 2)) * d;

		return new L.LatLng(lat, lng);
	}
};


/*
 * Simple equirectangular (Plate Carree) projection, used by CRS like EPSG:4326 and Simple.
 */

L.Projection.LonLat = {
	project: function (latlng) {
		return new L.Point(latlng.lng, latlng.lat);
	},

	unproject: function (point) {
		return new L.LatLng(point.y, point.x);
	}
};


/*
 * L.CRS is a base object for all defined CRS (Coordinate Reference Systems) in Leaflet.
 */

L.CRS = {
	latLngToPoint: function (latlng, zoom) { // (LatLng, Number) -> Point
		var projectedPoint = this.projection.project(latlng),
		    scale = this.scale(zoom);

		return this.transformation._transform(projectedPoint, scale);
	},

	pointToLatLng: function (point, zoom) { // (Point, Number[, Boolean]) -> LatLng
		var scale = this.scale(zoom),
		    untransformedPoint = this.transformation.untransform(point, scale);

		return this.projection.unproject(untransformedPoint);
	},

	project: function (latlng) {
		return this.projection.project(latlng);
	},

	scale: function (zoom) {
		return 256 * Math.pow(2, zoom);
	},

	getSize: function (zoom) {
		var s = this.scale(zoom);
		return L.point(s, s);
	}
};


/*
 * A simple CRS that can be used for flat non-Earth maps like panoramas or game maps.
 */

L.CRS.Simple = L.extend({}, L.CRS, {
	projection: L.Projection.LonLat,
	transformation: new L.Transformation(1, 0, -1, 0),

	scale: function (zoom) {
		return Math.pow(2, zoom);
	}
});


/*
 * L.CRS.EPSG3857 (Spherical Mercator) is the most common CRS for web mapping
 * and is used by Leaflet by default.
 */

L.CRS.EPSG3857 = L.extend({}, L.CRS, {
	code: 'EPSG:3857',

	projection: L.Projection.SphericalMercator,
	transformation: new L.Transformation(0.5 / Math.PI, 0.5, -0.5 / Math.PI, 0.5),

	project: function (latlng) { // (LatLng) -> Point
		var projectedPoint = this.projection.project(latlng),
		    earthRadius = 6378137;
		return projectedPoint.multiplyBy(earthRadius);
	}
});

L.CRS.EPSG900913 = L.extend({}, L.CRS.EPSG3857, {
	code: 'EPSG:900913'
});


/*
 * L.CRS.EPSG4326 is a CRS popular among advanced GIS specialists.
 */

L.CRS.EPSG4326 = L.extend({}, L.CRS, {
	code: 'EPSG:4326',

	projection: L.Projection.LonLat,
	transformation: new L.Transformation(1 / 360, 0.5, -1 / 360, 0.5)
});


/*
 * L.Map is the central class of the API - it is used to create a map.
 */

L.Map = L.Class.extend({

	includes: L.Mixin.Events,

	options: {
		crs: L.CRS.EPSG3857,

		/*
		center: LatLng,
		zoom: Number,
		layers: Array,
		*/

		fadeAnimation: L.DomUtil.TRANSITION && !L.Browser.android23,
		trackResize: true,
		markerZoomAnimation: L.DomUtil.TRANSITION && L.Browser.any3d
	},

	initialize: function (id, options) { // (HTMLElement or String, Object)
		options = L.setOptions(this, options);


		this._initContainer(id);
		this._initLayout();

		// hack for https://github.com/Leaflet/Leaflet/issues/1980
		this._onResize = L.bind(this._onResize, this);

		this._initEvents();

		if (options.maxBounds) {
			this.setMaxBounds(options.maxBounds);
		}

		if (options.center && options.zoom !== undefined) {
			this.setView(L.latLng(options.center), options.zoom, {reset: true});
		}

		this._handlers = [];

		this._layers = {};
		this._zoomBoundLayers = {};
		this._tileLayersNum = 0;

		this.callInitHooks();

		this._addLayers(options.layers);
	},


	// public methods that modify map state

	// replaced by animation-powered implementation in Map.PanAnimation.js
	setView: function (center, zoom) {
		zoom = zoom === undefined ? this.getZoom() : zoom;
		this._resetView(L.latLng(center), this._limitZoom(zoom));
		return this;
	},

	setZoom: function (zoom, options) {
		if (!this._loaded) {
			this._zoom = this._limitZoom(zoom);
			return this;
		}
		return this.setView(this.getCenter(), zoom, {zoom: options});
	},

	zoomIn: function (delta, options) {
		return this.setZoom(this._zoom + (delta || 1), options);
	},

	zoomOut: function (delta, options) {
		return this.setZoom(this._zoom - (delta || 1), options);
	},

	setZoomAround: function (latlng, zoom, options) {
		var scale = this.getZoomScale(zoom),
		    viewHalf = this.getSize().divideBy(2),
		    containerPoint = latlng instanceof L.Point ? latlng : this.latLngToContainerPoint(latlng),

		    centerOffset = containerPoint.subtract(viewHalf).multiplyBy(1 - 1 / scale),
		    newCenter = this.containerPointToLatLng(viewHalf.add(centerOffset));

		return this.setView(newCenter, zoom, {zoom: options});
	},

	fitBounds: function (bounds, options) {

		options = options || {};
		bounds = bounds.getBounds ? bounds.getBounds() : L.latLngBounds(bounds);

		var paddingTL = L.point(options.paddingTopLeft || options.padding || [0, 0]),
		    paddingBR = L.point(options.paddingBottomRight || options.padding || [0, 0]),

		    zoom = this.getBoundsZoom(bounds, false, paddingTL.add(paddingBR)),
		    paddingOffset = paddingBR.subtract(paddingTL).divideBy(2),

		    swPoint = this.project(bounds.getSouthWest(), zoom),
		    nePoint = this.project(bounds.getNorthEast(), zoom),
		    center = this.unproject(swPoint.add(nePoint).divideBy(2).add(paddingOffset), zoom);

		zoom = options && options.maxZoom ? Math.min(options.maxZoom, zoom) : zoom;

		return this.setView(center, zoom, options);
	},

	fitWorld: function (options) {
		return this.fitBounds([[-90, -180], [90, 180]], options);
	},

	panTo: function (center, options) { // (LatLng)
		return this.setView(center, this._zoom, {pan: options});
	},

	panBy: function (offset) { // (Point)
		// replaced with animated panBy in Map.PanAnimation.js
		this.fire('movestart');

		this._rawPanBy(L.point(offset));

		this.fire('move');
		return this.fire('moveend');
	},

	setMaxBounds: function (bounds) {
		bounds = L.latLngBounds(bounds);

		this.options.maxBounds = bounds;

		if (!bounds) {
			return this.off('moveend', this._panInsideMaxBounds, this);
		}

		if (this._loaded) {
			this._panInsideMaxBounds();
		}

		return this.on('moveend', this._panInsideMaxBounds, this);
	},

	panInsideBounds: function (bounds, options) {
		var center = this.getCenter(),
			newCenter = this._limitCenter(center, this._zoom, bounds);

		if (center.equals(newCenter)) { return this; }

		return this.panTo(newCenter, options);
	},

	addLayer: function (layer) {
		// TODO method is too big, refactor

		var id = L.stamp(layer);

		if (this._layers[id]) { return this; }

		this._layers[id] = layer;

		// TODO getMaxZoom, getMinZoom in ILayer (instead of options)
		if (layer.options && (!isNaN(layer.options.maxZoom) || !isNaN(layer.options.minZoom))) {
			this._zoomBoundLayers[id] = layer;
			this._updateZoomLevels();
		}

		// TODO looks ugly, refactor!!!
		if (this.options.zoomAnimation && L.TileLayer && (layer instanceof L.TileLayer)) {
			this._tileLayersNum++;
			this._tileLayersToLoad++;
			layer.on('load', this._onTileLayerLoad, this);
		}

		if (this._loaded) {
			this._layerAdd(layer);
		}

		return this;
	},

	removeLayer: function (layer) {
		var id = L.stamp(layer);

		if (!this._layers[id]) { return this; }

		if (this._loaded) {
			layer.onRemove(this);
		}

		delete this._layers[id];

		if (this._loaded) {
			this.fire('layerremove', {layer: layer});
		}

		if (this._zoomBoundLayers[id]) {
			delete this._zoomBoundLayers[id];
			this._updateZoomLevels();
		}

		// TODO looks ugly, refactor
		if (this.options.zoomAnimation && L.TileLayer && (layer instanceof L.TileLayer)) {
			this._tileLayersNum--;
			this._tileLayersToLoad--;
			layer.off('load', this._onTileLayerLoad, this);
		}

		return this;
	},

	hasLayer: function (layer) {
		if (!layer) { return false; }

		return (L.stamp(layer) in this._layers);
	},

	eachLayer: function (method, context) {
		for (var i in this._layers) {
			method.call(context, this._layers[i]);
		}
		return this;
	},

	invalidateSize: function (options) {
		if (!this._loaded) { return this; }

		options = L.extend({
			animate: false,
			pan: true
		}, options === true ? {animate: true} : options);

		var oldSize = this.getSize();
		this._sizeChanged = true;
		this._initialCenter = null;

		var newSize = this.getSize(),
		    oldCenter = oldSize.divideBy(2).round(),
		    newCenter = newSize.divideBy(2).round(),
		    offset = oldCenter.subtract(newCenter);

		if (!offset.x && !offset.y) { return this; }

		if (options.animate && options.pan) {
			this.panBy(offset);

		} else {
			if (options.pan) {
				this._rawPanBy(offset);
			}

			this.fire('move');

			if (options.debounceMoveend) {
				clearTimeout(this._sizeTimer);
				this._sizeTimer = setTimeout(L.bind(this.fire, this, 'moveend'), 200);
			} else {
				this.fire('moveend');
			}
		}

		return this.fire('resize', {
			oldSize: oldSize,
			newSize: newSize
		});
	},

	// TODO handler.addTo
	addHandler: function (name, HandlerClass) {
		if (!HandlerClass) { return this; }

		var handler = this[name] = new HandlerClass(this);

		this._handlers.push(handler);

		if (this.options[name]) {
			handler.enable();
		}

		return this;
	},

	remove: function () {
		if (this._loaded) {
			this.fire('unload');
		}

		this._initEvents('off');

		try {
			// throws error in IE6-8
			delete this._container._leaflet;
		} catch (e) {
			this._container._leaflet = undefined;
		}

		this._clearPanes();
		if (this._clearControlPos) {
			this._clearControlPos();
		}

		this._clearHandlers();

		return this;
	},


	// public methods for getting map state

	getCenter: function () { // (Boolean) -> LatLng
		this._checkIfLoaded();

		if (this._initialCenter && !this._moved()) {
			return this._initialCenter;
		}
		return this.layerPointToLatLng(this._getCenterLayerPoint());
	},

	getZoom: function () {
		return this._zoom;
	},

	getBounds: function () {
		var bounds = this.getPixelBounds(),
		    sw = this.unproject(bounds.getBottomLeft()),
		    ne = this.unproject(bounds.getTopRight());

		return new L.LatLngBounds(sw, ne);
	},

	getMinZoom: function () {
		return this.options.minZoom === undefined ?
			(this._layersMinZoom === undefined ? 0 : this._layersMinZoom) :
			this.options.minZoom;
	},

	getMaxZoom: function () {
		return this.options.maxZoom === undefined ?
			(this._layersMaxZoom === undefined ? Infinity : this._layersMaxZoom) :
			this.options.maxZoom;
	},

	getBoundsZoom: function (bounds, inside, padding) { // (LatLngBounds[, Boolean, Point]) -> Number
		bounds = L.latLngBounds(bounds);

		var zoom = this.getMinZoom() - (inside ? 1 : 0),
		    maxZoom = this.getMaxZoom(),
		    size = this.getSize(),

		    nw = bounds.getNorthWest(),
		    se = bounds.getSouthEast(),

		    zoomNotFound = true,
		    boundsSize;

		padding = L.point(padding || [0, 0]);

		do {
			zoom++;
			boundsSize = this.project(se, zoom).subtract(this.project(nw, zoom)).add(padding);
			zoomNotFound = !inside ? size.contains(boundsSize) : boundsSize.x < size.x || boundsSize.y < size.y;

		} while (zoomNotFound && zoom <= maxZoom);

		if (zoomNotFound && inside) {
			return null;
		}

		return inside ? zoom : zoom - 1;
	},

	getSize: function () {
		if (!this._size || this._sizeChanged) {
			this._size = new L.Point(
				this._container.clientWidth,
				this._container.clientHeight);

			this._sizeChanged = false;
		}
		return this._size.clone();
	},

	getPixelBounds: function () {
		var topLeftPoint = this._getTopLeftPoint();
		return new L.Bounds(topLeftPoint, topLeftPoint.add(this.getSize()));
	},

	getPixelOrigin: function () {
		this._checkIfLoaded();
		return this._initialTopLeftPoint;
	},

	getPanes: function () {
		return this._panes;
	},

	getContainer: function () {
		return this._container;
	},


	// TODO replace with universal implementation after refactoring projections

	getZoomScale: function (toZoom) {
		var crs = this.options.crs;
		return crs.scale(toZoom) / crs.scale(this._zoom);
	},

	getScaleZoom: function (scale) {
		return this._zoom + (Math.log(scale) / Math.LN2);
	},


	// conversion methods

	project: function (latlng, zoom) { // (LatLng[, Number]) -> Point
		zoom = zoom === undefined ? this._zoom : zoom;
		return this.options.crs.latLngToPoint(L.latLng(latlng), zoom);
	},

	unproject: function (point, zoom) { // (Point[, Number]) -> LatLng
		zoom = zoom === undefined ? this._zoom : zoom;
		return this.options.crs.pointToLatLng(L.point(point), zoom);
	},

	layerPointToLatLng: function (point) { // (Point)
		var projectedPoint = L.point(point).add(this.getPixelOrigin());
		return this.unproject(projectedPoint);
	},

	latLngToLayerPoint: function (latlng) { // (LatLng)
		var projectedPoint = this.project(L.latLng(latlng))._round();
		return projectedPoint._subtract(this.getPixelOrigin());
	},

	containerPointToLayerPoint: function (point) { // (Point)
		return L.point(point).subtract(this._getMapPanePos());
	},

	layerPointToContainerPoint: function (point) { // (Point)
		return L.point(point).add(this._getMapPanePos());
	},

	containerPointToLatLng: function (point) {
		var layerPoint = this.containerPointToLayerPoint(L.point(point));
		return this.layerPointToLatLng(layerPoint);
	},

	latLngToContainerPoint: function (latlng) {
		return this.layerPointToContainerPoint(this.latLngToLayerPoint(L.latLng(latlng)));
	},

	mouseEventToContainerPoint: function (e) { // (MouseEvent)
		return L.DomEvent.getMousePosition(e, this._container);
	},

	mouseEventToLayerPoint: function (e) { // (MouseEvent)
		return this.containerPointToLayerPoint(this.mouseEventToContainerPoint(e));
	},

	mouseEventToLatLng: function (e) { // (MouseEvent)
		return this.layerPointToLatLng(this.mouseEventToLayerPoint(e));
	},


	// map initialization methods

	_initContainer: function (id) {
		var container = this._container = L.DomUtil.get(id);

		if (!container) {
			throw new Error('Map container not found.');
		} else if (container._leaflet) {
			throw new Error('Map container is already initialized.');
		}

		container._leaflet = true;
	},

	_initLayout: function () {
		var container = this._container;

		L.DomUtil.addClass(container, 'leaflet-container' +
			(L.Browser.touch ? ' leaflet-touch' : '') +
			(L.Browser.retina ? ' leaflet-retina' : '') +
			(L.Browser.ielt9 ? ' leaflet-oldie' : '') +
			(this.options.fadeAnimation ? ' leaflet-fade-anim' : ''));

		var position = L.DomUtil.getStyle(container, 'position');

		if (position !== 'absolute' && position !== 'relative' && position !== 'fixed') {
			container.style.position = 'relative';
		}

		this._initPanes();

		if (this._initControlPos) {
			this._initControlPos();
		}
	},

	_initPanes: function () {
		var panes = this._panes = {};

		this._mapPane = panes.mapPane = this._createPane('leaflet-map-pane', this._container);

		this._tilePane = panes.tilePane = this._createPane('leaflet-tile-pane', this._mapPane);
		panes.objectsPane = this._createPane('leaflet-objects-pane', this._mapPane);
		panes.shadowPane = this._createPane('leaflet-shadow-pane');
		panes.overlayPane = this._createPane('leaflet-overlay-pane');
		panes.markerPane = this._createPane('leaflet-marker-pane');
		panes.popupPane = this._createPane('leaflet-popup-pane');

		var zoomHide = ' leaflet-zoom-hide';

		if (!this.options.markerZoomAnimation) {
			L.DomUtil.addClass(panes.markerPane, zoomHide);
			L.DomUtil.addClass(panes.shadowPane, zoomHide);
			L.DomUtil.addClass(panes.popupPane, zoomHide);
		}
	},

	_createPane: function (className, container) {
		return L.DomUtil.create('div', className, container || this._panes.objectsPane);
	},

	_clearPanes: function () {
		this._container.removeChild(this._mapPane);
	},

	_addLayers: function (layers) {
		layers = layers ? (L.Util.isArray(layers) ? layers : [layers]) : [];

		for (var i = 0, len = layers.length; i < len; i++) {
			this.addLayer(layers[i]);
		}
	},


	// private methods that modify map state

	_resetView: function (center, zoom, preserveMapOffset, afterZoomAnim) {

		var zoomChanged = (this._zoom !== zoom);

		if (!afterZoomAnim) {
			this.fire('movestart');

			if (zoomChanged) {
				this.fire('zoomstart');
			}
		}

		this._zoom = zoom;
		this._initialCenter = center;

		this._initialTopLeftPoint = this._getNewTopLeftPoint(center);

		if (!preserveMapOffset) {
			L.DomUtil.setPosition(this._mapPane, new L.Point(0, 0));
		} else {
			this._initialTopLeftPoint._add(this._getMapPanePos());
		}

		this._tileLayersToLoad = this._tileLayersNum;

		var loading = !this._loaded;
		this._loaded = true;

		this.fire('viewreset', {hard: !preserveMapOffset});

		if (loading) {
			this.fire('load');
			this.eachLayer(this._layerAdd, this);
		}

		this.fire('move');

		if (zoomChanged || afterZoomAnim) {
			this.fire('zoomend');
		}

		this.fire('moveend', {hard: !preserveMapOffset});
	},

	_rawPanBy: function (offset) {
		L.DomUtil.setPosition(this._mapPane, this._getMapPanePos().subtract(offset));
	},

	_getZoomSpan: function () {
		return this.getMaxZoom() - this.getMinZoom();
	},

	_updateZoomLevels: function () {
		var i,
			minZoom = Infinity,
			maxZoom = -Infinity,
			oldZoomSpan = this._getZoomSpan();

		for (i in this._zoomBoundLayers) {
			var layer = this._zoomBoundLayers[i];
			if (!isNaN(layer.options.minZoom)) {
				minZoom = Math.min(minZoom, layer.options.minZoom);
			}
			if (!isNaN(layer.options.maxZoom)) {
				maxZoom = Math.max(maxZoom, layer.options.maxZoom);
			}
		}

		if (i === undefined) { // we have no tilelayers
			this._layersMaxZoom = this._layersMinZoom = undefined;
		} else {
			this._layersMaxZoom = maxZoom;
			this._layersMinZoom = minZoom;
		}

		if (oldZoomSpan !== this._getZoomSpan()) {
			this.fire('zoomlevelschange');
		}
	},

	_panInsideMaxBounds: function () {
		this.panInsideBounds(this.options.maxBounds);
	},

	_checkIfLoaded: function () {
		if (!this._loaded) {
			throw new Error('Set map center and zoom first.');
		}
	},

	// map events

	_initEvents: function (onOff) {
		if (!L.DomEvent) { return; }

		onOff = onOff || 'on';

		L.DomEvent[onOff](this._container, 'click', this._onMouseClick, this);

		var events = ['dblclick', 'mousedown', 'mouseup', 'mouseenter',
		              'mouseleave', 'mousemove', 'contextmenu'],
		    i, len;

		for (i = 0, len = events.length; i < len; i++) {
			L.DomEvent[onOff](this._container, events[i], this._fireMouseEvent, this);
		}

		if (this.options.trackResize) {
			L.DomEvent[onOff](window, 'resize', this._onResize, this);
		}
	},

	_onResize: function () {
		L.Util.cancelAnimFrame(this._resizeRequest);
		this._resizeRequest = L.Util.requestAnimFrame(
		        function () { this.invalidateSize({debounceMoveend: true}); }, this, false, this._container);
	},

	_onMouseClick: function (e) {
		if (!this._loaded || (!e._simulated &&
		        ((this.dragging && this.dragging.moved()) ||
		         (this.boxZoom  && this.boxZoom.moved()))) ||
		            L.DomEvent._skipped(e)) { return; }

		this.fire('preclick');
		this._fireMouseEvent(e);
	},

	_fireMouseEvent: function (e) {
		if (!this._loaded || L.DomEvent._skipped(e)) { return; }

		var type = e.type;

		type = (type === 'mouseenter' ? 'mouseover' : (type === 'mouseleave' ? 'mouseout' : type));

		if (!this.hasEventListeners(type)) { return; }

		if (type === 'contextmenu') {
			L.DomEvent.preventDefault(e);
		}

		var containerPoint = this.mouseEventToContainerPoint(e),
		    layerPoint = this.containerPointToLayerPoint(containerPoint),
		    latlng = this.layerPointToLatLng(layerPoint);

		this.fire(type, {
			latlng: latlng,
			layerPoint: layerPoint,
			containerPoint: containerPoint,
			originalEvent: e
		});
	},

	_onTileLayerLoad: function () {
		this._tileLayersToLoad--;
		if (this._tileLayersNum && !this._tileLayersToLoad) {
			this.fire('tilelayersload');
		}
	},

	_clearHandlers: function () {
		for (var i = 0, len = this._handlers.length; i < len; i++) {
			this._handlers[i].disable();
		}
	},

	whenReady: function (callback, context) {
		if (this._loaded) {
			callback.call(context || this, this);
		} else {
			this.on('load', callback, context);
		}
		return this;
	},

	_layerAdd: function (layer) {
		layer.onAdd(this);
		this.fire('layeradd', {layer: layer});
	},


	// private methods for getting map state

	_getMapPanePos: function () {
		return L.DomUtil.getPosition(this._mapPane);
	},

	_moved: function () {
		var pos = this._getMapPanePos();
		return pos && !pos.equals([0, 0]);
	},

	_getTopLeftPoint: function () {
		return this.getPixelOrigin().subtract(this._getMapPanePos());
	},

	_getNewTopLeftPoint: function (center, zoom) {
		var viewHalf = this.getSize()._divideBy(2);
		// TODO round on display, not calculation to increase precision?
		return this.project(center, zoom)._subtract(viewHalf)._round();
	},

	_latLngToNewLayerPoint: function (latlng, newZoom, newCenter) {
		var topLeft = this._getNewTopLeftPoint(newCenter, newZoom).add(this._getMapPanePos());
		return this.project(latlng, newZoom)._subtract(topLeft);
	},

	// layer point of the current center
	_getCenterLayerPoint: function () {
		return this.containerPointToLayerPoint(this.getSize()._divideBy(2));
	},

	// offset of the specified place to the current center in pixels
	_getCenterOffset: function (latlng) {
		return this.latLngToLayerPoint(latlng).subtract(this._getCenterLayerPoint());
	},

	// adjust center for view to get inside bounds
	_limitCenter: function (center, zoom, bounds) {

		if (!bounds) { return center; }

		var centerPoint = this.project(center, zoom),
		    viewHalf = this.getSize().divideBy(2),
		    viewBounds = new L.Bounds(centerPoint.subtract(viewHalf), centerPoint.add(viewHalf)),
		    offset = this._getBoundsOffset(viewBounds, bounds, zoom);

		return this.unproject(centerPoint.add(offset), zoom);
	},

	// adjust offset for view to get inside bounds
	_limitOffset: function (offset, bounds) {
		if (!bounds) { return offset; }

		var viewBounds = this.getPixelBounds(),
		    newBounds = new L.Bounds(viewBounds.min.add(offset), viewBounds.max.add(offset));

		return offset.add(this._getBoundsOffset(newBounds, bounds));
	},

	// returns offset needed for pxBounds to get inside maxBounds at a specified zoom
	_getBoundsOffset: function (pxBounds, maxBounds, zoom) {
		var nwOffset = this.project(maxBounds.getNorthWest(), zoom).subtract(pxBounds.min),
		    seOffset = this.project(maxBounds.getSouthEast(), zoom).subtract(pxBounds.max),

		    dx = this._rebound(nwOffset.x, -seOffset.x),
		    dy = this._rebound(nwOffset.y, -seOffset.y);

		return new L.Point(dx, dy);
	},

	_rebound: function (left, right) {
		return left + right > 0 ?
			Math.round(left - right) / 2 :
			Math.max(0, Math.ceil(left)) - Math.max(0, Math.floor(right));
	},

	_limitZoom: function (zoom) {
		var min = this.getMinZoom(),
		    max = this.getMaxZoom();

		return Math.max(min, Math.min(max, zoom));
	}
});

L.map = function (id, options) {
	return new L.Map(id, options);
};


/*
 * Mercator projection that takes into account that the Earth is not a perfect sphere.
 * Less popular than spherical mercator; used by projections like EPSG:3395.
 */

L.Projection.Mercator = {
	MAX_LATITUDE: 85.0840591556,

	R_MINOR: 6356752.314245179,
	R_MAJOR: 6378137,

	project: function (latlng) { // (LatLng) -> Point
		var d = L.LatLng.DEG_TO_RAD,
		    max = this.MAX_LATITUDE,
		    lat = Math.max(Math.min(max, latlng.lat), -max),
		    r = this.R_MAJOR,
		    r2 = this.R_MINOR,
		    x = latlng.lng * d * r,
		    y = lat * d,
		    tmp = r2 / r,
		    eccent = Math.sqrt(1.0 - tmp * tmp),
		    con = eccent * Math.sin(y);

		con = Math.pow((1 - con) / (1 + con), eccent * 0.5);

		var ts = Math.tan(0.5 * ((Math.PI * 0.5) - y)) / con;
		y = -r * Math.log(ts);

		return new L.Point(x, y);
	},

	unproject: function (point) { // (Point, Boolean) -> LatLng
		var d = L.LatLng.RAD_TO_DEG,
		    r = this.R_MAJOR,
		    r2 = this.R_MINOR,
		    lng = point.x * d / r,
		    tmp = r2 / r,
		    eccent = Math.sqrt(1 - (tmp * tmp)),
		    ts = Math.exp(- point.y / r),
		    phi = (Math.PI / 2) - 2 * Math.atan(ts),
		    numIter = 15,
		    tol = 1e-7,
		    i = numIter,
		    dphi = 0.1,
		    con;

		while ((Math.abs(dphi) > tol) && (--i > 0)) {
			con = eccent * Math.sin(phi);
			dphi = (Math.PI / 2) - 2 * Math.atan(ts *
			            Math.pow((1.0 - con) / (1.0 + con), 0.5 * eccent)) - phi;
			phi += dphi;
		}

		return new L.LatLng(phi * d, lng);
	}
};



L.CRS.EPSG3395 = L.extend({}, L.CRS, {
	code: 'EPSG:3395',

	projection: L.Projection.Mercator,

	transformation: (function () {
		var m = L.Projection.Mercator,
		    r = m.R_MAJOR,
		    scale = 0.5 / (Math.PI * r);

		return new L.Transformation(scale, 0.5, -scale, 0.5);
	}())
});


/*
 * L.TileLayer is used for standard xyz-numbered tile layers.
 */

L.TileLayer = L.Class.extend({
	includes: L.Mixin.Events,

	options: {
		minZoom: 0,
		maxZoom: 18,
		tileSize: 256,
		subdomains: 'abc',
		errorTileUrl: '',
		attribution: '',
		zoomOffset: 0,
		opacity: 1,
		/*
		maxNativeZoom: null,
		zIndex: null,
		tms: false,
		continuousWorld: false,
		noWrap: false,
		zoomReverse: false,
		detectRetina: false,
		reuseTiles: false,
		bounds: false,
		*/
		unloadInvisibleTiles: L.Browser.mobile,
		updateWhenIdle: L.Browser.mobile
	},

	initialize: function (url, options) {
		options = L.setOptions(this, options);

		// detecting retina displays, adjusting tileSize and zoom levels
		if (options.detectRetina && L.Browser.retina && options.maxZoom > 0) {

			options.tileSize = Math.floor(options.tileSize / 2);
			options.zoomOffset++;

			if (options.minZoom > 0) {
				options.minZoom--;
			}
			this.options.maxZoom--;
		}

		if (options.bounds) {
			options.bounds = L.latLngBounds(options.bounds);
		}

		this._url = url;

		var subdomains = this.options.subdomains;

		if (typeof subdomains === 'string') {
			this.options.subdomains = subdomains.split('');
		}
	},

	onAdd: function (map) {
		this._map = map;
		this._animated = map._zoomAnimated;

		// create a container div for tiles
		this._initContainer();

		// set up events
		map.on({
			'viewreset': this._reset,
			'moveend': this._update
		}, this);

		if (this._animated) {
			map.on({
				'zoomanim': this._animateZoom,
				'zoomend': this._endZoomAnim
			}, this);
		}

		if (!this.options.updateWhenIdle) {
			this._limitedUpdate = L.Util.limitExecByInterval(this._update, 150, this);
			map.on('move', this._limitedUpdate, this);
		}

		this._reset();
		this._update();
	},

	addTo: function (map) {
		map.addLayer(this);
		return this;
	},

	onRemove: function (map) {
		this._container.parentNode.removeChild(this._container);

		map.off({
			'viewreset': this._reset,
			'moveend': this._update
		}, this);

		if (this._animated) {
			map.off({
				'zoomanim': this._animateZoom,
				'zoomend': this._endZoomAnim
			}, this);
		}

		if (!this.options.updateWhenIdle) {
			map.off('move', this._limitedUpdate, this);
		}

		this._container = null;
		this._map = null;
	},

	bringToFront: function () {
		var pane = this._map._panes.tilePane;

		if (this._container) {
			pane.appendChild(this._container);
			this._setAutoZIndex(pane, Math.max);
		}

		return this;
	},

	bringToBack: function () {
		var pane = this._map._panes.tilePane;

		if (this._container) {
			pane.insertBefore(this._container, pane.firstChild);
			this._setAutoZIndex(pane, Math.min);
		}

		return this;
	},

	getAttribution: function () {
		return this.options.attribution;
	},

	getContainer: function () {
		return this._container;
	},

	setOpacity: function (opacity) {
		this.options.opacity = opacity;

		if (this._map) {
			this._updateOpacity();
		}

		return this;
	},

	setZIndex: function (zIndex) {
		this.options.zIndex = zIndex;
		this._updateZIndex();

		return this;
	},

	setUrl: function (url, noRedraw) {
		this._url = url;

		if (!noRedraw) {
			this.redraw();
		}

		return this;
	},

	redraw: function () {
		if (this._map) {
			this._reset({hard: true});
			this._update();
		}
		return this;
	},

	_updateZIndex: function () {
		if (this._container && this.options.zIndex !== undefined) {
			this._container.style.zIndex = this.options.zIndex;
		}
	},

	_setAutoZIndex: function (pane, compare) {

		var layers = pane.children,
		    edgeZIndex = -compare(Infinity, -Infinity), // -Infinity for max, Infinity for min
		    zIndex, i, len;

		for (i = 0, len = layers.length; i < len; i++) {

			if (layers[i] !== this._container) {
				zIndex = parseInt(layers[i].style.zIndex, 10);

				if (!isNaN(zIndex)) {
					edgeZIndex = compare(edgeZIndex, zIndex);
				}
			}
		}

		this.options.zIndex = this._container.style.zIndex =
		        (isFinite(edgeZIndex) ? edgeZIndex : 0) + compare(1, -1);
	},

	_updateOpacity: function () {
		var i,
		    tiles = this._tiles;

		if (L.Browser.ielt9) {
			for (i in tiles) {
				L.DomUtil.setOpacity(tiles[i], this.options.opacity);
			}
		} else {
			L.DomUtil.setOpacity(this._container, this.options.opacity);
		}
	},

	_initContainer: function () {
		var tilePane = this._map._panes.tilePane;

		if (!this._container) {
			this._container = L.DomUtil.create('div', 'leaflet-layer');

			this._updateZIndex();

			if (this._animated) {
				var className = 'leaflet-tile-container';

				this._bgBuffer = L.DomUtil.create('div', className, this._container);
				this._tileContainer = L.DomUtil.create('div', className, this._container);

			} else {
				this._tileContainer = this._container;
			}

			tilePane.appendChild(this._container);

			if (this.options.opacity < 1) {
				this._updateOpacity();
			}
		}
	},

	_reset: function (e) {
		for (var key in this._tiles) {
			this.fire('tileunload', {tile: this._tiles[key]});
		}

		this._tiles = {};
		this._tilesToLoad = 0;

		if (this.options.reuseTiles) {
			this._unusedTiles = [];
		}

		this._tileContainer.innerHTML = '';

		if (this._animated && e && e.hard) {
			this._clearBgBuffer();
		}

		this._initContainer();
	},

	_getTileSize: function () {
		var map = this._map,
		    zoom = map.getZoom() + this.options.zoomOffset,
		    zoomN = this.options.maxNativeZoom,
		    tileSize = this.options.tileSize;

		if (zoomN && zoom > zoomN) {
			tileSize = Math.round(map.getZoomScale(zoom) / map.getZoomScale(zoomN) * tileSize);
		}

		return tileSize;
	},

	_update: function () {

		if (!this._map) { return; }

		var map = this._map,
		    bounds = map.getPixelBounds(),
		    zoom = map.getZoom(),
		    tileSize = this._getTileSize();

		if (zoom > this.options.maxZoom || zoom < this.options.minZoom) {
			return;
		}

		var tileBounds = L.bounds(
		        bounds.min.divideBy(tileSize)._floor(),
		        bounds.max.divideBy(tileSize)._floor());

		this._addTilesFromCenterOut(tileBounds);

		if (this.options.unloadInvisibleTiles || this.options.reuseTiles) {
			this._removeOtherTiles(tileBounds);
		}
	},

	_addTilesFromCenterOut: function (bounds) {
		var queue = [],
		    center = bounds.getCenter();

		var j, i, point;

		for (j = bounds.min.y; j <= bounds.max.y; j++) {
			for (i = bounds.min.x; i <= bounds.max.x; i++) {
				point = new L.Point(i, j);

				if (this._tileShouldBeLoaded(point)) {
					queue.push(point);
				}
			}
		}

		var tilesToLoad = queue.length;

		if (tilesToLoad === 0) { return; }

		// load tiles in order of their distance to center
		queue.sort(function (a, b) {
			return a.distanceTo(center) - b.distanceTo(center);
		});

		var fragment = document.createDocumentFragment();

		// if its the first batch of tiles to load
		if (!this._tilesToLoad) {
			this.fire('loading');
		}

		this._tilesToLoad += tilesToLoad;

		for (i = 0; i < tilesToLoad; i++) {
			this._addTile(queue[i], fragment);
		}

		this._tileContainer.appendChild(fragment);
	},

	_tileShouldBeLoaded: function (tilePoint) {
		if ((tilePoint.x + ':' + tilePoint.y) in this._tiles) {
			return false; // already loaded
		}

		var options = this.options;

		if (!options.continuousWorld) {
			var limit = this._getWrapTileNum();

			// don't load if exceeds world bounds
			if ((options.noWrap && (tilePoint.x < 0 || tilePoint.x >= limit.x)) ||
				tilePoint.y < 0 || tilePoint.y >= limit.y) { return false; }
		}

		if (options.bounds) {
			var tileSize = options.tileSize,
			    nwPoint = tilePoint.multiplyBy(tileSize),
			    sePoint = nwPoint.add([tileSize, tileSize]),
			    nw = this._map.unproject(nwPoint),
			    se = this._map.unproject(sePoint);

			// TODO temporary hack, will be removed after refactoring projections
			// https://github.com/Leaflet/Leaflet/issues/1618
			if (!options.continuousWorld && !options.noWrap) {
				nw = nw.wrap();
				se = se.wrap();
			}

			if (!options.bounds.intersects([nw, se])) { return false; }
		}

		return true;
	},

	_removeOtherTiles: function (bounds) {
		var kArr, x, y, key;

		for (key in this._tiles) {
			kArr = key.split(':');
			x = parseInt(kArr[0], 10);
			y = parseInt(kArr[1], 10);

			// remove tile if it's out of bounds
			if (x < bounds.min.x || x > bounds.max.x || y < bounds.min.y || y > bounds.max.y) {
				this._removeTile(key);
			}
		}
	},

	_removeTile: function (key) {
		var tile = this._tiles[key];

		this.fire('tileunload', {tile: tile, url: tile.src});

		if (this.options.reuseTiles) {
			L.DomUtil.removeClass(tile, 'leaflet-tile-loaded');
			this._unusedTiles.push(tile);

		} else if (tile.parentNode === this._tileContainer) {
			this._tileContainer.removeChild(tile);
		}

		// for https://github.com/CloudMade/Leaflet/issues/137
		if (!L.Browser.android) {
			tile.onload = null;
			tile.src = L.Util.emptyImageUrl;
		}

		delete this._tiles[key];
	},

	_addTile: function (tilePoint, container) {
		var tilePos = this._getTilePos(tilePoint);

		// get unused tile - or create a new tile
		var tile = this._getTile();

		/*
		Chrome 20 layouts much faster with top/left (verify with timeline, frames)
		Android 4 browser has display issues with top/left and requires transform instead
		(other browsers don't currently care) - see debug/hacks/jitter.html for an example
		*/
		L.DomUtil.setPosition(tile, tilePos, L.Browser.chrome);

		this._tiles[tilePoint.x + ':' + tilePoint.y] = tile;

		this._loadTile(tile, tilePoint);

		if (tile.parentNode !== this._tileContainer) {
			container.appendChild(tile);
		}
	},

	_getZoomForUrl: function () {

		var options = this.options,
		    zoom = this._map.getZoom();

		if (options.zoomReverse) {
			zoom = options.maxZoom - zoom;
		}

		zoom += options.zoomOffset;

		return options.maxNativeZoom ? Math.min(zoom, options.maxNativeZoom) : zoom;
	},

	_getTilePos: function (tilePoint) {
		var origin = this._map.getPixelOrigin(),
		    tileSize = this._getTileSize();

		return tilePoint.multiplyBy(tileSize).subtract(origin);
	},

	// image-specific code (override to implement e.g. Canvas or SVG tile layer)

	getTileUrl: function (tilePoint) {
		return L.Util.template(this._url, L.extend({
			s: this._getSubdomain(tilePoint),
			z: tilePoint.z,
			x: tilePoint.x,
			y: tilePoint.y
		}, this.options));
	},

	_getWrapTileNum: function () {
		var crs = this._map.options.crs,
		    size = crs.getSize(this._map.getZoom());
		return size.divideBy(this._getTileSize())._floor();
	},

	_adjustTilePoint: function (tilePoint) {

		var limit = this._getWrapTileNum();

		// wrap tile coordinates
		if (!this.options.continuousWorld && !this.options.noWrap) {
			tilePoint.x = ((tilePoint.x % limit.x) + limit.x) % limit.x;
		}

		if (this.options.tms) {
			tilePoint.y = limit.y - tilePoint.y - 1;
		}

		tilePoint.z = this._getZoomForUrl();
	},

	_getSubdomain: function (tilePoint) {
		var index = Math.abs(tilePoint.x + tilePoint.y) % this.options.subdomains.length;
		return this.options.subdomains[index];
	},

	_getTile: function () {
		if (this.options.reuseTiles && this._unusedTiles.length > 0) {
			var tile = this._unusedTiles.pop();
			this._resetTile(tile);
			return tile;
		}
		return this._createTile();
	},

	// Override if data stored on a tile needs to be cleaned up before reuse
	_resetTile: function (/*tile*/) {},

	_createTile: function () {
		var tile = L.DomUtil.create('img', 'leaflet-tile');
		tile.style.width = tile.style.height = this._getTileSize() + 'px';
		tile.galleryimg = 'no';

		tile.onselectstart = tile.onmousemove = L.Util.falseFn;

		if (L.Browser.ielt9 && this.options.opacity !== undefined) {
			L.DomUtil.setOpacity(tile, this.options.opacity);
		}
		// without this hack, tiles disappear after zoom on Chrome for Android
		// https://github.com/Leaflet/Leaflet/issues/2078
		if (L.Browser.mobileWebkit3d) {
			tile.style.WebkitBackfaceVisibility = 'hidden';
		}
		return tile;
	},

	_loadTile: function (tile, tilePoint) {
		tile._layer  = this;
		tile.onload  = this._tileOnLoad;
		tile.onerror = this._tileOnError;

		this._adjustTilePoint(tilePoint);
		tile.src     = this.getTileUrl(tilePoint);

		this.fire('tileloadstart', {
			tile: tile,
			url: tile.src
		});
	},

	_tileLoaded: function () {
		this._tilesToLoad--;

		if (this._animated) {
			L.DomUtil.addClass(this._tileContainer, 'leaflet-zoom-animated');
		}

		if (!this._tilesToLoad) {
			this.fire('load');

			if (this._animated) {
				// clear scaled tiles after all new tiles are loaded (for performance)
				clearTimeout(this._clearBgBufferTimer);
				this._clearBgBufferTimer = setTimeout(L.bind(this._clearBgBuffer, this), 500);
			}
		}
	},

	_tileOnLoad: function () {
		var layer = this._layer;

		//Only if we are loading an actual image
		if (this.src !== L.Util.emptyImageUrl) {
			L.DomUtil.addClass(this, 'leaflet-tile-loaded');

			layer.fire('tileload', {
				tile: this,
				url: this.src
			});
		}

		layer._tileLoaded();
	},

	_tileOnError: function () {
		var layer = this._layer;

		layer.fire('tileerror', {
			tile: this,
			url: this.src
		});

		var newUrl = layer.options.errorTileUrl;
		if (newUrl) {
			this.src = newUrl;
		}

		layer._tileLoaded();
	}
});

L.tileLayer = function (url, options) {
	return new L.TileLayer(url, options);
};


/*
 * L.TileLayer.WMS is used for putting WMS tile layers on the map.
 */

L.TileLayer.WMS = L.TileLayer.extend({

	defaultWmsParams: {
		service: 'WMS',
		request: 'GetMap',
		version: '1.1.1',
		layers: '',
		styles: '',
		format: 'image/jpeg',
		transparent: false
	},

	initialize: function (url, options) { // (String, Object)

		this._url = url;

		var wmsParams = L.extend({}, this.defaultWmsParams),
		    tileSize = options.tileSize || this.options.tileSize;

		if (options.detectRetina && L.Browser.retina) {
			wmsParams.width = wmsParams.height = tileSize * 2;
		} else {
			wmsParams.width = wmsParams.height = tileSize;
		}

		for (var i in options) {
			// all keys that are not TileLayer options go to WMS params
			if (!this.options.hasOwnProperty(i) && i !== 'crs') {
				wmsParams[i] = options[i];
			}
		}

		this.wmsParams = wmsParams;

		L.setOptions(this, options);
	},

	onAdd: function (map) {

		this._crs = this.options.crs || map.options.crs;

		this._wmsVersion = parseFloat(this.wmsParams.version);

		var projectionKey = this._wmsVersion >= 1.3 ? 'crs' : 'srs';
		this.wmsParams[projectionKey] = this._crs.code;

		L.TileLayer.prototype.onAdd.call(this, map);
	},

	getTileUrl: function (tilePoint) { // (Point, Number) -> String

		var map = this._map,
		    tileSize = this.options.tileSize,

		    nwPoint = tilePoint.multiplyBy(tileSize),
		    sePoint = nwPoint.add([tileSize, tileSize]),

		    nw = this._crs.project(map.unproject(nwPoint, tilePoint.z)),
		    se = this._crs.project(map.unproject(sePoint, tilePoint.z)),
		    bbox = this._wmsVersion >= 1.3 && this._crs === L.CRS.EPSG4326 ?
		        [se.y, nw.x, nw.y, se.x].join(',') :
		        [nw.x, se.y, se.x, nw.y].join(','),

		    url = L.Util.template(this._url, {s: this._getSubdomain(tilePoint)});

		return url + L.Util.getParamString(this.wmsParams, url, true) + '&BBOX=' + bbox;
	},

	setParams: function (params, noRedraw) {

		L.extend(this.wmsParams, params);

		if (!noRedraw) {
			this.redraw();
		}

		return this;
	}
});

L.tileLayer.wms = function (url, options) {
	return new L.TileLayer.WMS(url, options);
};


/*
 * L.TileLayer.Canvas is a class that you can use as a base for creating
 * dynamically drawn Canvas-based tile layers.
 */

L.TileLayer.Canvas = L.TileLayer.extend({
	options: {
		async: false
	},

	initialize: function (options) {
		L.setOptions(this, options);
	},

	redraw: function () {
		if (this._map) {
			this._reset({hard: true});
			this._update();
		}

		for (var i in this._tiles) {
			this._redrawTile(this._tiles[i]);
		}
		return this;
	},

	_redrawTile: function (tile) {
		this.drawTile(tile, tile._tilePoint, this._map._zoom);
	},

	_createTile: function () {
		var tile = L.DomUtil.create('canvas', 'leaflet-tile');
		tile.width = tile.height = this.options.tileSize;
		tile.onselectstart = tile.onmousemove = L.Util.falseFn;
		return tile;
	},

	_loadTile: function (tile, tilePoint) {
		tile._layer = this;
		tile._tilePoint = tilePoint;

		this._redrawTile(tile);

		if (!this.options.async) {
			this.tileDrawn(tile);
		}
	},

	drawTile: function (/*tile, tilePoint*/) {
		// override with rendering code
	},

	tileDrawn: function (tile) {
		this._tileOnLoad.call(tile);
	}
});


L.tileLayer.canvas = function (options) {
	return new L.TileLayer.Canvas(options);
};


/*
 * L.ImageOverlay is used to overlay images over the map (to specific geographical bounds).
 */

L.ImageOverlay = L.Class.extend({
	includes: L.Mixin.Events,

	options: {
		opacity: 1
	},

	initialize: function (url, bounds, options) { // (String, LatLngBounds, Object)
		this._url = url;
		this._bounds = L.latLngBounds(bounds);

		L.setOptions(this, options);
	},

	onAdd: function (map) {
		this._map = map;

		if (!this._image) {
			this._initImage();
		}

		map._panes.overlayPane.appendChild(this._image);

		map.on('viewreset', this._reset, this);

		if (map.options.zoomAnimation && L.Browser.any3d) {
			map.on('zoomanim', this._animateZoom, this);
		}

		this._reset();
	},

	onRemove: function (map) {
		map.getPanes().overlayPane.removeChild(this._image);

		map.off('viewreset', this._reset, this);

		if (map.options.zoomAnimation) {
			map.off('zoomanim', this._animateZoom, this);
		}
	},

	addTo: function (map) {
		map.addLayer(this);
		return this;
	},

	setOpacity: function (opacity) {
		this.options.opacity = opacity;
		this._updateOpacity();
		return this;
	},

	// TODO remove bringToFront/bringToBack duplication from TileLayer/Path
	bringToFront: function () {
		if (this._image) {
			this._map._panes.overlayPane.appendChild(this._image);
		}
		return this;
	},

	bringToBack: function () {
		var pane = this._map._panes.overlayPane;
		if (this._image) {
			pane.insertBefore(this._image, pane.firstChild);
		}
		return this;
	},

	setUrl: function (url) {
		this._url = url;
		this._image.src = this._url;
	},

	getAttribution: function () {
		return this.options.attribution;
	},

	_initImage: function () {
		this._image = L.DomUtil.create('img', 'leaflet-image-layer');

		if (this._map.options.zoomAnimation && L.Browser.any3d) {
			L.DomUtil.addClass(this._image, 'leaflet-zoom-animated');
		} else {
			L.DomUtil.addClass(this._image, 'leaflet-zoom-hide');
		}

		this._updateOpacity();

		//TODO createImage util method to remove duplication
		L.extend(this._image, {
			galleryimg: 'no',
			onselectstart: L.Util.falseFn,
			onmousemove: L.Util.falseFn,
			onload: L.bind(this._onImageLoad, this),
			src: this._url
		});
	},

	_animateZoom: function (e) {
		var map = this._map,
		    image = this._image,
		    scale = map.getZoomScale(e.zoom),
		    nw = this._bounds.getNorthWest(),
		    se = this._bounds.getSouthEast(),

		    topLeft = map._latLngToNewLayerPoint(nw, e.zoom, e.center),
		    size = map._latLngToNewLayerPoint(se, e.zoom, e.center)._subtract(topLeft),
		    origin = topLeft._add(size._multiplyBy((1 / 2) * (1 - 1 / scale)));

		image.style[L.DomUtil.TRANSFORM] =
		        L.DomUtil.getTranslateString(origin) + ' scale(' + scale + ') ';
	},

	_reset: function () {
		var image   = this._image,
		    topLeft = this._map.latLngToLayerPoint(this._bounds.getNorthWest()),
		    size = this._map.latLngToLayerPoint(this._bounds.getSouthEast())._subtract(topLeft);

		L.DomUtil.setPosition(image, topLeft);

		image.style.width  = size.x + 'px';
		image.style.height = size.y + 'px';
	},

	_onImageLoad: function () {
		this.fire('load');
	},

	_updateOpacity: function () {
		L.DomUtil.setOpacity(this._image, this.options.opacity);
	}
});

L.imageOverlay = function (url, bounds, options) {
	return new L.ImageOverlay(url, bounds, options);
};


/*
 * L.Icon is an image-based icon class that you can use with L.Marker for custom markers.
 */

L.Icon = L.Class.extend({
	options: {
		/*
		iconUrl: (String) (required)
		iconRetinaUrl: (String) (optional, used for retina devices if detected)
		iconSize: (Point) (can be set through CSS)
		iconAnchor: (Point) (centered by default, can be set in CSS with negative margins)
		popupAnchor: (Point) (if not specified, popup opens in the anchor point)
		shadowUrl: (String) (no shadow by default)
		shadowRetinaUrl: (String) (optional, used for retina devices if detected)
		shadowSize: (Point)
		shadowAnchor: (Point)
		*/
		className: ''
	},

	initialize: function (options) {
		L.setOptions(this, options);
	},

	createIcon: function (oldIcon) {
		return this._createIcon('icon', oldIcon);
	},

	createShadow: function (oldIcon) {
		return this._createIcon('shadow', oldIcon);
	},

	_createIcon: function (name, oldIcon) {
		var src = this._getIconUrl(name);

		if (!src) {
			if (name === 'icon') {
				throw new Error('iconUrl not set in Icon options (see the docs).');
			}
			return null;
		}

		var img;
		if (!oldIcon || oldIcon.tagName !== 'IMG') {
			img = this._createImg(src);
		} else {
			img = this._createImg(src, oldIcon);
		}
		this._setIconStyles(img, name);

		return img;
	},

	_setIconStyles: function (img, name) {
		var options = this.options,
		    size = L.point(options[name + 'Size']),
		    anchor;

		if (name === 'shadow') {
			anchor = L.point(options.shadowAnchor || options.iconAnchor);
		} else {
			anchor = L.point(options.iconAnchor);
		}

		if (!anchor && size) {
			anchor = size.divideBy(2, true);
		}

		img.className = 'leaflet-marker-' + name + ' ' + options.className;

		if (anchor) {
			img.style.marginLeft = (-anchor.x) + 'px';
			img.style.marginTop  = (-anchor.y) + 'px';
		}

		if (size) {
			img.style.width  = size.x + 'px';
			img.style.height = size.y + 'px';
		}
	},

	_createImg: function (src, el) {
		el = el || document.createElement('img');
		el.src = src;
		return el;
	},

	_getIconUrl: function (name) {
		if (L.Browser.retina && this.options[name + 'RetinaUrl']) {
			return this.options[name + 'RetinaUrl'];
		}
		return this.options[name + 'Url'];
	}
});

L.icon = function (options) {
	return new L.Icon(options);
};


/*
 * L.Icon.Default is the blue marker icon used by default in Leaflet.
 */

L.Icon.Default = L.Icon.extend({

	options: {
		iconSize: [25, 41],
		iconAnchor: [12, 41],
		popupAnchor: [1, -34],

		shadowSize: [41, 41]
	},

	_getIconUrl: function (name) {
		var key = name + 'Url';

		if (this.options[key]) {
			return this.options[key];
		}

		if (L.Browser.retina && name === 'icon') {
			name += '-2x';
		}

		var path = L.Icon.Default.imagePath;

		if (!path) {
			throw new Error('Couldn\'t autodetect L.Icon.Default.imagePath, set it manually.');
		}

		return path + '/marker-' + name + '.png';
	}
});

L.Icon.Default.imagePath = (function () {
	var scripts = document.getElementsByTagName('script'),
	    leafletRe = /[\/^]leaflet[\-\._]?([\w\-\._]*)\.js\??/;

	var i, len, src, matches, path;

	for (i = 0, len = scripts.length; i < len; i++) {
		src = scripts[i].src;
		matches = src.match(leafletRe);

		if (matches) {
			path = src.split(leafletRe)[0];
			return (path ? path + '/' : '') + 'images';
		}
	}
}());


/*
 * L.Marker is used to display clickable/draggable icons on the map.
 */

L.Marker = L.Class.extend({

	includes: L.Mixin.Events,

	options: {
		icon: new L.Icon.Default(),
		title: '',
		alt: '',
		clickable: true,
		draggable: false,
		keyboard: true,
		zIndexOffset: 0,
		opacity: 1,
		riseOnHover: false,
		riseOffset: 250
	},

	initialize: function (latlng, options) {
		L.setOptions(this, options);
		this._latlng = L.latLng(latlng);
	},

	onAdd: function (map) {
		this._map = map;

		map.on('viewreset', this.update, this);

		this._initIcon();
		this.update();
		this.fire('add');

		if (map.options.zoomAnimation && map.options.markerZoomAnimation) {
			map.on('zoomanim', this._animateZoom, this);
		}
	},

	addTo: function (map) {
		map.addLayer(this);
		return this;
	},

	onRemove: function (map) {
		if (this.dragging) {
			this.dragging.disable();
		}

		this._removeIcon();
		this._removeShadow();

		this.fire('remove');

		map.off({
			'viewreset': this.update,
			'zoomanim': this._animateZoom
		}, this);

		this._map = null;
	},

	getLatLng: function () {
		return this._latlng;
	},

	setLatLng: function (latlng) {
		this._latlng = L.latLng(latlng);

		this.update();

		return this.fire('move', { latlng: this._latlng });
	},

	setZIndexOffset: function (offset) {
		this.options.zIndexOffset = offset;
		this.update();

		return this;
	},

	setIcon: function (icon) {

		this.options.icon = icon;

		if (this._map) {
			this._initIcon();
			this.update();
		}

		if (this._popup) {
			this.bindPopup(this._popup);
		}

		return this;
	},

	update: function () {
		if (this._icon) {
			var pos = this._map.latLngToLayerPoint(this._latlng).round();
			this._setPos(pos);
		}

		return this;
	},

	_initIcon: function () {
		var options = this.options,
		    map = this._map,
		    animation = (map.options.zoomAnimation && map.options.markerZoomAnimation),
		    classToAdd = animation ? 'leaflet-zoom-animated' : 'leaflet-zoom-hide';

		var icon = options.icon.createIcon(this._icon),
			addIcon = false;

		// if we're not reusing the icon, remove the old one and init new one
		if (icon !== this._icon) {
			if (this._icon) {
				this._removeIcon();
			}
			addIcon = true;

			if (options.title) {
				icon.title = options.title;
			}
			
			if (options.alt) {
				icon.alt = options.alt;
			}
		}

		L.DomUtil.addClass(icon, classToAdd);

		if (options.keyboard) {
			icon.tabIndex = '0';
		}

		this._icon = icon;

		this._initInteraction();

		if (options.riseOnHover) {
			L.DomEvent
				.on(icon, 'mouseover', this._bringToFront, this)
				.on(icon, 'mouseout', this._resetZIndex, this);
		}

		var newShadow = options.icon.createShadow(this._shadow),
			addShadow = false;

		if (newShadow !== this._shadow) {
			this._removeShadow();
			addShadow = true;
		}

		if (newShadow) {
			L.DomUtil.addClass(newShadow, classToAdd);
		}
		this._shadow = newShadow;


		if (options.opacity < 1) {
			this._updateOpacity();
		}


		var panes = this._map._panes;

		if (addIcon) {
			panes.markerPane.appendChild(this._icon);
		}

		if (newShadow && addShadow) {
			panes.shadowPane.appendChild(this._shadow);
		}
	},

	_removeIcon: function () {
		if (this.options.riseOnHover) {
			L.DomEvent
			    .off(this._icon, 'mouseover', this._bringToFront)
			    .off(this._icon, 'mouseout', this._resetZIndex);
		}

		this._map._panes.markerPane.removeChild(this._icon);

		this._icon = null;
	},

	_removeShadow: function () {
		if (this._shadow) {
			this._map._panes.shadowPane.removeChild(this._shadow);
		}
		this._shadow = null;
	},

	_setPos: function (pos) {
		L.DomUtil.setPosition(this._icon, pos);

		if (this._shadow) {
			L.DomUtil.setPosition(this._shadow, pos);
		}

		this._zIndex = pos.y + this.options.zIndexOffset;

		this._resetZIndex();
	},

	_updateZIndex: function (offset) {
		this._icon.style.zIndex = this._zIndex + offset;
	},

	_animateZoom: function (opt) {
		var pos = this._map._latLngToNewLayerPoint(this._latlng, opt.zoom, opt.center).round();

		this._setPos(pos);
	},

	_initInteraction: function () {

		if (!this.options.clickable) { return; }

		// TODO refactor into something shared with Map/Path/etc. to DRY it up

		var icon = this._icon,
		    events = ['dblclick', 'mousedown', 'mouseover', 'mouseout', 'contextmenu'];

		L.DomUtil.addClass(icon, 'leaflet-clickable');
		L.DomEvent.on(icon, 'click', this._onMouseClick, this);
		L.DomEvent.on(icon, 'keypress', this._onKeyPress, this);

		for (var i = 0; i < events.length; i++) {
			L.DomEvent.on(icon, events[i], this._fireMouseEvent, this);
		}

		if (L.Handler.MarkerDrag) {
			this.dragging = new L.Handler.MarkerDrag(this);

			if (this.options.draggable) {
				this.dragging.enable();
			}
		}
	},

	_onMouseClick: function (e) {
		var wasDragged = this.dragging && this.dragging.moved();

		if (this.hasEventListeners(e.type) || wasDragged) {
			L.DomEvent.stopPropagation(e);
		}

		if (wasDragged) { return; }

		if ((!this.dragging || !this.dragging._enabled) && this._map.dragging && this._map.dragging.moved()) { return; }

		this.fire(e.type, {
			originalEvent: e,
			latlng: this._latlng
		});
	},

	_onKeyPress: function (e) {
		if (e.keyCode === 13) {
			this.fire('click', {
				originalEvent: e,
				latlng: this._latlng
			});
		}
	},

	_fireMouseEvent: function (e) {

		this.fire(e.type, {
			originalEvent: e,
			latlng: this._latlng
		});

		// TODO proper custom event propagation
		// this line will always be called if marker is in a FeatureGroup
		if (e.type === 'contextmenu' && this.hasEventListeners(e.type)) {
			L.DomEvent.preventDefault(e);
		}
		if (e.type !== 'mousedown') {
			L.DomEvent.stopPropagation(e);
		} else {
			L.DomEvent.preventDefault(e);
		}
	},

	setOpacity: function (opacity) {
		this.options.opacity = opacity;
		if (this._map) {
			this._updateOpacity();
		}

		return this;
	},

	_updateOpacity: function () {
		L.DomUtil.setOpacity(this._icon, this.options.opacity);
		if (this._shadow) {
			L.DomUtil.setOpacity(this._shadow, this.options.opacity);
		}
	},

	_bringToFront: function () {
		this._updateZIndex(this.options.riseOffset);
	},

	_resetZIndex: function () {
		this._updateZIndex(0);
	}
});

L.marker = function (latlng, options) {
	return new L.Marker(latlng, options);
};


/*
 * L.DivIcon is a lightweight HTML-based icon class (as opposed to the image-based L.Icon)
 * to use with L.Marker.
 */

L.DivIcon = L.Icon.extend({
	options: {
		iconSize: [12, 12], // also can be set through CSS
		/*
		iconAnchor: (Point)
		popupAnchor: (Point)
		html: (String)
		bgPos: (Point)
		*/
		className: 'leaflet-div-icon',
		html: false
	},

	createIcon: function (oldIcon) {
		var div = (oldIcon && oldIcon.tagName === 'DIV') ? oldIcon : document.createElement('div'),
		    options = this.options;

		if (options.html !== false) {
			div.innerHTML = options.html;
		} else {
			div.innerHTML = '';
		}

		if (options.bgPos) {
			div.style.backgroundPosition =
			        (-options.bgPos.x) + 'px ' + (-options.bgPos.y) + 'px';
		}

		this._setIconStyles(div, 'icon');
		return div;
	},

	createShadow: function () {
		return null;
	}
});

L.divIcon = function (options) {
	return new L.DivIcon(options);
};


/*
 * L.Popup is used for displaying popups on the map.
 */

L.Map.mergeOptions({
	closePopupOnClick: true
});

L.Popup = L.Class.extend({
	includes: L.Mixin.Events,

	options: {
		minWidth: 50,
		maxWidth: 300,
		// maxHeight: null,
		autoPan: true,
		closeButton: true,
		offset: [0, 7],
		autoPanPadding: [5, 5],
		// autoPanPaddingTopLeft: null,
		// autoPanPaddingBottomRight: null,
		keepInView: false,
		className: '',
		zoomAnimation: true
	},

	initialize: function (options, source) {
		L.setOptions(this, options);

		this._source = source;
		this._animated = L.Browser.any3d && this.options.zoomAnimation;
		this._isOpen = false;
	},

	onAdd: function (map) {
		this._map = map;

		if (!this._container) {
			this._initLayout();
		}

		var animFade = map.options.fadeAnimation;

		if (animFade) {
			L.DomUtil.setOpacity(this._container, 0);
		}
		map._panes.popupPane.appendChild(this._container);

		map.on(this._getEvents(), this);

		this.update();

		if (animFade) {
			L.DomUtil.setOpacity(this._container, 1);
		}

		this.fire('open');

		map.fire('popupopen', {popup: this});

		if (this._source) {
			this._source.fire('popupopen', {popup: this});
		}
	},

	addTo: function (map) {
		map.addLayer(this);
		return this;
	},

	openOn: function (map) {
		map.openPopup(this);
		return this;
	},

	onRemove: function (map) {
		map._panes.popupPane.removeChild(this._container);

		L.Util.falseFn(this._container.offsetWidth); // force reflow

		map.off(this._getEvents(), this);

		if (map.options.fadeAnimation) {
			L.DomUtil.setOpacity(this._container, 0);
		}

		this._map = null;

		this.fire('close');

		map.fire('popupclose', {popup: this});

		if (this._source) {
			this._source.fire('popupclose', {popup: this});
		}
	},

	getLatLng: function () {
		return this._latlng;
	},

	setLatLng: function (latlng) {
		this._latlng = L.latLng(latlng);
		if (this._map) {
			this._updatePosition();
			this._adjustPan();
		}
		return this;
	},

	getContent: function () {
		return this._content;
	},

	setContent: function (content) {
		this._content = content;
		this.update();
		return this;
	},

	update: function () {
		if (!this._map) { return; }

		this._container.style.visibility = 'hidden';

		this._updateContent();
		this._updateLayout();
		this._updatePosition();

		this._container.style.visibility = '';

		this._adjustPan();
	},

	_getEvents: function () {
		var events = {
			viewreset: this._updatePosition
		};

		if (this._animated) {
			events.zoomanim = this._zoomAnimation;
		}
		if ('closeOnClick' in this.options ? this.options.closeOnClick : this._map.options.closePopupOnClick) {
			events.preclick = this._close;
		}
		if (this.options.keepInView) {
			events.moveend = this._adjustPan;
		}

		return events;
	},

	_close: function () {
		if (this._map) {
			this._map.closePopup(this);
		}
	},

	_initLayout: function () {
		var prefix = 'leaflet-popup',
			containerClass = prefix + ' ' + this.options.className + ' leaflet-zoom-' +
			        (this._animated ? 'animated' : 'hide'),
			container = this._container = L.DomUtil.create('div', containerClass),
			closeButton;

		if (this.options.closeButton) {
			closeButton = this._closeButton =
			        L.DomUtil.create('a', prefix + '-close-button', container);
			closeButton.href = '#close';
			closeButton.innerHTML = '&#215;';
			L.DomEvent.disableClickPropagation(closeButton);

			L.DomEvent.on(closeButton, 'click', this._onCloseButtonClick, this);
		}

		var wrapper = this._wrapper =
		        L.DomUtil.create('div', prefix + '-content-wrapper', container);
		L.DomEvent.disableClickPropagation(wrapper);

		this._contentNode = L.DomUtil.create('div', prefix + '-content', wrapper);

		L.DomEvent.disableScrollPropagation(this._contentNode);
		L.DomEvent.on(wrapper, 'contextmenu', L.DomEvent.stopPropagation);

		this._tipContainer = L.DomUtil.create('div', prefix + '-tip-container', container);
		this._tip = L.DomUtil.create('div', prefix + '-tip', this._tipContainer);
	},

	_updateContent: function () {
		if (!this._content) { return; }

		if (typeof this._content === 'string') {
			this._contentNode.innerHTML = this._content;
		} else {
			while (this._contentNode.hasChildNodes()) {
				this._contentNode.removeChild(this._contentNode.firstChild);
			}
			this._contentNode.appendChild(this._content);
		}
		this.fire('contentupdate');
	},

	_updateLayout: function () {
		var container = this._contentNode,
		    style = container.style;

		style.width = '';
		style.whiteSpace = 'nowrap';

		var width = container.offsetWidth;
		width = Math.min(width, this.options.maxWidth);
		width = Math.max(width, this.options.minWidth);

		style.width = (width + 1) + 'px';
		style.whiteSpace = '';

		style.height = '';

		var height = container.offsetHeight,
		    maxHeight = this.options.maxHeight,
		    scrolledClass = 'leaflet-popup-scrolled';

		if (maxHeight && height > maxHeight) {
			style.height = maxHeight + 'px';
			L.DomUtil.addClass(container, scrolledClass);
		} else {
			L.DomUtil.removeClass(container, scrolledClass);
		}

		this._containerWidth = this._container.offsetWidth;
	},

	_updatePosition: function () {
		if (!this._map) { return; }

		var pos = this._map.latLngToLayerPoint(this._latlng),
		    animated = this._animated,
		    offset = L.point(this.options.offset);

		if (animated) {
			L.DomUtil.setPosition(this._container, pos);
		}

		this._containerBottom = -offset.y - (animated ? 0 : pos.y);
		this._containerLeft = -Math.round(this._containerWidth / 2) + offset.x + (animated ? 0 : pos.x);

		// bottom position the popup in case the height of the popup changes (images loading etc)
		this._container.style.bottom = this._containerBottom + 'px';
		this._container.style.left = this._containerLeft + 'px';
	},

	_zoomAnimation: function (opt) {
		var pos = this._map._latLngToNewLayerPoint(this._latlng, opt.zoom, opt.center);

		L.DomUtil.setPosition(this._container, pos);
	},

	_adjustPan: function () {
		if (!this.options.autoPan) { return; }

		var map = this._map,
		    containerHeight = this._container.offsetHeight,
		    containerWidth = this._containerWidth,

		    layerPos = new L.Point(this._containerLeft, -containerHeight - this._containerBottom);

		if (this._animated) {
			layerPos._add(L.DomUtil.getPosition(this._container));
		}

		var containerPos = map.layerPointToContainerPoint(layerPos),
		    padding = L.point(this.options.autoPanPadding),
		    paddingTL = L.point(this.options.autoPanPaddingTopLeft || padding),
		    paddingBR = L.point(this.options.autoPanPaddingBottomRight || padding),
		    size = map.getSize(),
		    dx = 0,
		    dy = 0;

		if (containerPos.x + containerWidth + paddingBR.x > size.x) { // right
			dx = containerPos.x + containerWidth - size.x + paddingBR.x;
		}
		if (containerPos.x - dx - paddingTL.x < 0) { // left
			dx = containerPos.x - paddingTL.x;
		}
		if (containerPos.y + containerHeight + paddingBR.y > size.y) { // bottom
			dy = containerPos.y + containerHeight - size.y + paddingBR.y;
		}
		if (containerPos.y - dy - paddingTL.y < 0) { // top
			dy = containerPos.y - paddingTL.y;
		}

		if (dx || dy) {
			map
			    .fire('autopanstart')
			    .panBy([dx, dy]);
		}
	},

	_onCloseButtonClick: function (e) {
		this._close();
		L.DomEvent.stop(e);
	}
});

L.popup = function (options, source) {
	return new L.Popup(options, source);
};


L.Map.include({
	openPopup: function (popup, latlng, options) { // (Popup) or (String || HTMLElement, LatLng[, Object])
		this.closePopup();

		if (!(popup instanceof L.Popup)) {
			var content = popup;

			popup = new L.Popup(options)
			    .setLatLng(latlng)
			    .setContent(content);
		}
		popup._isOpen = true;

		this._popup = popup;
		return this.addLayer(popup);
	},

	closePopup: function (popup) {
		if (!popup || popup === this._popup) {
			popup = this._popup;
			this._popup = null;
		}
		if (popup) {
			this.removeLayer(popup);
			popup._isOpen = false;
		}
		return this;
	}
});


/*
 * Popup extension to L.Marker, adding popup-related methods.
 */

L.Marker.include({
	openPopup: function () {
		if (this._popup && this._map && !this._map.hasLayer(this._popup)) {
			this._popup.setLatLng(this._latlng);
			this._map.openPopup(this._popup);
		}

		return this;
	},

	closePopup: function () {
		if (this._popup) {
			this._popup._close();
		}
		return this;
	},

	togglePopup: function () {
		if (this._popup) {
			if (this._popup._isOpen) {
				this.closePopup();
			} else {
				this.openPopup();
			}
		}
		return this;
	},

	bindPopup: function (content, options) {
		var anchor = L.point(this.options.icon.options.popupAnchor || [0, 0]);

		anchor = anchor.add(L.Popup.prototype.options.offset);

		if (options && options.offset) {
			anchor = anchor.add(options.offset);
		}

		options = L.extend({offset: anchor}, options);

		if (!this._popupHandlersAdded) {
			this
			    .on('click', this.togglePopup, this)
			    .on('remove', this.closePopup, this)
			    .on('move', this._movePopup, this);
			this._popupHandlersAdded = true;
		}

		if (content instanceof L.Popup) {
			L.setOptions(content, options);
			this._popup = content;
		} else {
			this._popup = new L.Popup(options, this)
				.setContent(content);
		}

		return this;
	},

	setPopupContent: function (content) {
		if (this._popup) {
			this._popup.setContent(content);
		}
		return this;
	},

	unbindPopup: function () {
		if (this._popup) {
			this._popup = null;
			this
			    .off('click', this.togglePopup, this)
			    .off('remove', this.closePopup, this)
			    .off('move', this._movePopup, this);
			this._popupHandlersAdded = false;
		}
		return this;
	},

	getPopup: function () {
		return this._popup;
	},

	_movePopup: function (e) {
		this._popup.setLatLng(e.latlng);
	}
});


/*
 * L.LayerGroup is a class to combine several layers into one so that
 * you can manipulate the group (e.g. add/remove it) as one layer.
 */

L.LayerGroup = L.Class.extend({
	initialize: function (layers) {
		this._layers = {};

		var i, len;

		if (layers) {
			for (i = 0, len = layers.length; i < len; i++) {
				this.addLayer(layers[i]);
			}
		}
	},

	addLayer: function (layer) {
		var id = this.getLayerId(layer);

		this._layers[id] = layer;

		if (this._map) {
			this._map.addLayer(layer);
		}

		return this;
	},

	removeLayer: function (layer) {
		var id = layer in this._layers ? layer : this.getLayerId(layer);

		if (this._map && this._layers[id]) {
			this._map.removeLayer(this._layers[id]);
		}

		delete this._layers[id];

		return this;
	},

	hasLayer: function (layer) {
		if (!layer) { return false; }

		return (layer in this._layers || this.getLayerId(layer) in this._layers);
	},

	clearLayers: function () {
		this.eachLayer(this.removeLayer, this);
		return this;
	},

	invoke: function (methodName) {
		var args = Array.prototype.slice.call(arguments, 1),
		    i, layer;

		for (i in this._layers) {
			layer = this._layers[i];

			if (layer[methodName]) {
				layer[methodName].apply(layer, args);
			}
		}

		return this;
	},

	onAdd: function (map) {
		this._map = map;
		this.eachLayer(map.addLayer, map);
	},

	onRemove: function (map) {
		this.eachLayer(map.removeLayer, map);
		this._map = null;
	},

	addTo: function (map) {
		map.addLayer(this);
		return this;
	},

	eachLayer: function (method, context) {
		for (var i in this._layers) {
			method.call(context, this._layers[i]);
		}
		return this;
	},

	getLayer: function (id) {
		return this._layers[id];
	},

	getLayers: function () {
		var layers = [];

		for (var i in this._layers) {
			layers.push(this._layers[i]);
		}
		return layers;
	},

	setZIndex: function (zIndex) {
		return this.invoke('setZIndex', zIndex);
	},

	getLayerId: function (layer) {
		return L.stamp(layer);
	}
});

L.layerGroup = function (layers) {
	return new L.LayerGroup(layers);
};


/*
 * L.FeatureGroup extends L.LayerGroup by introducing mouse events and additional methods
 * shared between a group of interactive layers (like vectors or markers).
 */

L.FeatureGroup = L.LayerGroup.extend({
	includes: L.Mixin.Events,

	statics: {
		EVENTS: 'click dblclick mouseover mouseout mousemove contextmenu popupopen popupclose'
	},

	addLayer: function (layer) {
		if (this.hasLayer(layer)) {
			return this;
		}

		if ('on' in layer) {
			layer.on(L.FeatureGroup.EVENTS, this._propagateEvent, this);
		}

		L.LayerGroup.prototype.addLayer.call(this, layer);

		if (this._popupContent && layer.bindPopup) {
			layer.bindPopup(this._popupContent, this._popupOptions);
		}

		return this.fire('layeradd', {layer: layer});
	},

	removeLayer: function (layer) {
		if (!this.hasLayer(layer)) {
			return this;
		}
		if (layer in this._layers) {
			layer = this._layers[layer];
		}

		layer.off(L.FeatureGroup.EVENTS, this._propagateEvent, this);

		L.LayerGroup.prototype.removeLayer.call(this, layer);

		if (this._popupContent) {
			this.invoke('unbindPopup');
		}

		return this.fire('layerremove', {layer: layer});
	},

	bindPopup: function (content, options) {
		this._popupContent = content;
		this._popupOptions = options;
		return this.invoke('bindPopup', content, options);
	},

	openPopup: function (latlng) {
		// open popup on the first layer
		for (var id in this._layers) {
			this._layers[id].openPopup(latlng);
			break;
		}
		return this;
	},

	setStyle: function (style) {
		return this.invoke('setStyle', style);
	},

	bringToFront: function () {
		return this.invoke('bringToFront');
	},

	bringToBack: function () {
		return this.invoke('bringToBack');
	},

	getBounds: function () {
		var bounds = new L.LatLngBounds();

		this.eachLayer(function (layer) {
			bounds.extend(layer instanceof L.Marker ? layer.getLatLng() : layer.getBounds());
		});

		return bounds;
	},

	_propagateEvent: function (e) {
		e = L.extend({
			layer: e.target,
			target: this
		}, e);
		this.fire(e.type, e);
	}
});

L.featureGroup = function (layers) {
	return new L.FeatureGroup(layers);
};


/*
 * L.Path is a base class for rendering vector paths on a map. Inherited by Polyline, Circle, etc.
 */

L.Path = L.Class.extend({
	includes: [L.Mixin.Events],

	statics: {
		// how much to extend the clip area around the map view
		// (relative to its size, e.g. 0.5 is half the screen in each direction)
		// set it so that SVG element doesn't exceed 1280px (vectors flicker on dragend if it is)
		CLIP_PADDING: (function () {
			var max = L.Browser.mobile ? 1280 : 2000,
			    target = (max / Math.max(window.outerWidth, window.outerHeight) - 1) / 2;
			return Math.max(0, Math.min(0.5, target));
		})()
	},

	options: {
		stroke: true,
		color: '#0033ff',
		dashArray: null,
		lineCap: null,
		lineJoin: null,
		weight: 5,
		opacity: 0.5,

		fill: false,
		fillColor: null, //same as color by default
		fillOpacity: 0.2,

		clickable: true
	},

	initialize: function (options) {
		L.setOptions(this, options);
	},

	onAdd: function (map) {
		this._map = map;

		if (!this._container) {
			this._initElements();
			this._initEvents();
		}

		this.projectLatlngs();
		this._updatePath();

		if (this._container) {
			this._map._pathRoot.appendChild(this._container);
		}

		this.fire('add');

		map.on({
			'viewreset': this.projectLatlngs,
			'moveend': this._updatePath
		}, this);
	},

	addTo: function (map) {
		map.addLayer(this);
		return this;
	},

	onRemove: function (map) {
		map._pathRoot.removeChild(this._container);

		// Need to fire remove event before we set _map to null as the event hooks might need the object
		this.fire('remove');
		this._map = null;

		if (L.Browser.vml) {
			this._container = null;
			this._stroke = null;
			this._fill = null;
		}

		map.off({
			'viewreset': this.projectLatlngs,
			'moveend': this._updatePath
		}, this);
	},

	projectLatlngs: function () {
		// do all projection stuff here
	},

	setStyle: function (style) {
		L.setOptions(this, style);

		if (this._container) {
			this._updateStyle();
		}

		return this;
	},

	redraw: function () {
		if (this._map) {
			this.projectLatlngs();
			this._updatePath();
		}
		return this;
	}
});

L.Map.include({
	_updatePathViewport: function () {
		var p = L.Path.CLIP_PADDING,
		    size = this.getSize(),
		    panePos = L.DomUtil.getPosition(this._mapPane),
		    min = panePos.multiplyBy(-1)._subtract(size.multiplyBy(p)._round()),
		    max = min.add(size.multiplyBy(1 + p * 2)._round());

		this._pathViewport = new L.Bounds(min, max);
	}
});


/*
 * Extends L.Path with SVG-specific rendering code.
 */

L.Path.SVG_NS = 'http://www.w3.org/2000/svg';

L.Browser.svg = !!(document.createElementNS && document.createElementNS(L.Path.SVG_NS, 'svg').createSVGRect);

L.Path = L.Path.extend({
	statics: {
		SVG: L.Browser.svg
	},

	bringToFront: function () {
		var root = this._map._pathRoot,
		    path = this._container;

		if (path && root.lastChild !== path) {
			root.appendChild(path);
		}
		return this;
	},

	bringToBack: function () {
		var root = this._map._pathRoot,
		    path = this._container,
		    first = root.firstChild;

		if (path && first !== path) {
			root.insertBefore(path, first);
		}
		return this;
	},

	getPathString: function () {
		// form path string here
	},

	_createElement: function (name) {
		return document.createElementNS(L.Path.SVG_NS, name);
	},

	_initElements: function () {
		this._map._initPathRoot();
		this._initPath();
		this._initStyle();
	},

	_initPath: function () {
		this._container = this._createElement('g');

		this._path = this._createElement('path');

		if (this.options.className) {
			L.DomUtil.addClass(this._path, this.options.className);
		}

		this._container.appendChild(this._path);
	},

	_initStyle: function () {
		if (this.options.stroke) {
			this._path.setAttribute('stroke-linejoin', 'round');
			this._path.setAttribute('stroke-linecap', 'round');
		}
		if (this.options.fill) {
			this._path.setAttribute('fill-rule', 'evenodd');
		}
		if (this.options.pointerEvents) {
			this._path.setAttribute('pointer-events', this.options.pointerEvents);
		}
		if (!this.options.clickable && !this.options.pointerEvents) {
			this._path.setAttribute('pointer-events', 'none');
		}
		this._updateStyle();
	},

	_updateStyle: function () {
		if (this.options.stroke) {
			this._path.setAttribute('stroke', this.options.color);
			this._path.setAttribute('stroke-opacity', this.options.opacity);
			this._path.setAttribute('stroke-width', this.options.weight);
			if (this.options.dashArray) {
				this._path.setAttribute('stroke-dasharray', this.options.dashArray);
			} else {
				this._path.removeAttribute('stroke-dasharray');
			}
			if (this.options.lineCap) {
				this._path.setAttribute('stroke-linecap', this.options.lineCap);
			}
			if (this.options.lineJoin) {
				this._path.setAttribute('stroke-linejoin', this.options.lineJoin);
			}
		} else {
			this._path.setAttribute('stroke', 'none');
		}
		if (this.options.fill) {
			this._path.setAttribute('fill', this.options.fillColor || this.options.color);
			this._path.setAttribute('fill-opacity', this.options.fillOpacity);
		} else {
			this._path.setAttribute('fill', 'none');
		}
	},

	_updatePath: function () {
		var str = this.getPathString();
		if (!str) {
			// fix webkit empty string parsing bug
			str = 'M0 0';
		}
		this._path.setAttribute('d', str);
	},

	// TODO remove duplication with L.Map
	_initEvents: function () {
		if (this.options.clickable) {
			if (L.Browser.svg || !L.Browser.vml) {
				L.DomUtil.addClass(this._path, 'leaflet-clickable');
			}

			L.DomEvent.on(this._container, 'click', this._onMouseClick, this);

			var events = ['dblclick', 'mousedown', 'mouseover',
			              'mouseout', 'mousemove', 'contextmenu'];
			for (var i = 0; i < events.length; i++) {
				L.DomEvent.on(this._container, events[i], this._fireMouseEvent, this);
			}
		}
	},

	_onMouseClick: function (e) {
		if (this._map.dragging && this._map.dragging.moved()) { return; }

		this._fireMouseEvent(e);
	},

	_fireMouseEvent: function (e) {
		if (!this.hasEventListeners(e.type)) { return; }

		var map = this._map,
		    containerPoint = map.mouseEventToContainerPoint(e),
		    layerPoint = map.containerPointToLayerPoint(containerPoint),
		    latlng = map.layerPointToLatLng(layerPoint);

		this.fire(e.type, {
			latlng: latlng,
			layerPoint: layerPoint,
			containerPoint: containerPoint,
			originalEvent: e
		});

		if (e.type === 'contextmenu') {
			L.DomEvent.preventDefault(e);
		}
		if (e.type !== 'mousemove') {
			L.DomEvent.stopPropagation(e);
		}
	}
});

L.Map.include({
	_initPathRoot: function () {
		if (!this._pathRoot) {
			this._pathRoot = L.Path.prototype._createElement('svg');
			this._panes.overlayPane.appendChild(this._pathRoot);

			if (this.options.zoomAnimation && L.Browser.any3d) {
				L.DomUtil.addClass(this._pathRoot, 'leaflet-zoom-animated');

				this.on({
					'zoomanim': this._animatePathZoom,
					'zoomend': this._endPathZoom
				});
			} else {
				L.DomUtil.addClass(this._pathRoot, 'leaflet-zoom-hide');
			}

			this.on('moveend', this._updateSvgViewport);
			this._updateSvgViewport();
		}
	},

	_animatePathZoom: function (e) {
		var scale = this.getZoomScale(e.zoom),
		    offset = this._getCenterOffset(e.center)._multiplyBy(-scale)._add(this._pathViewport.min);

		this._pathRoot.style[L.DomUtil.TRANSFORM] =
		        L.DomUtil.getTranslateString(offset) + ' scale(' + scale + ') ';

		this._pathZooming = true;
	},

	_endPathZoom: function () {
		this._pathZooming = false;
	},

	_updateSvgViewport: function () {

		if (this._pathZooming) {
			// Do not update SVGs while a zoom animation is going on otherwise the animation will break.
			// When the zoom animation ends we will be updated again anyway
			// This fixes the case where you do a momentum move and zoom while the move is still ongoing.
			return;
		}

		this._updatePathViewport();

		var vp = this._pathViewport,
		    min = vp.min,
		    max = vp.max,
		    width = max.x - min.x,
		    height = max.y - min.y,
		    root = this._pathRoot,
		    pane = this._panes.overlayPane;

		// Hack to make flicker on drag end on mobile webkit less irritating
		if (L.Browser.mobileWebkit) {
			pane.removeChild(root);
		}

		L.DomUtil.setPosition(root, min);
		root.setAttribute('width', width);
		root.setAttribute('height', height);
		root.setAttribute('viewBox', [min.x, min.y, width, height].join(' '));

		if (L.Browser.mobileWebkit) {
			pane.appendChild(root);
		}
	}
});


/*
 * Popup extension to L.Path (polylines, polygons, circles), adding popup-related methods.
 */

L.Path.include({

	bindPopup: function (content, options) {

		if (content instanceof L.Popup) {
			this._popup = content;
		} else {
			if (!this._popup || options) {
				this._popup = new L.Popup(options, this);
			}
			this._popup.setContent(content);
		}

		if (!this._popupHandlersAdded) {
			this
			    .on('click', this._openPopup, this)
			    .on('remove', this.closePopup, this);

			this._popupHandlersAdded = true;
		}

		return this;
	},

	unbindPopup: function () {
		if (this._popup) {
			this._popup = null;
			this
			    .off('click', this._openPopup)
			    .off('remove', this.closePopup);

			this._popupHandlersAdded = false;
		}
		return this;
	},

	openPopup: function (latlng) {

		if (this._popup) {
			// open the popup from one of the path's points if not specified
			latlng = latlng || this._latlng ||
			         this._latlngs[Math.floor(this._latlngs.length / 2)];

			this._openPopup({latlng: latlng});
		}

		return this;
	},

	closePopup: function () {
		if (this._popup) {
			this._popup._close();
		}
		return this;
	},

	_openPopup: function (e) {
		this._popup.setLatLng(e.latlng);
		this._map.openPopup(this._popup);
	}
});


/*
 * Vector rendering for IE6-8 through VML.
 * Thanks to Dmitry Baranovsky and his Raphael library for inspiration!
 */

L.Browser.vml = !L.Browser.svg && (function () {
	try {
		var div = document.createElement('div');
		div.innerHTML = '<v:shape adj="1"/>';

		var shape = div.firstChild;
		shape.style.behavior = 'url(#default#VML)';

		return shape && (typeof shape.adj === 'object');

	} catch (e) {
		return false;
	}
}());

L.Path = L.Browser.svg || !L.Browser.vml ? L.Path : L.Path.extend({
	statics: {
		VML: true,
		CLIP_PADDING: 0.02
	},

	_createElement: (function () {
		try {
			document.namespaces.add('lvml', 'urn:schemas-microsoft-com:vml');
			return function (name) {
				return document.createElement('<lvml:' + name + ' class="lvml">');
			};
		} catch (e) {
			return function (name) {
				return document.createElement(
				        '<' + name + ' xmlns="urn:schemas-microsoft.com:vml" class="lvml">');
			};
		}
	}()),

	_initPath: function () {
		var container = this._container = this._createElement('shape');

		L.DomUtil.addClass(container, 'leaflet-vml-shape' +
			(this.options.className ? ' ' + this.options.className : ''));

		if (this.options.clickable) {
			L.DomUtil.addClass(container, 'leaflet-clickable');
		}

		container.coordsize = '1 1';

		this._path = this._createElement('path');
		container.appendChild(this._path);

		this._map._pathRoot.appendChild(container);
	},

	_initStyle: function () {
		this._updateStyle();
	},

	_updateStyle: function () {
		var stroke = this._stroke,
		    fill = this._fill,
		    options = this.options,
		    container = this._container;

		container.stroked = options.stroke;
		container.filled = options.fill;

		if (options.stroke) {
			if (!stroke) {
				stroke = this._stroke = this._createElement('stroke');
				stroke.endcap = 'round';
				container.appendChild(stroke);
			}
			stroke.weight = options.weight + 'px';
			stroke.color = options.color;
			stroke.opacity = options.opacity;

			if (options.dashArray) {
				stroke.dashStyle = L.Util.isArray(options.dashArray) ?
				    options.dashArray.join(' ') :
				    options.dashArray.replace(/( *, *)/g, ' ');
			} else {
				stroke.dashStyle = '';
			}
			if (options.lineCap) {
				stroke.endcap = options.lineCap.replace('butt', 'flat');
			}
			if (options.lineJoin) {
				stroke.joinstyle = options.lineJoin;
			}

		} else if (stroke) {
			container.removeChild(stroke);
			this._stroke = null;
		}

		if (options.fill) {
			if (!fill) {
				fill = this._fill = this._createElement('fill');
				container.appendChild(fill);
			}
			fill.color = options.fillColor || options.color;
			fill.opacity = options.fillOpacity;

		} else if (fill) {
			container.removeChild(fill);
			this._fill = null;
		}
	},

	_updatePath: function () {
		var style = this._container.style;

		style.display = 'none';
		this._path.v = this.getPathString() + ' '; // the space fixes IE empty path string bug
		style.display = '';
	}
});

L.Map.include(L.Browser.svg || !L.Browser.vml ? {} : {
	_initPathRoot: function () {
		if (this._pathRoot) { return; }

		var root = this._pathRoot = document.createElement('div');
		root.className = 'leaflet-vml-container';
		this._panes.overlayPane.appendChild(root);

		this.on('moveend', this._updatePathViewport);
		this._updatePathViewport();
	}
});


/*
 * Vector rendering for all browsers that support canvas.
 */

L.Browser.canvas = (function () {
	return !!document.createElement('canvas').getContext;
}());

L.Path = (L.Path.SVG && !window.L_PREFER_CANVAS) || !L.Browser.canvas ? L.Path : L.Path.extend({
	statics: {
		//CLIP_PADDING: 0.02, // not sure if there's a need to set it to a small value
		CANVAS: true,
		SVG: false
	},

	redraw: function () {
		if (this._map) {
			this.projectLatlngs();
			this._requestUpdate();
		}
		return this;
	},

	setStyle: function (style) {
		L.setOptions(this, style);

		if (this._map) {
			this._updateStyle();
			this._requestUpdate();
		}
		return this;
	},

	onRemove: function (map) {
		map
		    .off('viewreset', this.projectLatlngs, this)
		    .off('moveend', this._updatePath, this);

		if (this.options.clickable) {
			this._map.off('click', this._onClick, this);
			this._map.off('mousemove', this._onMouseMove, this);
		}

		this._requestUpdate();
		
		this.fire('remove');
		this._map = null;
	},

	_requestUpdate: function () {
		if (this._map && !L.Path._updateRequest) {
			L.Path._updateRequest = L.Util.requestAnimFrame(this._fireMapMoveEnd, this._map);
		}
	},

	_fireMapMoveEnd: function () {
		L.Path._updateRequest = null;
		this.fire('moveend');
	},

	_initElements: function () {
		this._map._initPathRoot();
		this._ctx = this._map._canvasCtx;
	},

	_updateStyle: function () {
		var options = this.options;

		if (options.stroke) {
			this._ctx.lineWidth = options.weight;
			this._ctx.strokeStyle = options.color;
		}
		if (options.fill) {
			this._ctx.fillStyle = options.fillColor || options.color;
		}
	},

	_drawPath: function () {
		var i, j, len, len2, point, drawMethod;

		this._ctx.beginPath();

		for (i = 0, len = this._parts.length; i < len; i++) {
			for (j = 0, len2 = this._parts[i].length; j < len2; j++) {
				point = this._parts[i][j];
				drawMethod = (j === 0 ? 'move' : 'line') + 'To';

				this._ctx[drawMethod](point.x, point.y);
			}
			// TODO refactor ugly hack
			if (this instanceof L.Polygon) {
				this._ctx.closePath();
			}
		}
	},

	_checkIfEmpty: function () {
		return !this._parts.length;
	},

	_updatePath: function () {
		if (this._checkIfEmpty()) { return; }

		var ctx = this._ctx,
		    options = this.options;

		this._drawPath();
		ctx.save();
		this._updateStyle();

		if (options.fill) {
			ctx.globalAlpha = options.fillOpacity;
			ctx.fill();
		}

		if (options.stroke) {
			ctx.globalAlpha = options.opacity;
			ctx.stroke();
		}

		ctx.restore();

		// TODO optimization: 1 fill/stroke for all features with equal style instead of 1 for each feature
	},

	_initEvents: function () {
		if (this.options.clickable) {
			// TODO dblclick
			this._map.on('mousemove', this._onMouseMove, this);
			this._map.on('click', this._onClick, this);
		}
	},

	_onClick: function (e) {
		if (this._containsPoint(e.layerPoint)) {
			this.fire('click', e);
		}
	},

	_onMouseMove: function (e) {
		if (!this._map || this._map._animatingZoom) { return; }

		// TODO don't do on each move
		if (this._containsPoint(e.layerPoint)) {
			this._ctx.canvas.style.cursor = 'pointer';
			this._mouseInside = true;
			this.fire('mouseover', e);

		} else if (this._mouseInside) {
			this._ctx.canvas.style.cursor = '';
			this._mouseInside = false;
			this.fire('mouseout', e);
		}
	}
});

L.Map.include((L.Path.SVG && !window.L_PREFER_CANVAS) || !L.Browser.canvas ? {} : {
	_initPathRoot: function () {
		var root = this._pathRoot,
		    ctx;

		if (!root) {
			root = this._pathRoot = document.createElement('canvas');
			root.style.position = 'absolute';
			ctx = this._canvasCtx = root.getContext('2d');

			ctx.lineCap = 'round';
			ctx.lineJoin = 'round';

			this._panes.overlayPane.appendChild(root);

			if (this.options.zoomAnimation) {
				this._pathRoot.className = 'leaflet-zoom-animated';
				this.on('zoomanim', this._animatePathZoom);
				this.on('zoomend', this._endPathZoom);
			}
			this.on('moveend', this._updateCanvasViewport);
			this._updateCanvasViewport();
		}
	},

	_updateCanvasViewport: function () {
		// don't redraw while zooming. See _updateSvgViewport for more details
		if (this._pathZooming) { return; }
		this._updatePathViewport();

		var vp = this._pathViewport,
		    min = vp.min,
		    size = vp.max.subtract(min),
		    root = this._pathRoot;

		//TODO check if this works properly on mobile webkit
		L.DomUtil.setPosition(root, min);
		root.width = size.x;
		root.height = size.y;
		root.getContext('2d').translate(-min.x, -min.y);
	}
});


/*
 * L.LineUtil contains different utility functions for line segments
 * and polylines (clipping, simplification, distances, etc.)
 */

/*jshint bitwise:false */ // allow bitwise operations for this file

L.LineUtil = {

	// Simplify polyline with vertex reduction and Douglas-Peucker simplification.
	// Improves rendering performance dramatically by lessening the number of points to draw.

	simplify: function (/*Point[]*/ points, /*Number*/ tolerance) {
		if (!tolerance || !points.length) {
			return points.slice();
		}

		var sqTolerance = tolerance * tolerance;

		// stage 1: vertex reduction
		points = this._reducePoints(points, sqTolerance);

		// stage 2: Douglas-Peucker simplification
		points = this._simplifyDP(points, sqTolerance);

		return points;
	},

	// distance from a point to a segment between two points
	pointToSegmentDistance:  function (/*Point*/ p, /*Point*/ p1, /*Point*/ p2) {
		return Math.sqrt(this._sqClosestPointOnSegment(p, p1, p2, true));
	},

	closestPointOnSegment: function (/*Point*/ p, /*Point*/ p1, /*Point*/ p2) {
		return this._sqClosestPointOnSegment(p, p1, p2);
	},

	// Douglas-Peucker simplification, see http://en.wikipedia.org/wiki/Douglas-Peucker_algorithm
	_simplifyDP: function (points, sqTolerance) {

		var len = points.length,
		    ArrayConstructor = typeof Uint8Array !== undefined + '' ? Uint8Array : Array,
		    markers = new ArrayConstructor(len);

		markers[0] = markers[len - 1] = 1;

		this._simplifyDPStep(points, markers, sqTolerance, 0, len - 1);

		var i,
		    newPoints = [];

		for (i = 0; i < len; i++) {
			if (markers[i]) {
				newPoints.push(points[i]);
			}
		}

		return newPoints;
	},

	_simplifyDPStep: function (points, markers, sqTolerance, first, last) {

		var maxSqDist = 0,
		    index, i, sqDist;

		for (i = first + 1; i <= last - 1; i++) {
			sqDist = this._sqClosestPointOnSegment(points[i], points[first], points[last], true);

			if (sqDist > maxSqDist) {
				index = i;
				maxSqDist = sqDist;
			}
		}

		if (maxSqDist > sqTolerance) {
			markers[index] = 1;

			this._simplifyDPStep(points, markers, sqTolerance, first, index);
			this._simplifyDPStep(points, markers, sqTolerance, index, last);
		}
	},

	// reduce points that are too close to each other to a single point
	_reducePoints: function (points, sqTolerance) {
		var reducedPoints = [points[0]];

		for (var i = 1, prev = 0, len = points.length; i < len; i++) {
			if (this._sqDist(points[i], points[prev]) > sqTolerance) {
				reducedPoints.push(points[i]);
				prev = i;
			}
		}
		if (prev < len - 1) {
			reducedPoints.push(points[len - 1]);
		}
		return reducedPoints;
	},

	// Cohen-Sutherland line clipping algorithm.
	// Used to avoid rendering parts of a polyline that are not currently visible.

	clipSegment: function (a, b, bounds, useLastCode) {
		var codeA = useLastCode ? this._lastCode : this._getBitCode(a, bounds),
		    codeB = this._getBitCode(b, bounds),

		    codeOut, p, newCode;

		// save 2nd code to avoid calculating it on the next segment
		this._lastCode = codeB;

		while (true) {
			// if a,b is inside the clip window (trivial accept)
			if (!(codeA | codeB)) {
				return [a, b];
			// if a,b is outside the clip window (trivial reject)
			} else if (codeA & codeB) {
				return false;
			// other cases
			} else {
				codeOut = codeA || codeB;
				p = this._getEdgeIntersection(a, b, codeOut, bounds);
				newCode = this._getBitCode(p, bounds);

				if (codeOut === codeA) {
					a = p;
					codeA = newCode;
				} else {
					b = p;
					codeB = newCode;
				}
			}
		}
	},

	_getEdgeIntersection: function (a, b, code, bounds) {
		var dx = b.x - a.x,
		    dy = b.y - a.y,
		    min = bounds.min,
		    max = bounds.max;

		if (code & 8) { // top
			return new L.Point(a.x + dx * (max.y - a.y) / dy, max.y);
		} else if (code & 4) { // bottom
			return new L.Point(a.x + dx * (min.y - a.y) / dy, min.y);
		} else if (code & 2) { // right
			return new L.Point(max.x, a.y + dy * (max.x - a.x) / dx);
		} else if (code & 1) { // left
			return new L.Point(min.x, a.y + dy * (min.x - a.x) / dx);
		}
	},

	_getBitCode: function (/*Point*/ p, bounds) {
		var code = 0;

		if (p.x < bounds.min.x) { // left
			code |= 1;
		} else if (p.x > bounds.max.x) { // right
			code |= 2;
		}
		if (p.y < bounds.min.y) { // bottom
			code |= 4;
		} else if (p.y > bounds.max.y) { // top
			code |= 8;
		}

		return code;
	},

	// square distance (to avoid unnecessary Math.sqrt calls)
	_sqDist: function (p1, p2) {
		var dx = p2.x - p1.x,
		    dy = p2.y - p1.y;
		return dx * dx + dy * dy;
	},

	// return closest point on segment or distance to that point
	_sqClosestPointOnSegment: function (p, p1, p2, sqDist) {
		var x = p1.x,
		    y = p1.y,
		    dx = p2.x - x,
		    dy = p2.y - y,
		    dot = dx * dx + dy * dy,
		    t;

		if (dot > 0) {
			t = ((p.x - x) * dx + (p.y - y) * dy) / dot;

			if (t > 1) {
				x = p2.x;
				y = p2.y;
			} else if (t > 0) {
				x += dx * t;
				y += dy * t;
			}
		}

		dx = p.x - x;
		dy = p.y - y;

		return sqDist ? dx * dx + dy * dy : new L.Point(x, y);
	}
};


/*
 * L.Polyline is used to display polylines on a map.
 */

L.Polyline = L.Path.extend({
	initialize: function (latlngs, options) {
		L.Path.prototype.initialize.call(this, options);

		this._latlngs = this._convertLatLngs(latlngs);
	},

	options: {
		// how much to simplify the polyline on each zoom level
		// more = better performance and smoother look, less = more accurate
		smoothFactor: 1.0,
		noClip: false
	},

	projectLatlngs: function () {
		this._originalPoints = [];

		for (var i = 0, len = this._latlngs.length; i < len; i++) {
			this._originalPoints[i] = this._map.latLngToLayerPoint(this._latlngs[i]);
		}
	},

	getPathString: function () {
		for (var i = 0, len = this._parts.length, str = ''; i < len; i++) {
			str += this._getPathPartStr(this._parts[i]);
		}
		return str;
	},

	getLatLngs: function () {
		return this._latlngs;
	},

	setLatLngs: function (latlngs) {
		this._latlngs = this._convertLatLngs(latlngs);
		return this.redraw();
	},

	addLatLng: function (latlng) {
		this._latlngs.push(L.latLng(latlng));
		return this.redraw();
	},

	spliceLatLngs: function () { // (Number index, Number howMany)
		var removed = [].splice.apply(this._latlngs, arguments);
		this._convertLatLngs(this._latlngs, true);
		this.redraw();
		return removed;
	},

	closestLayerPoint: function (p) {
		var minDistance = Infinity, parts = this._parts, p1, p2, minPoint = null;

		for (var j = 0, jLen = parts.length; j < jLen; j++) {
			var points = parts[j];
			for (var i = 1, len = points.length; i < len; i++) {
				p1 = points[i - 1];
				p2 = points[i];
				var sqDist = L.LineUtil._sqClosestPointOnSegment(p, p1, p2, true);
				if (sqDist < minDistance) {
					minDistance = sqDist;
					minPoint = L.LineUtil._sqClosestPointOnSegment(p, p1, p2);
				}
			}
		}
		if (minPoint) {
			minPoint.distance = Math.sqrt(minDistance);
		}
		return minPoint;
	},

	getBounds: function () {
		return new L.LatLngBounds(this.getLatLngs());
	},

	_convertLatLngs: function (latlngs, overwrite) {
		var i, len, target = overwrite ? latlngs : [];

		for (i = 0, len = latlngs.length; i < len; i++) {
			if (L.Util.isArray(latlngs[i]) && typeof latlngs[i][0] !== 'number') {
				return;
			}
			target[i] = L.latLng(latlngs[i]);
		}
		return target;
	},

	_initEvents: function () {
		L.Path.prototype._initEvents.call(this);
	},

	_getPathPartStr: function (points) {
		var round = L.Path.VML;

		for (var j = 0, len2 = points.length, str = '', p; j < len2; j++) {
			p = points[j];
			if (round) {
				p._round();
			}
			str += (j ? 'L' : 'M') + p.x + ' ' + p.y;
		}
		return str;
	},

	_clipPoints: function () {
		var points = this._originalPoints,
		    len = points.length,
		    i, k, segment;

		if (this.options.noClip) {
			this._parts = [points];
			return;
		}

		this._parts = [];

		var parts = this._parts,
		    vp = this._map._pathViewport,
		    lu = L.LineUtil;

		for (i = 0, k = 0; i < len - 1; i++) {
			segment = lu.clipSegment(points[i], points[i + 1], vp, i);
			if (!segment) {
				continue;
			}

			parts[k] = parts[k] || [];
			parts[k].push(segment[0]);

			// if segment goes out of screen, or it's the last one, it's the end of the line part
			if ((segment[1] !== points[i + 1]) || (i === len - 2)) {
				parts[k].push(segment[1]);
				k++;
			}
		}
	},

	// simplify each clipped part of the polyline
	_simplifyPoints: function () {
		var parts = this._parts,
		    lu = L.LineUtil;

		for (var i = 0, len = parts.length; i < len; i++) {
			parts[i] = lu.simplify(parts[i], this.options.smoothFactor);
		}
	},

	_updatePath: function () {
		if (!this._map) { return; }

		this._clipPoints();
		this._simplifyPoints();

		L.Path.prototype._updatePath.call(this);
	}
});

L.polyline = function (latlngs, options) {
	return new L.Polyline(latlngs, options);
};


/*
 * L.PolyUtil contains utility functions for polygons (clipping, etc.).
 */

/*jshint bitwise:false */ // allow bitwise operations here

L.PolyUtil = {};

/*
 * Sutherland-Hodgeman polygon clipping algorithm.
 * Used to avoid rendering parts of a polygon that are not currently visible.
 */
L.PolyUtil.clipPolygon = function (points, bounds) {
	var clippedPoints,
	    edges = [1, 4, 2, 8],
	    i, j, k,
	    a, b,
	    len, edge, p,
	    lu = L.LineUtil;

	for (i = 0, len = points.length; i < len; i++) {
		points[i]._code = lu._getBitCode(points[i], bounds);
	}

	// for each edge (left, bottom, right, top)
	for (k = 0; k < 4; k++) {
		edge = edges[k];
		clippedPoints = [];

		for (i = 0, len = points.length, j = len - 1; i < len; j = i++) {
			a = points[i];
			b = points[j];

			// if a is inside the clip window
			if (!(a._code & edge)) {
				// if b is outside the clip window (a->b goes out of screen)
				if (b._code & edge) {
					p = lu._getEdgeIntersection(b, a, edge, bounds);
					p._code = lu._getBitCode(p, bounds);
					clippedPoints.push(p);
				}
				clippedPoints.push(a);

			// else if b is inside the clip window (a->b enters the screen)
			} else if (!(b._code & edge)) {
				p = lu._getEdgeIntersection(b, a, edge, bounds);
				p._code = lu._getBitCode(p, bounds);
				clippedPoints.push(p);
			}
		}
		points = clippedPoints;
	}

	return points;
};


/*
 * L.Polygon is used to display polygons on a map.
 */

L.Polygon = L.Polyline.extend({
	options: {
		fill: true
	},

	initialize: function (latlngs, options) {
		L.Polyline.prototype.initialize.call(this, latlngs, options);
		this._initWithHoles(latlngs);
	},

	_initWithHoles: function (latlngs) {
		var i, len, hole;
		if (latlngs && L.Util.isArray(latlngs[0]) && (typeof latlngs[0][0] !== 'number')) {
			this._latlngs = this._convertLatLngs(latlngs[0]);
			this._holes = latlngs.slice(1);

			for (i = 0, len = this._holes.length; i < len; i++) {
				hole = this._holes[i] = this._convertLatLngs(this._holes[i]);
				if (hole[0].equals(hole[hole.length - 1])) {
					hole.pop();
				}
			}
		}

		// filter out last point if its equal to the first one
		latlngs = this._latlngs;

		if (latlngs.length >= 2 && latlngs[0].equals(latlngs[latlngs.length - 1])) {
			latlngs.pop();
		}
	},

	projectLatlngs: function () {
		L.Polyline.prototype.projectLatlngs.call(this);

		// project polygon holes points
		// TODO move this logic to Polyline to get rid of duplication
		this._holePoints = [];

		if (!this._holes) { return; }

		var i, j, len, len2;

		for (i = 0, len = this._holes.length; i < len; i++) {
			this._holePoints[i] = [];

			for (j = 0, len2 = this._holes[i].length; j < len2; j++) {
				this._holePoints[i][j] = this._map.latLngToLayerPoint(this._holes[i][j]);
			}
		}
	},

	setLatLngs: function (latlngs) {
		if (latlngs && L.Util.isArray(latlngs[0]) && (typeof latlngs[0][0] !== 'number')) {
			this._initWithHoles(latlngs);
			return this.redraw();
		} else {
			return L.Polyline.prototype.setLatLngs.call(this, latlngs);
		}
	},

	_clipPoints: function () {
		var points = this._originalPoints,
		    newParts = [];

		this._parts = [points].concat(this._holePoints);

		if (this.options.noClip) { return; }

		for (var i = 0, len = this._parts.length; i < len; i++) {
			var clipped = L.PolyUtil.clipPolygon(this._parts[i], this._map._pathViewport);
			if (clipped.length) {
				newParts.push(clipped);
			}
		}

		this._parts = newParts;
	},

	_getPathPartStr: function (points) {
		var str = L.Polyline.prototype._getPathPartStr.call(this, points);
		return str + (L.Browser.svg ? 'z' : 'x');
	}
});

L.polygon = function (latlngs, options) {
	return new L.Polygon(latlngs, options);
};


/*
 * Contains L.MultiPolyline and L.MultiPolygon layers.
 */

(function () {
	function createMulti(Klass) {

		return L.FeatureGroup.extend({

			initialize: function (latlngs, options) {
				this._layers = {};
				this._options = options;
				this.setLatLngs(latlngs);
			},

			setLatLngs: function (latlngs) {
				var i = 0,
				    len = latlngs.length;

				this.eachLayer(function (layer) {
					if (i < len) {
						layer.setLatLngs(latlngs[i++]);
					} else {
						this.removeLayer(layer);
					}
				}, this);

				while (i < len) {
					this.addLayer(new Klass(latlngs[i++], this._options));
				}

				return this;
			},

			getLatLngs: function () {
				var latlngs = [];

				this.eachLayer(function (layer) {
					latlngs.push(layer.getLatLngs());
				});

				return latlngs;
			}
		});
	}

	L.MultiPolyline = createMulti(L.Polyline);
	L.MultiPolygon = createMulti(L.Polygon);

	L.multiPolyline = function (latlngs, options) {
		return new L.MultiPolyline(latlngs, options);
	};

	L.multiPolygon = function (latlngs, options) {
		return new L.MultiPolygon(latlngs, options);
	};
}());


/*
 * L.Rectangle extends Polygon and creates a rectangle when passed a LatLngBounds object.
 */

L.Rectangle = L.Polygon.extend({
	initialize: function (latLngBounds, options) {
		L.Polygon.prototype.initialize.call(this, this._boundsToLatLngs(latLngBounds), options);
	},

	setBounds: function (latLngBounds) {
		this.setLatLngs(this._boundsToLatLngs(latLngBounds));
	},

	_boundsToLatLngs: function (latLngBounds) {
		latLngBounds = L.latLngBounds(latLngBounds);
		return [
			latLngBounds.getSouthWest(),
			latLngBounds.getNorthWest(),
			latLngBounds.getNorthEast(),
			latLngBounds.getSouthEast()
		];
	}
});

L.rectangle = function (latLngBounds, options) {
	return new L.Rectangle(latLngBounds, options);
};


/*
 * L.Circle is a circle overlay (with a certain radius in meters).
 */

L.Circle = L.Path.extend({
	initialize: function (latlng, radius, options) {
		L.Path.prototype.initialize.call(this, options);

		this._latlng = L.latLng(latlng);
		this._mRadius = radius;
	},

	options: {
		fill: true
	},

	setLatLng: function (latlng) {
		this._latlng = L.latLng(latlng);
		return this.redraw();
	},

	setRadius: function (radius) {
		this._mRadius = radius;
		return this.redraw();
	},

	projectLatlngs: function () {
		var lngRadius = this._getLngRadius(),
		    latlng = this._latlng,
		    pointLeft = this._map.latLngToLayerPoint([latlng.lat, latlng.lng - lngRadius]);

		this._point = this._map.latLngToLayerPoint(latlng);
		this._radius = Math.max(this._point.x - pointLeft.x, 1);
	},

	getBounds: function () {
		var lngRadius = this._getLngRadius(),
		    latRadius = (this._mRadius / 40075017) * 360,
		    latlng = this._latlng;

		return new L.LatLngBounds(
		        [latlng.lat - latRadius, latlng.lng - lngRadius],
		        [latlng.lat + latRadius, latlng.lng + lngRadius]);
	},

	getLatLng: function () {
		return this._latlng;
	},

	getPathString: function () {
		var p = this._point,
		    r = this._radius;

		if (this._checkIfEmpty()) {
			return '';
		}

		if (L.Browser.svg) {
			return 'M' + p.x + ',' + (p.y - r) +
			       'A' + r + ',' + r + ',0,1,1,' +
			       (p.x - 0.1) + ',' + (p.y - r) + ' z';
		} else {
			p._round();
			r = Math.round(r);
			return 'AL ' + p.x + ',' + p.y + ' ' + r + ',' + r + ' 0,' + (65535 * 360);
		}
	},

	getRadius: function () {
		return this._mRadius;
	},

	// TODO Earth hardcoded, move into projection code!

	_getLatRadius: function () {
		return (this._mRadius / 40075017) * 360;
	},

	_getLngRadius: function () {
		return this._getLatRadius() / Math.cos(L.LatLng.DEG_TO_RAD * this._latlng.lat);
	},

	_checkIfEmpty: function () {
		if (!this._map) {
			return false;
		}
		var vp = this._map._pathViewport,
		    r = this._radius,
		    p = this._point;

		return p.x - r > vp.max.x || p.y - r > vp.max.y ||
		       p.x + r < vp.min.x || p.y + r < vp.min.y;
	}
});

L.circle = function (latlng, radius, options) {
	return new L.Circle(latlng, radius, options);
};


/*
 * L.CircleMarker is a circle overlay with a permanent pixel radius.
 */

L.CircleMarker = L.Circle.extend({
	options: {
		radius: 10,
		weight: 2
	},

	initialize: function (latlng, options) {
		L.Circle.prototype.initialize.call(this, latlng, null, options);
		this._radius = this.options.radius;
	},

	projectLatlngs: function () {
		this._point = this._map.latLngToLayerPoint(this._latlng);
	},

	_updateStyle : function () {
		L.Circle.prototype._updateStyle.call(this);
		this.setRadius(this.options.radius);
	},

	setLatLng: function (latlng) {
		L.Circle.prototype.setLatLng.call(this, latlng);
		if (this._popup && this._popup._isOpen) {
			this._popup.setLatLng(latlng);
		}
		return this;
	},

	setRadius: function (radius) {
		this.options.radius = this._radius = radius;
		return this.redraw();
	},

	getRadius: function () {
		return this._radius;
	}
});

L.circleMarker = function (latlng, options) {
	return new L.CircleMarker(latlng, options);
};


/*
 * Extends L.Polyline to be able to manually detect clicks on Canvas-rendered polylines.
 */

L.Polyline.include(!L.Path.CANVAS ? {} : {
	_containsPoint: function (p, closed) {
		var i, j, k, len, len2, dist, part,
		    w = this.options.weight / 2;

		if (L.Browser.touch) {
			w += 10; // polyline click tolerance on touch devices
		}

		for (i = 0, len = this._parts.length; i < len; i++) {
			part = this._parts[i];
			for (j = 0, len2 = part.length, k = len2 - 1; j < len2; k = j++) {
				if (!closed && (j === 0)) {
					continue;
				}

				dist = L.LineUtil.pointToSegmentDistance(p, part[k], part[j]);

				if (dist <= w) {
					return true;
				}
			}
		}
		return false;
	}
});


/*
 * Extends L.Polygon to be able to manually detect clicks on Canvas-rendered polygons.
 */

L.Polygon.include(!L.Path.CANVAS ? {} : {
	_containsPoint: function (p) {
		var inside = false,
		    part, p1, p2,
		    i, j, k,
		    len, len2;

		// TODO optimization: check if within bounds first

		if (L.Polyline.prototype._containsPoint.call(this, p, true)) {
			// click on polygon border
			return true;
		}

		// ray casting algorithm for detecting if point is in polygon

		for (i = 0, len = this._parts.length; i < len; i++) {
			part = this._parts[i];

			for (j = 0, len2 = part.length, k = len2 - 1; j < len2; k = j++) {
				p1 = part[j];
				p2 = part[k];

				if (((p1.y > p.y) !== (p2.y > p.y)) &&
						(p.x < (p2.x - p1.x) * (p.y - p1.y) / (p2.y - p1.y) + p1.x)) {
					inside = !inside;
				}
			}
		}

		return inside;
	}
});


/*
 * Extends L.Circle with Canvas-specific code.
 */

L.Circle.include(!L.Path.CANVAS ? {} : {
	_drawPath: function () {
		var p = this._point;
		this._ctx.beginPath();
		this._ctx.arc(p.x, p.y, this._radius, 0, Math.PI * 2, false);
	},

	_containsPoint: function (p) {
		var center = this._point,
		    w2 = this.options.stroke ? this.options.weight / 2 : 0;

		return (p.distanceTo(center) <= this._radius + w2);
	}
});


/*
 * CircleMarker canvas specific drawing parts.
 */

L.CircleMarker.include(!L.Path.CANVAS ? {} : {
	_updateStyle: function () {
		L.Path.prototype._updateStyle.call(this);
	}
});


/*
 * L.GeoJSON turns any GeoJSON data into a Leaflet layer.
 */

L.GeoJSON = L.FeatureGroup.extend({

	initialize: function (geojson, options) {
		L.setOptions(this, options);

		this._layers = {};

		if (geojson) {
			this.addData(geojson);
		}
	},

	addData: function (geojson) {
		var features = L.Util.isArray(geojson) ? geojson : geojson.features,
		    i, len, feature;

		if (features) {
			for (i = 0, len = features.length; i < len; i++) {
				// Only add this if geometry or geometries are set and not null
				feature = features[i];
				if (feature.geometries || feature.geometry || feature.features || feature.coordinates) {
					this.addData(features[i]);
				}
			}
			return this;
		}

		var options = this.options;

		if (options.filter && !options.filter(geojson)) { return; }

		var layer = L.GeoJSON.geometryToLayer(geojson, options.pointToLayer, options.coordsToLatLng, options);
		layer.feature = L.GeoJSON.asFeature(geojson);

		layer.defaultOptions = layer.options;
		this.resetStyle(layer);

		if (options.onEachFeature) {
			options.onEachFeature(geojson, layer);
		}

		return this.addLayer(layer);
	},

	resetStyle: function (layer) {
		var style = this.options.style;
		if (style) {
			// reset any custom styles
			L.Util.extend(layer.options, layer.defaultOptions);

			this._setLayerStyle(layer, style);
		}
	},

	setStyle: function (style) {
		this.eachLayer(function (layer) {
			this._setLayerStyle(layer, style);
		}, this);
	},

	_setLayerStyle: function (layer, style) {
		if (typeof style === 'function') {
			style = style(layer.feature);
		}
		if (layer.setStyle) {
			layer.setStyle(style);
		}
	}
});

L.extend(L.GeoJSON, {
	geometryToLayer: function (geojson, pointToLayer, coordsToLatLng, vectorOptions) {
		var geometry = geojson.type === 'Feature' ? geojson.geometry : geojson,
		    coords = geometry.coordinates,
		    layers = [],
		    latlng, latlngs, i, len;

		coordsToLatLng = coordsToLatLng || this.coordsToLatLng;

		switch (geometry.type) {
		case 'Point':
			latlng = coordsToLatLng(coords);
			return pointToLayer ? pointToLayer(geojson, latlng) : new L.Marker(latlng);

		case 'MultiPoint':
			for (i = 0, len = coords.length; i < len; i++) {
				latlng = coordsToLatLng(coords[i]);
				layers.push(pointToLayer ? pointToLayer(geojson, latlng) : new L.Marker(latlng));
			}
			return new L.FeatureGroup(layers);

		case 'LineString':
			latlngs = this.coordsToLatLngs(coords, 0, coordsToLatLng);
			return new L.Polyline(latlngs, vectorOptions);

		case 'Polygon':
			if (coords.length === 2 && !coords[1].length) {
				throw new Error('Invalid GeoJSON object.');
			}
			latlngs = this.coordsToLatLngs(coords, 1, coordsToLatLng);
			return new L.Polygon(latlngs, vectorOptions);

		case 'MultiLineString':
			latlngs = this.coordsToLatLngs(coords, 1, coordsToLatLng);
			return new L.MultiPolyline(latlngs, vectorOptions);

		case 'MultiPolygon':
			latlngs = this.coordsToLatLngs(coords, 2, coordsToLatLng);
			return new L.MultiPolygon(latlngs, vectorOptions);

		case 'GeometryCollection':
			for (i = 0, len = geometry.geometries.length; i < len; i++) {

				layers.push(this.geometryToLayer({
					geometry: geometry.geometries[i],
					type: 'Feature',
					properties: geojson.properties
				}, pointToLayer, coordsToLatLng, vectorOptions));
			}
			return new L.FeatureGroup(layers);

		default:
			throw new Error('Invalid GeoJSON object.');
		}
	},

	coordsToLatLng: function (coords) { // (Array[, Boolean]) -> LatLng
		return new L.LatLng(coords[1], coords[0], coords[2]);
	},

	coordsToLatLngs: function (coords, levelsDeep, coordsToLatLng) { // (Array[, Number, Function]) -> Array
		var latlng, i, len,
		    latlngs = [];

		for (i = 0, len = coords.length; i < len; i++) {
			latlng = levelsDeep ?
			        this.coordsToLatLngs(coords[i], levelsDeep - 1, coordsToLatLng) :
			        (coordsToLatLng || this.coordsToLatLng)(coords[i]);

			latlngs.push(latlng);
		}

		return latlngs;
	},

	latLngToCoords: function (latlng) {
		var coords = [latlng.lng, latlng.lat];

		if (latlng.alt !== undefined) {
			coords.push(latlng.alt);
		}
		return coords;
	},

	latLngsToCoords: function (latLngs) {
		var coords = [];

		for (var i = 0, len = latLngs.length; i < len; i++) {
			coords.push(L.GeoJSON.latLngToCoords(latLngs[i]));
		}

		return coords;
	},

	getFeature: function (layer, newGeometry) {
		return layer.feature ? L.extend({}, layer.feature, {geometry: newGeometry}) : L.GeoJSON.asFeature(newGeometry);
	},

	asFeature: function (geoJSON) {
		if (geoJSON.type === 'Feature') {
			return geoJSON;
		}

		return {
			type: 'Feature',
			properties: {},
			geometry: geoJSON
		};
	}
});

var PointToGeoJSON = {
	toGeoJSON: function () {
		return L.GeoJSON.getFeature(this, {
			type: 'Point',
			coordinates: L.GeoJSON.latLngToCoords(this.getLatLng())
		});
	}
};

L.Marker.include(PointToGeoJSON);
L.Circle.include(PointToGeoJSON);
L.CircleMarker.include(PointToGeoJSON);

L.Polyline.include({
	toGeoJSON: function () {
		return L.GeoJSON.getFeature(this, {
			type: 'LineString',
			coordinates: L.GeoJSON.latLngsToCoords(this.getLatLngs())
		});
	}
});

L.Polygon.include({
	toGeoJSON: function () {
		var coords = [L.GeoJSON.latLngsToCoords(this.getLatLngs())],
		    i, len, hole;

		coords[0].push(coords[0][0]);

		if (this._holes) {
			for (i = 0, len = this._holes.length; i < len; i++) {
				hole = L.GeoJSON.latLngsToCoords(this._holes[i]);
				hole.push(hole[0]);
				coords.push(hole);
			}
		}

		return L.GeoJSON.getFeature(this, {
			type: 'Polygon',
			coordinates: coords
		});
	}
});

(function () {
	function multiToGeoJSON(type) {
		return function () {
			var coords = [];

			this.eachLayer(function (layer) {
				coords.push(layer.toGeoJSON().geometry.coordinates);
			});

			return L.GeoJSON.getFeature(this, {
				type: type,
				coordinates: coords
			});
		};
	}

	L.MultiPolyline.include({toGeoJSON: multiToGeoJSON('MultiLineString')});
	L.MultiPolygon.include({toGeoJSON: multiToGeoJSON('MultiPolygon')});

	L.LayerGroup.include({
		toGeoJSON: function () {

			var geometry = this.feature && this.feature.geometry,
				jsons = [],
				json;

			if (geometry && geometry.type === 'MultiPoint') {
				return multiToGeoJSON('MultiPoint').call(this);
			}

			var isGeometryCollection = geometry && geometry.type === 'GeometryCollection';

			this.eachLayer(function (layer) {
				if (layer.toGeoJSON) {
					json = layer.toGeoJSON();
					jsons.push(isGeometryCollection ? json.geometry : L.GeoJSON.asFeature(json));
				}
			});

			if (isGeometryCollection) {
				return L.GeoJSON.getFeature(this, {
					geometries: jsons,
					type: 'GeometryCollection'
				});
			}

			return {
				type: 'FeatureCollection',
				features: jsons
			};
		}
	});
}());

L.geoJson = function (geojson, options) {
	return new L.GeoJSON(geojson, options);
};


/*
 * L.DomEvent contains functions for working with DOM events.
 */

L.DomEvent = {
	/* inspired by John Resig, Dean Edwards and YUI addEvent implementations */
	addListener: function (obj, type, fn, context) { // (HTMLElement, String, Function[, Object])

		var id = L.stamp(fn),
		    key = '_leaflet_' + type + id,
		    handler, originalHandler, newType;

		if (obj[key]) { return this; }

		handler = function (e) {
			return fn.call(context || obj, e || L.DomEvent._getEvent());
		};

		if (L.Browser.pointer && type.indexOf('touch') === 0) {
			return this.addPointerListener(obj, type, handler, id);
		}
		if (L.Browser.touch && (type === 'dblclick') && this.addDoubleTapListener) {
			this.addDoubleTapListener(obj, handler, id);
		}

		if ('addEventListener' in obj) {

			if (type === 'mousewheel') {
				obj.addEventListener('DOMMouseScroll', handler, false);
				obj.addEventListener(type, handler, false);

			} else if ((type === 'mouseenter') || (type === 'mouseleave')) {

				originalHandler = handler;
				newType = (type === 'mouseenter' ? 'mouseover' : 'mouseout');

				handler = function (e) {
					if (!L.DomEvent._checkMouse(obj, e)) { return; }
					return originalHandler(e);
				};

				obj.addEventListener(newType, handler, false);

			} else if (type === 'click' && L.Browser.android) {
				originalHandler = handler;
				handler = function (e) {
					return L.DomEvent._filterClick(e, originalHandler);
				};

				obj.addEventListener(type, handler, false);
			} else {
				obj.addEventListener(type, handler, false);
			}

		} else if ('attachEvent' in obj) {
			obj.attachEvent('on' + type, handler);
		}

		obj[key] = handler;

		return this;
	},

	removeListener: function (obj, type, fn) {  // (HTMLElement, String, Function)

		var id = L.stamp(fn),
		    key = '_leaflet_' + type + id,
		    handler = obj[key];

		if (!handler) { return this; }

		if (L.Browser.pointer && type.indexOf('touch') === 0) {
			this.removePointerListener(obj, type, id);
		} else if (L.Browser.touch && (type === 'dblclick') && this.removeDoubleTapListener) {
			this.removeDoubleTapListener(obj, id);

		} else if ('removeEventListener' in obj) {

			if (type === 'mousewheel') {
				obj.removeEventListener('DOMMouseScroll', handler, false);
				obj.removeEventListener(type, handler, false);

			} else if ((type === 'mouseenter') || (type === 'mouseleave')) {
				obj.removeEventListener((type === 'mouseenter' ? 'mouseover' : 'mouseout'), handler, false);
			} else {
				obj.removeEventListener(type, handler, false);
			}
		} else if ('detachEvent' in obj) {
			obj.detachEvent('on' + type, handler);
		}

		obj[key] = null;

		return this;
	},

	stopPropagation: function (e) {

		if (e.stopPropagation) {
			e.stopPropagation();
		} else {
			e.cancelBubble = true;
		}
		L.DomEvent._skipped(e);

		return this;
	},

	disableScrollPropagation: function (el) {
		var stop = L.DomEvent.stopPropagation;

		return L.DomEvent
			.on(el, 'mousewheel', stop)
			.on(el, 'MozMousePixelScroll', stop);
	},

	disableClickPropagation: function (el) {
		var stop = L.DomEvent.stopPropagation;

		for (var i = L.Draggable.START.length - 1; i >= 0; i--) {
			L.DomEvent.on(el, L.Draggable.START[i], stop);
		}

		return L.DomEvent
			.on(el, 'click', L.DomEvent._fakeStop)
			.on(el, 'dblclick', stop);
	},

	preventDefault: function (e) {

		if (e.preventDefault) {
			e.preventDefault();
		} else {
			e.returnValue = false;
		}
		return this;
	},

	stop: function (e) {
		return L.DomEvent
			.preventDefault(e)
			.stopPropagation(e);
	},

	getMousePosition: function (e, container) {
		if (!container) {
			return new L.Point(e.clientX, e.clientY);
		}

		var rect = container.getBoundingClientRect();

		return new L.Point(
			e.clientX - rect.left - container.clientLeft,
			e.clientY - rect.top - container.clientTop);
	},

	getWheelDelta: function (e) {

		var delta = 0;

		if (e.wheelDelta) {
			delta = e.wheelDelta / 120;
		}
		if (e.detail) {
			delta = -e.detail / 3;
		}
		return delta;
	},

	_skipEvents: {},

	_fakeStop: function (e) {
		// fakes stopPropagation by setting a special event flag, checked/reset with L.DomEvent._skipped(e)
		L.DomEvent._skipEvents[e.type] = true;
	},

	_skipped: function (e) {
		var skipped = this._skipEvents[e.type];
		// reset when checking, as it's only used in map container and propagates outside of the map
		this._skipEvents[e.type] = false;
		return skipped;
	},

	// check if element really left/entered the event target (for mouseenter/mouseleave)
	_checkMouse: function (el, e) {

		var related = e.relatedTarget;

		if (!related) { return true; }

		try {
			while (related && (related !== el)) {
				related = related.parentNode;
			}
		} catch (err) {
			return false;
		}
		return (related !== el);
	},

	_getEvent: function () { // evil magic for IE
		/*jshint noarg:false */
		var e = window.event;
		if (!e) {
			var caller = arguments.callee.caller;
			while (caller) {
				e = caller['arguments'][0];
				if (e && window.Event === e.constructor) {
					break;
				}
				caller = caller.caller;
			}
		}
		return e;
	},

	// this is a horrible workaround for a bug in Android where a single touch triggers two click events
	_filterClick: function (e, handler) {
		var timeStamp = (e.timeStamp || e.originalEvent.timeStamp),
			elapsed = L.DomEvent._lastClick && (timeStamp - L.DomEvent._lastClick);

		// are they closer together than 500ms yet more than 100ms?
		// Android typically triggers them ~300ms apart while multiple listeners
		// on the same event should be triggered far faster;
		// or check if click is simulated on the element, and if it is, reject any non-simulated events

		if ((elapsed && elapsed > 100 && elapsed < 500) || (e.target._simulatedClick && !e._simulated)) {
			L.DomEvent.stop(e);
			return;
		}
		L.DomEvent._lastClick = timeStamp;

		return handler(e);
	}
};

L.DomEvent.on = L.DomEvent.addListener;
L.DomEvent.off = L.DomEvent.removeListener;


/*
 * L.Draggable allows you to add dragging capabilities to any element. Supports mobile devices too.
 */

L.Draggable = L.Class.extend({
	includes: L.Mixin.Events,

	statics: {
		START: L.Browser.touch ? ['touchstart', 'mousedown'] : ['mousedown'],
		END: {
			mousedown: 'mouseup',
			touchstart: 'touchend',
			pointerdown: 'touchend',
			MSPointerDown: 'touchend'
		},
		MOVE: {
			mousedown: 'mousemove',
			touchstart: 'touchmove',
			pointerdown: 'touchmove',
			MSPointerDown: 'touchmove'
		}
	},

	initialize: function (element, dragStartTarget) {
		this._element = element;
		this._dragStartTarget = dragStartTarget || element;
	},

	enable: function () {
		if (this._enabled) { return; }

		for (var i = L.Draggable.START.length - 1; i >= 0; i--) {
			L.DomEvent.on(this._dragStartTarget, L.Draggable.START[i], this._onDown, this);
		}

		this._enabled = true;
	},

	disable: function () {
		if (!this._enabled) { return; }

		for (var i = L.Draggable.START.length - 1; i >= 0; i--) {
			L.DomEvent.off(this._dragStartTarget, L.Draggable.START[i], this._onDown, this);
		}

		this._enabled = false;
		this._moved = false;
	},

	_onDown: function (e) {
		this._moved = false;

		if (e.shiftKey || ((e.which !== 1) && (e.button !== 1) && !e.touches)) { return; }

		L.DomEvent.stopPropagation(e);

		if (L.Draggable._disabled) { return; }

		L.DomUtil.disableImageDrag();
		L.DomUtil.disableTextSelection();

		if (this._moving) { return; }

		var first = e.touches ? e.touches[0] : e;

		this._startPoint = new L.Point(first.clientX, first.clientY);
		this._startPos = this._newPos = L.DomUtil.getPosition(this._element);

		L.DomEvent
		    .on(document, L.Draggable.MOVE[e.type], this._onMove, this)
		    .on(document, L.Draggable.END[e.type], this._onUp, this);
	},

	_onMove: function (e) {
		if (e.touches && e.touches.length > 1) {
			this._moved = true;
			return;
		}

		var first = (e.touches && e.touches.length === 1 ? e.touches[0] : e),
		    newPoint = new L.Point(first.clientX, first.clientY),
		    offset = newPoint.subtract(this._startPoint);

		if (!offset.x && !offset.y) { return; }
		if (L.Browser.touch && Math.abs(offset.x) + Math.abs(offset.y) < 3) { return; }

		L.DomEvent.preventDefault(e);

		if (!this._moved) {
			this.fire('dragstart');

			this._moved = true;
			this._startPos = L.DomUtil.getPosition(this._element).subtract(offset);

			L.DomUtil.addClass(document.body, 'leaflet-dragging');
			this._lastTarget = e.target || e.srcElement;
			L.DomUtil.addClass(this._lastTarget, 'leaflet-drag-target');
		}

		this._newPos = this._startPos.add(offset);
		this._moving = true;

		L.Util.cancelAnimFrame(this._animRequest);
		this._animRequest = L.Util.requestAnimFrame(this._updatePosition, this, true, this._dragStartTarget);
	},

	_updatePosition: function () {
		this.fire('predrag');
		L.DomUtil.setPosition(this._element, this._newPos);
		this.fire('drag');
	},

	_onUp: function () {
		L.DomUtil.removeClass(document.body, 'leaflet-dragging');

		if (this._lastTarget) {
			L.DomUtil.removeClass(this._lastTarget, 'leaflet-drag-target');
			this._lastTarget = null;
		}

		for (var i in L.Draggable.MOVE) {
			L.DomEvent
			    .off(document, L.Draggable.MOVE[i], this._onMove)
			    .off(document, L.Draggable.END[i], this._onUp);
		}

		L.DomUtil.enableImageDrag();
		L.DomUtil.enableTextSelection();

		if (this._moved && this._moving) {
			// ensure drag is not fired after dragend
			L.Util.cancelAnimFrame(this._animRequest);

			this.fire('dragend', {
				distance: this._newPos.distanceTo(this._startPos)
			});
		}

		this._moving = false;
	}
});


/*
	L.Handler is a base class for handler classes that are used internally to inject
	interaction features like dragging to classes like Map and Marker.
*/

L.Handler = L.Class.extend({
	initialize: function (map) {
		this._map = map;
	},

	enable: function () {
		if (this._enabled) { return; }

		this._enabled = true;
		this.addHooks();
	},

	disable: function () {
		if (!this._enabled) { return; }

		this._enabled = false;
		this.removeHooks();
	},

	enabled: function () {
		return !!this._enabled;
	}
});


/*
 * L.Handler.MapDrag is used to make the map draggable (with panning inertia), enabled by default.
 */

L.Map.mergeOptions({
	dragging: true,

	inertia: !L.Browser.android23,
	inertiaDeceleration: 3400, // px/s^2
	inertiaMaxSpeed: Infinity, // px/s
	inertiaThreshold: L.Browser.touch ? 32 : 18, // ms
	easeLinearity: 0.25,

	// TODO refactor, move to CRS
	worldCopyJump: false
});

L.Map.Drag = L.Handler.extend({
	addHooks: function () {
		if (!this._draggable) {
			var map = this._map;

			this._draggable = new L.Draggable(map._mapPane, map._container);

			this._draggable.on({
				'dragstart': this._onDragStart,
				'drag': this._onDrag,
				'dragend': this._onDragEnd
			}, this);

			if (map.options.worldCopyJump) {
				this._draggable.on('predrag', this._onPreDrag, this);
				map.on('viewreset', this._onViewReset, this);

				map.whenReady(this._onViewReset, this);
			}
		}
		this._draggable.enable();
	},

	removeHooks: function () {
		this._draggable.disable();
	},

	moved: function () {
		return this._draggable && this._draggable._moved;
	},

	_onDragStart: function () {
		var map = this._map;

		if (map._panAnim) {
			map._panAnim.stop();
		}

		map
		    .fire('movestart')
		    .fire('dragstart');

		if (map.options.inertia) {
			this._positions = [];
			this._times = [];
		}
	},

	_onDrag: function () {
		if (this._map.options.inertia) {
			var time = this._lastTime = +new Date(),
			    pos = this._lastPos = this._draggable._newPos;

			this._positions.push(pos);
			this._times.push(time);

			if (time - this._times[0] > 200) {
				this._positions.shift();
				this._times.shift();
			}
		}

		this._map
		    .fire('move')
		    .fire('drag');
	},

	_onViewReset: function () {
		// TODO fix hardcoded Earth values
		var pxCenter = this._map.getSize()._divideBy(2),
		    pxWorldCenter = this._map.latLngToLayerPoint([0, 0]);

		this._initialWorldOffset = pxWorldCenter.subtract(pxCenter).x;
		this._worldWidth = this._map.project([0, 180]).x;
	},

	_onPreDrag: function () {
		// TODO refactor to be able to adjust map pane position after zoom
		var worldWidth = this._worldWidth,
		    halfWidth = Math.round(worldWidth / 2),
		    dx = this._initialWorldOffset,
		    x = this._draggable._newPos.x,
		    newX1 = (x - halfWidth + dx) % worldWidth + halfWidth - dx,
		    newX2 = (x + halfWidth + dx) % worldWidth - halfWidth - dx,
		    newX = Math.abs(newX1 + dx) < Math.abs(newX2 + dx) ? newX1 : newX2;

		this._draggable._newPos.x = newX;
	},

	_onDragEnd: function (e) {
		var map = this._map,
		    options = map.options,
		    delay = +new Date() - this._lastTime,

		    noInertia = !options.inertia || delay > options.inertiaThreshold || !this._positions[0];

		map.fire('dragend', e);

		if (noInertia) {
			map.fire('moveend');

		} else {

			var direction = this._lastPos.subtract(this._positions[0]),
			    duration = (this._lastTime + delay - this._times[0]) / 1000,
			    ease = options.easeLinearity,

			    speedVector = direction.multiplyBy(ease / duration),
			    speed = speedVector.distanceTo([0, 0]),

			    limitedSpeed = Math.min(options.inertiaMaxSpeed, speed),
			    limitedSpeedVector = speedVector.multiplyBy(limitedSpeed / speed),

			    decelerationDuration = limitedSpeed / (options.inertiaDeceleration * ease),
			    offset = limitedSpeedVector.multiplyBy(-decelerationDuration / 2).round();

			if (!offset.x || !offset.y) {
				map.fire('moveend');

			} else {
				offset = map._limitOffset(offset, map.options.maxBounds);

				L.Util.requestAnimFrame(function () {
					map.panBy(offset, {
						duration: decelerationDuration,
						easeLinearity: ease,
						noMoveStart: true
					});
				});
			}
		}
	}
});

L.Map.addInitHook('addHandler', 'dragging', L.Map.Drag);


/*
 * L.Handler.DoubleClickZoom is used to handle double-click zoom on the map, enabled by default.
 */

L.Map.mergeOptions({
	doubleClickZoom: true
});

L.Map.DoubleClickZoom = L.Handler.extend({
	addHooks: function () {
		this._map.on('dblclick', this._onDoubleClick, this);
	},

	removeHooks: function () {
		this._map.off('dblclick', this._onDoubleClick, this);
	},

	_onDoubleClick: function (e) {
		var map = this._map,
		    zoom = map.getZoom() + (e.originalEvent.shiftKey ? -1 : 1);

		if (map.options.doubleClickZoom === 'center') {
			map.setZoom(zoom);
		} else {
			map.setZoomAround(e.containerPoint, zoom);
		}
	}
});

L.Map.addInitHook('addHandler', 'doubleClickZoom', L.Map.DoubleClickZoom);


/*
 * L.Handler.ScrollWheelZoom is used by L.Map to enable mouse scroll wheel zoom on the map.
 */

L.Map.mergeOptions({
	scrollWheelZoom: true
});

L.Map.ScrollWheelZoom = L.Handler.extend({
	addHooks: function () {
		L.DomEvent.on(this._map._container, 'mousewheel', this._onWheelScroll, this);
		L.DomEvent.on(this._map._container, 'MozMousePixelScroll', L.DomEvent.preventDefault);
		this._delta = 0;
	},

	removeHooks: function () {
		L.DomEvent.off(this._map._container, 'mousewheel', this._onWheelScroll);
		L.DomEvent.off(this._map._container, 'MozMousePixelScroll', L.DomEvent.preventDefault);
	},

	_onWheelScroll: function (e) {
		var delta = L.DomEvent.getWheelDelta(e);

		this._delta += delta;
		this._lastMousePos = this._map.mouseEventToContainerPoint(e);

		if (!this._startTime) {
			this._startTime = +new Date();
		}

		var left = Math.max(40 - (+new Date() - this._startTime), 0);

		clearTimeout(this._timer);
		this._timer = setTimeout(L.bind(this._performZoom, this), left);

		L.DomEvent.preventDefault(e);
		L.DomEvent.stopPropagation(e);
	},

	_performZoom: function () {
		var map = this._map,
		    delta = this._delta,
		    zoom = map.getZoom();

		delta = delta > 0 ? Math.ceil(delta) : Math.floor(delta);
		delta = Math.max(Math.min(delta, 4), -4);
		delta = map._limitZoom(zoom + delta) - zoom;

		this._delta = 0;
		this._startTime = null;

		if (!delta) { return; }

		if (map.options.scrollWheelZoom === 'center') {
			map.setZoom(zoom + delta);
		} else {
			map.setZoomAround(this._lastMousePos, zoom + delta);
		}
	}
});

L.Map.addInitHook('addHandler', 'scrollWheelZoom', L.Map.ScrollWheelZoom);


/*
 * Extends the event handling code with double tap support for mobile browsers.
 */

L.extend(L.DomEvent, {

	_touchstart: L.Browser.msPointer ? 'MSPointerDown' : L.Browser.pointer ? 'pointerdown' : 'touchstart',
	_touchend: L.Browser.msPointer ? 'MSPointerUp' : L.Browser.pointer ? 'pointerup' : 'touchend',

	// inspired by Zepto touch code by Thomas Fuchs
	addDoubleTapListener: function (obj, handler, id) {
		var last,
		    doubleTap = false,
		    delay = 250,
		    touch,
		    pre = '_leaflet_',
		    touchstart = this._touchstart,
		    touchend = this._touchend,
		    trackedTouches = [];

		function onTouchStart(e) {
			var count;

			if (L.Browser.pointer) {
				trackedTouches.push(e.pointerId);
				count = trackedTouches.length;
			} else {
				count = e.touches.length;
			}
			if (count > 1) {
				return;
			}

			var now = Date.now(),
				delta = now - (last || now);

			touch = e.touches ? e.touches[0] : e;
			doubleTap = (delta > 0 && delta <= delay);
			last = now;
		}

		function onTouchEnd(e) {
			if (L.Browser.pointer) {
				var idx = trackedTouches.indexOf(e.pointerId);
				if (idx === -1) {
					return;
				}
				trackedTouches.splice(idx, 1);
			}

			if (doubleTap) {
				if (L.Browser.pointer) {
					// work around .type being readonly with MSPointer* events
					var newTouch = { },
						prop;

					// jshint forin:false
					for (var i in touch) {
						prop = touch[i];
						if (typeof prop === 'function') {
							newTouch[i] = prop.bind(touch);
						} else {
							newTouch[i] = prop;
						}
					}
					touch = newTouch;
				}
				touch.type = 'dblclick';
				handler(touch);
				last = null;
			}
		}
		obj[pre + touchstart + id] = onTouchStart;
		obj[pre + touchend + id] = onTouchEnd;

		// on pointer we need to listen on the document, otherwise a drag starting on the map and moving off screen
		// will not come through to us, so we will lose track of how many touches are ongoing
		var endElement = L.Browser.pointer ? document.documentElement : obj;

		obj.addEventListener(touchstart, onTouchStart, false);
		endElement.addEventListener(touchend, onTouchEnd, false);

		if (L.Browser.pointer) {
			endElement.addEventListener(L.DomEvent.POINTER_CANCEL, onTouchEnd, false);
		}

		return this;
	},

	removeDoubleTapListener: function (obj, id) {
		var pre = '_leaflet_';

		obj.removeEventListener(this._touchstart, obj[pre + this._touchstart + id], false);
		(L.Browser.pointer ? document.documentElement : obj).removeEventListener(
		        this._touchend, obj[pre + this._touchend + id], false);

		if (L.Browser.pointer) {
			document.documentElement.removeEventListener(L.DomEvent.POINTER_CANCEL, obj[pre + this._touchend + id],
				false);
		}

		return this;
	}
});


/*
 * Extends L.DomEvent to provide touch support for Internet Explorer and Windows-based devices.
 */

L.extend(L.DomEvent, {

	//static
	POINTER_DOWN: L.Browser.msPointer ? 'MSPointerDown' : 'pointerdown',
	POINTER_MOVE: L.Browser.msPointer ? 'MSPointerMove' : 'pointermove',
	POINTER_UP: L.Browser.msPointer ? 'MSPointerUp' : 'pointerup',
	POINTER_CANCEL: L.Browser.msPointer ? 'MSPointerCancel' : 'pointercancel',

	_pointers: [],
	_pointerDocumentListener: false,

	// Provides a touch events wrapper for (ms)pointer events.
	// Based on changes by veproza https://github.com/CloudMade/Leaflet/pull/1019
	//ref http://www.w3.org/TR/pointerevents/ https://www.w3.org/Bugs/Public/show_bug.cgi?id=22890

	addPointerListener: function (obj, type, handler, id) {

		switch (type) {
		case 'touchstart':
			return this.addPointerListenerStart(obj, type, handler, id);
		case 'touchend':
			return this.addPointerListenerEnd(obj, type, handler, id);
		case 'touchmove':
			return this.addPointerListenerMove(obj, type, handler, id);
		default:
			throw 'Unknown touch event type';
		}
	},

	addPointerListenerStart: function (obj, type, handler, id) {
		var pre = '_leaflet_',
		    pointers = this._pointers;

		var cb = function (e) {

			L.DomEvent.preventDefault(e);

			var alreadyInArray = false;
			for (var i = 0; i < pointers.length; i++) {
				if (pointers[i].pointerId === e.pointerId) {
					alreadyInArray = true;
					break;
				}
			}
			if (!alreadyInArray) {
				pointers.push(e);
			}

			e.touches = pointers.slice();
			e.changedTouches = [e];

			handler(e);
		};

		obj[pre + 'touchstart' + id] = cb;
		obj.addEventListener(this.POINTER_DOWN, cb, false);

		// need to also listen for end events to keep the _pointers list accurate
		// this needs to be on the body and never go away
		if (!this._pointerDocumentListener) {
			var internalCb = function (e) {
				for (var i = 0; i < pointers.length; i++) {
					if (pointers[i].pointerId === e.pointerId) {
						pointers.splice(i, 1);
						break;
					}
				}
			};
			//We listen on the documentElement as any drags that end by moving the touch off the screen get fired there
			document.documentElement.addEventListener(this.POINTER_UP, internalCb, false);
			document.documentElement.addEventListener(this.POINTER_CANCEL, internalCb, false);

			this._pointerDocumentListener = true;
		}

		return this;
	},

	addPointerListenerMove: function (obj, type, handler, id) {
		var pre = '_leaflet_',
		    touches = this._pointers;

		function cb(e) {

			// don't fire touch moves when mouse isn't down
			if ((e.pointerType === e.MSPOINTER_TYPE_MOUSE || e.pointerType === 'mouse') && e.buttons === 0) { return; }

			for (var i = 0; i < touches.length; i++) {
				if (touches[i].pointerId === e.pointerId) {
					touches[i] = e;
					break;
				}
			}

			e.touches = touches.slice();
			e.changedTouches = [e];

			handler(e);
		}

		obj[pre + 'touchmove' + id] = cb;
		obj.addEventListener(this.POINTER_MOVE, cb, false);

		return this;
	},

	addPointerListenerEnd: function (obj, type, handler, id) {
		var pre = '_leaflet_',
		    touches = this._pointers;

		var cb = function (e) {
			for (var i = 0; i < touches.length; i++) {
				if (touches[i].pointerId === e.pointerId) {
					touches.splice(i, 1);
					break;
				}
			}

			e.touches = touches.slice();
			e.changedTouches = [e];

			handler(e);
		};

		obj[pre + 'touchend' + id] = cb;
		obj.addEventListener(this.POINTER_UP, cb, false);
		obj.addEventListener(this.POINTER_CANCEL, cb, false);

		return this;
	},

	removePointerListener: function (obj, type, id) {
		var pre = '_leaflet_',
		    cb = obj[pre + type + id];

		switch (type) {
		case 'touchstart':
			obj.removeEventListener(this.POINTER_DOWN, cb, false);
			break;
		case 'touchmove':
			obj.removeEventListener(this.POINTER_MOVE, cb, false);
			break;
		case 'touchend':
			obj.removeEventListener(this.POINTER_UP, cb, false);
			obj.removeEventListener(this.POINTER_CANCEL, cb, false);
			break;
		}

		return this;
	}
});


/*
 * L.Handler.TouchZoom is used by L.Map to add pinch zoom on supported mobile browsers.
 */

L.Map.mergeOptions({
	touchZoom: L.Browser.touch && !L.Browser.android23,
	bounceAtZoomLimits: true
});

L.Map.TouchZoom = L.Handler.extend({
	addHooks: function () {
		L.DomEvent.on(this._map._container, 'touchstart', this._onTouchStart, this);
	},

	removeHooks: function () {
		L.DomEvent.off(this._map._container, 'touchstart', this._onTouchStart, this);
	},

	_onTouchStart: function (e) {
		var map = this._map;

		if (!e.touches || e.touches.length !== 2 || map._animatingZoom || this._zooming) { return; }

		var p1 = map.mouseEventToLayerPoint(e.touches[0]),
		    p2 = map.mouseEventToLayerPoint(e.touches[1]),
		    viewCenter = map._getCenterLayerPoint();

		this._startCenter = p1.add(p2)._divideBy(2);
		this._startDist = p1.distanceTo(p2);

		this._moved = false;
		this._zooming = true;

		this._centerOffset = viewCenter.subtract(this._startCenter);

		if (map._panAnim) {
			map._panAnim.stop();
		}

		L.DomEvent
		    .on(document, 'touchmove', this._onTouchMove, this)
		    .on(document, 'touchend', this._onTouchEnd, this);

		L.DomEvent.preventDefault(e);
	},

	_onTouchMove: function (e) {
		var map = this._map;

		if (!e.touches || e.touches.length !== 2 || !this._zooming) { return; }

		var p1 = map.mouseEventToLayerPoint(e.touches[0]),
		    p2 = map.mouseEventToLayerPoint(e.touches[1]);

		this._scale = p1.distanceTo(p2) / this._startDist;
		this._delta = p1._add(p2)._divideBy(2)._subtract(this._startCenter);

		if (this._scale === 1) { return; }

		if (!map.options.bounceAtZoomLimits) {
			if ((map.getZoom() === map.getMinZoom() && this._scale < 1) ||
			    (map.getZoom() === map.getMaxZoom() && this._scale > 1)) { return; }
		}

		if (!this._moved) {
			L.DomUtil.addClass(map._mapPane, 'leaflet-touching');

			map
			    .fire('movestart')
			    .fire('zoomstart');

			this._moved = true;
		}

		L.Util.cancelAnimFrame(this._animRequest);
		this._animRequest = L.Util.requestAnimFrame(
		        this._updateOnMove, this, true, this._map._container);

		L.DomEvent.preventDefault(e);
	},

	_updateOnMove: function () {
		var map = this._map,
		    origin = this._getScaleOrigin(),
		    center = map.layerPointToLatLng(origin),
		    zoom = map.getScaleZoom(this._scale);

		map._animateZoom(center, zoom, this._startCenter, this._scale, this._delta, false, true);
	},

	_onTouchEnd: function () {
		if (!this._moved || !this._zooming) {
			this._zooming = false;
			return;
		}

		var map = this._map;

		this._zooming = false;
		L.DomUtil.removeClass(map._mapPane, 'leaflet-touching');
		L.Util.cancelAnimFrame(this._animRequest);

		L.DomEvent
		    .off(document, 'touchmove', this._onTouchMove)
		    .off(document, 'touchend', this._onTouchEnd);

		var origin = this._getScaleOrigin(),
		    center = map.layerPointToLatLng(origin),

		    oldZoom = map.getZoom(),
		    floatZoomDelta = map.getScaleZoom(this._scale) - oldZoom,
		    roundZoomDelta = (floatZoomDelta > 0 ?
		            Math.ceil(floatZoomDelta) : Math.floor(floatZoomDelta)),

		    zoom = map._limitZoom(oldZoom + roundZoomDelta),
		    scale = map.getZoomScale(zoom) / this._scale;

		map._animateZoom(center, zoom, origin, scale);
	},

	_getScaleOrigin: function () {
		var centerOffset = this._centerOffset.subtract(this._delta).divideBy(this._scale);
		return this._startCenter.add(centerOffset);
	}
});

L.Map.addInitHook('addHandler', 'touchZoom', L.Map.TouchZoom);


/*
 * L.Map.Tap is used to enable mobile hacks like quick taps and long hold.
 */

L.Map.mergeOptions({
	tap: true,
	tapTolerance: 15
});

L.Map.Tap = L.Handler.extend({
	addHooks: function () {
		L.DomEvent.on(this._map._container, 'touchstart', this._onDown, this);
	},

	removeHooks: function () {
		L.DomEvent.off(this._map._container, 'touchstart', this._onDown, this);
	},

	_onDown: function (e) {
		if (!e.touches) { return; }

		L.DomEvent.preventDefault(e);

		this._fireClick = true;

		// don't simulate click or track longpress if more than 1 touch
		if (e.touches.length > 1) {
			this._fireClick = false;
			clearTimeout(this._holdTimeout);
			return;
		}

		var first = e.touches[0],
		    el = first.target;

		this._startPos = this._newPos = new L.Point(first.clientX, first.clientY);

		// if touching a link, highlight it
		if (el.tagName && el.tagName.toLowerCase() === 'a') {
			L.DomUtil.addClass(el, 'leaflet-active');
		}

		// simulate long hold but setting a timeout
		this._holdTimeout = setTimeout(L.bind(function () {
			if (this._isTapValid()) {
				this._fireClick = false;
				this._onUp();
				this._simulateEvent('contextmenu', first);
			}
		}, this), 1000);

		L.DomEvent
			.on(document, 'touchmove', this._onMove, this)
			.on(document, 'touchend', this._onUp, this);
	},

	_onUp: function (e) {
		clearTimeout(this._holdTimeout);

		L.DomEvent
			.off(document, 'touchmove', this._onMove, this)
			.off(document, 'touchend', this._onUp, this);

		if (this._fireClick && e && e.changedTouches) {

			var first = e.changedTouches[0],
			    el = first.target;

			if (el && el.tagName && el.tagName.toLowerCase() === 'a') {
				L.DomUtil.removeClass(el, 'leaflet-active');
			}

			// simulate click if the touch didn't move too much
			if (this._isTapValid()) {
				this._simulateEvent('click', first);
			}
		}
	},

	_isTapValid: function () {
		return this._newPos.distanceTo(this._startPos) <= this._map.options.tapTolerance;
	},

	_onMove: function (e) {
		var first = e.touches[0];
		this._newPos = new L.Point(first.clientX, first.clientY);
	},

	_simulateEvent: function (type, e) {
		var simulatedEvent = document.createEvent('MouseEvents');

		simulatedEvent._simulated = true;
		e.target._simulatedClick = true;

		simulatedEvent.initMouseEvent(
		        type, true, true, window, 1,
		        e.screenX, e.screenY,
		        e.clientX, e.clientY,
		        false, false, false, false, 0, null);

		e.target.dispatchEvent(simulatedEvent);
	}
});

if (L.Browser.touch && !L.Browser.pointer) {
	L.Map.addInitHook('addHandler', 'tap', L.Map.Tap);
}


/*
 * L.Handler.ShiftDragZoom is used to add shift-drag zoom interaction to the map
  * (zoom to a selected bounding box), enabled by default.
 */

L.Map.mergeOptions({
	boxZoom: true
});

L.Map.BoxZoom = L.Handler.extend({
	initialize: function (map) {
		this._map = map;
		this._container = map._container;
		this._pane = map._panes.overlayPane;
		this._moved = false;
	},

	addHooks: function () {
		L.DomEvent.on(this._container, 'mousedown', this._onMouseDown, this);
	},

	removeHooks: function () {
		L.DomEvent.off(this._container, 'mousedown', this._onMouseDown);
		this._moved = false;
	},

	moved: function () {
		return this._moved;
	},

	_onMouseDown: function (e) {
		this._moved = false;

		if (!e.shiftKey || ((e.which !== 1) && (e.button !== 1))) { return false; }

		L.DomUtil.disableTextSelection();
		L.DomUtil.disableImageDrag();

		this._startLayerPoint = this._map.mouseEventToLayerPoint(e);

		L.DomEvent
		    .on(document, 'mousemove', this._onMouseMove, this)
		    .on(document, 'mouseup', this._onMouseUp, this)
		    .on(document, 'keydown', this._onKeyDown, this);
	},

	_onMouseMove: function (e) {
		if (!this._moved) {
			this._box = L.DomUtil.create('div', 'leaflet-zoom-box', this._pane);
			L.DomUtil.setPosition(this._box, this._startLayerPoint);

			//TODO refactor: move cursor to styles
			this._container.style.cursor = 'crosshair';
			this._map.fire('boxzoomstart');
		}

		var startPoint = this._startLayerPoint,
		    box = this._box,

		    layerPoint = this._map.mouseEventToLayerPoint(e),
		    offset = layerPoint.subtract(startPoint),

		    newPos = new L.Point(
		        Math.min(layerPoint.x, startPoint.x),
		        Math.min(layerPoint.y, startPoint.y));

		L.DomUtil.setPosition(box, newPos);

		this._moved = true;

		// TODO refactor: remove hardcoded 4 pixels
		box.style.width  = (Math.max(0, Math.abs(offset.x) - 4)) + 'px';
		box.style.height = (Math.max(0, Math.abs(offset.y) - 4)) + 'px';
	},

	_finish: function () {
		if (this._moved) {
			this._pane.removeChild(this._box);
			this._container.style.cursor = '';
		}

		L.DomUtil.enableTextSelection();
		L.DomUtil.enableImageDrag();

		L.DomEvent
		    .off(document, 'mousemove', this._onMouseMove)
		    .off(document, 'mouseup', this._onMouseUp)
		    .off(document, 'keydown', this._onKeyDown);
	},

	_onMouseUp: function (e) {

		this._finish();

		var map = this._map,
		    layerPoint = map.mouseEventToLayerPoint(e);

		if (this._startLayerPoint.equals(layerPoint)) { return; }

		var bounds = new L.LatLngBounds(
		        map.layerPointToLatLng(this._startLayerPoint),
		        map.layerPointToLatLng(layerPoint));

		map.fitBounds(bounds);

		map.fire('boxzoomend', {
			boxZoomBounds: bounds
		});
	},

	_onKeyDown: function (e) {
		if (e.keyCode === 27) {
			this._finish();
		}
	}
});

L.Map.addInitHook('addHandler', 'boxZoom', L.Map.BoxZoom);


/*
 * L.Map.Keyboard is handling keyboard interaction with the map, enabled by default.
 */

L.Map.mergeOptions({
	keyboard: true,
	keyboardPanOffset: 80,
	keyboardZoomOffset: 1
});

L.Map.Keyboard = L.Handler.extend({

	keyCodes: {
		left:    [37],
		right:   [39],
		down:    [40],
		up:      [38],
		zoomIn:  [187, 107, 61, 171],
		zoomOut: [189, 109, 173]
	},

	initialize: function (map) {
		this._map = map;

		this._setPanOffset(map.options.keyboardPanOffset);
		this._setZoomOffset(map.options.keyboardZoomOffset);
	},

	addHooks: function () {
		var container = this._map._container;

		// make the container focusable by tabbing
		if (container.tabIndex === -1) {
			container.tabIndex = '0';
		}

		L.DomEvent
		    .on(container, 'focus', this._onFocus, this)
		    .on(container, 'blur', this._onBlur, this)
		    .on(container, 'mousedown', this._onMouseDown, this);

		this._map
		    .on('focus', this._addHooks, this)
		    .on('blur', this._removeHooks, this);
	},

	removeHooks: function () {
		this._removeHooks();

		var container = this._map._container;

		L.DomEvent
		    .off(container, 'focus', this._onFocus, this)
		    .off(container, 'blur', this._onBlur, this)
		    .off(container, 'mousedown', this._onMouseDown, this);

		this._map
		    .off('focus', this._addHooks, this)
		    .off('blur', this._removeHooks, this);
	},

	_onMouseDown: function () {
		if (this._focused) { return; }

		var body = document.body,
		    docEl = document.documentElement,
		    top = body.scrollTop || docEl.scrollTop,
		    left = body.scrollLeft || docEl.scrollLeft;

		this._map._container.focus();

		window.scrollTo(left, top);
	},

	_onFocus: function () {
		this._focused = true;
		this._map.fire('focus');
	},

	_onBlur: function () {
		this._focused = false;
		this._map.fire('blur');
	},

	_setPanOffset: function (pan) {
		var keys = this._panKeys = {},
		    codes = this.keyCodes,
		    i, len;

		for (i = 0, len = codes.left.length; i < len; i++) {
			keys[codes.left[i]] = [-1 * pan, 0];
		}
		for (i = 0, len = codes.right.length; i < len; i++) {
			keys[codes.right[i]] = [pan, 0];
		}
		for (i = 0, len = codes.down.length; i < len; i++) {
			keys[codes.down[i]] = [0, pan];
		}
		for (i = 0, len = codes.up.length; i < len; i++) {
			keys[codes.up[i]] = [0, -1 * pan];
		}
	},

	_setZoomOffset: function (zoom) {
		var keys = this._zoomKeys = {},
		    codes = this.keyCodes,
		    i, len;

		for (i = 0, len = codes.zoomIn.length; i < len; i++) {
			keys[codes.zoomIn[i]] = zoom;
		}
		for (i = 0, len = codes.zoomOut.length; i < len; i++) {
			keys[codes.zoomOut[i]] = -zoom;
		}
	},

	_addHooks: function () {
		L.DomEvent.on(document, 'keydown', this._onKeyDown, this);
	},

	_removeHooks: function () {
		L.DomEvent.off(document, 'keydown', this._onKeyDown, this);
	},

	_onKeyDown: function (e) {
		var key = e.keyCode,
		    map = this._map;

		if (key in this._panKeys) {

			if (map._panAnim && map._panAnim._inProgress) { return; }

			map.panBy(this._panKeys[key]);

			if (map.options.maxBounds) {
				map.panInsideBounds(map.options.maxBounds);
			}

		} else if (key in this._zoomKeys) {
			map.setZoom(map.getZoom() + this._zoomKeys[key]);

		} else {
			return;
		}

		L.DomEvent.stop(e);
	}
});

L.Map.addInitHook('addHandler', 'keyboard', L.Map.Keyboard);


/*
 * L.Handler.MarkerDrag is used internally by L.Marker to make the markers draggable.
 */

L.Handler.MarkerDrag = L.Handler.extend({
	initialize: function (marker) {
		this._marker = marker;
	},

	addHooks: function () {
		var icon = this._marker._icon;
		if (!this._draggable) {
			this._draggable = new L.Draggable(icon, icon);
		}

		this._draggable
			.on('dragstart', this._onDragStart, this)
			.on('drag', this._onDrag, this)
			.on('dragend', this._onDragEnd, this);
		this._draggable.enable();
		L.DomUtil.addClass(this._marker._icon, 'leaflet-marker-draggable');
	},

	removeHooks: function () {
		this._draggable
			.off('dragstart', this._onDragStart, this)
			.off('drag', this._onDrag, this)
			.off('dragend', this._onDragEnd, this);

		this._draggable.disable();
		L.DomUtil.removeClass(this._marker._icon, 'leaflet-marker-draggable');
	},

	moved: function () {
		return this._draggable && this._draggable._moved;
	},

	_onDragStart: function () {
		this._marker
		    .closePopup()
		    .fire('movestart')
		    .fire('dragstart');
	},

	_onDrag: function () {
		var marker = this._marker,
		    shadow = marker._shadow,
		    iconPos = L.DomUtil.getPosition(marker._icon),
		    latlng = marker._map.layerPointToLatLng(iconPos);

		// update shadow position
		if (shadow) {
			L.DomUtil.setPosition(shadow, iconPos);
		}

		marker._latlng = latlng;

		marker
		    .fire('move', {latlng: latlng})
		    .fire('drag');
	},

	_onDragEnd: function (e) {
		this._marker
		    .fire('moveend')
		    .fire('dragend', e);
	}
});


/*
 * L.Control is a base class for implementing map controls. Handles positioning.
 * All other controls extend from this class.
 */

L.Control = L.Class.extend({
	options: {
		position: 'topright'
	},

	initialize: function (options) {
		L.setOptions(this, options);
	},

	getPosition: function () {
		return this.options.position;
	},

	setPosition: function (position) {
		var map = this._map;

		if (map) {
			map.removeControl(this);
		}

		this.options.position = position;

		if (map) {
			map.addControl(this);
		}

		return this;
	},

	getContainer: function () {
		return this._container;
	},

	addTo: function (map) {
		this._map = map;

		var container = this._container = this.onAdd(map),
		    pos = this.getPosition(),
		    corner = map._controlCorners[pos];

		L.DomUtil.addClass(container, 'leaflet-control');

		if (pos.indexOf('bottom') !== -1) {
			corner.insertBefore(container, corner.firstChild);
		} else {
			corner.appendChild(container);
		}

		return this;
	},

	removeFrom: function (map) {
		var pos = this.getPosition(),
		    corner = map._controlCorners[pos];

		corner.removeChild(this._container);
		this._map = null;

		if (this.onRemove) {
			this.onRemove(map);
		}

		return this;
	},

	_refocusOnMap: function () {
		if (this._map) {
			this._map.getContainer().focus();
		}
	}
});

L.control = function (options) {
	return new L.Control(options);
};


// adds control-related methods to L.Map

L.Map.include({
	addControl: function (control) {
		control.addTo(this);
		return this;
	},

	removeControl: function (control) {
		control.removeFrom(this);
		return this;
	},

	_initControlPos: function () {
		var corners = this._controlCorners = {},
		    l = 'leaflet-',
		    container = this._controlContainer =
		            L.DomUtil.create('div', l + 'control-container', this._container);

		function createCorner(vSide, hSide) {
			var className = l + vSide + ' ' + l + hSide;

			corners[vSide + hSide] = L.DomUtil.create('div', className, container);
		}

		createCorner('top', 'left');
		createCorner('top', 'right');
		createCorner('bottom', 'left');
		createCorner('bottom', 'right');
	},

	_clearControlPos: function () {
		this._container.removeChild(this._controlContainer);
	}
});


/*
 * L.Control.Zoom is used for the default zoom buttons on the map.
 */

L.Control.Zoom = L.Control.extend({
	options: {
		position: 'topleft',
		zoomInText: '+',
		zoomInTitle: 'Zoom in',
		zoomOutText: '-',
		zoomOutTitle: 'Zoom out'
	},

	onAdd: function (map) {
		var zoomName = 'leaflet-control-zoom',
		    container = L.DomUtil.create('div', zoomName + ' leaflet-bar');

		this._map = map;

		this._zoomInButton  = this._createButton(
		        this.options.zoomInText, this.options.zoomInTitle,
		        zoomName + '-in',  container, this._zoomIn,  this);
		this._zoomOutButton = this._createButton(
		        this.options.zoomOutText, this.options.zoomOutTitle,
		        zoomName + '-out', container, this._zoomOut, this);

		this._updateDisabled();
		map.on('zoomend zoomlevelschange', this._updateDisabled, this);

		return container;
	},

	onRemove: function (map) {
		map.off('zoomend zoomlevelschange', this._updateDisabled, this);
	},

	_zoomIn: function (e) {
		this._map.zoomIn(e.shiftKey ? 3 : 1);
	},

	_zoomOut: function (e) {
		this._map.zoomOut(e.shiftKey ? 3 : 1);
	},

	_createButton: function (html, title, className, container, fn, context) {
		var link = L.DomUtil.create('a', className, container);
		link.innerHTML = html;
		link.href = '#';
		link.title = title;

		var stop = L.DomEvent.stopPropagation;

		L.DomEvent
		    .on(link, 'click', stop)
		    .on(link, 'mousedown', stop)
		    .on(link, 'dblclick', stop)
		    .on(link, 'click', L.DomEvent.preventDefault)
		    .on(link, 'click', fn, context)
		    .on(link, 'click', this._refocusOnMap, context);

		return link;
	},

	_updateDisabled: function () {
		var map = this._map,
			className = 'leaflet-disabled';

		L.DomUtil.removeClass(this._zoomInButton, className);
		L.DomUtil.removeClass(this._zoomOutButton, className);

		if (map._zoom === map.getMinZoom()) {
			L.DomUtil.addClass(this._zoomOutButton, className);
		}
		if (map._zoom === map.getMaxZoom()) {
			L.DomUtil.addClass(this._zoomInButton, className);
		}
	}
});

L.Map.mergeOptions({
	zoomControl: true
});

L.Map.addInitHook(function () {
	if (this.options.zoomControl) {
		this.zoomControl = new L.Control.Zoom();
		this.addControl(this.zoomControl);
	}
});

L.control.zoom = function (options) {
	return new L.Control.Zoom(options);
};



/*
 * L.Control.Attribution is used for displaying attribution on the map (added by default).
 */

L.Control.Attribution = L.Control.extend({
	options: {
		position: 'bottomright',
		prefix: '<a href="http://leafletjs.com" title="A JS library for interactive maps">Leaflet</a>'
	},

	initialize: function (options) {
		L.setOptions(this, options);

		this._attributions = {};
	},

	onAdd: function (map) {
		this._container = L.DomUtil.create('div', 'leaflet-control-attribution');
		L.DomEvent.disableClickPropagation(this._container);

		for (var i in map._layers) {
			if (map._layers[i].getAttribution) {
				this.addAttribution(map._layers[i].getAttribution());
			}
		}
		
		map
		    .on('layeradd', this._onLayerAdd, this)
		    .on('layerremove', this._onLayerRemove, this);

		this._update();

		return this._container;
	},

	onRemove: function (map) {
		map
		    .off('layeradd', this._onLayerAdd)
		    .off('layerremove', this._onLayerRemove);

	},

	setPrefix: function (prefix) {
		this.options.prefix = prefix;
		this._update();
		return this;
	},

	addAttribution: function (text) {
		if (!text) { return; }

		if (!this._attributions[text]) {
			this._attributions[text] = 0;
		}
		this._attributions[text]++;

		this._update();

		return this;
	},

	removeAttribution: function (text) {
		if (!text) { return; }

		if (this._attributions[text]) {
			this._attributions[text]--;
			this._update();
		}

		return this;
	},

	_update: function () {
		if (!this._map) { return; }

		var attribs = [];

		for (var i in this._attributions) {
			if (this._attributions[i]) {
				attribs.push(i);
			}
		}

		var prefixAndAttribs = [];

		if (this.options.prefix) {
			prefixAndAttribs.push(this.options.prefix);
		}
		if (attribs.length) {
			prefixAndAttribs.push(attribs.join(', '));
		}

		this._container.innerHTML = prefixAndAttribs.join(' | ');
	},

	_onLayerAdd: function (e) {
		if (e.layer.getAttribution) {
			this.addAttribution(e.layer.getAttribution());
		}
	},

	_onLayerRemove: function (e) {
		if (e.layer.getAttribution) {
			this.removeAttribution(e.layer.getAttribution());
		}
	}
});

L.Map.mergeOptions({
	attributionControl: true
});

L.Map.addInitHook(function () {
	if (this.options.attributionControl) {
		this.attributionControl = (new L.Control.Attribution()).addTo(this);
	}
});

L.control.attribution = function (options) {
	return new L.Control.Attribution(options);
};


/*
 * L.Control.Scale is used for displaying metric/imperial scale on the map.
 */

L.Control.Scale = L.Control.extend({
	options: {
		position: 'bottomleft',
		maxWidth: 100,
		metric: true,
		imperial: true,
		updateWhenIdle: false
	},

	onAdd: function (map) {
		this._map = map;

		var className = 'leaflet-control-scale',
		    container = L.DomUtil.create('div', className),
		    options = this.options;

		this._addScales(options, className, container);

		map.on(options.updateWhenIdle ? 'moveend' : 'move', this._update, this);
		map.whenReady(this._update, this);

		return container;
	},

	onRemove: function (map) {
		map.off(this.options.updateWhenIdle ? 'moveend' : 'move', this._update, this);
	},

	_addScales: function (options, className, container) {
		if (options.metric) {
			this._mScale = L.DomUtil.create('div', className + '-line', container);
		}
		if (options.imperial) {
			this._iScale = L.DomUtil.create('div', className + '-line', container);
		}
	},

	_update: function () {
		var bounds = this._map.getBounds(),
		    centerLat = bounds.getCenter().lat,
		    halfWorldMeters = 6378137 * Math.PI * Math.cos(centerLat * Math.PI / 180),
		    dist = halfWorldMeters * (bounds.getNorthEast().lng - bounds.getSouthWest().lng) / 180,

		    size = this._map.getSize(),
		    options = this.options,
		    maxMeters = 0;

		if (size.x > 0) {
			maxMeters = dist * (options.maxWidth / size.x);
		}

		this._updateScales(options, maxMeters);
	},

	_updateScales: function (options, maxMeters) {
		if (options.metric && maxMeters) {
			this._updateMetric(maxMeters);
		}

		if (options.imperial && maxMeters) {
			this._updateImperial(maxMeters);
		}
	},

	_updateMetric: function (maxMeters) {
		var meters = this._getRoundNum(maxMeters);

		this._mScale.style.width = this._getScaleWidth(meters / maxMeters) + 'px';
		this._mScale.innerHTML = meters < 1000 ? meters + ' m' : (meters / 1000) + ' km';
	},

	_updateImperial: function (maxMeters) {
		var maxFeet = maxMeters * 3.2808399,
		    scale = this._iScale,
		    maxMiles, miles, feet;

		if (maxFeet > 5280) {
			maxMiles = maxFeet / 5280;
			miles = this._getRoundNum(maxMiles);

			scale.style.width = this._getScaleWidth(miles / maxMiles) + 'px';
			scale.innerHTML = miles + ' mi';

		} else {
			feet = this._getRoundNum(maxFeet);

			scale.style.width = this._getScaleWidth(feet / maxFeet) + 'px';
			scale.innerHTML = feet + ' ft';
		}
	},

	_getScaleWidth: function (ratio) {
		return Math.round(this.options.maxWidth * ratio) - 10;
	},

	_getRoundNum: function (num) {
		var pow10 = Math.pow(10, (Math.floor(num) + '').length - 1),
		    d = num / pow10;

		d = d >= 10 ? 10 : d >= 5 ? 5 : d >= 3 ? 3 : d >= 2 ? 2 : 1;

		return pow10 * d;
	}
});

L.control.scale = function (options) {
	return new L.Control.Scale(options);
};


/*
 * L.Control.Layers is a control to allow users to switch between different layers on the map.
 */

L.Control.Layers = L.Control.extend({
	options: {
		collapsed: true,
		position: 'topright',
		autoZIndex: true
	},

	initialize: function (baseLayers, overlays, options) {
		L.setOptions(this, options);

		this._layers = {};
		this._lastZIndex = 0;
		this._handlingClick = false;

		for (var i in baseLayers) {
			this._addLayer(baseLayers[i], i);
		}

		for (i in overlays) {
			this._addLayer(overlays[i], i, true);
		}
	},

	onAdd: function (map) {
		this._initLayout();
		this._update();

		map
		    .on('layeradd', this._onLayerChange, this)
		    .on('layerremove', this._onLayerChange, this);

		return this._container;
	},

	onRemove: function (map) {
		map
		    .off('layeradd', this._onLayerChange, this)
		    .off('layerremove', this._onLayerChange, this);
	},

	addBaseLayer: function (layer, name) {
		this._addLayer(layer, name);
		this._update();
		return this;
	},

	addOverlay: function (layer, name) {
		this._addLayer(layer, name, true);
		this._update();
		return this;
	},

	removeLayer: function (layer) {
		var id = L.stamp(layer);
		delete this._layers[id];
		this._update();
		return this;
	},

	_initLayout: function () {
		var className = 'leaflet-control-layers',
		    container = this._container = L.DomUtil.create('div', className);

		//Makes this work on IE10 Touch devices by stopping it from firing a mouseout event when the touch is released
		container.setAttribute('aria-haspopup', true);

		if (!L.Browser.touch) {
			L.DomEvent
				.disableClickPropagation(container)
				.disableScrollPropagation(container);
		} else {
			L.DomEvent.on(container, 'click', L.DomEvent.stopPropagation);
		}

		var form = this._form = L.DomUtil.create('form', className + '-list');

		if (this.options.collapsed) {
			if (!L.Browser.android) {
				L.DomEvent
				    .on(container, 'mouseover', this._expand, this)
				    .on(container, 'mouseout', this._collapse, this);
			}
			var link = this._layersLink = L.DomUtil.create('a', className + '-toggle', container);
			link.href = '#';
			link.title = 'Layers';

			if (L.Browser.touch) {
				L.DomEvent
				    .on(link, 'click', L.DomEvent.stop)
				    .on(link, 'click', this._expand, this);
			}
			else {
				L.DomEvent.on(link, 'focus', this._expand, this);
			}
			//Work around for Firefox android issue https://github.com/Leaflet/Leaflet/issues/2033
			L.DomEvent.on(form, 'click', function () {
				setTimeout(L.bind(this._onInputClick, this), 0);
			}, this);

			this._map.on('click', this._collapse, this);
			// TODO keyboard accessibility
		} else {
			this._expand();
		}

		this._baseLayersList = L.DomUtil.create('div', className + '-base', form);
		this._separator = L.DomUtil.create('div', className + '-separator', form);
		this._overlaysList = L.DomUtil.create('div', className + '-overlays', form);

		container.appendChild(form);
	},

	_addLayer: function (layer, name, overlay) {
		var id = L.stamp(layer);

		this._layers[id] = {
			layer: layer,
			name: name,
			overlay: overlay
		};

		if (this.options.autoZIndex && layer.setZIndex) {
			this._lastZIndex++;
			layer.setZIndex(this._lastZIndex);
		}
	},

	_update: function () {
		if (!this._container) {
			return;
		}

		this._baseLayersList.innerHTML = '';
		this._overlaysList.innerHTML = '';

		var baseLayersPresent = false,
		    overlaysPresent = false,
		    i, obj;

		for (i in this._layers) {
			obj = this._layers[i];
			this._addItem(obj);
			overlaysPresent = overlaysPresent || obj.overlay;
			baseLayersPresent = baseLayersPresent || !obj.overlay;
		}

		this._separator.style.display = overlaysPresent && baseLayersPresent ? '' : 'none';
	},

	_onLayerChange: function (e) {
		var obj = this._layers[L.stamp(e.layer)];

		if (!obj) { return; }

		if (!this._handlingClick) {
			this._update();
		}

		var type = obj.overlay ?
			(e.type === 'layeradd' ? 'overlayadd' : 'overlayremove') :
			(e.type === 'layeradd' ? 'baselayerchange' : null);

		if (type) {
			this._map.fire(type, obj);
		}
	},

	// IE7 bugs out if you create a radio dynamically, so you have to do it this hacky way (see http://bit.ly/PqYLBe)
	_createRadioElement: function (name, checked) {

		var radioHtml = '<input type="radio" class="leaflet-control-layers-selector" name="' + name + '"';
		if (checked) {
			radioHtml += ' checked="checked"';
		}
		radioHtml += '/>';

		var radioFragment = document.createElement('div');
		radioFragment.innerHTML = radioHtml;

		return radioFragment.firstChild;
	},

	_addItem: function (obj) {
		var label = document.createElement('label'),
		    input,
		    checked = this._map.hasLayer(obj.layer);

		if (obj.overlay) {
			input = document.createElement('input');
			input.type = 'checkbox';
			input.className = 'leaflet-control-layers-selector';
			input.defaultChecked = checked;
		} else {
			input = this._createRadioElement('leaflet-base-layers', checked);
		}

		input.layerId = L.stamp(obj.layer);

		L.DomEvent.on(input, 'click', this._onInputClick, this);

		var name = document.createElement('span');
		name.innerHTML = ' ' + obj.name;

		label.appendChild(input);
		label.appendChild(name);

		var container = obj.overlay ? this._overlaysList : this._baseLayersList;
		container.appendChild(label);

		return label;
	},

	_onInputClick: function () {
		var i, input, obj,
		    inputs = this._form.getElementsByTagName('input'),
		    inputsLen = inputs.length;

		this._handlingClick = true;

		for (i = 0; i < inputsLen; i++) {
			input = inputs[i];
			obj = this._layers[input.layerId];

			if (input.checked && !this._map.hasLayer(obj.layer)) {
				this._map.addLayer(obj.layer);

			} else if (!input.checked && this._map.hasLayer(obj.layer)) {
				this._map.removeLayer(obj.layer);
			}
		}

		this._handlingClick = false;

		this._refocusOnMap();
	},

	_expand: function () {
		L.DomUtil.addClass(this._container, 'leaflet-control-layers-expanded');
	},

	_collapse: function () {
		this._container.className = this._container.className.replace(' leaflet-control-layers-expanded', '');
	}
});

L.control.layers = function (baseLayers, overlays, options) {
	return new L.Control.Layers(baseLayers, overlays, options);
};


/*
 * L.PosAnimation is used by Leaflet internally for pan animations.
 */

L.PosAnimation = L.Class.extend({
	includes: L.Mixin.Events,

	run: function (el, newPos, duration, easeLinearity) { // (HTMLElement, Point[, Number, Number])
		this.stop();

		this._el = el;
		this._inProgress = true;
		this._newPos = newPos;

		this.fire('start');

		el.style[L.DomUtil.TRANSITION] = 'all ' + (duration || 0.25) +
		        's cubic-bezier(0,0,' + (easeLinearity || 0.5) + ',1)';

		L.DomEvent.on(el, L.DomUtil.TRANSITION_END, this._onTransitionEnd, this);
		L.DomUtil.setPosition(el, newPos);

		// toggle reflow, Chrome flickers for some reason if you don't do this
		L.Util.falseFn(el.offsetWidth);

		// there's no native way to track value updates of transitioned properties, so we imitate this
		this._stepTimer = setInterval(L.bind(this._onStep, this), 50);
	},

	stop: function () {
		if (!this._inProgress) { return; }

		// if we just removed the transition property, the element would jump to its final position,
		// so we need to make it stay at the current position

		L.DomUtil.setPosition(this._el, this._getPos());
		this._onTransitionEnd();
		L.Util.falseFn(this._el.offsetWidth); // force reflow in case we are about to start a new animation
	},

	_onStep: function () {
		var stepPos = this._getPos();
		if (!stepPos) {
			this._onTransitionEnd();
			return;
		}
		// jshint camelcase: false
		// make L.DomUtil.getPosition return intermediate position value during animation
		this._el._leaflet_pos = stepPos;

		this.fire('step');
	},

	// you can't easily get intermediate values of properties animated with CSS3 Transitions,
	// we need to parse computed style (in case of transform it returns matrix string)

	_transformRe: /([-+]?(?:\d*\.)?\d+)\D*, ([-+]?(?:\d*\.)?\d+)\D*\)/,

	_getPos: function () {
		var left, top, matches,
		    el = this._el,
		    style = window.getComputedStyle(el);

		if (L.Browser.any3d) {
			matches = style[L.DomUtil.TRANSFORM].match(this._transformRe);
			if (!matches) { return; }
			left = parseFloat(matches[1]);
			top  = parseFloat(matches[2]);
		} else {
			left = parseFloat(style.left);
			top  = parseFloat(style.top);
		}

		return new L.Point(left, top, true);
	},

	_onTransitionEnd: function () {
		L.DomEvent.off(this._el, L.DomUtil.TRANSITION_END, this._onTransitionEnd, this);

		if (!this._inProgress) { return; }
		this._inProgress = false;

		this._el.style[L.DomUtil.TRANSITION] = '';

		// jshint camelcase: false
		// make sure L.DomUtil.getPosition returns the final position value after animation
		this._el._leaflet_pos = this._newPos;

		clearInterval(this._stepTimer);

		this.fire('step').fire('end');
	}

});


/*
 * Extends L.Map to handle panning animations.
 */

L.Map.include({

	setView: function (center, zoom, options) {

		zoom = zoom === undefined ? this._zoom : this._limitZoom(zoom);
		center = this._limitCenter(L.latLng(center), zoom, this.options.maxBounds);
		options = options || {};

		if (this._panAnim) {
			this._panAnim.stop();
		}

		if (this._loaded && !options.reset && options !== true) {

			if (options.animate !== undefined) {
				options.zoom = L.extend({animate: options.animate}, options.zoom);
				options.pan = L.extend({animate: options.animate}, options.pan);
			}

			// try animating pan or zoom
			var animated = (this._zoom !== zoom) ?
				this._tryAnimatedZoom && this._tryAnimatedZoom(center, zoom, options.zoom) :
				this._tryAnimatedPan(center, options.pan);

			if (animated) {
				// prevent resize handler call, the view will refresh after animation anyway
				clearTimeout(this._sizeTimer);
				return this;
			}
		}

		// animation didn't start, just reset the map view
		this._resetView(center, zoom);

		return this;
	},

	panBy: function (offset, options) {
		offset = L.point(offset).round();
		options = options || {};

		if (!offset.x && !offset.y) {
			return this;
		}

		if (!this._panAnim) {
			this._panAnim = new L.PosAnimation();

			this._panAnim.on({
				'step': this._onPanTransitionStep,
				'end': this._onPanTransitionEnd
			}, this);
		}

		// don't fire movestart if animating inertia
		if (!options.noMoveStart) {
			this.fire('movestart');
		}

		// animate pan unless animate: false specified
		if (options.animate !== false) {
			L.DomUtil.addClass(this._mapPane, 'leaflet-pan-anim');

			var newPos = this._getMapPanePos().subtract(offset);
			this._panAnim.run(this._mapPane, newPos, options.duration || 0.25, options.easeLinearity);
		} else {
			this._rawPanBy(offset);
			this.fire('move').fire('moveend');
		}

		return this;
	},

	_onPanTransitionStep: function () {
		this.fire('move');
	},

	_onPanTransitionEnd: function () {
		L.DomUtil.removeClass(this._mapPane, 'leaflet-pan-anim');
		this.fire('moveend');
	},

	_tryAnimatedPan: function (center, options) {
		// difference between the new and current centers in pixels
		var offset = this._getCenterOffset(center)._floor();

		// don't animate too far unless animate: true specified in options
		if ((options && options.animate) !== true && !this.getSize().contains(offset)) { return false; }

		this.panBy(offset, options);

		return true;
	}
});


/*
 * L.PosAnimation fallback implementation that powers Leaflet pan animations
 * in browsers that don't support CSS3 Transitions.
 */

L.PosAnimation = L.DomUtil.TRANSITION ? L.PosAnimation : L.PosAnimation.extend({

	run: function (el, newPos, duration, easeLinearity) { // (HTMLElement, Point[, Number, Number])
		this.stop();

		this._el = el;
		this._inProgress = true;
		this._duration = duration || 0.25;
		this._easeOutPower = 1 / Math.max(easeLinearity || 0.5, 0.2);

		this._startPos = L.DomUtil.getPosition(el);
		this._offset = newPos.subtract(this._startPos);
		this._startTime = +new Date();

		this.fire('start');

		this._animate();
	},

	stop: function () {
		if (!this._inProgress) { return; }

		this._step();
		this._complete();
	},

	_animate: function () {
		// animation loop
		this._animId = L.Util.requestAnimFrame(this._animate, this);
		this._step();
	},

	_step: function () {
		var elapsed = (+new Date()) - this._startTime,
		    duration = this._duration * 1000;

		if (elapsed < duration) {
			this._runFrame(this._easeOut(elapsed / duration));
		} else {
			this._runFrame(1);
			this._complete();
		}
	},

	_runFrame: function (progress) {
		var pos = this._startPos.add(this._offset.multiplyBy(progress));
		L.DomUtil.setPosition(this._el, pos);

		this.fire('step');
	},

	_complete: function () {
		L.Util.cancelAnimFrame(this._animId);

		this._inProgress = false;
		this.fire('end');
	},

	_easeOut: function (t) {
		return 1 - Math.pow(1 - t, this._easeOutPower);
	}
});


/*
 * Extends L.Map to handle zoom animations.
 */

L.Map.mergeOptions({
	zoomAnimation: true,
	zoomAnimationThreshold: 4
});

if (L.DomUtil.TRANSITION) {

	L.Map.addInitHook(function () {
		// don't animate on browsers without hardware-accelerated transitions or old Android/Opera
		this._zoomAnimated = this.options.zoomAnimation && L.DomUtil.TRANSITION &&
				L.Browser.any3d && !L.Browser.android23 && !L.Browser.mobileOpera;

		// zoom transitions run with the same duration for all layers, so if one of transitionend events
		// happens after starting zoom animation (propagating to the map pane), we know that it ended globally
		if (this._zoomAnimated) {
			L.DomEvent.on(this._mapPane, L.DomUtil.TRANSITION_END, this._catchTransitionEnd, this);
		}
	});
}

L.Map.include(!L.DomUtil.TRANSITION ? {} : {

	_catchTransitionEnd: function (e) {
		if (this._animatingZoom && e.propertyName.indexOf('transform') >= 0) {
			this._onZoomTransitionEnd();
		}
	},

	_nothingToAnimate: function () {
		return !this._container.getElementsByClassName('leaflet-zoom-animated').length;
	},

	_tryAnimatedZoom: function (center, zoom, options) {

		if (this._animatingZoom) { return true; }

		options = options || {};

		// don't animate if disabled, not supported or zoom difference is too large
		if (!this._zoomAnimated || options.animate === false || this._nothingToAnimate() ||
		        Math.abs(zoom - this._zoom) > this.options.zoomAnimationThreshold) { return false; }

		// offset is the pixel coords of the zoom origin relative to the current center
		var scale = this.getZoomScale(zoom),
		    offset = this._getCenterOffset(center)._divideBy(1 - 1 / scale),
			origin = this._getCenterLayerPoint()._add(offset);

		// don't animate if the zoom origin isn't within one screen from the current center, unless forced
		if (options.animate !== true && !this.getSize().contains(offset)) { return false; }

		this
		    .fire('movestart')
		    .fire('zoomstart');

		this._animateZoom(center, zoom, origin, scale, null, true);

		return true;
	},

	_animateZoom: function (center, zoom, origin, scale, delta, backwards, forTouchZoom) {

		if (!forTouchZoom) {
			this._animatingZoom = true;
		}

		// put transform transition on all layers with leaflet-zoom-animated class
		L.DomUtil.addClass(this._mapPane, 'leaflet-zoom-anim');

		// remember what center/zoom to set after animation
		this._animateToCenter = center;
		this._animateToZoom = zoom;

		// disable any dragging during animation
		if (L.Draggable) {
			L.Draggable._disabled = true;
		}

		L.Util.requestAnimFrame(function () {
			this.fire('zoomanim', {
				center: center,
				zoom: zoom,
				origin: origin,
				scale: scale,
				delta: delta,
				backwards: backwards
			});
		}, this);
	},

	_onZoomTransitionEnd: function () {

		this._animatingZoom = false;

		L.DomUtil.removeClass(this._mapPane, 'leaflet-zoom-anim');

		this._resetView(this._animateToCenter, this._animateToZoom, true, true);

		if (L.Draggable) {
			L.Draggable._disabled = false;
		}
	}
});


/*
	Zoom animation logic for L.TileLayer.
*/

L.TileLayer.include({
	_animateZoom: function (e) {
		if (!this._animating) {
			this._animating = true;
			this._prepareBgBuffer();
		}

		var bg = this._bgBuffer,
		    transform = L.DomUtil.TRANSFORM,
		    initialTransform = e.delta ? L.DomUtil.getTranslateString(e.delta) : bg.style[transform],
		    scaleStr = L.DomUtil.getScaleString(e.scale, e.origin);

		bg.style[transform] = e.backwards ?
				scaleStr + ' ' + initialTransform :
				initialTransform + ' ' + scaleStr;
	},

	_endZoomAnim: function () {
		var front = this._tileContainer,
		    bg = this._bgBuffer;

		front.style.visibility = '';
		front.parentNode.appendChild(front); // Bring to fore

		// force reflow
		L.Util.falseFn(bg.offsetWidth);

		this._animating = false;
	},

	_clearBgBuffer: function () {
		var map = this._map;

		if (map && !map._animatingZoom && !map.touchZoom._zooming) {
			this._bgBuffer.innerHTML = '';
			this._bgBuffer.style[L.DomUtil.TRANSFORM] = '';
		}
	},

	_prepareBgBuffer: function () {

		var front = this._tileContainer,
		    bg = this._bgBuffer;

		// if foreground layer doesn't have many tiles but bg layer does,
		// keep the existing bg layer and just zoom it some more

		var bgLoaded = this._getLoadedTilesPercentage(bg),
		    frontLoaded = this._getLoadedTilesPercentage(front);

		if (bg && bgLoaded > 0.5 && frontLoaded < 0.5) {

			front.style.visibility = 'hidden';
			this._stopLoadingImages(front);
			return;
		}

		// prepare the buffer to become the front tile pane
		bg.style.visibility = 'hidden';
		bg.style[L.DomUtil.TRANSFORM] = '';

		// switch out the current layer to be the new bg layer (and vice-versa)
		this._tileContainer = bg;
		bg = this._bgBuffer = front;

		this._stopLoadingImages(bg);

		//prevent bg buffer from clearing right after zoom
		clearTimeout(this._clearBgBufferTimer);
	},

	_getLoadedTilesPercentage: function (container) {
		var tiles = container.getElementsByTagName('img'),
		    i, len, count = 0;

		for (i = 0, len = tiles.length; i < len; i++) {
			if (tiles[i].complete) {
				count++;
			}
		}
		return count / len;
	},

	// stops loading all tiles in the background layer
	_stopLoadingImages: function (container) {
		var tiles = Array.prototype.slice.call(container.getElementsByTagName('img')),
		    i, len, tile;

		for (i = 0, len = tiles.length; i < len; i++) {
			tile = tiles[i];

			if (!tile.complete) {
				tile.onload = L.Util.falseFn;
				tile.onerror = L.Util.falseFn;
				tile.src = L.Util.emptyImageUrl;

				tile.parentNode.removeChild(tile);
			}
		}
	}
});


/*
 * Provides L.Map with convenient shortcuts for using browser geolocation features.
 */

L.Map.include({
	_defaultLocateOptions: {
		watch: false,
		setView: false,
		maxZoom: Infinity,
		timeout: 10000,
		maximumAge: 0,
		enableHighAccuracy: false
	},

	locate: function (/*Object*/ options) {

		options = this._locateOptions = L.extend(this._defaultLocateOptions, options);

		if (!navigator.geolocation) {
			this._handleGeolocationError({
				code: 0,
				message: 'Geolocation not supported.'
			});
			return this;
		}

		var onResponse = L.bind(this._handleGeolocationResponse, this),
			onError = L.bind(this._handleGeolocationError, this);

		if (options.watch) {
			this._locationWatchId =
			        navigator.geolocation.watchPosition(onResponse, onError, options);
		} else {
			navigator.geolocation.getCurrentPosition(onResponse, onError, options);
		}
		return this;
	},

	stopLocate: function () {
		if (navigator.geolocation) {
			navigator.geolocation.clearWatch(this._locationWatchId);
		}
		if (this._locateOptions) {
			this._locateOptions.setView = false;
		}
		return this;
	},

	_handleGeolocationError: function (error) {
		var c = error.code,
		    message = error.message ||
		            (c === 1 ? 'permission denied' :
		            (c === 2 ? 'position unavailable' : 'timeout'));

		if (this._locateOptions.setView && !this._loaded) {
			this.fitWorld();
		}

		this.fire('locationerror', {
			code: c,
			message: 'Geolocation error: ' + message + '.'
		});
	},

	_handleGeolocationResponse: function (pos) {
		var lat = pos.coords.latitude,
		    lng = pos.coords.longitude,
		    latlng = new L.LatLng(lat, lng),

		    latAccuracy = 180 * pos.coords.accuracy / 40075017,
		    lngAccuracy = latAccuracy / Math.cos(L.LatLng.DEG_TO_RAD * lat),

		    bounds = L.latLngBounds(
		            [lat - latAccuracy, lng - lngAccuracy],
		            [lat + latAccuracy, lng + lngAccuracy]),

		    options = this._locateOptions;

		if (options.setView) {
			var zoom = Math.min(this.getBoundsZoom(bounds), options.maxZoom);
			this.setView(latlng, zoom);
		}

		var data = {
			latlng: latlng,
			bounds: bounds,
			timestamp: pos.timestamp
		};

		for (var i in pos.coords) {
			if (typeof pos.coords[i] === 'number') {
				data[i] = pos.coords[i];
			}
		}

		this.fire('locationfound', data);
	}
});


}(window, document));
},{}],"/Users/w8r/Projects/tweethistorgam/node_modules/position/index.js":[function(require,module,exports){
var style = require('computed-style')

exports = module.exports = position
exports.container = containerBox
exports.offsetParent = offsetParent
exports.relative = 
exports.offset = offset 

/**
 * Get the location of the element relative to the top left of the documentElement
 *
 * @param {Element} element
 * @return {Object} {top, right, bottom, left} in pixels
 */

function position (element) {
	var box = element.getBoundingClientRect()
	  , scrollTop = window.scrollY
	  , scrollLeft = window.scrollX
	// Has to be copied since ClientRects is immutable
	return {
		top: box.top + scrollTop,
		right: box.right + scrollLeft,
		left: box.left + scrollLeft,
		bottom: box.bottom + scrollTop,
		width: box.width,
		height: box.height
	}
}

/**
 * Get the position of one element relative to another
 *
 *   offset(child)
 *   offset(child, parent)
 *   
 * @param {Element} child the subject element
 * @param {Element} [parent] offset will be calculated relative to this element. 
 *   This parameter is optional and will default to the offsetparent of the 
 *   `child` element
 * @return {Object} {x, y} in pixels
 */

function offset (child, parent) {
	// default to comparing with the offsetparent
	parent || (parent = offsetParent(child))
	if (!parent) {
		parent = position(child)
		return {
			x: parent.left,
			y: parent.top
		}
	}

	var offset = position(child)
	  , parentOffset = position(parent)
	  , css = style(child)

	// Subtract element margins
	offset.top  -= parseFloat(css.marginTop)  || 0
	offset.left -= parseFloat(css.marginLeft) || 0

	// Allow for the offsetparent's border
	offset.top  -= parent.clientTop
	offset.left -= parent.clientLeft

	return {
		x: offset.left - parentOffset.left,
		y:  offset.top  - parentOffset.top
	}
}

// Alternative way of calculating offset perhaps its cheaper
// function offset (el) {
// 	var x = el.offsetLeft, y = el.offsetTop
// 	while (el = el.offsetParent) {
// 		x += el.offsetLeft + el.clientLeft
// 		y += el.offsetTop + el.clientTop
// 	}
// 	return {left: x, top: y}
// }

/**
 * Determine the perimeter of an elements containing block. This is the box that
 * determines the childs positioning. The container cords are relative to the 
 * document element not the viewport; so take into account scrolling.
 *
 * @param {Element} child
 * @return {Object}
 */

function containerBox (child) {
	var container = offsetParent(child)

	if (!container) {
		container = child.ownerDocument.documentElement
		// The outer edges of the document
		return {
			top   : 0,
			left  : 0,
			right : container.offsetWidth,
			bottom: container.offsetHeight,
			width : container.offsetWidth,
			height: container.offsetHeight
		}
	}

	var offset = position(container)
	  , css = style(container)

	// Remove its border
	offset.top    += parseFloat(css.borderTopWidth) || 0
	offset.left   += parseFloat(css.borderLeftWidth)|| 0
	offset.right  -= parseFloat(css.borderRightWidth) || 0
	offset.bottom -= parseFloat(css.borderBottomWidth) || 0
	offset.width   = offset.right - offset.left
	offset.height  = offset.bottom - offset.top

	return offset
}

/**
 * Get the element that serves as the base for this ones positioning.
 * If no parents are postioned it will return undefined which isn't 
 * what you might expect if you know the offsetparent spec or have 
 * used `jQuery.offsetParent`
 * 
 * @param {Element} element
 * @return {Element} if a positioned parent exists
 */

function offsetParent (element) {
	var parent = element.offsetParent
	while (parent && style(parent).position === "static") parent = parent.offsetParent
	return parent
}

},{"computed-style":"/Users/w8r/Projects/tweethistorgam/node_modules/position/node_modules/computed-style/index.js"}],"/Users/w8r/Projects/tweethistorgam/node_modules/position/node_modules/computed-style/index.js":[function(require,module,exports){

/**
 * Get the computed style of a DOM element
 * 
 *   style(document.body) // => {width:'500px', ...}
 * 
 * @param {Element} element
 * @return {Object}
 */

// Accessing via window for jsDOM support
module.exports = window.getComputedStyle

// Fallback to elem.currentStyle for IE < 9
if (!module.exports) {
	module.exports = function (elem) {
		return elem.currentStyle
	}
}

},{}],"/Users/w8r/Projects/tweethistorgam/node_modules/reqwest/reqwest.js":[function(require,module,exports){
/*!
  * Reqwest! A general purpose XHR connection manager
  * license MIT (c) Dustin Diaz 2014
  * https://github.com/ded/reqwest
  */

!function (name, context, definition) {
  if (typeof module != 'undefined' && module.exports) module.exports = definition()
  else if (typeof define == 'function' && define.amd) define(definition)
  else context[name] = definition()
}('reqwest', this, function () {

  var win = window
    , doc = document
    , httpsRe = /^http/
    , protocolRe = /(^\w+):\/\//
    , twoHundo = /^(20\d|1223)$/ //http://stackoverflow.com/questions/10046972/msie-returns-status-code-of-1223-for-ajax-request
    , byTag = 'getElementsByTagName'
    , readyState = 'readyState'
    , contentType = 'Content-Type'
    , requestedWith = 'X-Requested-With'
    , head = doc[byTag]('head')[0]
    , uniqid = 0
    , callbackPrefix = 'reqwest_' + (+new Date())
    , lastValue // data stored by the most recent JSONP callback
    , xmlHttpRequest = 'XMLHttpRequest'
    , xDomainRequest = 'XDomainRequest'
    , noop = function () {}

    , isArray = typeof Array.isArray == 'function'
        ? Array.isArray
        : function (a) {
            return a instanceof Array
          }

    , defaultHeaders = {
          'contentType': 'application/x-www-form-urlencoded'
        , 'requestedWith': xmlHttpRequest
        , 'accept': {
              '*':  'text/javascript, text/html, application/xml, text/xml, */*'
            , 'xml':  'application/xml, text/xml'
            , 'html': 'text/html'
            , 'text': 'text/plain'
            , 'json': 'application/json, text/javascript'
            , 'js':   'application/javascript, text/javascript'
          }
      }

    , xhr = function(o) {
        // is it x-domain
        if (o['crossOrigin'] === true) {
          var xhr = win[xmlHttpRequest] ? new XMLHttpRequest() : null
          if (xhr && 'withCredentials' in xhr) {
            return xhr
          } else if (win[xDomainRequest]) {
            return new XDomainRequest()
          } else {
            throw new Error('Browser does not support cross-origin requests')
          }
        } else if (win[xmlHttpRequest]) {
          return new XMLHttpRequest()
        } else {
          return new ActiveXObject('Microsoft.XMLHTTP')
        }
      }
    , globalSetupOptions = {
        dataFilter: function (data) {
          return data
        }
      }

  function succeed(r) {
    var protocol = protocolRe.exec(r.url);
    protocol = (protocol && protocol[1]) || window.location.protocol;
    return httpsRe.test(protocol) ? twoHundo.test(r.request.status) : !!r.request.response;
  }

  function handleReadyState(r, success, error) {
    return function () {
      // use _aborted to mitigate against IE err c00c023f
      // (can't read props on aborted request objects)
      if (r._aborted) return error(r.request)
      if (r.request && r.request[readyState] == 4) {
        r.request.onreadystatechange = noop
        if (succeed(r)) success(r.request)
        else
          error(r.request)
      }
    }
  }

  function setHeaders(http, o) {
    var headers = o['headers'] || {}
      , h

    headers['Accept'] = headers['Accept']
      || defaultHeaders['accept'][o['type']]
      || defaultHeaders['accept']['*']

    var isAFormData = typeof FormData === 'function' && (o['data'] instanceof FormData);
    // breaks cross-origin requests with legacy browsers
    if (!o['crossOrigin'] && !headers[requestedWith]) headers[requestedWith] = defaultHeaders['requestedWith']
    if (!headers[contentType] && !isAFormData) headers[contentType] = o['contentType'] || defaultHeaders['contentType']
    for (h in headers)
      headers.hasOwnProperty(h) && 'setRequestHeader' in http && http.setRequestHeader(h, headers[h])
  }

  function setCredentials(http, o) {
    if (typeof o['withCredentials'] !== 'undefined' && typeof http.withCredentials !== 'undefined') {
      http.withCredentials = !!o['withCredentials']
    }
  }

  function generalCallback(data) {
    lastValue = data
  }

  function urlappend (url, s) {
    return url + (/\?/.test(url) ? '&' : '?') + s
  }

  function handleJsonp(o, fn, err, url) {
    var reqId = uniqid++
      , cbkey = o['jsonpCallback'] || 'callback' // the 'callback' key
      , cbval = o['jsonpCallbackName'] || reqwest.getcallbackPrefix(reqId)
      , cbreg = new RegExp('((^|\\?|&)' + cbkey + ')=([^&]+)')
      , match = url.match(cbreg)
      , script = doc.createElement('script')
      , loaded = 0
      , isIE10 = navigator.userAgent.indexOf('MSIE 10.0') !== -1

    if (match) {
      if (match[3] === '?') {
        url = url.replace(cbreg, '$1=' + cbval) // wildcard callback func name
      } else {
        cbval = match[3] // provided callback func name
      }
    } else {
      url = urlappend(url, cbkey + '=' + cbval) // no callback details, add 'em
    }

    win[cbval] = generalCallback

    script.type = 'text/javascript'
    script.src = url
    script.async = true
    if (typeof script.onreadystatechange !== 'undefined' && !isIE10) {
      // need this for IE due to out-of-order onreadystatechange(), binding script
      // execution to an event listener gives us control over when the script
      // is executed. See http://jaubourg.net/2010/07/loading-script-as-onclick-handler-of.html
      script.htmlFor = script.id = '_reqwest_' + reqId
    }

    script.onload = script.onreadystatechange = function () {
      if ((script[readyState] && script[readyState] !== 'complete' && script[readyState] !== 'loaded') || loaded) {
        return false
      }
      script.onload = script.onreadystatechange = null
      script.onclick && script.onclick()
      // Call the user callback with the last value stored and clean up values and scripts.
      fn(lastValue)
      lastValue = undefined
      head.removeChild(script)
      loaded = 1
    }

    // Add the script to the DOM head
    head.appendChild(script)

    // Enable JSONP timeout
    return {
      abort: function () {
        script.onload = script.onreadystatechange = null
        err({}, 'Request is aborted: timeout', {})
        lastValue = undefined
        head.removeChild(script)
        loaded = 1
      }
    }
  }

  function getRequest(fn, err) {
    var o = this.o
      , method = (o['method'] || 'GET').toUpperCase()
      , url = typeof o === 'string' ? o : o['url']
      // convert non-string objects to query-string form unless o['processData'] is false
      , data = (o['processData'] !== false && o['data'] && typeof o['data'] !== 'string')
        ? reqwest.toQueryString(o['data'])
        : (o['data'] || null)
      , http
      , sendWait = false

    // if we're working on a GET request and we have data then we should append
    // query string to end of URL and not post data
    if ((o['type'] == 'jsonp' || method == 'GET') && data) {
      url = urlappend(url, data)
      data = null
    }

    if (o['type'] == 'jsonp') return handleJsonp(o, fn, err, url)

    // get the xhr from the factory if passed
    // if the factory returns null, fall-back to ours
    http = (o.xhr && o.xhr(o)) || xhr(o)

    http.open(method, url, o['async'] === false ? false : true)
    setHeaders(http, o)
    setCredentials(http, o)
    if (win[xDomainRequest] && http instanceof win[xDomainRequest]) {
        http.onload = fn
        http.onerror = err
        // NOTE: see
        // http://social.msdn.microsoft.com/Forums/en-US/iewebdevelopment/thread/30ef3add-767c-4436-b8a9-f1ca19b4812e
        http.onprogress = function() {}
        sendWait = true
    } else {
      http.onreadystatechange = handleReadyState(this, fn, err)
    }
    o['before'] && o['before'](http)
    if (sendWait) {
      setTimeout(function () {
        http.send(data)
      }, 200)
    } else {
      http.send(data)
    }
    return http
  }

  function Reqwest(o, fn) {
    this.o = o
    this.fn = fn

    init.apply(this, arguments)
  }

  function setType(header) {
    // json, javascript, text/plain, text/html, xml
    if (header.match('json')) return 'json'
    if (header.match('javascript')) return 'js'
    if (header.match('text')) return 'html'
    if (header.match('xml')) return 'xml'
  }

  function init(o, fn) {

    this.url = typeof o == 'string' ? o : o['url']
    this.timeout = null

    // whether request has been fulfilled for purpose
    // of tracking the Promises
    this._fulfilled = false
    // success handlers
    this._successHandler = function(){}
    this._fulfillmentHandlers = []
    // error handlers
    this._errorHandlers = []
    // complete (both success and fail) handlers
    this._completeHandlers = []
    this._erred = false
    this._responseArgs = {}

    var self = this

    fn = fn || function () {}

    if (o['timeout']) {
      this.timeout = setTimeout(function () {
        self.abort()
      }, o['timeout'])
    }

    if (o['success']) {
      this._successHandler = function () {
        o['success'].apply(o, arguments)
      }
    }

    if (o['error']) {
      this._errorHandlers.push(function () {
        o['error'].apply(o, arguments)
      })
    }

    if (o['complete']) {
      this._completeHandlers.push(function () {
        o['complete'].apply(o, arguments)
      })
    }

    function complete (resp) {
      o['timeout'] && clearTimeout(self.timeout)
      self.timeout = null
      while (self._completeHandlers.length > 0) {
        self._completeHandlers.shift()(resp)
      }
    }

    function success (resp) {
      var type = o['type'] || resp && setType(resp.getResponseHeader('Content-Type')) // resp can be undefined in IE
      resp = (type !== 'jsonp') ? self.request : resp
      // use global data filter on response text
      var filteredResponse = globalSetupOptions.dataFilter(resp.responseText, type)
        , r = filteredResponse
      try {
        resp.responseText = r
      } catch (e) {
        // can't assign this in IE<=8, just ignore
      }
      if (r) {
        switch (type) {
        case 'json':
          try {
            resp = win.JSON ? win.JSON.parse(r) : eval('(' + r + ')')
          } catch (err) {
            return error(resp, 'Could not parse JSON in response', err)
          }
          break
        case 'js':
          resp = eval(r)
          break
        case 'html':
          resp = r
          break
        case 'xml':
          resp = resp.responseXML
              && resp.responseXML.parseError // IE trololo
              && resp.responseXML.parseError.errorCode
              && resp.responseXML.parseError.reason
            ? null
            : resp.responseXML
          break
        }
      }

      self._responseArgs.resp = resp
      self._fulfilled = true
      fn(resp)
      self._successHandler(resp)
      while (self._fulfillmentHandlers.length > 0) {
        resp = self._fulfillmentHandlers.shift()(resp)
      }

      complete(resp)
    }

    function error(resp, msg, t) {
      resp = self.request
      self._responseArgs.resp = resp
      self._responseArgs.msg = msg
      self._responseArgs.t = t
      self._erred = true
      while (self._errorHandlers.length > 0) {
        self._errorHandlers.shift()(resp, msg, t)
      }
      complete(resp)
    }

    this.request = getRequest.call(this, success, error)
  }

  Reqwest.prototype = {
    abort: function () {
      this._aborted = true
      this.request.abort()
    }

  , retry: function () {
      init.call(this, this.o, this.fn)
    }

    /**
     * Small deviation from the Promises A CommonJs specification
     * http://wiki.commonjs.org/wiki/Promises/A
     */

    /**
     * `then` will execute upon successful requests
     */
  , then: function (success, fail) {
      success = success || function () {}
      fail = fail || function () {}
      if (this._fulfilled) {
        this._responseArgs.resp = success(this._responseArgs.resp)
      } else if (this._erred) {
        fail(this._responseArgs.resp, this._responseArgs.msg, this._responseArgs.t)
      } else {
        this._fulfillmentHandlers.push(success)
        this._errorHandlers.push(fail)
      }
      return this
    }

    /**
     * `always` will execute whether the request succeeds or fails
     */
  , always: function (fn) {
      if (this._fulfilled || this._erred) {
        fn(this._responseArgs.resp)
      } else {
        this._completeHandlers.push(fn)
      }
      return this
    }

    /**
     * `fail` will execute when the request fails
     */
  , fail: function (fn) {
      if (this._erred) {
        fn(this._responseArgs.resp, this._responseArgs.msg, this._responseArgs.t)
      } else {
        this._errorHandlers.push(fn)
      }
      return this
    }
  , 'catch': function (fn) {
      return this.fail(fn)
    }
  }

  function reqwest(o, fn) {
    return new Reqwest(o, fn)
  }

  // normalize newline variants according to spec -> CRLF
  function normalize(s) {
    return s ? s.replace(/\r?\n/g, '\r\n') : ''
  }

  function serial(el, cb) {
    var n = el.name
      , t = el.tagName.toLowerCase()
      , optCb = function (o) {
          // IE gives value="" even where there is no value attribute
          // 'specified' ref: http://www.w3.org/TR/DOM-Level-3-Core/core.html#ID-862529273
          if (o && !o['disabled'])
            cb(n, normalize(o['attributes']['value'] && o['attributes']['value']['specified'] ? o['value'] : o['text']))
        }
      , ch, ra, val, i

    // don't serialize elements that are disabled or without a name
    if (el.disabled || !n) return

    switch (t) {
    case 'input':
      if (!/reset|button|image|file/i.test(el.type)) {
        ch = /checkbox/i.test(el.type)
        ra = /radio/i.test(el.type)
        val = el.value
        // WebKit gives us "" instead of "on" if a checkbox has no value, so correct it here
        ;(!(ch || ra) || el.checked) && cb(n, normalize(ch && val === '' ? 'on' : val))
      }
      break
    case 'textarea':
      cb(n, normalize(el.value))
      break
    case 'select':
      if (el.type.toLowerCase() === 'select-one') {
        optCb(el.selectedIndex >= 0 ? el.options[el.selectedIndex] : null)
      } else {
        for (i = 0; el.length && i < el.length; i++) {
          el.options[i].selected && optCb(el.options[i])
        }
      }
      break
    }
  }

  // collect up all form elements found from the passed argument elements all
  // the way down to child elements; pass a '<form>' or form fields.
  // called with 'this'=callback to use for serial() on each element
  function eachFormElement() {
    var cb = this
      , e, i
      , serializeSubtags = function (e, tags) {
          var i, j, fa
          for (i = 0; i < tags.length; i++) {
            fa = e[byTag](tags[i])
            for (j = 0; j < fa.length; j++) serial(fa[j], cb)
          }
        }

    for (i = 0; i < arguments.length; i++) {
      e = arguments[i]
      if (/input|select|textarea/i.test(e.tagName)) serial(e, cb)
      serializeSubtags(e, [ 'input', 'select', 'textarea' ])
    }
  }

  // standard query string style serialization
  function serializeQueryString() {
    return reqwest.toQueryString(reqwest.serializeArray.apply(null, arguments))
  }

  // { 'name': 'value', ... } style serialization
  function serializeHash() {
    var hash = {}
    eachFormElement.apply(function (name, value) {
      if (name in hash) {
        hash[name] && !isArray(hash[name]) && (hash[name] = [hash[name]])
        hash[name].push(value)
      } else hash[name] = value
    }, arguments)
    return hash
  }

  // [ { name: 'name', value: 'value' }, ... ] style serialization
  reqwest.serializeArray = function () {
    var arr = []
    eachFormElement.apply(function (name, value) {
      arr.push({name: name, value: value})
    }, arguments)
    return arr
  }

  reqwest.serialize = function () {
    if (arguments.length === 0) return ''
    var opt, fn
      , args = Array.prototype.slice.call(arguments, 0)

    opt = args.pop()
    opt && opt.nodeType && args.push(opt) && (opt = null)
    opt && (opt = opt.type)

    if (opt == 'map') fn = serializeHash
    else if (opt == 'array') fn = reqwest.serializeArray
    else fn = serializeQueryString

    return fn.apply(null, args)
  }

  reqwest.toQueryString = function (o, trad) {
    var prefix, i
      , traditional = trad || false
      , s = []
      , enc = encodeURIComponent
      , add = function (key, value) {
          // If value is a function, invoke it and return its value
          value = ('function' === typeof value) ? value() : (value == null ? '' : value)
          s[s.length] = enc(key) + '=' + enc(value)
        }
    // If an array was passed in, assume that it is an array of form elements.
    if (isArray(o)) {
      for (i = 0; o && i < o.length; i++) add(o[i]['name'], o[i]['value'])
    } else {
      // If traditional, encode the "old" way (the way 1.3.2 or older
      // did it), otherwise encode params recursively.
      for (prefix in o) {
        if (o.hasOwnProperty(prefix)) buildParams(prefix, o[prefix], traditional, add)
      }
    }

    // spaces should be + according to spec
    return s.join('&').replace(/%20/g, '+')
  }

  function buildParams(prefix, obj, traditional, add) {
    var name, i, v
      , rbracket = /\[\]$/

    if (isArray(obj)) {
      // Serialize array item.
      for (i = 0; obj && i < obj.length; i++) {
        v = obj[i]
        if (traditional || rbracket.test(prefix)) {
          // Treat each array item as a scalar.
          add(prefix, v)
        } else {
          buildParams(prefix + '[' + (typeof v === 'object' ? i : '') + ']', v, traditional, add)
        }
      }
    } else if (obj && obj.toString() === '[object Object]') {
      // Serialize object item.
      for (name in obj) {
        buildParams(prefix + '[' + name + ']', obj[name], traditional, add)
      }

    } else {
      // Serialize scalar item.
      add(prefix, obj)
    }
  }

  reqwest.getcallbackPrefix = function () {
    return callbackPrefix
  }

  // jQuery and Zepto compatibility, differences can be remapped here so you can call
  // .ajax.compat(options, callback)
  reqwest.compat = function (o, fn) {
    if (o) {
      o['type'] && (o['method'] = o['type']) && delete o['type']
      o['dataType'] && (o['type'] = o['dataType'])
      o['jsonpCallback'] && (o['jsonpCallbackName'] = o['jsonpCallback']) && delete o['jsonpCallback']
      o['jsonp'] && (o['jsonpCallback'] = o['jsonp'])
    }
    return new Reqwest(o, fn)
  }

  reqwest.ajaxSetup = function (options) {
    options = options || {}
    for (var k in options) {
      globalSetupOptions[k] = options[k]
    }
  }

  return reqwest
});

},{}],"/Users/w8r/Projects/tweethistorgam/node_modules/throttleit/index.js":[function(require,module,exports){

/**
 * Module exports.
 */

module.exports = throttle;

/**
 * Returns a new function that, when invoked, invokes `func` at most `max` times per
 * `wait` milliseconds.
 *
 * @param {Function} func The `Function` instance to wrap.
 * @param {Number} wait The minimum number of milliseconds that must elapse in between `max` `func` invocations.
 * @param {Number} max The maximum number of times `func` may be invoked between `wait` milliseconds.
 * @return {Function} A new function that wraps the `func` function passed in.
 * @api public
 */

function throttle (func, wait, max) {
  max = max || 1;
  var rtn; // return value
  var last = 0; // last invokation timestamp
  var count = 0; // number of times invoked
  return function throttled () {
    var now = new Date().getTime();
    var delta = now - last;
    if (delta >= wait) { // reset
      last = now;
      count = 0;
    }
    if (count++ < max) rtn = func.apply(this, arguments);
    return rtn;
  };
}

},{}],"/Users/w8r/Projects/tweethistorgam/settings.json":[function(require,module,exports){
module.exports={
    "dataUrl": "/data/data.csv",
    "histogramBg": "rgba(20,20,20,0.8)#c85221",
    "outskirtsColor": "#00a0ff",
    "centerColor": "#d4792b",
    "opacity": 0.7,
    "center": [55.7455891, 37.6193629],
    "zoom": 11,
    "mapboxKey": "pk.eyJ1IjoidzhyIiwiYSI6IlF2Nlh6QVkifQ.D7BkmeoMI7GEkMDtg3durw",
    "mapboxId": "examples.map-20v6611k"
}

},{}],"/Users/w8r/Projects/tweethistorgam/src/app.js":[function(require,module,exports){
(function (global){
"use strict";

var reqwest = global.reqwest = require('reqwest');
var TimeControl = require('./timecontrol');
var Map = require('./map');

/**
 * @param {Object} options
 * @constructor
 */
function App(options) {

    /**
     * @type {Object}
     */
    this.options = options;

    /**
     * @type {Array.<Object>}
     */
    this._data = null;

    /**
     * @type {Histogram}
     */
    this._histogram = null;

    /**
     * @type {Map}
     */
    this._map = new Map('map', {
        mapboxId: options.mapboxId,
        mapboxKey: options.mapboxKey
    }).setView(options.center, options.zoom);

    this.getData(options.dataUrl, this.onDataReceived.bind(this));
};

/**
 * @param  {String}   url
 * @param  {Function} callback
 */
App.prototype.getData = function(url, callback) {
    reqwest({
        url: url,
        crossOrigin: true,
        withCredentials: true,
        //contentType: 'text/csv',
        success: function(response) {
            // weird s3/localhost interchangability
            if (typeof response !== 'string') {
                response = response.response;
            }
            callback(response);
        }
    });
};

/**
 * @param  {String} data
 */
App.prototype.onDataReceived = function(data) {
    this._data = this.parse(data);

    this._timeControl = new TimeControl(this._data, this.options)
        .addTo(this._map);
};

/**
 * @param  {String} csv
 * @return {Array.<Object>}
 */
App.prototype.parse = function(csv) {
    csv = csv.split(/\n/g);

    var headers = csv[0].split(';'),
        data = [],
        center = 0,
        outskirts = 0,
        maxCenter = 0,
        maxOutskirts = 0,
        dayData, date,
        rowStr, row;

    csv = ('\n' + csv.slice(1, csv.length).join('\n'))
        .split(/\n(:?\d{2}.\d{2}.\d{4}\;)/g);

    for (var i = 2, ii = csv.length; i < ii; i += 2) {
        row = {};
        rowStr = (csv[i - 1] + csv[i]).split(/\;/g);

        for (var j = 0, jj = rowStr.length; j < jj; j++) {
            if (/^(lat|long)/.test(headers[j])) {
                rowStr[j] = parseFloat(rowStr[j].replace(',', '.'));
            }
            row[headers[j]] = rowStr[j];
        }
        data.push(row);
    }

    return data
};

module.exports = App;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./map":"/Users/w8r/Projects/tweethistorgam/src/map.js","./timecontrol":"/Users/w8r/Projects/tweethistorgam/src/timecontrol.js","reqwest":"/Users/w8r/Projects/tweethistorgam/node_modules/reqwest/reqwest.js"}],"/Users/w8r/Projects/tweethistorgam/src/dynamic_layer.js":[function(require,module,exports){
"use strict";

var L = require('leaflet');

L.DynamicLayer = L.Class.extend({

    // options: {
    //     maxZoom: 18,
    //     radius: 25,
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
        map.on('zoomstart', this._stopRendering, this);

        if (map.options.zoomAnimation && L.Browser.any3d) {
            map.on('zoomanim', this._animateZoom, this);
        }

        this._reset();
    },

    onRemove: function(map) {
        map.getPanes().overlayPane.removeChild(this._canvas);
        this._stopRendering();

        map.off('moveend', this._reset, this);
        map.off('zoomstart', this._stopRendering, this);

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
        this._reset();
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
        var i, len, point, data = [],
            r = 20,
            moved = this._moved,
            size = this._map.getSize(),
            bounds = new L.LatLngBounds(
                this._map.containerPointToLatLng(L.point([-r, -r])),
                this._map.containerPointToLatLng(size.add([r, r]))),
            pointsToRender = 0;

        for (i = 0, len = this._data.length; i < len; i++) {
            point = this._data[i];
            if (bounds.contains(point.latlng)) {
                if (!('px' in point) || moved) {
                    point.px = this._map.latLngToContainerPoint(point.latlng);
                }

                if (!this._renderer.pointIsRendered(point)) {
                    point = this._renderer.prerender(point);
                    pointsToRender++;
                    data.push(point);
                } else if (point.active) {
                    data.push(point);
                }

            } else {
                point.opacity = point.radius = 0;
            }
        }
        this._renderer.draw(data);
        this._frame = this._moved = null;

        if (pointsToRender) {
            this.redraw();
        }
    },

    _stopRendering: function() {
        L.Util.cancelAnimFrame(this._frame);
        this._frame = null;
    },

    _animateZoom: function(e) {
        var scale = this._map.getZoomScale(e.zoom),
            offset = this._map._getCenterOffset(e.center)
            ._multiplyBy(-scale)
            .subtract(this._map._getMapPanePos());

        this._canvas.style[L.DomUtil.TRANSFORM] =
            L.DomUtil.getTranslateString(offset) + ' scale(' + scale + ')';
    }
});

// factory
L.dynamicLayer = function(data, options) {
    return new L.DynamicLayer(data, options);
};

module.exports = L.DynamicLayer;

},{"leaflet":"/Users/w8r/Projects/tweethistorgam/node_modules/leaflet/dist/leaflet-src.js"}],"/Users/w8r/Projects/tweethistorgam/src/histogram.js":[function(require,module,exports){
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

},{"throttleit":"/Users/w8r/Projects/tweethistorgam/node_modules/throttleit/index.js"}],"/Users/w8r/Projects/tweethistorgam/src/map.js":[function(require,module,exports){
"use strict";

var L = require('leaflet');

/**
 * @param  {Element} container
 * @param  {Object}  options
 */
var Map = L.Map.extend({
    initialize: function(container, options) {
        L.Map.prototype.initialize.call(this, container, options);

        // 'http://{s}.tiles.mapbox.com/v4/' + options.mapboxId + '/{z}/{x}/{y}.png?access_token=' + options.mapboxKey
        L.tileLayer('http://{s}.tiles.mapbox.com/v4/' +
            options.mapboxId + '/{z}/{x}/{y}.png?access_token=' +
            options.mapboxKey, {
                attribution: '&copy; ' +
                    '<a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(this);

        // L.tileLayer('http://{s}.tiles.mapbox.com/v3/mapbox.mapbox-light/{z}/{x}/{y}.png?access_token' +
        //     options.mapboxKey, {
        //         attribution: '&copy; ' +
        //             '<a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        //     }).addTo(this);
    }
});

module.exports = Map;

},{"leaflet":"/Users/w8r/Projects/tweethistorgam/node_modules/leaflet/dist/leaflet-src.js"}],"/Users/w8r/Projects/tweethistorgam/src/renderer.js":[function(require,module,exports){
"use strict";

var min = Math.min,
    max = Math.max,
    abs = Math.abs,
    round = Math.round,
    floor = Math.floor,
    PI_2 = Math.PI * 2;

/**
 * @param {Object} options
 * @constructor
 */
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

/**
 * Init canvas
 * @param  {Canvas} canvas
 * @return {Renderer}
 */
Renderer.prototype.canvas = function(canvas) {
    this._canvas = canvas;
    this._ctx = canvas.getContext('2d');
    this.update();
    return this;
};

/**
 * Update canvas size
 * @return {Renderer}
 */
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

    if (!('color' in p)) {
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

/**
 * Does the point need some more iterations
 * @param  {Object}  point
 * @return {Boolean}
 */
Renderer.prototype.pointIsRendered = function(point) {
    return ((!point.active && point.opacity === 0) ||
        (point.active && point.radius === this.options.radius));
};

/**
 * Exclude hidden points from data set
 * @return {Boolean}
 */
Renderer.prototype.pointIsHidden = function() {
    return !point.active && point.opacity === 0;
};

/**
 * Redraw the scene
 * @param  {Array.<Object>} data
 * @return {Renderer}
 */
Renderer.prototype.draw = function(data) {
    var p, context = this._ctx;
    this._ctx.clearRect(0, 0, this._width, this._height);
    for (var i = 0, len = data.length; i < len; i++) {
        p = data[i];

        // no micro function calls
        //this.drawPoint(p.px, p.radius, p.color, p.opacity);
        context.globalAlpha = p.opacity;
        context.beginPath();
        context.arc(p.px.x, p.px.y, p.radius, 0, PI_2, false);
        context.fillStyle = p.color;
        context.fill();
        context.lineWidth = 1;
        context.strokeStyle = p.color;
        context.stroke();

    }
    return this;
};

/**
 * @param  {Object} p
 * @param  {Number} r
 * @param  {String} c
 * @param  {Number} o
 */
Renderer.prototype.drawPoint = function(p, r, c, o) {
    var context = this._ctx;
    context.globalAlpha = o;
    context.beginPath();
    context.arc(p.x, p.y, r, 0, PI_2, false);
    context.fillStyle = c;
    context.fill();
    context.lineWidth = 1;
    context.strokeStyle = c;
    context.stroke();
};

module.exports = Renderer;

},{}],"/Users/w8r/Projects/tweethistorgam/src/timecontrol.js":[function(require,module,exports){
(function (global){
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

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./dynamic_layer":"/Users/w8r/Projects/tweethistorgam/src/dynamic_layer.js","./histogram":"/Users/w8r/Projects/tweethistorgam/src/histogram.js","./renderer":"/Users/w8r/Projects/tweethistorgam/src/renderer.js","hammerjs":"/Users/w8r/Projects/tweethistorgam/node_modules/hammerjs/hammer.js","leaflet":"/Users/w8r/Projects/tweethistorgam/node_modules/leaflet/dist/leaflet-src.js","position":"/Users/w8r/Projects/tweethistorgam/node_modules/position/index.js"}]},{},["/Users/w8r/Projects/tweethistorgam/index.js"])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Vzci9sb2NhbC9saWIvbm9kZV9tb2R1bGVzL3dhdGNoaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvdzhyL1Byb2plY3RzL3R3ZWV0aGlzdG9yZ2FtL2luZGV4LmpzIiwiL1VzZXJzL3c4ci9Qcm9qZWN0cy90d2VldGhpc3RvcmdhbS9ub2RlX21vZHVsZXMvaGFtbWVyanMvaGFtbWVyLmpzIiwiL1VzZXJzL3c4ci9Qcm9qZWN0cy90d2VldGhpc3RvcmdhbS9ub2RlX21vZHVsZXMvbGVhZmxldC9kaXN0L2xlYWZsZXQtc3JjLmpzIiwiL1VzZXJzL3c4ci9Qcm9qZWN0cy90d2VldGhpc3RvcmdhbS9ub2RlX21vZHVsZXMvcG9zaXRpb24vaW5kZXguanMiLCIvVXNlcnMvdzhyL1Byb2plY3RzL3R3ZWV0aGlzdG9yZ2FtL25vZGVfbW9kdWxlcy9wb3NpdGlvbi9ub2RlX21vZHVsZXMvY29tcHV0ZWQtc3R5bGUvaW5kZXguanMiLCIvVXNlcnMvdzhyL1Byb2plY3RzL3R3ZWV0aGlzdG9yZ2FtL25vZGVfbW9kdWxlcy9yZXF3ZXN0L3JlcXdlc3QuanMiLCIvVXNlcnMvdzhyL1Byb2plY3RzL3R3ZWV0aGlzdG9yZ2FtL25vZGVfbW9kdWxlcy90aHJvdHRsZWl0L2luZGV4LmpzIiwiL1VzZXJzL3c4ci9Qcm9qZWN0cy90d2VldGhpc3RvcmdhbS9zZXR0aW5ncy5qc29uIiwiL1VzZXJzL3c4ci9Qcm9qZWN0cy90d2VldGhpc3RvcmdhbS9zcmMvYXBwLmpzIiwiL1VzZXJzL3c4ci9Qcm9qZWN0cy90d2VldGhpc3RvcmdhbS9zcmMvZHluYW1pY19sYXllci5qcyIsIi9Vc2Vycy93OHIvUHJvamVjdHMvdHdlZXRoaXN0b3JnYW0vc3JjL2hpc3RvZ3JhbS5qcyIsIi9Vc2Vycy93OHIvUHJvamVjdHMvdHdlZXRoaXN0b3JnYW0vc3JjL21hcC5qcyIsIi9Vc2Vycy93OHIvUHJvamVjdHMvdHdlZXRoaXN0b3JnYW0vc3JjL3JlbmRlcmVyLmpzIiwiL1VzZXJzL3c4ci9Qcm9qZWN0cy90d2VldGhpc3RvcmdhbS9zcmMvdGltZWNvbnRyb2wuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDLzVFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMzlSQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqbUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNYQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hYQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNySkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIihmdW5jdGlvbiAoZ2xvYmFsKXtcbnZhciBBcHAgPSByZXF1aXJlKCcuL3NyYy9hcHAnKTtcblxudmFyIGFwcCA9IGdsb2JhbC5hcHAgPSBuZXcgQXBwKHJlcXVpcmUoJy4vc2V0dGluZ3MuanNvbicpKTtcblxufSkuY2FsbCh0aGlzLHR5cGVvZiBnbG9iYWwgIT09IFwidW5kZWZpbmVkXCIgPyBnbG9iYWwgOiB0eXBlb2Ygc2VsZiAhPT0gXCJ1bmRlZmluZWRcIiA/IHNlbGYgOiB0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93IDoge30pIiwiLyohIEhhbW1lci5KUyAtIHYyLjAuNCAtIDIwMTQtMDktMjhcclxuICogaHR0cDovL2hhbW1lcmpzLmdpdGh1Yi5pby9cclxuICpcclxuICogQ29weXJpZ2h0IChjKSAyMDE0IEpvcmlrIFRhbmdlbGRlcjtcclxuICogTGljZW5zZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlICovXHJcbihmdW5jdGlvbih3aW5kb3csIGRvY3VtZW50LCBleHBvcnROYW1lLCB1bmRlZmluZWQpIHtcclxuICAndXNlIHN0cmljdCc7XHJcblxyXG52YXIgVkVORE9SX1BSRUZJWEVTID0gWycnLCAnd2Via2l0JywgJ21veicsICdNUycsICdtcycsICdvJ107XHJcbnZhciBURVNUX0VMRU1FTlQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuXHJcbnZhciBUWVBFX0ZVTkNUSU9OID0gJ2Z1bmN0aW9uJztcclxuXHJcbnZhciByb3VuZCA9IE1hdGgucm91bmQ7XHJcbnZhciBhYnMgPSBNYXRoLmFicztcclxudmFyIG5vdyA9IERhdGUubm93O1xyXG5cclxuLyoqXHJcbiAqIHNldCBhIHRpbWVvdXQgd2l0aCBhIGdpdmVuIHNjb3BlXHJcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZuXHJcbiAqIEBwYXJhbSB7TnVtYmVyfSB0aW1lb3V0XHJcbiAqIEBwYXJhbSB7T2JqZWN0fSBjb250ZXh0XHJcbiAqIEByZXR1cm5zIHtudW1iZXJ9XHJcbiAqL1xyXG5mdW5jdGlvbiBzZXRUaW1lb3V0Q29udGV4dChmbiwgdGltZW91dCwgY29udGV4dCkge1xyXG4gICAgcmV0dXJuIHNldFRpbWVvdXQoYmluZEZuKGZuLCBjb250ZXh0KSwgdGltZW91dCk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBpZiB0aGUgYXJndW1lbnQgaXMgYW4gYXJyYXksIHdlIHdhbnQgdG8gZXhlY3V0ZSB0aGUgZm4gb24gZWFjaCBlbnRyeVxyXG4gKiBpZiBpdCBhaW50IGFuIGFycmF5IHdlIGRvbid0IHdhbnQgdG8gZG8gYSB0aGluZy5cclxuICogdGhpcyBpcyB1c2VkIGJ5IGFsbCB0aGUgbWV0aG9kcyB0aGF0IGFjY2VwdCBhIHNpbmdsZSBhbmQgYXJyYXkgYXJndW1lbnQuXHJcbiAqIEBwYXJhbSB7KnxBcnJheX0gYXJnXHJcbiAqIEBwYXJhbSB7U3RyaW5nfSBmblxyXG4gKiBAcGFyYW0ge09iamVjdH0gW2NvbnRleHRdXHJcbiAqIEByZXR1cm5zIHtCb29sZWFufVxyXG4gKi9cclxuZnVuY3Rpb24gaW52b2tlQXJyYXlBcmcoYXJnLCBmbiwgY29udGV4dCkge1xyXG4gICAgaWYgKEFycmF5LmlzQXJyYXkoYXJnKSkge1xyXG4gICAgICAgIGVhY2goYXJnLCBjb250ZXh0W2ZuXSwgY29udGV4dCk7XHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gZmFsc2U7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiB3YWxrIG9iamVjdHMgYW5kIGFycmF5c1xyXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqXHJcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGl0ZXJhdG9yXHJcbiAqIEBwYXJhbSB7T2JqZWN0fSBjb250ZXh0XHJcbiAqL1xyXG5mdW5jdGlvbiBlYWNoKG9iaiwgaXRlcmF0b3IsIGNvbnRleHQpIHtcclxuICAgIHZhciBpO1xyXG5cclxuICAgIGlmICghb2JqKSB7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChvYmouZm9yRWFjaCkge1xyXG4gICAgICAgIG9iai5mb3JFYWNoKGl0ZXJhdG9yLCBjb250ZXh0KTtcclxuICAgIH0gZWxzZSBpZiAob2JqLmxlbmd0aCAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgaSA9IDA7XHJcbiAgICAgICAgd2hpbGUgKGkgPCBvYmoubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgIGl0ZXJhdG9yLmNhbGwoY29udGV4dCwgb2JqW2ldLCBpLCBvYmopO1xyXG4gICAgICAgICAgICBpKys7XHJcbiAgICAgICAgfVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICBmb3IgKGkgaW4gb2JqKSB7XHJcbiAgICAgICAgICAgIG9iai5oYXNPd25Qcm9wZXJ0eShpKSAmJiBpdGVyYXRvci5jYWxsKGNvbnRleHQsIG9ialtpXSwgaSwgb2JqKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBleHRlbmQgb2JqZWN0LlxyXG4gKiBtZWFucyB0aGF0IHByb3BlcnRpZXMgaW4gZGVzdCB3aWxsIGJlIG92ZXJ3cml0dGVuIGJ5IHRoZSBvbmVzIGluIHNyYy5cclxuICogQHBhcmFtIHtPYmplY3R9IGRlc3RcclxuICogQHBhcmFtIHtPYmplY3R9IHNyY1xyXG4gKiBAcGFyYW0ge0Jvb2xlYW59IFttZXJnZV1cclxuICogQHJldHVybnMge09iamVjdH0gZGVzdFxyXG4gKi9cclxuZnVuY3Rpb24gZXh0ZW5kKGRlc3QsIHNyYywgbWVyZ2UpIHtcclxuICAgIHZhciBrZXlzID0gT2JqZWN0LmtleXMoc3JjKTtcclxuICAgIHZhciBpID0gMDtcclxuICAgIHdoaWxlIChpIDwga2V5cy5sZW5ndGgpIHtcclxuICAgICAgICBpZiAoIW1lcmdlIHx8IChtZXJnZSAmJiBkZXN0W2tleXNbaV1dID09PSB1bmRlZmluZWQpKSB7XHJcbiAgICAgICAgICAgIGRlc3Rba2V5c1tpXV0gPSBzcmNba2V5c1tpXV07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGkrKztcclxuICAgIH1cclxuICAgIHJldHVybiBkZXN0O1xyXG59XHJcblxyXG4vKipcclxuICogbWVyZ2UgdGhlIHZhbHVlcyBmcm9tIHNyYyBpbiB0aGUgZGVzdC5cclxuICogbWVhbnMgdGhhdCBwcm9wZXJ0aWVzIHRoYXQgZXhpc3QgaW4gZGVzdCB3aWxsIG5vdCBiZSBvdmVyd3JpdHRlbiBieSBzcmNcclxuICogQHBhcmFtIHtPYmplY3R9IGRlc3RcclxuICogQHBhcmFtIHtPYmplY3R9IHNyY1xyXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBkZXN0XHJcbiAqL1xyXG5mdW5jdGlvbiBtZXJnZShkZXN0LCBzcmMpIHtcclxuICAgIHJldHVybiBleHRlbmQoZGVzdCwgc3JjLCB0cnVlKTtcclxufVxyXG5cclxuLyoqXHJcbiAqIHNpbXBsZSBjbGFzcyBpbmhlcml0YW5jZVxyXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBjaGlsZFxyXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBiYXNlXHJcbiAqIEBwYXJhbSB7T2JqZWN0fSBbcHJvcGVydGllc11cclxuICovXHJcbmZ1bmN0aW9uIGluaGVyaXQoY2hpbGQsIGJhc2UsIHByb3BlcnRpZXMpIHtcclxuICAgIHZhciBiYXNlUCA9IGJhc2UucHJvdG90eXBlLFxyXG4gICAgICAgIGNoaWxkUDtcclxuXHJcbiAgICBjaGlsZFAgPSBjaGlsZC5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKGJhc2VQKTtcclxuICAgIGNoaWxkUC5jb25zdHJ1Y3RvciA9IGNoaWxkO1xyXG4gICAgY2hpbGRQLl9zdXBlciA9IGJhc2VQO1xyXG5cclxuICAgIGlmIChwcm9wZXJ0aWVzKSB7XHJcbiAgICAgICAgZXh0ZW5kKGNoaWxkUCwgcHJvcGVydGllcyk7XHJcbiAgICB9XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBzaW1wbGUgZnVuY3Rpb24gYmluZFxyXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmblxyXG4gKiBAcGFyYW0ge09iamVjdH0gY29udGV4dFxyXG4gKiBAcmV0dXJucyB7RnVuY3Rpb259XHJcbiAqL1xyXG5mdW5jdGlvbiBiaW5kRm4oZm4sIGNvbnRleHQpIHtcclxuICAgIHJldHVybiBmdW5jdGlvbiBib3VuZEZuKCkge1xyXG4gICAgICAgIHJldHVybiBmbi5hcHBseShjb250ZXh0LCBhcmd1bWVudHMpO1xyXG4gICAgfTtcclxufVxyXG5cclxuLyoqXHJcbiAqIGxldCBhIGJvb2xlYW4gdmFsdWUgYWxzbyBiZSBhIGZ1bmN0aW9uIHRoYXQgbXVzdCByZXR1cm4gYSBib29sZWFuXHJcbiAqIHRoaXMgZmlyc3QgaXRlbSBpbiBhcmdzIHdpbGwgYmUgdXNlZCBhcyB0aGUgY29udGV4dFxyXG4gKiBAcGFyYW0ge0Jvb2xlYW58RnVuY3Rpb259IHZhbFxyXG4gKiBAcGFyYW0ge0FycmF5fSBbYXJnc11cclxuICogQHJldHVybnMge0Jvb2xlYW59XHJcbiAqL1xyXG5mdW5jdGlvbiBib29sT3JGbih2YWwsIGFyZ3MpIHtcclxuICAgIGlmICh0eXBlb2YgdmFsID09IFRZUEVfRlVOQ1RJT04pIHtcclxuICAgICAgICByZXR1cm4gdmFsLmFwcGx5KGFyZ3MgPyBhcmdzWzBdIHx8IHVuZGVmaW5lZCA6IHVuZGVmaW5lZCwgYXJncyk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gdmFsO1xyXG59XHJcblxyXG4vKipcclxuICogdXNlIHRoZSB2YWwyIHdoZW4gdmFsMSBpcyB1bmRlZmluZWRcclxuICogQHBhcmFtIHsqfSB2YWwxXHJcbiAqIEBwYXJhbSB7Kn0gdmFsMlxyXG4gKiBAcmV0dXJucyB7Kn1cclxuICovXHJcbmZ1bmN0aW9uIGlmVW5kZWZpbmVkKHZhbDEsIHZhbDIpIHtcclxuICAgIHJldHVybiAodmFsMSA9PT0gdW5kZWZpbmVkKSA/IHZhbDIgOiB2YWwxO1xyXG59XHJcblxyXG4vKipcclxuICogYWRkRXZlbnRMaXN0ZW5lciB3aXRoIG11bHRpcGxlIGV2ZW50cyBhdCBvbmNlXHJcbiAqIEBwYXJhbSB7RXZlbnRUYXJnZXR9IHRhcmdldFxyXG4gKiBAcGFyYW0ge1N0cmluZ30gdHlwZXNcclxuICogQHBhcmFtIHtGdW5jdGlvbn0gaGFuZGxlclxyXG4gKi9cclxuZnVuY3Rpb24gYWRkRXZlbnRMaXN0ZW5lcnModGFyZ2V0LCB0eXBlcywgaGFuZGxlcikge1xyXG4gICAgZWFjaChzcGxpdFN0cih0eXBlcyksIGZ1bmN0aW9uKHR5cGUpIHtcclxuICAgICAgICB0YXJnZXQuYWRkRXZlbnRMaXN0ZW5lcih0eXBlLCBoYW5kbGVyLCBmYWxzZSk7XHJcbiAgICB9KTtcclxufVxyXG5cclxuLyoqXHJcbiAqIHJlbW92ZUV2ZW50TGlzdGVuZXIgd2l0aCBtdWx0aXBsZSBldmVudHMgYXQgb25jZVxyXG4gKiBAcGFyYW0ge0V2ZW50VGFyZ2V0fSB0YXJnZXRcclxuICogQHBhcmFtIHtTdHJpbmd9IHR5cGVzXHJcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGhhbmRsZXJcclxuICovXHJcbmZ1bmN0aW9uIHJlbW92ZUV2ZW50TGlzdGVuZXJzKHRhcmdldCwgdHlwZXMsIGhhbmRsZXIpIHtcclxuICAgIGVhY2goc3BsaXRTdHIodHlwZXMpLCBmdW5jdGlvbih0eXBlKSB7XHJcbiAgICAgICAgdGFyZ2V0LnJlbW92ZUV2ZW50TGlzdGVuZXIodHlwZSwgaGFuZGxlciwgZmFsc2UpO1xyXG4gICAgfSk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBmaW5kIGlmIGEgbm9kZSBpcyBpbiB0aGUgZ2l2ZW4gcGFyZW50XHJcbiAqIEBtZXRob2QgaGFzUGFyZW50XHJcbiAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IG5vZGVcclxuICogQHBhcmFtIHtIVE1MRWxlbWVudH0gcGFyZW50XHJcbiAqIEByZXR1cm4ge0Jvb2xlYW59IGZvdW5kXHJcbiAqL1xyXG5mdW5jdGlvbiBoYXNQYXJlbnQobm9kZSwgcGFyZW50KSB7XHJcbiAgICB3aGlsZSAobm9kZSkge1xyXG4gICAgICAgIGlmIChub2RlID09IHBhcmVudCkge1xyXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgbm9kZSA9IG5vZGUucGFyZW50Tm9kZTtcclxuICAgIH1cclxuICAgIHJldHVybiBmYWxzZTtcclxufVxyXG5cclxuLyoqXHJcbiAqIHNtYWxsIGluZGV4T2Ygd3JhcHBlclxyXG4gKiBAcGFyYW0ge1N0cmluZ30gc3RyXHJcbiAqIEBwYXJhbSB7U3RyaW5nfSBmaW5kXHJcbiAqIEByZXR1cm5zIHtCb29sZWFufSBmb3VuZFxyXG4gKi9cclxuZnVuY3Rpb24gaW5TdHIoc3RyLCBmaW5kKSB7XHJcbiAgICByZXR1cm4gc3RyLmluZGV4T2YoZmluZCkgPiAtMTtcclxufVxyXG5cclxuLyoqXHJcbiAqIHNwbGl0IHN0cmluZyBvbiB3aGl0ZXNwYWNlXHJcbiAqIEBwYXJhbSB7U3RyaW5nfSBzdHJcclxuICogQHJldHVybnMge0FycmF5fSB3b3Jkc1xyXG4gKi9cclxuZnVuY3Rpb24gc3BsaXRTdHIoc3RyKSB7XHJcbiAgICByZXR1cm4gc3RyLnRyaW0oKS5zcGxpdCgvXFxzKy9nKTtcclxufVxyXG5cclxuLyoqXHJcbiAqIGZpbmQgaWYgYSBhcnJheSBjb250YWlucyB0aGUgb2JqZWN0IHVzaW5nIGluZGV4T2Ygb3IgYSBzaW1wbGUgcG9seUZpbGxcclxuICogQHBhcmFtIHtBcnJheX0gc3JjXHJcbiAqIEBwYXJhbSB7U3RyaW5nfSBmaW5kXHJcbiAqIEBwYXJhbSB7U3RyaW5nfSBbZmluZEJ5S2V5XVxyXG4gKiBAcmV0dXJuIHtCb29sZWFufE51bWJlcn0gZmFsc2Ugd2hlbiBub3QgZm91bmQsIG9yIHRoZSBpbmRleFxyXG4gKi9cclxuZnVuY3Rpb24gaW5BcnJheShzcmMsIGZpbmQsIGZpbmRCeUtleSkge1xyXG4gICAgaWYgKHNyYy5pbmRleE9mICYmICFmaW5kQnlLZXkpIHtcclxuICAgICAgICByZXR1cm4gc3JjLmluZGV4T2YoZmluZCk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIHZhciBpID0gMDtcclxuICAgICAgICB3aGlsZSAoaSA8IHNyYy5sZW5ndGgpIHtcclxuICAgICAgICAgICAgaWYgKChmaW5kQnlLZXkgJiYgc3JjW2ldW2ZpbmRCeUtleV0gPT0gZmluZCkgfHwgKCFmaW5kQnlLZXkgJiYgc3JjW2ldID09PSBmaW5kKSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaSsrO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gLTE7XHJcbiAgICB9XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBjb252ZXJ0IGFycmF5LWxpa2Ugb2JqZWN0cyB0byByZWFsIGFycmF5c1xyXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqXHJcbiAqIEByZXR1cm5zIHtBcnJheX1cclxuICovXHJcbmZ1bmN0aW9uIHRvQXJyYXkob2JqKSB7XHJcbiAgICByZXR1cm4gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwob2JqLCAwKTtcclxufVxyXG5cclxuLyoqXHJcbiAqIHVuaXF1ZSBhcnJheSB3aXRoIG9iamVjdHMgYmFzZWQgb24gYSBrZXkgKGxpa2UgJ2lkJykgb3IganVzdCBieSB0aGUgYXJyYXkncyB2YWx1ZVxyXG4gKiBAcGFyYW0ge0FycmF5fSBzcmMgW3tpZDoxfSx7aWQ6Mn0se2lkOjF9XVxyXG4gKiBAcGFyYW0ge1N0cmluZ30gW2tleV1cclxuICogQHBhcmFtIHtCb29sZWFufSBbc29ydD1GYWxzZV1cclxuICogQHJldHVybnMge0FycmF5fSBbe2lkOjF9LHtpZDoyfV1cclxuICovXHJcbmZ1bmN0aW9uIHVuaXF1ZUFycmF5KHNyYywga2V5LCBzb3J0KSB7XHJcbiAgICB2YXIgcmVzdWx0cyA9IFtdO1xyXG4gICAgdmFyIHZhbHVlcyA9IFtdO1xyXG4gICAgdmFyIGkgPSAwO1xyXG5cclxuICAgIHdoaWxlIChpIDwgc3JjLmxlbmd0aCkge1xyXG4gICAgICAgIHZhciB2YWwgPSBrZXkgPyBzcmNbaV1ba2V5XSA6IHNyY1tpXTtcclxuICAgICAgICBpZiAoaW5BcnJheSh2YWx1ZXMsIHZhbCkgPCAwKSB7XHJcbiAgICAgICAgICAgIHJlc3VsdHMucHVzaChzcmNbaV0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICB2YWx1ZXNbaV0gPSB2YWw7XHJcbiAgICAgICAgaSsrO1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChzb3J0KSB7XHJcbiAgICAgICAgaWYgKCFrZXkpIHtcclxuICAgICAgICAgICAgcmVzdWx0cyA9IHJlc3VsdHMuc29ydCgpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHJlc3VsdHMgPSByZXN1bHRzLnNvcnQoZnVuY3Rpb24gc29ydFVuaXF1ZUFycmF5KGEsIGIpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBhW2tleV0gPiBiW2tleV07XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gcmVzdWx0cztcclxufVxyXG5cclxuLyoqXHJcbiAqIGdldCB0aGUgcHJlZml4ZWQgcHJvcGVydHlcclxuICogQHBhcmFtIHtPYmplY3R9IG9ialxyXG4gKiBAcGFyYW0ge1N0cmluZ30gcHJvcGVydHlcclxuICogQHJldHVybnMge1N0cmluZ3xVbmRlZmluZWR9IHByZWZpeGVkXHJcbiAqL1xyXG5mdW5jdGlvbiBwcmVmaXhlZChvYmosIHByb3BlcnR5KSB7XHJcbiAgICB2YXIgcHJlZml4LCBwcm9wO1xyXG4gICAgdmFyIGNhbWVsUHJvcCA9IHByb3BlcnR5WzBdLnRvVXBwZXJDYXNlKCkgKyBwcm9wZXJ0eS5zbGljZSgxKTtcclxuXHJcbiAgICB2YXIgaSA9IDA7XHJcbiAgICB3aGlsZSAoaSA8IFZFTkRPUl9QUkVGSVhFUy5sZW5ndGgpIHtcclxuICAgICAgICBwcmVmaXggPSBWRU5ET1JfUFJFRklYRVNbaV07XHJcbiAgICAgICAgcHJvcCA9IChwcmVmaXgpID8gcHJlZml4ICsgY2FtZWxQcm9wIDogcHJvcGVydHk7XHJcblxyXG4gICAgICAgIGlmIChwcm9wIGluIG9iaikge1xyXG4gICAgICAgICAgICByZXR1cm4gcHJvcDtcclxuICAgICAgICB9XHJcbiAgICAgICAgaSsrO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHVuZGVmaW5lZDtcclxufVxyXG5cclxuLyoqXHJcbiAqIGdldCBhIHVuaXF1ZSBpZFxyXG4gKiBAcmV0dXJucyB7bnVtYmVyfSB1bmlxdWVJZFxyXG4gKi9cclxudmFyIF91bmlxdWVJZCA9IDE7XHJcbmZ1bmN0aW9uIHVuaXF1ZUlkKCkge1xyXG4gICAgcmV0dXJuIF91bmlxdWVJZCsrO1xyXG59XHJcblxyXG4vKipcclxuICogZ2V0IHRoZSB3aW5kb3cgb2JqZWN0IG9mIGFuIGVsZW1lbnRcclxuICogQHBhcmFtIHtIVE1MRWxlbWVudH0gZWxlbWVudFxyXG4gKiBAcmV0dXJucyB7RG9jdW1lbnRWaWV3fFdpbmRvd31cclxuICovXHJcbmZ1bmN0aW9uIGdldFdpbmRvd0ZvckVsZW1lbnQoZWxlbWVudCkge1xyXG4gICAgdmFyIGRvYyA9IGVsZW1lbnQub3duZXJEb2N1bWVudDtcclxuICAgIHJldHVybiAoZG9jLmRlZmF1bHRWaWV3IHx8IGRvYy5wYXJlbnRXaW5kb3cpO1xyXG59XHJcblxyXG52YXIgTU9CSUxFX1JFR0VYID0gL21vYmlsZXx0YWJsZXR8aXAoYWR8aG9uZXxvZCl8YW5kcm9pZC9pO1xyXG5cclxudmFyIFNVUFBPUlRfVE9VQ0ggPSAoJ29udG91Y2hzdGFydCcgaW4gd2luZG93KTtcclxudmFyIFNVUFBPUlRfUE9JTlRFUl9FVkVOVFMgPSBwcmVmaXhlZCh3aW5kb3csICdQb2ludGVyRXZlbnQnKSAhPT0gdW5kZWZpbmVkO1xyXG52YXIgU1VQUE9SVF9PTkxZX1RPVUNIID0gU1VQUE9SVF9UT1VDSCAmJiBNT0JJTEVfUkVHRVgudGVzdChuYXZpZ2F0b3IudXNlckFnZW50KTtcclxuXHJcbnZhciBJTlBVVF9UWVBFX1RPVUNIID0gJ3RvdWNoJztcclxudmFyIElOUFVUX1RZUEVfUEVOID0gJ3Blbic7XHJcbnZhciBJTlBVVF9UWVBFX01PVVNFID0gJ21vdXNlJztcclxudmFyIElOUFVUX1RZUEVfS0lORUNUID0gJ2tpbmVjdCc7XHJcblxyXG52YXIgQ09NUFVURV9JTlRFUlZBTCA9IDI1O1xyXG5cclxudmFyIElOUFVUX1NUQVJUID0gMTtcclxudmFyIElOUFVUX01PVkUgPSAyO1xyXG52YXIgSU5QVVRfRU5EID0gNDtcclxudmFyIElOUFVUX0NBTkNFTCA9IDg7XHJcblxyXG52YXIgRElSRUNUSU9OX05PTkUgPSAxO1xyXG52YXIgRElSRUNUSU9OX0xFRlQgPSAyO1xyXG52YXIgRElSRUNUSU9OX1JJR0hUID0gNDtcclxudmFyIERJUkVDVElPTl9VUCA9IDg7XHJcbnZhciBESVJFQ1RJT05fRE9XTiA9IDE2O1xyXG5cclxudmFyIERJUkVDVElPTl9IT1JJWk9OVEFMID0gRElSRUNUSU9OX0xFRlQgfCBESVJFQ1RJT05fUklHSFQ7XHJcbnZhciBESVJFQ1RJT05fVkVSVElDQUwgPSBESVJFQ1RJT05fVVAgfCBESVJFQ1RJT05fRE9XTjtcclxudmFyIERJUkVDVElPTl9BTEwgPSBESVJFQ1RJT05fSE9SSVpPTlRBTCB8IERJUkVDVElPTl9WRVJUSUNBTDtcclxuXHJcbnZhciBQUk9QU19YWSA9IFsneCcsICd5J107XHJcbnZhciBQUk9QU19DTElFTlRfWFkgPSBbJ2NsaWVudFgnLCAnY2xpZW50WSddO1xyXG5cclxuLyoqXHJcbiAqIGNyZWF0ZSBuZXcgaW5wdXQgdHlwZSBtYW5hZ2VyXHJcbiAqIEBwYXJhbSB7TWFuYWdlcn0gbWFuYWdlclxyXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYWxsYmFja1xyXG4gKiBAcmV0dXJucyB7SW5wdXR9XHJcbiAqIEBjb25zdHJ1Y3RvclxyXG4gKi9cclxuZnVuY3Rpb24gSW5wdXQobWFuYWdlciwgY2FsbGJhY2spIHtcclxuICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgIHRoaXMubWFuYWdlciA9IG1hbmFnZXI7XHJcbiAgICB0aGlzLmNhbGxiYWNrID0gY2FsbGJhY2s7XHJcbiAgICB0aGlzLmVsZW1lbnQgPSBtYW5hZ2VyLmVsZW1lbnQ7XHJcbiAgICB0aGlzLnRhcmdldCA9IG1hbmFnZXIub3B0aW9ucy5pbnB1dFRhcmdldDtcclxuXHJcbiAgICAvLyBzbWFsbGVyIHdyYXBwZXIgYXJvdW5kIHRoZSBoYW5kbGVyLCBmb3IgdGhlIHNjb3BlIGFuZCB0aGUgZW5hYmxlZCBzdGF0ZSBvZiB0aGUgbWFuYWdlcixcclxuICAgIC8vIHNvIHdoZW4gZGlzYWJsZWQgdGhlIGlucHV0IGV2ZW50cyBhcmUgY29tcGxldGVseSBieXBhc3NlZC5cclxuICAgIHRoaXMuZG9tSGFuZGxlciA9IGZ1bmN0aW9uKGV2KSB7XHJcbiAgICAgICAgaWYgKGJvb2xPckZuKG1hbmFnZXIub3B0aW9ucy5lbmFibGUsIFttYW5hZ2VyXSkpIHtcclxuICAgICAgICAgICAgc2VsZi5oYW5kbGVyKGV2KTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgIHRoaXMuaW5pdCgpO1xyXG5cclxufVxyXG5cclxuSW5wdXQucHJvdG90eXBlID0ge1xyXG4gICAgLyoqXHJcbiAgICAgKiBzaG91bGQgaGFuZGxlIHRoZSBpbnB1dEV2ZW50IGRhdGEgYW5kIHRyaWdnZXIgdGhlIGNhbGxiYWNrXHJcbiAgICAgKiBAdmlydHVhbFxyXG4gICAgICovXHJcbiAgICBoYW5kbGVyOiBmdW5jdGlvbigpIHsgfSxcclxuXHJcbiAgICAvKipcclxuICAgICAqIGJpbmQgdGhlIGV2ZW50c1xyXG4gICAgICovXHJcbiAgICBpbml0OiBmdW5jdGlvbigpIHtcclxuICAgICAgICB0aGlzLmV2RWwgJiYgYWRkRXZlbnRMaXN0ZW5lcnModGhpcy5lbGVtZW50LCB0aGlzLmV2RWwsIHRoaXMuZG9tSGFuZGxlcik7XHJcbiAgICAgICAgdGhpcy5ldlRhcmdldCAmJiBhZGRFdmVudExpc3RlbmVycyh0aGlzLnRhcmdldCwgdGhpcy5ldlRhcmdldCwgdGhpcy5kb21IYW5kbGVyKTtcclxuICAgICAgICB0aGlzLmV2V2luICYmIGFkZEV2ZW50TGlzdGVuZXJzKGdldFdpbmRvd0ZvckVsZW1lbnQodGhpcy5lbGVtZW50KSwgdGhpcy5ldldpbiwgdGhpcy5kb21IYW5kbGVyKTtcclxuICAgIH0sXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiB1bmJpbmQgdGhlIGV2ZW50c1xyXG4gICAgICovXHJcbiAgICBkZXN0cm95OiBmdW5jdGlvbigpIHtcclxuICAgICAgICB0aGlzLmV2RWwgJiYgcmVtb3ZlRXZlbnRMaXN0ZW5lcnModGhpcy5lbGVtZW50LCB0aGlzLmV2RWwsIHRoaXMuZG9tSGFuZGxlcik7XHJcbiAgICAgICAgdGhpcy5ldlRhcmdldCAmJiByZW1vdmVFdmVudExpc3RlbmVycyh0aGlzLnRhcmdldCwgdGhpcy5ldlRhcmdldCwgdGhpcy5kb21IYW5kbGVyKTtcclxuICAgICAgICB0aGlzLmV2V2luICYmIHJlbW92ZUV2ZW50TGlzdGVuZXJzKGdldFdpbmRvd0ZvckVsZW1lbnQodGhpcy5lbGVtZW50KSwgdGhpcy5ldldpbiwgdGhpcy5kb21IYW5kbGVyKTtcclxuICAgIH1cclxufTtcclxuXHJcbi8qKlxyXG4gKiBjcmVhdGUgbmV3IGlucHV0IHR5cGUgbWFuYWdlclxyXG4gKiBjYWxsZWQgYnkgdGhlIE1hbmFnZXIgY29uc3RydWN0b3JcclxuICogQHBhcmFtIHtIYW1tZXJ9IG1hbmFnZXJcclxuICogQHJldHVybnMge0lucHV0fVxyXG4gKi9cclxuZnVuY3Rpb24gY3JlYXRlSW5wdXRJbnN0YW5jZShtYW5hZ2VyKSB7XHJcbiAgICB2YXIgVHlwZTtcclxuICAgIHZhciBpbnB1dENsYXNzID0gbWFuYWdlci5vcHRpb25zLmlucHV0Q2xhc3M7XHJcblxyXG4gICAgaWYgKGlucHV0Q2xhc3MpIHtcclxuICAgICAgICBUeXBlID0gaW5wdXRDbGFzcztcclxuICAgIH0gZWxzZSBpZiAoU1VQUE9SVF9QT0lOVEVSX0VWRU5UUykge1xyXG4gICAgICAgIFR5cGUgPSBQb2ludGVyRXZlbnRJbnB1dDtcclxuICAgIH0gZWxzZSBpZiAoU1VQUE9SVF9PTkxZX1RPVUNIKSB7XHJcbiAgICAgICAgVHlwZSA9IFRvdWNoSW5wdXQ7XHJcbiAgICB9IGVsc2UgaWYgKCFTVVBQT1JUX1RPVUNIKSB7XHJcbiAgICAgICAgVHlwZSA9IE1vdXNlSW5wdXQ7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIFR5cGUgPSBUb3VjaE1vdXNlSW5wdXQ7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gbmV3IChUeXBlKShtYW5hZ2VyLCBpbnB1dEhhbmRsZXIpO1xyXG59XHJcblxyXG4vKipcclxuICogaGFuZGxlIGlucHV0IGV2ZW50c1xyXG4gKiBAcGFyYW0ge01hbmFnZXJ9IG1hbmFnZXJcclxuICogQHBhcmFtIHtTdHJpbmd9IGV2ZW50VHlwZVxyXG4gKiBAcGFyYW0ge09iamVjdH0gaW5wdXRcclxuICovXHJcbmZ1bmN0aW9uIGlucHV0SGFuZGxlcihtYW5hZ2VyLCBldmVudFR5cGUsIGlucHV0KSB7XHJcbiAgICB2YXIgcG9pbnRlcnNMZW4gPSBpbnB1dC5wb2ludGVycy5sZW5ndGg7XHJcbiAgICB2YXIgY2hhbmdlZFBvaW50ZXJzTGVuID0gaW5wdXQuY2hhbmdlZFBvaW50ZXJzLmxlbmd0aDtcclxuICAgIHZhciBpc0ZpcnN0ID0gKGV2ZW50VHlwZSAmIElOUFVUX1NUQVJUICYmIChwb2ludGVyc0xlbiAtIGNoYW5nZWRQb2ludGVyc0xlbiA9PT0gMCkpO1xyXG4gICAgdmFyIGlzRmluYWwgPSAoZXZlbnRUeXBlICYgKElOUFVUX0VORCB8IElOUFVUX0NBTkNFTCkgJiYgKHBvaW50ZXJzTGVuIC0gY2hhbmdlZFBvaW50ZXJzTGVuID09PSAwKSk7XHJcblxyXG4gICAgaW5wdXQuaXNGaXJzdCA9ICEhaXNGaXJzdDtcclxuICAgIGlucHV0LmlzRmluYWwgPSAhIWlzRmluYWw7XHJcblxyXG4gICAgaWYgKGlzRmlyc3QpIHtcclxuICAgICAgICBtYW5hZ2VyLnNlc3Npb24gPSB7fTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBzb3VyY2UgZXZlbnQgaXMgdGhlIG5vcm1hbGl6ZWQgdmFsdWUgb2YgdGhlIGRvbUV2ZW50c1xyXG4gICAgLy8gbGlrZSAndG91Y2hzdGFydCwgbW91c2V1cCwgcG9pbnRlcmRvd24nXHJcbiAgICBpbnB1dC5ldmVudFR5cGUgPSBldmVudFR5cGU7XHJcblxyXG4gICAgLy8gY29tcHV0ZSBzY2FsZSwgcm90YXRpb24gZXRjXHJcbiAgICBjb21wdXRlSW5wdXREYXRhKG1hbmFnZXIsIGlucHV0KTtcclxuXHJcbiAgICAvLyBlbWl0IHNlY3JldCBldmVudFxyXG4gICAgbWFuYWdlci5lbWl0KCdoYW1tZXIuaW5wdXQnLCBpbnB1dCk7XHJcblxyXG4gICAgbWFuYWdlci5yZWNvZ25pemUoaW5wdXQpO1xyXG4gICAgbWFuYWdlci5zZXNzaW9uLnByZXZJbnB1dCA9IGlucHV0O1xyXG59XHJcblxyXG4vKipcclxuICogZXh0ZW5kIHRoZSBkYXRhIHdpdGggc29tZSB1c2FibGUgcHJvcGVydGllcyBsaWtlIHNjYWxlLCByb3RhdGUsIHZlbG9jaXR5IGV0Y1xyXG4gKiBAcGFyYW0ge09iamVjdH0gbWFuYWdlclxyXG4gKiBAcGFyYW0ge09iamVjdH0gaW5wdXRcclxuICovXHJcbmZ1bmN0aW9uIGNvbXB1dGVJbnB1dERhdGEobWFuYWdlciwgaW5wdXQpIHtcclxuICAgIHZhciBzZXNzaW9uID0gbWFuYWdlci5zZXNzaW9uO1xyXG4gICAgdmFyIHBvaW50ZXJzID0gaW5wdXQucG9pbnRlcnM7XHJcbiAgICB2YXIgcG9pbnRlcnNMZW5ndGggPSBwb2ludGVycy5sZW5ndGg7XHJcblxyXG4gICAgLy8gc3RvcmUgdGhlIGZpcnN0IGlucHV0IHRvIGNhbGN1bGF0ZSB0aGUgZGlzdGFuY2UgYW5kIGRpcmVjdGlvblxyXG4gICAgaWYgKCFzZXNzaW9uLmZpcnN0SW5wdXQpIHtcclxuICAgICAgICBzZXNzaW9uLmZpcnN0SW5wdXQgPSBzaW1wbGVDbG9uZUlucHV0RGF0YShpbnB1dCk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gdG8gY29tcHV0ZSBzY2FsZSBhbmQgcm90YXRpb24gd2UgbmVlZCB0byBzdG9yZSB0aGUgbXVsdGlwbGUgdG91Y2hlc1xyXG4gICAgaWYgKHBvaW50ZXJzTGVuZ3RoID4gMSAmJiAhc2Vzc2lvbi5maXJzdE11bHRpcGxlKSB7XHJcbiAgICAgICAgc2Vzc2lvbi5maXJzdE11bHRpcGxlID0gc2ltcGxlQ2xvbmVJbnB1dERhdGEoaW5wdXQpO1xyXG4gICAgfSBlbHNlIGlmIChwb2ludGVyc0xlbmd0aCA9PT0gMSkge1xyXG4gICAgICAgIHNlc3Npb24uZmlyc3RNdWx0aXBsZSA9IGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgIHZhciBmaXJzdElucHV0ID0gc2Vzc2lvbi5maXJzdElucHV0O1xyXG4gICAgdmFyIGZpcnN0TXVsdGlwbGUgPSBzZXNzaW9uLmZpcnN0TXVsdGlwbGU7XHJcbiAgICB2YXIgb2Zmc2V0Q2VudGVyID0gZmlyc3RNdWx0aXBsZSA/IGZpcnN0TXVsdGlwbGUuY2VudGVyIDogZmlyc3RJbnB1dC5jZW50ZXI7XHJcblxyXG4gICAgdmFyIGNlbnRlciA9IGlucHV0LmNlbnRlciA9IGdldENlbnRlcihwb2ludGVycyk7XHJcbiAgICBpbnB1dC50aW1lU3RhbXAgPSBub3coKTtcclxuICAgIGlucHV0LmRlbHRhVGltZSA9IGlucHV0LnRpbWVTdGFtcCAtIGZpcnN0SW5wdXQudGltZVN0YW1wO1xyXG5cclxuICAgIGlucHV0LmFuZ2xlID0gZ2V0QW5nbGUob2Zmc2V0Q2VudGVyLCBjZW50ZXIpO1xyXG4gICAgaW5wdXQuZGlzdGFuY2UgPSBnZXREaXN0YW5jZShvZmZzZXRDZW50ZXIsIGNlbnRlcik7XHJcblxyXG4gICAgY29tcHV0ZURlbHRhWFkoc2Vzc2lvbiwgaW5wdXQpO1xyXG4gICAgaW5wdXQub2Zmc2V0RGlyZWN0aW9uID0gZ2V0RGlyZWN0aW9uKGlucHV0LmRlbHRhWCwgaW5wdXQuZGVsdGFZKTtcclxuXHJcbiAgICBpbnB1dC5zY2FsZSA9IGZpcnN0TXVsdGlwbGUgPyBnZXRTY2FsZShmaXJzdE11bHRpcGxlLnBvaW50ZXJzLCBwb2ludGVycykgOiAxO1xyXG4gICAgaW5wdXQucm90YXRpb24gPSBmaXJzdE11bHRpcGxlID8gZ2V0Um90YXRpb24oZmlyc3RNdWx0aXBsZS5wb2ludGVycywgcG9pbnRlcnMpIDogMDtcclxuXHJcbiAgICBjb21wdXRlSW50ZXJ2YWxJbnB1dERhdGEoc2Vzc2lvbiwgaW5wdXQpO1xyXG5cclxuICAgIC8vIGZpbmQgdGhlIGNvcnJlY3QgdGFyZ2V0XHJcbiAgICB2YXIgdGFyZ2V0ID0gbWFuYWdlci5lbGVtZW50O1xyXG4gICAgaWYgKGhhc1BhcmVudChpbnB1dC5zcmNFdmVudC50YXJnZXQsIHRhcmdldCkpIHtcclxuICAgICAgICB0YXJnZXQgPSBpbnB1dC5zcmNFdmVudC50YXJnZXQ7XHJcbiAgICB9XHJcbiAgICBpbnB1dC50YXJnZXQgPSB0YXJnZXQ7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGNvbXB1dGVEZWx0YVhZKHNlc3Npb24sIGlucHV0KSB7XHJcbiAgICB2YXIgY2VudGVyID0gaW5wdXQuY2VudGVyO1xyXG4gICAgdmFyIG9mZnNldCA9IHNlc3Npb24ub2Zmc2V0RGVsdGEgfHwge307XHJcbiAgICB2YXIgcHJldkRlbHRhID0gc2Vzc2lvbi5wcmV2RGVsdGEgfHwge307XHJcbiAgICB2YXIgcHJldklucHV0ID0gc2Vzc2lvbi5wcmV2SW5wdXQgfHwge307XHJcblxyXG4gICAgaWYgKGlucHV0LmV2ZW50VHlwZSA9PT0gSU5QVVRfU1RBUlQgfHwgcHJldklucHV0LmV2ZW50VHlwZSA9PT0gSU5QVVRfRU5EKSB7XHJcbiAgICAgICAgcHJldkRlbHRhID0gc2Vzc2lvbi5wcmV2RGVsdGEgPSB7XHJcbiAgICAgICAgICAgIHg6IHByZXZJbnB1dC5kZWx0YVggfHwgMCxcclxuICAgICAgICAgICAgeTogcHJldklucHV0LmRlbHRhWSB8fCAwXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgb2Zmc2V0ID0gc2Vzc2lvbi5vZmZzZXREZWx0YSA9IHtcclxuICAgICAgICAgICAgeDogY2VudGVyLngsXHJcbiAgICAgICAgICAgIHk6IGNlbnRlci55XHJcbiAgICAgICAgfTtcclxuICAgIH1cclxuXHJcbiAgICBpbnB1dC5kZWx0YVggPSBwcmV2RGVsdGEueCArIChjZW50ZXIueCAtIG9mZnNldC54KTtcclxuICAgIGlucHV0LmRlbHRhWSA9IHByZXZEZWx0YS55ICsgKGNlbnRlci55IC0gb2Zmc2V0LnkpO1xyXG59XHJcblxyXG4vKipcclxuICogdmVsb2NpdHkgaXMgY2FsY3VsYXRlZCBldmVyeSB4IG1zXHJcbiAqIEBwYXJhbSB7T2JqZWN0fSBzZXNzaW9uXHJcbiAqIEBwYXJhbSB7T2JqZWN0fSBpbnB1dFxyXG4gKi9cclxuZnVuY3Rpb24gY29tcHV0ZUludGVydmFsSW5wdXREYXRhKHNlc3Npb24sIGlucHV0KSB7XHJcbiAgICB2YXIgbGFzdCA9IHNlc3Npb24ubGFzdEludGVydmFsIHx8IGlucHV0LFxyXG4gICAgICAgIGRlbHRhVGltZSA9IGlucHV0LnRpbWVTdGFtcCAtIGxhc3QudGltZVN0YW1wLFxyXG4gICAgICAgIHZlbG9jaXR5LCB2ZWxvY2l0eVgsIHZlbG9jaXR5WSwgZGlyZWN0aW9uO1xyXG5cclxuICAgIGlmIChpbnB1dC5ldmVudFR5cGUgIT0gSU5QVVRfQ0FOQ0VMICYmIChkZWx0YVRpbWUgPiBDT01QVVRFX0lOVEVSVkFMIHx8IGxhc3QudmVsb2NpdHkgPT09IHVuZGVmaW5lZCkpIHtcclxuICAgICAgICB2YXIgZGVsdGFYID0gbGFzdC5kZWx0YVggLSBpbnB1dC5kZWx0YVg7XHJcbiAgICAgICAgdmFyIGRlbHRhWSA9IGxhc3QuZGVsdGFZIC0gaW5wdXQuZGVsdGFZO1xyXG5cclxuICAgICAgICB2YXIgdiA9IGdldFZlbG9jaXR5KGRlbHRhVGltZSwgZGVsdGFYLCBkZWx0YVkpO1xyXG4gICAgICAgIHZlbG9jaXR5WCA9IHYueDtcclxuICAgICAgICB2ZWxvY2l0eVkgPSB2Lnk7XHJcbiAgICAgICAgdmVsb2NpdHkgPSAoYWJzKHYueCkgPiBhYnModi55KSkgPyB2LnggOiB2Lnk7XHJcbiAgICAgICAgZGlyZWN0aW9uID0gZ2V0RGlyZWN0aW9uKGRlbHRhWCwgZGVsdGFZKTtcclxuXHJcbiAgICAgICAgc2Vzc2lvbi5sYXN0SW50ZXJ2YWwgPSBpbnB1dDtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgLy8gdXNlIGxhdGVzdCB2ZWxvY2l0eSBpbmZvIGlmIGl0IGRvZXNuJ3Qgb3ZlcnRha2UgYSBtaW5pbXVtIHBlcmlvZFxyXG4gICAgICAgIHZlbG9jaXR5ID0gbGFzdC52ZWxvY2l0eTtcclxuICAgICAgICB2ZWxvY2l0eVggPSBsYXN0LnZlbG9jaXR5WDtcclxuICAgICAgICB2ZWxvY2l0eVkgPSBsYXN0LnZlbG9jaXR5WTtcclxuICAgICAgICBkaXJlY3Rpb24gPSBsYXN0LmRpcmVjdGlvbjtcclxuICAgIH1cclxuXHJcbiAgICBpbnB1dC52ZWxvY2l0eSA9IHZlbG9jaXR5O1xyXG4gICAgaW5wdXQudmVsb2NpdHlYID0gdmVsb2NpdHlYO1xyXG4gICAgaW5wdXQudmVsb2NpdHlZID0gdmVsb2NpdHlZO1xyXG4gICAgaW5wdXQuZGlyZWN0aW9uID0gZGlyZWN0aW9uO1xyXG59XHJcblxyXG4vKipcclxuICogY3JlYXRlIGEgc2ltcGxlIGNsb25lIGZyb20gdGhlIGlucHV0IHVzZWQgZm9yIHN0b3JhZ2Ugb2YgZmlyc3RJbnB1dCBhbmQgZmlyc3RNdWx0aXBsZVxyXG4gKiBAcGFyYW0ge09iamVjdH0gaW5wdXRcclxuICogQHJldHVybnMge09iamVjdH0gY2xvbmVkSW5wdXREYXRhXHJcbiAqL1xyXG5mdW5jdGlvbiBzaW1wbGVDbG9uZUlucHV0RGF0YShpbnB1dCkge1xyXG4gICAgLy8gbWFrZSBhIHNpbXBsZSBjb3B5IG9mIHRoZSBwb2ludGVycyBiZWNhdXNlIHdlIHdpbGwgZ2V0IGEgcmVmZXJlbmNlIGlmIHdlIGRvbid0XHJcbiAgICAvLyB3ZSBvbmx5IG5lZWQgY2xpZW50WFkgZm9yIHRoZSBjYWxjdWxhdGlvbnNcclxuICAgIHZhciBwb2ludGVycyA9IFtdO1xyXG4gICAgdmFyIGkgPSAwO1xyXG4gICAgd2hpbGUgKGkgPCBpbnB1dC5wb2ludGVycy5sZW5ndGgpIHtcclxuICAgICAgICBwb2ludGVyc1tpXSA9IHtcclxuICAgICAgICAgICAgY2xpZW50WDogcm91bmQoaW5wdXQucG9pbnRlcnNbaV0uY2xpZW50WCksXHJcbiAgICAgICAgICAgIGNsaWVudFk6IHJvdW5kKGlucHV0LnBvaW50ZXJzW2ldLmNsaWVudFkpXHJcbiAgICAgICAgfTtcclxuICAgICAgICBpKys7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICB0aW1lU3RhbXA6IG5vdygpLFxyXG4gICAgICAgIHBvaW50ZXJzOiBwb2ludGVycyxcclxuICAgICAgICBjZW50ZXI6IGdldENlbnRlcihwb2ludGVycyksXHJcbiAgICAgICAgZGVsdGFYOiBpbnB1dC5kZWx0YVgsXHJcbiAgICAgICAgZGVsdGFZOiBpbnB1dC5kZWx0YVlcclxuICAgIH07XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBnZXQgdGhlIGNlbnRlciBvZiBhbGwgdGhlIHBvaW50ZXJzXHJcbiAqIEBwYXJhbSB7QXJyYXl9IHBvaW50ZXJzXHJcbiAqIEByZXR1cm4ge09iamVjdH0gY2VudGVyIGNvbnRhaW5zIGB4YCBhbmQgYHlgIHByb3BlcnRpZXNcclxuICovXHJcbmZ1bmN0aW9uIGdldENlbnRlcihwb2ludGVycykge1xyXG4gICAgdmFyIHBvaW50ZXJzTGVuZ3RoID0gcG9pbnRlcnMubGVuZ3RoO1xyXG5cclxuICAgIC8vIG5vIG5lZWQgdG8gbG9vcCB3aGVuIG9ubHkgb25lIHRvdWNoXHJcbiAgICBpZiAocG9pbnRlcnNMZW5ndGggPT09IDEpIHtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICB4OiByb3VuZChwb2ludGVyc1swXS5jbGllbnRYKSxcclxuICAgICAgICAgICAgeTogcm91bmQocG9pbnRlcnNbMF0uY2xpZW50WSlcclxuICAgICAgICB9O1xyXG4gICAgfVxyXG5cclxuICAgIHZhciB4ID0gMCwgeSA9IDAsIGkgPSAwO1xyXG4gICAgd2hpbGUgKGkgPCBwb2ludGVyc0xlbmd0aCkge1xyXG4gICAgICAgIHggKz0gcG9pbnRlcnNbaV0uY2xpZW50WDtcclxuICAgICAgICB5ICs9IHBvaW50ZXJzW2ldLmNsaWVudFk7XHJcbiAgICAgICAgaSsrO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgeDogcm91bmQoeCAvIHBvaW50ZXJzTGVuZ3RoKSxcclxuICAgICAgICB5OiByb3VuZCh5IC8gcG9pbnRlcnNMZW5ndGgpXHJcbiAgICB9O1xyXG59XHJcblxyXG4vKipcclxuICogY2FsY3VsYXRlIHRoZSB2ZWxvY2l0eSBiZXR3ZWVuIHR3byBwb2ludHMuIHVuaXQgaXMgaW4gcHggcGVyIG1zLlxyXG4gKiBAcGFyYW0ge051bWJlcn0gZGVsdGFUaW1lXHJcbiAqIEBwYXJhbSB7TnVtYmVyfSB4XHJcbiAqIEBwYXJhbSB7TnVtYmVyfSB5XHJcbiAqIEByZXR1cm4ge09iamVjdH0gdmVsb2NpdHkgYHhgIGFuZCBgeWBcclxuICovXHJcbmZ1bmN0aW9uIGdldFZlbG9jaXR5KGRlbHRhVGltZSwgeCwgeSkge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICB4OiB4IC8gZGVsdGFUaW1lIHx8IDAsXHJcbiAgICAgICAgeTogeSAvIGRlbHRhVGltZSB8fCAwXHJcbiAgICB9O1xyXG59XHJcblxyXG4vKipcclxuICogZ2V0IHRoZSBkaXJlY3Rpb24gYmV0d2VlbiB0d28gcG9pbnRzXHJcbiAqIEBwYXJhbSB7TnVtYmVyfSB4XHJcbiAqIEBwYXJhbSB7TnVtYmVyfSB5XHJcbiAqIEByZXR1cm4ge051bWJlcn0gZGlyZWN0aW9uXHJcbiAqL1xyXG5mdW5jdGlvbiBnZXREaXJlY3Rpb24oeCwgeSkge1xyXG4gICAgaWYgKHggPT09IHkpIHtcclxuICAgICAgICByZXR1cm4gRElSRUNUSU9OX05PTkU7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKGFicyh4KSA+PSBhYnMoeSkpIHtcclxuICAgICAgICByZXR1cm4geCA+IDAgPyBESVJFQ1RJT05fTEVGVCA6IERJUkVDVElPTl9SSUdIVDtcclxuICAgIH1cclxuICAgIHJldHVybiB5ID4gMCA/IERJUkVDVElPTl9VUCA6IERJUkVDVElPTl9ET1dOO1xyXG59XHJcblxyXG4vKipcclxuICogY2FsY3VsYXRlIHRoZSBhYnNvbHV0ZSBkaXN0YW5jZSBiZXR3ZWVuIHR3byBwb2ludHNcclxuICogQHBhcmFtIHtPYmplY3R9IHAxIHt4LCB5fVxyXG4gKiBAcGFyYW0ge09iamVjdH0gcDIge3gsIHl9XHJcbiAqIEBwYXJhbSB7QXJyYXl9IFtwcm9wc10gY29udGFpbmluZyB4IGFuZCB5IGtleXNcclxuICogQHJldHVybiB7TnVtYmVyfSBkaXN0YW5jZVxyXG4gKi9cclxuZnVuY3Rpb24gZ2V0RGlzdGFuY2UocDEsIHAyLCBwcm9wcykge1xyXG4gICAgaWYgKCFwcm9wcykge1xyXG4gICAgICAgIHByb3BzID0gUFJPUFNfWFk7XHJcbiAgICB9XHJcbiAgICB2YXIgeCA9IHAyW3Byb3BzWzBdXSAtIHAxW3Byb3BzWzBdXSxcclxuICAgICAgICB5ID0gcDJbcHJvcHNbMV1dIC0gcDFbcHJvcHNbMV1dO1xyXG5cclxuICAgIHJldHVybiBNYXRoLnNxcnQoKHggKiB4KSArICh5ICogeSkpO1xyXG59XHJcblxyXG4vKipcclxuICogY2FsY3VsYXRlIHRoZSBhbmdsZSBiZXR3ZWVuIHR3byBjb29yZGluYXRlc1xyXG4gKiBAcGFyYW0ge09iamVjdH0gcDFcclxuICogQHBhcmFtIHtPYmplY3R9IHAyXHJcbiAqIEBwYXJhbSB7QXJyYXl9IFtwcm9wc10gY29udGFpbmluZyB4IGFuZCB5IGtleXNcclxuICogQHJldHVybiB7TnVtYmVyfSBhbmdsZVxyXG4gKi9cclxuZnVuY3Rpb24gZ2V0QW5nbGUocDEsIHAyLCBwcm9wcykge1xyXG4gICAgaWYgKCFwcm9wcykge1xyXG4gICAgICAgIHByb3BzID0gUFJPUFNfWFk7XHJcbiAgICB9XHJcbiAgICB2YXIgeCA9IHAyW3Byb3BzWzBdXSAtIHAxW3Byb3BzWzBdXSxcclxuICAgICAgICB5ID0gcDJbcHJvcHNbMV1dIC0gcDFbcHJvcHNbMV1dO1xyXG4gICAgcmV0dXJuIE1hdGguYXRhbjIoeSwgeCkgKiAxODAgLyBNYXRoLlBJO1xyXG59XHJcblxyXG4vKipcclxuICogY2FsY3VsYXRlIHRoZSByb3RhdGlvbiBkZWdyZWVzIGJldHdlZW4gdHdvIHBvaW50ZXJzZXRzXHJcbiAqIEBwYXJhbSB7QXJyYXl9IHN0YXJ0IGFycmF5IG9mIHBvaW50ZXJzXHJcbiAqIEBwYXJhbSB7QXJyYXl9IGVuZCBhcnJheSBvZiBwb2ludGVyc1xyXG4gKiBAcmV0dXJuIHtOdW1iZXJ9IHJvdGF0aW9uXHJcbiAqL1xyXG5mdW5jdGlvbiBnZXRSb3RhdGlvbihzdGFydCwgZW5kKSB7XHJcbiAgICByZXR1cm4gZ2V0QW5nbGUoZW5kWzFdLCBlbmRbMF0sIFBST1BTX0NMSUVOVF9YWSkgLSBnZXRBbmdsZShzdGFydFsxXSwgc3RhcnRbMF0sIFBST1BTX0NMSUVOVF9YWSk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBjYWxjdWxhdGUgdGhlIHNjYWxlIGZhY3RvciBiZXR3ZWVuIHR3byBwb2ludGVyc2V0c1xyXG4gKiBubyBzY2FsZSBpcyAxLCBhbmQgZ29lcyBkb3duIHRvIDAgd2hlbiBwaW5jaGVkIHRvZ2V0aGVyLCBhbmQgYmlnZ2VyIHdoZW4gcGluY2hlZCBvdXRcclxuICogQHBhcmFtIHtBcnJheX0gc3RhcnQgYXJyYXkgb2YgcG9pbnRlcnNcclxuICogQHBhcmFtIHtBcnJheX0gZW5kIGFycmF5IG9mIHBvaW50ZXJzXHJcbiAqIEByZXR1cm4ge051bWJlcn0gc2NhbGVcclxuICovXHJcbmZ1bmN0aW9uIGdldFNjYWxlKHN0YXJ0LCBlbmQpIHtcclxuICAgIHJldHVybiBnZXREaXN0YW5jZShlbmRbMF0sIGVuZFsxXSwgUFJPUFNfQ0xJRU5UX1hZKSAvIGdldERpc3RhbmNlKHN0YXJ0WzBdLCBzdGFydFsxXSwgUFJPUFNfQ0xJRU5UX1hZKTtcclxufVxyXG5cclxudmFyIE1PVVNFX0lOUFVUX01BUCA9IHtcclxuICAgIG1vdXNlZG93bjogSU5QVVRfU1RBUlQsXHJcbiAgICBtb3VzZW1vdmU6IElOUFVUX01PVkUsXHJcbiAgICBtb3VzZXVwOiBJTlBVVF9FTkRcclxufTtcclxuXHJcbnZhciBNT1VTRV9FTEVNRU5UX0VWRU5UUyA9ICdtb3VzZWRvd24nO1xyXG52YXIgTU9VU0VfV0lORE9XX0VWRU5UUyA9ICdtb3VzZW1vdmUgbW91c2V1cCc7XHJcblxyXG4vKipcclxuICogTW91c2UgZXZlbnRzIGlucHV0XHJcbiAqIEBjb25zdHJ1Y3RvclxyXG4gKiBAZXh0ZW5kcyBJbnB1dFxyXG4gKi9cclxuZnVuY3Rpb24gTW91c2VJbnB1dCgpIHtcclxuICAgIHRoaXMuZXZFbCA9IE1PVVNFX0VMRU1FTlRfRVZFTlRTO1xyXG4gICAgdGhpcy5ldldpbiA9IE1PVVNFX1dJTkRPV19FVkVOVFM7XHJcblxyXG4gICAgdGhpcy5hbGxvdyA9IHRydWU7IC8vIHVzZWQgYnkgSW5wdXQuVG91Y2hNb3VzZSB0byBkaXNhYmxlIG1vdXNlIGV2ZW50c1xyXG4gICAgdGhpcy5wcmVzc2VkID0gZmFsc2U7IC8vIG1vdXNlZG93biBzdGF0ZVxyXG5cclxuICAgIElucHV0LmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XHJcbn1cclxuXHJcbmluaGVyaXQoTW91c2VJbnB1dCwgSW5wdXQsIHtcclxuICAgIC8qKlxyXG4gICAgICogaGFuZGxlIG1vdXNlIGV2ZW50c1xyXG4gICAgICogQHBhcmFtIHtPYmplY3R9IGV2XHJcbiAgICAgKi9cclxuICAgIGhhbmRsZXI6IGZ1bmN0aW9uIE1FaGFuZGxlcihldikge1xyXG4gICAgICAgIHZhciBldmVudFR5cGUgPSBNT1VTRV9JTlBVVF9NQVBbZXYudHlwZV07XHJcblxyXG4gICAgICAgIC8vIG9uIHN0YXJ0IHdlIHdhbnQgdG8gaGF2ZSB0aGUgbGVmdCBtb3VzZSBidXR0b24gZG93blxyXG4gICAgICAgIGlmIChldmVudFR5cGUgJiBJTlBVVF9TVEFSVCAmJiBldi5idXR0b24gPT09IDApIHtcclxuICAgICAgICAgICAgdGhpcy5wcmVzc2VkID0gdHJ1ZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChldmVudFR5cGUgJiBJTlBVVF9NT1ZFICYmIGV2LndoaWNoICE9PSAxKSB7XHJcbiAgICAgICAgICAgIGV2ZW50VHlwZSA9IElOUFVUX0VORDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIG1vdXNlIG11c3QgYmUgZG93biwgYW5kIG1vdXNlIGV2ZW50cyBhcmUgYWxsb3dlZCAoc2VlIHRoZSBUb3VjaE1vdXNlIGlucHV0KVxyXG4gICAgICAgIGlmICghdGhpcy5wcmVzc2VkIHx8ICF0aGlzLmFsbG93KSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChldmVudFR5cGUgJiBJTlBVVF9FTkQpIHtcclxuICAgICAgICAgICAgdGhpcy5wcmVzc2VkID0gZmFsc2U7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLmNhbGxiYWNrKHRoaXMubWFuYWdlciwgZXZlbnRUeXBlLCB7XHJcbiAgICAgICAgICAgIHBvaW50ZXJzOiBbZXZdLFxyXG4gICAgICAgICAgICBjaGFuZ2VkUG9pbnRlcnM6IFtldl0sXHJcbiAgICAgICAgICAgIHBvaW50ZXJUeXBlOiBJTlBVVF9UWVBFX01PVVNFLFxyXG4gICAgICAgICAgICBzcmNFdmVudDogZXZcclxuICAgICAgICB9KTtcclxuICAgIH1cclxufSk7XHJcblxyXG52YXIgUE9JTlRFUl9JTlBVVF9NQVAgPSB7XHJcbiAgICBwb2ludGVyZG93bjogSU5QVVRfU1RBUlQsXHJcbiAgICBwb2ludGVybW92ZTogSU5QVVRfTU9WRSxcclxuICAgIHBvaW50ZXJ1cDogSU5QVVRfRU5ELFxyXG4gICAgcG9pbnRlcmNhbmNlbDogSU5QVVRfQ0FOQ0VMLFxyXG4gICAgcG9pbnRlcm91dDogSU5QVVRfQ0FOQ0VMXHJcbn07XHJcblxyXG4vLyBpbiBJRTEwIHRoZSBwb2ludGVyIHR5cGVzIGlzIGRlZmluZWQgYXMgYW4gZW51bVxyXG52YXIgSUUxMF9QT0lOVEVSX1RZUEVfRU5VTSA9IHtcclxuICAgIDI6IElOUFVUX1RZUEVfVE9VQ0gsXHJcbiAgICAzOiBJTlBVVF9UWVBFX1BFTixcclxuICAgIDQ6IElOUFVUX1RZUEVfTU9VU0UsXHJcbiAgICA1OiBJTlBVVF9UWVBFX0tJTkVDVCAvLyBzZWUgaHR0cHM6Ly90d2l0dGVyLmNvbS9qYWNvYnJvc3NpL3N0YXR1cy80ODA1OTY0Mzg0ODk4OTA4MTZcclxufTtcclxuXHJcbnZhciBQT0lOVEVSX0VMRU1FTlRfRVZFTlRTID0gJ3BvaW50ZXJkb3duJztcclxudmFyIFBPSU5URVJfV0lORE9XX0VWRU5UUyA9ICdwb2ludGVybW92ZSBwb2ludGVydXAgcG9pbnRlcmNhbmNlbCc7XHJcblxyXG4vLyBJRTEwIGhhcyBwcmVmaXhlZCBzdXBwb3J0LCBhbmQgY2FzZS1zZW5zaXRpdmVcclxuaWYgKHdpbmRvdy5NU1BvaW50ZXJFdmVudCkge1xyXG4gICAgUE9JTlRFUl9FTEVNRU5UX0VWRU5UUyA9ICdNU1BvaW50ZXJEb3duJztcclxuICAgIFBPSU5URVJfV0lORE9XX0VWRU5UUyA9ICdNU1BvaW50ZXJNb3ZlIE1TUG9pbnRlclVwIE1TUG9pbnRlckNhbmNlbCc7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBQb2ludGVyIGV2ZW50cyBpbnB1dFxyXG4gKiBAY29uc3RydWN0b3JcclxuICogQGV4dGVuZHMgSW5wdXRcclxuICovXHJcbmZ1bmN0aW9uIFBvaW50ZXJFdmVudElucHV0KCkge1xyXG4gICAgdGhpcy5ldkVsID0gUE9JTlRFUl9FTEVNRU5UX0VWRU5UUztcclxuICAgIHRoaXMuZXZXaW4gPSBQT0lOVEVSX1dJTkRPV19FVkVOVFM7XHJcblxyXG4gICAgSW5wdXQuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcclxuXHJcbiAgICB0aGlzLnN0b3JlID0gKHRoaXMubWFuYWdlci5zZXNzaW9uLnBvaW50ZXJFdmVudHMgPSBbXSk7XHJcbn1cclxuXHJcbmluaGVyaXQoUG9pbnRlckV2ZW50SW5wdXQsIElucHV0LCB7XHJcbiAgICAvKipcclxuICAgICAqIGhhbmRsZSBtb3VzZSBldmVudHNcclxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBldlxyXG4gICAgICovXHJcbiAgICBoYW5kbGVyOiBmdW5jdGlvbiBQRWhhbmRsZXIoZXYpIHtcclxuICAgICAgICB2YXIgc3RvcmUgPSB0aGlzLnN0b3JlO1xyXG4gICAgICAgIHZhciByZW1vdmVQb2ludGVyID0gZmFsc2U7XHJcblxyXG4gICAgICAgIHZhciBldmVudFR5cGVOb3JtYWxpemVkID0gZXYudHlwZS50b0xvd2VyQ2FzZSgpLnJlcGxhY2UoJ21zJywgJycpO1xyXG4gICAgICAgIHZhciBldmVudFR5cGUgPSBQT0lOVEVSX0lOUFVUX01BUFtldmVudFR5cGVOb3JtYWxpemVkXTtcclxuICAgICAgICB2YXIgcG9pbnRlclR5cGUgPSBJRTEwX1BPSU5URVJfVFlQRV9FTlVNW2V2LnBvaW50ZXJUeXBlXSB8fCBldi5wb2ludGVyVHlwZTtcclxuXHJcbiAgICAgICAgdmFyIGlzVG91Y2ggPSAocG9pbnRlclR5cGUgPT0gSU5QVVRfVFlQRV9UT1VDSCk7XHJcblxyXG4gICAgICAgIC8vIGdldCBpbmRleCBvZiB0aGUgZXZlbnQgaW4gdGhlIHN0b3JlXHJcbiAgICAgICAgdmFyIHN0b3JlSW5kZXggPSBpbkFycmF5KHN0b3JlLCBldi5wb2ludGVySWQsICdwb2ludGVySWQnKTtcclxuXHJcbiAgICAgICAgLy8gc3RhcnQgYW5kIG1vdXNlIG11c3QgYmUgZG93blxyXG4gICAgICAgIGlmIChldmVudFR5cGUgJiBJTlBVVF9TVEFSVCAmJiAoZXYuYnV0dG9uID09PSAwIHx8IGlzVG91Y2gpKSB7XHJcbiAgICAgICAgICAgIGlmIChzdG9yZUluZGV4IDwgMCkge1xyXG4gICAgICAgICAgICAgICAgc3RvcmUucHVzaChldik7XHJcbiAgICAgICAgICAgICAgICBzdG9yZUluZGV4ID0gc3RvcmUubGVuZ3RoIC0gMTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSBpZiAoZXZlbnRUeXBlICYgKElOUFVUX0VORCB8IElOUFVUX0NBTkNFTCkpIHtcclxuICAgICAgICAgICAgcmVtb3ZlUG9pbnRlciA9IHRydWU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBpdCBub3QgZm91bmQsIHNvIHRoZSBwb2ludGVyIGhhc24ndCBiZWVuIGRvd24gKHNvIGl0J3MgcHJvYmFibHkgYSBob3ZlcilcclxuICAgICAgICBpZiAoc3RvcmVJbmRleCA8IDApIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gdXBkYXRlIHRoZSBldmVudCBpbiB0aGUgc3RvcmVcclxuICAgICAgICBzdG9yZVtzdG9yZUluZGV4XSA9IGV2O1xyXG5cclxuICAgICAgICB0aGlzLmNhbGxiYWNrKHRoaXMubWFuYWdlciwgZXZlbnRUeXBlLCB7XHJcbiAgICAgICAgICAgIHBvaW50ZXJzOiBzdG9yZSxcclxuICAgICAgICAgICAgY2hhbmdlZFBvaW50ZXJzOiBbZXZdLFxyXG4gICAgICAgICAgICBwb2ludGVyVHlwZTogcG9pbnRlclR5cGUsXHJcbiAgICAgICAgICAgIHNyY0V2ZW50OiBldlxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBpZiAocmVtb3ZlUG9pbnRlcikge1xyXG4gICAgICAgICAgICAvLyByZW1vdmUgZnJvbSB0aGUgc3RvcmVcclxuICAgICAgICAgICAgc3RvcmUuc3BsaWNlKHN0b3JlSW5kZXgsIDEpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufSk7XHJcblxyXG52YXIgU0lOR0xFX1RPVUNIX0lOUFVUX01BUCA9IHtcclxuICAgIHRvdWNoc3RhcnQ6IElOUFVUX1NUQVJULFxyXG4gICAgdG91Y2htb3ZlOiBJTlBVVF9NT1ZFLFxyXG4gICAgdG91Y2hlbmQ6IElOUFVUX0VORCxcclxuICAgIHRvdWNoY2FuY2VsOiBJTlBVVF9DQU5DRUxcclxufTtcclxuXHJcbnZhciBTSU5HTEVfVE9VQ0hfVEFSR0VUX0VWRU5UUyA9ICd0b3VjaHN0YXJ0JztcclxudmFyIFNJTkdMRV9UT1VDSF9XSU5ET1dfRVZFTlRTID0gJ3RvdWNoc3RhcnQgdG91Y2htb3ZlIHRvdWNoZW5kIHRvdWNoY2FuY2VsJztcclxuXHJcbi8qKlxyXG4gKiBUb3VjaCBldmVudHMgaW5wdXRcclxuICogQGNvbnN0cnVjdG9yXHJcbiAqIEBleHRlbmRzIElucHV0XHJcbiAqL1xyXG5mdW5jdGlvbiBTaW5nbGVUb3VjaElucHV0KCkge1xyXG4gICAgdGhpcy5ldlRhcmdldCA9IFNJTkdMRV9UT1VDSF9UQVJHRVRfRVZFTlRTO1xyXG4gICAgdGhpcy5ldldpbiA9IFNJTkdMRV9UT1VDSF9XSU5ET1dfRVZFTlRTO1xyXG4gICAgdGhpcy5zdGFydGVkID0gZmFsc2U7XHJcblxyXG4gICAgSW5wdXQuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcclxufVxyXG5cclxuaW5oZXJpdChTaW5nbGVUb3VjaElucHV0LCBJbnB1dCwge1xyXG4gICAgaGFuZGxlcjogZnVuY3Rpb24gVEVoYW5kbGVyKGV2KSB7XHJcbiAgICAgICAgdmFyIHR5cGUgPSBTSU5HTEVfVE9VQ0hfSU5QVVRfTUFQW2V2LnR5cGVdO1xyXG5cclxuICAgICAgICAvLyBzaG91bGQgd2UgaGFuZGxlIHRoZSB0b3VjaCBldmVudHM/XHJcbiAgICAgICAgaWYgKHR5cGUgPT09IElOUFVUX1NUQVJUKSB7XHJcbiAgICAgICAgICAgIHRoaXMuc3RhcnRlZCA9IHRydWU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoIXRoaXMuc3RhcnRlZCkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB2YXIgdG91Y2hlcyA9IG5vcm1hbGl6ZVNpbmdsZVRvdWNoZXMuY2FsbCh0aGlzLCBldiwgdHlwZSk7XHJcblxyXG4gICAgICAgIC8vIHdoZW4gZG9uZSwgcmVzZXQgdGhlIHN0YXJ0ZWQgc3RhdGVcclxuICAgICAgICBpZiAodHlwZSAmIChJTlBVVF9FTkQgfCBJTlBVVF9DQU5DRUwpICYmIHRvdWNoZXNbMF0ubGVuZ3RoIC0gdG91Y2hlc1sxXS5sZW5ndGggPT09IDApIHtcclxuICAgICAgICAgICAgdGhpcy5zdGFydGVkID0gZmFsc2U7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLmNhbGxiYWNrKHRoaXMubWFuYWdlciwgdHlwZSwge1xyXG4gICAgICAgICAgICBwb2ludGVyczogdG91Y2hlc1swXSxcclxuICAgICAgICAgICAgY2hhbmdlZFBvaW50ZXJzOiB0b3VjaGVzWzFdLFxyXG4gICAgICAgICAgICBwb2ludGVyVHlwZTogSU5QVVRfVFlQRV9UT1VDSCxcclxuICAgICAgICAgICAgc3JjRXZlbnQ6IGV2XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbn0pO1xyXG5cclxuLyoqXHJcbiAqIEB0aGlzIHtUb3VjaElucHV0fVxyXG4gKiBAcGFyYW0ge09iamVjdH0gZXZcclxuICogQHBhcmFtIHtOdW1iZXJ9IHR5cGUgZmxhZ1xyXG4gKiBAcmV0dXJucyB7dW5kZWZpbmVkfEFycmF5fSBbYWxsLCBjaGFuZ2VkXVxyXG4gKi9cclxuZnVuY3Rpb24gbm9ybWFsaXplU2luZ2xlVG91Y2hlcyhldiwgdHlwZSkge1xyXG4gICAgdmFyIGFsbCA9IHRvQXJyYXkoZXYudG91Y2hlcyk7XHJcbiAgICB2YXIgY2hhbmdlZCA9IHRvQXJyYXkoZXYuY2hhbmdlZFRvdWNoZXMpO1xyXG5cclxuICAgIGlmICh0eXBlICYgKElOUFVUX0VORCB8IElOUFVUX0NBTkNFTCkpIHtcclxuICAgICAgICBhbGwgPSB1bmlxdWVBcnJheShhbGwuY29uY2F0KGNoYW5nZWQpLCAnaWRlbnRpZmllcicsIHRydWUpO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBbYWxsLCBjaGFuZ2VkXTtcclxufVxyXG5cclxudmFyIFRPVUNIX0lOUFVUX01BUCA9IHtcclxuICAgIHRvdWNoc3RhcnQ6IElOUFVUX1NUQVJULFxyXG4gICAgdG91Y2htb3ZlOiBJTlBVVF9NT1ZFLFxyXG4gICAgdG91Y2hlbmQ6IElOUFVUX0VORCxcclxuICAgIHRvdWNoY2FuY2VsOiBJTlBVVF9DQU5DRUxcclxufTtcclxuXHJcbnZhciBUT1VDSF9UQVJHRVRfRVZFTlRTID0gJ3RvdWNoc3RhcnQgdG91Y2htb3ZlIHRvdWNoZW5kIHRvdWNoY2FuY2VsJztcclxuXHJcbi8qKlxyXG4gKiBNdWx0aS11c2VyIHRvdWNoIGV2ZW50cyBpbnB1dFxyXG4gKiBAY29uc3RydWN0b3JcclxuICogQGV4dGVuZHMgSW5wdXRcclxuICovXHJcbmZ1bmN0aW9uIFRvdWNoSW5wdXQoKSB7XHJcbiAgICB0aGlzLmV2VGFyZ2V0ID0gVE9VQ0hfVEFSR0VUX0VWRU5UUztcclxuICAgIHRoaXMudGFyZ2V0SWRzID0ge307XHJcblxyXG4gICAgSW5wdXQuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcclxufVxyXG5cclxuaW5oZXJpdChUb3VjaElucHV0LCBJbnB1dCwge1xyXG4gICAgaGFuZGxlcjogZnVuY3Rpb24gTVRFaGFuZGxlcihldikge1xyXG4gICAgICAgIHZhciB0eXBlID0gVE9VQ0hfSU5QVVRfTUFQW2V2LnR5cGVdO1xyXG4gICAgICAgIHZhciB0b3VjaGVzID0gZ2V0VG91Y2hlcy5jYWxsKHRoaXMsIGV2LCB0eXBlKTtcclxuICAgICAgICBpZiAoIXRvdWNoZXMpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5jYWxsYmFjayh0aGlzLm1hbmFnZXIsIHR5cGUsIHtcclxuICAgICAgICAgICAgcG9pbnRlcnM6IHRvdWNoZXNbMF0sXHJcbiAgICAgICAgICAgIGNoYW5nZWRQb2ludGVyczogdG91Y2hlc1sxXSxcclxuICAgICAgICAgICAgcG9pbnRlclR5cGU6IElOUFVUX1RZUEVfVE9VQ0gsXHJcbiAgICAgICAgICAgIHNyY0V2ZW50OiBldlxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG59KTtcclxuXHJcbi8qKlxyXG4gKiBAdGhpcyB7VG91Y2hJbnB1dH1cclxuICogQHBhcmFtIHtPYmplY3R9IGV2XHJcbiAqIEBwYXJhbSB7TnVtYmVyfSB0eXBlIGZsYWdcclxuICogQHJldHVybnMge3VuZGVmaW5lZHxBcnJheX0gW2FsbCwgY2hhbmdlZF1cclxuICovXHJcbmZ1bmN0aW9uIGdldFRvdWNoZXMoZXYsIHR5cGUpIHtcclxuICAgIHZhciBhbGxUb3VjaGVzID0gdG9BcnJheShldi50b3VjaGVzKTtcclxuICAgIHZhciB0YXJnZXRJZHMgPSB0aGlzLnRhcmdldElkcztcclxuXHJcbiAgICAvLyB3aGVuIHRoZXJlIGlzIG9ubHkgb25lIHRvdWNoLCB0aGUgcHJvY2VzcyBjYW4gYmUgc2ltcGxpZmllZFxyXG4gICAgaWYgKHR5cGUgJiAoSU5QVVRfU1RBUlQgfCBJTlBVVF9NT1ZFKSAmJiBhbGxUb3VjaGVzLmxlbmd0aCA9PT0gMSkge1xyXG4gICAgICAgIHRhcmdldElkc1thbGxUb3VjaGVzWzBdLmlkZW50aWZpZXJdID0gdHJ1ZTtcclxuICAgICAgICByZXR1cm4gW2FsbFRvdWNoZXMsIGFsbFRvdWNoZXNdO1xyXG4gICAgfVxyXG5cclxuICAgIHZhciBpLFxyXG4gICAgICAgIHRhcmdldFRvdWNoZXMsXHJcbiAgICAgICAgY2hhbmdlZFRvdWNoZXMgPSB0b0FycmF5KGV2LmNoYW5nZWRUb3VjaGVzKSxcclxuICAgICAgICBjaGFuZ2VkVGFyZ2V0VG91Y2hlcyA9IFtdLFxyXG4gICAgICAgIHRhcmdldCA9IHRoaXMudGFyZ2V0O1xyXG5cclxuICAgIC8vIGdldCB0YXJnZXQgdG91Y2hlcyBmcm9tIHRvdWNoZXNcclxuICAgIHRhcmdldFRvdWNoZXMgPSBhbGxUb3VjaGVzLmZpbHRlcihmdW5jdGlvbih0b3VjaCkge1xyXG4gICAgICAgIHJldHVybiBoYXNQYXJlbnQodG91Y2gudGFyZ2V0LCB0YXJnZXQpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgLy8gY29sbGVjdCB0b3VjaGVzXHJcbiAgICBpZiAodHlwZSA9PT0gSU5QVVRfU1RBUlQpIHtcclxuICAgICAgICBpID0gMDtcclxuICAgICAgICB3aGlsZSAoaSA8IHRhcmdldFRvdWNoZXMubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgIHRhcmdldElkc1t0YXJnZXRUb3VjaGVzW2ldLmlkZW50aWZpZXJdID0gdHJ1ZTtcclxuICAgICAgICAgICAgaSsrO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvLyBmaWx0ZXIgY2hhbmdlZCB0b3VjaGVzIHRvIG9ubHkgY29udGFpbiB0b3VjaGVzIHRoYXQgZXhpc3QgaW4gdGhlIGNvbGxlY3RlZCB0YXJnZXQgaWRzXHJcbiAgICBpID0gMDtcclxuICAgIHdoaWxlIChpIDwgY2hhbmdlZFRvdWNoZXMubGVuZ3RoKSB7XHJcbiAgICAgICAgaWYgKHRhcmdldElkc1tjaGFuZ2VkVG91Y2hlc1tpXS5pZGVudGlmaWVyXSkge1xyXG4gICAgICAgICAgICBjaGFuZ2VkVGFyZ2V0VG91Y2hlcy5wdXNoKGNoYW5nZWRUb3VjaGVzW2ldKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIGNsZWFudXAgcmVtb3ZlZCB0b3VjaGVzXHJcbiAgICAgICAgaWYgKHR5cGUgJiAoSU5QVVRfRU5EIHwgSU5QVVRfQ0FOQ0VMKSkge1xyXG4gICAgICAgICAgICBkZWxldGUgdGFyZ2V0SWRzW2NoYW5nZWRUb3VjaGVzW2ldLmlkZW50aWZpZXJdO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpKys7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKCFjaGFuZ2VkVGFyZ2V0VG91Y2hlcy5sZW5ndGgpIHtcclxuICAgICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIFtcclxuICAgICAgICAvLyBtZXJnZSB0YXJnZXRUb3VjaGVzIHdpdGggY2hhbmdlZFRhcmdldFRvdWNoZXMgc28gaXQgY29udGFpbnMgQUxMIHRvdWNoZXMsIGluY2x1ZGluZyAnZW5kJyBhbmQgJ2NhbmNlbCdcclxuICAgICAgICB1bmlxdWVBcnJheSh0YXJnZXRUb3VjaGVzLmNvbmNhdChjaGFuZ2VkVGFyZ2V0VG91Y2hlcyksICdpZGVudGlmaWVyJywgdHJ1ZSksXHJcbiAgICAgICAgY2hhbmdlZFRhcmdldFRvdWNoZXNcclxuICAgIF07XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBDb21iaW5lZCB0b3VjaCBhbmQgbW91c2UgaW5wdXRcclxuICpcclxuICogVG91Y2ggaGFzIGEgaGlnaGVyIHByaW9yaXR5IHRoZW4gbW91c2UsIGFuZCB3aGlsZSB0b3VjaGluZyBubyBtb3VzZSBldmVudHMgYXJlIGFsbG93ZWQuXHJcbiAqIFRoaXMgYmVjYXVzZSB0b3VjaCBkZXZpY2VzIGFsc28gZW1pdCBtb3VzZSBldmVudHMgd2hpbGUgZG9pbmcgYSB0b3VjaC5cclxuICpcclxuICogQGNvbnN0cnVjdG9yXHJcbiAqIEBleHRlbmRzIElucHV0XHJcbiAqL1xyXG5mdW5jdGlvbiBUb3VjaE1vdXNlSW5wdXQoKSB7XHJcbiAgICBJbnB1dC5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xyXG5cclxuICAgIHZhciBoYW5kbGVyID0gYmluZEZuKHRoaXMuaGFuZGxlciwgdGhpcyk7XHJcbiAgICB0aGlzLnRvdWNoID0gbmV3IFRvdWNoSW5wdXQodGhpcy5tYW5hZ2VyLCBoYW5kbGVyKTtcclxuICAgIHRoaXMubW91c2UgPSBuZXcgTW91c2VJbnB1dCh0aGlzLm1hbmFnZXIsIGhhbmRsZXIpO1xyXG59XHJcblxyXG5pbmhlcml0KFRvdWNoTW91c2VJbnB1dCwgSW5wdXQsIHtcclxuICAgIC8qKlxyXG4gICAgICogaGFuZGxlIG1vdXNlIGFuZCB0b3VjaCBldmVudHNcclxuICAgICAqIEBwYXJhbSB7SGFtbWVyfSBtYW5hZ2VyXHJcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gaW5wdXRFdmVudFxyXG4gICAgICogQHBhcmFtIHtPYmplY3R9IGlucHV0RGF0YVxyXG4gICAgICovXHJcbiAgICBoYW5kbGVyOiBmdW5jdGlvbiBUTUVoYW5kbGVyKG1hbmFnZXIsIGlucHV0RXZlbnQsIGlucHV0RGF0YSkge1xyXG4gICAgICAgIHZhciBpc1RvdWNoID0gKGlucHV0RGF0YS5wb2ludGVyVHlwZSA9PSBJTlBVVF9UWVBFX1RPVUNIKSxcclxuICAgICAgICAgICAgaXNNb3VzZSA9IChpbnB1dERhdGEucG9pbnRlclR5cGUgPT0gSU5QVVRfVFlQRV9NT1VTRSk7XHJcblxyXG4gICAgICAgIC8vIHdoZW4gd2UncmUgaW4gYSB0b3VjaCBldmVudCwgc28gIGJsb2NrIGFsbCB1cGNvbWluZyBtb3VzZSBldmVudHNcclxuICAgICAgICAvLyBtb3N0IG1vYmlsZSBicm93c2VyIGFsc28gZW1pdCBtb3VzZWV2ZW50cywgcmlnaHQgYWZ0ZXIgdG91Y2hzdGFydFxyXG4gICAgICAgIGlmIChpc1RvdWNoKSB7XHJcbiAgICAgICAgICAgIHRoaXMubW91c2UuYWxsb3cgPSBmYWxzZTtcclxuICAgICAgICB9IGVsc2UgaWYgKGlzTW91c2UgJiYgIXRoaXMubW91c2UuYWxsb3cpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gcmVzZXQgdGhlIGFsbG93TW91c2Ugd2hlbiB3ZSdyZSBkb25lXHJcbiAgICAgICAgaWYgKGlucHV0RXZlbnQgJiAoSU5QVVRfRU5EIHwgSU5QVVRfQ0FOQ0VMKSkge1xyXG4gICAgICAgICAgICB0aGlzLm1vdXNlLmFsbG93ID0gdHJ1ZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuY2FsbGJhY2sobWFuYWdlciwgaW5wdXRFdmVudCwgaW5wdXREYXRhKTtcclxuICAgIH0sXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiByZW1vdmUgdGhlIGV2ZW50IGxpc3RlbmVyc1xyXG4gICAgICovXHJcbiAgICBkZXN0cm95OiBmdW5jdGlvbiBkZXN0cm95KCkge1xyXG4gICAgICAgIHRoaXMudG91Y2guZGVzdHJveSgpO1xyXG4gICAgICAgIHRoaXMubW91c2UuZGVzdHJveSgpO1xyXG4gICAgfVxyXG59KTtcclxuXHJcbnZhciBQUkVGSVhFRF9UT1VDSF9BQ1RJT04gPSBwcmVmaXhlZChURVNUX0VMRU1FTlQuc3R5bGUsICd0b3VjaEFjdGlvbicpO1xyXG52YXIgTkFUSVZFX1RPVUNIX0FDVElPTiA9IFBSRUZJWEVEX1RPVUNIX0FDVElPTiAhPT0gdW5kZWZpbmVkO1xyXG5cclxuLy8gbWFnaWNhbCB0b3VjaEFjdGlvbiB2YWx1ZVxyXG52YXIgVE9VQ0hfQUNUSU9OX0NPTVBVVEUgPSAnY29tcHV0ZSc7XHJcbnZhciBUT1VDSF9BQ1RJT05fQVVUTyA9ICdhdXRvJztcclxudmFyIFRPVUNIX0FDVElPTl9NQU5JUFVMQVRJT04gPSAnbWFuaXB1bGF0aW9uJzsgLy8gbm90IGltcGxlbWVudGVkXHJcbnZhciBUT1VDSF9BQ1RJT05fTk9ORSA9ICdub25lJztcclxudmFyIFRPVUNIX0FDVElPTl9QQU5fWCA9ICdwYW4teCc7XHJcbnZhciBUT1VDSF9BQ1RJT05fUEFOX1kgPSAncGFuLXknO1xyXG5cclxuLyoqXHJcbiAqIFRvdWNoIEFjdGlvblxyXG4gKiBzZXRzIHRoZSB0b3VjaEFjdGlvbiBwcm9wZXJ0eSBvciB1c2VzIHRoZSBqcyBhbHRlcm5hdGl2ZVxyXG4gKiBAcGFyYW0ge01hbmFnZXJ9IG1hbmFnZXJcclxuICogQHBhcmFtIHtTdHJpbmd9IHZhbHVlXHJcbiAqIEBjb25zdHJ1Y3RvclxyXG4gKi9cclxuZnVuY3Rpb24gVG91Y2hBY3Rpb24obWFuYWdlciwgdmFsdWUpIHtcclxuICAgIHRoaXMubWFuYWdlciA9IG1hbmFnZXI7XHJcbiAgICB0aGlzLnNldCh2YWx1ZSk7XHJcbn1cclxuXHJcblRvdWNoQWN0aW9uLnByb3RvdHlwZSA9IHtcclxuICAgIC8qKlxyXG4gICAgICogc2V0IHRoZSB0b3VjaEFjdGlvbiB2YWx1ZSBvbiB0aGUgZWxlbWVudCBvciBlbmFibGUgdGhlIHBvbHlmaWxsXHJcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gdmFsdWVcclxuICAgICAqL1xyXG4gICAgc2V0OiBmdW5jdGlvbih2YWx1ZSkge1xyXG4gICAgICAgIC8vIGZpbmQgb3V0IHRoZSB0b3VjaC1hY3Rpb24gYnkgdGhlIGV2ZW50IGhhbmRsZXJzXHJcbiAgICAgICAgaWYgKHZhbHVlID09IFRPVUNIX0FDVElPTl9DT01QVVRFKSB7XHJcbiAgICAgICAgICAgIHZhbHVlID0gdGhpcy5jb21wdXRlKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoTkFUSVZFX1RPVUNIX0FDVElPTikge1xyXG4gICAgICAgICAgICB0aGlzLm1hbmFnZXIuZWxlbWVudC5zdHlsZVtQUkVGSVhFRF9UT1VDSF9BQ1RJT05dID0gdmFsdWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuYWN0aW9ucyA9IHZhbHVlLnRvTG93ZXJDYXNlKCkudHJpbSgpO1xyXG4gICAgfSxcclxuXHJcbiAgICAvKipcclxuICAgICAqIGp1c3QgcmUtc2V0IHRoZSB0b3VjaEFjdGlvbiB2YWx1ZVxyXG4gICAgICovXHJcbiAgICB1cGRhdGU6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHRoaXMuc2V0KHRoaXMubWFuYWdlci5vcHRpb25zLnRvdWNoQWN0aW9uKTtcclxuICAgIH0sXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBjb21wdXRlIHRoZSB2YWx1ZSBmb3IgdGhlIHRvdWNoQWN0aW9uIHByb3BlcnR5IGJhc2VkIG9uIHRoZSByZWNvZ25pemVyJ3Mgc2V0dGluZ3NcclxuICAgICAqIEByZXR1cm5zIHtTdHJpbmd9IHZhbHVlXHJcbiAgICAgKi9cclxuICAgIGNvbXB1dGU6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHZhciBhY3Rpb25zID0gW107XHJcbiAgICAgICAgZWFjaCh0aGlzLm1hbmFnZXIucmVjb2duaXplcnMsIGZ1bmN0aW9uKHJlY29nbml6ZXIpIHtcclxuICAgICAgICAgICAgaWYgKGJvb2xPckZuKHJlY29nbml6ZXIub3B0aW9ucy5lbmFibGUsIFtyZWNvZ25pemVyXSkpIHtcclxuICAgICAgICAgICAgICAgIGFjdGlvbnMgPSBhY3Rpb25zLmNvbmNhdChyZWNvZ25pemVyLmdldFRvdWNoQWN0aW9uKCkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgcmV0dXJuIGNsZWFuVG91Y2hBY3Rpb25zKGFjdGlvbnMuam9pbignICcpKTtcclxuICAgIH0sXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiB0aGlzIG1ldGhvZCBpcyBjYWxsZWQgb24gZWFjaCBpbnB1dCBjeWNsZSBhbmQgcHJvdmlkZXMgdGhlIHByZXZlbnRpbmcgb2YgdGhlIGJyb3dzZXIgYmVoYXZpb3JcclxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBpbnB1dFxyXG4gICAgICovXHJcbiAgICBwcmV2ZW50RGVmYXVsdHM6IGZ1bmN0aW9uKGlucHV0KSB7XHJcbiAgICAgICAgLy8gbm90IG5lZWRlZCB3aXRoIG5hdGl2ZSBzdXBwb3J0IGZvciB0aGUgdG91Y2hBY3Rpb24gcHJvcGVydHlcclxuICAgICAgICBpZiAoTkFUSVZFX1RPVUNIX0FDVElPTikge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB2YXIgc3JjRXZlbnQgPSBpbnB1dC5zcmNFdmVudDtcclxuICAgICAgICB2YXIgZGlyZWN0aW9uID0gaW5wdXQub2Zmc2V0RGlyZWN0aW9uO1xyXG5cclxuICAgICAgICAvLyBpZiB0aGUgdG91Y2ggYWN0aW9uIGRpZCBwcmV2ZW50ZWQgb25jZSB0aGlzIHNlc3Npb25cclxuICAgICAgICBpZiAodGhpcy5tYW5hZ2VyLnNlc3Npb24ucHJldmVudGVkKSB7XHJcbiAgICAgICAgICAgIHNyY0V2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHZhciBhY3Rpb25zID0gdGhpcy5hY3Rpb25zO1xyXG4gICAgICAgIHZhciBoYXNOb25lID0gaW5TdHIoYWN0aW9ucywgVE9VQ0hfQUNUSU9OX05PTkUpO1xyXG4gICAgICAgIHZhciBoYXNQYW5ZID0gaW5TdHIoYWN0aW9ucywgVE9VQ0hfQUNUSU9OX1BBTl9ZKTtcclxuICAgICAgICB2YXIgaGFzUGFuWCA9IGluU3RyKGFjdGlvbnMsIFRPVUNIX0FDVElPTl9QQU5fWCk7XHJcblxyXG4gICAgICAgIGlmIChoYXNOb25lIHx8XHJcbiAgICAgICAgICAgIChoYXNQYW5ZICYmIGRpcmVjdGlvbiAmIERJUkVDVElPTl9IT1JJWk9OVEFMKSB8fFxyXG4gICAgICAgICAgICAoaGFzUGFuWCAmJiBkaXJlY3Rpb24gJiBESVJFQ1RJT05fVkVSVElDQUwpKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnByZXZlbnRTcmMoc3JjRXZlbnQpO1xyXG4gICAgICAgIH1cclxuICAgIH0sXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBjYWxsIHByZXZlbnREZWZhdWx0IHRvIHByZXZlbnQgdGhlIGJyb3dzZXIncyBkZWZhdWx0IGJlaGF2aW9yIChzY3JvbGxpbmcgaW4gbW9zdCBjYXNlcylcclxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBzcmNFdmVudFxyXG4gICAgICovXHJcbiAgICBwcmV2ZW50U3JjOiBmdW5jdGlvbihzcmNFdmVudCkge1xyXG4gICAgICAgIHRoaXMubWFuYWdlci5zZXNzaW9uLnByZXZlbnRlZCA9IHRydWU7XHJcbiAgICAgICAgc3JjRXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuICAgIH1cclxufTtcclxuXHJcbi8qKlxyXG4gKiB3aGVuIHRoZSB0b3VjaEFjdGlvbnMgYXJlIGNvbGxlY3RlZCB0aGV5IGFyZSBub3QgYSB2YWxpZCB2YWx1ZSwgc28gd2UgbmVlZCB0byBjbGVhbiB0aGluZ3MgdXAuICpcclxuICogQHBhcmFtIHtTdHJpbmd9IGFjdGlvbnNcclxuICogQHJldHVybnMgeyp9XHJcbiAqL1xyXG5mdW5jdGlvbiBjbGVhblRvdWNoQWN0aW9ucyhhY3Rpb25zKSB7XHJcbiAgICAvLyBub25lXHJcbiAgICBpZiAoaW5TdHIoYWN0aW9ucywgVE9VQ0hfQUNUSU9OX05PTkUpKSB7XHJcbiAgICAgICAgcmV0dXJuIFRPVUNIX0FDVElPTl9OT05FO1xyXG4gICAgfVxyXG5cclxuICAgIHZhciBoYXNQYW5YID0gaW5TdHIoYWN0aW9ucywgVE9VQ0hfQUNUSU9OX1BBTl9YKTtcclxuICAgIHZhciBoYXNQYW5ZID0gaW5TdHIoYWN0aW9ucywgVE9VQ0hfQUNUSU9OX1BBTl9ZKTtcclxuXHJcbiAgICAvLyBwYW4teCBhbmQgcGFuLXkgY2FuIGJlIGNvbWJpbmVkXHJcbiAgICBpZiAoaGFzUGFuWCAmJiBoYXNQYW5ZKSB7XHJcbiAgICAgICAgcmV0dXJuIFRPVUNIX0FDVElPTl9QQU5fWCArICcgJyArIFRPVUNIX0FDVElPTl9QQU5fWTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBwYW4teCBPUiBwYW4teVxyXG4gICAgaWYgKGhhc1BhblggfHwgaGFzUGFuWSkge1xyXG4gICAgICAgIHJldHVybiBoYXNQYW5YID8gVE9VQ0hfQUNUSU9OX1BBTl9YIDogVE9VQ0hfQUNUSU9OX1BBTl9ZO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIG1hbmlwdWxhdGlvblxyXG4gICAgaWYgKGluU3RyKGFjdGlvbnMsIFRPVUNIX0FDVElPTl9NQU5JUFVMQVRJT04pKSB7XHJcbiAgICAgICAgcmV0dXJuIFRPVUNIX0FDVElPTl9NQU5JUFVMQVRJT047XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIFRPVUNIX0FDVElPTl9BVVRPO1xyXG59XHJcblxyXG4vKipcclxuICogUmVjb2duaXplciBmbG93IGV4cGxhaW5lZDsgKlxyXG4gKiBBbGwgcmVjb2duaXplcnMgaGF2ZSB0aGUgaW5pdGlhbCBzdGF0ZSBvZiBQT1NTSUJMRSB3aGVuIGEgaW5wdXQgc2Vzc2lvbiBzdGFydHMuXHJcbiAqIFRoZSBkZWZpbml0aW9uIG9mIGEgaW5wdXQgc2Vzc2lvbiBpcyBmcm9tIHRoZSBmaXJzdCBpbnB1dCB1bnRpbCB0aGUgbGFzdCBpbnB1dCwgd2l0aCBhbGwgaXQncyBtb3ZlbWVudCBpbiBpdC4gKlxyXG4gKiBFeGFtcGxlIHNlc3Npb24gZm9yIG1vdXNlLWlucHV0OiBtb3VzZWRvd24gLT4gbW91c2Vtb3ZlIC0+IG1vdXNldXBcclxuICpcclxuICogT24gZWFjaCByZWNvZ25pemluZyBjeWNsZSAoc2VlIE1hbmFnZXIucmVjb2duaXplKSB0aGUgLnJlY29nbml6ZSgpIG1ldGhvZCBpcyBleGVjdXRlZFxyXG4gKiB3aGljaCBkZXRlcm1pbmVzIHdpdGggc3RhdGUgaXQgc2hvdWxkIGJlLlxyXG4gKlxyXG4gKiBJZiB0aGUgcmVjb2duaXplciBoYXMgdGhlIHN0YXRlIEZBSUxFRCwgQ0FOQ0VMTEVEIG9yIFJFQ09HTklaRUQgKGVxdWFscyBFTkRFRCksIGl0IGlzIHJlc2V0IHRvXHJcbiAqIFBPU1NJQkxFIHRvIGdpdmUgaXQgYW5vdGhlciBjaGFuZ2Ugb24gdGhlIG5leHQgY3ljbGUuXHJcbiAqXHJcbiAqICAgICAgICAgICAgICAgUG9zc2libGVcclxuICogICAgICAgICAgICAgICAgICB8XHJcbiAqICAgICAgICAgICAgKy0tLS0tKy0tLS0tLS0tLS0tLS0tLStcclxuICogICAgICAgICAgICB8ICAgICAgICAgICAgICAgICAgICAgfFxyXG4gKiAgICAgICstLS0tLSstLS0tLSsgICAgICAgICAgICAgICB8XHJcbiAqICAgICAgfCAgICAgICAgICAgfCAgICAgICAgICAgICAgIHxcclxuICogICBGYWlsZWQgICAgICBDYW5jZWxsZWQgICAgICAgICAgfFxyXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgKy0tLS0tLS0rLS0tLS0tK1xyXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgfCAgICAgICAgICAgICAgfFxyXG4gKiAgICAgICAgICAgICAgICAgICAgICBSZWNvZ25pemVkICAgICAgIEJlZ2FuXHJcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB8XHJcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBDaGFuZ2VkXHJcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB8XHJcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIEVuZGVkL1JlY29nbml6ZWRcclxuICovXHJcbnZhciBTVEFURV9QT1NTSUJMRSA9IDE7XHJcbnZhciBTVEFURV9CRUdBTiA9IDI7XHJcbnZhciBTVEFURV9DSEFOR0VEID0gNDtcclxudmFyIFNUQVRFX0VOREVEID0gODtcclxudmFyIFNUQVRFX1JFQ09HTklaRUQgPSBTVEFURV9FTkRFRDtcclxudmFyIFNUQVRFX0NBTkNFTExFRCA9IDE2O1xyXG52YXIgU1RBVEVfRkFJTEVEID0gMzI7XHJcblxyXG4vKipcclxuICogUmVjb2duaXplclxyXG4gKiBFdmVyeSByZWNvZ25pemVyIG5lZWRzIHRvIGV4dGVuZCBmcm9tIHRoaXMgY2xhc3MuXHJcbiAqIEBjb25zdHJ1Y3RvclxyXG4gKiBAcGFyYW0ge09iamVjdH0gb3B0aW9uc1xyXG4gKi9cclxuZnVuY3Rpb24gUmVjb2duaXplcihvcHRpb25zKSB7XHJcbiAgICB0aGlzLmlkID0gdW5pcXVlSWQoKTtcclxuXHJcbiAgICB0aGlzLm1hbmFnZXIgPSBudWxsO1xyXG4gICAgdGhpcy5vcHRpb25zID0gbWVyZ2Uob3B0aW9ucyB8fCB7fSwgdGhpcy5kZWZhdWx0cyk7XHJcblxyXG4gICAgLy8gZGVmYXVsdCBpcyBlbmFibGUgdHJ1ZVxyXG4gICAgdGhpcy5vcHRpb25zLmVuYWJsZSA9IGlmVW5kZWZpbmVkKHRoaXMub3B0aW9ucy5lbmFibGUsIHRydWUpO1xyXG5cclxuICAgIHRoaXMuc3RhdGUgPSBTVEFURV9QT1NTSUJMRTtcclxuXHJcbiAgICB0aGlzLnNpbXVsdGFuZW91cyA9IHt9O1xyXG4gICAgdGhpcy5yZXF1aXJlRmFpbCA9IFtdO1xyXG59XHJcblxyXG5SZWNvZ25pemVyLnByb3RvdHlwZSA9IHtcclxuICAgIC8qKlxyXG4gICAgICogQHZpcnR1YWxcclxuICAgICAqIEB0eXBlIHtPYmplY3R9XHJcbiAgICAgKi9cclxuICAgIGRlZmF1bHRzOiB7fSxcclxuXHJcbiAgICAvKipcclxuICAgICAqIHNldCBvcHRpb25zXHJcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9uc1xyXG4gICAgICogQHJldHVybiB7UmVjb2duaXplcn1cclxuICAgICAqL1xyXG4gICAgc2V0OiBmdW5jdGlvbihvcHRpb25zKSB7XHJcbiAgICAgICAgZXh0ZW5kKHRoaXMub3B0aW9ucywgb3B0aW9ucyk7XHJcblxyXG4gICAgICAgIC8vIGFsc28gdXBkYXRlIHRoZSB0b3VjaEFjdGlvbiwgaW4gY2FzZSBzb21ldGhpbmcgY2hhbmdlZCBhYm91dCB0aGUgZGlyZWN0aW9ucy9lbmFibGVkIHN0YXRlXHJcbiAgICAgICAgdGhpcy5tYW5hZ2VyICYmIHRoaXMubWFuYWdlci50b3VjaEFjdGlvbi51cGRhdGUoKTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH0sXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiByZWNvZ25pemUgc2ltdWx0YW5lb3VzIHdpdGggYW4gb3RoZXIgcmVjb2duaXplci5cclxuICAgICAqIEBwYXJhbSB7UmVjb2duaXplcn0gb3RoZXJSZWNvZ25pemVyXHJcbiAgICAgKiBAcmV0dXJucyB7UmVjb2duaXplcn0gdGhpc1xyXG4gICAgICovXHJcbiAgICByZWNvZ25pemVXaXRoOiBmdW5jdGlvbihvdGhlclJlY29nbml6ZXIpIHtcclxuICAgICAgICBpZiAoaW52b2tlQXJyYXlBcmcob3RoZXJSZWNvZ25pemVyLCAncmVjb2duaXplV2l0aCcsIHRoaXMpKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdmFyIHNpbXVsdGFuZW91cyA9IHRoaXMuc2ltdWx0YW5lb3VzO1xyXG4gICAgICAgIG90aGVyUmVjb2duaXplciA9IGdldFJlY29nbml6ZXJCeU5hbWVJZk1hbmFnZXIob3RoZXJSZWNvZ25pemVyLCB0aGlzKTtcclxuICAgICAgICBpZiAoIXNpbXVsdGFuZW91c1tvdGhlclJlY29nbml6ZXIuaWRdKSB7XHJcbiAgICAgICAgICAgIHNpbXVsdGFuZW91c1tvdGhlclJlY29nbml6ZXIuaWRdID0gb3RoZXJSZWNvZ25pemVyO1xyXG4gICAgICAgICAgICBvdGhlclJlY29nbml6ZXIucmVjb2duaXplV2l0aCh0aGlzKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9LFxyXG5cclxuICAgIC8qKlxyXG4gICAgICogZHJvcCB0aGUgc2ltdWx0YW5lb3VzIGxpbmsuIGl0IGRvZXNudCByZW1vdmUgdGhlIGxpbmsgb24gdGhlIG90aGVyIHJlY29nbml6ZXIuXHJcbiAgICAgKiBAcGFyYW0ge1JlY29nbml6ZXJ9IG90aGVyUmVjb2duaXplclxyXG4gICAgICogQHJldHVybnMge1JlY29nbml6ZXJ9IHRoaXNcclxuICAgICAqL1xyXG4gICAgZHJvcFJlY29nbml6ZVdpdGg6IGZ1bmN0aW9uKG90aGVyUmVjb2duaXplcikge1xyXG4gICAgICAgIGlmIChpbnZva2VBcnJheUFyZyhvdGhlclJlY29nbml6ZXIsICdkcm9wUmVjb2duaXplV2l0aCcsIHRoaXMpKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgb3RoZXJSZWNvZ25pemVyID0gZ2V0UmVjb2duaXplckJ5TmFtZUlmTWFuYWdlcihvdGhlclJlY29nbml6ZXIsIHRoaXMpO1xyXG4gICAgICAgIGRlbGV0ZSB0aGlzLnNpbXVsdGFuZW91c1tvdGhlclJlY29nbml6ZXIuaWRdO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfSxcclxuXHJcbiAgICAvKipcclxuICAgICAqIHJlY29nbml6ZXIgY2FuIG9ubHkgcnVuIHdoZW4gYW4gb3RoZXIgaXMgZmFpbGluZ1xyXG4gICAgICogQHBhcmFtIHtSZWNvZ25pemVyfSBvdGhlclJlY29nbml6ZXJcclxuICAgICAqIEByZXR1cm5zIHtSZWNvZ25pemVyfSB0aGlzXHJcbiAgICAgKi9cclxuICAgIHJlcXVpcmVGYWlsdXJlOiBmdW5jdGlvbihvdGhlclJlY29nbml6ZXIpIHtcclxuICAgICAgICBpZiAoaW52b2tlQXJyYXlBcmcob3RoZXJSZWNvZ25pemVyLCAncmVxdWlyZUZhaWx1cmUnLCB0aGlzKSkge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHZhciByZXF1aXJlRmFpbCA9IHRoaXMucmVxdWlyZUZhaWw7XHJcbiAgICAgICAgb3RoZXJSZWNvZ25pemVyID0gZ2V0UmVjb2duaXplckJ5TmFtZUlmTWFuYWdlcihvdGhlclJlY29nbml6ZXIsIHRoaXMpO1xyXG4gICAgICAgIGlmIChpbkFycmF5KHJlcXVpcmVGYWlsLCBvdGhlclJlY29nbml6ZXIpID09PSAtMSkge1xyXG4gICAgICAgICAgICByZXF1aXJlRmFpbC5wdXNoKG90aGVyUmVjb2duaXplcik7XHJcbiAgICAgICAgICAgIG90aGVyUmVjb2duaXplci5yZXF1aXJlRmFpbHVyZSh0aGlzKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9LFxyXG5cclxuICAgIC8qKlxyXG4gICAgICogZHJvcCB0aGUgcmVxdWlyZUZhaWx1cmUgbGluay4gaXQgZG9lcyBub3QgcmVtb3ZlIHRoZSBsaW5rIG9uIHRoZSBvdGhlciByZWNvZ25pemVyLlxyXG4gICAgICogQHBhcmFtIHtSZWNvZ25pemVyfSBvdGhlclJlY29nbml6ZXJcclxuICAgICAqIEByZXR1cm5zIHtSZWNvZ25pemVyfSB0aGlzXHJcbiAgICAgKi9cclxuICAgIGRyb3BSZXF1aXJlRmFpbHVyZTogZnVuY3Rpb24ob3RoZXJSZWNvZ25pemVyKSB7XHJcbiAgICAgICAgaWYgKGludm9rZUFycmF5QXJnKG90aGVyUmVjb2duaXplciwgJ2Ryb3BSZXF1aXJlRmFpbHVyZScsIHRoaXMpKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgb3RoZXJSZWNvZ25pemVyID0gZ2V0UmVjb2duaXplckJ5TmFtZUlmTWFuYWdlcihvdGhlclJlY29nbml6ZXIsIHRoaXMpO1xyXG4gICAgICAgIHZhciBpbmRleCA9IGluQXJyYXkodGhpcy5yZXF1aXJlRmFpbCwgb3RoZXJSZWNvZ25pemVyKTtcclxuICAgICAgICBpZiAoaW5kZXggPiAtMSkge1xyXG4gICAgICAgICAgICB0aGlzLnJlcXVpcmVGYWlsLnNwbGljZShpbmRleCwgMSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfSxcclxuXHJcbiAgICAvKipcclxuICAgICAqIGhhcyByZXF1aXJlIGZhaWx1cmVzIGJvb2xlYW5cclxuICAgICAqIEByZXR1cm5zIHtib29sZWFufVxyXG4gICAgICovXHJcbiAgICBoYXNSZXF1aXJlRmFpbHVyZXM6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnJlcXVpcmVGYWlsLmxlbmd0aCA+IDA7XHJcbiAgICB9LFxyXG5cclxuICAgIC8qKlxyXG4gICAgICogaWYgdGhlIHJlY29nbml6ZXIgY2FuIHJlY29nbml6ZSBzaW11bHRhbmVvdXMgd2l0aCBhbiBvdGhlciByZWNvZ25pemVyXHJcbiAgICAgKiBAcGFyYW0ge1JlY29nbml6ZXJ9IG90aGVyUmVjb2duaXplclxyXG4gICAgICogQHJldHVybnMge0Jvb2xlYW59XHJcbiAgICAgKi9cclxuICAgIGNhblJlY29nbml6ZVdpdGg6IGZ1bmN0aW9uKG90aGVyUmVjb2duaXplcikge1xyXG4gICAgICAgIHJldHVybiAhIXRoaXMuc2ltdWx0YW5lb3VzW290aGVyUmVjb2duaXplci5pZF07XHJcbiAgICB9LFxyXG5cclxuICAgIC8qKlxyXG4gICAgICogWW91IHNob3VsZCB1c2UgYHRyeUVtaXRgIGluc3RlYWQgb2YgYGVtaXRgIGRpcmVjdGx5IHRvIGNoZWNrXHJcbiAgICAgKiB0aGF0IGFsbCB0aGUgbmVlZGVkIHJlY29nbml6ZXJzIGhhcyBmYWlsZWQgYmVmb3JlIGVtaXR0aW5nLlxyXG4gICAgICogQHBhcmFtIHtPYmplY3R9IGlucHV0XHJcbiAgICAgKi9cclxuICAgIGVtaXQ6IGZ1bmN0aW9uKGlucHV0KSB7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgIHZhciBzdGF0ZSA9IHRoaXMuc3RhdGU7XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGVtaXQod2l0aFN0YXRlKSB7XHJcbiAgICAgICAgICAgIHNlbGYubWFuYWdlci5lbWl0KHNlbGYub3B0aW9ucy5ldmVudCArICh3aXRoU3RhdGUgPyBzdGF0ZVN0cihzdGF0ZSkgOiAnJyksIGlucHV0KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vICdwYW5zdGFydCcgYW5kICdwYW5tb3ZlJ1xyXG4gICAgICAgIGlmIChzdGF0ZSA8IFNUQVRFX0VOREVEKSB7XHJcbiAgICAgICAgICAgIGVtaXQodHJ1ZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBlbWl0KCk7IC8vIHNpbXBsZSAnZXZlbnROYW1lJyBldmVudHNcclxuXHJcbiAgICAgICAgLy8gcGFuZW5kIGFuZCBwYW5jYW5jZWxcclxuICAgICAgICBpZiAoc3RhdGUgPj0gU1RBVEVfRU5ERUQpIHtcclxuICAgICAgICAgICAgZW1pdCh0cnVlKTtcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQ2hlY2sgdGhhdCBhbGwgdGhlIHJlcXVpcmUgZmFpbHVyZSByZWNvZ25pemVycyBoYXMgZmFpbGVkLFxyXG4gICAgICogaWYgdHJ1ZSwgaXQgZW1pdHMgYSBnZXN0dXJlIGV2ZW50LFxyXG4gICAgICogb3RoZXJ3aXNlLCBzZXR1cCB0aGUgc3RhdGUgdG8gRkFJTEVELlxyXG4gICAgICogQHBhcmFtIHtPYmplY3R9IGlucHV0XHJcbiAgICAgKi9cclxuICAgIHRyeUVtaXQ6IGZ1bmN0aW9uKGlucHV0KSB7XHJcbiAgICAgICAgaWYgKHRoaXMuY2FuRW1pdCgpKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmVtaXQoaW5wdXQpO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvLyBpdCdzIGZhaWxpbmcgYW55d2F5XHJcbiAgICAgICAgdGhpcy5zdGF0ZSA9IFNUQVRFX0ZBSUxFRDtcclxuICAgIH0sXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBjYW4gd2UgZW1pdD9cclxuICAgICAqIEByZXR1cm5zIHtib29sZWFufVxyXG4gICAgICovXHJcbiAgICBjYW5FbWl0OiBmdW5jdGlvbigpIHtcclxuICAgICAgICB2YXIgaSA9IDA7XHJcbiAgICAgICAgd2hpbGUgKGkgPCB0aGlzLnJlcXVpcmVGYWlsLmxlbmd0aCkge1xyXG4gICAgICAgICAgICBpZiAoISh0aGlzLnJlcXVpcmVGYWlsW2ldLnN0YXRlICYgKFNUQVRFX0ZBSUxFRCB8IFNUQVRFX1BPU1NJQkxFKSkpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpKys7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfSxcclxuXHJcbiAgICAvKipcclxuICAgICAqIHVwZGF0ZSB0aGUgcmVjb2duaXplclxyXG4gICAgICogQHBhcmFtIHtPYmplY3R9IGlucHV0RGF0YVxyXG4gICAgICovXHJcbiAgICByZWNvZ25pemU6IGZ1bmN0aW9uKGlucHV0RGF0YSkge1xyXG4gICAgICAgIC8vIG1ha2UgYSBuZXcgY29weSBvZiB0aGUgaW5wdXREYXRhXHJcbiAgICAgICAgLy8gc28gd2UgY2FuIGNoYW5nZSB0aGUgaW5wdXREYXRhIHdpdGhvdXQgbWVzc2luZyB1cCB0aGUgb3RoZXIgcmVjb2duaXplcnNcclxuICAgICAgICB2YXIgaW5wdXREYXRhQ2xvbmUgPSBleHRlbmQoe30sIGlucHV0RGF0YSk7XHJcblxyXG4gICAgICAgIC8vIGlzIGlzIGVuYWJsZWQgYW5kIGFsbG93IHJlY29nbml6aW5nP1xyXG4gICAgICAgIGlmICghYm9vbE9yRm4odGhpcy5vcHRpb25zLmVuYWJsZSwgW3RoaXMsIGlucHV0RGF0YUNsb25lXSkpIHtcclxuICAgICAgICAgICAgdGhpcy5yZXNldCgpO1xyXG4gICAgICAgICAgICB0aGlzLnN0YXRlID0gU1RBVEVfRkFJTEVEO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyByZXNldCB3aGVuIHdlJ3ZlIHJlYWNoZWQgdGhlIGVuZFxyXG4gICAgICAgIGlmICh0aGlzLnN0YXRlICYgKFNUQVRFX1JFQ09HTklaRUQgfCBTVEFURV9DQU5DRUxMRUQgfCBTVEFURV9GQUlMRUQpKSB7XHJcbiAgICAgICAgICAgIHRoaXMuc3RhdGUgPSBTVEFURV9QT1NTSUJMRTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuc3RhdGUgPSB0aGlzLnByb2Nlc3MoaW5wdXREYXRhQ2xvbmUpO1xyXG5cclxuICAgICAgICAvLyB0aGUgcmVjb2duaXplciBoYXMgcmVjb2duaXplZCBhIGdlc3R1cmVcclxuICAgICAgICAvLyBzbyB0cmlnZ2VyIGFuIGV2ZW50XHJcbiAgICAgICAgaWYgKHRoaXMuc3RhdGUgJiAoU1RBVEVfQkVHQU4gfCBTVEFURV9DSEFOR0VEIHwgU1RBVEVfRU5ERUQgfCBTVEFURV9DQU5DRUxMRUQpKSB7XHJcbiAgICAgICAgICAgIHRoaXMudHJ5RW1pdChpbnB1dERhdGFDbG9uZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuXHJcbiAgICAvKipcclxuICAgICAqIHJldHVybiB0aGUgc3RhdGUgb2YgdGhlIHJlY29nbml6ZXJcclxuICAgICAqIHRoZSBhY3R1YWwgcmVjb2duaXppbmcgaGFwcGVucyBpbiB0aGlzIG1ldGhvZFxyXG4gICAgICogQHZpcnR1YWxcclxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBpbnB1dERhdGFcclxuICAgICAqIEByZXR1cm5zIHtDb25zdH0gU1RBVEVcclxuICAgICAqL1xyXG4gICAgcHJvY2VzczogZnVuY3Rpb24oaW5wdXREYXRhKSB7IH0sIC8vIGpzaGludCBpZ25vcmU6bGluZVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogcmV0dXJuIHRoZSBwcmVmZXJyZWQgdG91Y2gtYWN0aW9uXHJcbiAgICAgKiBAdmlydHVhbFxyXG4gICAgICogQHJldHVybnMge0FycmF5fVxyXG4gICAgICovXHJcbiAgICBnZXRUb3VjaEFjdGlvbjogZnVuY3Rpb24oKSB7IH0sXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBjYWxsZWQgd2hlbiB0aGUgZ2VzdHVyZSBpc24ndCBhbGxvd2VkIHRvIHJlY29nbml6ZVxyXG4gICAgICogbGlrZSB3aGVuIGFub3RoZXIgaXMgYmVpbmcgcmVjb2duaXplZCBvciBpdCBpcyBkaXNhYmxlZFxyXG4gICAgICogQHZpcnR1YWxcclxuICAgICAqL1xyXG4gICAgcmVzZXQ6IGZ1bmN0aW9uKCkgeyB9XHJcbn07XHJcblxyXG4vKipcclxuICogZ2V0IGEgdXNhYmxlIHN0cmluZywgdXNlZCBhcyBldmVudCBwb3N0Zml4XHJcbiAqIEBwYXJhbSB7Q29uc3R9IHN0YXRlXHJcbiAqIEByZXR1cm5zIHtTdHJpbmd9IHN0YXRlXHJcbiAqL1xyXG5mdW5jdGlvbiBzdGF0ZVN0cihzdGF0ZSkge1xyXG4gICAgaWYgKHN0YXRlICYgU1RBVEVfQ0FOQ0VMTEVEKSB7XHJcbiAgICAgICAgcmV0dXJuICdjYW5jZWwnO1xyXG4gICAgfSBlbHNlIGlmIChzdGF0ZSAmIFNUQVRFX0VOREVEKSB7XHJcbiAgICAgICAgcmV0dXJuICdlbmQnO1xyXG4gICAgfSBlbHNlIGlmIChzdGF0ZSAmIFNUQVRFX0NIQU5HRUQpIHtcclxuICAgICAgICByZXR1cm4gJ21vdmUnO1xyXG4gICAgfSBlbHNlIGlmIChzdGF0ZSAmIFNUQVRFX0JFR0FOKSB7XHJcbiAgICAgICAgcmV0dXJuICdzdGFydCc7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gJyc7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBkaXJlY3Rpb24gY29ucyB0byBzdHJpbmdcclxuICogQHBhcmFtIHtDb25zdH0gZGlyZWN0aW9uXHJcbiAqIEByZXR1cm5zIHtTdHJpbmd9XHJcbiAqL1xyXG5mdW5jdGlvbiBkaXJlY3Rpb25TdHIoZGlyZWN0aW9uKSB7XHJcbiAgICBpZiAoZGlyZWN0aW9uID09IERJUkVDVElPTl9ET1dOKSB7XHJcbiAgICAgICAgcmV0dXJuICdkb3duJztcclxuICAgIH0gZWxzZSBpZiAoZGlyZWN0aW9uID09IERJUkVDVElPTl9VUCkge1xyXG4gICAgICAgIHJldHVybiAndXAnO1xyXG4gICAgfSBlbHNlIGlmIChkaXJlY3Rpb24gPT0gRElSRUNUSU9OX0xFRlQpIHtcclxuICAgICAgICByZXR1cm4gJ2xlZnQnO1xyXG4gICAgfSBlbHNlIGlmIChkaXJlY3Rpb24gPT0gRElSRUNUSU9OX1JJR0hUKSB7XHJcbiAgICAgICAgcmV0dXJuICdyaWdodCc7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gJyc7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBnZXQgYSByZWNvZ25pemVyIGJ5IG5hbWUgaWYgaXQgaXMgYm91bmQgdG8gYSBtYW5hZ2VyXHJcbiAqIEBwYXJhbSB7UmVjb2duaXplcnxTdHJpbmd9IG90aGVyUmVjb2duaXplclxyXG4gKiBAcGFyYW0ge1JlY29nbml6ZXJ9IHJlY29nbml6ZXJcclxuICogQHJldHVybnMge1JlY29nbml6ZXJ9XHJcbiAqL1xyXG5mdW5jdGlvbiBnZXRSZWNvZ25pemVyQnlOYW1lSWZNYW5hZ2VyKG90aGVyUmVjb2duaXplciwgcmVjb2duaXplcikge1xyXG4gICAgdmFyIG1hbmFnZXIgPSByZWNvZ25pemVyLm1hbmFnZXI7XHJcbiAgICBpZiAobWFuYWdlcikge1xyXG4gICAgICAgIHJldHVybiBtYW5hZ2VyLmdldChvdGhlclJlY29nbml6ZXIpO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIG90aGVyUmVjb2duaXplcjtcclxufVxyXG5cclxuLyoqXHJcbiAqIFRoaXMgcmVjb2duaXplciBpcyBqdXN0IHVzZWQgYXMgYSBiYXNlIGZvciB0aGUgc2ltcGxlIGF0dHJpYnV0ZSByZWNvZ25pemVycy5cclxuICogQGNvbnN0cnVjdG9yXHJcbiAqIEBleHRlbmRzIFJlY29nbml6ZXJcclxuICovXHJcbmZ1bmN0aW9uIEF0dHJSZWNvZ25pemVyKCkge1xyXG4gICAgUmVjb2duaXplci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xyXG59XHJcblxyXG5pbmhlcml0KEF0dHJSZWNvZ25pemVyLCBSZWNvZ25pemVyLCB7XHJcbiAgICAvKipcclxuICAgICAqIEBuYW1lc3BhY2VcclxuICAgICAqIEBtZW1iZXJvZiBBdHRyUmVjb2duaXplclxyXG4gICAgICovXHJcbiAgICBkZWZhdWx0czoge1xyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIEB0eXBlIHtOdW1iZXJ9XHJcbiAgICAgICAgICogQGRlZmF1bHQgMVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHBvaW50ZXJzOiAxXHJcbiAgICB9LFxyXG5cclxuICAgIC8qKlxyXG4gICAgICogVXNlZCB0byBjaGVjayBpZiBpdCB0aGUgcmVjb2duaXplciByZWNlaXZlcyB2YWxpZCBpbnB1dCwgbGlrZSBpbnB1dC5kaXN0YW5jZSA+IDEwLlxyXG4gICAgICogQG1lbWJlcm9mIEF0dHJSZWNvZ25pemVyXHJcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gaW5wdXRcclxuICAgICAqIEByZXR1cm5zIHtCb29sZWFufSByZWNvZ25pemVkXHJcbiAgICAgKi9cclxuICAgIGF0dHJUZXN0OiBmdW5jdGlvbihpbnB1dCkge1xyXG4gICAgICAgIHZhciBvcHRpb25Qb2ludGVycyA9IHRoaXMub3B0aW9ucy5wb2ludGVycztcclxuICAgICAgICByZXR1cm4gb3B0aW9uUG9pbnRlcnMgPT09IDAgfHwgaW5wdXQucG9pbnRlcnMubGVuZ3RoID09PSBvcHRpb25Qb2ludGVycztcclxuICAgIH0sXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBQcm9jZXNzIHRoZSBpbnB1dCBhbmQgcmV0dXJuIHRoZSBzdGF0ZSBmb3IgdGhlIHJlY29nbml6ZXJcclxuICAgICAqIEBtZW1iZXJvZiBBdHRyUmVjb2duaXplclxyXG4gICAgICogQHBhcmFtIHtPYmplY3R9IGlucHV0XHJcbiAgICAgKiBAcmV0dXJucyB7Kn0gU3RhdGVcclxuICAgICAqL1xyXG4gICAgcHJvY2VzczogZnVuY3Rpb24oaW5wdXQpIHtcclxuICAgICAgICB2YXIgc3RhdGUgPSB0aGlzLnN0YXRlO1xyXG4gICAgICAgIHZhciBldmVudFR5cGUgPSBpbnB1dC5ldmVudFR5cGU7XHJcblxyXG4gICAgICAgIHZhciBpc1JlY29nbml6ZWQgPSBzdGF0ZSAmIChTVEFURV9CRUdBTiB8IFNUQVRFX0NIQU5HRUQpO1xyXG4gICAgICAgIHZhciBpc1ZhbGlkID0gdGhpcy5hdHRyVGVzdChpbnB1dCk7XHJcblxyXG4gICAgICAgIC8vIG9uIGNhbmNlbCBpbnB1dCBhbmQgd2UndmUgcmVjb2duaXplZCBiZWZvcmUsIHJldHVybiBTVEFURV9DQU5DRUxMRURcclxuICAgICAgICBpZiAoaXNSZWNvZ25pemVkICYmIChldmVudFR5cGUgJiBJTlBVVF9DQU5DRUwgfHwgIWlzVmFsaWQpKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBzdGF0ZSB8IFNUQVRFX0NBTkNFTExFRDtcclxuICAgICAgICB9IGVsc2UgaWYgKGlzUmVjb2duaXplZCB8fCBpc1ZhbGlkKSB7XHJcbiAgICAgICAgICAgIGlmIChldmVudFR5cGUgJiBJTlBVVF9FTkQpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBzdGF0ZSB8IFNUQVRFX0VOREVEO1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKCEoc3RhdGUgJiBTVEFURV9CRUdBTikpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBTVEFURV9CRUdBTjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gc3RhdGUgfCBTVEFURV9DSEFOR0VEO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gU1RBVEVfRkFJTEVEO1xyXG4gICAgfVxyXG59KTtcclxuXHJcbi8qKlxyXG4gKiBQYW5cclxuICogUmVjb2duaXplZCB3aGVuIHRoZSBwb2ludGVyIGlzIGRvd24gYW5kIG1vdmVkIGluIHRoZSBhbGxvd2VkIGRpcmVjdGlvbi5cclxuICogQGNvbnN0cnVjdG9yXHJcbiAqIEBleHRlbmRzIEF0dHJSZWNvZ25pemVyXHJcbiAqL1xyXG5mdW5jdGlvbiBQYW5SZWNvZ25pemVyKCkge1xyXG4gICAgQXR0clJlY29nbml6ZXIuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcclxuXHJcbiAgICB0aGlzLnBYID0gbnVsbDtcclxuICAgIHRoaXMucFkgPSBudWxsO1xyXG59XHJcblxyXG5pbmhlcml0KFBhblJlY29nbml6ZXIsIEF0dHJSZWNvZ25pemVyLCB7XHJcbiAgICAvKipcclxuICAgICAqIEBuYW1lc3BhY2VcclxuICAgICAqIEBtZW1iZXJvZiBQYW5SZWNvZ25pemVyXHJcbiAgICAgKi9cclxuICAgIGRlZmF1bHRzOiB7XHJcbiAgICAgICAgZXZlbnQ6ICdwYW4nLFxyXG4gICAgICAgIHRocmVzaG9sZDogMTAsXHJcbiAgICAgICAgcG9pbnRlcnM6IDEsXHJcbiAgICAgICAgZGlyZWN0aW9uOiBESVJFQ1RJT05fQUxMXHJcbiAgICB9LFxyXG5cclxuICAgIGdldFRvdWNoQWN0aW9uOiBmdW5jdGlvbigpIHtcclxuICAgICAgICB2YXIgZGlyZWN0aW9uID0gdGhpcy5vcHRpb25zLmRpcmVjdGlvbjtcclxuICAgICAgICB2YXIgYWN0aW9ucyA9IFtdO1xyXG4gICAgICAgIGlmIChkaXJlY3Rpb24gJiBESVJFQ1RJT05fSE9SSVpPTlRBTCkge1xyXG4gICAgICAgICAgICBhY3Rpb25zLnB1c2goVE9VQ0hfQUNUSU9OX1BBTl9ZKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKGRpcmVjdGlvbiAmIERJUkVDVElPTl9WRVJUSUNBTCkge1xyXG4gICAgICAgICAgICBhY3Rpb25zLnB1c2goVE9VQ0hfQUNUSU9OX1BBTl9YKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGFjdGlvbnM7XHJcbiAgICB9LFxyXG5cclxuICAgIGRpcmVjdGlvblRlc3Q6IGZ1bmN0aW9uKGlucHV0KSB7XHJcbiAgICAgICAgdmFyIG9wdGlvbnMgPSB0aGlzLm9wdGlvbnM7XHJcbiAgICAgICAgdmFyIGhhc01vdmVkID0gdHJ1ZTtcclxuICAgICAgICB2YXIgZGlzdGFuY2UgPSBpbnB1dC5kaXN0YW5jZTtcclxuICAgICAgICB2YXIgZGlyZWN0aW9uID0gaW5wdXQuZGlyZWN0aW9uO1xyXG4gICAgICAgIHZhciB4ID0gaW5wdXQuZGVsdGFYO1xyXG4gICAgICAgIHZhciB5ID0gaW5wdXQuZGVsdGFZO1xyXG5cclxuICAgICAgICAvLyBsb2NrIHRvIGF4aXM/XHJcbiAgICAgICAgaWYgKCEoZGlyZWN0aW9uICYgb3B0aW9ucy5kaXJlY3Rpb24pKSB7XHJcbiAgICAgICAgICAgIGlmIChvcHRpb25zLmRpcmVjdGlvbiAmIERJUkVDVElPTl9IT1JJWk9OVEFMKSB7XHJcbiAgICAgICAgICAgICAgICBkaXJlY3Rpb24gPSAoeCA9PT0gMCkgPyBESVJFQ1RJT05fTk9ORSA6ICh4IDwgMCkgPyBESVJFQ1RJT05fTEVGVCA6IERJUkVDVElPTl9SSUdIVDtcclxuICAgICAgICAgICAgICAgIGhhc01vdmVkID0geCAhPSB0aGlzLnBYO1xyXG4gICAgICAgICAgICAgICAgZGlzdGFuY2UgPSBNYXRoLmFicyhpbnB1dC5kZWx0YVgpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgZGlyZWN0aW9uID0gKHkgPT09IDApID8gRElSRUNUSU9OX05PTkUgOiAoeSA8IDApID8gRElSRUNUSU9OX1VQIDogRElSRUNUSU9OX0RPV047XHJcbiAgICAgICAgICAgICAgICBoYXNNb3ZlZCA9IHkgIT0gdGhpcy5wWTtcclxuICAgICAgICAgICAgICAgIGRpc3RhbmNlID0gTWF0aC5hYnMoaW5wdXQuZGVsdGFZKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBpbnB1dC5kaXJlY3Rpb24gPSBkaXJlY3Rpb247XHJcbiAgICAgICAgcmV0dXJuIGhhc01vdmVkICYmIGRpc3RhbmNlID4gb3B0aW9ucy50aHJlc2hvbGQgJiYgZGlyZWN0aW9uICYgb3B0aW9ucy5kaXJlY3Rpb247XHJcbiAgICB9LFxyXG5cclxuICAgIGF0dHJUZXN0OiBmdW5jdGlvbihpbnB1dCkge1xyXG4gICAgICAgIHJldHVybiBBdHRyUmVjb2duaXplci5wcm90b3R5cGUuYXR0clRlc3QuY2FsbCh0aGlzLCBpbnB1dCkgJiZcclxuICAgICAgICAgICAgKHRoaXMuc3RhdGUgJiBTVEFURV9CRUdBTiB8fCAoISh0aGlzLnN0YXRlICYgU1RBVEVfQkVHQU4pICYmIHRoaXMuZGlyZWN0aW9uVGVzdChpbnB1dCkpKTtcclxuICAgIH0sXHJcblxyXG4gICAgZW1pdDogZnVuY3Rpb24oaW5wdXQpIHtcclxuICAgICAgICB0aGlzLnBYID0gaW5wdXQuZGVsdGFYO1xyXG4gICAgICAgIHRoaXMucFkgPSBpbnB1dC5kZWx0YVk7XHJcblxyXG4gICAgICAgIHZhciBkaXJlY3Rpb24gPSBkaXJlY3Rpb25TdHIoaW5wdXQuZGlyZWN0aW9uKTtcclxuICAgICAgICBpZiAoZGlyZWN0aW9uKSB7XHJcbiAgICAgICAgICAgIHRoaXMubWFuYWdlci5lbWl0KHRoaXMub3B0aW9ucy5ldmVudCArIGRpcmVjdGlvbiwgaW5wdXQpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5fc3VwZXIuZW1pdC5jYWxsKHRoaXMsIGlucHV0KTtcclxuICAgIH1cclxufSk7XHJcblxyXG4vKipcclxuICogUGluY2hcclxuICogUmVjb2duaXplZCB3aGVuIHR3byBvciBtb3JlIHBvaW50ZXJzIGFyZSBtb3ZpbmcgdG93YXJkICh6b29tLWluKSBvciBhd2F5IGZyb20gZWFjaCBvdGhlciAoem9vbS1vdXQpLlxyXG4gKiBAY29uc3RydWN0b3JcclxuICogQGV4dGVuZHMgQXR0clJlY29nbml6ZXJcclxuICovXHJcbmZ1bmN0aW9uIFBpbmNoUmVjb2duaXplcigpIHtcclxuICAgIEF0dHJSZWNvZ25pemVyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XHJcbn1cclxuXHJcbmluaGVyaXQoUGluY2hSZWNvZ25pemVyLCBBdHRyUmVjb2duaXplciwge1xyXG4gICAgLyoqXHJcbiAgICAgKiBAbmFtZXNwYWNlXHJcbiAgICAgKiBAbWVtYmVyb2YgUGluY2hSZWNvZ25pemVyXHJcbiAgICAgKi9cclxuICAgIGRlZmF1bHRzOiB7XHJcbiAgICAgICAgZXZlbnQ6ICdwaW5jaCcsXHJcbiAgICAgICAgdGhyZXNob2xkOiAwLFxyXG4gICAgICAgIHBvaW50ZXJzOiAyXHJcbiAgICB9LFxyXG5cclxuICAgIGdldFRvdWNoQWN0aW9uOiBmdW5jdGlvbigpIHtcclxuICAgICAgICByZXR1cm4gW1RPVUNIX0FDVElPTl9OT05FXTtcclxuICAgIH0sXHJcblxyXG4gICAgYXR0clRlc3Q6IGZ1bmN0aW9uKGlucHV0KSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3N1cGVyLmF0dHJUZXN0LmNhbGwodGhpcywgaW5wdXQpICYmXHJcbiAgICAgICAgICAgIChNYXRoLmFicyhpbnB1dC5zY2FsZSAtIDEpID4gdGhpcy5vcHRpb25zLnRocmVzaG9sZCB8fCB0aGlzLnN0YXRlICYgU1RBVEVfQkVHQU4pO1xyXG4gICAgfSxcclxuXHJcbiAgICBlbWl0OiBmdW5jdGlvbihpbnB1dCkge1xyXG4gICAgICAgIHRoaXMuX3N1cGVyLmVtaXQuY2FsbCh0aGlzLCBpbnB1dCk7XHJcbiAgICAgICAgaWYgKGlucHV0LnNjYWxlICE9PSAxKSB7XHJcbiAgICAgICAgICAgIHZhciBpbk91dCA9IGlucHV0LnNjYWxlIDwgMSA/ICdpbicgOiAnb3V0JztcclxuICAgICAgICAgICAgdGhpcy5tYW5hZ2VyLmVtaXQodGhpcy5vcHRpb25zLmV2ZW50ICsgaW5PdXQsIGlucHV0KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn0pO1xyXG5cclxuLyoqXHJcbiAqIFByZXNzXHJcbiAqIFJlY29nbml6ZWQgd2hlbiB0aGUgcG9pbnRlciBpcyBkb3duIGZvciB4IG1zIHdpdGhvdXQgYW55IG1vdmVtZW50LlxyXG4gKiBAY29uc3RydWN0b3JcclxuICogQGV4dGVuZHMgUmVjb2duaXplclxyXG4gKi9cclxuZnVuY3Rpb24gUHJlc3NSZWNvZ25pemVyKCkge1xyXG4gICAgUmVjb2duaXplci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xyXG5cclxuICAgIHRoaXMuX3RpbWVyID0gbnVsbDtcclxuICAgIHRoaXMuX2lucHV0ID0gbnVsbDtcclxufVxyXG5cclxuaW5oZXJpdChQcmVzc1JlY29nbml6ZXIsIFJlY29nbml6ZXIsIHtcclxuICAgIC8qKlxyXG4gICAgICogQG5hbWVzcGFjZVxyXG4gICAgICogQG1lbWJlcm9mIFByZXNzUmVjb2duaXplclxyXG4gICAgICovXHJcbiAgICBkZWZhdWx0czoge1xyXG4gICAgICAgIGV2ZW50OiAncHJlc3MnLFxyXG4gICAgICAgIHBvaW50ZXJzOiAxLFxyXG4gICAgICAgIHRpbWU6IDUwMCwgLy8gbWluaW1hbCB0aW1lIG9mIHRoZSBwb2ludGVyIHRvIGJlIHByZXNzZWRcclxuICAgICAgICB0aHJlc2hvbGQ6IDUgLy8gYSBtaW5pbWFsIG1vdmVtZW50IGlzIG9rLCBidXQga2VlcCBpdCBsb3dcclxuICAgIH0sXHJcblxyXG4gICAgZ2V0VG91Y2hBY3Rpb246IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHJldHVybiBbVE9VQ0hfQUNUSU9OX0FVVE9dO1xyXG4gICAgfSxcclxuXHJcbiAgICBwcm9jZXNzOiBmdW5jdGlvbihpbnB1dCkge1xyXG4gICAgICAgIHZhciBvcHRpb25zID0gdGhpcy5vcHRpb25zO1xyXG4gICAgICAgIHZhciB2YWxpZFBvaW50ZXJzID0gaW5wdXQucG9pbnRlcnMubGVuZ3RoID09PSBvcHRpb25zLnBvaW50ZXJzO1xyXG4gICAgICAgIHZhciB2YWxpZE1vdmVtZW50ID0gaW5wdXQuZGlzdGFuY2UgPCBvcHRpb25zLnRocmVzaG9sZDtcclxuICAgICAgICB2YXIgdmFsaWRUaW1lID0gaW5wdXQuZGVsdGFUaW1lID4gb3B0aW9ucy50aW1lO1xyXG5cclxuICAgICAgICB0aGlzLl9pbnB1dCA9IGlucHV0O1xyXG5cclxuICAgICAgICAvLyB3ZSBvbmx5IGFsbG93IGxpdHRsZSBtb3ZlbWVudFxyXG4gICAgICAgIC8vIGFuZCB3ZSd2ZSByZWFjaGVkIGFuIGVuZCBldmVudCwgc28gYSB0YXAgaXMgcG9zc2libGVcclxuICAgICAgICBpZiAoIXZhbGlkTW92ZW1lbnQgfHwgIXZhbGlkUG9pbnRlcnMgfHwgKGlucHV0LmV2ZW50VHlwZSAmIChJTlBVVF9FTkQgfCBJTlBVVF9DQU5DRUwpICYmICF2YWxpZFRpbWUpKSB7XHJcbiAgICAgICAgICAgIHRoaXMucmVzZXQoKTtcclxuICAgICAgICB9IGVsc2UgaWYgKGlucHV0LmV2ZW50VHlwZSAmIElOUFVUX1NUQVJUKSB7XHJcbiAgICAgICAgICAgIHRoaXMucmVzZXQoKTtcclxuICAgICAgICAgICAgdGhpcy5fdGltZXIgPSBzZXRUaW1lb3V0Q29udGV4dChmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuc3RhdGUgPSBTVEFURV9SRUNPR05JWkVEO1xyXG4gICAgICAgICAgICAgICAgdGhpcy50cnlFbWl0KCk7XHJcbiAgICAgICAgICAgIH0sIG9wdGlvbnMudGltZSwgdGhpcyk7XHJcbiAgICAgICAgfSBlbHNlIGlmIChpbnB1dC5ldmVudFR5cGUgJiBJTlBVVF9FTkQpIHtcclxuICAgICAgICAgICAgcmV0dXJuIFNUQVRFX1JFQ09HTklaRUQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBTVEFURV9GQUlMRUQ7XHJcbiAgICB9LFxyXG5cclxuICAgIHJlc2V0OiBmdW5jdGlvbigpIHtcclxuICAgICAgICBjbGVhclRpbWVvdXQodGhpcy5fdGltZXIpO1xyXG4gICAgfSxcclxuXHJcbiAgICBlbWl0OiBmdW5jdGlvbihpbnB1dCkge1xyXG4gICAgICAgIGlmICh0aGlzLnN0YXRlICE9PSBTVEFURV9SRUNPR05JWkVEKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChpbnB1dCAmJiAoaW5wdXQuZXZlbnRUeXBlICYgSU5QVVRfRU5EKSkge1xyXG4gICAgICAgICAgICB0aGlzLm1hbmFnZXIuZW1pdCh0aGlzLm9wdGlvbnMuZXZlbnQgKyAndXAnLCBpbnB1dCk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5faW5wdXQudGltZVN0YW1wID0gbm93KCk7XHJcbiAgICAgICAgICAgIHRoaXMubWFuYWdlci5lbWl0KHRoaXMub3B0aW9ucy5ldmVudCwgdGhpcy5faW5wdXQpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufSk7XHJcblxyXG4vKipcclxuICogUm90YXRlXHJcbiAqIFJlY29nbml6ZWQgd2hlbiB0d28gb3IgbW9yZSBwb2ludGVyIGFyZSBtb3ZpbmcgaW4gYSBjaXJjdWxhciBtb3Rpb24uXHJcbiAqIEBjb25zdHJ1Y3RvclxyXG4gKiBAZXh0ZW5kcyBBdHRyUmVjb2duaXplclxyXG4gKi9cclxuZnVuY3Rpb24gUm90YXRlUmVjb2duaXplcigpIHtcclxuICAgIEF0dHJSZWNvZ25pemVyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XHJcbn1cclxuXHJcbmluaGVyaXQoUm90YXRlUmVjb2duaXplciwgQXR0clJlY29nbml6ZXIsIHtcclxuICAgIC8qKlxyXG4gICAgICogQG5hbWVzcGFjZVxyXG4gICAgICogQG1lbWJlcm9mIFJvdGF0ZVJlY29nbml6ZXJcclxuICAgICAqL1xyXG4gICAgZGVmYXVsdHM6IHtcclxuICAgICAgICBldmVudDogJ3JvdGF0ZScsXHJcbiAgICAgICAgdGhyZXNob2xkOiAwLFxyXG4gICAgICAgIHBvaW50ZXJzOiAyXHJcbiAgICB9LFxyXG5cclxuICAgIGdldFRvdWNoQWN0aW9uOiBmdW5jdGlvbigpIHtcclxuICAgICAgICByZXR1cm4gW1RPVUNIX0FDVElPTl9OT05FXTtcclxuICAgIH0sXHJcblxyXG4gICAgYXR0clRlc3Q6IGZ1bmN0aW9uKGlucHV0KSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3N1cGVyLmF0dHJUZXN0LmNhbGwodGhpcywgaW5wdXQpICYmXHJcbiAgICAgICAgICAgIChNYXRoLmFicyhpbnB1dC5yb3RhdGlvbikgPiB0aGlzLm9wdGlvbnMudGhyZXNob2xkIHx8IHRoaXMuc3RhdGUgJiBTVEFURV9CRUdBTik7XHJcbiAgICB9XHJcbn0pO1xyXG5cclxuLyoqXHJcbiAqIFN3aXBlXHJcbiAqIFJlY29nbml6ZWQgd2hlbiB0aGUgcG9pbnRlciBpcyBtb3ZpbmcgZmFzdCAodmVsb2NpdHkpLCB3aXRoIGVub3VnaCBkaXN0YW5jZSBpbiB0aGUgYWxsb3dlZCBkaXJlY3Rpb24uXHJcbiAqIEBjb25zdHJ1Y3RvclxyXG4gKiBAZXh0ZW5kcyBBdHRyUmVjb2duaXplclxyXG4gKi9cclxuZnVuY3Rpb24gU3dpcGVSZWNvZ25pemVyKCkge1xyXG4gICAgQXR0clJlY29nbml6ZXIuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcclxufVxyXG5cclxuaW5oZXJpdChTd2lwZVJlY29nbml6ZXIsIEF0dHJSZWNvZ25pemVyLCB7XHJcbiAgICAvKipcclxuICAgICAqIEBuYW1lc3BhY2VcclxuICAgICAqIEBtZW1iZXJvZiBTd2lwZVJlY29nbml6ZXJcclxuICAgICAqL1xyXG4gICAgZGVmYXVsdHM6IHtcclxuICAgICAgICBldmVudDogJ3N3aXBlJyxcclxuICAgICAgICB0aHJlc2hvbGQ6IDEwLFxyXG4gICAgICAgIHZlbG9jaXR5OiAwLjY1LFxyXG4gICAgICAgIGRpcmVjdGlvbjogRElSRUNUSU9OX0hPUklaT05UQUwgfCBESVJFQ1RJT05fVkVSVElDQUwsXHJcbiAgICAgICAgcG9pbnRlcnM6IDFcclxuICAgIH0sXHJcblxyXG4gICAgZ2V0VG91Y2hBY3Rpb246IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHJldHVybiBQYW5SZWNvZ25pemVyLnByb3RvdHlwZS5nZXRUb3VjaEFjdGlvbi5jYWxsKHRoaXMpO1xyXG4gICAgfSxcclxuXHJcbiAgICBhdHRyVGVzdDogZnVuY3Rpb24oaW5wdXQpIHtcclxuICAgICAgICB2YXIgZGlyZWN0aW9uID0gdGhpcy5vcHRpb25zLmRpcmVjdGlvbjtcclxuICAgICAgICB2YXIgdmVsb2NpdHk7XHJcblxyXG4gICAgICAgIGlmIChkaXJlY3Rpb24gJiAoRElSRUNUSU9OX0hPUklaT05UQUwgfCBESVJFQ1RJT05fVkVSVElDQUwpKSB7XHJcbiAgICAgICAgICAgIHZlbG9jaXR5ID0gaW5wdXQudmVsb2NpdHk7XHJcbiAgICAgICAgfSBlbHNlIGlmIChkaXJlY3Rpb24gJiBESVJFQ1RJT05fSE9SSVpPTlRBTCkge1xyXG4gICAgICAgICAgICB2ZWxvY2l0eSA9IGlucHV0LnZlbG9jaXR5WDtcclxuICAgICAgICB9IGVsc2UgaWYgKGRpcmVjdGlvbiAmIERJUkVDVElPTl9WRVJUSUNBTCkge1xyXG4gICAgICAgICAgICB2ZWxvY2l0eSA9IGlucHV0LnZlbG9jaXR5WTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzLl9zdXBlci5hdHRyVGVzdC5jYWxsKHRoaXMsIGlucHV0KSAmJlxyXG4gICAgICAgICAgICBkaXJlY3Rpb24gJiBpbnB1dC5kaXJlY3Rpb24gJiZcclxuICAgICAgICAgICAgaW5wdXQuZGlzdGFuY2UgPiB0aGlzLm9wdGlvbnMudGhyZXNob2xkICYmXHJcbiAgICAgICAgICAgIGFicyh2ZWxvY2l0eSkgPiB0aGlzLm9wdGlvbnMudmVsb2NpdHkgJiYgaW5wdXQuZXZlbnRUeXBlICYgSU5QVVRfRU5EO1xyXG4gICAgfSxcclxuXHJcbiAgICBlbWl0OiBmdW5jdGlvbihpbnB1dCkge1xyXG4gICAgICAgIHZhciBkaXJlY3Rpb24gPSBkaXJlY3Rpb25TdHIoaW5wdXQuZGlyZWN0aW9uKTtcclxuICAgICAgICBpZiAoZGlyZWN0aW9uKSB7XHJcbiAgICAgICAgICAgIHRoaXMubWFuYWdlci5lbWl0KHRoaXMub3B0aW9ucy5ldmVudCArIGRpcmVjdGlvbiwgaW5wdXQpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5tYW5hZ2VyLmVtaXQodGhpcy5vcHRpb25zLmV2ZW50LCBpbnB1dCk7XHJcbiAgICB9XHJcbn0pO1xyXG5cclxuLyoqXHJcbiAqIEEgdGFwIGlzIGVjb2duaXplZCB3aGVuIHRoZSBwb2ludGVyIGlzIGRvaW5nIGEgc21hbGwgdGFwL2NsaWNrLiBNdWx0aXBsZSB0YXBzIGFyZSByZWNvZ25pemVkIGlmIHRoZXkgb2NjdXJcclxuICogYmV0d2VlbiB0aGUgZ2l2ZW4gaW50ZXJ2YWwgYW5kIHBvc2l0aW9uLiBUaGUgZGVsYXkgb3B0aW9uIGNhbiBiZSB1c2VkIHRvIHJlY29nbml6ZSBtdWx0aS10YXBzIHdpdGhvdXQgZmlyaW5nXHJcbiAqIGEgc2luZ2xlIHRhcC5cclxuICpcclxuICogVGhlIGV2ZW50RGF0YSBmcm9tIHRoZSBlbWl0dGVkIGV2ZW50IGNvbnRhaW5zIHRoZSBwcm9wZXJ0eSBgdGFwQ291bnRgLCB3aGljaCBjb250YWlucyB0aGUgYW1vdW50IG9mXHJcbiAqIG11bHRpLXRhcHMgYmVpbmcgcmVjb2duaXplZC5cclxuICogQGNvbnN0cnVjdG9yXHJcbiAqIEBleHRlbmRzIFJlY29nbml6ZXJcclxuICovXHJcbmZ1bmN0aW9uIFRhcFJlY29nbml6ZXIoKSB7XHJcbiAgICBSZWNvZ25pemVyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XHJcblxyXG4gICAgLy8gcHJldmlvdXMgdGltZSBhbmQgY2VudGVyLFxyXG4gICAgLy8gdXNlZCBmb3IgdGFwIGNvdW50aW5nXHJcbiAgICB0aGlzLnBUaW1lID0gZmFsc2U7XHJcbiAgICB0aGlzLnBDZW50ZXIgPSBmYWxzZTtcclxuXHJcbiAgICB0aGlzLl90aW1lciA9IG51bGw7XHJcbiAgICB0aGlzLl9pbnB1dCA9IG51bGw7XHJcbiAgICB0aGlzLmNvdW50ID0gMDtcclxufVxyXG5cclxuaW5oZXJpdChUYXBSZWNvZ25pemVyLCBSZWNvZ25pemVyLCB7XHJcbiAgICAvKipcclxuICAgICAqIEBuYW1lc3BhY2VcclxuICAgICAqIEBtZW1iZXJvZiBQaW5jaFJlY29nbml6ZXJcclxuICAgICAqL1xyXG4gICAgZGVmYXVsdHM6IHtcclxuICAgICAgICBldmVudDogJ3RhcCcsXHJcbiAgICAgICAgcG9pbnRlcnM6IDEsXHJcbiAgICAgICAgdGFwczogMSxcclxuICAgICAgICBpbnRlcnZhbDogMzAwLCAvLyBtYXggdGltZSBiZXR3ZWVuIHRoZSBtdWx0aS10YXAgdGFwc1xyXG4gICAgICAgIHRpbWU6IDI1MCwgLy8gbWF4IHRpbWUgb2YgdGhlIHBvaW50ZXIgdG8gYmUgZG93biAobGlrZSBmaW5nZXIgb24gdGhlIHNjcmVlbilcclxuICAgICAgICB0aHJlc2hvbGQ6IDIsIC8vIGEgbWluaW1hbCBtb3ZlbWVudCBpcyBvaywgYnV0IGtlZXAgaXQgbG93XHJcbiAgICAgICAgcG9zVGhyZXNob2xkOiAxMCAvLyBhIG11bHRpLXRhcCBjYW4gYmUgYSBiaXQgb2ZmIHRoZSBpbml0aWFsIHBvc2l0aW9uXHJcbiAgICB9LFxyXG5cclxuICAgIGdldFRvdWNoQWN0aW9uOiBmdW5jdGlvbigpIHtcclxuICAgICAgICByZXR1cm4gW1RPVUNIX0FDVElPTl9NQU5JUFVMQVRJT05dO1xyXG4gICAgfSxcclxuXHJcbiAgICBwcm9jZXNzOiBmdW5jdGlvbihpbnB1dCkge1xyXG4gICAgICAgIHZhciBvcHRpb25zID0gdGhpcy5vcHRpb25zO1xyXG5cclxuICAgICAgICB2YXIgdmFsaWRQb2ludGVycyA9IGlucHV0LnBvaW50ZXJzLmxlbmd0aCA9PT0gb3B0aW9ucy5wb2ludGVycztcclxuICAgICAgICB2YXIgdmFsaWRNb3ZlbWVudCA9IGlucHV0LmRpc3RhbmNlIDwgb3B0aW9ucy50aHJlc2hvbGQ7XHJcbiAgICAgICAgdmFyIHZhbGlkVG91Y2hUaW1lID0gaW5wdXQuZGVsdGFUaW1lIDwgb3B0aW9ucy50aW1lO1xyXG5cclxuICAgICAgICB0aGlzLnJlc2V0KCk7XHJcblxyXG4gICAgICAgIGlmICgoaW5wdXQuZXZlbnRUeXBlICYgSU5QVVRfU1RBUlQpICYmICh0aGlzLmNvdW50ID09PSAwKSkge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5mYWlsVGltZW91dCgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gd2Ugb25seSBhbGxvdyBsaXR0bGUgbW92ZW1lbnRcclxuICAgICAgICAvLyBhbmQgd2UndmUgcmVhY2hlZCBhbiBlbmQgZXZlbnQsIHNvIGEgdGFwIGlzIHBvc3NpYmxlXHJcbiAgICAgICAgaWYgKHZhbGlkTW92ZW1lbnQgJiYgdmFsaWRUb3VjaFRpbWUgJiYgdmFsaWRQb2ludGVycykge1xyXG4gICAgICAgICAgICBpZiAoaW5wdXQuZXZlbnRUeXBlICE9IElOUFVUX0VORCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuZmFpbFRpbWVvdXQoKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgdmFyIHZhbGlkSW50ZXJ2YWwgPSB0aGlzLnBUaW1lID8gKGlucHV0LnRpbWVTdGFtcCAtIHRoaXMucFRpbWUgPCBvcHRpb25zLmludGVydmFsKSA6IHRydWU7XHJcbiAgICAgICAgICAgIHZhciB2YWxpZE11bHRpVGFwID0gIXRoaXMucENlbnRlciB8fCBnZXREaXN0YW5jZSh0aGlzLnBDZW50ZXIsIGlucHV0LmNlbnRlcikgPCBvcHRpb25zLnBvc1RocmVzaG9sZDtcclxuXHJcbiAgICAgICAgICAgIHRoaXMucFRpbWUgPSBpbnB1dC50aW1lU3RhbXA7XHJcbiAgICAgICAgICAgIHRoaXMucENlbnRlciA9IGlucHV0LmNlbnRlcjtcclxuXHJcbiAgICAgICAgICAgIGlmICghdmFsaWRNdWx0aVRhcCB8fCAhdmFsaWRJbnRlcnZhbCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jb3VudCA9IDE7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNvdW50ICs9IDE7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHRoaXMuX2lucHV0ID0gaW5wdXQ7XHJcblxyXG4gICAgICAgICAgICAvLyBpZiB0YXAgY291bnQgbWF0Y2hlcyB3ZSBoYXZlIHJlY29nbml6ZWQgaXQsXHJcbiAgICAgICAgICAgIC8vIGVsc2UgaXQgaGFzIGJlZ2FuIHJlY29nbml6aW5nLi4uXHJcbiAgICAgICAgICAgIHZhciB0YXBDb3VudCA9IHRoaXMuY291bnQgJSBvcHRpb25zLnRhcHM7XHJcbiAgICAgICAgICAgIGlmICh0YXBDb3VudCA9PT0gMCkge1xyXG4gICAgICAgICAgICAgICAgLy8gbm8gZmFpbGluZyByZXF1aXJlbWVudHMsIGltbWVkaWF0ZWx5IHRyaWdnZXIgdGhlIHRhcCBldmVudFxyXG4gICAgICAgICAgICAgICAgLy8gb3Igd2FpdCBhcyBsb25nIGFzIHRoZSBtdWx0aXRhcCBpbnRlcnZhbCB0byB0cmlnZ2VyXHJcbiAgICAgICAgICAgICAgICBpZiAoIXRoaXMuaGFzUmVxdWlyZUZhaWx1cmVzKCkpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gU1RBVEVfUkVDT0dOSVpFRDtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fdGltZXIgPSBzZXRUaW1lb3V0Q29udGV4dChmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zdGF0ZSA9IFNUQVRFX1JFQ09HTklaRUQ7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudHJ5RW1pdCgpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0sIG9wdGlvbnMuaW50ZXJ2YWwsIHRoaXMpO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBTVEFURV9CRUdBTjtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gU1RBVEVfRkFJTEVEO1xyXG4gICAgfSxcclxuXHJcbiAgICBmYWlsVGltZW91dDogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgdGhpcy5fdGltZXIgPSBzZXRUaW1lb3V0Q29udGV4dChmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgdGhpcy5zdGF0ZSA9IFNUQVRFX0ZBSUxFRDtcclxuICAgICAgICB9LCB0aGlzLm9wdGlvbnMuaW50ZXJ2YWwsIHRoaXMpO1xyXG4gICAgICAgIHJldHVybiBTVEFURV9GQUlMRUQ7XHJcbiAgICB9LFxyXG5cclxuICAgIHJlc2V0OiBmdW5jdGlvbigpIHtcclxuICAgICAgICBjbGVhclRpbWVvdXQodGhpcy5fdGltZXIpO1xyXG4gICAgfSxcclxuXHJcbiAgICBlbWl0OiBmdW5jdGlvbigpIHtcclxuICAgICAgICBpZiAodGhpcy5zdGF0ZSA9PSBTVEFURV9SRUNPR05JWkVEICkge1xyXG4gICAgICAgICAgICB0aGlzLl9pbnB1dC50YXBDb3VudCA9IHRoaXMuY291bnQ7XHJcbiAgICAgICAgICAgIHRoaXMubWFuYWdlci5lbWl0KHRoaXMub3B0aW9ucy5ldmVudCwgdGhpcy5faW5wdXQpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufSk7XHJcblxyXG4vKipcclxuICogU2ltcGxlIHdheSB0byBjcmVhdGUgYW4gbWFuYWdlciB3aXRoIGEgZGVmYXVsdCBzZXQgb2YgcmVjb2duaXplcnMuXHJcbiAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGVsZW1lbnRcclxuICogQHBhcmFtIHtPYmplY3R9IFtvcHRpb25zXVxyXG4gKiBAY29uc3RydWN0b3JcclxuICovXHJcbmZ1bmN0aW9uIEhhbW1lcihlbGVtZW50LCBvcHRpb25zKSB7XHJcbiAgICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcclxuICAgIG9wdGlvbnMucmVjb2duaXplcnMgPSBpZlVuZGVmaW5lZChvcHRpb25zLnJlY29nbml6ZXJzLCBIYW1tZXIuZGVmYXVsdHMucHJlc2V0KTtcclxuICAgIHJldHVybiBuZXcgTWFuYWdlcihlbGVtZW50LCBvcHRpb25zKTtcclxufVxyXG5cclxuLyoqXHJcbiAqIEBjb25zdCB7c3RyaW5nfVxyXG4gKi9cclxuSGFtbWVyLlZFUlNJT04gPSAnMi4wLjQnO1xyXG5cclxuLyoqXHJcbiAqIGRlZmF1bHQgc2V0dGluZ3NcclxuICogQG5hbWVzcGFjZVxyXG4gKi9cclxuSGFtbWVyLmRlZmF1bHRzID0ge1xyXG4gICAgLyoqXHJcbiAgICAgKiBzZXQgaWYgRE9NIGV2ZW50cyBhcmUgYmVpbmcgdHJpZ2dlcmVkLlxyXG4gICAgICogQnV0IHRoaXMgaXMgc2xvd2VyIGFuZCB1bnVzZWQgYnkgc2ltcGxlIGltcGxlbWVudGF0aW9ucywgc28gZGlzYWJsZWQgYnkgZGVmYXVsdC5cclxuICAgICAqIEB0eXBlIHtCb29sZWFufVxyXG4gICAgICogQGRlZmF1bHQgZmFsc2VcclxuICAgICAqL1xyXG4gICAgZG9tRXZlbnRzOiBmYWxzZSxcclxuXHJcbiAgICAvKipcclxuICAgICAqIFRoZSB2YWx1ZSBmb3IgdGhlIHRvdWNoQWN0aW9uIHByb3BlcnR5L2ZhbGxiYWNrLlxyXG4gICAgICogV2hlbiBzZXQgdG8gYGNvbXB1dGVgIGl0IHdpbGwgbWFnaWNhbGx5IHNldCB0aGUgY29ycmVjdCB2YWx1ZSBiYXNlZCBvbiB0aGUgYWRkZWQgcmVjb2duaXplcnMuXHJcbiAgICAgKiBAdHlwZSB7U3RyaW5nfVxyXG4gICAgICogQGRlZmF1bHQgY29tcHV0ZVxyXG4gICAgICovXHJcbiAgICB0b3VjaEFjdGlvbjogVE9VQ0hfQUNUSU9OX0NPTVBVVEUsXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAdHlwZSB7Qm9vbGVhbn1cclxuICAgICAqIEBkZWZhdWx0IHRydWVcclxuICAgICAqL1xyXG4gICAgZW5hYmxlOiB0cnVlLFxyXG5cclxuICAgIC8qKlxyXG4gICAgICogRVhQRVJJTUVOVEFMIEZFQVRVUkUgLS0gY2FuIGJlIHJlbW92ZWQvY2hhbmdlZFxyXG4gICAgICogQ2hhbmdlIHRoZSBwYXJlbnQgaW5wdXQgdGFyZ2V0IGVsZW1lbnQuXHJcbiAgICAgKiBJZiBOdWxsLCB0aGVuIGl0IGlzIGJlaW5nIHNldCB0aGUgdG8gbWFpbiBlbGVtZW50LlxyXG4gICAgICogQHR5cGUge051bGx8RXZlbnRUYXJnZXR9XHJcbiAgICAgKiBAZGVmYXVsdCBudWxsXHJcbiAgICAgKi9cclxuICAgIGlucHV0VGFyZ2V0OiBudWxsLFxyXG5cclxuICAgIC8qKlxyXG4gICAgICogZm9yY2UgYW4gaW5wdXQgY2xhc3NcclxuICAgICAqIEB0eXBlIHtOdWxsfEZ1bmN0aW9ufVxyXG4gICAgICogQGRlZmF1bHQgbnVsbFxyXG4gICAgICovXHJcbiAgICBpbnB1dENsYXNzOiBudWxsLFxyXG5cclxuICAgIC8qKlxyXG4gICAgICogRGVmYXVsdCByZWNvZ25pemVyIHNldHVwIHdoZW4gY2FsbGluZyBgSGFtbWVyKClgXHJcbiAgICAgKiBXaGVuIGNyZWF0aW5nIGEgbmV3IE1hbmFnZXIgdGhlc2Ugd2lsbCBiZSBza2lwcGVkLlxyXG4gICAgICogQHR5cGUge0FycmF5fVxyXG4gICAgICovXHJcbiAgICBwcmVzZXQ6IFtcclxuICAgICAgICAvLyBSZWNvZ25pemVyQ2xhc3MsIG9wdGlvbnMsIFtyZWNvZ25pemVXaXRoLCAuLi5dLCBbcmVxdWlyZUZhaWx1cmUsIC4uLl1cclxuICAgICAgICBbUm90YXRlUmVjb2duaXplciwgeyBlbmFibGU6IGZhbHNlIH1dLFxyXG4gICAgICAgIFtQaW5jaFJlY29nbml6ZXIsIHsgZW5hYmxlOiBmYWxzZSB9LCBbJ3JvdGF0ZSddXSxcclxuICAgICAgICBbU3dpcGVSZWNvZ25pemVyLHsgZGlyZWN0aW9uOiBESVJFQ1RJT05fSE9SSVpPTlRBTCB9XSxcclxuICAgICAgICBbUGFuUmVjb2duaXplciwgeyBkaXJlY3Rpb246IERJUkVDVElPTl9IT1JJWk9OVEFMIH0sIFsnc3dpcGUnXV0sXHJcbiAgICAgICAgW1RhcFJlY29nbml6ZXJdLFxyXG4gICAgICAgIFtUYXBSZWNvZ25pemVyLCB7IGV2ZW50OiAnZG91YmxldGFwJywgdGFwczogMiB9LCBbJ3RhcCddXSxcclxuICAgICAgICBbUHJlc3NSZWNvZ25pemVyXVxyXG4gICAgXSxcclxuXHJcbiAgICAvKipcclxuICAgICAqIFNvbWUgQ1NTIHByb3BlcnRpZXMgY2FuIGJlIHVzZWQgdG8gaW1wcm92ZSB0aGUgd29ya2luZyBvZiBIYW1tZXIuXHJcbiAgICAgKiBBZGQgdGhlbSB0byB0aGlzIG1ldGhvZCBhbmQgdGhleSB3aWxsIGJlIHNldCB3aGVuIGNyZWF0aW5nIGEgbmV3IE1hbmFnZXIuXHJcbiAgICAgKiBAbmFtZXNwYWNlXHJcbiAgICAgKi9cclxuICAgIGNzc1Byb3BzOiB7XHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogRGlzYWJsZXMgdGV4dCBzZWxlY3Rpb24gdG8gaW1wcm92ZSB0aGUgZHJhZ2dpbmcgZ2VzdHVyZS4gTWFpbmx5IGZvciBkZXNrdG9wIGJyb3dzZXJzLlxyXG4gICAgICAgICAqIEB0eXBlIHtTdHJpbmd9XHJcbiAgICAgICAgICogQGRlZmF1bHQgJ25vbmUnXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgdXNlclNlbGVjdDogJ25vbmUnLFxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBEaXNhYmxlIHRoZSBXaW5kb3dzIFBob25lIGdyaXBwZXJzIHdoZW4gcHJlc3NpbmcgYW4gZWxlbWVudC5cclxuICAgICAgICAgKiBAdHlwZSB7U3RyaW5nfVxyXG4gICAgICAgICAqIEBkZWZhdWx0ICdub25lJ1xyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHRvdWNoU2VsZWN0OiAnbm9uZScsXHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIERpc2FibGVzIHRoZSBkZWZhdWx0IGNhbGxvdXQgc2hvd24gd2hlbiB5b3UgdG91Y2ggYW5kIGhvbGQgYSB0b3VjaCB0YXJnZXQuXHJcbiAgICAgICAgICogT24gaU9TLCB3aGVuIHlvdSB0b3VjaCBhbmQgaG9sZCBhIHRvdWNoIHRhcmdldCBzdWNoIGFzIGEgbGluaywgU2FmYXJpIGRpc3BsYXlzXHJcbiAgICAgICAgICogYSBjYWxsb3V0IGNvbnRhaW5pbmcgaW5mb3JtYXRpb24gYWJvdXQgdGhlIGxpbmsuIFRoaXMgcHJvcGVydHkgYWxsb3dzIHlvdSB0byBkaXNhYmxlIHRoYXQgY2FsbG91dC5cclxuICAgICAgICAgKiBAdHlwZSB7U3RyaW5nfVxyXG4gICAgICAgICAqIEBkZWZhdWx0ICdub25lJ1xyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHRvdWNoQ2FsbG91dDogJ25vbmUnLFxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBTcGVjaWZpZXMgd2hldGhlciB6b29taW5nIGlzIGVuYWJsZWQuIFVzZWQgYnkgSUUxMD5cclxuICAgICAgICAgKiBAdHlwZSB7U3RyaW5nfVxyXG4gICAgICAgICAqIEBkZWZhdWx0ICdub25lJ1xyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGNvbnRlbnRab29taW5nOiAnbm9uZScsXHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIFNwZWNpZmllcyB0aGF0IGFuIGVudGlyZSBlbGVtZW50IHNob3VsZCBiZSBkcmFnZ2FibGUgaW5zdGVhZCBvZiBpdHMgY29udGVudHMuIE1haW5seSBmb3IgZGVza3RvcCBicm93c2Vycy5cclxuICAgICAgICAgKiBAdHlwZSB7U3RyaW5nfVxyXG4gICAgICAgICAqIEBkZWZhdWx0ICdub25lJ1xyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHVzZXJEcmFnOiAnbm9uZScsXHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIE92ZXJyaWRlcyB0aGUgaGlnaGxpZ2h0IGNvbG9yIHNob3duIHdoZW4gdGhlIHVzZXIgdGFwcyBhIGxpbmsgb3IgYSBKYXZhU2NyaXB0XHJcbiAgICAgICAgICogY2xpY2thYmxlIGVsZW1lbnQgaW4gaU9TLiBUaGlzIHByb3BlcnR5IG9iZXlzIHRoZSBhbHBoYSB2YWx1ZSwgaWYgc3BlY2lmaWVkLlxyXG4gICAgICAgICAqIEB0eXBlIHtTdHJpbmd9XHJcbiAgICAgICAgICogQGRlZmF1bHQgJ3JnYmEoMCwwLDAsMCknXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgdGFwSGlnaGxpZ2h0Q29sb3I6ICdyZ2JhKDAsMCwwLDApJ1xyXG4gICAgfVxyXG59O1xyXG5cclxudmFyIFNUT1AgPSAxO1xyXG52YXIgRk9SQ0VEX1NUT1AgPSAyO1xyXG5cclxuLyoqXHJcbiAqIE1hbmFnZXJcclxuICogQHBhcmFtIHtIVE1MRWxlbWVudH0gZWxlbWVudFxyXG4gKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbnNdXHJcbiAqIEBjb25zdHJ1Y3RvclxyXG4gKi9cclxuZnVuY3Rpb24gTWFuYWdlcihlbGVtZW50LCBvcHRpb25zKSB7XHJcbiAgICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcclxuXHJcbiAgICB0aGlzLm9wdGlvbnMgPSBtZXJnZShvcHRpb25zLCBIYW1tZXIuZGVmYXVsdHMpO1xyXG4gICAgdGhpcy5vcHRpb25zLmlucHV0VGFyZ2V0ID0gdGhpcy5vcHRpb25zLmlucHV0VGFyZ2V0IHx8IGVsZW1lbnQ7XHJcblxyXG4gICAgdGhpcy5oYW5kbGVycyA9IHt9O1xyXG4gICAgdGhpcy5zZXNzaW9uID0ge307XHJcbiAgICB0aGlzLnJlY29nbml6ZXJzID0gW107XHJcblxyXG4gICAgdGhpcy5lbGVtZW50ID0gZWxlbWVudDtcclxuICAgIHRoaXMuaW5wdXQgPSBjcmVhdGVJbnB1dEluc3RhbmNlKHRoaXMpO1xyXG4gICAgdGhpcy50b3VjaEFjdGlvbiA9IG5ldyBUb3VjaEFjdGlvbih0aGlzLCB0aGlzLm9wdGlvbnMudG91Y2hBY3Rpb24pO1xyXG5cclxuICAgIHRvZ2dsZUNzc1Byb3BzKHRoaXMsIHRydWUpO1xyXG5cclxuICAgIGVhY2gob3B0aW9ucy5yZWNvZ25pemVycywgZnVuY3Rpb24oaXRlbSkge1xyXG4gICAgICAgIHZhciByZWNvZ25pemVyID0gdGhpcy5hZGQobmV3IChpdGVtWzBdKShpdGVtWzFdKSk7XHJcbiAgICAgICAgaXRlbVsyXSAmJiByZWNvZ25pemVyLnJlY29nbml6ZVdpdGgoaXRlbVsyXSk7XHJcbiAgICAgICAgaXRlbVszXSAmJiByZWNvZ25pemVyLnJlcXVpcmVGYWlsdXJlKGl0ZW1bM10pO1xyXG4gICAgfSwgdGhpcyk7XHJcbn1cclxuXHJcbk1hbmFnZXIucHJvdG90eXBlID0ge1xyXG4gICAgLyoqXHJcbiAgICAgKiBzZXQgb3B0aW9uc1xyXG4gICAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnNcclxuICAgICAqIEByZXR1cm5zIHtNYW5hZ2VyfVxyXG4gICAgICovXHJcbiAgICBzZXQ6IGZ1bmN0aW9uKG9wdGlvbnMpIHtcclxuICAgICAgICBleHRlbmQodGhpcy5vcHRpb25zLCBvcHRpb25zKTtcclxuXHJcbiAgICAgICAgLy8gT3B0aW9ucyB0aGF0IG5lZWQgYSBsaXR0bGUgbW9yZSBzZXR1cFxyXG4gICAgICAgIGlmIChvcHRpb25zLnRvdWNoQWN0aW9uKSB7XHJcbiAgICAgICAgICAgIHRoaXMudG91Y2hBY3Rpb24udXBkYXRlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChvcHRpb25zLmlucHV0VGFyZ2V0KSB7XHJcbiAgICAgICAgICAgIC8vIENsZWFuIHVwIGV4aXN0aW5nIGV2ZW50IGxpc3RlbmVycyBhbmQgcmVpbml0aWFsaXplXHJcbiAgICAgICAgICAgIHRoaXMuaW5wdXQuZGVzdHJveSgpO1xyXG4gICAgICAgICAgICB0aGlzLmlucHV0LnRhcmdldCA9IG9wdGlvbnMuaW5wdXRUYXJnZXQ7XHJcbiAgICAgICAgICAgIHRoaXMuaW5wdXQuaW5pdCgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH0sXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBzdG9wIHJlY29nbml6aW5nIGZvciB0aGlzIHNlc3Npb24uXHJcbiAgICAgKiBUaGlzIHNlc3Npb24gd2lsbCBiZSBkaXNjYXJkZWQsIHdoZW4gYSBuZXcgW2lucHV0XXN0YXJ0IGV2ZW50IGlzIGZpcmVkLlxyXG4gICAgICogV2hlbiBmb3JjZWQsIHRoZSByZWNvZ25pemVyIGN5Y2xlIGlzIHN0b3BwZWQgaW1tZWRpYXRlbHkuXHJcbiAgICAgKiBAcGFyYW0ge0Jvb2xlYW59IFtmb3JjZV1cclxuICAgICAqL1xyXG4gICAgc3RvcDogZnVuY3Rpb24oZm9yY2UpIHtcclxuICAgICAgICB0aGlzLnNlc3Npb24uc3RvcHBlZCA9IGZvcmNlID8gRk9SQ0VEX1NUT1AgOiBTVE9QO1xyXG4gICAgfSxcclxuXHJcbiAgICAvKipcclxuICAgICAqIHJ1biB0aGUgcmVjb2duaXplcnMhXHJcbiAgICAgKiBjYWxsZWQgYnkgdGhlIGlucHV0SGFuZGxlciBmdW5jdGlvbiBvbiBldmVyeSBtb3ZlbWVudCBvZiB0aGUgcG9pbnRlcnMgKHRvdWNoZXMpXHJcbiAgICAgKiBpdCB3YWxrcyB0aHJvdWdoIGFsbCB0aGUgcmVjb2duaXplcnMgYW5kIHRyaWVzIHRvIGRldGVjdCB0aGUgZ2VzdHVyZSB0aGF0IGlzIGJlaW5nIG1hZGVcclxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBpbnB1dERhdGFcclxuICAgICAqL1xyXG4gICAgcmVjb2duaXplOiBmdW5jdGlvbihpbnB1dERhdGEpIHtcclxuICAgICAgICB2YXIgc2Vzc2lvbiA9IHRoaXMuc2Vzc2lvbjtcclxuICAgICAgICBpZiAoc2Vzc2lvbi5zdG9wcGVkKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIHJ1biB0aGUgdG91Y2gtYWN0aW9uIHBvbHlmaWxsXHJcbiAgICAgICAgdGhpcy50b3VjaEFjdGlvbi5wcmV2ZW50RGVmYXVsdHMoaW5wdXREYXRhKTtcclxuXHJcbiAgICAgICAgdmFyIHJlY29nbml6ZXI7XHJcbiAgICAgICAgdmFyIHJlY29nbml6ZXJzID0gdGhpcy5yZWNvZ25pemVycztcclxuXHJcbiAgICAgICAgLy8gdGhpcyBob2xkcyB0aGUgcmVjb2duaXplciB0aGF0IGlzIGJlaW5nIHJlY29nbml6ZWQuXHJcbiAgICAgICAgLy8gc28gdGhlIHJlY29nbml6ZXIncyBzdGF0ZSBuZWVkcyB0byBiZSBCRUdBTiwgQ0hBTkdFRCwgRU5ERUQgb3IgUkVDT0dOSVpFRFxyXG4gICAgICAgIC8vIGlmIG5vIHJlY29nbml6ZXIgaXMgZGV0ZWN0aW5nIGEgdGhpbmcsIGl0IGlzIHNldCB0byBgbnVsbGBcclxuICAgICAgICB2YXIgY3VyUmVjb2duaXplciA9IHNlc3Npb24uY3VyUmVjb2duaXplcjtcclxuXHJcbiAgICAgICAgLy8gcmVzZXQgd2hlbiB0aGUgbGFzdCByZWNvZ25pemVyIGlzIHJlY29nbml6ZWRcclxuICAgICAgICAvLyBvciB3aGVuIHdlJ3JlIGluIGEgbmV3IHNlc3Npb25cclxuICAgICAgICBpZiAoIWN1clJlY29nbml6ZXIgfHwgKGN1clJlY29nbml6ZXIgJiYgY3VyUmVjb2duaXplci5zdGF0ZSAmIFNUQVRFX1JFQ09HTklaRUQpKSB7XHJcbiAgICAgICAgICAgIGN1clJlY29nbml6ZXIgPSBzZXNzaW9uLmN1clJlY29nbml6ZXIgPSBudWxsO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdmFyIGkgPSAwO1xyXG4gICAgICAgIHdoaWxlIChpIDwgcmVjb2duaXplcnMubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgIHJlY29nbml6ZXIgPSByZWNvZ25pemVyc1tpXTtcclxuXHJcbiAgICAgICAgICAgIC8vIGZpbmQgb3V0IGlmIHdlIGFyZSBhbGxvd2VkIHRyeSB0byByZWNvZ25pemUgdGhlIGlucHV0IGZvciB0aGlzIG9uZS5cclxuICAgICAgICAgICAgLy8gMS4gICBhbGxvdyBpZiB0aGUgc2Vzc2lvbiBpcyBOT1QgZm9yY2VkIHN0b3BwZWQgKHNlZSB0aGUgLnN0b3AoKSBtZXRob2QpXHJcbiAgICAgICAgICAgIC8vIDIuICAgYWxsb3cgaWYgd2Ugc3RpbGwgaGF2ZW4ndCByZWNvZ25pemVkIGEgZ2VzdHVyZSBpbiB0aGlzIHNlc3Npb24sIG9yIHRoZSB0aGlzIHJlY29nbml6ZXIgaXMgdGhlIG9uZVxyXG4gICAgICAgICAgICAvLyAgICAgIHRoYXQgaXMgYmVpbmcgcmVjb2duaXplZC5cclxuICAgICAgICAgICAgLy8gMy4gICBhbGxvdyBpZiB0aGUgcmVjb2duaXplciBpcyBhbGxvd2VkIHRvIHJ1biBzaW11bHRhbmVvdXMgd2l0aCB0aGUgY3VycmVudCByZWNvZ25pemVkIHJlY29nbml6ZXIuXHJcbiAgICAgICAgICAgIC8vICAgICAgdGhpcyBjYW4gYmUgc2V0dXAgd2l0aCB0aGUgYHJlY29nbml6ZVdpdGgoKWAgbWV0aG9kIG9uIHRoZSByZWNvZ25pemVyLlxyXG4gICAgICAgICAgICBpZiAoc2Vzc2lvbi5zdG9wcGVkICE9PSBGT1JDRURfU1RPUCAmJiAoIC8vIDFcclxuICAgICAgICAgICAgICAgICAgICAhY3VyUmVjb2duaXplciB8fCByZWNvZ25pemVyID09IGN1clJlY29nbml6ZXIgfHwgLy8gMlxyXG4gICAgICAgICAgICAgICAgICAgIHJlY29nbml6ZXIuY2FuUmVjb2duaXplV2l0aChjdXJSZWNvZ25pemVyKSkpIHsgLy8gM1xyXG4gICAgICAgICAgICAgICAgcmVjb2duaXplci5yZWNvZ25pemUoaW5wdXREYXRhKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHJlY29nbml6ZXIucmVzZXQoKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLy8gaWYgdGhlIHJlY29nbml6ZXIgaGFzIGJlZW4gcmVjb2duaXppbmcgdGhlIGlucHV0IGFzIGEgdmFsaWQgZ2VzdHVyZSwgd2Ugd2FudCB0byBzdG9yZSB0aGlzIG9uZSBhcyB0aGVcclxuICAgICAgICAgICAgLy8gY3VycmVudCBhY3RpdmUgcmVjb2duaXplci4gYnV0IG9ubHkgaWYgd2UgZG9uJ3QgYWxyZWFkeSBoYXZlIGFuIGFjdGl2ZSByZWNvZ25pemVyXHJcbiAgICAgICAgICAgIGlmICghY3VyUmVjb2duaXplciAmJiByZWNvZ25pemVyLnN0YXRlICYgKFNUQVRFX0JFR0FOIHwgU1RBVEVfQ0hBTkdFRCB8IFNUQVRFX0VOREVEKSkge1xyXG4gICAgICAgICAgICAgICAgY3VyUmVjb2duaXplciA9IHNlc3Npb24uY3VyUmVjb2duaXplciA9IHJlY29nbml6ZXI7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaSsrO1xyXG4gICAgICAgIH1cclxuICAgIH0sXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBnZXQgYSByZWNvZ25pemVyIGJ5IGl0cyBldmVudCBuYW1lLlxyXG4gICAgICogQHBhcmFtIHtSZWNvZ25pemVyfFN0cmluZ30gcmVjb2duaXplclxyXG4gICAgICogQHJldHVybnMge1JlY29nbml6ZXJ8TnVsbH1cclxuICAgICAqL1xyXG4gICAgZ2V0OiBmdW5jdGlvbihyZWNvZ25pemVyKSB7XHJcbiAgICAgICAgaWYgKHJlY29nbml6ZXIgaW5zdGFuY2VvZiBSZWNvZ25pemVyKSB7XHJcbiAgICAgICAgICAgIHJldHVybiByZWNvZ25pemVyO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdmFyIHJlY29nbml6ZXJzID0gdGhpcy5yZWNvZ25pemVycztcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHJlY29nbml6ZXJzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGlmIChyZWNvZ25pemVyc1tpXS5vcHRpb25zLmV2ZW50ID09IHJlY29nbml6ZXIpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiByZWNvZ25pemVyc1tpXTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgIH0sXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBhZGQgYSByZWNvZ25pemVyIHRvIHRoZSBtYW5hZ2VyXHJcbiAgICAgKiBleGlzdGluZyByZWNvZ25pemVycyB3aXRoIHRoZSBzYW1lIGV2ZW50IG5hbWUgd2lsbCBiZSByZW1vdmVkXHJcbiAgICAgKiBAcGFyYW0ge1JlY29nbml6ZXJ9IHJlY29nbml6ZXJcclxuICAgICAqIEByZXR1cm5zIHtSZWNvZ25pemVyfE1hbmFnZXJ9XHJcbiAgICAgKi9cclxuICAgIGFkZDogZnVuY3Rpb24ocmVjb2duaXplcikge1xyXG4gICAgICAgIGlmIChpbnZva2VBcnJheUFyZyhyZWNvZ25pemVyLCAnYWRkJywgdGhpcykpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyByZW1vdmUgZXhpc3RpbmdcclxuICAgICAgICB2YXIgZXhpc3RpbmcgPSB0aGlzLmdldChyZWNvZ25pemVyLm9wdGlvbnMuZXZlbnQpO1xyXG4gICAgICAgIGlmIChleGlzdGluZykge1xyXG4gICAgICAgICAgICB0aGlzLnJlbW92ZShleGlzdGluZyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLnJlY29nbml6ZXJzLnB1c2gocmVjb2duaXplcik7XHJcbiAgICAgICAgcmVjb2duaXplci5tYW5hZ2VyID0gdGhpcztcclxuXHJcbiAgICAgICAgdGhpcy50b3VjaEFjdGlvbi51cGRhdGUoKTtcclxuICAgICAgICByZXR1cm4gcmVjb2duaXplcjtcclxuICAgIH0sXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiByZW1vdmUgYSByZWNvZ25pemVyIGJ5IG5hbWUgb3IgaW5zdGFuY2VcclxuICAgICAqIEBwYXJhbSB7UmVjb2duaXplcnxTdHJpbmd9IHJlY29nbml6ZXJcclxuICAgICAqIEByZXR1cm5zIHtNYW5hZ2VyfVxyXG4gICAgICovXHJcbiAgICByZW1vdmU6IGZ1bmN0aW9uKHJlY29nbml6ZXIpIHtcclxuICAgICAgICBpZiAoaW52b2tlQXJyYXlBcmcocmVjb2duaXplciwgJ3JlbW92ZScsIHRoaXMpKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdmFyIHJlY29nbml6ZXJzID0gdGhpcy5yZWNvZ25pemVycztcclxuICAgICAgICByZWNvZ25pemVyID0gdGhpcy5nZXQocmVjb2duaXplcik7XHJcbiAgICAgICAgcmVjb2duaXplcnMuc3BsaWNlKGluQXJyYXkocmVjb2duaXplcnMsIHJlY29nbml6ZXIpLCAxKTtcclxuXHJcbiAgICAgICAgdGhpcy50b3VjaEFjdGlvbi51cGRhdGUoKTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH0sXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBiaW5kIGV2ZW50XHJcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gZXZlbnRzXHJcbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBoYW5kbGVyXHJcbiAgICAgKiBAcmV0dXJucyB7RXZlbnRFbWl0dGVyfSB0aGlzXHJcbiAgICAgKi9cclxuICAgIG9uOiBmdW5jdGlvbihldmVudHMsIGhhbmRsZXIpIHtcclxuICAgICAgICB2YXIgaGFuZGxlcnMgPSB0aGlzLmhhbmRsZXJzO1xyXG4gICAgICAgIGVhY2goc3BsaXRTdHIoZXZlbnRzKSwgZnVuY3Rpb24oZXZlbnQpIHtcclxuICAgICAgICAgICAgaGFuZGxlcnNbZXZlbnRdID0gaGFuZGxlcnNbZXZlbnRdIHx8IFtdO1xyXG4gICAgICAgICAgICBoYW5kbGVyc1tldmVudF0ucHVzaChoYW5kbGVyKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH0sXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiB1bmJpbmQgZXZlbnQsIGxlYXZlIGVtaXQgYmxhbmsgdG8gcmVtb3ZlIGFsbCBoYW5kbGVyc1xyXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IGV2ZW50c1xyXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbn0gW2hhbmRsZXJdXHJcbiAgICAgKiBAcmV0dXJucyB7RXZlbnRFbWl0dGVyfSB0aGlzXHJcbiAgICAgKi9cclxuICAgIG9mZjogZnVuY3Rpb24oZXZlbnRzLCBoYW5kbGVyKSB7XHJcbiAgICAgICAgdmFyIGhhbmRsZXJzID0gdGhpcy5oYW5kbGVycztcclxuICAgICAgICBlYWNoKHNwbGl0U3RyKGV2ZW50cyksIGZ1bmN0aW9uKGV2ZW50KSB7XHJcbiAgICAgICAgICAgIGlmICghaGFuZGxlcikge1xyXG4gICAgICAgICAgICAgICAgZGVsZXRlIGhhbmRsZXJzW2V2ZW50XTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGhhbmRsZXJzW2V2ZW50XS5zcGxpY2UoaW5BcnJheShoYW5kbGVyc1tldmVudF0sIGhhbmRsZXIpLCAxKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfSxcclxuXHJcbiAgICAvKipcclxuICAgICAqIGVtaXQgZXZlbnQgdG8gdGhlIGxpc3RlbmVyc1xyXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IGV2ZW50XHJcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gZGF0YVxyXG4gICAgICovXHJcbiAgICBlbWl0OiBmdW5jdGlvbihldmVudCwgZGF0YSkge1xyXG4gICAgICAgIC8vIHdlIGFsc28gd2FudCB0byB0cmlnZ2VyIGRvbSBldmVudHNcclxuICAgICAgICBpZiAodGhpcy5vcHRpb25zLmRvbUV2ZW50cykge1xyXG4gICAgICAgICAgICB0cmlnZ2VyRG9tRXZlbnQoZXZlbnQsIGRhdGEpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gbm8gaGFuZGxlcnMsIHNvIHNraXAgaXQgYWxsXHJcbiAgICAgICAgdmFyIGhhbmRsZXJzID0gdGhpcy5oYW5kbGVyc1tldmVudF0gJiYgdGhpcy5oYW5kbGVyc1tldmVudF0uc2xpY2UoKTtcclxuICAgICAgICBpZiAoIWhhbmRsZXJzIHx8ICFoYW5kbGVycy5sZW5ndGgpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZGF0YS50eXBlID0gZXZlbnQ7XHJcbiAgICAgICAgZGF0YS5wcmV2ZW50RGVmYXVsdCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBkYXRhLnNyY0V2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdmFyIGkgPSAwO1xyXG4gICAgICAgIHdoaWxlIChpIDwgaGFuZGxlcnMubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgIGhhbmRsZXJzW2ldKGRhdGEpO1xyXG4gICAgICAgICAgICBpKys7XHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuXHJcbiAgICAvKipcclxuICAgICAqIGRlc3Ryb3kgdGhlIG1hbmFnZXIgYW5kIHVuYmluZHMgYWxsIGV2ZW50c1xyXG4gICAgICogaXQgZG9lc24ndCB1bmJpbmQgZG9tIGV2ZW50cywgdGhhdCBpcyB0aGUgdXNlciBvd24gcmVzcG9uc2liaWxpdHlcclxuICAgICAqL1xyXG4gICAgZGVzdHJveTogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgdGhpcy5lbGVtZW50ICYmIHRvZ2dsZUNzc1Byb3BzKHRoaXMsIGZhbHNlKTtcclxuXHJcbiAgICAgICAgdGhpcy5oYW5kbGVycyA9IHt9O1xyXG4gICAgICAgIHRoaXMuc2Vzc2lvbiA9IHt9O1xyXG4gICAgICAgIHRoaXMuaW5wdXQuZGVzdHJveSgpO1xyXG4gICAgICAgIHRoaXMuZWxlbWVudCA9IG51bGw7XHJcbiAgICB9XHJcbn07XHJcblxyXG4vKipcclxuICogYWRkL3JlbW92ZSB0aGUgY3NzIHByb3BlcnRpZXMgYXMgZGVmaW5lZCBpbiBtYW5hZ2VyLm9wdGlvbnMuY3NzUHJvcHNcclxuICogQHBhcmFtIHtNYW5hZ2VyfSBtYW5hZ2VyXHJcbiAqIEBwYXJhbSB7Qm9vbGVhbn0gYWRkXHJcbiAqL1xyXG5mdW5jdGlvbiB0b2dnbGVDc3NQcm9wcyhtYW5hZ2VyLCBhZGQpIHtcclxuICAgIHZhciBlbGVtZW50ID0gbWFuYWdlci5lbGVtZW50O1xyXG4gICAgZWFjaChtYW5hZ2VyLm9wdGlvbnMuY3NzUHJvcHMsIGZ1bmN0aW9uKHZhbHVlLCBuYW1lKSB7XHJcbiAgICAgICAgZWxlbWVudC5zdHlsZVtwcmVmaXhlZChlbGVtZW50LnN0eWxlLCBuYW1lKV0gPSBhZGQgPyB2YWx1ZSA6ICcnO1xyXG4gICAgfSk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiB0cmlnZ2VyIGRvbSBldmVudFxyXG4gKiBAcGFyYW0ge1N0cmluZ30gZXZlbnRcclxuICogQHBhcmFtIHtPYmplY3R9IGRhdGFcclxuICovXHJcbmZ1bmN0aW9uIHRyaWdnZXJEb21FdmVudChldmVudCwgZGF0YSkge1xyXG4gICAgdmFyIGdlc3R1cmVFdmVudCA9IGRvY3VtZW50LmNyZWF0ZUV2ZW50KCdFdmVudCcpO1xyXG4gICAgZ2VzdHVyZUV2ZW50LmluaXRFdmVudChldmVudCwgdHJ1ZSwgdHJ1ZSk7XHJcbiAgICBnZXN0dXJlRXZlbnQuZ2VzdHVyZSA9IGRhdGE7XHJcbiAgICBkYXRhLnRhcmdldC5kaXNwYXRjaEV2ZW50KGdlc3R1cmVFdmVudCk7XHJcbn1cclxuXHJcbmV4dGVuZChIYW1tZXIsIHtcclxuICAgIElOUFVUX1NUQVJUOiBJTlBVVF9TVEFSVCxcclxuICAgIElOUFVUX01PVkU6IElOUFVUX01PVkUsXHJcbiAgICBJTlBVVF9FTkQ6IElOUFVUX0VORCxcclxuICAgIElOUFVUX0NBTkNFTDogSU5QVVRfQ0FOQ0VMLFxyXG5cclxuICAgIFNUQVRFX1BPU1NJQkxFOiBTVEFURV9QT1NTSUJMRSxcclxuICAgIFNUQVRFX0JFR0FOOiBTVEFURV9CRUdBTixcclxuICAgIFNUQVRFX0NIQU5HRUQ6IFNUQVRFX0NIQU5HRUQsXHJcbiAgICBTVEFURV9FTkRFRDogU1RBVEVfRU5ERUQsXHJcbiAgICBTVEFURV9SRUNPR05JWkVEOiBTVEFURV9SRUNPR05JWkVELFxyXG4gICAgU1RBVEVfQ0FOQ0VMTEVEOiBTVEFURV9DQU5DRUxMRUQsXHJcbiAgICBTVEFURV9GQUlMRUQ6IFNUQVRFX0ZBSUxFRCxcclxuXHJcbiAgICBESVJFQ1RJT05fTk9ORTogRElSRUNUSU9OX05PTkUsXHJcbiAgICBESVJFQ1RJT05fTEVGVDogRElSRUNUSU9OX0xFRlQsXHJcbiAgICBESVJFQ1RJT05fUklHSFQ6IERJUkVDVElPTl9SSUdIVCxcclxuICAgIERJUkVDVElPTl9VUDogRElSRUNUSU9OX1VQLFxyXG4gICAgRElSRUNUSU9OX0RPV046IERJUkVDVElPTl9ET1dOLFxyXG4gICAgRElSRUNUSU9OX0hPUklaT05UQUw6IERJUkVDVElPTl9IT1JJWk9OVEFMLFxyXG4gICAgRElSRUNUSU9OX1ZFUlRJQ0FMOiBESVJFQ1RJT05fVkVSVElDQUwsXHJcbiAgICBESVJFQ1RJT05fQUxMOiBESVJFQ1RJT05fQUxMLFxyXG5cclxuICAgIE1hbmFnZXI6IE1hbmFnZXIsXHJcbiAgICBJbnB1dDogSW5wdXQsXHJcbiAgICBUb3VjaEFjdGlvbjogVG91Y2hBY3Rpb24sXHJcblxyXG4gICAgVG91Y2hJbnB1dDogVG91Y2hJbnB1dCxcclxuICAgIE1vdXNlSW5wdXQ6IE1vdXNlSW5wdXQsXHJcbiAgICBQb2ludGVyRXZlbnRJbnB1dDogUG9pbnRlckV2ZW50SW5wdXQsXHJcbiAgICBUb3VjaE1vdXNlSW5wdXQ6IFRvdWNoTW91c2VJbnB1dCxcclxuICAgIFNpbmdsZVRvdWNoSW5wdXQ6IFNpbmdsZVRvdWNoSW5wdXQsXHJcblxyXG4gICAgUmVjb2duaXplcjogUmVjb2duaXplcixcclxuICAgIEF0dHJSZWNvZ25pemVyOiBBdHRyUmVjb2duaXplcixcclxuICAgIFRhcDogVGFwUmVjb2duaXplcixcclxuICAgIFBhbjogUGFuUmVjb2duaXplcixcclxuICAgIFN3aXBlOiBTd2lwZVJlY29nbml6ZXIsXHJcbiAgICBQaW5jaDogUGluY2hSZWNvZ25pemVyLFxyXG4gICAgUm90YXRlOiBSb3RhdGVSZWNvZ25pemVyLFxyXG4gICAgUHJlc3M6IFByZXNzUmVjb2duaXplcixcclxuXHJcbiAgICBvbjogYWRkRXZlbnRMaXN0ZW5lcnMsXHJcbiAgICBvZmY6IHJlbW92ZUV2ZW50TGlzdGVuZXJzLFxyXG4gICAgZWFjaDogZWFjaCxcclxuICAgIG1lcmdlOiBtZXJnZSxcclxuICAgIGV4dGVuZDogZXh0ZW5kLFxyXG4gICAgaW5oZXJpdDogaW5oZXJpdCxcclxuICAgIGJpbmRGbjogYmluZEZuLFxyXG4gICAgcHJlZml4ZWQ6IHByZWZpeGVkXHJcbn0pO1xyXG5cclxuaWYgKHR5cGVvZiBkZWZpbmUgPT0gVFlQRV9GVU5DVElPTiAmJiBkZWZpbmUuYW1kKSB7XHJcbiAgICBkZWZpbmUoZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgcmV0dXJuIEhhbW1lcjtcclxuICAgIH0pO1xyXG59IGVsc2UgaWYgKHR5cGVvZiBtb2R1bGUgIT0gJ3VuZGVmaW5lZCcgJiYgbW9kdWxlLmV4cG9ydHMpIHtcclxuICAgIG1vZHVsZS5leHBvcnRzID0gSGFtbWVyO1xyXG59IGVsc2Uge1xyXG4gICAgd2luZG93W2V4cG9ydE5hbWVdID0gSGFtbWVyO1xyXG59XHJcblxyXG59KSh3aW5kb3csIGRvY3VtZW50LCAnSGFtbWVyJyk7XHJcbiIsIi8qXG4gTGVhZmxldCwgYSBKYXZhU2NyaXB0IGxpYnJhcnkgZm9yIG1vYmlsZS1mcmllbmRseSBpbnRlcmFjdGl2ZSBtYXBzLiBodHRwOi8vbGVhZmxldGpzLmNvbVxuIChjKSAyMDEwLTIwMTMsIFZsYWRpbWlyIEFnYWZvbmtpblxuIChjKSAyMDEwLTIwMTEsIENsb3VkTWFkZVxuKi9cbihmdW5jdGlvbiAod2luZG93LCBkb2N1bWVudCwgdW5kZWZpbmVkKSB7XHJcbnZhciBvbGRMID0gd2luZG93LkwsXHJcbiAgICBMID0ge307XHJcblxyXG5MLnZlcnNpb24gPSAnMC43LjInO1xyXG5cclxuLy8gZGVmaW5lIExlYWZsZXQgZm9yIE5vZGUgbW9kdWxlIHBhdHRlcm4gbG9hZGVycywgaW5jbHVkaW5nIEJyb3dzZXJpZnlcclxuaWYgKHR5cGVvZiBtb2R1bGUgPT09ICdvYmplY3QnICYmIHR5cGVvZiBtb2R1bGUuZXhwb3J0cyA9PT0gJ29iamVjdCcpIHtcclxuXHRtb2R1bGUuZXhwb3J0cyA9IEw7XHJcblxyXG4vLyBkZWZpbmUgTGVhZmxldCBhcyBhbiBBTUQgbW9kdWxlXHJcbn0gZWxzZSBpZiAodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKSB7XHJcblx0ZGVmaW5lKEwpO1xyXG59XHJcblxyXG4vLyBkZWZpbmUgTGVhZmxldCBhcyBhIGdsb2JhbCBMIHZhcmlhYmxlLCBzYXZpbmcgdGhlIG9yaWdpbmFsIEwgdG8gcmVzdG9yZSBsYXRlciBpZiBuZWVkZWRcclxuXHJcbkwubm9Db25mbGljdCA9IGZ1bmN0aW9uICgpIHtcclxuXHR3aW5kb3cuTCA9IG9sZEw7XHJcblx0cmV0dXJuIHRoaXM7XHJcbn07XHJcblxyXG53aW5kb3cuTCA9IEw7XHJcblxuXG4vKlxyXG4gKiBMLlV0aWwgY29udGFpbnMgdmFyaW91cyB1dGlsaXR5IGZ1bmN0aW9ucyB1c2VkIHRocm91Z2hvdXQgTGVhZmxldCBjb2RlLlxyXG4gKi9cclxuXHJcbkwuVXRpbCA9IHtcclxuXHRleHRlbmQ6IGZ1bmN0aW9uIChkZXN0KSB7IC8vIChPYmplY3RbLCBPYmplY3QsIC4uLl0pIC0+XHJcblx0XHR2YXIgc291cmNlcyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMSksXHJcblx0XHQgICAgaSwgaiwgbGVuLCBzcmM7XHJcblxyXG5cdFx0Zm9yIChqID0gMCwgbGVuID0gc291cmNlcy5sZW5ndGg7IGogPCBsZW47IGorKykge1xyXG5cdFx0XHRzcmMgPSBzb3VyY2VzW2pdIHx8IHt9O1xyXG5cdFx0XHRmb3IgKGkgaW4gc3JjKSB7XHJcblx0XHRcdFx0aWYgKHNyYy5oYXNPd25Qcm9wZXJ0eShpKSkge1xyXG5cdFx0XHRcdFx0ZGVzdFtpXSA9IHNyY1tpXTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdHJldHVybiBkZXN0O1xyXG5cdH0sXHJcblxyXG5cdGJpbmQ6IGZ1bmN0aW9uIChmbiwgb2JqKSB7IC8vIChGdW5jdGlvbiwgT2JqZWN0KSAtPiBGdW5jdGlvblxyXG5cdFx0dmFyIGFyZ3MgPSBhcmd1bWVudHMubGVuZ3RoID4gMiA/IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMikgOiBudWxsO1xyXG5cdFx0cmV0dXJuIGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0cmV0dXJuIGZuLmFwcGx5KG9iaiwgYXJncyB8fCBhcmd1bWVudHMpO1xyXG5cdFx0fTtcclxuXHR9LFxyXG5cclxuXHRzdGFtcDogKGZ1bmN0aW9uICgpIHtcclxuXHRcdHZhciBsYXN0SWQgPSAwLFxyXG5cdFx0ICAgIGtleSA9ICdfbGVhZmxldF9pZCc7XHJcblx0XHRyZXR1cm4gZnVuY3Rpb24gKG9iaikge1xyXG5cdFx0XHRvYmpba2V5XSA9IG9ialtrZXldIHx8ICsrbGFzdElkO1xyXG5cdFx0XHRyZXR1cm4gb2JqW2tleV07XHJcblx0XHR9O1xyXG5cdH0oKSksXHJcblxyXG5cdGludm9rZUVhY2g6IGZ1bmN0aW9uIChvYmosIG1ldGhvZCwgY29udGV4dCkge1xyXG5cdFx0dmFyIGksIGFyZ3M7XHJcblxyXG5cdFx0aWYgKHR5cGVvZiBvYmogPT09ICdvYmplY3QnKSB7XHJcblx0XHRcdGFyZ3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsIDMpO1xyXG5cclxuXHRcdFx0Zm9yIChpIGluIG9iaikge1xyXG5cdFx0XHRcdG1ldGhvZC5hcHBseShjb250ZXh0LCBbaSwgb2JqW2ldXS5jb25jYXQoYXJncykpO1xyXG5cdFx0XHR9XHJcblx0XHRcdHJldHVybiB0cnVlO1xyXG5cdFx0fVxyXG5cclxuXHRcdHJldHVybiBmYWxzZTtcclxuXHR9LFxyXG5cclxuXHRsaW1pdEV4ZWNCeUludGVydmFsOiBmdW5jdGlvbiAoZm4sIHRpbWUsIGNvbnRleHQpIHtcclxuXHRcdHZhciBsb2NrLCBleGVjT25VbmxvY2s7XHJcblxyXG5cdFx0cmV0dXJuIGZ1bmN0aW9uIHdyYXBwZXJGbigpIHtcclxuXHRcdFx0dmFyIGFyZ3MgPSBhcmd1bWVudHM7XHJcblxyXG5cdFx0XHRpZiAobG9jaykge1xyXG5cdFx0XHRcdGV4ZWNPblVubG9jayA9IHRydWU7XHJcblx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRsb2NrID0gdHJ1ZTtcclxuXHJcblx0XHRcdHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xyXG5cdFx0XHRcdGxvY2sgPSBmYWxzZTtcclxuXHJcblx0XHRcdFx0aWYgKGV4ZWNPblVubG9jaykge1xyXG5cdFx0XHRcdFx0d3JhcHBlckZuLmFwcGx5KGNvbnRleHQsIGFyZ3MpO1xyXG5cdFx0XHRcdFx0ZXhlY09uVW5sb2NrID0gZmFsc2U7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9LCB0aW1lKTtcclxuXHJcblx0XHRcdGZuLmFwcGx5KGNvbnRleHQsIGFyZ3MpO1xyXG5cdFx0fTtcclxuXHR9LFxyXG5cclxuXHRmYWxzZUZuOiBmdW5jdGlvbiAoKSB7XHJcblx0XHRyZXR1cm4gZmFsc2U7XHJcblx0fSxcclxuXHJcblx0Zm9ybWF0TnVtOiBmdW5jdGlvbiAobnVtLCBkaWdpdHMpIHtcclxuXHRcdHZhciBwb3cgPSBNYXRoLnBvdygxMCwgZGlnaXRzIHx8IDUpO1xyXG5cdFx0cmV0dXJuIE1hdGgucm91bmQobnVtICogcG93KSAvIHBvdztcclxuXHR9LFxyXG5cclxuXHR0cmltOiBmdW5jdGlvbiAoc3RyKSB7XHJcblx0XHRyZXR1cm4gc3RyLnRyaW0gPyBzdHIudHJpbSgpIDogc3RyLnJlcGxhY2UoL15cXHMrfFxccyskL2csICcnKTtcclxuXHR9LFxyXG5cclxuXHRzcGxpdFdvcmRzOiBmdW5jdGlvbiAoc3RyKSB7XHJcblx0XHRyZXR1cm4gTC5VdGlsLnRyaW0oc3RyKS5zcGxpdCgvXFxzKy8pO1xyXG5cdH0sXHJcblxyXG5cdHNldE9wdGlvbnM6IGZ1bmN0aW9uIChvYmosIG9wdGlvbnMpIHtcclxuXHRcdG9iai5vcHRpb25zID0gTC5leHRlbmQoe30sIG9iai5vcHRpb25zLCBvcHRpb25zKTtcclxuXHRcdHJldHVybiBvYmoub3B0aW9ucztcclxuXHR9LFxyXG5cclxuXHRnZXRQYXJhbVN0cmluZzogZnVuY3Rpb24gKG9iaiwgZXhpc3RpbmdVcmwsIHVwcGVyY2FzZSkge1xyXG5cdFx0dmFyIHBhcmFtcyA9IFtdO1xyXG5cdFx0Zm9yICh2YXIgaSBpbiBvYmopIHtcclxuXHRcdFx0cGFyYW1zLnB1c2goZW5jb2RlVVJJQ29tcG9uZW50KHVwcGVyY2FzZSA/IGkudG9VcHBlckNhc2UoKSA6IGkpICsgJz0nICsgZW5jb2RlVVJJQ29tcG9uZW50KG9ialtpXSkpO1xyXG5cdFx0fVxyXG5cdFx0cmV0dXJuICgoIWV4aXN0aW5nVXJsIHx8IGV4aXN0aW5nVXJsLmluZGV4T2YoJz8nKSA9PT0gLTEpID8gJz8nIDogJyYnKSArIHBhcmFtcy5qb2luKCcmJyk7XHJcblx0fSxcclxuXHR0ZW1wbGF0ZTogZnVuY3Rpb24gKHN0ciwgZGF0YSkge1xyXG5cdFx0cmV0dXJuIHN0ci5yZXBsYWNlKC9cXHsgKihbXFx3X10rKSAqXFx9L2csIGZ1bmN0aW9uIChzdHIsIGtleSkge1xyXG5cdFx0XHR2YXIgdmFsdWUgPSBkYXRhW2tleV07XHJcblx0XHRcdGlmICh2YWx1ZSA9PT0gdW5kZWZpbmVkKSB7XHJcblx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKCdObyB2YWx1ZSBwcm92aWRlZCBmb3IgdmFyaWFibGUgJyArIHN0cik7XHJcblx0XHRcdH0gZWxzZSBpZiAodHlwZW9mIHZhbHVlID09PSAnZnVuY3Rpb24nKSB7XHJcblx0XHRcdFx0dmFsdWUgPSB2YWx1ZShkYXRhKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRyZXR1cm4gdmFsdWU7XHJcblx0XHR9KTtcclxuXHR9LFxyXG5cclxuXHRpc0FycmF5OiBBcnJheS5pc0FycmF5IHx8IGZ1bmN0aW9uIChvYmopIHtcclxuXHRcdHJldHVybiAoT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKG9iaikgPT09ICdbb2JqZWN0IEFycmF5XScpO1xyXG5cdH0sXHJcblxyXG5cdGVtcHR5SW1hZ2VVcmw6ICdkYXRhOmltYWdlL2dpZjtiYXNlNjQsUjBsR09EbGhBUUFCQUFEL0FDd0FBQUFBQVFBQkFBQUNBRHM9J1xyXG59O1xyXG5cclxuKGZ1bmN0aW9uICgpIHtcclxuXHJcblx0Ly8gaW5zcGlyZWQgYnkgaHR0cDovL3BhdWxpcmlzaC5jb20vMjAxMS9yZXF1ZXN0YW5pbWF0aW9uZnJhbWUtZm9yLXNtYXJ0LWFuaW1hdGluZy9cclxuXHJcblx0ZnVuY3Rpb24gZ2V0UHJlZml4ZWQobmFtZSkge1xyXG5cdFx0dmFyIGksIGZuLFxyXG5cdFx0ICAgIHByZWZpeGVzID0gWyd3ZWJraXQnLCAnbW96JywgJ28nLCAnbXMnXTtcclxuXHJcblx0XHRmb3IgKGkgPSAwOyBpIDwgcHJlZml4ZXMubGVuZ3RoICYmICFmbjsgaSsrKSB7XHJcblx0XHRcdGZuID0gd2luZG93W3ByZWZpeGVzW2ldICsgbmFtZV07XHJcblx0XHR9XHJcblxyXG5cdFx0cmV0dXJuIGZuO1xyXG5cdH1cclxuXHJcblx0dmFyIGxhc3RUaW1lID0gMDtcclxuXHJcblx0ZnVuY3Rpb24gdGltZW91dERlZmVyKGZuKSB7XHJcblx0XHR2YXIgdGltZSA9ICtuZXcgRGF0ZSgpLFxyXG5cdFx0ICAgIHRpbWVUb0NhbGwgPSBNYXRoLm1heCgwLCAxNiAtICh0aW1lIC0gbGFzdFRpbWUpKTtcclxuXHJcblx0XHRsYXN0VGltZSA9IHRpbWUgKyB0aW1lVG9DYWxsO1xyXG5cdFx0cmV0dXJuIHdpbmRvdy5zZXRUaW1lb3V0KGZuLCB0aW1lVG9DYWxsKTtcclxuXHR9XHJcblxyXG5cdHZhciByZXF1ZXN0Rm4gPSB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lIHx8XHJcblx0ICAgICAgICBnZXRQcmVmaXhlZCgnUmVxdWVzdEFuaW1hdGlvbkZyYW1lJykgfHwgdGltZW91dERlZmVyO1xyXG5cclxuXHR2YXIgY2FuY2VsRm4gPSB3aW5kb3cuY2FuY2VsQW5pbWF0aW9uRnJhbWUgfHxcclxuXHQgICAgICAgIGdldFByZWZpeGVkKCdDYW5jZWxBbmltYXRpb25GcmFtZScpIHx8XHJcblx0ICAgICAgICBnZXRQcmVmaXhlZCgnQ2FuY2VsUmVxdWVzdEFuaW1hdGlvbkZyYW1lJykgfHxcclxuXHQgICAgICAgIGZ1bmN0aW9uIChpZCkgeyB3aW5kb3cuY2xlYXJUaW1lb3V0KGlkKTsgfTtcclxuXHJcblxyXG5cdEwuVXRpbC5yZXF1ZXN0QW5pbUZyYW1lID0gZnVuY3Rpb24gKGZuLCBjb250ZXh0LCBpbW1lZGlhdGUsIGVsZW1lbnQpIHtcclxuXHRcdGZuID0gTC5iaW5kKGZuLCBjb250ZXh0KTtcclxuXHJcblx0XHRpZiAoaW1tZWRpYXRlICYmIHJlcXVlc3RGbiA9PT0gdGltZW91dERlZmVyKSB7XHJcblx0XHRcdGZuKCk7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRyZXR1cm4gcmVxdWVzdEZuLmNhbGwod2luZG93LCBmbiwgZWxlbWVudCk7XHJcblx0XHR9XHJcblx0fTtcclxuXHJcblx0TC5VdGlsLmNhbmNlbEFuaW1GcmFtZSA9IGZ1bmN0aW9uIChpZCkge1xyXG5cdFx0aWYgKGlkKSB7XHJcblx0XHRcdGNhbmNlbEZuLmNhbGwod2luZG93LCBpZCk7XHJcblx0XHR9XHJcblx0fTtcclxuXHJcbn0oKSk7XHJcblxyXG4vLyBzaG9ydGN1dHMgZm9yIG1vc3QgdXNlZCB1dGlsaXR5IGZ1bmN0aW9uc1xyXG5MLmV4dGVuZCA9IEwuVXRpbC5leHRlbmQ7XHJcbkwuYmluZCA9IEwuVXRpbC5iaW5kO1xyXG5MLnN0YW1wID0gTC5VdGlsLnN0YW1wO1xyXG5MLnNldE9wdGlvbnMgPSBMLlV0aWwuc2V0T3B0aW9ucztcclxuXG5cbi8qXHJcbiAqIEwuQ2xhc3MgcG93ZXJzIHRoZSBPT1AgZmFjaWxpdGllcyBvZiB0aGUgbGlicmFyeS5cclxuICogVGhhbmtzIHRvIEpvaG4gUmVzaWcgYW5kIERlYW4gRWR3YXJkcyBmb3IgaW5zcGlyYXRpb24hXHJcbiAqL1xyXG5cclxuTC5DbGFzcyA9IGZ1bmN0aW9uICgpIHt9O1xyXG5cclxuTC5DbGFzcy5leHRlbmQgPSBmdW5jdGlvbiAocHJvcHMpIHtcclxuXHJcblx0Ly8gZXh0ZW5kZWQgY2xhc3Mgd2l0aCB0aGUgbmV3IHByb3RvdHlwZVxyXG5cdHZhciBOZXdDbGFzcyA9IGZ1bmN0aW9uICgpIHtcclxuXHJcblx0XHQvLyBjYWxsIHRoZSBjb25zdHJ1Y3RvclxyXG5cdFx0aWYgKHRoaXMuaW5pdGlhbGl6ZSkge1xyXG5cdFx0XHR0aGlzLmluaXRpYWxpemUuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcclxuXHRcdH1cclxuXHJcblx0XHQvLyBjYWxsIGFsbCBjb25zdHJ1Y3RvciBob29rc1xyXG5cdFx0aWYgKHRoaXMuX2luaXRIb29rcykge1xyXG5cdFx0XHR0aGlzLmNhbGxJbml0SG9va3MoKTtcclxuXHRcdH1cclxuXHR9O1xyXG5cclxuXHQvLyBpbnN0YW50aWF0ZSBjbGFzcyB3aXRob3V0IGNhbGxpbmcgY29uc3RydWN0b3JcclxuXHR2YXIgRiA9IGZ1bmN0aW9uICgpIHt9O1xyXG5cdEYucHJvdG90eXBlID0gdGhpcy5wcm90b3R5cGU7XHJcblxyXG5cdHZhciBwcm90byA9IG5ldyBGKCk7XHJcblx0cHJvdG8uY29uc3RydWN0b3IgPSBOZXdDbGFzcztcclxuXHJcblx0TmV3Q2xhc3MucHJvdG90eXBlID0gcHJvdG87XHJcblxyXG5cdC8vaW5oZXJpdCBwYXJlbnQncyBzdGF0aWNzXHJcblx0Zm9yICh2YXIgaSBpbiB0aGlzKSB7XHJcblx0XHRpZiAodGhpcy5oYXNPd25Qcm9wZXJ0eShpKSAmJiBpICE9PSAncHJvdG90eXBlJykge1xyXG5cdFx0XHROZXdDbGFzc1tpXSA9IHRoaXNbaV07XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHQvLyBtaXggc3RhdGljIHByb3BlcnRpZXMgaW50byB0aGUgY2xhc3NcclxuXHRpZiAocHJvcHMuc3RhdGljcykge1xyXG5cdFx0TC5leHRlbmQoTmV3Q2xhc3MsIHByb3BzLnN0YXRpY3MpO1xyXG5cdFx0ZGVsZXRlIHByb3BzLnN0YXRpY3M7XHJcblx0fVxyXG5cclxuXHQvLyBtaXggaW5jbHVkZXMgaW50byB0aGUgcHJvdG90eXBlXHJcblx0aWYgKHByb3BzLmluY2x1ZGVzKSB7XHJcblx0XHRMLlV0aWwuZXh0ZW5kLmFwcGx5KG51bGwsIFtwcm90b10uY29uY2F0KHByb3BzLmluY2x1ZGVzKSk7XHJcblx0XHRkZWxldGUgcHJvcHMuaW5jbHVkZXM7XHJcblx0fVxyXG5cclxuXHQvLyBtZXJnZSBvcHRpb25zXHJcblx0aWYgKHByb3BzLm9wdGlvbnMgJiYgcHJvdG8ub3B0aW9ucykge1xyXG5cdFx0cHJvcHMub3B0aW9ucyA9IEwuZXh0ZW5kKHt9LCBwcm90by5vcHRpb25zLCBwcm9wcy5vcHRpb25zKTtcclxuXHR9XHJcblxyXG5cdC8vIG1peCBnaXZlbiBwcm9wZXJ0aWVzIGludG8gdGhlIHByb3RvdHlwZVxyXG5cdEwuZXh0ZW5kKHByb3RvLCBwcm9wcyk7XHJcblxyXG5cdHByb3RvLl9pbml0SG9va3MgPSBbXTtcclxuXHJcblx0dmFyIHBhcmVudCA9IHRoaXM7XHJcblx0Ly8ganNoaW50IGNhbWVsY2FzZTogZmFsc2VcclxuXHROZXdDbGFzcy5fX3N1cGVyX18gPSBwYXJlbnQucHJvdG90eXBlO1xyXG5cclxuXHQvLyBhZGQgbWV0aG9kIGZvciBjYWxsaW5nIGFsbCBob29rc1xyXG5cdHByb3RvLmNhbGxJbml0SG9va3MgPSBmdW5jdGlvbiAoKSB7XHJcblxyXG5cdFx0aWYgKHRoaXMuX2luaXRIb29rc0NhbGxlZCkgeyByZXR1cm47IH1cclxuXHJcblx0XHRpZiAocGFyZW50LnByb3RvdHlwZS5jYWxsSW5pdEhvb2tzKSB7XHJcblx0XHRcdHBhcmVudC5wcm90b3R5cGUuY2FsbEluaXRIb29rcy5jYWxsKHRoaXMpO1xyXG5cdFx0fVxyXG5cclxuXHRcdHRoaXMuX2luaXRIb29rc0NhbGxlZCA9IHRydWU7XHJcblxyXG5cdFx0Zm9yICh2YXIgaSA9IDAsIGxlbiA9IHByb3RvLl9pbml0SG9va3MubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcclxuXHRcdFx0cHJvdG8uX2luaXRIb29rc1tpXS5jYWxsKHRoaXMpO1xyXG5cdFx0fVxyXG5cdH07XHJcblxyXG5cdHJldHVybiBOZXdDbGFzcztcclxufTtcclxuXHJcblxyXG4vLyBtZXRob2QgZm9yIGFkZGluZyBwcm9wZXJ0aWVzIHRvIHByb3RvdHlwZVxyXG5MLkNsYXNzLmluY2x1ZGUgPSBmdW5jdGlvbiAocHJvcHMpIHtcclxuXHRMLmV4dGVuZCh0aGlzLnByb3RvdHlwZSwgcHJvcHMpO1xyXG59O1xyXG5cclxuLy8gbWVyZ2UgbmV3IGRlZmF1bHQgb3B0aW9ucyB0byB0aGUgQ2xhc3NcclxuTC5DbGFzcy5tZXJnZU9wdGlvbnMgPSBmdW5jdGlvbiAob3B0aW9ucykge1xyXG5cdEwuZXh0ZW5kKHRoaXMucHJvdG90eXBlLm9wdGlvbnMsIG9wdGlvbnMpO1xyXG59O1xyXG5cclxuLy8gYWRkIGEgY29uc3RydWN0b3IgaG9va1xyXG5MLkNsYXNzLmFkZEluaXRIb29rID0gZnVuY3Rpb24gKGZuKSB7IC8vIChGdW5jdGlvbikgfHwgKFN0cmluZywgYXJncy4uLilcclxuXHR2YXIgYXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMSk7XHJcblxyXG5cdHZhciBpbml0ID0gdHlwZW9mIGZuID09PSAnZnVuY3Rpb24nID8gZm4gOiBmdW5jdGlvbiAoKSB7XHJcblx0XHR0aGlzW2ZuXS5hcHBseSh0aGlzLCBhcmdzKTtcclxuXHR9O1xyXG5cclxuXHR0aGlzLnByb3RvdHlwZS5faW5pdEhvb2tzID0gdGhpcy5wcm90b3R5cGUuX2luaXRIb29rcyB8fCBbXTtcclxuXHR0aGlzLnByb3RvdHlwZS5faW5pdEhvb2tzLnB1c2goaW5pdCk7XHJcbn07XHJcblxuXG4vKlxyXG4gKiBMLk1peGluLkV2ZW50cyBpcyB1c2VkIHRvIGFkZCBjdXN0b20gZXZlbnRzIGZ1bmN0aW9uYWxpdHkgdG8gTGVhZmxldCBjbGFzc2VzLlxyXG4gKi9cclxuXHJcbnZhciBldmVudHNLZXkgPSAnX2xlYWZsZXRfZXZlbnRzJztcclxuXHJcbkwuTWl4aW4gPSB7fTtcclxuXHJcbkwuTWl4aW4uRXZlbnRzID0ge1xyXG5cclxuXHRhZGRFdmVudExpc3RlbmVyOiBmdW5jdGlvbiAodHlwZXMsIGZuLCBjb250ZXh0KSB7IC8vIChTdHJpbmcsIEZ1bmN0aW9uWywgT2JqZWN0XSkgb3IgKE9iamVjdFssIE9iamVjdF0pXHJcblxyXG5cdFx0Ly8gdHlwZXMgY2FuIGJlIGEgbWFwIG9mIHR5cGVzL2hhbmRsZXJzXHJcblx0XHRpZiAoTC5VdGlsLmludm9rZUVhY2godHlwZXMsIHRoaXMuYWRkRXZlbnRMaXN0ZW5lciwgdGhpcywgZm4sIGNvbnRleHQpKSB7IHJldHVybiB0aGlzOyB9XHJcblxyXG5cdFx0dmFyIGV2ZW50cyA9IHRoaXNbZXZlbnRzS2V5XSA9IHRoaXNbZXZlbnRzS2V5XSB8fCB7fSxcclxuXHRcdCAgICBjb250ZXh0SWQgPSBjb250ZXh0ICYmIGNvbnRleHQgIT09IHRoaXMgJiYgTC5zdGFtcChjb250ZXh0KSxcclxuXHRcdCAgICBpLCBsZW4sIGV2ZW50LCB0eXBlLCBpbmRleEtleSwgaW5kZXhMZW5LZXksIHR5cGVJbmRleDtcclxuXHJcblx0XHQvLyB0eXBlcyBjYW4gYmUgYSBzdHJpbmcgb2Ygc3BhY2Utc2VwYXJhdGVkIHdvcmRzXHJcblx0XHR0eXBlcyA9IEwuVXRpbC5zcGxpdFdvcmRzKHR5cGVzKTtcclxuXHJcblx0XHRmb3IgKGkgPSAwLCBsZW4gPSB0eXBlcy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xyXG5cdFx0XHRldmVudCA9IHtcclxuXHRcdFx0XHRhY3Rpb246IGZuLFxyXG5cdFx0XHRcdGNvbnRleHQ6IGNvbnRleHQgfHwgdGhpc1xyXG5cdFx0XHR9O1xyXG5cdFx0XHR0eXBlID0gdHlwZXNbaV07XHJcblxyXG5cdFx0XHRpZiAoY29udGV4dElkKSB7XHJcblx0XHRcdFx0Ly8gc3RvcmUgbGlzdGVuZXJzIG9mIGEgcGFydGljdWxhciBjb250ZXh0IGluIGEgc2VwYXJhdGUgaGFzaCAoaWYgaXQgaGFzIGFuIGlkKVxyXG5cdFx0XHRcdC8vIGdpdmVzIGEgbWFqb3IgcGVyZm9ybWFuY2UgYm9vc3Qgd2hlbiByZW1vdmluZyB0aG91c2FuZHMgb2YgbWFwIGxheWVyc1xyXG5cclxuXHRcdFx0XHRpbmRleEtleSA9IHR5cGUgKyAnX2lkeCc7XHJcblx0XHRcdFx0aW5kZXhMZW5LZXkgPSBpbmRleEtleSArICdfbGVuJztcclxuXHJcblx0XHRcdFx0dHlwZUluZGV4ID0gZXZlbnRzW2luZGV4S2V5XSA9IGV2ZW50c1tpbmRleEtleV0gfHwge307XHJcblxyXG5cdFx0XHRcdGlmICghdHlwZUluZGV4W2NvbnRleHRJZF0pIHtcclxuXHRcdFx0XHRcdHR5cGVJbmRleFtjb250ZXh0SWRdID0gW107XHJcblxyXG5cdFx0XHRcdFx0Ly8ga2VlcCB0cmFjayBvZiB0aGUgbnVtYmVyIG9mIGtleXMgaW4gdGhlIGluZGV4IHRvIHF1aWNrbHkgY2hlY2sgaWYgaXQncyBlbXB0eVxyXG5cdFx0XHRcdFx0ZXZlbnRzW2luZGV4TGVuS2V5XSA9IChldmVudHNbaW5kZXhMZW5LZXldIHx8IDApICsgMTtcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdHR5cGVJbmRleFtjb250ZXh0SWRdLnB1c2goZXZlbnQpO1xyXG5cclxuXHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0ZXZlbnRzW3R5cGVdID0gZXZlbnRzW3R5cGVdIHx8IFtdO1xyXG5cdFx0XHRcdGV2ZW50c1t0eXBlXS5wdXNoKGV2ZW50KTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHRcdHJldHVybiB0aGlzO1xyXG5cdH0sXHJcblxyXG5cdGhhc0V2ZW50TGlzdGVuZXJzOiBmdW5jdGlvbiAodHlwZSkgeyAvLyAoU3RyaW5nKSAtPiBCb29sZWFuXHJcblx0XHR2YXIgZXZlbnRzID0gdGhpc1tldmVudHNLZXldO1xyXG5cdFx0cmV0dXJuICEhZXZlbnRzICYmICgodHlwZSBpbiBldmVudHMgJiYgZXZlbnRzW3R5cGVdLmxlbmd0aCA+IDApIHx8XHJcblx0XHQgICAgICAgICAgICAgICAgICAgICh0eXBlICsgJ19pZHgnIGluIGV2ZW50cyAmJiBldmVudHNbdHlwZSArICdfaWR4X2xlbiddID4gMCkpO1xyXG5cdH0sXHJcblxyXG5cdHJlbW92ZUV2ZW50TGlzdGVuZXI6IGZ1bmN0aW9uICh0eXBlcywgZm4sIGNvbnRleHQpIHsgLy8gKFtTdHJpbmcsIEZ1bmN0aW9uLCBPYmplY3RdKSBvciAoT2JqZWN0WywgT2JqZWN0XSlcclxuXHJcblx0XHRpZiAoIXRoaXNbZXZlbnRzS2V5XSkge1xyXG5cdFx0XHRyZXR1cm4gdGhpcztcclxuXHRcdH1cclxuXHJcblx0XHRpZiAoIXR5cGVzKSB7XHJcblx0XHRcdHJldHVybiB0aGlzLmNsZWFyQWxsRXZlbnRMaXN0ZW5lcnMoKTtcclxuXHRcdH1cclxuXHJcblx0XHRpZiAoTC5VdGlsLmludm9rZUVhY2godHlwZXMsIHRoaXMucmVtb3ZlRXZlbnRMaXN0ZW5lciwgdGhpcywgZm4sIGNvbnRleHQpKSB7IHJldHVybiB0aGlzOyB9XHJcblxyXG5cdFx0dmFyIGV2ZW50cyA9IHRoaXNbZXZlbnRzS2V5XSxcclxuXHRcdCAgICBjb250ZXh0SWQgPSBjb250ZXh0ICYmIGNvbnRleHQgIT09IHRoaXMgJiYgTC5zdGFtcChjb250ZXh0KSxcclxuXHRcdCAgICBpLCBsZW4sIHR5cGUsIGxpc3RlbmVycywgaiwgaW5kZXhLZXksIGluZGV4TGVuS2V5LCB0eXBlSW5kZXgsIHJlbW92ZWQ7XHJcblxyXG5cdFx0dHlwZXMgPSBMLlV0aWwuc3BsaXRXb3Jkcyh0eXBlcyk7XHJcblxyXG5cdFx0Zm9yIChpID0gMCwgbGVuID0gdHlwZXMubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcclxuXHRcdFx0dHlwZSA9IHR5cGVzW2ldO1xyXG5cdFx0XHRpbmRleEtleSA9IHR5cGUgKyAnX2lkeCc7XHJcblx0XHRcdGluZGV4TGVuS2V5ID0gaW5kZXhLZXkgKyAnX2xlbic7XHJcblxyXG5cdFx0XHR0eXBlSW5kZXggPSBldmVudHNbaW5kZXhLZXldO1xyXG5cclxuXHRcdFx0aWYgKCFmbikge1xyXG5cdFx0XHRcdC8vIGNsZWFyIGFsbCBsaXN0ZW5lcnMgZm9yIGEgdHlwZSBpZiBmdW5jdGlvbiBpc24ndCBzcGVjaWZpZWRcclxuXHRcdFx0XHRkZWxldGUgZXZlbnRzW3R5cGVdO1xyXG5cdFx0XHRcdGRlbGV0ZSBldmVudHNbaW5kZXhLZXldO1xyXG5cdFx0XHRcdGRlbGV0ZSBldmVudHNbaW5kZXhMZW5LZXldO1xyXG5cclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRsaXN0ZW5lcnMgPSBjb250ZXh0SWQgJiYgdHlwZUluZGV4ID8gdHlwZUluZGV4W2NvbnRleHRJZF0gOiBldmVudHNbdHlwZV07XHJcblxyXG5cdFx0XHRcdGlmIChsaXN0ZW5lcnMpIHtcclxuXHRcdFx0XHRcdGZvciAoaiA9IGxpc3RlbmVycy5sZW5ndGggLSAxOyBqID49IDA7IGotLSkge1xyXG5cdFx0XHRcdFx0XHRpZiAoKGxpc3RlbmVyc1tqXS5hY3Rpb24gPT09IGZuKSAmJiAoIWNvbnRleHQgfHwgKGxpc3RlbmVyc1tqXS5jb250ZXh0ID09PSBjb250ZXh0KSkpIHtcclxuXHRcdFx0XHRcdFx0XHRyZW1vdmVkID0gbGlzdGVuZXJzLnNwbGljZShqLCAxKTtcclxuXHRcdFx0XHRcdFx0XHQvLyBzZXQgdGhlIG9sZCBhY3Rpb24gdG8gYSBuby1vcCwgYmVjYXVzZSBpdCBpcyBwb3NzaWJsZVxyXG5cdFx0XHRcdFx0XHRcdC8vIHRoYXQgdGhlIGxpc3RlbmVyIGlzIGJlaW5nIGl0ZXJhdGVkIG92ZXIgYXMgcGFydCBvZiBhIGRpc3BhdGNoXHJcblx0XHRcdFx0XHRcdFx0cmVtb3ZlZFswXS5hY3Rpb24gPSBMLlV0aWwuZmFsc2VGbjtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRcdGlmIChjb250ZXh0ICYmIHR5cGVJbmRleCAmJiAobGlzdGVuZXJzLmxlbmd0aCA9PT0gMCkpIHtcclxuXHRcdFx0XHRcdFx0ZGVsZXRlIHR5cGVJbmRleFtjb250ZXh0SWRdO1xyXG5cdFx0XHRcdFx0XHRldmVudHNbaW5kZXhMZW5LZXldLS07XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0cmV0dXJuIHRoaXM7XHJcblx0fSxcclxuXHJcblx0Y2xlYXJBbGxFdmVudExpc3RlbmVyczogZnVuY3Rpb24gKCkge1xyXG5cdFx0ZGVsZXRlIHRoaXNbZXZlbnRzS2V5XTtcclxuXHRcdHJldHVybiB0aGlzO1xyXG5cdH0sXHJcblxyXG5cdGZpcmVFdmVudDogZnVuY3Rpb24gKHR5cGUsIGRhdGEpIHsgLy8gKFN0cmluZ1ssIE9iamVjdF0pXHJcblx0XHRpZiAoIXRoaXMuaGFzRXZlbnRMaXN0ZW5lcnModHlwZSkpIHtcclxuXHRcdFx0cmV0dXJuIHRoaXM7XHJcblx0XHR9XHJcblxyXG5cdFx0dmFyIGV2ZW50ID0gTC5VdGlsLmV4dGVuZCh7fSwgZGF0YSwgeyB0eXBlOiB0eXBlLCB0YXJnZXQ6IHRoaXMgfSk7XHJcblxyXG5cdFx0dmFyIGV2ZW50cyA9IHRoaXNbZXZlbnRzS2V5XSxcclxuXHRcdCAgICBsaXN0ZW5lcnMsIGksIGxlbiwgdHlwZUluZGV4LCBjb250ZXh0SWQ7XHJcblxyXG5cdFx0aWYgKGV2ZW50c1t0eXBlXSkge1xyXG5cdFx0XHQvLyBtYWtlIHN1cmUgYWRkaW5nL3JlbW92aW5nIGxpc3RlbmVycyBpbnNpZGUgb3RoZXIgbGlzdGVuZXJzIHdvbid0IGNhdXNlIGluZmluaXRlIGxvb3BcclxuXHRcdFx0bGlzdGVuZXJzID0gZXZlbnRzW3R5cGVdLnNsaWNlKCk7XHJcblxyXG5cdFx0XHRmb3IgKGkgPSAwLCBsZW4gPSBsaXN0ZW5lcnMubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcclxuXHRcdFx0XHRsaXN0ZW5lcnNbaV0uYWN0aW9uLmNhbGwobGlzdGVuZXJzW2ldLmNvbnRleHQsIGV2ZW50KTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHRcdC8vIGZpcmUgZXZlbnQgZm9yIHRoZSBjb250ZXh0LWluZGV4ZWQgbGlzdGVuZXJzIGFzIHdlbGxcclxuXHRcdHR5cGVJbmRleCA9IGV2ZW50c1t0eXBlICsgJ19pZHgnXTtcclxuXHJcblx0XHRmb3IgKGNvbnRleHRJZCBpbiB0eXBlSW5kZXgpIHtcclxuXHRcdFx0bGlzdGVuZXJzID0gdHlwZUluZGV4W2NvbnRleHRJZF0uc2xpY2UoKTtcclxuXHJcblx0XHRcdGlmIChsaXN0ZW5lcnMpIHtcclxuXHRcdFx0XHRmb3IgKGkgPSAwLCBsZW4gPSBsaXN0ZW5lcnMubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcclxuXHRcdFx0XHRcdGxpc3RlbmVyc1tpXS5hY3Rpb24uY2FsbChsaXN0ZW5lcnNbaV0uY29udGV4dCwgZXZlbnQpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHRcdHJldHVybiB0aGlzO1xyXG5cdH0sXHJcblxyXG5cdGFkZE9uZVRpbWVFdmVudExpc3RlbmVyOiBmdW5jdGlvbiAodHlwZXMsIGZuLCBjb250ZXh0KSB7XHJcblxyXG5cdFx0aWYgKEwuVXRpbC5pbnZva2VFYWNoKHR5cGVzLCB0aGlzLmFkZE9uZVRpbWVFdmVudExpc3RlbmVyLCB0aGlzLCBmbiwgY29udGV4dCkpIHsgcmV0dXJuIHRoaXM7IH1cclxuXHJcblx0XHR2YXIgaGFuZGxlciA9IEwuYmluZChmdW5jdGlvbiAoKSB7XHJcblx0XHRcdHRoaXNcclxuXHRcdFx0ICAgIC5yZW1vdmVFdmVudExpc3RlbmVyKHR5cGVzLCBmbiwgY29udGV4dClcclxuXHRcdFx0ICAgIC5yZW1vdmVFdmVudExpc3RlbmVyKHR5cGVzLCBoYW5kbGVyLCBjb250ZXh0KTtcclxuXHRcdH0sIHRoaXMpO1xyXG5cclxuXHRcdHJldHVybiB0aGlzXHJcblx0XHQgICAgLmFkZEV2ZW50TGlzdGVuZXIodHlwZXMsIGZuLCBjb250ZXh0KVxyXG5cdFx0ICAgIC5hZGRFdmVudExpc3RlbmVyKHR5cGVzLCBoYW5kbGVyLCBjb250ZXh0KTtcclxuXHR9XHJcbn07XHJcblxyXG5MLk1peGluLkV2ZW50cy5vbiA9IEwuTWl4aW4uRXZlbnRzLmFkZEV2ZW50TGlzdGVuZXI7XHJcbkwuTWl4aW4uRXZlbnRzLm9mZiA9IEwuTWl4aW4uRXZlbnRzLnJlbW92ZUV2ZW50TGlzdGVuZXI7XHJcbkwuTWl4aW4uRXZlbnRzLm9uY2UgPSBMLk1peGluLkV2ZW50cy5hZGRPbmVUaW1lRXZlbnRMaXN0ZW5lcjtcclxuTC5NaXhpbi5FdmVudHMuZmlyZSA9IEwuTWl4aW4uRXZlbnRzLmZpcmVFdmVudDtcclxuXG5cbi8qXHJcbiAqIEwuQnJvd3NlciBoYW5kbGVzIGRpZmZlcmVudCBicm93c2VyIGFuZCBmZWF0dXJlIGRldGVjdGlvbnMgZm9yIGludGVybmFsIExlYWZsZXQgdXNlLlxyXG4gKi9cclxuXHJcbihmdW5jdGlvbiAoKSB7XHJcblxyXG5cdHZhciBpZSA9ICdBY3RpdmVYT2JqZWN0JyBpbiB3aW5kb3csXHJcblx0XHRpZWx0OSA9IGllICYmICFkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyLFxyXG5cclxuXHQgICAgLy8gdGVycmlibGUgYnJvd3NlciBkZXRlY3Rpb24gdG8gd29yayBhcm91bmQgU2FmYXJpIC8gaU9TIC8gQW5kcm9pZCBicm93c2VyIGJ1Z3NcclxuXHQgICAgdWEgPSBuYXZpZ2F0b3IudXNlckFnZW50LnRvTG93ZXJDYXNlKCksXHJcblx0ICAgIHdlYmtpdCA9IHVhLmluZGV4T2YoJ3dlYmtpdCcpICE9PSAtMSxcclxuXHQgICAgY2hyb21lID0gdWEuaW5kZXhPZignY2hyb21lJykgIT09IC0xLFxyXG5cdCAgICBwaGFudG9tanMgPSB1YS5pbmRleE9mKCdwaGFudG9tJykgIT09IC0xLFxyXG5cdCAgICBhbmRyb2lkID0gdWEuaW5kZXhPZignYW5kcm9pZCcpICE9PSAtMSxcclxuXHQgICAgYW5kcm9pZDIzID0gdWEuc2VhcmNoKCdhbmRyb2lkIFsyM10nKSAhPT0gLTEsXHJcblx0XHRnZWNrbyA9IHVhLmluZGV4T2YoJ2dlY2tvJykgIT09IC0xLFxyXG5cclxuXHQgICAgbW9iaWxlID0gdHlwZW9mIG9yaWVudGF0aW9uICE9PSB1bmRlZmluZWQgKyAnJyxcclxuXHQgICAgbXNQb2ludGVyID0gd2luZG93Lm5hdmlnYXRvciAmJiB3aW5kb3cubmF2aWdhdG9yLm1zUG9pbnRlckVuYWJsZWQgJiZcclxuXHQgICAgICAgICAgICAgIHdpbmRvdy5uYXZpZ2F0b3IubXNNYXhUb3VjaFBvaW50cyAmJiAhd2luZG93LlBvaW50ZXJFdmVudCxcclxuXHRcdHBvaW50ZXIgPSAod2luZG93LlBvaW50ZXJFdmVudCAmJiB3aW5kb3cubmF2aWdhdG9yLnBvaW50ZXJFbmFibGVkICYmIHdpbmRvdy5uYXZpZ2F0b3IubWF4VG91Y2hQb2ludHMpIHx8XHJcblx0XHRcdFx0ICBtc1BvaW50ZXIsXHJcblx0ICAgIHJldGluYSA9ICgnZGV2aWNlUGl4ZWxSYXRpbycgaW4gd2luZG93ICYmIHdpbmRvdy5kZXZpY2VQaXhlbFJhdGlvID4gMSkgfHxcclxuXHQgICAgICAgICAgICAgKCdtYXRjaE1lZGlhJyBpbiB3aW5kb3cgJiYgd2luZG93Lm1hdGNoTWVkaWEoJyhtaW4tcmVzb2x1dGlvbjoxNDRkcGkpJykgJiZcclxuXHQgICAgICAgICAgICAgIHdpbmRvdy5tYXRjaE1lZGlhKCcobWluLXJlc29sdXRpb246MTQ0ZHBpKScpLm1hdGNoZXMpLFxyXG5cclxuXHQgICAgZG9jID0gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LFxyXG5cdCAgICBpZTNkID0gaWUgJiYgKCd0cmFuc2l0aW9uJyBpbiBkb2Muc3R5bGUpLFxyXG5cdCAgICB3ZWJraXQzZCA9ICgnV2ViS2l0Q1NTTWF0cml4JyBpbiB3aW5kb3cpICYmICgnbTExJyBpbiBuZXcgd2luZG93LldlYktpdENTU01hdHJpeCgpKSAmJiAhYW5kcm9pZDIzLFxyXG5cdCAgICBnZWNrbzNkID0gJ01velBlcnNwZWN0aXZlJyBpbiBkb2Muc3R5bGUsXHJcblx0ICAgIG9wZXJhM2QgPSAnT1RyYW5zaXRpb24nIGluIGRvYy5zdHlsZSxcclxuXHQgICAgYW55M2QgPSAhd2luZG93LkxfRElTQUJMRV8zRCAmJiAoaWUzZCB8fCB3ZWJraXQzZCB8fCBnZWNrbzNkIHx8IG9wZXJhM2QpICYmICFwaGFudG9tanM7XHJcblxyXG5cclxuXHQvLyBQaGFudG9tSlMgaGFzICdvbnRvdWNoc3RhcnQnIGluIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudCwgYnV0IGRvZXNuJ3QgYWN0dWFsbHkgc3VwcG9ydCB0b3VjaC5cclxuXHQvLyBodHRwczovL2dpdGh1Yi5jb20vTGVhZmxldC9MZWFmbGV0L3B1bGwvMTQzNCNpc3N1ZWNvbW1lbnQtMTM4NDMxNTFcclxuXHJcblx0dmFyIHRvdWNoID0gIXdpbmRvdy5MX05PX1RPVUNIICYmICFwaGFudG9tanMgJiYgKGZ1bmN0aW9uICgpIHtcclxuXHJcblx0XHR2YXIgc3RhcnROYW1lID0gJ29udG91Y2hzdGFydCc7XHJcblxyXG5cdFx0Ly8gSUUxMCsgKFdlIHNpbXVsYXRlIHRoZXNlIGludG8gdG91Y2gqIGV2ZW50cyBpbiBMLkRvbUV2ZW50IGFuZCBMLkRvbUV2ZW50LlBvaW50ZXIpIG9yIFdlYktpdCwgZXRjLlxyXG5cdFx0aWYgKHBvaW50ZXIgfHwgKHN0YXJ0TmFtZSBpbiBkb2MpKSB7XHJcblx0XHRcdHJldHVybiB0cnVlO1xyXG5cdFx0fVxyXG5cclxuXHRcdC8vIEZpcmVmb3gvR2Vja29cclxuXHRcdHZhciBkaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKSxcclxuXHRcdCAgICBzdXBwb3J0ZWQgPSBmYWxzZTtcclxuXHJcblx0XHRpZiAoIWRpdi5zZXRBdHRyaWJ1dGUpIHtcclxuXHRcdFx0cmV0dXJuIGZhbHNlO1xyXG5cdFx0fVxyXG5cdFx0ZGl2LnNldEF0dHJpYnV0ZShzdGFydE5hbWUsICdyZXR1cm47Jyk7XHJcblxyXG5cdFx0aWYgKHR5cGVvZiBkaXZbc3RhcnROYW1lXSA9PT0gJ2Z1bmN0aW9uJykge1xyXG5cdFx0XHRzdXBwb3J0ZWQgPSB0cnVlO1xyXG5cdFx0fVxyXG5cclxuXHRcdGRpdi5yZW1vdmVBdHRyaWJ1dGUoc3RhcnROYW1lKTtcclxuXHRcdGRpdiA9IG51bGw7XHJcblxyXG5cdFx0cmV0dXJuIHN1cHBvcnRlZDtcclxuXHR9KCkpO1xyXG5cclxuXHJcblx0TC5Ccm93c2VyID0ge1xyXG5cdFx0aWU6IGllLFxyXG5cdFx0aWVsdDk6IGllbHQ5LFxyXG5cdFx0d2Via2l0OiB3ZWJraXQsXHJcblx0XHRnZWNrbzogZ2Vja28gJiYgIXdlYmtpdCAmJiAhd2luZG93Lm9wZXJhICYmICFpZSxcclxuXHJcblx0XHRhbmRyb2lkOiBhbmRyb2lkLFxyXG5cdFx0YW5kcm9pZDIzOiBhbmRyb2lkMjMsXHJcblxyXG5cdFx0Y2hyb21lOiBjaHJvbWUsXHJcblxyXG5cdFx0aWUzZDogaWUzZCxcclxuXHRcdHdlYmtpdDNkOiB3ZWJraXQzZCxcclxuXHRcdGdlY2tvM2Q6IGdlY2tvM2QsXHJcblx0XHRvcGVyYTNkOiBvcGVyYTNkLFxyXG5cdFx0YW55M2Q6IGFueTNkLFxyXG5cclxuXHRcdG1vYmlsZTogbW9iaWxlLFxyXG5cdFx0bW9iaWxlV2Via2l0OiBtb2JpbGUgJiYgd2Via2l0LFxyXG5cdFx0bW9iaWxlV2Via2l0M2Q6IG1vYmlsZSAmJiB3ZWJraXQzZCxcclxuXHRcdG1vYmlsZU9wZXJhOiBtb2JpbGUgJiYgd2luZG93Lm9wZXJhLFxyXG5cclxuXHRcdHRvdWNoOiB0b3VjaCxcclxuXHRcdG1zUG9pbnRlcjogbXNQb2ludGVyLFxyXG5cdFx0cG9pbnRlcjogcG9pbnRlcixcclxuXHJcblx0XHRyZXRpbmE6IHJldGluYVxyXG5cdH07XHJcblxyXG59KCkpO1xyXG5cblxuLypcclxuICogTC5Qb2ludCByZXByZXNlbnRzIGEgcG9pbnQgd2l0aCB4IGFuZCB5IGNvb3JkaW5hdGVzLlxyXG4gKi9cclxuXHJcbkwuUG9pbnQgPSBmdW5jdGlvbiAoLypOdW1iZXIqLyB4LCAvKk51bWJlciovIHksIC8qQm9vbGVhbiovIHJvdW5kKSB7XHJcblx0dGhpcy54ID0gKHJvdW5kID8gTWF0aC5yb3VuZCh4KSA6IHgpO1xyXG5cdHRoaXMueSA9IChyb3VuZCA/IE1hdGgucm91bmQoeSkgOiB5KTtcclxufTtcclxuXHJcbkwuUG9pbnQucHJvdG90eXBlID0ge1xyXG5cclxuXHRjbG9uZTogZnVuY3Rpb24gKCkge1xyXG5cdFx0cmV0dXJuIG5ldyBMLlBvaW50KHRoaXMueCwgdGhpcy55KTtcclxuXHR9LFxyXG5cclxuXHQvLyBub24tZGVzdHJ1Y3RpdmUsIHJldHVybnMgYSBuZXcgcG9pbnRcclxuXHRhZGQ6IGZ1bmN0aW9uIChwb2ludCkge1xyXG5cdFx0cmV0dXJuIHRoaXMuY2xvbmUoKS5fYWRkKEwucG9pbnQocG9pbnQpKTtcclxuXHR9LFxyXG5cclxuXHQvLyBkZXN0cnVjdGl2ZSwgdXNlZCBkaXJlY3RseSBmb3IgcGVyZm9ybWFuY2UgaW4gc2l0dWF0aW9ucyB3aGVyZSBpdCdzIHNhZmUgdG8gbW9kaWZ5IGV4aXN0aW5nIHBvaW50XHJcblx0X2FkZDogZnVuY3Rpb24gKHBvaW50KSB7XHJcblx0XHR0aGlzLnggKz0gcG9pbnQueDtcclxuXHRcdHRoaXMueSArPSBwb2ludC55O1xyXG5cdFx0cmV0dXJuIHRoaXM7XHJcblx0fSxcclxuXHJcblx0c3VidHJhY3Q6IGZ1bmN0aW9uIChwb2ludCkge1xyXG5cdFx0cmV0dXJuIHRoaXMuY2xvbmUoKS5fc3VidHJhY3QoTC5wb2ludChwb2ludCkpO1xyXG5cdH0sXHJcblxyXG5cdF9zdWJ0cmFjdDogZnVuY3Rpb24gKHBvaW50KSB7XHJcblx0XHR0aGlzLnggLT0gcG9pbnQueDtcclxuXHRcdHRoaXMueSAtPSBwb2ludC55O1xyXG5cdFx0cmV0dXJuIHRoaXM7XHJcblx0fSxcclxuXHJcblx0ZGl2aWRlQnk6IGZ1bmN0aW9uIChudW0pIHtcclxuXHRcdHJldHVybiB0aGlzLmNsb25lKCkuX2RpdmlkZUJ5KG51bSk7XHJcblx0fSxcclxuXHJcblx0X2RpdmlkZUJ5OiBmdW5jdGlvbiAobnVtKSB7XHJcblx0XHR0aGlzLnggLz0gbnVtO1xyXG5cdFx0dGhpcy55IC89IG51bTtcclxuXHRcdHJldHVybiB0aGlzO1xyXG5cdH0sXHJcblxyXG5cdG11bHRpcGx5Qnk6IGZ1bmN0aW9uIChudW0pIHtcclxuXHRcdHJldHVybiB0aGlzLmNsb25lKCkuX211bHRpcGx5QnkobnVtKTtcclxuXHR9LFxyXG5cclxuXHRfbXVsdGlwbHlCeTogZnVuY3Rpb24gKG51bSkge1xyXG5cdFx0dGhpcy54ICo9IG51bTtcclxuXHRcdHRoaXMueSAqPSBudW07XHJcblx0XHRyZXR1cm4gdGhpcztcclxuXHR9LFxyXG5cclxuXHRyb3VuZDogZnVuY3Rpb24gKCkge1xyXG5cdFx0cmV0dXJuIHRoaXMuY2xvbmUoKS5fcm91bmQoKTtcclxuXHR9LFxyXG5cclxuXHRfcm91bmQ6IGZ1bmN0aW9uICgpIHtcclxuXHRcdHRoaXMueCA9IE1hdGgucm91bmQodGhpcy54KTtcclxuXHRcdHRoaXMueSA9IE1hdGgucm91bmQodGhpcy55KTtcclxuXHRcdHJldHVybiB0aGlzO1xyXG5cdH0sXHJcblxyXG5cdGZsb29yOiBmdW5jdGlvbiAoKSB7XHJcblx0XHRyZXR1cm4gdGhpcy5jbG9uZSgpLl9mbG9vcigpO1xyXG5cdH0sXHJcblxyXG5cdF9mbG9vcjogZnVuY3Rpb24gKCkge1xyXG5cdFx0dGhpcy54ID0gTWF0aC5mbG9vcih0aGlzLngpO1xyXG5cdFx0dGhpcy55ID0gTWF0aC5mbG9vcih0aGlzLnkpO1xyXG5cdFx0cmV0dXJuIHRoaXM7XHJcblx0fSxcclxuXHJcblx0ZGlzdGFuY2VUbzogZnVuY3Rpb24gKHBvaW50KSB7XHJcblx0XHRwb2ludCA9IEwucG9pbnQocG9pbnQpO1xyXG5cclxuXHRcdHZhciB4ID0gcG9pbnQueCAtIHRoaXMueCxcclxuXHRcdCAgICB5ID0gcG9pbnQueSAtIHRoaXMueTtcclxuXHJcblx0XHRyZXR1cm4gTWF0aC5zcXJ0KHggKiB4ICsgeSAqIHkpO1xyXG5cdH0sXHJcblxyXG5cdGVxdWFsczogZnVuY3Rpb24gKHBvaW50KSB7XHJcblx0XHRwb2ludCA9IEwucG9pbnQocG9pbnQpO1xyXG5cclxuXHRcdHJldHVybiBwb2ludC54ID09PSB0aGlzLnggJiZcclxuXHRcdCAgICAgICBwb2ludC55ID09PSB0aGlzLnk7XHJcblx0fSxcclxuXHJcblx0Y29udGFpbnM6IGZ1bmN0aW9uIChwb2ludCkge1xyXG5cdFx0cG9pbnQgPSBMLnBvaW50KHBvaW50KTtcclxuXHJcblx0XHRyZXR1cm4gTWF0aC5hYnMocG9pbnQueCkgPD0gTWF0aC5hYnModGhpcy54KSAmJlxyXG5cdFx0ICAgICAgIE1hdGguYWJzKHBvaW50LnkpIDw9IE1hdGguYWJzKHRoaXMueSk7XHJcblx0fSxcclxuXHJcblx0dG9TdHJpbmc6IGZ1bmN0aW9uICgpIHtcclxuXHRcdHJldHVybiAnUG9pbnQoJyArXHJcblx0XHQgICAgICAgIEwuVXRpbC5mb3JtYXROdW0odGhpcy54KSArICcsICcgK1xyXG5cdFx0ICAgICAgICBMLlV0aWwuZm9ybWF0TnVtKHRoaXMueSkgKyAnKSc7XHJcblx0fVxyXG59O1xyXG5cclxuTC5wb2ludCA9IGZ1bmN0aW9uICh4LCB5LCByb3VuZCkge1xyXG5cdGlmICh4IGluc3RhbmNlb2YgTC5Qb2ludCkge1xyXG5cdFx0cmV0dXJuIHg7XHJcblx0fVxyXG5cdGlmIChMLlV0aWwuaXNBcnJheSh4KSkge1xyXG5cdFx0cmV0dXJuIG5ldyBMLlBvaW50KHhbMF0sIHhbMV0pO1xyXG5cdH1cclxuXHRpZiAoeCA9PT0gdW5kZWZpbmVkIHx8IHggPT09IG51bGwpIHtcclxuXHRcdHJldHVybiB4O1xyXG5cdH1cclxuXHRyZXR1cm4gbmV3IEwuUG9pbnQoeCwgeSwgcm91bmQpO1xyXG59O1xyXG5cblxuLypcclxuICogTC5Cb3VuZHMgcmVwcmVzZW50cyBhIHJlY3Rhbmd1bGFyIGFyZWEgb24gdGhlIHNjcmVlbiBpbiBwaXhlbCBjb29yZGluYXRlcy5cclxuICovXHJcblxyXG5MLkJvdW5kcyA9IGZ1bmN0aW9uIChhLCBiKSB7IC8vKFBvaW50LCBQb2ludCkgb3IgUG9pbnRbXVxyXG5cdGlmICghYSkgeyByZXR1cm47IH1cclxuXHJcblx0dmFyIHBvaW50cyA9IGIgPyBbYSwgYl0gOiBhO1xyXG5cclxuXHRmb3IgKHZhciBpID0gMCwgbGVuID0gcG9pbnRzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XHJcblx0XHR0aGlzLmV4dGVuZChwb2ludHNbaV0pO1xyXG5cdH1cclxufTtcclxuXHJcbkwuQm91bmRzLnByb3RvdHlwZSA9IHtcclxuXHQvLyBleHRlbmQgdGhlIGJvdW5kcyB0byBjb250YWluIHRoZSBnaXZlbiBwb2ludFxyXG5cdGV4dGVuZDogZnVuY3Rpb24gKHBvaW50KSB7IC8vIChQb2ludClcclxuXHRcdHBvaW50ID0gTC5wb2ludChwb2ludCk7XHJcblxyXG5cdFx0aWYgKCF0aGlzLm1pbiAmJiAhdGhpcy5tYXgpIHtcclxuXHRcdFx0dGhpcy5taW4gPSBwb2ludC5jbG9uZSgpO1xyXG5cdFx0XHR0aGlzLm1heCA9IHBvaW50LmNsb25lKCk7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHR0aGlzLm1pbi54ID0gTWF0aC5taW4ocG9pbnQueCwgdGhpcy5taW4ueCk7XHJcblx0XHRcdHRoaXMubWF4LnggPSBNYXRoLm1heChwb2ludC54LCB0aGlzLm1heC54KTtcclxuXHRcdFx0dGhpcy5taW4ueSA9IE1hdGgubWluKHBvaW50LnksIHRoaXMubWluLnkpO1xyXG5cdFx0XHR0aGlzLm1heC55ID0gTWF0aC5tYXgocG9pbnQueSwgdGhpcy5tYXgueSk7XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gdGhpcztcclxuXHR9LFxyXG5cclxuXHRnZXRDZW50ZXI6IGZ1bmN0aW9uIChyb3VuZCkgeyAvLyAoQm9vbGVhbikgLT4gUG9pbnRcclxuXHRcdHJldHVybiBuZXcgTC5Qb2ludChcclxuXHRcdCAgICAgICAgKHRoaXMubWluLnggKyB0aGlzLm1heC54KSAvIDIsXHJcblx0XHQgICAgICAgICh0aGlzLm1pbi55ICsgdGhpcy5tYXgueSkgLyAyLCByb3VuZCk7XHJcblx0fSxcclxuXHJcblx0Z2V0Qm90dG9tTGVmdDogZnVuY3Rpb24gKCkgeyAvLyAtPiBQb2ludFxyXG5cdFx0cmV0dXJuIG5ldyBMLlBvaW50KHRoaXMubWluLngsIHRoaXMubWF4LnkpO1xyXG5cdH0sXHJcblxyXG5cdGdldFRvcFJpZ2h0OiBmdW5jdGlvbiAoKSB7IC8vIC0+IFBvaW50XHJcblx0XHRyZXR1cm4gbmV3IEwuUG9pbnQodGhpcy5tYXgueCwgdGhpcy5taW4ueSk7XHJcblx0fSxcclxuXHJcblx0Z2V0U2l6ZTogZnVuY3Rpb24gKCkge1xyXG5cdFx0cmV0dXJuIHRoaXMubWF4LnN1YnRyYWN0KHRoaXMubWluKTtcclxuXHR9LFxyXG5cclxuXHRjb250YWluczogZnVuY3Rpb24gKG9iaikgeyAvLyAoQm91bmRzKSBvciAoUG9pbnQpIC0+IEJvb2xlYW5cclxuXHRcdHZhciBtaW4sIG1heDtcclxuXHJcblx0XHRpZiAodHlwZW9mIG9ialswXSA9PT0gJ251bWJlcicgfHwgb2JqIGluc3RhbmNlb2YgTC5Qb2ludCkge1xyXG5cdFx0XHRvYmogPSBMLnBvaW50KG9iaik7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRvYmogPSBMLmJvdW5kcyhvYmopO1xyXG5cdFx0fVxyXG5cclxuXHRcdGlmIChvYmogaW5zdGFuY2VvZiBMLkJvdW5kcykge1xyXG5cdFx0XHRtaW4gPSBvYmoubWluO1xyXG5cdFx0XHRtYXggPSBvYmoubWF4O1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0bWluID0gbWF4ID0gb2JqO1xyXG5cdFx0fVxyXG5cclxuXHRcdHJldHVybiAobWluLnggPj0gdGhpcy5taW4ueCkgJiZcclxuXHRcdCAgICAgICAobWF4LnggPD0gdGhpcy5tYXgueCkgJiZcclxuXHRcdCAgICAgICAobWluLnkgPj0gdGhpcy5taW4ueSkgJiZcclxuXHRcdCAgICAgICAobWF4LnkgPD0gdGhpcy5tYXgueSk7XHJcblx0fSxcclxuXHJcblx0aW50ZXJzZWN0czogZnVuY3Rpb24gKGJvdW5kcykgeyAvLyAoQm91bmRzKSAtPiBCb29sZWFuXHJcblx0XHRib3VuZHMgPSBMLmJvdW5kcyhib3VuZHMpO1xyXG5cclxuXHRcdHZhciBtaW4gPSB0aGlzLm1pbixcclxuXHRcdCAgICBtYXggPSB0aGlzLm1heCxcclxuXHRcdCAgICBtaW4yID0gYm91bmRzLm1pbixcclxuXHRcdCAgICBtYXgyID0gYm91bmRzLm1heCxcclxuXHRcdCAgICB4SW50ZXJzZWN0cyA9IChtYXgyLnggPj0gbWluLngpICYmIChtaW4yLnggPD0gbWF4LngpLFxyXG5cdFx0ICAgIHlJbnRlcnNlY3RzID0gKG1heDIueSA+PSBtaW4ueSkgJiYgKG1pbjIueSA8PSBtYXgueSk7XHJcblxyXG5cdFx0cmV0dXJuIHhJbnRlcnNlY3RzICYmIHlJbnRlcnNlY3RzO1xyXG5cdH0sXHJcblxyXG5cdGlzVmFsaWQ6IGZ1bmN0aW9uICgpIHtcclxuXHRcdHJldHVybiAhISh0aGlzLm1pbiAmJiB0aGlzLm1heCk7XHJcblx0fVxyXG59O1xyXG5cclxuTC5ib3VuZHMgPSBmdW5jdGlvbiAoYSwgYikgeyAvLyAoQm91bmRzKSBvciAoUG9pbnQsIFBvaW50KSBvciAoUG9pbnRbXSlcclxuXHRpZiAoIWEgfHwgYSBpbnN0YW5jZW9mIEwuQm91bmRzKSB7XHJcblx0XHRyZXR1cm4gYTtcclxuXHR9XHJcblx0cmV0dXJuIG5ldyBMLkJvdW5kcyhhLCBiKTtcclxufTtcclxuXG5cbi8qXHJcbiAqIEwuVHJhbnNmb3JtYXRpb24gaXMgYW4gdXRpbGl0eSBjbGFzcyB0byBwZXJmb3JtIHNpbXBsZSBwb2ludCB0cmFuc2Zvcm1hdGlvbnMgdGhyb3VnaCBhIDJkLW1hdHJpeC5cclxuICovXHJcblxyXG5MLlRyYW5zZm9ybWF0aW9uID0gZnVuY3Rpb24gKGEsIGIsIGMsIGQpIHtcclxuXHR0aGlzLl9hID0gYTtcclxuXHR0aGlzLl9iID0gYjtcclxuXHR0aGlzLl9jID0gYztcclxuXHR0aGlzLl9kID0gZDtcclxufTtcclxuXHJcbkwuVHJhbnNmb3JtYXRpb24ucHJvdG90eXBlID0ge1xyXG5cdHRyYW5zZm9ybTogZnVuY3Rpb24gKHBvaW50LCBzY2FsZSkgeyAvLyAoUG9pbnQsIE51bWJlcikgLT4gUG9pbnRcclxuXHRcdHJldHVybiB0aGlzLl90cmFuc2Zvcm0ocG9pbnQuY2xvbmUoKSwgc2NhbGUpO1xyXG5cdH0sXHJcblxyXG5cdC8vIGRlc3RydWN0aXZlIHRyYW5zZm9ybSAoZmFzdGVyKVxyXG5cdF90cmFuc2Zvcm06IGZ1bmN0aW9uIChwb2ludCwgc2NhbGUpIHtcclxuXHRcdHNjYWxlID0gc2NhbGUgfHwgMTtcclxuXHRcdHBvaW50LnggPSBzY2FsZSAqICh0aGlzLl9hICogcG9pbnQueCArIHRoaXMuX2IpO1xyXG5cdFx0cG9pbnQueSA9IHNjYWxlICogKHRoaXMuX2MgKiBwb2ludC55ICsgdGhpcy5fZCk7XHJcblx0XHRyZXR1cm4gcG9pbnQ7XHJcblx0fSxcclxuXHJcblx0dW50cmFuc2Zvcm06IGZ1bmN0aW9uIChwb2ludCwgc2NhbGUpIHtcclxuXHRcdHNjYWxlID0gc2NhbGUgfHwgMTtcclxuXHRcdHJldHVybiBuZXcgTC5Qb2ludChcclxuXHRcdCAgICAgICAgKHBvaW50LnggLyBzY2FsZSAtIHRoaXMuX2IpIC8gdGhpcy5fYSxcclxuXHRcdCAgICAgICAgKHBvaW50LnkgLyBzY2FsZSAtIHRoaXMuX2QpIC8gdGhpcy5fYyk7XHJcblx0fVxyXG59O1xyXG5cblxuLypcclxuICogTC5Eb21VdGlsIGNvbnRhaW5zIHZhcmlvdXMgdXRpbGl0eSBmdW5jdGlvbnMgZm9yIHdvcmtpbmcgd2l0aCBET00uXHJcbiAqL1xyXG5cclxuTC5Eb21VdGlsID0ge1xyXG5cdGdldDogZnVuY3Rpb24gKGlkKSB7XHJcblx0XHRyZXR1cm4gKHR5cGVvZiBpZCA9PT0gJ3N0cmluZycgPyBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChpZCkgOiBpZCk7XHJcblx0fSxcclxuXHJcblx0Z2V0U3R5bGU6IGZ1bmN0aW9uIChlbCwgc3R5bGUpIHtcclxuXHJcblx0XHR2YXIgdmFsdWUgPSBlbC5zdHlsZVtzdHlsZV07XHJcblxyXG5cdFx0aWYgKCF2YWx1ZSAmJiBlbC5jdXJyZW50U3R5bGUpIHtcclxuXHRcdFx0dmFsdWUgPSBlbC5jdXJyZW50U3R5bGVbc3R5bGVdO1xyXG5cdFx0fVxyXG5cclxuXHRcdGlmICgoIXZhbHVlIHx8IHZhbHVlID09PSAnYXV0bycpICYmIGRvY3VtZW50LmRlZmF1bHRWaWV3KSB7XHJcblx0XHRcdHZhciBjc3MgPSBkb2N1bWVudC5kZWZhdWx0Vmlldy5nZXRDb21wdXRlZFN0eWxlKGVsLCBudWxsKTtcclxuXHRcdFx0dmFsdWUgPSBjc3MgPyBjc3Nbc3R5bGVdIDogbnVsbDtcclxuXHRcdH1cclxuXHJcblx0XHRyZXR1cm4gdmFsdWUgPT09ICdhdXRvJyA/IG51bGwgOiB2YWx1ZTtcclxuXHR9LFxyXG5cclxuXHRnZXRWaWV3cG9ydE9mZnNldDogZnVuY3Rpb24gKGVsZW1lbnQpIHtcclxuXHJcblx0XHR2YXIgdG9wID0gMCxcclxuXHRcdCAgICBsZWZ0ID0gMCxcclxuXHRcdCAgICBlbCA9IGVsZW1lbnQsXHJcblx0XHQgICAgZG9jQm9keSA9IGRvY3VtZW50LmJvZHksXHJcblx0XHQgICAgZG9jRWwgPSBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQsXHJcblx0XHQgICAgcG9zO1xyXG5cclxuXHRcdGRvIHtcclxuXHRcdFx0dG9wICArPSBlbC5vZmZzZXRUb3AgIHx8IDA7XHJcblx0XHRcdGxlZnQgKz0gZWwub2Zmc2V0TGVmdCB8fCAwO1xyXG5cclxuXHRcdFx0Ly9hZGQgYm9yZGVyc1xyXG5cdFx0XHR0b3AgKz0gcGFyc2VJbnQoTC5Eb21VdGlsLmdldFN0eWxlKGVsLCAnYm9yZGVyVG9wV2lkdGgnKSwgMTApIHx8IDA7XHJcblx0XHRcdGxlZnQgKz0gcGFyc2VJbnQoTC5Eb21VdGlsLmdldFN0eWxlKGVsLCAnYm9yZGVyTGVmdFdpZHRoJyksIDEwKSB8fCAwO1xyXG5cclxuXHRcdFx0cG9zID0gTC5Eb21VdGlsLmdldFN0eWxlKGVsLCAncG9zaXRpb24nKTtcclxuXHJcblx0XHRcdGlmIChlbC5vZmZzZXRQYXJlbnQgPT09IGRvY0JvZHkgJiYgcG9zID09PSAnYWJzb2x1dGUnKSB7IGJyZWFrOyB9XHJcblxyXG5cdFx0XHRpZiAocG9zID09PSAnZml4ZWQnKSB7XHJcblx0XHRcdFx0dG9wICArPSBkb2NCb2R5LnNjcm9sbFRvcCAgfHwgZG9jRWwuc2Nyb2xsVG9wICB8fCAwO1xyXG5cdFx0XHRcdGxlZnQgKz0gZG9jQm9keS5zY3JvbGxMZWZ0IHx8IGRvY0VsLnNjcm9sbExlZnQgfHwgMDtcclxuXHRcdFx0XHRicmVhaztcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0aWYgKHBvcyA9PT0gJ3JlbGF0aXZlJyAmJiAhZWwub2Zmc2V0TGVmdCkge1xyXG5cdFx0XHRcdHZhciB3aWR0aCA9IEwuRG9tVXRpbC5nZXRTdHlsZShlbCwgJ3dpZHRoJyksXHJcblx0XHRcdFx0ICAgIG1heFdpZHRoID0gTC5Eb21VdGlsLmdldFN0eWxlKGVsLCAnbWF4LXdpZHRoJyksXHJcblx0XHRcdFx0ICAgIHIgPSBlbC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcclxuXHJcblx0XHRcdFx0aWYgKHdpZHRoICE9PSAnbm9uZScgfHwgbWF4V2lkdGggIT09ICdub25lJykge1xyXG5cdFx0XHRcdFx0bGVmdCArPSByLmxlZnQgKyBlbC5jbGllbnRMZWZ0O1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0Ly9jYWxjdWxhdGUgZnVsbCB5IG9mZnNldCBzaW5jZSB3ZSdyZSBicmVha2luZyBvdXQgb2YgdGhlIGxvb3BcclxuXHRcdFx0XHR0b3AgKz0gci50b3AgKyAoZG9jQm9keS5zY3JvbGxUb3AgIHx8IGRvY0VsLnNjcm9sbFRvcCAgfHwgMCk7XHJcblxyXG5cdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRlbCA9IGVsLm9mZnNldFBhcmVudDtcclxuXHJcblx0XHR9IHdoaWxlIChlbCk7XHJcblxyXG5cdFx0ZWwgPSBlbGVtZW50O1xyXG5cclxuXHRcdGRvIHtcclxuXHRcdFx0aWYgKGVsID09PSBkb2NCb2R5KSB7IGJyZWFrOyB9XHJcblxyXG5cdFx0XHR0b3AgIC09IGVsLnNjcm9sbFRvcCAgfHwgMDtcclxuXHRcdFx0bGVmdCAtPSBlbC5zY3JvbGxMZWZ0IHx8IDA7XHJcblxyXG5cdFx0XHRlbCA9IGVsLnBhcmVudE5vZGU7XHJcblx0XHR9IHdoaWxlIChlbCk7XHJcblxyXG5cdFx0cmV0dXJuIG5ldyBMLlBvaW50KGxlZnQsIHRvcCk7XHJcblx0fSxcclxuXHJcblx0ZG9jdW1lbnRJc0x0cjogZnVuY3Rpb24gKCkge1xyXG5cdFx0aWYgKCFMLkRvbVV0aWwuX2RvY0lzTHRyQ2FjaGVkKSB7XHJcblx0XHRcdEwuRG9tVXRpbC5fZG9jSXNMdHJDYWNoZWQgPSB0cnVlO1xyXG5cdFx0XHRMLkRvbVV0aWwuX2RvY0lzTHRyID0gTC5Eb21VdGlsLmdldFN0eWxlKGRvY3VtZW50LmJvZHksICdkaXJlY3Rpb24nKSA9PT0gJ2x0cic7XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gTC5Eb21VdGlsLl9kb2NJc0x0cjtcclxuXHR9LFxyXG5cclxuXHRjcmVhdGU6IGZ1bmN0aW9uICh0YWdOYW1lLCBjbGFzc05hbWUsIGNvbnRhaW5lcikge1xyXG5cclxuXHRcdHZhciBlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQodGFnTmFtZSk7XHJcblx0XHRlbC5jbGFzc05hbWUgPSBjbGFzc05hbWU7XHJcblxyXG5cdFx0aWYgKGNvbnRhaW5lcikge1xyXG5cdFx0XHRjb250YWluZXIuYXBwZW5kQ2hpbGQoZWwpO1xyXG5cdFx0fVxyXG5cclxuXHRcdHJldHVybiBlbDtcclxuXHR9LFxyXG5cclxuXHRoYXNDbGFzczogZnVuY3Rpb24gKGVsLCBuYW1lKSB7XHJcblx0XHRpZiAoZWwuY2xhc3NMaXN0ICE9PSB1bmRlZmluZWQpIHtcclxuXHRcdFx0cmV0dXJuIGVsLmNsYXNzTGlzdC5jb250YWlucyhuYW1lKTtcclxuXHRcdH1cclxuXHRcdHZhciBjbGFzc05hbWUgPSBMLkRvbVV0aWwuX2dldENsYXNzKGVsKTtcclxuXHRcdHJldHVybiBjbGFzc05hbWUubGVuZ3RoID4gMCAmJiBuZXcgUmVnRXhwKCcoXnxcXFxccyknICsgbmFtZSArICcoXFxcXHN8JCknKS50ZXN0KGNsYXNzTmFtZSk7XHJcblx0fSxcclxuXHJcblx0YWRkQ2xhc3M6IGZ1bmN0aW9uIChlbCwgbmFtZSkge1xyXG5cdFx0aWYgKGVsLmNsYXNzTGlzdCAhPT0gdW5kZWZpbmVkKSB7XHJcblx0XHRcdHZhciBjbGFzc2VzID0gTC5VdGlsLnNwbGl0V29yZHMobmFtZSk7XHJcblx0XHRcdGZvciAodmFyIGkgPSAwLCBsZW4gPSBjbGFzc2VzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XHJcblx0XHRcdFx0ZWwuY2xhc3NMaXN0LmFkZChjbGFzc2VzW2ldKTtcclxuXHRcdFx0fVxyXG5cdFx0fSBlbHNlIGlmICghTC5Eb21VdGlsLmhhc0NsYXNzKGVsLCBuYW1lKSkge1xyXG5cdFx0XHR2YXIgY2xhc3NOYW1lID0gTC5Eb21VdGlsLl9nZXRDbGFzcyhlbCk7XHJcblx0XHRcdEwuRG9tVXRpbC5fc2V0Q2xhc3MoZWwsIChjbGFzc05hbWUgPyBjbGFzc05hbWUgKyAnICcgOiAnJykgKyBuYW1lKTtcclxuXHRcdH1cclxuXHR9LFxyXG5cclxuXHRyZW1vdmVDbGFzczogZnVuY3Rpb24gKGVsLCBuYW1lKSB7XHJcblx0XHRpZiAoZWwuY2xhc3NMaXN0ICE9PSB1bmRlZmluZWQpIHtcclxuXHRcdFx0ZWwuY2xhc3NMaXN0LnJlbW92ZShuYW1lKTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdEwuRG9tVXRpbC5fc2V0Q2xhc3MoZWwsIEwuVXRpbC50cmltKCgnICcgKyBMLkRvbVV0aWwuX2dldENsYXNzKGVsKSArICcgJykucmVwbGFjZSgnICcgKyBuYW1lICsgJyAnLCAnICcpKSk7XHJcblx0XHR9XHJcblx0fSxcclxuXHJcblx0X3NldENsYXNzOiBmdW5jdGlvbiAoZWwsIG5hbWUpIHtcclxuXHRcdGlmIChlbC5jbGFzc05hbWUuYmFzZVZhbCA9PT0gdW5kZWZpbmVkKSB7XHJcblx0XHRcdGVsLmNsYXNzTmFtZSA9IG5hbWU7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHQvLyBpbiBjYXNlIG9mIFNWRyBlbGVtZW50XHJcblx0XHRcdGVsLmNsYXNzTmFtZS5iYXNlVmFsID0gbmFtZTtcclxuXHRcdH1cclxuXHR9LFxyXG5cclxuXHRfZ2V0Q2xhc3M6IGZ1bmN0aW9uIChlbCkge1xyXG5cdFx0cmV0dXJuIGVsLmNsYXNzTmFtZS5iYXNlVmFsID09PSB1bmRlZmluZWQgPyBlbC5jbGFzc05hbWUgOiBlbC5jbGFzc05hbWUuYmFzZVZhbDtcclxuXHR9LFxyXG5cclxuXHRzZXRPcGFjaXR5OiBmdW5jdGlvbiAoZWwsIHZhbHVlKSB7XHJcblxyXG5cdFx0aWYgKCdvcGFjaXR5JyBpbiBlbC5zdHlsZSkge1xyXG5cdFx0XHRlbC5zdHlsZS5vcGFjaXR5ID0gdmFsdWU7XHJcblxyXG5cdFx0fSBlbHNlIGlmICgnZmlsdGVyJyBpbiBlbC5zdHlsZSkge1xyXG5cclxuXHRcdFx0dmFyIGZpbHRlciA9IGZhbHNlLFxyXG5cdFx0XHQgICAgZmlsdGVyTmFtZSA9ICdEWEltYWdlVHJhbnNmb3JtLk1pY3Jvc29mdC5BbHBoYSc7XHJcblxyXG5cdFx0XHQvLyBmaWx0ZXJzIGNvbGxlY3Rpb24gdGhyb3dzIGFuIGVycm9yIGlmIHdlIHRyeSB0byByZXRyaWV2ZSBhIGZpbHRlciB0aGF0IGRvZXNuJ3QgZXhpc3RcclxuXHRcdFx0dHJ5IHtcclxuXHRcdFx0XHRmaWx0ZXIgPSBlbC5maWx0ZXJzLml0ZW0oZmlsdGVyTmFtZSk7XHJcblx0XHRcdH0gY2F0Y2ggKGUpIHtcclxuXHRcdFx0XHQvLyBkb24ndCBzZXQgb3BhY2l0eSB0byAxIGlmIHdlIGhhdmVuJ3QgYWxyZWFkeSBzZXQgYW4gb3BhY2l0eSxcclxuXHRcdFx0XHQvLyBpdCBpc24ndCBuZWVkZWQgYW5kIGJyZWFrcyB0cmFuc3BhcmVudCBwbmdzLlxyXG5cdFx0XHRcdGlmICh2YWx1ZSA9PT0gMSkgeyByZXR1cm47IH1cclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0dmFsdWUgPSBNYXRoLnJvdW5kKHZhbHVlICogMTAwKTtcclxuXHJcblx0XHRcdGlmIChmaWx0ZXIpIHtcclxuXHRcdFx0XHRmaWx0ZXIuRW5hYmxlZCA9ICh2YWx1ZSAhPT0gMTAwKTtcclxuXHRcdFx0XHRmaWx0ZXIuT3BhY2l0eSA9IHZhbHVlO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdGVsLnN0eWxlLmZpbHRlciArPSAnIHByb2dpZDonICsgZmlsdGVyTmFtZSArICcob3BhY2l0eT0nICsgdmFsdWUgKyAnKSc7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9LFxyXG5cclxuXHR0ZXN0UHJvcDogZnVuY3Rpb24gKHByb3BzKSB7XHJcblxyXG5cdFx0dmFyIHN0eWxlID0gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LnN0eWxlO1xyXG5cclxuXHRcdGZvciAodmFyIGkgPSAwOyBpIDwgcHJvcHMubGVuZ3RoOyBpKyspIHtcclxuXHRcdFx0aWYgKHByb3BzW2ldIGluIHN0eWxlKSB7XHJcblx0XHRcdFx0cmV0dXJuIHByb3BzW2ldO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gZmFsc2U7XHJcblx0fSxcclxuXHJcblx0Z2V0VHJhbnNsYXRlU3RyaW5nOiBmdW5jdGlvbiAocG9pbnQpIHtcclxuXHRcdC8vIG9uIFdlYktpdCBicm93c2VycyAoQ2hyb21lL1NhZmFyaS9pT1MgU2FmYXJpL0FuZHJvaWQpIHVzaW5nIHRyYW5zbGF0ZTNkIGluc3RlYWQgb2YgdHJhbnNsYXRlXHJcblx0XHQvLyBtYWtlcyBhbmltYXRpb24gc21vb3RoZXIgYXMgaXQgZW5zdXJlcyBIVyBhY2NlbCBpcyB1c2VkLiBGaXJlZm94IDEzIGRvZXNuJ3QgY2FyZVxyXG5cdFx0Ly8gKHNhbWUgc3BlZWQgZWl0aGVyIHdheSksIE9wZXJhIDEyIGRvZXNuJ3Qgc3VwcG9ydCB0cmFuc2xhdGUzZFxyXG5cclxuXHRcdHZhciBpczNkID0gTC5Ccm93c2VyLndlYmtpdDNkLFxyXG5cdFx0ICAgIG9wZW4gPSAndHJhbnNsYXRlJyArIChpczNkID8gJzNkJyA6ICcnKSArICcoJyxcclxuXHRcdCAgICBjbG9zZSA9IChpczNkID8gJywwJyA6ICcnKSArICcpJztcclxuXHJcblx0XHRyZXR1cm4gb3BlbiArIHBvaW50LnggKyAncHgsJyArIHBvaW50LnkgKyAncHgnICsgY2xvc2U7XHJcblx0fSxcclxuXHJcblx0Z2V0U2NhbGVTdHJpbmc6IGZ1bmN0aW9uIChzY2FsZSwgb3JpZ2luKSB7XHJcblxyXG5cdFx0dmFyIHByZVRyYW5zbGF0ZVN0ciA9IEwuRG9tVXRpbC5nZXRUcmFuc2xhdGVTdHJpbmcob3JpZ2luLmFkZChvcmlnaW4ubXVsdGlwbHlCeSgtMSAqIHNjYWxlKSkpLFxyXG5cdFx0ICAgIHNjYWxlU3RyID0gJyBzY2FsZSgnICsgc2NhbGUgKyAnKSAnO1xyXG5cclxuXHRcdHJldHVybiBwcmVUcmFuc2xhdGVTdHIgKyBzY2FsZVN0cjtcclxuXHR9LFxyXG5cclxuXHRzZXRQb3NpdGlvbjogZnVuY3Rpb24gKGVsLCBwb2ludCwgZGlzYWJsZTNEKSB7IC8vIChIVE1MRWxlbWVudCwgUG9pbnRbLCBCb29sZWFuXSlcclxuXHJcblx0XHQvLyBqc2hpbnQgY2FtZWxjYXNlOiBmYWxzZVxyXG5cdFx0ZWwuX2xlYWZsZXRfcG9zID0gcG9pbnQ7XHJcblxyXG5cdFx0aWYgKCFkaXNhYmxlM0QgJiYgTC5Ccm93c2VyLmFueTNkKSB7XHJcblx0XHRcdGVsLnN0eWxlW0wuRG9tVXRpbC5UUkFOU0ZPUk1dID0gIEwuRG9tVXRpbC5nZXRUcmFuc2xhdGVTdHJpbmcocG9pbnQpO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0ZWwuc3R5bGUubGVmdCA9IHBvaW50LnggKyAncHgnO1xyXG5cdFx0XHRlbC5zdHlsZS50b3AgPSBwb2ludC55ICsgJ3B4JztcclxuXHRcdH1cclxuXHR9LFxyXG5cclxuXHRnZXRQb3NpdGlvbjogZnVuY3Rpb24gKGVsKSB7XHJcblx0XHQvLyB0aGlzIG1ldGhvZCBpcyBvbmx5IHVzZWQgZm9yIGVsZW1lbnRzIHByZXZpb3VzbHkgcG9zaXRpb25lZCB1c2luZyBzZXRQb3NpdGlvbixcclxuXHRcdC8vIHNvIGl0J3Mgc2FmZSB0byBjYWNoZSB0aGUgcG9zaXRpb24gZm9yIHBlcmZvcm1hbmNlXHJcblxyXG5cdFx0Ly8ganNoaW50IGNhbWVsY2FzZTogZmFsc2VcclxuXHRcdHJldHVybiBlbC5fbGVhZmxldF9wb3M7XHJcblx0fVxyXG59O1xyXG5cclxuXHJcbi8vIHByZWZpeCBzdHlsZSBwcm9wZXJ0eSBuYW1lc1xyXG5cclxuTC5Eb21VdGlsLlRSQU5TRk9STSA9IEwuRG9tVXRpbC50ZXN0UHJvcChcclxuICAgICAgICBbJ3RyYW5zZm9ybScsICdXZWJraXRUcmFuc2Zvcm0nLCAnT1RyYW5zZm9ybScsICdNb3pUcmFuc2Zvcm0nLCAnbXNUcmFuc2Zvcm0nXSk7XHJcblxyXG4vLyB3ZWJraXRUcmFuc2l0aW9uIGNvbWVzIGZpcnN0IGJlY2F1c2Ugc29tZSBicm93c2VyIHZlcnNpb25zIHRoYXQgZHJvcCB2ZW5kb3IgcHJlZml4IGRvbid0IGRvXHJcbi8vIHRoZSBzYW1lIGZvciB0aGUgdHJhbnNpdGlvbmVuZCBldmVudCwgaW4gcGFydGljdWxhciB0aGUgQW5kcm9pZCA0LjEgc3RvY2sgYnJvd3NlclxyXG5cclxuTC5Eb21VdGlsLlRSQU5TSVRJT04gPSBMLkRvbVV0aWwudGVzdFByb3AoXHJcbiAgICAgICAgWyd3ZWJraXRUcmFuc2l0aW9uJywgJ3RyYW5zaXRpb24nLCAnT1RyYW5zaXRpb24nLCAnTW96VHJhbnNpdGlvbicsICdtc1RyYW5zaXRpb24nXSk7XHJcblxyXG5MLkRvbVV0aWwuVFJBTlNJVElPTl9FTkQgPVxyXG4gICAgICAgIEwuRG9tVXRpbC5UUkFOU0lUSU9OID09PSAnd2Via2l0VHJhbnNpdGlvbicgfHwgTC5Eb21VdGlsLlRSQU5TSVRJT04gPT09ICdPVHJhbnNpdGlvbicgP1xyXG4gICAgICAgIEwuRG9tVXRpbC5UUkFOU0lUSU9OICsgJ0VuZCcgOiAndHJhbnNpdGlvbmVuZCc7XHJcblxyXG4oZnVuY3Rpb24gKCkge1xyXG4gICAgaWYgKCdvbnNlbGVjdHN0YXJ0JyBpbiBkb2N1bWVudCkge1xyXG4gICAgICAgIEwuZXh0ZW5kKEwuRG9tVXRpbCwge1xyXG4gICAgICAgICAgICBkaXNhYmxlVGV4dFNlbGVjdGlvbjogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgTC5Eb21FdmVudC5vbih3aW5kb3csICdzZWxlY3RzdGFydCcsIEwuRG9tRXZlbnQucHJldmVudERlZmF1bHQpO1xyXG4gICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgZW5hYmxlVGV4dFNlbGVjdGlvbjogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgTC5Eb21FdmVudC5vZmYod2luZG93LCAnc2VsZWN0c3RhcnQnLCBMLkRvbUV2ZW50LnByZXZlbnREZWZhdWx0KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICB2YXIgdXNlclNlbGVjdFByb3BlcnR5ID0gTC5Eb21VdGlsLnRlc3RQcm9wKFxyXG4gICAgICAgICAgICBbJ3VzZXJTZWxlY3QnLCAnV2Via2l0VXNlclNlbGVjdCcsICdPVXNlclNlbGVjdCcsICdNb3pVc2VyU2VsZWN0JywgJ21zVXNlclNlbGVjdCddKTtcclxuXHJcbiAgICAgICAgTC5leHRlbmQoTC5Eb21VdGlsLCB7XHJcbiAgICAgICAgICAgIGRpc2FibGVUZXh0U2VsZWN0aW9uOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAodXNlclNlbGVjdFByb3BlcnR5KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHN0eWxlID0gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LnN0eWxlO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3VzZXJTZWxlY3QgPSBzdHlsZVt1c2VyU2VsZWN0UHJvcGVydHldO1xyXG4gICAgICAgICAgICAgICAgICAgIHN0eWxlW3VzZXJTZWxlY3RQcm9wZXJ0eV0gPSAnbm9uZSc7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICBlbmFibGVUZXh0U2VsZWN0aW9uOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAodXNlclNlbGVjdFByb3BlcnR5KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LnN0eWxlW3VzZXJTZWxlY3RQcm9wZXJ0eV0gPSB0aGlzLl91c2VyU2VsZWN0O1xyXG4gICAgICAgICAgICAgICAgICAgIGRlbGV0ZSB0aGlzLl91c2VyU2VsZWN0O1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG5cdEwuZXh0ZW5kKEwuRG9tVXRpbCwge1xyXG5cdFx0ZGlzYWJsZUltYWdlRHJhZzogZnVuY3Rpb24gKCkge1xyXG5cdFx0XHRMLkRvbUV2ZW50Lm9uKHdpbmRvdywgJ2RyYWdzdGFydCcsIEwuRG9tRXZlbnQucHJldmVudERlZmF1bHQpO1xyXG5cdFx0fSxcclxuXHJcblx0XHRlbmFibGVJbWFnZURyYWc6IGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0TC5Eb21FdmVudC5vZmYod2luZG93LCAnZHJhZ3N0YXJ0JywgTC5Eb21FdmVudC5wcmV2ZW50RGVmYXVsdCk7XHJcblx0XHR9XHJcblx0fSk7XHJcbn0pKCk7XHJcblxuXG4vKlxyXG4gKiBMLkxhdExuZyByZXByZXNlbnRzIGEgZ2VvZ3JhcGhpY2FsIHBvaW50IHdpdGggbGF0aXR1ZGUgYW5kIGxvbmdpdHVkZSBjb29yZGluYXRlcy5cclxuICovXHJcblxyXG5MLkxhdExuZyA9IGZ1bmN0aW9uIChsYXQsIGxuZywgYWx0KSB7IC8vIChOdW1iZXIsIE51bWJlciwgTnVtYmVyKVxyXG5cdGxhdCA9IHBhcnNlRmxvYXQobGF0KTtcclxuXHRsbmcgPSBwYXJzZUZsb2F0KGxuZyk7XHJcblxyXG5cdGlmIChpc05hTihsYXQpIHx8IGlzTmFOKGxuZykpIHtcclxuXHRcdHRocm93IG5ldyBFcnJvcignSW52YWxpZCBMYXRMbmcgb2JqZWN0OiAoJyArIGxhdCArICcsICcgKyBsbmcgKyAnKScpO1xyXG5cdH1cclxuXHJcblx0dGhpcy5sYXQgPSBsYXQ7XHJcblx0dGhpcy5sbmcgPSBsbmc7XHJcblxyXG5cdGlmIChhbHQgIT09IHVuZGVmaW5lZCkge1xyXG5cdFx0dGhpcy5hbHQgPSBwYXJzZUZsb2F0KGFsdCk7XHJcblx0fVxyXG59O1xyXG5cclxuTC5leHRlbmQoTC5MYXRMbmcsIHtcclxuXHRERUdfVE9fUkFEOiBNYXRoLlBJIC8gMTgwLFxyXG5cdFJBRF9UT19ERUc6IDE4MCAvIE1hdGguUEksXHJcblx0TUFYX01BUkdJTjogMS4wRS05IC8vIG1heCBtYXJnaW4gb2YgZXJyb3IgZm9yIHRoZSBcImVxdWFsc1wiIGNoZWNrXHJcbn0pO1xyXG5cclxuTC5MYXRMbmcucHJvdG90eXBlID0ge1xyXG5cdGVxdWFsczogZnVuY3Rpb24gKG9iaikgeyAvLyAoTGF0TG5nKSAtPiBCb29sZWFuXHJcblx0XHRpZiAoIW9iaikgeyByZXR1cm4gZmFsc2U7IH1cclxuXHJcblx0XHRvYmogPSBMLmxhdExuZyhvYmopO1xyXG5cclxuXHRcdHZhciBtYXJnaW4gPSBNYXRoLm1heChcclxuXHRcdCAgICAgICAgTWF0aC5hYnModGhpcy5sYXQgLSBvYmoubGF0KSxcclxuXHRcdCAgICAgICAgTWF0aC5hYnModGhpcy5sbmcgLSBvYmoubG5nKSk7XHJcblxyXG5cdFx0cmV0dXJuIG1hcmdpbiA8PSBMLkxhdExuZy5NQVhfTUFSR0lOO1xyXG5cdH0sXHJcblxyXG5cdHRvU3RyaW5nOiBmdW5jdGlvbiAocHJlY2lzaW9uKSB7IC8vIChOdW1iZXIpIC0+IFN0cmluZ1xyXG5cdFx0cmV0dXJuICdMYXRMbmcoJyArXHJcblx0XHQgICAgICAgIEwuVXRpbC5mb3JtYXROdW0odGhpcy5sYXQsIHByZWNpc2lvbikgKyAnLCAnICtcclxuXHRcdCAgICAgICAgTC5VdGlsLmZvcm1hdE51bSh0aGlzLmxuZywgcHJlY2lzaW9uKSArICcpJztcclxuXHR9LFxyXG5cclxuXHQvLyBIYXZlcnNpbmUgZGlzdGFuY2UgZm9ybXVsYSwgc2VlIGh0dHA6Ly9lbi53aWtpcGVkaWEub3JnL3dpa2kvSGF2ZXJzaW5lX2Zvcm11bGFcclxuXHQvLyBUT0RPIG1vdmUgdG8gcHJvamVjdGlvbiBjb2RlLCBMYXRMbmcgc2hvdWxkbid0IGtub3cgYWJvdXQgRWFydGhcclxuXHRkaXN0YW5jZVRvOiBmdW5jdGlvbiAob3RoZXIpIHsgLy8gKExhdExuZykgLT4gTnVtYmVyXHJcblx0XHRvdGhlciA9IEwubGF0TG5nKG90aGVyKTtcclxuXHJcblx0XHR2YXIgUiA9IDYzNzgxMzcsIC8vIGVhcnRoIHJhZGl1cyBpbiBtZXRlcnNcclxuXHRcdCAgICBkMnIgPSBMLkxhdExuZy5ERUdfVE9fUkFELFxyXG5cdFx0ICAgIGRMYXQgPSAob3RoZXIubGF0IC0gdGhpcy5sYXQpICogZDJyLFxyXG5cdFx0ICAgIGRMb24gPSAob3RoZXIubG5nIC0gdGhpcy5sbmcpICogZDJyLFxyXG5cdFx0ICAgIGxhdDEgPSB0aGlzLmxhdCAqIGQycixcclxuXHRcdCAgICBsYXQyID0gb3RoZXIubGF0ICogZDJyLFxyXG5cdFx0ICAgIHNpbjEgPSBNYXRoLnNpbihkTGF0IC8gMiksXHJcblx0XHQgICAgc2luMiA9IE1hdGguc2luKGRMb24gLyAyKTtcclxuXHJcblx0XHR2YXIgYSA9IHNpbjEgKiBzaW4xICsgc2luMiAqIHNpbjIgKiBNYXRoLmNvcyhsYXQxKSAqIE1hdGguY29zKGxhdDIpO1xyXG5cclxuXHRcdHJldHVybiBSICogMiAqIE1hdGguYXRhbjIoTWF0aC5zcXJ0KGEpLCBNYXRoLnNxcnQoMSAtIGEpKTtcclxuXHR9LFxyXG5cclxuXHR3cmFwOiBmdW5jdGlvbiAoYSwgYikgeyAvLyAoTnVtYmVyLCBOdW1iZXIpIC0+IExhdExuZ1xyXG5cdFx0dmFyIGxuZyA9IHRoaXMubG5nO1xyXG5cclxuXHRcdGEgPSBhIHx8IC0xODA7XHJcblx0XHRiID0gYiB8fCAgMTgwO1xyXG5cclxuXHRcdGxuZyA9IChsbmcgKyBiKSAlIChiIC0gYSkgKyAobG5nIDwgYSB8fCBsbmcgPT09IGIgPyBiIDogYSk7XHJcblxyXG5cdFx0cmV0dXJuIG5ldyBMLkxhdExuZyh0aGlzLmxhdCwgbG5nKTtcclxuXHR9XHJcbn07XHJcblxyXG5MLmxhdExuZyA9IGZ1bmN0aW9uIChhLCBiKSB7IC8vIChMYXRMbmcpIG9yIChbTnVtYmVyLCBOdW1iZXJdKSBvciAoTnVtYmVyLCBOdW1iZXIpXHJcblx0aWYgKGEgaW5zdGFuY2VvZiBMLkxhdExuZykge1xyXG5cdFx0cmV0dXJuIGE7XHJcblx0fVxyXG5cdGlmIChMLlV0aWwuaXNBcnJheShhKSkge1xyXG5cdFx0aWYgKHR5cGVvZiBhWzBdID09PSAnbnVtYmVyJyB8fCB0eXBlb2YgYVswXSA9PT0gJ3N0cmluZycpIHtcclxuXHRcdFx0cmV0dXJuIG5ldyBMLkxhdExuZyhhWzBdLCBhWzFdLCBhWzJdKTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdHJldHVybiBudWxsO1xyXG5cdFx0fVxyXG5cdH1cclxuXHRpZiAoYSA9PT0gdW5kZWZpbmVkIHx8IGEgPT09IG51bGwpIHtcclxuXHRcdHJldHVybiBhO1xyXG5cdH1cclxuXHRpZiAodHlwZW9mIGEgPT09ICdvYmplY3QnICYmICdsYXQnIGluIGEpIHtcclxuXHRcdHJldHVybiBuZXcgTC5MYXRMbmcoYS5sYXQsICdsbmcnIGluIGEgPyBhLmxuZyA6IGEubG9uKTtcclxuXHR9XHJcblx0aWYgKGIgPT09IHVuZGVmaW5lZCkge1xyXG5cdFx0cmV0dXJuIG51bGw7XHJcblx0fVxyXG5cdHJldHVybiBuZXcgTC5MYXRMbmcoYSwgYik7XHJcbn07XHJcblxyXG5cblxuLypcclxuICogTC5MYXRMbmdCb3VuZHMgcmVwcmVzZW50cyBhIHJlY3Rhbmd1bGFyIGFyZWEgb24gdGhlIG1hcCBpbiBnZW9ncmFwaGljYWwgY29vcmRpbmF0ZXMuXHJcbiAqL1xyXG5cclxuTC5MYXRMbmdCb3VuZHMgPSBmdW5jdGlvbiAoc291dGhXZXN0LCBub3J0aEVhc3QpIHsgLy8gKExhdExuZywgTGF0TG5nKSBvciAoTGF0TG5nW10pXHJcblx0aWYgKCFzb3V0aFdlc3QpIHsgcmV0dXJuOyB9XHJcblxyXG5cdHZhciBsYXRsbmdzID0gbm9ydGhFYXN0ID8gW3NvdXRoV2VzdCwgbm9ydGhFYXN0XSA6IHNvdXRoV2VzdDtcclxuXHJcblx0Zm9yICh2YXIgaSA9IDAsIGxlbiA9IGxhdGxuZ3MubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcclxuXHRcdHRoaXMuZXh0ZW5kKGxhdGxuZ3NbaV0pO1xyXG5cdH1cclxufTtcclxuXHJcbkwuTGF0TG5nQm91bmRzLnByb3RvdHlwZSA9IHtcclxuXHQvLyBleHRlbmQgdGhlIGJvdW5kcyB0byBjb250YWluIHRoZSBnaXZlbiBwb2ludCBvciBib3VuZHNcclxuXHRleHRlbmQ6IGZ1bmN0aW9uIChvYmopIHsgLy8gKExhdExuZykgb3IgKExhdExuZ0JvdW5kcylcclxuXHRcdGlmICghb2JqKSB7IHJldHVybiB0aGlzOyB9XHJcblxyXG5cdFx0dmFyIGxhdExuZyA9IEwubGF0TG5nKG9iaik7XHJcblx0XHRpZiAobGF0TG5nICE9PSBudWxsKSB7XHJcblx0XHRcdG9iaiA9IGxhdExuZztcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdG9iaiA9IEwubGF0TG5nQm91bmRzKG9iaik7XHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKG9iaiBpbnN0YW5jZW9mIEwuTGF0TG5nKSB7XHJcblx0XHRcdGlmICghdGhpcy5fc291dGhXZXN0ICYmICF0aGlzLl9ub3J0aEVhc3QpIHtcclxuXHRcdFx0XHR0aGlzLl9zb3V0aFdlc3QgPSBuZXcgTC5MYXRMbmcob2JqLmxhdCwgb2JqLmxuZyk7XHJcblx0XHRcdFx0dGhpcy5fbm9ydGhFYXN0ID0gbmV3IEwuTGF0TG5nKG9iai5sYXQsIG9iai5sbmcpO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdHRoaXMuX3NvdXRoV2VzdC5sYXQgPSBNYXRoLm1pbihvYmoubGF0LCB0aGlzLl9zb3V0aFdlc3QubGF0KTtcclxuXHRcdFx0XHR0aGlzLl9zb3V0aFdlc3QubG5nID0gTWF0aC5taW4ob2JqLmxuZywgdGhpcy5fc291dGhXZXN0LmxuZyk7XHJcblxyXG5cdFx0XHRcdHRoaXMuX25vcnRoRWFzdC5sYXQgPSBNYXRoLm1heChvYmoubGF0LCB0aGlzLl9ub3J0aEVhc3QubGF0KTtcclxuXHRcdFx0XHR0aGlzLl9ub3J0aEVhc3QubG5nID0gTWF0aC5tYXgob2JqLmxuZywgdGhpcy5fbm9ydGhFYXN0LmxuZyk7XHJcblx0XHRcdH1cclxuXHRcdH0gZWxzZSBpZiAob2JqIGluc3RhbmNlb2YgTC5MYXRMbmdCb3VuZHMpIHtcclxuXHRcdFx0dGhpcy5leHRlbmQob2JqLl9zb3V0aFdlc3QpO1xyXG5cdFx0XHR0aGlzLmV4dGVuZChvYmouX25vcnRoRWFzdCk7XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gdGhpcztcclxuXHR9LFxyXG5cclxuXHQvLyBleHRlbmQgdGhlIGJvdW5kcyBieSBhIHBlcmNlbnRhZ2VcclxuXHRwYWQ6IGZ1bmN0aW9uIChidWZmZXJSYXRpbykgeyAvLyAoTnVtYmVyKSAtPiBMYXRMbmdCb3VuZHNcclxuXHRcdHZhciBzdyA9IHRoaXMuX3NvdXRoV2VzdCxcclxuXHRcdCAgICBuZSA9IHRoaXMuX25vcnRoRWFzdCxcclxuXHRcdCAgICBoZWlnaHRCdWZmZXIgPSBNYXRoLmFicyhzdy5sYXQgLSBuZS5sYXQpICogYnVmZmVyUmF0aW8sXHJcblx0XHQgICAgd2lkdGhCdWZmZXIgPSBNYXRoLmFicyhzdy5sbmcgLSBuZS5sbmcpICogYnVmZmVyUmF0aW87XHJcblxyXG5cdFx0cmV0dXJuIG5ldyBMLkxhdExuZ0JvdW5kcyhcclxuXHRcdCAgICAgICAgbmV3IEwuTGF0TG5nKHN3LmxhdCAtIGhlaWdodEJ1ZmZlciwgc3cubG5nIC0gd2lkdGhCdWZmZXIpLFxyXG5cdFx0ICAgICAgICBuZXcgTC5MYXRMbmcobmUubGF0ICsgaGVpZ2h0QnVmZmVyLCBuZS5sbmcgKyB3aWR0aEJ1ZmZlcikpO1xyXG5cdH0sXHJcblxyXG5cdGdldENlbnRlcjogZnVuY3Rpb24gKCkgeyAvLyAtPiBMYXRMbmdcclxuXHRcdHJldHVybiBuZXcgTC5MYXRMbmcoXHJcblx0XHQgICAgICAgICh0aGlzLl9zb3V0aFdlc3QubGF0ICsgdGhpcy5fbm9ydGhFYXN0LmxhdCkgLyAyLFxyXG5cdFx0ICAgICAgICAodGhpcy5fc291dGhXZXN0LmxuZyArIHRoaXMuX25vcnRoRWFzdC5sbmcpIC8gMik7XHJcblx0fSxcclxuXHJcblx0Z2V0U291dGhXZXN0OiBmdW5jdGlvbiAoKSB7XHJcblx0XHRyZXR1cm4gdGhpcy5fc291dGhXZXN0O1xyXG5cdH0sXHJcblxyXG5cdGdldE5vcnRoRWFzdDogZnVuY3Rpb24gKCkge1xyXG5cdFx0cmV0dXJuIHRoaXMuX25vcnRoRWFzdDtcclxuXHR9LFxyXG5cclxuXHRnZXROb3J0aFdlc3Q6IGZ1bmN0aW9uICgpIHtcclxuXHRcdHJldHVybiBuZXcgTC5MYXRMbmcodGhpcy5nZXROb3J0aCgpLCB0aGlzLmdldFdlc3QoKSk7XHJcblx0fSxcclxuXHJcblx0Z2V0U291dGhFYXN0OiBmdW5jdGlvbiAoKSB7XHJcblx0XHRyZXR1cm4gbmV3IEwuTGF0TG5nKHRoaXMuZ2V0U291dGgoKSwgdGhpcy5nZXRFYXN0KCkpO1xyXG5cdH0sXHJcblxyXG5cdGdldFdlc3Q6IGZ1bmN0aW9uICgpIHtcclxuXHRcdHJldHVybiB0aGlzLl9zb3V0aFdlc3QubG5nO1xyXG5cdH0sXHJcblxyXG5cdGdldFNvdXRoOiBmdW5jdGlvbiAoKSB7XHJcblx0XHRyZXR1cm4gdGhpcy5fc291dGhXZXN0LmxhdDtcclxuXHR9LFxyXG5cclxuXHRnZXRFYXN0OiBmdW5jdGlvbiAoKSB7XHJcblx0XHRyZXR1cm4gdGhpcy5fbm9ydGhFYXN0LmxuZztcclxuXHR9LFxyXG5cclxuXHRnZXROb3J0aDogZnVuY3Rpb24gKCkge1xyXG5cdFx0cmV0dXJuIHRoaXMuX25vcnRoRWFzdC5sYXQ7XHJcblx0fSxcclxuXHJcblx0Y29udGFpbnM6IGZ1bmN0aW9uIChvYmopIHsgLy8gKExhdExuZ0JvdW5kcykgb3IgKExhdExuZykgLT4gQm9vbGVhblxyXG5cdFx0aWYgKHR5cGVvZiBvYmpbMF0gPT09ICdudW1iZXInIHx8IG9iaiBpbnN0YW5jZW9mIEwuTGF0TG5nKSB7XHJcblx0XHRcdG9iaiA9IEwubGF0TG5nKG9iaik7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRvYmogPSBMLmxhdExuZ0JvdW5kcyhvYmopO1xyXG5cdFx0fVxyXG5cclxuXHRcdHZhciBzdyA9IHRoaXMuX3NvdXRoV2VzdCxcclxuXHRcdCAgICBuZSA9IHRoaXMuX25vcnRoRWFzdCxcclxuXHRcdCAgICBzdzIsIG5lMjtcclxuXHJcblx0XHRpZiAob2JqIGluc3RhbmNlb2YgTC5MYXRMbmdCb3VuZHMpIHtcclxuXHRcdFx0c3cyID0gb2JqLmdldFNvdXRoV2VzdCgpO1xyXG5cdFx0XHRuZTIgPSBvYmouZ2V0Tm9ydGhFYXN0KCk7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRzdzIgPSBuZTIgPSBvYmo7XHJcblx0XHR9XHJcblxyXG5cdFx0cmV0dXJuIChzdzIubGF0ID49IHN3LmxhdCkgJiYgKG5lMi5sYXQgPD0gbmUubGF0KSAmJlxyXG5cdFx0ICAgICAgIChzdzIubG5nID49IHN3LmxuZykgJiYgKG5lMi5sbmcgPD0gbmUubG5nKTtcclxuXHR9LFxyXG5cclxuXHRpbnRlcnNlY3RzOiBmdW5jdGlvbiAoYm91bmRzKSB7IC8vIChMYXRMbmdCb3VuZHMpXHJcblx0XHRib3VuZHMgPSBMLmxhdExuZ0JvdW5kcyhib3VuZHMpO1xyXG5cclxuXHRcdHZhciBzdyA9IHRoaXMuX3NvdXRoV2VzdCxcclxuXHRcdCAgICBuZSA9IHRoaXMuX25vcnRoRWFzdCxcclxuXHRcdCAgICBzdzIgPSBib3VuZHMuZ2V0U291dGhXZXN0KCksXHJcblx0XHQgICAgbmUyID0gYm91bmRzLmdldE5vcnRoRWFzdCgpLFxyXG5cclxuXHRcdCAgICBsYXRJbnRlcnNlY3RzID0gKG5lMi5sYXQgPj0gc3cubGF0KSAmJiAoc3cyLmxhdCA8PSBuZS5sYXQpLFxyXG5cdFx0ICAgIGxuZ0ludGVyc2VjdHMgPSAobmUyLmxuZyA+PSBzdy5sbmcpICYmIChzdzIubG5nIDw9IG5lLmxuZyk7XHJcblxyXG5cdFx0cmV0dXJuIGxhdEludGVyc2VjdHMgJiYgbG5nSW50ZXJzZWN0cztcclxuXHR9LFxyXG5cclxuXHR0b0JCb3hTdHJpbmc6IGZ1bmN0aW9uICgpIHtcclxuXHRcdHJldHVybiBbdGhpcy5nZXRXZXN0KCksIHRoaXMuZ2V0U291dGgoKSwgdGhpcy5nZXRFYXN0KCksIHRoaXMuZ2V0Tm9ydGgoKV0uam9pbignLCcpO1xyXG5cdH0sXHJcblxyXG5cdGVxdWFsczogZnVuY3Rpb24gKGJvdW5kcykgeyAvLyAoTGF0TG5nQm91bmRzKVxyXG5cdFx0aWYgKCFib3VuZHMpIHsgcmV0dXJuIGZhbHNlOyB9XHJcblxyXG5cdFx0Ym91bmRzID0gTC5sYXRMbmdCb3VuZHMoYm91bmRzKTtcclxuXHJcblx0XHRyZXR1cm4gdGhpcy5fc291dGhXZXN0LmVxdWFscyhib3VuZHMuZ2V0U291dGhXZXN0KCkpICYmXHJcblx0XHQgICAgICAgdGhpcy5fbm9ydGhFYXN0LmVxdWFscyhib3VuZHMuZ2V0Tm9ydGhFYXN0KCkpO1xyXG5cdH0sXHJcblxyXG5cdGlzVmFsaWQ6IGZ1bmN0aW9uICgpIHtcclxuXHRcdHJldHVybiAhISh0aGlzLl9zb3V0aFdlc3QgJiYgdGhpcy5fbm9ydGhFYXN0KTtcclxuXHR9XHJcbn07XHJcblxyXG4vL1RPRE8gSW50ZXJuYXRpb25hbCBkYXRlIGxpbmU/XHJcblxyXG5MLmxhdExuZ0JvdW5kcyA9IGZ1bmN0aW9uIChhLCBiKSB7IC8vIChMYXRMbmdCb3VuZHMpIG9yIChMYXRMbmcsIExhdExuZylcclxuXHRpZiAoIWEgfHwgYSBpbnN0YW5jZW9mIEwuTGF0TG5nQm91bmRzKSB7XHJcblx0XHRyZXR1cm4gYTtcclxuXHR9XHJcblx0cmV0dXJuIG5ldyBMLkxhdExuZ0JvdW5kcyhhLCBiKTtcclxufTtcclxuXG5cbi8qXHJcbiAqIEwuUHJvamVjdGlvbiBjb250YWlucyB2YXJpb3VzIGdlb2dyYXBoaWNhbCBwcm9qZWN0aW9ucyB1c2VkIGJ5IENSUyBjbGFzc2VzLlxyXG4gKi9cclxuXHJcbkwuUHJvamVjdGlvbiA9IHt9O1xyXG5cblxuLypcclxuICogU3BoZXJpY2FsIE1lcmNhdG9yIGlzIHRoZSBtb3N0IHBvcHVsYXIgbWFwIHByb2plY3Rpb24sIHVzZWQgYnkgRVBTRzozODU3IENSUyB1c2VkIGJ5IGRlZmF1bHQuXHJcbiAqL1xyXG5cclxuTC5Qcm9qZWN0aW9uLlNwaGVyaWNhbE1lcmNhdG9yID0ge1xyXG5cdE1BWF9MQVRJVFVERTogODUuMDUxMTI4Nzc5OCxcclxuXHJcblx0cHJvamVjdDogZnVuY3Rpb24gKGxhdGxuZykgeyAvLyAoTGF0TG5nKSAtPiBQb2ludFxyXG5cdFx0dmFyIGQgPSBMLkxhdExuZy5ERUdfVE9fUkFELFxyXG5cdFx0ICAgIG1heCA9IHRoaXMuTUFYX0xBVElUVURFLFxyXG5cdFx0ICAgIGxhdCA9IE1hdGgubWF4KE1hdGgubWluKG1heCwgbGF0bG5nLmxhdCksIC1tYXgpLFxyXG5cdFx0ICAgIHggPSBsYXRsbmcubG5nICogZCxcclxuXHRcdCAgICB5ID0gbGF0ICogZDtcclxuXHJcblx0XHR5ID0gTWF0aC5sb2coTWF0aC50YW4oKE1hdGguUEkgLyA0KSArICh5IC8gMikpKTtcclxuXHJcblx0XHRyZXR1cm4gbmV3IEwuUG9pbnQoeCwgeSk7XHJcblx0fSxcclxuXHJcblx0dW5wcm9qZWN0OiBmdW5jdGlvbiAocG9pbnQpIHsgLy8gKFBvaW50LCBCb29sZWFuKSAtPiBMYXRMbmdcclxuXHRcdHZhciBkID0gTC5MYXRMbmcuUkFEX1RPX0RFRyxcclxuXHRcdCAgICBsbmcgPSBwb2ludC54ICogZCxcclxuXHRcdCAgICBsYXQgPSAoMiAqIE1hdGguYXRhbihNYXRoLmV4cChwb2ludC55KSkgLSAoTWF0aC5QSSAvIDIpKSAqIGQ7XHJcblxyXG5cdFx0cmV0dXJuIG5ldyBMLkxhdExuZyhsYXQsIGxuZyk7XHJcblx0fVxyXG59O1xyXG5cblxuLypcclxuICogU2ltcGxlIGVxdWlyZWN0YW5ndWxhciAoUGxhdGUgQ2FycmVlKSBwcm9qZWN0aW9uLCB1c2VkIGJ5IENSUyBsaWtlIEVQU0c6NDMyNiBhbmQgU2ltcGxlLlxyXG4gKi9cclxuXHJcbkwuUHJvamVjdGlvbi5Mb25MYXQgPSB7XHJcblx0cHJvamVjdDogZnVuY3Rpb24gKGxhdGxuZykge1xyXG5cdFx0cmV0dXJuIG5ldyBMLlBvaW50KGxhdGxuZy5sbmcsIGxhdGxuZy5sYXQpO1xyXG5cdH0sXHJcblxyXG5cdHVucHJvamVjdDogZnVuY3Rpb24gKHBvaW50KSB7XHJcblx0XHRyZXR1cm4gbmV3IEwuTGF0TG5nKHBvaW50LnksIHBvaW50LngpO1xyXG5cdH1cclxufTtcclxuXG5cbi8qXHJcbiAqIEwuQ1JTIGlzIGEgYmFzZSBvYmplY3QgZm9yIGFsbCBkZWZpbmVkIENSUyAoQ29vcmRpbmF0ZSBSZWZlcmVuY2UgU3lzdGVtcykgaW4gTGVhZmxldC5cclxuICovXHJcblxyXG5MLkNSUyA9IHtcclxuXHRsYXRMbmdUb1BvaW50OiBmdW5jdGlvbiAobGF0bG5nLCB6b29tKSB7IC8vIChMYXRMbmcsIE51bWJlcikgLT4gUG9pbnRcclxuXHRcdHZhciBwcm9qZWN0ZWRQb2ludCA9IHRoaXMucHJvamVjdGlvbi5wcm9qZWN0KGxhdGxuZyksXHJcblx0XHQgICAgc2NhbGUgPSB0aGlzLnNjYWxlKHpvb20pO1xyXG5cclxuXHRcdHJldHVybiB0aGlzLnRyYW5zZm9ybWF0aW9uLl90cmFuc2Zvcm0ocHJvamVjdGVkUG9pbnQsIHNjYWxlKTtcclxuXHR9LFxyXG5cclxuXHRwb2ludFRvTGF0TG5nOiBmdW5jdGlvbiAocG9pbnQsIHpvb20pIHsgLy8gKFBvaW50LCBOdW1iZXJbLCBCb29sZWFuXSkgLT4gTGF0TG5nXHJcblx0XHR2YXIgc2NhbGUgPSB0aGlzLnNjYWxlKHpvb20pLFxyXG5cdFx0ICAgIHVudHJhbnNmb3JtZWRQb2ludCA9IHRoaXMudHJhbnNmb3JtYXRpb24udW50cmFuc2Zvcm0ocG9pbnQsIHNjYWxlKTtcclxuXHJcblx0XHRyZXR1cm4gdGhpcy5wcm9qZWN0aW9uLnVucHJvamVjdCh1bnRyYW5zZm9ybWVkUG9pbnQpO1xyXG5cdH0sXHJcblxyXG5cdHByb2plY3Q6IGZ1bmN0aW9uIChsYXRsbmcpIHtcclxuXHRcdHJldHVybiB0aGlzLnByb2plY3Rpb24ucHJvamVjdChsYXRsbmcpO1xyXG5cdH0sXHJcblxyXG5cdHNjYWxlOiBmdW5jdGlvbiAoem9vbSkge1xyXG5cdFx0cmV0dXJuIDI1NiAqIE1hdGgucG93KDIsIHpvb20pO1xyXG5cdH0sXHJcblxyXG5cdGdldFNpemU6IGZ1bmN0aW9uICh6b29tKSB7XHJcblx0XHR2YXIgcyA9IHRoaXMuc2NhbGUoem9vbSk7XHJcblx0XHRyZXR1cm4gTC5wb2ludChzLCBzKTtcclxuXHR9XHJcbn07XHJcblxuXG4vKlxuICogQSBzaW1wbGUgQ1JTIHRoYXQgY2FuIGJlIHVzZWQgZm9yIGZsYXQgbm9uLUVhcnRoIG1hcHMgbGlrZSBwYW5vcmFtYXMgb3IgZ2FtZSBtYXBzLlxuICovXG5cbkwuQ1JTLlNpbXBsZSA9IEwuZXh0ZW5kKHt9LCBMLkNSUywge1xuXHRwcm9qZWN0aW9uOiBMLlByb2plY3Rpb24uTG9uTGF0LFxuXHR0cmFuc2Zvcm1hdGlvbjogbmV3IEwuVHJhbnNmb3JtYXRpb24oMSwgMCwgLTEsIDApLFxuXG5cdHNjYWxlOiBmdW5jdGlvbiAoem9vbSkge1xuXHRcdHJldHVybiBNYXRoLnBvdygyLCB6b29tKTtcblx0fVxufSk7XG5cblxuLypcclxuICogTC5DUlMuRVBTRzM4NTcgKFNwaGVyaWNhbCBNZXJjYXRvcikgaXMgdGhlIG1vc3QgY29tbW9uIENSUyBmb3Igd2ViIG1hcHBpbmdcclxuICogYW5kIGlzIHVzZWQgYnkgTGVhZmxldCBieSBkZWZhdWx0LlxyXG4gKi9cclxuXHJcbkwuQ1JTLkVQU0czODU3ID0gTC5leHRlbmQoe30sIEwuQ1JTLCB7XHJcblx0Y29kZTogJ0VQU0c6Mzg1NycsXHJcblxyXG5cdHByb2plY3Rpb246IEwuUHJvamVjdGlvbi5TcGhlcmljYWxNZXJjYXRvcixcclxuXHR0cmFuc2Zvcm1hdGlvbjogbmV3IEwuVHJhbnNmb3JtYXRpb24oMC41IC8gTWF0aC5QSSwgMC41LCAtMC41IC8gTWF0aC5QSSwgMC41KSxcclxuXHJcblx0cHJvamVjdDogZnVuY3Rpb24gKGxhdGxuZykgeyAvLyAoTGF0TG5nKSAtPiBQb2ludFxyXG5cdFx0dmFyIHByb2plY3RlZFBvaW50ID0gdGhpcy5wcm9qZWN0aW9uLnByb2plY3QobGF0bG5nKSxcclxuXHRcdCAgICBlYXJ0aFJhZGl1cyA9IDYzNzgxMzc7XHJcblx0XHRyZXR1cm4gcHJvamVjdGVkUG9pbnQubXVsdGlwbHlCeShlYXJ0aFJhZGl1cyk7XHJcblx0fVxyXG59KTtcclxuXHJcbkwuQ1JTLkVQU0c5MDA5MTMgPSBMLmV4dGVuZCh7fSwgTC5DUlMuRVBTRzM4NTcsIHtcclxuXHRjb2RlOiAnRVBTRzo5MDA5MTMnXHJcbn0pO1xyXG5cblxuLypcclxuICogTC5DUlMuRVBTRzQzMjYgaXMgYSBDUlMgcG9wdWxhciBhbW9uZyBhZHZhbmNlZCBHSVMgc3BlY2lhbGlzdHMuXHJcbiAqL1xyXG5cclxuTC5DUlMuRVBTRzQzMjYgPSBMLmV4dGVuZCh7fSwgTC5DUlMsIHtcclxuXHRjb2RlOiAnRVBTRzo0MzI2JyxcclxuXHJcblx0cHJvamVjdGlvbjogTC5Qcm9qZWN0aW9uLkxvbkxhdCxcclxuXHR0cmFuc2Zvcm1hdGlvbjogbmV3IEwuVHJhbnNmb3JtYXRpb24oMSAvIDM2MCwgMC41LCAtMSAvIDM2MCwgMC41KVxyXG59KTtcclxuXG5cbi8qXHJcbiAqIEwuTWFwIGlzIHRoZSBjZW50cmFsIGNsYXNzIG9mIHRoZSBBUEkgLSBpdCBpcyB1c2VkIHRvIGNyZWF0ZSBhIG1hcC5cclxuICovXHJcblxyXG5MLk1hcCA9IEwuQ2xhc3MuZXh0ZW5kKHtcclxuXHJcblx0aW5jbHVkZXM6IEwuTWl4aW4uRXZlbnRzLFxyXG5cclxuXHRvcHRpb25zOiB7XHJcblx0XHRjcnM6IEwuQ1JTLkVQU0czODU3LFxyXG5cclxuXHRcdC8qXHJcblx0XHRjZW50ZXI6IExhdExuZyxcclxuXHRcdHpvb206IE51bWJlcixcclxuXHRcdGxheWVyczogQXJyYXksXHJcblx0XHQqL1xyXG5cclxuXHRcdGZhZGVBbmltYXRpb246IEwuRG9tVXRpbC5UUkFOU0lUSU9OICYmICFMLkJyb3dzZXIuYW5kcm9pZDIzLFxyXG5cdFx0dHJhY2tSZXNpemU6IHRydWUsXHJcblx0XHRtYXJrZXJab29tQW5pbWF0aW9uOiBMLkRvbVV0aWwuVFJBTlNJVElPTiAmJiBMLkJyb3dzZXIuYW55M2RcclxuXHR9LFxyXG5cclxuXHRpbml0aWFsaXplOiBmdW5jdGlvbiAoaWQsIG9wdGlvbnMpIHsgLy8gKEhUTUxFbGVtZW50IG9yIFN0cmluZywgT2JqZWN0KVxyXG5cdFx0b3B0aW9ucyA9IEwuc2V0T3B0aW9ucyh0aGlzLCBvcHRpb25zKTtcclxuXHJcblxyXG5cdFx0dGhpcy5faW5pdENvbnRhaW5lcihpZCk7XHJcblx0XHR0aGlzLl9pbml0TGF5b3V0KCk7XHJcblxyXG5cdFx0Ly8gaGFjayBmb3IgaHR0cHM6Ly9naXRodWIuY29tL0xlYWZsZXQvTGVhZmxldC9pc3N1ZXMvMTk4MFxyXG5cdFx0dGhpcy5fb25SZXNpemUgPSBMLmJpbmQodGhpcy5fb25SZXNpemUsIHRoaXMpO1xyXG5cclxuXHRcdHRoaXMuX2luaXRFdmVudHMoKTtcclxuXHJcblx0XHRpZiAob3B0aW9ucy5tYXhCb3VuZHMpIHtcclxuXHRcdFx0dGhpcy5zZXRNYXhCb3VuZHMob3B0aW9ucy5tYXhCb3VuZHMpO1xyXG5cdFx0fVxyXG5cclxuXHRcdGlmIChvcHRpb25zLmNlbnRlciAmJiBvcHRpb25zLnpvb20gIT09IHVuZGVmaW5lZCkge1xyXG5cdFx0XHR0aGlzLnNldFZpZXcoTC5sYXRMbmcob3B0aW9ucy5jZW50ZXIpLCBvcHRpb25zLnpvb20sIHtyZXNldDogdHJ1ZX0pO1xyXG5cdFx0fVxyXG5cclxuXHRcdHRoaXMuX2hhbmRsZXJzID0gW107XHJcblxyXG5cdFx0dGhpcy5fbGF5ZXJzID0ge307XHJcblx0XHR0aGlzLl96b29tQm91bmRMYXllcnMgPSB7fTtcclxuXHRcdHRoaXMuX3RpbGVMYXllcnNOdW0gPSAwO1xyXG5cclxuXHRcdHRoaXMuY2FsbEluaXRIb29rcygpO1xyXG5cclxuXHRcdHRoaXMuX2FkZExheWVycyhvcHRpb25zLmxheWVycyk7XHJcblx0fSxcclxuXHJcblxyXG5cdC8vIHB1YmxpYyBtZXRob2RzIHRoYXQgbW9kaWZ5IG1hcCBzdGF0ZVxyXG5cclxuXHQvLyByZXBsYWNlZCBieSBhbmltYXRpb24tcG93ZXJlZCBpbXBsZW1lbnRhdGlvbiBpbiBNYXAuUGFuQW5pbWF0aW9uLmpzXHJcblx0c2V0VmlldzogZnVuY3Rpb24gKGNlbnRlciwgem9vbSkge1xyXG5cdFx0em9vbSA9IHpvb20gPT09IHVuZGVmaW5lZCA/IHRoaXMuZ2V0Wm9vbSgpIDogem9vbTtcclxuXHRcdHRoaXMuX3Jlc2V0VmlldyhMLmxhdExuZyhjZW50ZXIpLCB0aGlzLl9saW1pdFpvb20oem9vbSkpO1xyXG5cdFx0cmV0dXJuIHRoaXM7XHJcblx0fSxcclxuXHJcblx0c2V0Wm9vbTogZnVuY3Rpb24gKHpvb20sIG9wdGlvbnMpIHtcclxuXHRcdGlmICghdGhpcy5fbG9hZGVkKSB7XHJcblx0XHRcdHRoaXMuX3pvb20gPSB0aGlzLl9saW1pdFpvb20oem9vbSk7XHJcblx0XHRcdHJldHVybiB0aGlzO1xyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIHRoaXMuc2V0Vmlldyh0aGlzLmdldENlbnRlcigpLCB6b29tLCB7em9vbTogb3B0aW9uc30pO1xyXG5cdH0sXHJcblxyXG5cdHpvb21JbjogZnVuY3Rpb24gKGRlbHRhLCBvcHRpb25zKSB7XHJcblx0XHRyZXR1cm4gdGhpcy5zZXRab29tKHRoaXMuX3pvb20gKyAoZGVsdGEgfHwgMSksIG9wdGlvbnMpO1xyXG5cdH0sXHJcblxyXG5cdHpvb21PdXQ6IGZ1bmN0aW9uIChkZWx0YSwgb3B0aW9ucykge1xyXG5cdFx0cmV0dXJuIHRoaXMuc2V0Wm9vbSh0aGlzLl96b29tIC0gKGRlbHRhIHx8IDEpLCBvcHRpb25zKTtcclxuXHR9LFxyXG5cclxuXHRzZXRab29tQXJvdW5kOiBmdW5jdGlvbiAobGF0bG5nLCB6b29tLCBvcHRpb25zKSB7XHJcblx0XHR2YXIgc2NhbGUgPSB0aGlzLmdldFpvb21TY2FsZSh6b29tKSxcclxuXHRcdCAgICB2aWV3SGFsZiA9IHRoaXMuZ2V0U2l6ZSgpLmRpdmlkZUJ5KDIpLFxyXG5cdFx0ICAgIGNvbnRhaW5lclBvaW50ID0gbGF0bG5nIGluc3RhbmNlb2YgTC5Qb2ludCA/IGxhdGxuZyA6IHRoaXMubGF0TG5nVG9Db250YWluZXJQb2ludChsYXRsbmcpLFxyXG5cclxuXHRcdCAgICBjZW50ZXJPZmZzZXQgPSBjb250YWluZXJQb2ludC5zdWJ0cmFjdCh2aWV3SGFsZikubXVsdGlwbHlCeSgxIC0gMSAvIHNjYWxlKSxcclxuXHRcdCAgICBuZXdDZW50ZXIgPSB0aGlzLmNvbnRhaW5lclBvaW50VG9MYXRMbmcodmlld0hhbGYuYWRkKGNlbnRlck9mZnNldCkpO1xyXG5cclxuXHRcdHJldHVybiB0aGlzLnNldFZpZXcobmV3Q2VudGVyLCB6b29tLCB7em9vbTogb3B0aW9uc30pO1xyXG5cdH0sXHJcblxyXG5cdGZpdEJvdW5kczogZnVuY3Rpb24gKGJvdW5kcywgb3B0aW9ucykge1xyXG5cclxuXHRcdG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xyXG5cdFx0Ym91bmRzID0gYm91bmRzLmdldEJvdW5kcyA/IGJvdW5kcy5nZXRCb3VuZHMoKSA6IEwubGF0TG5nQm91bmRzKGJvdW5kcyk7XHJcblxyXG5cdFx0dmFyIHBhZGRpbmdUTCA9IEwucG9pbnQob3B0aW9ucy5wYWRkaW5nVG9wTGVmdCB8fCBvcHRpb25zLnBhZGRpbmcgfHwgWzAsIDBdKSxcclxuXHRcdCAgICBwYWRkaW5nQlIgPSBMLnBvaW50KG9wdGlvbnMucGFkZGluZ0JvdHRvbVJpZ2h0IHx8IG9wdGlvbnMucGFkZGluZyB8fCBbMCwgMF0pLFxyXG5cclxuXHRcdCAgICB6b29tID0gdGhpcy5nZXRCb3VuZHNab29tKGJvdW5kcywgZmFsc2UsIHBhZGRpbmdUTC5hZGQocGFkZGluZ0JSKSksXHJcblx0XHQgICAgcGFkZGluZ09mZnNldCA9IHBhZGRpbmdCUi5zdWJ0cmFjdChwYWRkaW5nVEwpLmRpdmlkZUJ5KDIpLFxyXG5cclxuXHRcdCAgICBzd1BvaW50ID0gdGhpcy5wcm9qZWN0KGJvdW5kcy5nZXRTb3V0aFdlc3QoKSwgem9vbSksXHJcblx0XHQgICAgbmVQb2ludCA9IHRoaXMucHJvamVjdChib3VuZHMuZ2V0Tm9ydGhFYXN0KCksIHpvb20pLFxyXG5cdFx0ICAgIGNlbnRlciA9IHRoaXMudW5wcm9qZWN0KHN3UG9pbnQuYWRkKG5lUG9pbnQpLmRpdmlkZUJ5KDIpLmFkZChwYWRkaW5nT2Zmc2V0KSwgem9vbSk7XHJcblxyXG5cdFx0em9vbSA9IG9wdGlvbnMgJiYgb3B0aW9ucy5tYXhab29tID8gTWF0aC5taW4ob3B0aW9ucy5tYXhab29tLCB6b29tKSA6IHpvb207XHJcblxyXG5cdFx0cmV0dXJuIHRoaXMuc2V0VmlldyhjZW50ZXIsIHpvb20sIG9wdGlvbnMpO1xyXG5cdH0sXHJcblxyXG5cdGZpdFdvcmxkOiBmdW5jdGlvbiAob3B0aW9ucykge1xyXG5cdFx0cmV0dXJuIHRoaXMuZml0Qm91bmRzKFtbLTkwLCAtMTgwXSwgWzkwLCAxODBdXSwgb3B0aW9ucyk7XHJcblx0fSxcclxuXHJcblx0cGFuVG86IGZ1bmN0aW9uIChjZW50ZXIsIG9wdGlvbnMpIHsgLy8gKExhdExuZylcclxuXHRcdHJldHVybiB0aGlzLnNldFZpZXcoY2VudGVyLCB0aGlzLl96b29tLCB7cGFuOiBvcHRpb25zfSk7XHJcblx0fSxcclxuXHJcblx0cGFuQnk6IGZ1bmN0aW9uIChvZmZzZXQpIHsgLy8gKFBvaW50KVxyXG5cdFx0Ly8gcmVwbGFjZWQgd2l0aCBhbmltYXRlZCBwYW5CeSBpbiBNYXAuUGFuQW5pbWF0aW9uLmpzXHJcblx0XHR0aGlzLmZpcmUoJ21vdmVzdGFydCcpO1xyXG5cclxuXHRcdHRoaXMuX3Jhd1BhbkJ5KEwucG9pbnQob2Zmc2V0KSk7XHJcblxyXG5cdFx0dGhpcy5maXJlKCdtb3ZlJyk7XHJcblx0XHRyZXR1cm4gdGhpcy5maXJlKCdtb3ZlZW5kJyk7XHJcblx0fSxcclxuXHJcblx0c2V0TWF4Qm91bmRzOiBmdW5jdGlvbiAoYm91bmRzKSB7XHJcblx0XHRib3VuZHMgPSBMLmxhdExuZ0JvdW5kcyhib3VuZHMpO1xyXG5cclxuXHRcdHRoaXMub3B0aW9ucy5tYXhCb3VuZHMgPSBib3VuZHM7XHJcblxyXG5cdFx0aWYgKCFib3VuZHMpIHtcclxuXHRcdFx0cmV0dXJuIHRoaXMub2ZmKCdtb3ZlZW5kJywgdGhpcy5fcGFuSW5zaWRlTWF4Qm91bmRzLCB0aGlzKTtcclxuXHRcdH1cclxuXHJcblx0XHRpZiAodGhpcy5fbG9hZGVkKSB7XHJcblx0XHRcdHRoaXMuX3Bhbkluc2lkZU1heEJvdW5kcygpO1xyXG5cdFx0fVxyXG5cclxuXHRcdHJldHVybiB0aGlzLm9uKCdtb3ZlZW5kJywgdGhpcy5fcGFuSW5zaWRlTWF4Qm91bmRzLCB0aGlzKTtcclxuXHR9LFxyXG5cclxuXHRwYW5JbnNpZGVCb3VuZHM6IGZ1bmN0aW9uIChib3VuZHMsIG9wdGlvbnMpIHtcclxuXHRcdHZhciBjZW50ZXIgPSB0aGlzLmdldENlbnRlcigpLFxyXG5cdFx0XHRuZXdDZW50ZXIgPSB0aGlzLl9saW1pdENlbnRlcihjZW50ZXIsIHRoaXMuX3pvb20sIGJvdW5kcyk7XHJcblxyXG5cdFx0aWYgKGNlbnRlci5lcXVhbHMobmV3Q2VudGVyKSkgeyByZXR1cm4gdGhpczsgfVxyXG5cclxuXHRcdHJldHVybiB0aGlzLnBhblRvKG5ld0NlbnRlciwgb3B0aW9ucyk7XHJcblx0fSxcclxuXHJcblx0YWRkTGF5ZXI6IGZ1bmN0aW9uIChsYXllcikge1xyXG5cdFx0Ly8gVE9ETyBtZXRob2QgaXMgdG9vIGJpZywgcmVmYWN0b3JcclxuXHJcblx0XHR2YXIgaWQgPSBMLnN0YW1wKGxheWVyKTtcclxuXHJcblx0XHRpZiAodGhpcy5fbGF5ZXJzW2lkXSkgeyByZXR1cm4gdGhpczsgfVxyXG5cclxuXHRcdHRoaXMuX2xheWVyc1tpZF0gPSBsYXllcjtcclxuXHJcblx0XHQvLyBUT0RPIGdldE1heFpvb20sIGdldE1pblpvb20gaW4gSUxheWVyIChpbnN0ZWFkIG9mIG9wdGlvbnMpXHJcblx0XHRpZiAobGF5ZXIub3B0aW9ucyAmJiAoIWlzTmFOKGxheWVyLm9wdGlvbnMubWF4Wm9vbSkgfHwgIWlzTmFOKGxheWVyLm9wdGlvbnMubWluWm9vbSkpKSB7XHJcblx0XHRcdHRoaXMuX3pvb21Cb3VuZExheWVyc1tpZF0gPSBsYXllcjtcclxuXHRcdFx0dGhpcy5fdXBkYXRlWm9vbUxldmVscygpO1xyXG5cdFx0fVxyXG5cclxuXHRcdC8vIFRPRE8gbG9va3MgdWdseSwgcmVmYWN0b3IhISFcclxuXHRcdGlmICh0aGlzLm9wdGlvbnMuem9vbUFuaW1hdGlvbiAmJiBMLlRpbGVMYXllciAmJiAobGF5ZXIgaW5zdGFuY2VvZiBMLlRpbGVMYXllcikpIHtcclxuXHRcdFx0dGhpcy5fdGlsZUxheWVyc051bSsrO1xyXG5cdFx0XHR0aGlzLl90aWxlTGF5ZXJzVG9Mb2FkKys7XHJcblx0XHRcdGxheWVyLm9uKCdsb2FkJywgdGhpcy5fb25UaWxlTGF5ZXJMb2FkLCB0aGlzKTtcclxuXHRcdH1cclxuXHJcblx0XHRpZiAodGhpcy5fbG9hZGVkKSB7XHJcblx0XHRcdHRoaXMuX2xheWVyQWRkKGxheWVyKTtcclxuXHRcdH1cclxuXHJcblx0XHRyZXR1cm4gdGhpcztcclxuXHR9LFxyXG5cclxuXHRyZW1vdmVMYXllcjogZnVuY3Rpb24gKGxheWVyKSB7XHJcblx0XHR2YXIgaWQgPSBMLnN0YW1wKGxheWVyKTtcclxuXHJcblx0XHRpZiAoIXRoaXMuX2xheWVyc1tpZF0pIHsgcmV0dXJuIHRoaXM7IH1cclxuXHJcblx0XHRpZiAodGhpcy5fbG9hZGVkKSB7XHJcblx0XHRcdGxheWVyLm9uUmVtb3ZlKHRoaXMpO1xyXG5cdFx0fVxyXG5cclxuXHRcdGRlbGV0ZSB0aGlzLl9sYXllcnNbaWRdO1xyXG5cclxuXHRcdGlmICh0aGlzLl9sb2FkZWQpIHtcclxuXHRcdFx0dGhpcy5maXJlKCdsYXllcnJlbW92ZScsIHtsYXllcjogbGF5ZXJ9KTtcclxuXHRcdH1cclxuXHJcblx0XHRpZiAodGhpcy5fem9vbUJvdW5kTGF5ZXJzW2lkXSkge1xyXG5cdFx0XHRkZWxldGUgdGhpcy5fem9vbUJvdW5kTGF5ZXJzW2lkXTtcclxuXHRcdFx0dGhpcy5fdXBkYXRlWm9vbUxldmVscygpO1xyXG5cdFx0fVxyXG5cclxuXHRcdC8vIFRPRE8gbG9va3MgdWdseSwgcmVmYWN0b3JcclxuXHRcdGlmICh0aGlzLm9wdGlvbnMuem9vbUFuaW1hdGlvbiAmJiBMLlRpbGVMYXllciAmJiAobGF5ZXIgaW5zdGFuY2VvZiBMLlRpbGVMYXllcikpIHtcclxuXHRcdFx0dGhpcy5fdGlsZUxheWVyc051bS0tO1xyXG5cdFx0XHR0aGlzLl90aWxlTGF5ZXJzVG9Mb2FkLS07XHJcblx0XHRcdGxheWVyLm9mZignbG9hZCcsIHRoaXMuX29uVGlsZUxheWVyTG9hZCwgdGhpcyk7XHJcblx0XHR9XHJcblxyXG5cdFx0cmV0dXJuIHRoaXM7XHJcblx0fSxcclxuXHJcblx0aGFzTGF5ZXI6IGZ1bmN0aW9uIChsYXllcikge1xyXG5cdFx0aWYgKCFsYXllcikgeyByZXR1cm4gZmFsc2U7IH1cclxuXHJcblx0XHRyZXR1cm4gKEwuc3RhbXAobGF5ZXIpIGluIHRoaXMuX2xheWVycyk7XHJcblx0fSxcclxuXHJcblx0ZWFjaExheWVyOiBmdW5jdGlvbiAobWV0aG9kLCBjb250ZXh0KSB7XHJcblx0XHRmb3IgKHZhciBpIGluIHRoaXMuX2xheWVycykge1xyXG5cdFx0XHRtZXRob2QuY2FsbChjb250ZXh0LCB0aGlzLl9sYXllcnNbaV0pO1xyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIHRoaXM7XHJcblx0fSxcclxuXHJcblx0aW52YWxpZGF0ZVNpemU6IGZ1bmN0aW9uIChvcHRpb25zKSB7XHJcblx0XHRpZiAoIXRoaXMuX2xvYWRlZCkgeyByZXR1cm4gdGhpczsgfVxyXG5cclxuXHRcdG9wdGlvbnMgPSBMLmV4dGVuZCh7XHJcblx0XHRcdGFuaW1hdGU6IGZhbHNlLFxyXG5cdFx0XHRwYW46IHRydWVcclxuXHRcdH0sIG9wdGlvbnMgPT09IHRydWUgPyB7YW5pbWF0ZTogdHJ1ZX0gOiBvcHRpb25zKTtcclxuXHJcblx0XHR2YXIgb2xkU2l6ZSA9IHRoaXMuZ2V0U2l6ZSgpO1xyXG5cdFx0dGhpcy5fc2l6ZUNoYW5nZWQgPSB0cnVlO1xyXG5cdFx0dGhpcy5faW5pdGlhbENlbnRlciA9IG51bGw7XHJcblxyXG5cdFx0dmFyIG5ld1NpemUgPSB0aGlzLmdldFNpemUoKSxcclxuXHRcdCAgICBvbGRDZW50ZXIgPSBvbGRTaXplLmRpdmlkZUJ5KDIpLnJvdW5kKCksXHJcblx0XHQgICAgbmV3Q2VudGVyID0gbmV3U2l6ZS5kaXZpZGVCeSgyKS5yb3VuZCgpLFxyXG5cdFx0ICAgIG9mZnNldCA9IG9sZENlbnRlci5zdWJ0cmFjdChuZXdDZW50ZXIpO1xyXG5cclxuXHRcdGlmICghb2Zmc2V0LnggJiYgIW9mZnNldC55KSB7IHJldHVybiB0aGlzOyB9XHJcblxyXG5cdFx0aWYgKG9wdGlvbnMuYW5pbWF0ZSAmJiBvcHRpb25zLnBhbikge1xyXG5cdFx0XHR0aGlzLnBhbkJ5KG9mZnNldCk7XHJcblxyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0aWYgKG9wdGlvbnMucGFuKSB7XHJcblx0XHRcdFx0dGhpcy5fcmF3UGFuQnkob2Zmc2V0KTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0dGhpcy5maXJlKCdtb3ZlJyk7XHJcblxyXG5cdFx0XHRpZiAob3B0aW9ucy5kZWJvdW5jZU1vdmVlbmQpIHtcclxuXHRcdFx0XHRjbGVhclRpbWVvdXQodGhpcy5fc2l6ZVRpbWVyKTtcclxuXHRcdFx0XHR0aGlzLl9zaXplVGltZXIgPSBzZXRUaW1lb3V0KEwuYmluZCh0aGlzLmZpcmUsIHRoaXMsICdtb3ZlZW5kJyksIDIwMCk7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0dGhpcy5maXJlKCdtb3ZlZW5kJyk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0XHRyZXR1cm4gdGhpcy5maXJlKCdyZXNpemUnLCB7XHJcblx0XHRcdG9sZFNpemU6IG9sZFNpemUsXHJcblx0XHRcdG5ld1NpemU6IG5ld1NpemVcclxuXHRcdH0pO1xyXG5cdH0sXHJcblxyXG5cdC8vIFRPRE8gaGFuZGxlci5hZGRUb1xyXG5cdGFkZEhhbmRsZXI6IGZ1bmN0aW9uIChuYW1lLCBIYW5kbGVyQ2xhc3MpIHtcclxuXHRcdGlmICghSGFuZGxlckNsYXNzKSB7IHJldHVybiB0aGlzOyB9XHJcblxyXG5cdFx0dmFyIGhhbmRsZXIgPSB0aGlzW25hbWVdID0gbmV3IEhhbmRsZXJDbGFzcyh0aGlzKTtcclxuXHJcblx0XHR0aGlzLl9oYW5kbGVycy5wdXNoKGhhbmRsZXIpO1xyXG5cclxuXHRcdGlmICh0aGlzLm9wdGlvbnNbbmFtZV0pIHtcclxuXHRcdFx0aGFuZGxlci5lbmFibGUoKTtcclxuXHRcdH1cclxuXHJcblx0XHRyZXR1cm4gdGhpcztcclxuXHR9LFxyXG5cclxuXHRyZW1vdmU6IGZ1bmN0aW9uICgpIHtcclxuXHRcdGlmICh0aGlzLl9sb2FkZWQpIHtcclxuXHRcdFx0dGhpcy5maXJlKCd1bmxvYWQnKTtcclxuXHRcdH1cclxuXHJcblx0XHR0aGlzLl9pbml0RXZlbnRzKCdvZmYnKTtcclxuXHJcblx0XHR0cnkge1xyXG5cdFx0XHQvLyB0aHJvd3MgZXJyb3IgaW4gSUU2LThcclxuXHRcdFx0ZGVsZXRlIHRoaXMuX2NvbnRhaW5lci5fbGVhZmxldDtcclxuXHRcdH0gY2F0Y2ggKGUpIHtcclxuXHRcdFx0dGhpcy5fY29udGFpbmVyLl9sZWFmbGV0ID0gdW5kZWZpbmVkO1xyXG5cdFx0fVxyXG5cclxuXHRcdHRoaXMuX2NsZWFyUGFuZXMoKTtcclxuXHRcdGlmICh0aGlzLl9jbGVhckNvbnRyb2xQb3MpIHtcclxuXHRcdFx0dGhpcy5fY2xlYXJDb250cm9sUG9zKCk7XHJcblx0XHR9XHJcblxyXG5cdFx0dGhpcy5fY2xlYXJIYW5kbGVycygpO1xyXG5cclxuXHRcdHJldHVybiB0aGlzO1xyXG5cdH0sXHJcblxyXG5cclxuXHQvLyBwdWJsaWMgbWV0aG9kcyBmb3IgZ2V0dGluZyBtYXAgc3RhdGVcclxuXHJcblx0Z2V0Q2VudGVyOiBmdW5jdGlvbiAoKSB7IC8vIChCb29sZWFuKSAtPiBMYXRMbmdcclxuXHRcdHRoaXMuX2NoZWNrSWZMb2FkZWQoKTtcclxuXHJcblx0XHRpZiAodGhpcy5faW5pdGlhbENlbnRlciAmJiAhdGhpcy5fbW92ZWQoKSkge1xyXG5cdFx0XHRyZXR1cm4gdGhpcy5faW5pdGlhbENlbnRlcjtcclxuXHRcdH1cclxuXHRcdHJldHVybiB0aGlzLmxheWVyUG9pbnRUb0xhdExuZyh0aGlzLl9nZXRDZW50ZXJMYXllclBvaW50KCkpO1xyXG5cdH0sXHJcblxyXG5cdGdldFpvb206IGZ1bmN0aW9uICgpIHtcclxuXHRcdHJldHVybiB0aGlzLl96b29tO1xyXG5cdH0sXHJcblxyXG5cdGdldEJvdW5kczogZnVuY3Rpb24gKCkge1xyXG5cdFx0dmFyIGJvdW5kcyA9IHRoaXMuZ2V0UGl4ZWxCb3VuZHMoKSxcclxuXHRcdCAgICBzdyA9IHRoaXMudW5wcm9qZWN0KGJvdW5kcy5nZXRCb3R0b21MZWZ0KCkpLFxyXG5cdFx0ICAgIG5lID0gdGhpcy51bnByb2plY3QoYm91bmRzLmdldFRvcFJpZ2h0KCkpO1xyXG5cclxuXHRcdHJldHVybiBuZXcgTC5MYXRMbmdCb3VuZHMoc3csIG5lKTtcclxuXHR9LFxyXG5cclxuXHRnZXRNaW5ab29tOiBmdW5jdGlvbiAoKSB7XHJcblx0XHRyZXR1cm4gdGhpcy5vcHRpb25zLm1pblpvb20gPT09IHVuZGVmaW5lZCA/XHJcblx0XHRcdCh0aGlzLl9sYXllcnNNaW5ab29tID09PSB1bmRlZmluZWQgPyAwIDogdGhpcy5fbGF5ZXJzTWluWm9vbSkgOlxyXG5cdFx0XHR0aGlzLm9wdGlvbnMubWluWm9vbTtcclxuXHR9LFxyXG5cclxuXHRnZXRNYXhab29tOiBmdW5jdGlvbiAoKSB7XHJcblx0XHRyZXR1cm4gdGhpcy5vcHRpb25zLm1heFpvb20gPT09IHVuZGVmaW5lZCA/XHJcblx0XHRcdCh0aGlzLl9sYXllcnNNYXhab29tID09PSB1bmRlZmluZWQgPyBJbmZpbml0eSA6IHRoaXMuX2xheWVyc01heFpvb20pIDpcclxuXHRcdFx0dGhpcy5vcHRpb25zLm1heFpvb207XHJcblx0fSxcclxuXHJcblx0Z2V0Qm91bmRzWm9vbTogZnVuY3Rpb24gKGJvdW5kcywgaW5zaWRlLCBwYWRkaW5nKSB7IC8vIChMYXRMbmdCb3VuZHNbLCBCb29sZWFuLCBQb2ludF0pIC0+IE51bWJlclxyXG5cdFx0Ym91bmRzID0gTC5sYXRMbmdCb3VuZHMoYm91bmRzKTtcclxuXHJcblx0XHR2YXIgem9vbSA9IHRoaXMuZ2V0TWluWm9vbSgpIC0gKGluc2lkZSA/IDEgOiAwKSxcclxuXHRcdCAgICBtYXhab29tID0gdGhpcy5nZXRNYXhab29tKCksXHJcblx0XHQgICAgc2l6ZSA9IHRoaXMuZ2V0U2l6ZSgpLFxyXG5cclxuXHRcdCAgICBudyA9IGJvdW5kcy5nZXROb3J0aFdlc3QoKSxcclxuXHRcdCAgICBzZSA9IGJvdW5kcy5nZXRTb3V0aEVhc3QoKSxcclxuXHJcblx0XHQgICAgem9vbU5vdEZvdW5kID0gdHJ1ZSxcclxuXHRcdCAgICBib3VuZHNTaXplO1xyXG5cclxuXHRcdHBhZGRpbmcgPSBMLnBvaW50KHBhZGRpbmcgfHwgWzAsIDBdKTtcclxuXHJcblx0XHRkbyB7XHJcblx0XHRcdHpvb20rKztcclxuXHRcdFx0Ym91bmRzU2l6ZSA9IHRoaXMucHJvamVjdChzZSwgem9vbSkuc3VidHJhY3QodGhpcy5wcm9qZWN0KG53LCB6b29tKSkuYWRkKHBhZGRpbmcpO1xyXG5cdFx0XHR6b29tTm90Rm91bmQgPSAhaW5zaWRlID8gc2l6ZS5jb250YWlucyhib3VuZHNTaXplKSA6IGJvdW5kc1NpemUueCA8IHNpemUueCB8fCBib3VuZHNTaXplLnkgPCBzaXplLnk7XHJcblxyXG5cdFx0fSB3aGlsZSAoem9vbU5vdEZvdW5kICYmIHpvb20gPD0gbWF4Wm9vbSk7XHJcblxyXG5cdFx0aWYgKHpvb21Ob3RGb3VuZCAmJiBpbnNpZGUpIHtcclxuXHRcdFx0cmV0dXJuIG51bGw7XHJcblx0XHR9XHJcblxyXG5cdFx0cmV0dXJuIGluc2lkZSA/IHpvb20gOiB6b29tIC0gMTtcclxuXHR9LFxyXG5cclxuXHRnZXRTaXplOiBmdW5jdGlvbiAoKSB7XHJcblx0XHRpZiAoIXRoaXMuX3NpemUgfHwgdGhpcy5fc2l6ZUNoYW5nZWQpIHtcclxuXHRcdFx0dGhpcy5fc2l6ZSA9IG5ldyBMLlBvaW50KFxyXG5cdFx0XHRcdHRoaXMuX2NvbnRhaW5lci5jbGllbnRXaWR0aCxcclxuXHRcdFx0XHR0aGlzLl9jb250YWluZXIuY2xpZW50SGVpZ2h0KTtcclxuXHJcblx0XHRcdHRoaXMuX3NpemVDaGFuZ2VkID0gZmFsc2U7XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gdGhpcy5fc2l6ZS5jbG9uZSgpO1xyXG5cdH0sXHJcblxyXG5cdGdldFBpeGVsQm91bmRzOiBmdW5jdGlvbiAoKSB7XHJcblx0XHR2YXIgdG9wTGVmdFBvaW50ID0gdGhpcy5fZ2V0VG9wTGVmdFBvaW50KCk7XHJcblx0XHRyZXR1cm4gbmV3IEwuQm91bmRzKHRvcExlZnRQb2ludCwgdG9wTGVmdFBvaW50LmFkZCh0aGlzLmdldFNpemUoKSkpO1xyXG5cdH0sXHJcblxyXG5cdGdldFBpeGVsT3JpZ2luOiBmdW5jdGlvbiAoKSB7XHJcblx0XHR0aGlzLl9jaGVja0lmTG9hZGVkKCk7XHJcblx0XHRyZXR1cm4gdGhpcy5faW5pdGlhbFRvcExlZnRQb2ludDtcclxuXHR9LFxyXG5cclxuXHRnZXRQYW5lczogZnVuY3Rpb24gKCkge1xyXG5cdFx0cmV0dXJuIHRoaXMuX3BhbmVzO1xyXG5cdH0sXHJcblxyXG5cdGdldENvbnRhaW5lcjogZnVuY3Rpb24gKCkge1xyXG5cdFx0cmV0dXJuIHRoaXMuX2NvbnRhaW5lcjtcclxuXHR9LFxyXG5cclxuXHJcblx0Ly8gVE9ETyByZXBsYWNlIHdpdGggdW5pdmVyc2FsIGltcGxlbWVudGF0aW9uIGFmdGVyIHJlZmFjdG9yaW5nIHByb2plY3Rpb25zXHJcblxyXG5cdGdldFpvb21TY2FsZTogZnVuY3Rpb24gKHRvWm9vbSkge1xyXG5cdFx0dmFyIGNycyA9IHRoaXMub3B0aW9ucy5jcnM7XHJcblx0XHRyZXR1cm4gY3JzLnNjYWxlKHRvWm9vbSkgLyBjcnMuc2NhbGUodGhpcy5fem9vbSk7XHJcblx0fSxcclxuXHJcblx0Z2V0U2NhbGVab29tOiBmdW5jdGlvbiAoc2NhbGUpIHtcclxuXHRcdHJldHVybiB0aGlzLl96b29tICsgKE1hdGgubG9nKHNjYWxlKSAvIE1hdGguTE4yKTtcclxuXHR9LFxyXG5cclxuXHJcblx0Ly8gY29udmVyc2lvbiBtZXRob2RzXHJcblxyXG5cdHByb2plY3Q6IGZ1bmN0aW9uIChsYXRsbmcsIHpvb20pIHsgLy8gKExhdExuZ1ssIE51bWJlcl0pIC0+IFBvaW50XHJcblx0XHR6b29tID0gem9vbSA9PT0gdW5kZWZpbmVkID8gdGhpcy5fem9vbSA6IHpvb207XHJcblx0XHRyZXR1cm4gdGhpcy5vcHRpb25zLmNycy5sYXRMbmdUb1BvaW50KEwubGF0TG5nKGxhdGxuZyksIHpvb20pO1xyXG5cdH0sXHJcblxyXG5cdHVucHJvamVjdDogZnVuY3Rpb24gKHBvaW50LCB6b29tKSB7IC8vIChQb2ludFssIE51bWJlcl0pIC0+IExhdExuZ1xyXG5cdFx0em9vbSA9IHpvb20gPT09IHVuZGVmaW5lZCA/IHRoaXMuX3pvb20gOiB6b29tO1xyXG5cdFx0cmV0dXJuIHRoaXMub3B0aW9ucy5jcnMucG9pbnRUb0xhdExuZyhMLnBvaW50KHBvaW50KSwgem9vbSk7XHJcblx0fSxcclxuXHJcblx0bGF5ZXJQb2ludFRvTGF0TG5nOiBmdW5jdGlvbiAocG9pbnQpIHsgLy8gKFBvaW50KVxyXG5cdFx0dmFyIHByb2plY3RlZFBvaW50ID0gTC5wb2ludChwb2ludCkuYWRkKHRoaXMuZ2V0UGl4ZWxPcmlnaW4oKSk7XHJcblx0XHRyZXR1cm4gdGhpcy51bnByb2plY3QocHJvamVjdGVkUG9pbnQpO1xyXG5cdH0sXHJcblxyXG5cdGxhdExuZ1RvTGF5ZXJQb2ludDogZnVuY3Rpb24gKGxhdGxuZykgeyAvLyAoTGF0TG5nKVxyXG5cdFx0dmFyIHByb2plY3RlZFBvaW50ID0gdGhpcy5wcm9qZWN0KEwubGF0TG5nKGxhdGxuZykpLl9yb3VuZCgpO1xyXG5cdFx0cmV0dXJuIHByb2plY3RlZFBvaW50Ll9zdWJ0cmFjdCh0aGlzLmdldFBpeGVsT3JpZ2luKCkpO1xyXG5cdH0sXHJcblxyXG5cdGNvbnRhaW5lclBvaW50VG9MYXllclBvaW50OiBmdW5jdGlvbiAocG9pbnQpIHsgLy8gKFBvaW50KVxyXG5cdFx0cmV0dXJuIEwucG9pbnQocG9pbnQpLnN1YnRyYWN0KHRoaXMuX2dldE1hcFBhbmVQb3MoKSk7XHJcblx0fSxcclxuXHJcblx0bGF5ZXJQb2ludFRvQ29udGFpbmVyUG9pbnQ6IGZ1bmN0aW9uIChwb2ludCkgeyAvLyAoUG9pbnQpXHJcblx0XHRyZXR1cm4gTC5wb2ludChwb2ludCkuYWRkKHRoaXMuX2dldE1hcFBhbmVQb3MoKSk7XHJcblx0fSxcclxuXHJcblx0Y29udGFpbmVyUG9pbnRUb0xhdExuZzogZnVuY3Rpb24gKHBvaW50KSB7XHJcblx0XHR2YXIgbGF5ZXJQb2ludCA9IHRoaXMuY29udGFpbmVyUG9pbnRUb0xheWVyUG9pbnQoTC5wb2ludChwb2ludCkpO1xyXG5cdFx0cmV0dXJuIHRoaXMubGF5ZXJQb2ludFRvTGF0TG5nKGxheWVyUG9pbnQpO1xyXG5cdH0sXHJcblxyXG5cdGxhdExuZ1RvQ29udGFpbmVyUG9pbnQ6IGZ1bmN0aW9uIChsYXRsbmcpIHtcclxuXHRcdHJldHVybiB0aGlzLmxheWVyUG9pbnRUb0NvbnRhaW5lclBvaW50KHRoaXMubGF0TG5nVG9MYXllclBvaW50KEwubGF0TG5nKGxhdGxuZykpKTtcclxuXHR9LFxyXG5cclxuXHRtb3VzZUV2ZW50VG9Db250YWluZXJQb2ludDogZnVuY3Rpb24gKGUpIHsgLy8gKE1vdXNlRXZlbnQpXHJcblx0XHRyZXR1cm4gTC5Eb21FdmVudC5nZXRNb3VzZVBvc2l0aW9uKGUsIHRoaXMuX2NvbnRhaW5lcik7XHJcblx0fSxcclxuXHJcblx0bW91c2VFdmVudFRvTGF5ZXJQb2ludDogZnVuY3Rpb24gKGUpIHsgLy8gKE1vdXNlRXZlbnQpXHJcblx0XHRyZXR1cm4gdGhpcy5jb250YWluZXJQb2ludFRvTGF5ZXJQb2ludCh0aGlzLm1vdXNlRXZlbnRUb0NvbnRhaW5lclBvaW50KGUpKTtcclxuXHR9LFxyXG5cclxuXHRtb3VzZUV2ZW50VG9MYXRMbmc6IGZ1bmN0aW9uIChlKSB7IC8vIChNb3VzZUV2ZW50KVxyXG5cdFx0cmV0dXJuIHRoaXMubGF5ZXJQb2ludFRvTGF0TG5nKHRoaXMubW91c2VFdmVudFRvTGF5ZXJQb2ludChlKSk7XHJcblx0fSxcclxuXHJcblxyXG5cdC8vIG1hcCBpbml0aWFsaXphdGlvbiBtZXRob2RzXHJcblxyXG5cdF9pbml0Q29udGFpbmVyOiBmdW5jdGlvbiAoaWQpIHtcclxuXHRcdHZhciBjb250YWluZXIgPSB0aGlzLl9jb250YWluZXIgPSBMLkRvbVV0aWwuZ2V0KGlkKTtcclxuXHJcblx0XHRpZiAoIWNvbnRhaW5lcikge1xyXG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoJ01hcCBjb250YWluZXIgbm90IGZvdW5kLicpO1xyXG5cdFx0fSBlbHNlIGlmIChjb250YWluZXIuX2xlYWZsZXQpIHtcclxuXHRcdFx0dGhyb3cgbmV3IEVycm9yKCdNYXAgY29udGFpbmVyIGlzIGFscmVhZHkgaW5pdGlhbGl6ZWQuJyk7XHJcblx0XHR9XHJcblxyXG5cdFx0Y29udGFpbmVyLl9sZWFmbGV0ID0gdHJ1ZTtcclxuXHR9LFxyXG5cclxuXHRfaW5pdExheW91dDogZnVuY3Rpb24gKCkge1xyXG5cdFx0dmFyIGNvbnRhaW5lciA9IHRoaXMuX2NvbnRhaW5lcjtcclxuXHJcblx0XHRMLkRvbVV0aWwuYWRkQ2xhc3MoY29udGFpbmVyLCAnbGVhZmxldC1jb250YWluZXInICtcclxuXHRcdFx0KEwuQnJvd3Nlci50b3VjaCA/ICcgbGVhZmxldC10b3VjaCcgOiAnJykgK1xyXG5cdFx0XHQoTC5Ccm93c2VyLnJldGluYSA/ICcgbGVhZmxldC1yZXRpbmEnIDogJycpICtcclxuXHRcdFx0KEwuQnJvd3Nlci5pZWx0OSA/ICcgbGVhZmxldC1vbGRpZScgOiAnJykgK1xyXG5cdFx0XHQodGhpcy5vcHRpb25zLmZhZGVBbmltYXRpb24gPyAnIGxlYWZsZXQtZmFkZS1hbmltJyA6ICcnKSk7XHJcblxyXG5cdFx0dmFyIHBvc2l0aW9uID0gTC5Eb21VdGlsLmdldFN0eWxlKGNvbnRhaW5lciwgJ3Bvc2l0aW9uJyk7XHJcblxyXG5cdFx0aWYgKHBvc2l0aW9uICE9PSAnYWJzb2x1dGUnICYmIHBvc2l0aW9uICE9PSAncmVsYXRpdmUnICYmIHBvc2l0aW9uICE9PSAnZml4ZWQnKSB7XHJcblx0XHRcdGNvbnRhaW5lci5zdHlsZS5wb3NpdGlvbiA9ICdyZWxhdGl2ZSc7XHJcblx0XHR9XHJcblxyXG5cdFx0dGhpcy5faW5pdFBhbmVzKCk7XHJcblxyXG5cdFx0aWYgKHRoaXMuX2luaXRDb250cm9sUG9zKSB7XHJcblx0XHRcdHRoaXMuX2luaXRDb250cm9sUG9zKCk7XHJcblx0XHR9XHJcblx0fSxcclxuXHJcblx0X2luaXRQYW5lczogZnVuY3Rpb24gKCkge1xyXG5cdFx0dmFyIHBhbmVzID0gdGhpcy5fcGFuZXMgPSB7fTtcclxuXHJcblx0XHR0aGlzLl9tYXBQYW5lID0gcGFuZXMubWFwUGFuZSA9IHRoaXMuX2NyZWF0ZVBhbmUoJ2xlYWZsZXQtbWFwLXBhbmUnLCB0aGlzLl9jb250YWluZXIpO1xyXG5cclxuXHRcdHRoaXMuX3RpbGVQYW5lID0gcGFuZXMudGlsZVBhbmUgPSB0aGlzLl9jcmVhdGVQYW5lKCdsZWFmbGV0LXRpbGUtcGFuZScsIHRoaXMuX21hcFBhbmUpO1xyXG5cdFx0cGFuZXMub2JqZWN0c1BhbmUgPSB0aGlzLl9jcmVhdGVQYW5lKCdsZWFmbGV0LW9iamVjdHMtcGFuZScsIHRoaXMuX21hcFBhbmUpO1xyXG5cdFx0cGFuZXMuc2hhZG93UGFuZSA9IHRoaXMuX2NyZWF0ZVBhbmUoJ2xlYWZsZXQtc2hhZG93LXBhbmUnKTtcclxuXHRcdHBhbmVzLm92ZXJsYXlQYW5lID0gdGhpcy5fY3JlYXRlUGFuZSgnbGVhZmxldC1vdmVybGF5LXBhbmUnKTtcclxuXHRcdHBhbmVzLm1hcmtlclBhbmUgPSB0aGlzLl9jcmVhdGVQYW5lKCdsZWFmbGV0LW1hcmtlci1wYW5lJyk7XHJcblx0XHRwYW5lcy5wb3B1cFBhbmUgPSB0aGlzLl9jcmVhdGVQYW5lKCdsZWFmbGV0LXBvcHVwLXBhbmUnKTtcclxuXHJcblx0XHR2YXIgem9vbUhpZGUgPSAnIGxlYWZsZXQtem9vbS1oaWRlJztcclxuXHJcblx0XHRpZiAoIXRoaXMub3B0aW9ucy5tYXJrZXJab29tQW5pbWF0aW9uKSB7XHJcblx0XHRcdEwuRG9tVXRpbC5hZGRDbGFzcyhwYW5lcy5tYXJrZXJQYW5lLCB6b29tSGlkZSk7XHJcblx0XHRcdEwuRG9tVXRpbC5hZGRDbGFzcyhwYW5lcy5zaGFkb3dQYW5lLCB6b29tSGlkZSk7XHJcblx0XHRcdEwuRG9tVXRpbC5hZGRDbGFzcyhwYW5lcy5wb3B1cFBhbmUsIHpvb21IaWRlKTtcclxuXHRcdH1cclxuXHR9LFxyXG5cclxuXHRfY3JlYXRlUGFuZTogZnVuY3Rpb24gKGNsYXNzTmFtZSwgY29udGFpbmVyKSB7XHJcblx0XHRyZXR1cm4gTC5Eb21VdGlsLmNyZWF0ZSgnZGl2JywgY2xhc3NOYW1lLCBjb250YWluZXIgfHwgdGhpcy5fcGFuZXMub2JqZWN0c1BhbmUpO1xyXG5cdH0sXHJcblxyXG5cdF9jbGVhclBhbmVzOiBmdW5jdGlvbiAoKSB7XHJcblx0XHR0aGlzLl9jb250YWluZXIucmVtb3ZlQ2hpbGQodGhpcy5fbWFwUGFuZSk7XHJcblx0fSxcclxuXHJcblx0X2FkZExheWVyczogZnVuY3Rpb24gKGxheWVycykge1xyXG5cdFx0bGF5ZXJzID0gbGF5ZXJzID8gKEwuVXRpbC5pc0FycmF5KGxheWVycykgPyBsYXllcnMgOiBbbGF5ZXJzXSkgOiBbXTtcclxuXHJcblx0XHRmb3IgKHZhciBpID0gMCwgbGVuID0gbGF5ZXJzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XHJcblx0XHRcdHRoaXMuYWRkTGF5ZXIobGF5ZXJzW2ldKTtcclxuXHRcdH1cclxuXHR9LFxyXG5cclxuXHJcblx0Ly8gcHJpdmF0ZSBtZXRob2RzIHRoYXQgbW9kaWZ5IG1hcCBzdGF0ZVxyXG5cclxuXHRfcmVzZXRWaWV3OiBmdW5jdGlvbiAoY2VudGVyLCB6b29tLCBwcmVzZXJ2ZU1hcE9mZnNldCwgYWZ0ZXJab29tQW5pbSkge1xyXG5cclxuXHRcdHZhciB6b29tQ2hhbmdlZCA9ICh0aGlzLl96b29tICE9PSB6b29tKTtcclxuXHJcblx0XHRpZiAoIWFmdGVyWm9vbUFuaW0pIHtcclxuXHRcdFx0dGhpcy5maXJlKCdtb3Zlc3RhcnQnKTtcclxuXHJcblx0XHRcdGlmICh6b29tQ2hhbmdlZCkge1xyXG5cdFx0XHRcdHRoaXMuZmlyZSgnem9vbXN0YXJ0Jyk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0XHR0aGlzLl96b29tID0gem9vbTtcclxuXHRcdHRoaXMuX2luaXRpYWxDZW50ZXIgPSBjZW50ZXI7XHJcblxyXG5cdFx0dGhpcy5faW5pdGlhbFRvcExlZnRQb2ludCA9IHRoaXMuX2dldE5ld1RvcExlZnRQb2ludChjZW50ZXIpO1xyXG5cclxuXHRcdGlmICghcHJlc2VydmVNYXBPZmZzZXQpIHtcclxuXHRcdFx0TC5Eb21VdGlsLnNldFBvc2l0aW9uKHRoaXMuX21hcFBhbmUsIG5ldyBMLlBvaW50KDAsIDApKTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdHRoaXMuX2luaXRpYWxUb3BMZWZ0UG9pbnQuX2FkZCh0aGlzLl9nZXRNYXBQYW5lUG9zKCkpO1xyXG5cdFx0fVxyXG5cclxuXHRcdHRoaXMuX3RpbGVMYXllcnNUb0xvYWQgPSB0aGlzLl90aWxlTGF5ZXJzTnVtO1xyXG5cclxuXHRcdHZhciBsb2FkaW5nID0gIXRoaXMuX2xvYWRlZDtcclxuXHRcdHRoaXMuX2xvYWRlZCA9IHRydWU7XHJcblxyXG5cdFx0dGhpcy5maXJlKCd2aWV3cmVzZXQnLCB7aGFyZDogIXByZXNlcnZlTWFwT2Zmc2V0fSk7XHJcblxyXG5cdFx0aWYgKGxvYWRpbmcpIHtcclxuXHRcdFx0dGhpcy5maXJlKCdsb2FkJyk7XHJcblx0XHRcdHRoaXMuZWFjaExheWVyKHRoaXMuX2xheWVyQWRkLCB0aGlzKTtcclxuXHRcdH1cclxuXHJcblx0XHR0aGlzLmZpcmUoJ21vdmUnKTtcclxuXHJcblx0XHRpZiAoem9vbUNoYW5nZWQgfHwgYWZ0ZXJab29tQW5pbSkge1xyXG5cdFx0XHR0aGlzLmZpcmUoJ3pvb21lbmQnKTtcclxuXHRcdH1cclxuXHJcblx0XHR0aGlzLmZpcmUoJ21vdmVlbmQnLCB7aGFyZDogIXByZXNlcnZlTWFwT2Zmc2V0fSk7XHJcblx0fSxcclxuXHJcblx0X3Jhd1BhbkJ5OiBmdW5jdGlvbiAob2Zmc2V0KSB7XHJcblx0XHRMLkRvbVV0aWwuc2V0UG9zaXRpb24odGhpcy5fbWFwUGFuZSwgdGhpcy5fZ2V0TWFwUGFuZVBvcygpLnN1YnRyYWN0KG9mZnNldCkpO1xyXG5cdH0sXHJcblxyXG5cdF9nZXRab29tU3BhbjogZnVuY3Rpb24gKCkge1xyXG5cdFx0cmV0dXJuIHRoaXMuZ2V0TWF4Wm9vbSgpIC0gdGhpcy5nZXRNaW5ab29tKCk7XHJcblx0fSxcclxuXHJcblx0X3VwZGF0ZVpvb21MZXZlbHM6IGZ1bmN0aW9uICgpIHtcclxuXHRcdHZhciBpLFxyXG5cdFx0XHRtaW5ab29tID0gSW5maW5pdHksXHJcblx0XHRcdG1heFpvb20gPSAtSW5maW5pdHksXHJcblx0XHRcdG9sZFpvb21TcGFuID0gdGhpcy5fZ2V0Wm9vbVNwYW4oKTtcclxuXHJcblx0XHRmb3IgKGkgaW4gdGhpcy5fem9vbUJvdW5kTGF5ZXJzKSB7XHJcblx0XHRcdHZhciBsYXllciA9IHRoaXMuX3pvb21Cb3VuZExheWVyc1tpXTtcclxuXHRcdFx0aWYgKCFpc05hTihsYXllci5vcHRpb25zLm1pblpvb20pKSB7XHJcblx0XHRcdFx0bWluWm9vbSA9IE1hdGgubWluKG1pblpvb20sIGxheWVyLm9wdGlvbnMubWluWm9vbSk7XHJcblx0XHRcdH1cclxuXHRcdFx0aWYgKCFpc05hTihsYXllci5vcHRpb25zLm1heFpvb20pKSB7XHJcblx0XHRcdFx0bWF4Wm9vbSA9IE1hdGgubWF4KG1heFpvb20sIGxheWVyLm9wdGlvbnMubWF4Wm9vbSk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0XHRpZiAoaSA9PT0gdW5kZWZpbmVkKSB7IC8vIHdlIGhhdmUgbm8gdGlsZWxheWVyc1xyXG5cdFx0XHR0aGlzLl9sYXllcnNNYXhab29tID0gdGhpcy5fbGF5ZXJzTWluWm9vbSA9IHVuZGVmaW5lZDtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdHRoaXMuX2xheWVyc01heFpvb20gPSBtYXhab29tO1xyXG5cdFx0XHR0aGlzLl9sYXllcnNNaW5ab29tID0gbWluWm9vbTtcclxuXHRcdH1cclxuXHJcblx0XHRpZiAob2xkWm9vbVNwYW4gIT09IHRoaXMuX2dldFpvb21TcGFuKCkpIHtcclxuXHRcdFx0dGhpcy5maXJlKCd6b29tbGV2ZWxzY2hhbmdlJyk7XHJcblx0XHR9XHJcblx0fSxcclxuXHJcblx0X3Bhbkluc2lkZU1heEJvdW5kczogZnVuY3Rpb24gKCkge1xyXG5cdFx0dGhpcy5wYW5JbnNpZGVCb3VuZHModGhpcy5vcHRpb25zLm1heEJvdW5kcyk7XHJcblx0fSxcclxuXHJcblx0X2NoZWNrSWZMb2FkZWQ6IGZ1bmN0aW9uICgpIHtcclxuXHRcdGlmICghdGhpcy5fbG9hZGVkKSB7XHJcblx0XHRcdHRocm93IG5ldyBFcnJvcignU2V0IG1hcCBjZW50ZXIgYW5kIHpvb20gZmlyc3QuJyk7XHJcblx0XHR9XHJcblx0fSxcclxuXHJcblx0Ly8gbWFwIGV2ZW50c1xyXG5cclxuXHRfaW5pdEV2ZW50czogZnVuY3Rpb24gKG9uT2ZmKSB7XHJcblx0XHRpZiAoIUwuRG9tRXZlbnQpIHsgcmV0dXJuOyB9XHJcblxyXG5cdFx0b25PZmYgPSBvbk9mZiB8fCAnb24nO1xyXG5cclxuXHRcdEwuRG9tRXZlbnRbb25PZmZdKHRoaXMuX2NvbnRhaW5lciwgJ2NsaWNrJywgdGhpcy5fb25Nb3VzZUNsaWNrLCB0aGlzKTtcclxuXHJcblx0XHR2YXIgZXZlbnRzID0gWydkYmxjbGljaycsICdtb3VzZWRvd24nLCAnbW91c2V1cCcsICdtb3VzZWVudGVyJyxcclxuXHRcdCAgICAgICAgICAgICAgJ21vdXNlbGVhdmUnLCAnbW91c2Vtb3ZlJywgJ2NvbnRleHRtZW51J10sXHJcblx0XHQgICAgaSwgbGVuO1xyXG5cclxuXHRcdGZvciAoaSA9IDAsIGxlbiA9IGV2ZW50cy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xyXG5cdFx0XHRMLkRvbUV2ZW50W29uT2ZmXSh0aGlzLl9jb250YWluZXIsIGV2ZW50c1tpXSwgdGhpcy5fZmlyZU1vdXNlRXZlbnQsIHRoaXMpO1xyXG5cdFx0fVxyXG5cclxuXHRcdGlmICh0aGlzLm9wdGlvbnMudHJhY2tSZXNpemUpIHtcclxuXHRcdFx0TC5Eb21FdmVudFtvbk9mZl0od2luZG93LCAncmVzaXplJywgdGhpcy5fb25SZXNpemUsIHRoaXMpO1xyXG5cdFx0fVxyXG5cdH0sXHJcblxyXG5cdF9vblJlc2l6ZTogZnVuY3Rpb24gKCkge1xyXG5cdFx0TC5VdGlsLmNhbmNlbEFuaW1GcmFtZSh0aGlzLl9yZXNpemVSZXF1ZXN0KTtcclxuXHRcdHRoaXMuX3Jlc2l6ZVJlcXVlc3QgPSBMLlV0aWwucmVxdWVzdEFuaW1GcmFtZShcclxuXHRcdCAgICAgICAgZnVuY3Rpb24gKCkgeyB0aGlzLmludmFsaWRhdGVTaXplKHtkZWJvdW5jZU1vdmVlbmQ6IHRydWV9KTsgfSwgdGhpcywgZmFsc2UsIHRoaXMuX2NvbnRhaW5lcik7XHJcblx0fSxcclxuXHJcblx0X29uTW91c2VDbGljazogZnVuY3Rpb24gKGUpIHtcclxuXHRcdGlmICghdGhpcy5fbG9hZGVkIHx8ICghZS5fc2ltdWxhdGVkICYmXHJcblx0XHQgICAgICAgICgodGhpcy5kcmFnZ2luZyAmJiB0aGlzLmRyYWdnaW5nLm1vdmVkKCkpIHx8XHJcblx0XHQgICAgICAgICAodGhpcy5ib3hab29tICAmJiB0aGlzLmJveFpvb20ubW92ZWQoKSkpKSB8fFxyXG5cdFx0ICAgICAgICAgICAgTC5Eb21FdmVudC5fc2tpcHBlZChlKSkgeyByZXR1cm47IH1cclxuXHJcblx0XHR0aGlzLmZpcmUoJ3ByZWNsaWNrJyk7XHJcblx0XHR0aGlzLl9maXJlTW91c2VFdmVudChlKTtcclxuXHR9LFxyXG5cclxuXHRfZmlyZU1vdXNlRXZlbnQ6IGZ1bmN0aW9uIChlKSB7XHJcblx0XHRpZiAoIXRoaXMuX2xvYWRlZCB8fCBMLkRvbUV2ZW50Ll9za2lwcGVkKGUpKSB7IHJldHVybjsgfVxyXG5cclxuXHRcdHZhciB0eXBlID0gZS50eXBlO1xyXG5cclxuXHRcdHR5cGUgPSAodHlwZSA9PT0gJ21vdXNlZW50ZXInID8gJ21vdXNlb3ZlcicgOiAodHlwZSA9PT0gJ21vdXNlbGVhdmUnID8gJ21vdXNlb3V0JyA6IHR5cGUpKTtcclxuXHJcblx0XHRpZiAoIXRoaXMuaGFzRXZlbnRMaXN0ZW5lcnModHlwZSkpIHsgcmV0dXJuOyB9XHJcblxyXG5cdFx0aWYgKHR5cGUgPT09ICdjb250ZXh0bWVudScpIHtcclxuXHRcdFx0TC5Eb21FdmVudC5wcmV2ZW50RGVmYXVsdChlKTtcclxuXHRcdH1cclxuXHJcblx0XHR2YXIgY29udGFpbmVyUG9pbnQgPSB0aGlzLm1vdXNlRXZlbnRUb0NvbnRhaW5lclBvaW50KGUpLFxyXG5cdFx0ICAgIGxheWVyUG9pbnQgPSB0aGlzLmNvbnRhaW5lclBvaW50VG9MYXllclBvaW50KGNvbnRhaW5lclBvaW50KSxcclxuXHRcdCAgICBsYXRsbmcgPSB0aGlzLmxheWVyUG9pbnRUb0xhdExuZyhsYXllclBvaW50KTtcclxuXHJcblx0XHR0aGlzLmZpcmUodHlwZSwge1xyXG5cdFx0XHRsYXRsbmc6IGxhdGxuZyxcclxuXHRcdFx0bGF5ZXJQb2ludDogbGF5ZXJQb2ludCxcclxuXHRcdFx0Y29udGFpbmVyUG9pbnQ6IGNvbnRhaW5lclBvaW50LFxyXG5cdFx0XHRvcmlnaW5hbEV2ZW50OiBlXHJcblx0XHR9KTtcclxuXHR9LFxyXG5cclxuXHRfb25UaWxlTGF5ZXJMb2FkOiBmdW5jdGlvbiAoKSB7XHJcblx0XHR0aGlzLl90aWxlTGF5ZXJzVG9Mb2FkLS07XHJcblx0XHRpZiAodGhpcy5fdGlsZUxheWVyc051bSAmJiAhdGhpcy5fdGlsZUxheWVyc1RvTG9hZCkge1xyXG5cdFx0XHR0aGlzLmZpcmUoJ3RpbGVsYXllcnNsb2FkJyk7XHJcblx0XHR9XHJcblx0fSxcclxuXHJcblx0X2NsZWFySGFuZGxlcnM6IGZ1bmN0aW9uICgpIHtcclxuXHRcdGZvciAodmFyIGkgPSAwLCBsZW4gPSB0aGlzLl9oYW5kbGVycy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xyXG5cdFx0XHR0aGlzLl9oYW5kbGVyc1tpXS5kaXNhYmxlKCk7XHJcblx0XHR9XHJcblx0fSxcclxuXHJcblx0d2hlblJlYWR5OiBmdW5jdGlvbiAoY2FsbGJhY2ssIGNvbnRleHQpIHtcclxuXHRcdGlmICh0aGlzLl9sb2FkZWQpIHtcclxuXHRcdFx0Y2FsbGJhY2suY2FsbChjb250ZXh0IHx8IHRoaXMsIHRoaXMpO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0dGhpcy5vbignbG9hZCcsIGNhbGxiYWNrLCBjb250ZXh0KTtcclxuXHRcdH1cclxuXHRcdHJldHVybiB0aGlzO1xyXG5cdH0sXHJcblxyXG5cdF9sYXllckFkZDogZnVuY3Rpb24gKGxheWVyKSB7XHJcblx0XHRsYXllci5vbkFkZCh0aGlzKTtcclxuXHRcdHRoaXMuZmlyZSgnbGF5ZXJhZGQnLCB7bGF5ZXI6IGxheWVyfSk7XHJcblx0fSxcclxuXHJcblxyXG5cdC8vIHByaXZhdGUgbWV0aG9kcyBmb3IgZ2V0dGluZyBtYXAgc3RhdGVcclxuXHJcblx0X2dldE1hcFBhbmVQb3M6IGZ1bmN0aW9uICgpIHtcclxuXHRcdHJldHVybiBMLkRvbVV0aWwuZ2V0UG9zaXRpb24odGhpcy5fbWFwUGFuZSk7XHJcblx0fSxcclxuXHJcblx0X21vdmVkOiBmdW5jdGlvbiAoKSB7XHJcblx0XHR2YXIgcG9zID0gdGhpcy5fZ2V0TWFwUGFuZVBvcygpO1xyXG5cdFx0cmV0dXJuIHBvcyAmJiAhcG9zLmVxdWFscyhbMCwgMF0pO1xyXG5cdH0sXHJcblxyXG5cdF9nZXRUb3BMZWZ0UG9pbnQ6IGZ1bmN0aW9uICgpIHtcclxuXHRcdHJldHVybiB0aGlzLmdldFBpeGVsT3JpZ2luKCkuc3VidHJhY3QodGhpcy5fZ2V0TWFwUGFuZVBvcygpKTtcclxuXHR9LFxyXG5cclxuXHRfZ2V0TmV3VG9wTGVmdFBvaW50OiBmdW5jdGlvbiAoY2VudGVyLCB6b29tKSB7XHJcblx0XHR2YXIgdmlld0hhbGYgPSB0aGlzLmdldFNpemUoKS5fZGl2aWRlQnkoMik7XHJcblx0XHQvLyBUT0RPIHJvdW5kIG9uIGRpc3BsYXksIG5vdCBjYWxjdWxhdGlvbiB0byBpbmNyZWFzZSBwcmVjaXNpb24/XHJcblx0XHRyZXR1cm4gdGhpcy5wcm9qZWN0KGNlbnRlciwgem9vbSkuX3N1YnRyYWN0KHZpZXdIYWxmKS5fcm91bmQoKTtcclxuXHR9LFxyXG5cclxuXHRfbGF0TG5nVG9OZXdMYXllclBvaW50OiBmdW5jdGlvbiAobGF0bG5nLCBuZXdab29tLCBuZXdDZW50ZXIpIHtcclxuXHRcdHZhciB0b3BMZWZ0ID0gdGhpcy5fZ2V0TmV3VG9wTGVmdFBvaW50KG5ld0NlbnRlciwgbmV3Wm9vbSkuYWRkKHRoaXMuX2dldE1hcFBhbmVQb3MoKSk7XHJcblx0XHRyZXR1cm4gdGhpcy5wcm9qZWN0KGxhdGxuZywgbmV3Wm9vbSkuX3N1YnRyYWN0KHRvcExlZnQpO1xyXG5cdH0sXHJcblxyXG5cdC8vIGxheWVyIHBvaW50IG9mIHRoZSBjdXJyZW50IGNlbnRlclxyXG5cdF9nZXRDZW50ZXJMYXllclBvaW50OiBmdW5jdGlvbiAoKSB7XHJcblx0XHRyZXR1cm4gdGhpcy5jb250YWluZXJQb2ludFRvTGF5ZXJQb2ludCh0aGlzLmdldFNpemUoKS5fZGl2aWRlQnkoMikpO1xyXG5cdH0sXHJcblxyXG5cdC8vIG9mZnNldCBvZiB0aGUgc3BlY2lmaWVkIHBsYWNlIHRvIHRoZSBjdXJyZW50IGNlbnRlciBpbiBwaXhlbHNcclxuXHRfZ2V0Q2VudGVyT2Zmc2V0OiBmdW5jdGlvbiAobGF0bG5nKSB7XHJcblx0XHRyZXR1cm4gdGhpcy5sYXRMbmdUb0xheWVyUG9pbnQobGF0bG5nKS5zdWJ0cmFjdCh0aGlzLl9nZXRDZW50ZXJMYXllclBvaW50KCkpO1xyXG5cdH0sXHJcblxyXG5cdC8vIGFkanVzdCBjZW50ZXIgZm9yIHZpZXcgdG8gZ2V0IGluc2lkZSBib3VuZHNcclxuXHRfbGltaXRDZW50ZXI6IGZ1bmN0aW9uIChjZW50ZXIsIHpvb20sIGJvdW5kcykge1xyXG5cclxuXHRcdGlmICghYm91bmRzKSB7IHJldHVybiBjZW50ZXI7IH1cclxuXHJcblx0XHR2YXIgY2VudGVyUG9pbnQgPSB0aGlzLnByb2plY3QoY2VudGVyLCB6b29tKSxcclxuXHRcdCAgICB2aWV3SGFsZiA9IHRoaXMuZ2V0U2l6ZSgpLmRpdmlkZUJ5KDIpLFxyXG5cdFx0ICAgIHZpZXdCb3VuZHMgPSBuZXcgTC5Cb3VuZHMoY2VudGVyUG9pbnQuc3VidHJhY3Qodmlld0hhbGYpLCBjZW50ZXJQb2ludC5hZGQodmlld0hhbGYpKSxcclxuXHRcdCAgICBvZmZzZXQgPSB0aGlzLl9nZXRCb3VuZHNPZmZzZXQodmlld0JvdW5kcywgYm91bmRzLCB6b29tKTtcclxuXHJcblx0XHRyZXR1cm4gdGhpcy51bnByb2plY3QoY2VudGVyUG9pbnQuYWRkKG9mZnNldCksIHpvb20pO1xyXG5cdH0sXHJcblxyXG5cdC8vIGFkanVzdCBvZmZzZXQgZm9yIHZpZXcgdG8gZ2V0IGluc2lkZSBib3VuZHNcclxuXHRfbGltaXRPZmZzZXQ6IGZ1bmN0aW9uIChvZmZzZXQsIGJvdW5kcykge1xyXG5cdFx0aWYgKCFib3VuZHMpIHsgcmV0dXJuIG9mZnNldDsgfVxyXG5cclxuXHRcdHZhciB2aWV3Qm91bmRzID0gdGhpcy5nZXRQaXhlbEJvdW5kcygpLFxyXG5cdFx0ICAgIG5ld0JvdW5kcyA9IG5ldyBMLkJvdW5kcyh2aWV3Qm91bmRzLm1pbi5hZGQob2Zmc2V0KSwgdmlld0JvdW5kcy5tYXguYWRkKG9mZnNldCkpO1xyXG5cclxuXHRcdHJldHVybiBvZmZzZXQuYWRkKHRoaXMuX2dldEJvdW5kc09mZnNldChuZXdCb3VuZHMsIGJvdW5kcykpO1xyXG5cdH0sXHJcblxyXG5cdC8vIHJldHVybnMgb2Zmc2V0IG5lZWRlZCBmb3IgcHhCb3VuZHMgdG8gZ2V0IGluc2lkZSBtYXhCb3VuZHMgYXQgYSBzcGVjaWZpZWQgem9vbVxyXG5cdF9nZXRCb3VuZHNPZmZzZXQ6IGZ1bmN0aW9uIChweEJvdW5kcywgbWF4Qm91bmRzLCB6b29tKSB7XHJcblx0XHR2YXIgbndPZmZzZXQgPSB0aGlzLnByb2plY3QobWF4Qm91bmRzLmdldE5vcnRoV2VzdCgpLCB6b29tKS5zdWJ0cmFjdChweEJvdW5kcy5taW4pLFxyXG5cdFx0ICAgIHNlT2Zmc2V0ID0gdGhpcy5wcm9qZWN0KG1heEJvdW5kcy5nZXRTb3V0aEVhc3QoKSwgem9vbSkuc3VidHJhY3QocHhCb3VuZHMubWF4KSxcclxuXHJcblx0XHQgICAgZHggPSB0aGlzLl9yZWJvdW5kKG53T2Zmc2V0LngsIC1zZU9mZnNldC54KSxcclxuXHRcdCAgICBkeSA9IHRoaXMuX3JlYm91bmQobndPZmZzZXQueSwgLXNlT2Zmc2V0LnkpO1xyXG5cclxuXHRcdHJldHVybiBuZXcgTC5Qb2ludChkeCwgZHkpO1xyXG5cdH0sXHJcblxyXG5cdF9yZWJvdW5kOiBmdW5jdGlvbiAobGVmdCwgcmlnaHQpIHtcclxuXHRcdHJldHVybiBsZWZ0ICsgcmlnaHQgPiAwID9cclxuXHRcdFx0TWF0aC5yb3VuZChsZWZ0IC0gcmlnaHQpIC8gMiA6XHJcblx0XHRcdE1hdGgubWF4KDAsIE1hdGguY2VpbChsZWZ0KSkgLSBNYXRoLm1heCgwLCBNYXRoLmZsb29yKHJpZ2h0KSk7XHJcblx0fSxcclxuXHJcblx0X2xpbWl0Wm9vbTogZnVuY3Rpb24gKHpvb20pIHtcclxuXHRcdHZhciBtaW4gPSB0aGlzLmdldE1pblpvb20oKSxcclxuXHRcdCAgICBtYXggPSB0aGlzLmdldE1heFpvb20oKTtcclxuXHJcblx0XHRyZXR1cm4gTWF0aC5tYXgobWluLCBNYXRoLm1pbihtYXgsIHpvb20pKTtcclxuXHR9XHJcbn0pO1xyXG5cclxuTC5tYXAgPSBmdW5jdGlvbiAoaWQsIG9wdGlvbnMpIHtcclxuXHRyZXR1cm4gbmV3IEwuTWFwKGlkLCBvcHRpb25zKTtcclxufTtcclxuXG5cbi8qXHJcbiAqIE1lcmNhdG9yIHByb2plY3Rpb24gdGhhdCB0YWtlcyBpbnRvIGFjY291bnQgdGhhdCB0aGUgRWFydGggaXMgbm90IGEgcGVyZmVjdCBzcGhlcmUuXHJcbiAqIExlc3MgcG9wdWxhciB0aGFuIHNwaGVyaWNhbCBtZXJjYXRvcjsgdXNlZCBieSBwcm9qZWN0aW9ucyBsaWtlIEVQU0c6MzM5NS5cclxuICovXHJcblxyXG5MLlByb2plY3Rpb24uTWVyY2F0b3IgPSB7XHJcblx0TUFYX0xBVElUVURFOiA4NS4wODQwNTkxNTU2LFxyXG5cclxuXHRSX01JTk9SOiA2MzU2NzUyLjMxNDI0NTE3OSxcclxuXHRSX01BSk9SOiA2Mzc4MTM3LFxyXG5cclxuXHRwcm9qZWN0OiBmdW5jdGlvbiAobGF0bG5nKSB7IC8vIChMYXRMbmcpIC0+IFBvaW50XHJcblx0XHR2YXIgZCA9IEwuTGF0TG5nLkRFR19UT19SQUQsXHJcblx0XHQgICAgbWF4ID0gdGhpcy5NQVhfTEFUSVRVREUsXHJcblx0XHQgICAgbGF0ID0gTWF0aC5tYXgoTWF0aC5taW4obWF4LCBsYXRsbmcubGF0KSwgLW1heCksXHJcblx0XHQgICAgciA9IHRoaXMuUl9NQUpPUixcclxuXHRcdCAgICByMiA9IHRoaXMuUl9NSU5PUixcclxuXHRcdCAgICB4ID0gbGF0bG5nLmxuZyAqIGQgKiByLFxyXG5cdFx0ICAgIHkgPSBsYXQgKiBkLFxyXG5cdFx0ICAgIHRtcCA9IHIyIC8gcixcclxuXHRcdCAgICBlY2NlbnQgPSBNYXRoLnNxcnQoMS4wIC0gdG1wICogdG1wKSxcclxuXHRcdCAgICBjb24gPSBlY2NlbnQgKiBNYXRoLnNpbih5KTtcclxuXHJcblx0XHRjb24gPSBNYXRoLnBvdygoMSAtIGNvbikgLyAoMSArIGNvbiksIGVjY2VudCAqIDAuNSk7XHJcblxyXG5cdFx0dmFyIHRzID0gTWF0aC50YW4oMC41ICogKChNYXRoLlBJICogMC41KSAtIHkpKSAvIGNvbjtcclxuXHRcdHkgPSAtciAqIE1hdGgubG9nKHRzKTtcclxuXHJcblx0XHRyZXR1cm4gbmV3IEwuUG9pbnQoeCwgeSk7XHJcblx0fSxcclxuXHJcblx0dW5wcm9qZWN0OiBmdW5jdGlvbiAocG9pbnQpIHsgLy8gKFBvaW50LCBCb29sZWFuKSAtPiBMYXRMbmdcclxuXHRcdHZhciBkID0gTC5MYXRMbmcuUkFEX1RPX0RFRyxcclxuXHRcdCAgICByID0gdGhpcy5SX01BSk9SLFxyXG5cdFx0ICAgIHIyID0gdGhpcy5SX01JTk9SLFxyXG5cdFx0ICAgIGxuZyA9IHBvaW50LnggKiBkIC8gcixcclxuXHRcdCAgICB0bXAgPSByMiAvIHIsXHJcblx0XHQgICAgZWNjZW50ID0gTWF0aC5zcXJ0KDEgLSAodG1wICogdG1wKSksXHJcblx0XHQgICAgdHMgPSBNYXRoLmV4cCgtIHBvaW50LnkgLyByKSxcclxuXHRcdCAgICBwaGkgPSAoTWF0aC5QSSAvIDIpIC0gMiAqIE1hdGguYXRhbih0cyksXHJcblx0XHQgICAgbnVtSXRlciA9IDE1LFxyXG5cdFx0ICAgIHRvbCA9IDFlLTcsXHJcblx0XHQgICAgaSA9IG51bUl0ZXIsXHJcblx0XHQgICAgZHBoaSA9IDAuMSxcclxuXHRcdCAgICBjb247XHJcblxyXG5cdFx0d2hpbGUgKChNYXRoLmFicyhkcGhpKSA+IHRvbCkgJiYgKC0taSA+IDApKSB7XHJcblx0XHRcdGNvbiA9IGVjY2VudCAqIE1hdGguc2luKHBoaSk7XHJcblx0XHRcdGRwaGkgPSAoTWF0aC5QSSAvIDIpIC0gMiAqIE1hdGguYXRhbih0cyAqXHJcblx0XHRcdCAgICAgICAgICAgIE1hdGgucG93KCgxLjAgLSBjb24pIC8gKDEuMCArIGNvbiksIDAuNSAqIGVjY2VudCkpIC0gcGhpO1xyXG5cdFx0XHRwaGkgKz0gZHBoaTtcclxuXHRcdH1cclxuXHJcblx0XHRyZXR1cm4gbmV3IEwuTGF0TG5nKHBoaSAqIGQsIGxuZyk7XHJcblx0fVxyXG59O1xyXG5cblxuXHJcbkwuQ1JTLkVQU0czMzk1ID0gTC5leHRlbmQoe30sIEwuQ1JTLCB7XHJcblx0Y29kZTogJ0VQU0c6MzM5NScsXHJcblxyXG5cdHByb2plY3Rpb246IEwuUHJvamVjdGlvbi5NZXJjYXRvcixcclxuXHJcblx0dHJhbnNmb3JtYXRpb246IChmdW5jdGlvbiAoKSB7XHJcblx0XHR2YXIgbSA9IEwuUHJvamVjdGlvbi5NZXJjYXRvcixcclxuXHRcdCAgICByID0gbS5SX01BSk9SLFxyXG5cdFx0ICAgIHNjYWxlID0gMC41IC8gKE1hdGguUEkgKiByKTtcclxuXHJcblx0XHRyZXR1cm4gbmV3IEwuVHJhbnNmb3JtYXRpb24oc2NhbGUsIDAuNSwgLXNjYWxlLCAwLjUpO1xyXG5cdH0oKSlcclxufSk7XHJcblxuXG4vKlxyXG4gKiBMLlRpbGVMYXllciBpcyB1c2VkIGZvciBzdGFuZGFyZCB4eXotbnVtYmVyZWQgdGlsZSBsYXllcnMuXHJcbiAqL1xyXG5cclxuTC5UaWxlTGF5ZXIgPSBMLkNsYXNzLmV4dGVuZCh7XHJcblx0aW5jbHVkZXM6IEwuTWl4aW4uRXZlbnRzLFxyXG5cclxuXHRvcHRpb25zOiB7XHJcblx0XHRtaW5ab29tOiAwLFxyXG5cdFx0bWF4Wm9vbTogMTgsXHJcblx0XHR0aWxlU2l6ZTogMjU2LFxyXG5cdFx0c3ViZG9tYWluczogJ2FiYycsXHJcblx0XHRlcnJvclRpbGVVcmw6ICcnLFxyXG5cdFx0YXR0cmlidXRpb246ICcnLFxyXG5cdFx0em9vbU9mZnNldDogMCxcclxuXHRcdG9wYWNpdHk6IDEsXHJcblx0XHQvKlxyXG5cdFx0bWF4TmF0aXZlWm9vbTogbnVsbCxcclxuXHRcdHpJbmRleDogbnVsbCxcclxuXHRcdHRtczogZmFsc2UsXHJcblx0XHRjb250aW51b3VzV29ybGQ6IGZhbHNlLFxyXG5cdFx0bm9XcmFwOiBmYWxzZSxcclxuXHRcdHpvb21SZXZlcnNlOiBmYWxzZSxcclxuXHRcdGRldGVjdFJldGluYTogZmFsc2UsXHJcblx0XHRyZXVzZVRpbGVzOiBmYWxzZSxcclxuXHRcdGJvdW5kczogZmFsc2UsXHJcblx0XHQqL1xyXG5cdFx0dW5sb2FkSW52aXNpYmxlVGlsZXM6IEwuQnJvd3Nlci5tb2JpbGUsXHJcblx0XHR1cGRhdGVXaGVuSWRsZTogTC5Ccm93c2VyLm1vYmlsZVxyXG5cdH0sXHJcblxyXG5cdGluaXRpYWxpemU6IGZ1bmN0aW9uICh1cmwsIG9wdGlvbnMpIHtcclxuXHRcdG9wdGlvbnMgPSBMLnNldE9wdGlvbnModGhpcywgb3B0aW9ucyk7XHJcblxyXG5cdFx0Ly8gZGV0ZWN0aW5nIHJldGluYSBkaXNwbGF5cywgYWRqdXN0aW5nIHRpbGVTaXplIGFuZCB6b29tIGxldmVsc1xyXG5cdFx0aWYgKG9wdGlvbnMuZGV0ZWN0UmV0aW5hICYmIEwuQnJvd3Nlci5yZXRpbmEgJiYgb3B0aW9ucy5tYXhab29tID4gMCkge1xyXG5cclxuXHRcdFx0b3B0aW9ucy50aWxlU2l6ZSA9IE1hdGguZmxvb3Iob3B0aW9ucy50aWxlU2l6ZSAvIDIpO1xyXG5cdFx0XHRvcHRpb25zLnpvb21PZmZzZXQrKztcclxuXHJcblx0XHRcdGlmIChvcHRpb25zLm1pblpvb20gPiAwKSB7XHJcblx0XHRcdFx0b3B0aW9ucy5taW5ab29tLS07XHJcblx0XHRcdH1cclxuXHRcdFx0dGhpcy5vcHRpb25zLm1heFpvb20tLTtcclxuXHRcdH1cclxuXHJcblx0XHRpZiAob3B0aW9ucy5ib3VuZHMpIHtcclxuXHRcdFx0b3B0aW9ucy5ib3VuZHMgPSBMLmxhdExuZ0JvdW5kcyhvcHRpb25zLmJvdW5kcyk7XHJcblx0XHR9XHJcblxyXG5cdFx0dGhpcy5fdXJsID0gdXJsO1xyXG5cclxuXHRcdHZhciBzdWJkb21haW5zID0gdGhpcy5vcHRpb25zLnN1YmRvbWFpbnM7XHJcblxyXG5cdFx0aWYgKHR5cGVvZiBzdWJkb21haW5zID09PSAnc3RyaW5nJykge1xyXG5cdFx0XHR0aGlzLm9wdGlvbnMuc3ViZG9tYWlucyA9IHN1YmRvbWFpbnMuc3BsaXQoJycpO1xyXG5cdFx0fVxyXG5cdH0sXHJcblxyXG5cdG9uQWRkOiBmdW5jdGlvbiAobWFwKSB7XHJcblx0XHR0aGlzLl9tYXAgPSBtYXA7XHJcblx0XHR0aGlzLl9hbmltYXRlZCA9IG1hcC5fem9vbUFuaW1hdGVkO1xyXG5cclxuXHRcdC8vIGNyZWF0ZSBhIGNvbnRhaW5lciBkaXYgZm9yIHRpbGVzXHJcblx0XHR0aGlzLl9pbml0Q29udGFpbmVyKCk7XHJcblxyXG5cdFx0Ly8gc2V0IHVwIGV2ZW50c1xyXG5cdFx0bWFwLm9uKHtcclxuXHRcdFx0J3ZpZXdyZXNldCc6IHRoaXMuX3Jlc2V0LFxyXG5cdFx0XHQnbW92ZWVuZCc6IHRoaXMuX3VwZGF0ZVxyXG5cdFx0fSwgdGhpcyk7XHJcblxyXG5cdFx0aWYgKHRoaXMuX2FuaW1hdGVkKSB7XHJcblx0XHRcdG1hcC5vbih7XHJcblx0XHRcdFx0J3pvb21hbmltJzogdGhpcy5fYW5pbWF0ZVpvb20sXHJcblx0XHRcdFx0J3pvb21lbmQnOiB0aGlzLl9lbmRab29tQW5pbVxyXG5cdFx0XHR9LCB0aGlzKTtcclxuXHRcdH1cclxuXHJcblx0XHRpZiAoIXRoaXMub3B0aW9ucy51cGRhdGVXaGVuSWRsZSkge1xyXG5cdFx0XHR0aGlzLl9saW1pdGVkVXBkYXRlID0gTC5VdGlsLmxpbWl0RXhlY0J5SW50ZXJ2YWwodGhpcy5fdXBkYXRlLCAxNTAsIHRoaXMpO1xyXG5cdFx0XHRtYXAub24oJ21vdmUnLCB0aGlzLl9saW1pdGVkVXBkYXRlLCB0aGlzKTtcclxuXHRcdH1cclxuXHJcblx0XHR0aGlzLl9yZXNldCgpO1xyXG5cdFx0dGhpcy5fdXBkYXRlKCk7XHJcblx0fSxcclxuXHJcblx0YWRkVG86IGZ1bmN0aW9uIChtYXApIHtcclxuXHRcdG1hcC5hZGRMYXllcih0aGlzKTtcclxuXHRcdHJldHVybiB0aGlzO1xyXG5cdH0sXHJcblxyXG5cdG9uUmVtb3ZlOiBmdW5jdGlvbiAobWFwKSB7XHJcblx0XHR0aGlzLl9jb250YWluZXIucGFyZW50Tm9kZS5yZW1vdmVDaGlsZCh0aGlzLl9jb250YWluZXIpO1xyXG5cclxuXHRcdG1hcC5vZmYoe1xyXG5cdFx0XHQndmlld3Jlc2V0JzogdGhpcy5fcmVzZXQsXHJcblx0XHRcdCdtb3ZlZW5kJzogdGhpcy5fdXBkYXRlXHJcblx0XHR9LCB0aGlzKTtcclxuXHJcblx0XHRpZiAodGhpcy5fYW5pbWF0ZWQpIHtcclxuXHRcdFx0bWFwLm9mZih7XHJcblx0XHRcdFx0J3pvb21hbmltJzogdGhpcy5fYW5pbWF0ZVpvb20sXHJcblx0XHRcdFx0J3pvb21lbmQnOiB0aGlzLl9lbmRab29tQW5pbVxyXG5cdFx0XHR9LCB0aGlzKTtcclxuXHRcdH1cclxuXHJcblx0XHRpZiAoIXRoaXMub3B0aW9ucy51cGRhdGVXaGVuSWRsZSkge1xyXG5cdFx0XHRtYXAub2ZmKCdtb3ZlJywgdGhpcy5fbGltaXRlZFVwZGF0ZSwgdGhpcyk7XHJcblx0XHR9XHJcblxyXG5cdFx0dGhpcy5fY29udGFpbmVyID0gbnVsbDtcclxuXHRcdHRoaXMuX21hcCA9IG51bGw7XHJcblx0fSxcclxuXHJcblx0YnJpbmdUb0Zyb250OiBmdW5jdGlvbiAoKSB7XHJcblx0XHR2YXIgcGFuZSA9IHRoaXMuX21hcC5fcGFuZXMudGlsZVBhbmU7XHJcblxyXG5cdFx0aWYgKHRoaXMuX2NvbnRhaW5lcikge1xyXG5cdFx0XHRwYW5lLmFwcGVuZENoaWxkKHRoaXMuX2NvbnRhaW5lcik7XHJcblx0XHRcdHRoaXMuX3NldEF1dG9aSW5kZXgocGFuZSwgTWF0aC5tYXgpO1xyXG5cdFx0fVxyXG5cclxuXHRcdHJldHVybiB0aGlzO1xyXG5cdH0sXHJcblxyXG5cdGJyaW5nVG9CYWNrOiBmdW5jdGlvbiAoKSB7XHJcblx0XHR2YXIgcGFuZSA9IHRoaXMuX21hcC5fcGFuZXMudGlsZVBhbmU7XHJcblxyXG5cdFx0aWYgKHRoaXMuX2NvbnRhaW5lcikge1xyXG5cdFx0XHRwYW5lLmluc2VydEJlZm9yZSh0aGlzLl9jb250YWluZXIsIHBhbmUuZmlyc3RDaGlsZCk7XHJcblx0XHRcdHRoaXMuX3NldEF1dG9aSW5kZXgocGFuZSwgTWF0aC5taW4pO1xyXG5cdFx0fVxyXG5cclxuXHRcdHJldHVybiB0aGlzO1xyXG5cdH0sXHJcblxyXG5cdGdldEF0dHJpYnV0aW9uOiBmdW5jdGlvbiAoKSB7XHJcblx0XHRyZXR1cm4gdGhpcy5vcHRpb25zLmF0dHJpYnV0aW9uO1xyXG5cdH0sXHJcblxyXG5cdGdldENvbnRhaW5lcjogZnVuY3Rpb24gKCkge1xyXG5cdFx0cmV0dXJuIHRoaXMuX2NvbnRhaW5lcjtcclxuXHR9LFxyXG5cclxuXHRzZXRPcGFjaXR5OiBmdW5jdGlvbiAob3BhY2l0eSkge1xyXG5cdFx0dGhpcy5vcHRpb25zLm9wYWNpdHkgPSBvcGFjaXR5O1xyXG5cclxuXHRcdGlmICh0aGlzLl9tYXApIHtcclxuXHRcdFx0dGhpcy5fdXBkYXRlT3BhY2l0eSgpO1xyXG5cdFx0fVxyXG5cclxuXHRcdHJldHVybiB0aGlzO1xyXG5cdH0sXHJcblxyXG5cdHNldFpJbmRleDogZnVuY3Rpb24gKHpJbmRleCkge1xyXG5cdFx0dGhpcy5vcHRpb25zLnpJbmRleCA9IHpJbmRleDtcclxuXHRcdHRoaXMuX3VwZGF0ZVpJbmRleCgpO1xyXG5cclxuXHRcdHJldHVybiB0aGlzO1xyXG5cdH0sXHJcblxyXG5cdHNldFVybDogZnVuY3Rpb24gKHVybCwgbm9SZWRyYXcpIHtcclxuXHRcdHRoaXMuX3VybCA9IHVybDtcclxuXHJcblx0XHRpZiAoIW5vUmVkcmF3KSB7XHJcblx0XHRcdHRoaXMucmVkcmF3KCk7XHJcblx0XHR9XHJcblxyXG5cdFx0cmV0dXJuIHRoaXM7XHJcblx0fSxcclxuXHJcblx0cmVkcmF3OiBmdW5jdGlvbiAoKSB7XHJcblx0XHRpZiAodGhpcy5fbWFwKSB7XHJcblx0XHRcdHRoaXMuX3Jlc2V0KHtoYXJkOiB0cnVlfSk7XHJcblx0XHRcdHRoaXMuX3VwZGF0ZSgpO1xyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIHRoaXM7XHJcblx0fSxcclxuXHJcblx0X3VwZGF0ZVpJbmRleDogZnVuY3Rpb24gKCkge1xyXG5cdFx0aWYgKHRoaXMuX2NvbnRhaW5lciAmJiB0aGlzLm9wdGlvbnMuekluZGV4ICE9PSB1bmRlZmluZWQpIHtcclxuXHRcdFx0dGhpcy5fY29udGFpbmVyLnN0eWxlLnpJbmRleCA9IHRoaXMub3B0aW9ucy56SW5kZXg7XHJcblx0XHR9XHJcblx0fSxcclxuXHJcblx0X3NldEF1dG9aSW5kZXg6IGZ1bmN0aW9uIChwYW5lLCBjb21wYXJlKSB7XHJcblxyXG5cdFx0dmFyIGxheWVycyA9IHBhbmUuY2hpbGRyZW4sXHJcblx0XHQgICAgZWRnZVpJbmRleCA9IC1jb21wYXJlKEluZmluaXR5LCAtSW5maW5pdHkpLCAvLyAtSW5maW5pdHkgZm9yIG1heCwgSW5maW5pdHkgZm9yIG1pblxyXG5cdFx0ICAgIHpJbmRleCwgaSwgbGVuO1xyXG5cclxuXHRcdGZvciAoaSA9IDAsIGxlbiA9IGxheWVycy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xyXG5cclxuXHRcdFx0aWYgKGxheWVyc1tpXSAhPT0gdGhpcy5fY29udGFpbmVyKSB7XHJcblx0XHRcdFx0ekluZGV4ID0gcGFyc2VJbnQobGF5ZXJzW2ldLnN0eWxlLnpJbmRleCwgMTApO1xyXG5cclxuXHRcdFx0XHRpZiAoIWlzTmFOKHpJbmRleCkpIHtcclxuXHRcdFx0XHRcdGVkZ2VaSW5kZXggPSBjb21wYXJlKGVkZ2VaSW5kZXgsIHpJbmRleCk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0dGhpcy5vcHRpb25zLnpJbmRleCA9IHRoaXMuX2NvbnRhaW5lci5zdHlsZS56SW5kZXggPVxyXG5cdFx0ICAgICAgICAoaXNGaW5pdGUoZWRnZVpJbmRleCkgPyBlZGdlWkluZGV4IDogMCkgKyBjb21wYXJlKDEsIC0xKTtcclxuXHR9LFxyXG5cclxuXHRfdXBkYXRlT3BhY2l0eTogZnVuY3Rpb24gKCkge1xyXG5cdFx0dmFyIGksXHJcblx0XHQgICAgdGlsZXMgPSB0aGlzLl90aWxlcztcclxuXHJcblx0XHRpZiAoTC5Ccm93c2VyLmllbHQ5KSB7XHJcblx0XHRcdGZvciAoaSBpbiB0aWxlcykge1xyXG5cdFx0XHRcdEwuRG9tVXRpbC5zZXRPcGFjaXR5KHRpbGVzW2ldLCB0aGlzLm9wdGlvbnMub3BhY2l0eSk7XHJcblx0XHRcdH1cclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdEwuRG9tVXRpbC5zZXRPcGFjaXR5KHRoaXMuX2NvbnRhaW5lciwgdGhpcy5vcHRpb25zLm9wYWNpdHkpO1xyXG5cdFx0fVxyXG5cdH0sXHJcblxyXG5cdF9pbml0Q29udGFpbmVyOiBmdW5jdGlvbiAoKSB7XHJcblx0XHR2YXIgdGlsZVBhbmUgPSB0aGlzLl9tYXAuX3BhbmVzLnRpbGVQYW5lO1xyXG5cclxuXHRcdGlmICghdGhpcy5fY29udGFpbmVyKSB7XHJcblx0XHRcdHRoaXMuX2NvbnRhaW5lciA9IEwuRG9tVXRpbC5jcmVhdGUoJ2RpdicsICdsZWFmbGV0LWxheWVyJyk7XHJcblxyXG5cdFx0XHR0aGlzLl91cGRhdGVaSW5kZXgoKTtcclxuXHJcblx0XHRcdGlmICh0aGlzLl9hbmltYXRlZCkge1xyXG5cdFx0XHRcdHZhciBjbGFzc05hbWUgPSAnbGVhZmxldC10aWxlLWNvbnRhaW5lcic7XHJcblxyXG5cdFx0XHRcdHRoaXMuX2JnQnVmZmVyID0gTC5Eb21VdGlsLmNyZWF0ZSgnZGl2JywgY2xhc3NOYW1lLCB0aGlzLl9jb250YWluZXIpO1xyXG5cdFx0XHRcdHRoaXMuX3RpbGVDb250YWluZXIgPSBMLkRvbVV0aWwuY3JlYXRlKCdkaXYnLCBjbGFzc05hbWUsIHRoaXMuX2NvbnRhaW5lcik7XHJcblxyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdHRoaXMuX3RpbGVDb250YWluZXIgPSB0aGlzLl9jb250YWluZXI7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHRpbGVQYW5lLmFwcGVuZENoaWxkKHRoaXMuX2NvbnRhaW5lcik7XHJcblxyXG5cdFx0XHRpZiAodGhpcy5vcHRpb25zLm9wYWNpdHkgPCAxKSB7XHJcblx0XHRcdFx0dGhpcy5fdXBkYXRlT3BhY2l0eSgpO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fSxcclxuXHJcblx0X3Jlc2V0OiBmdW5jdGlvbiAoZSkge1xyXG5cdFx0Zm9yICh2YXIga2V5IGluIHRoaXMuX3RpbGVzKSB7XHJcblx0XHRcdHRoaXMuZmlyZSgndGlsZXVubG9hZCcsIHt0aWxlOiB0aGlzLl90aWxlc1trZXldfSk7XHJcblx0XHR9XHJcblxyXG5cdFx0dGhpcy5fdGlsZXMgPSB7fTtcclxuXHRcdHRoaXMuX3RpbGVzVG9Mb2FkID0gMDtcclxuXHJcblx0XHRpZiAodGhpcy5vcHRpb25zLnJldXNlVGlsZXMpIHtcclxuXHRcdFx0dGhpcy5fdW51c2VkVGlsZXMgPSBbXTtcclxuXHRcdH1cclxuXHJcblx0XHR0aGlzLl90aWxlQ29udGFpbmVyLmlubmVySFRNTCA9ICcnO1xyXG5cclxuXHRcdGlmICh0aGlzLl9hbmltYXRlZCAmJiBlICYmIGUuaGFyZCkge1xyXG5cdFx0XHR0aGlzLl9jbGVhckJnQnVmZmVyKCk7XHJcblx0XHR9XHJcblxyXG5cdFx0dGhpcy5faW5pdENvbnRhaW5lcigpO1xyXG5cdH0sXHJcblxyXG5cdF9nZXRUaWxlU2l6ZTogZnVuY3Rpb24gKCkge1xyXG5cdFx0dmFyIG1hcCA9IHRoaXMuX21hcCxcclxuXHRcdCAgICB6b29tID0gbWFwLmdldFpvb20oKSArIHRoaXMub3B0aW9ucy56b29tT2Zmc2V0LFxyXG5cdFx0ICAgIHpvb21OID0gdGhpcy5vcHRpb25zLm1heE5hdGl2ZVpvb20sXHJcblx0XHQgICAgdGlsZVNpemUgPSB0aGlzLm9wdGlvbnMudGlsZVNpemU7XHJcblxyXG5cdFx0aWYgKHpvb21OICYmIHpvb20gPiB6b29tTikge1xyXG5cdFx0XHR0aWxlU2l6ZSA9IE1hdGgucm91bmQobWFwLmdldFpvb21TY2FsZSh6b29tKSAvIG1hcC5nZXRab29tU2NhbGUoem9vbU4pICogdGlsZVNpemUpO1xyXG5cdFx0fVxyXG5cclxuXHRcdHJldHVybiB0aWxlU2l6ZTtcclxuXHR9LFxyXG5cclxuXHRfdXBkYXRlOiBmdW5jdGlvbiAoKSB7XHJcblxyXG5cdFx0aWYgKCF0aGlzLl9tYXApIHsgcmV0dXJuOyB9XHJcblxyXG5cdFx0dmFyIG1hcCA9IHRoaXMuX21hcCxcclxuXHRcdCAgICBib3VuZHMgPSBtYXAuZ2V0UGl4ZWxCb3VuZHMoKSxcclxuXHRcdCAgICB6b29tID0gbWFwLmdldFpvb20oKSxcclxuXHRcdCAgICB0aWxlU2l6ZSA9IHRoaXMuX2dldFRpbGVTaXplKCk7XHJcblxyXG5cdFx0aWYgKHpvb20gPiB0aGlzLm9wdGlvbnMubWF4Wm9vbSB8fCB6b29tIDwgdGhpcy5vcHRpb25zLm1pblpvb20pIHtcclxuXHRcdFx0cmV0dXJuO1xyXG5cdFx0fVxyXG5cclxuXHRcdHZhciB0aWxlQm91bmRzID0gTC5ib3VuZHMoXHJcblx0XHQgICAgICAgIGJvdW5kcy5taW4uZGl2aWRlQnkodGlsZVNpemUpLl9mbG9vcigpLFxyXG5cdFx0ICAgICAgICBib3VuZHMubWF4LmRpdmlkZUJ5KHRpbGVTaXplKS5fZmxvb3IoKSk7XHJcblxyXG5cdFx0dGhpcy5fYWRkVGlsZXNGcm9tQ2VudGVyT3V0KHRpbGVCb3VuZHMpO1xyXG5cclxuXHRcdGlmICh0aGlzLm9wdGlvbnMudW5sb2FkSW52aXNpYmxlVGlsZXMgfHwgdGhpcy5vcHRpb25zLnJldXNlVGlsZXMpIHtcclxuXHRcdFx0dGhpcy5fcmVtb3ZlT3RoZXJUaWxlcyh0aWxlQm91bmRzKTtcclxuXHRcdH1cclxuXHR9LFxyXG5cclxuXHRfYWRkVGlsZXNGcm9tQ2VudGVyT3V0OiBmdW5jdGlvbiAoYm91bmRzKSB7XHJcblx0XHR2YXIgcXVldWUgPSBbXSxcclxuXHRcdCAgICBjZW50ZXIgPSBib3VuZHMuZ2V0Q2VudGVyKCk7XHJcblxyXG5cdFx0dmFyIGosIGksIHBvaW50O1xyXG5cclxuXHRcdGZvciAoaiA9IGJvdW5kcy5taW4ueTsgaiA8PSBib3VuZHMubWF4Lnk7IGorKykge1xyXG5cdFx0XHRmb3IgKGkgPSBib3VuZHMubWluLng7IGkgPD0gYm91bmRzLm1heC54OyBpKyspIHtcclxuXHRcdFx0XHRwb2ludCA9IG5ldyBMLlBvaW50KGksIGopO1xyXG5cclxuXHRcdFx0XHRpZiAodGhpcy5fdGlsZVNob3VsZEJlTG9hZGVkKHBvaW50KSkge1xyXG5cdFx0XHRcdFx0cXVldWUucHVzaChwb2ludCk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0dmFyIHRpbGVzVG9Mb2FkID0gcXVldWUubGVuZ3RoO1xyXG5cclxuXHRcdGlmICh0aWxlc1RvTG9hZCA9PT0gMCkgeyByZXR1cm47IH1cclxuXHJcblx0XHQvLyBsb2FkIHRpbGVzIGluIG9yZGVyIG9mIHRoZWlyIGRpc3RhbmNlIHRvIGNlbnRlclxyXG5cdFx0cXVldWUuc29ydChmdW5jdGlvbiAoYSwgYikge1xyXG5cdFx0XHRyZXR1cm4gYS5kaXN0YW5jZVRvKGNlbnRlcikgLSBiLmRpc3RhbmNlVG8oY2VudGVyKTtcclxuXHRcdH0pO1xyXG5cclxuXHRcdHZhciBmcmFnbWVudCA9IGRvY3VtZW50LmNyZWF0ZURvY3VtZW50RnJhZ21lbnQoKTtcclxuXHJcblx0XHQvLyBpZiBpdHMgdGhlIGZpcnN0IGJhdGNoIG9mIHRpbGVzIHRvIGxvYWRcclxuXHRcdGlmICghdGhpcy5fdGlsZXNUb0xvYWQpIHtcclxuXHRcdFx0dGhpcy5maXJlKCdsb2FkaW5nJyk7XHJcblx0XHR9XHJcblxyXG5cdFx0dGhpcy5fdGlsZXNUb0xvYWQgKz0gdGlsZXNUb0xvYWQ7XHJcblxyXG5cdFx0Zm9yIChpID0gMDsgaSA8IHRpbGVzVG9Mb2FkOyBpKyspIHtcclxuXHRcdFx0dGhpcy5fYWRkVGlsZShxdWV1ZVtpXSwgZnJhZ21lbnQpO1xyXG5cdFx0fVxyXG5cclxuXHRcdHRoaXMuX3RpbGVDb250YWluZXIuYXBwZW5kQ2hpbGQoZnJhZ21lbnQpO1xyXG5cdH0sXHJcblxyXG5cdF90aWxlU2hvdWxkQmVMb2FkZWQ6IGZ1bmN0aW9uICh0aWxlUG9pbnQpIHtcclxuXHRcdGlmICgodGlsZVBvaW50LnggKyAnOicgKyB0aWxlUG9pbnQueSkgaW4gdGhpcy5fdGlsZXMpIHtcclxuXHRcdFx0cmV0dXJuIGZhbHNlOyAvLyBhbHJlYWR5IGxvYWRlZFxyXG5cdFx0fVxyXG5cclxuXHRcdHZhciBvcHRpb25zID0gdGhpcy5vcHRpb25zO1xyXG5cclxuXHRcdGlmICghb3B0aW9ucy5jb250aW51b3VzV29ybGQpIHtcclxuXHRcdFx0dmFyIGxpbWl0ID0gdGhpcy5fZ2V0V3JhcFRpbGVOdW0oKTtcclxuXHJcblx0XHRcdC8vIGRvbid0IGxvYWQgaWYgZXhjZWVkcyB3b3JsZCBib3VuZHNcclxuXHRcdFx0aWYgKChvcHRpb25zLm5vV3JhcCAmJiAodGlsZVBvaW50LnggPCAwIHx8IHRpbGVQb2ludC54ID49IGxpbWl0LngpKSB8fFxyXG5cdFx0XHRcdHRpbGVQb2ludC55IDwgMCB8fCB0aWxlUG9pbnQueSA+PSBsaW1pdC55KSB7IHJldHVybiBmYWxzZTsgfVxyXG5cdFx0fVxyXG5cclxuXHRcdGlmIChvcHRpb25zLmJvdW5kcykge1xyXG5cdFx0XHR2YXIgdGlsZVNpemUgPSBvcHRpb25zLnRpbGVTaXplLFxyXG5cdFx0XHQgICAgbndQb2ludCA9IHRpbGVQb2ludC5tdWx0aXBseUJ5KHRpbGVTaXplKSxcclxuXHRcdFx0ICAgIHNlUG9pbnQgPSBud1BvaW50LmFkZChbdGlsZVNpemUsIHRpbGVTaXplXSksXHJcblx0XHRcdCAgICBudyA9IHRoaXMuX21hcC51bnByb2plY3QobndQb2ludCksXHJcblx0XHRcdCAgICBzZSA9IHRoaXMuX21hcC51bnByb2plY3Qoc2VQb2ludCk7XHJcblxyXG5cdFx0XHQvLyBUT0RPIHRlbXBvcmFyeSBoYWNrLCB3aWxsIGJlIHJlbW92ZWQgYWZ0ZXIgcmVmYWN0b3JpbmcgcHJvamVjdGlvbnNcclxuXHRcdFx0Ly8gaHR0cHM6Ly9naXRodWIuY29tL0xlYWZsZXQvTGVhZmxldC9pc3N1ZXMvMTYxOFxyXG5cdFx0XHRpZiAoIW9wdGlvbnMuY29udGludW91c1dvcmxkICYmICFvcHRpb25zLm5vV3JhcCkge1xyXG5cdFx0XHRcdG53ID0gbncud3JhcCgpO1xyXG5cdFx0XHRcdHNlID0gc2Uud3JhcCgpO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRpZiAoIW9wdGlvbnMuYm91bmRzLmludGVyc2VjdHMoW253LCBzZV0pKSB7IHJldHVybiBmYWxzZTsgfVxyXG5cdFx0fVxyXG5cclxuXHRcdHJldHVybiB0cnVlO1xyXG5cdH0sXHJcblxyXG5cdF9yZW1vdmVPdGhlclRpbGVzOiBmdW5jdGlvbiAoYm91bmRzKSB7XHJcblx0XHR2YXIga0FyciwgeCwgeSwga2V5O1xyXG5cclxuXHRcdGZvciAoa2V5IGluIHRoaXMuX3RpbGVzKSB7XHJcblx0XHRcdGtBcnIgPSBrZXkuc3BsaXQoJzonKTtcclxuXHRcdFx0eCA9IHBhcnNlSW50KGtBcnJbMF0sIDEwKTtcclxuXHRcdFx0eSA9IHBhcnNlSW50KGtBcnJbMV0sIDEwKTtcclxuXHJcblx0XHRcdC8vIHJlbW92ZSB0aWxlIGlmIGl0J3Mgb3V0IG9mIGJvdW5kc1xyXG5cdFx0XHRpZiAoeCA8IGJvdW5kcy5taW4ueCB8fCB4ID4gYm91bmRzLm1heC54IHx8IHkgPCBib3VuZHMubWluLnkgfHwgeSA+IGJvdW5kcy5tYXgueSkge1xyXG5cdFx0XHRcdHRoaXMuX3JlbW92ZVRpbGUoa2V5KTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH0sXHJcblxyXG5cdF9yZW1vdmVUaWxlOiBmdW5jdGlvbiAoa2V5KSB7XHJcblx0XHR2YXIgdGlsZSA9IHRoaXMuX3RpbGVzW2tleV07XHJcblxyXG5cdFx0dGhpcy5maXJlKCd0aWxldW5sb2FkJywge3RpbGU6IHRpbGUsIHVybDogdGlsZS5zcmN9KTtcclxuXHJcblx0XHRpZiAodGhpcy5vcHRpb25zLnJldXNlVGlsZXMpIHtcclxuXHRcdFx0TC5Eb21VdGlsLnJlbW92ZUNsYXNzKHRpbGUsICdsZWFmbGV0LXRpbGUtbG9hZGVkJyk7XHJcblx0XHRcdHRoaXMuX3VudXNlZFRpbGVzLnB1c2godGlsZSk7XHJcblxyXG5cdFx0fSBlbHNlIGlmICh0aWxlLnBhcmVudE5vZGUgPT09IHRoaXMuX3RpbGVDb250YWluZXIpIHtcclxuXHRcdFx0dGhpcy5fdGlsZUNvbnRhaW5lci5yZW1vdmVDaGlsZCh0aWxlKTtcclxuXHRcdH1cclxuXHJcblx0XHQvLyBmb3IgaHR0cHM6Ly9naXRodWIuY29tL0Nsb3VkTWFkZS9MZWFmbGV0L2lzc3Vlcy8xMzdcclxuXHRcdGlmICghTC5Ccm93c2VyLmFuZHJvaWQpIHtcclxuXHRcdFx0dGlsZS5vbmxvYWQgPSBudWxsO1xyXG5cdFx0XHR0aWxlLnNyYyA9IEwuVXRpbC5lbXB0eUltYWdlVXJsO1xyXG5cdFx0fVxyXG5cclxuXHRcdGRlbGV0ZSB0aGlzLl90aWxlc1trZXldO1xyXG5cdH0sXHJcblxyXG5cdF9hZGRUaWxlOiBmdW5jdGlvbiAodGlsZVBvaW50LCBjb250YWluZXIpIHtcclxuXHRcdHZhciB0aWxlUG9zID0gdGhpcy5fZ2V0VGlsZVBvcyh0aWxlUG9pbnQpO1xyXG5cclxuXHRcdC8vIGdldCB1bnVzZWQgdGlsZSAtIG9yIGNyZWF0ZSBhIG5ldyB0aWxlXHJcblx0XHR2YXIgdGlsZSA9IHRoaXMuX2dldFRpbGUoKTtcclxuXHJcblx0XHQvKlxyXG5cdFx0Q2hyb21lIDIwIGxheW91dHMgbXVjaCBmYXN0ZXIgd2l0aCB0b3AvbGVmdCAodmVyaWZ5IHdpdGggdGltZWxpbmUsIGZyYW1lcylcclxuXHRcdEFuZHJvaWQgNCBicm93c2VyIGhhcyBkaXNwbGF5IGlzc3VlcyB3aXRoIHRvcC9sZWZ0IGFuZCByZXF1aXJlcyB0cmFuc2Zvcm0gaW5zdGVhZFxyXG5cdFx0KG90aGVyIGJyb3dzZXJzIGRvbid0IGN1cnJlbnRseSBjYXJlKSAtIHNlZSBkZWJ1Zy9oYWNrcy9qaXR0ZXIuaHRtbCBmb3IgYW4gZXhhbXBsZVxyXG5cdFx0Ki9cclxuXHRcdEwuRG9tVXRpbC5zZXRQb3NpdGlvbih0aWxlLCB0aWxlUG9zLCBMLkJyb3dzZXIuY2hyb21lKTtcclxuXHJcblx0XHR0aGlzLl90aWxlc1t0aWxlUG9pbnQueCArICc6JyArIHRpbGVQb2ludC55XSA9IHRpbGU7XHJcblxyXG5cdFx0dGhpcy5fbG9hZFRpbGUodGlsZSwgdGlsZVBvaW50KTtcclxuXHJcblx0XHRpZiAodGlsZS5wYXJlbnROb2RlICE9PSB0aGlzLl90aWxlQ29udGFpbmVyKSB7XHJcblx0XHRcdGNvbnRhaW5lci5hcHBlbmRDaGlsZCh0aWxlKTtcclxuXHRcdH1cclxuXHR9LFxyXG5cclxuXHRfZ2V0Wm9vbUZvclVybDogZnVuY3Rpb24gKCkge1xyXG5cclxuXHRcdHZhciBvcHRpb25zID0gdGhpcy5vcHRpb25zLFxyXG5cdFx0ICAgIHpvb20gPSB0aGlzLl9tYXAuZ2V0Wm9vbSgpO1xyXG5cclxuXHRcdGlmIChvcHRpb25zLnpvb21SZXZlcnNlKSB7XHJcblx0XHRcdHpvb20gPSBvcHRpb25zLm1heFpvb20gLSB6b29tO1xyXG5cdFx0fVxyXG5cclxuXHRcdHpvb20gKz0gb3B0aW9ucy56b29tT2Zmc2V0O1xyXG5cclxuXHRcdHJldHVybiBvcHRpb25zLm1heE5hdGl2ZVpvb20gPyBNYXRoLm1pbih6b29tLCBvcHRpb25zLm1heE5hdGl2ZVpvb20pIDogem9vbTtcclxuXHR9LFxyXG5cclxuXHRfZ2V0VGlsZVBvczogZnVuY3Rpb24gKHRpbGVQb2ludCkge1xyXG5cdFx0dmFyIG9yaWdpbiA9IHRoaXMuX21hcC5nZXRQaXhlbE9yaWdpbigpLFxyXG5cdFx0ICAgIHRpbGVTaXplID0gdGhpcy5fZ2V0VGlsZVNpemUoKTtcclxuXHJcblx0XHRyZXR1cm4gdGlsZVBvaW50Lm11bHRpcGx5QnkodGlsZVNpemUpLnN1YnRyYWN0KG9yaWdpbik7XHJcblx0fSxcclxuXHJcblx0Ly8gaW1hZ2Utc3BlY2lmaWMgY29kZSAob3ZlcnJpZGUgdG8gaW1wbGVtZW50IGUuZy4gQ2FudmFzIG9yIFNWRyB0aWxlIGxheWVyKVxyXG5cclxuXHRnZXRUaWxlVXJsOiBmdW5jdGlvbiAodGlsZVBvaW50KSB7XHJcblx0XHRyZXR1cm4gTC5VdGlsLnRlbXBsYXRlKHRoaXMuX3VybCwgTC5leHRlbmQoe1xyXG5cdFx0XHRzOiB0aGlzLl9nZXRTdWJkb21haW4odGlsZVBvaW50KSxcclxuXHRcdFx0ejogdGlsZVBvaW50LnosXHJcblx0XHRcdHg6IHRpbGVQb2ludC54LFxyXG5cdFx0XHR5OiB0aWxlUG9pbnQueVxyXG5cdFx0fSwgdGhpcy5vcHRpb25zKSk7XHJcblx0fSxcclxuXHJcblx0X2dldFdyYXBUaWxlTnVtOiBmdW5jdGlvbiAoKSB7XHJcblx0XHR2YXIgY3JzID0gdGhpcy5fbWFwLm9wdGlvbnMuY3JzLFxyXG5cdFx0ICAgIHNpemUgPSBjcnMuZ2V0U2l6ZSh0aGlzLl9tYXAuZ2V0Wm9vbSgpKTtcclxuXHRcdHJldHVybiBzaXplLmRpdmlkZUJ5KHRoaXMuX2dldFRpbGVTaXplKCkpLl9mbG9vcigpO1xyXG5cdH0sXHJcblxyXG5cdF9hZGp1c3RUaWxlUG9pbnQ6IGZ1bmN0aW9uICh0aWxlUG9pbnQpIHtcclxuXHJcblx0XHR2YXIgbGltaXQgPSB0aGlzLl9nZXRXcmFwVGlsZU51bSgpO1xyXG5cclxuXHRcdC8vIHdyYXAgdGlsZSBjb29yZGluYXRlc1xyXG5cdFx0aWYgKCF0aGlzLm9wdGlvbnMuY29udGludW91c1dvcmxkICYmICF0aGlzLm9wdGlvbnMubm9XcmFwKSB7XHJcblx0XHRcdHRpbGVQb2ludC54ID0gKCh0aWxlUG9pbnQueCAlIGxpbWl0LngpICsgbGltaXQueCkgJSBsaW1pdC54O1xyXG5cdFx0fVxyXG5cclxuXHRcdGlmICh0aGlzLm9wdGlvbnMudG1zKSB7XHJcblx0XHRcdHRpbGVQb2ludC55ID0gbGltaXQueSAtIHRpbGVQb2ludC55IC0gMTtcclxuXHRcdH1cclxuXHJcblx0XHR0aWxlUG9pbnQueiA9IHRoaXMuX2dldFpvb21Gb3JVcmwoKTtcclxuXHR9LFxyXG5cclxuXHRfZ2V0U3ViZG9tYWluOiBmdW5jdGlvbiAodGlsZVBvaW50KSB7XHJcblx0XHR2YXIgaW5kZXggPSBNYXRoLmFicyh0aWxlUG9pbnQueCArIHRpbGVQb2ludC55KSAlIHRoaXMub3B0aW9ucy5zdWJkb21haW5zLmxlbmd0aDtcclxuXHRcdHJldHVybiB0aGlzLm9wdGlvbnMuc3ViZG9tYWluc1tpbmRleF07XHJcblx0fSxcclxuXHJcblx0X2dldFRpbGU6IGZ1bmN0aW9uICgpIHtcclxuXHRcdGlmICh0aGlzLm9wdGlvbnMucmV1c2VUaWxlcyAmJiB0aGlzLl91bnVzZWRUaWxlcy5sZW5ndGggPiAwKSB7XHJcblx0XHRcdHZhciB0aWxlID0gdGhpcy5fdW51c2VkVGlsZXMucG9wKCk7XHJcblx0XHRcdHRoaXMuX3Jlc2V0VGlsZSh0aWxlKTtcclxuXHRcdFx0cmV0dXJuIHRpbGU7XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gdGhpcy5fY3JlYXRlVGlsZSgpO1xyXG5cdH0sXHJcblxyXG5cdC8vIE92ZXJyaWRlIGlmIGRhdGEgc3RvcmVkIG9uIGEgdGlsZSBuZWVkcyB0byBiZSBjbGVhbmVkIHVwIGJlZm9yZSByZXVzZVxyXG5cdF9yZXNldFRpbGU6IGZ1bmN0aW9uICgvKnRpbGUqLykge30sXHJcblxyXG5cdF9jcmVhdGVUaWxlOiBmdW5jdGlvbiAoKSB7XHJcblx0XHR2YXIgdGlsZSA9IEwuRG9tVXRpbC5jcmVhdGUoJ2ltZycsICdsZWFmbGV0LXRpbGUnKTtcclxuXHRcdHRpbGUuc3R5bGUud2lkdGggPSB0aWxlLnN0eWxlLmhlaWdodCA9IHRoaXMuX2dldFRpbGVTaXplKCkgKyAncHgnO1xyXG5cdFx0dGlsZS5nYWxsZXJ5aW1nID0gJ25vJztcclxuXHJcblx0XHR0aWxlLm9uc2VsZWN0c3RhcnQgPSB0aWxlLm9ubW91c2Vtb3ZlID0gTC5VdGlsLmZhbHNlRm47XHJcblxyXG5cdFx0aWYgKEwuQnJvd3Nlci5pZWx0OSAmJiB0aGlzLm9wdGlvbnMub3BhY2l0eSAhPT0gdW5kZWZpbmVkKSB7XHJcblx0XHRcdEwuRG9tVXRpbC5zZXRPcGFjaXR5KHRpbGUsIHRoaXMub3B0aW9ucy5vcGFjaXR5KTtcclxuXHRcdH1cclxuXHRcdC8vIHdpdGhvdXQgdGhpcyBoYWNrLCB0aWxlcyBkaXNhcHBlYXIgYWZ0ZXIgem9vbSBvbiBDaHJvbWUgZm9yIEFuZHJvaWRcclxuXHRcdC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9MZWFmbGV0L0xlYWZsZXQvaXNzdWVzLzIwNzhcclxuXHRcdGlmIChMLkJyb3dzZXIubW9iaWxlV2Via2l0M2QpIHtcclxuXHRcdFx0dGlsZS5zdHlsZS5XZWJraXRCYWNrZmFjZVZpc2liaWxpdHkgPSAnaGlkZGVuJztcclxuXHRcdH1cclxuXHRcdHJldHVybiB0aWxlO1xyXG5cdH0sXHJcblxyXG5cdF9sb2FkVGlsZTogZnVuY3Rpb24gKHRpbGUsIHRpbGVQb2ludCkge1xyXG5cdFx0dGlsZS5fbGF5ZXIgID0gdGhpcztcclxuXHRcdHRpbGUub25sb2FkICA9IHRoaXMuX3RpbGVPbkxvYWQ7XHJcblx0XHR0aWxlLm9uZXJyb3IgPSB0aGlzLl90aWxlT25FcnJvcjtcclxuXHJcblx0XHR0aGlzLl9hZGp1c3RUaWxlUG9pbnQodGlsZVBvaW50KTtcclxuXHRcdHRpbGUuc3JjICAgICA9IHRoaXMuZ2V0VGlsZVVybCh0aWxlUG9pbnQpO1xyXG5cclxuXHRcdHRoaXMuZmlyZSgndGlsZWxvYWRzdGFydCcsIHtcclxuXHRcdFx0dGlsZTogdGlsZSxcclxuXHRcdFx0dXJsOiB0aWxlLnNyY1xyXG5cdFx0fSk7XHJcblx0fSxcclxuXHJcblx0X3RpbGVMb2FkZWQ6IGZ1bmN0aW9uICgpIHtcclxuXHRcdHRoaXMuX3RpbGVzVG9Mb2FkLS07XHJcblxyXG5cdFx0aWYgKHRoaXMuX2FuaW1hdGVkKSB7XHJcblx0XHRcdEwuRG9tVXRpbC5hZGRDbGFzcyh0aGlzLl90aWxlQ29udGFpbmVyLCAnbGVhZmxldC16b29tLWFuaW1hdGVkJyk7XHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKCF0aGlzLl90aWxlc1RvTG9hZCkge1xyXG5cdFx0XHR0aGlzLmZpcmUoJ2xvYWQnKTtcclxuXHJcblx0XHRcdGlmICh0aGlzLl9hbmltYXRlZCkge1xyXG5cdFx0XHRcdC8vIGNsZWFyIHNjYWxlZCB0aWxlcyBhZnRlciBhbGwgbmV3IHRpbGVzIGFyZSBsb2FkZWQgKGZvciBwZXJmb3JtYW5jZSlcclxuXHRcdFx0XHRjbGVhclRpbWVvdXQodGhpcy5fY2xlYXJCZ0J1ZmZlclRpbWVyKTtcclxuXHRcdFx0XHR0aGlzLl9jbGVhckJnQnVmZmVyVGltZXIgPSBzZXRUaW1lb3V0KEwuYmluZCh0aGlzLl9jbGVhckJnQnVmZmVyLCB0aGlzKSwgNTAwKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH0sXHJcblxyXG5cdF90aWxlT25Mb2FkOiBmdW5jdGlvbiAoKSB7XHJcblx0XHR2YXIgbGF5ZXIgPSB0aGlzLl9sYXllcjtcclxuXHJcblx0XHQvL09ubHkgaWYgd2UgYXJlIGxvYWRpbmcgYW4gYWN0dWFsIGltYWdlXHJcblx0XHRpZiAodGhpcy5zcmMgIT09IEwuVXRpbC5lbXB0eUltYWdlVXJsKSB7XHJcblx0XHRcdEwuRG9tVXRpbC5hZGRDbGFzcyh0aGlzLCAnbGVhZmxldC10aWxlLWxvYWRlZCcpO1xyXG5cclxuXHRcdFx0bGF5ZXIuZmlyZSgndGlsZWxvYWQnLCB7XHJcblx0XHRcdFx0dGlsZTogdGhpcyxcclxuXHRcdFx0XHR1cmw6IHRoaXMuc3JjXHJcblx0XHRcdH0pO1xyXG5cdFx0fVxyXG5cclxuXHRcdGxheWVyLl90aWxlTG9hZGVkKCk7XHJcblx0fSxcclxuXHJcblx0X3RpbGVPbkVycm9yOiBmdW5jdGlvbiAoKSB7XHJcblx0XHR2YXIgbGF5ZXIgPSB0aGlzLl9sYXllcjtcclxuXHJcblx0XHRsYXllci5maXJlKCd0aWxlZXJyb3InLCB7XHJcblx0XHRcdHRpbGU6IHRoaXMsXHJcblx0XHRcdHVybDogdGhpcy5zcmNcclxuXHRcdH0pO1xyXG5cclxuXHRcdHZhciBuZXdVcmwgPSBsYXllci5vcHRpb25zLmVycm9yVGlsZVVybDtcclxuXHRcdGlmIChuZXdVcmwpIHtcclxuXHRcdFx0dGhpcy5zcmMgPSBuZXdVcmw7XHJcblx0XHR9XHJcblxyXG5cdFx0bGF5ZXIuX3RpbGVMb2FkZWQoKTtcclxuXHR9XHJcbn0pO1xyXG5cclxuTC50aWxlTGF5ZXIgPSBmdW5jdGlvbiAodXJsLCBvcHRpb25zKSB7XHJcblx0cmV0dXJuIG5ldyBMLlRpbGVMYXllcih1cmwsIG9wdGlvbnMpO1xyXG59O1xyXG5cblxuLypcclxuICogTC5UaWxlTGF5ZXIuV01TIGlzIHVzZWQgZm9yIHB1dHRpbmcgV01TIHRpbGUgbGF5ZXJzIG9uIHRoZSBtYXAuXHJcbiAqL1xyXG5cclxuTC5UaWxlTGF5ZXIuV01TID0gTC5UaWxlTGF5ZXIuZXh0ZW5kKHtcclxuXHJcblx0ZGVmYXVsdFdtc1BhcmFtczoge1xyXG5cdFx0c2VydmljZTogJ1dNUycsXHJcblx0XHRyZXF1ZXN0OiAnR2V0TWFwJyxcclxuXHRcdHZlcnNpb246ICcxLjEuMScsXHJcblx0XHRsYXllcnM6ICcnLFxyXG5cdFx0c3R5bGVzOiAnJyxcclxuXHRcdGZvcm1hdDogJ2ltYWdlL2pwZWcnLFxyXG5cdFx0dHJhbnNwYXJlbnQ6IGZhbHNlXHJcblx0fSxcclxuXHJcblx0aW5pdGlhbGl6ZTogZnVuY3Rpb24gKHVybCwgb3B0aW9ucykgeyAvLyAoU3RyaW5nLCBPYmplY3QpXHJcblxyXG5cdFx0dGhpcy5fdXJsID0gdXJsO1xyXG5cclxuXHRcdHZhciB3bXNQYXJhbXMgPSBMLmV4dGVuZCh7fSwgdGhpcy5kZWZhdWx0V21zUGFyYW1zKSxcclxuXHRcdCAgICB0aWxlU2l6ZSA9IG9wdGlvbnMudGlsZVNpemUgfHwgdGhpcy5vcHRpb25zLnRpbGVTaXplO1xyXG5cclxuXHRcdGlmIChvcHRpb25zLmRldGVjdFJldGluYSAmJiBMLkJyb3dzZXIucmV0aW5hKSB7XHJcblx0XHRcdHdtc1BhcmFtcy53aWR0aCA9IHdtc1BhcmFtcy5oZWlnaHQgPSB0aWxlU2l6ZSAqIDI7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHR3bXNQYXJhbXMud2lkdGggPSB3bXNQYXJhbXMuaGVpZ2h0ID0gdGlsZVNpemU7XHJcblx0XHR9XHJcblxyXG5cdFx0Zm9yICh2YXIgaSBpbiBvcHRpb25zKSB7XHJcblx0XHRcdC8vIGFsbCBrZXlzIHRoYXQgYXJlIG5vdCBUaWxlTGF5ZXIgb3B0aW9ucyBnbyB0byBXTVMgcGFyYW1zXHJcblx0XHRcdGlmICghdGhpcy5vcHRpb25zLmhhc093blByb3BlcnR5KGkpICYmIGkgIT09ICdjcnMnKSB7XHJcblx0XHRcdFx0d21zUGFyYW1zW2ldID0gb3B0aW9uc1tpXTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHRcdHRoaXMud21zUGFyYW1zID0gd21zUGFyYW1zO1xyXG5cclxuXHRcdEwuc2V0T3B0aW9ucyh0aGlzLCBvcHRpb25zKTtcclxuXHR9LFxyXG5cclxuXHRvbkFkZDogZnVuY3Rpb24gKG1hcCkge1xyXG5cclxuXHRcdHRoaXMuX2NycyA9IHRoaXMub3B0aW9ucy5jcnMgfHwgbWFwLm9wdGlvbnMuY3JzO1xyXG5cclxuXHRcdHRoaXMuX3dtc1ZlcnNpb24gPSBwYXJzZUZsb2F0KHRoaXMud21zUGFyYW1zLnZlcnNpb24pO1xyXG5cclxuXHRcdHZhciBwcm9qZWN0aW9uS2V5ID0gdGhpcy5fd21zVmVyc2lvbiA+PSAxLjMgPyAnY3JzJyA6ICdzcnMnO1xyXG5cdFx0dGhpcy53bXNQYXJhbXNbcHJvamVjdGlvbktleV0gPSB0aGlzLl9jcnMuY29kZTtcclxuXHJcblx0XHRMLlRpbGVMYXllci5wcm90b3R5cGUub25BZGQuY2FsbCh0aGlzLCBtYXApO1xyXG5cdH0sXHJcblxyXG5cdGdldFRpbGVVcmw6IGZ1bmN0aW9uICh0aWxlUG9pbnQpIHsgLy8gKFBvaW50LCBOdW1iZXIpIC0+IFN0cmluZ1xyXG5cclxuXHRcdHZhciBtYXAgPSB0aGlzLl9tYXAsXHJcblx0XHQgICAgdGlsZVNpemUgPSB0aGlzLm9wdGlvbnMudGlsZVNpemUsXHJcblxyXG5cdFx0ICAgIG53UG9pbnQgPSB0aWxlUG9pbnQubXVsdGlwbHlCeSh0aWxlU2l6ZSksXHJcblx0XHQgICAgc2VQb2ludCA9IG53UG9pbnQuYWRkKFt0aWxlU2l6ZSwgdGlsZVNpemVdKSxcclxuXHJcblx0XHQgICAgbncgPSB0aGlzLl9jcnMucHJvamVjdChtYXAudW5wcm9qZWN0KG53UG9pbnQsIHRpbGVQb2ludC56KSksXHJcblx0XHQgICAgc2UgPSB0aGlzLl9jcnMucHJvamVjdChtYXAudW5wcm9qZWN0KHNlUG9pbnQsIHRpbGVQb2ludC56KSksXHJcblx0XHQgICAgYmJveCA9IHRoaXMuX3dtc1ZlcnNpb24gPj0gMS4zICYmIHRoaXMuX2NycyA9PT0gTC5DUlMuRVBTRzQzMjYgP1xyXG5cdFx0ICAgICAgICBbc2UueSwgbncueCwgbncueSwgc2UueF0uam9pbignLCcpIDpcclxuXHRcdCAgICAgICAgW253LngsIHNlLnksIHNlLngsIG53LnldLmpvaW4oJywnKSxcclxuXHJcblx0XHQgICAgdXJsID0gTC5VdGlsLnRlbXBsYXRlKHRoaXMuX3VybCwge3M6IHRoaXMuX2dldFN1YmRvbWFpbih0aWxlUG9pbnQpfSk7XHJcblxyXG5cdFx0cmV0dXJuIHVybCArIEwuVXRpbC5nZXRQYXJhbVN0cmluZyh0aGlzLndtc1BhcmFtcywgdXJsLCB0cnVlKSArICcmQkJPWD0nICsgYmJveDtcclxuXHR9LFxyXG5cclxuXHRzZXRQYXJhbXM6IGZ1bmN0aW9uIChwYXJhbXMsIG5vUmVkcmF3KSB7XHJcblxyXG5cdFx0TC5leHRlbmQodGhpcy53bXNQYXJhbXMsIHBhcmFtcyk7XHJcblxyXG5cdFx0aWYgKCFub1JlZHJhdykge1xyXG5cdFx0XHR0aGlzLnJlZHJhdygpO1xyXG5cdFx0fVxyXG5cclxuXHRcdHJldHVybiB0aGlzO1xyXG5cdH1cclxufSk7XHJcblxyXG5MLnRpbGVMYXllci53bXMgPSBmdW5jdGlvbiAodXJsLCBvcHRpb25zKSB7XHJcblx0cmV0dXJuIG5ldyBMLlRpbGVMYXllci5XTVModXJsLCBvcHRpb25zKTtcclxufTtcclxuXG5cbi8qXHJcbiAqIEwuVGlsZUxheWVyLkNhbnZhcyBpcyBhIGNsYXNzIHRoYXQgeW91IGNhbiB1c2UgYXMgYSBiYXNlIGZvciBjcmVhdGluZ1xyXG4gKiBkeW5hbWljYWxseSBkcmF3biBDYW52YXMtYmFzZWQgdGlsZSBsYXllcnMuXHJcbiAqL1xyXG5cclxuTC5UaWxlTGF5ZXIuQ2FudmFzID0gTC5UaWxlTGF5ZXIuZXh0ZW5kKHtcclxuXHRvcHRpb25zOiB7XHJcblx0XHRhc3luYzogZmFsc2VcclxuXHR9LFxyXG5cclxuXHRpbml0aWFsaXplOiBmdW5jdGlvbiAob3B0aW9ucykge1xyXG5cdFx0TC5zZXRPcHRpb25zKHRoaXMsIG9wdGlvbnMpO1xyXG5cdH0sXHJcblxyXG5cdHJlZHJhdzogZnVuY3Rpb24gKCkge1xyXG5cdFx0aWYgKHRoaXMuX21hcCkge1xyXG5cdFx0XHR0aGlzLl9yZXNldCh7aGFyZDogdHJ1ZX0pO1xyXG5cdFx0XHR0aGlzLl91cGRhdGUoKTtcclxuXHRcdH1cclxuXHJcblx0XHRmb3IgKHZhciBpIGluIHRoaXMuX3RpbGVzKSB7XHJcblx0XHRcdHRoaXMuX3JlZHJhd1RpbGUodGhpcy5fdGlsZXNbaV0pO1xyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIHRoaXM7XHJcblx0fSxcclxuXHJcblx0X3JlZHJhd1RpbGU6IGZ1bmN0aW9uICh0aWxlKSB7XHJcblx0XHR0aGlzLmRyYXdUaWxlKHRpbGUsIHRpbGUuX3RpbGVQb2ludCwgdGhpcy5fbWFwLl96b29tKTtcclxuXHR9LFxyXG5cclxuXHRfY3JlYXRlVGlsZTogZnVuY3Rpb24gKCkge1xyXG5cdFx0dmFyIHRpbGUgPSBMLkRvbVV0aWwuY3JlYXRlKCdjYW52YXMnLCAnbGVhZmxldC10aWxlJyk7XHJcblx0XHR0aWxlLndpZHRoID0gdGlsZS5oZWlnaHQgPSB0aGlzLm9wdGlvbnMudGlsZVNpemU7XHJcblx0XHR0aWxlLm9uc2VsZWN0c3RhcnQgPSB0aWxlLm9ubW91c2Vtb3ZlID0gTC5VdGlsLmZhbHNlRm47XHJcblx0XHRyZXR1cm4gdGlsZTtcclxuXHR9LFxyXG5cclxuXHRfbG9hZFRpbGU6IGZ1bmN0aW9uICh0aWxlLCB0aWxlUG9pbnQpIHtcclxuXHRcdHRpbGUuX2xheWVyID0gdGhpcztcclxuXHRcdHRpbGUuX3RpbGVQb2ludCA9IHRpbGVQb2ludDtcclxuXHJcblx0XHR0aGlzLl9yZWRyYXdUaWxlKHRpbGUpO1xyXG5cclxuXHRcdGlmICghdGhpcy5vcHRpb25zLmFzeW5jKSB7XHJcblx0XHRcdHRoaXMudGlsZURyYXduKHRpbGUpO1xyXG5cdFx0fVxyXG5cdH0sXHJcblxyXG5cdGRyYXdUaWxlOiBmdW5jdGlvbiAoLyp0aWxlLCB0aWxlUG9pbnQqLykge1xyXG5cdFx0Ly8gb3ZlcnJpZGUgd2l0aCByZW5kZXJpbmcgY29kZVxyXG5cdH0sXHJcblxyXG5cdHRpbGVEcmF3bjogZnVuY3Rpb24gKHRpbGUpIHtcclxuXHRcdHRoaXMuX3RpbGVPbkxvYWQuY2FsbCh0aWxlKTtcclxuXHR9XHJcbn0pO1xyXG5cclxuXHJcbkwudGlsZUxheWVyLmNhbnZhcyA9IGZ1bmN0aW9uIChvcHRpb25zKSB7XHJcblx0cmV0dXJuIG5ldyBMLlRpbGVMYXllci5DYW52YXMob3B0aW9ucyk7XHJcbn07XHJcblxuXG4vKlxyXG4gKiBMLkltYWdlT3ZlcmxheSBpcyB1c2VkIHRvIG92ZXJsYXkgaW1hZ2VzIG92ZXIgdGhlIG1hcCAodG8gc3BlY2lmaWMgZ2VvZ3JhcGhpY2FsIGJvdW5kcykuXHJcbiAqL1xyXG5cclxuTC5JbWFnZU92ZXJsYXkgPSBMLkNsYXNzLmV4dGVuZCh7XHJcblx0aW5jbHVkZXM6IEwuTWl4aW4uRXZlbnRzLFxyXG5cclxuXHRvcHRpb25zOiB7XHJcblx0XHRvcGFjaXR5OiAxXHJcblx0fSxcclxuXHJcblx0aW5pdGlhbGl6ZTogZnVuY3Rpb24gKHVybCwgYm91bmRzLCBvcHRpb25zKSB7IC8vIChTdHJpbmcsIExhdExuZ0JvdW5kcywgT2JqZWN0KVxyXG5cdFx0dGhpcy5fdXJsID0gdXJsO1xyXG5cdFx0dGhpcy5fYm91bmRzID0gTC5sYXRMbmdCb3VuZHMoYm91bmRzKTtcclxuXHJcblx0XHRMLnNldE9wdGlvbnModGhpcywgb3B0aW9ucyk7XHJcblx0fSxcclxuXHJcblx0b25BZGQ6IGZ1bmN0aW9uIChtYXApIHtcclxuXHRcdHRoaXMuX21hcCA9IG1hcDtcclxuXHJcblx0XHRpZiAoIXRoaXMuX2ltYWdlKSB7XHJcblx0XHRcdHRoaXMuX2luaXRJbWFnZSgpO1xyXG5cdFx0fVxyXG5cclxuXHRcdG1hcC5fcGFuZXMub3ZlcmxheVBhbmUuYXBwZW5kQ2hpbGQodGhpcy5faW1hZ2UpO1xyXG5cclxuXHRcdG1hcC5vbigndmlld3Jlc2V0JywgdGhpcy5fcmVzZXQsIHRoaXMpO1xyXG5cclxuXHRcdGlmIChtYXAub3B0aW9ucy56b29tQW5pbWF0aW9uICYmIEwuQnJvd3Nlci5hbnkzZCkge1xyXG5cdFx0XHRtYXAub24oJ3pvb21hbmltJywgdGhpcy5fYW5pbWF0ZVpvb20sIHRoaXMpO1xyXG5cdFx0fVxyXG5cclxuXHRcdHRoaXMuX3Jlc2V0KCk7XHJcblx0fSxcclxuXHJcblx0b25SZW1vdmU6IGZ1bmN0aW9uIChtYXApIHtcclxuXHRcdG1hcC5nZXRQYW5lcygpLm92ZXJsYXlQYW5lLnJlbW92ZUNoaWxkKHRoaXMuX2ltYWdlKTtcclxuXHJcblx0XHRtYXAub2ZmKCd2aWV3cmVzZXQnLCB0aGlzLl9yZXNldCwgdGhpcyk7XHJcblxyXG5cdFx0aWYgKG1hcC5vcHRpb25zLnpvb21BbmltYXRpb24pIHtcclxuXHRcdFx0bWFwLm9mZignem9vbWFuaW0nLCB0aGlzLl9hbmltYXRlWm9vbSwgdGhpcyk7XHJcblx0XHR9XHJcblx0fSxcclxuXHJcblx0YWRkVG86IGZ1bmN0aW9uIChtYXApIHtcclxuXHRcdG1hcC5hZGRMYXllcih0aGlzKTtcclxuXHRcdHJldHVybiB0aGlzO1xyXG5cdH0sXHJcblxyXG5cdHNldE9wYWNpdHk6IGZ1bmN0aW9uIChvcGFjaXR5KSB7XHJcblx0XHR0aGlzLm9wdGlvbnMub3BhY2l0eSA9IG9wYWNpdHk7XHJcblx0XHR0aGlzLl91cGRhdGVPcGFjaXR5KCk7XHJcblx0XHRyZXR1cm4gdGhpcztcclxuXHR9LFxyXG5cclxuXHQvLyBUT0RPIHJlbW92ZSBicmluZ1RvRnJvbnQvYnJpbmdUb0JhY2sgZHVwbGljYXRpb24gZnJvbSBUaWxlTGF5ZXIvUGF0aFxyXG5cdGJyaW5nVG9Gcm9udDogZnVuY3Rpb24gKCkge1xyXG5cdFx0aWYgKHRoaXMuX2ltYWdlKSB7XHJcblx0XHRcdHRoaXMuX21hcC5fcGFuZXMub3ZlcmxheVBhbmUuYXBwZW5kQ2hpbGQodGhpcy5faW1hZ2UpO1xyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIHRoaXM7XHJcblx0fSxcclxuXHJcblx0YnJpbmdUb0JhY2s6IGZ1bmN0aW9uICgpIHtcclxuXHRcdHZhciBwYW5lID0gdGhpcy5fbWFwLl9wYW5lcy5vdmVybGF5UGFuZTtcclxuXHRcdGlmICh0aGlzLl9pbWFnZSkge1xyXG5cdFx0XHRwYW5lLmluc2VydEJlZm9yZSh0aGlzLl9pbWFnZSwgcGFuZS5maXJzdENoaWxkKTtcclxuXHRcdH1cclxuXHRcdHJldHVybiB0aGlzO1xyXG5cdH0sXHJcblxyXG5cdHNldFVybDogZnVuY3Rpb24gKHVybCkge1xyXG5cdFx0dGhpcy5fdXJsID0gdXJsO1xyXG5cdFx0dGhpcy5faW1hZ2Uuc3JjID0gdGhpcy5fdXJsO1xyXG5cdH0sXHJcblxyXG5cdGdldEF0dHJpYnV0aW9uOiBmdW5jdGlvbiAoKSB7XHJcblx0XHRyZXR1cm4gdGhpcy5vcHRpb25zLmF0dHJpYnV0aW9uO1xyXG5cdH0sXHJcblxyXG5cdF9pbml0SW1hZ2U6IGZ1bmN0aW9uICgpIHtcclxuXHRcdHRoaXMuX2ltYWdlID0gTC5Eb21VdGlsLmNyZWF0ZSgnaW1nJywgJ2xlYWZsZXQtaW1hZ2UtbGF5ZXInKTtcclxuXHJcblx0XHRpZiAodGhpcy5fbWFwLm9wdGlvbnMuem9vbUFuaW1hdGlvbiAmJiBMLkJyb3dzZXIuYW55M2QpIHtcclxuXHRcdFx0TC5Eb21VdGlsLmFkZENsYXNzKHRoaXMuX2ltYWdlLCAnbGVhZmxldC16b29tLWFuaW1hdGVkJyk7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRMLkRvbVV0aWwuYWRkQ2xhc3ModGhpcy5faW1hZ2UsICdsZWFmbGV0LXpvb20taGlkZScpO1xyXG5cdFx0fVxyXG5cclxuXHRcdHRoaXMuX3VwZGF0ZU9wYWNpdHkoKTtcclxuXHJcblx0XHQvL1RPRE8gY3JlYXRlSW1hZ2UgdXRpbCBtZXRob2QgdG8gcmVtb3ZlIGR1cGxpY2F0aW9uXHJcblx0XHRMLmV4dGVuZCh0aGlzLl9pbWFnZSwge1xyXG5cdFx0XHRnYWxsZXJ5aW1nOiAnbm8nLFxyXG5cdFx0XHRvbnNlbGVjdHN0YXJ0OiBMLlV0aWwuZmFsc2VGbixcclxuXHRcdFx0b25tb3VzZW1vdmU6IEwuVXRpbC5mYWxzZUZuLFxyXG5cdFx0XHRvbmxvYWQ6IEwuYmluZCh0aGlzLl9vbkltYWdlTG9hZCwgdGhpcyksXHJcblx0XHRcdHNyYzogdGhpcy5fdXJsXHJcblx0XHR9KTtcclxuXHR9LFxyXG5cclxuXHRfYW5pbWF0ZVpvb206IGZ1bmN0aW9uIChlKSB7XHJcblx0XHR2YXIgbWFwID0gdGhpcy5fbWFwLFxyXG5cdFx0ICAgIGltYWdlID0gdGhpcy5faW1hZ2UsXHJcblx0XHQgICAgc2NhbGUgPSBtYXAuZ2V0Wm9vbVNjYWxlKGUuem9vbSksXHJcblx0XHQgICAgbncgPSB0aGlzLl9ib3VuZHMuZ2V0Tm9ydGhXZXN0KCksXHJcblx0XHQgICAgc2UgPSB0aGlzLl9ib3VuZHMuZ2V0U291dGhFYXN0KCksXHJcblxyXG5cdFx0ICAgIHRvcExlZnQgPSBtYXAuX2xhdExuZ1RvTmV3TGF5ZXJQb2ludChudywgZS56b29tLCBlLmNlbnRlciksXHJcblx0XHQgICAgc2l6ZSA9IG1hcC5fbGF0TG5nVG9OZXdMYXllclBvaW50KHNlLCBlLnpvb20sIGUuY2VudGVyKS5fc3VidHJhY3QodG9wTGVmdCksXHJcblx0XHQgICAgb3JpZ2luID0gdG9wTGVmdC5fYWRkKHNpemUuX211bHRpcGx5QnkoKDEgLyAyKSAqICgxIC0gMSAvIHNjYWxlKSkpO1xyXG5cclxuXHRcdGltYWdlLnN0eWxlW0wuRG9tVXRpbC5UUkFOU0ZPUk1dID1cclxuXHRcdCAgICAgICAgTC5Eb21VdGlsLmdldFRyYW5zbGF0ZVN0cmluZyhvcmlnaW4pICsgJyBzY2FsZSgnICsgc2NhbGUgKyAnKSAnO1xyXG5cdH0sXHJcblxyXG5cdF9yZXNldDogZnVuY3Rpb24gKCkge1xyXG5cdFx0dmFyIGltYWdlICAgPSB0aGlzLl9pbWFnZSxcclxuXHRcdCAgICB0b3BMZWZ0ID0gdGhpcy5fbWFwLmxhdExuZ1RvTGF5ZXJQb2ludCh0aGlzLl9ib3VuZHMuZ2V0Tm9ydGhXZXN0KCkpLFxyXG5cdFx0ICAgIHNpemUgPSB0aGlzLl9tYXAubGF0TG5nVG9MYXllclBvaW50KHRoaXMuX2JvdW5kcy5nZXRTb3V0aEVhc3QoKSkuX3N1YnRyYWN0KHRvcExlZnQpO1xyXG5cclxuXHRcdEwuRG9tVXRpbC5zZXRQb3NpdGlvbihpbWFnZSwgdG9wTGVmdCk7XHJcblxyXG5cdFx0aW1hZ2Uuc3R5bGUud2lkdGggID0gc2l6ZS54ICsgJ3B4JztcclxuXHRcdGltYWdlLnN0eWxlLmhlaWdodCA9IHNpemUueSArICdweCc7XHJcblx0fSxcclxuXHJcblx0X29uSW1hZ2VMb2FkOiBmdW5jdGlvbiAoKSB7XHJcblx0XHR0aGlzLmZpcmUoJ2xvYWQnKTtcclxuXHR9LFxyXG5cclxuXHRfdXBkYXRlT3BhY2l0eTogZnVuY3Rpb24gKCkge1xyXG5cdFx0TC5Eb21VdGlsLnNldE9wYWNpdHkodGhpcy5faW1hZ2UsIHRoaXMub3B0aW9ucy5vcGFjaXR5KTtcclxuXHR9XHJcbn0pO1xyXG5cclxuTC5pbWFnZU92ZXJsYXkgPSBmdW5jdGlvbiAodXJsLCBib3VuZHMsIG9wdGlvbnMpIHtcclxuXHRyZXR1cm4gbmV3IEwuSW1hZ2VPdmVybGF5KHVybCwgYm91bmRzLCBvcHRpb25zKTtcclxufTtcclxuXG5cbi8qXHJcbiAqIEwuSWNvbiBpcyBhbiBpbWFnZS1iYXNlZCBpY29uIGNsYXNzIHRoYXQgeW91IGNhbiB1c2Ugd2l0aCBMLk1hcmtlciBmb3IgY3VzdG9tIG1hcmtlcnMuXHJcbiAqL1xyXG5cclxuTC5JY29uID0gTC5DbGFzcy5leHRlbmQoe1xyXG5cdG9wdGlvbnM6IHtcclxuXHRcdC8qXHJcblx0XHRpY29uVXJsOiAoU3RyaW5nKSAocmVxdWlyZWQpXHJcblx0XHRpY29uUmV0aW5hVXJsOiAoU3RyaW5nKSAob3B0aW9uYWwsIHVzZWQgZm9yIHJldGluYSBkZXZpY2VzIGlmIGRldGVjdGVkKVxyXG5cdFx0aWNvblNpemU6IChQb2ludCkgKGNhbiBiZSBzZXQgdGhyb3VnaCBDU1MpXHJcblx0XHRpY29uQW5jaG9yOiAoUG9pbnQpIChjZW50ZXJlZCBieSBkZWZhdWx0LCBjYW4gYmUgc2V0IGluIENTUyB3aXRoIG5lZ2F0aXZlIG1hcmdpbnMpXHJcblx0XHRwb3B1cEFuY2hvcjogKFBvaW50KSAoaWYgbm90IHNwZWNpZmllZCwgcG9wdXAgb3BlbnMgaW4gdGhlIGFuY2hvciBwb2ludClcclxuXHRcdHNoYWRvd1VybDogKFN0cmluZykgKG5vIHNoYWRvdyBieSBkZWZhdWx0KVxyXG5cdFx0c2hhZG93UmV0aW5hVXJsOiAoU3RyaW5nKSAob3B0aW9uYWwsIHVzZWQgZm9yIHJldGluYSBkZXZpY2VzIGlmIGRldGVjdGVkKVxyXG5cdFx0c2hhZG93U2l6ZTogKFBvaW50KVxyXG5cdFx0c2hhZG93QW5jaG9yOiAoUG9pbnQpXHJcblx0XHQqL1xyXG5cdFx0Y2xhc3NOYW1lOiAnJ1xyXG5cdH0sXHJcblxyXG5cdGluaXRpYWxpemU6IGZ1bmN0aW9uIChvcHRpb25zKSB7XHJcblx0XHRMLnNldE9wdGlvbnModGhpcywgb3B0aW9ucyk7XHJcblx0fSxcclxuXHJcblx0Y3JlYXRlSWNvbjogZnVuY3Rpb24gKG9sZEljb24pIHtcclxuXHRcdHJldHVybiB0aGlzLl9jcmVhdGVJY29uKCdpY29uJywgb2xkSWNvbik7XHJcblx0fSxcclxuXHJcblx0Y3JlYXRlU2hhZG93OiBmdW5jdGlvbiAob2xkSWNvbikge1xyXG5cdFx0cmV0dXJuIHRoaXMuX2NyZWF0ZUljb24oJ3NoYWRvdycsIG9sZEljb24pO1xyXG5cdH0sXHJcblxyXG5cdF9jcmVhdGVJY29uOiBmdW5jdGlvbiAobmFtZSwgb2xkSWNvbikge1xyXG5cdFx0dmFyIHNyYyA9IHRoaXMuX2dldEljb25VcmwobmFtZSk7XHJcblxyXG5cdFx0aWYgKCFzcmMpIHtcclxuXHRcdFx0aWYgKG5hbWUgPT09ICdpY29uJykge1xyXG5cdFx0XHRcdHRocm93IG5ldyBFcnJvcignaWNvblVybCBub3Qgc2V0IGluIEljb24gb3B0aW9ucyAoc2VlIHRoZSBkb2NzKS4nKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRyZXR1cm4gbnVsbDtcclxuXHRcdH1cclxuXHJcblx0XHR2YXIgaW1nO1xyXG5cdFx0aWYgKCFvbGRJY29uIHx8IG9sZEljb24udGFnTmFtZSAhPT0gJ0lNRycpIHtcclxuXHRcdFx0aW1nID0gdGhpcy5fY3JlYXRlSW1nKHNyYyk7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRpbWcgPSB0aGlzLl9jcmVhdGVJbWcoc3JjLCBvbGRJY29uKTtcclxuXHRcdH1cclxuXHRcdHRoaXMuX3NldEljb25TdHlsZXMoaW1nLCBuYW1lKTtcclxuXHJcblx0XHRyZXR1cm4gaW1nO1xyXG5cdH0sXHJcblxyXG5cdF9zZXRJY29uU3R5bGVzOiBmdW5jdGlvbiAoaW1nLCBuYW1lKSB7XHJcblx0XHR2YXIgb3B0aW9ucyA9IHRoaXMub3B0aW9ucyxcclxuXHRcdCAgICBzaXplID0gTC5wb2ludChvcHRpb25zW25hbWUgKyAnU2l6ZSddKSxcclxuXHRcdCAgICBhbmNob3I7XHJcblxyXG5cdFx0aWYgKG5hbWUgPT09ICdzaGFkb3cnKSB7XHJcblx0XHRcdGFuY2hvciA9IEwucG9pbnQob3B0aW9ucy5zaGFkb3dBbmNob3IgfHwgb3B0aW9ucy5pY29uQW5jaG9yKTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdGFuY2hvciA9IEwucG9pbnQob3B0aW9ucy5pY29uQW5jaG9yKTtcclxuXHRcdH1cclxuXHJcblx0XHRpZiAoIWFuY2hvciAmJiBzaXplKSB7XHJcblx0XHRcdGFuY2hvciA9IHNpemUuZGl2aWRlQnkoMiwgdHJ1ZSk7XHJcblx0XHR9XHJcblxyXG5cdFx0aW1nLmNsYXNzTmFtZSA9ICdsZWFmbGV0LW1hcmtlci0nICsgbmFtZSArICcgJyArIG9wdGlvbnMuY2xhc3NOYW1lO1xyXG5cclxuXHRcdGlmIChhbmNob3IpIHtcclxuXHRcdFx0aW1nLnN0eWxlLm1hcmdpbkxlZnQgPSAoLWFuY2hvci54KSArICdweCc7XHJcblx0XHRcdGltZy5zdHlsZS5tYXJnaW5Ub3AgID0gKC1hbmNob3IueSkgKyAncHgnO1xyXG5cdFx0fVxyXG5cclxuXHRcdGlmIChzaXplKSB7XHJcblx0XHRcdGltZy5zdHlsZS53aWR0aCAgPSBzaXplLnggKyAncHgnO1xyXG5cdFx0XHRpbWcuc3R5bGUuaGVpZ2h0ID0gc2l6ZS55ICsgJ3B4JztcclxuXHRcdH1cclxuXHR9LFxyXG5cclxuXHRfY3JlYXRlSW1nOiBmdW5jdGlvbiAoc3JjLCBlbCkge1xyXG5cdFx0ZWwgPSBlbCB8fCBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbWcnKTtcclxuXHRcdGVsLnNyYyA9IHNyYztcclxuXHRcdHJldHVybiBlbDtcclxuXHR9LFxyXG5cclxuXHRfZ2V0SWNvblVybDogZnVuY3Rpb24gKG5hbWUpIHtcclxuXHRcdGlmIChMLkJyb3dzZXIucmV0aW5hICYmIHRoaXMub3B0aW9uc1tuYW1lICsgJ1JldGluYVVybCddKSB7XHJcblx0XHRcdHJldHVybiB0aGlzLm9wdGlvbnNbbmFtZSArICdSZXRpbmFVcmwnXTtcclxuXHRcdH1cclxuXHRcdHJldHVybiB0aGlzLm9wdGlvbnNbbmFtZSArICdVcmwnXTtcclxuXHR9XHJcbn0pO1xyXG5cclxuTC5pY29uID0gZnVuY3Rpb24gKG9wdGlvbnMpIHtcclxuXHRyZXR1cm4gbmV3IEwuSWNvbihvcHRpb25zKTtcclxufTtcclxuXG5cbi8qXG4gKiBMLkljb24uRGVmYXVsdCBpcyB0aGUgYmx1ZSBtYXJrZXIgaWNvbiB1c2VkIGJ5IGRlZmF1bHQgaW4gTGVhZmxldC5cbiAqL1xuXG5MLkljb24uRGVmYXVsdCA9IEwuSWNvbi5leHRlbmQoe1xuXG5cdG9wdGlvbnM6IHtcblx0XHRpY29uU2l6ZTogWzI1LCA0MV0sXG5cdFx0aWNvbkFuY2hvcjogWzEyLCA0MV0sXG5cdFx0cG9wdXBBbmNob3I6IFsxLCAtMzRdLFxuXG5cdFx0c2hhZG93U2l6ZTogWzQxLCA0MV1cblx0fSxcblxuXHRfZ2V0SWNvblVybDogZnVuY3Rpb24gKG5hbWUpIHtcblx0XHR2YXIga2V5ID0gbmFtZSArICdVcmwnO1xuXG5cdFx0aWYgKHRoaXMub3B0aW9uc1trZXldKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5vcHRpb25zW2tleV07XG5cdFx0fVxuXG5cdFx0aWYgKEwuQnJvd3Nlci5yZXRpbmEgJiYgbmFtZSA9PT0gJ2ljb24nKSB7XG5cdFx0XHRuYW1lICs9ICctMngnO1xuXHRcdH1cblxuXHRcdHZhciBwYXRoID0gTC5JY29uLkRlZmF1bHQuaW1hZ2VQYXRoO1xuXG5cdFx0aWYgKCFwYXRoKSB7XG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoJ0NvdWxkblxcJ3QgYXV0b2RldGVjdCBMLkljb24uRGVmYXVsdC5pbWFnZVBhdGgsIHNldCBpdCBtYW51YWxseS4nKTtcblx0XHR9XG5cblx0XHRyZXR1cm4gcGF0aCArICcvbWFya2VyLScgKyBuYW1lICsgJy5wbmcnO1xuXHR9XG59KTtcblxuTC5JY29uLkRlZmF1bHQuaW1hZ2VQYXRoID0gKGZ1bmN0aW9uICgpIHtcblx0dmFyIHNjcmlwdHMgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnc2NyaXB0JyksXG5cdCAgICBsZWFmbGV0UmUgPSAvW1xcL15dbGVhZmxldFtcXC1cXC5fXT8oW1xcd1xcLVxcLl9dKilcXC5qc1xcPz8vO1xuXG5cdHZhciBpLCBsZW4sIHNyYywgbWF0Y2hlcywgcGF0aDtcblxuXHRmb3IgKGkgPSAwLCBsZW4gPSBzY3JpcHRzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG5cdFx0c3JjID0gc2NyaXB0c1tpXS5zcmM7XG5cdFx0bWF0Y2hlcyA9IHNyYy5tYXRjaChsZWFmbGV0UmUpO1xuXG5cdFx0aWYgKG1hdGNoZXMpIHtcblx0XHRcdHBhdGggPSBzcmMuc3BsaXQobGVhZmxldFJlKVswXTtcblx0XHRcdHJldHVybiAocGF0aCA/IHBhdGggKyAnLycgOiAnJykgKyAnaW1hZ2VzJztcblx0XHR9XG5cdH1cbn0oKSk7XG5cblxuLypcclxuICogTC5NYXJrZXIgaXMgdXNlZCB0byBkaXNwbGF5IGNsaWNrYWJsZS9kcmFnZ2FibGUgaWNvbnMgb24gdGhlIG1hcC5cclxuICovXHJcblxyXG5MLk1hcmtlciA9IEwuQ2xhc3MuZXh0ZW5kKHtcclxuXHJcblx0aW5jbHVkZXM6IEwuTWl4aW4uRXZlbnRzLFxyXG5cclxuXHRvcHRpb25zOiB7XHJcblx0XHRpY29uOiBuZXcgTC5JY29uLkRlZmF1bHQoKSxcclxuXHRcdHRpdGxlOiAnJyxcclxuXHRcdGFsdDogJycsXHJcblx0XHRjbGlja2FibGU6IHRydWUsXHJcblx0XHRkcmFnZ2FibGU6IGZhbHNlLFxyXG5cdFx0a2V5Ym9hcmQ6IHRydWUsXHJcblx0XHR6SW5kZXhPZmZzZXQ6IDAsXHJcblx0XHRvcGFjaXR5OiAxLFxyXG5cdFx0cmlzZU9uSG92ZXI6IGZhbHNlLFxyXG5cdFx0cmlzZU9mZnNldDogMjUwXHJcblx0fSxcclxuXHJcblx0aW5pdGlhbGl6ZTogZnVuY3Rpb24gKGxhdGxuZywgb3B0aW9ucykge1xyXG5cdFx0TC5zZXRPcHRpb25zKHRoaXMsIG9wdGlvbnMpO1xyXG5cdFx0dGhpcy5fbGF0bG5nID0gTC5sYXRMbmcobGF0bG5nKTtcclxuXHR9LFxyXG5cclxuXHRvbkFkZDogZnVuY3Rpb24gKG1hcCkge1xyXG5cdFx0dGhpcy5fbWFwID0gbWFwO1xyXG5cclxuXHRcdG1hcC5vbigndmlld3Jlc2V0JywgdGhpcy51cGRhdGUsIHRoaXMpO1xyXG5cclxuXHRcdHRoaXMuX2luaXRJY29uKCk7XHJcblx0XHR0aGlzLnVwZGF0ZSgpO1xyXG5cdFx0dGhpcy5maXJlKCdhZGQnKTtcclxuXHJcblx0XHRpZiAobWFwLm9wdGlvbnMuem9vbUFuaW1hdGlvbiAmJiBtYXAub3B0aW9ucy5tYXJrZXJab29tQW5pbWF0aW9uKSB7XHJcblx0XHRcdG1hcC5vbignem9vbWFuaW0nLCB0aGlzLl9hbmltYXRlWm9vbSwgdGhpcyk7XHJcblx0XHR9XHJcblx0fSxcclxuXHJcblx0YWRkVG86IGZ1bmN0aW9uIChtYXApIHtcclxuXHRcdG1hcC5hZGRMYXllcih0aGlzKTtcclxuXHRcdHJldHVybiB0aGlzO1xyXG5cdH0sXHJcblxyXG5cdG9uUmVtb3ZlOiBmdW5jdGlvbiAobWFwKSB7XHJcblx0XHRpZiAodGhpcy5kcmFnZ2luZykge1xyXG5cdFx0XHR0aGlzLmRyYWdnaW5nLmRpc2FibGUoKTtcclxuXHRcdH1cclxuXHJcblx0XHR0aGlzLl9yZW1vdmVJY29uKCk7XHJcblx0XHR0aGlzLl9yZW1vdmVTaGFkb3coKTtcclxuXHJcblx0XHR0aGlzLmZpcmUoJ3JlbW92ZScpO1xyXG5cclxuXHRcdG1hcC5vZmYoe1xyXG5cdFx0XHQndmlld3Jlc2V0JzogdGhpcy51cGRhdGUsXHJcblx0XHRcdCd6b29tYW5pbSc6IHRoaXMuX2FuaW1hdGVab29tXHJcblx0XHR9LCB0aGlzKTtcclxuXHJcblx0XHR0aGlzLl9tYXAgPSBudWxsO1xyXG5cdH0sXHJcblxyXG5cdGdldExhdExuZzogZnVuY3Rpb24gKCkge1xyXG5cdFx0cmV0dXJuIHRoaXMuX2xhdGxuZztcclxuXHR9LFxyXG5cclxuXHRzZXRMYXRMbmc6IGZ1bmN0aW9uIChsYXRsbmcpIHtcclxuXHRcdHRoaXMuX2xhdGxuZyA9IEwubGF0TG5nKGxhdGxuZyk7XHJcblxyXG5cdFx0dGhpcy51cGRhdGUoKTtcclxuXHJcblx0XHRyZXR1cm4gdGhpcy5maXJlKCdtb3ZlJywgeyBsYXRsbmc6IHRoaXMuX2xhdGxuZyB9KTtcclxuXHR9LFxyXG5cclxuXHRzZXRaSW5kZXhPZmZzZXQ6IGZ1bmN0aW9uIChvZmZzZXQpIHtcclxuXHRcdHRoaXMub3B0aW9ucy56SW5kZXhPZmZzZXQgPSBvZmZzZXQ7XHJcblx0XHR0aGlzLnVwZGF0ZSgpO1xyXG5cclxuXHRcdHJldHVybiB0aGlzO1xyXG5cdH0sXHJcblxyXG5cdHNldEljb246IGZ1bmN0aW9uIChpY29uKSB7XHJcblxyXG5cdFx0dGhpcy5vcHRpb25zLmljb24gPSBpY29uO1xyXG5cclxuXHRcdGlmICh0aGlzLl9tYXApIHtcclxuXHRcdFx0dGhpcy5faW5pdEljb24oKTtcclxuXHRcdFx0dGhpcy51cGRhdGUoKTtcclxuXHRcdH1cclxuXHJcblx0XHRpZiAodGhpcy5fcG9wdXApIHtcclxuXHRcdFx0dGhpcy5iaW5kUG9wdXAodGhpcy5fcG9wdXApO1xyXG5cdFx0fVxyXG5cclxuXHRcdHJldHVybiB0aGlzO1xyXG5cdH0sXHJcblxyXG5cdHVwZGF0ZTogZnVuY3Rpb24gKCkge1xyXG5cdFx0aWYgKHRoaXMuX2ljb24pIHtcclxuXHRcdFx0dmFyIHBvcyA9IHRoaXMuX21hcC5sYXRMbmdUb0xheWVyUG9pbnQodGhpcy5fbGF0bG5nKS5yb3VuZCgpO1xyXG5cdFx0XHR0aGlzLl9zZXRQb3MocG9zKTtcclxuXHRcdH1cclxuXHJcblx0XHRyZXR1cm4gdGhpcztcclxuXHR9LFxyXG5cclxuXHRfaW5pdEljb246IGZ1bmN0aW9uICgpIHtcclxuXHRcdHZhciBvcHRpb25zID0gdGhpcy5vcHRpb25zLFxyXG5cdFx0ICAgIG1hcCA9IHRoaXMuX21hcCxcclxuXHRcdCAgICBhbmltYXRpb24gPSAobWFwLm9wdGlvbnMuem9vbUFuaW1hdGlvbiAmJiBtYXAub3B0aW9ucy5tYXJrZXJab29tQW5pbWF0aW9uKSxcclxuXHRcdCAgICBjbGFzc1RvQWRkID0gYW5pbWF0aW9uID8gJ2xlYWZsZXQtem9vbS1hbmltYXRlZCcgOiAnbGVhZmxldC16b29tLWhpZGUnO1xyXG5cclxuXHRcdHZhciBpY29uID0gb3B0aW9ucy5pY29uLmNyZWF0ZUljb24odGhpcy5faWNvbiksXHJcblx0XHRcdGFkZEljb24gPSBmYWxzZTtcclxuXHJcblx0XHQvLyBpZiB3ZSdyZSBub3QgcmV1c2luZyB0aGUgaWNvbiwgcmVtb3ZlIHRoZSBvbGQgb25lIGFuZCBpbml0IG5ldyBvbmVcclxuXHRcdGlmIChpY29uICE9PSB0aGlzLl9pY29uKSB7XHJcblx0XHRcdGlmICh0aGlzLl9pY29uKSB7XHJcblx0XHRcdFx0dGhpcy5fcmVtb3ZlSWNvbigpO1xyXG5cdFx0XHR9XHJcblx0XHRcdGFkZEljb24gPSB0cnVlO1xyXG5cclxuXHRcdFx0aWYgKG9wdGlvbnMudGl0bGUpIHtcclxuXHRcdFx0XHRpY29uLnRpdGxlID0gb3B0aW9ucy50aXRsZTtcclxuXHRcdFx0fVxyXG5cdFx0XHRcclxuXHRcdFx0aWYgKG9wdGlvbnMuYWx0KSB7XHJcblx0XHRcdFx0aWNvbi5hbHQgPSBvcHRpb25zLmFsdDtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHRcdEwuRG9tVXRpbC5hZGRDbGFzcyhpY29uLCBjbGFzc1RvQWRkKTtcclxuXHJcblx0XHRpZiAob3B0aW9ucy5rZXlib2FyZCkge1xyXG5cdFx0XHRpY29uLnRhYkluZGV4ID0gJzAnO1xyXG5cdFx0fVxyXG5cclxuXHRcdHRoaXMuX2ljb24gPSBpY29uO1xyXG5cclxuXHRcdHRoaXMuX2luaXRJbnRlcmFjdGlvbigpO1xyXG5cclxuXHRcdGlmIChvcHRpb25zLnJpc2VPbkhvdmVyKSB7XHJcblx0XHRcdEwuRG9tRXZlbnRcclxuXHRcdFx0XHQub24oaWNvbiwgJ21vdXNlb3ZlcicsIHRoaXMuX2JyaW5nVG9Gcm9udCwgdGhpcylcclxuXHRcdFx0XHQub24oaWNvbiwgJ21vdXNlb3V0JywgdGhpcy5fcmVzZXRaSW5kZXgsIHRoaXMpO1xyXG5cdFx0fVxyXG5cclxuXHRcdHZhciBuZXdTaGFkb3cgPSBvcHRpb25zLmljb24uY3JlYXRlU2hhZG93KHRoaXMuX3NoYWRvdyksXHJcblx0XHRcdGFkZFNoYWRvdyA9IGZhbHNlO1xyXG5cclxuXHRcdGlmIChuZXdTaGFkb3cgIT09IHRoaXMuX3NoYWRvdykge1xyXG5cdFx0XHR0aGlzLl9yZW1vdmVTaGFkb3coKTtcclxuXHRcdFx0YWRkU2hhZG93ID0gdHJ1ZTtcclxuXHRcdH1cclxuXHJcblx0XHRpZiAobmV3U2hhZG93KSB7XHJcblx0XHRcdEwuRG9tVXRpbC5hZGRDbGFzcyhuZXdTaGFkb3csIGNsYXNzVG9BZGQpO1xyXG5cdFx0fVxyXG5cdFx0dGhpcy5fc2hhZG93ID0gbmV3U2hhZG93O1xyXG5cclxuXHJcblx0XHRpZiAob3B0aW9ucy5vcGFjaXR5IDwgMSkge1xyXG5cdFx0XHR0aGlzLl91cGRhdGVPcGFjaXR5KCk7XHJcblx0XHR9XHJcblxyXG5cclxuXHRcdHZhciBwYW5lcyA9IHRoaXMuX21hcC5fcGFuZXM7XHJcblxyXG5cdFx0aWYgKGFkZEljb24pIHtcclxuXHRcdFx0cGFuZXMubWFya2VyUGFuZS5hcHBlbmRDaGlsZCh0aGlzLl9pY29uKTtcclxuXHRcdH1cclxuXHJcblx0XHRpZiAobmV3U2hhZG93ICYmIGFkZFNoYWRvdykge1xyXG5cdFx0XHRwYW5lcy5zaGFkb3dQYW5lLmFwcGVuZENoaWxkKHRoaXMuX3NoYWRvdyk7XHJcblx0XHR9XHJcblx0fSxcclxuXHJcblx0X3JlbW92ZUljb246IGZ1bmN0aW9uICgpIHtcclxuXHRcdGlmICh0aGlzLm9wdGlvbnMucmlzZU9uSG92ZXIpIHtcclxuXHRcdFx0TC5Eb21FdmVudFxyXG5cdFx0XHQgICAgLm9mZih0aGlzLl9pY29uLCAnbW91c2VvdmVyJywgdGhpcy5fYnJpbmdUb0Zyb250KVxyXG5cdFx0XHQgICAgLm9mZih0aGlzLl9pY29uLCAnbW91c2VvdXQnLCB0aGlzLl9yZXNldFpJbmRleCk7XHJcblx0XHR9XHJcblxyXG5cdFx0dGhpcy5fbWFwLl9wYW5lcy5tYXJrZXJQYW5lLnJlbW92ZUNoaWxkKHRoaXMuX2ljb24pO1xyXG5cclxuXHRcdHRoaXMuX2ljb24gPSBudWxsO1xyXG5cdH0sXHJcblxyXG5cdF9yZW1vdmVTaGFkb3c6IGZ1bmN0aW9uICgpIHtcclxuXHRcdGlmICh0aGlzLl9zaGFkb3cpIHtcclxuXHRcdFx0dGhpcy5fbWFwLl9wYW5lcy5zaGFkb3dQYW5lLnJlbW92ZUNoaWxkKHRoaXMuX3NoYWRvdyk7XHJcblx0XHR9XHJcblx0XHR0aGlzLl9zaGFkb3cgPSBudWxsO1xyXG5cdH0sXHJcblxyXG5cdF9zZXRQb3M6IGZ1bmN0aW9uIChwb3MpIHtcclxuXHRcdEwuRG9tVXRpbC5zZXRQb3NpdGlvbih0aGlzLl9pY29uLCBwb3MpO1xyXG5cclxuXHRcdGlmICh0aGlzLl9zaGFkb3cpIHtcclxuXHRcdFx0TC5Eb21VdGlsLnNldFBvc2l0aW9uKHRoaXMuX3NoYWRvdywgcG9zKTtcclxuXHRcdH1cclxuXHJcblx0XHR0aGlzLl96SW5kZXggPSBwb3MueSArIHRoaXMub3B0aW9ucy56SW5kZXhPZmZzZXQ7XHJcblxyXG5cdFx0dGhpcy5fcmVzZXRaSW5kZXgoKTtcclxuXHR9LFxyXG5cclxuXHRfdXBkYXRlWkluZGV4OiBmdW5jdGlvbiAob2Zmc2V0KSB7XHJcblx0XHR0aGlzLl9pY29uLnN0eWxlLnpJbmRleCA9IHRoaXMuX3pJbmRleCArIG9mZnNldDtcclxuXHR9LFxyXG5cclxuXHRfYW5pbWF0ZVpvb206IGZ1bmN0aW9uIChvcHQpIHtcclxuXHRcdHZhciBwb3MgPSB0aGlzLl9tYXAuX2xhdExuZ1RvTmV3TGF5ZXJQb2ludCh0aGlzLl9sYXRsbmcsIG9wdC56b29tLCBvcHQuY2VudGVyKS5yb3VuZCgpO1xyXG5cclxuXHRcdHRoaXMuX3NldFBvcyhwb3MpO1xyXG5cdH0sXHJcblxyXG5cdF9pbml0SW50ZXJhY3Rpb246IGZ1bmN0aW9uICgpIHtcclxuXHJcblx0XHRpZiAoIXRoaXMub3B0aW9ucy5jbGlja2FibGUpIHsgcmV0dXJuOyB9XHJcblxyXG5cdFx0Ly8gVE9ETyByZWZhY3RvciBpbnRvIHNvbWV0aGluZyBzaGFyZWQgd2l0aCBNYXAvUGF0aC9ldGMuIHRvIERSWSBpdCB1cFxyXG5cclxuXHRcdHZhciBpY29uID0gdGhpcy5faWNvbixcclxuXHRcdCAgICBldmVudHMgPSBbJ2RibGNsaWNrJywgJ21vdXNlZG93bicsICdtb3VzZW92ZXInLCAnbW91c2VvdXQnLCAnY29udGV4dG1lbnUnXTtcclxuXHJcblx0XHRMLkRvbVV0aWwuYWRkQ2xhc3MoaWNvbiwgJ2xlYWZsZXQtY2xpY2thYmxlJyk7XHJcblx0XHRMLkRvbUV2ZW50Lm9uKGljb24sICdjbGljaycsIHRoaXMuX29uTW91c2VDbGljaywgdGhpcyk7XHJcblx0XHRMLkRvbUV2ZW50Lm9uKGljb24sICdrZXlwcmVzcycsIHRoaXMuX29uS2V5UHJlc3MsIHRoaXMpO1xyXG5cclxuXHRcdGZvciAodmFyIGkgPSAwOyBpIDwgZXZlbnRzLmxlbmd0aDsgaSsrKSB7XHJcblx0XHRcdEwuRG9tRXZlbnQub24oaWNvbiwgZXZlbnRzW2ldLCB0aGlzLl9maXJlTW91c2VFdmVudCwgdGhpcyk7XHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKEwuSGFuZGxlci5NYXJrZXJEcmFnKSB7XHJcblx0XHRcdHRoaXMuZHJhZ2dpbmcgPSBuZXcgTC5IYW5kbGVyLk1hcmtlckRyYWcodGhpcyk7XHJcblxyXG5cdFx0XHRpZiAodGhpcy5vcHRpb25zLmRyYWdnYWJsZSkge1xyXG5cdFx0XHRcdHRoaXMuZHJhZ2dpbmcuZW5hYmxlKCk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9LFxyXG5cclxuXHRfb25Nb3VzZUNsaWNrOiBmdW5jdGlvbiAoZSkge1xyXG5cdFx0dmFyIHdhc0RyYWdnZWQgPSB0aGlzLmRyYWdnaW5nICYmIHRoaXMuZHJhZ2dpbmcubW92ZWQoKTtcclxuXHJcblx0XHRpZiAodGhpcy5oYXNFdmVudExpc3RlbmVycyhlLnR5cGUpIHx8IHdhc0RyYWdnZWQpIHtcclxuXHRcdFx0TC5Eb21FdmVudC5zdG9wUHJvcGFnYXRpb24oZSk7XHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKHdhc0RyYWdnZWQpIHsgcmV0dXJuOyB9XHJcblxyXG5cdFx0aWYgKCghdGhpcy5kcmFnZ2luZyB8fCAhdGhpcy5kcmFnZ2luZy5fZW5hYmxlZCkgJiYgdGhpcy5fbWFwLmRyYWdnaW5nICYmIHRoaXMuX21hcC5kcmFnZ2luZy5tb3ZlZCgpKSB7IHJldHVybjsgfVxyXG5cclxuXHRcdHRoaXMuZmlyZShlLnR5cGUsIHtcclxuXHRcdFx0b3JpZ2luYWxFdmVudDogZSxcclxuXHRcdFx0bGF0bG5nOiB0aGlzLl9sYXRsbmdcclxuXHRcdH0pO1xyXG5cdH0sXHJcblxyXG5cdF9vbktleVByZXNzOiBmdW5jdGlvbiAoZSkge1xyXG5cdFx0aWYgKGUua2V5Q29kZSA9PT0gMTMpIHtcclxuXHRcdFx0dGhpcy5maXJlKCdjbGljaycsIHtcclxuXHRcdFx0XHRvcmlnaW5hbEV2ZW50OiBlLFxyXG5cdFx0XHRcdGxhdGxuZzogdGhpcy5fbGF0bG5nXHJcblx0XHRcdH0pO1xyXG5cdFx0fVxyXG5cdH0sXHJcblxyXG5cdF9maXJlTW91c2VFdmVudDogZnVuY3Rpb24gKGUpIHtcclxuXHJcblx0XHR0aGlzLmZpcmUoZS50eXBlLCB7XHJcblx0XHRcdG9yaWdpbmFsRXZlbnQ6IGUsXHJcblx0XHRcdGxhdGxuZzogdGhpcy5fbGF0bG5nXHJcblx0XHR9KTtcclxuXHJcblx0XHQvLyBUT0RPIHByb3BlciBjdXN0b20gZXZlbnQgcHJvcGFnYXRpb25cclxuXHRcdC8vIHRoaXMgbGluZSB3aWxsIGFsd2F5cyBiZSBjYWxsZWQgaWYgbWFya2VyIGlzIGluIGEgRmVhdHVyZUdyb3VwXHJcblx0XHRpZiAoZS50eXBlID09PSAnY29udGV4dG1lbnUnICYmIHRoaXMuaGFzRXZlbnRMaXN0ZW5lcnMoZS50eXBlKSkge1xyXG5cdFx0XHRMLkRvbUV2ZW50LnByZXZlbnREZWZhdWx0KGUpO1xyXG5cdFx0fVxyXG5cdFx0aWYgKGUudHlwZSAhPT0gJ21vdXNlZG93bicpIHtcclxuXHRcdFx0TC5Eb21FdmVudC5zdG9wUHJvcGFnYXRpb24oZSk7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRMLkRvbUV2ZW50LnByZXZlbnREZWZhdWx0KGUpO1xyXG5cdFx0fVxyXG5cdH0sXHJcblxyXG5cdHNldE9wYWNpdHk6IGZ1bmN0aW9uIChvcGFjaXR5KSB7XHJcblx0XHR0aGlzLm9wdGlvbnMub3BhY2l0eSA9IG9wYWNpdHk7XHJcblx0XHRpZiAodGhpcy5fbWFwKSB7XHJcblx0XHRcdHRoaXMuX3VwZGF0ZU9wYWNpdHkoKTtcclxuXHRcdH1cclxuXHJcblx0XHRyZXR1cm4gdGhpcztcclxuXHR9LFxyXG5cclxuXHRfdXBkYXRlT3BhY2l0eTogZnVuY3Rpb24gKCkge1xyXG5cdFx0TC5Eb21VdGlsLnNldE9wYWNpdHkodGhpcy5faWNvbiwgdGhpcy5vcHRpb25zLm9wYWNpdHkpO1xyXG5cdFx0aWYgKHRoaXMuX3NoYWRvdykge1xyXG5cdFx0XHRMLkRvbVV0aWwuc2V0T3BhY2l0eSh0aGlzLl9zaGFkb3csIHRoaXMub3B0aW9ucy5vcGFjaXR5KTtcclxuXHRcdH1cclxuXHR9LFxyXG5cclxuXHRfYnJpbmdUb0Zyb250OiBmdW5jdGlvbiAoKSB7XHJcblx0XHR0aGlzLl91cGRhdGVaSW5kZXgodGhpcy5vcHRpb25zLnJpc2VPZmZzZXQpO1xyXG5cdH0sXHJcblxyXG5cdF9yZXNldFpJbmRleDogZnVuY3Rpb24gKCkge1xyXG5cdFx0dGhpcy5fdXBkYXRlWkluZGV4KDApO1xyXG5cdH1cclxufSk7XHJcblxyXG5MLm1hcmtlciA9IGZ1bmN0aW9uIChsYXRsbmcsIG9wdGlvbnMpIHtcclxuXHRyZXR1cm4gbmV3IEwuTWFya2VyKGxhdGxuZywgb3B0aW9ucyk7XHJcbn07XHJcblxuXG4vKlxuICogTC5EaXZJY29uIGlzIGEgbGlnaHR3ZWlnaHQgSFRNTC1iYXNlZCBpY29uIGNsYXNzIChhcyBvcHBvc2VkIHRvIHRoZSBpbWFnZS1iYXNlZCBMLkljb24pXG4gKiB0byB1c2Ugd2l0aCBMLk1hcmtlci5cbiAqL1xuXG5MLkRpdkljb24gPSBMLkljb24uZXh0ZW5kKHtcblx0b3B0aW9uczoge1xuXHRcdGljb25TaXplOiBbMTIsIDEyXSwgLy8gYWxzbyBjYW4gYmUgc2V0IHRocm91Z2ggQ1NTXG5cdFx0Lypcblx0XHRpY29uQW5jaG9yOiAoUG9pbnQpXG5cdFx0cG9wdXBBbmNob3I6IChQb2ludClcblx0XHRodG1sOiAoU3RyaW5nKVxuXHRcdGJnUG9zOiAoUG9pbnQpXG5cdFx0Ki9cblx0XHRjbGFzc05hbWU6ICdsZWFmbGV0LWRpdi1pY29uJyxcblx0XHRodG1sOiBmYWxzZVxuXHR9LFxuXG5cdGNyZWF0ZUljb246IGZ1bmN0aW9uIChvbGRJY29uKSB7XG5cdFx0dmFyIGRpdiA9IChvbGRJY29uICYmIG9sZEljb24udGFnTmFtZSA9PT0gJ0RJVicpID8gb2xkSWNvbiA6IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpLFxuXHRcdCAgICBvcHRpb25zID0gdGhpcy5vcHRpb25zO1xuXG5cdFx0aWYgKG9wdGlvbnMuaHRtbCAhPT0gZmFsc2UpIHtcblx0XHRcdGRpdi5pbm5lckhUTUwgPSBvcHRpb25zLmh0bWw7XG5cdFx0fSBlbHNlIHtcblx0XHRcdGRpdi5pbm5lckhUTUwgPSAnJztcblx0XHR9XG5cblx0XHRpZiAob3B0aW9ucy5iZ1Bvcykge1xuXHRcdFx0ZGl2LnN0eWxlLmJhY2tncm91bmRQb3NpdGlvbiA9XG5cdFx0XHQgICAgICAgICgtb3B0aW9ucy5iZ1Bvcy54KSArICdweCAnICsgKC1vcHRpb25zLmJnUG9zLnkpICsgJ3B4Jztcblx0XHR9XG5cblx0XHR0aGlzLl9zZXRJY29uU3R5bGVzKGRpdiwgJ2ljb24nKTtcblx0XHRyZXR1cm4gZGl2O1xuXHR9LFxuXG5cdGNyZWF0ZVNoYWRvdzogZnVuY3Rpb24gKCkge1xuXHRcdHJldHVybiBudWxsO1xuXHR9XG59KTtcblxuTC5kaXZJY29uID0gZnVuY3Rpb24gKG9wdGlvbnMpIHtcblx0cmV0dXJuIG5ldyBMLkRpdkljb24ob3B0aW9ucyk7XG59O1xuXG5cbi8qXHJcbiAqIEwuUG9wdXAgaXMgdXNlZCBmb3IgZGlzcGxheWluZyBwb3B1cHMgb24gdGhlIG1hcC5cclxuICovXHJcblxyXG5MLk1hcC5tZXJnZU9wdGlvbnMoe1xyXG5cdGNsb3NlUG9wdXBPbkNsaWNrOiB0cnVlXHJcbn0pO1xyXG5cclxuTC5Qb3B1cCA9IEwuQ2xhc3MuZXh0ZW5kKHtcclxuXHRpbmNsdWRlczogTC5NaXhpbi5FdmVudHMsXHJcblxyXG5cdG9wdGlvbnM6IHtcclxuXHRcdG1pbldpZHRoOiA1MCxcclxuXHRcdG1heFdpZHRoOiAzMDAsXHJcblx0XHQvLyBtYXhIZWlnaHQ6IG51bGwsXHJcblx0XHRhdXRvUGFuOiB0cnVlLFxyXG5cdFx0Y2xvc2VCdXR0b246IHRydWUsXHJcblx0XHRvZmZzZXQ6IFswLCA3XSxcclxuXHRcdGF1dG9QYW5QYWRkaW5nOiBbNSwgNV0sXHJcblx0XHQvLyBhdXRvUGFuUGFkZGluZ1RvcExlZnQ6IG51bGwsXHJcblx0XHQvLyBhdXRvUGFuUGFkZGluZ0JvdHRvbVJpZ2h0OiBudWxsLFxyXG5cdFx0a2VlcEluVmlldzogZmFsc2UsXHJcblx0XHRjbGFzc05hbWU6ICcnLFxyXG5cdFx0em9vbUFuaW1hdGlvbjogdHJ1ZVxyXG5cdH0sXHJcblxyXG5cdGluaXRpYWxpemU6IGZ1bmN0aW9uIChvcHRpb25zLCBzb3VyY2UpIHtcclxuXHRcdEwuc2V0T3B0aW9ucyh0aGlzLCBvcHRpb25zKTtcclxuXHJcblx0XHR0aGlzLl9zb3VyY2UgPSBzb3VyY2U7XHJcblx0XHR0aGlzLl9hbmltYXRlZCA9IEwuQnJvd3Nlci5hbnkzZCAmJiB0aGlzLm9wdGlvbnMuem9vbUFuaW1hdGlvbjtcclxuXHRcdHRoaXMuX2lzT3BlbiA9IGZhbHNlO1xyXG5cdH0sXHJcblxyXG5cdG9uQWRkOiBmdW5jdGlvbiAobWFwKSB7XHJcblx0XHR0aGlzLl9tYXAgPSBtYXA7XHJcblxyXG5cdFx0aWYgKCF0aGlzLl9jb250YWluZXIpIHtcclxuXHRcdFx0dGhpcy5faW5pdExheW91dCgpO1xyXG5cdFx0fVxyXG5cclxuXHRcdHZhciBhbmltRmFkZSA9IG1hcC5vcHRpb25zLmZhZGVBbmltYXRpb247XHJcblxyXG5cdFx0aWYgKGFuaW1GYWRlKSB7XHJcblx0XHRcdEwuRG9tVXRpbC5zZXRPcGFjaXR5KHRoaXMuX2NvbnRhaW5lciwgMCk7XHJcblx0XHR9XHJcblx0XHRtYXAuX3BhbmVzLnBvcHVwUGFuZS5hcHBlbmRDaGlsZCh0aGlzLl9jb250YWluZXIpO1xyXG5cclxuXHRcdG1hcC5vbih0aGlzLl9nZXRFdmVudHMoKSwgdGhpcyk7XHJcblxyXG5cdFx0dGhpcy51cGRhdGUoKTtcclxuXHJcblx0XHRpZiAoYW5pbUZhZGUpIHtcclxuXHRcdFx0TC5Eb21VdGlsLnNldE9wYWNpdHkodGhpcy5fY29udGFpbmVyLCAxKTtcclxuXHRcdH1cclxuXHJcblx0XHR0aGlzLmZpcmUoJ29wZW4nKTtcclxuXHJcblx0XHRtYXAuZmlyZSgncG9wdXBvcGVuJywge3BvcHVwOiB0aGlzfSk7XHJcblxyXG5cdFx0aWYgKHRoaXMuX3NvdXJjZSkge1xyXG5cdFx0XHR0aGlzLl9zb3VyY2UuZmlyZSgncG9wdXBvcGVuJywge3BvcHVwOiB0aGlzfSk7XHJcblx0XHR9XHJcblx0fSxcclxuXHJcblx0YWRkVG86IGZ1bmN0aW9uIChtYXApIHtcclxuXHRcdG1hcC5hZGRMYXllcih0aGlzKTtcclxuXHRcdHJldHVybiB0aGlzO1xyXG5cdH0sXHJcblxyXG5cdG9wZW5PbjogZnVuY3Rpb24gKG1hcCkge1xyXG5cdFx0bWFwLm9wZW5Qb3B1cCh0aGlzKTtcclxuXHRcdHJldHVybiB0aGlzO1xyXG5cdH0sXHJcblxyXG5cdG9uUmVtb3ZlOiBmdW5jdGlvbiAobWFwKSB7XHJcblx0XHRtYXAuX3BhbmVzLnBvcHVwUGFuZS5yZW1vdmVDaGlsZCh0aGlzLl9jb250YWluZXIpO1xyXG5cclxuXHRcdEwuVXRpbC5mYWxzZUZuKHRoaXMuX2NvbnRhaW5lci5vZmZzZXRXaWR0aCk7IC8vIGZvcmNlIHJlZmxvd1xyXG5cclxuXHRcdG1hcC5vZmYodGhpcy5fZ2V0RXZlbnRzKCksIHRoaXMpO1xyXG5cclxuXHRcdGlmIChtYXAub3B0aW9ucy5mYWRlQW5pbWF0aW9uKSB7XHJcblx0XHRcdEwuRG9tVXRpbC5zZXRPcGFjaXR5KHRoaXMuX2NvbnRhaW5lciwgMCk7XHJcblx0XHR9XHJcblxyXG5cdFx0dGhpcy5fbWFwID0gbnVsbDtcclxuXHJcblx0XHR0aGlzLmZpcmUoJ2Nsb3NlJyk7XHJcblxyXG5cdFx0bWFwLmZpcmUoJ3BvcHVwY2xvc2UnLCB7cG9wdXA6IHRoaXN9KTtcclxuXHJcblx0XHRpZiAodGhpcy5fc291cmNlKSB7XHJcblx0XHRcdHRoaXMuX3NvdXJjZS5maXJlKCdwb3B1cGNsb3NlJywge3BvcHVwOiB0aGlzfSk7XHJcblx0XHR9XHJcblx0fSxcclxuXHJcblx0Z2V0TGF0TG5nOiBmdW5jdGlvbiAoKSB7XHJcblx0XHRyZXR1cm4gdGhpcy5fbGF0bG5nO1xyXG5cdH0sXHJcblxyXG5cdHNldExhdExuZzogZnVuY3Rpb24gKGxhdGxuZykge1xyXG5cdFx0dGhpcy5fbGF0bG5nID0gTC5sYXRMbmcobGF0bG5nKTtcclxuXHRcdGlmICh0aGlzLl9tYXApIHtcclxuXHRcdFx0dGhpcy5fdXBkYXRlUG9zaXRpb24oKTtcclxuXHRcdFx0dGhpcy5fYWRqdXN0UGFuKCk7XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gdGhpcztcclxuXHR9LFxyXG5cclxuXHRnZXRDb250ZW50OiBmdW5jdGlvbiAoKSB7XHJcblx0XHRyZXR1cm4gdGhpcy5fY29udGVudDtcclxuXHR9LFxyXG5cclxuXHRzZXRDb250ZW50OiBmdW5jdGlvbiAoY29udGVudCkge1xyXG5cdFx0dGhpcy5fY29udGVudCA9IGNvbnRlbnQ7XHJcblx0XHR0aGlzLnVwZGF0ZSgpO1xyXG5cdFx0cmV0dXJuIHRoaXM7XHJcblx0fSxcclxuXHJcblx0dXBkYXRlOiBmdW5jdGlvbiAoKSB7XHJcblx0XHRpZiAoIXRoaXMuX21hcCkgeyByZXR1cm47IH1cclxuXHJcblx0XHR0aGlzLl9jb250YWluZXIuc3R5bGUudmlzaWJpbGl0eSA9ICdoaWRkZW4nO1xyXG5cclxuXHRcdHRoaXMuX3VwZGF0ZUNvbnRlbnQoKTtcclxuXHRcdHRoaXMuX3VwZGF0ZUxheW91dCgpO1xyXG5cdFx0dGhpcy5fdXBkYXRlUG9zaXRpb24oKTtcclxuXHJcblx0XHR0aGlzLl9jb250YWluZXIuc3R5bGUudmlzaWJpbGl0eSA9ICcnO1xyXG5cclxuXHRcdHRoaXMuX2FkanVzdFBhbigpO1xyXG5cdH0sXHJcblxyXG5cdF9nZXRFdmVudHM6IGZ1bmN0aW9uICgpIHtcclxuXHRcdHZhciBldmVudHMgPSB7XHJcblx0XHRcdHZpZXdyZXNldDogdGhpcy5fdXBkYXRlUG9zaXRpb25cclxuXHRcdH07XHJcblxyXG5cdFx0aWYgKHRoaXMuX2FuaW1hdGVkKSB7XHJcblx0XHRcdGV2ZW50cy56b29tYW5pbSA9IHRoaXMuX3pvb21BbmltYXRpb247XHJcblx0XHR9XHJcblx0XHRpZiAoJ2Nsb3NlT25DbGljaycgaW4gdGhpcy5vcHRpb25zID8gdGhpcy5vcHRpb25zLmNsb3NlT25DbGljayA6IHRoaXMuX21hcC5vcHRpb25zLmNsb3NlUG9wdXBPbkNsaWNrKSB7XHJcblx0XHRcdGV2ZW50cy5wcmVjbGljayA9IHRoaXMuX2Nsb3NlO1xyXG5cdFx0fVxyXG5cdFx0aWYgKHRoaXMub3B0aW9ucy5rZWVwSW5WaWV3KSB7XHJcblx0XHRcdGV2ZW50cy5tb3ZlZW5kID0gdGhpcy5fYWRqdXN0UGFuO1xyXG5cdFx0fVxyXG5cclxuXHRcdHJldHVybiBldmVudHM7XHJcblx0fSxcclxuXHJcblx0X2Nsb3NlOiBmdW5jdGlvbiAoKSB7XHJcblx0XHRpZiAodGhpcy5fbWFwKSB7XHJcblx0XHRcdHRoaXMuX21hcC5jbG9zZVBvcHVwKHRoaXMpO1xyXG5cdFx0fVxyXG5cdH0sXHJcblxyXG5cdF9pbml0TGF5b3V0OiBmdW5jdGlvbiAoKSB7XHJcblx0XHR2YXIgcHJlZml4ID0gJ2xlYWZsZXQtcG9wdXAnLFxyXG5cdFx0XHRjb250YWluZXJDbGFzcyA9IHByZWZpeCArICcgJyArIHRoaXMub3B0aW9ucy5jbGFzc05hbWUgKyAnIGxlYWZsZXQtem9vbS0nICtcclxuXHRcdFx0ICAgICAgICAodGhpcy5fYW5pbWF0ZWQgPyAnYW5pbWF0ZWQnIDogJ2hpZGUnKSxcclxuXHRcdFx0Y29udGFpbmVyID0gdGhpcy5fY29udGFpbmVyID0gTC5Eb21VdGlsLmNyZWF0ZSgnZGl2JywgY29udGFpbmVyQ2xhc3MpLFxyXG5cdFx0XHRjbG9zZUJ1dHRvbjtcclxuXHJcblx0XHRpZiAodGhpcy5vcHRpb25zLmNsb3NlQnV0dG9uKSB7XHJcblx0XHRcdGNsb3NlQnV0dG9uID0gdGhpcy5fY2xvc2VCdXR0b24gPVxyXG5cdFx0XHQgICAgICAgIEwuRG9tVXRpbC5jcmVhdGUoJ2EnLCBwcmVmaXggKyAnLWNsb3NlLWJ1dHRvbicsIGNvbnRhaW5lcik7XHJcblx0XHRcdGNsb3NlQnV0dG9uLmhyZWYgPSAnI2Nsb3NlJztcclxuXHRcdFx0Y2xvc2VCdXR0b24uaW5uZXJIVE1MID0gJyYjMjE1Oyc7XHJcblx0XHRcdEwuRG9tRXZlbnQuZGlzYWJsZUNsaWNrUHJvcGFnYXRpb24oY2xvc2VCdXR0b24pO1xyXG5cclxuXHRcdFx0TC5Eb21FdmVudC5vbihjbG9zZUJ1dHRvbiwgJ2NsaWNrJywgdGhpcy5fb25DbG9zZUJ1dHRvbkNsaWNrLCB0aGlzKTtcclxuXHRcdH1cclxuXHJcblx0XHR2YXIgd3JhcHBlciA9IHRoaXMuX3dyYXBwZXIgPVxyXG5cdFx0ICAgICAgICBMLkRvbVV0aWwuY3JlYXRlKCdkaXYnLCBwcmVmaXggKyAnLWNvbnRlbnQtd3JhcHBlcicsIGNvbnRhaW5lcik7XHJcblx0XHRMLkRvbUV2ZW50LmRpc2FibGVDbGlja1Byb3BhZ2F0aW9uKHdyYXBwZXIpO1xyXG5cclxuXHRcdHRoaXMuX2NvbnRlbnROb2RlID0gTC5Eb21VdGlsLmNyZWF0ZSgnZGl2JywgcHJlZml4ICsgJy1jb250ZW50Jywgd3JhcHBlcik7XHJcblxyXG5cdFx0TC5Eb21FdmVudC5kaXNhYmxlU2Nyb2xsUHJvcGFnYXRpb24odGhpcy5fY29udGVudE5vZGUpO1xyXG5cdFx0TC5Eb21FdmVudC5vbih3cmFwcGVyLCAnY29udGV4dG1lbnUnLCBMLkRvbUV2ZW50LnN0b3BQcm9wYWdhdGlvbik7XHJcblxyXG5cdFx0dGhpcy5fdGlwQ29udGFpbmVyID0gTC5Eb21VdGlsLmNyZWF0ZSgnZGl2JywgcHJlZml4ICsgJy10aXAtY29udGFpbmVyJywgY29udGFpbmVyKTtcclxuXHRcdHRoaXMuX3RpcCA9IEwuRG9tVXRpbC5jcmVhdGUoJ2RpdicsIHByZWZpeCArICctdGlwJywgdGhpcy5fdGlwQ29udGFpbmVyKTtcclxuXHR9LFxyXG5cclxuXHRfdXBkYXRlQ29udGVudDogZnVuY3Rpb24gKCkge1xyXG5cdFx0aWYgKCF0aGlzLl9jb250ZW50KSB7IHJldHVybjsgfVxyXG5cclxuXHRcdGlmICh0eXBlb2YgdGhpcy5fY29udGVudCA9PT0gJ3N0cmluZycpIHtcclxuXHRcdFx0dGhpcy5fY29udGVudE5vZGUuaW5uZXJIVE1MID0gdGhpcy5fY29udGVudDtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdHdoaWxlICh0aGlzLl9jb250ZW50Tm9kZS5oYXNDaGlsZE5vZGVzKCkpIHtcclxuXHRcdFx0XHR0aGlzLl9jb250ZW50Tm9kZS5yZW1vdmVDaGlsZCh0aGlzLl9jb250ZW50Tm9kZS5maXJzdENoaWxkKTtcclxuXHRcdFx0fVxyXG5cdFx0XHR0aGlzLl9jb250ZW50Tm9kZS5hcHBlbmRDaGlsZCh0aGlzLl9jb250ZW50KTtcclxuXHRcdH1cclxuXHRcdHRoaXMuZmlyZSgnY29udGVudHVwZGF0ZScpO1xyXG5cdH0sXHJcblxyXG5cdF91cGRhdGVMYXlvdXQ6IGZ1bmN0aW9uICgpIHtcclxuXHRcdHZhciBjb250YWluZXIgPSB0aGlzLl9jb250ZW50Tm9kZSxcclxuXHRcdCAgICBzdHlsZSA9IGNvbnRhaW5lci5zdHlsZTtcclxuXHJcblx0XHRzdHlsZS53aWR0aCA9ICcnO1xyXG5cdFx0c3R5bGUud2hpdGVTcGFjZSA9ICdub3dyYXAnO1xyXG5cclxuXHRcdHZhciB3aWR0aCA9IGNvbnRhaW5lci5vZmZzZXRXaWR0aDtcclxuXHRcdHdpZHRoID0gTWF0aC5taW4od2lkdGgsIHRoaXMub3B0aW9ucy5tYXhXaWR0aCk7XHJcblx0XHR3aWR0aCA9IE1hdGgubWF4KHdpZHRoLCB0aGlzLm9wdGlvbnMubWluV2lkdGgpO1xyXG5cclxuXHRcdHN0eWxlLndpZHRoID0gKHdpZHRoICsgMSkgKyAncHgnO1xyXG5cdFx0c3R5bGUud2hpdGVTcGFjZSA9ICcnO1xyXG5cclxuXHRcdHN0eWxlLmhlaWdodCA9ICcnO1xyXG5cclxuXHRcdHZhciBoZWlnaHQgPSBjb250YWluZXIub2Zmc2V0SGVpZ2h0LFxyXG5cdFx0ICAgIG1heEhlaWdodCA9IHRoaXMub3B0aW9ucy5tYXhIZWlnaHQsXHJcblx0XHQgICAgc2Nyb2xsZWRDbGFzcyA9ICdsZWFmbGV0LXBvcHVwLXNjcm9sbGVkJztcclxuXHJcblx0XHRpZiAobWF4SGVpZ2h0ICYmIGhlaWdodCA+IG1heEhlaWdodCkge1xyXG5cdFx0XHRzdHlsZS5oZWlnaHQgPSBtYXhIZWlnaHQgKyAncHgnO1xyXG5cdFx0XHRMLkRvbVV0aWwuYWRkQ2xhc3MoY29udGFpbmVyLCBzY3JvbGxlZENsYXNzKTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdEwuRG9tVXRpbC5yZW1vdmVDbGFzcyhjb250YWluZXIsIHNjcm9sbGVkQ2xhc3MpO1xyXG5cdFx0fVxyXG5cclxuXHRcdHRoaXMuX2NvbnRhaW5lcldpZHRoID0gdGhpcy5fY29udGFpbmVyLm9mZnNldFdpZHRoO1xyXG5cdH0sXHJcblxyXG5cdF91cGRhdGVQb3NpdGlvbjogZnVuY3Rpb24gKCkge1xyXG5cdFx0aWYgKCF0aGlzLl9tYXApIHsgcmV0dXJuOyB9XHJcblxyXG5cdFx0dmFyIHBvcyA9IHRoaXMuX21hcC5sYXRMbmdUb0xheWVyUG9pbnQodGhpcy5fbGF0bG5nKSxcclxuXHRcdCAgICBhbmltYXRlZCA9IHRoaXMuX2FuaW1hdGVkLFxyXG5cdFx0ICAgIG9mZnNldCA9IEwucG9pbnQodGhpcy5vcHRpb25zLm9mZnNldCk7XHJcblxyXG5cdFx0aWYgKGFuaW1hdGVkKSB7XHJcblx0XHRcdEwuRG9tVXRpbC5zZXRQb3NpdGlvbih0aGlzLl9jb250YWluZXIsIHBvcyk7XHJcblx0XHR9XHJcblxyXG5cdFx0dGhpcy5fY29udGFpbmVyQm90dG9tID0gLW9mZnNldC55IC0gKGFuaW1hdGVkID8gMCA6IHBvcy55KTtcclxuXHRcdHRoaXMuX2NvbnRhaW5lckxlZnQgPSAtTWF0aC5yb3VuZCh0aGlzLl9jb250YWluZXJXaWR0aCAvIDIpICsgb2Zmc2V0LnggKyAoYW5pbWF0ZWQgPyAwIDogcG9zLngpO1xyXG5cclxuXHRcdC8vIGJvdHRvbSBwb3NpdGlvbiB0aGUgcG9wdXAgaW4gY2FzZSB0aGUgaGVpZ2h0IG9mIHRoZSBwb3B1cCBjaGFuZ2VzIChpbWFnZXMgbG9hZGluZyBldGMpXHJcblx0XHR0aGlzLl9jb250YWluZXIuc3R5bGUuYm90dG9tID0gdGhpcy5fY29udGFpbmVyQm90dG9tICsgJ3B4JztcclxuXHRcdHRoaXMuX2NvbnRhaW5lci5zdHlsZS5sZWZ0ID0gdGhpcy5fY29udGFpbmVyTGVmdCArICdweCc7XHJcblx0fSxcclxuXHJcblx0X3pvb21BbmltYXRpb246IGZ1bmN0aW9uIChvcHQpIHtcclxuXHRcdHZhciBwb3MgPSB0aGlzLl9tYXAuX2xhdExuZ1RvTmV3TGF5ZXJQb2ludCh0aGlzLl9sYXRsbmcsIG9wdC56b29tLCBvcHQuY2VudGVyKTtcclxuXHJcblx0XHRMLkRvbVV0aWwuc2V0UG9zaXRpb24odGhpcy5fY29udGFpbmVyLCBwb3MpO1xyXG5cdH0sXHJcblxyXG5cdF9hZGp1c3RQYW46IGZ1bmN0aW9uICgpIHtcclxuXHRcdGlmICghdGhpcy5vcHRpb25zLmF1dG9QYW4pIHsgcmV0dXJuOyB9XHJcblxyXG5cdFx0dmFyIG1hcCA9IHRoaXMuX21hcCxcclxuXHRcdCAgICBjb250YWluZXJIZWlnaHQgPSB0aGlzLl9jb250YWluZXIub2Zmc2V0SGVpZ2h0LFxyXG5cdFx0ICAgIGNvbnRhaW5lcldpZHRoID0gdGhpcy5fY29udGFpbmVyV2lkdGgsXHJcblxyXG5cdFx0ICAgIGxheWVyUG9zID0gbmV3IEwuUG9pbnQodGhpcy5fY29udGFpbmVyTGVmdCwgLWNvbnRhaW5lckhlaWdodCAtIHRoaXMuX2NvbnRhaW5lckJvdHRvbSk7XHJcblxyXG5cdFx0aWYgKHRoaXMuX2FuaW1hdGVkKSB7XHJcblx0XHRcdGxheWVyUG9zLl9hZGQoTC5Eb21VdGlsLmdldFBvc2l0aW9uKHRoaXMuX2NvbnRhaW5lcikpO1xyXG5cdFx0fVxyXG5cclxuXHRcdHZhciBjb250YWluZXJQb3MgPSBtYXAubGF5ZXJQb2ludFRvQ29udGFpbmVyUG9pbnQobGF5ZXJQb3MpLFxyXG5cdFx0ICAgIHBhZGRpbmcgPSBMLnBvaW50KHRoaXMub3B0aW9ucy5hdXRvUGFuUGFkZGluZyksXHJcblx0XHQgICAgcGFkZGluZ1RMID0gTC5wb2ludCh0aGlzLm9wdGlvbnMuYXV0b1BhblBhZGRpbmdUb3BMZWZ0IHx8IHBhZGRpbmcpLFxyXG5cdFx0ICAgIHBhZGRpbmdCUiA9IEwucG9pbnQodGhpcy5vcHRpb25zLmF1dG9QYW5QYWRkaW5nQm90dG9tUmlnaHQgfHwgcGFkZGluZyksXHJcblx0XHQgICAgc2l6ZSA9IG1hcC5nZXRTaXplKCksXHJcblx0XHQgICAgZHggPSAwLFxyXG5cdFx0ICAgIGR5ID0gMDtcclxuXHJcblx0XHRpZiAoY29udGFpbmVyUG9zLnggKyBjb250YWluZXJXaWR0aCArIHBhZGRpbmdCUi54ID4gc2l6ZS54KSB7IC8vIHJpZ2h0XHJcblx0XHRcdGR4ID0gY29udGFpbmVyUG9zLnggKyBjb250YWluZXJXaWR0aCAtIHNpemUueCArIHBhZGRpbmdCUi54O1xyXG5cdFx0fVxyXG5cdFx0aWYgKGNvbnRhaW5lclBvcy54IC0gZHggLSBwYWRkaW5nVEwueCA8IDApIHsgLy8gbGVmdFxyXG5cdFx0XHRkeCA9IGNvbnRhaW5lclBvcy54IC0gcGFkZGluZ1RMLng7XHJcblx0XHR9XHJcblx0XHRpZiAoY29udGFpbmVyUG9zLnkgKyBjb250YWluZXJIZWlnaHQgKyBwYWRkaW5nQlIueSA+IHNpemUueSkgeyAvLyBib3R0b21cclxuXHRcdFx0ZHkgPSBjb250YWluZXJQb3MueSArIGNvbnRhaW5lckhlaWdodCAtIHNpemUueSArIHBhZGRpbmdCUi55O1xyXG5cdFx0fVxyXG5cdFx0aWYgKGNvbnRhaW5lclBvcy55IC0gZHkgLSBwYWRkaW5nVEwueSA8IDApIHsgLy8gdG9wXHJcblx0XHRcdGR5ID0gY29udGFpbmVyUG9zLnkgLSBwYWRkaW5nVEwueTtcclxuXHRcdH1cclxuXHJcblx0XHRpZiAoZHggfHwgZHkpIHtcclxuXHRcdFx0bWFwXHJcblx0XHRcdCAgICAuZmlyZSgnYXV0b3BhbnN0YXJ0JylcclxuXHRcdFx0ICAgIC5wYW5CeShbZHgsIGR5XSk7XHJcblx0XHR9XHJcblx0fSxcclxuXHJcblx0X29uQ2xvc2VCdXR0b25DbGljazogZnVuY3Rpb24gKGUpIHtcclxuXHRcdHRoaXMuX2Nsb3NlKCk7XHJcblx0XHRMLkRvbUV2ZW50LnN0b3AoZSk7XHJcblx0fVxyXG59KTtcclxuXHJcbkwucG9wdXAgPSBmdW5jdGlvbiAob3B0aW9ucywgc291cmNlKSB7XHJcblx0cmV0dXJuIG5ldyBMLlBvcHVwKG9wdGlvbnMsIHNvdXJjZSk7XHJcbn07XHJcblxyXG5cclxuTC5NYXAuaW5jbHVkZSh7XHJcblx0b3BlblBvcHVwOiBmdW5jdGlvbiAocG9wdXAsIGxhdGxuZywgb3B0aW9ucykgeyAvLyAoUG9wdXApIG9yIChTdHJpbmcgfHwgSFRNTEVsZW1lbnQsIExhdExuZ1ssIE9iamVjdF0pXHJcblx0XHR0aGlzLmNsb3NlUG9wdXAoKTtcclxuXHJcblx0XHRpZiAoIShwb3B1cCBpbnN0YW5jZW9mIEwuUG9wdXApKSB7XHJcblx0XHRcdHZhciBjb250ZW50ID0gcG9wdXA7XHJcblxyXG5cdFx0XHRwb3B1cCA9IG5ldyBMLlBvcHVwKG9wdGlvbnMpXHJcblx0XHRcdCAgICAuc2V0TGF0TG5nKGxhdGxuZylcclxuXHRcdFx0ICAgIC5zZXRDb250ZW50KGNvbnRlbnQpO1xyXG5cdFx0fVxyXG5cdFx0cG9wdXAuX2lzT3BlbiA9IHRydWU7XHJcblxyXG5cdFx0dGhpcy5fcG9wdXAgPSBwb3B1cDtcclxuXHRcdHJldHVybiB0aGlzLmFkZExheWVyKHBvcHVwKTtcclxuXHR9LFxyXG5cclxuXHRjbG9zZVBvcHVwOiBmdW5jdGlvbiAocG9wdXApIHtcclxuXHRcdGlmICghcG9wdXAgfHwgcG9wdXAgPT09IHRoaXMuX3BvcHVwKSB7XHJcblx0XHRcdHBvcHVwID0gdGhpcy5fcG9wdXA7XHJcblx0XHRcdHRoaXMuX3BvcHVwID0gbnVsbDtcclxuXHRcdH1cclxuXHRcdGlmIChwb3B1cCkge1xyXG5cdFx0XHR0aGlzLnJlbW92ZUxheWVyKHBvcHVwKTtcclxuXHRcdFx0cG9wdXAuX2lzT3BlbiA9IGZhbHNlO1xyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIHRoaXM7XHJcblx0fVxyXG59KTtcclxuXG5cbi8qXHJcbiAqIFBvcHVwIGV4dGVuc2lvbiB0byBMLk1hcmtlciwgYWRkaW5nIHBvcHVwLXJlbGF0ZWQgbWV0aG9kcy5cclxuICovXHJcblxyXG5MLk1hcmtlci5pbmNsdWRlKHtcclxuXHRvcGVuUG9wdXA6IGZ1bmN0aW9uICgpIHtcclxuXHRcdGlmICh0aGlzLl9wb3B1cCAmJiB0aGlzLl9tYXAgJiYgIXRoaXMuX21hcC5oYXNMYXllcih0aGlzLl9wb3B1cCkpIHtcclxuXHRcdFx0dGhpcy5fcG9wdXAuc2V0TGF0TG5nKHRoaXMuX2xhdGxuZyk7XHJcblx0XHRcdHRoaXMuX21hcC5vcGVuUG9wdXAodGhpcy5fcG9wdXApO1xyXG5cdFx0fVxyXG5cclxuXHRcdHJldHVybiB0aGlzO1xyXG5cdH0sXHJcblxyXG5cdGNsb3NlUG9wdXA6IGZ1bmN0aW9uICgpIHtcclxuXHRcdGlmICh0aGlzLl9wb3B1cCkge1xyXG5cdFx0XHR0aGlzLl9wb3B1cC5fY2xvc2UoKTtcclxuXHRcdH1cclxuXHRcdHJldHVybiB0aGlzO1xyXG5cdH0sXHJcblxyXG5cdHRvZ2dsZVBvcHVwOiBmdW5jdGlvbiAoKSB7XHJcblx0XHRpZiAodGhpcy5fcG9wdXApIHtcclxuXHRcdFx0aWYgKHRoaXMuX3BvcHVwLl9pc09wZW4pIHtcclxuXHRcdFx0XHR0aGlzLmNsb3NlUG9wdXAoKTtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHR0aGlzLm9wZW5Qb3B1cCgpO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gdGhpcztcclxuXHR9LFxyXG5cclxuXHRiaW5kUG9wdXA6IGZ1bmN0aW9uIChjb250ZW50LCBvcHRpb25zKSB7XHJcblx0XHR2YXIgYW5jaG9yID0gTC5wb2ludCh0aGlzLm9wdGlvbnMuaWNvbi5vcHRpb25zLnBvcHVwQW5jaG9yIHx8IFswLCAwXSk7XHJcblxyXG5cdFx0YW5jaG9yID0gYW5jaG9yLmFkZChMLlBvcHVwLnByb3RvdHlwZS5vcHRpb25zLm9mZnNldCk7XHJcblxyXG5cdFx0aWYgKG9wdGlvbnMgJiYgb3B0aW9ucy5vZmZzZXQpIHtcclxuXHRcdFx0YW5jaG9yID0gYW5jaG9yLmFkZChvcHRpb25zLm9mZnNldCk7XHJcblx0XHR9XHJcblxyXG5cdFx0b3B0aW9ucyA9IEwuZXh0ZW5kKHtvZmZzZXQ6IGFuY2hvcn0sIG9wdGlvbnMpO1xyXG5cclxuXHRcdGlmICghdGhpcy5fcG9wdXBIYW5kbGVyc0FkZGVkKSB7XHJcblx0XHRcdHRoaXNcclxuXHRcdFx0ICAgIC5vbignY2xpY2snLCB0aGlzLnRvZ2dsZVBvcHVwLCB0aGlzKVxyXG5cdFx0XHQgICAgLm9uKCdyZW1vdmUnLCB0aGlzLmNsb3NlUG9wdXAsIHRoaXMpXHJcblx0XHRcdCAgICAub24oJ21vdmUnLCB0aGlzLl9tb3ZlUG9wdXAsIHRoaXMpO1xyXG5cdFx0XHR0aGlzLl9wb3B1cEhhbmRsZXJzQWRkZWQgPSB0cnVlO1xyXG5cdFx0fVxyXG5cclxuXHRcdGlmIChjb250ZW50IGluc3RhbmNlb2YgTC5Qb3B1cCkge1xyXG5cdFx0XHRMLnNldE9wdGlvbnMoY29udGVudCwgb3B0aW9ucyk7XHJcblx0XHRcdHRoaXMuX3BvcHVwID0gY29udGVudDtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdHRoaXMuX3BvcHVwID0gbmV3IEwuUG9wdXAob3B0aW9ucywgdGhpcylcclxuXHRcdFx0XHQuc2V0Q29udGVudChjb250ZW50KTtcclxuXHRcdH1cclxuXHJcblx0XHRyZXR1cm4gdGhpcztcclxuXHR9LFxyXG5cclxuXHRzZXRQb3B1cENvbnRlbnQ6IGZ1bmN0aW9uIChjb250ZW50KSB7XHJcblx0XHRpZiAodGhpcy5fcG9wdXApIHtcclxuXHRcdFx0dGhpcy5fcG9wdXAuc2V0Q29udGVudChjb250ZW50KTtcclxuXHRcdH1cclxuXHRcdHJldHVybiB0aGlzO1xyXG5cdH0sXHJcblxyXG5cdHVuYmluZFBvcHVwOiBmdW5jdGlvbiAoKSB7XHJcblx0XHRpZiAodGhpcy5fcG9wdXApIHtcclxuXHRcdFx0dGhpcy5fcG9wdXAgPSBudWxsO1xyXG5cdFx0XHR0aGlzXHJcblx0XHRcdCAgICAub2ZmKCdjbGljaycsIHRoaXMudG9nZ2xlUG9wdXAsIHRoaXMpXHJcblx0XHRcdCAgICAub2ZmKCdyZW1vdmUnLCB0aGlzLmNsb3NlUG9wdXAsIHRoaXMpXHJcblx0XHRcdCAgICAub2ZmKCdtb3ZlJywgdGhpcy5fbW92ZVBvcHVwLCB0aGlzKTtcclxuXHRcdFx0dGhpcy5fcG9wdXBIYW5kbGVyc0FkZGVkID0gZmFsc2U7XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gdGhpcztcclxuXHR9LFxyXG5cclxuXHRnZXRQb3B1cDogZnVuY3Rpb24gKCkge1xyXG5cdFx0cmV0dXJuIHRoaXMuX3BvcHVwO1xyXG5cdH0sXHJcblxyXG5cdF9tb3ZlUG9wdXA6IGZ1bmN0aW9uIChlKSB7XHJcblx0XHR0aGlzLl9wb3B1cC5zZXRMYXRMbmcoZS5sYXRsbmcpO1xyXG5cdH1cclxufSk7XHJcblxuXG4vKlxyXG4gKiBMLkxheWVyR3JvdXAgaXMgYSBjbGFzcyB0byBjb21iaW5lIHNldmVyYWwgbGF5ZXJzIGludG8gb25lIHNvIHRoYXRcclxuICogeW91IGNhbiBtYW5pcHVsYXRlIHRoZSBncm91cCAoZS5nLiBhZGQvcmVtb3ZlIGl0KSBhcyBvbmUgbGF5ZXIuXHJcbiAqL1xyXG5cclxuTC5MYXllckdyb3VwID0gTC5DbGFzcy5leHRlbmQoe1xyXG5cdGluaXRpYWxpemU6IGZ1bmN0aW9uIChsYXllcnMpIHtcclxuXHRcdHRoaXMuX2xheWVycyA9IHt9O1xyXG5cclxuXHRcdHZhciBpLCBsZW47XHJcblxyXG5cdFx0aWYgKGxheWVycykge1xyXG5cdFx0XHRmb3IgKGkgPSAwLCBsZW4gPSBsYXllcnMubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcclxuXHRcdFx0XHR0aGlzLmFkZExheWVyKGxheWVyc1tpXSk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9LFxyXG5cclxuXHRhZGRMYXllcjogZnVuY3Rpb24gKGxheWVyKSB7XHJcblx0XHR2YXIgaWQgPSB0aGlzLmdldExheWVySWQobGF5ZXIpO1xyXG5cclxuXHRcdHRoaXMuX2xheWVyc1tpZF0gPSBsYXllcjtcclxuXHJcblx0XHRpZiAodGhpcy5fbWFwKSB7XHJcblx0XHRcdHRoaXMuX21hcC5hZGRMYXllcihsYXllcik7XHJcblx0XHR9XHJcblxyXG5cdFx0cmV0dXJuIHRoaXM7XHJcblx0fSxcclxuXHJcblx0cmVtb3ZlTGF5ZXI6IGZ1bmN0aW9uIChsYXllcikge1xyXG5cdFx0dmFyIGlkID0gbGF5ZXIgaW4gdGhpcy5fbGF5ZXJzID8gbGF5ZXIgOiB0aGlzLmdldExheWVySWQobGF5ZXIpO1xyXG5cclxuXHRcdGlmICh0aGlzLl9tYXAgJiYgdGhpcy5fbGF5ZXJzW2lkXSkge1xyXG5cdFx0XHR0aGlzLl9tYXAucmVtb3ZlTGF5ZXIodGhpcy5fbGF5ZXJzW2lkXSk7XHJcblx0XHR9XHJcblxyXG5cdFx0ZGVsZXRlIHRoaXMuX2xheWVyc1tpZF07XHJcblxyXG5cdFx0cmV0dXJuIHRoaXM7XHJcblx0fSxcclxuXHJcblx0aGFzTGF5ZXI6IGZ1bmN0aW9uIChsYXllcikge1xyXG5cdFx0aWYgKCFsYXllcikgeyByZXR1cm4gZmFsc2U7IH1cclxuXHJcblx0XHRyZXR1cm4gKGxheWVyIGluIHRoaXMuX2xheWVycyB8fCB0aGlzLmdldExheWVySWQobGF5ZXIpIGluIHRoaXMuX2xheWVycyk7XHJcblx0fSxcclxuXHJcblx0Y2xlYXJMYXllcnM6IGZ1bmN0aW9uICgpIHtcclxuXHRcdHRoaXMuZWFjaExheWVyKHRoaXMucmVtb3ZlTGF5ZXIsIHRoaXMpO1xyXG5cdFx0cmV0dXJuIHRoaXM7XHJcblx0fSxcclxuXHJcblx0aW52b2tlOiBmdW5jdGlvbiAobWV0aG9kTmFtZSkge1xyXG5cdFx0dmFyIGFyZ3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpLFxyXG5cdFx0ICAgIGksIGxheWVyO1xyXG5cclxuXHRcdGZvciAoaSBpbiB0aGlzLl9sYXllcnMpIHtcclxuXHRcdFx0bGF5ZXIgPSB0aGlzLl9sYXllcnNbaV07XHJcblxyXG5cdFx0XHRpZiAobGF5ZXJbbWV0aG9kTmFtZV0pIHtcclxuXHRcdFx0XHRsYXllclttZXRob2ROYW1lXS5hcHBseShsYXllciwgYXJncyk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0XHRyZXR1cm4gdGhpcztcclxuXHR9LFxyXG5cclxuXHRvbkFkZDogZnVuY3Rpb24gKG1hcCkge1xyXG5cdFx0dGhpcy5fbWFwID0gbWFwO1xyXG5cdFx0dGhpcy5lYWNoTGF5ZXIobWFwLmFkZExheWVyLCBtYXApO1xyXG5cdH0sXHJcblxyXG5cdG9uUmVtb3ZlOiBmdW5jdGlvbiAobWFwKSB7XHJcblx0XHR0aGlzLmVhY2hMYXllcihtYXAucmVtb3ZlTGF5ZXIsIG1hcCk7XHJcblx0XHR0aGlzLl9tYXAgPSBudWxsO1xyXG5cdH0sXHJcblxyXG5cdGFkZFRvOiBmdW5jdGlvbiAobWFwKSB7XHJcblx0XHRtYXAuYWRkTGF5ZXIodGhpcyk7XHJcblx0XHRyZXR1cm4gdGhpcztcclxuXHR9LFxyXG5cclxuXHRlYWNoTGF5ZXI6IGZ1bmN0aW9uIChtZXRob2QsIGNvbnRleHQpIHtcclxuXHRcdGZvciAodmFyIGkgaW4gdGhpcy5fbGF5ZXJzKSB7XHJcblx0XHRcdG1ldGhvZC5jYWxsKGNvbnRleHQsIHRoaXMuX2xheWVyc1tpXSk7XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gdGhpcztcclxuXHR9LFxyXG5cclxuXHRnZXRMYXllcjogZnVuY3Rpb24gKGlkKSB7XHJcblx0XHRyZXR1cm4gdGhpcy5fbGF5ZXJzW2lkXTtcclxuXHR9LFxyXG5cclxuXHRnZXRMYXllcnM6IGZ1bmN0aW9uICgpIHtcclxuXHRcdHZhciBsYXllcnMgPSBbXTtcclxuXHJcblx0XHRmb3IgKHZhciBpIGluIHRoaXMuX2xheWVycykge1xyXG5cdFx0XHRsYXllcnMucHVzaCh0aGlzLl9sYXllcnNbaV0pO1xyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIGxheWVycztcclxuXHR9LFxyXG5cclxuXHRzZXRaSW5kZXg6IGZ1bmN0aW9uICh6SW5kZXgpIHtcclxuXHRcdHJldHVybiB0aGlzLmludm9rZSgnc2V0WkluZGV4JywgekluZGV4KTtcclxuXHR9LFxyXG5cclxuXHRnZXRMYXllcklkOiBmdW5jdGlvbiAobGF5ZXIpIHtcclxuXHRcdHJldHVybiBMLnN0YW1wKGxheWVyKTtcclxuXHR9XHJcbn0pO1xyXG5cclxuTC5sYXllckdyb3VwID0gZnVuY3Rpb24gKGxheWVycykge1xyXG5cdHJldHVybiBuZXcgTC5MYXllckdyb3VwKGxheWVycyk7XHJcbn07XHJcblxuXG4vKlxyXG4gKiBMLkZlYXR1cmVHcm91cCBleHRlbmRzIEwuTGF5ZXJHcm91cCBieSBpbnRyb2R1Y2luZyBtb3VzZSBldmVudHMgYW5kIGFkZGl0aW9uYWwgbWV0aG9kc1xyXG4gKiBzaGFyZWQgYmV0d2VlbiBhIGdyb3VwIG9mIGludGVyYWN0aXZlIGxheWVycyAobGlrZSB2ZWN0b3JzIG9yIG1hcmtlcnMpLlxyXG4gKi9cclxuXHJcbkwuRmVhdHVyZUdyb3VwID0gTC5MYXllckdyb3VwLmV4dGVuZCh7XHJcblx0aW5jbHVkZXM6IEwuTWl4aW4uRXZlbnRzLFxyXG5cclxuXHRzdGF0aWNzOiB7XHJcblx0XHRFVkVOVFM6ICdjbGljayBkYmxjbGljayBtb3VzZW92ZXIgbW91c2VvdXQgbW91c2Vtb3ZlIGNvbnRleHRtZW51IHBvcHVwb3BlbiBwb3B1cGNsb3NlJ1xyXG5cdH0sXHJcblxyXG5cdGFkZExheWVyOiBmdW5jdGlvbiAobGF5ZXIpIHtcclxuXHRcdGlmICh0aGlzLmhhc0xheWVyKGxheWVyKSkge1xyXG5cdFx0XHRyZXR1cm4gdGhpcztcclxuXHRcdH1cclxuXHJcblx0XHRpZiAoJ29uJyBpbiBsYXllcikge1xyXG5cdFx0XHRsYXllci5vbihMLkZlYXR1cmVHcm91cC5FVkVOVFMsIHRoaXMuX3Byb3BhZ2F0ZUV2ZW50LCB0aGlzKTtcclxuXHRcdH1cclxuXHJcblx0XHRMLkxheWVyR3JvdXAucHJvdG90eXBlLmFkZExheWVyLmNhbGwodGhpcywgbGF5ZXIpO1xyXG5cclxuXHRcdGlmICh0aGlzLl9wb3B1cENvbnRlbnQgJiYgbGF5ZXIuYmluZFBvcHVwKSB7XHJcblx0XHRcdGxheWVyLmJpbmRQb3B1cCh0aGlzLl9wb3B1cENvbnRlbnQsIHRoaXMuX3BvcHVwT3B0aW9ucyk7XHJcblx0XHR9XHJcblxyXG5cdFx0cmV0dXJuIHRoaXMuZmlyZSgnbGF5ZXJhZGQnLCB7bGF5ZXI6IGxheWVyfSk7XHJcblx0fSxcclxuXHJcblx0cmVtb3ZlTGF5ZXI6IGZ1bmN0aW9uIChsYXllcikge1xyXG5cdFx0aWYgKCF0aGlzLmhhc0xheWVyKGxheWVyKSkge1xyXG5cdFx0XHRyZXR1cm4gdGhpcztcclxuXHRcdH1cclxuXHRcdGlmIChsYXllciBpbiB0aGlzLl9sYXllcnMpIHtcclxuXHRcdFx0bGF5ZXIgPSB0aGlzLl9sYXllcnNbbGF5ZXJdO1xyXG5cdFx0fVxyXG5cclxuXHRcdGxheWVyLm9mZihMLkZlYXR1cmVHcm91cC5FVkVOVFMsIHRoaXMuX3Byb3BhZ2F0ZUV2ZW50LCB0aGlzKTtcclxuXHJcblx0XHRMLkxheWVyR3JvdXAucHJvdG90eXBlLnJlbW92ZUxheWVyLmNhbGwodGhpcywgbGF5ZXIpO1xyXG5cclxuXHRcdGlmICh0aGlzLl9wb3B1cENvbnRlbnQpIHtcclxuXHRcdFx0dGhpcy5pbnZva2UoJ3VuYmluZFBvcHVwJyk7XHJcblx0XHR9XHJcblxyXG5cdFx0cmV0dXJuIHRoaXMuZmlyZSgnbGF5ZXJyZW1vdmUnLCB7bGF5ZXI6IGxheWVyfSk7XHJcblx0fSxcclxuXHJcblx0YmluZFBvcHVwOiBmdW5jdGlvbiAoY29udGVudCwgb3B0aW9ucykge1xyXG5cdFx0dGhpcy5fcG9wdXBDb250ZW50ID0gY29udGVudDtcclxuXHRcdHRoaXMuX3BvcHVwT3B0aW9ucyA9IG9wdGlvbnM7XHJcblx0XHRyZXR1cm4gdGhpcy5pbnZva2UoJ2JpbmRQb3B1cCcsIGNvbnRlbnQsIG9wdGlvbnMpO1xyXG5cdH0sXHJcblxyXG5cdG9wZW5Qb3B1cDogZnVuY3Rpb24gKGxhdGxuZykge1xyXG5cdFx0Ly8gb3BlbiBwb3B1cCBvbiB0aGUgZmlyc3QgbGF5ZXJcclxuXHRcdGZvciAodmFyIGlkIGluIHRoaXMuX2xheWVycykge1xyXG5cdFx0XHR0aGlzLl9sYXllcnNbaWRdLm9wZW5Qb3B1cChsYXRsbmcpO1xyXG5cdFx0XHRicmVhaztcclxuXHRcdH1cclxuXHRcdHJldHVybiB0aGlzO1xyXG5cdH0sXHJcblxyXG5cdHNldFN0eWxlOiBmdW5jdGlvbiAoc3R5bGUpIHtcclxuXHRcdHJldHVybiB0aGlzLmludm9rZSgnc2V0U3R5bGUnLCBzdHlsZSk7XHJcblx0fSxcclxuXHJcblx0YnJpbmdUb0Zyb250OiBmdW5jdGlvbiAoKSB7XHJcblx0XHRyZXR1cm4gdGhpcy5pbnZva2UoJ2JyaW5nVG9Gcm9udCcpO1xyXG5cdH0sXHJcblxyXG5cdGJyaW5nVG9CYWNrOiBmdW5jdGlvbiAoKSB7XHJcblx0XHRyZXR1cm4gdGhpcy5pbnZva2UoJ2JyaW5nVG9CYWNrJyk7XHJcblx0fSxcclxuXHJcblx0Z2V0Qm91bmRzOiBmdW5jdGlvbiAoKSB7XHJcblx0XHR2YXIgYm91bmRzID0gbmV3IEwuTGF0TG5nQm91bmRzKCk7XHJcblxyXG5cdFx0dGhpcy5lYWNoTGF5ZXIoZnVuY3Rpb24gKGxheWVyKSB7XHJcblx0XHRcdGJvdW5kcy5leHRlbmQobGF5ZXIgaW5zdGFuY2VvZiBMLk1hcmtlciA/IGxheWVyLmdldExhdExuZygpIDogbGF5ZXIuZ2V0Qm91bmRzKCkpO1xyXG5cdFx0fSk7XHJcblxyXG5cdFx0cmV0dXJuIGJvdW5kcztcclxuXHR9LFxyXG5cclxuXHRfcHJvcGFnYXRlRXZlbnQ6IGZ1bmN0aW9uIChlKSB7XHJcblx0XHRlID0gTC5leHRlbmQoe1xyXG5cdFx0XHRsYXllcjogZS50YXJnZXQsXHJcblx0XHRcdHRhcmdldDogdGhpc1xyXG5cdFx0fSwgZSk7XHJcblx0XHR0aGlzLmZpcmUoZS50eXBlLCBlKTtcclxuXHR9XHJcbn0pO1xyXG5cclxuTC5mZWF0dXJlR3JvdXAgPSBmdW5jdGlvbiAobGF5ZXJzKSB7XHJcblx0cmV0dXJuIG5ldyBMLkZlYXR1cmVHcm91cChsYXllcnMpO1xyXG59O1xyXG5cblxuLypcclxuICogTC5QYXRoIGlzIGEgYmFzZSBjbGFzcyBmb3IgcmVuZGVyaW5nIHZlY3RvciBwYXRocyBvbiBhIG1hcC4gSW5oZXJpdGVkIGJ5IFBvbHlsaW5lLCBDaXJjbGUsIGV0Yy5cclxuICovXHJcblxyXG5MLlBhdGggPSBMLkNsYXNzLmV4dGVuZCh7XHJcblx0aW5jbHVkZXM6IFtMLk1peGluLkV2ZW50c10sXHJcblxyXG5cdHN0YXRpY3M6IHtcclxuXHRcdC8vIGhvdyBtdWNoIHRvIGV4dGVuZCB0aGUgY2xpcCBhcmVhIGFyb3VuZCB0aGUgbWFwIHZpZXdcclxuXHRcdC8vIChyZWxhdGl2ZSB0byBpdHMgc2l6ZSwgZS5nLiAwLjUgaXMgaGFsZiB0aGUgc2NyZWVuIGluIGVhY2ggZGlyZWN0aW9uKVxyXG5cdFx0Ly8gc2V0IGl0IHNvIHRoYXQgU1ZHIGVsZW1lbnQgZG9lc24ndCBleGNlZWQgMTI4MHB4ICh2ZWN0b3JzIGZsaWNrZXIgb24gZHJhZ2VuZCBpZiBpdCBpcylcclxuXHRcdENMSVBfUEFERElORzogKGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0dmFyIG1heCA9IEwuQnJvd3Nlci5tb2JpbGUgPyAxMjgwIDogMjAwMCxcclxuXHRcdFx0ICAgIHRhcmdldCA9IChtYXggLyBNYXRoLm1heCh3aW5kb3cub3V0ZXJXaWR0aCwgd2luZG93Lm91dGVySGVpZ2h0KSAtIDEpIC8gMjtcclxuXHRcdFx0cmV0dXJuIE1hdGgubWF4KDAsIE1hdGgubWluKDAuNSwgdGFyZ2V0KSk7XHJcblx0XHR9KSgpXHJcblx0fSxcclxuXHJcblx0b3B0aW9uczoge1xyXG5cdFx0c3Ryb2tlOiB0cnVlLFxyXG5cdFx0Y29sb3I6ICcjMDAzM2ZmJyxcclxuXHRcdGRhc2hBcnJheTogbnVsbCxcclxuXHRcdGxpbmVDYXA6IG51bGwsXHJcblx0XHRsaW5lSm9pbjogbnVsbCxcclxuXHRcdHdlaWdodDogNSxcclxuXHRcdG9wYWNpdHk6IDAuNSxcclxuXHJcblx0XHRmaWxsOiBmYWxzZSxcclxuXHRcdGZpbGxDb2xvcjogbnVsbCwgLy9zYW1lIGFzIGNvbG9yIGJ5IGRlZmF1bHRcclxuXHRcdGZpbGxPcGFjaXR5OiAwLjIsXHJcblxyXG5cdFx0Y2xpY2thYmxlOiB0cnVlXHJcblx0fSxcclxuXHJcblx0aW5pdGlhbGl6ZTogZnVuY3Rpb24gKG9wdGlvbnMpIHtcclxuXHRcdEwuc2V0T3B0aW9ucyh0aGlzLCBvcHRpb25zKTtcclxuXHR9LFxyXG5cclxuXHRvbkFkZDogZnVuY3Rpb24gKG1hcCkge1xyXG5cdFx0dGhpcy5fbWFwID0gbWFwO1xyXG5cclxuXHRcdGlmICghdGhpcy5fY29udGFpbmVyKSB7XHJcblx0XHRcdHRoaXMuX2luaXRFbGVtZW50cygpO1xyXG5cdFx0XHR0aGlzLl9pbml0RXZlbnRzKCk7XHJcblx0XHR9XHJcblxyXG5cdFx0dGhpcy5wcm9qZWN0TGF0bG5ncygpO1xyXG5cdFx0dGhpcy5fdXBkYXRlUGF0aCgpO1xyXG5cclxuXHRcdGlmICh0aGlzLl9jb250YWluZXIpIHtcclxuXHRcdFx0dGhpcy5fbWFwLl9wYXRoUm9vdC5hcHBlbmRDaGlsZCh0aGlzLl9jb250YWluZXIpO1xyXG5cdFx0fVxyXG5cclxuXHRcdHRoaXMuZmlyZSgnYWRkJyk7XHJcblxyXG5cdFx0bWFwLm9uKHtcclxuXHRcdFx0J3ZpZXdyZXNldCc6IHRoaXMucHJvamVjdExhdGxuZ3MsXHJcblx0XHRcdCdtb3ZlZW5kJzogdGhpcy5fdXBkYXRlUGF0aFxyXG5cdFx0fSwgdGhpcyk7XHJcblx0fSxcclxuXHJcblx0YWRkVG86IGZ1bmN0aW9uIChtYXApIHtcclxuXHRcdG1hcC5hZGRMYXllcih0aGlzKTtcclxuXHRcdHJldHVybiB0aGlzO1xyXG5cdH0sXHJcblxyXG5cdG9uUmVtb3ZlOiBmdW5jdGlvbiAobWFwKSB7XHJcblx0XHRtYXAuX3BhdGhSb290LnJlbW92ZUNoaWxkKHRoaXMuX2NvbnRhaW5lcik7XHJcblxyXG5cdFx0Ly8gTmVlZCB0byBmaXJlIHJlbW92ZSBldmVudCBiZWZvcmUgd2Ugc2V0IF9tYXAgdG8gbnVsbCBhcyB0aGUgZXZlbnQgaG9va3MgbWlnaHQgbmVlZCB0aGUgb2JqZWN0XHJcblx0XHR0aGlzLmZpcmUoJ3JlbW92ZScpO1xyXG5cdFx0dGhpcy5fbWFwID0gbnVsbDtcclxuXHJcblx0XHRpZiAoTC5Ccm93c2VyLnZtbCkge1xyXG5cdFx0XHR0aGlzLl9jb250YWluZXIgPSBudWxsO1xyXG5cdFx0XHR0aGlzLl9zdHJva2UgPSBudWxsO1xyXG5cdFx0XHR0aGlzLl9maWxsID0gbnVsbDtcclxuXHRcdH1cclxuXHJcblx0XHRtYXAub2ZmKHtcclxuXHRcdFx0J3ZpZXdyZXNldCc6IHRoaXMucHJvamVjdExhdGxuZ3MsXHJcblx0XHRcdCdtb3ZlZW5kJzogdGhpcy5fdXBkYXRlUGF0aFxyXG5cdFx0fSwgdGhpcyk7XHJcblx0fSxcclxuXHJcblx0cHJvamVjdExhdGxuZ3M6IGZ1bmN0aW9uICgpIHtcclxuXHRcdC8vIGRvIGFsbCBwcm9qZWN0aW9uIHN0dWZmIGhlcmVcclxuXHR9LFxyXG5cclxuXHRzZXRTdHlsZTogZnVuY3Rpb24gKHN0eWxlKSB7XHJcblx0XHRMLnNldE9wdGlvbnModGhpcywgc3R5bGUpO1xyXG5cclxuXHRcdGlmICh0aGlzLl9jb250YWluZXIpIHtcclxuXHRcdFx0dGhpcy5fdXBkYXRlU3R5bGUoKTtcclxuXHRcdH1cclxuXHJcblx0XHRyZXR1cm4gdGhpcztcclxuXHR9LFxyXG5cclxuXHRyZWRyYXc6IGZ1bmN0aW9uICgpIHtcclxuXHRcdGlmICh0aGlzLl9tYXApIHtcclxuXHRcdFx0dGhpcy5wcm9qZWN0TGF0bG5ncygpO1xyXG5cdFx0XHR0aGlzLl91cGRhdGVQYXRoKCk7XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gdGhpcztcclxuXHR9XHJcbn0pO1xyXG5cclxuTC5NYXAuaW5jbHVkZSh7XHJcblx0X3VwZGF0ZVBhdGhWaWV3cG9ydDogZnVuY3Rpb24gKCkge1xyXG5cdFx0dmFyIHAgPSBMLlBhdGguQ0xJUF9QQURESU5HLFxyXG5cdFx0ICAgIHNpemUgPSB0aGlzLmdldFNpemUoKSxcclxuXHRcdCAgICBwYW5lUG9zID0gTC5Eb21VdGlsLmdldFBvc2l0aW9uKHRoaXMuX21hcFBhbmUpLFxyXG5cdFx0ICAgIG1pbiA9IHBhbmVQb3MubXVsdGlwbHlCeSgtMSkuX3N1YnRyYWN0KHNpemUubXVsdGlwbHlCeShwKS5fcm91bmQoKSksXHJcblx0XHQgICAgbWF4ID0gbWluLmFkZChzaXplLm11bHRpcGx5QnkoMSArIHAgKiAyKS5fcm91bmQoKSk7XHJcblxyXG5cdFx0dGhpcy5fcGF0aFZpZXdwb3J0ID0gbmV3IEwuQm91bmRzKG1pbiwgbWF4KTtcclxuXHR9XHJcbn0pO1xyXG5cblxuLypcclxuICogRXh0ZW5kcyBMLlBhdGggd2l0aCBTVkctc3BlY2lmaWMgcmVuZGVyaW5nIGNvZGUuXHJcbiAqL1xyXG5cclxuTC5QYXRoLlNWR19OUyA9ICdodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Zyc7XHJcblxyXG5MLkJyb3dzZXIuc3ZnID0gISEoZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TICYmIGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhMLlBhdGguU1ZHX05TLCAnc3ZnJykuY3JlYXRlU1ZHUmVjdCk7XHJcblxyXG5MLlBhdGggPSBMLlBhdGguZXh0ZW5kKHtcclxuXHRzdGF0aWNzOiB7XHJcblx0XHRTVkc6IEwuQnJvd3Nlci5zdmdcclxuXHR9LFxyXG5cclxuXHRicmluZ1RvRnJvbnQ6IGZ1bmN0aW9uICgpIHtcclxuXHRcdHZhciByb290ID0gdGhpcy5fbWFwLl9wYXRoUm9vdCxcclxuXHRcdCAgICBwYXRoID0gdGhpcy5fY29udGFpbmVyO1xyXG5cclxuXHRcdGlmIChwYXRoICYmIHJvb3QubGFzdENoaWxkICE9PSBwYXRoKSB7XHJcblx0XHRcdHJvb3QuYXBwZW5kQ2hpbGQocGF0aCk7XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gdGhpcztcclxuXHR9LFxyXG5cclxuXHRicmluZ1RvQmFjazogZnVuY3Rpb24gKCkge1xyXG5cdFx0dmFyIHJvb3QgPSB0aGlzLl9tYXAuX3BhdGhSb290LFxyXG5cdFx0ICAgIHBhdGggPSB0aGlzLl9jb250YWluZXIsXHJcblx0XHQgICAgZmlyc3QgPSByb290LmZpcnN0Q2hpbGQ7XHJcblxyXG5cdFx0aWYgKHBhdGggJiYgZmlyc3QgIT09IHBhdGgpIHtcclxuXHRcdFx0cm9vdC5pbnNlcnRCZWZvcmUocGF0aCwgZmlyc3QpO1xyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIHRoaXM7XHJcblx0fSxcclxuXHJcblx0Z2V0UGF0aFN0cmluZzogZnVuY3Rpb24gKCkge1xyXG5cdFx0Ly8gZm9ybSBwYXRoIHN0cmluZyBoZXJlXHJcblx0fSxcclxuXHJcblx0X2NyZWF0ZUVsZW1lbnQ6IGZ1bmN0aW9uIChuYW1lKSB7XHJcblx0XHRyZXR1cm4gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKEwuUGF0aC5TVkdfTlMsIG5hbWUpO1xyXG5cdH0sXHJcblxyXG5cdF9pbml0RWxlbWVudHM6IGZ1bmN0aW9uICgpIHtcclxuXHRcdHRoaXMuX21hcC5faW5pdFBhdGhSb290KCk7XHJcblx0XHR0aGlzLl9pbml0UGF0aCgpO1xyXG5cdFx0dGhpcy5faW5pdFN0eWxlKCk7XHJcblx0fSxcclxuXHJcblx0X2luaXRQYXRoOiBmdW5jdGlvbiAoKSB7XHJcblx0XHR0aGlzLl9jb250YWluZXIgPSB0aGlzLl9jcmVhdGVFbGVtZW50KCdnJyk7XHJcblxyXG5cdFx0dGhpcy5fcGF0aCA9IHRoaXMuX2NyZWF0ZUVsZW1lbnQoJ3BhdGgnKTtcclxuXHJcblx0XHRpZiAodGhpcy5vcHRpb25zLmNsYXNzTmFtZSkge1xyXG5cdFx0XHRMLkRvbVV0aWwuYWRkQ2xhc3ModGhpcy5fcGF0aCwgdGhpcy5vcHRpb25zLmNsYXNzTmFtZSk7XHJcblx0XHR9XHJcblxyXG5cdFx0dGhpcy5fY29udGFpbmVyLmFwcGVuZENoaWxkKHRoaXMuX3BhdGgpO1xyXG5cdH0sXHJcblxyXG5cdF9pbml0U3R5bGU6IGZ1bmN0aW9uICgpIHtcclxuXHRcdGlmICh0aGlzLm9wdGlvbnMuc3Ryb2tlKSB7XHJcblx0XHRcdHRoaXMuX3BhdGguc2V0QXR0cmlidXRlKCdzdHJva2UtbGluZWpvaW4nLCAncm91bmQnKTtcclxuXHRcdFx0dGhpcy5fcGF0aC5zZXRBdHRyaWJ1dGUoJ3N0cm9rZS1saW5lY2FwJywgJ3JvdW5kJyk7XHJcblx0XHR9XHJcblx0XHRpZiAodGhpcy5vcHRpb25zLmZpbGwpIHtcclxuXHRcdFx0dGhpcy5fcGF0aC5zZXRBdHRyaWJ1dGUoJ2ZpbGwtcnVsZScsICdldmVub2RkJyk7XHJcblx0XHR9XHJcblx0XHRpZiAodGhpcy5vcHRpb25zLnBvaW50ZXJFdmVudHMpIHtcclxuXHRcdFx0dGhpcy5fcGF0aC5zZXRBdHRyaWJ1dGUoJ3BvaW50ZXItZXZlbnRzJywgdGhpcy5vcHRpb25zLnBvaW50ZXJFdmVudHMpO1xyXG5cdFx0fVxyXG5cdFx0aWYgKCF0aGlzLm9wdGlvbnMuY2xpY2thYmxlICYmICF0aGlzLm9wdGlvbnMucG9pbnRlckV2ZW50cykge1xyXG5cdFx0XHR0aGlzLl9wYXRoLnNldEF0dHJpYnV0ZSgncG9pbnRlci1ldmVudHMnLCAnbm9uZScpO1xyXG5cdFx0fVxyXG5cdFx0dGhpcy5fdXBkYXRlU3R5bGUoKTtcclxuXHR9LFxyXG5cclxuXHRfdXBkYXRlU3R5bGU6IGZ1bmN0aW9uICgpIHtcclxuXHRcdGlmICh0aGlzLm9wdGlvbnMuc3Ryb2tlKSB7XHJcblx0XHRcdHRoaXMuX3BhdGguc2V0QXR0cmlidXRlKCdzdHJva2UnLCB0aGlzLm9wdGlvbnMuY29sb3IpO1xyXG5cdFx0XHR0aGlzLl9wYXRoLnNldEF0dHJpYnV0ZSgnc3Ryb2tlLW9wYWNpdHknLCB0aGlzLm9wdGlvbnMub3BhY2l0eSk7XHJcblx0XHRcdHRoaXMuX3BhdGguc2V0QXR0cmlidXRlKCdzdHJva2Utd2lkdGgnLCB0aGlzLm9wdGlvbnMud2VpZ2h0KTtcclxuXHRcdFx0aWYgKHRoaXMub3B0aW9ucy5kYXNoQXJyYXkpIHtcclxuXHRcdFx0XHR0aGlzLl9wYXRoLnNldEF0dHJpYnV0ZSgnc3Ryb2tlLWRhc2hhcnJheScsIHRoaXMub3B0aW9ucy5kYXNoQXJyYXkpO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdHRoaXMuX3BhdGgucmVtb3ZlQXR0cmlidXRlKCdzdHJva2UtZGFzaGFycmF5Jyk7XHJcblx0XHRcdH1cclxuXHRcdFx0aWYgKHRoaXMub3B0aW9ucy5saW5lQ2FwKSB7XHJcblx0XHRcdFx0dGhpcy5fcGF0aC5zZXRBdHRyaWJ1dGUoJ3N0cm9rZS1saW5lY2FwJywgdGhpcy5vcHRpb25zLmxpbmVDYXApO1xyXG5cdFx0XHR9XHJcblx0XHRcdGlmICh0aGlzLm9wdGlvbnMubGluZUpvaW4pIHtcclxuXHRcdFx0XHR0aGlzLl9wYXRoLnNldEF0dHJpYnV0ZSgnc3Ryb2tlLWxpbmVqb2luJywgdGhpcy5vcHRpb25zLmxpbmVKb2luKTtcclxuXHRcdFx0fVxyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0dGhpcy5fcGF0aC5zZXRBdHRyaWJ1dGUoJ3N0cm9rZScsICdub25lJyk7XHJcblx0XHR9XHJcblx0XHRpZiAodGhpcy5vcHRpb25zLmZpbGwpIHtcclxuXHRcdFx0dGhpcy5fcGF0aC5zZXRBdHRyaWJ1dGUoJ2ZpbGwnLCB0aGlzLm9wdGlvbnMuZmlsbENvbG9yIHx8IHRoaXMub3B0aW9ucy5jb2xvcik7XHJcblx0XHRcdHRoaXMuX3BhdGguc2V0QXR0cmlidXRlKCdmaWxsLW9wYWNpdHknLCB0aGlzLm9wdGlvbnMuZmlsbE9wYWNpdHkpO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0dGhpcy5fcGF0aC5zZXRBdHRyaWJ1dGUoJ2ZpbGwnLCAnbm9uZScpO1xyXG5cdFx0fVxyXG5cdH0sXHJcblxyXG5cdF91cGRhdGVQYXRoOiBmdW5jdGlvbiAoKSB7XHJcblx0XHR2YXIgc3RyID0gdGhpcy5nZXRQYXRoU3RyaW5nKCk7XHJcblx0XHRpZiAoIXN0cikge1xyXG5cdFx0XHQvLyBmaXggd2Via2l0IGVtcHR5IHN0cmluZyBwYXJzaW5nIGJ1Z1xyXG5cdFx0XHRzdHIgPSAnTTAgMCc7XHJcblx0XHR9XHJcblx0XHR0aGlzLl9wYXRoLnNldEF0dHJpYnV0ZSgnZCcsIHN0cik7XHJcblx0fSxcclxuXHJcblx0Ly8gVE9ETyByZW1vdmUgZHVwbGljYXRpb24gd2l0aCBMLk1hcFxyXG5cdF9pbml0RXZlbnRzOiBmdW5jdGlvbiAoKSB7XHJcblx0XHRpZiAodGhpcy5vcHRpb25zLmNsaWNrYWJsZSkge1xyXG5cdFx0XHRpZiAoTC5Ccm93c2VyLnN2ZyB8fCAhTC5Ccm93c2VyLnZtbCkge1xyXG5cdFx0XHRcdEwuRG9tVXRpbC5hZGRDbGFzcyh0aGlzLl9wYXRoLCAnbGVhZmxldC1jbGlja2FibGUnKTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0TC5Eb21FdmVudC5vbih0aGlzLl9jb250YWluZXIsICdjbGljaycsIHRoaXMuX29uTW91c2VDbGljaywgdGhpcyk7XHJcblxyXG5cdFx0XHR2YXIgZXZlbnRzID0gWydkYmxjbGljaycsICdtb3VzZWRvd24nLCAnbW91c2VvdmVyJyxcclxuXHRcdFx0ICAgICAgICAgICAgICAnbW91c2VvdXQnLCAnbW91c2Vtb3ZlJywgJ2NvbnRleHRtZW51J107XHJcblx0XHRcdGZvciAodmFyIGkgPSAwOyBpIDwgZXZlbnRzLmxlbmd0aDsgaSsrKSB7XHJcblx0XHRcdFx0TC5Eb21FdmVudC5vbih0aGlzLl9jb250YWluZXIsIGV2ZW50c1tpXSwgdGhpcy5fZmlyZU1vdXNlRXZlbnQsIHRoaXMpO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fSxcclxuXHJcblx0X29uTW91c2VDbGljazogZnVuY3Rpb24gKGUpIHtcclxuXHRcdGlmICh0aGlzLl9tYXAuZHJhZ2dpbmcgJiYgdGhpcy5fbWFwLmRyYWdnaW5nLm1vdmVkKCkpIHsgcmV0dXJuOyB9XHJcblxyXG5cdFx0dGhpcy5fZmlyZU1vdXNlRXZlbnQoZSk7XHJcblx0fSxcclxuXHJcblx0X2ZpcmVNb3VzZUV2ZW50OiBmdW5jdGlvbiAoZSkge1xyXG5cdFx0aWYgKCF0aGlzLmhhc0V2ZW50TGlzdGVuZXJzKGUudHlwZSkpIHsgcmV0dXJuOyB9XHJcblxyXG5cdFx0dmFyIG1hcCA9IHRoaXMuX21hcCxcclxuXHRcdCAgICBjb250YWluZXJQb2ludCA9IG1hcC5tb3VzZUV2ZW50VG9Db250YWluZXJQb2ludChlKSxcclxuXHRcdCAgICBsYXllclBvaW50ID0gbWFwLmNvbnRhaW5lclBvaW50VG9MYXllclBvaW50KGNvbnRhaW5lclBvaW50KSxcclxuXHRcdCAgICBsYXRsbmcgPSBtYXAubGF5ZXJQb2ludFRvTGF0TG5nKGxheWVyUG9pbnQpO1xyXG5cclxuXHRcdHRoaXMuZmlyZShlLnR5cGUsIHtcclxuXHRcdFx0bGF0bG5nOiBsYXRsbmcsXHJcblx0XHRcdGxheWVyUG9pbnQ6IGxheWVyUG9pbnQsXHJcblx0XHRcdGNvbnRhaW5lclBvaW50OiBjb250YWluZXJQb2ludCxcclxuXHRcdFx0b3JpZ2luYWxFdmVudDogZVxyXG5cdFx0fSk7XHJcblxyXG5cdFx0aWYgKGUudHlwZSA9PT0gJ2NvbnRleHRtZW51Jykge1xyXG5cdFx0XHRMLkRvbUV2ZW50LnByZXZlbnREZWZhdWx0KGUpO1xyXG5cdFx0fVxyXG5cdFx0aWYgKGUudHlwZSAhPT0gJ21vdXNlbW92ZScpIHtcclxuXHRcdFx0TC5Eb21FdmVudC5zdG9wUHJvcGFnYXRpb24oZSk7XHJcblx0XHR9XHJcblx0fVxyXG59KTtcclxuXHJcbkwuTWFwLmluY2x1ZGUoe1xyXG5cdF9pbml0UGF0aFJvb3Q6IGZ1bmN0aW9uICgpIHtcclxuXHRcdGlmICghdGhpcy5fcGF0aFJvb3QpIHtcclxuXHRcdFx0dGhpcy5fcGF0aFJvb3QgPSBMLlBhdGgucHJvdG90eXBlLl9jcmVhdGVFbGVtZW50KCdzdmcnKTtcclxuXHRcdFx0dGhpcy5fcGFuZXMub3ZlcmxheVBhbmUuYXBwZW5kQ2hpbGQodGhpcy5fcGF0aFJvb3QpO1xyXG5cclxuXHRcdFx0aWYgKHRoaXMub3B0aW9ucy56b29tQW5pbWF0aW9uICYmIEwuQnJvd3Nlci5hbnkzZCkge1xyXG5cdFx0XHRcdEwuRG9tVXRpbC5hZGRDbGFzcyh0aGlzLl9wYXRoUm9vdCwgJ2xlYWZsZXQtem9vbS1hbmltYXRlZCcpO1xyXG5cclxuXHRcdFx0XHR0aGlzLm9uKHtcclxuXHRcdFx0XHRcdCd6b29tYW5pbSc6IHRoaXMuX2FuaW1hdGVQYXRoWm9vbSxcclxuXHRcdFx0XHRcdCd6b29tZW5kJzogdGhpcy5fZW5kUGF0aFpvb21cclxuXHRcdFx0XHR9KTtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRMLkRvbVV0aWwuYWRkQ2xhc3ModGhpcy5fcGF0aFJvb3QsICdsZWFmbGV0LXpvb20taGlkZScpO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHR0aGlzLm9uKCdtb3ZlZW5kJywgdGhpcy5fdXBkYXRlU3ZnVmlld3BvcnQpO1xyXG5cdFx0XHR0aGlzLl91cGRhdGVTdmdWaWV3cG9ydCgpO1xyXG5cdFx0fVxyXG5cdH0sXHJcblxyXG5cdF9hbmltYXRlUGF0aFpvb206IGZ1bmN0aW9uIChlKSB7XHJcblx0XHR2YXIgc2NhbGUgPSB0aGlzLmdldFpvb21TY2FsZShlLnpvb20pLFxyXG5cdFx0ICAgIG9mZnNldCA9IHRoaXMuX2dldENlbnRlck9mZnNldChlLmNlbnRlcikuX211bHRpcGx5QnkoLXNjYWxlKS5fYWRkKHRoaXMuX3BhdGhWaWV3cG9ydC5taW4pO1xyXG5cclxuXHRcdHRoaXMuX3BhdGhSb290LnN0eWxlW0wuRG9tVXRpbC5UUkFOU0ZPUk1dID1cclxuXHRcdCAgICAgICAgTC5Eb21VdGlsLmdldFRyYW5zbGF0ZVN0cmluZyhvZmZzZXQpICsgJyBzY2FsZSgnICsgc2NhbGUgKyAnKSAnO1xyXG5cclxuXHRcdHRoaXMuX3BhdGhab29taW5nID0gdHJ1ZTtcclxuXHR9LFxyXG5cclxuXHRfZW5kUGF0aFpvb206IGZ1bmN0aW9uICgpIHtcclxuXHRcdHRoaXMuX3BhdGhab29taW5nID0gZmFsc2U7XHJcblx0fSxcclxuXHJcblx0X3VwZGF0ZVN2Z1ZpZXdwb3J0OiBmdW5jdGlvbiAoKSB7XHJcblxyXG5cdFx0aWYgKHRoaXMuX3BhdGhab29taW5nKSB7XHJcblx0XHRcdC8vIERvIG5vdCB1cGRhdGUgU1ZHcyB3aGlsZSBhIHpvb20gYW5pbWF0aW9uIGlzIGdvaW5nIG9uIG90aGVyd2lzZSB0aGUgYW5pbWF0aW9uIHdpbGwgYnJlYWsuXHJcblx0XHRcdC8vIFdoZW4gdGhlIHpvb20gYW5pbWF0aW9uIGVuZHMgd2Ugd2lsbCBiZSB1cGRhdGVkIGFnYWluIGFueXdheVxyXG5cdFx0XHQvLyBUaGlzIGZpeGVzIHRoZSBjYXNlIHdoZXJlIHlvdSBkbyBhIG1vbWVudHVtIG1vdmUgYW5kIHpvb20gd2hpbGUgdGhlIG1vdmUgaXMgc3RpbGwgb25nb2luZy5cclxuXHRcdFx0cmV0dXJuO1xyXG5cdFx0fVxyXG5cclxuXHRcdHRoaXMuX3VwZGF0ZVBhdGhWaWV3cG9ydCgpO1xyXG5cclxuXHRcdHZhciB2cCA9IHRoaXMuX3BhdGhWaWV3cG9ydCxcclxuXHRcdCAgICBtaW4gPSB2cC5taW4sXHJcblx0XHQgICAgbWF4ID0gdnAubWF4LFxyXG5cdFx0ICAgIHdpZHRoID0gbWF4LnggLSBtaW4ueCxcclxuXHRcdCAgICBoZWlnaHQgPSBtYXgueSAtIG1pbi55LFxyXG5cdFx0ICAgIHJvb3QgPSB0aGlzLl9wYXRoUm9vdCxcclxuXHRcdCAgICBwYW5lID0gdGhpcy5fcGFuZXMub3ZlcmxheVBhbmU7XHJcblxyXG5cdFx0Ly8gSGFjayB0byBtYWtlIGZsaWNrZXIgb24gZHJhZyBlbmQgb24gbW9iaWxlIHdlYmtpdCBsZXNzIGlycml0YXRpbmdcclxuXHRcdGlmIChMLkJyb3dzZXIubW9iaWxlV2Via2l0KSB7XHJcblx0XHRcdHBhbmUucmVtb3ZlQ2hpbGQocm9vdCk7XHJcblx0XHR9XHJcblxyXG5cdFx0TC5Eb21VdGlsLnNldFBvc2l0aW9uKHJvb3QsIG1pbik7XHJcblx0XHRyb290LnNldEF0dHJpYnV0ZSgnd2lkdGgnLCB3aWR0aCk7XHJcblx0XHRyb290LnNldEF0dHJpYnV0ZSgnaGVpZ2h0JywgaGVpZ2h0KTtcclxuXHRcdHJvb3Quc2V0QXR0cmlidXRlKCd2aWV3Qm94JywgW21pbi54LCBtaW4ueSwgd2lkdGgsIGhlaWdodF0uam9pbignICcpKTtcclxuXHJcblx0XHRpZiAoTC5Ccm93c2VyLm1vYmlsZVdlYmtpdCkge1xyXG5cdFx0XHRwYW5lLmFwcGVuZENoaWxkKHJvb3QpO1xyXG5cdFx0fVxyXG5cdH1cclxufSk7XHJcblxuXG4vKlxyXG4gKiBQb3B1cCBleHRlbnNpb24gdG8gTC5QYXRoIChwb2x5bGluZXMsIHBvbHlnb25zLCBjaXJjbGVzKSwgYWRkaW5nIHBvcHVwLXJlbGF0ZWQgbWV0aG9kcy5cclxuICovXHJcblxyXG5MLlBhdGguaW5jbHVkZSh7XHJcblxyXG5cdGJpbmRQb3B1cDogZnVuY3Rpb24gKGNvbnRlbnQsIG9wdGlvbnMpIHtcclxuXHJcblx0XHRpZiAoY29udGVudCBpbnN0YW5jZW9mIEwuUG9wdXApIHtcclxuXHRcdFx0dGhpcy5fcG9wdXAgPSBjb250ZW50O1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0aWYgKCF0aGlzLl9wb3B1cCB8fCBvcHRpb25zKSB7XHJcblx0XHRcdFx0dGhpcy5fcG9wdXAgPSBuZXcgTC5Qb3B1cChvcHRpb25zLCB0aGlzKTtcclxuXHRcdFx0fVxyXG5cdFx0XHR0aGlzLl9wb3B1cC5zZXRDb250ZW50KGNvbnRlbnQpO1xyXG5cdFx0fVxyXG5cclxuXHRcdGlmICghdGhpcy5fcG9wdXBIYW5kbGVyc0FkZGVkKSB7XHJcblx0XHRcdHRoaXNcclxuXHRcdFx0ICAgIC5vbignY2xpY2snLCB0aGlzLl9vcGVuUG9wdXAsIHRoaXMpXHJcblx0XHRcdCAgICAub24oJ3JlbW92ZScsIHRoaXMuY2xvc2VQb3B1cCwgdGhpcyk7XHJcblxyXG5cdFx0XHR0aGlzLl9wb3B1cEhhbmRsZXJzQWRkZWQgPSB0cnVlO1xyXG5cdFx0fVxyXG5cclxuXHRcdHJldHVybiB0aGlzO1xyXG5cdH0sXHJcblxyXG5cdHVuYmluZFBvcHVwOiBmdW5jdGlvbiAoKSB7XHJcblx0XHRpZiAodGhpcy5fcG9wdXApIHtcclxuXHRcdFx0dGhpcy5fcG9wdXAgPSBudWxsO1xyXG5cdFx0XHR0aGlzXHJcblx0XHRcdCAgICAub2ZmKCdjbGljaycsIHRoaXMuX29wZW5Qb3B1cClcclxuXHRcdFx0ICAgIC5vZmYoJ3JlbW92ZScsIHRoaXMuY2xvc2VQb3B1cCk7XHJcblxyXG5cdFx0XHR0aGlzLl9wb3B1cEhhbmRsZXJzQWRkZWQgPSBmYWxzZTtcclxuXHRcdH1cclxuXHRcdHJldHVybiB0aGlzO1xyXG5cdH0sXHJcblxyXG5cdG9wZW5Qb3B1cDogZnVuY3Rpb24gKGxhdGxuZykge1xyXG5cclxuXHRcdGlmICh0aGlzLl9wb3B1cCkge1xyXG5cdFx0XHQvLyBvcGVuIHRoZSBwb3B1cCBmcm9tIG9uZSBvZiB0aGUgcGF0aCdzIHBvaW50cyBpZiBub3Qgc3BlY2lmaWVkXHJcblx0XHRcdGxhdGxuZyA9IGxhdGxuZyB8fCB0aGlzLl9sYXRsbmcgfHxcclxuXHRcdFx0ICAgICAgICAgdGhpcy5fbGF0bG5nc1tNYXRoLmZsb29yKHRoaXMuX2xhdGxuZ3MubGVuZ3RoIC8gMildO1xyXG5cclxuXHRcdFx0dGhpcy5fb3BlblBvcHVwKHtsYXRsbmc6IGxhdGxuZ30pO1xyXG5cdFx0fVxyXG5cclxuXHRcdHJldHVybiB0aGlzO1xyXG5cdH0sXHJcblxyXG5cdGNsb3NlUG9wdXA6IGZ1bmN0aW9uICgpIHtcclxuXHRcdGlmICh0aGlzLl9wb3B1cCkge1xyXG5cdFx0XHR0aGlzLl9wb3B1cC5fY2xvc2UoKTtcclxuXHRcdH1cclxuXHRcdHJldHVybiB0aGlzO1xyXG5cdH0sXHJcblxyXG5cdF9vcGVuUG9wdXA6IGZ1bmN0aW9uIChlKSB7XHJcblx0XHR0aGlzLl9wb3B1cC5zZXRMYXRMbmcoZS5sYXRsbmcpO1xyXG5cdFx0dGhpcy5fbWFwLm9wZW5Qb3B1cCh0aGlzLl9wb3B1cCk7XHJcblx0fVxyXG59KTtcclxuXG5cbi8qXHJcbiAqIFZlY3RvciByZW5kZXJpbmcgZm9yIElFNi04IHRocm91Z2ggVk1MLlxyXG4gKiBUaGFua3MgdG8gRG1pdHJ5IEJhcmFub3Zza3kgYW5kIGhpcyBSYXBoYWVsIGxpYnJhcnkgZm9yIGluc3BpcmF0aW9uIVxyXG4gKi9cclxuXHJcbkwuQnJvd3Nlci52bWwgPSAhTC5Ccm93c2VyLnN2ZyAmJiAoZnVuY3Rpb24gKCkge1xyXG5cdHRyeSB7XHJcblx0XHR2YXIgZGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcblx0XHRkaXYuaW5uZXJIVE1MID0gJzx2OnNoYXBlIGFkaj1cIjFcIi8+JztcclxuXHJcblx0XHR2YXIgc2hhcGUgPSBkaXYuZmlyc3RDaGlsZDtcclxuXHRcdHNoYXBlLnN0eWxlLmJlaGF2aW9yID0gJ3VybCgjZGVmYXVsdCNWTUwpJztcclxuXHJcblx0XHRyZXR1cm4gc2hhcGUgJiYgKHR5cGVvZiBzaGFwZS5hZGogPT09ICdvYmplY3QnKTtcclxuXHJcblx0fSBjYXRjaCAoZSkge1xyXG5cdFx0cmV0dXJuIGZhbHNlO1xyXG5cdH1cclxufSgpKTtcclxuXHJcbkwuUGF0aCA9IEwuQnJvd3Nlci5zdmcgfHwgIUwuQnJvd3Nlci52bWwgPyBMLlBhdGggOiBMLlBhdGguZXh0ZW5kKHtcclxuXHRzdGF0aWNzOiB7XHJcblx0XHRWTUw6IHRydWUsXHJcblx0XHRDTElQX1BBRERJTkc6IDAuMDJcclxuXHR9LFxyXG5cclxuXHRfY3JlYXRlRWxlbWVudDogKGZ1bmN0aW9uICgpIHtcclxuXHRcdHRyeSB7XHJcblx0XHRcdGRvY3VtZW50Lm5hbWVzcGFjZXMuYWRkKCdsdm1sJywgJ3VybjpzY2hlbWFzLW1pY3Jvc29mdC1jb206dm1sJyk7XHJcblx0XHRcdHJldHVybiBmdW5jdGlvbiAobmFtZSkge1xyXG5cdFx0XHRcdHJldHVybiBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCc8bHZtbDonICsgbmFtZSArICcgY2xhc3M9XCJsdm1sXCI+Jyk7XHJcblx0XHRcdH07XHJcblx0XHR9IGNhdGNoIChlKSB7XHJcblx0XHRcdHJldHVybiBmdW5jdGlvbiAobmFtZSkge1xyXG5cdFx0XHRcdHJldHVybiBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFxyXG5cdFx0XHRcdCAgICAgICAgJzwnICsgbmFtZSArICcgeG1sbnM9XCJ1cm46c2NoZW1hcy1taWNyb3NvZnQuY29tOnZtbFwiIGNsYXNzPVwibHZtbFwiPicpO1xyXG5cdFx0XHR9O1xyXG5cdFx0fVxyXG5cdH0oKSksXHJcblxyXG5cdF9pbml0UGF0aDogZnVuY3Rpb24gKCkge1xyXG5cdFx0dmFyIGNvbnRhaW5lciA9IHRoaXMuX2NvbnRhaW5lciA9IHRoaXMuX2NyZWF0ZUVsZW1lbnQoJ3NoYXBlJyk7XHJcblxyXG5cdFx0TC5Eb21VdGlsLmFkZENsYXNzKGNvbnRhaW5lciwgJ2xlYWZsZXQtdm1sLXNoYXBlJyArXHJcblx0XHRcdCh0aGlzLm9wdGlvbnMuY2xhc3NOYW1lID8gJyAnICsgdGhpcy5vcHRpb25zLmNsYXNzTmFtZSA6ICcnKSk7XHJcblxyXG5cdFx0aWYgKHRoaXMub3B0aW9ucy5jbGlja2FibGUpIHtcclxuXHRcdFx0TC5Eb21VdGlsLmFkZENsYXNzKGNvbnRhaW5lciwgJ2xlYWZsZXQtY2xpY2thYmxlJyk7XHJcblx0XHR9XHJcblxyXG5cdFx0Y29udGFpbmVyLmNvb3Jkc2l6ZSA9ICcxIDEnO1xyXG5cclxuXHRcdHRoaXMuX3BhdGggPSB0aGlzLl9jcmVhdGVFbGVtZW50KCdwYXRoJyk7XHJcblx0XHRjb250YWluZXIuYXBwZW5kQ2hpbGQodGhpcy5fcGF0aCk7XHJcblxyXG5cdFx0dGhpcy5fbWFwLl9wYXRoUm9vdC5hcHBlbmRDaGlsZChjb250YWluZXIpO1xyXG5cdH0sXHJcblxyXG5cdF9pbml0U3R5bGU6IGZ1bmN0aW9uICgpIHtcclxuXHRcdHRoaXMuX3VwZGF0ZVN0eWxlKCk7XHJcblx0fSxcclxuXHJcblx0X3VwZGF0ZVN0eWxlOiBmdW5jdGlvbiAoKSB7XHJcblx0XHR2YXIgc3Ryb2tlID0gdGhpcy5fc3Ryb2tlLFxyXG5cdFx0ICAgIGZpbGwgPSB0aGlzLl9maWxsLFxyXG5cdFx0ICAgIG9wdGlvbnMgPSB0aGlzLm9wdGlvbnMsXHJcblx0XHQgICAgY29udGFpbmVyID0gdGhpcy5fY29udGFpbmVyO1xyXG5cclxuXHRcdGNvbnRhaW5lci5zdHJva2VkID0gb3B0aW9ucy5zdHJva2U7XHJcblx0XHRjb250YWluZXIuZmlsbGVkID0gb3B0aW9ucy5maWxsO1xyXG5cclxuXHRcdGlmIChvcHRpb25zLnN0cm9rZSkge1xyXG5cdFx0XHRpZiAoIXN0cm9rZSkge1xyXG5cdFx0XHRcdHN0cm9rZSA9IHRoaXMuX3N0cm9rZSA9IHRoaXMuX2NyZWF0ZUVsZW1lbnQoJ3N0cm9rZScpO1xyXG5cdFx0XHRcdHN0cm9rZS5lbmRjYXAgPSAncm91bmQnO1xyXG5cdFx0XHRcdGNvbnRhaW5lci5hcHBlbmRDaGlsZChzdHJva2UpO1xyXG5cdFx0XHR9XHJcblx0XHRcdHN0cm9rZS53ZWlnaHQgPSBvcHRpb25zLndlaWdodCArICdweCc7XHJcblx0XHRcdHN0cm9rZS5jb2xvciA9IG9wdGlvbnMuY29sb3I7XHJcblx0XHRcdHN0cm9rZS5vcGFjaXR5ID0gb3B0aW9ucy5vcGFjaXR5O1xyXG5cclxuXHRcdFx0aWYgKG9wdGlvbnMuZGFzaEFycmF5KSB7XHJcblx0XHRcdFx0c3Ryb2tlLmRhc2hTdHlsZSA9IEwuVXRpbC5pc0FycmF5KG9wdGlvbnMuZGFzaEFycmF5KSA/XHJcblx0XHRcdFx0ICAgIG9wdGlvbnMuZGFzaEFycmF5LmpvaW4oJyAnKSA6XHJcblx0XHRcdFx0ICAgIG9wdGlvbnMuZGFzaEFycmF5LnJlcGxhY2UoLyggKiwgKikvZywgJyAnKTtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRzdHJva2UuZGFzaFN0eWxlID0gJyc7XHJcblx0XHRcdH1cclxuXHRcdFx0aWYgKG9wdGlvbnMubGluZUNhcCkge1xyXG5cdFx0XHRcdHN0cm9rZS5lbmRjYXAgPSBvcHRpb25zLmxpbmVDYXAucmVwbGFjZSgnYnV0dCcsICdmbGF0Jyk7XHJcblx0XHRcdH1cclxuXHRcdFx0aWYgKG9wdGlvbnMubGluZUpvaW4pIHtcclxuXHRcdFx0XHRzdHJva2Uuam9pbnN0eWxlID0gb3B0aW9ucy5saW5lSm9pbjtcclxuXHRcdFx0fVxyXG5cclxuXHRcdH0gZWxzZSBpZiAoc3Ryb2tlKSB7XHJcblx0XHRcdGNvbnRhaW5lci5yZW1vdmVDaGlsZChzdHJva2UpO1xyXG5cdFx0XHR0aGlzLl9zdHJva2UgPSBudWxsO1xyXG5cdFx0fVxyXG5cclxuXHRcdGlmIChvcHRpb25zLmZpbGwpIHtcclxuXHRcdFx0aWYgKCFmaWxsKSB7XHJcblx0XHRcdFx0ZmlsbCA9IHRoaXMuX2ZpbGwgPSB0aGlzLl9jcmVhdGVFbGVtZW50KCdmaWxsJyk7XHJcblx0XHRcdFx0Y29udGFpbmVyLmFwcGVuZENoaWxkKGZpbGwpO1xyXG5cdFx0XHR9XHJcblx0XHRcdGZpbGwuY29sb3IgPSBvcHRpb25zLmZpbGxDb2xvciB8fCBvcHRpb25zLmNvbG9yO1xyXG5cdFx0XHRmaWxsLm9wYWNpdHkgPSBvcHRpb25zLmZpbGxPcGFjaXR5O1xyXG5cclxuXHRcdH0gZWxzZSBpZiAoZmlsbCkge1xyXG5cdFx0XHRjb250YWluZXIucmVtb3ZlQ2hpbGQoZmlsbCk7XHJcblx0XHRcdHRoaXMuX2ZpbGwgPSBudWxsO1xyXG5cdFx0fVxyXG5cdH0sXHJcblxyXG5cdF91cGRhdGVQYXRoOiBmdW5jdGlvbiAoKSB7XHJcblx0XHR2YXIgc3R5bGUgPSB0aGlzLl9jb250YWluZXIuc3R5bGU7XHJcblxyXG5cdFx0c3R5bGUuZGlzcGxheSA9ICdub25lJztcclxuXHRcdHRoaXMuX3BhdGgudiA9IHRoaXMuZ2V0UGF0aFN0cmluZygpICsgJyAnOyAvLyB0aGUgc3BhY2UgZml4ZXMgSUUgZW1wdHkgcGF0aCBzdHJpbmcgYnVnXHJcblx0XHRzdHlsZS5kaXNwbGF5ID0gJyc7XHJcblx0fVxyXG59KTtcclxuXHJcbkwuTWFwLmluY2x1ZGUoTC5Ccm93c2VyLnN2ZyB8fCAhTC5Ccm93c2VyLnZtbCA/IHt9IDoge1xyXG5cdF9pbml0UGF0aFJvb3Q6IGZ1bmN0aW9uICgpIHtcclxuXHRcdGlmICh0aGlzLl9wYXRoUm9vdCkgeyByZXR1cm47IH1cclxuXHJcblx0XHR2YXIgcm9vdCA9IHRoaXMuX3BhdGhSb290ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcblx0XHRyb290LmNsYXNzTmFtZSA9ICdsZWFmbGV0LXZtbC1jb250YWluZXInO1xyXG5cdFx0dGhpcy5fcGFuZXMub3ZlcmxheVBhbmUuYXBwZW5kQ2hpbGQocm9vdCk7XHJcblxyXG5cdFx0dGhpcy5vbignbW92ZWVuZCcsIHRoaXMuX3VwZGF0ZVBhdGhWaWV3cG9ydCk7XHJcblx0XHR0aGlzLl91cGRhdGVQYXRoVmlld3BvcnQoKTtcclxuXHR9XHJcbn0pO1xyXG5cblxuLypcclxuICogVmVjdG9yIHJlbmRlcmluZyBmb3IgYWxsIGJyb3dzZXJzIHRoYXQgc3VwcG9ydCBjYW52YXMuXHJcbiAqL1xyXG5cclxuTC5Ccm93c2VyLmNhbnZhcyA9IChmdW5jdGlvbiAoKSB7XHJcblx0cmV0dXJuICEhZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnY2FudmFzJykuZ2V0Q29udGV4dDtcclxufSgpKTtcclxuXHJcbkwuUGF0aCA9IChMLlBhdGguU1ZHICYmICF3aW5kb3cuTF9QUkVGRVJfQ0FOVkFTKSB8fCAhTC5Ccm93c2VyLmNhbnZhcyA/IEwuUGF0aCA6IEwuUGF0aC5leHRlbmQoe1xyXG5cdHN0YXRpY3M6IHtcclxuXHRcdC8vQ0xJUF9QQURESU5HOiAwLjAyLCAvLyBub3Qgc3VyZSBpZiB0aGVyZSdzIGEgbmVlZCB0byBzZXQgaXQgdG8gYSBzbWFsbCB2YWx1ZVxyXG5cdFx0Q0FOVkFTOiB0cnVlLFxyXG5cdFx0U1ZHOiBmYWxzZVxyXG5cdH0sXHJcblxyXG5cdHJlZHJhdzogZnVuY3Rpb24gKCkge1xyXG5cdFx0aWYgKHRoaXMuX21hcCkge1xyXG5cdFx0XHR0aGlzLnByb2plY3RMYXRsbmdzKCk7XHJcblx0XHRcdHRoaXMuX3JlcXVlc3RVcGRhdGUoKTtcclxuXHRcdH1cclxuXHRcdHJldHVybiB0aGlzO1xyXG5cdH0sXHJcblxyXG5cdHNldFN0eWxlOiBmdW5jdGlvbiAoc3R5bGUpIHtcclxuXHRcdEwuc2V0T3B0aW9ucyh0aGlzLCBzdHlsZSk7XHJcblxyXG5cdFx0aWYgKHRoaXMuX21hcCkge1xyXG5cdFx0XHR0aGlzLl91cGRhdGVTdHlsZSgpO1xyXG5cdFx0XHR0aGlzLl9yZXF1ZXN0VXBkYXRlKCk7XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gdGhpcztcclxuXHR9LFxyXG5cclxuXHRvblJlbW92ZTogZnVuY3Rpb24gKG1hcCkge1xyXG5cdFx0bWFwXHJcblx0XHQgICAgLm9mZigndmlld3Jlc2V0JywgdGhpcy5wcm9qZWN0TGF0bG5ncywgdGhpcylcclxuXHRcdCAgICAub2ZmKCdtb3ZlZW5kJywgdGhpcy5fdXBkYXRlUGF0aCwgdGhpcyk7XHJcblxyXG5cdFx0aWYgKHRoaXMub3B0aW9ucy5jbGlja2FibGUpIHtcclxuXHRcdFx0dGhpcy5fbWFwLm9mZignY2xpY2snLCB0aGlzLl9vbkNsaWNrLCB0aGlzKTtcclxuXHRcdFx0dGhpcy5fbWFwLm9mZignbW91c2Vtb3ZlJywgdGhpcy5fb25Nb3VzZU1vdmUsIHRoaXMpO1xyXG5cdFx0fVxyXG5cclxuXHRcdHRoaXMuX3JlcXVlc3RVcGRhdGUoKTtcclxuXHRcdFxyXG5cdFx0dGhpcy5maXJlKCdyZW1vdmUnKTtcclxuXHRcdHRoaXMuX21hcCA9IG51bGw7XHJcblx0fSxcclxuXHJcblx0X3JlcXVlc3RVcGRhdGU6IGZ1bmN0aW9uICgpIHtcclxuXHRcdGlmICh0aGlzLl9tYXAgJiYgIUwuUGF0aC5fdXBkYXRlUmVxdWVzdCkge1xyXG5cdFx0XHRMLlBhdGguX3VwZGF0ZVJlcXVlc3QgPSBMLlV0aWwucmVxdWVzdEFuaW1GcmFtZSh0aGlzLl9maXJlTWFwTW92ZUVuZCwgdGhpcy5fbWFwKTtcclxuXHRcdH1cclxuXHR9LFxyXG5cclxuXHRfZmlyZU1hcE1vdmVFbmQ6IGZ1bmN0aW9uICgpIHtcclxuXHRcdEwuUGF0aC5fdXBkYXRlUmVxdWVzdCA9IG51bGw7XHJcblx0XHR0aGlzLmZpcmUoJ21vdmVlbmQnKTtcclxuXHR9LFxyXG5cclxuXHRfaW5pdEVsZW1lbnRzOiBmdW5jdGlvbiAoKSB7XHJcblx0XHR0aGlzLl9tYXAuX2luaXRQYXRoUm9vdCgpO1xyXG5cdFx0dGhpcy5fY3R4ID0gdGhpcy5fbWFwLl9jYW52YXNDdHg7XHJcblx0fSxcclxuXHJcblx0X3VwZGF0ZVN0eWxlOiBmdW5jdGlvbiAoKSB7XHJcblx0XHR2YXIgb3B0aW9ucyA9IHRoaXMub3B0aW9ucztcclxuXHJcblx0XHRpZiAob3B0aW9ucy5zdHJva2UpIHtcclxuXHRcdFx0dGhpcy5fY3R4LmxpbmVXaWR0aCA9IG9wdGlvbnMud2VpZ2h0O1xyXG5cdFx0XHR0aGlzLl9jdHguc3Ryb2tlU3R5bGUgPSBvcHRpb25zLmNvbG9yO1xyXG5cdFx0fVxyXG5cdFx0aWYgKG9wdGlvbnMuZmlsbCkge1xyXG5cdFx0XHR0aGlzLl9jdHguZmlsbFN0eWxlID0gb3B0aW9ucy5maWxsQ29sb3IgfHwgb3B0aW9ucy5jb2xvcjtcclxuXHRcdH1cclxuXHR9LFxyXG5cclxuXHRfZHJhd1BhdGg6IGZ1bmN0aW9uICgpIHtcclxuXHRcdHZhciBpLCBqLCBsZW4sIGxlbjIsIHBvaW50LCBkcmF3TWV0aG9kO1xyXG5cclxuXHRcdHRoaXMuX2N0eC5iZWdpblBhdGgoKTtcclxuXHJcblx0XHRmb3IgKGkgPSAwLCBsZW4gPSB0aGlzLl9wYXJ0cy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xyXG5cdFx0XHRmb3IgKGogPSAwLCBsZW4yID0gdGhpcy5fcGFydHNbaV0ubGVuZ3RoOyBqIDwgbGVuMjsgaisrKSB7XHJcblx0XHRcdFx0cG9pbnQgPSB0aGlzLl9wYXJ0c1tpXVtqXTtcclxuXHRcdFx0XHRkcmF3TWV0aG9kID0gKGogPT09IDAgPyAnbW92ZScgOiAnbGluZScpICsgJ1RvJztcclxuXHJcblx0XHRcdFx0dGhpcy5fY3R4W2RyYXdNZXRob2RdKHBvaW50LngsIHBvaW50LnkpO1xyXG5cdFx0XHR9XHJcblx0XHRcdC8vIFRPRE8gcmVmYWN0b3IgdWdseSBoYWNrXHJcblx0XHRcdGlmICh0aGlzIGluc3RhbmNlb2YgTC5Qb2x5Z29uKSB7XHJcblx0XHRcdFx0dGhpcy5fY3R4LmNsb3NlUGF0aCgpO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fSxcclxuXHJcblx0X2NoZWNrSWZFbXB0eTogZnVuY3Rpb24gKCkge1xyXG5cdFx0cmV0dXJuICF0aGlzLl9wYXJ0cy5sZW5ndGg7XHJcblx0fSxcclxuXHJcblx0X3VwZGF0ZVBhdGg6IGZ1bmN0aW9uICgpIHtcclxuXHRcdGlmICh0aGlzLl9jaGVja0lmRW1wdHkoKSkgeyByZXR1cm47IH1cclxuXHJcblx0XHR2YXIgY3R4ID0gdGhpcy5fY3R4LFxyXG5cdFx0ICAgIG9wdGlvbnMgPSB0aGlzLm9wdGlvbnM7XHJcblxyXG5cdFx0dGhpcy5fZHJhd1BhdGgoKTtcclxuXHRcdGN0eC5zYXZlKCk7XHJcblx0XHR0aGlzLl91cGRhdGVTdHlsZSgpO1xyXG5cclxuXHRcdGlmIChvcHRpb25zLmZpbGwpIHtcclxuXHRcdFx0Y3R4Lmdsb2JhbEFscGhhID0gb3B0aW9ucy5maWxsT3BhY2l0eTtcclxuXHRcdFx0Y3R4LmZpbGwoKTtcclxuXHRcdH1cclxuXHJcblx0XHRpZiAob3B0aW9ucy5zdHJva2UpIHtcclxuXHRcdFx0Y3R4Lmdsb2JhbEFscGhhID0gb3B0aW9ucy5vcGFjaXR5O1xyXG5cdFx0XHRjdHguc3Ryb2tlKCk7XHJcblx0XHR9XHJcblxyXG5cdFx0Y3R4LnJlc3RvcmUoKTtcclxuXHJcblx0XHQvLyBUT0RPIG9wdGltaXphdGlvbjogMSBmaWxsL3N0cm9rZSBmb3IgYWxsIGZlYXR1cmVzIHdpdGggZXF1YWwgc3R5bGUgaW5zdGVhZCBvZiAxIGZvciBlYWNoIGZlYXR1cmVcclxuXHR9LFxyXG5cclxuXHRfaW5pdEV2ZW50czogZnVuY3Rpb24gKCkge1xyXG5cdFx0aWYgKHRoaXMub3B0aW9ucy5jbGlja2FibGUpIHtcclxuXHRcdFx0Ly8gVE9ETyBkYmxjbGlja1xyXG5cdFx0XHR0aGlzLl9tYXAub24oJ21vdXNlbW92ZScsIHRoaXMuX29uTW91c2VNb3ZlLCB0aGlzKTtcclxuXHRcdFx0dGhpcy5fbWFwLm9uKCdjbGljaycsIHRoaXMuX29uQ2xpY2ssIHRoaXMpO1xyXG5cdFx0fVxyXG5cdH0sXHJcblxyXG5cdF9vbkNsaWNrOiBmdW5jdGlvbiAoZSkge1xyXG5cdFx0aWYgKHRoaXMuX2NvbnRhaW5zUG9pbnQoZS5sYXllclBvaW50KSkge1xyXG5cdFx0XHR0aGlzLmZpcmUoJ2NsaWNrJywgZSk7XHJcblx0XHR9XHJcblx0fSxcclxuXHJcblx0X29uTW91c2VNb3ZlOiBmdW5jdGlvbiAoZSkge1xyXG5cdFx0aWYgKCF0aGlzLl9tYXAgfHwgdGhpcy5fbWFwLl9hbmltYXRpbmdab29tKSB7IHJldHVybjsgfVxyXG5cclxuXHRcdC8vIFRPRE8gZG9uJ3QgZG8gb24gZWFjaCBtb3ZlXHJcblx0XHRpZiAodGhpcy5fY29udGFpbnNQb2ludChlLmxheWVyUG9pbnQpKSB7XHJcblx0XHRcdHRoaXMuX2N0eC5jYW52YXMuc3R5bGUuY3Vyc29yID0gJ3BvaW50ZXInO1xyXG5cdFx0XHR0aGlzLl9tb3VzZUluc2lkZSA9IHRydWU7XHJcblx0XHRcdHRoaXMuZmlyZSgnbW91c2VvdmVyJywgZSk7XHJcblxyXG5cdFx0fSBlbHNlIGlmICh0aGlzLl9tb3VzZUluc2lkZSkge1xyXG5cdFx0XHR0aGlzLl9jdHguY2FudmFzLnN0eWxlLmN1cnNvciA9ICcnO1xyXG5cdFx0XHR0aGlzLl9tb3VzZUluc2lkZSA9IGZhbHNlO1xyXG5cdFx0XHR0aGlzLmZpcmUoJ21vdXNlb3V0JywgZSk7XHJcblx0XHR9XHJcblx0fVxyXG59KTtcclxuXHJcbkwuTWFwLmluY2x1ZGUoKEwuUGF0aC5TVkcgJiYgIXdpbmRvdy5MX1BSRUZFUl9DQU5WQVMpIHx8ICFMLkJyb3dzZXIuY2FudmFzID8ge30gOiB7XHJcblx0X2luaXRQYXRoUm9vdDogZnVuY3Rpb24gKCkge1xyXG5cdFx0dmFyIHJvb3QgPSB0aGlzLl9wYXRoUm9vdCxcclxuXHRcdCAgICBjdHg7XHJcblxyXG5cdFx0aWYgKCFyb290KSB7XHJcblx0XHRcdHJvb3QgPSB0aGlzLl9wYXRoUm9vdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2NhbnZhcycpO1xyXG5cdFx0XHRyb290LnN0eWxlLnBvc2l0aW9uID0gJ2Fic29sdXRlJztcclxuXHRcdFx0Y3R4ID0gdGhpcy5fY2FudmFzQ3R4ID0gcm9vdC5nZXRDb250ZXh0KCcyZCcpO1xyXG5cclxuXHRcdFx0Y3R4LmxpbmVDYXAgPSAncm91bmQnO1xyXG5cdFx0XHRjdHgubGluZUpvaW4gPSAncm91bmQnO1xyXG5cclxuXHRcdFx0dGhpcy5fcGFuZXMub3ZlcmxheVBhbmUuYXBwZW5kQ2hpbGQocm9vdCk7XHJcblxyXG5cdFx0XHRpZiAodGhpcy5vcHRpb25zLnpvb21BbmltYXRpb24pIHtcclxuXHRcdFx0XHR0aGlzLl9wYXRoUm9vdC5jbGFzc05hbWUgPSAnbGVhZmxldC16b29tLWFuaW1hdGVkJztcclxuXHRcdFx0XHR0aGlzLm9uKCd6b29tYW5pbScsIHRoaXMuX2FuaW1hdGVQYXRoWm9vbSk7XHJcblx0XHRcdFx0dGhpcy5vbignem9vbWVuZCcsIHRoaXMuX2VuZFBhdGhab29tKTtcclxuXHRcdFx0fVxyXG5cdFx0XHR0aGlzLm9uKCdtb3ZlZW5kJywgdGhpcy5fdXBkYXRlQ2FudmFzVmlld3BvcnQpO1xyXG5cdFx0XHR0aGlzLl91cGRhdGVDYW52YXNWaWV3cG9ydCgpO1xyXG5cdFx0fVxyXG5cdH0sXHJcblxyXG5cdF91cGRhdGVDYW52YXNWaWV3cG9ydDogZnVuY3Rpb24gKCkge1xyXG5cdFx0Ly8gZG9uJ3QgcmVkcmF3IHdoaWxlIHpvb21pbmcuIFNlZSBfdXBkYXRlU3ZnVmlld3BvcnQgZm9yIG1vcmUgZGV0YWlsc1xyXG5cdFx0aWYgKHRoaXMuX3BhdGhab29taW5nKSB7IHJldHVybjsgfVxyXG5cdFx0dGhpcy5fdXBkYXRlUGF0aFZpZXdwb3J0KCk7XHJcblxyXG5cdFx0dmFyIHZwID0gdGhpcy5fcGF0aFZpZXdwb3J0LFxyXG5cdFx0ICAgIG1pbiA9IHZwLm1pbixcclxuXHRcdCAgICBzaXplID0gdnAubWF4LnN1YnRyYWN0KG1pbiksXHJcblx0XHQgICAgcm9vdCA9IHRoaXMuX3BhdGhSb290O1xyXG5cclxuXHRcdC8vVE9ETyBjaGVjayBpZiB0aGlzIHdvcmtzIHByb3Blcmx5IG9uIG1vYmlsZSB3ZWJraXRcclxuXHRcdEwuRG9tVXRpbC5zZXRQb3NpdGlvbihyb290LCBtaW4pO1xyXG5cdFx0cm9vdC53aWR0aCA9IHNpemUueDtcclxuXHRcdHJvb3QuaGVpZ2h0ID0gc2l6ZS55O1xyXG5cdFx0cm9vdC5nZXRDb250ZXh0KCcyZCcpLnRyYW5zbGF0ZSgtbWluLngsIC1taW4ueSk7XHJcblx0fVxyXG59KTtcclxuXG5cbi8qXHJcbiAqIEwuTGluZVV0aWwgY29udGFpbnMgZGlmZmVyZW50IHV0aWxpdHkgZnVuY3Rpb25zIGZvciBsaW5lIHNlZ21lbnRzXHJcbiAqIGFuZCBwb2x5bGluZXMgKGNsaXBwaW5nLCBzaW1wbGlmaWNhdGlvbiwgZGlzdGFuY2VzLCBldGMuKVxyXG4gKi9cclxuXHJcbi8qanNoaW50IGJpdHdpc2U6ZmFsc2UgKi8gLy8gYWxsb3cgYml0d2lzZSBvcGVyYXRpb25zIGZvciB0aGlzIGZpbGVcclxuXHJcbkwuTGluZVV0aWwgPSB7XHJcblxyXG5cdC8vIFNpbXBsaWZ5IHBvbHlsaW5lIHdpdGggdmVydGV4IHJlZHVjdGlvbiBhbmQgRG91Z2xhcy1QZXVja2VyIHNpbXBsaWZpY2F0aW9uLlxyXG5cdC8vIEltcHJvdmVzIHJlbmRlcmluZyBwZXJmb3JtYW5jZSBkcmFtYXRpY2FsbHkgYnkgbGVzc2VuaW5nIHRoZSBudW1iZXIgb2YgcG9pbnRzIHRvIGRyYXcuXHJcblxyXG5cdHNpbXBsaWZ5OiBmdW5jdGlvbiAoLypQb2ludFtdKi8gcG9pbnRzLCAvKk51bWJlciovIHRvbGVyYW5jZSkge1xyXG5cdFx0aWYgKCF0b2xlcmFuY2UgfHwgIXBvaW50cy5sZW5ndGgpIHtcclxuXHRcdFx0cmV0dXJuIHBvaW50cy5zbGljZSgpO1xyXG5cdFx0fVxyXG5cclxuXHRcdHZhciBzcVRvbGVyYW5jZSA9IHRvbGVyYW5jZSAqIHRvbGVyYW5jZTtcclxuXHJcblx0XHQvLyBzdGFnZSAxOiB2ZXJ0ZXggcmVkdWN0aW9uXHJcblx0XHRwb2ludHMgPSB0aGlzLl9yZWR1Y2VQb2ludHMocG9pbnRzLCBzcVRvbGVyYW5jZSk7XHJcblxyXG5cdFx0Ly8gc3RhZ2UgMjogRG91Z2xhcy1QZXVja2VyIHNpbXBsaWZpY2F0aW9uXHJcblx0XHRwb2ludHMgPSB0aGlzLl9zaW1wbGlmeURQKHBvaW50cywgc3FUb2xlcmFuY2UpO1xyXG5cclxuXHRcdHJldHVybiBwb2ludHM7XHJcblx0fSxcclxuXHJcblx0Ly8gZGlzdGFuY2UgZnJvbSBhIHBvaW50IHRvIGEgc2VnbWVudCBiZXR3ZWVuIHR3byBwb2ludHNcclxuXHRwb2ludFRvU2VnbWVudERpc3RhbmNlOiAgZnVuY3Rpb24gKC8qUG9pbnQqLyBwLCAvKlBvaW50Ki8gcDEsIC8qUG9pbnQqLyBwMikge1xyXG5cdFx0cmV0dXJuIE1hdGguc3FydCh0aGlzLl9zcUNsb3Nlc3RQb2ludE9uU2VnbWVudChwLCBwMSwgcDIsIHRydWUpKTtcclxuXHR9LFxyXG5cclxuXHRjbG9zZXN0UG9pbnRPblNlZ21lbnQ6IGZ1bmN0aW9uICgvKlBvaW50Ki8gcCwgLypQb2ludCovIHAxLCAvKlBvaW50Ki8gcDIpIHtcclxuXHRcdHJldHVybiB0aGlzLl9zcUNsb3Nlc3RQb2ludE9uU2VnbWVudChwLCBwMSwgcDIpO1xyXG5cdH0sXHJcblxyXG5cdC8vIERvdWdsYXMtUGV1Y2tlciBzaW1wbGlmaWNhdGlvbiwgc2VlIGh0dHA6Ly9lbi53aWtpcGVkaWEub3JnL3dpa2kvRG91Z2xhcy1QZXVja2VyX2FsZ29yaXRobVxyXG5cdF9zaW1wbGlmeURQOiBmdW5jdGlvbiAocG9pbnRzLCBzcVRvbGVyYW5jZSkge1xyXG5cclxuXHRcdHZhciBsZW4gPSBwb2ludHMubGVuZ3RoLFxyXG5cdFx0ICAgIEFycmF5Q29uc3RydWN0b3IgPSB0eXBlb2YgVWludDhBcnJheSAhPT0gdW5kZWZpbmVkICsgJycgPyBVaW50OEFycmF5IDogQXJyYXksXHJcblx0XHQgICAgbWFya2VycyA9IG5ldyBBcnJheUNvbnN0cnVjdG9yKGxlbik7XHJcblxyXG5cdFx0bWFya2Vyc1swXSA9IG1hcmtlcnNbbGVuIC0gMV0gPSAxO1xyXG5cclxuXHRcdHRoaXMuX3NpbXBsaWZ5RFBTdGVwKHBvaW50cywgbWFya2Vycywgc3FUb2xlcmFuY2UsIDAsIGxlbiAtIDEpO1xyXG5cclxuXHRcdHZhciBpLFxyXG5cdFx0ICAgIG5ld1BvaW50cyA9IFtdO1xyXG5cclxuXHRcdGZvciAoaSA9IDA7IGkgPCBsZW47IGkrKykge1xyXG5cdFx0XHRpZiAobWFya2Vyc1tpXSkge1xyXG5cdFx0XHRcdG5ld1BvaW50cy5wdXNoKHBvaW50c1tpXSk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0XHRyZXR1cm4gbmV3UG9pbnRzO1xyXG5cdH0sXHJcblxyXG5cdF9zaW1wbGlmeURQU3RlcDogZnVuY3Rpb24gKHBvaW50cywgbWFya2Vycywgc3FUb2xlcmFuY2UsIGZpcnN0LCBsYXN0KSB7XHJcblxyXG5cdFx0dmFyIG1heFNxRGlzdCA9IDAsXHJcblx0XHQgICAgaW5kZXgsIGksIHNxRGlzdDtcclxuXHJcblx0XHRmb3IgKGkgPSBmaXJzdCArIDE7IGkgPD0gbGFzdCAtIDE7IGkrKykge1xyXG5cdFx0XHRzcURpc3QgPSB0aGlzLl9zcUNsb3Nlc3RQb2ludE9uU2VnbWVudChwb2ludHNbaV0sIHBvaW50c1tmaXJzdF0sIHBvaW50c1tsYXN0XSwgdHJ1ZSk7XHJcblxyXG5cdFx0XHRpZiAoc3FEaXN0ID4gbWF4U3FEaXN0KSB7XHJcblx0XHRcdFx0aW5kZXggPSBpO1xyXG5cdFx0XHRcdG1heFNxRGlzdCA9IHNxRGlzdDtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHRcdGlmIChtYXhTcURpc3QgPiBzcVRvbGVyYW5jZSkge1xyXG5cdFx0XHRtYXJrZXJzW2luZGV4XSA9IDE7XHJcblxyXG5cdFx0XHR0aGlzLl9zaW1wbGlmeURQU3RlcChwb2ludHMsIG1hcmtlcnMsIHNxVG9sZXJhbmNlLCBmaXJzdCwgaW5kZXgpO1xyXG5cdFx0XHR0aGlzLl9zaW1wbGlmeURQU3RlcChwb2ludHMsIG1hcmtlcnMsIHNxVG9sZXJhbmNlLCBpbmRleCwgbGFzdCk7XHJcblx0XHR9XHJcblx0fSxcclxuXHJcblx0Ly8gcmVkdWNlIHBvaW50cyB0aGF0IGFyZSB0b28gY2xvc2UgdG8gZWFjaCBvdGhlciB0byBhIHNpbmdsZSBwb2ludFxyXG5cdF9yZWR1Y2VQb2ludHM6IGZ1bmN0aW9uIChwb2ludHMsIHNxVG9sZXJhbmNlKSB7XHJcblx0XHR2YXIgcmVkdWNlZFBvaW50cyA9IFtwb2ludHNbMF1dO1xyXG5cclxuXHRcdGZvciAodmFyIGkgPSAxLCBwcmV2ID0gMCwgbGVuID0gcG9pbnRzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XHJcblx0XHRcdGlmICh0aGlzLl9zcURpc3QocG9pbnRzW2ldLCBwb2ludHNbcHJldl0pID4gc3FUb2xlcmFuY2UpIHtcclxuXHRcdFx0XHRyZWR1Y2VkUG9pbnRzLnB1c2gocG9pbnRzW2ldKTtcclxuXHRcdFx0XHRwcmV2ID0gaTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0aWYgKHByZXYgPCBsZW4gLSAxKSB7XHJcblx0XHRcdHJlZHVjZWRQb2ludHMucHVzaChwb2ludHNbbGVuIC0gMV0pO1xyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIHJlZHVjZWRQb2ludHM7XHJcblx0fSxcclxuXHJcblx0Ly8gQ29oZW4tU3V0aGVybGFuZCBsaW5lIGNsaXBwaW5nIGFsZ29yaXRobS5cclxuXHQvLyBVc2VkIHRvIGF2b2lkIHJlbmRlcmluZyBwYXJ0cyBvZiBhIHBvbHlsaW5lIHRoYXQgYXJlIG5vdCBjdXJyZW50bHkgdmlzaWJsZS5cclxuXHJcblx0Y2xpcFNlZ21lbnQ6IGZ1bmN0aW9uIChhLCBiLCBib3VuZHMsIHVzZUxhc3RDb2RlKSB7XHJcblx0XHR2YXIgY29kZUEgPSB1c2VMYXN0Q29kZSA/IHRoaXMuX2xhc3RDb2RlIDogdGhpcy5fZ2V0Qml0Q29kZShhLCBib3VuZHMpLFxyXG5cdFx0ICAgIGNvZGVCID0gdGhpcy5fZ2V0Qml0Q29kZShiLCBib3VuZHMpLFxyXG5cclxuXHRcdCAgICBjb2RlT3V0LCBwLCBuZXdDb2RlO1xyXG5cclxuXHRcdC8vIHNhdmUgMm5kIGNvZGUgdG8gYXZvaWQgY2FsY3VsYXRpbmcgaXQgb24gdGhlIG5leHQgc2VnbWVudFxyXG5cdFx0dGhpcy5fbGFzdENvZGUgPSBjb2RlQjtcclxuXHJcblx0XHR3aGlsZSAodHJ1ZSkge1xyXG5cdFx0XHQvLyBpZiBhLGIgaXMgaW5zaWRlIHRoZSBjbGlwIHdpbmRvdyAodHJpdmlhbCBhY2NlcHQpXHJcblx0XHRcdGlmICghKGNvZGVBIHwgY29kZUIpKSB7XHJcblx0XHRcdFx0cmV0dXJuIFthLCBiXTtcclxuXHRcdFx0Ly8gaWYgYSxiIGlzIG91dHNpZGUgdGhlIGNsaXAgd2luZG93ICh0cml2aWFsIHJlamVjdClcclxuXHRcdFx0fSBlbHNlIGlmIChjb2RlQSAmIGNvZGVCKSB7XHJcblx0XHRcdFx0cmV0dXJuIGZhbHNlO1xyXG5cdFx0XHQvLyBvdGhlciBjYXNlc1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdGNvZGVPdXQgPSBjb2RlQSB8fCBjb2RlQjtcclxuXHRcdFx0XHRwID0gdGhpcy5fZ2V0RWRnZUludGVyc2VjdGlvbihhLCBiLCBjb2RlT3V0LCBib3VuZHMpO1xyXG5cdFx0XHRcdG5ld0NvZGUgPSB0aGlzLl9nZXRCaXRDb2RlKHAsIGJvdW5kcyk7XHJcblxyXG5cdFx0XHRcdGlmIChjb2RlT3V0ID09PSBjb2RlQSkge1xyXG5cdFx0XHRcdFx0YSA9IHA7XHJcblx0XHRcdFx0XHRjb2RlQSA9IG5ld0NvZGU7XHJcblx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdGIgPSBwO1xyXG5cdFx0XHRcdFx0Y29kZUIgPSBuZXdDb2RlO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH0sXHJcblxyXG5cdF9nZXRFZGdlSW50ZXJzZWN0aW9uOiBmdW5jdGlvbiAoYSwgYiwgY29kZSwgYm91bmRzKSB7XHJcblx0XHR2YXIgZHggPSBiLnggLSBhLngsXHJcblx0XHQgICAgZHkgPSBiLnkgLSBhLnksXHJcblx0XHQgICAgbWluID0gYm91bmRzLm1pbixcclxuXHRcdCAgICBtYXggPSBib3VuZHMubWF4O1xyXG5cclxuXHRcdGlmIChjb2RlICYgOCkgeyAvLyB0b3BcclxuXHRcdFx0cmV0dXJuIG5ldyBMLlBvaW50KGEueCArIGR4ICogKG1heC55IC0gYS55KSAvIGR5LCBtYXgueSk7XHJcblx0XHR9IGVsc2UgaWYgKGNvZGUgJiA0KSB7IC8vIGJvdHRvbVxyXG5cdFx0XHRyZXR1cm4gbmV3IEwuUG9pbnQoYS54ICsgZHggKiAobWluLnkgLSBhLnkpIC8gZHksIG1pbi55KTtcclxuXHRcdH0gZWxzZSBpZiAoY29kZSAmIDIpIHsgLy8gcmlnaHRcclxuXHRcdFx0cmV0dXJuIG5ldyBMLlBvaW50KG1heC54LCBhLnkgKyBkeSAqIChtYXgueCAtIGEueCkgLyBkeCk7XHJcblx0XHR9IGVsc2UgaWYgKGNvZGUgJiAxKSB7IC8vIGxlZnRcclxuXHRcdFx0cmV0dXJuIG5ldyBMLlBvaW50KG1pbi54LCBhLnkgKyBkeSAqIChtaW4ueCAtIGEueCkgLyBkeCk7XHJcblx0XHR9XHJcblx0fSxcclxuXHJcblx0X2dldEJpdENvZGU6IGZ1bmN0aW9uICgvKlBvaW50Ki8gcCwgYm91bmRzKSB7XHJcblx0XHR2YXIgY29kZSA9IDA7XHJcblxyXG5cdFx0aWYgKHAueCA8IGJvdW5kcy5taW4ueCkgeyAvLyBsZWZ0XHJcblx0XHRcdGNvZGUgfD0gMTtcclxuXHRcdH0gZWxzZSBpZiAocC54ID4gYm91bmRzLm1heC54KSB7IC8vIHJpZ2h0XHJcblx0XHRcdGNvZGUgfD0gMjtcclxuXHRcdH1cclxuXHRcdGlmIChwLnkgPCBib3VuZHMubWluLnkpIHsgLy8gYm90dG9tXHJcblx0XHRcdGNvZGUgfD0gNDtcclxuXHRcdH0gZWxzZSBpZiAocC55ID4gYm91bmRzLm1heC55KSB7IC8vIHRvcFxyXG5cdFx0XHRjb2RlIHw9IDg7XHJcblx0XHR9XHJcblxyXG5cdFx0cmV0dXJuIGNvZGU7XHJcblx0fSxcclxuXHJcblx0Ly8gc3F1YXJlIGRpc3RhbmNlICh0byBhdm9pZCB1bm5lY2Vzc2FyeSBNYXRoLnNxcnQgY2FsbHMpXHJcblx0X3NxRGlzdDogZnVuY3Rpb24gKHAxLCBwMikge1xyXG5cdFx0dmFyIGR4ID0gcDIueCAtIHAxLngsXHJcblx0XHQgICAgZHkgPSBwMi55IC0gcDEueTtcclxuXHRcdHJldHVybiBkeCAqIGR4ICsgZHkgKiBkeTtcclxuXHR9LFxyXG5cclxuXHQvLyByZXR1cm4gY2xvc2VzdCBwb2ludCBvbiBzZWdtZW50IG9yIGRpc3RhbmNlIHRvIHRoYXQgcG9pbnRcclxuXHRfc3FDbG9zZXN0UG9pbnRPblNlZ21lbnQ6IGZ1bmN0aW9uIChwLCBwMSwgcDIsIHNxRGlzdCkge1xyXG5cdFx0dmFyIHggPSBwMS54LFxyXG5cdFx0ICAgIHkgPSBwMS55LFxyXG5cdFx0ICAgIGR4ID0gcDIueCAtIHgsXHJcblx0XHQgICAgZHkgPSBwMi55IC0geSxcclxuXHRcdCAgICBkb3QgPSBkeCAqIGR4ICsgZHkgKiBkeSxcclxuXHRcdCAgICB0O1xyXG5cclxuXHRcdGlmIChkb3QgPiAwKSB7XHJcblx0XHRcdHQgPSAoKHAueCAtIHgpICogZHggKyAocC55IC0geSkgKiBkeSkgLyBkb3Q7XHJcblxyXG5cdFx0XHRpZiAodCA+IDEpIHtcclxuXHRcdFx0XHR4ID0gcDIueDtcclxuXHRcdFx0XHR5ID0gcDIueTtcclxuXHRcdFx0fSBlbHNlIGlmICh0ID4gMCkge1xyXG5cdFx0XHRcdHggKz0gZHggKiB0O1xyXG5cdFx0XHRcdHkgKz0gZHkgKiB0O1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0ZHggPSBwLnggLSB4O1xyXG5cdFx0ZHkgPSBwLnkgLSB5O1xyXG5cclxuXHRcdHJldHVybiBzcURpc3QgPyBkeCAqIGR4ICsgZHkgKiBkeSA6IG5ldyBMLlBvaW50KHgsIHkpO1xyXG5cdH1cclxufTtcclxuXG5cbi8qXHJcbiAqIEwuUG9seWxpbmUgaXMgdXNlZCB0byBkaXNwbGF5IHBvbHlsaW5lcyBvbiBhIG1hcC5cclxuICovXHJcblxyXG5MLlBvbHlsaW5lID0gTC5QYXRoLmV4dGVuZCh7XHJcblx0aW5pdGlhbGl6ZTogZnVuY3Rpb24gKGxhdGxuZ3MsIG9wdGlvbnMpIHtcclxuXHRcdEwuUGF0aC5wcm90b3R5cGUuaW5pdGlhbGl6ZS5jYWxsKHRoaXMsIG9wdGlvbnMpO1xyXG5cclxuXHRcdHRoaXMuX2xhdGxuZ3MgPSB0aGlzLl9jb252ZXJ0TGF0TG5ncyhsYXRsbmdzKTtcclxuXHR9LFxyXG5cclxuXHRvcHRpb25zOiB7XHJcblx0XHQvLyBob3cgbXVjaCB0byBzaW1wbGlmeSB0aGUgcG9seWxpbmUgb24gZWFjaCB6b29tIGxldmVsXHJcblx0XHQvLyBtb3JlID0gYmV0dGVyIHBlcmZvcm1hbmNlIGFuZCBzbW9vdGhlciBsb29rLCBsZXNzID0gbW9yZSBhY2N1cmF0ZVxyXG5cdFx0c21vb3RoRmFjdG9yOiAxLjAsXHJcblx0XHRub0NsaXA6IGZhbHNlXHJcblx0fSxcclxuXHJcblx0cHJvamVjdExhdGxuZ3M6IGZ1bmN0aW9uICgpIHtcclxuXHRcdHRoaXMuX29yaWdpbmFsUG9pbnRzID0gW107XHJcblxyXG5cdFx0Zm9yICh2YXIgaSA9IDAsIGxlbiA9IHRoaXMuX2xhdGxuZ3MubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcclxuXHRcdFx0dGhpcy5fb3JpZ2luYWxQb2ludHNbaV0gPSB0aGlzLl9tYXAubGF0TG5nVG9MYXllclBvaW50KHRoaXMuX2xhdGxuZ3NbaV0pO1xyXG5cdFx0fVxyXG5cdH0sXHJcblxyXG5cdGdldFBhdGhTdHJpbmc6IGZ1bmN0aW9uICgpIHtcclxuXHRcdGZvciAodmFyIGkgPSAwLCBsZW4gPSB0aGlzLl9wYXJ0cy5sZW5ndGgsIHN0ciA9ICcnOyBpIDwgbGVuOyBpKyspIHtcclxuXHRcdFx0c3RyICs9IHRoaXMuX2dldFBhdGhQYXJ0U3RyKHRoaXMuX3BhcnRzW2ldKTtcclxuXHRcdH1cclxuXHRcdHJldHVybiBzdHI7XHJcblx0fSxcclxuXHJcblx0Z2V0TGF0TG5nczogZnVuY3Rpb24gKCkge1xyXG5cdFx0cmV0dXJuIHRoaXMuX2xhdGxuZ3M7XHJcblx0fSxcclxuXHJcblx0c2V0TGF0TG5nczogZnVuY3Rpb24gKGxhdGxuZ3MpIHtcclxuXHRcdHRoaXMuX2xhdGxuZ3MgPSB0aGlzLl9jb252ZXJ0TGF0TG5ncyhsYXRsbmdzKTtcclxuXHRcdHJldHVybiB0aGlzLnJlZHJhdygpO1xyXG5cdH0sXHJcblxyXG5cdGFkZExhdExuZzogZnVuY3Rpb24gKGxhdGxuZykge1xyXG5cdFx0dGhpcy5fbGF0bG5ncy5wdXNoKEwubGF0TG5nKGxhdGxuZykpO1xyXG5cdFx0cmV0dXJuIHRoaXMucmVkcmF3KCk7XHJcblx0fSxcclxuXHJcblx0c3BsaWNlTGF0TG5nczogZnVuY3Rpb24gKCkgeyAvLyAoTnVtYmVyIGluZGV4LCBOdW1iZXIgaG93TWFueSlcclxuXHRcdHZhciByZW1vdmVkID0gW10uc3BsaWNlLmFwcGx5KHRoaXMuX2xhdGxuZ3MsIGFyZ3VtZW50cyk7XHJcblx0XHR0aGlzLl9jb252ZXJ0TGF0TG5ncyh0aGlzLl9sYXRsbmdzLCB0cnVlKTtcclxuXHRcdHRoaXMucmVkcmF3KCk7XHJcblx0XHRyZXR1cm4gcmVtb3ZlZDtcclxuXHR9LFxyXG5cclxuXHRjbG9zZXN0TGF5ZXJQb2ludDogZnVuY3Rpb24gKHApIHtcclxuXHRcdHZhciBtaW5EaXN0YW5jZSA9IEluZmluaXR5LCBwYXJ0cyA9IHRoaXMuX3BhcnRzLCBwMSwgcDIsIG1pblBvaW50ID0gbnVsbDtcclxuXHJcblx0XHRmb3IgKHZhciBqID0gMCwgakxlbiA9IHBhcnRzLmxlbmd0aDsgaiA8IGpMZW47IGorKykge1xyXG5cdFx0XHR2YXIgcG9pbnRzID0gcGFydHNbal07XHJcblx0XHRcdGZvciAodmFyIGkgPSAxLCBsZW4gPSBwb2ludHMubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcclxuXHRcdFx0XHRwMSA9IHBvaW50c1tpIC0gMV07XHJcblx0XHRcdFx0cDIgPSBwb2ludHNbaV07XHJcblx0XHRcdFx0dmFyIHNxRGlzdCA9IEwuTGluZVV0aWwuX3NxQ2xvc2VzdFBvaW50T25TZWdtZW50KHAsIHAxLCBwMiwgdHJ1ZSk7XHJcblx0XHRcdFx0aWYgKHNxRGlzdCA8IG1pbkRpc3RhbmNlKSB7XHJcblx0XHRcdFx0XHRtaW5EaXN0YW5jZSA9IHNxRGlzdDtcclxuXHRcdFx0XHRcdG1pblBvaW50ID0gTC5MaW5lVXRpbC5fc3FDbG9zZXN0UG9pbnRPblNlZ21lbnQocCwgcDEsIHAyKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdGlmIChtaW5Qb2ludCkge1xyXG5cdFx0XHRtaW5Qb2ludC5kaXN0YW5jZSA9IE1hdGguc3FydChtaW5EaXN0YW5jZSk7XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gbWluUG9pbnQ7XHJcblx0fSxcclxuXHJcblx0Z2V0Qm91bmRzOiBmdW5jdGlvbiAoKSB7XHJcblx0XHRyZXR1cm4gbmV3IEwuTGF0TG5nQm91bmRzKHRoaXMuZ2V0TGF0TG5ncygpKTtcclxuXHR9LFxyXG5cclxuXHRfY29udmVydExhdExuZ3M6IGZ1bmN0aW9uIChsYXRsbmdzLCBvdmVyd3JpdGUpIHtcclxuXHRcdHZhciBpLCBsZW4sIHRhcmdldCA9IG92ZXJ3cml0ZSA/IGxhdGxuZ3MgOiBbXTtcclxuXHJcblx0XHRmb3IgKGkgPSAwLCBsZW4gPSBsYXRsbmdzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XHJcblx0XHRcdGlmIChMLlV0aWwuaXNBcnJheShsYXRsbmdzW2ldKSAmJiB0eXBlb2YgbGF0bG5nc1tpXVswXSAhPT0gJ251bWJlcicpIHtcclxuXHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdH1cclxuXHRcdFx0dGFyZ2V0W2ldID0gTC5sYXRMbmcobGF0bG5nc1tpXSk7XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gdGFyZ2V0O1xyXG5cdH0sXHJcblxyXG5cdF9pbml0RXZlbnRzOiBmdW5jdGlvbiAoKSB7XHJcblx0XHRMLlBhdGgucHJvdG90eXBlLl9pbml0RXZlbnRzLmNhbGwodGhpcyk7XHJcblx0fSxcclxuXHJcblx0X2dldFBhdGhQYXJ0U3RyOiBmdW5jdGlvbiAocG9pbnRzKSB7XHJcblx0XHR2YXIgcm91bmQgPSBMLlBhdGguVk1MO1xyXG5cclxuXHRcdGZvciAodmFyIGogPSAwLCBsZW4yID0gcG9pbnRzLmxlbmd0aCwgc3RyID0gJycsIHA7IGogPCBsZW4yOyBqKyspIHtcclxuXHRcdFx0cCA9IHBvaW50c1tqXTtcclxuXHRcdFx0aWYgKHJvdW5kKSB7XHJcblx0XHRcdFx0cC5fcm91bmQoKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRzdHIgKz0gKGogPyAnTCcgOiAnTScpICsgcC54ICsgJyAnICsgcC55O1xyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIHN0cjtcclxuXHR9LFxyXG5cclxuXHRfY2xpcFBvaW50czogZnVuY3Rpb24gKCkge1xyXG5cdFx0dmFyIHBvaW50cyA9IHRoaXMuX29yaWdpbmFsUG9pbnRzLFxyXG5cdFx0ICAgIGxlbiA9IHBvaW50cy5sZW5ndGgsXHJcblx0XHQgICAgaSwgaywgc2VnbWVudDtcclxuXHJcblx0XHRpZiAodGhpcy5vcHRpb25zLm5vQ2xpcCkge1xyXG5cdFx0XHR0aGlzLl9wYXJ0cyA9IFtwb2ludHNdO1xyXG5cdFx0XHRyZXR1cm47XHJcblx0XHR9XHJcblxyXG5cdFx0dGhpcy5fcGFydHMgPSBbXTtcclxuXHJcblx0XHR2YXIgcGFydHMgPSB0aGlzLl9wYXJ0cyxcclxuXHRcdCAgICB2cCA9IHRoaXMuX21hcC5fcGF0aFZpZXdwb3J0LFxyXG5cdFx0ICAgIGx1ID0gTC5MaW5lVXRpbDtcclxuXHJcblx0XHRmb3IgKGkgPSAwLCBrID0gMDsgaSA8IGxlbiAtIDE7IGkrKykge1xyXG5cdFx0XHRzZWdtZW50ID0gbHUuY2xpcFNlZ21lbnQocG9pbnRzW2ldLCBwb2ludHNbaSArIDFdLCB2cCwgaSk7XHJcblx0XHRcdGlmICghc2VnbWVudCkge1xyXG5cdFx0XHRcdGNvbnRpbnVlO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRwYXJ0c1trXSA9IHBhcnRzW2tdIHx8IFtdO1xyXG5cdFx0XHRwYXJ0c1trXS5wdXNoKHNlZ21lbnRbMF0pO1xyXG5cclxuXHRcdFx0Ly8gaWYgc2VnbWVudCBnb2VzIG91dCBvZiBzY3JlZW4sIG9yIGl0J3MgdGhlIGxhc3Qgb25lLCBpdCdzIHRoZSBlbmQgb2YgdGhlIGxpbmUgcGFydFxyXG5cdFx0XHRpZiAoKHNlZ21lbnRbMV0gIT09IHBvaW50c1tpICsgMV0pIHx8IChpID09PSBsZW4gLSAyKSkge1xyXG5cdFx0XHRcdHBhcnRzW2tdLnB1c2goc2VnbWVudFsxXSk7XHJcblx0XHRcdFx0aysrO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fSxcclxuXHJcblx0Ly8gc2ltcGxpZnkgZWFjaCBjbGlwcGVkIHBhcnQgb2YgdGhlIHBvbHlsaW5lXHJcblx0X3NpbXBsaWZ5UG9pbnRzOiBmdW5jdGlvbiAoKSB7XHJcblx0XHR2YXIgcGFydHMgPSB0aGlzLl9wYXJ0cyxcclxuXHRcdCAgICBsdSA9IEwuTGluZVV0aWw7XHJcblxyXG5cdFx0Zm9yICh2YXIgaSA9IDAsIGxlbiA9IHBhcnRzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XHJcblx0XHRcdHBhcnRzW2ldID0gbHUuc2ltcGxpZnkocGFydHNbaV0sIHRoaXMub3B0aW9ucy5zbW9vdGhGYWN0b3IpO1xyXG5cdFx0fVxyXG5cdH0sXHJcblxyXG5cdF91cGRhdGVQYXRoOiBmdW5jdGlvbiAoKSB7XHJcblx0XHRpZiAoIXRoaXMuX21hcCkgeyByZXR1cm47IH1cclxuXHJcblx0XHR0aGlzLl9jbGlwUG9pbnRzKCk7XHJcblx0XHR0aGlzLl9zaW1wbGlmeVBvaW50cygpO1xyXG5cclxuXHRcdEwuUGF0aC5wcm90b3R5cGUuX3VwZGF0ZVBhdGguY2FsbCh0aGlzKTtcclxuXHR9XHJcbn0pO1xyXG5cclxuTC5wb2x5bGluZSA9IGZ1bmN0aW9uIChsYXRsbmdzLCBvcHRpb25zKSB7XHJcblx0cmV0dXJuIG5ldyBMLlBvbHlsaW5lKGxhdGxuZ3MsIG9wdGlvbnMpO1xyXG59O1xyXG5cblxuLypcclxuICogTC5Qb2x5VXRpbCBjb250YWlucyB1dGlsaXR5IGZ1bmN0aW9ucyBmb3IgcG9seWdvbnMgKGNsaXBwaW5nLCBldGMuKS5cclxuICovXHJcblxyXG4vKmpzaGludCBiaXR3aXNlOmZhbHNlICovIC8vIGFsbG93IGJpdHdpc2Ugb3BlcmF0aW9ucyBoZXJlXHJcblxyXG5MLlBvbHlVdGlsID0ge307XHJcblxyXG4vKlxyXG4gKiBTdXRoZXJsYW5kLUhvZGdlbWFuIHBvbHlnb24gY2xpcHBpbmcgYWxnb3JpdGhtLlxyXG4gKiBVc2VkIHRvIGF2b2lkIHJlbmRlcmluZyBwYXJ0cyBvZiBhIHBvbHlnb24gdGhhdCBhcmUgbm90IGN1cnJlbnRseSB2aXNpYmxlLlxyXG4gKi9cclxuTC5Qb2x5VXRpbC5jbGlwUG9seWdvbiA9IGZ1bmN0aW9uIChwb2ludHMsIGJvdW5kcykge1xyXG5cdHZhciBjbGlwcGVkUG9pbnRzLFxyXG5cdCAgICBlZGdlcyA9IFsxLCA0LCAyLCA4XSxcclxuXHQgICAgaSwgaiwgayxcclxuXHQgICAgYSwgYixcclxuXHQgICAgbGVuLCBlZGdlLCBwLFxyXG5cdCAgICBsdSA9IEwuTGluZVV0aWw7XHJcblxyXG5cdGZvciAoaSA9IDAsIGxlbiA9IHBvaW50cy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xyXG5cdFx0cG9pbnRzW2ldLl9jb2RlID0gbHUuX2dldEJpdENvZGUocG9pbnRzW2ldLCBib3VuZHMpO1xyXG5cdH1cclxuXHJcblx0Ly8gZm9yIGVhY2ggZWRnZSAobGVmdCwgYm90dG9tLCByaWdodCwgdG9wKVxyXG5cdGZvciAoayA9IDA7IGsgPCA0OyBrKyspIHtcclxuXHRcdGVkZ2UgPSBlZGdlc1trXTtcclxuXHRcdGNsaXBwZWRQb2ludHMgPSBbXTtcclxuXHJcblx0XHRmb3IgKGkgPSAwLCBsZW4gPSBwb2ludHMubGVuZ3RoLCBqID0gbGVuIC0gMTsgaSA8IGxlbjsgaiA9IGkrKykge1xyXG5cdFx0XHRhID0gcG9pbnRzW2ldO1xyXG5cdFx0XHRiID0gcG9pbnRzW2pdO1xyXG5cclxuXHRcdFx0Ly8gaWYgYSBpcyBpbnNpZGUgdGhlIGNsaXAgd2luZG93XHJcblx0XHRcdGlmICghKGEuX2NvZGUgJiBlZGdlKSkge1xyXG5cdFx0XHRcdC8vIGlmIGIgaXMgb3V0c2lkZSB0aGUgY2xpcCB3aW5kb3cgKGEtPmIgZ29lcyBvdXQgb2Ygc2NyZWVuKVxyXG5cdFx0XHRcdGlmIChiLl9jb2RlICYgZWRnZSkge1xyXG5cdFx0XHRcdFx0cCA9IGx1Ll9nZXRFZGdlSW50ZXJzZWN0aW9uKGIsIGEsIGVkZ2UsIGJvdW5kcyk7XHJcblx0XHRcdFx0XHRwLl9jb2RlID0gbHUuX2dldEJpdENvZGUocCwgYm91bmRzKTtcclxuXHRcdFx0XHRcdGNsaXBwZWRQb2ludHMucHVzaChwKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0Y2xpcHBlZFBvaW50cy5wdXNoKGEpO1xyXG5cclxuXHRcdFx0Ly8gZWxzZSBpZiBiIGlzIGluc2lkZSB0aGUgY2xpcCB3aW5kb3cgKGEtPmIgZW50ZXJzIHRoZSBzY3JlZW4pXHJcblx0XHRcdH0gZWxzZSBpZiAoIShiLl9jb2RlICYgZWRnZSkpIHtcclxuXHRcdFx0XHRwID0gbHUuX2dldEVkZ2VJbnRlcnNlY3Rpb24oYiwgYSwgZWRnZSwgYm91bmRzKTtcclxuXHRcdFx0XHRwLl9jb2RlID0gbHUuX2dldEJpdENvZGUocCwgYm91bmRzKTtcclxuXHRcdFx0XHRjbGlwcGVkUG9pbnRzLnB1c2gocCk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdHBvaW50cyA9IGNsaXBwZWRQb2ludHM7XHJcblx0fVxyXG5cclxuXHRyZXR1cm4gcG9pbnRzO1xyXG59O1xyXG5cblxuLypcclxuICogTC5Qb2x5Z29uIGlzIHVzZWQgdG8gZGlzcGxheSBwb2x5Z29ucyBvbiBhIG1hcC5cclxuICovXHJcblxyXG5MLlBvbHlnb24gPSBMLlBvbHlsaW5lLmV4dGVuZCh7XHJcblx0b3B0aW9uczoge1xyXG5cdFx0ZmlsbDogdHJ1ZVxyXG5cdH0sXHJcblxyXG5cdGluaXRpYWxpemU6IGZ1bmN0aW9uIChsYXRsbmdzLCBvcHRpb25zKSB7XHJcblx0XHRMLlBvbHlsaW5lLnByb3RvdHlwZS5pbml0aWFsaXplLmNhbGwodGhpcywgbGF0bG5ncywgb3B0aW9ucyk7XHJcblx0XHR0aGlzLl9pbml0V2l0aEhvbGVzKGxhdGxuZ3MpO1xyXG5cdH0sXHJcblxyXG5cdF9pbml0V2l0aEhvbGVzOiBmdW5jdGlvbiAobGF0bG5ncykge1xyXG5cdFx0dmFyIGksIGxlbiwgaG9sZTtcclxuXHRcdGlmIChsYXRsbmdzICYmIEwuVXRpbC5pc0FycmF5KGxhdGxuZ3NbMF0pICYmICh0eXBlb2YgbGF0bG5nc1swXVswXSAhPT0gJ251bWJlcicpKSB7XHJcblx0XHRcdHRoaXMuX2xhdGxuZ3MgPSB0aGlzLl9jb252ZXJ0TGF0TG5ncyhsYXRsbmdzWzBdKTtcclxuXHRcdFx0dGhpcy5faG9sZXMgPSBsYXRsbmdzLnNsaWNlKDEpO1xyXG5cclxuXHRcdFx0Zm9yIChpID0gMCwgbGVuID0gdGhpcy5faG9sZXMubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcclxuXHRcdFx0XHRob2xlID0gdGhpcy5faG9sZXNbaV0gPSB0aGlzLl9jb252ZXJ0TGF0TG5ncyh0aGlzLl9ob2xlc1tpXSk7XHJcblx0XHRcdFx0aWYgKGhvbGVbMF0uZXF1YWxzKGhvbGVbaG9sZS5sZW5ndGggLSAxXSkpIHtcclxuXHRcdFx0XHRcdGhvbGUucG9wKCk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gZmlsdGVyIG91dCBsYXN0IHBvaW50IGlmIGl0cyBlcXVhbCB0byB0aGUgZmlyc3Qgb25lXHJcblx0XHRsYXRsbmdzID0gdGhpcy5fbGF0bG5ncztcclxuXHJcblx0XHRpZiAobGF0bG5ncy5sZW5ndGggPj0gMiAmJiBsYXRsbmdzWzBdLmVxdWFscyhsYXRsbmdzW2xhdGxuZ3MubGVuZ3RoIC0gMV0pKSB7XHJcblx0XHRcdGxhdGxuZ3MucG9wKCk7XHJcblx0XHR9XHJcblx0fSxcclxuXHJcblx0cHJvamVjdExhdGxuZ3M6IGZ1bmN0aW9uICgpIHtcclxuXHRcdEwuUG9seWxpbmUucHJvdG90eXBlLnByb2plY3RMYXRsbmdzLmNhbGwodGhpcyk7XHJcblxyXG5cdFx0Ly8gcHJvamVjdCBwb2x5Z29uIGhvbGVzIHBvaW50c1xyXG5cdFx0Ly8gVE9ETyBtb3ZlIHRoaXMgbG9naWMgdG8gUG9seWxpbmUgdG8gZ2V0IHJpZCBvZiBkdXBsaWNhdGlvblxyXG5cdFx0dGhpcy5faG9sZVBvaW50cyA9IFtdO1xyXG5cclxuXHRcdGlmICghdGhpcy5faG9sZXMpIHsgcmV0dXJuOyB9XHJcblxyXG5cdFx0dmFyIGksIGosIGxlbiwgbGVuMjtcclxuXHJcblx0XHRmb3IgKGkgPSAwLCBsZW4gPSB0aGlzLl9ob2xlcy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xyXG5cdFx0XHR0aGlzLl9ob2xlUG9pbnRzW2ldID0gW107XHJcblxyXG5cdFx0XHRmb3IgKGogPSAwLCBsZW4yID0gdGhpcy5faG9sZXNbaV0ubGVuZ3RoOyBqIDwgbGVuMjsgaisrKSB7XHJcblx0XHRcdFx0dGhpcy5faG9sZVBvaW50c1tpXVtqXSA9IHRoaXMuX21hcC5sYXRMbmdUb0xheWVyUG9pbnQodGhpcy5faG9sZXNbaV1bal0pO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fSxcclxuXHJcblx0c2V0TGF0TG5nczogZnVuY3Rpb24gKGxhdGxuZ3MpIHtcclxuXHRcdGlmIChsYXRsbmdzICYmIEwuVXRpbC5pc0FycmF5KGxhdGxuZ3NbMF0pICYmICh0eXBlb2YgbGF0bG5nc1swXVswXSAhPT0gJ251bWJlcicpKSB7XHJcblx0XHRcdHRoaXMuX2luaXRXaXRoSG9sZXMobGF0bG5ncyk7XHJcblx0XHRcdHJldHVybiB0aGlzLnJlZHJhdygpO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0cmV0dXJuIEwuUG9seWxpbmUucHJvdG90eXBlLnNldExhdExuZ3MuY2FsbCh0aGlzLCBsYXRsbmdzKTtcclxuXHRcdH1cclxuXHR9LFxyXG5cclxuXHRfY2xpcFBvaW50czogZnVuY3Rpb24gKCkge1xyXG5cdFx0dmFyIHBvaW50cyA9IHRoaXMuX29yaWdpbmFsUG9pbnRzLFxyXG5cdFx0ICAgIG5ld1BhcnRzID0gW107XHJcblxyXG5cdFx0dGhpcy5fcGFydHMgPSBbcG9pbnRzXS5jb25jYXQodGhpcy5faG9sZVBvaW50cyk7XHJcblxyXG5cdFx0aWYgKHRoaXMub3B0aW9ucy5ub0NsaXApIHsgcmV0dXJuOyB9XHJcblxyXG5cdFx0Zm9yICh2YXIgaSA9IDAsIGxlbiA9IHRoaXMuX3BhcnRzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XHJcblx0XHRcdHZhciBjbGlwcGVkID0gTC5Qb2x5VXRpbC5jbGlwUG9seWdvbih0aGlzLl9wYXJ0c1tpXSwgdGhpcy5fbWFwLl9wYXRoVmlld3BvcnQpO1xyXG5cdFx0XHRpZiAoY2xpcHBlZC5sZW5ndGgpIHtcclxuXHRcdFx0XHRuZXdQYXJ0cy5wdXNoKGNsaXBwZWQpO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0dGhpcy5fcGFydHMgPSBuZXdQYXJ0cztcclxuXHR9LFxyXG5cclxuXHRfZ2V0UGF0aFBhcnRTdHI6IGZ1bmN0aW9uIChwb2ludHMpIHtcclxuXHRcdHZhciBzdHIgPSBMLlBvbHlsaW5lLnByb3RvdHlwZS5fZ2V0UGF0aFBhcnRTdHIuY2FsbCh0aGlzLCBwb2ludHMpO1xyXG5cdFx0cmV0dXJuIHN0ciArIChMLkJyb3dzZXIuc3ZnID8gJ3onIDogJ3gnKTtcclxuXHR9XHJcbn0pO1xyXG5cclxuTC5wb2x5Z29uID0gZnVuY3Rpb24gKGxhdGxuZ3MsIG9wdGlvbnMpIHtcclxuXHRyZXR1cm4gbmV3IEwuUG9seWdvbihsYXRsbmdzLCBvcHRpb25zKTtcclxufTtcclxuXG5cbi8qXHJcbiAqIENvbnRhaW5zIEwuTXVsdGlQb2x5bGluZSBhbmQgTC5NdWx0aVBvbHlnb24gbGF5ZXJzLlxyXG4gKi9cclxuXHJcbihmdW5jdGlvbiAoKSB7XHJcblx0ZnVuY3Rpb24gY3JlYXRlTXVsdGkoS2xhc3MpIHtcclxuXHJcblx0XHRyZXR1cm4gTC5GZWF0dXJlR3JvdXAuZXh0ZW5kKHtcclxuXHJcblx0XHRcdGluaXRpYWxpemU6IGZ1bmN0aW9uIChsYXRsbmdzLCBvcHRpb25zKSB7XHJcblx0XHRcdFx0dGhpcy5fbGF5ZXJzID0ge307XHJcblx0XHRcdFx0dGhpcy5fb3B0aW9ucyA9IG9wdGlvbnM7XHJcblx0XHRcdFx0dGhpcy5zZXRMYXRMbmdzKGxhdGxuZ3MpO1xyXG5cdFx0XHR9LFxyXG5cclxuXHRcdFx0c2V0TGF0TG5nczogZnVuY3Rpb24gKGxhdGxuZ3MpIHtcclxuXHRcdFx0XHR2YXIgaSA9IDAsXHJcblx0XHRcdFx0ICAgIGxlbiA9IGxhdGxuZ3MubGVuZ3RoO1xyXG5cclxuXHRcdFx0XHR0aGlzLmVhY2hMYXllcihmdW5jdGlvbiAobGF5ZXIpIHtcclxuXHRcdFx0XHRcdGlmIChpIDwgbGVuKSB7XHJcblx0XHRcdFx0XHRcdGxheWVyLnNldExhdExuZ3MobGF0bG5nc1tpKytdKTtcclxuXHRcdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRcdHRoaXMucmVtb3ZlTGF5ZXIobGF5ZXIpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH0sIHRoaXMpO1xyXG5cclxuXHRcdFx0XHR3aGlsZSAoaSA8IGxlbikge1xyXG5cdFx0XHRcdFx0dGhpcy5hZGRMYXllcihuZXcgS2xhc3MobGF0bG5nc1tpKytdLCB0aGlzLl9vcHRpb25zKSk7XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRyZXR1cm4gdGhpcztcclxuXHRcdFx0fSxcclxuXHJcblx0XHRcdGdldExhdExuZ3M6IGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0XHR2YXIgbGF0bG5ncyA9IFtdO1xyXG5cclxuXHRcdFx0XHR0aGlzLmVhY2hMYXllcihmdW5jdGlvbiAobGF5ZXIpIHtcclxuXHRcdFx0XHRcdGxhdGxuZ3MucHVzaChsYXllci5nZXRMYXRMbmdzKCkpO1xyXG5cdFx0XHRcdH0pO1xyXG5cclxuXHRcdFx0XHRyZXR1cm4gbGF0bG5ncztcclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblx0fVxyXG5cclxuXHRMLk11bHRpUG9seWxpbmUgPSBjcmVhdGVNdWx0aShMLlBvbHlsaW5lKTtcclxuXHRMLk11bHRpUG9seWdvbiA9IGNyZWF0ZU11bHRpKEwuUG9seWdvbik7XHJcblxyXG5cdEwubXVsdGlQb2x5bGluZSA9IGZ1bmN0aW9uIChsYXRsbmdzLCBvcHRpb25zKSB7XHJcblx0XHRyZXR1cm4gbmV3IEwuTXVsdGlQb2x5bGluZShsYXRsbmdzLCBvcHRpb25zKTtcclxuXHR9O1xyXG5cclxuXHRMLm11bHRpUG9seWdvbiA9IGZ1bmN0aW9uIChsYXRsbmdzLCBvcHRpb25zKSB7XHJcblx0XHRyZXR1cm4gbmV3IEwuTXVsdGlQb2x5Z29uKGxhdGxuZ3MsIG9wdGlvbnMpO1xyXG5cdH07XHJcbn0oKSk7XHJcblxuXG4vKlxyXG4gKiBMLlJlY3RhbmdsZSBleHRlbmRzIFBvbHlnb24gYW5kIGNyZWF0ZXMgYSByZWN0YW5nbGUgd2hlbiBwYXNzZWQgYSBMYXRMbmdCb3VuZHMgb2JqZWN0LlxyXG4gKi9cclxuXHJcbkwuUmVjdGFuZ2xlID0gTC5Qb2x5Z29uLmV4dGVuZCh7XHJcblx0aW5pdGlhbGl6ZTogZnVuY3Rpb24gKGxhdExuZ0JvdW5kcywgb3B0aW9ucykge1xyXG5cdFx0TC5Qb2x5Z29uLnByb3RvdHlwZS5pbml0aWFsaXplLmNhbGwodGhpcywgdGhpcy5fYm91bmRzVG9MYXRMbmdzKGxhdExuZ0JvdW5kcyksIG9wdGlvbnMpO1xyXG5cdH0sXHJcblxyXG5cdHNldEJvdW5kczogZnVuY3Rpb24gKGxhdExuZ0JvdW5kcykge1xyXG5cdFx0dGhpcy5zZXRMYXRMbmdzKHRoaXMuX2JvdW5kc1RvTGF0TG5ncyhsYXRMbmdCb3VuZHMpKTtcclxuXHR9LFxyXG5cclxuXHRfYm91bmRzVG9MYXRMbmdzOiBmdW5jdGlvbiAobGF0TG5nQm91bmRzKSB7XHJcblx0XHRsYXRMbmdCb3VuZHMgPSBMLmxhdExuZ0JvdW5kcyhsYXRMbmdCb3VuZHMpO1xyXG5cdFx0cmV0dXJuIFtcclxuXHRcdFx0bGF0TG5nQm91bmRzLmdldFNvdXRoV2VzdCgpLFxyXG5cdFx0XHRsYXRMbmdCb3VuZHMuZ2V0Tm9ydGhXZXN0KCksXHJcblx0XHRcdGxhdExuZ0JvdW5kcy5nZXROb3J0aEVhc3QoKSxcclxuXHRcdFx0bGF0TG5nQm91bmRzLmdldFNvdXRoRWFzdCgpXHJcblx0XHRdO1xyXG5cdH1cclxufSk7XHJcblxyXG5MLnJlY3RhbmdsZSA9IGZ1bmN0aW9uIChsYXRMbmdCb3VuZHMsIG9wdGlvbnMpIHtcclxuXHRyZXR1cm4gbmV3IEwuUmVjdGFuZ2xlKGxhdExuZ0JvdW5kcywgb3B0aW9ucyk7XHJcbn07XHJcblxuXG4vKlxyXG4gKiBMLkNpcmNsZSBpcyBhIGNpcmNsZSBvdmVybGF5ICh3aXRoIGEgY2VydGFpbiByYWRpdXMgaW4gbWV0ZXJzKS5cclxuICovXHJcblxyXG5MLkNpcmNsZSA9IEwuUGF0aC5leHRlbmQoe1xyXG5cdGluaXRpYWxpemU6IGZ1bmN0aW9uIChsYXRsbmcsIHJhZGl1cywgb3B0aW9ucykge1xyXG5cdFx0TC5QYXRoLnByb3RvdHlwZS5pbml0aWFsaXplLmNhbGwodGhpcywgb3B0aW9ucyk7XHJcblxyXG5cdFx0dGhpcy5fbGF0bG5nID0gTC5sYXRMbmcobGF0bG5nKTtcclxuXHRcdHRoaXMuX21SYWRpdXMgPSByYWRpdXM7XHJcblx0fSxcclxuXHJcblx0b3B0aW9uczoge1xyXG5cdFx0ZmlsbDogdHJ1ZVxyXG5cdH0sXHJcblxyXG5cdHNldExhdExuZzogZnVuY3Rpb24gKGxhdGxuZykge1xyXG5cdFx0dGhpcy5fbGF0bG5nID0gTC5sYXRMbmcobGF0bG5nKTtcclxuXHRcdHJldHVybiB0aGlzLnJlZHJhdygpO1xyXG5cdH0sXHJcblxyXG5cdHNldFJhZGl1czogZnVuY3Rpb24gKHJhZGl1cykge1xyXG5cdFx0dGhpcy5fbVJhZGl1cyA9IHJhZGl1cztcclxuXHRcdHJldHVybiB0aGlzLnJlZHJhdygpO1xyXG5cdH0sXHJcblxyXG5cdHByb2plY3RMYXRsbmdzOiBmdW5jdGlvbiAoKSB7XHJcblx0XHR2YXIgbG5nUmFkaXVzID0gdGhpcy5fZ2V0TG5nUmFkaXVzKCksXHJcblx0XHQgICAgbGF0bG5nID0gdGhpcy5fbGF0bG5nLFxyXG5cdFx0ICAgIHBvaW50TGVmdCA9IHRoaXMuX21hcC5sYXRMbmdUb0xheWVyUG9pbnQoW2xhdGxuZy5sYXQsIGxhdGxuZy5sbmcgLSBsbmdSYWRpdXNdKTtcclxuXHJcblx0XHR0aGlzLl9wb2ludCA9IHRoaXMuX21hcC5sYXRMbmdUb0xheWVyUG9pbnQobGF0bG5nKTtcclxuXHRcdHRoaXMuX3JhZGl1cyA9IE1hdGgubWF4KHRoaXMuX3BvaW50LnggLSBwb2ludExlZnQueCwgMSk7XHJcblx0fSxcclxuXHJcblx0Z2V0Qm91bmRzOiBmdW5jdGlvbiAoKSB7XHJcblx0XHR2YXIgbG5nUmFkaXVzID0gdGhpcy5fZ2V0TG5nUmFkaXVzKCksXHJcblx0XHQgICAgbGF0UmFkaXVzID0gKHRoaXMuX21SYWRpdXMgLyA0MDA3NTAxNykgKiAzNjAsXHJcblx0XHQgICAgbGF0bG5nID0gdGhpcy5fbGF0bG5nO1xyXG5cclxuXHRcdHJldHVybiBuZXcgTC5MYXRMbmdCb3VuZHMoXHJcblx0XHQgICAgICAgIFtsYXRsbmcubGF0IC0gbGF0UmFkaXVzLCBsYXRsbmcubG5nIC0gbG5nUmFkaXVzXSxcclxuXHRcdCAgICAgICAgW2xhdGxuZy5sYXQgKyBsYXRSYWRpdXMsIGxhdGxuZy5sbmcgKyBsbmdSYWRpdXNdKTtcclxuXHR9LFxyXG5cclxuXHRnZXRMYXRMbmc6IGZ1bmN0aW9uICgpIHtcclxuXHRcdHJldHVybiB0aGlzLl9sYXRsbmc7XHJcblx0fSxcclxuXHJcblx0Z2V0UGF0aFN0cmluZzogZnVuY3Rpb24gKCkge1xyXG5cdFx0dmFyIHAgPSB0aGlzLl9wb2ludCxcclxuXHRcdCAgICByID0gdGhpcy5fcmFkaXVzO1xyXG5cclxuXHRcdGlmICh0aGlzLl9jaGVja0lmRW1wdHkoKSkge1xyXG5cdFx0XHRyZXR1cm4gJyc7XHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKEwuQnJvd3Nlci5zdmcpIHtcclxuXHRcdFx0cmV0dXJuICdNJyArIHAueCArICcsJyArIChwLnkgLSByKSArXHJcblx0XHRcdCAgICAgICAnQScgKyByICsgJywnICsgciArICcsMCwxLDEsJyArXHJcblx0XHRcdCAgICAgICAocC54IC0gMC4xKSArICcsJyArIChwLnkgLSByKSArICcgeic7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRwLl9yb3VuZCgpO1xyXG5cdFx0XHRyID0gTWF0aC5yb3VuZChyKTtcclxuXHRcdFx0cmV0dXJuICdBTCAnICsgcC54ICsgJywnICsgcC55ICsgJyAnICsgciArICcsJyArIHIgKyAnIDAsJyArICg2NTUzNSAqIDM2MCk7XHJcblx0XHR9XHJcblx0fSxcclxuXHJcblx0Z2V0UmFkaXVzOiBmdW5jdGlvbiAoKSB7XHJcblx0XHRyZXR1cm4gdGhpcy5fbVJhZGl1cztcclxuXHR9LFxyXG5cclxuXHQvLyBUT0RPIEVhcnRoIGhhcmRjb2RlZCwgbW92ZSBpbnRvIHByb2plY3Rpb24gY29kZSFcclxuXHJcblx0X2dldExhdFJhZGl1czogZnVuY3Rpb24gKCkge1xyXG5cdFx0cmV0dXJuICh0aGlzLl9tUmFkaXVzIC8gNDAwNzUwMTcpICogMzYwO1xyXG5cdH0sXHJcblxyXG5cdF9nZXRMbmdSYWRpdXM6IGZ1bmN0aW9uICgpIHtcclxuXHRcdHJldHVybiB0aGlzLl9nZXRMYXRSYWRpdXMoKSAvIE1hdGguY29zKEwuTGF0TG5nLkRFR19UT19SQUQgKiB0aGlzLl9sYXRsbmcubGF0KTtcclxuXHR9LFxyXG5cclxuXHRfY2hlY2tJZkVtcHR5OiBmdW5jdGlvbiAoKSB7XHJcblx0XHRpZiAoIXRoaXMuX21hcCkge1xyXG5cdFx0XHRyZXR1cm4gZmFsc2U7XHJcblx0XHR9XHJcblx0XHR2YXIgdnAgPSB0aGlzLl9tYXAuX3BhdGhWaWV3cG9ydCxcclxuXHRcdCAgICByID0gdGhpcy5fcmFkaXVzLFxyXG5cdFx0ICAgIHAgPSB0aGlzLl9wb2ludDtcclxuXHJcblx0XHRyZXR1cm4gcC54IC0gciA+IHZwLm1heC54IHx8IHAueSAtIHIgPiB2cC5tYXgueSB8fFxyXG5cdFx0ICAgICAgIHAueCArIHIgPCB2cC5taW4ueCB8fCBwLnkgKyByIDwgdnAubWluLnk7XHJcblx0fVxyXG59KTtcclxuXHJcbkwuY2lyY2xlID0gZnVuY3Rpb24gKGxhdGxuZywgcmFkaXVzLCBvcHRpb25zKSB7XHJcblx0cmV0dXJuIG5ldyBMLkNpcmNsZShsYXRsbmcsIHJhZGl1cywgb3B0aW9ucyk7XHJcbn07XHJcblxuXG4vKlxyXG4gKiBMLkNpcmNsZU1hcmtlciBpcyBhIGNpcmNsZSBvdmVybGF5IHdpdGggYSBwZXJtYW5lbnQgcGl4ZWwgcmFkaXVzLlxyXG4gKi9cclxuXHJcbkwuQ2lyY2xlTWFya2VyID0gTC5DaXJjbGUuZXh0ZW5kKHtcclxuXHRvcHRpb25zOiB7XHJcblx0XHRyYWRpdXM6IDEwLFxyXG5cdFx0d2VpZ2h0OiAyXHJcblx0fSxcclxuXHJcblx0aW5pdGlhbGl6ZTogZnVuY3Rpb24gKGxhdGxuZywgb3B0aW9ucykge1xyXG5cdFx0TC5DaXJjbGUucHJvdG90eXBlLmluaXRpYWxpemUuY2FsbCh0aGlzLCBsYXRsbmcsIG51bGwsIG9wdGlvbnMpO1xyXG5cdFx0dGhpcy5fcmFkaXVzID0gdGhpcy5vcHRpb25zLnJhZGl1cztcclxuXHR9LFxyXG5cclxuXHRwcm9qZWN0TGF0bG5nczogZnVuY3Rpb24gKCkge1xyXG5cdFx0dGhpcy5fcG9pbnQgPSB0aGlzLl9tYXAubGF0TG5nVG9MYXllclBvaW50KHRoaXMuX2xhdGxuZyk7XHJcblx0fSxcclxuXHJcblx0X3VwZGF0ZVN0eWxlIDogZnVuY3Rpb24gKCkge1xyXG5cdFx0TC5DaXJjbGUucHJvdG90eXBlLl91cGRhdGVTdHlsZS5jYWxsKHRoaXMpO1xyXG5cdFx0dGhpcy5zZXRSYWRpdXModGhpcy5vcHRpb25zLnJhZGl1cyk7XHJcblx0fSxcclxuXHJcblx0c2V0TGF0TG5nOiBmdW5jdGlvbiAobGF0bG5nKSB7XHJcblx0XHRMLkNpcmNsZS5wcm90b3R5cGUuc2V0TGF0TG5nLmNhbGwodGhpcywgbGF0bG5nKTtcclxuXHRcdGlmICh0aGlzLl9wb3B1cCAmJiB0aGlzLl9wb3B1cC5faXNPcGVuKSB7XHJcblx0XHRcdHRoaXMuX3BvcHVwLnNldExhdExuZyhsYXRsbmcpO1xyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIHRoaXM7XHJcblx0fSxcclxuXHJcblx0c2V0UmFkaXVzOiBmdW5jdGlvbiAocmFkaXVzKSB7XHJcblx0XHR0aGlzLm9wdGlvbnMucmFkaXVzID0gdGhpcy5fcmFkaXVzID0gcmFkaXVzO1xyXG5cdFx0cmV0dXJuIHRoaXMucmVkcmF3KCk7XHJcblx0fSxcclxuXHJcblx0Z2V0UmFkaXVzOiBmdW5jdGlvbiAoKSB7XHJcblx0XHRyZXR1cm4gdGhpcy5fcmFkaXVzO1xyXG5cdH1cclxufSk7XHJcblxyXG5MLmNpcmNsZU1hcmtlciA9IGZ1bmN0aW9uIChsYXRsbmcsIG9wdGlvbnMpIHtcclxuXHRyZXR1cm4gbmV3IEwuQ2lyY2xlTWFya2VyKGxhdGxuZywgb3B0aW9ucyk7XHJcbn07XHJcblxuXG4vKlxyXG4gKiBFeHRlbmRzIEwuUG9seWxpbmUgdG8gYmUgYWJsZSB0byBtYW51YWxseSBkZXRlY3QgY2xpY2tzIG9uIENhbnZhcy1yZW5kZXJlZCBwb2x5bGluZXMuXHJcbiAqL1xyXG5cclxuTC5Qb2x5bGluZS5pbmNsdWRlKCFMLlBhdGguQ0FOVkFTID8ge30gOiB7XHJcblx0X2NvbnRhaW5zUG9pbnQ6IGZ1bmN0aW9uIChwLCBjbG9zZWQpIHtcclxuXHRcdHZhciBpLCBqLCBrLCBsZW4sIGxlbjIsIGRpc3QsIHBhcnQsXHJcblx0XHQgICAgdyA9IHRoaXMub3B0aW9ucy53ZWlnaHQgLyAyO1xyXG5cclxuXHRcdGlmIChMLkJyb3dzZXIudG91Y2gpIHtcclxuXHRcdFx0dyArPSAxMDsgLy8gcG9seWxpbmUgY2xpY2sgdG9sZXJhbmNlIG9uIHRvdWNoIGRldmljZXNcclxuXHRcdH1cclxuXHJcblx0XHRmb3IgKGkgPSAwLCBsZW4gPSB0aGlzLl9wYXJ0cy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xyXG5cdFx0XHRwYXJ0ID0gdGhpcy5fcGFydHNbaV07XHJcblx0XHRcdGZvciAoaiA9IDAsIGxlbjIgPSBwYXJ0Lmxlbmd0aCwgayA9IGxlbjIgLSAxOyBqIDwgbGVuMjsgayA9IGorKykge1xyXG5cdFx0XHRcdGlmICghY2xvc2VkICYmIChqID09PSAwKSkge1xyXG5cdFx0XHRcdFx0Y29udGludWU7XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRkaXN0ID0gTC5MaW5lVXRpbC5wb2ludFRvU2VnbWVudERpc3RhbmNlKHAsIHBhcnRba10sIHBhcnRbal0pO1xyXG5cclxuXHRcdFx0XHRpZiAoZGlzdCA8PSB3KSB7XHJcblx0XHRcdFx0XHRyZXR1cm4gdHJ1ZTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdHJldHVybiBmYWxzZTtcclxuXHR9XHJcbn0pO1xyXG5cblxuLypcclxuICogRXh0ZW5kcyBMLlBvbHlnb24gdG8gYmUgYWJsZSB0byBtYW51YWxseSBkZXRlY3QgY2xpY2tzIG9uIENhbnZhcy1yZW5kZXJlZCBwb2x5Z29ucy5cclxuICovXHJcblxyXG5MLlBvbHlnb24uaW5jbHVkZSghTC5QYXRoLkNBTlZBUyA/IHt9IDoge1xyXG5cdF9jb250YWluc1BvaW50OiBmdW5jdGlvbiAocCkge1xyXG5cdFx0dmFyIGluc2lkZSA9IGZhbHNlLFxyXG5cdFx0ICAgIHBhcnQsIHAxLCBwMixcclxuXHRcdCAgICBpLCBqLCBrLFxyXG5cdFx0ICAgIGxlbiwgbGVuMjtcclxuXHJcblx0XHQvLyBUT0RPIG9wdGltaXphdGlvbjogY2hlY2sgaWYgd2l0aGluIGJvdW5kcyBmaXJzdFxyXG5cclxuXHRcdGlmIChMLlBvbHlsaW5lLnByb3RvdHlwZS5fY29udGFpbnNQb2ludC5jYWxsKHRoaXMsIHAsIHRydWUpKSB7XHJcblx0XHRcdC8vIGNsaWNrIG9uIHBvbHlnb24gYm9yZGVyXHJcblx0XHRcdHJldHVybiB0cnVlO1xyXG5cdFx0fVxyXG5cclxuXHRcdC8vIHJheSBjYXN0aW5nIGFsZ29yaXRobSBmb3IgZGV0ZWN0aW5nIGlmIHBvaW50IGlzIGluIHBvbHlnb25cclxuXHJcblx0XHRmb3IgKGkgPSAwLCBsZW4gPSB0aGlzLl9wYXJ0cy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xyXG5cdFx0XHRwYXJ0ID0gdGhpcy5fcGFydHNbaV07XHJcblxyXG5cdFx0XHRmb3IgKGogPSAwLCBsZW4yID0gcGFydC5sZW5ndGgsIGsgPSBsZW4yIC0gMTsgaiA8IGxlbjI7IGsgPSBqKyspIHtcclxuXHRcdFx0XHRwMSA9IHBhcnRbal07XHJcblx0XHRcdFx0cDIgPSBwYXJ0W2tdO1xyXG5cclxuXHRcdFx0XHRpZiAoKChwMS55ID4gcC55KSAhPT0gKHAyLnkgPiBwLnkpKSAmJlxyXG5cdFx0XHRcdFx0XHQocC54IDwgKHAyLnggLSBwMS54KSAqIChwLnkgLSBwMS55KSAvIChwMi55IC0gcDEueSkgKyBwMS54KSkge1xyXG5cdFx0XHRcdFx0aW5zaWRlID0gIWluc2lkZTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0XHRyZXR1cm4gaW5zaWRlO1xyXG5cdH1cclxufSk7XHJcblxuXG4vKlxyXG4gKiBFeHRlbmRzIEwuQ2lyY2xlIHdpdGggQ2FudmFzLXNwZWNpZmljIGNvZGUuXHJcbiAqL1xyXG5cclxuTC5DaXJjbGUuaW5jbHVkZSghTC5QYXRoLkNBTlZBUyA/IHt9IDoge1xyXG5cdF9kcmF3UGF0aDogZnVuY3Rpb24gKCkge1xyXG5cdFx0dmFyIHAgPSB0aGlzLl9wb2ludDtcclxuXHRcdHRoaXMuX2N0eC5iZWdpblBhdGgoKTtcclxuXHRcdHRoaXMuX2N0eC5hcmMocC54LCBwLnksIHRoaXMuX3JhZGl1cywgMCwgTWF0aC5QSSAqIDIsIGZhbHNlKTtcclxuXHR9LFxyXG5cclxuXHRfY29udGFpbnNQb2ludDogZnVuY3Rpb24gKHApIHtcclxuXHRcdHZhciBjZW50ZXIgPSB0aGlzLl9wb2ludCxcclxuXHRcdCAgICB3MiA9IHRoaXMub3B0aW9ucy5zdHJva2UgPyB0aGlzLm9wdGlvbnMud2VpZ2h0IC8gMiA6IDA7XHJcblxyXG5cdFx0cmV0dXJuIChwLmRpc3RhbmNlVG8oY2VudGVyKSA8PSB0aGlzLl9yYWRpdXMgKyB3Mik7XHJcblx0fVxyXG59KTtcclxuXG5cbi8qXG4gKiBDaXJjbGVNYXJrZXIgY2FudmFzIHNwZWNpZmljIGRyYXdpbmcgcGFydHMuXG4gKi9cblxuTC5DaXJjbGVNYXJrZXIuaW5jbHVkZSghTC5QYXRoLkNBTlZBUyA/IHt9IDoge1xuXHRfdXBkYXRlU3R5bGU6IGZ1bmN0aW9uICgpIHtcblx0XHRMLlBhdGgucHJvdG90eXBlLl91cGRhdGVTdHlsZS5jYWxsKHRoaXMpO1xuXHR9XG59KTtcblxuXG4vKlxyXG4gKiBMLkdlb0pTT04gdHVybnMgYW55IEdlb0pTT04gZGF0YSBpbnRvIGEgTGVhZmxldCBsYXllci5cclxuICovXHJcblxyXG5MLkdlb0pTT04gPSBMLkZlYXR1cmVHcm91cC5leHRlbmQoe1xyXG5cclxuXHRpbml0aWFsaXplOiBmdW5jdGlvbiAoZ2VvanNvbiwgb3B0aW9ucykge1xyXG5cdFx0TC5zZXRPcHRpb25zKHRoaXMsIG9wdGlvbnMpO1xyXG5cclxuXHRcdHRoaXMuX2xheWVycyA9IHt9O1xyXG5cclxuXHRcdGlmIChnZW9qc29uKSB7XHJcblx0XHRcdHRoaXMuYWRkRGF0YShnZW9qc29uKTtcclxuXHRcdH1cclxuXHR9LFxyXG5cclxuXHRhZGREYXRhOiBmdW5jdGlvbiAoZ2VvanNvbikge1xyXG5cdFx0dmFyIGZlYXR1cmVzID0gTC5VdGlsLmlzQXJyYXkoZ2VvanNvbikgPyBnZW9qc29uIDogZ2VvanNvbi5mZWF0dXJlcyxcclxuXHRcdCAgICBpLCBsZW4sIGZlYXR1cmU7XHJcblxyXG5cdFx0aWYgKGZlYXR1cmVzKSB7XHJcblx0XHRcdGZvciAoaSA9IDAsIGxlbiA9IGZlYXR1cmVzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XHJcblx0XHRcdFx0Ly8gT25seSBhZGQgdGhpcyBpZiBnZW9tZXRyeSBvciBnZW9tZXRyaWVzIGFyZSBzZXQgYW5kIG5vdCBudWxsXHJcblx0XHRcdFx0ZmVhdHVyZSA9IGZlYXR1cmVzW2ldO1xyXG5cdFx0XHRcdGlmIChmZWF0dXJlLmdlb21ldHJpZXMgfHwgZmVhdHVyZS5nZW9tZXRyeSB8fCBmZWF0dXJlLmZlYXR1cmVzIHx8IGZlYXR1cmUuY29vcmRpbmF0ZXMpIHtcclxuXHRcdFx0XHRcdHRoaXMuYWRkRGF0YShmZWF0dXJlc1tpXSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHRcdHJldHVybiB0aGlzO1xyXG5cdFx0fVxyXG5cclxuXHRcdHZhciBvcHRpb25zID0gdGhpcy5vcHRpb25zO1xyXG5cclxuXHRcdGlmIChvcHRpb25zLmZpbHRlciAmJiAhb3B0aW9ucy5maWx0ZXIoZ2VvanNvbikpIHsgcmV0dXJuOyB9XHJcblxyXG5cdFx0dmFyIGxheWVyID0gTC5HZW9KU09OLmdlb21ldHJ5VG9MYXllcihnZW9qc29uLCBvcHRpb25zLnBvaW50VG9MYXllciwgb3B0aW9ucy5jb29yZHNUb0xhdExuZywgb3B0aW9ucyk7XHJcblx0XHRsYXllci5mZWF0dXJlID0gTC5HZW9KU09OLmFzRmVhdHVyZShnZW9qc29uKTtcclxuXHJcblx0XHRsYXllci5kZWZhdWx0T3B0aW9ucyA9IGxheWVyLm9wdGlvbnM7XHJcblx0XHR0aGlzLnJlc2V0U3R5bGUobGF5ZXIpO1xyXG5cclxuXHRcdGlmIChvcHRpb25zLm9uRWFjaEZlYXR1cmUpIHtcclxuXHRcdFx0b3B0aW9ucy5vbkVhY2hGZWF0dXJlKGdlb2pzb24sIGxheWVyKTtcclxuXHRcdH1cclxuXHJcblx0XHRyZXR1cm4gdGhpcy5hZGRMYXllcihsYXllcik7XHJcblx0fSxcclxuXHJcblx0cmVzZXRTdHlsZTogZnVuY3Rpb24gKGxheWVyKSB7XHJcblx0XHR2YXIgc3R5bGUgPSB0aGlzLm9wdGlvbnMuc3R5bGU7XHJcblx0XHRpZiAoc3R5bGUpIHtcclxuXHRcdFx0Ly8gcmVzZXQgYW55IGN1c3RvbSBzdHlsZXNcclxuXHRcdFx0TC5VdGlsLmV4dGVuZChsYXllci5vcHRpb25zLCBsYXllci5kZWZhdWx0T3B0aW9ucyk7XHJcblxyXG5cdFx0XHR0aGlzLl9zZXRMYXllclN0eWxlKGxheWVyLCBzdHlsZSk7XHJcblx0XHR9XHJcblx0fSxcclxuXHJcblx0c2V0U3R5bGU6IGZ1bmN0aW9uIChzdHlsZSkge1xyXG5cdFx0dGhpcy5lYWNoTGF5ZXIoZnVuY3Rpb24gKGxheWVyKSB7XHJcblx0XHRcdHRoaXMuX3NldExheWVyU3R5bGUobGF5ZXIsIHN0eWxlKTtcclxuXHRcdH0sIHRoaXMpO1xyXG5cdH0sXHJcblxyXG5cdF9zZXRMYXllclN0eWxlOiBmdW5jdGlvbiAobGF5ZXIsIHN0eWxlKSB7XHJcblx0XHRpZiAodHlwZW9mIHN0eWxlID09PSAnZnVuY3Rpb24nKSB7XHJcblx0XHRcdHN0eWxlID0gc3R5bGUobGF5ZXIuZmVhdHVyZSk7XHJcblx0XHR9XHJcblx0XHRpZiAobGF5ZXIuc2V0U3R5bGUpIHtcclxuXHRcdFx0bGF5ZXIuc2V0U3R5bGUoc3R5bGUpO1xyXG5cdFx0fVxyXG5cdH1cclxufSk7XHJcblxyXG5MLmV4dGVuZChMLkdlb0pTT04sIHtcclxuXHRnZW9tZXRyeVRvTGF5ZXI6IGZ1bmN0aW9uIChnZW9qc29uLCBwb2ludFRvTGF5ZXIsIGNvb3Jkc1RvTGF0TG5nLCB2ZWN0b3JPcHRpb25zKSB7XHJcblx0XHR2YXIgZ2VvbWV0cnkgPSBnZW9qc29uLnR5cGUgPT09ICdGZWF0dXJlJyA/IGdlb2pzb24uZ2VvbWV0cnkgOiBnZW9qc29uLFxyXG5cdFx0ICAgIGNvb3JkcyA9IGdlb21ldHJ5LmNvb3JkaW5hdGVzLFxyXG5cdFx0ICAgIGxheWVycyA9IFtdLFxyXG5cdFx0ICAgIGxhdGxuZywgbGF0bG5ncywgaSwgbGVuO1xyXG5cclxuXHRcdGNvb3Jkc1RvTGF0TG5nID0gY29vcmRzVG9MYXRMbmcgfHwgdGhpcy5jb29yZHNUb0xhdExuZztcclxuXHJcblx0XHRzd2l0Y2ggKGdlb21ldHJ5LnR5cGUpIHtcclxuXHRcdGNhc2UgJ1BvaW50JzpcclxuXHRcdFx0bGF0bG5nID0gY29vcmRzVG9MYXRMbmcoY29vcmRzKTtcclxuXHRcdFx0cmV0dXJuIHBvaW50VG9MYXllciA/IHBvaW50VG9MYXllcihnZW9qc29uLCBsYXRsbmcpIDogbmV3IEwuTWFya2VyKGxhdGxuZyk7XHJcblxyXG5cdFx0Y2FzZSAnTXVsdGlQb2ludCc6XHJcblx0XHRcdGZvciAoaSA9IDAsIGxlbiA9IGNvb3Jkcy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xyXG5cdFx0XHRcdGxhdGxuZyA9IGNvb3Jkc1RvTGF0TG5nKGNvb3Jkc1tpXSk7XHJcblx0XHRcdFx0bGF5ZXJzLnB1c2gocG9pbnRUb0xheWVyID8gcG9pbnRUb0xheWVyKGdlb2pzb24sIGxhdGxuZykgOiBuZXcgTC5NYXJrZXIobGF0bG5nKSk7XHJcblx0XHRcdH1cclxuXHRcdFx0cmV0dXJuIG5ldyBMLkZlYXR1cmVHcm91cChsYXllcnMpO1xyXG5cclxuXHRcdGNhc2UgJ0xpbmVTdHJpbmcnOlxyXG5cdFx0XHRsYXRsbmdzID0gdGhpcy5jb29yZHNUb0xhdExuZ3MoY29vcmRzLCAwLCBjb29yZHNUb0xhdExuZyk7XHJcblx0XHRcdHJldHVybiBuZXcgTC5Qb2x5bGluZShsYXRsbmdzLCB2ZWN0b3JPcHRpb25zKTtcclxuXHJcblx0XHRjYXNlICdQb2x5Z29uJzpcclxuXHRcdFx0aWYgKGNvb3Jkcy5sZW5ndGggPT09IDIgJiYgIWNvb3Jkc1sxXS5sZW5ndGgpIHtcclxuXHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgR2VvSlNPTiBvYmplY3QuJyk7XHJcblx0XHRcdH1cclxuXHRcdFx0bGF0bG5ncyA9IHRoaXMuY29vcmRzVG9MYXRMbmdzKGNvb3JkcywgMSwgY29vcmRzVG9MYXRMbmcpO1xyXG5cdFx0XHRyZXR1cm4gbmV3IEwuUG9seWdvbihsYXRsbmdzLCB2ZWN0b3JPcHRpb25zKTtcclxuXHJcblx0XHRjYXNlICdNdWx0aUxpbmVTdHJpbmcnOlxyXG5cdFx0XHRsYXRsbmdzID0gdGhpcy5jb29yZHNUb0xhdExuZ3MoY29vcmRzLCAxLCBjb29yZHNUb0xhdExuZyk7XHJcblx0XHRcdHJldHVybiBuZXcgTC5NdWx0aVBvbHlsaW5lKGxhdGxuZ3MsIHZlY3Rvck9wdGlvbnMpO1xyXG5cclxuXHRcdGNhc2UgJ011bHRpUG9seWdvbic6XHJcblx0XHRcdGxhdGxuZ3MgPSB0aGlzLmNvb3Jkc1RvTGF0TG5ncyhjb29yZHMsIDIsIGNvb3Jkc1RvTGF0TG5nKTtcclxuXHRcdFx0cmV0dXJuIG5ldyBMLk11bHRpUG9seWdvbihsYXRsbmdzLCB2ZWN0b3JPcHRpb25zKTtcclxuXHJcblx0XHRjYXNlICdHZW9tZXRyeUNvbGxlY3Rpb24nOlxyXG5cdFx0XHRmb3IgKGkgPSAwLCBsZW4gPSBnZW9tZXRyeS5nZW9tZXRyaWVzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XHJcblxyXG5cdFx0XHRcdGxheWVycy5wdXNoKHRoaXMuZ2VvbWV0cnlUb0xheWVyKHtcclxuXHRcdFx0XHRcdGdlb21ldHJ5OiBnZW9tZXRyeS5nZW9tZXRyaWVzW2ldLFxyXG5cdFx0XHRcdFx0dHlwZTogJ0ZlYXR1cmUnLFxyXG5cdFx0XHRcdFx0cHJvcGVydGllczogZ2VvanNvbi5wcm9wZXJ0aWVzXHJcblx0XHRcdFx0fSwgcG9pbnRUb0xheWVyLCBjb29yZHNUb0xhdExuZywgdmVjdG9yT3B0aW9ucykpO1xyXG5cdFx0XHR9XHJcblx0XHRcdHJldHVybiBuZXcgTC5GZWF0dXJlR3JvdXAobGF5ZXJzKTtcclxuXHJcblx0XHRkZWZhdWx0OlxyXG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgR2VvSlNPTiBvYmplY3QuJyk7XHJcblx0XHR9XHJcblx0fSxcclxuXHJcblx0Y29vcmRzVG9MYXRMbmc6IGZ1bmN0aW9uIChjb29yZHMpIHsgLy8gKEFycmF5WywgQm9vbGVhbl0pIC0+IExhdExuZ1xyXG5cdFx0cmV0dXJuIG5ldyBMLkxhdExuZyhjb29yZHNbMV0sIGNvb3Jkc1swXSwgY29vcmRzWzJdKTtcclxuXHR9LFxyXG5cclxuXHRjb29yZHNUb0xhdExuZ3M6IGZ1bmN0aW9uIChjb29yZHMsIGxldmVsc0RlZXAsIGNvb3Jkc1RvTGF0TG5nKSB7IC8vIChBcnJheVssIE51bWJlciwgRnVuY3Rpb25dKSAtPiBBcnJheVxyXG5cdFx0dmFyIGxhdGxuZywgaSwgbGVuLFxyXG5cdFx0ICAgIGxhdGxuZ3MgPSBbXTtcclxuXHJcblx0XHRmb3IgKGkgPSAwLCBsZW4gPSBjb29yZHMubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcclxuXHRcdFx0bGF0bG5nID0gbGV2ZWxzRGVlcCA/XHJcblx0XHRcdCAgICAgICAgdGhpcy5jb29yZHNUb0xhdExuZ3MoY29vcmRzW2ldLCBsZXZlbHNEZWVwIC0gMSwgY29vcmRzVG9MYXRMbmcpIDpcclxuXHRcdFx0ICAgICAgICAoY29vcmRzVG9MYXRMbmcgfHwgdGhpcy5jb29yZHNUb0xhdExuZykoY29vcmRzW2ldKTtcclxuXHJcblx0XHRcdGxhdGxuZ3MucHVzaChsYXRsbmcpO1xyXG5cdFx0fVxyXG5cclxuXHRcdHJldHVybiBsYXRsbmdzO1xyXG5cdH0sXHJcblxyXG5cdGxhdExuZ1RvQ29vcmRzOiBmdW5jdGlvbiAobGF0bG5nKSB7XHJcblx0XHR2YXIgY29vcmRzID0gW2xhdGxuZy5sbmcsIGxhdGxuZy5sYXRdO1xyXG5cclxuXHRcdGlmIChsYXRsbmcuYWx0ICE9PSB1bmRlZmluZWQpIHtcclxuXHRcdFx0Y29vcmRzLnB1c2gobGF0bG5nLmFsdCk7XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gY29vcmRzO1xyXG5cdH0sXHJcblxyXG5cdGxhdExuZ3NUb0Nvb3JkczogZnVuY3Rpb24gKGxhdExuZ3MpIHtcclxuXHRcdHZhciBjb29yZHMgPSBbXTtcclxuXHJcblx0XHRmb3IgKHZhciBpID0gMCwgbGVuID0gbGF0TG5ncy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xyXG5cdFx0XHRjb29yZHMucHVzaChMLkdlb0pTT04ubGF0TG5nVG9Db29yZHMobGF0TG5nc1tpXSkpO1xyXG5cdFx0fVxyXG5cclxuXHRcdHJldHVybiBjb29yZHM7XHJcblx0fSxcclxuXHJcblx0Z2V0RmVhdHVyZTogZnVuY3Rpb24gKGxheWVyLCBuZXdHZW9tZXRyeSkge1xyXG5cdFx0cmV0dXJuIGxheWVyLmZlYXR1cmUgPyBMLmV4dGVuZCh7fSwgbGF5ZXIuZmVhdHVyZSwge2dlb21ldHJ5OiBuZXdHZW9tZXRyeX0pIDogTC5HZW9KU09OLmFzRmVhdHVyZShuZXdHZW9tZXRyeSk7XHJcblx0fSxcclxuXHJcblx0YXNGZWF0dXJlOiBmdW5jdGlvbiAoZ2VvSlNPTikge1xyXG5cdFx0aWYgKGdlb0pTT04udHlwZSA9PT0gJ0ZlYXR1cmUnKSB7XHJcblx0XHRcdHJldHVybiBnZW9KU09OO1xyXG5cdFx0fVxyXG5cclxuXHRcdHJldHVybiB7XHJcblx0XHRcdHR5cGU6ICdGZWF0dXJlJyxcclxuXHRcdFx0cHJvcGVydGllczoge30sXHJcblx0XHRcdGdlb21ldHJ5OiBnZW9KU09OXHJcblx0XHR9O1xyXG5cdH1cclxufSk7XHJcblxyXG52YXIgUG9pbnRUb0dlb0pTT04gPSB7XHJcblx0dG9HZW9KU09OOiBmdW5jdGlvbiAoKSB7XHJcblx0XHRyZXR1cm4gTC5HZW9KU09OLmdldEZlYXR1cmUodGhpcywge1xyXG5cdFx0XHR0eXBlOiAnUG9pbnQnLFxyXG5cdFx0XHRjb29yZGluYXRlczogTC5HZW9KU09OLmxhdExuZ1RvQ29vcmRzKHRoaXMuZ2V0TGF0TG5nKCkpXHJcblx0XHR9KTtcclxuXHR9XHJcbn07XHJcblxyXG5MLk1hcmtlci5pbmNsdWRlKFBvaW50VG9HZW9KU09OKTtcclxuTC5DaXJjbGUuaW5jbHVkZShQb2ludFRvR2VvSlNPTik7XHJcbkwuQ2lyY2xlTWFya2VyLmluY2x1ZGUoUG9pbnRUb0dlb0pTT04pO1xyXG5cclxuTC5Qb2x5bGluZS5pbmNsdWRlKHtcclxuXHR0b0dlb0pTT046IGZ1bmN0aW9uICgpIHtcclxuXHRcdHJldHVybiBMLkdlb0pTT04uZ2V0RmVhdHVyZSh0aGlzLCB7XHJcblx0XHRcdHR5cGU6ICdMaW5lU3RyaW5nJyxcclxuXHRcdFx0Y29vcmRpbmF0ZXM6IEwuR2VvSlNPTi5sYXRMbmdzVG9Db29yZHModGhpcy5nZXRMYXRMbmdzKCkpXHJcblx0XHR9KTtcclxuXHR9XHJcbn0pO1xyXG5cclxuTC5Qb2x5Z29uLmluY2x1ZGUoe1xyXG5cdHRvR2VvSlNPTjogZnVuY3Rpb24gKCkge1xyXG5cdFx0dmFyIGNvb3JkcyA9IFtMLkdlb0pTT04ubGF0TG5nc1RvQ29vcmRzKHRoaXMuZ2V0TGF0TG5ncygpKV0sXHJcblx0XHQgICAgaSwgbGVuLCBob2xlO1xyXG5cclxuXHRcdGNvb3Jkc1swXS5wdXNoKGNvb3Jkc1swXVswXSk7XHJcblxyXG5cdFx0aWYgKHRoaXMuX2hvbGVzKSB7XHJcblx0XHRcdGZvciAoaSA9IDAsIGxlbiA9IHRoaXMuX2hvbGVzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XHJcblx0XHRcdFx0aG9sZSA9IEwuR2VvSlNPTi5sYXRMbmdzVG9Db29yZHModGhpcy5faG9sZXNbaV0pO1xyXG5cdFx0XHRcdGhvbGUucHVzaChob2xlWzBdKTtcclxuXHRcdFx0XHRjb29yZHMucHVzaChob2xlKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHRcdHJldHVybiBMLkdlb0pTT04uZ2V0RmVhdHVyZSh0aGlzLCB7XHJcblx0XHRcdHR5cGU6ICdQb2x5Z29uJyxcclxuXHRcdFx0Y29vcmRpbmF0ZXM6IGNvb3Jkc1xyXG5cdFx0fSk7XHJcblx0fVxyXG59KTtcclxuXHJcbihmdW5jdGlvbiAoKSB7XHJcblx0ZnVuY3Rpb24gbXVsdGlUb0dlb0pTT04odHlwZSkge1xyXG5cdFx0cmV0dXJuIGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0dmFyIGNvb3JkcyA9IFtdO1xyXG5cclxuXHRcdFx0dGhpcy5lYWNoTGF5ZXIoZnVuY3Rpb24gKGxheWVyKSB7XHJcblx0XHRcdFx0Y29vcmRzLnB1c2gobGF5ZXIudG9HZW9KU09OKCkuZ2VvbWV0cnkuY29vcmRpbmF0ZXMpO1xyXG5cdFx0XHR9KTtcclxuXHJcblx0XHRcdHJldHVybiBMLkdlb0pTT04uZ2V0RmVhdHVyZSh0aGlzLCB7XHJcblx0XHRcdFx0dHlwZTogdHlwZSxcclxuXHRcdFx0XHRjb29yZGluYXRlczogY29vcmRzXHJcblx0XHRcdH0pO1xyXG5cdFx0fTtcclxuXHR9XHJcblxyXG5cdEwuTXVsdGlQb2x5bGluZS5pbmNsdWRlKHt0b0dlb0pTT046IG11bHRpVG9HZW9KU09OKCdNdWx0aUxpbmVTdHJpbmcnKX0pO1xyXG5cdEwuTXVsdGlQb2x5Z29uLmluY2x1ZGUoe3RvR2VvSlNPTjogbXVsdGlUb0dlb0pTT04oJ011bHRpUG9seWdvbicpfSk7XHJcblxyXG5cdEwuTGF5ZXJHcm91cC5pbmNsdWRlKHtcclxuXHRcdHRvR2VvSlNPTjogZnVuY3Rpb24gKCkge1xyXG5cclxuXHRcdFx0dmFyIGdlb21ldHJ5ID0gdGhpcy5mZWF0dXJlICYmIHRoaXMuZmVhdHVyZS5nZW9tZXRyeSxcclxuXHRcdFx0XHRqc29ucyA9IFtdLFxyXG5cdFx0XHRcdGpzb247XHJcblxyXG5cdFx0XHRpZiAoZ2VvbWV0cnkgJiYgZ2VvbWV0cnkudHlwZSA9PT0gJ011bHRpUG9pbnQnKSB7XHJcblx0XHRcdFx0cmV0dXJuIG11bHRpVG9HZW9KU09OKCdNdWx0aVBvaW50JykuY2FsbCh0aGlzKTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0dmFyIGlzR2VvbWV0cnlDb2xsZWN0aW9uID0gZ2VvbWV0cnkgJiYgZ2VvbWV0cnkudHlwZSA9PT0gJ0dlb21ldHJ5Q29sbGVjdGlvbic7XHJcblxyXG5cdFx0XHR0aGlzLmVhY2hMYXllcihmdW5jdGlvbiAobGF5ZXIpIHtcclxuXHRcdFx0XHRpZiAobGF5ZXIudG9HZW9KU09OKSB7XHJcblx0XHRcdFx0XHRqc29uID0gbGF5ZXIudG9HZW9KU09OKCk7XHJcblx0XHRcdFx0XHRqc29ucy5wdXNoKGlzR2VvbWV0cnlDb2xsZWN0aW9uID8ganNvbi5nZW9tZXRyeSA6IEwuR2VvSlNPTi5hc0ZlYXR1cmUoanNvbikpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSk7XHJcblxyXG5cdFx0XHRpZiAoaXNHZW9tZXRyeUNvbGxlY3Rpb24pIHtcclxuXHRcdFx0XHRyZXR1cm4gTC5HZW9KU09OLmdldEZlYXR1cmUodGhpcywge1xyXG5cdFx0XHRcdFx0Z2VvbWV0cmllczoganNvbnMsXHJcblx0XHRcdFx0XHR0eXBlOiAnR2VvbWV0cnlDb2xsZWN0aW9uJ1xyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRyZXR1cm4ge1xyXG5cdFx0XHRcdHR5cGU6ICdGZWF0dXJlQ29sbGVjdGlvbicsXHJcblx0XHRcdFx0ZmVhdHVyZXM6IGpzb25zXHJcblx0XHRcdH07XHJcblx0XHR9XHJcblx0fSk7XHJcbn0oKSk7XHJcblxyXG5MLmdlb0pzb24gPSBmdW5jdGlvbiAoZ2VvanNvbiwgb3B0aW9ucykge1xyXG5cdHJldHVybiBuZXcgTC5HZW9KU09OKGdlb2pzb24sIG9wdGlvbnMpO1xyXG59O1xyXG5cblxuLypcclxuICogTC5Eb21FdmVudCBjb250YWlucyBmdW5jdGlvbnMgZm9yIHdvcmtpbmcgd2l0aCBET00gZXZlbnRzLlxyXG4gKi9cclxuXHJcbkwuRG9tRXZlbnQgPSB7XHJcblx0LyogaW5zcGlyZWQgYnkgSm9obiBSZXNpZywgRGVhbiBFZHdhcmRzIGFuZCBZVUkgYWRkRXZlbnQgaW1wbGVtZW50YXRpb25zICovXHJcblx0YWRkTGlzdGVuZXI6IGZ1bmN0aW9uIChvYmosIHR5cGUsIGZuLCBjb250ZXh0KSB7IC8vIChIVE1MRWxlbWVudCwgU3RyaW5nLCBGdW5jdGlvblssIE9iamVjdF0pXHJcblxyXG5cdFx0dmFyIGlkID0gTC5zdGFtcChmbiksXHJcblx0XHQgICAga2V5ID0gJ19sZWFmbGV0XycgKyB0eXBlICsgaWQsXHJcblx0XHQgICAgaGFuZGxlciwgb3JpZ2luYWxIYW5kbGVyLCBuZXdUeXBlO1xyXG5cclxuXHRcdGlmIChvYmpba2V5XSkgeyByZXR1cm4gdGhpczsgfVxyXG5cclxuXHRcdGhhbmRsZXIgPSBmdW5jdGlvbiAoZSkge1xyXG5cdFx0XHRyZXR1cm4gZm4uY2FsbChjb250ZXh0IHx8IG9iaiwgZSB8fCBMLkRvbUV2ZW50Ll9nZXRFdmVudCgpKTtcclxuXHRcdH07XHJcblxyXG5cdFx0aWYgKEwuQnJvd3Nlci5wb2ludGVyICYmIHR5cGUuaW5kZXhPZigndG91Y2gnKSA9PT0gMCkge1xyXG5cdFx0XHRyZXR1cm4gdGhpcy5hZGRQb2ludGVyTGlzdGVuZXIob2JqLCB0eXBlLCBoYW5kbGVyLCBpZCk7XHJcblx0XHR9XHJcblx0XHRpZiAoTC5Ccm93c2VyLnRvdWNoICYmICh0eXBlID09PSAnZGJsY2xpY2snKSAmJiB0aGlzLmFkZERvdWJsZVRhcExpc3RlbmVyKSB7XHJcblx0XHRcdHRoaXMuYWRkRG91YmxlVGFwTGlzdGVuZXIob2JqLCBoYW5kbGVyLCBpZCk7XHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKCdhZGRFdmVudExpc3RlbmVyJyBpbiBvYmopIHtcclxuXHJcblx0XHRcdGlmICh0eXBlID09PSAnbW91c2V3aGVlbCcpIHtcclxuXHRcdFx0XHRvYmouYWRkRXZlbnRMaXN0ZW5lcignRE9NTW91c2VTY3JvbGwnLCBoYW5kbGVyLCBmYWxzZSk7XHJcblx0XHRcdFx0b2JqLmFkZEV2ZW50TGlzdGVuZXIodHlwZSwgaGFuZGxlciwgZmFsc2UpO1xyXG5cclxuXHRcdFx0fSBlbHNlIGlmICgodHlwZSA9PT0gJ21vdXNlZW50ZXInKSB8fCAodHlwZSA9PT0gJ21vdXNlbGVhdmUnKSkge1xyXG5cclxuXHRcdFx0XHRvcmlnaW5hbEhhbmRsZXIgPSBoYW5kbGVyO1xyXG5cdFx0XHRcdG5ld1R5cGUgPSAodHlwZSA9PT0gJ21vdXNlZW50ZXInID8gJ21vdXNlb3ZlcicgOiAnbW91c2VvdXQnKTtcclxuXHJcblx0XHRcdFx0aGFuZGxlciA9IGZ1bmN0aW9uIChlKSB7XHJcblx0XHRcdFx0XHRpZiAoIUwuRG9tRXZlbnQuX2NoZWNrTW91c2Uob2JqLCBlKSkgeyByZXR1cm47IH1cclxuXHRcdFx0XHRcdHJldHVybiBvcmlnaW5hbEhhbmRsZXIoZSk7XHJcblx0XHRcdFx0fTtcclxuXHJcblx0XHRcdFx0b2JqLmFkZEV2ZW50TGlzdGVuZXIobmV3VHlwZSwgaGFuZGxlciwgZmFsc2UpO1xyXG5cclxuXHRcdFx0fSBlbHNlIGlmICh0eXBlID09PSAnY2xpY2snICYmIEwuQnJvd3Nlci5hbmRyb2lkKSB7XHJcblx0XHRcdFx0b3JpZ2luYWxIYW5kbGVyID0gaGFuZGxlcjtcclxuXHRcdFx0XHRoYW5kbGVyID0gZnVuY3Rpb24gKGUpIHtcclxuXHRcdFx0XHRcdHJldHVybiBMLkRvbUV2ZW50Ll9maWx0ZXJDbGljayhlLCBvcmlnaW5hbEhhbmRsZXIpO1xyXG5cdFx0XHRcdH07XHJcblxyXG5cdFx0XHRcdG9iai5hZGRFdmVudExpc3RlbmVyKHR5cGUsIGhhbmRsZXIsIGZhbHNlKTtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRvYmouYWRkRXZlbnRMaXN0ZW5lcih0eXBlLCBoYW5kbGVyLCBmYWxzZSk7XHJcblx0XHRcdH1cclxuXHJcblx0XHR9IGVsc2UgaWYgKCdhdHRhY2hFdmVudCcgaW4gb2JqKSB7XHJcblx0XHRcdG9iai5hdHRhY2hFdmVudCgnb24nICsgdHlwZSwgaGFuZGxlcik7XHJcblx0XHR9XHJcblxyXG5cdFx0b2JqW2tleV0gPSBoYW5kbGVyO1xyXG5cclxuXHRcdHJldHVybiB0aGlzO1xyXG5cdH0sXHJcblxyXG5cdHJlbW92ZUxpc3RlbmVyOiBmdW5jdGlvbiAob2JqLCB0eXBlLCBmbikgeyAgLy8gKEhUTUxFbGVtZW50LCBTdHJpbmcsIEZ1bmN0aW9uKVxyXG5cclxuXHRcdHZhciBpZCA9IEwuc3RhbXAoZm4pLFxyXG5cdFx0ICAgIGtleSA9ICdfbGVhZmxldF8nICsgdHlwZSArIGlkLFxyXG5cdFx0ICAgIGhhbmRsZXIgPSBvYmpba2V5XTtcclxuXHJcblx0XHRpZiAoIWhhbmRsZXIpIHsgcmV0dXJuIHRoaXM7IH1cclxuXHJcblx0XHRpZiAoTC5Ccm93c2VyLnBvaW50ZXIgJiYgdHlwZS5pbmRleE9mKCd0b3VjaCcpID09PSAwKSB7XHJcblx0XHRcdHRoaXMucmVtb3ZlUG9pbnRlckxpc3RlbmVyKG9iaiwgdHlwZSwgaWQpO1xyXG5cdFx0fSBlbHNlIGlmIChMLkJyb3dzZXIudG91Y2ggJiYgKHR5cGUgPT09ICdkYmxjbGljaycpICYmIHRoaXMucmVtb3ZlRG91YmxlVGFwTGlzdGVuZXIpIHtcclxuXHRcdFx0dGhpcy5yZW1vdmVEb3VibGVUYXBMaXN0ZW5lcihvYmosIGlkKTtcclxuXHJcblx0XHR9IGVsc2UgaWYgKCdyZW1vdmVFdmVudExpc3RlbmVyJyBpbiBvYmopIHtcclxuXHJcblx0XHRcdGlmICh0eXBlID09PSAnbW91c2V3aGVlbCcpIHtcclxuXHRcdFx0XHRvYmoucmVtb3ZlRXZlbnRMaXN0ZW5lcignRE9NTW91c2VTY3JvbGwnLCBoYW5kbGVyLCBmYWxzZSk7XHJcblx0XHRcdFx0b2JqLnJlbW92ZUV2ZW50TGlzdGVuZXIodHlwZSwgaGFuZGxlciwgZmFsc2UpO1xyXG5cclxuXHRcdFx0fSBlbHNlIGlmICgodHlwZSA9PT0gJ21vdXNlZW50ZXInKSB8fCAodHlwZSA9PT0gJ21vdXNlbGVhdmUnKSkge1xyXG5cdFx0XHRcdG9iai5yZW1vdmVFdmVudExpc3RlbmVyKCh0eXBlID09PSAnbW91c2VlbnRlcicgPyAnbW91c2VvdmVyJyA6ICdtb3VzZW91dCcpLCBoYW5kbGVyLCBmYWxzZSk7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0b2JqLnJlbW92ZUV2ZW50TGlzdGVuZXIodHlwZSwgaGFuZGxlciwgZmFsc2UpO1xyXG5cdFx0XHR9XHJcblx0XHR9IGVsc2UgaWYgKCdkZXRhY2hFdmVudCcgaW4gb2JqKSB7XHJcblx0XHRcdG9iai5kZXRhY2hFdmVudCgnb24nICsgdHlwZSwgaGFuZGxlcik7XHJcblx0XHR9XHJcblxyXG5cdFx0b2JqW2tleV0gPSBudWxsO1xyXG5cclxuXHRcdHJldHVybiB0aGlzO1xyXG5cdH0sXHJcblxyXG5cdHN0b3BQcm9wYWdhdGlvbjogZnVuY3Rpb24gKGUpIHtcclxuXHJcblx0XHRpZiAoZS5zdG9wUHJvcGFnYXRpb24pIHtcclxuXHRcdFx0ZS5zdG9wUHJvcGFnYXRpb24oKTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdGUuY2FuY2VsQnViYmxlID0gdHJ1ZTtcclxuXHRcdH1cclxuXHRcdEwuRG9tRXZlbnQuX3NraXBwZWQoZSk7XHJcblxyXG5cdFx0cmV0dXJuIHRoaXM7XHJcblx0fSxcclxuXHJcblx0ZGlzYWJsZVNjcm9sbFByb3BhZ2F0aW9uOiBmdW5jdGlvbiAoZWwpIHtcclxuXHRcdHZhciBzdG9wID0gTC5Eb21FdmVudC5zdG9wUHJvcGFnYXRpb247XHJcblxyXG5cdFx0cmV0dXJuIEwuRG9tRXZlbnRcclxuXHRcdFx0Lm9uKGVsLCAnbW91c2V3aGVlbCcsIHN0b3ApXHJcblx0XHRcdC5vbihlbCwgJ01vek1vdXNlUGl4ZWxTY3JvbGwnLCBzdG9wKTtcclxuXHR9LFxyXG5cclxuXHRkaXNhYmxlQ2xpY2tQcm9wYWdhdGlvbjogZnVuY3Rpb24gKGVsKSB7XHJcblx0XHR2YXIgc3RvcCA9IEwuRG9tRXZlbnQuc3RvcFByb3BhZ2F0aW9uO1xyXG5cclxuXHRcdGZvciAodmFyIGkgPSBMLkRyYWdnYWJsZS5TVEFSVC5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xyXG5cdFx0XHRMLkRvbUV2ZW50Lm9uKGVsLCBMLkRyYWdnYWJsZS5TVEFSVFtpXSwgc3RvcCk7XHJcblx0XHR9XHJcblxyXG5cdFx0cmV0dXJuIEwuRG9tRXZlbnRcclxuXHRcdFx0Lm9uKGVsLCAnY2xpY2snLCBMLkRvbUV2ZW50Ll9mYWtlU3RvcClcclxuXHRcdFx0Lm9uKGVsLCAnZGJsY2xpY2snLCBzdG9wKTtcclxuXHR9LFxyXG5cclxuXHRwcmV2ZW50RGVmYXVsdDogZnVuY3Rpb24gKGUpIHtcclxuXHJcblx0XHRpZiAoZS5wcmV2ZW50RGVmYXVsdCkge1xyXG5cdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRlLnJldHVyblZhbHVlID0gZmFsc2U7XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gdGhpcztcclxuXHR9LFxyXG5cclxuXHRzdG9wOiBmdW5jdGlvbiAoZSkge1xyXG5cdFx0cmV0dXJuIEwuRG9tRXZlbnRcclxuXHRcdFx0LnByZXZlbnREZWZhdWx0KGUpXHJcblx0XHRcdC5zdG9wUHJvcGFnYXRpb24oZSk7XHJcblx0fSxcclxuXHJcblx0Z2V0TW91c2VQb3NpdGlvbjogZnVuY3Rpb24gKGUsIGNvbnRhaW5lcikge1xyXG5cdFx0aWYgKCFjb250YWluZXIpIHtcclxuXHRcdFx0cmV0dXJuIG5ldyBMLlBvaW50KGUuY2xpZW50WCwgZS5jbGllbnRZKTtcclxuXHRcdH1cclxuXHJcblx0XHR2YXIgcmVjdCA9IGNvbnRhaW5lci5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcclxuXHJcblx0XHRyZXR1cm4gbmV3IEwuUG9pbnQoXHJcblx0XHRcdGUuY2xpZW50WCAtIHJlY3QubGVmdCAtIGNvbnRhaW5lci5jbGllbnRMZWZ0LFxyXG5cdFx0XHRlLmNsaWVudFkgLSByZWN0LnRvcCAtIGNvbnRhaW5lci5jbGllbnRUb3ApO1xyXG5cdH0sXHJcblxyXG5cdGdldFdoZWVsRGVsdGE6IGZ1bmN0aW9uIChlKSB7XHJcblxyXG5cdFx0dmFyIGRlbHRhID0gMDtcclxuXHJcblx0XHRpZiAoZS53aGVlbERlbHRhKSB7XHJcblx0XHRcdGRlbHRhID0gZS53aGVlbERlbHRhIC8gMTIwO1xyXG5cdFx0fVxyXG5cdFx0aWYgKGUuZGV0YWlsKSB7XHJcblx0XHRcdGRlbHRhID0gLWUuZGV0YWlsIC8gMztcclxuXHRcdH1cclxuXHRcdHJldHVybiBkZWx0YTtcclxuXHR9LFxyXG5cclxuXHRfc2tpcEV2ZW50czoge30sXHJcblxyXG5cdF9mYWtlU3RvcDogZnVuY3Rpb24gKGUpIHtcclxuXHRcdC8vIGZha2VzIHN0b3BQcm9wYWdhdGlvbiBieSBzZXR0aW5nIGEgc3BlY2lhbCBldmVudCBmbGFnLCBjaGVja2VkL3Jlc2V0IHdpdGggTC5Eb21FdmVudC5fc2tpcHBlZChlKVxyXG5cdFx0TC5Eb21FdmVudC5fc2tpcEV2ZW50c1tlLnR5cGVdID0gdHJ1ZTtcclxuXHR9LFxyXG5cclxuXHRfc2tpcHBlZDogZnVuY3Rpb24gKGUpIHtcclxuXHRcdHZhciBza2lwcGVkID0gdGhpcy5fc2tpcEV2ZW50c1tlLnR5cGVdO1xyXG5cdFx0Ly8gcmVzZXQgd2hlbiBjaGVja2luZywgYXMgaXQncyBvbmx5IHVzZWQgaW4gbWFwIGNvbnRhaW5lciBhbmQgcHJvcGFnYXRlcyBvdXRzaWRlIG9mIHRoZSBtYXBcclxuXHRcdHRoaXMuX3NraXBFdmVudHNbZS50eXBlXSA9IGZhbHNlO1xyXG5cdFx0cmV0dXJuIHNraXBwZWQ7XHJcblx0fSxcclxuXHJcblx0Ly8gY2hlY2sgaWYgZWxlbWVudCByZWFsbHkgbGVmdC9lbnRlcmVkIHRoZSBldmVudCB0YXJnZXQgKGZvciBtb3VzZWVudGVyL21vdXNlbGVhdmUpXHJcblx0X2NoZWNrTW91c2U6IGZ1bmN0aW9uIChlbCwgZSkge1xyXG5cclxuXHRcdHZhciByZWxhdGVkID0gZS5yZWxhdGVkVGFyZ2V0O1xyXG5cclxuXHRcdGlmICghcmVsYXRlZCkgeyByZXR1cm4gdHJ1ZTsgfVxyXG5cclxuXHRcdHRyeSB7XHJcblx0XHRcdHdoaWxlIChyZWxhdGVkICYmIChyZWxhdGVkICE9PSBlbCkpIHtcclxuXHRcdFx0XHRyZWxhdGVkID0gcmVsYXRlZC5wYXJlbnROb2RlO1xyXG5cdFx0XHR9XHJcblx0XHR9IGNhdGNoIChlcnIpIHtcclxuXHRcdFx0cmV0dXJuIGZhbHNlO1xyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIChyZWxhdGVkICE9PSBlbCk7XHJcblx0fSxcclxuXHJcblx0X2dldEV2ZW50OiBmdW5jdGlvbiAoKSB7IC8vIGV2aWwgbWFnaWMgZm9yIElFXHJcblx0XHQvKmpzaGludCBub2FyZzpmYWxzZSAqL1xyXG5cdFx0dmFyIGUgPSB3aW5kb3cuZXZlbnQ7XHJcblx0XHRpZiAoIWUpIHtcclxuXHRcdFx0dmFyIGNhbGxlciA9IGFyZ3VtZW50cy5jYWxsZWUuY2FsbGVyO1xyXG5cdFx0XHR3aGlsZSAoY2FsbGVyKSB7XHJcblx0XHRcdFx0ZSA9IGNhbGxlclsnYXJndW1lbnRzJ11bMF07XHJcblx0XHRcdFx0aWYgKGUgJiYgd2luZG93LkV2ZW50ID09PSBlLmNvbnN0cnVjdG9yKSB7XHJcblx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0Y2FsbGVyID0gY2FsbGVyLmNhbGxlcjtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIGU7XHJcblx0fSxcclxuXHJcblx0Ly8gdGhpcyBpcyBhIGhvcnJpYmxlIHdvcmthcm91bmQgZm9yIGEgYnVnIGluIEFuZHJvaWQgd2hlcmUgYSBzaW5nbGUgdG91Y2ggdHJpZ2dlcnMgdHdvIGNsaWNrIGV2ZW50c1xyXG5cdF9maWx0ZXJDbGljazogZnVuY3Rpb24gKGUsIGhhbmRsZXIpIHtcclxuXHRcdHZhciB0aW1lU3RhbXAgPSAoZS50aW1lU3RhbXAgfHwgZS5vcmlnaW5hbEV2ZW50LnRpbWVTdGFtcCksXHJcblx0XHRcdGVsYXBzZWQgPSBMLkRvbUV2ZW50Ll9sYXN0Q2xpY2sgJiYgKHRpbWVTdGFtcCAtIEwuRG9tRXZlbnQuX2xhc3RDbGljayk7XHJcblxyXG5cdFx0Ly8gYXJlIHRoZXkgY2xvc2VyIHRvZ2V0aGVyIHRoYW4gNTAwbXMgeWV0IG1vcmUgdGhhbiAxMDBtcz9cclxuXHRcdC8vIEFuZHJvaWQgdHlwaWNhbGx5IHRyaWdnZXJzIHRoZW0gfjMwMG1zIGFwYXJ0IHdoaWxlIG11bHRpcGxlIGxpc3RlbmVyc1xyXG5cdFx0Ly8gb24gdGhlIHNhbWUgZXZlbnQgc2hvdWxkIGJlIHRyaWdnZXJlZCBmYXIgZmFzdGVyO1xyXG5cdFx0Ly8gb3IgY2hlY2sgaWYgY2xpY2sgaXMgc2ltdWxhdGVkIG9uIHRoZSBlbGVtZW50LCBhbmQgaWYgaXQgaXMsIHJlamVjdCBhbnkgbm9uLXNpbXVsYXRlZCBldmVudHNcclxuXHJcblx0XHRpZiAoKGVsYXBzZWQgJiYgZWxhcHNlZCA+IDEwMCAmJiBlbGFwc2VkIDwgNTAwKSB8fCAoZS50YXJnZXQuX3NpbXVsYXRlZENsaWNrICYmICFlLl9zaW11bGF0ZWQpKSB7XHJcblx0XHRcdEwuRG9tRXZlbnQuc3RvcChlKTtcclxuXHRcdFx0cmV0dXJuO1xyXG5cdFx0fVxyXG5cdFx0TC5Eb21FdmVudC5fbGFzdENsaWNrID0gdGltZVN0YW1wO1xyXG5cclxuXHRcdHJldHVybiBoYW5kbGVyKGUpO1xyXG5cdH1cclxufTtcclxuXHJcbkwuRG9tRXZlbnQub24gPSBMLkRvbUV2ZW50LmFkZExpc3RlbmVyO1xyXG5MLkRvbUV2ZW50Lm9mZiA9IEwuRG9tRXZlbnQucmVtb3ZlTGlzdGVuZXI7XHJcblxuXG4vKlxyXG4gKiBMLkRyYWdnYWJsZSBhbGxvd3MgeW91IHRvIGFkZCBkcmFnZ2luZyBjYXBhYmlsaXRpZXMgdG8gYW55IGVsZW1lbnQuIFN1cHBvcnRzIG1vYmlsZSBkZXZpY2VzIHRvby5cclxuICovXHJcblxyXG5MLkRyYWdnYWJsZSA9IEwuQ2xhc3MuZXh0ZW5kKHtcclxuXHRpbmNsdWRlczogTC5NaXhpbi5FdmVudHMsXHJcblxyXG5cdHN0YXRpY3M6IHtcclxuXHRcdFNUQVJUOiBMLkJyb3dzZXIudG91Y2ggPyBbJ3RvdWNoc3RhcnQnLCAnbW91c2Vkb3duJ10gOiBbJ21vdXNlZG93biddLFxyXG5cdFx0RU5EOiB7XHJcblx0XHRcdG1vdXNlZG93bjogJ21vdXNldXAnLFxyXG5cdFx0XHR0b3VjaHN0YXJ0OiAndG91Y2hlbmQnLFxyXG5cdFx0XHRwb2ludGVyZG93bjogJ3RvdWNoZW5kJyxcclxuXHRcdFx0TVNQb2ludGVyRG93bjogJ3RvdWNoZW5kJ1xyXG5cdFx0fSxcclxuXHRcdE1PVkU6IHtcclxuXHRcdFx0bW91c2Vkb3duOiAnbW91c2Vtb3ZlJyxcclxuXHRcdFx0dG91Y2hzdGFydDogJ3RvdWNobW92ZScsXHJcblx0XHRcdHBvaW50ZXJkb3duOiAndG91Y2htb3ZlJyxcclxuXHRcdFx0TVNQb2ludGVyRG93bjogJ3RvdWNobW92ZSdcclxuXHRcdH1cclxuXHR9LFxyXG5cclxuXHRpbml0aWFsaXplOiBmdW5jdGlvbiAoZWxlbWVudCwgZHJhZ1N0YXJ0VGFyZ2V0KSB7XHJcblx0XHR0aGlzLl9lbGVtZW50ID0gZWxlbWVudDtcclxuXHRcdHRoaXMuX2RyYWdTdGFydFRhcmdldCA9IGRyYWdTdGFydFRhcmdldCB8fCBlbGVtZW50O1xyXG5cdH0sXHJcblxyXG5cdGVuYWJsZTogZnVuY3Rpb24gKCkge1xyXG5cdFx0aWYgKHRoaXMuX2VuYWJsZWQpIHsgcmV0dXJuOyB9XHJcblxyXG5cdFx0Zm9yICh2YXIgaSA9IEwuRHJhZ2dhYmxlLlNUQVJULmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XHJcblx0XHRcdEwuRG9tRXZlbnQub24odGhpcy5fZHJhZ1N0YXJ0VGFyZ2V0LCBMLkRyYWdnYWJsZS5TVEFSVFtpXSwgdGhpcy5fb25Eb3duLCB0aGlzKTtcclxuXHRcdH1cclxuXHJcblx0XHR0aGlzLl9lbmFibGVkID0gdHJ1ZTtcclxuXHR9LFxyXG5cclxuXHRkaXNhYmxlOiBmdW5jdGlvbiAoKSB7XHJcblx0XHRpZiAoIXRoaXMuX2VuYWJsZWQpIHsgcmV0dXJuOyB9XHJcblxyXG5cdFx0Zm9yICh2YXIgaSA9IEwuRHJhZ2dhYmxlLlNUQVJULmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XHJcblx0XHRcdEwuRG9tRXZlbnQub2ZmKHRoaXMuX2RyYWdTdGFydFRhcmdldCwgTC5EcmFnZ2FibGUuU1RBUlRbaV0sIHRoaXMuX29uRG93biwgdGhpcyk7XHJcblx0XHR9XHJcblxyXG5cdFx0dGhpcy5fZW5hYmxlZCA9IGZhbHNlO1xyXG5cdFx0dGhpcy5fbW92ZWQgPSBmYWxzZTtcclxuXHR9LFxyXG5cclxuXHRfb25Eb3duOiBmdW5jdGlvbiAoZSkge1xyXG5cdFx0dGhpcy5fbW92ZWQgPSBmYWxzZTtcclxuXHJcblx0XHRpZiAoZS5zaGlmdEtleSB8fCAoKGUud2hpY2ggIT09IDEpICYmIChlLmJ1dHRvbiAhPT0gMSkgJiYgIWUudG91Y2hlcykpIHsgcmV0dXJuOyB9XHJcblxyXG5cdFx0TC5Eb21FdmVudC5zdG9wUHJvcGFnYXRpb24oZSk7XHJcblxyXG5cdFx0aWYgKEwuRHJhZ2dhYmxlLl9kaXNhYmxlZCkgeyByZXR1cm47IH1cclxuXHJcblx0XHRMLkRvbVV0aWwuZGlzYWJsZUltYWdlRHJhZygpO1xyXG5cdFx0TC5Eb21VdGlsLmRpc2FibGVUZXh0U2VsZWN0aW9uKCk7XHJcblxyXG5cdFx0aWYgKHRoaXMuX21vdmluZykgeyByZXR1cm47IH1cclxuXHJcblx0XHR2YXIgZmlyc3QgPSBlLnRvdWNoZXMgPyBlLnRvdWNoZXNbMF0gOiBlO1xyXG5cclxuXHRcdHRoaXMuX3N0YXJ0UG9pbnQgPSBuZXcgTC5Qb2ludChmaXJzdC5jbGllbnRYLCBmaXJzdC5jbGllbnRZKTtcclxuXHRcdHRoaXMuX3N0YXJ0UG9zID0gdGhpcy5fbmV3UG9zID0gTC5Eb21VdGlsLmdldFBvc2l0aW9uKHRoaXMuX2VsZW1lbnQpO1xyXG5cclxuXHRcdEwuRG9tRXZlbnRcclxuXHRcdCAgICAub24oZG9jdW1lbnQsIEwuRHJhZ2dhYmxlLk1PVkVbZS50eXBlXSwgdGhpcy5fb25Nb3ZlLCB0aGlzKVxyXG5cdFx0ICAgIC5vbihkb2N1bWVudCwgTC5EcmFnZ2FibGUuRU5EW2UudHlwZV0sIHRoaXMuX29uVXAsIHRoaXMpO1xyXG5cdH0sXHJcblxyXG5cdF9vbk1vdmU6IGZ1bmN0aW9uIChlKSB7XHJcblx0XHRpZiAoZS50b3VjaGVzICYmIGUudG91Y2hlcy5sZW5ndGggPiAxKSB7XHJcblx0XHRcdHRoaXMuX21vdmVkID0gdHJ1ZTtcclxuXHRcdFx0cmV0dXJuO1xyXG5cdFx0fVxyXG5cclxuXHRcdHZhciBmaXJzdCA9IChlLnRvdWNoZXMgJiYgZS50b3VjaGVzLmxlbmd0aCA9PT0gMSA/IGUudG91Y2hlc1swXSA6IGUpLFxyXG5cdFx0ICAgIG5ld1BvaW50ID0gbmV3IEwuUG9pbnQoZmlyc3QuY2xpZW50WCwgZmlyc3QuY2xpZW50WSksXHJcblx0XHQgICAgb2Zmc2V0ID0gbmV3UG9pbnQuc3VidHJhY3QodGhpcy5fc3RhcnRQb2ludCk7XHJcblxyXG5cdFx0aWYgKCFvZmZzZXQueCAmJiAhb2Zmc2V0LnkpIHsgcmV0dXJuOyB9XHJcblx0XHRpZiAoTC5Ccm93c2VyLnRvdWNoICYmIE1hdGguYWJzKG9mZnNldC54KSArIE1hdGguYWJzKG9mZnNldC55KSA8IDMpIHsgcmV0dXJuOyB9XHJcblxyXG5cdFx0TC5Eb21FdmVudC5wcmV2ZW50RGVmYXVsdChlKTtcclxuXHJcblx0XHRpZiAoIXRoaXMuX21vdmVkKSB7XHJcblx0XHRcdHRoaXMuZmlyZSgnZHJhZ3N0YXJ0Jyk7XHJcblxyXG5cdFx0XHR0aGlzLl9tb3ZlZCA9IHRydWU7XHJcblx0XHRcdHRoaXMuX3N0YXJ0UG9zID0gTC5Eb21VdGlsLmdldFBvc2l0aW9uKHRoaXMuX2VsZW1lbnQpLnN1YnRyYWN0KG9mZnNldCk7XHJcblxyXG5cdFx0XHRMLkRvbVV0aWwuYWRkQ2xhc3MoZG9jdW1lbnQuYm9keSwgJ2xlYWZsZXQtZHJhZ2dpbmcnKTtcclxuXHRcdFx0dGhpcy5fbGFzdFRhcmdldCA9IGUudGFyZ2V0IHx8IGUuc3JjRWxlbWVudDtcclxuXHRcdFx0TC5Eb21VdGlsLmFkZENsYXNzKHRoaXMuX2xhc3RUYXJnZXQsICdsZWFmbGV0LWRyYWctdGFyZ2V0Jyk7XHJcblx0XHR9XHJcblxyXG5cdFx0dGhpcy5fbmV3UG9zID0gdGhpcy5fc3RhcnRQb3MuYWRkKG9mZnNldCk7XHJcblx0XHR0aGlzLl9tb3ZpbmcgPSB0cnVlO1xyXG5cclxuXHRcdEwuVXRpbC5jYW5jZWxBbmltRnJhbWUodGhpcy5fYW5pbVJlcXVlc3QpO1xyXG5cdFx0dGhpcy5fYW5pbVJlcXVlc3QgPSBMLlV0aWwucmVxdWVzdEFuaW1GcmFtZSh0aGlzLl91cGRhdGVQb3NpdGlvbiwgdGhpcywgdHJ1ZSwgdGhpcy5fZHJhZ1N0YXJ0VGFyZ2V0KTtcclxuXHR9LFxyXG5cclxuXHRfdXBkYXRlUG9zaXRpb246IGZ1bmN0aW9uICgpIHtcclxuXHRcdHRoaXMuZmlyZSgncHJlZHJhZycpO1xyXG5cdFx0TC5Eb21VdGlsLnNldFBvc2l0aW9uKHRoaXMuX2VsZW1lbnQsIHRoaXMuX25ld1Bvcyk7XHJcblx0XHR0aGlzLmZpcmUoJ2RyYWcnKTtcclxuXHR9LFxyXG5cclxuXHRfb25VcDogZnVuY3Rpb24gKCkge1xyXG5cdFx0TC5Eb21VdGlsLnJlbW92ZUNsYXNzKGRvY3VtZW50LmJvZHksICdsZWFmbGV0LWRyYWdnaW5nJyk7XHJcblxyXG5cdFx0aWYgKHRoaXMuX2xhc3RUYXJnZXQpIHtcclxuXHRcdFx0TC5Eb21VdGlsLnJlbW92ZUNsYXNzKHRoaXMuX2xhc3RUYXJnZXQsICdsZWFmbGV0LWRyYWctdGFyZ2V0Jyk7XHJcblx0XHRcdHRoaXMuX2xhc3RUYXJnZXQgPSBudWxsO1xyXG5cdFx0fVxyXG5cclxuXHRcdGZvciAodmFyIGkgaW4gTC5EcmFnZ2FibGUuTU9WRSkge1xyXG5cdFx0XHRMLkRvbUV2ZW50XHJcblx0XHRcdCAgICAub2ZmKGRvY3VtZW50LCBMLkRyYWdnYWJsZS5NT1ZFW2ldLCB0aGlzLl9vbk1vdmUpXHJcblx0XHRcdCAgICAub2ZmKGRvY3VtZW50LCBMLkRyYWdnYWJsZS5FTkRbaV0sIHRoaXMuX29uVXApO1xyXG5cdFx0fVxyXG5cclxuXHRcdEwuRG9tVXRpbC5lbmFibGVJbWFnZURyYWcoKTtcclxuXHRcdEwuRG9tVXRpbC5lbmFibGVUZXh0U2VsZWN0aW9uKCk7XHJcblxyXG5cdFx0aWYgKHRoaXMuX21vdmVkICYmIHRoaXMuX21vdmluZykge1xyXG5cdFx0XHQvLyBlbnN1cmUgZHJhZyBpcyBub3QgZmlyZWQgYWZ0ZXIgZHJhZ2VuZFxyXG5cdFx0XHRMLlV0aWwuY2FuY2VsQW5pbUZyYW1lKHRoaXMuX2FuaW1SZXF1ZXN0KTtcclxuXHJcblx0XHRcdHRoaXMuZmlyZSgnZHJhZ2VuZCcsIHtcclxuXHRcdFx0XHRkaXN0YW5jZTogdGhpcy5fbmV3UG9zLmRpc3RhbmNlVG8odGhpcy5fc3RhcnRQb3MpXHJcblx0XHRcdH0pO1xyXG5cdFx0fVxyXG5cclxuXHRcdHRoaXMuX21vdmluZyA9IGZhbHNlO1xyXG5cdH1cclxufSk7XHJcblxuXG4vKlxuXHRMLkhhbmRsZXIgaXMgYSBiYXNlIGNsYXNzIGZvciBoYW5kbGVyIGNsYXNzZXMgdGhhdCBhcmUgdXNlZCBpbnRlcm5hbGx5IHRvIGluamVjdFxuXHRpbnRlcmFjdGlvbiBmZWF0dXJlcyBsaWtlIGRyYWdnaW5nIHRvIGNsYXNzZXMgbGlrZSBNYXAgYW5kIE1hcmtlci5cbiovXG5cbkwuSGFuZGxlciA9IEwuQ2xhc3MuZXh0ZW5kKHtcblx0aW5pdGlhbGl6ZTogZnVuY3Rpb24gKG1hcCkge1xuXHRcdHRoaXMuX21hcCA9IG1hcDtcblx0fSxcblxuXHRlbmFibGU6IGZ1bmN0aW9uICgpIHtcblx0XHRpZiAodGhpcy5fZW5hYmxlZCkgeyByZXR1cm47IH1cblxuXHRcdHRoaXMuX2VuYWJsZWQgPSB0cnVlO1xuXHRcdHRoaXMuYWRkSG9va3MoKTtcblx0fSxcblxuXHRkaXNhYmxlOiBmdW5jdGlvbiAoKSB7XG5cdFx0aWYgKCF0aGlzLl9lbmFibGVkKSB7IHJldHVybjsgfVxuXG5cdFx0dGhpcy5fZW5hYmxlZCA9IGZhbHNlO1xuXHRcdHRoaXMucmVtb3ZlSG9va3MoKTtcblx0fSxcblxuXHRlbmFibGVkOiBmdW5jdGlvbiAoKSB7XG5cdFx0cmV0dXJuICEhdGhpcy5fZW5hYmxlZDtcblx0fVxufSk7XG5cblxuLypcbiAqIEwuSGFuZGxlci5NYXBEcmFnIGlzIHVzZWQgdG8gbWFrZSB0aGUgbWFwIGRyYWdnYWJsZSAod2l0aCBwYW5uaW5nIGluZXJ0aWEpLCBlbmFibGVkIGJ5IGRlZmF1bHQuXG4gKi9cblxuTC5NYXAubWVyZ2VPcHRpb25zKHtcblx0ZHJhZ2dpbmc6IHRydWUsXG5cblx0aW5lcnRpYTogIUwuQnJvd3Nlci5hbmRyb2lkMjMsXG5cdGluZXJ0aWFEZWNlbGVyYXRpb246IDM0MDAsIC8vIHB4L3NeMlxuXHRpbmVydGlhTWF4U3BlZWQ6IEluZmluaXR5LCAvLyBweC9zXG5cdGluZXJ0aWFUaHJlc2hvbGQ6IEwuQnJvd3Nlci50b3VjaCA/IDMyIDogMTgsIC8vIG1zXG5cdGVhc2VMaW5lYXJpdHk6IDAuMjUsXG5cblx0Ly8gVE9ETyByZWZhY3RvciwgbW92ZSB0byBDUlNcblx0d29ybGRDb3B5SnVtcDogZmFsc2Vcbn0pO1xuXG5MLk1hcC5EcmFnID0gTC5IYW5kbGVyLmV4dGVuZCh7XG5cdGFkZEhvb2tzOiBmdW5jdGlvbiAoKSB7XG5cdFx0aWYgKCF0aGlzLl9kcmFnZ2FibGUpIHtcblx0XHRcdHZhciBtYXAgPSB0aGlzLl9tYXA7XG5cblx0XHRcdHRoaXMuX2RyYWdnYWJsZSA9IG5ldyBMLkRyYWdnYWJsZShtYXAuX21hcFBhbmUsIG1hcC5fY29udGFpbmVyKTtcblxuXHRcdFx0dGhpcy5fZHJhZ2dhYmxlLm9uKHtcblx0XHRcdFx0J2RyYWdzdGFydCc6IHRoaXMuX29uRHJhZ1N0YXJ0LFxuXHRcdFx0XHQnZHJhZyc6IHRoaXMuX29uRHJhZyxcblx0XHRcdFx0J2RyYWdlbmQnOiB0aGlzLl9vbkRyYWdFbmRcblx0XHRcdH0sIHRoaXMpO1xuXG5cdFx0XHRpZiAobWFwLm9wdGlvbnMud29ybGRDb3B5SnVtcCkge1xuXHRcdFx0XHR0aGlzLl9kcmFnZ2FibGUub24oJ3ByZWRyYWcnLCB0aGlzLl9vblByZURyYWcsIHRoaXMpO1xuXHRcdFx0XHRtYXAub24oJ3ZpZXdyZXNldCcsIHRoaXMuX29uVmlld1Jlc2V0LCB0aGlzKTtcblxuXHRcdFx0XHRtYXAud2hlblJlYWR5KHRoaXMuX29uVmlld1Jlc2V0LCB0aGlzKTtcblx0XHRcdH1cblx0XHR9XG5cdFx0dGhpcy5fZHJhZ2dhYmxlLmVuYWJsZSgpO1xuXHR9LFxuXG5cdHJlbW92ZUhvb2tzOiBmdW5jdGlvbiAoKSB7XG5cdFx0dGhpcy5fZHJhZ2dhYmxlLmRpc2FibGUoKTtcblx0fSxcblxuXHRtb3ZlZDogZnVuY3Rpb24gKCkge1xuXHRcdHJldHVybiB0aGlzLl9kcmFnZ2FibGUgJiYgdGhpcy5fZHJhZ2dhYmxlLl9tb3ZlZDtcblx0fSxcblxuXHRfb25EcmFnU3RhcnQ6IGZ1bmN0aW9uICgpIHtcblx0XHR2YXIgbWFwID0gdGhpcy5fbWFwO1xuXG5cdFx0aWYgKG1hcC5fcGFuQW5pbSkge1xuXHRcdFx0bWFwLl9wYW5BbmltLnN0b3AoKTtcblx0XHR9XG5cblx0XHRtYXBcblx0XHQgICAgLmZpcmUoJ21vdmVzdGFydCcpXG5cdFx0ICAgIC5maXJlKCdkcmFnc3RhcnQnKTtcblxuXHRcdGlmIChtYXAub3B0aW9ucy5pbmVydGlhKSB7XG5cdFx0XHR0aGlzLl9wb3NpdGlvbnMgPSBbXTtcblx0XHRcdHRoaXMuX3RpbWVzID0gW107XG5cdFx0fVxuXHR9LFxuXG5cdF9vbkRyYWc6IGZ1bmN0aW9uICgpIHtcblx0XHRpZiAodGhpcy5fbWFwLm9wdGlvbnMuaW5lcnRpYSkge1xuXHRcdFx0dmFyIHRpbWUgPSB0aGlzLl9sYXN0VGltZSA9ICtuZXcgRGF0ZSgpLFxuXHRcdFx0ICAgIHBvcyA9IHRoaXMuX2xhc3RQb3MgPSB0aGlzLl9kcmFnZ2FibGUuX25ld1BvcztcblxuXHRcdFx0dGhpcy5fcG9zaXRpb25zLnB1c2gocG9zKTtcblx0XHRcdHRoaXMuX3RpbWVzLnB1c2godGltZSk7XG5cblx0XHRcdGlmICh0aW1lIC0gdGhpcy5fdGltZXNbMF0gPiAyMDApIHtcblx0XHRcdFx0dGhpcy5fcG9zaXRpb25zLnNoaWZ0KCk7XG5cdFx0XHRcdHRoaXMuX3RpbWVzLnNoaWZ0KCk7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0dGhpcy5fbWFwXG5cdFx0ICAgIC5maXJlKCdtb3ZlJylcblx0XHQgICAgLmZpcmUoJ2RyYWcnKTtcblx0fSxcblxuXHRfb25WaWV3UmVzZXQ6IGZ1bmN0aW9uICgpIHtcblx0XHQvLyBUT0RPIGZpeCBoYXJkY29kZWQgRWFydGggdmFsdWVzXG5cdFx0dmFyIHB4Q2VudGVyID0gdGhpcy5fbWFwLmdldFNpemUoKS5fZGl2aWRlQnkoMiksXG5cdFx0ICAgIHB4V29ybGRDZW50ZXIgPSB0aGlzLl9tYXAubGF0TG5nVG9MYXllclBvaW50KFswLCAwXSk7XG5cblx0XHR0aGlzLl9pbml0aWFsV29ybGRPZmZzZXQgPSBweFdvcmxkQ2VudGVyLnN1YnRyYWN0KHB4Q2VudGVyKS54O1xuXHRcdHRoaXMuX3dvcmxkV2lkdGggPSB0aGlzLl9tYXAucHJvamVjdChbMCwgMTgwXSkueDtcblx0fSxcblxuXHRfb25QcmVEcmFnOiBmdW5jdGlvbiAoKSB7XG5cdFx0Ly8gVE9ETyByZWZhY3RvciB0byBiZSBhYmxlIHRvIGFkanVzdCBtYXAgcGFuZSBwb3NpdGlvbiBhZnRlciB6b29tXG5cdFx0dmFyIHdvcmxkV2lkdGggPSB0aGlzLl93b3JsZFdpZHRoLFxuXHRcdCAgICBoYWxmV2lkdGggPSBNYXRoLnJvdW5kKHdvcmxkV2lkdGggLyAyKSxcblx0XHQgICAgZHggPSB0aGlzLl9pbml0aWFsV29ybGRPZmZzZXQsXG5cdFx0ICAgIHggPSB0aGlzLl9kcmFnZ2FibGUuX25ld1Bvcy54LFxuXHRcdCAgICBuZXdYMSA9ICh4IC0gaGFsZldpZHRoICsgZHgpICUgd29ybGRXaWR0aCArIGhhbGZXaWR0aCAtIGR4LFxuXHRcdCAgICBuZXdYMiA9ICh4ICsgaGFsZldpZHRoICsgZHgpICUgd29ybGRXaWR0aCAtIGhhbGZXaWR0aCAtIGR4LFxuXHRcdCAgICBuZXdYID0gTWF0aC5hYnMobmV3WDEgKyBkeCkgPCBNYXRoLmFicyhuZXdYMiArIGR4KSA/IG5ld1gxIDogbmV3WDI7XG5cblx0XHR0aGlzLl9kcmFnZ2FibGUuX25ld1Bvcy54ID0gbmV3WDtcblx0fSxcblxuXHRfb25EcmFnRW5kOiBmdW5jdGlvbiAoZSkge1xuXHRcdHZhciBtYXAgPSB0aGlzLl9tYXAsXG5cdFx0ICAgIG9wdGlvbnMgPSBtYXAub3B0aW9ucyxcblx0XHQgICAgZGVsYXkgPSArbmV3IERhdGUoKSAtIHRoaXMuX2xhc3RUaW1lLFxuXG5cdFx0ICAgIG5vSW5lcnRpYSA9ICFvcHRpb25zLmluZXJ0aWEgfHwgZGVsYXkgPiBvcHRpb25zLmluZXJ0aWFUaHJlc2hvbGQgfHwgIXRoaXMuX3Bvc2l0aW9uc1swXTtcblxuXHRcdG1hcC5maXJlKCdkcmFnZW5kJywgZSk7XG5cblx0XHRpZiAobm9JbmVydGlhKSB7XG5cdFx0XHRtYXAuZmlyZSgnbW92ZWVuZCcpO1xuXG5cdFx0fSBlbHNlIHtcblxuXHRcdFx0dmFyIGRpcmVjdGlvbiA9IHRoaXMuX2xhc3RQb3Muc3VidHJhY3QodGhpcy5fcG9zaXRpb25zWzBdKSxcblx0XHRcdCAgICBkdXJhdGlvbiA9ICh0aGlzLl9sYXN0VGltZSArIGRlbGF5IC0gdGhpcy5fdGltZXNbMF0pIC8gMTAwMCxcblx0XHRcdCAgICBlYXNlID0gb3B0aW9ucy5lYXNlTGluZWFyaXR5LFxuXG5cdFx0XHQgICAgc3BlZWRWZWN0b3IgPSBkaXJlY3Rpb24ubXVsdGlwbHlCeShlYXNlIC8gZHVyYXRpb24pLFxuXHRcdFx0ICAgIHNwZWVkID0gc3BlZWRWZWN0b3IuZGlzdGFuY2VUbyhbMCwgMF0pLFxuXG5cdFx0XHQgICAgbGltaXRlZFNwZWVkID0gTWF0aC5taW4ob3B0aW9ucy5pbmVydGlhTWF4U3BlZWQsIHNwZWVkKSxcblx0XHRcdCAgICBsaW1pdGVkU3BlZWRWZWN0b3IgPSBzcGVlZFZlY3Rvci5tdWx0aXBseUJ5KGxpbWl0ZWRTcGVlZCAvIHNwZWVkKSxcblxuXHRcdFx0ICAgIGRlY2VsZXJhdGlvbkR1cmF0aW9uID0gbGltaXRlZFNwZWVkIC8gKG9wdGlvbnMuaW5lcnRpYURlY2VsZXJhdGlvbiAqIGVhc2UpLFxuXHRcdFx0ICAgIG9mZnNldCA9IGxpbWl0ZWRTcGVlZFZlY3Rvci5tdWx0aXBseUJ5KC1kZWNlbGVyYXRpb25EdXJhdGlvbiAvIDIpLnJvdW5kKCk7XG5cblx0XHRcdGlmICghb2Zmc2V0LnggfHwgIW9mZnNldC55KSB7XG5cdFx0XHRcdG1hcC5maXJlKCdtb3ZlZW5kJyk7XG5cblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdG9mZnNldCA9IG1hcC5fbGltaXRPZmZzZXQob2Zmc2V0LCBtYXAub3B0aW9ucy5tYXhCb3VuZHMpO1xuXG5cdFx0XHRcdEwuVXRpbC5yZXF1ZXN0QW5pbUZyYW1lKGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0XHRtYXAucGFuQnkob2Zmc2V0LCB7XG5cdFx0XHRcdFx0XHRkdXJhdGlvbjogZGVjZWxlcmF0aW9uRHVyYXRpb24sXG5cdFx0XHRcdFx0XHRlYXNlTGluZWFyaXR5OiBlYXNlLFxuXHRcdFx0XHRcdFx0bm9Nb3ZlU3RhcnQ6IHRydWVcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG59KTtcblxuTC5NYXAuYWRkSW5pdEhvb2soJ2FkZEhhbmRsZXInLCAnZHJhZ2dpbmcnLCBMLk1hcC5EcmFnKTtcblxuXG4vKlxuICogTC5IYW5kbGVyLkRvdWJsZUNsaWNrWm9vbSBpcyB1c2VkIHRvIGhhbmRsZSBkb3VibGUtY2xpY2sgem9vbSBvbiB0aGUgbWFwLCBlbmFibGVkIGJ5IGRlZmF1bHQuXG4gKi9cblxuTC5NYXAubWVyZ2VPcHRpb25zKHtcblx0ZG91YmxlQ2xpY2tab29tOiB0cnVlXG59KTtcblxuTC5NYXAuRG91YmxlQ2xpY2tab29tID0gTC5IYW5kbGVyLmV4dGVuZCh7XG5cdGFkZEhvb2tzOiBmdW5jdGlvbiAoKSB7XG5cdFx0dGhpcy5fbWFwLm9uKCdkYmxjbGljaycsIHRoaXMuX29uRG91YmxlQ2xpY2ssIHRoaXMpO1xuXHR9LFxuXG5cdHJlbW92ZUhvb2tzOiBmdW5jdGlvbiAoKSB7XG5cdFx0dGhpcy5fbWFwLm9mZignZGJsY2xpY2snLCB0aGlzLl9vbkRvdWJsZUNsaWNrLCB0aGlzKTtcblx0fSxcblxuXHRfb25Eb3VibGVDbGljazogZnVuY3Rpb24gKGUpIHtcblx0XHR2YXIgbWFwID0gdGhpcy5fbWFwLFxuXHRcdCAgICB6b29tID0gbWFwLmdldFpvb20oKSArIChlLm9yaWdpbmFsRXZlbnQuc2hpZnRLZXkgPyAtMSA6IDEpO1xuXG5cdFx0aWYgKG1hcC5vcHRpb25zLmRvdWJsZUNsaWNrWm9vbSA9PT0gJ2NlbnRlcicpIHtcblx0XHRcdG1hcC5zZXRab29tKHpvb20pO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRtYXAuc2V0Wm9vbUFyb3VuZChlLmNvbnRhaW5lclBvaW50LCB6b29tKTtcblx0XHR9XG5cdH1cbn0pO1xuXG5MLk1hcC5hZGRJbml0SG9vaygnYWRkSGFuZGxlcicsICdkb3VibGVDbGlja1pvb20nLCBMLk1hcC5Eb3VibGVDbGlja1pvb20pO1xuXG5cbi8qXG4gKiBMLkhhbmRsZXIuU2Nyb2xsV2hlZWxab29tIGlzIHVzZWQgYnkgTC5NYXAgdG8gZW5hYmxlIG1vdXNlIHNjcm9sbCB3aGVlbCB6b29tIG9uIHRoZSBtYXAuXG4gKi9cblxuTC5NYXAubWVyZ2VPcHRpb25zKHtcblx0c2Nyb2xsV2hlZWxab29tOiB0cnVlXG59KTtcblxuTC5NYXAuU2Nyb2xsV2hlZWxab29tID0gTC5IYW5kbGVyLmV4dGVuZCh7XG5cdGFkZEhvb2tzOiBmdW5jdGlvbiAoKSB7XG5cdFx0TC5Eb21FdmVudC5vbih0aGlzLl9tYXAuX2NvbnRhaW5lciwgJ21vdXNld2hlZWwnLCB0aGlzLl9vbldoZWVsU2Nyb2xsLCB0aGlzKTtcblx0XHRMLkRvbUV2ZW50Lm9uKHRoaXMuX21hcC5fY29udGFpbmVyLCAnTW96TW91c2VQaXhlbFNjcm9sbCcsIEwuRG9tRXZlbnQucHJldmVudERlZmF1bHQpO1xuXHRcdHRoaXMuX2RlbHRhID0gMDtcblx0fSxcblxuXHRyZW1vdmVIb29rczogZnVuY3Rpb24gKCkge1xuXHRcdEwuRG9tRXZlbnQub2ZmKHRoaXMuX21hcC5fY29udGFpbmVyLCAnbW91c2V3aGVlbCcsIHRoaXMuX29uV2hlZWxTY3JvbGwpO1xuXHRcdEwuRG9tRXZlbnQub2ZmKHRoaXMuX21hcC5fY29udGFpbmVyLCAnTW96TW91c2VQaXhlbFNjcm9sbCcsIEwuRG9tRXZlbnQucHJldmVudERlZmF1bHQpO1xuXHR9LFxuXG5cdF9vbldoZWVsU2Nyb2xsOiBmdW5jdGlvbiAoZSkge1xuXHRcdHZhciBkZWx0YSA9IEwuRG9tRXZlbnQuZ2V0V2hlZWxEZWx0YShlKTtcblxuXHRcdHRoaXMuX2RlbHRhICs9IGRlbHRhO1xuXHRcdHRoaXMuX2xhc3RNb3VzZVBvcyA9IHRoaXMuX21hcC5tb3VzZUV2ZW50VG9Db250YWluZXJQb2ludChlKTtcblxuXHRcdGlmICghdGhpcy5fc3RhcnRUaW1lKSB7XG5cdFx0XHR0aGlzLl9zdGFydFRpbWUgPSArbmV3IERhdGUoKTtcblx0XHR9XG5cblx0XHR2YXIgbGVmdCA9IE1hdGgubWF4KDQwIC0gKCtuZXcgRGF0ZSgpIC0gdGhpcy5fc3RhcnRUaW1lKSwgMCk7XG5cblx0XHRjbGVhclRpbWVvdXQodGhpcy5fdGltZXIpO1xuXHRcdHRoaXMuX3RpbWVyID0gc2V0VGltZW91dChMLmJpbmQodGhpcy5fcGVyZm9ybVpvb20sIHRoaXMpLCBsZWZ0KTtcblxuXHRcdEwuRG9tRXZlbnQucHJldmVudERlZmF1bHQoZSk7XG5cdFx0TC5Eb21FdmVudC5zdG9wUHJvcGFnYXRpb24oZSk7XG5cdH0sXG5cblx0X3BlcmZvcm1ab29tOiBmdW5jdGlvbiAoKSB7XG5cdFx0dmFyIG1hcCA9IHRoaXMuX21hcCxcblx0XHQgICAgZGVsdGEgPSB0aGlzLl9kZWx0YSxcblx0XHQgICAgem9vbSA9IG1hcC5nZXRab29tKCk7XG5cblx0XHRkZWx0YSA9IGRlbHRhID4gMCA/IE1hdGguY2VpbChkZWx0YSkgOiBNYXRoLmZsb29yKGRlbHRhKTtcblx0XHRkZWx0YSA9IE1hdGgubWF4KE1hdGgubWluKGRlbHRhLCA0KSwgLTQpO1xuXHRcdGRlbHRhID0gbWFwLl9saW1pdFpvb20oem9vbSArIGRlbHRhKSAtIHpvb207XG5cblx0XHR0aGlzLl9kZWx0YSA9IDA7XG5cdFx0dGhpcy5fc3RhcnRUaW1lID0gbnVsbDtcblxuXHRcdGlmICghZGVsdGEpIHsgcmV0dXJuOyB9XG5cblx0XHRpZiAobWFwLm9wdGlvbnMuc2Nyb2xsV2hlZWxab29tID09PSAnY2VudGVyJykge1xuXHRcdFx0bWFwLnNldFpvb20oem9vbSArIGRlbHRhKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0bWFwLnNldFpvb21Bcm91bmQodGhpcy5fbGFzdE1vdXNlUG9zLCB6b29tICsgZGVsdGEpO1xuXHRcdH1cblx0fVxufSk7XG5cbkwuTWFwLmFkZEluaXRIb29rKCdhZGRIYW5kbGVyJywgJ3Njcm9sbFdoZWVsWm9vbScsIEwuTWFwLlNjcm9sbFdoZWVsWm9vbSk7XG5cblxuLypcclxuICogRXh0ZW5kcyB0aGUgZXZlbnQgaGFuZGxpbmcgY29kZSB3aXRoIGRvdWJsZSB0YXAgc3VwcG9ydCBmb3IgbW9iaWxlIGJyb3dzZXJzLlxyXG4gKi9cclxuXHJcbkwuZXh0ZW5kKEwuRG9tRXZlbnQsIHtcclxuXHJcblx0X3RvdWNoc3RhcnQ6IEwuQnJvd3Nlci5tc1BvaW50ZXIgPyAnTVNQb2ludGVyRG93bicgOiBMLkJyb3dzZXIucG9pbnRlciA/ICdwb2ludGVyZG93bicgOiAndG91Y2hzdGFydCcsXHJcblx0X3RvdWNoZW5kOiBMLkJyb3dzZXIubXNQb2ludGVyID8gJ01TUG9pbnRlclVwJyA6IEwuQnJvd3Nlci5wb2ludGVyID8gJ3BvaW50ZXJ1cCcgOiAndG91Y2hlbmQnLFxyXG5cclxuXHQvLyBpbnNwaXJlZCBieSBaZXB0byB0b3VjaCBjb2RlIGJ5IFRob21hcyBGdWNoc1xyXG5cdGFkZERvdWJsZVRhcExpc3RlbmVyOiBmdW5jdGlvbiAob2JqLCBoYW5kbGVyLCBpZCkge1xyXG5cdFx0dmFyIGxhc3QsXHJcblx0XHQgICAgZG91YmxlVGFwID0gZmFsc2UsXHJcblx0XHQgICAgZGVsYXkgPSAyNTAsXHJcblx0XHQgICAgdG91Y2gsXHJcblx0XHQgICAgcHJlID0gJ19sZWFmbGV0XycsXHJcblx0XHQgICAgdG91Y2hzdGFydCA9IHRoaXMuX3RvdWNoc3RhcnQsXHJcblx0XHQgICAgdG91Y2hlbmQgPSB0aGlzLl90b3VjaGVuZCxcclxuXHRcdCAgICB0cmFja2VkVG91Y2hlcyA9IFtdO1xyXG5cclxuXHRcdGZ1bmN0aW9uIG9uVG91Y2hTdGFydChlKSB7XHJcblx0XHRcdHZhciBjb3VudDtcclxuXHJcblx0XHRcdGlmIChMLkJyb3dzZXIucG9pbnRlcikge1xyXG5cdFx0XHRcdHRyYWNrZWRUb3VjaGVzLnB1c2goZS5wb2ludGVySWQpO1xyXG5cdFx0XHRcdGNvdW50ID0gdHJhY2tlZFRvdWNoZXMubGVuZ3RoO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdGNvdW50ID0gZS50b3VjaGVzLmxlbmd0aDtcclxuXHRcdFx0fVxyXG5cdFx0XHRpZiAoY291bnQgPiAxKSB7XHJcblx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHR2YXIgbm93ID0gRGF0ZS5ub3coKSxcclxuXHRcdFx0XHRkZWx0YSA9IG5vdyAtIChsYXN0IHx8IG5vdyk7XHJcblxyXG5cdFx0XHR0b3VjaCA9IGUudG91Y2hlcyA/IGUudG91Y2hlc1swXSA6IGU7XHJcblx0XHRcdGRvdWJsZVRhcCA9IChkZWx0YSA+IDAgJiYgZGVsdGEgPD0gZGVsYXkpO1xyXG5cdFx0XHRsYXN0ID0gbm93O1xyXG5cdFx0fVxyXG5cclxuXHRcdGZ1bmN0aW9uIG9uVG91Y2hFbmQoZSkge1xyXG5cdFx0XHRpZiAoTC5Ccm93c2VyLnBvaW50ZXIpIHtcclxuXHRcdFx0XHR2YXIgaWR4ID0gdHJhY2tlZFRvdWNoZXMuaW5kZXhPZihlLnBvaW50ZXJJZCk7XHJcblx0XHRcdFx0aWYgKGlkeCA9PT0gLTEpIHtcclxuXHRcdFx0XHRcdHJldHVybjtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0dHJhY2tlZFRvdWNoZXMuc3BsaWNlKGlkeCwgMSk7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGlmIChkb3VibGVUYXApIHtcclxuXHRcdFx0XHRpZiAoTC5Ccm93c2VyLnBvaW50ZXIpIHtcclxuXHRcdFx0XHRcdC8vIHdvcmsgYXJvdW5kIC50eXBlIGJlaW5nIHJlYWRvbmx5IHdpdGggTVNQb2ludGVyKiBldmVudHNcclxuXHRcdFx0XHRcdHZhciBuZXdUb3VjaCA9IHsgfSxcclxuXHRcdFx0XHRcdFx0cHJvcDtcclxuXHJcblx0XHRcdFx0XHQvLyBqc2hpbnQgZm9yaW46ZmFsc2VcclxuXHRcdFx0XHRcdGZvciAodmFyIGkgaW4gdG91Y2gpIHtcclxuXHRcdFx0XHRcdFx0cHJvcCA9IHRvdWNoW2ldO1xyXG5cdFx0XHRcdFx0XHRpZiAodHlwZW9mIHByb3AgPT09ICdmdW5jdGlvbicpIHtcclxuXHRcdFx0XHRcdFx0XHRuZXdUb3VjaFtpXSA9IHByb3AuYmluZCh0b3VjaCk7XHJcblx0XHRcdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRcdFx0bmV3VG91Y2hbaV0gPSBwcm9wO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR0b3VjaCA9IG5ld1RvdWNoO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHR0b3VjaC50eXBlID0gJ2RibGNsaWNrJztcclxuXHRcdFx0XHRoYW5kbGVyKHRvdWNoKTtcclxuXHRcdFx0XHRsYXN0ID0gbnVsbDtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0b2JqW3ByZSArIHRvdWNoc3RhcnQgKyBpZF0gPSBvblRvdWNoU3RhcnQ7XHJcblx0XHRvYmpbcHJlICsgdG91Y2hlbmQgKyBpZF0gPSBvblRvdWNoRW5kO1xyXG5cclxuXHRcdC8vIG9uIHBvaW50ZXIgd2UgbmVlZCB0byBsaXN0ZW4gb24gdGhlIGRvY3VtZW50LCBvdGhlcndpc2UgYSBkcmFnIHN0YXJ0aW5nIG9uIHRoZSBtYXAgYW5kIG1vdmluZyBvZmYgc2NyZWVuXHJcblx0XHQvLyB3aWxsIG5vdCBjb21lIHRocm91Z2ggdG8gdXMsIHNvIHdlIHdpbGwgbG9zZSB0cmFjayBvZiBob3cgbWFueSB0b3VjaGVzIGFyZSBvbmdvaW5nXHJcblx0XHR2YXIgZW5kRWxlbWVudCA9IEwuQnJvd3Nlci5wb2ludGVyID8gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50IDogb2JqO1xyXG5cclxuXHRcdG9iai5hZGRFdmVudExpc3RlbmVyKHRvdWNoc3RhcnQsIG9uVG91Y2hTdGFydCwgZmFsc2UpO1xyXG5cdFx0ZW5kRWxlbWVudC5hZGRFdmVudExpc3RlbmVyKHRvdWNoZW5kLCBvblRvdWNoRW5kLCBmYWxzZSk7XHJcblxyXG5cdFx0aWYgKEwuQnJvd3Nlci5wb2ludGVyKSB7XHJcblx0XHRcdGVuZEVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihMLkRvbUV2ZW50LlBPSU5URVJfQ0FOQ0VMLCBvblRvdWNoRW5kLCBmYWxzZSk7XHJcblx0XHR9XHJcblxyXG5cdFx0cmV0dXJuIHRoaXM7XHJcblx0fSxcclxuXHJcblx0cmVtb3ZlRG91YmxlVGFwTGlzdGVuZXI6IGZ1bmN0aW9uIChvYmosIGlkKSB7XHJcblx0XHR2YXIgcHJlID0gJ19sZWFmbGV0Xyc7XHJcblxyXG5cdFx0b2JqLnJlbW92ZUV2ZW50TGlzdGVuZXIodGhpcy5fdG91Y2hzdGFydCwgb2JqW3ByZSArIHRoaXMuX3RvdWNoc3RhcnQgKyBpZF0sIGZhbHNlKTtcclxuXHRcdChMLkJyb3dzZXIucG9pbnRlciA/IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudCA6IG9iaikucmVtb3ZlRXZlbnRMaXN0ZW5lcihcclxuXHRcdCAgICAgICAgdGhpcy5fdG91Y2hlbmQsIG9ialtwcmUgKyB0aGlzLl90b3VjaGVuZCArIGlkXSwgZmFsc2UpO1xyXG5cclxuXHRcdGlmIChMLkJyb3dzZXIucG9pbnRlcikge1xyXG5cdFx0XHRkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihMLkRvbUV2ZW50LlBPSU5URVJfQ0FOQ0VMLCBvYmpbcHJlICsgdGhpcy5fdG91Y2hlbmQgKyBpZF0sXHJcblx0XHRcdFx0ZmFsc2UpO1xyXG5cdFx0fVxyXG5cclxuXHRcdHJldHVybiB0aGlzO1xyXG5cdH1cclxufSk7XHJcblxuXG4vKlxuICogRXh0ZW5kcyBMLkRvbUV2ZW50IHRvIHByb3ZpZGUgdG91Y2ggc3VwcG9ydCBmb3IgSW50ZXJuZXQgRXhwbG9yZXIgYW5kIFdpbmRvd3MtYmFzZWQgZGV2aWNlcy5cbiAqL1xuXG5MLmV4dGVuZChMLkRvbUV2ZW50LCB7XG5cblx0Ly9zdGF0aWNcblx0UE9JTlRFUl9ET1dOOiBMLkJyb3dzZXIubXNQb2ludGVyID8gJ01TUG9pbnRlckRvd24nIDogJ3BvaW50ZXJkb3duJyxcblx0UE9JTlRFUl9NT1ZFOiBMLkJyb3dzZXIubXNQb2ludGVyID8gJ01TUG9pbnRlck1vdmUnIDogJ3BvaW50ZXJtb3ZlJyxcblx0UE9JTlRFUl9VUDogTC5Ccm93c2VyLm1zUG9pbnRlciA/ICdNU1BvaW50ZXJVcCcgOiAncG9pbnRlcnVwJyxcblx0UE9JTlRFUl9DQU5DRUw6IEwuQnJvd3Nlci5tc1BvaW50ZXIgPyAnTVNQb2ludGVyQ2FuY2VsJyA6ICdwb2ludGVyY2FuY2VsJyxcblxuXHRfcG9pbnRlcnM6IFtdLFxuXHRfcG9pbnRlckRvY3VtZW50TGlzdGVuZXI6IGZhbHNlLFxuXG5cdC8vIFByb3ZpZGVzIGEgdG91Y2ggZXZlbnRzIHdyYXBwZXIgZm9yIChtcylwb2ludGVyIGV2ZW50cy5cblx0Ly8gQmFzZWQgb24gY2hhbmdlcyBieSB2ZXByb3phIGh0dHBzOi8vZ2l0aHViLmNvbS9DbG91ZE1hZGUvTGVhZmxldC9wdWxsLzEwMTlcblx0Ly9yZWYgaHR0cDovL3d3dy53My5vcmcvVFIvcG9pbnRlcmV2ZW50cy8gaHR0cHM6Ly93d3cudzMub3JnL0J1Z3MvUHVibGljL3Nob3dfYnVnLmNnaT9pZD0yMjg5MFxuXG5cdGFkZFBvaW50ZXJMaXN0ZW5lcjogZnVuY3Rpb24gKG9iaiwgdHlwZSwgaGFuZGxlciwgaWQpIHtcblxuXHRcdHN3aXRjaCAodHlwZSkge1xuXHRcdGNhc2UgJ3RvdWNoc3RhcnQnOlxuXHRcdFx0cmV0dXJuIHRoaXMuYWRkUG9pbnRlckxpc3RlbmVyU3RhcnQob2JqLCB0eXBlLCBoYW5kbGVyLCBpZCk7XG5cdFx0Y2FzZSAndG91Y2hlbmQnOlxuXHRcdFx0cmV0dXJuIHRoaXMuYWRkUG9pbnRlckxpc3RlbmVyRW5kKG9iaiwgdHlwZSwgaGFuZGxlciwgaWQpO1xuXHRcdGNhc2UgJ3RvdWNobW92ZSc6XG5cdFx0XHRyZXR1cm4gdGhpcy5hZGRQb2ludGVyTGlzdGVuZXJNb3ZlKG9iaiwgdHlwZSwgaGFuZGxlciwgaWQpO1xuXHRcdGRlZmF1bHQ6XG5cdFx0XHR0aHJvdyAnVW5rbm93biB0b3VjaCBldmVudCB0eXBlJztcblx0XHR9XG5cdH0sXG5cblx0YWRkUG9pbnRlckxpc3RlbmVyU3RhcnQ6IGZ1bmN0aW9uIChvYmosIHR5cGUsIGhhbmRsZXIsIGlkKSB7XG5cdFx0dmFyIHByZSA9ICdfbGVhZmxldF8nLFxuXHRcdCAgICBwb2ludGVycyA9IHRoaXMuX3BvaW50ZXJzO1xuXG5cdFx0dmFyIGNiID0gZnVuY3Rpb24gKGUpIHtcblxuXHRcdFx0TC5Eb21FdmVudC5wcmV2ZW50RGVmYXVsdChlKTtcblxuXHRcdFx0dmFyIGFscmVhZHlJbkFycmF5ID0gZmFsc2U7XG5cdFx0XHRmb3IgKHZhciBpID0gMDsgaSA8IHBvaW50ZXJzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRcdGlmIChwb2ludGVyc1tpXS5wb2ludGVySWQgPT09IGUucG9pbnRlcklkKSB7XG5cdFx0XHRcdFx0YWxyZWFkeUluQXJyYXkgPSB0cnVlO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRpZiAoIWFscmVhZHlJbkFycmF5KSB7XG5cdFx0XHRcdHBvaW50ZXJzLnB1c2goZSk7XG5cdFx0XHR9XG5cblx0XHRcdGUudG91Y2hlcyA9IHBvaW50ZXJzLnNsaWNlKCk7XG5cdFx0XHRlLmNoYW5nZWRUb3VjaGVzID0gW2VdO1xuXG5cdFx0XHRoYW5kbGVyKGUpO1xuXHRcdH07XG5cblx0XHRvYmpbcHJlICsgJ3RvdWNoc3RhcnQnICsgaWRdID0gY2I7XG5cdFx0b2JqLmFkZEV2ZW50TGlzdGVuZXIodGhpcy5QT0lOVEVSX0RPV04sIGNiLCBmYWxzZSk7XG5cblx0XHQvLyBuZWVkIHRvIGFsc28gbGlzdGVuIGZvciBlbmQgZXZlbnRzIHRvIGtlZXAgdGhlIF9wb2ludGVycyBsaXN0IGFjY3VyYXRlXG5cdFx0Ly8gdGhpcyBuZWVkcyB0byBiZSBvbiB0aGUgYm9keSBhbmQgbmV2ZXIgZ28gYXdheVxuXHRcdGlmICghdGhpcy5fcG9pbnRlckRvY3VtZW50TGlzdGVuZXIpIHtcblx0XHRcdHZhciBpbnRlcm5hbENiID0gZnVuY3Rpb24gKGUpIHtcblx0XHRcdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBwb2ludGVycy5sZW5ndGg7IGkrKykge1xuXHRcdFx0XHRcdGlmIChwb2ludGVyc1tpXS5wb2ludGVySWQgPT09IGUucG9pbnRlcklkKSB7XG5cdFx0XHRcdFx0XHRwb2ludGVycy5zcGxpY2UoaSwgMSk7XG5cdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH07XG5cdFx0XHQvL1dlIGxpc3RlbiBvbiB0aGUgZG9jdW1lbnRFbGVtZW50IGFzIGFueSBkcmFncyB0aGF0IGVuZCBieSBtb3ZpbmcgdGhlIHRvdWNoIG9mZiB0aGUgc2NyZWVuIGdldCBmaXJlZCB0aGVyZVxuXHRcdFx0ZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIodGhpcy5QT0lOVEVSX1VQLCBpbnRlcm5hbENiLCBmYWxzZSk7XG5cdFx0XHRkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcih0aGlzLlBPSU5URVJfQ0FOQ0VMLCBpbnRlcm5hbENiLCBmYWxzZSk7XG5cblx0XHRcdHRoaXMuX3BvaW50ZXJEb2N1bWVudExpc3RlbmVyID0gdHJ1ZTtcblx0XHR9XG5cblx0XHRyZXR1cm4gdGhpcztcblx0fSxcblxuXHRhZGRQb2ludGVyTGlzdGVuZXJNb3ZlOiBmdW5jdGlvbiAob2JqLCB0eXBlLCBoYW5kbGVyLCBpZCkge1xuXHRcdHZhciBwcmUgPSAnX2xlYWZsZXRfJyxcblx0XHQgICAgdG91Y2hlcyA9IHRoaXMuX3BvaW50ZXJzO1xuXG5cdFx0ZnVuY3Rpb24gY2IoZSkge1xuXG5cdFx0XHQvLyBkb24ndCBmaXJlIHRvdWNoIG1vdmVzIHdoZW4gbW91c2UgaXNuJ3QgZG93blxuXHRcdFx0aWYgKChlLnBvaW50ZXJUeXBlID09PSBlLk1TUE9JTlRFUl9UWVBFX01PVVNFIHx8IGUucG9pbnRlclR5cGUgPT09ICdtb3VzZScpICYmIGUuYnV0dG9ucyA9PT0gMCkgeyByZXR1cm47IH1cblxuXHRcdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCB0b3VjaGVzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRcdGlmICh0b3VjaGVzW2ldLnBvaW50ZXJJZCA9PT0gZS5wb2ludGVySWQpIHtcblx0XHRcdFx0XHR0b3VjaGVzW2ldID0gZTtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0XHRlLnRvdWNoZXMgPSB0b3VjaGVzLnNsaWNlKCk7XG5cdFx0XHRlLmNoYW5nZWRUb3VjaGVzID0gW2VdO1xuXG5cdFx0XHRoYW5kbGVyKGUpO1xuXHRcdH1cblxuXHRcdG9ialtwcmUgKyAndG91Y2htb3ZlJyArIGlkXSA9IGNiO1xuXHRcdG9iai5hZGRFdmVudExpc3RlbmVyKHRoaXMuUE9JTlRFUl9NT1ZFLCBjYiwgZmFsc2UpO1xuXG5cdFx0cmV0dXJuIHRoaXM7XG5cdH0sXG5cblx0YWRkUG9pbnRlckxpc3RlbmVyRW5kOiBmdW5jdGlvbiAob2JqLCB0eXBlLCBoYW5kbGVyLCBpZCkge1xuXHRcdHZhciBwcmUgPSAnX2xlYWZsZXRfJyxcblx0XHQgICAgdG91Y2hlcyA9IHRoaXMuX3BvaW50ZXJzO1xuXG5cdFx0dmFyIGNiID0gZnVuY3Rpb24gKGUpIHtcblx0XHRcdGZvciAodmFyIGkgPSAwOyBpIDwgdG91Y2hlcy5sZW5ndGg7IGkrKykge1xuXHRcdFx0XHRpZiAodG91Y2hlc1tpXS5wb2ludGVySWQgPT09IGUucG9pbnRlcklkKSB7XG5cdFx0XHRcdFx0dG91Y2hlcy5zcGxpY2UoaSwgMSk7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdFx0ZS50b3VjaGVzID0gdG91Y2hlcy5zbGljZSgpO1xuXHRcdFx0ZS5jaGFuZ2VkVG91Y2hlcyA9IFtlXTtcblxuXHRcdFx0aGFuZGxlcihlKTtcblx0XHR9O1xuXG5cdFx0b2JqW3ByZSArICd0b3VjaGVuZCcgKyBpZF0gPSBjYjtcblx0XHRvYmouYWRkRXZlbnRMaXN0ZW5lcih0aGlzLlBPSU5URVJfVVAsIGNiLCBmYWxzZSk7XG5cdFx0b2JqLmFkZEV2ZW50TGlzdGVuZXIodGhpcy5QT0lOVEVSX0NBTkNFTCwgY2IsIGZhbHNlKTtcblxuXHRcdHJldHVybiB0aGlzO1xuXHR9LFxuXG5cdHJlbW92ZVBvaW50ZXJMaXN0ZW5lcjogZnVuY3Rpb24gKG9iaiwgdHlwZSwgaWQpIHtcblx0XHR2YXIgcHJlID0gJ19sZWFmbGV0XycsXG5cdFx0ICAgIGNiID0gb2JqW3ByZSArIHR5cGUgKyBpZF07XG5cblx0XHRzd2l0Y2ggKHR5cGUpIHtcblx0XHRjYXNlICd0b3VjaHN0YXJ0Jzpcblx0XHRcdG9iai5yZW1vdmVFdmVudExpc3RlbmVyKHRoaXMuUE9JTlRFUl9ET1dOLCBjYiwgZmFsc2UpO1xuXHRcdFx0YnJlYWs7XG5cdFx0Y2FzZSAndG91Y2htb3ZlJzpcblx0XHRcdG9iai5yZW1vdmVFdmVudExpc3RlbmVyKHRoaXMuUE9JTlRFUl9NT1ZFLCBjYiwgZmFsc2UpO1xuXHRcdFx0YnJlYWs7XG5cdFx0Y2FzZSAndG91Y2hlbmQnOlxuXHRcdFx0b2JqLnJlbW92ZUV2ZW50TGlzdGVuZXIodGhpcy5QT0lOVEVSX1VQLCBjYiwgZmFsc2UpO1xuXHRcdFx0b2JqLnJlbW92ZUV2ZW50TGlzdGVuZXIodGhpcy5QT0lOVEVSX0NBTkNFTCwgY2IsIGZhbHNlKTtcblx0XHRcdGJyZWFrO1xuXHRcdH1cblxuXHRcdHJldHVybiB0aGlzO1xuXHR9XG59KTtcblxuXG4vKlxuICogTC5IYW5kbGVyLlRvdWNoWm9vbSBpcyB1c2VkIGJ5IEwuTWFwIHRvIGFkZCBwaW5jaCB6b29tIG9uIHN1cHBvcnRlZCBtb2JpbGUgYnJvd3NlcnMuXG4gKi9cblxuTC5NYXAubWVyZ2VPcHRpb25zKHtcblx0dG91Y2hab29tOiBMLkJyb3dzZXIudG91Y2ggJiYgIUwuQnJvd3Nlci5hbmRyb2lkMjMsXG5cdGJvdW5jZUF0Wm9vbUxpbWl0czogdHJ1ZVxufSk7XG5cbkwuTWFwLlRvdWNoWm9vbSA9IEwuSGFuZGxlci5leHRlbmQoe1xuXHRhZGRIb29rczogZnVuY3Rpb24gKCkge1xuXHRcdEwuRG9tRXZlbnQub24odGhpcy5fbWFwLl9jb250YWluZXIsICd0b3VjaHN0YXJ0JywgdGhpcy5fb25Ub3VjaFN0YXJ0LCB0aGlzKTtcblx0fSxcblxuXHRyZW1vdmVIb29rczogZnVuY3Rpb24gKCkge1xuXHRcdEwuRG9tRXZlbnQub2ZmKHRoaXMuX21hcC5fY29udGFpbmVyLCAndG91Y2hzdGFydCcsIHRoaXMuX29uVG91Y2hTdGFydCwgdGhpcyk7XG5cdH0sXG5cblx0X29uVG91Y2hTdGFydDogZnVuY3Rpb24gKGUpIHtcblx0XHR2YXIgbWFwID0gdGhpcy5fbWFwO1xuXG5cdFx0aWYgKCFlLnRvdWNoZXMgfHwgZS50b3VjaGVzLmxlbmd0aCAhPT0gMiB8fCBtYXAuX2FuaW1hdGluZ1pvb20gfHwgdGhpcy5fem9vbWluZykgeyByZXR1cm47IH1cblxuXHRcdHZhciBwMSA9IG1hcC5tb3VzZUV2ZW50VG9MYXllclBvaW50KGUudG91Y2hlc1swXSksXG5cdFx0ICAgIHAyID0gbWFwLm1vdXNlRXZlbnRUb0xheWVyUG9pbnQoZS50b3VjaGVzWzFdKSxcblx0XHQgICAgdmlld0NlbnRlciA9IG1hcC5fZ2V0Q2VudGVyTGF5ZXJQb2ludCgpO1xuXG5cdFx0dGhpcy5fc3RhcnRDZW50ZXIgPSBwMS5hZGQocDIpLl9kaXZpZGVCeSgyKTtcblx0XHR0aGlzLl9zdGFydERpc3QgPSBwMS5kaXN0YW5jZVRvKHAyKTtcblxuXHRcdHRoaXMuX21vdmVkID0gZmFsc2U7XG5cdFx0dGhpcy5fem9vbWluZyA9IHRydWU7XG5cblx0XHR0aGlzLl9jZW50ZXJPZmZzZXQgPSB2aWV3Q2VudGVyLnN1YnRyYWN0KHRoaXMuX3N0YXJ0Q2VudGVyKTtcblxuXHRcdGlmIChtYXAuX3BhbkFuaW0pIHtcblx0XHRcdG1hcC5fcGFuQW5pbS5zdG9wKCk7XG5cdFx0fVxuXG5cdFx0TC5Eb21FdmVudFxuXHRcdCAgICAub24oZG9jdW1lbnQsICd0b3VjaG1vdmUnLCB0aGlzLl9vblRvdWNoTW92ZSwgdGhpcylcblx0XHQgICAgLm9uKGRvY3VtZW50LCAndG91Y2hlbmQnLCB0aGlzLl9vblRvdWNoRW5kLCB0aGlzKTtcblxuXHRcdEwuRG9tRXZlbnQucHJldmVudERlZmF1bHQoZSk7XG5cdH0sXG5cblx0X29uVG91Y2hNb3ZlOiBmdW5jdGlvbiAoZSkge1xuXHRcdHZhciBtYXAgPSB0aGlzLl9tYXA7XG5cblx0XHRpZiAoIWUudG91Y2hlcyB8fCBlLnRvdWNoZXMubGVuZ3RoICE9PSAyIHx8ICF0aGlzLl96b29taW5nKSB7IHJldHVybjsgfVxuXG5cdFx0dmFyIHAxID0gbWFwLm1vdXNlRXZlbnRUb0xheWVyUG9pbnQoZS50b3VjaGVzWzBdKSxcblx0XHQgICAgcDIgPSBtYXAubW91c2VFdmVudFRvTGF5ZXJQb2ludChlLnRvdWNoZXNbMV0pO1xuXG5cdFx0dGhpcy5fc2NhbGUgPSBwMS5kaXN0YW5jZVRvKHAyKSAvIHRoaXMuX3N0YXJ0RGlzdDtcblx0XHR0aGlzLl9kZWx0YSA9IHAxLl9hZGQocDIpLl9kaXZpZGVCeSgyKS5fc3VidHJhY3QodGhpcy5fc3RhcnRDZW50ZXIpO1xuXG5cdFx0aWYgKHRoaXMuX3NjYWxlID09PSAxKSB7IHJldHVybjsgfVxuXG5cdFx0aWYgKCFtYXAub3B0aW9ucy5ib3VuY2VBdFpvb21MaW1pdHMpIHtcblx0XHRcdGlmICgobWFwLmdldFpvb20oKSA9PT0gbWFwLmdldE1pblpvb20oKSAmJiB0aGlzLl9zY2FsZSA8IDEpIHx8XG5cdFx0XHQgICAgKG1hcC5nZXRab29tKCkgPT09IG1hcC5nZXRNYXhab29tKCkgJiYgdGhpcy5fc2NhbGUgPiAxKSkgeyByZXR1cm47IH1cblx0XHR9XG5cblx0XHRpZiAoIXRoaXMuX21vdmVkKSB7XG5cdFx0XHRMLkRvbVV0aWwuYWRkQ2xhc3MobWFwLl9tYXBQYW5lLCAnbGVhZmxldC10b3VjaGluZycpO1xuXG5cdFx0XHRtYXBcblx0XHRcdCAgICAuZmlyZSgnbW92ZXN0YXJ0Jylcblx0XHRcdCAgICAuZmlyZSgnem9vbXN0YXJ0Jyk7XG5cblx0XHRcdHRoaXMuX21vdmVkID0gdHJ1ZTtcblx0XHR9XG5cblx0XHRMLlV0aWwuY2FuY2VsQW5pbUZyYW1lKHRoaXMuX2FuaW1SZXF1ZXN0KTtcblx0XHR0aGlzLl9hbmltUmVxdWVzdCA9IEwuVXRpbC5yZXF1ZXN0QW5pbUZyYW1lKFxuXHRcdCAgICAgICAgdGhpcy5fdXBkYXRlT25Nb3ZlLCB0aGlzLCB0cnVlLCB0aGlzLl9tYXAuX2NvbnRhaW5lcik7XG5cblx0XHRMLkRvbUV2ZW50LnByZXZlbnREZWZhdWx0KGUpO1xuXHR9LFxuXG5cdF91cGRhdGVPbk1vdmU6IGZ1bmN0aW9uICgpIHtcblx0XHR2YXIgbWFwID0gdGhpcy5fbWFwLFxuXHRcdCAgICBvcmlnaW4gPSB0aGlzLl9nZXRTY2FsZU9yaWdpbigpLFxuXHRcdCAgICBjZW50ZXIgPSBtYXAubGF5ZXJQb2ludFRvTGF0TG5nKG9yaWdpbiksXG5cdFx0ICAgIHpvb20gPSBtYXAuZ2V0U2NhbGVab29tKHRoaXMuX3NjYWxlKTtcblxuXHRcdG1hcC5fYW5pbWF0ZVpvb20oY2VudGVyLCB6b29tLCB0aGlzLl9zdGFydENlbnRlciwgdGhpcy5fc2NhbGUsIHRoaXMuX2RlbHRhLCBmYWxzZSwgdHJ1ZSk7XG5cdH0sXG5cblx0X29uVG91Y2hFbmQ6IGZ1bmN0aW9uICgpIHtcblx0XHRpZiAoIXRoaXMuX21vdmVkIHx8ICF0aGlzLl96b29taW5nKSB7XG5cdFx0XHR0aGlzLl96b29taW5nID0gZmFsc2U7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0dmFyIG1hcCA9IHRoaXMuX21hcDtcblxuXHRcdHRoaXMuX3pvb21pbmcgPSBmYWxzZTtcblx0XHRMLkRvbVV0aWwucmVtb3ZlQ2xhc3MobWFwLl9tYXBQYW5lLCAnbGVhZmxldC10b3VjaGluZycpO1xuXHRcdEwuVXRpbC5jYW5jZWxBbmltRnJhbWUodGhpcy5fYW5pbVJlcXVlc3QpO1xuXG5cdFx0TC5Eb21FdmVudFxuXHRcdCAgICAub2ZmKGRvY3VtZW50LCAndG91Y2htb3ZlJywgdGhpcy5fb25Ub3VjaE1vdmUpXG5cdFx0ICAgIC5vZmYoZG9jdW1lbnQsICd0b3VjaGVuZCcsIHRoaXMuX29uVG91Y2hFbmQpO1xuXG5cdFx0dmFyIG9yaWdpbiA9IHRoaXMuX2dldFNjYWxlT3JpZ2luKCksXG5cdFx0ICAgIGNlbnRlciA9IG1hcC5sYXllclBvaW50VG9MYXRMbmcob3JpZ2luKSxcblxuXHRcdCAgICBvbGRab29tID0gbWFwLmdldFpvb20oKSxcblx0XHQgICAgZmxvYXRab29tRGVsdGEgPSBtYXAuZ2V0U2NhbGVab29tKHRoaXMuX3NjYWxlKSAtIG9sZFpvb20sXG5cdFx0ICAgIHJvdW5kWm9vbURlbHRhID0gKGZsb2F0Wm9vbURlbHRhID4gMCA/XG5cdFx0ICAgICAgICAgICAgTWF0aC5jZWlsKGZsb2F0Wm9vbURlbHRhKSA6IE1hdGguZmxvb3IoZmxvYXRab29tRGVsdGEpKSxcblxuXHRcdCAgICB6b29tID0gbWFwLl9saW1pdFpvb20ob2xkWm9vbSArIHJvdW5kWm9vbURlbHRhKSxcblx0XHQgICAgc2NhbGUgPSBtYXAuZ2V0Wm9vbVNjYWxlKHpvb20pIC8gdGhpcy5fc2NhbGU7XG5cblx0XHRtYXAuX2FuaW1hdGVab29tKGNlbnRlciwgem9vbSwgb3JpZ2luLCBzY2FsZSk7XG5cdH0sXG5cblx0X2dldFNjYWxlT3JpZ2luOiBmdW5jdGlvbiAoKSB7XG5cdFx0dmFyIGNlbnRlck9mZnNldCA9IHRoaXMuX2NlbnRlck9mZnNldC5zdWJ0cmFjdCh0aGlzLl9kZWx0YSkuZGl2aWRlQnkodGhpcy5fc2NhbGUpO1xuXHRcdHJldHVybiB0aGlzLl9zdGFydENlbnRlci5hZGQoY2VudGVyT2Zmc2V0KTtcblx0fVxufSk7XG5cbkwuTWFwLmFkZEluaXRIb29rKCdhZGRIYW5kbGVyJywgJ3RvdWNoWm9vbScsIEwuTWFwLlRvdWNoWm9vbSk7XG5cblxuLypcbiAqIEwuTWFwLlRhcCBpcyB1c2VkIHRvIGVuYWJsZSBtb2JpbGUgaGFja3MgbGlrZSBxdWljayB0YXBzIGFuZCBsb25nIGhvbGQuXG4gKi9cblxuTC5NYXAubWVyZ2VPcHRpb25zKHtcblx0dGFwOiB0cnVlLFxuXHR0YXBUb2xlcmFuY2U6IDE1XG59KTtcblxuTC5NYXAuVGFwID0gTC5IYW5kbGVyLmV4dGVuZCh7XG5cdGFkZEhvb2tzOiBmdW5jdGlvbiAoKSB7XG5cdFx0TC5Eb21FdmVudC5vbih0aGlzLl9tYXAuX2NvbnRhaW5lciwgJ3RvdWNoc3RhcnQnLCB0aGlzLl9vbkRvd24sIHRoaXMpO1xuXHR9LFxuXG5cdHJlbW92ZUhvb2tzOiBmdW5jdGlvbiAoKSB7XG5cdFx0TC5Eb21FdmVudC5vZmYodGhpcy5fbWFwLl9jb250YWluZXIsICd0b3VjaHN0YXJ0JywgdGhpcy5fb25Eb3duLCB0aGlzKTtcblx0fSxcblxuXHRfb25Eb3duOiBmdW5jdGlvbiAoZSkge1xuXHRcdGlmICghZS50b3VjaGVzKSB7IHJldHVybjsgfVxuXG5cdFx0TC5Eb21FdmVudC5wcmV2ZW50RGVmYXVsdChlKTtcblxuXHRcdHRoaXMuX2ZpcmVDbGljayA9IHRydWU7XG5cblx0XHQvLyBkb24ndCBzaW11bGF0ZSBjbGljayBvciB0cmFjayBsb25ncHJlc3MgaWYgbW9yZSB0aGFuIDEgdG91Y2hcblx0XHRpZiAoZS50b3VjaGVzLmxlbmd0aCA+IDEpIHtcblx0XHRcdHRoaXMuX2ZpcmVDbGljayA9IGZhbHNlO1xuXHRcdFx0Y2xlYXJUaW1lb3V0KHRoaXMuX2hvbGRUaW1lb3V0KTtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHR2YXIgZmlyc3QgPSBlLnRvdWNoZXNbMF0sXG5cdFx0ICAgIGVsID0gZmlyc3QudGFyZ2V0O1xuXG5cdFx0dGhpcy5fc3RhcnRQb3MgPSB0aGlzLl9uZXdQb3MgPSBuZXcgTC5Qb2ludChmaXJzdC5jbGllbnRYLCBmaXJzdC5jbGllbnRZKTtcblxuXHRcdC8vIGlmIHRvdWNoaW5nIGEgbGluaywgaGlnaGxpZ2h0IGl0XG5cdFx0aWYgKGVsLnRhZ05hbWUgJiYgZWwudGFnTmFtZS50b0xvd2VyQ2FzZSgpID09PSAnYScpIHtcblx0XHRcdEwuRG9tVXRpbC5hZGRDbGFzcyhlbCwgJ2xlYWZsZXQtYWN0aXZlJyk7XG5cdFx0fVxuXG5cdFx0Ly8gc2ltdWxhdGUgbG9uZyBob2xkIGJ1dCBzZXR0aW5nIGEgdGltZW91dFxuXHRcdHRoaXMuX2hvbGRUaW1lb3V0ID0gc2V0VGltZW91dChMLmJpbmQoZnVuY3Rpb24gKCkge1xuXHRcdFx0aWYgKHRoaXMuX2lzVGFwVmFsaWQoKSkge1xuXHRcdFx0XHR0aGlzLl9maXJlQ2xpY2sgPSBmYWxzZTtcblx0XHRcdFx0dGhpcy5fb25VcCgpO1xuXHRcdFx0XHR0aGlzLl9zaW11bGF0ZUV2ZW50KCdjb250ZXh0bWVudScsIGZpcnN0KTtcblx0XHRcdH1cblx0XHR9LCB0aGlzKSwgMTAwMCk7XG5cblx0XHRMLkRvbUV2ZW50XG5cdFx0XHQub24oZG9jdW1lbnQsICd0b3VjaG1vdmUnLCB0aGlzLl9vbk1vdmUsIHRoaXMpXG5cdFx0XHQub24oZG9jdW1lbnQsICd0b3VjaGVuZCcsIHRoaXMuX29uVXAsIHRoaXMpO1xuXHR9LFxuXG5cdF9vblVwOiBmdW5jdGlvbiAoZSkge1xuXHRcdGNsZWFyVGltZW91dCh0aGlzLl9ob2xkVGltZW91dCk7XG5cblx0XHRMLkRvbUV2ZW50XG5cdFx0XHQub2ZmKGRvY3VtZW50LCAndG91Y2htb3ZlJywgdGhpcy5fb25Nb3ZlLCB0aGlzKVxuXHRcdFx0Lm9mZihkb2N1bWVudCwgJ3RvdWNoZW5kJywgdGhpcy5fb25VcCwgdGhpcyk7XG5cblx0XHRpZiAodGhpcy5fZmlyZUNsaWNrICYmIGUgJiYgZS5jaGFuZ2VkVG91Y2hlcykge1xuXG5cdFx0XHR2YXIgZmlyc3QgPSBlLmNoYW5nZWRUb3VjaGVzWzBdLFxuXHRcdFx0ICAgIGVsID0gZmlyc3QudGFyZ2V0O1xuXG5cdFx0XHRpZiAoZWwgJiYgZWwudGFnTmFtZSAmJiBlbC50YWdOYW1lLnRvTG93ZXJDYXNlKCkgPT09ICdhJykge1xuXHRcdFx0XHRMLkRvbVV0aWwucmVtb3ZlQ2xhc3MoZWwsICdsZWFmbGV0LWFjdGl2ZScpO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBzaW11bGF0ZSBjbGljayBpZiB0aGUgdG91Y2ggZGlkbid0IG1vdmUgdG9vIG11Y2hcblx0XHRcdGlmICh0aGlzLl9pc1RhcFZhbGlkKCkpIHtcblx0XHRcdFx0dGhpcy5fc2ltdWxhdGVFdmVudCgnY2xpY2snLCBmaXJzdCk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9LFxuXG5cdF9pc1RhcFZhbGlkOiBmdW5jdGlvbiAoKSB7XG5cdFx0cmV0dXJuIHRoaXMuX25ld1Bvcy5kaXN0YW5jZVRvKHRoaXMuX3N0YXJ0UG9zKSA8PSB0aGlzLl9tYXAub3B0aW9ucy50YXBUb2xlcmFuY2U7XG5cdH0sXG5cblx0X29uTW92ZTogZnVuY3Rpb24gKGUpIHtcblx0XHR2YXIgZmlyc3QgPSBlLnRvdWNoZXNbMF07XG5cdFx0dGhpcy5fbmV3UG9zID0gbmV3IEwuUG9pbnQoZmlyc3QuY2xpZW50WCwgZmlyc3QuY2xpZW50WSk7XG5cdH0sXG5cblx0X3NpbXVsYXRlRXZlbnQ6IGZ1bmN0aW9uICh0eXBlLCBlKSB7XG5cdFx0dmFyIHNpbXVsYXRlZEV2ZW50ID0gZG9jdW1lbnQuY3JlYXRlRXZlbnQoJ01vdXNlRXZlbnRzJyk7XG5cblx0XHRzaW11bGF0ZWRFdmVudC5fc2ltdWxhdGVkID0gdHJ1ZTtcblx0XHRlLnRhcmdldC5fc2ltdWxhdGVkQ2xpY2sgPSB0cnVlO1xuXG5cdFx0c2ltdWxhdGVkRXZlbnQuaW5pdE1vdXNlRXZlbnQoXG5cdFx0ICAgICAgICB0eXBlLCB0cnVlLCB0cnVlLCB3aW5kb3csIDEsXG5cdFx0ICAgICAgICBlLnNjcmVlblgsIGUuc2NyZWVuWSxcblx0XHQgICAgICAgIGUuY2xpZW50WCwgZS5jbGllbnRZLFxuXHRcdCAgICAgICAgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIDAsIG51bGwpO1xuXG5cdFx0ZS50YXJnZXQuZGlzcGF0Y2hFdmVudChzaW11bGF0ZWRFdmVudCk7XG5cdH1cbn0pO1xuXG5pZiAoTC5Ccm93c2VyLnRvdWNoICYmICFMLkJyb3dzZXIucG9pbnRlcikge1xuXHRMLk1hcC5hZGRJbml0SG9vaygnYWRkSGFuZGxlcicsICd0YXAnLCBMLk1hcC5UYXApO1xufVxuXG5cbi8qXG4gKiBMLkhhbmRsZXIuU2hpZnREcmFnWm9vbSBpcyB1c2VkIHRvIGFkZCBzaGlmdC1kcmFnIHpvb20gaW50ZXJhY3Rpb24gdG8gdGhlIG1hcFxuICAqICh6b29tIHRvIGEgc2VsZWN0ZWQgYm91bmRpbmcgYm94KSwgZW5hYmxlZCBieSBkZWZhdWx0LlxuICovXG5cbkwuTWFwLm1lcmdlT3B0aW9ucyh7XG5cdGJveFpvb206IHRydWVcbn0pO1xuXG5MLk1hcC5Cb3hab29tID0gTC5IYW5kbGVyLmV4dGVuZCh7XG5cdGluaXRpYWxpemU6IGZ1bmN0aW9uIChtYXApIHtcblx0XHR0aGlzLl9tYXAgPSBtYXA7XG5cdFx0dGhpcy5fY29udGFpbmVyID0gbWFwLl9jb250YWluZXI7XG5cdFx0dGhpcy5fcGFuZSA9IG1hcC5fcGFuZXMub3ZlcmxheVBhbmU7XG5cdFx0dGhpcy5fbW92ZWQgPSBmYWxzZTtcblx0fSxcblxuXHRhZGRIb29rczogZnVuY3Rpb24gKCkge1xuXHRcdEwuRG9tRXZlbnQub24odGhpcy5fY29udGFpbmVyLCAnbW91c2Vkb3duJywgdGhpcy5fb25Nb3VzZURvd24sIHRoaXMpO1xuXHR9LFxuXG5cdHJlbW92ZUhvb2tzOiBmdW5jdGlvbiAoKSB7XG5cdFx0TC5Eb21FdmVudC5vZmYodGhpcy5fY29udGFpbmVyLCAnbW91c2Vkb3duJywgdGhpcy5fb25Nb3VzZURvd24pO1xuXHRcdHRoaXMuX21vdmVkID0gZmFsc2U7XG5cdH0sXG5cblx0bW92ZWQ6IGZ1bmN0aW9uICgpIHtcblx0XHRyZXR1cm4gdGhpcy5fbW92ZWQ7XG5cdH0sXG5cblx0X29uTW91c2VEb3duOiBmdW5jdGlvbiAoZSkge1xuXHRcdHRoaXMuX21vdmVkID0gZmFsc2U7XG5cblx0XHRpZiAoIWUuc2hpZnRLZXkgfHwgKChlLndoaWNoICE9PSAxKSAmJiAoZS5idXR0b24gIT09IDEpKSkgeyByZXR1cm4gZmFsc2U7IH1cblxuXHRcdEwuRG9tVXRpbC5kaXNhYmxlVGV4dFNlbGVjdGlvbigpO1xuXHRcdEwuRG9tVXRpbC5kaXNhYmxlSW1hZ2VEcmFnKCk7XG5cblx0XHR0aGlzLl9zdGFydExheWVyUG9pbnQgPSB0aGlzLl9tYXAubW91c2VFdmVudFRvTGF5ZXJQb2ludChlKTtcblxuXHRcdEwuRG9tRXZlbnRcblx0XHQgICAgLm9uKGRvY3VtZW50LCAnbW91c2Vtb3ZlJywgdGhpcy5fb25Nb3VzZU1vdmUsIHRoaXMpXG5cdFx0ICAgIC5vbihkb2N1bWVudCwgJ21vdXNldXAnLCB0aGlzLl9vbk1vdXNlVXAsIHRoaXMpXG5cdFx0ICAgIC5vbihkb2N1bWVudCwgJ2tleWRvd24nLCB0aGlzLl9vbktleURvd24sIHRoaXMpO1xuXHR9LFxuXG5cdF9vbk1vdXNlTW92ZTogZnVuY3Rpb24gKGUpIHtcblx0XHRpZiAoIXRoaXMuX21vdmVkKSB7XG5cdFx0XHR0aGlzLl9ib3ggPSBMLkRvbVV0aWwuY3JlYXRlKCdkaXYnLCAnbGVhZmxldC16b29tLWJveCcsIHRoaXMuX3BhbmUpO1xuXHRcdFx0TC5Eb21VdGlsLnNldFBvc2l0aW9uKHRoaXMuX2JveCwgdGhpcy5fc3RhcnRMYXllclBvaW50KTtcblxuXHRcdFx0Ly9UT0RPIHJlZmFjdG9yOiBtb3ZlIGN1cnNvciB0byBzdHlsZXNcblx0XHRcdHRoaXMuX2NvbnRhaW5lci5zdHlsZS5jdXJzb3IgPSAnY3Jvc3NoYWlyJztcblx0XHRcdHRoaXMuX21hcC5maXJlKCdib3h6b29tc3RhcnQnKTtcblx0XHR9XG5cblx0XHR2YXIgc3RhcnRQb2ludCA9IHRoaXMuX3N0YXJ0TGF5ZXJQb2ludCxcblx0XHQgICAgYm94ID0gdGhpcy5fYm94LFxuXG5cdFx0ICAgIGxheWVyUG9pbnQgPSB0aGlzLl9tYXAubW91c2VFdmVudFRvTGF5ZXJQb2ludChlKSxcblx0XHQgICAgb2Zmc2V0ID0gbGF5ZXJQb2ludC5zdWJ0cmFjdChzdGFydFBvaW50KSxcblxuXHRcdCAgICBuZXdQb3MgPSBuZXcgTC5Qb2ludChcblx0XHQgICAgICAgIE1hdGgubWluKGxheWVyUG9pbnQueCwgc3RhcnRQb2ludC54KSxcblx0XHQgICAgICAgIE1hdGgubWluKGxheWVyUG9pbnQueSwgc3RhcnRQb2ludC55KSk7XG5cblx0XHRMLkRvbVV0aWwuc2V0UG9zaXRpb24oYm94LCBuZXdQb3MpO1xuXG5cdFx0dGhpcy5fbW92ZWQgPSB0cnVlO1xuXG5cdFx0Ly8gVE9ETyByZWZhY3RvcjogcmVtb3ZlIGhhcmRjb2RlZCA0IHBpeGVsc1xuXHRcdGJveC5zdHlsZS53aWR0aCAgPSAoTWF0aC5tYXgoMCwgTWF0aC5hYnMob2Zmc2V0LngpIC0gNCkpICsgJ3B4Jztcblx0XHRib3guc3R5bGUuaGVpZ2h0ID0gKE1hdGgubWF4KDAsIE1hdGguYWJzKG9mZnNldC55KSAtIDQpKSArICdweCc7XG5cdH0sXG5cblx0X2ZpbmlzaDogZnVuY3Rpb24gKCkge1xuXHRcdGlmICh0aGlzLl9tb3ZlZCkge1xuXHRcdFx0dGhpcy5fcGFuZS5yZW1vdmVDaGlsZCh0aGlzLl9ib3gpO1xuXHRcdFx0dGhpcy5fY29udGFpbmVyLnN0eWxlLmN1cnNvciA9ICcnO1xuXHRcdH1cblxuXHRcdEwuRG9tVXRpbC5lbmFibGVUZXh0U2VsZWN0aW9uKCk7XG5cdFx0TC5Eb21VdGlsLmVuYWJsZUltYWdlRHJhZygpO1xuXG5cdFx0TC5Eb21FdmVudFxuXHRcdCAgICAub2ZmKGRvY3VtZW50LCAnbW91c2Vtb3ZlJywgdGhpcy5fb25Nb3VzZU1vdmUpXG5cdFx0ICAgIC5vZmYoZG9jdW1lbnQsICdtb3VzZXVwJywgdGhpcy5fb25Nb3VzZVVwKVxuXHRcdCAgICAub2ZmKGRvY3VtZW50LCAna2V5ZG93bicsIHRoaXMuX29uS2V5RG93bik7XG5cdH0sXG5cblx0X29uTW91c2VVcDogZnVuY3Rpb24gKGUpIHtcblxuXHRcdHRoaXMuX2ZpbmlzaCgpO1xuXG5cdFx0dmFyIG1hcCA9IHRoaXMuX21hcCxcblx0XHQgICAgbGF5ZXJQb2ludCA9IG1hcC5tb3VzZUV2ZW50VG9MYXllclBvaW50KGUpO1xuXG5cdFx0aWYgKHRoaXMuX3N0YXJ0TGF5ZXJQb2ludC5lcXVhbHMobGF5ZXJQb2ludCkpIHsgcmV0dXJuOyB9XG5cblx0XHR2YXIgYm91bmRzID0gbmV3IEwuTGF0TG5nQm91bmRzKFxuXHRcdCAgICAgICAgbWFwLmxheWVyUG9pbnRUb0xhdExuZyh0aGlzLl9zdGFydExheWVyUG9pbnQpLFxuXHRcdCAgICAgICAgbWFwLmxheWVyUG9pbnRUb0xhdExuZyhsYXllclBvaW50KSk7XG5cblx0XHRtYXAuZml0Qm91bmRzKGJvdW5kcyk7XG5cblx0XHRtYXAuZmlyZSgnYm94em9vbWVuZCcsIHtcblx0XHRcdGJveFpvb21Cb3VuZHM6IGJvdW5kc1xuXHRcdH0pO1xuXHR9LFxuXG5cdF9vbktleURvd246IGZ1bmN0aW9uIChlKSB7XG5cdFx0aWYgKGUua2V5Q29kZSA9PT0gMjcpIHtcblx0XHRcdHRoaXMuX2ZpbmlzaCgpO1xuXHRcdH1cblx0fVxufSk7XG5cbkwuTWFwLmFkZEluaXRIb29rKCdhZGRIYW5kbGVyJywgJ2JveFpvb20nLCBMLk1hcC5Cb3hab29tKTtcblxuXG4vKlxuICogTC5NYXAuS2V5Ym9hcmQgaXMgaGFuZGxpbmcga2V5Ym9hcmQgaW50ZXJhY3Rpb24gd2l0aCB0aGUgbWFwLCBlbmFibGVkIGJ5IGRlZmF1bHQuXG4gKi9cblxuTC5NYXAubWVyZ2VPcHRpb25zKHtcblx0a2V5Ym9hcmQ6IHRydWUsXG5cdGtleWJvYXJkUGFuT2Zmc2V0OiA4MCxcblx0a2V5Ym9hcmRab29tT2Zmc2V0OiAxXG59KTtcblxuTC5NYXAuS2V5Ym9hcmQgPSBMLkhhbmRsZXIuZXh0ZW5kKHtcblxuXHRrZXlDb2Rlczoge1xuXHRcdGxlZnQ6ICAgIFszN10sXG5cdFx0cmlnaHQ6ICAgWzM5XSxcblx0XHRkb3duOiAgICBbNDBdLFxuXHRcdHVwOiAgICAgIFszOF0sXG5cdFx0em9vbUluOiAgWzE4NywgMTA3LCA2MSwgMTcxXSxcblx0XHR6b29tT3V0OiBbMTg5LCAxMDksIDE3M11cblx0fSxcblxuXHRpbml0aWFsaXplOiBmdW5jdGlvbiAobWFwKSB7XG5cdFx0dGhpcy5fbWFwID0gbWFwO1xuXG5cdFx0dGhpcy5fc2V0UGFuT2Zmc2V0KG1hcC5vcHRpb25zLmtleWJvYXJkUGFuT2Zmc2V0KTtcblx0XHR0aGlzLl9zZXRab29tT2Zmc2V0KG1hcC5vcHRpb25zLmtleWJvYXJkWm9vbU9mZnNldCk7XG5cdH0sXG5cblx0YWRkSG9va3M6IGZ1bmN0aW9uICgpIHtcblx0XHR2YXIgY29udGFpbmVyID0gdGhpcy5fbWFwLl9jb250YWluZXI7XG5cblx0XHQvLyBtYWtlIHRoZSBjb250YWluZXIgZm9jdXNhYmxlIGJ5IHRhYmJpbmdcblx0XHRpZiAoY29udGFpbmVyLnRhYkluZGV4ID09PSAtMSkge1xuXHRcdFx0Y29udGFpbmVyLnRhYkluZGV4ID0gJzAnO1xuXHRcdH1cblxuXHRcdEwuRG9tRXZlbnRcblx0XHQgICAgLm9uKGNvbnRhaW5lciwgJ2ZvY3VzJywgdGhpcy5fb25Gb2N1cywgdGhpcylcblx0XHQgICAgLm9uKGNvbnRhaW5lciwgJ2JsdXInLCB0aGlzLl9vbkJsdXIsIHRoaXMpXG5cdFx0ICAgIC5vbihjb250YWluZXIsICdtb3VzZWRvd24nLCB0aGlzLl9vbk1vdXNlRG93biwgdGhpcyk7XG5cblx0XHR0aGlzLl9tYXBcblx0XHQgICAgLm9uKCdmb2N1cycsIHRoaXMuX2FkZEhvb2tzLCB0aGlzKVxuXHRcdCAgICAub24oJ2JsdXInLCB0aGlzLl9yZW1vdmVIb29rcywgdGhpcyk7XG5cdH0sXG5cblx0cmVtb3ZlSG9va3M6IGZ1bmN0aW9uICgpIHtcblx0XHR0aGlzLl9yZW1vdmVIb29rcygpO1xuXG5cdFx0dmFyIGNvbnRhaW5lciA9IHRoaXMuX21hcC5fY29udGFpbmVyO1xuXG5cdFx0TC5Eb21FdmVudFxuXHRcdCAgICAub2ZmKGNvbnRhaW5lciwgJ2ZvY3VzJywgdGhpcy5fb25Gb2N1cywgdGhpcylcblx0XHQgICAgLm9mZihjb250YWluZXIsICdibHVyJywgdGhpcy5fb25CbHVyLCB0aGlzKVxuXHRcdCAgICAub2ZmKGNvbnRhaW5lciwgJ21vdXNlZG93bicsIHRoaXMuX29uTW91c2VEb3duLCB0aGlzKTtcblxuXHRcdHRoaXMuX21hcFxuXHRcdCAgICAub2ZmKCdmb2N1cycsIHRoaXMuX2FkZEhvb2tzLCB0aGlzKVxuXHRcdCAgICAub2ZmKCdibHVyJywgdGhpcy5fcmVtb3ZlSG9va3MsIHRoaXMpO1xuXHR9LFxuXG5cdF9vbk1vdXNlRG93bjogZnVuY3Rpb24gKCkge1xuXHRcdGlmICh0aGlzLl9mb2N1c2VkKSB7IHJldHVybjsgfVxuXG5cdFx0dmFyIGJvZHkgPSBkb2N1bWVudC5ib2R5LFxuXHRcdCAgICBkb2NFbCA9IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudCxcblx0XHQgICAgdG9wID0gYm9keS5zY3JvbGxUb3AgfHwgZG9jRWwuc2Nyb2xsVG9wLFxuXHRcdCAgICBsZWZ0ID0gYm9keS5zY3JvbGxMZWZ0IHx8IGRvY0VsLnNjcm9sbExlZnQ7XG5cblx0XHR0aGlzLl9tYXAuX2NvbnRhaW5lci5mb2N1cygpO1xuXG5cdFx0d2luZG93LnNjcm9sbFRvKGxlZnQsIHRvcCk7XG5cdH0sXG5cblx0X29uRm9jdXM6IGZ1bmN0aW9uICgpIHtcblx0XHR0aGlzLl9mb2N1c2VkID0gdHJ1ZTtcblx0XHR0aGlzLl9tYXAuZmlyZSgnZm9jdXMnKTtcblx0fSxcblxuXHRfb25CbHVyOiBmdW5jdGlvbiAoKSB7XG5cdFx0dGhpcy5fZm9jdXNlZCA9IGZhbHNlO1xuXHRcdHRoaXMuX21hcC5maXJlKCdibHVyJyk7XG5cdH0sXG5cblx0X3NldFBhbk9mZnNldDogZnVuY3Rpb24gKHBhbikge1xuXHRcdHZhciBrZXlzID0gdGhpcy5fcGFuS2V5cyA9IHt9LFxuXHRcdCAgICBjb2RlcyA9IHRoaXMua2V5Q29kZXMsXG5cdFx0ICAgIGksIGxlbjtcblxuXHRcdGZvciAoaSA9IDAsIGxlbiA9IGNvZGVzLmxlZnQubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcblx0XHRcdGtleXNbY29kZXMubGVmdFtpXV0gPSBbLTEgKiBwYW4sIDBdO1xuXHRcdH1cblx0XHRmb3IgKGkgPSAwLCBsZW4gPSBjb2Rlcy5yaWdodC5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuXHRcdFx0a2V5c1tjb2Rlcy5yaWdodFtpXV0gPSBbcGFuLCAwXTtcblx0XHR9XG5cdFx0Zm9yIChpID0gMCwgbGVuID0gY29kZXMuZG93bi5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuXHRcdFx0a2V5c1tjb2Rlcy5kb3duW2ldXSA9IFswLCBwYW5dO1xuXHRcdH1cblx0XHRmb3IgKGkgPSAwLCBsZW4gPSBjb2Rlcy51cC5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuXHRcdFx0a2V5c1tjb2Rlcy51cFtpXV0gPSBbMCwgLTEgKiBwYW5dO1xuXHRcdH1cblx0fSxcblxuXHRfc2V0Wm9vbU9mZnNldDogZnVuY3Rpb24gKHpvb20pIHtcblx0XHR2YXIga2V5cyA9IHRoaXMuX3pvb21LZXlzID0ge30sXG5cdFx0ICAgIGNvZGVzID0gdGhpcy5rZXlDb2Rlcyxcblx0XHQgICAgaSwgbGVuO1xuXG5cdFx0Zm9yIChpID0gMCwgbGVuID0gY29kZXMuem9vbUluLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG5cdFx0XHRrZXlzW2NvZGVzLnpvb21JbltpXV0gPSB6b29tO1xuXHRcdH1cblx0XHRmb3IgKGkgPSAwLCBsZW4gPSBjb2Rlcy56b29tT3V0Lmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG5cdFx0XHRrZXlzW2NvZGVzLnpvb21PdXRbaV1dID0gLXpvb207XG5cdFx0fVxuXHR9LFxuXG5cdF9hZGRIb29rczogZnVuY3Rpb24gKCkge1xuXHRcdEwuRG9tRXZlbnQub24oZG9jdW1lbnQsICdrZXlkb3duJywgdGhpcy5fb25LZXlEb3duLCB0aGlzKTtcblx0fSxcblxuXHRfcmVtb3ZlSG9va3M6IGZ1bmN0aW9uICgpIHtcblx0XHRMLkRvbUV2ZW50Lm9mZihkb2N1bWVudCwgJ2tleWRvd24nLCB0aGlzLl9vbktleURvd24sIHRoaXMpO1xuXHR9LFxuXG5cdF9vbktleURvd246IGZ1bmN0aW9uIChlKSB7XG5cdFx0dmFyIGtleSA9IGUua2V5Q29kZSxcblx0XHQgICAgbWFwID0gdGhpcy5fbWFwO1xuXG5cdFx0aWYgKGtleSBpbiB0aGlzLl9wYW5LZXlzKSB7XG5cblx0XHRcdGlmIChtYXAuX3BhbkFuaW0gJiYgbWFwLl9wYW5BbmltLl9pblByb2dyZXNzKSB7IHJldHVybjsgfVxuXG5cdFx0XHRtYXAucGFuQnkodGhpcy5fcGFuS2V5c1trZXldKTtcblxuXHRcdFx0aWYgKG1hcC5vcHRpb25zLm1heEJvdW5kcykge1xuXHRcdFx0XHRtYXAucGFuSW5zaWRlQm91bmRzKG1hcC5vcHRpb25zLm1heEJvdW5kcyk7XG5cdFx0XHR9XG5cblx0XHR9IGVsc2UgaWYgKGtleSBpbiB0aGlzLl96b29tS2V5cykge1xuXHRcdFx0bWFwLnNldFpvb20obWFwLmdldFpvb20oKSArIHRoaXMuX3pvb21LZXlzW2tleV0pO1xuXG5cdFx0fSBlbHNlIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHRMLkRvbUV2ZW50LnN0b3AoZSk7XG5cdH1cbn0pO1xuXG5MLk1hcC5hZGRJbml0SG9vaygnYWRkSGFuZGxlcicsICdrZXlib2FyZCcsIEwuTWFwLktleWJvYXJkKTtcblxuXG4vKlxuICogTC5IYW5kbGVyLk1hcmtlckRyYWcgaXMgdXNlZCBpbnRlcm5hbGx5IGJ5IEwuTWFya2VyIHRvIG1ha2UgdGhlIG1hcmtlcnMgZHJhZ2dhYmxlLlxuICovXG5cbkwuSGFuZGxlci5NYXJrZXJEcmFnID0gTC5IYW5kbGVyLmV4dGVuZCh7XG5cdGluaXRpYWxpemU6IGZ1bmN0aW9uIChtYXJrZXIpIHtcblx0XHR0aGlzLl9tYXJrZXIgPSBtYXJrZXI7XG5cdH0sXG5cblx0YWRkSG9va3M6IGZ1bmN0aW9uICgpIHtcblx0XHR2YXIgaWNvbiA9IHRoaXMuX21hcmtlci5faWNvbjtcblx0XHRpZiAoIXRoaXMuX2RyYWdnYWJsZSkge1xuXHRcdFx0dGhpcy5fZHJhZ2dhYmxlID0gbmV3IEwuRHJhZ2dhYmxlKGljb24sIGljb24pO1xuXHRcdH1cblxuXHRcdHRoaXMuX2RyYWdnYWJsZVxuXHRcdFx0Lm9uKCdkcmFnc3RhcnQnLCB0aGlzLl9vbkRyYWdTdGFydCwgdGhpcylcblx0XHRcdC5vbignZHJhZycsIHRoaXMuX29uRHJhZywgdGhpcylcblx0XHRcdC5vbignZHJhZ2VuZCcsIHRoaXMuX29uRHJhZ0VuZCwgdGhpcyk7XG5cdFx0dGhpcy5fZHJhZ2dhYmxlLmVuYWJsZSgpO1xuXHRcdEwuRG9tVXRpbC5hZGRDbGFzcyh0aGlzLl9tYXJrZXIuX2ljb24sICdsZWFmbGV0LW1hcmtlci1kcmFnZ2FibGUnKTtcblx0fSxcblxuXHRyZW1vdmVIb29rczogZnVuY3Rpb24gKCkge1xuXHRcdHRoaXMuX2RyYWdnYWJsZVxuXHRcdFx0Lm9mZignZHJhZ3N0YXJ0JywgdGhpcy5fb25EcmFnU3RhcnQsIHRoaXMpXG5cdFx0XHQub2ZmKCdkcmFnJywgdGhpcy5fb25EcmFnLCB0aGlzKVxuXHRcdFx0Lm9mZignZHJhZ2VuZCcsIHRoaXMuX29uRHJhZ0VuZCwgdGhpcyk7XG5cblx0XHR0aGlzLl9kcmFnZ2FibGUuZGlzYWJsZSgpO1xuXHRcdEwuRG9tVXRpbC5yZW1vdmVDbGFzcyh0aGlzLl9tYXJrZXIuX2ljb24sICdsZWFmbGV0LW1hcmtlci1kcmFnZ2FibGUnKTtcblx0fSxcblxuXHRtb3ZlZDogZnVuY3Rpb24gKCkge1xuXHRcdHJldHVybiB0aGlzLl9kcmFnZ2FibGUgJiYgdGhpcy5fZHJhZ2dhYmxlLl9tb3ZlZDtcblx0fSxcblxuXHRfb25EcmFnU3RhcnQ6IGZ1bmN0aW9uICgpIHtcblx0XHR0aGlzLl9tYXJrZXJcblx0XHQgICAgLmNsb3NlUG9wdXAoKVxuXHRcdCAgICAuZmlyZSgnbW92ZXN0YXJ0Jylcblx0XHQgICAgLmZpcmUoJ2RyYWdzdGFydCcpO1xuXHR9LFxuXG5cdF9vbkRyYWc6IGZ1bmN0aW9uICgpIHtcblx0XHR2YXIgbWFya2VyID0gdGhpcy5fbWFya2VyLFxuXHRcdCAgICBzaGFkb3cgPSBtYXJrZXIuX3NoYWRvdyxcblx0XHQgICAgaWNvblBvcyA9IEwuRG9tVXRpbC5nZXRQb3NpdGlvbihtYXJrZXIuX2ljb24pLFxuXHRcdCAgICBsYXRsbmcgPSBtYXJrZXIuX21hcC5sYXllclBvaW50VG9MYXRMbmcoaWNvblBvcyk7XG5cblx0XHQvLyB1cGRhdGUgc2hhZG93IHBvc2l0aW9uXG5cdFx0aWYgKHNoYWRvdykge1xuXHRcdFx0TC5Eb21VdGlsLnNldFBvc2l0aW9uKHNoYWRvdywgaWNvblBvcyk7XG5cdFx0fVxuXG5cdFx0bWFya2VyLl9sYXRsbmcgPSBsYXRsbmc7XG5cblx0XHRtYXJrZXJcblx0XHQgICAgLmZpcmUoJ21vdmUnLCB7bGF0bG5nOiBsYXRsbmd9KVxuXHRcdCAgICAuZmlyZSgnZHJhZycpO1xuXHR9LFxuXG5cdF9vbkRyYWdFbmQ6IGZ1bmN0aW9uIChlKSB7XG5cdFx0dGhpcy5fbWFya2VyXG5cdFx0ICAgIC5maXJlKCdtb3ZlZW5kJylcblx0XHQgICAgLmZpcmUoJ2RyYWdlbmQnLCBlKTtcblx0fVxufSk7XG5cblxuLypcclxuICogTC5Db250cm9sIGlzIGEgYmFzZSBjbGFzcyBmb3IgaW1wbGVtZW50aW5nIG1hcCBjb250cm9scy4gSGFuZGxlcyBwb3NpdGlvbmluZy5cclxuICogQWxsIG90aGVyIGNvbnRyb2xzIGV4dGVuZCBmcm9tIHRoaXMgY2xhc3MuXHJcbiAqL1xyXG5cclxuTC5Db250cm9sID0gTC5DbGFzcy5leHRlbmQoe1xyXG5cdG9wdGlvbnM6IHtcclxuXHRcdHBvc2l0aW9uOiAndG9wcmlnaHQnXHJcblx0fSxcclxuXHJcblx0aW5pdGlhbGl6ZTogZnVuY3Rpb24gKG9wdGlvbnMpIHtcclxuXHRcdEwuc2V0T3B0aW9ucyh0aGlzLCBvcHRpb25zKTtcclxuXHR9LFxyXG5cclxuXHRnZXRQb3NpdGlvbjogZnVuY3Rpb24gKCkge1xyXG5cdFx0cmV0dXJuIHRoaXMub3B0aW9ucy5wb3NpdGlvbjtcclxuXHR9LFxyXG5cclxuXHRzZXRQb3NpdGlvbjogZnVuY3Rpb24gKHBvc2l0aW9uKSB7XHJcblx0XHR2YXIgbWFwID0gdGhpcy5fbWFwO1xyXG5cclxuXHRcdGlmIChtYXApIHtcclxuXHRcdFx0bWFwLnJlbW92ZUNvbnRyb2wodGhpcyk7XHJcblx0XHR9XHJcblxyXG5cdFx0dGhpcy5vcHRpb25zLnBvc2l0aW9uID0gcG9zaXRpb247XHJcblxyXG5cdFx0aWYgKG1hcCkge1xyXG5cdFx0XHRtYXAuYWRkQ29udHJvbCh0aGlzKTtcclxuXHRcdH1cclxuXHJcblx0XHRyZXR1cm4gdGhpcztcclxuXHR9LFxyXG5cclxuXHRnZXRDb250YWluZXI6IGZ1bmN0aW9uICgpIHtcclxuXHRcdHJldHVybiB0aGlzLl9jb250YWluZXI7XHJcblx0fSxcclxuXHJcblx0YWRkVG86IGZ1bmN0aW9uIChtYXApIHtcclxuXHRcdHRoaXMuX21hcCA9IG1hcDtcclxuXHJcblx0XHR2YXIgY29udGFpbmVyID0gdGhpcy5fY29udGFpbmVyID0gdGhpcy5vbkFkZChtYXApLFxyXG5cdFx0ICAgIHBvcyA9IHRoaXMuZ2V0UG9zaXRpb24oKSxcclxuXHRcdCAgICBjb3JuZXIgPSBtYXAuX2NvbnRyb2xDb3JuZXJzW3Bvc107XHJcblxyXG5cdFx0TC5Eb21VdGlsLmFkZENsYXNzKGNvbnRhaW5lciwgJ2xlYWZsZXQtY29udHJvbCcpO1xyXG5cclxuXHRcdGlmIChwb3MuaW5kZXhPZignYm90dG9tJykgIT09IC0xKSB7XHJcblx0XHRcdGNvcm5lci5pbnNlcnRCZWZvcmUoY29udGFpbmVyLCBjb3JuZXIuZmlyc3RDaGlsZCk7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRjb3JuZXIuYXBwZW5kQ2hpbGQoY29udGFpbmVyKTtcclxuXHRcdH1cclxuXHJcblx0XHRyZXR1cm4gdGhpcztcclxuXHR9LFxyXG5cclxuXHRyZW1vdmVGcm9tOiBmdW5jdGlvbiAobWFwKSB7XHJcblx0XHR2YXIgcG9zID0gdGhpcy5nZXRQb3NpdGlvbigpLFxyXG5cdFx0ICAgIGNvcm5lciA9IG1hcC5fY29udHJvbENvcm5lcnNbcG9zXTtcclxuXHJcblx0XHRjb3JuZXIucmVtb3ZlQ2hpbGQodGhpcy5fY29udGFpbmVyKTtcclxuXHRcdHRoaXMuX21hcCA9IG51bGw7XHJcblxyXG5cdFx0aWYgKHRoaXMub25SZW1vdmUpIHtcclxuXHRcdFx0dGhpcy5vblJlbW92ZShtYXApO1xyXG5cdFx0fVxyXG5cclxuXHRcdHJldHVybiB0aGlzO1xyXG5cdH0sXHJcblxyXG5cdF9yZWZvY3VzT25NYXA6IGZ1bmN0aW9uICgpIHtcclxuXHRcdGlmICh0aGlzLl9tYXApIHtcclxuXHRcdFx0dGhpcy5fbWFwLmdldENvbnRhaW5lcigpLmZvY3VzKCk7XHJcblx0XHR9XHJcblx0fVxyXG59KTtcclxuXHJcbkwuY29udHJvbCA9IGZ1bmN0aW9uIChvcHRpb25zKSB7XHJcblx0cmV0dXJuIG5ldyBMLkNvbnRyb2wob3B0aW9ucyk7XHJcbn07XHJcblxyXG5cclxuLy8gYWRkcyBjb250cm9sLXJlbGF0ZWQgbWV0aG9kcyB0byBMLk1hcFxyXG5cclxuTC5NYXAuaW5jbHVkZSh7XHJcblx0YWRkQ29udHJvbDogZnVuY3Rpb24gKGNvbnRyb2wpIHtcclxuXHRcdGNvbnRyb2wuYWRkVG8odGhpcyk7XHJcblx0XHRyZXR1cm4gdGhpcztcclxuXHR9LFxyXG5cclxuXHRyZW1vdmVDb250cm9sOiBmdW5jdGlvbiAoY29udHJvbCkge1xyXG5cdFx0Y29udHJvbC5yZW1vdmVGcm9tKHRoaXMpO1xyXG5cdFx0cmV0dXJuIHRoaXM7XHJcblx0fSxcclxuXHJcblx0X2luaXRDb250cm9sUG9zOiBmdW5jdGlvbiAoKSB7XHJcblx0XHR2YXIgY29ybmVycyA9IHRoaXMuX2NvbnRyb2xDb3JuZXJzID0ge30sXHJcblx0XHQgICAgbCA9ICdsZWFmbGV0LScsXHJcblx0XHQgICAgY29udGFpbmVyID0gdGhpcy5fY29udHJvbENvbnRhaW5lciA9XHJcblx0XHQgICAgICAgICAgICBMLkRvbVV0aWwuY3JlYXRlKCdkaXYnLCBsICsgJ2NvbnRyb2wtY29udGFpbmVyJywgdGhpcy5fY29udGFpbmVyKTtcclxuXHJcblx0XHRmdW5jdGlvbiBjcmVhdGVDb3JuZXIodlNpZGUsIGhTaWRlKSB7XHJcblx0XHRcdHZhciBjbGFzc05hbWUgPSBsICsgdlNpZGUgKyAnICcgKyBsICsgaFNpZGU7XHJcblxyXG5cdFx0XHRjb3JuZXJzW3ZTaWRlICsgaFNpZGVdID0gTC5Eb21VdGlsLmNyZWF0ZSgnZGl2JywgY2xhc3NOYW1lLCBjb250YWluZXIpO1xyXG5cdFx0fVxyXG5cclxuXHRcdGNyZWF0ZUNvcm5lcigndG9wJywgJ2xlZnQnKTtcclxuXHRcdGNyZWF0ZUNvcm5lcigndG9wJywgJ3JpZ2h0Jyk7XHJcblx0XHRjcmVhdGVDb3JuZXIoJ2JvdHRvbScsICdsZWZ0Jyk7XHJcblx0XHRjcmVhdGVDb3JuZXIoJ2JvdHRvbScsICdyaWdodCcpO1xyXG5cdH0sXHJcblxyXG5cdF9jbGVhckNvbnRyb2xQb3M6IGZ1bmN0aW9uICgpIHtcclxuXHRcdHRoaXMuX2NvbnRhaW5lci5yZW1vdmVDaGlsZCh0aGlzLl9jb250cm9sQ29udGFpbmVyKTtcclxuXHR9XHJcbn0pO1xyXG5cblxuLypcclxuICogTC5Db250cm9sLlpvb20gaXMgdXNlZCBmb3IgdGhlIGRlZmF1bHQgem9vbSBidXR0b25zIG9uIHRoZSBtYXAuXHJcbiAqL1xyXG5cclxuTC5Db250cm9sLlpvb20gPSBMLkNvbnRyb2wuZXh0ZW5kKHtcclxuXHRvcHRpb25zOiB7XHJcblx0XHRwb3NpdGlvbjogJ3RvcGxlZnQnLFxyXG5cdFx0em9vbUluVGV4dDogJysnLFxyXG5cdFx0em9vbUluVGl0bGU6ICdab29tIGluJyxcclxuXHRcdHpvb21PdXRUZXh0OiAnLScsXHJcblx0XHR6b29tT3V0VGl0bGU6ICdab29tIG91dCdcclxuXHR9LFxyXG5cclxuXHRvbkFkZDogZnVuY3Rpb24gKG1hcCkge1xyXG5cdFx0dmFyIHpvb21OYW1lID0gJ2xlYWZsZXQtY29udHJvbC16b29tJyxcclxuXHRcdCAgICBjb250YWluZXIgPSBMLkRvbVV0aWwuY3JlYXRlKCdkaXYnLCB6b29tTmFtZSArICcgbGVhZmxldC1iYXInKTtcclxuXHJcblx0XHR0aGlzLl9tYXAgPSBtYXA7XHJcblxyXG5cdFx0dGhpcy5fem9vbUluQnV0dG9uICA9IHRoaXMuX2NyZWF0ZUJ1dHRvbihcclxuXHRcdCAgICAgICAgdGhpcy5vcHRpb25zLnpvb21JblRleHQsIHRoaXMub3B0aW9ucy56b29tSW5UaXRsZSxcclxuXHRcdCAgICAgICAgem9vbU5hbWUgKyAnLWluJywgIGNvbnRhaW5lciwgdGhpcy5fem9vbUluLCAgdGhpcyk7XHJcblx0XHR0aGlzLl96b29tT3V0QnV0dG9uID0gdGhpcy5fY3JlYXRlQnV0dG9uKFxyXG5cdFx0ICAgICAgICB0aGlzLm9wdGlvbnMuem9vbU91dFRleHQsIHRoaXMub3B0aW9ucy56b29tT3V0VGl0bGUsXHJcblx0XHQgICAgICAgIHpvb21OYW1lICsgJy1vdXQnLCBjb250YWluZXIsIHRoaXMuX3pvb21PdXQsIHRoaXMpO1xyXG5cclxuXHRcdHRoaXMuX3VwZGF0ZURpc2FibGVkKCk7XHJcblx0XHRtYXAub24oJ3pvb21lbmQgem9vbWxldmVsc2NoYW5nZScsIHRoaXMuX3VwZGF0ZURpc2FibGVkLCB0aGlzKTtcclxuXHJcblx0XHRyZXR1cm4gY29udGFpbmVyO1xyXG5cdH0sXHJcblxyXG5cdG9uUmVtb3ZlOiBmdW5jdGlvbiAobWFwKSB7XHJcblx0XHRtYXAub2ZmKCd6b29tZW5kIHpvb21sZXZlbHNjaGFuZ2UnLCB0aGlzLl91cGRhdGVEaXNhYmxlZCwgdGhpcyk7XHJcblx0fSxcclxuXHJcblx0X3pvb21JbjogZnVuY3Rpb24gKGUpIHtcclxuXHRcdHRoaXMuX21hcC56b29tSW4oZS5zaGlmdEtleSA/IDMgOiAxKTtcclxuXHR9LFxyXG5cclxuXHRfem9vbU91dDogZnVuY3Rpb24gKGUpIHtcclxuXHRcdHRoaXMuX21hcC56b29tT3V0KGUuc2hpZnRLZXkgPyAzIDogMSk7XHJcblx0fSxcclxuXHJcblx0X2NyZWF0ZUJ1dHRvbjogZnVuY3Rpb24gKGh0bWwsIHRpdGxlLCBjbGFzc05hbWUsIGNvbnRhaW5lciwgZm4sIGNvbnRleHQpIHtcclxuXHRcdHZhciBsaW5rID0gTC5Eb21VdGlsLmNyZWF0ZSgnYScsIGNsYXNzTmFtZSwgY29udGFpbmVyKTtcclxuXHRcdGxpbmsuaW5uZXJIVE1MID0gaHRtbDtcclxuXHRcdGxpbmsuaHJlZiA9ICcjJztcclxuXHRcdGxpbmsudGl0bGUgPSB0aXRsZTtcclxuXHJcblx0XHR2YXIgc3RvcCA9IEwuRG9tRXZlbnQuc3RvcFByb3BhZ2F0aW9uO1xyXG5cclxuXHRcdEwuRG9tRXZlbnRcclxuXHRcdCAgICAub24obGluaywgJ2NsaWNrJywgc3RvcClcclxuXHRcdCAgICAub24obGluaywgJ21vdXNlZG93bicsIHN0b3ApXHJcblx0XHQgICAgLm9uKGxpbmssICdkYmxjbGljaycsIHN0b3ApXHJcblx0XHQgICAgLm9uKGxpbmssICdjbGljaycsIEwuRG9tRXZlbnQucHJldmVudERlZmF1bHQpXHJcblx0XHQgICAgLm9uKGxpbmssICdjbGljaycsIGZuLCBjb250ZXh0KVxyXG5cdFx0ICAgIC5vbihsaW5rLCAnY2xpY2snLCB0aGlzLl9yZWZvY3VzT25NYXAsIGNvbnRleHQpO1xyXG5cclxuXHRcdHJldHVybiBsaW5rO1xyXG5cdH0sXHJcblxyXG5cdF91cGRhdGVEaXNhYmxlZDogZnVuY3Rpb24gKCkge1xyXG5cdFx0dmFyIG1hcCA9IHRoaXMuX21hcCxcclxuXHRcdFx0Y2xhc3NOYW1lID0gJ2xlYWZsZXQtZGlzYWJsZWQnO1xyXG5cclxuXHRcdEwuRG9tVXRpbC5yZW1vdmVDbGFzcyh0aGlzLl96b29tSW5CdXR0b24sIGNsYXNzTmFtZSk7XHJcblx0XHRMLkRvbVV0aWwucmVtb3ZlQ2xhc3ModGhpcy5fem9vbU91dEJ1dHRvbiwgY2xhc3NOYW1lKTtcclxuXHJcblx0XHRpZiAobWFwLl96b29tID09PSBtYXAuZ2V0TWluWm9vbSgpKSB7XHJcblx0XHRcdEwuRG9tVXRpbC5hZGRDbGFzcyh0aGlzLl96b29tT3V0QnV0dG9uLCBjbGFzc05hbWUpO1xyXG5cdFx0fVxyXG5cdFx0aWYgKG1hcC5fem9vbSA9PT0gbWFwLmdldE1heFpvb20oKSkge1xyXG5cdFx0XHRMLkRvbVV0aWwuYWRkQ2xhc3ModGhpcy5fem9vbUluQnV0dG9uLCBjbGFzc05hbWUpO1xyXG5cdFx0fVxyXG5cdH1cclxufSk7XHJcblxyXG5MLk1hcC5tZXJnZU9wdGlvbnMoe1xyXG5cdHpvb21Db250cm9sOiB0cnVlXHJcbn0pO1xyXG5cclxuTC5NYXAuYWRkSW5pdEhvb2soZnVuY3Rpb24gKCkge1xyXG5cdGlmICh0aGlzLm9wdGlvbnMuem9vbUNvbnRyb2wpIHtcclxuXHRcdHRoaXMuem9vbUNvbnRyb2wgPSBuZXcgTC5Db250cm9sLlpvb20oKTtcclxuXHRcdHRoaXMuYWRkQ29udHJvbCh0aGlzLnpvb21Db250cm9sKTtcclxuXHR9XHJcbn0pO1xyXG5cclxuTC5jb250cm9sLnpvb20gPSBmdW5jdGlvbiAob3B0aW9ucykge1xyXG5cdHJldHVybiBuZXcgTC5Db250cm9sLlpvb20ob3B0aW9ucyk7XHJcbn07XHJcblxyXG5cblxuLypcclxuICogTC5Db250cm9sLkF0dHJpYnV0aW9uIGlzIHVzZWQgZm9yIGRpc3BsYXlpbmcgYXR0cmlidXRpb24gb24gdGhlIG1hcCAoYWRkZWQgYnkgZGVmYXVsdCkuXHJcbiAqL1xyXG5cclxuTC5Db250cm9sLkF0dHJpYnV0aW9uID0gTC5Db250cm9sLmV4dGVuZCh7XHJcblx0b3B0aW9uczoge1xyXG5cdFx0cG9zaXRpb246ICdib3R0b21yaWdodCcsXHJcblx0XHRwcmVmaXg6ICc8YSBocmVmPVwiaHR0cDovL2xlYWZsZXRqcy5jb21cIiB0aXRsZT1cIkEgSlMgbGlicmFyeSBmb3IgaW50ZXJhY3RpdmUgbWFwc1wiPkxlYWZsZXQ8L2E+J1xyXG5cdH0sXHJcblxyXG5cdGluaXRpYWxpemU6IGZ1bmN0aW9uIChvcHRpb25zKSB7XHJcblx0XHRMLnNldE9wdGlvbnModGhpcywgb3B0aW9ucyk7XHJcblxyXG5cdFx0dGhpcy5fYXR0cmlidXRpb25zID0ge307XHJcblx0fSxcclxuXHJcblx0b25BZGQ6IGZ1bmN0aW9uIChtYXApIHtcclxuXHRcdHRoaXMuX2NvbnRhaW5lciA9IEwuRG9tVXRpbC5jcmVhdGUoJ2RpdicsICdsZWFmbGV0LWNvbnRyb2wtYXR0cmlidXRpb24nKTtcclxuXHRcdEwuRG9tRXZlbnQuZGlzYWJsZUNsaWNrUHJvcGFnYXRpb24odGhpcy5fY29udGFpbmVyKTtcclxuXHJcblx0XHRmb3IgKHZhciBpIGluIG1hcC5fbGF5ZXJzKSB7XHJcblx0XHRcdGlmIChtYXAuX2xheWVyc1tpXS5nZXRBdHRyaWJ1dGlvbikge1xyXG5cdFx0XHRcdHRoaXMuYWRkQXR0cmlidXRpb24obWFwLl9sYXllcnNbaV0uZ2V0QXR0cmlidXRpb24oKSk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdFxyXG5cdFx0bWFwXHJcblx0XHQgICAgLm9uKCdsYXllcmFkZCcsIHRoaXMuX29uTGF5ZXJBZGQsIHRoaXMpXHJcblx0XHQgICAgLm9uKCdsYXllcnJlbW92ZScsIHRoaXMuX29uTGF5ZXJSZW1vdmUsIHRoaXMpO1xyXG5cclxuXHRcdHRoaXMuX3VwZGF0ZSgpO1xyXG5cclxuXHRcdHJldHVybiB0aGlzLl9jb250YWluZXI7XHJcblx0fSxcclxuXHJcblx0b25SZW1vdmU6IGZ1bmN0aW9uIChtYXApIHtcclxuXHRcdG1hcFxyXG5cdFx0ICAgIC5vZmYoJ2xheWVyYWRkJywgdGhpcy5fb25MYXllckFkZClcclxuXHRcdCAgICAub2ZmKCdsYXllcnJlbW92ZScsIHRoaXMuX29uTGF5ZXJSZW1vdmUpO1xyXG5cclxuXHR9LFxyXG5cclxuXHRzZXRQcmVmaXg6IGZ1bmN0aW9uIChwcmVmaXgpIHtcclxuXHRcdHRoaXMub3B0aW9ucy5wcmVmaXggPSBwcmVmaXg7XHJcblx0XHR0aGlzLl91cGRhdGUoKTtcclxuXHRcdHJldHVybiB0aGlzO1xyXG5cdH0sXHJcblxyXG5cdGFkZEF0dHJpYnV0aW9uOiBmdW5jdGlvbiAodGV4dCkge1xyXG5cdFx0aWYgKCF0ZXh0KSB7IHJldHVybjsgfVxyXG5cclxuXHRcdGlmICghdGhpcy5fYXR0cmlidXRpb25zW3RleHRdKSB7XHJcblx0XHRcdHRoaXMuX2F0dHJpYnV0aW9uc1t0ZXh0XSA9IDA7XHJcblx0XHR9XHJcblx0XHR0aGlzLl9hdHRyaWJ1dGlvbnNbdGV4dF0rKztcclxuXHJcblx0XHR0aGlzLl91cGRhdGUoKTtcclxuXHJcblx0XHRyZXR1cm4gdGhpcztcclxuXHR9LFxyXG5cclxuXHRyZW1vdmVBdHRyaWJ1dGlvbjogZnVuY3Rpb24gKHRleHQpIHtcclxuXHRcdGlmICghdGV4dCkgeyByZXR1cm47IH1cclxuXHJcblx0XHRpZiAodGhpcy5fYXR0cmlidXRpb25zW3RleHRdKSB7XHJcblx0XHRcdHRoaXMuX2F0dHJpYnV0aW9uc1t0ZXh0XS0tO1xyXG5cdFx0XHR0aGlzLl91cGRhdGUoKTtcclxuXHRcdH1cclxuXHJcblx0XHRyZXR1cm4gdGhpcztcclxuXHR9LFxyXG5cclxuXHRfdXBkYXRlOiBmdW5jdGlvbiAoKSB7XHJcblx0XHRpZiAoIXRoaXMuX21hcCkgeyByZXR1cm47IH1cclxuXHJcblx0XHR2YXIgYXR0cmlicyA9IFtdO1xyXG5cclxuXHRcdGZvciAodmFyIGkgaW4gdGhpcy5fYXR0cmlidXRpb25zKSB7XHJcblx0XHRcdGlmICh0aGlzLl9hdHRyaWJ1dGlvbnNbaV0pIHtcclxuXHRcdFx0XHRhdHRyaWJzLnB1c2goaSk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0XHR2YXIgcHJlZml4QW5kQXR0cmlicyA9IFtdO1xyXG5cclxuXHRcdGlmICh0aGlzLm9wdGlvbnMucHJlZml4KSB7XHJcblx0XHRcdHByZWZpeEFuZEF0dHJpYnMucHVzaCh0aGlzLm9wdGlvbnMucHJlZml4KTtcclxuXHRcdH1cclxuXHRcdGlmIChhdHRyaWJzLmxlbmd0aCkge1xyXG5cdFx0XHRwcmVmaXhBbmRBdHRyaWJzLnB1c2goYXR0cmlicy5qb2luKCcsICcpKTtcclxuXHRcdH1cclxuXHJcblx0XHR0aGlzLl9jb250YWluZXIuaW5uZXJIVE1MID0gcHJlZml4QW5kQXR0cmlicy5qb2luKCcgfCAnKTtcclxuXHR9LFxyXG5cclxuXHRfb25MYXllckFkZDogZnVuY3Rpb24gKGUpIHtcclxuXHRcdGlmIChlLmxheWVyLmdldEF0dHJpYnV0aW9uKSB7XHJcblx0XHRcdHRoaXMuYWRkQXR0cmlidXRpb24oZS5sYXllci5nZXRBdHRyaWJ1dGlvbigpKTtcclxuXHRcdH1cclxuXHR9LFxyXG5cclxuXHRfb25MYXllclJlbW92ZTogZnVuY3Rpb24gKGUpIHtcclxuXHRcdGlmIChlLmxheWVyLmdldEF0dHJpYnV0aW9uKSB7XHJcblx0XHRcdHRoaXMucmVtb3ZlQXR0cmlidXRpb24oZS5sYXllci5nZXRBdHRyaWJ1dGlvbigpKTtcclxuXHRcdH1cclxuXHR9XHJcbn0pO1xyXG5cclxuTC5NYXAubWVyZ2VPcHRpb25zKHtcclxuXHRhdHRyaWJ1dGlvbkNvbnRyb2w6IHRydWVcclxufSk7XHJcblxyXG5MLk1hcC5hZGRJbml0SG9vayhmdW5jdGlvbiAoKSB7XHJcblx0aWYgKHRoaXMub3B0aW9ucy5hdHRyaWJ1dGlvbkNvbnRyb2wpIHtcclxuXHRcdHRoaXMuYXR0cmlidXRpb25Db250cm9sID0gKG5ldyBMLkNvbnRyb2wuQXR0cmlidXRpb24oKSkuYWRkVG8odGhpcyk7XHJcblx0fVxyXG59KTtcclxuXHJcbkwuY29udHJvbC5hdHRyaWJ1dGlvbiA9IGZ1bmN0aW9uIChvcHRpb25zKSB7XHJcblx0cmV0dXJuIG5ldyBMLkNvbnRyb2wuQXR0cmlidXRpb24ob3B0aW9ucyk7XHJcbn07XHJcblxuXG4vKlxuICogTC5Db250cm9sLlNjYWxlIGlzIHVzZWQgZm9yIGRpc3BsYXlpbmcgbWV0cmljL2ltcGVyaWFsIHNjYWxlIG9uIHRoZSBtYXAuXG4gKi9cblxuTC5Db250cm9sLlNjYWxlID0gTC5Db250cm9sLmV4dGVuZCh7XG5cdG9wdGlvbnM6IHtcblx0XHRwb3NpdGlvbjogJ2JvdHRvbWxlZnQnLFxuXHRcdG1heFdpZHRoOiAxMDAsXG5cdFx0bWV0cmljOiB0cnVlLFxuXHRcdGltcGVyaWFsOiB0cnVlLFxuXHRcdHVwZGF0ZVdoZW5JZGxlOiBmYWxzZVxuXHR9LFxuXG5cdG9uQWRkOiBmdW5jdGlvbiAobWFwKSB7XG5cdFx0dGhpcy5fbWFwID0gbWFwO1xuXG5cdFx0dmFyIGNsYXNzTmFtZSA9ICdsZWFmbGV0LWNvbnRyb2wtc2NhbGUnLFxuXHRcdCAgICBjb250YWluZXIgPSBMLkRvbVV0aWwuY3JlYXRlKCdkaXYnLCBjbGFzc05hbWUpLFxuXHRcdCAgICBvcHRpb25zID0gdGhpcy5vcHRpb25zO1xuXG5cdFx0dGhpcy5fYWRkU2NhbGVzKG9wdGlvbnMsIGNsYXNzTmFtZSwgY29udGFpbmVyKTtcblxuXHRcdG1hcC5vbihvcHRpb25zLnVwZGF0ZVdoZW5JZGxlID8gJ21vdmVlbmQnIDogJ21vdmUnLCB0aGlzLl91cGRhdGUsIHRoaXMpO1xuXHRcdG1hcC53aGVuUmVhZHkodGhpcy5fdXBkYXRlLCB0aGlzKTtcblxuXHRcdHJldHVybiBjb250YWluZXI7XG5cdH0sXG5cblx0b25SZW1vdmU6IGZ1bmN0aW9uIChtYXApIHtcblx0XHRtYXAub2ZmKHRoaXMub3B0aW9ucy51cGRhdGVXaGVuSWRsZSA/ICdtb3ZlZW5kJyA6ICdtb3ZlJywgdGhpcy5fdXBkYXRlLCB0aGlzKTtcblx0fSxcblxuXHRfYWRkU2NhbGVzOiBmdW5jdGlvbiAob3B0aW9ucywgY2xhc3NOYW1lLCBjb250YWluZXIpIHtcblx0XHRpZiAob3B0aW9ucy5tZXRyaWMpIHtcblx0XHRcdHRoaXMuX21TY2FsZSA9IEwuRG9tVXRpbC5jcmVhdGUoJ2RpdicsIGNsYXNzTmFtZSArICctbGluZScsIGNvbnRhaW5lcik7XG5cdFx0fVxuXHRcdGlmIChvcHRpb25zLmltcGVyaWFsKSB7XG5cdFx0XHR0aGlzLl9pU2NhbGUgPSBMLkRvbVV0aWwuY3JlYXRlKCdkaXYnLCBjbGFzc05hbWUgKyAnLWxpbmUnLCBjb250YWluZXIpO1xuXHRcdH1cblx0fSxcblxuXHRfdXBkYXRlOiBmdW5jdGlvbiAoKSB7XG5cdFx0dmFyIGJvdW5kcyA9IHRoaXMuX21hcC5nZXRCb3VuZHMoKSxcblx0XHQgICAgY2VudGVyTGF0ID0gYm91bmRzLmdldENlbnRlcigpLmxhdCxcblx0XHQgICAgaGFsZldvcmxkTWV0ZXJzID0gNjM3ODEzNyAqIE1hdGguUEkgKiBNYXRoLmNvcyhjZW50ZXJMYXQgKiBNYXRoLlBJIC8gMTgwKSxcblx0XHQgICAgZGlzdCA9IGhhbGZXb3JsZE1ldGVycyAqIChib3VuZHMuZ2V0Tm9ydGhFYXN0KCkubG5nIC0gYm91bmRzLmdldFNvdXRoV2VzdCgpLmxuZykgLyAxODAsXG5cblx0XHQgICAgc2l6ZSA9IHRoaXMuX21hcC5nZXRTaXplKCksXG5cdFx0ICAgIG9wdGlvbnMgPSB0aGlzLm9wdGlvbnMsXG5cdFx0ICAgIG1heE1ldGVycyA9IDA7XG5cblx0XHRpZiAoc2l6ZS54ID4gMCkge1xuXHRcdFx0bWF4TWV0ZXJzID0gZGlzdCAqIChvcHRpb25zLm1heFdpZHRoIC8gc2l6ZS54KTtcblx0XHR9XG5cblx0XHR0aGlzLl91cGRhdGVTY2FsZXMob3B0aW9ucywgbWF4TWV0ZXJzKTtcblx0fSxcblxuXHRfdXBkYXRlU2NhbGVzOiBmdW5jdGlvbiAob3B0aW9ucywgbWF4TWV0ZXJzKSB7XG5cdFx0aWYgKG9wdGlvbnMubWV0cmljICYmIG1heE1ldGVycykge1xuXHRcdFx0dGhpcy5fdXBkYXRlTWV0cmljKG1heE1ldGVycyk7XG5cdFx0fVxuXG5cdFx0aWYgKG9wdGlvbnMuaW1wZXJpYWwgJiYgbWF4TWV0ZXJzKSB7XG5cdFx0XHR0aGlzLl91cGRhdGVJbXBlcmlhbChtYXhNZXRlcnMpO1xuXHRcdH1cblx0fSxcblxuXHRfdXBkYXRlTWV0cmljOiBmdW5jdGlvbiAobWF4TWV0ZXJzKSB7XG5cdFx0dmFyIG1ldGVycyA9IHRoaXMuX2dldFJvdW5kTnVtKG1heE1ldGVycyk7XG5cblx0XHR0aGlzLl9tU2NhbGUuc3R5bGUud2lkdGggPSB0aGlzLl9nZXRTY2FsZVdpZHRoKG1ldGVycyAvIG1heE1ldGVycykgKyAncHgnO1xuXHRcdHRoaXMuX21TY2FsZS5pbm5lckhUTUwgPSBtZXRlcnMgPCAxMDAwID8gbWV0ZXJzICsgJyBtJyA6IChtZXRlcnMgLyAxMDAwKSArICcga20nO1xuXHR9LFxuXG5cdF91cGRhdGVJbXBlcmlhbDogZnVuY3Rpb24gKG1heE1ldGVycykge1xuXHRcdHZhciBtYXhGZWV0ID0gbWF4TWV0ZXJzICogMy4yODA4Mzk5LFxuXHRcdCAgICBzY2FsZSA9IHRoaXMuX2lTY2FsZSxcblx0XHQgICAgbWF4TWlsZXMsIG1pbGVzLCBmZWV0O1xuXG5cdFx0aWYgKG1heEZlZXQgPiA1MjgwKSB7XG5cdFx0XHRtYXhNaWxlcyA9IG1heEZlZXQgLyA1MjgwO1xuXHRcdFx0bWlsZXMgPSB0aGlzLl9nZXRSb3VuZE51bShtYXhNaWxlcyk7XG5cblx0XHRcdHNjYWxlLnN0eWxlLndpZHRoID0gdGhpcy5fZ2V0U2NhbGVXaWR0aChtaWxlcyAvIG1heE1pbGVzKSArICdweCc7XG5cdFx0XHRzY2FsZS5pbm5lckhUTUwgPSBtaWxlcyArICcgbWknO1xuXG5cdFx0fSBlbHNlIHtcblx0XHRcdGZlZXQgPSB0aGlzLl9nZXRSb3VuZE51bShtYXhGZWV0KTtcblxuXHRcdFx0c2NhbGUuc3R5bGUud2lkdGggPSB0aGlzLl9nZXRTY2FsZVdpZHRoKGZlZXQgLyBtYXhGZWV0KSArICdweCc7XG5cdFx0XHRzY2FsZS5pbm5lckhUTUwgPSBmZWV0ICsgJyBmdCc7XG5cdFx0fVxuXHR9LFxuXG5cdF9nZXRTY2FsZVdpZHRoOiBmdW5jdGlvbiAocmF0aW8pIHtcblx0XHRyZXR1cm4gTWF0aC5yb3VuZCh0aGlzLm9wdGlvbnMubWF4V2lkdGggKiByYXRpbykgLSAxMDtcblx0fSxcblxuXHRfZ2V0Um91bmROdW06IGZ1bmN0aW9uIChudW0pIHtcblx0XHR2YXIgcG93MTAgPSBNYXRoLnBvdygxMCwgKE1hdGguZmxvb3IobnVtKSArICcnKS5sZW5ndGggLSAxKSxcblx0XHQgICAgZCA9IG51bSAvIHBvdzEwO1xuXG5cdFx0ZCA9IGQgPj0gMTAgPyAxMCA6IGQgPj0gNSA/IDUgOiBkID49IDMgPyAzIDogZCA+PSAyID8gMiA6IDE7XG5cblx0XHRyZXR1cm4gcG93MTAgKiBkO1xuXHR9XG59KTtcblxuTC5jb250cm9sLnNjYWxlID0gZnVuY3Rpb24gKG9wdGlvbnMpIHtcblx0cmV0dXJuIG5ldyBMLkNvbnRyb2wuU2NhbGUob3B0aW9ucyk7XG59O1xuXG5cbi8qXHJcbiAqIEwuQ29udHJvbC5MYXllcnMgaXMgYSBjb250cm9sIHRvIGFsbG93IHVzZXJzIHRvIHN3aXRjaCBiZXR3ZWVuIGRpZmZlcmVudCBsYXllcnMgb24gdGhlIG1hcC5cclxuICovXHJcblxyXG5MLkNvbnRyb2wuTGF5ZXJzID0gTC5Db250cm9sLmV4dGVuZCh7XHJcblx0b3B0aW9uczoge1xyXG5cdFx0Y29sbGFwc2VkOiB0cnVlLFxyXG5cdFx0cG9zaXRpb246ICd0b3ByaWdodCcsXHJcblx0XHRhdXRvWkluZGV4OiB0cnVlXHJcblx0fSxcclxuXHJcblx0aW5pdGlhbGl6ZTogZnVuY3Rpb24gKGJhc2VMYXllcnMsIG92ZXJsYXlzLCBvcHRpb25zKSB7XHJcblx0XHRMLnNldE9wdGlvbnModGhpcywgb3B0aW9ucyk7XHJcblxyXG5cdFx0dGhpcy5fbGF5ZXJzID0ge307XHJcblx0XHR0aGlzLl9sYXN0WkluZGV4ID0gMDtcclxuXHRcdHRoaXMuX2hhbmRsaW5nQ2xpY2sgPSBmYWxzZTtcclxuXHJcblx0XHRmb3IgKHZhciBpIGluIGJhc2VMYXllcnMpIHtcclxuXHRcdFx0dGhpcy5fYWRkTGF5ZXIoYmFzZUxheWVyc1tpXSwgaSk7XHJcblx0XHR9XHJcblxyXG5cdFx0Zm9yIChpIGluIG92ZXJsYXlzKSB7XHJcblx0XHRcdHRoaXMuX2FkZExheWVyKG92ZXJsYXlzW2ldLCBpLCB0cnVlKTtcclxuXHRcdH1cclxuXHR9LFxyXG5cclxuXHRvbkFkZDogZnVuY3Rpb24gKG1hcCkge1xyXG5cdFx0dGhpcy5faW5pdExheW91dCgpO1xyXG5cdFx0dGhpcy5fdXBkYXRlKCk7XHJcblxyXG5cdFx0bWFwXHJcblx0XHQgICAgLm9uKCdsYXllcmFkZCcsIHRoaXMuX29uTGF5ZXJDaGFuZ2UsIHRoaXMpXHJcblx0XHQgICAgLm9uKCdsYXllcnJlbW92ZScsIHRoaXMuX29uTGF5ZXJDaGFuZ2UsIHRoaXMpO1xyXG5cclxuXHRcdHJldHVybiB0aGlzLl9jb250YWluZXI7XHJcblx0fSxcclxuXHJcblx0b25SZW1vdmU6IGZ1bmN0aW9uIChtYXApIHtcclxuXHRcdG1hcFxyXG5cdFx0ICAgIC5vZmYoJ2xheWVyYWRkJywgdGhpcy5fb25MYXllckNoYW5nZSwgdGhpcylcclxuXHRcdCAgICAub2ZmKCdsYXllcnJlbW92ZScsIHRoaXMuX29uTGF5ZXJDaGFuZ2UsIHRoaXMpO1xyXG5cdH0sXHJcblxyXG5cdGFkZEJhc2VMYXllcjogZnVuY3Rpb24gKGxheWVyLCBuYW1lKSB7XHJcblx0XHR0aGlzLl9hZGRMYXllcihsYXllciwgbmFtZSk7XHJcblx0XHR0aGlzLl91cGRhdGUoKTtcclxuXHRcdHJldHVybiB0aGlzO1xyXG5cdH0sXHJcblxyXG5cdGFkZE92ZXJsYXk6IGZ1bmN0aW9uIChsYXllciwgbmFtZSkge1xyXG5cdFx0dGhpcy5fYWRkTGF5ZXIobGF5ZXIsIG5hbWUsIHRydWUpO1xyXG5cdFx0dGhpcy5fdXBkYXRlKCk7XHJcblx0XHRyZXR1cm4gdGhpcztcclxuXHR9LFxyXG5cclxuXHRyZW1vdmVMYXllcjogZnVuY3Rpb24gKGxheWVyKSB7XHJcblx0XHR2YXIgaWQgPSBMLnN0YW1wKGxheWVyKTtcclxuXHRcdGRlbGV0ZSB0aGlzLl9sYXllcnNbaWRdO1xyXG5cdFx0dGhpcy5fdXBkYXRlKCk7XHJcblx0XHRyZXR1cm4gdGhpcztcclxuXHR9LFxyXG5cclxuXHRfaW5pdExheW91dDogZnVuY3Rpb24gKCkge1xyXG5cdFx0dmFyIGNsYXNzTmFtZSA9ICdsZWFmbGV0LWNvbnRyb2wtbGF5ZXJzJyxcclxuXHRcdCAgICBjb250YWluZXIgPSB0aGlzLl9jb250YWluZXIgPSBMLkRvbVV0aWwuY3JlYXRlKCdkaXYnLCBjbGFzc05hbWUpO1xyXG5cclxuXHRcdC8vTWFrZXMgdGhpcyB3b3JrIG9uIElFMTAgVG91Y2ggZGV2aWNlcyBieSBzdG9wcGluZyBpdCBmcm9tIGZpcmluZyBhIG1vdXNlb3V0IGV2ZW50IHdoZW4gdGhlIHRvdWNoIGlzIHJlbGVhc2VkXHJcblx0XHRjb250YWluZXIuc2V0QXR0cmlidXRlKCdhcmlhLWhhc3BvcHVwJywgdHJ1ZSk7XHJcblxyXG5cdFx0aWYgKCFMLkJyb3dzZXIudG91Y2gpIHtcclxuXHRcdFx0TC5Eb21FdmVudFxyXG5cdFx0XHRcdC5kaXNhYmxlQ2xpY2tQcm9wYWdhdGlvbihjb250YWluZXIpXHJcblx0XHRcdFx0LmRpc2FibGVTY3JvbGxQcm9wYWdhdGlvbihjb250YWluZXIpO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0TC5Eb21FdmVudC5vbihjb250YWluZXIsICdjbGljaycsIEwuRG9tRXZlbnQuc3RvcFByb3BhZ2F0aW9uKTtcclxuXHRcdH1cclxuXHJcblx0XHR2YXIgZm9ybSA9IHRoaXMuX2Zvcm0gPSBMLkRvbVV0aWwuY3JlYXRlKCdmb3JtJywgY2xhc3NOYW1lICsgJy1saXN0Jyk7XHJcblxyXG5cdFx0aWYgKHRoaXMub3B0aW9ucy5jb2xsYXBzZWQpIHtcclxuXHRcdFx0aWYgKCFMLkJyb3dzZXIuYW5kcm9pZCkge1xyXG5cdFx0XHRcdEwuRG9tRXZlbnRcclxuXHRcdFx0XHQgICAgLm9uKGNvbnRhaW5lciwgJ21vdXNlb3ZlcicsIHRoaXMuX2V4cGFuZCwgdGhpcylcclxuXHRcdFx0XHQgICAgLm9uKGNvbnRhaW5lciwgJ21vdXNlb3V0JywgdGhpcy5fY29sbGFwc2UsIHRoaXMpO1xyXG5cdFx0XHR9XHJcblx0XHRcdHZhciBsaW5rID0gdGhpcy5fbGF5ZXJzTGluayA9IEwuRG9tVXRpbC5jcmVhdGUoJ2EnLCBjbGFzc05hbWUgKyAnLXRvZ2dsZScsIGNvbnRhaW5lcik7XHJcblx0XHRcdGxpbmsuaHJlZiA9ICcjJztcclxuXHRcdFx0bGluay50aXRsZSA9ICdMYXllcnMnO1xyXG5cclxuXHRcdFx0aWYgKEwuQnJvd3Nlci50b3VjaCkge1xyXG5cdFx0XHRcdEwuRG9tRXZlbnRcclxuXHRcdFx0XHQgICAgLm9uKGxpbmssICdjbGljaycsIEwuRG9tRXZlbnQuc3RvcClcclxuXHRcdFx0XHQgICAgLm9uKGxpbmssICdjbGljaycsIHRoaXMuX2V4cGFuZCwgdGhpcyk7XHJcblx0XHRcdH1cclxuXHRcdFx0ZWxzZSB7XHJcblx0XHRcdFx0TC5Eb21FdmVudC5vbihsaW5rLCAnZm9jdXMnLCB0aGlzLl9leHBhbmQsIHRoaXMpO1xyXG5cdFx0XHR9XHJcblx0XHRcdC8vV29yayBhcm91bmQgZm9yIEZpcmVmb3ggYW5kcm9pZCBpc3N1ZSBodHRwczovL2dpdGh1Yi5jb20vTGVhZmxldC9MZWFmbGV0L2lzc3Vlcy8yMDMzXHJcblx0XHRcdEwuRG9tRXZlbnQub24oZm9ybSwgJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xyXG5cdFx0XHRcdHNldFRpbWVvdXQoTC5iaW5kKHRoaXMuX29uSW5wdXRDbGljaywgdGhpcyksIDApO1xyXG5cdFx0XHR9LCB0aGlzKTtcclxuXHJcblx0XHRcdHRoaXMuX21hcC5vbignY2xpY2snLCB0aGlzLl9jb2xsYXBzZSwgdGhpcyk7XHJcblx0XHRcdC8vIFRPRE8ga2V5Ym9hcmQgYWNjZXNzaWJpbGl0eVxyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0dGhpcy5fZXhwYW5kKCk7XHJcblx0XHR9XHJcblxyXG5cdFx0dGhpcy5fYmFzZUxheWVyc0xpc3QgPSBMLkRvbVV0aWwuY3JlYXRlKCdkaXYnLCBjbGFzc05hbWUgKyAnLWJhc2UnLCBmb3JtKTtcclxuXHRcdHRoaXMuX3NlcGFyYXRvciA9IEwuRG9tVXRpbC5jcmVhdGUoJ2RpdicsIGNsYXNzTmFtZSArICctc2VwYXJhdG9yJywgZm9ybSk7XHJcblx0XHR0aGlzLl9vdmVybGF5c0xpc3QgPSBMLkRvbVV0aWwuY3JlYXRlKCdkaXYnLCBjbGFzc05hbWUgKyAnLW92ZXJsYXlzJywgZm9ybSk7XHJcblxyXG5cdFx0Y29udGFpbmVyLmFwcGVuZENoaWxkKGZvcm0pO1xyXG5cdH0sXHJcblxyXG5cdF9hZGRMYXllcjogZnVuY3Rpb24gKGxheWVyLCBuYW1lLCBvdmVybGF5KSB7XHJcblx0XHR2YXIgaWQgPSBMLnN0YW1wKGxheWVyKTtcclxuXHJcblx0XHR0aGlzLl9sYXllcnNbaWRdID0ge1xyXG5cdFx0XHRsYXllcjogbGF5ZXIsXHJcblx0XHRcdG5hbWU6IG5hbWUsXHJcblx0XHRcdG92ZXJsYXk6IG92ZXJsYXlcclxuXHRcdH07XHJcblxyXG5cdFx0aWYgKHRoaXMub3B0aW9ucy5hdXRvWkluZGV4ICYmIGxheWVyLnNldFpJbmRleCkge1xyXG5cdFx0XHR0aGlzLl9sYXN0WkluZGV4Kys7XHJcblx0XHRcdGxheWVyLnNldFpJbmRleCh0aGlzLl9sYXN0WkluZGV4KTtcclxuXHRcdH1cclxuXHR9LFxyXG5cclxuXHRfdXBkYXRlOiBmdW5jdGlvbiAoKSB7XHJcblx0XHRpZiAoIXRoaXMuX2NvbnRhaW5lcikge1xyXG5cdFx0XHRyZXR1cm47XHJcblx0XHR9XHJcblxyXG5cdFx0dGhpcy5fYmFzZUxheWVyc0xpc3QuaW5uZXJIVE1MID0gJyc7XHJcblx0XHR0aGlzLl9vdmVybGF5c0xpc3QuaW5uZXJIVE1MID0gJyc7XHJcblxyXG5cdFx0dmFyIGJhc2VMYXllcnNQcmVzZW50ID0gZmFsc2UsXHJcblx0XHQgICAgb3ZlcmxheXNQcmVzZW50ID0gZmFsc2UsXHJcblx0XHQgICAgaSwgb2JqO1xyXG5cclxuXHRcdGZvciAoaSBpbiB0aGlzLl9sYXllcnMpIHtcclxuXHRcdFx0b2JqID0gdGhpcy5fbGF5ZXJzW2ldO1xyXG5cdFx0XHR0aGlzLl9hZGRJdGVtKG9iaik7XHJcblx0XHRcdG92ZXJsYXlzUHJlc2VudCA9IG92ZXJsYXlzUHJlc2VudCB8fCBvYmoub3ZlcmxheTtcclxuXHRcdFx0YmFzZUxheWVyc1ByZXNlbnQgPSBiYXNlTGF5ZXJzUHJlc2VudCB8fCAhb2JqLm92ZXJsYXk7XHJcblx0XHR9XHJcblxyXG5cdFx0dGhpcy5fc2VwYXJhdG9yLnN0eWxlLmRpc3BsYXkgPSBvdmVybGF5c1ByZXNlbnQgJiYgYmFzZUxheWVyc1ByZXNlbnQgPyAnJyA6ICdub25lJztcclxuXHR9LFxyXG5cclxuXHRfb25MYXllckNoYW5nZTogZnVuY3Rpb24gKGUpIHtcclxuXHRcdHZhciBvYmogPSB0aGlzLl9sYXllcnNbTC5zdGFtcChlLmxheWVyKV07XHJcblxyXG5cdFx0aWYgKCFvYmopIHsgcmV0dXJuOyB9XHJcblxyXG5cdFx0aWYgKCF0aGlzLl9oYW5kbGluZ0NsaWNrKSB7XHJcblx0XHRcdHRoaXMuX3VwZGF0ZSgpO1xyXG5cdFx0fVxyXG5cclxuXHRcdHZhciB0eXBlID0gb2JqLm92ZXJsYXkgP1xyXG5cdFx0XHQoZS50eXBlID09PSAnbGF5ZXJhZGQnID8gJ292ZXJsYXlhZGQnIDogJ292ZXJsYXlyZW1vdmUnKSA6XHJcblx0XHRcdChlLnR5cGUgPT09ICdsYXllcmFkZCcgPyAnYmFzZWxheWVyY2hhbmdlJyA6IG51bGwpO1xyXG5cclxuXHRcdGlmICh0eXBlKSB7XHJcblx0XHRcdHRoaXMuX21hcC5maXJlKHR5cGUsIG9iaik7XHJcblx0XHR9XHJcblx0fSxcclxuXHJcblx0Ly8gSUU3IGJ1Z3Mgb3V0IGlmIHlvdSBjcmVhdGUgYSByYWRpbyBkeW5hbWljYWxseSwgc28geW91IGhhdmUgdG8gZG8gaXQgdGhpcyBoYWNreSB3YXkgKHNlZSBodHRwOi8vYml0Lmx5L1BxWUxCZSlcclxuXHRfY3JlYXRlUmFkaW9FbGVtZW50OiBmdW5jdGlvbiAobmFtZSwgY2hlY2tlZCkge1xyXG5cclxuXHRcdHZhciByYWRpb0h0bWwgPSAnPGlucHV0IHR5cGU9XCJyYWRpb1wiIGNsYXNzPVwibGVhZmxldC1jb250cm9sLWxheWVycy1zZWxlY3RvclwiIG5hbWU9XCInICsgbmFtZSArICdcIic7XHJcblx0XHRpZiAoY2hlY2tlZCkge1xyXG5cdFx0XHRyYWRpb0h0bWwgKz0gJyBjaGVja2VkPVwiY2hlY2tlZFwiJztcclxuXHRcdH1cclxuXHRcdHJhZGlvSHRtbCArPSAnLz4nO1xyXG5cclxuXHRcdHZhciByYWRpb0ZyYWdtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcblx0XHRyYWRpb0ZyYWdtZW50LmlubmVySFRNTCA9IHJhZGlvSHRtbDtcclxuXHJcblx0XHRyZXR1cm4gcmFkaW9GcmFnbWVudC5maXJzdENoaWxkO1xyXG5cdH0sXHJcblxyXG5cdF9hZGRJdGVtOiBmdW5jdGlvbiAob2JqKSB7XHJcblx0XHR2YXIgbGFiZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdsYWJlbCcpLFxyXG5cdFx0ICAgIGlucHV0LFxyXG5cdFx0ICAgIGNoZWNrZWQgPSB0aGlzLl9tYXAuaGFzTGF5ZXIob2JqLmxheWVyKTtcclxuXHJcblx0XHRpZiAob2JqLm92ZXJsYXkpIHtcclxuXHRcdFx0aW5wdXQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbnB1dCcpO1xyXG5cdFx0XHRpbnB1dC50eXBlID0gJ2NoZWNrYm94JztcclxuXHRcdFx0aW5wdXQuY2xhc3NOYW1lID0gJ2xlYWZsZXQtY29udHJvbC1sYXllcnMtc2VsZWN0b3InO1xyXG5cdFx0XHRpbnB1dC5kZWZhdWx0Q2hlY2tlZCA9IGNoZWNrZWQ7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRpbnB1dCA9IHRoaXMuX2NyZWF0ZVJhZGlvRWxlbWVudCgnbGVhZmxldC1iYXNlLWxheWVycycsIGNoZWNrZWQpO1xyXG5cdFx0fVxyXG5cclxuXHRcdGlucHV0LmxheWVySWQgPSBMLnN0YW1wKG9iai5sYXllcik7XHJcblxyXG5cdFx0TC5Eb21FdmVudC5vbihpbnB1dCwgJ2NsaWNrJywgdGhpcy5fb25JbnB1dENsaWNrLCB0aGlzKTtcclxuXHJcblx0XHR2YXIgbmFtZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcclxuXHRcdG5hbWUuaW5uZXJIVE1MID0gJyAnICsgb2JqLm5hbWU7XHJcblxyXG5cdFx0bGFiZWwuYXBwZW5kQ2hpbGQoaW5wdXQpO1xyXG5cdFx0bGFiZWwuYXBwZW5kQ2hpbGQobmFtZSk7XHJcblxyXG5cdFx0dmFyIGNvbnRhaW5lciA9IG9iai5vdmVybGF5ID8gdGhpcy5fb3ZlcmxheXNMaXN0IDogdGhpcy5fYmFzZUxheWVyc0xpc3Q7XHJcblx0XHRjb250YWluZXIuYXBwZW5kQ2hpbGQobGFiZWwpO1xyXG5cclxuXHRcdHJldHVybiBsYWJlbDtcclxuXHR9LFxyXG5cclxuXHRfb25JbnB1dENsaWNrOiBmdW5jdGlvbiAoKSB7XHJcblx0XHR2YXIgaSwgaW5wdXQsIG9iaixcclxuXHRcdCAgICBpbnB1dHMgPSB0aGlzLl9mb3JtLmdldEVsZW1lbnRzQnlUYWdOYW1lKCdpbnB1dCcpLFxyXG5cdFx0ICAgIGlucHV0c0xlbiA9IGlucHV0cy5sZW5ndGg7XHJcblxyXG5cdFx0dGhpcy5faGFuZGxpbmdDbGljayA9IHRydWU7XHJcblxyXG5cdFx0Zm9yIChpID0gMDsgaSA8IGlucHV0c0xlbjsgaSsrKSB7XHJcblx0XHRcdGlucHV0ID0gaW5wdXRzW2ldO1xyXG5cdFx0XHRvYmogPSB0aGlzLl9sYXllcnNbaW5wdXQubGF5ZXJJZF07XHJcblxyXG5cdFx0XHRpZiAoaW5wdXQuY2hlY2tlZCAmJiAhdGhpcy5fbWFwLmhhc0xheWVyKG9iai5sYXllcikpIHtcclxuXHRcdFx0XHR0aGlzLl9tYXAuYWRkTGF5ZXIob2JqLmxheWVyKTtcclxuXHJcblx0XHRcdH0gZWxzZSBpZiAoIWlucHV0LmNoZWNrZWQgJiYgdGhpcy5fbWFwLmhhc0xheWVyKG9iai5sYXllcikpIHtcclxuXHRcdFx0XHR0aGlzLl9tYXAucmVtb3ZlTGF5ZXIob2JqLmxheWVyKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHRcdHRoaXMuX2hhbmRsaW5nQ2xpY2sgPSBmYWxzZTtcclxuXHJcblx0XHR0aGlzLl9yZWZvY3VzT25NYXAoKTtcclxuXHR9LFxyXG5cclxuXHRfZXhwYW5kOiBmdW5jdGlvbiAoKSB7XHJcblx0XHRMLkRvbVV0aWwuYWRkQ2xhc3ModGhpcy5fY29udGFpbmVyLCAnbGVhZmxldC1jb250cm9sLWxheWVycy1leHBhbmRlZCcpO1xyXG5cdH0sXHJcblxyXG5cdF9jb2xsYXBzZTogZnVuY3Rpb24gKCkge1xyXG5cdFx0dGhpcy5fY29udGFpbmVyLmNsYXNzTmFtZSA9IHRoaXMuX2NvbnRhaW5lci5jbGFzc05hbWUucmVwbGFjZSgnIGxlYWZsZXQtY29udHJvbC1sYXllcnMtZXhwYW5kZWQnLCAnJyk7XHJcblx0fVxyXG59KTtcclxuXHJcbkwuY29udHJvbC5sYXllcnMgPSBmdW5jdGlvbiAoYmFzZUxheWVycywgb3ZlcmxheXMsIG9wdGlvbnMpIHtcclxuXHRyZXR1cm4gbmV3IEwuQ29udHJvbC5MYXllcnMoYmFzZUxheWVycywgb3ZlcmxheXMsIG9wdGlvbnMpO1xyXG59O1xyXG5cblxuLypcbiAqIEwuUG9zQW5pbWF0aW9uIGlzIHVzZWQgYnkgTGVhZmxldCBpbnRlcm5hbGx5IGZvciBwYW4gYW5pbWF0aW9ucy5cbiAqL1xuXG5MLlBvc0FuaW1hdGlvbiA9IEwuQ2xhc3MuZXh0ZW5kKHtcblx0aW5jbHVkZXM6IEwuTWl4aW4uRXZlbnRzLFxuXG5cdHJ1bjogZnVuY3Rpb24gKGVsLCBuZXdQb3MsIGR1cmF0aW9uLCBlYXNlTGluZWFyaXR5KSB7IC8vIChIVE1MRWxlbWVudCwgUG9pbnRbLCBOdW1iZXIsIE51bWJlcl0pXG5cdFx0dGhpcy5zdG9wKCk7XG5cblx0XHR0aGlzLl9lbCA9IGVsO1xuXHRcdHRoaXMuX2luUHJvZ3Jlc3MgPSB0cnVlO1xuXHRcdHRoaXMuX25ld1BvcyA9IG5ld1BvcztcblxuXHRcdHRoaXMuZmlyZSgnc3RhcnQnKTtcblxuXHRcdGVsLnN0eWxlW0wuRG9tVXRpbC5UUkFOU0lUSU9OXSA9ICdhbGwgJyArIChkdXJhdGlvbiB8fCAwLjI1KSArXG5cdFx0ICAgICAgICAncyBjdWJpYy1iZXppZXIoMCwwLCcgKyAoZWFzZUxpbmVhcml0eSB8fCAwLjUpICsgJywxKSc7XG5cblx0XHRMLkRvbUV2ZW50Lm9uKGVsLCBMLkRvbVV0aWwuVFJBTlNJVElPTl9FTkQsIHRoaXMuX29uVHJhbnNpdGlvbkVuZCwgdGhpcyk7XG5cdFx0TC5Eb21VdGlsLnNldFBvc2l0aW9uKGVsLCBuZXdQb3MpO1xuXG5cdFx0Ly8gdG9nZ2xlIHJlZmxvdywgQ2hyb21lIGZsaWNrZXJzIGZvciBzb21lIHJlYXNvbiBpZiB5b3UgZG9uJ3QgZG8gdGhpc1xuXHRcdEwuVXRpbC5mYWxzZUZuKGVsLm9mZnNldFdpZHRoKTtcblxuXHRcdC8vIHRoZXJlJ3Mgbm8gbmF0aXZlIHdheSB0byB0cmFjayB2YWx1ZSB1cGRhdGVzIG9mIHRyYW5zaXRpb25lZCBwcm9wZXJ0aWVzLCBzbyB3ZSBpbWl0YXRlIHRoaXNcblx0XHR0aGlzLl9zdGVwVGltZXIgPSBzZXRJbnRlcnZhbChMLmJpbmQodGhpcy5fb25TdGVwLCB0aGlzKSwgNTApO1xuXHR9LFxuXG5cdHN0b3A6IGZ1bmN0aW9uICgpIHtcblx0XHRpZiAoIXRoaXMuX2luUHJvZ3Jlc3MpIHsgcmV0dXJuOyB9XG5cblx0XHQvLyBpZiB3ZSBqdXN0IHJlbW92ZWQgdGhlIHRyYW5zaXRpb24gcHJvcGVydHksIHRoZSBlbGVtZW50IHdvdWxkIGp1bXAgdG8gaXRzIGZpbmFsIHBvc2l0aW9uLFxuXHRcdC8vIHNvIHdlIG5lZWQgdG8gbWFrZSBpdCBzdGF5IGF0IHRoZSBjdXJyZW50IHBvc2l0aW9uXG5cblx0XHRMLkRvbVV0aWwuc2V0UG9zaXRpb24odGhpcy5fZWwsIHRoaXMuX2dldFBvcygpKTtcblx0XHR0aGlzLl9vblRyYW5zaXRpb25FbmQoKTtcblx0XHRMLlV0aWwuZmFsc2VGbih0aGlzLl9lbC5vZmZzZXRXaWR0aCk7IC8vIGZvcmNlIHJlZmxvdyBpbiBjYXNlIHdlIGFyZSBhYm91dCB0byBzdGFydCBhIG5ldyBhbmltYXRpb25cblx0fSxcblxuXHRfb25TdGVwOiBmdW5jdGlvbiAoKSB7XG5cdFx0dmFyIHN0ZXBQb3MgPSB0aGlzLl9nZXRQb3MoKTtcblx0XHRpZiAoIXN0ZXBQb3MpIHtcblx0XHRcdHRoaXMuX29uVHJhbnNpdGlvbkVuZCgpO1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblx0XHQvLyBqc2hpbnQgY2FtZWxjYXNlOiBmYWxzZVxuXHRcdC8vIG1ha2UgTC5Eb21VdGlsLmdldFBvc2l0aW9uIHJldHVybiBpbnRlcm1lZGlhdGUgcG9zaXRpb24gdmFsdWUgZHVyaW5nIGFuaW1hdGlvblxuXHRcdHRoaXMuX2VsLl9sZWFmbGV0X3BvcyA9IHN0ZXBQb3M7XG5cblx0XHR0aGlzLmZpcmUoJ3N0ZXAnKTtcblx0fSxcblxuXHQvLyB5b3UgY2FuJ3QgZWFzaWx5IGdldCBpbnRlcm1lZGlhdGUgdmFsdWVzIG9mIHByb3BlcnRpZXMgYW5pbWF0ZWQgd2l0aCBDU1MzIFRyYW5zaXRpb25zLFxuXHQvLyB3ZSBuZWVkIHRvIHBhcnNlIGNvbXB1dGVkIHN0eWxlIChpbiBjYXNlIG9mIHRyYW5zZm9ybSBpdCByZXR1cm5zIG1hdHJpeCBzdHJpbmcpXG5cblx0X3RyYW5zZm9ybVJlOiAvKFstK10/KD86XFxkKlxcLik/XFxkKylcXEQqLCAoWy0rXT8oPzpcXGQqXFwuKT9cXGQrKVxcRCpcXCkvLFxuXG5cdF9nZXRQb3M6IGZ1bmN0aW9uICgpIHtcblx0XHR2YXIgbGVmdCwgdG9wLCBtYXRjaGVzLFxuXHRcdCAgICBlbCA9IHRoaXMuX2VsLFxuXHRcdCAgICBzdHlsZSA9IHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKGVsKTtcblxuXHRcdGlmIChMLkJyb3dzZXIuYW55M2QpIHtcblx0XHRcdG1hdGNoZXMgPSBzdHlsZVtMLkRvbVV0aWwuVFJBTlNGT1JNXS5tYXRjaCh0aGlzLl90cmFuc2Zvcm1SZSk7XG5cdFx0XHRpZiAoIW1hdGNoZXMpIHsgcmV0dXJuOyB9XG5cdFx0XHRsZWZ0ID0gcGFyc2VGbG9hdChtYXRjaGVzWzFdKTtcblx0XHRcdHRvcCAgPSBwYXJzZUZsb2F0KG1hdGNoZXNbMl0pO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRsZWZ0ID0gcGFyc2VGbG9hdChzdHlsZS5sZWZ0KTtcblx0XHRcdHRvcCAgPSBwYXJzZUZsb2F0KHN0eWxlLnRvcCk7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIG5ldyBMLlBvaW50KGxlZnQsIHRvcCwgdHJ1ZSk7XG5cdH0sXG5cblx0X29uVHJhbnNpdGlvbkVuZDogZnVuY3Rpb24gKCkge1xuXHRcdEwuRG9tRXZlbnQub2ZmKHRoaXMuX2VsLCBMLkRvbVV0aWwuVFJBTlNJVElPTl9FTkQsIHRoaXMuX29uVHJhbnNpdGlvbkVuZCwgdGhpcyk7XG5cblx0XHRpZiAoIXRoaXMuX2luUHJvZ3Jlc3MpIHsgcmV0dXJuOyB9XG5cdFx0dGhpcy5faW5Qcm9ncmVzcyA9IGZhbHNlO1xuXG5cdFx0dGhpcy5fZWwuc3R5bGVbTC5Eb21VdGlsLlRSQU5TSVRJT05dID0gJyc7XG5cblx0XHQvLyBqc2hpbnQgY2FtZWxjYXNlOiBmYWxzZVxuXHRcdC8vIG1ha2Ugc3VyZSBMLkRvbVV0aWwuZ2V0UG9zaXRpb24gcmV0dXJucyB0aGUgZmluYWwgcG9zaXRpb24gdmFsdWUgYWZ0ZXIgYW5pbWF0aW9uXG5cdFx0dGhpcy5fZWwuX2xlYWZsZXRfcG9zID0gdGhpcy5fbmV3UG9zO1xuXG5cdFx0Y2xlYXJJbnRlcnZhbCh0aGlzLl9zdGVwVGltZXIpO1xuXG5cdFx0dGhpcy5maXJlKCdzdGVwJykuZmlyZSgnZW5kJyk7XG5cdH1cblxufSk7XG5cblxuLypcbiAqIEV4dGVuZHMgTC5NYXAgdG8gaGFuZGxlIHBhbm5pbmcgYW5pbWF0aW9ucy5cbiAqL1xuXG5MLk1hcC5pbmNsdWRlKHtcblxuXHRzZXRWaWV3OiBmdW5jdGlvbiAoY2VudGVyLCB6b29tLCBvcHRpb25zKSB7XG5cblx0XHR6b29tID0gem9vbSA9PT0gdW5kZWZpbmVkID8gdGhpcy5fem9vbSA6IHRoaXMuX2xpbWl0Wm9vbSh6b29tKTtcblx0XHRjZW50ZXIgPSB0aGlzLl9saW1pdENlbnRlcihMLmxhdExuZyhjZW50ZXIpLCB6b29tLCB0aGlzLm9wdGlvbnMubWF4Qm91bmRzKTtcblx0XHRvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcblxuXHRcdGlmICh0aGlzLl9wYW5BbmltKSB7XG5cdFx0XHR0aGlzLl9wYW5BbmltLnN0b3AoKTtcblx0XHR9XG5cblx0XHRpZiAodGhpcy5fbG9hZGVkICYmICFvcHRpb25zLnJlc2V0ICYmIG9wdGlvbnMgIT09IHRydWUpIHtcblxuXHRcdFx0aWYgKG9wdGlvbnMuYW5pbWF0ZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRcdG9wdGlvbnMuem9vbSA9IEwuZXh0ZW5kKHthbmltYXRlOiBvcHRpb25zLmFuaW1hdGV9LCBvcHRpb25zLnpvb20pO1xuXHRcdFx0XHRvcHRpb25zLnBhbiA9IEwuZXh0ZW5kKHthbmltYXRlOiBvcHRpb25zLmFuaW1hdGV9LCBvcHRpb25zLnBhbik7XG5cdFx0XHR9XG5cblx0XHRcdC8vIHRyeSBhbmltYXRpbmcgcGFuIG9yIHpvb21cblx0XHRcdHZhciBhbmltYXRlZCA9ICh0aGlzLl96b29tICE9PSB6b29tKSA/XG5cdFx0XHRcdHRoaXMuX3RyeUFuaW1hdGVkWm9vbSAmJiB0aGlzLl90cnlBbmltYXRlZFpvb20oY2VudGVyLCB6b29tLCBvcHRpb25zLnpvb20pIDpcblx0XHRcdFx0dGhpcy5fdHJ5QW5pbWF0ZWRQYW4oY2VudGVyLCBvcHRpb25zLnBhbik7XG5cblx0XHRcdGlmIChhbmltYXRlZCkge1xuXHRcdFx0XHQvLyBwcmV2ZW50IHJlc2l6ZSBoYW5kbGVyIGNhbGwsIHRoZSB2aWV3IHdpbGwgcmVmcmVzaCBhZnRlciBhbmltYXRpb24gYW55d2F5XG5cdFx0XHRcdGNsZWFyVGltZW91dCh0aGlzLl9zaXplVGltZXIpO1xuXHRcdFx0XHRyZXR1cm4gdGhpcztcblx0XHRcdH1cblx0XHR9XG5cblx0XHQvLyBhbmltYXRpb24gZGlkbid0IHN0YXJ0LCBqdXN0IHJlc2V0IHRoZSBtYXAgdmlld1xuXHRcdHRoaXMuX3Jlc2V0VmlldyhjZW50ZXIsIHpvb20pO1xuXG5cdFx0cmV0dXJuIHRoaXM7XG5cdH0sXG5cblx0cGFuQnk6IGZ1bmN0aW9uIChvZmZzZXQsIG9wdGlvbnMpIHtcblx0XHRvZmZzZXQgPSBMLnBvaW50KG9mZnNldCkucm91bmQoKTtcblx0XHRvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcblxuXHRcdGlmICghb2Zmc2V0LnggJiYgIW9mZnNldC55KSB7XG5cdFx0XHRyZXR1cm4gdGhpcztcblx0XHR9XG5cblx0XHRpZiAoIXRoaXMuX3BhbkFuaW0pIHtcblx0XHRcdHRoaXMuX3BhbkFuaW0gPSBuZXcgTC5Qb3NBbmltYXRpb24oKTtcblxuXHRcdFx0dGhpcy5fcGFuQW5pbS5vbih7XG5cdFx0XHRcdCdzdGVwJzogdGhpcy5fb25QYW5UcmFuc2l0aW9uU3RlcCxcblx0XHRcdFx0J2VuZCc6IHRoaXMuX29uUGFuVHJhbnNpdGlvbkVuZFxuXHRcdFx0fSwgdGhpcyk7XG5cdFx0fVxuXG5cdFx0Ly8gZG9uJ3QgZmlyZSBtb3Zlc3RhcnQgaWYgYW5pbWF0aW5nIGluZXJ0aWFcblx0XHRpZiAoIW9wdGlvbnMubm9Nb3ZlU3RhcnQpIHtcblx0XHRcdHRoaXMuZmlyZSgnbW92ZXN0YXJ0Jyk7XG5cdFx0fVxuXG5cdFx0Ly8gYW5pbWF0ZSBwYW4gdW5sZXNzIGFuaW1hdGU6IGZhbHNlIHNwZWNpZmllZFxuXHRcdGlmIChvcHRpb25zLmFuaW1hdGUgIT09IGZhbHNlKSB7XG5cdFx0XHRMLkRvbVV0aWwuYWRkQ2xhc3ModGhpcy5fbWFwUGFuZSwgJ2xlYWZsZXQtcGFuLWFuaW0nKTtcblxuXHRcdFx0dmFyIG5ld1BvcyA9IHRoaXMuX2dldE1hcFBhbmVQb3MoKS5zdWJ0cmFjdChvZmZzZXQpO1xuXHRcdFx0dGhpcy5fcGFuQW5pbS5ydW4odGhpcy5fbWFwUGFuZSwgbmV3UG9zLCBvcHRpb25zLmR1cmF0aW9uIHx8IDAuMjUsIG9wdGlvbnMuZWFzZUxpbmVhcml0eSk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHRoaXMuX3Jhd1BhbkJ5KG9mZnNldCk7XG5cdFx0XHR0aGlzLmZpcmUoJ21vdmUnKS5maXJlKCdtb3ZlZW5kJyk7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHRoaXM7XG5cdH0sXG5cblx0X29uUGFuVHJhbnNpdGlvblN0ZXA6IGZ1bmN0aW9uICgpIHtcblx0XHR0aGlzLmZpcmUoJ21vdmUnKTtcblx0fSxcblxuXHRfb25QYW5UcmFuc2l0aW9uRW5kOiBmdW5jdGlvbiAoKSB7XG5cdFx0TC5Eb21VdGlsLnJlbW92ZUNsYXNzKHRoaXMuX21hcFBhbmUsICdsZWFmbGV0LXBhbi1hbmltJyk7XG5cdFx0dGhpcy5maXJlKCdtb3ZlZW5kJyk7XG5cdH0sXG5cblx0X3RyeUFuaW1hdGVkUGFuOiBmdW5jdGlvbiAoY2VudGVyLCBvcHRpb25zKSB7XG5cdFx0Ly8gZGlmZmVyZW5jZSBiZXR3ZWVuIHRoZSBuZXcgYW5kIGN1cnJlbnQgY2VudGVycyBpbiBwaXhlbHNcblx0XHR2YXIgb2Zmc2V0ID0gdGhpcy5fZ2V0Q2VudGVyT2Zmc2V0KGNlbnRlcikuX2Zsb29yKCk7XG5cblx0XHQvLyBkb24ndCBhbmltYXRlIHRvbyBmYXIgdW5sZXNzIGFuaW1hdGU6IHRydWUgc3BlY2lmaWVkIGluIG9wdGlvbnNcblx0XHRpZiAoKG9wdGlvbnMgJiYgb3B0aW9ucy5hbmltYXRlKSAhPT0gdHJ1ZSAmJiAhdGhpcy5nZXRTaXplKCkuY29udGFpbnMob2Zmc2V0KSkgeyByZXR1cm4gZmFsc2U7IH1cblxuXHRcdHRoaXMucGFuQnkob2Zmc2V0LCBvcHRpb25zKTtcblxuXHRcdHJldHVybiB0cnVlO1xuXHR9XG59KTtcblxuXG4vKlxuICogTC5Qb3NBbmltYXRpb24gZmFsbGJhY2sgaW1wbGVtZW50YXRpb24gdGhhdCBwb3dlcnMgTGVhZmxldCBwYW4gYW5pbWF0aW9uc1xuICogaW4gYnJvd3NlcnMgdGhhdCBkb24ndCBzdXBwb3J0IENTUzMgVHJhbnNpdGlvbnMuXG4gKi9cblxuTC5Qb3NBbmltYXRpb24gPSBMLkRvbVV0aWwuVFJBTlNJVElPTiA/IEwuUG9zQW5pbWF0aW9uIDogTC5Qb3NBbmltYXRpb24uZXh0ZW5kKHtcblxuXHRydW46IGZ1bmN0aW9uIChlbCwgbmV3UG9zLCBkdXJhdGlvbiwgZWFzZUxpbmVhcml0eSkgeyAvLyAoSFRNTEVsZW1lbnQsIFBvaW50WywgTnVtYmVyLCBOdW1iZXJdKVxuXHRcdHRoaXMuc3RvcCgpO1xuXG5cdFx0dGhpcy5fZWwgPSBlbDtcblx0XHR0aGlzLl9pblByb2dyZXNzID0gdHJ1ZTtcblx0XHR0aGlzLl9kdXJhdGlvbiA9IGR1cmF0aW9uIHx8IDAuMjU7XG5cdFx0dGhpcy5fZWFzZU91dFBvd2VyID0gMSAvIE1hdGgubWF4KGVhc2VMaW5lYXJpdHkgfHwgMC41LCAwLjIpO1xuXG5cdFx0dGhpcy5fc3RhcnRQb3MgPSBMLkRvbVV0aWwuZ2V0UG9zaXRpb24oZWwpO1xuXHRcdHRoaXMuX29mZnNldCA9IG5ld1Bvcy5zdWJ0cmFjdCh0aGlzLl9zdGFydFBvcyk7XG5cdFx0dGhpcy5fc3RhcnRUaW1lID0gK25ldyBEYXRlKCk7XG5cblx0XHR0aGlzLmZpcmUoJ3N0YXJ0Jyk7XG5cblx0XHR0aGlzLl9hbmltYXRlKCk7XG5cdH0sXG5cblx0c3RvcDogZnVuY3Rpb24gKCkge1xuXHRcdGlmICghdGhpcy5faW5Qcm9ncmVzcykgeyByZXR1cm47IH1cblxuXHRcdHRoaXMuX3N0ZXAoKTtcblx0XHR0aGlzLl9jb21wbGV0ZSgpO1xuXHR9LFxuXG5cdF9hbmltYXRlOiBmdW5jdGlvbiAoKSB7XG5cdFx0Ly8gYW5pbWF0aW9uIGxvb3Bcblx0XHR0aGlzLl9hbmltSWQgPSBMLlV0aWwucmVxdWVzdEFuaW1GcmFtZSh0aGlzLl9hbmltYXRlLCB0aGlzKTtcblx0XHR0aGlzLl9zdGVwKCk7XG5cdH0sXG5cblx0X3N0ZXA6IGZ1bmN0aW9uICgpIHtcblx0XHR2YXIgZWxhcHNlZCA9ICgrbmV3IERhdGUoKSkgLSB0aGlzLl9zdGFydFRpbWUsXG5cdFx0ICAgIGR1cmF0aW9uID0gdGhpcy5fZHVyYXRpb24gKiAxMDAwO1xuXG5cdFx0aWYgKGVsYXBzZWQgPCBkdXJhdGlvbikge1xuXHRcdFx0dGhpcy5fcnVuRnJhbWUodGhpcy5fZWFzZU91dChlbGFwc2VkIC8gZHVyYXRpb24pKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0dGhpcy5fcnVuRnJhbWUoMSk7XG5cdFx0XHR0aGlzLl9jb21wbGV0ZSgpO1xuXHRcdH1cblx0fSxcblxuXHRfcnVuRnJhbWU6IGZ1bmN0aW9uIChwcm9ncmVzcykge1xuXHRcdHZhciBwb3MgPSB0aGlzLl9zdGFydFBvcy5hZGQodGhpcy5fb2Zmc2V0Lm11bHRpcGx5QnkocHJvZ3Jlc3MpKTtcblx0XHRMLkRvbVV0aWwuc2V0UG9zaXRpb24odGhpcy5fZWwsIHBvcyk7XG5cblx0XHR0aGlzLmZpcmUoJ3N0ZXAnKTtcblx0fSxcblxuXHRfY29tcGxldGU6IGZ1bmN0aW9uICgpIHtcblx0XHRMLlV0aWwuY2FuY2VsQW5pbUZyYW1lKHRoaXMuX2FuaW1JZCk7XG5cblx0XHR0aGlzLl9pblByb2dyZXNzID0gZmFsc2U7XG5cdFx0dGhpcy5maXJlKCdlbmQnKTtcblx0fSxcblxuXHRfZWFzZU91dDogZnVuY3Rpb24gKHQpIHtcblx0XHRyZXR1cm4gMSAtIE1hdGgucG93KDEgLSB0LCB0aGlzLl9lYXNlT3V0UG93ZXIpO1xuXHR9XG59KTtcblxuXG4vKlxuICogRXh0ZW5kcyBMLk1hcCB0byBoYW5kbGUgem9vbSBhbmltYXRpb25zLlxuICovXG5cbkwuTWFwLm1lcmdlT3B0aW9ucyh7XG5cdHpvb21BbmltYXRpb246IHRydWUsXG5cdHpvb21BbmltYXRpb25UaHJlc2hvbGQ6IDRcbn0pO1xuXG5pZiAoTC5Eb21VdGlsLlRSQU5TSVRJT04pIHtcblxuXHRMLk1hcC5hZGRJbml0SG9vayhmdW5jdGlvbiAoKSB7XG5cdFx0Ly8gZG9uJ3QgYW5pbWF0ZSBvbiBicm93c2VycyB3aXRob3V0IGhhcmR3YXJlLWFjY2VsZXJhdGVkIHRyYW5zaXRpb25zIG9yIG9sZCBBbmRyb2lkL09wZXJhXG5cdFx0dGhpcy5fem9vbUFuaW1hdGVkID0gdGhpcy5vcHRpb25zLnpvb21BbmltYXRpb24gJiYgTC5Eb21VdGlsLlRSQU5TSVRJT04gJiZcblx0XHRcdFx0TC5Ccm93c2VyLmFueTNkICYmICFMLkJyb3dzZXIuYW5kcm9pZDIzICYmICFMLkJyb3dzZXIubW9iaWxlT3BlcmE7XG5cblx0XHQvLyB6b29tIHRyYW5zaXRpb25zIHJ1biB3aXRoIHRoZSBzYW1lIGR1cmF0aW9uIGZvciBhbGwgbGF5ZXJzLCBzbyBpZiBvbmUgb2YgdHJhbnNpdGlvbmVuZCBldmVudHNcblx0XHQvLyBoYXBwZW5zIGFmdGVyIHN0YXJ0aW5nIHpvb20gYW5pbWF0aW9uIChwcm9wYWdhdGluZyB0byB0aGUgbWFwIHBhbmUpLCB3ZSBrbm93IHRoYXQgaXQgZW5kZWQgZ2xvYmFsbHlcblx0XHRpZiAodGhpcy5fem9vbUFuaW1hdGVkKSB7XG5cdFx0XHRMLkRvbUV2ZW50Lm9uKHRoaXMuX21hcFBhbmUsIEwuRG9tVXRpbC5UUkFOU0lUSU9OX0VORCwgdGhpcy5fY2F0Y2hUcmFuc2l0aW9uRW5kLCB0aGlzKTtcblx0XHR9XG5cdH0pO1xufVxuXG5MLk1hcC5pbmNsdWRlKCFMLkRvbVV0aWwuVFJBTlNJVElPTiA/IHt9IDoge1xuXG5cdF9jYXRjaFRyYW5zaXRpb25FbmQ6IGZ1bmN0aW9uIChlKSB7XG5cdFx0aWYgKHRoaXMuX2FuaW1hdGluZ1pvb20gJiYgZS5wcm9wZXJ0eU5hbWUuaW5kZXhPZigndHJhbnNmb3JtJykgPj0gMCkge1xuXHRcdFx0dGhpcy5fb25ab29tVHJhbnNpdGlvbkVuZCgpO1xuXHRcdH1cblx0fSxcblxuXHRfbm90aGluZ1RvQW5pbWF0ZTogZnVuY3Rpb24gKCkge1xuXHRcdHJldHVybiAhdGhpcy5fY29udGFpbmVyLmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ2xlYWZsZXQtem9vbS1hbmltYXRlZCcpLmxlbmd0aDtcblx0fSxcblxuXHRfdHJ5QW5pbWF0ZWRab29tOiBmdW5jdGlvbiAoY2VudGVyLCB6b29tLCBvcHRpb25zKSB7XG5cblx0XHRpZiAodGhpcy5fYW5pbWF0aW5nWm9vbSkgeyByZXR1cm4gdHJ1ZTsgfVxuXG5cdFx0b3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG5cblx0XHQvLyBkb24ndCBhbmltYXRlIGlmIGRpc2FibGVkLCBub3Qgc3VwcG9ydGVkIG9yIHpvb20gZGlmZmVyZW5jZSBpcyB0b28gbGFyZ2Vcblx0XHRpZiAoIXRoaXMuX3pvb21BbmltYXRlZCB8fCBvcHRpb25zLmFuaW1hdGUgPT09IGZhbHNlIHx8IHRoaXMuX25vdGhpbmdUb0FuaW1hdGUoKSB8fFxuXHRcdCAgICAgICAgTWF0aC5hYnMoem9vbSAtIHRoaXMuX3pvb20pID4gdGhpcy5vcHRpb25zLnpvb21BbmltYXRpb25UaHJlc2hvbGQpIHsgcmV0dXJuIGZhbHNlOyB9XG5cblx0XHQvLyBvZmZzZXQgaXMgdGhlIHBpeGVsIGNvb3JkcyBvZiB0aGUgem9vbSBvcmlnaW4gcmVsYXRpdmUgdG8gdGhlIGN1cnJlbnQgY2VudGVyXG5cdFx0dmFyIHNjYWxlID0gdGhpcy5nZXRab29tU2NhbGUoem9vbSksXG5cdFx0ICAgIG9mZnNldCA9IHRoaXMuX2dldENlbnRlck9mZnNldChjZW50ZXIpLl9kaXZpZGVCeSgxIC0gMSAvIHNjYWxlKSxcblx0XHRcdG9yaWdpbiA9IHRoaXMuX2dldENlbnRlckxheWVyUG9pbnQoKS5fYWRkKG9mZnNldCk7XG5cblx0XHQvLyBkb24ndCBhbmltYXRlIGlmIHRoZSB6b29tIG9yaWdpbiBpc24ndCB3aXRoaW4gb25lIHNjcmVlbiBmcm9tIHRoZSBjdXJyZW50IGNlbnRlciwgdW5sZXNzIGZvcmNlZFxuXHRcdGlmIChvcHRpb25zLmFuaW1hdGUgIT09IHRydWUgJiYgIXRoaXMuZ2V0U2l6ZSgpLmNvbnRhaW5zKG9mZnNldCkpIHsgcmV0dXJuIGZhbHNlOyB9XG5cblx0XHR0aGlzXG5cdFx0ICAgIC5maXJlKCdtb3Zlc3RhcnQnKVxuXHRcdCAgICAuZmlyZSgnem9vbXN0YXJ0Jyk7XG5cblx0XHR0aGlzLl9hbmltYXRlWm9vbShjZW50ZXIsIHpvb20sIG9yaWdpbiwgc2NhbGUsIG51bGwsIHRydWUpO1xuXG5cdFx0cmV0dXJuIHRydWU7XG5cdH0sXG5cblx0X2FuaW1hdGVab29tOiBmdW5jdGlvbiAoY2VudGVyLCB6b29tLCBvcmlnaW4sIHNjYWxlLCBkZWx0YSwgYmFja3dhcmRzLCBmb3JUb3VjaFpvb20pIHtcblxuXHRcdGlmICghZm9yVG91Y2hab29tKSB7XG5cdFx0XHR0aGlzLl9hbmltYXRpbmdab29tID0gdHJ1ZTtcblx0XHR9XG5cblx0XHQvLyBwdXQgdHJhbnNmb3JtIHRyYW5zaXRpb24gb24gYWxsIGxheWVycyB3aXRoIGxlYWZsZXQtem9vbS1hbmltYXRlZCBjbGFzc1xuXHRcdEwuRG9tVXRpbC5hZGRDbGFzcyh0aGlzLl9tYXBQYW5lLCAnbGVhZmxldC16b29tLWFuaW0nKTtcblxuXHRcdC8vIHJlbWVtYmVyIHdoYXQgY2VudGVyL3pvb20gdG8gc2V0IGFmdGVyIGFuaW1hdGlvblxuXHRcdHRoaXMuX2FuaW1hdGVUb0NlbnRlciA9IGNlbnRlcjtcblx0XHR0aGlzLl9hbmltYXRlVG9ab29tID0gem9vbTtcblxuXHRcdC8vIGRpc2FibGUgYW55IGRyYWdnaW5nIGR1cmluZyBhbmltYXRpb25cblx0XHRpZiAoTC5EcmFnZ2FibGUpIHtcblx0XHRcdEwuRHJhZ2dhYmxlLl9kaXNhYmxlZCA9IHRydWU7XG5cdFx0fVxuXG5cdFx0TC5VdGlsLnJlcXVlc3RBbmltRnJhbWUoZnVuY3Rpb24gKCkge1xuXHRcdFx0dGhpcy5maXJlKCd6b29tYW5pbScsIHtcblx0XHRcdFx0Y2VudGVyOiBjZW50ZXIsXG5cdFx0XHRcdHpvb206IHpvb20sXG5cdFx0XHRcdG9yaWdpbjogb3JpZ2luLFxuXHRcdFx0XHRzY2FsZTogc2NhbGUsXG5cdFx0XHRcdGRlbHRhOiBkZWx0YSxcblx0XHRcdFx0YmFja3dhcmRzOiBiYWNrd2FyZHNcblx0XHRcdH0pO1xuXHRcdH0sIHRoaXMpO1xuXHR9LFxuXG5cdF9vblpvb21UcmFuc2l0aW9uRW5kOiBmdW5jdGlvbiAoKSB7XG5cblx0XHR0aGlzLl9hbmltYXRpbmdab29tID0gZmFsc2U7XG5cblx0XHRMLkRvbVV0aWwucmVtb3ZlQ2xhc3ModGhpcy5fbWFwUGFuZSwgJ2xlYWZsZXQtem9vbS1hbmltJyk7XG5cblx0XHR0aGlzLl9yZXNldFZpZXcodGhpcy5fYW5pbWF0ZVRvQ2VudGVyLCB0aGlzLl9hbmltYXRlVG9ab29tLCB0cnVlLCB0cnVlKTtcblxuXHRcdGlmIChMLkRyYWdnYWJsZSkge1xuXHRcdFx0TC5EcmFnZ2FibGUuX2Rpc2FibGVkID0gZmFsc2U7XG5cdFx0fVxuXHR9XG59KTtcblxuXG4vKlxuXHRab29tIGFuaW1hdGlvbiBsb2dpYyBmb3IgTC5UaWxlTGF5ZXIuXG4qL1xuXG5MLlRpbGVMYXllci5pbmNsdWRlKHtcblx0X2FuaW1hdGVab29tOiBmdW5jdGlvbiAoZSkge1xuXHRcdGlmICghdGhpcy5fYW5pbWF0aW5nKSB7XG5cdFx0XHR0aGlzLl9hbmltYXRpbmcgPSB0cnVlO1xuXHRcdFx0dGhpcy5fcHJlcGFyZUJnQnVmZmVyKCk7XG5cdFx0fVxuXG5cdFx0dmFyIGJnID0gdGhpcy5fYmdCdWZmZXIsXG5cdFx0ICAgIHRyYW5zZm9ybSA9IEwuRG9tVXRpbC5UUkFOU0ZPUk0sXG5cdFx0ICAgIGluaXRpYWxUcmFuc2Zvcm0gPSBlLmRlbHRhID8gTC5Eb21VdGlsLmdldFRyYW5zbGF0ZVN0cmluZyhlLmRlbHRhKSA6IGJnLnN0eWxlW3RyYW5zZm9ybV0sXG5cdFx0ICAgIHNjYWxlU3RyID0gTC5Eb21VdGlsLmdldFNjYWxlU3RyaW5nKGUuc2NhbGUsIGUub3JpZ2luKTtcblxuXHRcdGJnLnN0eWxlW3RyYW5zZm9ybV0gPSBlLmJhY2t3YXJkcyA/XG5cdFx0XHRcdHNjYWxlU3RyICsgJyAnICsgaW5pdGlhbFRyYW5zZm9ybSA6XG5cdFx0XHRcdGluaXRpYWxUcmFuc2Zvcm0gKyAnICcgKyBzY2FsZVN0cjtcblx0fSxcblxuXHRfZW5kWm9vbUFuaW06IGZ1bmN0aW9uICgpIHtcblx0XHR2YXIgZnJvbnQgPSB0aGlzLl90aWxlQ29udGFpbmVyLFxuXHRcdCAgICBiZyA9IHRoaXMuX2JnQnVmZmVyO1xuXG5cdFx0ZnJvbnQuc3R5bGUudmlzaWJpbGl0eSA9ICcnO1xuXHRcdGZyb250LnBhcmVudE5vZGUuYXBwZW5kQ2hpbGQoZnJvbnQpOyAvLyBCcmluZyB0byBmb3JlXG5cblx0XHQvLyBmb3JjZSByZWZsb3dcblx0XHRMLlV0aWwuZmFsc2VGbihiZy5vZmZzZXRXaWR0aCk7XG5cblx0XHR0aGlzLl9hbmltYXRpbmcgPSBmYWxzZTtcblx0fSxcblxuXHRfY2xlYXJCZ0J1ZmZlcjogZnVuY3Rpb24gKCkge1xuXHRcdHZhciBtYXAgPSB0aGlzLl9tYXA7XG5cblx0XHRpZiAobWFwICYmICFtYXAuX2FuaW1hdGluZ1pvb20gJiYgIW1hcC50b3VjaFpvb20uX3pvb21pbmcpIHtcblx0XHRcdHRoaXMuX2JnQnVmZmVyLmlubmVySFRNTCA9ICcnO1xuXHRcdFx0dGhpcy5fYmdCdWZmZXIuc3R5bGVbTC5Eb21VdGlsLlRSQU5TRk9STV0gPSAnJztcblx0XHR9XG5cdH0sXG5cblx0X3ByZXBhcmVCZ0J1ZmZlcjogZnVuY3Rpb24gKCkge1xuXG5cdFx0dmFyIGZyb250ID0gdGhpcy5fdGlsZUNvbnRhaW5lcixcblx0XHQgICAgYmcgPSB0aGlzLl9iZ0J1ZmZlcjtcblxuXHRcdC8vIGlmIGZvcmVncm91bmQgbGF5ZXIgZG9lc24ndCBoYXZlIG1hbnkgdGlsZXMgYnV0IGJnIGxheWVyIGRvZXMsXG5cdFx0Ly8ga2VlcCB0aGUgZXhpc3RpbmcgYmcgbGF5ZXIgYW5kIGp1c3Qgem9vbSBpdCBzb21lIG1vcmVcblxuXHRcdHZhciBiZ0xvYWRlZCA9IHRoaXMuX2dldExvYWRlZFRpbGVzUGVyY2VudGFnZShiZyksXG5cdFx0ICAgIGZyb250TG9hZGVkID0gdGhpcy5fZ2V0TG9hZGVkVGlsZXNQZXJjZW50YWdlKGZyb250KTtcblxuXHRcdGlmIChiZyAmJiBiZ0xvYWRlZCA+IDAuNSAmJiBmcm9udExvYWRlZCA8IDAuNSkge1xuXG5cdFx0XHRmcm9udC5zdHlsZS52aXNpYmlsaXR5ID0gJ2hpZGRlbic7XG5cdFx0XHR0aGlzLl9zdG9wTG9hZGluZ0ltYWdlcyhmcm9udCk7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0Ly8gcHJlcGFyZSB0aGUgYnVmZmVyIHRvIGJlY29tZSB0aGUgZnJvbnQgdGlsZSBwYW5lXG5cdFx0Ymcuc3R5bGUudmlzaWJpbGl0eSA9ICdoaWRkZW4nO1xuXHRcdGJnLnN0eWxlW0wuRG9tVXRpbC5UUkFOU0ZPUk1dID0gJyc7XG5cblx0XHQvLyBzd2l0Y2ggb3V0IHRoZSBjdXJyZW50IGxheWVyIHRvIGJlIHRoZSBuZXcgYmcgbGF5ZXIgKGFuZCB2aWNlLXZlcnNhKVxuXHRcdHRoaXMuX3RpbGVDb250YWluZXIgPSBiZztcblx0XHRiZyA9IHRoaXMuX2JnQnVmZmVyID0gZnJvbnQ7XG5cblx0XHR0aGlzLl9zdG9wTG9hZGluZ0ltYWdlcyhiZyk7XG5cblx0XHQvL3ByZXZlbnQgYmcgYnVmZmVyIGZyb20gY2xlYXJpbmcgcmlnaHQgYWZ0ZXIgem9vbVxuXHRcdGNsZWFyVGltZW91dCh0aGlzLl9jbGVhckJnQnVmZmVyVGltZXIpO1xuXHR9LFxuXG5cdF9nZXRMb2FkZWRUaWxlc1BlcmNlbnRhZ2U6IGZ1bmN0aW9uIChjb250YWluZXIpIHtcblx0XHR2YXIgdGlsZXMgPSBjb250YWluZXIuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2ltZycpLFxuXHRcdCAgICBpLCBsZW4sIGNvdW50ID0gMDtcblxuXHRcdGZvciAoaSA9IDAsIGxlbiA9IHRpbGVzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG5cdFx0XHRpZiAodGlsZXNbaV0uY29tcGxldGUpIHtcblx0XHRcdFx0Y291bnQrKztcblx0XHRcdH1cblx0XHR9XG5cdFx0cmV0dXJuIGNvdW50IC8gbGVuO1xuXHR9LFxuXG5cdC8vIHN0b3BzIGxvYWRpbmcgYWxsIHRpbGVzIGluIHRoZSBiYWNrZ3JvdW5kIGxheWVyXG5cdF9zdG9wTG9hZGluZ0ltYWdlczogZnVuY3Rpb24gKGNvbnRhaW5lcikge1xuXHRcdHZhciB0aWxlcyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGNvbnRhaW5lci5nZXRFbGVtZW50c0J5VGFnTmFtZSgnaW1nJykpLFxuXHRcdCAgICBpLCBsZW4sIHRpbGU7XG5cblx0XHRmb3IgKGkgPSAwLCBsZW4gPSB0aWxlcy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuXHRcdFx0dGlsZSA9IHRpbGVzW2ldO1xuXG5cdFx0XHRpZiAoIXRpbGUuY29tcGxldGUpIHtcblx0XHRcdFx0dGlsZS5vbmxvYWQgPSBMLlV0aWwuZmFsc2VGbjtcblx0XHRcdFx0dGlsZS5vbmVycm9yID0gTC5VdGlsLmZhbHNlRm47XG5cdFx0XHRcdHRpbGUuc3JjID0gTC5VdGlsLmVtcHR5SW1hZ2VVcmw7XG5cblx0XHRcdFx0dGlsZS5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKHRpbGUpO1xuXHRcdFx0fVxuXHRcdH1cblx0fVxufSk7XG5cblxuLypcclxuICogUHJvdmlkZXMgTC5NYXAgd2l0aCBjb252ZW5pZW50IHNob3J0Y3V0cyBmb3IgdXNpbmcgYnJvd3NlciBnZW9sb2NhdGlvbiBmZWF0dXJlcy5cclxuICovXHJcblxyXG5MLk1hcC5pbmNsdWRlKHtcclxuXHRfZGVmYXVsdExvY2F0ZU9wdGlvbnM6IHtcclxuXHRcdHdhdGNoOiBmYWxzZSxcclxuXHRcdHNldFZpZXc6IGZhbHNlLFxyXG5cdFx0bWF4Wm9vbTogSW5maW5pdHksXHJcblx0XHR0aW1lb3V0OiAxMDAwMCxcclxuXHRcdG1heGltdW1BZ2U6IDAsXHJcblx0XHRlbmFibGVIaWdoQWNjdXJhY3k6IGZhbHNlXHJcblx0fSxcclxuXHJcblx0bG9jYXRlOiBmdW5jdGlvbiAoLypPYmplY3QqLyBvcHRpb25zKSB7XHJcblxyXG5cdFx0b3B0aW9ucyA9IHRoaXMuX2xvY2F0ZU9wdGlvbnMgPSBMLmV4dGVuZCh0aGlzLl9kZWZhdWx0TG9jYXRlT3B0aW9ucywgb3B0aW9ucyk7XHJcblxyXG5cdFx0aWYgKCFuYXZpZ2F0b3IuZ2VvbG9jYXRpb24pIHtcclxuXHRcdFx0dGhpcy5faGFuZGxlR2VvbG9jYXRpb25FcnJvcih7XHJcblx0XHRcdFx0Y29kZTogMCxcclxuXHRcdFx0XHRtZXNzYWdlOiAnR2VvbG9jYXRpb24gbm90IHN1cHBvcnRlZC4nXHJcblx0XHRcdH0pO1xyXG5cdFx0XHRyZXR1cm4gdGhpcztcclxuXHRcdH1cclxuXHJcblx0XHR2YXIgb25SZXNwb25zZSA9IEwuYmluZCh0aGlzLl9oYW5kbGVHZW9sb2NhdGlvblJlc3BvbnNlLCB0aGlzKSxcclxuXHRcdFx0b25FcnJvciA9IEwuYmluZCh0aGlzLl9oYW5kbGVHZW9sb2NhdGlvbkVycm9yLCB0aGlzKTtcclxuXHJcblx0XHRpZiAob3B0aW9ucy53YXRjaCkge1xyXG5cdFx0XHR0aGlzLl9sb2NhdGlvbldhdGNoSWQgPVxyXG5cdFx0XHQgICAgICAgIG5hdmlnYXRvci5nZW9sb2NhdGlvbi53YXRjaFBvc2l0aW9uKG9uUmVzcG9uc2UsIG9uRXJyb3IsIG9wdGlvbnMpO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0bmF2aWdhdG9yLmdlb2xvY2F0aW9uLmdldEN1cnJlbnRQb3NpdGlvbihvblJlc3BvbnNlLCBvbkVycm9yLCBvcHRpb25zKTtcclxuXHRcdH1cclxuXHRcdHJldHVybiB0aGlzO1xyXG5cdH0sXHJcblxyXG5cdHN0b3BMb2NhdGU6IGZ1bmN0aW9uICgpIHtcclxuXHRcdGlmIChuYXZpZ2F0b3IuZ2VvbG9jYXRpb24pIHtcclxuXHRcdFx0bmF2aWdhdG9yLmdlb2xvY2F0aW9uLmNsZWFyV2F0Y2godGhpcy5fbG9jYXRpb25XYXRjaElkKTtcclxuXHRcdH1cclxuXHRcdGlmICh0aGlzLl9sb2NhdGVPcHRpb25zKSB7XHJcblx0XHRcdHRoaXMuX2xvY2F0ZU9wdGlvbnMuc2V0VmlldyA9IGZhbHNlO1xyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIHRoaXM7XHJcblx0fSxcclxuXHJcblx0X2hhbmRsZUdlb2xvY2F0aW9uRXJyb3I6IGZ1bmN0aW9uIChlcnJvcikge1xyXG5cdFx0dmFyIGMgPSBlcnJvci5jb2RlLFxyXG5cdFx0ICAgIG1lc3NhZ2UgPSBlcnJvci5tZXNzYWdlIHx8XHJcblx0XHQgICAgICAgICAgICAoYyA9PT0gMSA/ICdwZXJtaXNzaW9uIGRlbmllZCcgOlxyXG5cdFx0ICAgICAgICAgICAgKGMgPT09IDIgPyAncG9zaXRpb24gdW5hdmFpbGFibGUnIDogJ3RpbWVvdXQnKSk7XHJcblxyXG5cdFx0aWYgKHRoaXMuX2xvY2F0ZU9wdGlvbnMuc2V0VmlldyAmJiAhdGhpcy5fbG9hZGVkKSB7XHJcblx0XHRcdHRoaXMuZml0V29ybGQoKTtcclxuXHRcdH1cclxuXHJcblx0XHR0aGlzLmZpcmUoJ2xvY2F0aW9uZXJyb3InLCB7XHJcblx0XHRcdGNvZGU6IGMsXHJcblx0XHRcdG1lc3NhZ2U6ICdHZW9sb2NhdGlvbiBlcnJvcjogJyArIG1lc3NhZ2UgKyAnLidcclxuXHRcdH0pO1xyXG5cdH0sXHJcblxyXG5cdF9oYW5kbGVHZW9sb2NhdGlvblJlc3BvbnNlOiBmdW5jdGlvbiAocG9zKSB7XHJcblx0XHR2YXIgbGF0ID0gcG9zLmNvb3Jkcy5sYXRpdHVkZSxcclxuXHRcdCAgICBsbmcgPSBwb3MuY29vcmRzLmxvbmdpdHVkZSxcclxuXHRcdCAgICBsYXRsbmcgPSBuZXcgTC5MYXRMbmcobGF0LCBsbmcpLFxyXG5cclxuXHRcdCAgICBsYXRBY2N1cmFjeSA9IDE4MCAqIHBvcy5jb29yZHMuYWNjdXJhY3kgLyA0MDA3NTAxNyxcclxuXHRcdCAgICBsbmdBY2N1cmFjeSA9IGxhdEFjY3VyYWN5IC8gTWF0aC5jb3MoTC5MYXRMbmcuREVHX1RPX1JBRCAqIGxhdCksXHJcblxyXG5cdFx0ICAgIGJvdW5kcyA9IEwubGF0TG5nQm91bmRzKFxyXG5cdFx0ICAgICAgICAgICAgW2xhdCAtIGxhdEFjY3VyYWN5LCBsbmcgLSBsbmdBY2N1cmFjeV0sXHJcblx0XHQgICAgICAgICAgICBbbGF0ICsgbGF0QWNjdXJhY3ksIGxuZyArIGxuZ0FjY3VyYWN5XSksXHJcblxyXG5cdFx0ICAgIG9wdGlvbnMgPSB0aGlzLl9sb2NhdGVPcHRpb25zO1xyXG5cclxuXHRcdGlmIChvcHRpb25zLnNldFZpZXcpIHtcclxuXHRcdFx0dmFyIHpvb20gPSBNYXRoLm1pbih0aGlzLmdldEJvdW5kc1pvb20oYm91bmRzKSwgb3B0aW9ucy5tYXhab29tKTtcclxuXHRcdFx0dGhpcy5zZXRWaWV3KGxhdGxuZywgem9vbSk7XHJcblx0XHR9XHJcblxyXG5cdFx0dmFyIGRhdGEgPSB7XHJcblx0XHRcdGxhdGxuZzogbGF0bG5nLFxyXG5cdFx0XHRib3VuZHM6IGJvdW5kcyxcclxuXHRcdFx0dGltZXN0YW1wOiBwb3MudGltZXN0YW1wXHJcblx0XHR9O1xyXG5cclxuXHRcdGZvciAodmFyIGkgaW4gcG9zLmNvb3Jkcykge1xyXG5cdFx0XHRpZiAodHlwZW9mIHBvcy5jb29yZHNbaV0gPT09ICdudW1iZXInKSB7XHJcblx0XHRcdFx0ZGF0YVtpXSA9IHBvcy5jb29yZHNbaV07XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0XHR0aGlzLmZpcmUoJ2xvY2F0aW9uZm91bmQnLCBkYXRhKTtcclxuXHR9XHJcbn0pO1xyXG5cblxufSh3aW5kb3csIGRvY3VtZW50KSk7IiwidmFyIHN0eWxlID0gcmVxdWlyZSgnY29tcHV0ZWQtc3R5bGUnKVxuXG5leHBvcnRzID0gbW9kdWxlLmV4cG9ydHMgPSBwb3NpdGlvblxuZXhwb3J0cy5jb250YWluZXIgPSBjb250YWluZXJCb3hcbmV4cG9ydHMub2Zmc2V0UGFyZW50ID0gb2Zmc2V0UGFyZW50XG5leHBvcnRzLnJlbGF0aXZlID0gXG5leHBvcnRzLm9mZnNldCA9IG9mZnNldCBcblxuLyoqXG4gKiBHZXQgdGhlIGxvY2F0aW9uIG9mIHRoZSBlbGVtZW50IHJlbGF0aXZlIHRvIHRoZSB0b3AgbGVmdCBvZiB0aGUgZG9jdW1lbnRFbGVtZW50XG4gKlxuICogQHBhcmFtIHtFbGVtZW50fSBlbGVtZW50XG4gKiBAcmV0dXJuIHtPYmplY3R9IHt0b3AsIHJpZ2h0LCBib3R0b20sIGxlZnR9IGluIHBpeGVsc1xuICovXG5cbmZ1bmN0aW9uIHBvc2l0aW9uIChlbGVtZW50KSB7XG5cdHZhciBib3ggPSBlbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpXG5cdCAgLCBzY3JvbGxUb3AgPSB3aW5kb3cuc2Nyb2xsWVxuXHQgICwgc2Nyb2xsTGVmdCA9IHdpbmRvdy5zY3JvbGxYXG5cdC8vIEhhcyB0byBiZSBjb3BpZWQgc2luY2UgQ2xpZW50UmVjdHMgaXMgaW1tdXRhYmxlXG5cdHJldHVybiB7XG5cdFx0dG9wOiBib3gudG9wICsgc2Nyb2xsVG9wLFxuXHRcdHJpZ2h0OiBib3gucmlnaHQgKyBzY3JvbGxMZWZ0LFxuXHRcdGxlZnQ6IGJveC5sZWZ0ICsgc2Nyb2xsTGVmdCxcblx0XHRib3R0b206IGJveC5ib3R0b20gKyBzY3JvbGxUb3AsXG5cdFx0d2lkdGg6IGJveC53aWR0aCxcblx0XHRoZWlnaHQ6IGJveC5oZWlnaHRcblx0fVxufVxuXG4vKipcbiAqIEdldCB0aGUgcG9zaXRpb24gb2Ygb25lIGVsZW1lbnQgcmVsYXRpdmUgdG8gYW5vdGhlclxuICpcbiAqICAgb2Zmc2V0KGNoaWxkKVxuICogICBvZmZzZXQoY2hpbGQsIHBhcmVudClcbiAqICAgXG4gKiBAcGFyYW0ge0VsZW1lbnR9IGNoaWxkIHRoZSBzdWJqZWN0IGVsZW1lbnRcbiAqIEBwYXJhbSB7RWxlbWVudH0gW3BhcmVudF0gb2Zmc2V0IHdpbGwgYmUgY2FsY3VsYXRlZCByZWxhdGl2ZSB0byB0aGlzIGVsZW1lbnQuIFxuICogICBUaGlzIHBhcmFtZXRlciBpcyBvcHRpb25hbCBhbmQgd2lsbCBkZWZhdWx0IHRvIHRoZSBvZmZzZXRwYXJlbnQgb2YgdGhlIFxuICogICBgY2hpbGRgIGVsZW1lbnRcbiAqIEByZXR1cm4ge09iamVjdH0ge3gsIHl9IGluIHBpeGVsc1xuICovXG5cbmZ1bmN0aW9uIG9mZnNldCAoY2hpbGQsIHBhcmVudCkge1xuXHQvLyBkZWZhdWx0IHRvIGNvbXBhcmluZyB3aXRoIHRoZSBvZmZzZXRwYXJlbnRcblx0cGFyZW50IHx8IChwYXJlbnQgPSBvZmZzZXRQYXJlbnQoY2hpbGQpKVxuXHRpZiAoIXBhcmVudCkge1xuXHRcdHBhcmVudCA9IHBvc2l0aW9uKGNoaWxkKVxuXHRcdHJldHVybiB7XG5cdFx0XHR4OiBwYXJlbnQubGVmdCxcblx0XHRcdHk6IHBhcmVudC50b3Bcblx0XHR9XG5cdH1cblxuXHR2YXIgb2Zmc2V0ID0gcG9zaXRpb24oY2hpbGQpXG5cdCAgLCBwYXJlbnRPZmZzZXQgPSBwb3NpdGlvbihwYXJlbnQpXG5cdCAgLCBjc3MgPSBzdHlsZShjaGlsZClcblxuXHQvLyBTdWJ0cmFjdCBlbGVtZW50IG1hcmdpbnNcblx0b2Zmc2V0LnRvcCAgLT0gcGFyc2VGbG9hdChjc3MubWFyZ2luVG9wKSAgfHwgMFxuXHRvZmZzZXQubGVmdCAtPSBwYXJzZUZsb2F0KGNzcy5tYXJnaW5MZWZ0KSB8fCAwXG5cblx0Ly8gQWxsb3cgZm9yIHRoZSBvZmZzZXRwYXJlbnQncyBib3JkZXJcblx0b2Zmc2V0LnRvcCAgLT0gcGFyZW50LmNsaWVudFRvcFxuXHRvZmZzZXQubGVmdCAtPSBwYXJlbnQuY2xpZW50TGVmdFxuXG5cdHJldHVybiB7XG5cdFx0eDogb2Zmc2V0LmxlZnQgLSBwYXJlbnRPZmZzZXQubGVmdCxcblx0XHR5OiAgb2Zmc2V0LnRvcCAgLSBwYXJlbnRPZmZzZXQudG9wXG5cdH1cbn1cblxuLy8gQWx0ZXJuYXRpdmUgd2F5IG9mIGNhbGN1bGF0aW5nIG9mZnNldCBwZXJoYXBzIGl0cyBjaGVhcGVyXG4vLyBmdW5jdGlvbiBvZmZzZXQgKGVsKSB7XG4vLyBcdHZhciB4ID0gZWwub2Zmc2V0TGVmdCwgeSA9IGVsLm9mZnNldFRvcFxuLy8gXHR3aGlsZSAoZWwgPSBlbC5vZmZzZXRQYXJlbnQpIHtcbi8vIFx0XHR4ICs9IGVsLm9mZnNldExlZnQgKyBlbC5jbGllbnRMZWZ0XG4vLyBcdFx0eSArPSBlbC5vZmZzZXRUb3AgKyBlbC5jbGllbnRUb3Bcbi8vIFx0fVxuLy8gXHRyZXR1cm4ge2xlZnQ6IHgsIHRvcDogeX1cbi8vIH1cblxuLyoqXG4gKiBEZXRlcm1pbmUgdGhlIHBlcmltZXRlciBvZiBhbiBlbGVtZW50cyBjb250YWluaW5nIGJsb2NrLiBUaGlzIGlzIHRoZSBib3ggdGhhdFxuICogZGV0ZXJtaW5lcyB0aGUgY2hpbGRzIHBvc2l0aW9uaW5nLiBUaGUgY29udGFpbmVyIGNvcmRzIGFyZSByZWxhdGl2ZSB0byB0aGUgXG4gKiBkb2N1bWVudCBlbGVtZW50IG5vdCB0aGUgdmlld3BvcnQ7IHNvIHRha2UgaW50byBhY2NvdW50IHNjcm9sbGluZy5cbiAqXG4gKiBAcGFyYW0ge0VsZW1lbnR9IGNoaWxkXG4gKiBAcmV0dXJuIHtPYmplY3R9XG4gKi9cblxuZnVuY3Rpb24gY29udGFpbmVyQm94IChjaGlsZCkge1xuXHR2YXIgY29udGFpbmVyID0gb2Zmc2V0UGFyZW50KGNoaWxkKVxuXG5cdGlmICghY29udGFpbmVyKSB7XG5cdFx0Y29udGFpbmVyID0gY2hpbGQub3duZXJEb2N1bWVudC5kb2N1bWVudEVsZW1lbnRcblx0XHQvLyBUaGUgb3V0ZXIgZWRnZXMgb2YgdGhlIGRvY3VtZW50XG5cdFx0cmV0dXJuIHtcblx0XHRcdHRvcCAgIDogMCxcblx0XHRcdGxlZnQgIDogMCxcblx0XHRcdHJpZ2h0IDogY29udGFpbmVyLm9mZnNldFdpZHRoLFxuXHRcdFx0Ym90dG9tOiBjb250YWluZXIub2Zmc2V0SGVpZ2h0LFxuXHRcdFx0d2lkdGggOiBjb250YWluZXIub2Zmc2V0V2lkdGgsXG5cdFx0XHRoZWlnaHQ6IGNvbnRhaW5lci5vZmZzZXRIZWlnaHRcblx0XHR9XG5cdH1cblxuXHR2YXIgb2Zmc2V0ID0gcG9zaXRpb24oY29udGFpbmVyKVxuXHQgICwgY3NzID0gc3R5bGUoY29udGFpbmVyKVxuXG5cdC8vIFJlbW92ZSBpdHMgYm9yZGVyXG5cdG9mZnNldC50b3AgICAgKz0gcGFyc2VGbG9hdChjc3MuYm9yZGVyVG9wV2lkdGgpIHx8IDBcblx0b2Zmc2V0LmxlZnQgICArPSBwYXJzZUZsb2F0KGNzcy5ib3JkZXJMZWZ0V2lkdGgpfHwgMFxuXHRvZmZzZXQucmlnaHQgIC09IHBhcnNlRmxvYXQoY3NzLmJvcmRlclJpZ2h0V2lkdGgpIHx8IDBcblx0b2Zmc2V0LmJvdHRvbSAtPSBwYXJzZUZsb2F0KGNzcy5ib3JkZXJCb3R0b21XaWR0aCkgfHwgMFxuXHRvZmZzZXQud2lkdGggICA9IG9mZnNldC5yaWdodCAtIG9mZnNldC5sZWZ0XG5cdG9mZnNldC5oZWlnaHQgID0gb2Zmc2V0LmJvdHRvbSAtIG9mZnNldC50b3BcblxuXHRyZXR1cm4gb2Zmc2V0XG59XG5cbi8qKlxuICogR2V0IHRoZSBlbGVtZW50IHRoYXQgc2VydmVzIGFzIHRoZSBiYXNlIGZvciB0aGlzIG9uZXMgcG9zaXRpb25pbmcuXG4gKiBJZiBubyBwYXJlbnRzIGFyZSBwb3N0aW9uZWQgaXQgd2lsbCByZXR1cm4gdW5kZWZpbmVkIHdoaWNoIGlzbid0IFxuICogd2hhdCB5b3UgbWlnaHQgZXhwZWN0IGlmIHlvdSBrbm93IHRoZSBvZmZzZXRwYXJlbnQgc3BlYyBvciBoYXZlIFxuICogdXNlZCBgalF1ZXJ5Lm9mZnNldFBhcmVudGBcbiAqIFxuICogQHBhcmFtIHtFbGVtZW50fSBlbGVtZW50XG4gKiBAcmV0dXJuIHtFbGVtZW50fSBpZiBhIHBvc2l0aW9uZWQgcGFyZW50IGV4aXN0c1xuICovXG5cbmZ1bmN0aW9uIG9mZnNldFBhcmVudCAoZWxlbWVudCkge1xuXHR2YXIgcGFyZW50ID0gZWxlbWVudC5vZmZzZXRQYXJlbnRcblx0d2hpbGUgKHBhcmVudCAmJiBzdHlsZShwYXJlbnQpLnBvc2l0aW9uID09PSBcInN0YXRpY1wiKSBwYXJlbnQgPSBwYXJlbnQub2Zmc2V0UGFyZW50XG5cdHJldHVybiBwYXJlbnRcbn1cbiIsIlxuLyoqXG4gKiBHZXQgdGhlIGNvbXB1dGVkIHN0eWxlIG9mIGEgRE9NIGVsZW1lbnRcbiAqIFxuICogICBzdHlsZShkb2N1bWVudC5ib2R5KSAvLyA9PiB7d2lkdGg6JzUwMHB4JywgLi4ufVxuICogXG4gKiBAcGFyYW0ge0VsZW1lbnR9IGVsZW1lbnRcbiAqIEByZXR1cm4ge09iamVjdH1cbiAqL1xuXG4vLyBBY2Nlc3NpbmcgdmlhIHdpbmRvdyBmb3IganNET00gc3VwcG9ydFxubW9kdWxlLmV4cG9ydHMgPSB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZVxuXG4vLyBGYWxsYmFjayB0byBlbGVtLmN1cnJlbnRTdHlsZSBmb3IgSUUgPCA5XG5pZiAoIW1vZHVsZS5leHBvcnRzKSB7XG5cdG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGVsZW0pIHtcblx0XHRyZXR1cm4gZWxlbS5jdXJyZW50U3R5bGVcblx0fVxufVxuIiwiLyohXG4gICogUmVxd2VzdCEgQSBnZW5lcmFsIHB1cnBvc2UgWEhSIGNvbm5lY3Rpb24gbWFuYWdlclxuICAqIGxpY2Vuc2UgTUlUIChjKSBEdXN0aW4gRGlheiAyMDE0XG4gICogaHR0cHM6Ly9naXRodWIuY29tL2RlZC9yZXF3ZXN0XG4gICovXG5cbiFmdW5jdGlvbiAobmFtZSwgY29udGV4dCwgZGVmaW5pdGlvbikge1xuICBpZiAodHlwZW9mIG1vZHVsZSAhPSAndW5kZWZpbmVkJyAmJiBtb2R1bGUuZXhwb3J0cykgbW9kdWxlLmV4cG9ydHMgPSBkZWZpbml0aW9uKClcbiAgZWxzZSBpZiAodHlwZW9mIGRlZmluZSA9PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpIGRlZmluZShkZWZpbml0aW9uKVxuICBlbHNlIGNvbnRleHRbbmFtZV0gPSBkZWZpbml0aW9uKClcbn0oJ3JlcXdlc3QnLCB0aGlzLCBmdW5jdGlvbiAoKSB7XG5cbiAgdmFyIHdpbiA9IHdpbmRvd1xuICAgICwgZG9jID0gZG9jdW1lbnRcbiAgICAsIGh0dHBzUmUgPSAvXmh0dHAvXG4gICAgLCBwcm90b2NvbFJlID0gLyheXFx3Kyk6XFwvXFwvL1xuICAgICwgdHdvSHVuZG8gPSAvXigyMFxcZHwxMjIzKSQvIC8vaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy8xMDA0Njk3Mi9tc2llLXJldHVybnMtc3RhdHVzLWNvZGUtb2YtMTIyMy1mb3ItYWpheC1yZXF1ZXN0XG4gICAgLCBieVRhZyA9ICdnZXRFbGVtZW50c0J5VGFnTmFtZSdcbiAgICAsIHJlYWR5U3RhdGUgPSAncmVhZHlTdGF0ZSdcbiAgICAsIGNvbnRlbnRUeXBlID0gJ0NvbnRlbnQtVHlwZSdcbiAgICAsIHJlcXVlc3RlZFdpdGggPSAnWC1SZXF1ZXN0ZWQtV2l0aCdcbiAgICAsIGhlYWQgPSBkb2NbYnlUYWddKCdoZWFkJylbMF1cbiAgICAsIHVuaXFpZCA9IDBcbiAgICAsIGNhbGxiYWNrUHJlZml4ID0gJ3JlcXdlc3RfJyArICgrbmV3IERhdGUoKSlcbiAgICAsIGxhc3RWYWx1ZSAvLyBkYXRhIHN0b3JlZCBieSB0aGUgbW9zdCByZWNlbnQgSlNPTlAgY2FsbGJhY2tcbiAgICAsIHhtbEh0dHBSZXF1ZXN0ID0gJ1hNTEh0dHBSZXF1ZXN0J1xuICAgICwgeERvbWFpblJlcXVlc3QgPSAnWERvbWFpblJlcXVlc3QnXG4gICAgLCBub29wID0gZnVuY3Rpb24gKCkge31cblxuICAgICwgaXNBcnJheSA9IHR5cGVvZiBBcnJheS5pc0FycmF5ID09ICdmdW5jdGlvbidcbiAgICAgICAgPyBBcnJheS5pc0FycmF5XG4gICAgICAgIDogZnVuY3Rpb24gKGEpIHtcbiAgICAgICAgICAgIHJldHVybiBhIGluc3RhbmNlb2YgQXJyYXlcbiAgICAgICAgICB9XG5cbiAgICAsIGRlZmF1bHRIZWFkZXJzID0ge1xuICAgICAgICAgICdjb250ZW50VHlwZSc6ICdhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWQnXG4gICAgICAgICwgJ3JlcXVlc3RlZFdpdGgnOiB4bWxIdHRwUmVxdWVzdFxuICAgICAgICAsICdhY2NlcHQnOiB7XG4gICAgICAgICAgICAgICcqJzogICd0ZXh0L2phdmFzY3JpcHQsIHRleHQvaHRtbCwgYXBwbGljYXRpb24veG1sLCB0ZXh0L3htbCwgKi8qJ1xuICAgICAgICAgICAgLCAneG1sJzogICdhcHBsaWNhdGlvbi94bWwsIHRleHQveG1sJ1xuICAgICAgICAgICAgLCAnaHRtbCc6ICd0ZXh0L2h0bWwnXG4gICAgICAgICAgICAsICd0ZXh0JzogJ3RleHQvcGxhaW4nXG4gICAgICAgICAgICAsICdqc29uJzogJ2FwcGxpY2F0aW9uL2pzb24sIHRleHQvamF2YXNjcmlwdCdcbiAgICAgICAgICAgICwgJ2pzJzogICAnYXBwbGljYXRpb24vamF2YXNjcmlwdCwgdGV4dC9qYXZhc2NyaXB0J1xuICAgICAgICAgIH1cbiAgICAgIH1cblxuICAgICwgeGhyID0gZnVuY3Rpb24obykge1xuICAgICAgICAvLyBpcyBpdCB4LWRvbWFpblxuICAgICAgICBpZiAob1snY3Jvc3NPcmlnaW4nXSA9PT0gdHJ1ZSkge1xuICAgICAgICAgIHZhciB4aHIgPSB3aW5beG1sSHR0cFJlcXVlc3RdID8gbmV3IFhNTEh0dHBSZXF1ZXN0KCkgOiBudWxsXG4gICAgICAgICAgaWYgKHhociAmJiAnd2l0aENyZWRlbnRpYWxzJyBpbiB4aHIpIHtcbiAgICAgICAgICAgIHJldHVybiB4aHJcbiAgICAgICAgICB9IGVsc2UgaWYgKHdpblt4RG9tYWluUmVxdWVzdF0pIHtcbiAgICAgICAgICAgIHJldHVybiBuZXcgWERvbWFpblJlcXVlc3QoKVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0Jyb3dzZXIgZG9lcyBub3Qgc3VwcG9ydCBjcm9zcy1vcmlnaW4gcmVxdWVzdHMnKVxuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmICh3aW5beG1sSHR0cFJlcXVlc3RdKSB7XG4gICAgICAgICAgcmV0dXJuIG5ldyBYTUxIdHRwUmVxdWVzdCgpXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuIG5ldyBBY3RpdmVYT2JqZWN0KCdNaWNyb3NvZnQuWE1MSFRUUCcpXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAsIGdsb2JhbFNldHVwT3B0aW9ucyA9IHtcbiAgICAgICAgZGF0YUZpbHRlcjogZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICAgICByZXR1cm4gZGF0YVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgZnVuY3Rpb24gc3VjY2VlZChyKSB7XG4gICAgdmFyIHByb3RvY29sID0gcHJvdG9jb2xSZS5leGVjKHIudXJsKTtcbiAgICBwcm90b2NvbCA9IChwcm90b2NvbCAmJiBwcm90b2NvbFsxXSkgfHwgd2luZG93LmxvY2F0aW9uLnByb3RvY29sO1xuICAgIHJldHVybiBodHRwc1JlLnRlc3QocHJvdG9jb2wpID8gdHdvSHVuZG8udGVzdChyLnJlcXVlc3Quc3RhdHVzKSA6ICEhci5yZXF1ZXN0LnJlc3BvbnNlO1xuICB9XG5cbiAgZnVuY3Rpb24gaGFuZGxlUmVhZHlTdGF0ZShyLCBzdWNjZXNzLCBlcnJvcikge1xuICAgIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgICAvLyB1c2UgX2Fib3J0ZWQgdG8gbWl0aWdhdGUgYWdhaW5zdCBJRSBlcnIgYzAwYzAyM2ZcbiAgICAgIC8vIChjYW4ndCByZWFkIHByb3BzIG9uIGFib3J0ZWQgcmVxdWVzdCBvYmplY3RzKVxuICAgICAgaWYgKHIuX2Fib3J0ZWQpIHJldHVybiBlcnJvcihyLnJlcXVlc3QpXG4gICAgICBpZiAoci5yZXF1ZXN0ICYmIHIucmVxdWVzdFtyZWFkeVN0YXRlXSA9PSA0KSB7XG4gICAgICAgIHIucmVxdWVzdC5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBub29wXG4gICAgICAgIGlmIChzdWNjZWVkKHIpKSBzdWNjZXNzKHIucmVxdWVzdClcbiAgICAgICAgZWxzZVxuICAgICAgICAgIGVycm9yKHIucmVxdWVzdClcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBzZXRIZWFkZXJzKGh0dHAsIG8pIHtcbiAgICB2YXIgaGVhZGVycyA9IG9bJ2hlYWRlcnMnXSB8fCB7fVxuICAgICAgLCBoXG5cbiAgICBoZWFkZXJzWydBY2NlcHQnXSA9IGhlYWRlcnNbJ0FjY2VwdCddXG4gICAgICB8fCBkZWZhdWx0SGVhZGVyc1snYWNjZXB0J11bb1sndHlwZSddXVxuICAgICAgfHwgZGVmYXVsdEhlYWRlcnNbJ2FjY2VwdCddWycqJ11cblxuICAgIHZhciBpc0FGb3JtRGF0YSA9IHR5cGVvZiBGb3JtRGF0YSA9PT0gJ2Z1bmN0aW9uJyAmJiAob1snZGF0YSddIGluc3RhbmNlb2YgRm9ybURhdGEpO1xuICAgIC8vIGJyZWFrcyBjcm9zcy1vcmlnaW4gcmVxdWVzdHMgd2l0aCBsZWdhY3kgYnJvd3NlcnNcbiAgICBpZiAoIW9bJ2Nyb3NzT3JpZ2luJ10gJiYgIWhlYWRlcnNbcmVxdWVzdGVkV2l0aF0pIGhlYWRlcnNbcmVxdWVzdGVkV2l0aF0gPSBkZWZhdWx0SGVhZGVyc1sncmVxdWVzdGVkV2l0aCddXG4gICAgaWYgKCFoZWFkZXJzW2NvbnRlbnRUeXBlXSAmJiAhaXNBRm9ybURhdGEpIGhlYWRlcnNbY29udGVudFR5cGVdID0gb1snY29udGVudFR5cGUnXSB8fCBkZWZhdWx0SGVhZGVyc1snY29udGVudFR5cGUnXVxuICAgIGZvciAoaCBpbiBoZWFkZXJzKVxuICAgICAgaGVhZGVycy5oYXNPd25Qcm9wZXJ0eShoKSAmJiAnc2V0UmVxdWVzdEhlYWRlcicgaW4gaHR0cCAmJiBodHRwLnNldFJlcXVlc3RIZWFkZXIoaCwgaGVhZGVyc1toXSlcbiAgfVxuXG4gIGZ1bmN0aW9uIHNldENyZWRlbnRpYWxzKGh0dHAsIG8pIHtcbiAgICBpZiAodHlwZW9mIG9bJ3dpdGhDcmVkZW50aWFscyddICE9PSAndW5kZWZpbmVkJyAmJiB0eXBlb2YgaHR0cC53aXRoQ3JlZGVudGlhbHMgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICBodHRwLndpdGhDcmVkZW50aWFscyA9ICEhb1snd2l0aENyZWRlbnRpYWxzJ11cbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBnZW5lcmFsQ2FsbGJhY2soZGF0YSkge1xuICAgIGxhc3RWYWx1ZSA9IGRhdGFcbiAgfVxuXG4gIGZ1bmN0aW9uIHVybGFwcGVuZCAodXJsLCBzKSB7XG4gICAgcmV0dXJuIHVybCArICgvXFw/Ly50ZXN0KHVybCkgPyAnJicgOiAnPycpICsgc1xuICB9XG5cbiAgZnVuY3Rpb24gaGFuZGxlSnNvbnAobywgZm4sIGVyciwgdXJsKSB7XG4gICAgdmFyIHJlcUlkID0gdW5pcWlkKytcbiAgICAgICwgY2JrZXkgPSBvWydqc29ucENhbGxiYWNrJ10gfHwgJ2NhbGxiYWNrJyAvLyB0aGUgJ2NhbGxiYWNrJyBrZXlcbiAgICAgICwgY2J2YWwgPSBvWydqc29ucENhbGxiYWNrTmFtZSddIHx8IHJlcXdlc3QuZ2V0Y2FsbGJhY2tQcmVmaXgocmVxSWQpXG4gICAgICAsIGNicmVnID0gbmV3IFJlZ0V4cCgnKChefFxcXFw/fCYpJyArIGNia2V5ICsgJyk9KFteJl0rKScpXG4gICAgICAsIG1hdGNoID0gdXJsLm1hdGNoKGNicmVnKVxuICAgICAgLCBzY3JpcHQgPSBkb2MuY3JlYXRlRWxlbWVudCgnc2NyaXB0JylcbiAgICAgICwgbG9hZGVkID0gMFxuICAgICAgLCBpc0lFMTAgPSBuYXZpZ2F0b3IudXNlckFnZW50LmluZGV4T2YoJ01TSUUgMTAuMCcpICE9PSAtMVxuXG4gICAgaWYgKG1hdGNoKSB7XG4gICAgICBpZiAobWF0Y2hbM10gPT09ICc/Jykge1xuICAgICAgICB1cmwgPSB1cmwucmVwbGFjZShjYnJlZywgJyQxPScgKyBjYnZhbCkgLy8gd2lsZGNhcmQgY2FsbGJhY2sgZnVuYyBuYW1lXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjYnZhbCA9IG1hdGNoWzNdIC8vIHByb3ZpZGVkIGNhbGxiYWNrIGZ1bmMgbmFtZVxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICB1cmwgPSB1cmxhcHBlbmQodXJsLCBjYmtleSArICc9JyArIGNidmFsKSAvLyBubyBjYWxsYmFjayBkZXRhaWxzLCBhZGQgJ2VtXG4gICAgfVxuXG4gICAgd2luW2NidmFsXSA9IGdlbmVyYWxDYWxsYmFja1xuXG4gICAgc2NyaXB0LnR5cGUgPSAndGV4dC9qYXZhc2NyaXB0J1xuICAgIHNjcmlwdC5zcmMgPSB1cmxcbiAgICBzY3JpcHQuYXN5bmMgPSB0cnVlXG4gICAgaWYgKHR5cGVvZiBzY3JpcHQub25yZWFkeXN0YXRlY2hhbmdlICE9PSAndW5kZWZpbmVkJyAmJiAhaXNJRTEwKSB7XG4gICAgICAvLyBuZWVkIHRoaXMgZm9yIElFIGR1ZSB0byBvdXQtb2Ytb3JkZXIgb25yZWFkeXN0YXRlY2hhbmdlKCksIGJpbmRpbmcgc2NyaXB0XG4gICAgICAvLyBleGVjdXRpb24gdG8gYW4gZXZlbnQgbGlzdGVuZXIgZ2l2ZXMgdXMgY29udHJvbCBvdmVyIHdoZW4gdGhlIHNjcmlwdFxuICAgICAgLy8gaXMgZXhlY3V0ZWQuIFNlZSBodHRwOi8vamF1Ym91cmcubmV0LzIwMTAvMDcvbG9hZGluZy1zY3JpcHQtYXMtb25jbGljay1oYW5kbGVyLW9mLmh0bWxcbiAgICAgIHNjcmlwdC5odG1sRm9yID0gc2NyaXB0LmlkID0gJ19yZXF3ZXN0XycgKyByZXFJZFxuICAgIH1cblxuICAgIHNjcmlwdC5vbmxvYWQgPSBzY3JpcHQub25yZWFkeXN0YXRlY2hhbmdlID0gZnVuY3Rpb24gKCkge1xuICAgICAgaWYgKChzY3JpcHRbcmVhZHlTdGF0ZV0gJiYgc2NyaXB0W3JlYWR5U3RhdGVdICE9PSAnY29tcGxldGUnICYmIHNjcmlwdFtyZWFkeVN0YXRlXSAhPT0gJ2xvYWRlZCcpIHx8IGxvYWRlZCkge1xuICAgICAgICByZXR1cm4gZmFsc2VcbiAgICAgIH1cbiAgICAgIHNjcmlwdC5vbmxvYWQgPSBzY3JpcHQub25yZWFkeXN0YXRlY2hhbmdlID0gbnVsbFxuICAgICAgc2NyaXB0Lm9uY2xpY2sgJiYgc2NyaXB0Lm9uY2xpY2soKVxuICAgICAgLy8gQ2FsbCB0aGUgdXNlciBjYWxsYmFjayB3aXRoIHRoZSBsYXN0IHZhbHVlIHN0b3JlZCBhbmQgY2xlYW4gdXAgdmFsdWVzIGFuZCBzY3JpcHRzLlxuICAgICAgZm4obGFzdFZhbHVlKVxuICAgICAgbGFzdFZhbHVlID0gdW5kZWZpbmVkXG4gICAgICBoZWFkLnJlbW92ZUNoaWxkKHNjcmlwdClcbiAgICAgIGxvYWRlZCA9IDFcbiAgICB9XG5cbiAgICAvLyBBZGQgdGhlIHNjcmlwdCB0byB0aGUgRE9NIGhlYWRcbiAgICBoZWFkLmFwcGVuZENoaWxkKHNjcmlwdClcblxuICAgIC8vIEVuYWJsZSBKU09OUCB0aW1lb3V0XG4gICAgcmV0dXJuIHtcbiAgICAgIGFib3J0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHNjcmlwdC5vbmxvYWQgPSBzY3JpcHQub25yZWFkeXN0YXRlY2hhbmdlID0gbnVsbFxuICAgICAgICBlcnIoe30sICdSZXF1ZXN0IGlzIGFib3J0ZWQ6IHRpbWVvdXQnLCB7fSlcbiAgICAgICAgbGFzdFZhbHVlID0gdW5kZWZpbmVkXG4gICAgICAgIGhlYWQucmVtb3ZlQ2hpbGQoc2NyaXB0KVxuICAgICAgICBsb2FkZWQgPSAxXG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gZ2V0UmVxdWVzdChmbiwgZXJyKSB7XG4gICAgdmFyIG8gPSB0aGlzLm9cbiAgICAgICwgbWV0aG9kID0gKG9bJ21ldGhvZCddIHx8ICdHRVQnKS50b1VwcGVyQ2FzZSgpXG4gICAgICAsIHVybCA9IHR5cGVvZiBvID09PSAnc3RyaW5nJyA/IG8gOiBvWyd1cmwnXVxuICAgICAgLy8gY29udmVydCBub24tc3RyaW5nIG9iamVjdHMgdG8gcXVlcnktc3RyaW5nIGZvcm0gdW5sZXNzIG9bJ3Byb2Nlc3NEYXRhJ10gaXMgZmFsc2VcbiAgICAgICwgZGF0YSA9IChvWydwcm9jZXNzRGF0YSddICE9PSBmYWxzZSAmJiBvWydkYXRhJ10gJiYgdHlwZW9mIG9bJ2RhdGEnXSAhPT0gJ3N0cmluZycpXG4gICAgICAgID8gcmVxd2VzdC50b1F1ZXJ5U3RyaW5nKG9bJ2RhdGEnXSlcbiAgICAgICAgOiAob1snZGF0YSddIHx8IG51bGwpXG4gICAgICAsIGh0dHBcbiAgICAgICwgc2VuZFdhaXQgPSBmYWxzZVxuXG4gICAgLy8gaWYgd2UncmUgd29ya2luZyBvbiBhIEdFVCByZXF1ZXN0IGFuZCB3ZSBoYXZlIGRhdGEgdGhlbiB3ZSBzaG91bGQgYXBwZW5kXG4gICAgLy8gcXVlcnkgc3RyaW5nIHRvIGVuZCBvZiBVUkwgYW5kIG5vdCBwb3N0IGRhdGFcbiAgICBpZiAoKG9bJ3R5cGUnXSA9PSAnanNvbnAnIHx8IG1ldGhvZCA9PSAnR0VUJykgJiYgZGF0YSkge1xuICAgICAgdXJsID0gdXJsYXBwZW5kKHVybCwgZGF0YSlcbiAgICAgIGRhdGEgPSBudWxsXG4gICAgfVxuXG4gICAgaWYgKG9bJ3R5cGUnXSA9PSAnanNvbnAnKSByZXR1cm4gaGFuZGxlSnNvbnAobywgZm4sIGVyciwgdXJsKVxuXG4gICAgLy8gZ2V0IHRoZSB4aHIgZnJvbSB0aGUgZmFjdG9yeSBpZiBwYXNzZWRcbiAgICAvLyBpZiB0aGUgZmFjdG9yeSByZXR1cm5zIG51bGwsIGZhbGwtYmFjayB0byBvdXJzXG4gICAgaHR0cCA9IChvLnhociAmJiBvLnhocihvKSkgfHwgeGhyKG8pXG5cbiAgICBodHRwLm9wZW4obWV0aG9kLCB1cmwsIG9bJ2FzeW5jJ10gPT09IGZhbHNlID8gZmFsc2UgOiB0cnVlKVxuICAgIHNldEhlYWRlcnMoaHR0cCwgbylcbiAgICBzZXRDcmVkZW50aWFscyhodHRwLCBvKVxuICAgIGlmICh3aW5beERvbWFpblJlcXVlc3RdICYmIGh0dHAgaW5zdGFuY2VvZiB3aW5beERvbWFpblJlcXVlc3RdKSB7XG4gICAgICAgIGh0dHAub25sb2FkID0gZm5cbiAgICAgICAgaHR0cC5vbmVycm9yID0gZXJyXG4gICAgICAgIC8vIE5PVEU6IHNlZVxuICAgICAgICAvLyBodHRwOi8vc29jaWFsLm1zZG4ubWljcm9zb2Z0LmNvbS9Gb3J1bXMvZW4tVVMvaWV3ZWJkZXZlbG9wbWVudC90aHJlYWQvMzBlZjNhZGQtNzY3Yy00NDM2LWI4YTktZjFjYTE5YjQ4MTJlXG4gICAgICAgIGh0dHAub25wcm9ncmVzcyA9IGZ1bmN0aW9uKCkge31cbiAgICAgICAgc2VuZFdhaXQgPSB0cnVlXG4gICAgfSBlbHNlIHtcbiAgICAgIGh0dHAub25yZWFkeXN0YXRlY2hhbmdlID0gaGFuZGxlUmVhZHlTdGF0ZSh0aGlzLCBmbiwgZXJyKVxuICAgIH1cbiAgICBvWydiZWZvcmUnXSAmJiBvWydiZWZvcmUnXShodHRwKVxuICAgIGlmIChzZW5kV2FpdCkge1xuICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgIGh0dHAuc2VuZChkYXRhKVxuICAgICAgfSwgMjAwKVxuICAgIH0gZWxzZSB7XG4gICAgICBodHRwLnNlbmQoZGF0YSlcbiAgICB9XG4gICAgcmV0dXJuIGh0dHBcbiAgfVxuXG4gIGZ1bmN0aW9uIFJlcXdlc3QobywgZm4pIHtcbiAgICB0aGlzLm8gPSBvXG4gICAgdGhpcy5mbiA9IGZuXG5cbiAgICBpbml0LmFwcGx5KHRoaXMsIGFyZ3VtZW50cylcbiAgfVxuXG4gIGZ1bmN0aW9uIHNldFR5cGUoaGVhZGVyKSB7XG4gICAgLy8ganNvbiwgamF2YXNjcmlwdCwgdGV4dC9wbGFpbiwgdGV4dC9odG1sLCB4bWxcbiAgICBpZiAoaGVhZGVyLm1hdGNoKCdqc29uJykpIHJldHVybiAnanNvbidcbiAgICBpZiAoaGVhZGVyLm1hdGNoKCdqYXZhc2NyaXB0JykpIHJldHVybiAnanMnXG4gICAgaWYgKGhlYWRlci5tYXRjaCgndGV4dCcpKSByZXR1cm4gJ2h0bWwnXG4gICAgaWYgKGhlYWRlci5tYXRjaCgneG1sJykpIHJldHVybiAneG1sJ1xuICB9XG5cbiAgZnVuY3Rpb24gaW5pdChvLCBmbikge1xuXG4gICAgdGhpcy51cmwgPSB0eXBlb2YgbyA9PSAnc3RyaW5nJyA/IG8gOiBvWyd1cmwnXVxuICAgIHRoaXMudGltZW91dCA9IG51bGxcblxuICAgIC8vIHdoZXRoZXIgcmVxdWVzdCBoYXMgYmVlbiBmdWxmaWxsZWQgZm9yIHB1cnBvc2VcbiAgICAvLyBvZiB0cmFja2luZyB0aGUgUHJvbWlzZXNcbiAgICB0aGlzLl9mdWxmaWxsZWQgPSBmYWxzZVxuICAgIC8vIHN1Y2Nlc3MgaGFuZGxlcnNcbiAgICB0aGlzLl9zdWNjZXNzSGFuZGxlciA9IGZ1bmN0aW9uKCl7fVxuICAgIHRoaXMuX2Z1bGZpbGxtZW50SGFuZGxlcnMgPSBbXVxuICAgIC8vIGVycm9yIGhhbmRsZXJzXG4gICAgdGhpcy5fZXJyb3JIYW5kbGVycyA9IFtdXG4gICAgLy8gY29tcGxldGUgKGJvdGggc3VjY2VzcyBhbmQgZmFpbCkgaGFuZGxlcnNcbiAgICB0aGlzLl9jb21wbGV0ZUhhbmRsZXJzID0gW11cbiAgICB0aGlzLl9lcnJlZCA9IGZhbHNlXG4gICAgdGhpcy5fcmVzcG9uc2VBcmdzID0ge31cblxuICAgIHZhciBzZWxmID0gdGhpc1xuXG4gICAgZm4gPSBmbiB8fCBmdW5jdGlvbiAoKSB7fVxuXG4gICAgaWYgKG9bJ3RpbWVvdXQnXSkge1xuICAgICAgdGhpcy50aW1lb3V0ID0gc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgIHNlbGYuYWJvcnQoKVxuICAgICAgfSwgb1sndGltZW91dCddKVxuICAgIH1cblxuICAgIGlmIChvWydzdWNjZXNzJ10pIHtcbiAgICAgIHRoaXMuX3N1Y2Nlc3NIYW5kbGVyID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBvWydzdWNjZXNzJ10uYXBwbHkobywgYXJndW1lbnRzKVxuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChvWydlcnJvciddKSB7XG4gICAgICB0aGlzLl9lcnJvckhhbmRsZXJzLnB1c2goZnVuY3Rpb24gKCkge1xuICAgICAgICBvWydlcnJvciddLmFwcGx5KG8sIGFyZ3VtZW50cylcbiAgICAgIH0pXG4gICAgfVxuXG4gICAgaWYgKG9bJ2NvbXBsZXRlJ10pIHtcbiAgICAgIHRoaXMuX2NvbXBsZXRlSGFuZGxlcnMucHVzaChmdW5jdGlvbiAoKSB7XG4gICAgICAgIG9bJ2NvbXBsZXRlJ10uYXBwbHkobywgYXJndW1lbnRzKVxuICAgICAgfSlcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBjb21wbGV0ZSAocmVzcCkge1xuICAgICAgb1sndGltZW91dCddICYmIGNsZWFyVGltZW91dChzZWxmLnRpbWVvdXQpXG4gICAgICBzZWxmLnRpbWVvdXQgPSBudWxsXG4gICAgICB3aGlsZSAoc2VsZi5fY29tcGxldGVIYW5kbGVycy5sZW5ndGggPiAwKSB7XG4gICAgICAgIHNlbGYuX2NvbXBsZXRlSGFuZGxlcnMuc2hpZnQoKShyZXNwKVxuICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIHN1Y2Nlc3MgKHJlc3ApIHtcbiAgICAgIHZhciB0eXBlID0gb1sndHlwZSddIHx8IHJlc3AgJiYgc2V0VHlwZShyZXNwLmdldFJlc3BvbnNlSGVhZGVyKCdDb250ZW50LVR5cGUnKSkgLy8gcmVzcCBjYW4gYmUgdW5kZWZpbmVkIGluIElFXG4gICAgICByZXNwID0gKHR5cGUgIT09ICdqc29ucCcpID8gc2VsZi5yZXF1ZXN0IDogcmVzcFxuICAgICAgLy8gdXNlIGdsb2JhbCBkYXRhIGZpbHRlciBvbiByZXNwb25zZSB0ZXh0XG4gICAgICB2YXIgZmlsdGVyZWRSZXNwb25zZSA9IGdsb2JhbFNldHVwT3B0aW9ucy5kYXRhRmlsdGVyKHJlc3AucmVzcG9uc2VUZXh0LCB0eXBlKVxuICAgICAgICAsIHIgPSBmaWx0ZXJlZFJlc3BvbnNlXG4gICAgICB0cnkge1xuICAgICAgICByZXNwLnJlc3BvbnNlVGV4dCA9IHJcbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgLy8gY2FuJ3QgYXNzaWduIHRoaXMgaW4gSUU8PTgsIGp1c3QgaWdub3JlXG4gICAgICB9XG4gICAgICBpZiAocikge1xuICAgICAgICBzd2l0Y2ggKHR5cGUpIHtcbiAgICAgICAgY2FzZSAnanNvbic6XG4gICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIHJlc3AgPSB3aW4uSlNPTiA/IHdpbi5KU09OLnBhcnNlKHIpIDogZXZhbCgnKCcgKyByICsgJyknKVxuICAgICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgcmV0dXJuIGVycm9yKHJlc3AsICdDb3VsZCBub3QgcGFyc2UgSlNPTiBpbiByZXNwb25zZScsIGVycilcbiAgICAgICAgICB9XG4gICAgICAgICAgYnJlYWtcbiAgICAgICAgY2FzZSAnanMnOlxuICAgICAgICAgIHJlc3AgPSBldmFsKHIpXG4gICAgICAgICAgYnJlYWtcbiAgICAgICAgY2FzZSAnaHRtbCc6XG4gICAgICAgICAgcmVzcCA9IHJcbiAgICAgICAgICBicmVha1xuICAgICAgICBjYXNlICd4bWwnOlxuICAgICAgICAgIHJlc3AgPSByZXNwLnJlc3BvbnNlWE1MXG4gICAgICAgICAgICAgICYmIHJlc3AucmVzcG9uc2VYTUwucGFyc2VFcnJvciAvLyBJRSB0cm9sb2xvXG4gICAgICAgICAgICAgICYmIHJlc3AucmVzcG9uc2VYTUwucGFyc2VFcnJvci5lcnJvckNvZGVcbiAgICAgICAgICAgICAgJiYgcmVzcC5yZXNwb25zZVhNTC5wYXJzZUVycm9yLnJlYXNvblxuICAgICAgICAgICAgPyBudWxsXG4gICAgICAgICAgICA6IHJlc3AucmVzcG9uc2VYTUxcbiAgICAgICAgICBicmVha1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHNlbGYuX3Jlc3BvbnNlQXJncy5yZXNwID0gcmVzcFxuICAgICAgc2VsZi5fZnVsZmlsbGVkID0gdHJ1ZVxuICAgICAgZm4ocmVzcClcbiAgICAgIHNlbGYuX3N1Y2Nlc3NIYW5kbGVyKHJlc3ApXG4gICAgICB3aGlsZSAoc2VsZi5fZnVsZmlsbG1lbnRIYW5kbGVycy5sZW5ndGggPiAwKSB7XG4gICAgICAgIHJlc3AgPSBzZWxmLl9mdWxmaWxsbWVudEhhbmRsZXJzLnNoaWZ0KCkocmVzcClcbiAgICAgIH1cblxuICAgICAgY29tcGxldGUocmVzcClcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBlcnJvcihyZXNwLCBtc2csIHQpIHtcbiAgICAgIHJlc3AgPSBzZWxmLnJlcXVlc3RcbiAgICAgIHNlbGYuX3Jlc3BvbnNlQXJncy5yZXNwID0gcmVzcFxuICAgICAgc2VsZi5fcmVzcG9uc2VBcmdzLm1zZyA9IG1zZ1xuICAgICAgc2VsZi5fcmVzcG9uc2VBcmdzLnQgPSB0XG4gICAgICBzZWxmLl9lcnJlZCA9IHRydWVcbiAgICAgIHdoaWxlIChzZWxmLl9lcnJvckhhbmRsZXJzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgc2VsZi5fZXJyb3JIYW5kbGVycy5zaGlmdCgpKHJlc3AsIG1zZywgdClcbiAgICAgIH1cbiAgICAgIGNvbXBsZXRlKHJlc3ApXG4gICAgfVxuXG4gICAgdGhpcy5yZXF1ZXN0ID0gZ2V0UmVxdWVzdC5jYWxsKHRoaXMsIHN1Y2Nlc3MsIGVycm9yKVxuICB9XG5cbiAgUmVxd2VzdC5wcm90b3R5cGUgPSB7XG4gICAgYWJvcnQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgIHRoaXMuX2Fib3J0ZWQgPSB0cnVlXG4gICAgICB0aGlzLnJlcXVlc3QuYWJvcnQoKVxuICAgIH1cblxuICAsIHJldHJ5OiBmdW5jdGlvbiAoKSB7XG4gICAgICBpbml0LmNhbGwodGhpcywgdGhpcy5vLCB0aGlzLmZuKVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFNtYWxsIGRldmlhdGlvbiBmcm9tIHRoZSBQcm9taXNlcyBBIENvbW1vbkpzIHNwZWNpZmljYXRpb25cbiAgICAgKiBodHRwOi8vd2lraS5jb21tb25qcy5vcmcvd2lraS9Qcm9taXNlcy9BXG4gICAgICovXG5cbiAgICAvKipcbiAgICAgKiBgdGhlbmAgd2lsbCBleGVjdXRlIHVwb24gc3VjY2Vzc2Z1bCByZXF1ZXN0c1xuICAgICAqL1xuICAsIHRoZW46IGZ1bmN0aW9uIChzdWNjZXNzLCBmYWlsKSB7XG4gICAgICBzdWNjZXNzID0gc3VjY2VzcyB8fCBmdW5jdGlvbiAoKSB7fVxuICAgICAgZmFpbCA9IGZhaWwgfHwgZnVuY3Rpb24gKCkge31cbiAgICAgIGlmICh0aGlzLl9mdWxmaWxsZWQpIHtcbiAgICAgICAgdGhpcy5fcmVzcG9uc2VBcmdzLnJlc3AgPSBzdWNjZXNzKHRoaXMuX3Jlc3BvbnNlQXJncy5yZXNwKVxuICAgICAgfSBlbHNlIGlmICh0aGlzLl9lcnJlZCkge1xuICAgICAgICBmYWlsKHRoaXMuX3Jlc3BvbnNlQXJncy5yZXNwLCB0aGlzLl9yZXNwb25zZUFyZ3MubXNnLCB0aGlzLl9yZXNwb25zZUFyZ3MudClcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuX2Z1bGZpbGxtZW50SGFuZGxlcnMucHVzaChzdWNjZXNzKVxuICAgICAgICB0aGlzLl9lcnJvckhhbmRsZXJzLnB1c2goZmFpbClcbiAgICAgIH1cbiAgICAgIHJldHVybiB0aGlzXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogYGFsd2F5c2Agd2lsbCBleGVjdXRlIHdoZXRoZXIgdGhlIHJlcXVlc3Qgc3VjY2VlZHMgb3IgZmFpbHNcbiAgICAgKi9cbiAgLCBhbHdheXM6IGZ1bmN0aW9uIChmbikge1xuICAgICAgaWYgKHRoaXMuX2Z1bGZpbGxlZCB8fCB0aGlzLl9lcnJlZCkge1xuICAgICAgICBmbih0aGlzLl9yZXNwb25zZUFyZ3MucmVzcClcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuX2NvbXBsZXRlSGFuZGxlcnMucHVzaChmbilcbiAgICAgIH1cbiAgICAgIHJldHVybiB0aGlzXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogYGZhaWxgIHdpbGwgZXhlY3V0ZSB3aGVuIHRoZSByZXF1ZXN0IGZhaWxzXG4gICAgICovXG4gICwgZmFpbDogZnVuY3Rpb24gKGZuKSB7XG4gICAgICBpZiAodGhpcy5fZXJyZWQpIHtcbiAgICAgICAgZm4odGhpcy5fcmVzcG9uc2VBcmdzLnJlc3AsIHRoaXMuX3Jlc3BvbnNlQXJncy5tc2csIHRoaXMuX3Jlc3BvbnNlQXJncy50KVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5fZXJyb3JIYW5kbGVycy5wdXNoKGZuKVxuICAgICAgfVxuICAgICAgcmV0dXJuIHRoaXNcbiAgICB9XG4gICwgJ2NhdGNoJzogZnVuY3Rpb24gKGZuKSB7XG4gICAgICByZXR1cm4gdGhpcy5mYWlsKGZuKVxuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIHJlcXdlc3QobywgZm4pIHtcbiAgICByZXR1cm4gbmV3IFJlcXdlc3QobywgZm4pXG4gIH1cblxuICAvLyBub3JtYWxpemUgbmV3bGluZSB2YXJpYW50cyBhY2NvcmRpbmcgdG8gc3BlYyAtPiBDUkxGXG4gIGZ1bmN0aW9uIG5vcm1hbGl6ZShzKSB7XG4gICAgcmV0dXJuIHMgPyBzLnJlcGxhY2UoL1xccj9cXG4vZywgJ1xcclxcbicpIDogJydcbiAgfVxuXG4gIGZ1bmN0aW9uIHNlcmlhbChlbCwgY2IpIHtcbiAgICB2YXIgbiA9IGVsLm5hbWVcbiAgICAgICwgdCA9IGVsLnRhZ05hbWUudG9Mb3dlckNhc2UoKVxuICAgICAgLCBvcHRDYiA9IGZ1bmN0aW9uIChvKSB7XG4gICAgICAgICAgLy8gSUUgZ2l2ZXMgdmFsdWU9XCJcIiBldmVuIHdoZXJlIHRoZXJlIGlzIG5vIHZhbHVlIGF0dHJpYnV0ZVxuICAgICAgICAgIC8vICdzcGVjaWZpZWQnIHJlZjogaHR0cDovL3d3dy53My5vcmcvVFIvRE9NLUxldmVsLTMtQ29yZS9jb3JlLmh0bWwjSUQtODYyNTI5MjczXG4gICAgICAgICAgaWYgKG8gJiYgIW9bJ2Rpc2FibGVkJ10pXG4gICAgICAgICAgICBjYihuLCBub3JtYWxpemUob1snYXR0cmlidXRlcyddWyd2YWx1ZSddICYmIG9bJ2F0dHJpYnV0ZXMnXVsndmFsdWUnXVsnc3BlY2lmaWVkJ10gPyBvWyd2YWx1ZSddIDogb1sndGV4dCddKSlcbiAgICAgICAgfVxuICAgICAgLCBjaCwgcmEsIHZhbCwgaVxuXG4gICAgLy8gZG9uJ3Qgc2VyaWFsaXplIGVsZW1lbnRzIHRoYXQgYXJlIGRpc2FibGVkIG9yIHdpdGhvdXQgYSBuYW1lXG4gICAgaWYgKGVsLmRpc2FibGVkIHx8ICFuKSByZXR1cm5cblxuICAgIHN3aXRjaCAodCkge1xuICAgIGNhc2UgJ2lucHV0JzpcbiAgICAgIGlmICghL3Jlc2V0fGJ1dHRvbnxpbWFnZXxmaWxlL2kudGVzdChlbC50eXBlKSkge1xuICAgICAgICBjaCA9IC9jaGVja2JveC9pLnRlc3QoZWwudHlwZSlcbiAgICAgICAgcmEgPSAvcmFkaW8vaS50ZXN0KGVsLnR5cGUpXG4gICAgICAgIHZhbCA9IGVsLnZhbHVlXG4gICAgICAgIC8vIFdlYktpdCBnaXZlcyB1cyBcIlwiIGluc3RlYWQgb2YgXCJvblwiIGlmIGEgY2hlY2tib3ggaGFzIG5vIHZhbHVlLCBzbyBjb3JyZWN0IGl0IGhlcmVcbiAgICAgICAgOyghKGNoIHx8IHJhKSB8fCBlbC5jaGVja2VkKSAmJiBjYihuLCBub3JtYWxpemUoY2ggJiYgdmFsID09PSAnJyA/ICdvbicgOiB2YWwpKVxuICAgICAgfVxuICAgICAgYnJlYWtcbiAgICBjYXNlICd0ZXh0YXJlYSc6XG4gICAgICBjYihuLCBub3JtYWxpemUoZWwudmFsdWUpKVxuICAgICAgYnJlYWtcbiAgICBjYXNlICdzZWxlY3QnOlxuICAgICAgaWYgKGVsLnR5cGUudG9Mb3dlckNhc2UoKSA9PT0gJ3NlbGVjdC1vbmUnKSB7XG4gICAgICAgIG9wdENiKGVsLnNlbGVjdGVkSW5kZXggPj0gMCA/IGVsLm9wdGlvbnNbZWwuc2VsZWN0ZWRJbmRleF0gOiBudWxsKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZm9yIChpID0gMDsgZWwubGVuZ3RoICYmIGkgPCBlbC5sZW5ndGg7IGkrKykge1xuICAgICAgICAgIGVsLm9wdGlvbnNbaV0uc2VsZWN0ZWQgJiYgb3B0Q2IoZWwub3B0aW9uc1tpXSlcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgYnJlYWtcbiAgICB9XG4gIH1cblxuICAvLyBjb2xsZWN0IHVwIGFsbCBmb3JtIGVsZW1lbnRzIGZvdW5kIGZyb20gdGhlIHBhc3NlZCBhcmd1bWVudCBlbGVtZW50cyBhbGxcbiAgLy8gdGhlIHdheSBkb3duIHRvIGNoaWxkIGVsZW1lbnRzOyBwYXNzIGEgJzxmb3JtPicgb3IgZm9ybSBmaWVsZHMuXG4gIC8vIGNhbGxlZCB3aXRoICd0aGlzJz1jYWxsYmFjayB0byB1c2UgZm9yIHNlcmlhbCgpIG9uIGVhY2ggZWxlbWVudFxuICBmdW5jdGlvbiBlYWNoRm9ybUVsZW1lbnQoKSB7XG4gICAgdmFyIGNiID0gdGhpc1xuICAgICAgLCBlLCBpXG4gICAgICAsIHNlcmlhbGl6ZVN1YnRhZ3MgPSBmdW5jdGlvbiAoZSwgdGFncykge1xuICAgICAgICAgIHZhciBpLCBqLCBmYVxuICAgICAgICAgIGZvciAoaSA9IDA7IGkgPCB0YWdzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBmYSA9IGVbYnlUYWddKHRhZ3NbaV0pXG4gICAgICAgICAgICBmb3IgKGogPSAwOyBqIDwgZmEubGVuZ3RoOyBqKyspIHNlcmlhbChmYVtqXSwgY2IpXG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICBmb3IgKGkgPSAwOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBlID0gYXJndW1lbnRzW2ldXG4gICAgICBpZiAoL2lucHV0fHNlbGVjdHx0ZXh0YXJlYS9pLnRlc3QoZS50YWdOYW1lKSkgc2VyaWFsKGUsIGNiKVxuICAgICAgc2VyaWFsaXplU3VidGFncyhlLCBbICdpbnB1dCcsICdzZWxlY3QnLCAndGV4dGFyZWEnIF0pXG4gICAgfVxuICB9XG5cbiAgLy8gc3RhbmRhcmQgcXVlcnkgc3RyaW5nIHN0eWxlIHNlcmlhbGl6YXRpb25cbiAgZnVuY3Rpb24gc2VyaWFsaXplUXVlcnlTdHJpbmcoKSB7XG4gICAgcmV0dXJuIHJlcXdlc3QudG9RdWVyeVN0cmluZyhyZXF3ZXN0LnNlcmlhbGl6ZUFycmF5LmFwcGx5KG51bGwsIGFyZ3VtZW50cykpXG4gIH1cblxuICAvLyB7ICduYW1lJzogJ3ZhbHVlJywgLi4uIH0gc3R5bGUgc2VyaWFsaXphdGlvblxuICBmdW5jdGlvbiBzZXJpYWxpemVIYXNoKCkge1xuICAgIHZhciBoYXNoID0ge31cbiAgICBlYWNoRm9ybUVsZW1lbnQuYXBwbHkoZnVuY3Rpb24gKG5hbWUsIHZhbHVlKSB7XG4gICAgICBpZiAobmFtZSBpbiBoYXNoKSB7XG4gICAgICAgIGhhc2hbbmFtZV0gJiYgIWlzQXJyYXkoaGFzaFtuYW1lXSkgJiYgKGhhc2hbbmFtZV0gPSBbaGFzaFtuYW1lXV0pXG4gICAgICAgIGhhc2hbbmFtZV0ucHVzaCh2YWx1ZSlcbiAgICAgIH0gZWxzZSBoYXNoW25hbWVdID0gdmFsdWVcbiAgICB9LCBhcmd1bWVudHMpXG4gICAgcmV0dXJuIGhhc2hcbiAgfVxuXG4gIC8vIFsgeyBuYW1lOiAnbmFtZScsIHZhbHVlOiAndmFsdWUnIH0sIC4uLiBdIHN0eWxlIHNlcmlhbGl6YXRpb25cbiAgcmVxd2VzdC5zZXJpYWxpemVBcnJheSA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgYXJyID0gW11cbiAgICBlYWNoRm9ybUVsZW1lbnQuYXBwbHkoZnVuY3Rpb24gKG5hbWUsIHZhbHVlKSB7XG4gICAgICBhcnIucHVzaCh7bmFtZTogbmFtZSwgdmFsdWU6IHZhbHVlfSlcbiAgICB9LCBhcmd1bWVudHMpXG4gICAgcmV0dXJuIGFyclxuICB9XG5cbiAgcmVxd2VzdC5zZXJpYWxpemUgPSBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDApIHJldHVybiAnJ1xuICAgIHZhciBvcHQsIGZuXG4gICAgICAsIGFyZ3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsIDApXG5cbiAgICBvcHQgPSBhcmdzLnBvcCgpXG4gICAgb3B0ICYmIG9wdC5ub2RlVHlwZSAmJiBhcmdzLnB1c2gob3B0KSAmJiAob3B0ID0gbnVsbClcbiAgICBvcHQgJiYgKG9wdCA9IG9wdC50eXBlKVxuXG4gICAgaWYgKG9wdCA9PSAnbWFwJykgZm4gPSBzZXJpYWxpemVIYXNoXG4gICAgZWxzZSBpZiAob3B0ID09ICdhcnJheScpIGZuID0gcmVxd2VzdC5zZXJpYWxpemVBcnJheVxuICAgIGVsc2UgZm4gPSBzZXJpYWxpemVRdWVyeVN0cmluZ1xuXG4gICAgcmV0dXJuIGZuLmFwcGx5KG51bGwsIGFyZ3MpXG4gIH1cblxuICByZXF3ZXN0LnRvUXVlcnlTdHJpbmcgPSBmdW5jdGlvbiAobywgdHJhZCkge1xuICAgIHZhciBwcmVmaXgsIGlcbiAgICAgICwgdHJhZGl0aW9uYWwgPSB0cmFkIHx8IGZhbHNlXG4gICAgICAsIHMgPSBbXVxuICAgICAgLCBlbmMgPSBlbmNvZGVVUklDb21wb25lbnRcbiAgICAgICwgYWRkID0gZnVuY3Rpb24gKGtleSwgdmFsdWUpIHtcbiAgICAgICAgICAvLyBJZiB2YWx1ZSBpcyBhIGZ1bmN0aW9uLCBpbnZva2UgaXQgYW5kIHJldHVybiBpdHMgdmFsdWVcbiAgICAgICAgICB2YWx1ZSA9ICgnZnVuY3Rpb24nID09PSB0eXBlb2YgdmFsdWUpID8gdmFsdWUoKSA6ICh2YWx1ZSA9PSBudWxsID8gJycgOiB2YWx1ZSlcbiAgICAgICAgICBzW3MubGVuZ3RoXSA9IGVuYyhrZXkpICsgJz0nICsgZW5jKHZhbHVlKVxuICAgICAgICB9XG4gICAgLy8gSWYgYW4gYXJyYXkgd2FzIHBhc3NlZCBpbiwgYXNzdW1lIHRoYXQgaXQgaXMgYW4gYXJyYXkgb2YgZm9ybSBlbGVtZW50cy5cbiAgICBpZiAoaXNBcnJheShvKSkge1xuICAgICAgZm9yIChpID0gMDsgbyAmJiBpIDwgby5sZW5ndGg7IGkrKykgYWRkKG9baV1bJ25hbWUnXSwgb1tpXVsndmFsdWUnXSlcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gSWYgdHJhZGl0aW9uYWwsIGVuY29kZSB0aGUgXCJvbGRcIiB3YXkgKHRoZSB3YXkgMS4zLjIgb3Igb2xkZXJcbiAgICAgIC8vIGRpZCBpdCksIG90aGVyd2lzZSBlbmNvZGUgcGFyYW1zIHJlY3Vyc2l2ZWx5LlxuICAgICAgZm9yIChwcmVmaXggaW4gbykge1xuICAgICAgICBpZiAoby5oYXNPd25Qcm9wZXJ0eShwcmVmaXgpKSBidWlsZFBhcmFtcyhwcmVmaXgsIG9bcHJlZml4XSwgdHJhZGl0aW9uYWwsIGFkZClcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBzcGFjZXMgc2hvdWxkIGJlICsgYWNjb3JkaW5nIHRvIHNwZWNcbiAgICByZXR1cm4gcy5qb2luKCcmJykucmVwbGFjZSgvJTIwL2csICcrJylcbiAgfVxuXG4gIGZ1bmN0aW9uIGJ1aWxkUGFyYW1zKHByZWZpeCwgb2JqLCB0cmFkaXRpb25hbCwgYWRkKSB7XG4gICAgdmFyIG5hbWUsIGksIHZcbiAgICAgICwgcmJyYWNrZXQgPSAvXFxbXFxdJC9cblxuICAgIGlmIChpc0FycmF5KG9iaikpIHtcbiAgICAgIC8vIFNlcmlhbGl6ZSBhcnJheSBpdGVtLlxuICAgICAgZm9yIChpID0gMDsgb2JqICYmIGkgPCBvYmoubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdiA9IG9ialtpXVxuICAgICAgICBpZiAodHJhZGl0aW9uYWwgfHwgcmJyYWNrZXQudGVzdChwcmVmaXgpKSB7XG4gICAgICAgICAgLy8gVHJlYXQgZWFjaCBhcnJheSBpdGVtIGFzIGEgc2NhbGFyLlxuICAgICAgICAgIGFkZChwcmVmaXgsIHYpXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgYnVpbGRQYXJhbXMocHJlZml4ICsgJ1snICsgKHR5cGVvZiB2ID09PSAnb2JqZWN0JyA/IGkgOiAnJykgKyAnXScsIHYsIHRyYWRpdGlvbmFsLCBhZGQpXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKG9iaiAmJiBvYmoudG9TdHJpbmcoKSA9PT0gJ1tvYmplY3QgT2JqZWN0XScpIHtcbiAgICAgIC8vIFNlcmlhbGl6ZSBvYmplY3QgaXRlbS5cbiAgICAgIGZvciAobmFtZSBpbiBvYmopIHtcbiAgICAgICAgYnVpbGRQYXJhbXMocHJlZml4ICsgJ1snICsgbmFtZSArICddJywgb2JqW25hbWVdLCB0cmFkaXRpb25hbCwgYWRkKVxuICAgICAgfVxuXG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIFNlcmlhbGl6ZSBzY2FsYXIgaXRlbS5cbiAgICAgIGFkZChwcmVmaXgsIG9iailcbiAgICB9XG4gIH1cblxuICByZXF3ZXN0LmdldGNhbGxiYWNrUHJlZml4ID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBjYWxsYmFja1ByZWZpeFxuICB9XG5cbiAgLy8galF1ZXJ5IGFuZCBaZXB0byBjb21wYXRpYmlsaXR5LCBkaWZmZXJlbmNlcyBjYW4gYmUgcmVtYXBwZWQgaGVyZSBzbyB5b3UgY2FuIGNhbGxcbiAgLy8gLmFqYXguY29tcGF0KG9wdGlvbnMsIGNhbGxiYWNrKVxuICByZXF3ZXN0LmNvbXBhdCA9IGZ1bmN0aW9uIChvLCBmbikge1xuICAgIGlmIChvKSB7XG4gICAgICBvWyd0eXBlJ10gJiYgKG9bJ21ldGhvZCddID0gb1sndHlwZSddKSAmJiBkZWxldGUgb1sndHlwZSddXG4gICAgICBvWydkYXRhVHlwZSddICYmIChvWyd0eXBlJ10gPSBvWydkYXRhVHlwZSddKVxuICAgICAgb1snanNvbnBDYWxsYmFjayddICYmIChvWydqc29ucENhbGxiYWNrTmFtZSddID0gb1snanNvbnBDYWxsYmFjayddKSAmJiBkZWxldGUgb1snanNvbnBDYWxsYmFjayddXG4gICAgICBvWydqc29ucCddICYmIChvWydqc29ucENhbGxiYWNrJ10gPSBvWydqc29ucCddKVxuICAgIH1cbiAgICByZXR1cm4gbmV3IFJlcXdlc3QobywgZm4pXG4gIH1cblxuICByZXF3ZXN0LmFqYXhTZXR1cCA9IGZ1bmN0aW9uIChvcHRpb25zKSB7XG4gICAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge31cbiAgICBmb3IgKHZhciBrIGluIG9wdGlvbnMpIHtcbiAgICAgIGdsb2JhbFNldHVwT3B0aW9uc1trXSA9IG9wdGlvbnNba11cbiAgICB9XG4gIH1cblxuICByZXR1cm4gcmVxd2VzdFxufSk7XG4iLCJcbi8qKlxuICogTW9kdWxlIGV4cG9ydHMuXG4gKi9cblxubW9kdWxlLmV4cG9ydHMgPSB0aHJvdHRsZTtcblxuLyoqXG4gKiBSZXR1cm5zIGEgbmV3IGZ1bmN0aW9uIHRoYXQsIHdoZW4gaW52b2tlZCwgaW52b2tlcyBgZnVuY2AgYXQgbW9zdCBgbWF4YCB0aW1lcyBwZXJcbiAqIGB3YWl0YCBtaWxsaXNlY29uZHMuXG4gKlxuICogQHBhcmFtIHtGdW5jdGlvbn0gZnVuYyBUaGUgYEZ1bmN0aW9uYCBpbnN0YW5jZSB0byB3cmFwLlxuICogQHBhcmFtIHtOdW1iZXJ9IHdhaXQgVGhlIG1pbmltdW0gbnVtYmVyIG9mIG1pbGxpc2Vjb25kcyB0aGF0IG11c3QgZWxhcHNlIGluIGJldHdlZW4gYG1heGAgYGZ1bmNgIGludm9jYXRpb25zLlxuICogQHBhcmFtIHtOdW1iZXJ9IG1heCBUaGUgbWF4aW11bSBudW1iZXIgb2YgdGltZXMgYGZ1bmNgIG1heSBiZSBpbnZva2VkIGJldHdlZW4gYHdhaXRgIG1pbGxpc2Vjb25kcy5cbiAqIEByZXR1cm4ge0Z1bmN0aW9ufSBBIG5ldyBmdW5jdGlvbiB0aGF0IHdyYXBzIHRoZSBgZnVuY2AgZnVuY3Rpb24gcGFzc2VkIGluLlxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5mdW5jdGlvbiB0aHJvdHRsZSAoZnVuYywgd2FpdCwgbWF4KSB7XG4gIG1heCA9IG1heCB8fCAxO1xuICB2YXIgcnRuOyAvLyByZXR1cm4gdmFsdWVcbiAgdmFyIGxhc3QgPSAwOyAvLyBsYXN0IGludm9rYXRpb24gdGltZXN0YW1wXG4gIHZhciBjb3VudCA9IDA7IC8vIG51bWJlciBvZiB0aW1lcyBpbnZva2VkXG4gIHJldHVybiBmdW5jdGlvbiB0aHJvdHRsZWQgKCkge1xuICAgIHZhciBub3cgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcbiAgICB2YXIgZGVsdGEgPSBub3cgLSBsYXN0O1xuICAgIGlmIChkZWx0YSA+PSB3YWl0KSB7IC8vIHJlc2V0XG4gICAgICBsYXN0ID0gbm93O1xuICAgICAgY291bnQgPSAwO1xuICAgIH1cbiAgICBpZiAoY291bnQrKyA8IG1heCkgcnRuID0gZnVuYy5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIHJldHVybiBydG47XG4gIH07XG59XG4iLCJtb2R1bGUuZXhwb3J0cz17XG4gICAgXCJkYXRhVXJsXCI6IFwiL2RhdGEvZGF0YS5jc3ZcIixcbiAgICBcImhpc3RvZ3JhbUJnXCI6IFwicmdiYSgyMCwyMCwyMCwwLjgpI2M4NTIyMVwiLFxuICAgIFwib3V0c2tpcnRzQ29sb3JcIjogXCIjMDBhMGZmXCIsXG4gICAgXCJjZW50ZXJDb2xvclwiOiBcIiNkNDc5MmJcIixcbiAgICBcIm9wYWNpdHlcIjogMC43LFxuICAgIFwiY2VudGVyXCI6IFs1NS43NDU1ODkxLCAzNy42MTkzNjI5XSxcbiAgICBcInpvb21cIjogMTEsXG4gICAgXCJtYXBib3hLZXlcIjogXCJway5leUoxSWpvaWR6aHlJaXdpWVNJNklsRjJObGg2UVZraWZRLkQ3QmttZW9NSTdHRWtNRHRnM2R1cndcIixcbiAgICBcIm1hcGJveElkXCI6IFwiZXhhbXBsZXMubWFwLTIwdjY2MTFrXCJcbn1cbiIsIihmdW5jdGlvbiAoZ2xvYmFsKXtcblwidXNlIHN0cmljdFwiO1xuXG52YXIgcmVxd2VzdCA9IGdsb2JhbC5yZXF3ZXN0ID0gcmVxdWlyZSgncmVxd2VzdCcpO1xudmFyIFRpbWVDb250cm9sID0gcmVxdWlyZSgnLi90aW1lY29udHJvbCcpO1xudmFyIE1hcCA9IHJlcXVpcmUoJy4vbWFwJyk7XG5cbi8qKlxuICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnNcbiAqIEBjb25zdHJ1Y3RvclxuICovXG5mdW5jdGlvbiBBcHAob3B0aW9ucykge1xuXG4gICAgLyoqXG4gICAgICogQHR5cGUge09iamVjdH1cbiAgICAgKi9cbiAgICB0aGlzLm9wdGlvbnMgPSBvcHRpb25zO1xuXG4gICAgLyoqXG4gICAgICogQHR5cGUge0FycmF5LjxPYmplY3Q+fVxuICAgICAqL1xuICAgIHRoaXMuX2RhdGEgPSBudWxsO1xuXG4gICAgLyoqXG4gICAgICogQHR5cGUge0hpc3RvZ3JhbX1cbiAgICAgKi9cbiAgICB0aGlzLl9oaXN0b2dyYW0gPSBudWxsO1xuXG4gICAgLyoqXG4gICAgICogQHR5cGUge01hcH1cbiAgICAgKi9cbiAgICB0aGlzLl9tYXAgPSBuZXcgTWFwKCdtYXAnLCB7XG4gICAgICAgIG1hcGJveElkOiBvcHRpb25zLm1hcGJveElkLFxuICAgICAgICBtYXBib3hLZXk6IG9wdGlvbnMubWFwYm94S2V5XG4gICAgfSkuc2V0VmlldyhvcHRpb25zLmNlbnRlciwgb3B0aW9ucy56b29tKTtcblxuICAgIHRoaXMuZ2V0RGF0YShvcHRpb25zLmRhdGFVcmwsIHRoaXMub25EYXRhUmVjZWl2ZWQuYmluZCh0aGlzKSk7XG59O1xuXG4vKipcbiAqIEBwYXJhbSAge1N0cmluZ30gICB1cmxcbiAqIEBwYXJhbSAge0Z1bmN0aW9ufSBjYWxsYmFja1xuICovXG5BcHAucHJvdG90eXBlLmdldERhdGEgPSBmdW5jdGlvbih1cmwsIGNhbGxiYWNrKSB7XG4gICAgcmVxd2VzdCh7XG4gICAgICAgIHVybDogdXJsLFxuICAgICAgICBjcm9zc09yaWdpbjogdHJ1ZSxcbiAgICAgICAgd2l0aENyZWRlbnRpYWxzOiB0cnVlLFxuICAgICAgICAvL2NvbnRlbnRUeXBlOiAndGV4dC9jc3YnLFxuICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbihyZXNwb25zZSkge1xuICAgICAgICAgICAgLy8gd2VpcmQgczMvbG9jYWxob3N0IGludGVyY2hhbmdhYmlsaXR5XG4gICAgICAgICAgICBpZiAodHlwZW9mIHJlc3BvbnNlICE9PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgICAgIHJlc3BvbnNlID0gcmVzcG9uc2UucmVzcG9uc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjYWxsYmFjayhyZXNwb25zZSk7XG4gICAgICAgIH1cbiAgICB9KTtcbn07XG5cbi8qKlxuICogQHBhcmFtICB7U3RyaW5nfSBkYXRhXG4gKi9cbkFwcC5wcm90b3R5cGUub25EYXRhUmVjZWl2ZWQgPSBmdW5jdGlvbihkYXRhKSB7XG4gICAgdGhpcy5fZGF0YSA9IHRoaXMucGFyc2UoZGF0YSk7XG5cbiAgICB0aGlzLl90aW1lQ29udHJvbCA9IG5ldyBUaW1lQ29udHJvbCh0aGlzLl9kYXRhLCB0aGlzLm9wdGlvbnMpXG4gICAgICAgIC5hZGRUbyh0aGlzLl9tYXApO1xufTtcblxuLyoqXG4gKiBAcGFyYW0gIHtTdHJpbmd9IGNzdlxuICogQHJldHVybiB7QXJyYXkuPE9iamVjdD59XG4gKi9cbkFwcC5wcm90b3R5cGUucGFyc2UgPSBmdW5jdGlvbihjc3YpIHtcbiAgICBjc3YgPSBjc3Yuc3BsaXQoL1xcbi9nKTtcblxuICAgIHZhciBoZWFkZXJzID0gY3N2WzBdLnNwbGl0KCc7JyksXG4gICAgICAgIGRhdGEgPSBbXSxcbiAgICAgICAgY2VudGVyID0gMCxcbiAgICAgICAgb3V0c2tpcnRzID0gMCxcbiAgICAgICAgbWF4Q2VudGVyID0gMCxcbiAgICAgICAgbWF4T3V0c2tpcnRzID0gMCxcbiAgICAgICAgZGF5RGF0YSwgZGF0ZSxcbiAgICAgICAgcm93U3RyLCByb3c7XG5cbiAgICBjc3YgPSAoJ1xcbicgKyBjc3Yuc2xpY2UoMSwgY3N2Lmxlbmd0aCkuam9pbignXFxuJykpXG4gICAgICAgIC5zcGxpdCgvXFxuKDo/XFxkezJ9LlxcZHsyfS5cXGR7NH1cXDspL2cpO1xuXG4gICAgZm9yICh2YXIgaSA9IDIsIGlpID0gY3N2Lmxlbmd0aDsgaSA8IGlpOyBpICs9IDIpIHtcbiAgICAgICAgcm93ID0ge307XG4gICAgICAgIHJvd1N0ciA9IChjc3ZbaSAtIDFdICsgY3N2W2ldKS5zcGxpdCgvXFw7L2cpO1xuXG4gICAgICAgIGZvciAodmFyIGogPSAwLCBqaiA9IHJvd1N0ci5sZW5ndGg7IGogPCBqajsgaisrKSB7XG4gICAgICAgICAgICBpZiAoL14obGF0fGxvbmcpLy50ZXN0KGhlYWRlcnNbal0pKSB7XG4gICAgICAgICAgICAgICAgcm93U3RyW2pdID0gcGFyc2VGbG9hdChyb3dTdHJbal0ucmVwbGFjZSgnLCcsICcuJykpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcm93W2hlYWRlcnNbal1dID0gcm93U3RyW2pdO1xuICAgICAgICB9XG4gICAgICAgIGRhdGEucHVzaChyb3cpO1xuICAgIH1cblxuICAgIHJldHVybiBkYXRhXG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IEFwcDtcblxufSkuY2FsbCh0aGlzLHR5cGVvZiBnbG9iYWwgIT09IFwidW5kZWZpbmVkXCIgPyBnbG9iYWwgOiB0eXBlb2Ygc2VsZiAhPT0gXCJ1bmRlZmluZWRcIiA/IHNlbGYgOiB0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93IDoge30pIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBMID0gcmVxdWlyZSgnbGVhZmxldCcpO1xuXG5MLkR5bmFtaWNMYXllciA9IEwuQ2xhc3MuZXh0ZW5kKHtcblxuICAgIC8vIG9wdGlvbnM6IHtcbiAgICAvLyAgICAgbWF4Wm9vbTogMTgsXG4gICAgLy8gICAgIHJhZGl1czogMjUsXG4gICAgLy8gICAgIG1heDogMS4wXG4gICAgLy8gfSxcblxuICAgIGluaXRpYWxpemU6IGZ1bmN0aW9uKGRhdGEsIHJlbmRlcmVyLCBvcHRpb25zKSB7XG4gICAgICAgIHRoaXMuX2RhdGEgPSBkYXRhO1xuICAgICAgICB0aGlzLl9yZW5kZXJlciA9IHJlbmRlcmVyO1xuICAgICAgICBMLnNldE9wdGlvbnModGhpcywgb3B0aW9ucyk7XG4gICAgfSxcblxuICAgIHNldERhdGE6IGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgdGhpcy5fZGF0YSA9IGRhdGE7XG4gICAgICAgIHJldHVybiB0aGlzLnJlZHJhdygpO1xuICAgIH0sXG5cbiAgICBhZGRQb2ludDogZnVuY3Rpb24ocG9pbnQpIHtcbiAgICAgICAgdGhpcy5fZGF0YS5wdXNoKHBvaW50KTtcbiAgICAgICAgcmV0dXJuIHRoaXMucmVkcmF3KCk7XG4gICAgfSxcblxuICAgIHJlbW92ZVBvaW50OiBmdW5jdGlvbihwb2ludCkge1xuICAgICAgICB0aGlzLl9kYXRhLnNwbGljZSh0aGlzLl9kYXRhLmluZGV4T2YocG9pbnQpLCAxKTtcbiAgICAgICAgcmV0dXJuIHRoaXMucmVkcmF3KCk7XG4gICAgfSxcblxuICAgIHNldE9wdGlvbnM6IGZ1bmN0aW9uKG9wdGlvbnMpIHtcbiAgICAgICAgTC5zZXRPcHRpb25zKHRoaXMsIG9wdGlvbnMpO1xuICAgICAgICBpZiAodGhpcy5fcmVuZGVyZXIpIHtcbiAgICAgICAgICAgIHRoaXMuX3VwZGF0ZU9wdGlvbnMoKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5yZWRyYXcoKTtcbiAgICB9LFxuXG4gICAgcmVkcmF3OiBmdW5jdGlvbigpIHtcbiAgICAgICAgaWYgKHRoaXMuX3JlbmRlcmVyICYmICF0aGlzLl9mcmFtZSAmJiAhdGhpcy5fbWFwLl9hbmltYXRpbmcpIHtcbiAgICAgICAgICAgIHRoaXMuX2ZyYW1lID0gTC5VdGlsLnJlcXVlc3RBbmltRnJhbWUodGhpcy5fcmVkcmF3LCB0aGlzKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuXG4gICAgb25BZGQ6IGZ1bmN0aW9uKG1hcCkge1xuICAgICAgICB0aGlzLl9tYXAgPSBtYXA7XG5cbiAgICAgICAgaWYgKCF0aGlzLl9jYW52YXMpIHtcbiAgICAgICAgICAgIHRoaXMuX2luaXRDYW52YXMoKTtcbiAgICAgICAgICAgIHRoaXMuX3JlbmRlcmVyLmNhbnZhcyh0aGlzLl9jYW52YXMpO1xuICAgICAgICB9XG5cbiAgICAgICAgbWFwLl9wYW5lcy5vdmVybGF5UGFuZS5hcHBlbmRDaGlsZCh0aGlzLl9jYW52YXMpO1xuXG4gICAgICAgIG1hcC5vbignbW92ZWVuZCcsIHRoaXMuX3Jlc2V0LCB0aGlzKTtcbiAgICAgICAgbWFwLm9uKCd6b29tc3RhcnQnLCB0aGlzLl9zdG9wUmVuZGVyaW5nLCB0aGlzKTtcblxuICAgICAgICBpZiAobWFwLm9wdGlvbnMuem9vbUFuaW1hdGlvbiAmJiBMLkJyb3dzZXIuYW55M2QpIHtcbiAgICAgICAgICAgIG1hcC5vbignem9vbWFuaW0nLCB0aGlzLl9hbmltYXRlWm9vbSwgdGhpcyk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLl9yZXNldCgpO1xuICAgIH0sXG5cbiAgICBvblJlbW92ZTogZnVuY3Rpb24obWFwKSB7XG4gICAgICAgIG1hcC5nZXRQYW5lcygpLm92ZXJsYXlQYW5lLnJlbW92ZUNoaWxkKHRoaXMuX2NhbnZhcyk7XG4gICAgICAgIHRoaXMuX3N0b3BSZW5kZXJpbmcoKTtcblxuICAgICAgICBtYXAub2ZmKCdtb3ZlZW5kJywgdGhpcy5fcmVzZXQsIHRoaXMpO1xuICAgICAgICBtYXAub2ZmKCd6b29tc3RhcnQnLCB0aGlzLl9zdG9wUmVuZGVyaW5nLCB0aGlzKTtcblxuICAgICAgICBpZiAobWFwLm9wdGlvbnMuem9vbUFuaW1hdGlvbikge1xuICAgICAgICAgICAgbWFwLm9mZignem9vbWFuaW0nLCB0aGlzLl9hbmltYXRlWm9vbSwgdGhpcyk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgYWRkVG86IGZ1bmN0aW9uKG1hcCkge1xuICAgICAgICBtYXAuYWRkTGF5ZXIodGhpcyk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG5cbiAgICBfaW5pdENhbnZhczogZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBjYW52YXMgPSB0aGlzLl9jYW52YXMgPVxuICAgICAgICAgICAgTC5Eb21VdGlsLmNyZWF0ZSgnY2FudmFzJywgJ2xlYWZsZXQtZHluYW1pYy1sYXllciBsZWFmbGV0LWxheWVyJyk7XG5cbiAgICAgICAgdmFyIHNpemUgPSB0aGlzLl9tYXAuZ2V0U2l6ZSgpO1xuICAgICAgICBjYW52YXMud2lkdGggPSBzaXplLng7XG4gICAgICAgIGNhbnZhcy5oZWlnaHQgPSBzaXplLnk7XG5cbiAgICAgICAgdmFyIGFuaW1hdGVkID0gdGhpcy5fbWFwLm9wdGlvbnMuem9vbUFuaW1hdGlvbiAmJiBMLkJyb3dzZXIuYW55M2Q7XG4gICAgICAgIEwuRG9tVXRpbC5hZGRDbGFzcyhjYW52YXMsICdsZWFmbGV0LXpvb20tJyArXG4gICAgICAgICAgICAoYW5pbWF0ZWQgPyAnYW5pbWF0ZWQnIDogJ2hpZGUnKSk7XG5cbiAgICAgICAgdGhpcy5fcmVuZGVyZXIuY2FudmFzKHRoaXMuX2NhbnZhcyk7XG4gICAgICAgIHRoaXMuX3VwZGF0ZU9wdGlvbnMoKTtcbiAgICB9LFxuXG4gICAgX3VwZGF0ZU9wdGlvbnM6IGZ1bmN0aW9uKCkge1xuICAgICAgICAvLyBhbmltYXRpb24gaGVyZVxuICAgICAgICB0aGlzLl9yZXNldCgpO1xuICAgIH0sXG5cbiAgICBfcmVzZXQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgdG9wTGVmdCA9IHRoaXMuX21hcC5jb250YWluZXJQb2ludFRvTGF5ZXJQb2ludChbMCwgMF0pO1xuICAgICAgICBMLkRvbVV0aWwuc2V0UG9zaXRpb24odGhpcy5fY2FudmFzLCB0b3BMZWZ0KTtcblxuICAgICAgICB2YXIgc2l6ZSA9IHRoaXMuX21hcC5nZXRTaXplKCk7XG5cbiAgICAgICAgdGhpcy5fY2FudmFzLndpZHRoID0gc2l6ZS54O1xuICAgICAgICB0aGlzLl9jYW52YXMuaGVpZ2h0ID0gc2l6ZS55O1xuXG4gICAgICAgIHRoaXMuX3JlbmRlcmVyLnVwZGF0ZSgpO1xuXG4gICAgICAgIHRoaXMuX21vdmVkID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5fcmVkcmF3KCk7XG4gICAgfSxcblxuICAgIF9yZWRyYXc6IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgaSwgbGVuLCBwb2ludCwgZGF0YSA9IFtdLFxuICAgICAgICAgICAgciA9IDIwLFxuICAgICAgICAgICAgbW92ZWQgPSB0aGlzLl9tb3ZlZCxcbiAgICAgICAgICAgIHNpemUgPSB0aGlzLl9tYXAuZ2V0U2l6ZSgpLFxuICAgICAgICAgICAgYm91bmRzID0gbmV3IEwuTGF0TG5nQm91bmRzKFxuICAgICAgICAgICAgICAgIHRoaXMuX21hcC5jb250YWluZXJQb2ludFRvTGF0TG5nKEwucG9pbnQoWy1yLCAtcl0pKSxcbiAgICAgICAgICAgICAgICB0aGlzLl9tYXAuY29udGFpbmVyUG9pbnRUb0xhdExuZyhzaXplLmFkZChbciwgcl0pKSksXG4gICAgICAgICAgICBwb2ludHNUb1JlbmRlciA9IDA7XG5cbiAgICAgICAgZm9yIChpID0gMCwgbGVuID0gdGhpcy5fZGF0YS5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgICAgICAgcG9pbnQgPSB0aGlzLl9kYXRhW2ldO1xuICAgICAgICAgICAgaWYgKGJvdW5kcy5jb250YWlucyhwb2ludC5sYXRsbmcpKSB7XG4gICAgICAgICAgICAgICAgaWYgKCEoJ3B4JyBpbiBwb2ludCkgfHwgbW92ZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgcG9pbnQucHggPSB0aGlzLl9tYXAubGF0TG5nVG9Db250YWluZXJQb2ludChwb2ludC5sYXRsbmcpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmICghdGhpcy5fcmVuZGVyZXIucG9pbnRJc1JlbmRlcmVkKHBvaW50KSkge1xuICAgICAgICAgICAgICAgICAgICBwb2ludCA9IHRoaXMuX3JlbmRlcmVyLnByZXJlbmRlcihwb2ludCk7XG4gICAgICAgICAgICAgICAgICAgIHBvaW50c1RvUmVuZGVyKys7XG4gICAgICAgICAgICAgICAgICAgIGRhdGEucHVzaChwb2ludCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChwb2ludC5hY3RpdmUpIHtcbiAgICAgICAgICAgICAgICAgICAgZGF0YS5wdXNoKHBvaW50KTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcG9pbnQub3BhY2l0eSA9IHBvaW50LnJhZGl1cyA9IDA7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5fcmVuZGVyZXIuZHJhdyhkYXRhKTtcbiAgICAgICAgdGhpcy5fZnJhbWUgPSB0aGlzLl9tb3ZlZCA9IG51bGw7XG5cbiAgICAgICAgaWYgKHBvaW50c1RvUmVuZGVyKSB7XG4gICAgICAgICAgICB0aGlzLnJlZHJhdygpO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIF9zdG9wUmVuZGVyaW5nOiBmdW5jdGlvbigpIHtcbiAgICAgICAgTC5VdGlsLmNhbmNlbEFuaW1GcmFtZSh0aGlzLl9mcmFtZSk7XG4gICAgICAgIHRoaXMuX2ZyYW1lID0gbnVsbDtcbiAgICB9LFxuXG4gICAgX2FuaW1hdGVab29tOiBmdW5jdGlvbihlKSB7XG4gICAgICAgIHZhciBzY2FsZSA9IHRoaXMuX21hcC5nZXRab29tU2NhbGUoZS56b29tKSxcbiAgICAgICAgICAgIG9mZnNldCA9IHRoaXMuX21hcC5fZ2V0Q2VudGVyT2Zmc2V0KGUuY2VudGVyKVxuICAgICAgICAgICAgLl9tdWx0aXBseUJ5KC1zY2FsZSlcbiAgICAgICAgICAgIC5zdWJ0cmFjdCh0aGlzLl9tYXAuX2dldE1hcFBhbmVQb3MoKSk7XG5cbiAgICAgICAgdGhpcy5fY2FudmFzLnN0eWxlW0wuRG9tVXRpbC5UUkFOU0ZPUk1dID1cbiAgICAgICAgICAgIEwuRG9tVXRpbC5nZXRUcmFuc2xhdGVTdHJpbmcob2Zmc2V0KSArICcgc2NhbGUoJyArIHNjYWxlICsgJyknO1xuICAgIH1cbn0pO1xuXG4vLyBmYWN0b3J5XG5MLmR5bmFtaWNMYXllciA9IGZ1bmN0aW9uKGRhdGEsIG9wdGlvbnMpIHtcbiAgICByZXR1cm4gbmV3IEwuRHluYW1pY0xheWVyKGRhdGEsIG9wdGlvbnMpO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBMLkR5bmFtaWNMYXllcjtcbiIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgeG1sbnMgPSBcImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCI7XG52YXIgdGhyb3R0bGUgPSByZXF1aXJlKCd0aHJvdHRsZWl0Jyk7XG52YXIgbWluID0gTWF0aC5taW4sXG4gICAgbWF4ID0gTWF0aC5tYXgsXG4gICAgYWJzID0gTWF0aC5hYnMsXG4gICAgcm91bmQgPSBNYXRoLnJvdW5kLFxuICAgIGZsb29yID0gTWF0aC5mbG9vcjtcblxudmFyIE1PTlRIUyA9ICdKYW4gRmViIE1hciBBcHIgTWF5IEp1biBKdWwgQXVnIFNlcCBPY3QgTm92IERlYycuc3BsaXQoJyAnKTtcblxuLyoqXG4gKiBERC5NTS5ZWVlZIC0+IE1NIFlZXG4gKiBAcGFyYW0gIHtTdHJpbmd9IGRhdGVcbiAqIEByZXR1cm4ge1N0cmluZ31cbiAqL1xuZnVuY3Rpb24gZm9ybWF0RGF0ZShkYXRlKSB7XG4gICAgcmV0dXJuIGRhdGUucmVwbGFjZSgvKFxcZHsyfSlcXC4oXFxkezJ9KVxcLihcXGR7NH0pJC9nLCBmdW5jdGlvbihkYXRlLCBkLCBtLCB5KSB7XG4gICAgICAgIHJldHVybiAnJm5ic3A7JyArIGQgKyAnICcgKyBNT05USFNbcGFyc2VJbnQobSldICsgJyZuYnNwOyc7XG4gICAgfSk7XG59XG5cbi8qKlxuICogSGlzdG9ncmFtXG4gKiBAcGFyYW0ge0FycmF5LjxPYmplY3Q+fSBkYXRhXG4gKiBAcGFyYW0ge051bWJlcn0gICAgICAgICBtYXhZIEVhc2llciB0byBjYWxjdWxhdGUgdGhlbSBpbiBvbmUgZ28gd2hpbGUgcGFyc2luZ1xuICogQHBhcmFtIHtOdW1iZXJ9ICAgICAgICAgbWluWVxuICogQHBhcmFtIHtPYmplY3R9ICAgICAgICAgb3B0aW9uc1xuICogQGNvbnN0cnVjdG9yXG4gKi9cbmZ1bmN0aW9uIEhpc3RvZ3JhbShjb250YWluZXIsIGRhdGEsIG1heFksIG1pblksIG9wdGlvbnMpIHtcblxuICAgIC8qKlxuICAgICAqIFN0b3JlIHRoZSBkYXRhXG4gICAgICogQHR5cGUge0FycmF5LjxPYmplY3Q+fVxuICAgICAqL1xuICAgIHRoaXMuZGF0YSA9IGRhdGE7XG5cbiAgICAvKipcbiAgICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgICAqL1xuICAgIHRoaXMub3B0aW9ucyA9IG9wdGlvbnM7XG5cbiAgICAvKipcbiAgICAgKiBAdHlwZSB7Q2FudmFzfVxuICAgICAqL1xuICAgIHRoaXMuX2NvbnRhaW5lciA9IGNvbnRhaW5lcjtcblxuICAgIC8qKlxuICAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgICovXG4gICAgdGhpcy53ID0gcGFyc2VJbnQodGhpcy5fY29udGFpbmVyLmdldEF0dHJpYnV0ZU5TKG51bGwsICd3aWR0aCcpKTtcblxuICAgIC8qKlxuICAgICAqIENvcnJlY3QgYm90dG9tIHNwYWNlXG4gICAgICogQHR5cGUge051bWJlcn1cbiAgICAgKi9cbiAgICB0aGlzLmggPSBwYXJzZUludCh0aGlzLl9jb250YWluZXIuZ2V0QXR0cmlidXRlTlMobnVsbCwgJ2hlaWdodCcpIC0gNDApO1xuXG4gICAgLyoqXG4gICAgICogQHR5cGUge051bWJlcn1cbiAgICAgKi9cbiAgICB0aGlzLnBhZGRpbmcgPSBvcHRpb25zLnBhZGRpbmcgfHwgMTA7XG5cbiAgICAvKipcbiAgICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICAqL1xuICAgIHRoaXMub3BhY2l0eSA9IG9wdGlvbnMub3BhY2l0eSB8fCAwLjU7XG5cbiAgICAvKipcbiAgICAgKiBZIHN0ZXBcbiAgICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICAqL1xuICAgIHRoaXMuX2R5ID0gKHRoaXMuaCAtIHRoaXMucGFkZGluZyAqIDIpIC8gKE1hdGguYWJzKG1pblkpICsgTWF0aC5hYnMobWF4WSkpO1xuXG4gICAgLyoqXG4gICAgICogWCBzdGVwXG4gICAgICogQHR5cGUge051bWJlcn1cbiAgICAgKi9cbiAgICB0aGlzLl9keCA9ICh0aGlzLncgLSB0aGlzLnBhZGRpbmcgKiAyKSAvIGRhdGEucmVkdWNlKGZ1bmN0aW9uKGEsIGIpIHtcbiAgICAgICAgcmV0dXJuIE1hdGgubWF4KGEubGVuZ3RoLCBiLmxlbmd0aCk7XG4gICAgfSk7XG5cbiAgICAvKipcbiAgICAgKiBBeGlzIHBvcyBZXG4gICAgICogQHR5cGUge051bWJlcn1cbiAgICAgKi9cbiAgICB0aGlzLl9heGlzID0gdGhpcy5oIC0gdGhpcy5wYWRkaW5nIC1cbiAgICAgICAgdGhpcy5fZHkgKiBNYXRoLm1pbihNYXRoLmFicyhtYXhZKSwgTWF0aC5hYnMobWluWSkpO1xuXG4gICAgdGhpcy5yZW5kZXIoZGF0YSwgb3B0aW9ucy5jb2xvcnMsIG9wdGlvbnMuYmcpO1xuICAgIHRoaXMudXBkYXRlU3RhdHMgPSAvKnRocm90dGxlKCovIHRoaXMudXBkYXRlU3RhdHMuYmluZCh0aGlzKSAvKiwgNSkqLyA7XG4gICAgdGhpcy51cGRhdGUoKTtcbn07XG5cbi8qKlxuICogQHBhcmFtICB7QXJyYXkuPE9iamVjdD59IGRhdGFcbiAqIEBwYXJhbSAge0FycmF5LjxTdHJpbmc+fSBjb2xvcnNcbiAqL1xuSGlzdG9ncmFtLnByb3RvdHlwZS5yZW5kZXIgPSBmdW5jdGlvbihkYXRhLCBjb2xvcnMsIGJnKSB7XG4gICAgdmFyIGhhbmRsZXMgPSB0aGlzLl9jb250YWluZXIucXVlcnlTZWxlY3RvckFsbCgnLmhhbmRsZScpO1xuICAgIHRoaXMubGVmdEhhbmRsZSA9IGhhbmRsZXNbMF07XG4gICAgdGhpcy5yaWdodEhhbmRsZSA9IGhhbmRsZXNbMV07XG4gICAgdGhpcy5fY29udHJvbHMgPSB0aGlzLl9jb250YWluZXIucXVlcnlTZWxlY3RvcignLmNvbnRyb2xzJyk7XG5cbiAgICB0aGlzLmxlZnQgPSB0aGlzLnBhZGRpbmc7XG4gICAgdGhpcy5yaWdodCA9IHRoaXMudyAtIHRoaXMucGFkZGluZztcblxuICAgIHRoaXMuY2xpcCA9IHRoaXMuX2NvbnRhaW5lci5xdWVyeVNlbGVjdG9yKCcjY2xpcCcpO1xuXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBkYXRhLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHRoaXMuZHJhd0dyYXBoKGRhdGFbaV0sIDAsIGNvbG9yc1tpXSk7XG4gICAgfVxuXG4gICAgdGhpcy5kcmF3VG90YWwoKTtcbiAgICB0aGlzLmRyYXdEYXRlcyh0aGlzLmdldFN0YXJ0RGF0ZSgpLCB0aGlzLmdldEVuZERhdGUoKSk7XG4gICAgdGhpcy5kcmF3QXhpcyh0aGlzLm9wdGlvbnMuYXhpcyk7XG59O1xuXG4vKipcbiAqIERhdGUgdGV4dCBtYXJrZXJzXG4gKiBAcGFyYW0gIHtTdHJpbmd9IHN0YXJ0RGF0ZVxuICogQHBhcmFtICB7U3RyaW5nfSBlbmREYXRlXG4gKi9cbkhpc3RvZ3JhbS5wcm90b3R5cGUuZHJhd0RhdGVzID0gZnVuY3Rpb24oc3RhcnREYXRlLCBlbmREYXRlKSB7XG4gICAgdGhpcy5zdGFydFRleHQgPSB0aGlzLmNyZWF0ZVRleHQoJ2RhdGUgbGVmdCcsIHRoaXMubGVmdCxcbiAgICAgICAgdGhpcy5oLCB1bmRlZmluZWQsIGZvcm1hdERhdGUoc3RhcnREYXRlKSk7XG4gICAgdGhpcy5fY29udGFpbmVyLmluc2VydEJlZm9yZSh0aGlzLnN0YXJ0VGV4dCwgdGhpcy5fY29udHJvbHMpO1xuXG4gICAgdGhpcy5lbmRUZXh0ID0gdGhpcy5jcmVhdGVUZXh0KCdkYXRlIHJpZ2h0JywgdGhpcy5yaWdodCxcbiAgICAgICAgdGhpcy5oLCB1bmRlZmluZWQsIGZvcm1hdERhdGUoZW5kRGF0ZSkpO1xuICAgIHRoaXMuX2NvbnRhaW5lci5pbnNlcnRCZWZvcmUodGhpcy5lbmRUZXh0LCB0aGlzLl9jb250cm9scyk7XG59O1xuXG4vKipcbiAqIFRvdGFsIG51bWJlclxuICovXG5IaXN0b2dyYW0ucHJvdG90eXBlLmRyYXdUb3RhbCA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBlbGVtZW50ID0gdGhpcy5jcmVhdGVUZXh0KCdncmFwaC10b3RhbCBncmFwaC10b3RhbC1zdW0nLFxuICAgICAgICB0aGlzLncgLyAyLCB0aGlzLmggKyB0aGlzLnBhZGRpbmcgKiAyLjUsICdiYXNlbGluZScpO1xuICAgIHRoaXMuX2NvbnRhaW5lci5pbnNlcnRCZWZvcmUoZWxlbWVudCwgdGhpcy5fY29udHJvbHMpO1xuICAgIHRoaXMudG90YWxzLnB1c2goZWxlbWVudCk7XG59O1xuXG4vKipcbiAqIEhvcml6b250YWwgYXhpc1xuICogQHBhcmFtIHtTdHJpbmd9IGNvbG9yXG4gKiBAcGFyYW0ge051bWJlcn0gd2VpZ2h0XG4gKi9cbkhpc3RvZ3JhbS5wcm90b3R5cGUuZHJhd0F4aXMgPSBmdW5jdGlvbihvcHRpb25zKSB7XG4gICAgdmFyIGVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMoeG1sbnMsICdwYXRoJyk7XG4gICAgZWxlbWVudC5zZXRBdHRyaWJ1dGVOUyhudWxsLCAnZCcsIFtcbiAgICAgICAgXCJNXCIsIFt0aGlzLnBhZGRpbmcsIHRoaXMuX2F4aXNdLmpvaW4oJywnKSxcbiAgICAgICAgXCJMXCIsIFt0aGlzLncgLSB0aGlzLnBhZGRpbmcsIHRoaXMuX2F4aXNdLmpvaW4oJywnKSwgXCJaXCJcbiAgICBdLmpvaW4oJycpKTtcblxuICAgIGVsZW1lbnQuc2V0QXR0cmlidXRlTlMobnVsbCwgJ3N0cm9rZScsIG9wdGlvbnMuY29sb3IpO1xuICAgIGVsZW1lbnQuc2V0QXR0cmlidXRlTlMobnVsbCwgJ3N0cm9rZS13aWR0aCcsIG9wdGlvbnMud2VpZ2h0KTtcbiAgICBlbGVtZW50LnNldEF0dHJpYnV0ZU5TKG51bGwsICdzdHJva2Utb3BhY2l0eScsIG9wdGlvbnMub3BhY2l0eSk7XG4gICAgdGhpcy5fY29udGFpbmVyLmluc2VydEJlZm9yZShlbGVtZW50LCB0aGlzLl9jb250cm9scyk7XG59O1xuXG4vKipcbiAqIERyYXdzIGdyYXBoLCBuZWdhdGl2ZSBvciBwb3NpdGl2ZVxuICpcbiAqIEBwYXJhbSAge0FycmF5fSAgZGF0YVxuICogQHBhcmFtICB7TnVtYmVyfSBzbW9vdGhcbiAqIEBwYXJhbSAge1N0cmluZ30gY29sb3JcbiAqL1xuSGlzdG9ncmFtLnByb3RvdHlwZS5kcmF3R3JhcGggPSBmdW5jdGlvbihkYXRhLCBzbW9vdGgsIGNvbG9yKSB7XG4gICAgdmFyIGggPSB0aGlzLl9heGlzLFxuICAgICAgICB4ID0gdGhpcy5wYWRkaW5nLFxuICAgICAgICBtID0gMDtcblxuICAgIHZhciBlbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKHhtbG5zLCAncGF0aCcpLFxuICAgICAgICBwYXRoID0gW1wiTSBcIiwgW3gsIGhdLmpvaW4oJywnKV07XG5cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGRhdGEubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdmFyIGQgPSBkYXRhW2ldLnZhbHVlLFxuICAgICAgICAgICAgYmggPSBoIC0gdGhpcy5fZHkgKiBkO1xuICAgICAgICBwYXRoLnB1c2goXCJMXCIsIFt4ICs9IHRoaXMuX2R4LCBiaF0uam9pbignLCcpKTtcblxuICAgICAgICBpZiAoYWJzKGRhdGFbbV0udmFsdWUpIDwgYWJzKGQpKSB7XG4gICAgICAgICAgICBtID0gaTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBwYXRoLnB1c2goXCJMXCIsIFt4LCBoXS5qb2luKCcsJyksIFwiWlwiKTtcblxuICAgIG0gPSB0aGlzLl9heGlzIC0gKGRhdGFbbV0udmFsdWUgLyAyKSAqIHRoaXMuX2R5O1xuXG4gICAgZWxlbWVudC5zZXRBdHRyaWJ1dGVOUyhudWxsLCAnZCcsIHBhdGguam9pbignJykpO1xuICAgIGVsZW1lbnQuc2V0QXR0cmlidXRlTlMobnVsbCwgJ3N0cm9rZScsIGNvbG9yKTtcbiAgICBlbGVtZW50LnNldEF0dHJpYnV0ZU5TKG51bGwsICdmaWxsJywgY29sb3IpO1xuICAgIGVsZW1lbnQuc2V0QXR0cmlidXRlTlMobnVsbCwgJ2NsYXNzJywgJ2dyYXBoLWJhY2snKTtcblxuICAgIHRoaXMuX2NvbnRhaW5lci5pbnNlcnRCZWZvcmUoZWxlbWVudCwgdGhpcy5fY29udHJvbHMpO1xuXG4gICAgLy8gZnJvbnQgY29weVxuICAgIGVsZW1lbnQgPSBlbGVtZW50LmNsb25lTm9kZShlbGVtZW50LCB0cnVlKTtcbiAgICBlbGVtZW50LnNldEF0dHJpYnV0ZU5TKG51bGwsICdjbGlwLXBhdGgnLCAndXJsKCNjdXJyZW50KScpO1xuICAgIGVsZW1lbnQuc2V0QXR0cmlidXRlTlMobnVsbCwgJ2NsYXNzJywgJ2dyYXBoLWZyb250Jyk7XG4gICAgdGhpcy5fY29udGFpbmVyLmluc2VydEJlZm9yZShlbGVtZW50LCB0aGlzLl9jb250cm9scyk7XG5cbiAgICBlbGVtZW50ID0gdGhpcy5jcmVhdGVUZXh0KCdncmFwaC10b3RhbCcsIHRoaXMudyAvIDIsIG0pO1xuICAgIHRoaXMuX2NvbnRhaW5lci5pbnNlcnRCZWZvcmUoZWxlbWVudCwgdGhpcy5fY29udHJvbHMpO1xuICAgIHRoaXMudG90YWxzID0gdGhpcy50b3RhbHMgfHwgW107XG4gICAgdGhpcy50b3RhbHMucHVzaChlbGVtZW50KTtcbn07XG5cbi8qKlxuICogQ3JlYXRlcyB0ZXh0IG9uIGdyYXBoXG4gKlxuICogQHBhcmFtICB7U3RyaW5nfSAgY2xhc3NOYW1lXG4gKiBAcGFyYW0gIHtOdW1iZXJ9ICB4XG4gKiBAcGFyYW0gIHtOdW1iZXJ9ICB5XG4gKiBAcGFyYW0gIHtTdHJpbmc9fSB0ZXh0QW5jaG9yXG4gKiBAcGFyYW0gIHtTdHJpbmc9fSBhbGlnblxuICogQHBhcmFtICB7U3RyaW5nPX0gdGV4dFxuICpcbiAqIEByZXR1cm4ge1NWR1RleHRFbGVtZW50fVxuICovXG5IaXN0b2dyYW0ucHJvdG90eXBlLmNyZWF0ZVRleHQgPSBmdW5jdGlvbihjbGFzc05hbWUsIHgsIHksIGFsaWduLCB0ZXh0KSB7XG4gICAgdmFyIGVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMoeG1sbnMsICd0ZXh0Jyk7XG5cbiAgICBlbGVtZW50LnNldEF0dHJpYnV0ZU5TKG51bGwsICdjbGFzcycsIGNsYXNzTmFtZSk7XG4gICAgZWxlbWVudC5zZXRBdHRyaWJ1dGVOUyhudWxsLCAnZG9taW5hbnQtYmFzZWxpbmUnLCBhbGlnbiB8fCAnY2VudHJhbCcpO1xuICAgIGVsZW1lbnQuc2V0QXR0cmlidXRlTlMobnVsbCwgJ3gnLCB4KTtcbiAgICBlbGVtZW50LnNldEF0dHJpYnV0ZU5TKG51bGwsICd5JywgeSk7XG5cbiAgICBpZiAodGV4dCkge1xuICAgICAgICBlbGVtZW50LmlubmVySFRNTCA9IHRleHQ7XG4gICAgfVxuXG4gICAgcmV0dXJuIGVsZW1lbnQ7XG59O1xuXG4vKipcbiAqIEBwYXJhbSAge051bWJlcn0gcG9zXG4gKi9cbkhpc3RvZ3JhbS5wcm90b3R5cGUubW92ZUxlZnRIYW5kbGUgPSBmdW5jdGlvbihwb3MpIHtcbiAgICB2YXIgdyA9IHRoaXMudyxcbiAgICAgICAgcGFkZGluZyA9IHRoaXMucGFkZGluZyxcbiAgICAgICAgdGV4dFdpZHRoID0gdGhpcy50ZXh0V2lkdGggPSB0aGlzLnRleHRXaWR0aCB8fCB0aGlzLnN0YXJ0VGV4dC5vZmZzZXRXaWR0aCxcbiAgICAgICAgcG9zO1xuICAgIHRoaXMubGVmdCA9IG1heChwYWRkaW5nLCBtaW4odGhpcy5yaWdodCAtIHRoaXMuX2R4LCBwb3MpKTtcbiAgICBwb3MgPSAodGhpcy5sZWZ0IC0gcGFkZGluZyk7XG4gICAgdGhpcy5sZWZ0SGFuZGxlLnNldEF0dHJpYnV0ZU5TKG51bGwsICd0cmFuc2Zvcm0nLFxuICAgICAgICAndHJhbnNsYXRlKCcgKyBwb3MgKyAnLDApJyk7XG5cbiAgICAvLyBtb3ZlIHRleHRcbiAgICBwb3MgPSBwb3MgLSB0ZXh0V2lkdGg7XG4gICAgaWYgKHBvcyA8IDApIHtcbiAgICAgICAgcG9zICs9IHRleHRXaWR0aDtcbiAgICB9XG5cbiAgICB0aGlzLnN0YXJ0VGV4dC5pbm5lckhUTUwgPSBmb3JtYXREYXRlKHRoaXMuZ2V0U3RhcnREYXRlKCkpO1xuICAgIHRoaXMuc3RhcnRUZXh0LnNldEF0dHJpYnV0ZU5TKG51bGwsICd0cmFuc2Zvcm0nLCAndHJhbnNsYXRlKCcgKyBwb3MgKyAnLDApJyk7XG4gICAgdGhpcy51cGRhdGUoKTtcbn07XG5cbi8qKlxuICogQHBhcmFtICB7TnVtYmVyfSBwb3NcbiAqL1xuSGlzdG9ncmFtLnByb3RvdHlwZS5tb3ZlUmlnaHRIYW5kbGUgPSBmdW5jdGlvbihwb3MpIHtcbiAgICB2YXIgdyA9IHRoaXMudyxcbiAgICAgICAgcGFkZGluZyA9IHRoaXMucGFkZGluZyxcbiAgICAgICAgdGV4dFdpZHRoID0gdGhpcy50ZXh0V2lkdGggPSB0aGlzLnRleHRXaWR0aCB8fCB0aGlzLnN0YXJ0VGV4dC5vZmZzZXRXaWR0aCxcbiAgICAgICAgcG9zO1xuICAgIHRoaXMucmlnaHQgPSBtaW4odyAtIHBhZGRpbmcsIG1heChwb3MsIHRoaXMubGVmdCArIHRoaXMuX2R4KSk7XG4gICAgcG9zID0gKHRoaXMucmlnaHQgLSB3ICsgcGFkZGluZyk7XG4gICAgdGhpcy5yaWdodEhhbmRsZS5zZXRBdHRyaWJ1dGVOUyhudWxsLCAndHJhbnNmb3JtJyxcbiAgICAgICAgJ3RyYW5zbGF0ZSgnICsgcG9zICsgJywwKScpO1xuXG4gICAgcG9zICs9IHRleHRXaWR0aDtcbiAgICAvLyBtb3ZlIHRleHRcbiAgICBpZiAoKHcgKyBwb3MpID4gKHcpKSB7XG4gICAgICAgIHBvcyAtPSB0ZXh0V2lkdGg7XG4gICAgfVxuXG4gICAgdGhpcy5lbmRUZXh0LmlubmVySFRNTCA9IGZvcm1hdERhdGUodGhpcy5nZXRFbmREYXRlKCkpO1xuICAgIHRoaXMuZW5kVGV4dC5zZXRBdHRyaWJ1dGVOUyhudWxsLCAndHJhbnNmb3JtJywgJ3RyYW5zbGF0ZSgnICsgcG9zICsgJywwKScpO1xuICAgIHRoaXMudXBkYXRlKCk7XG59O1xuXG4vKipcbiAqIFJlZHJhd1xuICovXG5IaXN0b2dyYW0ucHJvdG90eXBlLnVwZGF0ZSA9IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMudXBkYXRlU3RhdHMoKTtcbiAgICB0aGlzLnVwZGF0ZUNsaXAoKTtcbn07XG5cbi8qKlxuICogVXBkYXRlcyBudW1iZXJzXG4gKi9cbkhpc3RvZ3JhbS5wcm90b3R5cGUudXBkYXRlU3RhdHMgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgc3RhcnQgPSB0aGlzLmdldFN0YXJ0KCksXG4gICAgICAgIGVuZCA9IHRoaXMuZ2V0RW5kKCksXG4gICAgICAgIGRhdGEgPSB0aGlzLmRhdGEsXG4gICAgICAgIHggPSAodGhpcy5sZWZ0ICsgdGhpcy5yaWdodCkgLyAyLFxuICAgICAgICBzY2FsZSA9IGFicyh0aGlzLmxlZnQgLSB0aGlzLnJpZ2h0KSAvICh0aGlzLncgLSB0aGlzLnBhZGRpbmcgKiAyKSxcbiAgICAgICAgdG90YWwgPSAwLFxuICAgICAgICBzdW1zID0gW10sXG4gICAgICAgIHRleHQsIGksIGxlbiA9IGRhdGEubGVuZ3RoO1xuXG4gICAgZm9yIChpID0gMDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgIGZvciAodmFyIGogPSBzdGFydCwgc3VtID0gMCwgcm93ID0gdGhpcy5kYXRhW2ldOyBqIDw9IGVuZDsgaisrKSB7XG4gICAgICAgICAgICBzdW0gKz0gcm93W2pdLnZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIHN1bSA9IGFicyhzdW0pO1xuICAgICAgICBzdW1zLnB1c2goc3VtKTtcbiAgICAgICAgdG90YWwgKz0gc3VtO1xuICAgIH1cbiAgICBzdW1zLnB1c2godG90YWwpO1xuXG4gICAgLy8gc2VwYXJhdGUgcmVuZGVyIGFuZCBjYWxjXG4gICAgZm9yIChpID0gMDsgaSA8IGxlbiArIDE7IGkrKykge1xuICAgICAgICB0ZXh0ID0gdGhpcy50b3RhbHNbaV07XG4gICAgICAgIHRleHQuaW5uZXJIVE1MID0gc3Vtc1tpXTtcbiAgICAgICAgdGV4dC5zZXRBdHRyaWJ1dGVOUyhudWxsLCAneCcsIHgpO1xuXG4gICAgICAgIHRleHQuc3R5bGUuem9vbSA9IDAuNTUgKyAoMC40NSAqIHNjYWxlKTtcbiAgICB9XG59O1xuXG4vKipcbiAqIFN0YXJ0IGRhdGUgcG9zIGluIHNldFxuICogQHJldHVybiB7TnVtYmVyfVxuICovXG5IaXN0b2dyYW0ucHJvdG90eXBlLmdldFN0YXJ0ID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIG1heCgwLCBmbG9vcigodGhpcy5sZWZ0IC0gdGhpcy5wYWRkaW5nKSAvIHRoaXMuX2R4KSk7XG59O1xuXG4vKipcbiAqIEVuZCBkYXRlIHBvc2l0aW9uXG4gKiBAcmV0dXJuIHtOdW1iZXJ9XG4gKi9cbkhpc3RvZ3JhbS5wcm90b3R5cGUuZ2V0RW5kID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIG1pbih0aGlzLmRhdGFbMF0ubGVuZ3RoIC0gMSxcbiAgICAgICAgZmxvb3IoKHRoaXMucmlnaHQgLSB0aGlzLnBhZGRpbmcpIC8gdGhpcy5fZHgpKTtcbn07XG5cbi8qKlxuICogQHJldHVybiB7U3RyaW5nfVxuICovXG5IaXN0b2dyYW0ucHJvdG90eXBlLmdldFN0YXJ0RGF0ZSA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLmRhdGFbMF1bdGhpcy5nZXRTdGFydCgpXS5kYXRlO1xufTtcblxuLyoqXG4gKiBAcmV0dXJuIHtTdHJpbmd9XG4gKi9cbkhpc3RvZ3JhbS5wcm90b3R5cGUuZ2V0RW5kRGF0ZSA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLmRhdGFbMF1bdGhpcy5nZXRFbmQoKV0uZGF0ZTtcbn07XG5cbi8qKlxuICogVXBkYXRlcyBjbGlwIHBhdGggdG8gaGlnaGxpZ2h0IHNlbGVjdGlvblxuICovXG5IaXN0b2dyYW0ucHJvdG90eXBlLnVwZGF0ZUNsaXAgPSBmdW5jdGlvbigpIHtcbiAgICB0aGlzLmNsaXAuc2V0QXR0cmlidXRlTlMobnVsbCwgJ2QnLCAnTScgKyB0aGlzLmxlZnQgKyAnLDBMJyArXG4gICAgICAgIHRoaXMucmlnaHQgKyAnLDBMJyArXG4gICAgICAgIHRoaXMucmlnaHQgKyAnLCcgKyB0aGlzLmggKyAnTCcgK1xuICAgICAgICB0aGlzLmxlZnQgKyAnLCcgKyB0aGlzLmggKyAnWicpO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBIaXN0b2dyYW07XG4iLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIEwgPSByZXF1aXJlKCdsZWFmbGV0Jyk7XG5cbi8qKlxuICogQHBhcmFtICB7RWxlbWVudH0gY29udGFpbmVyXG4gKiBAcGFyYW0gIHtPYmplY3R9ICBvcHRpb25zXG4gKi9cbnZhciBNYXAgPSBMLk1hcC5leHRlbmQoe1xuICAgIGluaXRpYWxpemU6IGZ1bmN0aW9uKGNvbnRhaW5lciwgb3B0aW9ucykge1xuICAgICAgICBMLk1hcC5wcm90b3R5cGUuaW5pdGlhbGl6ZS5jYWxsKHRoaXMsIGNvbnRhaW5lciwgb3B0aW9ucyk7XG5cbiAgICAgICAgLy8gJ2h0dHA6Ly97c30udGlsZXMubWFwYm94LmNvbS92NC8nICsgb3B0aW9ucy5tYXBib3hJZCArICcve3p9L3t4fS97eX0ucG5nP2FjY2Vzc190b2tlbj0nICsgb3B0aW9ucy5tYXBib3hLZXlcbiAgICAgICAgTC50aWxlTGF5ZXIoJ2h0dHA6Ly97c30udGlsZXMubWFwYm94LmNvbS92NC8nICtcbiAgICAgICAgICAgIG9wdGlvbnMubWFwYm94SWQgKyAnL3t6fS97eH0ve3l9LnBuZz9hY2Nlc3NfdG9rZW49JyArXG4gICAgICAgICAgICBvcHRpb25zLm1hcGJveEtleSwge1xuICAgICAgICAgICAgICAgIGF0dHJpYnV0aW9uOiAnJmNvcHk7ICcgK1xuICAgICAgICAgICAgICAgICAgICAnPGEgaHJlZj1cImh0dHA6Ly9vc20ub3JnL2NvcHlyaWdodFwiPk9wZW5TdHJlZXRNYXA8L2E+IGNvbnRyaWJ1dG9ycydcbiAgICAgICAgICAgIH0pLmFkZFRvKHRoaXMpO1xuXG4gICAgICAgIC8vIEwudGlsZUxheWVyKCdodHRwOi8ve3N9LnRpbGVzLm1hcGJveC5jb20vdjMvbWFwYm94Lm1hcGJveC1saWdodC97en0ve3h9L3t5fS5wbmc/YWNjZXNzX3Rva2VuJyArXG4gICAgICAgIC8vICAgICBvcHRpb25zLm1hcGJveEtleSwge1xuICAgICAgICAvLyAgICAgICAgIGF0dHJpYnV0aW9uOiAnJmNvcHk7ICcgK1xuICAgICAgICAvLyAgICAgICAgICAgICAnPGEgaHJlZj1cImh0dHA6Ly9vc20ub3JnL2NvcHlyaWdodFwiPk9wZW5TdHJlZXRNYXA8L2E+IGNvbnRyaWJ1dG9ycydcbiAgICAgICAgLy8gICAgIH0pLmFkZFRvKHRoaXMpO1xuICAgIH1cbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IE1hcDtcbiIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgbWluID0gTWF0aC5taW4sXG4gICAgbWF4ID0gTWF0aC5tYXgsXG4gICAgYWJzID0gTWF0aC5hYnMsXG4gICAgcm91bmQgPSBNYXRoLnJvdW5kLFxuICAgIGZsb29yID0gTWF0aC5mbG9vcixcbiAgICBQSV8yID0gTWF0aC5QSSAqIDI7XG5cbi8qKlxuICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnNcbiAqIEBjb25zdHJ1Y3RvclxuICovXG5mdW5jdGlvbiBSZW5kZXJlcihvcHRpb25zKSB7XG5cbiAgICAvKipcbiAgICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgICAqL1xuICAgIHRoaXMub3B0aW9ucyA9IG9wdGlvbnM7XG5cbiAgICAvKipcbiAgICAgKiBAdHlwZSB7Q2FudmFzfVxuICAgICAqL1xuICAgIHRoaXMuX2NhbnZhcyA9IG51bGw7XG5cbiAgICAvKipcbiAgICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICAqL1xuICAgIHRoaXMuX3dpZHRoID0gbnVsbDtcblxuICAgIC8qKlxuICAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgICovXG4gICAgdGhpcy5faGVpZ2h0ID0gbnVsbDtcbn1cblxuLyoqXG4gKiBJbml0IGNhbnZhc1xuICogQHBhcmFtICB7Q2FudmFzfSBjYW52YXNcbiAqIEByZXR1cm4ge1JlbmRlcmVyfVxuICovXG5SZW5kZXJlci5wcm90b3R5cGUuY2FudmFzID0gZnVuY3Rpb24oY2FudmFzKSB7XG4gICAgdGhpcy5fY2FudmFzID0gY2FudmFzO1xuICAgIHRoaXMuX2N0eCA9IGNhbnZhcy5nZXRDb250ZXh0KCcyZCcpO1xuICAgIHRoaXMudXBkYXRlKCk7XG4gICAgcmV0dXJuIHRoaXM7XG59O1xuXG4vKipcbiAqIFVwZGF0ZSBjYW52YXMgc2l6ZVxuICogQHJldHVybiB7UmVuZGVyZXJ9XG4gKi9cblJlbmRlcmVyLnByb3RvdHlwZS51cGRhdGUgPSBmdW5jdGlvbigpIHtcbiAgICB0aGlzLl93aWR0aCA9IHRoaXMuX2NhbnZhcy53aWR0aDtcbiAgICB0aGlzLl9oZWlnaHQgPSB0aGlzLl9jYW52YXMuaGVpZ2h0O1xuICAgIHJldHVybiB0aGlzO1xufTtcblxuLyoqXG4gKiBQcmUtcmVuZGVycyBwb2ludHMsIHNlcGFyYXRlIGNhbGN1bGF0aW9ucyBhbmQgcmVuZGVyaW5nXG4gKiBAcGFyYW0gIHtPYmplY3R9IHBcbiAqIEByZXR1cm4ge09iamVjdH1cbiAqL1xuUmVuZGVyZXIucHJvdG90eXBlLnByZXJlbmRlciA9IGZ1bmN0aW9uKHApIHtcbiAgICB2YXIgb3V0c2tpcnRzQ29sb3IgPSB0aGlzLm9wdGlvbnMub3V0c2tpcnRzQ29sb3IsXG4gICAgICAgIGNlbnRlckNvbG9yID0gdGhpcy5vcHRpb25zLmNlbnRlckNvbG9yLFxuICAgICAgICBkT3BhY2l0eSA9IHRoaXMub3B0aW9ucy5kT3BhY2l0eSxcbiAgICAgICAgb3BhY2l0eSA9IHRoaXMub3B0aW9ucy5vcGFjaXR5LFxuICAgICAgICBkUiA9IHRoaXMub3B0aW9ucy5kUixcbiAgICAgICAgcmFkaXVzID0gdGhpcy5vcHRpb25zLnJhZGl1cztcblxuICAgIGlmICghKCdjb2xvcicgaW4gcCkpIHtcbiAgICAgICAgcC5jb2xvciA9IHAuY2VudGVyID09PSAnMScgPyBjZW50ZXJDb2xvciA6IG91dHNraXJ0c0NvbG9yO1xuICAgIH1cblxuICAgIGlmIChwLmFjdGl2ZSkge1xuICAgICAgICBwLm9wYWNpdHkgPSBtaW4ob3BhY2l0eSwgcC5vcGFjaXR5ICsgZE9wYWNpdHkpO1xuICAgICAgICBwLnJhZGl1cyA9IG1pbihyYWRpdXMsIHAucmFkaXVzICsgZFIpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHAub3BhY2l0eSA9IG1heCgwLCBwLm9wYWNpdHkgLSBkT3BhY2l0eSk7XG4gICAgICAgIHAucmFkaXVzID0gbWF4KDAsIHAucmFkaXVzIC0gZFIpO1xuICAgIH1cblxuICAgIHJldHVybiBwO1xufTtcblxuLyoqXG4gKiBEb2VzIHRoZSBwb2ludCBuZWVkIHNvbWUgbW9yZSBpdGVyYXRpb25zXG4gKiBAcGFyYW0gIHtPYmplY3R9ICBwb2ludFxuICogQHJldHVybiB7Qm9vbGVhbn1cbiAqL1xuUmVuZGVyZXIucHJvdG90eXBlLnBvaW50SXNSZW5kZXJlZCA9IGZ1bmN0aW9uKHBvaW50KSB7XG4gICAgcmV0dXJuICgoIXBvaW50LmFjdGl2ZSAmJiBwb2ludC5vcGFjaXR5ID09PSAwKSB8fFxuICAgICAgICAocG9pbnQuYWN0aXZlICYmIHBvaW50LnJhZGl1cyA9PT0gdGhpcy5vcHRpb25zLnJhZGl1cykpO1xufTtcblxuLyoqXG4gKiBFeGNsdWRlIGhpZGRlbiBwb2ludHMgZnJvbSBkYXRhIHNldFxuICogQHJldHVybiB7Qm9vbGVhbn1cbiAqL1xuUmVuZGVyZXIucHJvdG90eXBlLnBvaW50SXNIaWRkZW4gPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gIXBvaW50LmFjdGl2ZSAmJiBwb2ludC5vcGFjaXR5ID09PSAwO1xufTtcblxuLyoqXG4gKiBSZWRyYXcgdGhlIHNjZW5lXG4gKiBAcGFyYW0gIHtBcnJheS48T2JqZWN0Pn0gZGF0YVxuICogQHJldHVybiB7UmVuZGVyZXJ9XG4gKi9cblJlbmRlcmVyLnByb3RvdHlwZS5kcmF3ID0gZnVuY3Rpb24oZGF0YSkge1xuICAgIHZhciBwLCBjb250ZXh0ID0gdGhpcy5fY3R4O1xuICAgIHRoaXMuX2N0eC5jbGVhclJlY3QoMCwgMCwgdGhpcy5fd2lkdGgsIHRoaXMuX2hlaWdodCk7XG4gICAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IGRhdGEubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgcCA9IGRhdGFbaV07XG5cbiAgICAgICAgLy8gbm8gbWljcm8gZnVuY3Rpb24gY2FsbHNcbiAgICAgICAgLy90aGlzLmRyYXdQb2ludChwLnB4LCBwLnJhZGl1cywgcC5jb2xvciwgcC5vcGFjaXR5KTtcbiAgICAgICAgY29udGV4dC5nbG9iYWxBbHBoYSA9IHAub3BhY2l0eTtcbiAgICAgICAgY29udGV4dC5iZWdpblBhdGgoKTtcbiAgICAgICAgY29udGV4dC5hcmMocC5weC54LCBwLnB4LnksIHAucmFkaXVzLCAwLCBQSV8yLCBmYWxzZSk7XG4gICAgICAgIGNvbnRleHQuZmlsbFN0eWxlID0gcC5jb2xvcjtcbiAgICAgICAgY29udGV4dC5maWxsKCk7XG4gICAgICAgIGNvbnRleHQubGluZVdpZHRoID0gMTtcbiAgICAgICAgY29udGV4dC5zdHJva2VTdHlsZSA9IHAuY29sb3I7XG4gICAgICAgIGNvbnRleHQuc3Ryb2tlKCk7XG5cbiAgICB9XG4gICAgcmV0dXJuIHRoaXM7XG59O1xuXG4vKipcbiAqIEBwYXJhbSAge09iamVjdH0gcFxuICogQHBhcmFtICB7TnVtYmVyfSByXG4gKiBAcGFyYW0gIHtTdHJpbmd9IGNcbiAqIEBwYXJhbSAge051bWJlcn0gb1xuICovXG5SZW5kZXJlci5wcm90b3R5cGUuZHJhd1BvaW50ID0gZnVuY3Rpb24ocCwgciwgYywgbykge1xuICAgIHZhciBjb250ZXh0ID0gdGhpcy5fY3R4O1xuICAgIGNvbnRleHQuZ2xvYmFsQWxwaGEgPSBvO1xuICAgIGNvbnRleHQuYmVnaW5QYXRoKCk7XG4gICAgY29udGV4dC5hcmMocC54LCBwLnksIHIsIDAsIFBJXzIsIGZhbHNlKTtcbiAgICBjb250ZXh0LmZpbGxTdHlsZSA9IGM7XG4gICAgY29udGV4dC5maWxsKCk7XG4gICAgY29udGV4dC5saW5lV2lkdGggPSAxO1xuICAgIGNvbnRleHQuc3Ryb2tlU3R5bGUgPSBjO1xuICAgIGNvbnRleHQuc3Ryb2tlKCk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IFJlbmRlcmVyO1xuIiwiKGZ1bmN0aW9uIChnbG9iYWwpe1xuXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBIaXN0b2dyYW0gPSByZXF1aXJlKCcuL2hpc3RvZ3JhbScpO1xudmFyIEhhbW1lciA9IGdsb2JhbC5IYW1tZXIgPSByZXF1aXJlKCdoYW1tZXJqcycpO1xudmFyIHBvc2l0aW9uID0gcmVxdWlyZSgncG9zaXRpb24nKTtcbnZhciBMID0gcmVxdWlyZSgnbGVhZmxldCcpO1xudmFyIFJlbmRlcmVyID0gcmVxdWlyZSgnLi9yZW5kZXJlcicpO1xudmFyIER5bmFtaWNMYXllciA9IHJlcXVpcmUoJy4vZHluYW1pY19sYXllcicpO1xuXG4vKipcbiAqIFRpbWUgY29udHJvbFxuICogQHBhcmFtIHtBcnJheS48T2JqZWN0Pn0gZGF0YVxuICogQHBhcmFtIHtOdW1iZXJ9ICAgICAgICAgbWF4WSBFYXNpZXIgdG8gY2FsY3VsYXRlIHRoZW0gaW4gb25lIGdvIHdoaWxlIHBhcnNpbmdcbiAqIEBwYXJhbSB7TnVtYmVyfSAgICAgICAgIG1pbllcbiAqIEBwYXJhbSB7T2JqZWN0fSAgICAgICAgIG9wdGlvbnNcbiAqIEBjb25zdHJ1Y3RvclxuICovXG5mdW5jdGlvbiBUaW1lQ29udHJvbChkYXRhLCBvcHRpb25zKSB7XG5cbiAgICAvKipcbiAgICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgICAqL1xuICAgIHRoaXMub3B0aW9ucyA9IEwuVXRpbC5leHRlbmQodGhpcy5vcHRpb25zLCBvcHRpb25zKTtcblxuICAgIC8qKlxuICAgICAqIEB0eXBlIHtFbGVtZW50fVxuICAgICAqL1xuICAgIHRoaXMuX2NvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIHRoaXMuX2NvbnRhaW5lci5jbGFzc05hbWUgPSAndGltZWNvbnRyb2wnO1xuICAgIHRoaXMuX2NvbnRhaW5lci5hcHBlbmRDaGlsZChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnaGlzdG9ncmFtJykpO1xuXG4gICAgLyoqXG4gICAgICogQHR5cGUge09iamVjdH1cbiAgICAgKi9cbiAgICB0aGlzLnBvc2l0aW9uID0gbnVsbDtcblxuICAgIC8qKlxuICAgICAqIEB0eXBlIHtPYmplY3R9XG4gICAgICovXG4gICAgdGhpcy5fZGF0YSA9IGRhdGE7XG5cbiAgICAvKipcbiAgICAgKiBAdHlwZSB7SGFtbWVyLk1hbmFnZXJ9XG4gICAgICovXG4gICAgdGhpcy5ldmVudEVtaXR0ZXIgPSBuZXcgSGFtbWVyLk1hbmFnZXIodGhpcy5fY29udGFpbmVyKTtcblxuICAgIHRoaXMuZW5hYmxlKCk7XG5cbiAgICBMLkNvbnRyb2wucHJvdG90eXBlLmluaXRpYWxpemUuY2FsbCh0aGlzLCB0aGlzLm9wdGlvbnMpO1xufTtcblRpbWVDb250cm9sLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoTC5Db250cm9sLnByb3RvdHlwZSk7XG5cbi8qKlxuICogQHR5cGUge09iamVjdH1cbiAqL1xuVGltZUNvbnRyb2wucHJvdG90eXBlLm9wdGlvbnMgPSB7XG4gICAgcG9zaXRpb246ICd0b3ByaWdodCdcbn07XG5cbi8qKlxuICogQHBhcmFtICB7TC5NYXB9IG1hcFxuICogQHJldHVybiB7RWxlbWVudH1cbiAqL1xuVGltZUNvbnRyb2wucHJvdG90eXBlLm9uQWRkID0gZnVuY3Rpb24obWFwKSB7XG4gICAgTC5Eb21FdmVudFxuICAgICAgICAuZGlzYWJsZUNsaWNrUHJvcGFnYXRpb24odGhpcy5fY29udGFpbmVyKVxuICAgICAgICAuZGlzYWJsZVNjcm9sbFByb3BhZ2F0aW9uKHRoaXMuX2NvbnRhaW5lcik7XG5cbiAgICAvKipcbiAgICAgKiBAdHlwZSB7SGlzdG9ncmFtfVxuICAgICAqL1xuICAgIHRoaXMuaGlzdG9ncmFtID0gbmV3IEhpc3RvZ3JhbSh0aGlzLl9jb250YWluZXIucXVlcnlTZWxlY3Rvcignc3ZnJyksXG4gICAgICAgIHRoaXMuZ2V0SGlzdG9ncmFtRGF0YSgpLFxuICAgICAgICB0aGlzLl9tYXhjZW50ZXIsIHRoaXMuX21heG91dHNraXJ0cywge1xuICAgICAgICAgICAgYmc6IHRoaXMub3B0aW9ucy5oaXN0b2dyYW1CZyxcbiAgICAgICAgICAgIGNvbG9yczogW3RoaXMub3B0aW9ucy5jZW50ZXJDb2xvciwgdGhpcy5vcHRpb25zLm91dHNraXJ0c0NvbG9yXSxcbiAgICAgICAgICAgIGF4aXM6IHtcbiAgICAgICAgICAgICAgICBjb2xvcjogJ3JnYmEoMCwwLDAsMC44KScsXG4gICAgICAgICAgICAgICAgd2VpZ2h0OiAxLFxuICAgICAgICAgICAgICAgIG9wYWNpdHk6IDAuOFxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgIHZhciBwb2ludDtcbiAgICBmb3IgKHZhciBpID0gMCwgbGVuID0gdGhpcy5fZGF0YS5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgICBwb2ludCA9IHRoaXMuX2RhdGFbaV07XG4gICAgICAgIHBvaW50LmxhdGxuZyA9IG5ldyBMLkxhdExuZyhwb2ludC5sYXQsIHBvaW50LmxvbmcpO1xuICAgICAgICBwb2ludC5yYWRpdXMgPSBwb2ludC5vcGFjaXR5ID0gMDtcbiAgICB9XG5cbiAgICB0aGlzLl9yZW5kZXJlciA9IG5ldyBSZW5kZXJlcih7XG4gICAgICAgIGNlbnRlckNvbG9yOiB0aGlzLm9wdGlvbnMuY2VudGVyQ29sb3IsXG4gICAgICAgIG91dHNraXJ0c0NvbG9yOiB0aGlzLm9wdGlvbnMub3V0c2tpcnRzQ29sb3IsXG4gICAgICAgIG9wYWNpdHk6IDAuNyxcbiAgICAgICAgZE9wYWNpdHk6IDEgLyAoMSAqIDYwKSxcbiAgICAgICAgZFI6IDEwIC8gKDAuNSAqIDYwKSxcbiAgICAgICAgcmFkaXVzOiAxMFxuICAgIH0pO1xuXG4gICAgdGhpcy5fbGF5ZXIgPSBuZXcgRHluYW1pY0xheWVyKHRoaXMuX2RhdGEsIHRoaXMuX3JlbmRlcmVyKS5hZGRUbyhtYXApO1xuICAgIHRoaXMub25SYW5nZVNlbGVjdGVkKHRoaXMuaGlzdG9ncmFtLmdldFN0YXJ0RGF0ZSgpLCB0aGlzLmhpc3RvZ3JhbS5nZXRFbmREYXRlKCkpO1xuXG4gICAgbWFwLm9uKCd6b29tZW5kJywgdGhpcy5vblpvb21lbmQsIHRoaXMpO1xuXG4gICAgcmV0dXJuIHRoaXMuX2NvbnRhaW5lcjtcbn07XG5cbi8qKlxuICogVE9ETyB6b29tIGFuaW1hdGlvblxuICovXG5UaW1lQ29udHJvbC5wcm90b3R5cGUub25ab29tZW5kID0gZnVuY3Rpb24oKSB7XG4gICAgLy8gdmFyIHpvb20gPSB0aGlzLl9tYXAuZ2V0Wm9vbSgpO1xuICAgIC8vIC8vdGhpcy5fcmVuZGVyZXIub3B0aW9ucy5yYWRpdXMgPSB6b29tICogMjtcbiAgICAvLyBjb25zb2xlLmxvZyh6b29tKVxuICAgIC8vIHRoaXMuX2xheWVyLnJlZHJhdygpO1xufTtcblxuLyoqXG4gKiBAcGFyYW0ge0wuTWFwfSBtYXBcbiAqL1xuVGltZUNvbnRyb2wucHJvdG90eXBlLmFkZFRvID0gZnVuY3Rpb24obWFwKSB7XG4gICAgTC5Db250cm9sLnByb3RvdHlwZS5hZGRUby5jYWxsKHRoaXMsIG1hcCk7XG4gICAgdGhpcy5wb3NpdGlvbiA9IHBvc2l0aW9uKHRoaXMuX2NvbnRhaW5lcik7XG4gICAgcmV0dXJuIHRoaXM7XG59O1xuXG4vKipcbiAqIEdyb3VwcyBkYXRhIGJ5IGRheXMsIGNhbGN1bGF0ZXMgcGVha3NcbiAqIEByZXR1cm4ge09iamVjdH1cbiAqL1xuVGltZUNvbnRyb2wucHJvdG90eXBlLmdyb3VwQnlEYXlzID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIGRhdGEgPSBbXSxcbiAgICAgICAgY2VudGVyID0gMCxcbiAgICAgICAgb3V0c2tpcnRzID0gMCxcbiAgICAgICAgbWF4Q2VudGVyID0gMCxcbiAgICAgICAgbWF4T3V0c2tpcnRzID0gMCxcbiAgICAgICAgcm93LCBkYXlEYXRhLCBkYXRlO1xuXG4gICAgZm9yICh2YXIgaSA9IDAsIGlpID0gdGhpcy5fZGF0YS5sZW5ndGg7IGkgPCBpaTsgaSsrKSB7XG5cbiAgICAgICAgcm93ID0gdGhpcy5fZGF0YVtpXTtcblxuICAgICAgICBpZiAocm93LmNlbnRlciA9PT0gJzEnKSB7XG4gICAgICAgICAgICBjZW50ZXIrKztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIG91dHNraXJ0cysrO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGRhdGUgIT09IHJvdy5kYXRlKSB7XG4gICAgICAgICAgICBpZiAoZGF5RGF0YSkge1xuICAgICAgICAgICAgICAgIGRhdGEucHVzaCh7XG5cbiAgICAgICAgICAgICAgICAgICAgY2VudGVyOiBjZW50ZXIsXG4gICAgICAgICAgICAgICAgICAgIG91dHNraXJ0czogb3V0c2tpcnRzLFxuXG4gICAgICAgICAgICAgICAgICAgIGRhdGU6IGRhdGUsXG4gICAgICAgICAgICAgICAgICAgIGRhdGE6IGRheURhdGFcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIG1heENlbnRlciA9IE1hdGgubWF4KGNlbnRlciwgbWF4Q2VudGVyKTtcbiAgICAgICAgICAgICAgICBtYXhPdXRza2lydHMgPSBNYXRoLm1heChvdXRza2lydHMsIG1heE91dHNraXJ0cyk7XG5cbiAgICAgICAgICAgICAgICBjZW50ZXIgPSAwO1xuICAgICAgICAgICAgICAgIG91dHNraXJ0cyA9IDA7XG5cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGRhdGUgPSByb3cuZGF0ZTtcbiAgICAgICAgICAgIGRheURhdGEgPSBbXTtcbiAgICAgICAgfVxuICAgICAgICBkYXlEYXRhLnB1c2gocm93KTtcbiAgICB9XG5cbiAgICB0aGlzLl9tYXhvdXRza2lydHMgPSBtYXhPdXRza2lydHM7XG4gICAgdGhpcy5fbWF4Y2VudGVyID0gbWF4Q2VudGVyO1xuXG4gICAgcmV0dXJuIHtcblxuICAgICAgICAvL2NlbnRlcjogbWF4Q2VudGVyLFxuICAgICAgICAvL291dHNraXJ0czogbWF4T3V0c2tpcnRzLFxuXG4gICAgICAgIC8vZGF0ZVN0YXJ0OiBkYXRhWzBdLmRhdGUsXG4gICAgICAgIC8vZGF0ZUVuZDogZGF0YVtkYXRhLmxlbmd0aCAtIDFdLmRhdGUsXG5cbiAgICAgICAgZGF0YTogZGF0YVxuICAgIH07XG59O1xuXG4vKipcbiAqIFBvcHVsYXRlcyBoaXN0b2dyYW0gZGF0YVxuICogQHJldHVybiB7QXJyYXkuPE9iamVjdD59XG4gKi9cblRpbWVDb250cm9sLnByb3RvdHlwZS5nZXRIaXN0b2dyYW1EYXRhID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIGRhdGEgPSB0aGlzLmdyb3VwQnlEYXlzKCksXG4gICAgICAgIGNlbnRlciA9IFtdLFxuICAgICAgICBvdXRza2lydHMgPSBbXTtcblxuICAgIGZvciAodmFyIGkgPSAwLCBsZW4gPSBkYXRhLmRhdGEubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgY2VudGVyLnB1c2goe1xuICAgICAgICAgICAgdmFsdWU6IGRhdGEuZGF0YVtpXS5jZW50ZXIsXG4gICAgICAgICAgICBkYXRlOiBkYXRhLmRhdGFbaV0uZGF0ZVxuICAgICAgICB9KTtcbiAgICAgICAgb3V0c2tpcnRzLnB1c2goe1xuICAgICAgICAgICAgdmFsdWU6IC1kYXRhLmRhdGFbaV0ub3V0c2tpcnRzLFxuICAgICAgICAgICAgZGF0ZTogZGF0YS5kYXRhW2ldLmRhdGVcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIHJldHVybiBbY2VudGVyLCBvdXRza2lydHNdO1xufTtcblxuLyoqXG4gKiBFbmFibGVzIGhhbmRsZXJzXG4gKi9cblRpbWVDb250cm9sLnByb3RvdHlwZS5lbmFibGUgPSBmdW5jdGlvbigpIHtcbiAgICB0aGlzLl9jb250YWluZXIuYWRkRXZlbnRMaXN0ZW5lcigndG91Y2htb3ZlJywgZnVuY3Rpb24oZSkge1xuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgfSk7XG5cbiAgICB0aGlzLmV2ZW50RW1pdHRlci5hZGQobmV3IEhhbW1lci5QYW4oe1xuICAgICAgICBkaXJlY3Rpb246IEhhbW1lci5ESVJFQ1RJT05fSE9SSVpPTlRBTCxcbiAgICAgICAgdGhyZXNob2xkOiAwLFxuICAgICAgICBwb2ludGVyczogMFxuICAgIH0pKTtcblxuICAgIHRoaXMub25EcmFnSGFuZGxlID0gdGhpcy5vbkRyYWdIYW5kbGUuYmluZCh0aGlzKTtcbiAgICB0aGlzLm9uRHJhZ1N0YXJ0ID0gdGhpcy5vbkRyYWdTdGFydC5iaW5kKHRoaXMpO1xuICAgIHRoaXMub25EcmFnU3RvcCA9IHRoaXMub25EcmFnU3RvcC5iaW5kKHRoaXMpO1xuXG4gICAgdGhpcy5ldmVudEVtaXR0ZXIub24oJ3BhbnN0YXJ0JywgdGhpcy5vbkRyYWdTdGFydC5iaW5kKHRoaXMpKTtcbn07XG5cbi8qKlxuICogRHJhZ2dpbmcgc3RhcnRlZCBzb21ld2hlcmUgb24gdGhlIGhpc3RvZ3JhbSwgc2VsZWN0IGhhbmRsZSBhbmRcbiAqIHN0YXJ0IGludGVyYWN0aW5nXG4gKlxuICogQHBhcmFtICB7RXZlbnR9IGV2dFxuICovXG5UaW1lQ29udHJvbC5wcm90b3R5cGUub25EcmFnU3RhcnQgPSBmdW5jdGlvbihldnQpIHtcbiAgICB2YXIgZHJhZ3N0YXJ0ID0gZmFsc2UsXG4gICAgICAgIGhhbmRsZTtcbiAgICBpZiAoZXZ0LnRhcmdldCA9PT0gdGhpcy5oaXN0b2dyYW0ubGVmdEhhbmRsZSB8fFxuICAgICAgICBldnQudGFyZ2V0ID09PSB0aGlzLmhpc3RvZ3JhbS5yaWdodEhhbmRsZSkge1xuXG4gICAgICAgIHRoaXMuaGlzdG9ncmFtLl9jb250YWluZXIuY2xhc3NMaXN0LmFkZCgnZHJhZ2dpbmcnKTtcbiAgICAgICAgdGhpcy5faGFuZGxlID0gZXZ0LnRhcmdldDtcbiAgICAgICAgdGhpcy5faGFuZGxlLmNsYXNzTGlzdC5hZGQoJ2RyYWdnaW5nJyk7XG5cbiAgICAgICAgdGhpcy5tb3ZlID0gZXZ0LnRhcmdldCA9PT0gdGhpcy5oaXN0b2dyYW0ubGVmdEhhbmRsZSA/XG4gICAgICAgICAgICB0aGlzLmhpc3RvZ3JhbS5tb3ZlTGVmdEhhbmRsZS5iaW5kKHRoaXMuaGlzdG9ncmFtKSA6XG4gICAgICAgICAgICB0aGlzLmhpc3RvZ3JhbS5tb3ZlUmlnaHRIYW5kbGUuYmluZCh0aGlzLmhpc3RvZ3JhbSk7XG5cbiAgICAgICAgdGhpcy5ldmVudEVtaXR0ZXIub24oJ3Bhbm1vdmUnLCB0aGlzLm9uRHJhZ0hhbmRsZSk7XG4gICAgICAgIHRoaXMuZXZlbnRFbWl0dGVyLm9uKCdwYW5lbmQnLCB0aGlzLm9uRHJhZ1N0b3ApO1xuICAgIH1cbn07XG5cbi8qKlxuICogRHJhZ2dpbmc6IG5vcm1hbGl6ZSB4IHBvc1xuICogQHBhcmFtICB7RXZlbnR9IGV2dFxuICovXG5UaW1lQ29udHJvbC5wcm90b3R5cGUub25EcmFnSGFuZGxlID0gZnVuY3Rpb24oZXZ0KSB7XG4gICAgdGhpcy5tb3ZlKGV2dC5jZW50ZXIueCAtIHRoaXMucG9zaXRpb24ubGVmdCwgZXZ0LmRpc3RhbmNlKTtcbiAgICB0aGlzLm9uUmFuZ2VTZWxlY3RlZCh0aGlzLmhpc3RvZ3JhbS5nZXRTdGFydERhdGUoKSwgdGhpcy5oaXN0b2dyYW0uZ2V0RW5kRGF0ZSgpKTtcbn07XG5cbi8qKlxuICogQHBhcmFtICB7RXZlbnR9IGV2dFxuICovXG5UaW1lQ29udHJvbC5wcm90b3R5cGUub25EcmFnU3RvcCA9IGZ1bmN0aW9uKGV2dCkge1xuICAgIHRoaXMuZXZlbnRFbWl0dGVyLm9mZigncGFubW92ZScsIHRoaXMub25EcmFnSGFuZGxlKTtcbiAgICB0aGlzLmV2ZW50RW1pdHRlci5vZmYoJ3BhbmVuZCcsIHRoaXMub25EcmFnU3RvcCk7XG5cbiAgICB0aGlzLmhpc3RvZ3JhbS5fY29udGFpbmVyLmNsYXNzTGlzdC5yZW1vdmUoJ2RyYWdnaW5nJyk7XG4gICAgdGhpcy5faGFuZGxlLmNsYXNzTGlzdC5yZW1vdmUoJ2RyYWdnaW5nJyk7XG4gICAgdGhpcy5faGFuZGxlID0gbnVsbDtcblxuICAgIHRoaXMub25SYW5nZVNlbGVjdGVkKHRoaXMuaGlzdG9ncmFtLmdldFN0YXJ0RGF0ZSgpLCB0aGlzLmhpc3RvZ3JhbS5nZXRFbmREYXRlKCkpO1xufTtcblxuLyoqXG4gKiBAcGFyYW0gIHtOdW1iZXJ9IHN0YXJ0XG4gKiBAcGFyYW0gIHtOdW1iZXJ9IGVuZFxuICogQHJldHVybiB7QXJyYXl9XG4gKi9cblRpbWVDb250cm9sLnByb3RvdHlwZS5mbGF0dGVuRGF0YSA9IGZ1bmN0aW9uKHN0YXJ0LCBlbmQpIHtcbiAgICB2YXIgZGF0YSA9IHRoaXMuX2RhdGEuZGF0YS5zbGljZSgwLCB0aGlzLl9kYXRhLmRhdGEubGVuZ3RoIC0gMSksXG4gICAgICAgIGNvcHkgPSBbXSxcbiAgICAgICAgaSwgbGVuO1xuXG4gICAgLy8gZm9yIGlzIHgxLjI1IGZhc3RlciB0aGFuIEFycmF5Lm1hcCgpXG4gICAgZm9yIChpID0gMCwgbGVuID0gZGF0YS5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgICBjb3B5LnB1c2goZGF0YVtpXS5kYXRhKTtcbiAgICB9XG4gICAgZGF0YSA9IFtdLmNvbmNhdC5hcHBseShbXSwgY29weSk7XG5cbiAgICByZXR1cm4gZGF0YTtcbn07XG5cbi8qKlxuICogQHBhcmFtICB7TnVtYmVyfSBzdGFydFxuICogQHBhcmFtICB7TnVtYmVyfSBlbmRcbiAqIEByZXR1cm4ge051bWJlcn1cbiAqL1xuVGltZUNvbnRyb2wucHJvdG90eXBlLm9uUmFuZ2VTZWxlY3RlZCA9IGZ1bmN0aW9uKHN0YXJ0LCBlbmQpIHtcbiAgICB2YXIgbWFya2VyID0gc3RhcnQsXG4gICAgICAgIGFjdGl2ZSA9IGZhbHNlLFxuICAgICAgICBkYXRhID0gdGhpcy5fZGF0YSxcbiAgICAgICAgbywgaSwgbGVuO1xuXG4gICAgaWYgKHN0YXJ0ID09PSBlbmQpIHtcbiAgICAgICAgZm9yIChpID0gMCwgbGVuID0gdGhpcy5fZGF0YS5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgICAgICAgZGF0YS5hY3RpdmUgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIHZhciBoID0gMDtcbiAgICAgICAgZm9yIChpID0gMCwgbGVuID0gdGhpcy5fZGF0YS5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgICAgICAgbyA9IGRhdGFbaV07XG4gICAgICAgICAgICBpZiAoby5kYXRlID09PSBtYXJrZXIpIHtcbiAgICAgICAgICAgICAgICBpZiAobWFya2VyID09PSBzdGFydCkgeyAvLyBzdGFydCAtIG1ha2UgdmlzaWJsZVxuICAgICAgICAgICAgICAgICAgICBhY3RpdmUgPSAhYWN0aXZlO1xuICAgICAgICAgICAgICAgICAgICBtYXJrZXIgPSBlbmQ7IC8vIHdhaXQgZm9yIGVuZFxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAobWFya2VyID09PSBlbmQpIHsgLy8gZW5kXG4gICAgICAgICAgICAgICAgICAgIG1hcmtlciA9IC0xOyAvLyB3YWl0IGZvciBuZXh0IG5vdCBlbmRcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAobWFya2VyID09PSAtMSAmJiBvLmRhdGUgIT09IGVuZCkge1xuICAgICAgICAgICAgICAgIG1hcmtlciA9IC0yO1xuICAgICAgICAgICAgICAgIGFjdGl2ZSA9ICFhY3RpdmU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBpZiAoYWN0aXZlKSBoKys7XG4gICAgICAgICAgICBvLmFjdGl2ZSA9IGFjdGl2ZTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vIGNvbnNvbGUubG9nKGgsICcvJywgdGhpcy5fZGF0YS5sZW5ndGgpO1xuICAgIHRoaXMuX2xheWVyLnJlZHJhdygpO1xuXG59O1xuXG4vKipcbiAqIEBwYXJhbSAge01hcH0gbWFwXG4gKiBAcmV0dXJuIHtUaW1lQ29udHJvbH1cbiAqL1xuVGltZUNvbnRyb2wucHJvdG90eXBlLm9uUmVtb3ZlID0gZnVuY3Rpb24obWFwKSB7XG4gICAgbWFwLnJlbW92ZUxheWVyKHRoaXMuX2xheWVyKTtcbiAgICB0aGlzLl9sYXllciA9IG51bGw7XG4gICAgdGhpcy5fcmVuZGVyZXIgPSBudWxsO1xuICAgIG1hcC5vZmYoJ3pvb21lbmQnLCB0aGlzLm9uWm9vbWVuZCwgdGhpcyk7XG4gICAgcmV0dXJuIHRoaXM7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IFRpbWVDb250cm9sO1xuXG59KS5jYWxsKHRoaXMsdHlwZW9mIGdsb2JhbCAhPT0gXCJ1bmRlZmluZWRcIiA/IGdsb2JhbCA6IHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiID8gc2VsZiA6IHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cgOiB7fSkiXX0=
