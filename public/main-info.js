"use strict";

window.app = {};
var app = window.app;

var loadedData = [];
//loadedData.push({ "id": "21", "EngName": "Tanks", "RusName": "Танки", "url": "data/tanks.json", "jsonType": "UFA" });
//loadedData.push({ "id": "17", "EngName": "Artillery", "RusName": "Артиллерия", "url": "data/artillery.json", "jsonType": "UFA" });
//loadedData.push({ "id": "18", "EngName": "Heavy artillery", "RusName": "Тяжелая артиллерия", "url": "data/heavy_artillery.json", "jsonType": "UFA" });

//loadedData.push({ "id": "11", "EngName": "Ships", "RusName": "Корабли", "url": "data/number_ships.json", "jsonType": "UFA" });
//loadedData.push({ "id": "13", "EngName": "Large ships", "RusName": "Линкоры", "url": "data/number_large_ships.json", "jsonType": "UFA" });
//loadedData.push({ "id": "10", "EngName": "Submarines", "RusName": "Подводные лодки", "url": "data/number_submarines.json", "jsonType": "UFA" });

// loadedData.push({ "id": "12", "EngName": "Aircraft", "RusName": "Самолеты", "url": "data/number_military_aircraft.json", "jsonType": "UFA" });
// loadedData.push({ "id": "14", "EngName": "Fighters", "RusName": "Истребители", "url": "data/number_fighters.json", "jsonType": "UFA" });

// loadedData.push({ "id": "7", "EngName": "Population (Merged data)", "RusName": "Население", "url": "data/DTO/Population (Merged data).json", "jsonType": "UFA" });

// loadedData.push({ "id": "15", "EngName": "Military", "RusName": "Войска", "url": "data/military_strength.json", "jsonType": "UFA" });
// loadedData.push({ "id": "16", "EngName": "Ground forses", "RusName": "Сухопутные войска", "url": "data/ground_forses.json", "jsonType": "UFA" });
// loadedData.push({ "id": "24", "EngName": "Total losses world war", "RusName": "Общие потери войн", "url": "data/total_losses_world_war.json", "jsonType": "UFA" });
// loadedData.push({ "id": "25", "EngName": "Losses soldiers war", "RusName": "Боевые потери войн", "url": "data/losses_soldiers_war.json", "jsonType": "UFA" });

// loadedData.push({ "id": "3", "EngName": "GDP (Merged data)", "RusName": "ВВП", "url": "data/DTO/GDP (Merged data).json", "jsonType": "UFA" });
// loadedData.push({ "id": "6", "EngName": "PerCapita GDP", "RusName": "ВВП на душу населения", "url": "data/DTO/PerCapita GDP.json", "jsonType": "UFA" });
// loadedData.push({ "id": "26", "EngName": "Oil", "RusName": "Добыча нефти", "url": "data/oil.json", "jsonType": "UFA" });
// loadedData.push({ "id": "4", "EngName": "Industry (including construction), value added (current US$)", "RusName": "Промышленность", "url": "data/DTO/Industry (including construction), value added (current US$).json", "jsonType": "UFA" });
// loadedData.push({ "id": "5", "EngName": "Manufacturing, value added (current US$)", "RusName": "Производство", "url": "data/DTO/Manufacturing, value added (current US$).json", "jsonType": "UFA" });
// loadedData.push({ "id": "1", "EngName": "Agriculture, forestry, and fishing, value added (current US$)", "RusName": "Сельскоехозяйство", "url": "data/DTO/Agriculture, forestry, and fishing, value added (current US$).json", "jsonType": "UFA" });
// loadedData.push({ "id": "2", "EngName": "Cereal production (metric tons)", "RusName": "Производство зерна", "url": "data/DTO/Cereal production (metric tons).json", "jsonType": "UFA" });
// loadedData.push({ "id": "8", "EngName": "Services, value added (current US$)", "RusName": "Сфера услуг", "url": "data/DTO/Services, value added (current US$).json", "jsonType": "UFA" });

//loadedData.push({ "id": "19", "EngName": "Losses soldiers war 1", "RusName": "Военные потери 1 мировая", "url": "data/losses_soldiers_war_1.json", "jsonType": "UFA" });
//loadedData.push({ "id": "20", "EngName": "Losses soldiers war 2", "RusName": "Военные потери 2 мировая", "url": "data/losses_soldiers_war_2.json", "jsonType": "UFA" });

//loadedData.push({ "id": "22", "EngName": "Total losses world war 1", "RusName": "Общие потери 1 мировая", "url": "data/total_losses_world_war_1.json", "jsonType": "UFA" });
//loadedData.push({ "id": "23", "EngName": "Total losses world war 2", "RusName": "Общие потери 2 мировая", "url": "data/total_losses_world_war_2.json", "jsonType": "UFA" });


