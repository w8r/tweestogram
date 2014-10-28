var reqwest = require('reqwest');
var Histogram = require('./histogram');

/**
 * @param {Object} options
 * @constructor
 */
function App(options) {

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
	console.log(this._data);

	this._histogram = new Histogram(this._data);
};

/**
 * @param  {String} csv
 * @return {Array.<Object>}
 */
App.prototype.parse = function(csv) {
	csv = csv.split(/\n/g);

	var headers = csv[0].split(';'),
		data = [],
		rowStr,
		row;

	for (var i = 1, ii = csv.length; i < ii; i++) {
		row = {};
		rowStr = csv[i].split(';');

		for (var j = 0, jj = rowStr.length; j < jj; j++) {
			row[headers[j]] = rowStr[j];
		}
		data.push(row);
	}

	return data;
};

module.exports = App;
