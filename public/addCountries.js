class addCountries {
    static addContries(data,svg,projection){
        let path = d3.geoPath().projection(projection);

        svg.selectAll("path")
			.data(data)
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
    }
    
}