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