loadedData.push({ "id": "1", "EngName": "Artillery", "RusName": "Артиллерия", "url": "data/artillery.json", "jsonType": "UFA" });
loadedData.push({ "id": "2", "EngName": "Total losses in World War 1", "RusName": "Общие потери в 1 мировой войне", "url": "data/total_losses_in_world_war_1.json", "jsonType": "UFA" });
loadedData.push({ "id": "3", "EngName": "Total losses in World War 2", "RusName": "Общие потери во 2 мировой войне", "url": "data/total_losses_in_world_war_2.json", "jsonType": "UFA" });
loadedData.push({ "id": "4", "EngName": "Leguminous plowing area", "RusName": "Площадь вспашки зернобобовые", "url": "data/leguminous_plowing_area.json", "jsonType": "UFA" });
loadedData.push({ "id": "5", "EngName": "Crop plowing area", "RusName": "Площадь вспашки зерновых", "url": "data/crop_plowing_area.json", "jsonType": "UFA" });
loadedData.push({ "id": "6", "EngName": "Plowing area of corn", "RusName": "Площадь вспашки кукуруза", "url": "data/plowing_area_of_corn.json", "jsonType": "UFA" });
loadedData.push({ "id": "7", "EngName": "Area of plowing oats", "RusName": "Площадь вспашки овёс", "url": "data/area_of_plowing_oats.json", "jsonType": "UFA" });
loadedData.push({ "id": "8", "EngName": "The area of plowing millet and sorghum", "RusName": "Площадь вспашки просо и сорго", "url": "data/the_area_of_plowing_millet_and_sorghum.json", "jsonType": "UFA" });
loadedData.push({ "id": "9", "EngName": "Wheat plowing area", "RusName": "Площадь вспашки пшеница", "url": "data/wheat_plowing_area.json", "jsonType": "UFA" });
loadedData.push({ "id": "10", "EngName": "Plowing area rice", "RusName": "Площадь вспашки рис", "url": "data/plowing_area_rice.json", "jsonType": "UFA" });
loadedData.push({ "id": "11", "EngName": "Rye plowing area", "RusName": "Площадь вспашки рожь", "url": "data/rye_plowing_area.json", "jsonType": "UFA" });
loadedData.push({ "id": "12", "EngName": "Area of plowing barley", "RusName": "Площадь вспашки ячмень", "url": "data/area_of_plowing_barley.json", "jsonType": "UFA" });
loadedData.push({ "id": "13", "EngName": "Cattle stock", "RusName": "Поголовье КРС", "url": "data/cattle_stock.json", "jsonType": "UFA" });
loadedData.push({ "id": "14", "EngName": "Livestock of chickens", "RusName": "Поголовье кур", "url": "data/livestock_of_chickens.json", "jsonType": "UFA" });
loadedData.push({ "id": "15", "EngName": "Stock of sheep", "RusName": "Поголовье овец", "url": "data/stock_of_sheep.json", "jsonType": "UFA" });
loadedData.push({ "id": "16", "EngName": "Pig population", "RusName": "Поголовье свиней", "url": "data/pig_population.json", "jsonType": "UFA" });
loadedData.push({ "id": "17", "EngName": "Horse flock", "RusName": "Поголовье лошадей", "url": "data/horse_flock.json", "jsonType": "UFA" });
loadedData.push({ "id": "18", "EngName": "Loss of dead soldiers in 1 world", "RusName": "Потери погибшими солдатами в 1 мировой", "url": "data/loss_of_dead_soldiers_in_1_world.json", "jsonType": "UFA" });
loadedData.push({ "id": "19", "EngName": "The loss of dead soldiers in World 2", "RusName": "Потери погибшими солдатами во 2 мировой", "url": "data/the_loss_of_dead_soldiers_in_world_2.json", "jsonType": "UFA" });
loadedData.push({ "id": "20", "EngName": "Wheat production", "RusName": "Производство пшеницы", "url": "data/wheat_production.json", "jsonType": "UFA" });
loadedData.push({ "id": "21", "EngName": "Buckwheat production", "RusName": "Производство гречихи", "url": "data/buckwheat_production.json", "jsonType": "UFA" });
loadedData.push({ "id": "22", "EngName": "Grain production", "RusName": "Производство зерна", "url": "data/grain_production.json", "jsonType": "UFA" });
loadedData.push({ "id": "23", "EngName": "Pulses", "RusName": "Производство зернобобовые", "url": "data/pulses.json", "jsonType": "UFA" });
loadedData.push({ "id": "24", "EngName": "Potato production", "RusName": "Производство картофеля", "url": "data/potato_production.json", "jsonType": "UFA" });
loadedData.push({ "id": "25", "EngName": "Maize production", "RusName": "Производство кукурузы", "url": "data/maize_production.json", "jsonType": "UFA" });
loadedData.push({ "id": "26", "EngName": "Vegetable production", "RusName": "Производство овощей", "url": "data/vegetable_production.json", "jsonType": "UFA" });
loadedData.push({ "id": "27", "EngName": "Oats production", "RusName": "Производство овса", "url": "data/oats_production.json", "jsonType": "UFA" });
loadedData.push({ "id": "28", "EngName": "Millet production", "RusName": "Производство проса", "url": "data/millet_production.json", "jsonType": "UFA" });
loadedData.push({ "id": "29", "EngName": "Millet and Sorghum Production", "RusName": "Производство просо и сорго", "url": "data/millet_and_sorghum_production.json", "jsonType": "UFA" });
loadedData.push({ "id": "30", "EngName": "Rye production", "RusName": "Производство ржи", "url": "data/rye_production.json", "jsonType": "UFA" });
loadedData.push({ "id": "31", "EngName": "Rice production", "RusName": "Производство риса", "url": "data/rice_production.json", "jsonType": "UFA" });
loadedData.push({ "id": "32", "EngName": "Sugar beet production", "RusName": "Производство сахарной свеклы", "url": "data/sugar_beet_production.json", "jsonType": "UFA" });
loadedData.push({ "id": "33", "EngName": "Tomato production", "RusName": "Производство томатов", "url": "data/tomato_production.json", "jsonType": "UFA" });
loadedData.push({ "id": "34", "EngName": "Cotton Production (Fiber)", "RusName": "Производство хлопка (волокно)", "url": "data/cotton_production_(fiber).json", "jsonType": "UFA" });
loadedData.push({ "id": "35", "EngName": "Barley production", "RusName": "Производство ячменя", "url": "data/barley_production.json", "jsonType": "UFA" });
loadedData.push({ "id": "36", "EngName": "Heavy artillery", "RusName": "Тяжелая артиллерия", "url": "data/heavy_artillery.json", "jsonType": "UFA" });
loadedData.push({ "id": "37", "EngName": "Cereal yield", "RusName": "Урожайность зерновых", "url": "data/cereal_yield.json", "jsonType": "UFA" });
loadedData.push({ "id": "38", "EngName": "Potato yield", "RusName": "Урожайность картофеля", "url": "data/potato_yield.json", "jsonType": "UFA" });
loadedData.push({ "id": "39", "EngName": "Wheat yield", "RusName": "Урожайность пшеница", "url": "data/wheat_yield.json", "jsonType": "UFA" });
loadedData.push({ "id": "40", "EngName": "The number of military aircraft", "RusName": "Численность военных самолетов", "url": "data/the_number_of_military_aircraft.json", "jsonType": "UFA" });
loadedData.push({ "id": "41", "EngName": "Military strength", "RusName": "Численность ВС", "url": "data/military_strength.json", "jsonType": "UFA" });
loadedData.push({ "id": "42", "EngName": "The number of fighters", "RusName": "Численность истребителей", "url": "data/the_number_of_fighters.json", "jsonType": "UFA" });
loadedData.push({ "id": "43", "EngName": "The number of ships", "RusName": "Численность кораблей", "url": "data/the_number_of_ships.json", "jsonType": "UFA" });
loadedData.push({ "id": "44", "EngName": "The number of large ships", "RusName": "Численность крупных кораблей", "url": "data/the_number_of_large_ships.json", "jsonType": "UFA" });
loadedData.push({ "id": "45", "EngName": "Livestock of sheep and goats", "RusName": "Поголовье овец и коз", "url": "data/livestock_of_sheep_and_goats.json", "jsonType": "UFA" });
loadedData.push({ "id": "46", "EngName": "The number of submarines", "RusName": "Численность подводных лодок", "url": "data/the_number_of_submarines.json", "jsonType": "UFA" });
loadedData.push({ "id": "47", "EngName": "Ground Forces", "RusName": "Численность сухопутных войск", "url": "data/ground_forces.json", "jsonType": "UFA" });
loadedData.push({ "id": "48", "EngName": "The number of tanks", "RusName": "Численность танков", "url": "data/the_number_of_tanks.json", "jsonType": "UFA" });
loadedData.push({ "id": "49", "EngName": "Rye yield", "RusName": "Урожайность рожь", "url": "data/rye_yield.json", "jsonType": "UFA" });
loadedData.push({ "id": "50", "EngName": "Tomatoes yield", "RusName": "Урожайность томатов", "url": "data/tomatoes_yield.json", "jsonType": "UFA" });
loadedData.push({ "id": "51", "EngName": "Yield rice", "RusName": "Урожайность рис", "url": "data/yield_rice.json", "jsonType": "UFA" });
loadedData.push({ "id": "52", "EngName": "Oil production", "RusName": "Добыча нефти", "url": "data/oil_production.json", "jsonType": "UFA" });
loadedData.push({ "id": "53", "EngName": "Coal production", "RusName": "Добыча угля", "url": "data/coal_production.json", "jsonType": "UFA" });
loadedData.push({ "id": "54", "EngName": "Gas production", "RusName": "Добыча природного газа", "url": "data/gas_production.json", "jsonType": "UFA" });
loadedData.push({ "id": "55", "EngName": "Power generation", "RusName": "Производство электроэнергии", "url": "data/power_generation.json", "jsonType": "UFA" });
loadedData.push({ "id": "56", "EngName": "Iron production", "RusName": "Производство чугуна", "url": "data/iron_production.json", "jsonType": "UFA" });
loadedData.push({ "id": "57", "EngName": "Steel production", "RusName": "Производство стали", "url": "data/steel_production.json", "jsonType": "UFA" });
loadedData.push({ "id": "58", "EngName": "Cement production", "RusName": "Производство цемента", "url": "data/cement_production.json", "jsonType": "UFA" });
loadedData.push({ "id": "59", "EngName": "Aluminum production", "RusName": "Производство аллюминия", "url": "data/aluminum_production.json", "jsonType": "UFA" });
loadedData.push({ "id": "60", "EngName": "Mineral fertilizers", "RusName": "Минеральные удобрения", "url": "data/mineral_fertilizers.json", "jsonType": "UFA" });
loadedData.push({ "id": "61", "EngName": "Gold mining", "RusName": "Добыча золота", "url": "data/gold_mining.json", "jsonType": "UFA" });
loadedData.push({ "id": "62", "EngName": "Grain production", "RusName": "Производство зерна", "url": "data/grain_production.json", "jsonType": "UFA" });
loadedData.push({ "id": "63", "EngName": "Population (Merged data)", "RusName": "Население", "url": "data/DTO/Population (Merged data).json", "jsonType": "UFA" });
loadedData.push({ "id": "64", "EngName": "GDP (Merged data)", "RusName": "ВВП", "url": "data/DTO/GDP (Merged data).json", "jsonType": "UFA" });
loadedData.push({ "id": "65", "EngName": "PerCapita GDP", "RusName": "ВВП на душу", "url": "data/DTO/PerCapita GDP.json", "jsonType": "UFA" });
loadedData.push({ "id": "66", "EngName": "Oil", "RusName": "Нефть", "url": "data/oil.json", "jsonType": "UFA" });
loadedData.push({ "id": "67", "EngName": "Industry (including construction), value added (current US$)", "RusName": "Промышленность", "url": "data/DTO/Industry (including construction), value added (current US$).json", "jsonType": "UFA" });
loadedData.push({ "id": "68", "EngName": "Manufacturing, value added (current US$)", "RusName": "Производство", "url": "data/DTO/Manufacturing, value added (current US$).json", "jsonType": "UFA" });
loadedData.push({ "id": "69", "EngName": "Agriculture, forestry, and fishing, value added (current US$)", "RusName": "Сельскоехозяйство", "url": "data/DTO/Agriculture, forestry, and fishing, value added (current US$).json", "jsonType": "UFA" });
loadedData.push({ "id": "70", "EngName": "Cereal production (metric tons)", "RusName": "Производство зерна", "url": "data/DTO/Cereal production (metric tons).json", "jsonType": "UFA" });
loadedData.push({ "id": "71", "EngName": "Services, value added (current US$)", "RusName": "Сфера услуг", "url": "data/DTO/Services, value added (current US$).json", "jsonType": "UFA" });







