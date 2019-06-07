"use strict";

function _instanceof(left, right) { if (right != null && typeof Symbol !== "undefined" && right[Symbol.hasInstance]) { return right[Symbol.hasInstance](left); } else { return left instanceof right; } }

function _classCallCheck(instance, Constructor) { if (!_instanceof(instance, Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var flagCircleInMap =
/*#__PURE__*/
function () {
  function flagCircleInMap(data, svg, projection, imageName, mxval, width, allData) {
    _classCallCheck(this, flagCircleInMap);

    this.data = data;
    this.svg = svg;
    this.projection = projection;
    this.imageName = imageName;
    this.mxval = mxval;
    this.width = width;
    this.allData = allData;
  }

  _createClass(flagCircleInMap, [{
    key: "sortIfDataCountries",
    value: function sortIfDataCountries(x, y) {
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
    }
  }, {
    key: "addFlagCircleInMap",
    value: function addFlagCircleInMap() {
      this.data.sort(this.sortIfDataCountries);
      var maxValue = this.data[0].dataCountries[0].value; //this.mxval;//this.getMaxValue(this.data);//
      //console.log("maxValue="+maxValue);

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
    }
  }, {
    key: "sortIfDataCountriesNew",
    value: function sortIfDataCountriesNew(x, y) {
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
    }
  }, {
    key: "addFlagCircleInMapNew",
    value: function addFlagCircleInMapNew() {
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
      var allData = this.allData;
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

        var htmlData;

        if (typeof d.rusSource !== 'undefined' && d.rusSource != null && d.rusSource.trim() != "") {
          htmlData = d.rusCountry + "<br/>" + Math.round(res * 100) / 100 + " " + d.rusUnit + "<a target='_blank' rel='noopener noreferrer' href='" + d.rusSource + "'>*</a>";
        } else {
          htmlData = d.rusCountry + "<br/><p style='font-weight: bold;color: red;'>" + Math.round(res * 100) / 100 + " " + d.rusUnit + " </p>";
        }

        div.transition() // .duration(200)		
        .style("opacity", .9);
        div.html(htmlData).style("left", d3.event.pageX + "px").style("top", d3.event.pageY - 28 + "px");
        //console.log("allData=" + JSON.stringify(allData));
        var dataForInfo = addSlider.filterByIso3New(allData, d.iso3);
        //console.log("dataForInfo=" + JSON.stringify(dataForInfo));
        var amid = new AddMapInfoDiagramm("mapContainerInfo", dataForInfo, parseInt(d3.select("#mapContainerInfo").style("width")), parseInt(d3.select("#mapContainerInfo").style("height")));
        amid.addMapInfoDiagrammInDiv();
      }).on("mouseout", function (d) {
        d3.select(this).classed("active", false); // div.transition()
        //     // .duration(500)		
        //     .style("opacity", 0);
      });
    }
  }], [{
    key: "getMaxValue",
    value: function getMaxValue(data) {
      var maxValue = -99999;
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = data[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var d = _step.value;
          d.dataCountries.forEach(function (d1) {
            var elem = d1.value;

            if (elem > maxValue) {
              maxValue = elem;
            }
          });
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return != null) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      return maxValue;
    }
  }, {
    key: "getMaxValueNew",
    value: function getMaxValueNew(data) {
      var maxValue = -99999;
      data.forEach(function (d) {
        var elem = d.value;

        if (elem > maxValue) {
          maxValue = elem;
        }
      });
      return maxValue;
    }
  }]);

  return flagCircleInMap;
}();