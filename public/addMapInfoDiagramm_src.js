var hslToRgb = function (h, s, l){
    var r, g, b;

    if(s == 0){
        r = g = b = l; // achromatic
    }else{
        function hue2rgb(p, q, t){
            if(t < 0) t += 1;
            if(t > 1) t -= 1;
            if(t < 1/6) return p + (q - p) * 6 * t;
            if(t < 1/2) return q;
            if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
            return p;
        }

        var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        var p = 2 * l - q;
        r = hue2rgb(p, q, h + 1/3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1/3);
    }

    return '#'+Math.round(r * 255).toString(16)+Math.round(g * 255).toString(16)+Math.round(b * 255).toString(16);
};


class AddMapInfoDiagramm {

    constructor(divElement, data, width, height) {
        this.divElement = divElement;
        this.data = data;
        this.width = width;
        this.height = height;
    }


    addMapInfoDiagrammInDiv() {
        // set the dimensions and margins of the graph
        var margin = { top: 20, right: 20, bottom: 30, left: 40 };
        var width = this.width - margin.left - margin.right;
        var height;
        if (this.width >= 160) {
            height = Math.round(this.height * 0.52) - margin.top - margin.bottom;
            if(height<=110){
                height = Math.round(this.height) - margin.top - margin.bottom;
            }
        } else {
            height = Math.round(this.height) - margin.top - margin.bottom;
        }

            //console.log("this.width="+this.width);
            //console.log("this.height="+this.height);

        // set the ranges
        var x = d3.scaleBand()
            .range([0, width])
            .padding(0.1);
        var y = d3.scaleLinear()
            .range([height, 0]);

        // append the svg object to the body of the page
        // append a 'group' element to 'svg'
        // moves the 'group' element to the top left margin
        d3.select("#"+this.divElement+"Svg").remove();

        var svg = d3.select("#"+this.divElement).append("svg")
            .attr("id",this.divElement+"Svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");

            //console.log("this.data=" + JSON.stringify(this.data));

            // this.data.forEach(function (d) {
            //      d.value = +d.value;
            // });

            // Scale the range of the data in the domains
            //console.log("this.data.map=" + this.data.map(function (d) { return d.date; }));
            x.domain(this.data.map(function (d) { return d.date; }));
            //console.log("d3.max=" + d3.max(this.data, function (d) { return d.value; }));
            var maxY = d3.max(this.data, function (d) { return d.value; });
            var uniY = d3.max(this.data, function (d) { return d.rusUnit; });
            y.domain([0, maxY]);

            

            // append the rectangles for the bar chart
            svg.selectAll(".bar")
                .data(this.data)
                .enter().append("rect")
                .attr("class", "bar")
                .attr("x", function (d) { return x(d.date); })
                .attr("width", x.bandwidth())
                .attr("fill",function(d){
                    var golden_ratio_conjugate = 0.618033988749895;
                    var h = Math.random();
                    h += golden_ratio_conjugate;
                    h %= 1;
                    return hslToRgb(h, 0.5, 0.60);
                })
                .attr("y", function (d) { return y(d.value); })
                .attr("height", function (d) { return height - y(d.value); });

            var domainXaxis;    

            if ((this.width >= 160)&&(height !== (Math.round(this.height) - margin.top - margin.bottom))) {
                
                if (x.domain().length <= 10) {
                  domainXaxis = x.domain();
                } 
                else {
                  if (x.domain().length <= 50) {
                    domainXaxis = x.domain().filter(function (d, i) {
                      return !(i % 5);
                    });
                  } 
                  else {
                    if (x.domain().length <= 200) {
                        domainXaxis = x.domain().filter(function (d, i) {
                            return !(i % 10);
                       });
                    }
                  }
                }

                // add the x Axis
                svg.append("g").attr("transform", "translate(0," + height + ")")
                    .call(d3.axisBottom(x).tickValues(domainXaxis))
                        .selectAll("text")
                        .style("text-anchor", "end")
                        .attr("dx", "-.8em")
                        .attr("dy", ".15em")
                        .attr("transform", "rotate(-90)");

                // add the y Axis
                svg.append("g").call(d3.axisLeft(y)
                                        .ticks(5)
                                        .tickFormat(function(d) { 
                                                        if(maxY<9999){
                                                            if(uniY.indexOf("тыс.") !== -1)
                                                                return d  + "тыс"
                                                            else if(uniY.indexOf("млн") !== -1)
                                                                return d  + "млн"
                                                            else
                                                                return d;
                                                        }
                                                        else if(maxY<99999){
                                                            if(uniY.indexOf("тыс.") !== -1)
                                                                return Math.floor(d/1000)  + "млн"
                                                            else if(uniY.indexOf("млн") !== -1)
                                                                return Math.floor(d/1000)  + "млрд"
                                                            else
                                                                return Math.floor(d/1000) + "тыс";
                                                        } 
                                                        else if (maxY<9999999999)
                                                            if(uniY.indexOf("тыс.") !== -1)
                                                                return Math.floor(d/1000000)  + "млрд"
                                                            else if(uniY.indexOf("млн") !== -1)
                                                                return Math.floor(d/1000000)  + "трлн"
                                                            else
                                                                return Math.floor(d/1000000) + "млн";                                                        
                                                    }))
                                                    .style("font-size","8px");;
            }
            else{

              var delit =  x.domain().length-1;///2;
              //console.log("x.domain().length="+x.domain().length);
              //console.log("x.domain().length/3="+x.domain().length/3);
              //console.log("x.domain().length/2="+x.domain().length/2);
              //delit = +delit;
		          //if (!isFinite(delit)) {
              //  delit = delit;
              //}
              //else{
              //  delit = (delit - delit % 1)   ||   (delit < 0 ? -0 : delit === 0 ? delit : 0);
              //}
              //console.log("delit="+delit);

              domainXaxis = x.domain().filter(function (d, i) {
                    return !(i % delit);
                  });
                
                // add the x Axis
                svg.append("g")
                  .attr("transform", "translate(0," + height + ")")
                    .call(d3.axisBottom(x).tickValues(domainXaxis))
                      .selectAll("text").style("text-anchor", "end")
                      .attr("dx", "-1em").attr("dy", "-.9em")
                      .attr("transform", "rotate(-90)")
                      .style("font-size","8px");

                // add the y Axis
                svg.append("g").call(d3.axisLeft(y)
                                        .ticks(2)
                                        .tickFormat(function(d) { 
                                                        if(maxY<9999){
                                                            if(uniY.indexOf("тыс.") !== -1)
                                                                return d  + "тыс"
                                                            else if(uniY.indexOf("млн") !== -1)
                                                                return d  + "млн"
                                                            else
                                                                return d;
                                                        }
                                                        else if(maxY<99999){
                                                            if(uniY.indexOf("тыс.") !== -1)
                                                                return Math.floor(d/1000)  + "млн"
                                                            else if(uniY.indexOf("млн") !== -1)
                                                                return Math.floor(d/1000)  + "млрд"
                                                            else
                                                                return Math.floor(d/1000) + "тыс";
                                                        } 
                                                        else if (maxY<9999999999)
                                                            if(uniY.indexOf("тыс.") !== -1)
                                                                return Math.floor(d/1000000)  + "млрд"
                                                            else if(uniY.indexOf("млн") !== -1)
                                                                return Math.floor(d/1000000)  + "трлн"
                                                            else
                                                                return Math.floor(d/1000000) + "млн";                                                        
                                                    }))
                                .style("font-size","8px");              
            }

    }

}