//loadedData.push({ "id": "9", "EngName": "GDP", "RusName": "ВВП", "url": "data/data_new.json", "jsonType": "SAMARA" });



// function downloadObjectAsJson(exportObj, exportName) {
// 	var dataStr = "data:text/json;charset:utf-8," + encodeURIComponent(JSON.stringify(exportObj));
// 	var downloadAnchorNode = document.createElement('a');
// 	downloadAnchorNode.setAttribute("href", dataStr);
// 	downloadAnchorNode.setAttribute("download", exportName + ".json");
// 	document.body.appendChild(downloadAnchorNode); // required for firefox
// 	downloadAnchorNode.click();
// 	downloadAnchorNode.remove();
// }


function dowloadImg(aUrl){
	//Creating new link node.
	var link = document.createElement('a');
	link.href = aUrl;
	link.setAttribute('target','_blank');

	if (link.download !== undefined) {
		//Set HTML5 download attribute. This will prevent file from opening if supported.
		var fileName = aUrl.substring(aUrl.lastIndexOf('/') + 1, aUrl.length);
		link.download = fileName;
	}

	//Dispatching click event.
	if (document.createEvent) {
		var e = document.createEvent('MouseEvents');
		e.initEvent('click', true, true);
		link.dispatchEvent(e);
		return true;
	}

	if (aUrl.indexOf('?') === -1) {
        aUrl += '?download';
    }

    window.open(aUrl, '_blank');
    return true;
}

