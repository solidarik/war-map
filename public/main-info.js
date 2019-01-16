"use strict";

window.app = {};
var app = window.app;

function startApp() {

    let protocol = ClientProtocol.create();

    ////////////////
    console.log("1");
    let url = "data/countries.json";
    let url2 = "data/data_new.json";//"data/data.json";//"data/word-country-data.json";//"data/word-country-centroids.json";
    d3.json(url, function (error, countries) {
        if (error) console.log(error);
        console.log("2");
        d3.json(url2, function (error, places) {
            if (error) console.log(error);
            console.log("3");
            //console.log("geojson", countries, places);

            console.log(d3.select("#mapContainer").style("width"));

            let width = $(window).width();//$('#mapContainer').width();//parseInt(d3.select("#mapContainer").style("width")),// '960',//'100%',
            let height =  Math.trunc(width * 5 / 12);//parseInt(d3.select("#mapContainer").style("height"));//'500';//'100%';

            console.log(width);
            console.log(height);

            let projection = d3.geoEquirectangular()
                .scale([width / (2 * Math.PI)]) // scale to fit group width;
                .translate([width / 2, height / 2])// ensure centred in group
                //.translate([0,0])// ensure centred in group
                ;
            console.log("1");

            let path = d3.geoPath()
                .projection(projection)

            let svg = d3.select("div#mapContainer").append("svg")
                .attr("width", width)
                .attr("height", height)
                .call(d3.zoom().on("zoom", function () {
                    svg.attr("transform", d3.event.transform)
                }));

            svg.selectAll("path")
                .data(countries.features)
                .enter().append("path")
                .attr("d", path)
                // .on("mouseover",function(d) {
                // 	//console.log("just had a mouseover", d3.select(d));
                // 	d3.select(this)
                //   	.classed("active",true)
                // })
                // .on("mouseout",function(d){
                // 	d3.select(this)
                //   	.classed("active",false)
                // })
                ;
            console.log("2");
            let maxMinYear = getMaxMinYear(places);
            console.log("maxMinYear[0]=" + maxMinYear[0]);
            console.log("maxMinYear[1]=" + maxMinYear[1]);
            let mxdt = '' + maxMinYear[0];
            while (mxdt.length < 4) {
                mxdt = '0' + mxdt;
            }
            let startDate = new Date(mxdt + "-01-01T00:00:00"),//new Date(maxMinYear[0], 0, 1),
                endDate = new Date(maxMinYear[1], 0, 1);
            console.log("startDate=" + startDate);
            console.log("endDate=" + endDate);

            let margin = { top: 75, right: 50, bottom: 0, left: 50 };
            let widthSlider = width - margin.left - margin.right,
                heightSlider = 150;
            let formatDateIntoYear = d3.timeFormat("%Y");
            let formatDate = d3.timeFormat("%Y");

            let moving = false;
            let currentValue = 0;
            let targetValue = widthSlider;

            let x = d3.scaleTime()
                .domain([startDate, endDate])
                .range([0, targetValue])
                //.nice()
                .clamp(true);
            console.log("3");
            let svg_sl = d3.select("#vis")
                .append("svg")
                .attr("width", widthSlider + margin.left + margin.right)//
                .attr("height", heightSlider);//+ margin.top + margin.bottom

            let slider = svg_sl.append("g")
                .attr("class", "slider")
                .attr("transform", "translate(" + margin.left + "," + heightSlider / 4 + ")");

            console.log("4");

            slider.append("line")
                .attr("class", "track")
                .attr("x1", function () { return x.range()[0]; })
                .attr("x2", function () { return x.range()[1]; })
                .select(function () { return this.parentNode.appendChild(this.cloneNode(true)); })
                .attr("class", "track-inset")
                .select(function () { return this.parentNode.appendChild(this.cloneNode(true)); })
                .attr("class", "track-overlay")
                .call(d3.drag()
                    .on("start.interrupt", function () { slider.interrupt(); })
                    .on("start drag", function () {
                        currentValue = d3.event.x;
                        update(x.invert(currentValue));
                    })
                );

            let yearCount = endDate.getFullYear() - startDate.getFullYear();
            //yearCount = Math.abs(yearCount/1000/60/60/24/12);

            if (yearCount > Math.abs(widthSlider / 30)) {
                yearCount = Math.abs(widthSlider / 30);
            }

            slider.insert("g", ".track-overlay")
                .attr("class", "ticks")
                .attr("transform", "translate(0," + 18 + ")")
                .selectAll("text")
                .data(x.ticks(yearCount))
                .enter()
                .append("text")
                .attr("x", x)
                .attr("y", 10)
                .attr("text-anchor", "middle")
                .text(function (d) { return formatDateIntoYear(d); });

            console.log("5");

            let handle = slider.insert("circle", ".track-overlay")
                .attr("class", "handle")
                .attr("r", 9);

            let label = slider.append("text")
                .attr("class", "label")
                .attr("text-anchor", "middle")
                .text(formatDate(startDate))
                .attr("transform", "translate(0," + (-25) + ")")

            console.log("6");

            function update(h) {
                // update position and text of label according to slider scale
                console.log(h);
                console.log(h.getFullYear());
                let mxdt = '' + h.getFullYear();
                while (mxdt.length < 4) {
                    mxdt = '0' + mxdt;
                }
                let h1 = new Date(mxdt + "-01-01T00:00:00");
                console.log(h1);
                console.log(x.invert(h1));
                console.log(x(h));
                console.log(x.invert(h));
                handle.attr("cx", x(h1));

                label.attr("x", x(h1)).text(formatDate(h1));

                // filter data set and redraw plot
                //var newData = dataset.filter(function (d) {
                //	return d.date < h;
                //})
                //drawPlot(newData);
                let curDataYearFilter = filterByYear(places, h.getFullYear());
                let flagCircleInMap = new FlagCircleInMap(curDataYearFilter, svg, projection, "img_");
                flagCircleInMap.addFlagCircleInMap();
            }
            console.log("7");
            let addImageInPage = new AddImageInPage(svg, places, "iso2", "img_", "img/flags/", ".png");
            addImageInPage.addImageInPage();
            console.log("8");
            let curDataYearFilter = filterByYear(places, maxMinYear[0]);
            console.log("9");
            let flagCircleInMap = new FlagCircleInMap(curDataYearFilter, svg, projection, "img_");
            console.log("10");
            flagCircleInMap.addFlagCircleInMap();
            console.log("11");

            let playButton = d3.select("#play-button");
            playButton.on("click", function () {

            });

        })

    });

    ///////////////
}

function filterByYear(data, yearFilter) {
    let dataYearFilter = [];
    data.forEach(function (d) {
        let curElemnt = {};
        curElemnt.id = d.id;
        curElemnt.name = d.name;
        curElemnt.name_ru = d.name_ru;
        curElemnt.fips = d.fips;
        curElemnt.iso2 = d.iso2;
        curElemnt.iso3 = d.iso3;
        curElemnt.centroid = d.centroid;
        curElemnt.dataCountries = d.dataCountries.filter(function (object) {
            var year = object.year;
            return year == yearFilter;
        });
        dataYearFilter.push(curElemnt);
    });
    return dataYearFilter;
}

function getMaxMinYear(data) {
    let maxMinYear = [];
    let curElemnt = data[1].dataCountries;
    let maxYear = curElemnt[0].year;
    let minYear = curElemnt[curElemnt.length - 1].year;
    maxMinYear.push(maxYear);
    maxMinYear.push(minYear);
    return maxMinYear;
}