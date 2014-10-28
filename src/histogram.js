function Histogram(data) {

    this._canvas = document.getElementById('histogram');

    this._ctx = this._canvas.getContext('2d');
};

module.exports = Histogram;
