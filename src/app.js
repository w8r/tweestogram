"use strict";

var reqwest = require('reqwest');
var TimeControl = require('./timecontrol');

/**
 * @param {Object} options
 * @constructor
 */
function App(options) {

    this.options = options;

    /**
     * @type {Array.<Object>}
     */
    this._data = null;

    /**
     * @type {Histogram}
     */
    this._histogram = null;

    this.getData(options.dataUrl, this.onDataReceived.bind(this));
};

/**
 * @param  {String}   url
 * @param  {Function} callback
 */
App.prototype.getData = function(url, callback) {
    reqwest({
        url: url,
        contentType: 'text/csv',
        success: callback
    });
};

/**
 * @param  {String} data
 */
App.prototype.onDataReceived = function(data) {
    this._data = this.parse(data);

    this._timeControl = new TimeControl(this.histogram(),
        this._data.center, this._data.outskirts, {
            bg: this.options.histogramBg,
            colors: [this.options.centerColor, this.options.outskirtsColor],
            axis: {
                color: 'rgba(0,0,0,0.8)',
                weight: 1,
                opacity: 0.8
            }
        });
};

/**
 * Populates histogram data
 * @return {Array.<Object>}
 */
App.prototype.histogram = function() {
    var center = [],
        outskirts = [];
    for (var i = 0, len = this._data.data.length; i < len; i++) {
        center.push({
            value: this._data.data[i].center,
            date: this._data.data[i].date
        });
        outskirts.push({
            value: -this._data.data[i].outskirts,
            date: this._data.data[i].date
        });
    }
    return [center, outskirts];
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


    for (var i = 2, ii = csv.length - 1; i < ii; i += 2) {
        row = {};
        rowStr = (csv[i - 1] + csv[i]).split(';');

        for (var j = 0, jj = rowStr.length; j < jj; j++) {
            row[headers[j]] = rowStr[j];
        }

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

    return {

        center: maxCenter,
        outskirts: maxOutskirts,

        dateStart: data[0].date,
        dateEnd: data[data.length - 1].date,

        data: data
    };
};

module.exports = App;