// d3.json("data/persons.json", function (error, dataFromFile) {
// 	if (error) console.log(error);
// 	dataFromFile.forEach(element => {
// 		//dowloadImg(element.PhotoUrl);
// 		console.log(element.Surname);
// 		element.PhotoUrl = 'img/person/'+element.PhotoUrl.substring(element.PhotoUrl.lastIndexOf('/') + 1);
// 	});

// 	download(JSON.stringify(dataFromFile), 'persons.json', 'text/json');

// });



 function download(content, fileName, contentType) {
 	var a = document.createElement("a");
 	var file = new Blob([content], { type: contentType });
 	a.href = URL.createObjectURL(file);
 	a.download = fileName;
 	a.click();
 }

 //fill centroid
//  loadedData.forEach(element => {
// 	 if(element.id==26){
//  		d3.json(element.url, function (error, dataFromFile) {
//  			 if (error) console.log(error);
// 			 console.log(element.url);
// 			 var edda = [];
// 			 d3.json("data/word-country-data.json", function (error, wcd) {
// 				if (error) console.log(error);
// 				console.log("data/word-country-data.json");
// 				dataFromFile.forEach(function (el,i,a) {
// 					console.log(el.iso3);
// 					var centr = wcd.filter(function (e) {
// 						if(el.iso3=="SSD")
// 							return e.iso3=="SDN";
// 						else if(el.iso3=="SUN")
// 							return e.iso3=="RUS";
// 						else
// 							return e.iso3==el.iso3;	
						
// 					});
// 					console.log(centr);
// 					centr=centr[0].centroid;
// 					console.log(centr);
// 					console.log(a[i]);
// 					a[i].centroid=centr;
// 					a[i].value=parseFloat(a[i].value);
// 					console.log(a[i]);
// 					edda.push(a[i]);
// 				});
// 				download(JSON.stringify(edda), element.url.substring(element.url.lastIndexOf('/') + 1, element.url.lastIndexOf('.')) + '_centr.json', 'text/json');
// 			 });
// 		 });
// 		}
// 	 });

 //проверка на пустоту
//  loadedData.forEach(element => {
//  		d3.json(element.url, function (error, dataFromFile) {
// 			 if (error) console.log(error);
// 			 console.log(element.url);
// 			 var changedData = dataFromFile.filter(function (el) {
// 				return (typeof (el.rusIndicator) == "undefined"||el.rusIndicator==null||el.rusIndicator.trim()==="");
// 			 });
// 			 console.log(JSON.stringify(changedData));
// 			if(changedData.length>0){
// 				console.log("download");
// 			 	download(JSON.stringify(changedData), element.url.substring(element.url.lastIndexOf('/') + 1, element.url.lastIndexOf('.')) + '_empty_rusIndicator.json', 'text/json');
// 			}
// 		 });
// 	 });

// function UrlExists(url) {
//     var http = new XMLHttpRequest();
//     http.open('HEAD', url, false);
//     http.send();
//     if (http.status != 404)
//        {}
//     else{
// 		console.log(url);
// 	}
// 	http.abort();	
// }
// var now = new Date().getTime();
// while(new Date().getTime() < now + 5000){ /* do nothing */ } 
//  //проверка наличия картинок
//   loadedData.forEach(element => {
// 		console.log(element.EngName);
// 	  //if(element.id = 16 ){
// 		d3.json(element.url, function (error, dataFromFile) {
// 			if (error) console.log(error);
// 			dataFromFile.forEach(el => {
// 				// $.ajax({
// 				// 	url: "img/flags/"+el.iso2+".png",
// 				// 	type: "GET",
// 				// 	complete: function(xhr, textStatus) {
// 				// 		if(xhr.status=="404"){
// 				// 			console.log(xhr.status);
// 				// 			console.log("img/flags/"+el.iso2+".png");
// 				// 		}
// 				// 	} 
// 				// });
// 				UrlExists("img/flags/"+el.iso2+".png");
// 			});
// 		});
// 	  //s}
// 	});

 //проставляем ссылки
