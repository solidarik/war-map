"use strict";

function _instanceof(left, right) { if (right != null && typeof Symbol !== "undefined" && right[Symbol.hasInstance]) { return right[Symbol.hasInstance](left); } else { return left instanceof right; } }

function _classCallCheck(instance, Constructor) { if (!_instanceof(instance, Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var AddMapInfoDiagramm =
/*#__PURE__*/
function () {
  function AddMapInfoDiagramm(divElement, data, width) {
    _classCallCheck(this, AddMapInfoDiagramm);

    this.divElement = divElement;
    this.data = data;
    this.width = width;
  }

  _createClass(AddMapInfoDiagramm, [{
    key: "addMapInfoDiagrammInDiv",
    value: function addMapInfoDiagrammInDiv() {
      // set the dimensions and margins of the graph
      var margin = {
        top: 20,
        right: 20,
        bottom: 30,
        left: 40
      },
          width = this.width - margin.left - margin.right,
          height = Math.round(this.width * 0.52) - margin.top - margin.bottom; // set the ranges

      var x = d3.scaleBand().range([0, width]).padding(0.1);
      var y = d3.scaleLinear().range([height, 0]); // append the svg object to the body of the page
      // append a 'group' element to 'svg'
      // moves the 'group' element to the top left margin

      d3.select("#" + this.divElement + "Svg").remove();
      var svg = d3.select("#" + this.divElement).append("svg").attr("id", this.divElement + "Svg").attr("width", width + margin.left + margin.right).attr("height", height + margin.top + margin.bottom).append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");
      console.log("this.data=" + JSON.stringify(this.data)); // this.data.forEach(function (d) {
      //      d.value = +d.value;
      // });
      // Scale the range of the data in the domains

      console.log("this.data.map=" + this.data.map(function (d) {
        return d.date;
      }));
      x.domain(this.data.map(function (d) {
        return d.date;
      }));
      console.log("d3.max=" + d3.max(this.data, function (d) {
        return d.value;
      }));
      y.domain([0, d3.max(this.data, function (d) {
        return d.value;
      })]); // append the rectangles for the bar chart

      svg.selectAll(".bar").data(this.data).enter().append("rect").attr("class", "bar").attr("x", function (d) {
        return x(d.date);
      }).attr("width", x.bandwidth()).attr("y", function (d) {
        return y(d.value);
      }).attr("height", function (d) {
        return height - y(d.value);
      });
      var domainXaxis;

      if (x.domain().length <= 10) {
        domainXaxis = x.domain();
      } else {
        if (x.domain().length <= 50) {
          domainXaxis = x.domain().filter(function (d, i) {
            return !(i % 5);
          });
        } else {
          if (x.domain().length <= 200) {
            domainXaxis = x.domain().filter(function (d, i) {
              return !(i % 10);
            });
          }
        }
      } // add the x Axis


      svg.append("g").attr("transform", "translate(0," + height + ")").call(d3.axisBottom(x).tickValues(domainXaxis)).selectAll("text").style("text-anchor", "end").attr("dx", "-.8em").attr("dy", ".15em").attr("transform", "rotate(-90)"); // add the y Axis

      svg.append("g").call(d3.axisLeft(y).ticks(5));
    }
  }]);

  return AddMapInfoDiagramm;
}();