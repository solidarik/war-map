class FlagCircleInMap {

    constructor(places, svg, projection, imageName) {
        this.places = places;
        this.svg = svg;
        this.projection = projection;
        this.imageName = imageName;
    }

    sortIfDataCountries(x, y) {
        let resX = 0;
        if (typeof (x.dataCountries) != "undefined" && typeof (x.dataCountries[0]) != "undefined") {
            if (x.dataCountries[0].value != null) {
                resX = x.dataCountries[0].value;
            }
        }
        let resY = 0;
        if (typeof (y.dataCountries) != "undefined" && typeof (y.dataCountries[0]) != "undefined") {
            if (y.dataCountries[0].value != null) {
                resY = y.dataCountries[0].value;
            }
        }
        return d3.descending(resX, resY);
    }

    addFlagCircleInMap() {
        console.log("1");
        this.places.sort(this.sortIfDataCountries);

        let maxValue = this.places[0].dataCountries[0].value;

        let sizeScale = d3.scaleSqrt().domain([0, maxValue]).range([0, 60]);
        console.log("2");
        // Define the div for the tooltip
        let div;
        if (document.getElementById("tooltip") !== null) {
            div = d3.select("div#tooltip");
        }
        else {
            div = d3.select("body").append("div")
                .attr("id", "tooltip")
                .attr("class", "tooltip")
                .style("opacity", 0);
        }
        console.log("3");
        this.places = this.places.filter(function (obj) {
            return obj.name !== "Other world";
        });

        let projection = this.projection;
        let imageName = this.imageName;

        console.log(this.places);

        this.svg.selectAll("circle").remove();

        console.log("4");
        this.svg.selectAll("circle")
            .data(this.places)
            .enter().append("circle") 
            .attr("id", "flags")
//            .transition().duration(200)
            .attr('r', function (d) {
                let res;
                if (typeof (d.dataCountries) != "undefined" && typeof (d.dataCountries[0]) != "undefined") {
                    if (d.dataCountries[0].value != null) {
                        res = (d.dataCountries)[0].value;
                    }
                    else {
                        res = 0;
                    }

                }
                else {
                    res = 0;
                };
                res = sizeScale(res);
                return res;
            })
            .attr('cx', function (d) { /*console.log(d.iso2);console.log(d.iso2 + "_cx=" + projection(d.centroid)[0]);*/ return projection(d.centroid)[0] })
            .attr('cy', function (d) { /*console.log(d.iso2);console.log(d.iso2 + "_cx=" + projection(d.centroid)[1]);*/ return projection(d.centroid)[1] })
            .style("fill", function (d) { return "url(#" + imageName + d.iso2 + ")"; })
            .on("mouseover", function (d) {
                d3.select(this).classed("active", true);
                let res = 0;
                if (typeof (d.dataCountries) != "undefined" && typeof (d.dataCountries[0]) != "undefined") {
                    if (d.dataCountries[0].value != null) {
                        res = (d.dataCountries)[0].value / 1000000;
                    }
                }
                const htmlData = d.name_ru + "<br/>ВВП:" + Math.round(res * 100) / 100 + " m US$";

                div.transition()
                    // .duration(200)		
                    .style("opacity", .9);
                div.html(htmlData)
                    .style("left", (d3.event.pageX) + "px")
                    .style("top", (d3.event.pageY - 28) + "px");

            })
            .on("mouseout", function (d) {
                d3.select(this).classed("active", false);
                div.transition()
                    // .duration(500)		
                    .style("opacity", 0);
            });
            console.log("5");
    }

}