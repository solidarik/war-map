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
        var width = this.width - margin.left - margin.right-10;
        var height;
        if (this.width >= 160) {
            height = Math.round(this.height * 0.52) - margin.top - margin.bottom;
            if(height<=110){
                height = Math.round(this.height) - margin.top - margin.bottom;
            }
        } else {
            height = Math.round(this.height) - margin.top - margin.bottom;
        }

        //add -1 when not in 14-65
        for(var i=1914;i<1966;i++){
            var df = this.data.filter(
                function(d){ return parseInt(d.date) == i }
            );

            if(df.length==0){
                var e = {};
                e.iso3=this.data[0].iso3;
                e.iso2=this.data[0].iso2;
                e.rusCountry=this.data[0].rusCountry;
                e.engCountry=this.data[0].engCountry;
                e.rusCity=this.data[0].rusCity;
                e.engCity=this.data[0].engCity;
                e.rusIndicator=this.data[0].rusIndicator;
                e.engIndicator=this.data[0].engIndicator;
                e.date=i.toString();
                e.rusUnit=this.data[0].rusUnit;
                e.engUnit=this.data[0].engUnit;
                e.value=0.0;
                e.rusSource="";
                e.engSource="";
                e.sourceURL="";
                e.engComment=""
                e.centroid==this.data[0].centroid;
                
                this.data.push(e);
            }
            //break;
        }
        this.data.sort(function(a,b){
            if(a.date > b.date)  
                return 1;  
            else if(a.date < b.date)  
                return -1;  
            return 0; 
        });
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
            .attr("width", width + margin.left + margin.right - 10)
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
            var couY = d3.max(this.data, function (d) { return d.rusCountry; });
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
                                                            return d;
                                                        }
                                                        else if(maxY<999999){
                                                            return (d/1000).toFixed(1);
                                                        } 
                                                        else if (maxY<9999999999){
                                                            return (d/1000000).toFixed(1);
                                                        }
                                                    }))
                                                    .style("font-size","8px");
                svg.append("text")
                    .attr("x", width / 2)
                    .attr("y", -10)
                    .attr("class", "title")
                    .style("text-anchor", "middle")
                    .style("font-size", "10px")
                    .text(function(){ 
                            if(maxY<9999){
                                if(uniY.indexOf("тыс.") !== -1)
                                    return couY + " "+ uniY.replace("тыс.","тысячи").replace("ед","единиц") 
                                else if(uniY.indexOf("млн") !== -1)
                                    return couY + " "+ uniY.replace("млн","миллионы").replace("ед","единиц")  
                                else
                                    return couY + " "+ uniY.replace("ед","единиц") ;
                            }
                            else if(maxY<999999){
                                if(uniY.indexOf("тыс.") !== -1)
                                    return couY + " "+ uniY.replace("тыс.","миллионы").replace("ед","единиц")  
                                else if(uniY.indexOf("млн") !== -1)
                                    return couY + " "+ uniY.replace("млн","миллиарды").replace("ед","единиц")  
                                else
                                    return couY + " " + "тысячи "+uniY.replace("ед","единиц") ;
                            } 
                            else if (maxY<9999999999)
                                if(uniY.indexOf("тыс.") !== -1)
                                    return couY + " "+ uniY.replace("тыс.","миллиарды").replace("ед","единиц")  
                                else if(uniY.indexOf("млн") !== -1)
                                    return couY + " "+ uniY.replace("тыс.","триллиарды").replace("ед","единиц") 
                                else
                                    return couY + " "+"миллионы "+ uniY.replace("ед","единиц")  ;                                                        
                        });
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
                                        .tickFormat(function(d){ 
                                                        if(maxY<9999){ 
                                                            return d;
                                                        }
                                                        else if(maxY<999999){
                                                            return (d/1000).toFixed(1);
                                                        } 
                                                        else if (maxY<9999999999){
                                                            return (d/1000000).toFixed(1);
                                                        }
                                                    }))
                                .style("font-size","8px");  
                 svg.append("text")
                    .attr("x", width / 2)
                    .attr("y", -8)
                    .attr("class", "title")
                    .style("text-anchor", "middle")
                    .style("font-size", "8px")
                    .text(function(){ 
                            if(maxY<9999){
                                if(uniY.indexOf("тыс.") !== -1)
                                    return couY + " "+ uniY.replace("тыс.","тысячи").replace("ед","единиц")  
                                else if(uniY.indexOf("млн") !== -1)
                                    return couY + " "+ uniY.replace("млн","миллионы").replace("ед","единиц")  
                                else
                                    return couY + " "+ uniY.replace("ед","единиц") ;
                            }
                            else if(maxY<999999){
                                if(uniY.indexOf("тыс.") !== -1)
                                    return couY + " "+ uniY.replace("тыс.","миллионы").replace("ед","единиц")  
                                else if(uniY.indexOf("млн") !== -1)
                                    return couY + " "+ uniY.replace("млн","миллиарды").replace("ед","единиц")  
                                else
                                    return couY + " " + "тысячи "+uniY.replace("ед","единиц") ;
                            } 
                            else if (maxY<9999999999)
                                if(uniY.indexOf("тыс.") !== -1)
                                    return couY + " "+ uniY.replace("тыс.","миллиарды").replace("ед","единиц")  
                                else if(uniY.indexOf("млн") !== -1)
                                    return couY + " "+ uniY.replace("тыс.","триллиарды").replace("ед","единиц") 
                                else
                                    return couY + " "+"миллионы "+ uniY.replace("ед","единиц");                                                        
                        });            
            }

    }

}