class flagCircleInMap {

    constructor(data, svg, projection, imageName,mxval,width,allData) {
        this.data = data;
        this.svg = svg;
        this.projection = projection;
        this.imageName = imageName;
        this.mxval = mxval;
        this.width = width;
        this.allData = allData;
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

    static getMaxValue(data) {
        let maxValue = -99999;
        for (let d of data) {
            d.dataCountries.forEach(function (d1) {
                let elem = d1.value;
                if (elem > maxValue) {
                    maxValue = elem;
                }
            });
        }

        return maxValue;
    }

    addFlagCircleInMap() {
        this.data.sort(this.sortIfDataCountries);

        let maxValue = this.data[0].dataCountries[0].value;//this.mxval;//this.getMaxValue(this.data);//
        console.log("maxValue="+maxValue);

        let sizeScale = d3.scaleSqrt().domain([0, maxValue]).range([0, Math.round(0.037*this.width)]);//70
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
        this.data = this.data.filter(function (obj) {
            return obj.name !== "Other world";
        });

        let projection = this.projection;
        let imageName = this.imageName;

        this.svg.selectAll("circle").remove();

        this.svg.selectAll("circle")
            .data(this.data)
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
            .attr('cx', function (d) { return projection(d.centroid)[0] })
            .attr('cy', function (d) { return projection(d.centroid)[1] })
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
                // d3.select(this).classed("active", false);
                // div.transition()
                //     // .duration(500)		
                //     .style("opacity", 0);
            });

    }

    static getMaxValueNew(data) {
        let maxValue = -99999;

        data.forEach(function (d) {
            let elem = d.value;
            if (elem > maxValue) {
                maxValue = elem;
            }
        });

        return maxValue;
    }
    sortIfDataCountriesNew(x, y) {
        let resX = 0;
        if (typeof (x.value) != "undefined" && typeof (x.value) != "undefined") {
            if (x.value != null) {
                resX = x.value;
            }
        }
        let resY = 0;
        if (typeof (y.value) != "undefined" && typeof (y.value) != "undefined") {
            if (y.value != null) {
                resY = y.value;
            }
        }
        return d3.descending(resX, resY);
    }

    addFlagCircleInMapNew() {
        this.data.sort(this.sortIfDataCountriesNew);

        let maxValue = this.data[0].value;//this.mxval;//this.getMaxValueNew(this.data);//

        let sizeScale = d3.scaleSqrt().domain([0, maxValue]).range([0, Math.round(0.037*this.width)]);//70
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
        this.data = this.data.filter(function (obj) {
            return obj.name !== "Other world";
        });

        let projection = this.projection;
        let imageName = this.imageName;
        let allData = this.allData;

        this.svg.selectAll("circle").remove();

        this.svg.selectAll("circle")
            .data(this.data)
            .enter().append("circle")
            .attr("id", "flags")
            //            .transition().duration(200)
            .attr('r', function (d) {
                let res;
                if (typeof (d.value) != "undefined" && typeof (d.value) != "undefined") {
                    if (d.value != null) {
                        res = d.value;
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
            .attr('cx', function (d) { return projection(d.centroid)[0] })
            .attr('cy', function (d) { return projection(d.centroid)[1] })
            .style("fill", function (d) { return "url(#" + imageName + d.iso2 + ")"; })
            .on("mouseover", function (d) {
                d3.select(this).classed("active", true);
                let res = 0;
                if (typeof (d.value) != "undefined" && typeof (d.value) != "undefined") {
                    if (d.value != null) {
                        res = (d.value);
                    }
                }
                const htmlData = d.rusCountry + "<br/>" + Math.round(res * 100) / 100 + " "+d.rusUnit+"<a href='"+d.rusSource+"'>*</a>";

                div.transition()
                    // .duration(200)		
                    .style("opacity", .9);
                div.html(htmlData)
                    .style("left", (d3.event.pageX) + "px")
                    .style("top", (d3.event.pageY - 28) + "px");


                console.log("allData=" + JSON.stringify(allData));    
                var dataForInfo = addSlider.filterByIso3New(allData, d.iso3);

                var amid =  new AddMapInfoDiagramm("mapContainerInfo",dataForInfo,parseInt(d3.select("#mapContainerInfo").style("width")));
                amid.addMapInfoDiagrammInDiv();

            })
            .on("mouseout", function (d) {
                d3.select(this).classed("active", false);
                // div.transition()
                //     // .duration(500)		
                //     .style("opacity", 0);
            });

    }

}