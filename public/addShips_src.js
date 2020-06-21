class addShips{

    static addShip(divId,shipData){
        // var div = document.getElementById(divId);
        // div.innerHTML = "";

        var newNode = document.getElementById(divId+'-Img');      
        newNode.innerHTML = "<img class='image-center img-rounded resized-image' id='imgPerson' src='"+shipData.URL_Local_picture+"' alt=''>";
        newNode.classList.add("row");
        newNode.classList.add("img");
        newNode.classList.add("image-cont");
        //div.appendChild( newNode );

        var newNode = document.getElementById(divId+'-Country');     
        newNode.innerHTML = "Страна - <p id='Country'>"+shipData.Country+"</p>";
        newNode.classList.add("row");
        //div.appendChild( newNode );
        
        var newNode = document.getElementById(divId+'-Ships_in_series');     
        newNode.innerHTML = "Кораблей в серии - <p id='Ships_in_series'>"+shipData.Ships_in_series+"</p>";
        newNode.classList.add("row");
        //div.appendChild( newNode );

        var newNode = document.getElementById(divId+'-Ship_type');     
        newNode.innerHTML = "Тип корабля - <p id='Ship_type'>"+shipData.Ship_type+"</p>";
        newNode.classList.add("row");
        //div.appendChild( newNode );

        var newNode = document.getElementById(divId+'-Name');     
        newNode.innerHTML = "Название - <p id='Name'>"+shipData.Name+"</p>";
        newNode.classList.add("row");
        //div.appendChild( newNode );        
        
        var newNode = document.getElementById(divId+'-Developer');     
        newNode.innerHTML = "Разработчик - <p id='Developer'>"+shipData.Developer+"</p>";
        newNode.classList.add("row");
        //div.appendChild( newNode );  

        var newNode = document.getElementById(divId+'-Place_of_construction');     
        newNode.innerHTML = "Место строительства - <p id='Place_of_construction'>"+shipData.Place_of_construction+"</p>";
        newNode.classList.add("row");
        //div.appendChild( newNode );  
        
        var newNode = document.getElementById(divId+'-Release_date');     
        newNode.innerHTML = "Дата выпуска - <p id='Release_date'>"+shipData.Release_date+"</p>";
        newNode.classList.add("row");
        //div.appendChild( newNode );  
        
        var newNode = document.getElementById(divId+'-Production_end');     
        newNode.innerHTML = "Дата окончания эксплуатации - <p id='Production_end'>"+shipData.Production_end+"</p>";
        newNode.classList.add("row");
        //div.appendChild( newNode );          

        var newNode = document.getElementById(divId+'-Displacement_t');     
        newNode.innerHTML = "Водоизмещение, т - <p id='Displacement_t'>"+shipData.Displacement_t+"</p>";
        newNode.classList.add("row");
        //div.appendChild( newNode );            

        var newNode = document.getElementById(divId+'-Place_of_the_main_battle');     
        newNode.innerHTML = "Место основного сражения - <p id='Place_of_the_main_battle'>"+shipData.Place_of_the_main_battle+"</p>";
        newNode.classList.add("row");
        //div.appendChild( newNode );         

        var newNode = document.getElementById(divId+'-Date_of_the_main_battle');     
        newNode.innerHTML = "Дата основного сражения - <p id='Date_of_the_main_battle'>"+shipData.Date_of_the_main_battle+"</p>";
        newNode.classList.add("row");
        //div.appendChild( newNode );  

        var newNode = document.getElementById(divId+'-Result_of_the_main_battle');     
        newNode.innerHTML = "Результат основного сражения - <p id='Result_of_the_main_battle'>"+shipData.Result_of_the_main_battle+"</p>";
        newNode.classList.add("row");
        //div.appendChild( newNode );  

        var newNode = document.getElementById(divId+'-Main_humming_force');     
        newNode.innerHTML = "Основной колибр - <p id='Main_humming_force'>"+shipData.Main_humming_force+"</p>";
        newNode.classList.add("row");
        //div.appendChild( newNode ); 

        var newNode = document.getElementById(divId+'-Number_of_guns');     
        newNode.innerHTML = "Число пушек - <p id='Number_of_guns'>"+shipData.Number_of_guns+"</p>";
        newNode.classList.add("row");
        //div.appendChild( newNode ); 

        var newNode = document.getElementById(divId+'-Crew');     
        newNode.innerHTML = "Экипаж - <p id='Crew'>"+shipData.Crew+"</p>";
        newNode.classList.add("row");
        //div.appendChild( newNode ); 

        var newNode = document.getElementById(divId+'-Range_thousand_km');     
        newNode.innerHTML = "Дальность хода, тыс. км - <p id='Range_thousand_km'>"+shipData.Range_thousand_km+"</p>";
        newNode.classList.add("row");
        //div.appendChild( newNode ); 

        var newNode = document.getElementById(divId+'-Engine_power_hp');     
        newNode.innerHTML = "Мощность двигателя, л.с. - <p id='Engine_power_hp'>"+shipData.Engine_power_hp+"</p>";
        newNode.classList.add("row");
        //div.appendChild( newNode );         

        var newNode = document.getElementById(divId+'-Length_m');     
        newNode.innerHTML = "Длина, м - <p id='Length_m'>"+shipData.Length_m+"</p>";
        newNode.classList.add("row");
        //div.appendChild( newNode );    

        var newNode = document.getElementById(divId+'-Sidewall_ammunition_mm');     
        newNode.innerHTML = "Броня бортов, мм - <p id='Sidewall_ammunition_mm'>"+shipData.Sidewall_ammunition_mm+"</p>";
        newNode.classList.add("row");
        //div.appendChild( newNode );    

        var newNode = document.getElementById(divId+'-Speed_knots');     
        newNode.innerHTML = "Скорость, узлы - <p id='Speed_knots'>"+shipData.Speed_knots+"</p>";
        newNode.classList.add("row");
        //div.appendChild( newNode );  

        var newNode = document.getElementById(divId+'-Firing_range_km');     
        newNode.innerHTML = "Дальность стрельбы, км - <p id='Firing_range_km'>"+shipData.Firing_range_km+"</p>";
        newNode.classList.add("row");
        //div.appendChild( newNode );  

        var newNode = document.getElementById(divId+'-Source');     
        newNode.innerHTML = "Источник - <p id='Source'><a href='"+shipData.Source+"'>Ссылка</a></p>";
        newNode.classList.add("row");
        //div.appendChild( newNode );  

        var newNode = document.getElementById(divId+'-Note');     
        newNode.innerHTML = "Примечание - <p id='Note'>"+shipData.Note+"</p>";
        newNode.classList.add("row");
        //div.appendChild( newNode );  


    }

}