//   loadedData.forEach(element => {
// 	  if(element.id < 9 ){
// 		d3.json(element.url, function (error, dataFromFile) {
// 			if (error) console.log(error);
// 			dataFromFile.forEach(el => {
// 				if(el.rusSource=="http://www.worldbank.org/"){
// 					if(element.id=1){
// 						el.rusSource="http://data.worldbank.org/indicator/NV.AGR.TOTL.CD";
// 					}
// 					if(element.id=2){
// 						el.rusSource="http://data.worldbank.org/indicator/ag.prd.crel.mt";
// 					}
// 					if(element.id=3){
// 						el.rusSource="http://data.worldbank.org/indicator/ny.gdp.mktp.cd";
// 					}
// 					if(element.id=4){
// 						el.rusSource="http://data.worldbank.org/indicator/NV.IND.TOTL.CD";
// 					}
// 					if(element.id=5){
// 						el.rusSource="http://data.worldbank.org/indicator/nv.ind.manf.cd";
// 					}
// 					if(element.id=6){
// 						el.rusSource="http://data.worldbank.org/indicator/ny.gdp.pcap.cd";
// 					}
// 					if(element.id=7){
// 						el.rusSource="http://data.worldbank.org/indicator/SP.POP.TOTL";
// 					}					
// 					if(element.id=8){
// 						el.rusSource="http://data.worldbank.org/indicator/NV.SRV.TOTL.ZS";
// 					}										
// 				}
// 			});
// 			download(JSON.stringify(dataFromFile), element.url.substring(element.url.lastIndexOf('/') + 1, element.url.lastIndexOf('.')) + '_full_url.json', 'text/json');
// 		});
		
// 	  }
// 	});

//ввп дели на 1000000

// loadedData.forEach(element => {
// 	console.log(element.id);
//   	if ((element.id == '4'||element.id == '5'||element.id == '1'||element.id == '8') {
// 		console.log(element.id);
//   		d3.json(element.url, function (error, dataFromFile) {
// 			if (error) console.log(error);
// 				var target = dataFromFile;
// 				target.forEach(
// 					element => {
// 						if(element.rusSource=="http://data.worldbank.org/indicator/NV.SRV.TOTL.ZS"){
// 						 	element.value = Math.ceil(element.value/1000000);
// 						}
// 						element.rusUnit="млн $";
// 						element.engUnit="mil $";
// 					}
// 				);
// 				console.log(target);
// 				download(JSON.stringify(target), element.url, 'text/json');
// 		});
// 	}
// });

//население дели на 1000

// loadedData.forEach(element => {
// 	console.log(element.id);
//   	if ((element.id == '7')) {
// 		console.log(element.id);
//   		d3.json(element.url, function (error, dataFromFile) {
// 			if (error) console.log(error);
// 				var target = dataFromFile;
// 				target.forEach(
// 					element => {
// 						// if(element.rusSource=="http://data.worldbank.org/indicator/NV.SRV.TOTL.ZS"){
// 						// 	element.value = Math.ceil(element.value/1000);
// 						// }
// 						element.rusUnit="тыс.чел";
// 						element.engUnit="thousand people";
// 					}
// 				);
// 				console.log(target);
// 				download(JSON.stringify(target), 'Population (Merged data)_1000.json', 'text/json');
// 		});
// 	}
// });

//объединение по войне
// var target = [];
// var  obj1, obj2;



// loadedData.forEach(element => {
// 	console.log(element.id);
//   	if ((element.id == '19')||(element.id == '20')) {
// 		console.log(element.id);
//   		d3.json(element.url, function (error, dataFromFile) {
// 			if (error) console.log(error);
// 			if (element.id == '19'){
// 				obj1=JSON.parse(JSON.stringify(dataFromFile)); 
// 				console.log(obj1);
// 			}   
// 			if (element.id == '20'){
// 				obj2=JSON.parse(JSON.stringify(dataFromFile)); 
// 				console.log(obj2);
// 			} 
// 			if(typeof(obj2)!=undefined)  {
// 				target = obj1.concat(obj2);
// 				target.sort(function (a, b) {
// 					return a.date.localeCompare(b.date);
// 				});
// 				console.log(target);
// 				download(JSON.stringify(target), 'losses_soldiers_war.json', 'text/json');
// 			}
// 		});
// 	}
// });



//  loadedData.forEach(element => {
//  	if (element.id < 9) {
//  		// d3.json(element.url, function (error, dataFromFile) {
//  		// 	if (error) console.log(error);
//  		// 	var changedData = dataFromFile.filter(function (el) {
//  		// 		return parseInt(el.date) >= 1900;
//  		// 	  });
//  		// 	download(JSON.stringify(changedData), element.url.substring(element.url.lastIndexOf('/') + 1, element.url.lastIndexOf('.')) + '_small_1900.json', 'text/json');
//  		// });
 	
// 	console.log(element.url.substring(0,element.url.lastIndexOf('/')+1)+element.url.substring(element.url.lastIndexOf('/') + 1, element.url.lastIndexOf('.')) + '_big.json');	
// 	 d3.json(element.url.substring(0,element.url.lastIndexOf('/')+1)+element.url.substring(element.url.lastIndexOf('/') + 1, element.url.lastIndexOf('.')) + '_big.json', function (error, dataFromFile) {
// 		if (error) console.log(error);
// 		var changedData = dataFromFile.filter(function (el) {
// 			return parseInt(el.date) >= 1900;
// 		});

