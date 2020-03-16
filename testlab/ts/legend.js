"use strict";
var LegendItem = /** @class */ (function () {
    function LegendItem(imgUrl, caption) {
        this.imgUrl = imgUrl;
        this.caption = caption;
    }
    LegendItem.prototype.toString = function () {
        return this.imgUrl.bold();
    };
    return LegendItem;
}());
var Legend = /** @class */ (function () {
    function Legend() {
        this.items = new Array();
        this.addItem('source.jpg', 'First Item');
        this.addItem('second.jpg', 'Second');
    }
    Legend.prototype.addItem = function (imgUrl, caption) {
        this.items.push(new LegendItem(imgUrl, caption));
    };
    Legend.prototype.toString = function () {
        var res = '';
        this.items.forEach(function (item) {
            res += '' + item;
        });
        return res;
    };
    return Legend;
}());
var legend = new Legend();
document.body.innerHTML = legend.toString();
