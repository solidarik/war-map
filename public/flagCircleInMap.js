"use strict";

var flagCircleInMap =
/*#__PURE__*/
function () {
  function flagCircleInMap(data, svg, projection, imageName, mxval, width) {
    this.data = data;
    this.svg = svg;
    this.projection = projection;
    this.imageName = imageName;
    this.mxval = mxval;
    this.width = width;
  }

  var _proto = flagCircleInMap.prototype;

  _proto.sortIfDataCountries = function sortIfDataCountries(x, y) {
    var resX = 0;

    if (typeof x.dataCountries != "undefined" && typeof x.dataCountries[0] != "undefined") {
      if (x.dataCountries[0].value != null) {
        resX = x.dataCountries[0].value;
      }
    }

    var resY = 0;

    if (typeof y.dataCountries != "undefined" && typeof y.dataCountries[0] != "undefined") {
      if (y.dataCountries[0].value != null) {
        resY = y.dataCountries[0].value;
      }
    }

    return d3.descending(resX, resY);
  };

  flagCircleInMap.getMaxValue = function getMaxValue(data) {
    var maxValue = -99999;

    for (var _iterator = data, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
      var _ref;

      if (_isArray) {
        if (_i >= _iterator.length) break;
        _ref = _iterator[_i++];
      } else {
        _i = _iterator.next();
        if (_i.done) break;
        _ref = _i.value;
      }

      var d = _ref;
      d.dataCountries.forEach(function (d1) {
        var elem = d1.value;

        if (elem > maxValue) {
          maxValue = elem;
        }
      });
    }

    return maxValue;
  };

  _proto.addFlagCircleInMap = function addFlagCircleInMap() {
    this.data.sort(this.sortIfDataCountries);
    var maxValue = this.data[0].dataCountries[0].value; //this.mxval;//this.getMaxValue(this.data);//

    console.log("maxValue=" + maxValue);
    var sizeScale = d3.scaleSqrt().domain([0, maxValue]).range([0, Math.round(0.037 * this.width)]); //70
    // Define the div for the tooltip

    var div;

    if (document.getElementById("tooltip") !== null) {
      div = d3.select("div#tooltip");
    } else {
      div = d3.select("body").append("div").attr("id", "tooltip").attr("class", "tooltip").style("opacity", 0);
    }

    this.data = this.data.filter(function (obj) {
      return obj.name !== "Other world";
    });
    var projection = this.projection;
    var imageName = this.imageName;
    this.svg.selectAll("circle").remove();
    this.svg.selectAll("circle").data(this.data).enter().append("circle").attr("id", "flags") //            .transition().duration(200)
    .attr('r', function (d) {
      var res;

      if (typeof d.dataCountries != "undefined" && typeof d.dataCountries[0] != "undefined") {
        if (d.dataCountries[0].value != null) {
          res = d.dataCountries[0].value;
        } else {
          res = 0;
        }
      } else {
        res = 0;
      }

      ;
      res = sizeScale(res);
      return res;
    }).attr('cx', function (d) {
      return projection(d.centroid)[0];
    }).attr('cy', function (d) {
      return projection(d.centroid)[1];
    }).style("fill", function (d) {
      return "url(#" + imageName + d.iso2 + ")";
    }).on("mouseover", function (d) {
      d3.select(this).classed("active", true);
      var res = 0;

      if (typeof d.dataCountries != "undefined" && typeof d.dataCountries[0] != "undefined") {
        if (d.dataCountries[0].value != null) {
          res = d.dataCountries[0].value / 1000000;
        }
      }

      var htmlData = d.name_ru + "<br/>ВВП:" + Math.round(res * 100) / 100 + " m US$";
      div.transition() // .duration(200)		
      .style("opacity", .9);
      div.html(htmlData).style("left", d3.event.pageX + "px").style("top", d3.event.pageY - 28 + "px");
    }).on("mouseout", function (d) {// d3.select(this).classed("active", false);
      // div.transition()
      //     // .duration(500)		
      //     .style("opacity", 0);
    });
  };

  flagCircleInMap.getMaxValueNew = function getMaxValueNew(data) {
    var maxValue = -99999;
    data.forEach(function (d) {
      var elem = d.value;

      if (elem > maxValue) {
        maxValue = elem;
      }
    });
    return maxValue;
  };

  _proto.sortIfDataCountriesNew = function sortIfDataCountriesNew(x, y) {
    var resX = 0;

    if (typeof x.value != "undefined" && typeof x.value != "undefined") {
      if (x.value != null) {
        resX = x.value;
      }
    }

    var resY = 0;

    if (typeof y.value != "undefined" && typeof y.value != "undefined") {
      if (y.value != null) {
        resY = y.value;
      }
    }

    return d3.descending(resX, resY);
  };

  _proto.addFlagCircleInMapNew = function addFlagCircleInMapNew() {
    this.data.sort(this.sortIfDataCountriesNew);
    var maxValue = this.data[0].value; //this.mxval;//this.getMaxValueNew(this.data);//

    var sizeScale = d3.scaleSqrt().domain([0, maxValue]).range([0, Math.round(0.037 * this.width)]); //70
    // Define the div for the tooltip

    var div;

    if (document.getElementById("tooltip") !== null) {
      div = d3.select("div#tooltip");
    } else {
      div = d3.select("body").append("div").attr("id", "tooltip").attr("class", "tooltip").style("opacity", 0);
    }

    this.data = this.data.filter(function (obj) {
      return obj.name !== "Other world";
    });
    var projection = this.projection;
    var imageName = this.imageName;
    this.svg.selectAll("circle").remove();
    this.svg.selectAll("circle").data(this.data).enter().append("circle").attr("id", "flags") //            .transition().duration(200)
    .attr('r', function (d) {
      var res;

      if (typeof d.value != "undefined" && typeof d.value != "undefined") {
        if (d.value != null) {
          res = d.value;
        } else {
          res = 0;
        }
      } else {
        res = 0;
      }

      ;
      res = sizeScale(res);
      return res;
    }).attr('cx', function (d) {
      return projection(d.centroid)[0];
    }).attr('cy', function (d) {
      return projection(d.centroid)[1];
    }).style("fill", function (d) {
      return "url(#" + imageName + d.iso2 + ")";
    }).on("mouseover", function (d) {
      d3.select(this).classed("active", true);
      var res = 0;

      if (typeof d.value != "undefined" && typeof d.value != "undefined") {
        if (d.value != null) {
          res = d.value;
        }
      }

      var htmlData = d.rusCountry + "<br/>" + Math.round(res * 100) / 100 + " " + d.rusUnit + "<a href='" + d.rusSource + "'>*</a>";
      div.transition() // .duration(200)		
      .style("opacity", .9);
      div.html(htmlData).style("left", d3.event.pageX + "px").style("top", d3.event.pageY - 28 + "px");
    }).on("mouseout", function (d) {
      d3.select(this).classed("active", false); // div.transition()
      //     // .duration(500)		
      //     .style("opacity", 0);
    });
  };

  return flagCircleInMap;
}();