// 		changedData.forEach(el => {
// 	 		//delete el.engCountry;  // or delete person["age"];
// 	 		delete el.rusCity;  // or delete person["age"];
// 	 		delete el.engCity;  // or delete person["age"];
// 	 		delete el.code;  // or delete person["age"];
// 	 		delete el.rusIndicator;  // or delete person["age"];
// 	 		delete el.engIndicator;  // or delete person["age"];
// 			 //delete el.engUnit;  // or delete person["age"];
// 			//  loadedData.push({ "id": "1", "EngName": "Agriculture, forestry, and fishing, value added (current US$)", "RusName": "Агропромышленность", "url": "data/DTO/Agriculture, forestry, and fishing, value added (current US$).json", "jsonType": "UFA" });
// 			//  loadedData.push({ "id": "2", "EngName": "Cereal production (metric tons)", "RusName": "Зерно", "url": "data/DTO/Cereal production (metric tons).json", "jsonType": "UFA" });
// 			//  loadedData.push({ "id": "3", "EngName": "GDP (Merged data)", "RusName": "ВВП объединенные", "url": "data/DTO/GDP (Merged data).json", "jsonType": "UFA" });
// 			//  loadedData.push({ "id": "4", "EngName": "Industry (including construction), value added (current US$)", "RusName": "Промышленность", "url": "data/DTO/Industry (including construction), value added (current US$).json", "jsonType": "UFA" });
// 			//  loadedData.push({ "id": "5", "EngName": "Manufacturing, value added (current US$)", "RusName": "Производство", "url": "data/DTO/Manufacturing, value added (current US$).json", "jsonType": "UFA" });
// 			//  loadedData.push({ "id": "6", "EngName": "PerCapita GDP", "RusName": "ВВП на душу", "url": "data/DTO/PerCapita GDP.json", "jsonType": "UFA" });
// 			//  loadedData.push({ "id": "7", "EngName": "Population (Merged data)", "RusName": "Население", "url": "data/DTO/Population (Merged data).json", "jsonType": "UFA" });
// 			//  loadedData.push({ "id": "8", "EngName": "Services, value added (current US$)", "RusName": "Услуги", "url": "data/DTO/Services, value added (current US$).json", "jsonType": "UFA" });
// 			if(element.id=="1"||element.id=="3"||element.id=="4"||element.id=="5"||element.id=="8"){
// 				el.engUnit='$';
// 				el.rusUnit='$';
// 			}
// 			if(element.id=="2"){
// 				el.engUnit='tons';
// 				el.rusUnit='тонн';
// 			}
// 			if(element.id=="6"){
// 				el.engUnit='$';
// 				el.rusUnit='$';
// 			}
// 			if(element.id=="7"){
// 				el.engUnit='person';
// 				el.rusUnit='человек';
// 			}			
// 	 		delete el.rusSource;  // or delete person["age"];
// 			delete el.engSource;  // or delete person["age"];
// 			el.rusSource = el.sourceURL;
// 	 		delete el.sourceURL;  // or delete person["age"];
// 	 		delete el.rusComment;  // or delete person["age"];
// 	 		delete el.engComment;  // or delete person["age"];
// 	 	});
// 		download(JSON.stringify(changedData), element.url.substring(element.url.lastIndexOf('/') + 1, element.url.lastIndexOf('.')) +'.json', 'text/json');//+ '_small_1900.json'
// 	});
// }
// });

// console.time implementation for IE
if (window.console && typeof (window.console.time) == "undefined") {
	console.time = function (name, reset) {
		if (!name) { return; }
		var time = new Date().getTime();
		if (!console.timeCounters) { console.timeCounters = {}; }
		var key = "KEY" + name.toString();
		if (!reset && console.timeCounters[key]) { return; }
		console.timeCounters[key] = time;
	};

	console.timeEnd = function (name) {
		var time = new Date().getTime();
		if (!console.timeCounters) { return; }
		var key = "KEY" + name.toString();
		var timeCounter = console.timeCounters[key];
		var diff;
		if (timeCounter) {
			diff = time - timeCounter;
			var label = name + ": " + diff + "ms";
			console.info(label);
			delete console.timeCounters[key];
		}
		return diff;
	};
}

var svg;
var projection;
var width;
var height;

var onClickDropDown = function (d) {
	let div;
	if (document.getElementById("tooltip") !== null) {
		div = d3.select("div#tooltip");
		div.transition()
		.style("opacity", 0);
	}
	if (document.getElementById("mapContainerInfoSvg") !== null) {
		d3.select("#mapContainerInfoSvg").remove();
	}
	
	CookieHelper.setCookie('idInfoCategory', parseInt(d.id));
	buildBubble(d, svg, projection, width);
};

function loadJSON(url, callback) {

	var xobj = new XMLHttpRequest();
	xobj.overrideMimeType("application/json");
	xobj.open('GET', url, true); // Replace 'my_data' with the path to your file
	xobj.onreadystatechange = function () {
		if (xobj.readyState == 4 && xobj.status == "200") {
			// Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
			callback(xobj.responseText);
		}
	};
	xobj.send(null);
}


$(document).ready(function () {
	addComboBoxFromJson.addBootstrapDropDown(loadedData, "dropDownList", "id", "RusName", onClickDropDown);
});


