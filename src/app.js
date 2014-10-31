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
