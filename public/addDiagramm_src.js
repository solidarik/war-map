var indicatorsData = [
    { "iso2": "US", iso3: 'USA', gdp: 15000, indicators: { agriculture: 188, industry: 3516, services: 14344 } }
    , { "iso2": "CN", iso3: 'CHN', gdp: 11000, indicators: { agriculture: 958, industry: 4463, services: 5769 } }
    , { "iso2": "JP", iso3: 'JPN', gdp: 5000, indicators: { agriculture: 56, industry: 1450, services: 3404 } }
    , { "iso2": "DE", iso3: 'DEU', gdp: 3000, indicators: { agriculture: 192, industry: 955, services: 2158 } }
    , { "iso2": "GB", iso3: 'GBR', gdp: 5000, indicators: { agriculture: 14, industry: 476, services: 1871 } }
    , { "iso2": "FR", iso3: 'FRA', gdp: 4000, indicators: { agriculture: 35, industry: 432, services: 1733 } }
    , { "iso2": "IT", iso3: 'ITA', gdp: 2000, indicators: { agriculture: 359, industry: 398, services: 1234 } }
    , { "iso2": "CA", iso3: 'CAN', gdp: 1500, indicators: { agriculture: 25, industry: 495, services: 1163 } }
    , { "iso2": "IN", iso3: 'IND', gdp: 1300, indicators: { agriculture: 370, industry: 60, services: 1088 } }
    , { "iso2": "BR", iso3: 'BRA', gdp: 1400, indicators: { agriculture: 87, industry: 327, services: 1134 } }
    , { "iso2": "OW", iso3: 'OWD', gdp: 16000, indicators: { agriculture: 969, industry: 5111, services: 10562 } }
];

let dataGDPTOP10;
const urlGDPTOP10 = "data/TOP10/TOP10_GDP (current US$).json";
let dataAgriculture;
const urlAgriculture = "data/DTO/Agriculture, forestry, and fishing, value added (current US$).json";
let dataIndustry;
const urlIndustry = "data/DTO/Industry (including construction), value added (current US$).json";
let dataServices;
const urlServices = "data/DTO/Services, value added (current US$).json";

let listYearDasboard;

let indicatorsDataDasboard = [];

let svgDiagramm = d3.select("#dashboard").append("svg").attr("width", 0).attr("height", 0);



// let url2 = "data/word-country-data.json";//"data/word-country-centroids.json";
// d3.json(url2, function(error, places) {
//     var defs = svg.append("defs");
//     let imgPattern = defs.selectAll("pattern").data(places)
//         .enter()
//         .append("pattern")
//             .attr("id", function(d){return "img_"+d.iso2;})
//             .attr("width", "100%")
//             .attr("height", "100%")
//             .attr("patternUnits", "objectBoundingBox")
//             .attr("patternContentUnits", "objectBoundingBox")
//         .append("image")
//             .attr("width", 1)
//             .attr("height", 1)
//             .attr("preserveAspectRatio", "none")
//             .attr("xlink:href", function(d){return "img/flags/"+d.iso2+".png";})
//     ;


// 	// let imgPattern1 = defs.selectAll("pattern").data([1,2])
//     // .enter()
//     //     .append("pattern")
//     //         .attr("id", "img_OW")
//     //         .attr("width", "100%")
//     //         .attr("height", "100%")
//     //         .attr("patternUnits", "objectBoundingBox")
//     //         .attr("patternContentUnits", "objectBoundingBox")
//     //     .append("image")
//     //         .attr("width", 1)
//     //         .attr("height", 1)
//     //         .attr("preserveAspectRatio", "none")
//     //         .attr("xlink:href", "img/flags/OW.png")
//     // ;

//     dashboard('#dashboard',indicatorsData);
// });

function updateDasboardFunction() {
    console.log("updateDasboardFunction");
}