function buildBubble(ldata, svg, projection, width) {
	document.getElementById("nameContainer").innerHTML = "";
	document.getElementById("nameContainer").innerHTML = "<h4>" + ldata.RusName + "</h4>";
	if (typeof (ldata.listYear) === "undefined") {

		// console.time("fast load oboe data " + ldata.RusName);

		// oboe({
		// 	'url': ldata.url,
		// 	'method': 'GET',   //optional
		// 	//'body': data    //no need to encode, the library will JSON stringify it automatically
		// }).on('done', function (things) {
		// 	var oboe_actual_JSON = things;
		// 	console.timeEnd("fast load oboe data " + ldata.RusName);
		// });


		// console.time("fast load jqery data " + ldata.RusName);
		// $.getJSON(ldata.url, function (data) {
		// 	var jqery_actual_JSON = data;
		// 	console.timeEnd("fast load jqery data " + ldata.RusName);
		// });

		// console.time("fast load data " + ldata.RusName);
		// loadJSON(ldata.url, function (response) {
		// 	// Parse JSON string into object
		// 	var actual_JSON = JSON.parse(response);
		// 	console.timeEnd("fast load data " + ldata.RusName);
		// });


		console.time("load data " + ldata.RusName);
		d3.json(ldata.url, function (error, dataFromFile) {
			console.timeEnd("load data " + ldata.RusName);
			console.time("build list year");
			if (error) console.log(error);
			ldata.dataFromFile = dataFromFile;
			var listYear;
			if (ldata.jsonType == "UFA") {
				listYear = addSlider.getListYearNew(ldata.dataFromFile);
			} else if (ldata.jsonType == "SAMARA") {
				//console.log("ldata.dataFromFile=" + JSON.stringify(ldata.dataFromFile));
				listYear = addSlider.getListYear(ldata.dataFromFile);
			}
			ldata.listYear = listYear;
			console.timeEnd("build list year");
			console.time("filte by year");
			var curDataYearFilter;
			if (ldata.jsonType == "UFA") {
				curDataYearFilter = addSlider.filterByYearNew(ldata.dataFromFile, ldata.listYear[0]);
			} else if (ldata.jsonType == "SAMARA") {
				curDataYearFilter = addSlider.filterByYear(ldata.dataFromFile, ldata.listYear[0]);
			}
			console.timeEnd("filte by year");
			console.time("max val");
			var mxval = 0;
			// if (ldata.jsonType == "UFA") {
			// 	mxval = flagCircleInMap.getMaxValueNew(ldata.dataFromFile);
			// } else if (ldata.jsonType == "SAMARA") {
			// 	mxval = flagCircleInMap.getMaxValue(ldata.dataFromFile);
			// }
			console.timeEnd("max val");
			console.time("addFlagCircleInMap");
			//console.log("ldata.dataFromFile=" + JSON.stringify(ldata.dataFromFile));
			var flagCircleInMapLoc = new flagCircleInMap(curDataYearFilter, svg, projection, "img_", mxval, width,ldata.dataFromFile);
			if (ldata.jsonType == "UFA") {
				flagCircleInMapLoc.addFlagCircleInMapNew();
			} else if (ldata.jsonType == "SAMARA") {
				flagCircleInMapLOc.addFlagCircleInMap();
			}
			console.timeEnd("addFlagCircleInMap");
			var updateFunction;
			if (ldata.jsonType == "UFA") {
				updateFunction = function (h, handle, label, xScale) {
					// update position and text of label according to slider scale
					var h2 = Number((h).toFixed(0));
					handle.attr("cx", xScale(h));

					label.attr("x", xScale(h)).text(listYear[h2]);

					var curDataYearFilter = addSlider.filterByYearNew(ldata.dataFromFile, listYear[h2]);
					var mxval = 0;
					// if (ldata.jsonType == "UFA") {
					// 	mxval = flagCircleInMap.getMaxValueNew(ldata.dataFromFile);
					// } else if (ldata.jsonType == "SAMARA") {
					// 	mxval = flagCircleInMap.getMaxValue(ldata.dataFromFile);
					// }
					//console.log("ldata.dataFromFile=" + JSON.stringify(ldata.dataFromFile));
					var flagCircleInMapLoc = new flagCircleInMap(curDataYearFilter, svg, projection, "img_", mxval, width,ldata.dataFromFile);
					flagCircleInMapLoc.addFlagCircleInMapNew();
				}
			} else if (ldata.jsonType == "SAMARA") {
				updateFunction = function (h, handle, label, xScale) {
					// update position and text of label according to slider scale
					var h2 = Number((h).toFixed(0));
					handle.attr("cx", xScale(h));

					label.attr("x", xScale(h)).text(listYear[h2]);
					var mxval = 0;
					// if (ldata.jsonType == "UFA") {
					// 	mxval = flagCircleInMap.getMaxValueNew(ldata.dataFromFile);
					// } else if (ldata.jsonType == "SAMARA") {
					// 	mxval = flagCircleInMap.getMaxValue(ldata.dataFromFile);
					// }
					var curDataYearFilter = addSlider.filterByYear(ldata.dataFromFile, listYear[h2]);
					//console.log("ldata.dataFromFile=" + JSON.stringify(ldata.dataFromFile));
					var flagCircleInMapLoc = new flagCircleInMap(curDataYearFilter, svg, projection, "img_", mxval, width,ldata.dataFromFile);
					flagCircleInMapLoc.addFlagCircleInMap();
				}
			}
			console.time("addSlider");
			addSlider.addSlider("vis", width, listYear, updateFunction);
			console.timeEnd("addSlider");
		});
	} else {
		console.time("filte by year");
		var curDataYearFilter;
		if (ldata.jsonType == "UFA") {
			curDataYearFilter = addSlider.filterByYearNew(ldata.dataFromFile, ldata.listYear[0]);
		} else if (ldata.jsonType == "SAMARA") {
			curDataYearFilter = addSlider.filterByYear(ldata.dataFromFile, ldata.listYear[0]);
		}
		console.timeEnd("filte by year");
		console.time("addFlagCircleInMap");
		//console.log("ldata.dataFromFile=" + JSON.stringify(ldata.dataFromFile));
		var flagCircleInMapLoc = new flagCircleInMap(curDataYearFilter, svg, projection, "img_", 0, width,ldata.dataFromFile);
		if (ldata.jsonType == "UFA") {
			flagCircleInMapLoc.addFlagCircleInMapNew();
		} else if (ldata.jsonType == "SAMARA") {
			flagCircleInMapLoc.addFlagCircleInMap();
		}
		console.timeEnd("addFlagCircleInMap");
		var updateFunction;
		if (ldata.jsonType == "UFA") {
			updateFunction = function (h, handle, label, xScale) {
				// update position and text of label according to slider scale
				var h2 = Number((h).toFixed(0));
				handle.attr("cx", xScale(h));

				label.attr("x", xScale(h)).text(ldata.listYear[h2]);

				var curDataYearFilter = addSlider.filterByYearNew(ldata.dataFromFile, ldata.listYear[h2]);
				//console.log("ldata.dataFromFile=" + JSON.stringify(ldata.dataFromFile));
				var flagCircleInMapLoc = new flagCircleInMap(curDataYearFilter, svg, projection, "img_", 0, width,ldata.dataFromFile);
				flagCircleInMapLoc.addFlagCircleInMapNew();
			}
		} else if (ldata.jsonType == "SAMARA") {
			updateFunction = function (h, handle, label, xScale) {
				// update position and text of label according to slider scale
				var h2 = Number((h).toFixed(0));
				handle.attr("cx", xScale(h));

				label.attr("x", xScale(h)).text(ldata.listYear[h2]);

				var curDataYearFilter = addSlider.filterByYear(ldata.dataFromFile, ldata.listYear[h2]);
				//console.log("ldata.dataFromFile=" + JSON.stringify(ldata.dataFromFile));
				var flagCircleInMapLoc = new flagCircleInMap(curDataYearFilter, svg, projection, "img_", 0, width,ldata.dataFromFile);
				flagCircleInMapLoc.addFlagCircleInMap();
			}
		}
		console.time("addSlider");
		addSlider.addSlider("vis", width, ldata.listYear, updateFunction);
		console.timeEnd("addSlider");
	}
}

