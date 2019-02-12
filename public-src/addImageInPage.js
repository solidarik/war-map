"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var AddImageInPage = function () {
  function AddImageInPage(svgElement, data, fieldName, imageName, imagePath, imageExt) {
    _classCallCheck(this, AddImageInPage);

    this.svgElement = svgElement;
    this.data = data;
    this.fieldName = fieldName;
    this.imageName = imageName;
    this.imagePath = imagePath;
    this.imageExt = imageExt;
  }

  _createClass(AddImageInPage, [{
    key: "addImageInPage",
    value: function addImageInPage() {
      var defs = this.svgElement.append("defs");

      var fieldName = this.fieldName;
      var imageName = this.imageName;
      var imagePath = this.imagePath;
      var imageExt = this.imageExt;

      var imgPattern = defs.selectAll("pattern").data(this.data).enter().append("pattern").attr("id", function (d) {
        return imageName + d[fieldName];
      }).attr("width", "100%").attr("height", "100%").attr("patternUnits", "objectBoundingBox").attr("patternContentUnits", "objectBoundingBox").append("image").attr("width", 1).attr("height", 1).attr("preserveAspectRatio", "none").attr("xlink:href", function (d) {
        return imagePath + d[fieldName] + imageExt;
      });

      return imgPattern;
    }
  }]);

  return AddImageInPage;
}();