function updateDasboardFunction(h, handle, label, xScale) {
    // update position and text of label according to slider scale
    let h2 = Number((h).toFixed(0));
    handle.attr("cx", xScale(h));

    label.attr("x", xScale(h)).text(listYearDasboard[h2]);
    //console.log("updateDasboardFunction");

    let fIndicatorData = filterIndicatorData(listYearDasboard[h2]);
    //console.log("fIndicatorData = " + JSON.stringify(fIndicatorData));
    dashboard('#dashboard', fIndicatorData);//indicatorsData);
    //let curDataYearFilter = addSlider.filterByYearNew(ldata.dataFromFile, ldata.listYear[h2]);
    //let flagCircleInMapLoc = new flagCircleInMap(curDataYearFilter, svg, projection, "img_");
    //flagCircleInMapLoc.addFlagCircleInMapNew();
}

function filterIndicatorData(year) {
    let fdataGDPTOP10 = dataGDPTOP10.filter(
        function (n) {
            return n[0].date === year;
        });
    indicatorsDataDasboard=[];
    fdataGDPTOP10.forEach(function (d) {
        d.forEach(function (d1) {
            let obj = {};
            let indObj = {};
            //console.log(year+" "+d1.iso3);
            let fdataAgricultur = dataAgriculture.filter(function (n) {
                return (n.iso3 === d1.iso3)&(n.date === year);
            });
            //console.log(JSON.stringify(fdataAgricultur));
            let fdataIndustry = dataIndustry.filter(function (n) {
                return (n.date === year)&(n.iso3 === d1.iso3);
            });
            let fdataServices = dataServices.filter(function (n) {
                return (n.date === year)&(n.iso3 === d1.iso3);
            });  
            //console.log(fdataAgricultur[0]);
            //console.log(typeof fdataAgricultur[0]);

            if(typeof fdataAgricultur[0] !=='undefined'){
                indObj.agriculture=Math.round((fdataAgricultur[0].value || 0)/1000000000);
            }
            else{
                indObj.agriculture=0;
            }
            
            if(typeof fdataIndustry[0] !=='undefined'){
                indObj.industry=Math.round((fdataIndustry[0].value || 0)/1000000000);
            }
            else{
                indObj.industry=0;
            }

            if(typeof fdataServices[0] !=='undefined'){
                indObj.services=Math.round((fdataServices[0].value || 0)/1000000000);
            }
            else{
                indObj.services=0;
            }
            
            obj.iso2=d1.iso2;
            obj.iso3=d1.iso3;
            obj.gdp=Math.round(d1.value/1000000000);
            obj.year=year;
            obj.indicators=indObj;
            indicatorsDataDasboard.push(obj);   
        });
    });

    return indicatorsDataDasboard;
}

$(document).ready(function () {
    d3.json(urlGDPTOP10, function (error, dGDPTOP10) {
        if (error) console.log(error);
        //console.log(urlGDPTOP10);
        dataGDPTOP10 = dGDPTOP10;
        d3.json(urlAgriculture, function (error, dAgriculture) {
            if (error) console.log(error);
            //console.log(urlAgriculture);
            dataAgriculture = dAgriculture;
            d3.json(urlIndustry, function (error, dIndustry) {
                if (error) console.log(error);
                //console.log(urlIndustry);
                dataIndustry = dIndustry;
                d3.json(urlServices, function (error, dServices) {
                    if (error) console.log(error);
                    //console.log(urlServices);
                    dataServices = dServices;
                    listYearDasboard = addSlider.getListYearNewArray(dataGDPTOP10);

                    addSlider.addSlider("visDashboard", width, listYearDasboard, updateDasboardFunction);

                    let fIndicatorData = filterIndicatorData(listYearDasboard[0].toString());

                    //console.log("fIndicatorData = " + JSON.stringify(fIndicatorData));

                    dashboard('#dashboard', fIndicatorData);//indicatorsData);
                });
            });
        });
    });


});

