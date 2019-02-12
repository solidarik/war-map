class addSlider {

	static getListYear(data) {
		let listYear = [];
		for (let d of data) {
			d.dataCountries.forEach(function (d1) {
				let elem = d1.year;
				while (elem.length < 4) {
					elem = '0' + elem;
				}
				listYear.push(elem);
			});
			if (listYear.length > 0) {
				break;
			}
		};
		return listYear;
	}

	static getListYearNew(data) {
		let listYear = [];

		// let fdata = data.filter(function (n) {
		// 	return n.iso3 === "RUS";
		// });
		// console.log("fdata=" + fdata);
		// for (let index = 0; index < data.length; index++) {
		// 	const element = data[index].date;
		// 	if(element == "1945"){
		// 		console.log("(element == 1945");
		// 		console.log("listYear="+listYear);
		// 		console.log("listYear.includes(element)="+listYear.includes(element));
		// 		if(!listYear.includes(element)){
		// 			listYear.push(element);
		// 		}
		// 	}else{
		// 		if(!listYear.includes(element)){
		// 			listYear.push(element);
		// 		}
		// 	}

		// }

		data.forEach(function (d) {
			let elem = d.date;
			while (elem.length < 4) {
				elem = '0' + elem;
			}
			//if (!listYear.includes(elem)) {
			if (listYear.indexOf(elem) == -1) {
				listYear.push(elem);
			}
		});

		listYear.sort();

		return listYear;
	}

	static getListYearNewArray(data) {
		let listYear = [];
		data.forEach(function (d) {
			d.forEach(function (d1) {
				let elem = d1.date;
				while (elem.length < 4) {
					elem = '0' + elem;
				}
				//if (!listYear.includes(elem)) {
				if (listYear.indexOf(elem) == -1) {
					listYear.push(elem);
				}
			});
		});

		listYear.sort();

		return listYear;
	}

	static filterByYear(data, yearFilter) {
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

	static filterByYearNew(data, yearFilter) {
		let dataYearFilter = data.filter(function (object) {
			var year = object.date;
			return year == yearFilter;
		});
		return dataYearFilter;
	}

	static addSlider(idElemForSvg, width, listYear, updateFunction) {
		let margin = { top: 75, right: 50, bottom: 0, left: 50 };
		let widthSlider = width - margin.left - margin.right,
			heightSlider = 150;

		let xScale = d3.scaleLinear()
			.domain([0, listYear.length - 1])
			.range([0, widthSlider])
			.clamp(true);

		d3.select("#" + idElemForSvg).selectAll("svg").remove();

		let svg = d3.select("#" + idElemForSvg)
			.append("svg")
			.attr("width", widthSlider + margin.left + margin.right)
			.attr("height", heightSlider);


		let slider = svg.append("g")
			.attr("class", "slider")
			.attr("transform", "translate(" + margin.left + "," + heightSlider / 4 + ")");

		slider.append("line")
			.attr("class", "track")
			.attr("x1", function () { return xScale.range()[0]; })
			.attr("x2", function () { return xScale.range()[1]; })
			.select(function () { return this.parentNode.appendChild(this.cloneNode(true)); })
			.attr("class", "track-inset")
			.select(function () { return this.parentNode.appendChild(this.cloneNode(true)); })
			.attr("class", "track-overlay")
			.call(d3.drag()
				.on("start.interrupt", function () { slider.interrupt(); })
				.on("start drag", function () {
					updateFunction(xScale.invert(d3.event.x), handle, label, xScale);
				})
			);

		let yearCount = listYear.length;
		if (yearCount > Math.abs(widthSlider / 40)) {
			yearCount = Math.abs(widthSlider / 40);
		}
		slider.insert("g", ".track-overlay")
			.attr("class", "ticks")
			.attr("transform", "translate(0," + 18 + ")")
			.selectAll("text")
			.data(xScale.ticks(yearCount))
			.enter()
			.append("text")
			.attr("x", xScale)
			.attr("y", 10)
			.attr("text-anchor", "middle")
			.text(function (d) { return listYear[d]; });

		let handle = slider.insert("circle", ".track-overlay")
			.attr("class", "handle")
			.attr("r", 9);

		let label = slider.append("text")
			.attr("class", "label")
			.attr("text-anchor", "middle")
			.text(listYear[0])
			.attr("transform", "translate(0," + (-15) + ")")
	}

}