var url = "data/countries.json";
var url2 = "data/data_new.json";

function startApp() {
	console.time("load countries");
	d3.json(url, function (error, countries) {
		console.timeEnd("load countries");
		if (error) console.log(error);

		console.time("add countries");
		width = parseInt(d3.select("#mapContainer").style("width"));
		height = Math.round(width * 4 / 7.1);//parseInt(d3.select("#mapContainer").style("height"));

		if(height>(document.documentElement.clientHeight-200)){
			height = document.documentElement.clientHeight-200;
			width = Math.round(height * 7.1 / 4 );
		}
		else{
			width = parseInt(d3.select("#mapContainer").style("width"));
			height = Math.round(width * 4 / 7.1);//parseInt(d3.select("#mapContainer").style("height"));
		}

		// console.log("height"+height);
		// console.log("height-264"+(height-264));
		// console.log("document.body.clientHeight"+document.body.clientHeight);
		// console.log("document.documentElement.clientHeight"+document.documentElement.clientHeight);
		// console.log("document.documentElement.scrollHeight"+document.documentElement.scrollHeight);

		var scale0 = (width - 1) / 2 / Math.PI;
		
		projection = d3.geoEquirectangular()
			.scale([scale0]) // scale to fit group width;
			.translate([width / 2, height / 2])// ensure centred in group
			//.translate([0,0])// ensure centred in group
			;


		svg = d3.select("div#mapContainer").append("svg")
			.attr("width", width)
			.attr("height", height)
			// .call(d3.zoom().on("zoom", function () {
			// 	svg.attr("transform", d3.event.transform)
			// }))
			;

		addCountries.addContries(countries.features, svg, projection);
		console.timeEnd("add countries");
		console.time("load places");
		d3.json(url2, function (error, places) {
			console.timeEnd("load places");
			if (error) console.log(error);
			
			//CookieHelper.setCookie('idInfoCategory',21);

			var idInfoCategory = CookieHelper.getCookie('idInfoCategory');
	
			console.log("idInfoCategory="+idInfoCategory);

			if(typeof idInfoCategory == "undefined"){
				idInfoCategory = 41;
				console.log("IsUndefined");
			}
			console.log("idInfoCategory="+idInfoCategory);
			//arr.filter(function(item){
			//	return item.type == "ar";         
			//})

			var ldata = loadedData.filter(function(d){
				return d.id==idInfoCategory;
			});
			ldata = ldata[0]
			console.log(ldata);
			console.time("add buuble");
			buildBubble(ldata, svg, projection, width);
			console.timeEnd("add buuble");

			console.time("add image");
			var addImageInPage = new AddImageInPage(svg, places, "iso2", "img_", "img/flags/", ".png");
			addImageInPage.addImageInPage();
			console.timeEnd("add image");
			// var listYear = addSlider.getListYear(places);

			// var curDataYearFilter = addSlider.filterByYear(places, listYear[0]);
			// var flagCircleInMap = new flCInMap.flagCircleInMap(curDataYearFilter, svg, projection, "img_");
			// flagCircleInMap.addFlagCircleInMap();

			// var updateFunction = function (h, handle, label, xScale) {
			// 	// update position and text of label according to slider scale
			// 	var h2 = Number((h).toFixed(0));
			// 	handle.attr("cx", xScale(h));

			// 	label.attr("x", xScale(h)).text(listYear[h2]);

			// 	var curDataYearFilter = addSlider.filterByYear(places, listYear[h2]);
			// 	var flagCircleInMap = new flCInMap.flagCircleInMap(curDataYearFilter, svg, projection, "img_");
			// 	flagCircleInMap.addFlagCircleInMap();
			// }

			// addSlider.addSlider("vis", width, listYear, updateFunction);


			// var playButton = d3.select("#play-button");
			// playButton.on("click", function () {

			// });
		})

	});

}

//window.addEventListener('load', () => {startApp()})

function addEvent(evnt, elem, func) {
	if (elem.addEventListener)  // W3C DOM
	{
	   elem.addEventListener(evnt, func, false);
	   //console.log('addeventlistener');
	}
	else if (elem.attachEvent) { // IE DOM
	   elem.attachEvent("on"+evnt, func);
	   //console.log('attackEvent');
	}
	else { // No much to do
	   elem["on"+evnt] = func;
	}
}

addEvent('load', window, startApp);