function dashboard(id, fData) {

    d3.select(id).selectAll("*").remove();

    var barColor = 'steelblue';
    function segColor(c) { return { agriculture: "#807dba", industry: "#e08214", services: "#41ab5d" }[c]; }

    // compute total for each state.
    fData.forEach(function (d) { d.total = d.gdp/*d.indicators.agriculture+d.indicators.industry+d.indicators.services*/; });

    // function to handle histogram.
    function histoGram(fD) {
        var hG = {}, hGDim = { t: 60, r: 0, b: 30, l: 0 };
        hGDim.w = 700 - hGDim.l - hGDim.r,
            hGDim.h = 300 - hGDim.t - hGDim.b;

        

        //create svg for histogram.
        var hGsvg = d3.select(id).append("svg")
            .attr("width", hGDim.w + hGDim.l + hGDim.r)
            .attr("height", hGDim.h + hGDim.t + hGDim.b).append("g")
            .attr("transform", "translate(" + hGDim.l + "," + hGDim.t + ")");

        // create function for x-axis mapping.
        var x = d3.scaleBand().rangeRound([0, hGDim.w]).padding(0.1).domain(fD.map(function (d) { return d[0]; }));

        // Add x-axis to the histogram svg.
        hGsvg.append("g").attr("class", "x axis").attr("transform", "translate(0," + hGDim.h + ")").call(d3.axisBottom().scale(x));

        // Create function for y-axis map.
        var y = d3.scaleLinear().rangeRound([hGDim.h, 0]).domain([0, d3.max(fD, function (d) { return d[1]; })]);

        // Create bars for histogram to contain rectangles and indicators labels.
        var bars = hGsvg.selectAll(".bar").data(fD).enter().append("g").attr("class", "bar");

        //create the rectangles.
        bars.append("rect")
            .attr("x", function (d) { return x(d[0]); })
            .attr("y", function (d) { return y(d[1]); })
            .attr("width", x.bandwidth())
            .attr("height", function (d) { return hGDim.h - y(d[1]); })

            //.attr('fill',barColor)
            .style("fill", function (d) { return "url(#img_" + d[2] + ")"; })
            .style("stroke-width", "1px")
            .style("stroke", "#111")
            .on("mouseover", mouseover)// mouseover is defined below.
            .on("mouseout", mouseout);// mouseout is defined below.

        //Create the indicatorsuency labels above the rectangles.
        bars.append("text").text(function (d) { return d3.format(",")(d[1]) })
            .attr("x", function (d) { return x(d[0]) + x.bandwidth() / 2; })
            .attr("y", function (d) { return y(d[1]) - 5; })
            .attr("text-anchor", "middle");

        function mouseover(d) {  // utility function to be called on mouseover.
            // filter for selected state.
            var st = fData.filter(function (s) { return s.iso3 == d[0]; })[0],
                nD = d3.keys(st.indicators).map(function (s) { return { type: s, indicators: st.indicators[s] }; });

            // call update functions of pie-chart and legend.    
            pC.update(nD);
            leg.update(nD);
        }

        function mouseout(d) {    // utility function to be called on mouseout.
            // reset the pie-chart and legend.    
            pC.update(tF);
            leg.update(tF);
        }

        // create function to update the bars. This will be used by pie-chart.
        hG.update = function (nD, color) {
            // update the domain of the y-axis map to reflect change in indicatorsuencies.
            y.domain([0, d3.max(nD, function (d) { return d[1]; })]);

            // Attach the new data to the bars.
            var bars = hGsvg.selectAll(".bar").data(nD);

            // transition the height and color of rectangles.
            bars.select("rect").transition().duration(500)
                .attr("y", function (d) { return y(d[1]); })
                .attr("height", function (d) { return hGDim.h - y(d[1]); })
                .attr("fill", color);

            // transition the indicatorsuency labels location and change value.
            bars.select("text").transition().duration(500)
                .text(function (d) { return d3.format(",")(d[1]) })
                .attr("y", function (d) { return y(d[1]) - 5; });
        }
        return hG;
    }

    // function to handle pieChart.
    function pieChart(pD) {
        var pC = {}, pieDim = { w: 250, h: 250 };
        pieDim.r = Math.min(pieDim.w, pieDim.h) / 2;

        // create svg for pie chart.
        var piesvg = d3.select(id).append("svg")
            .attr("width", pieDim.w).attr("height", pieDim.h).append("g")
            .attr("transform", "translate(" + pieDim.w / 2 + "," + pieDim.h / 2 + ")");

        // create function to draw the arcs of the pie slices.
        var arc = d3.arc().outerRadius(pieDim.r - 10).innerRadius(0);

        // create a function to compute the pie slice angles.
        var pie = d3.pie().sort(null).value(function (d) { return d.indicators; });

        // Draw the pie slices.
        piesvg.selectAll("path").data(pie(pD)).enter().append("path").attr("d", arc)
            .each(function (d) { this._current = d; })
            .style("fill", function (d) { return segColor(d.data.type); })
            .on("mouseover", mouseover).on("mouseout", mouseout);

        // create function to update pie-chart. This will be used by histogram.
        pC.update = function (nD) {
            piesvg.selectAll("path").data(pie(nD)).transition().duration(500)
                .attrTween("d", arcTween);
        }
        // Utility function to be called on mouseover a pie slice.
        function mouseover(d) {
            // call the update function of histogram with new data.
            hG.update(fData.map(function (v) {
                return [v.iso3, v.indicators[d.data.type]];
            }), segColor(d.data.type));
        }
        //Utility function to be called on mouseout a pie slice.
        function mouseout(d) {
            // call the update function of histogram with all data.
            hG.update(fData.map(function (v) {
                return [v.iso3, v.total];
            }), barColor);
        }
        // Animating the pie-slice requiring a custom function which specifies
        // how the intermediate paths should be drawn.
        function arcTween(a) {
            var i = d3.interpolate(this._current, a);
            this._current = i(0);
            return function (t) { return arc(i(t)); };
        }
        return pC;
    }

    // function to handle legend.
    function legend(lD) {
        var leg = {};

        // create table for legend.
        var legend = d3.select(id).append("table").attr('class', 'legend');

        // create one row per segment.
        var tr = legend.append("tbody").selectAll("tr").data(lD).enter().append("tr");

        // create the first column for each segment.
        tr.append("td").append("svg").attr("width", '16').attr("height", '16').append("rect")
            .attr("width", '16').attr("height", '16')
            .attr("fill", function (d) { return segColor(d.type); });

        // create the second column for each segment.agriculture:188, industry:3516, services:14344}
        tr.append("td").text(function (d) {
            if (d.type == "agriculture") { return "Сельское хозяйство" };
            if (d.type == "industry") { return "Промышленность" };
            if (d.type == "services") { return "Обслуживание" };
        });

        // create the third column for each segment.
        tr.append("td").attr("class", 'legendindicators')
            .text(function (d) { return d3.format(",")(d.indicators); });

        // create the fourth column for each segment.
        tr.append("td").attr("class", 'legendPerc')
            .text(function (d) { return getLegend(d, lD); });

        // Utility function to be used to update the legend.
        leg.update = function (nD) {
            // update the data attached to the row elements.
            var l = legend.select("tbody").selectAll("tr").data(nD);

            // update the indicatorsuencies.
            l.select(".legendindicators").text(function (d) { return d3.format(",")(d.indicators); });

            // update the percentage column.
            l.select(".legendPerc").text(function (d) { return getLegend(d, nD); });
        }

        function getLegend(d, aD) { // Utility function to compute percentage.
            return d3.format("%")(d.indicators / d3.sum(aD.map(function (v) { return v.indicators; })));
        }

        return leg;
    }

    // calculate total indicatorsuency by segment for all state.
    var tF = ['agriculture', 'industry', 'services'].map(function (d) {
        return { type: d, indicators: d3.sum(fData.map(function (t) { return t.indicators[d]; })) };
    });

    // calculate total indicatorsuency by state for all segment.
    var sF = fData.map(function (d) { return [d.iso3, d.total, d.iso2]; });

    var hG = histoGram(sF), // create the histogram.
        pC = pieChart(tF), // create the pie-chart.
        leg = legend(tF);  // create the legend.
}
