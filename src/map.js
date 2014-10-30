"use strict";

var L = require('leaflet');

/**
 * @param  {Element} container
 * @param  {Object}  options
 */
var Map = L.Map.extend({
    initialize: function(container, options) {
        L.Map.prototype.initialize.call(this, container, options);

        // 'http://{s}.tiles.mapbox.com/v4/' +options.mapboxId + '/{z}/{x}/{y}.png?access_token=' +options.mapboxKey
        L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
            attribution: '&copy; ' +
                '<a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(this);
    }
});

module.exports = Map;
