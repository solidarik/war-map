class addShips{

    static addShip(divId,shipData){
        var div = document.getElementById(divId);
        div.innerHTML = "";

        var newNode = document.createElement('div');      
        newNode.innerHTML = "<img class='image-center img-rounded resized-image' id='imgPerson' src='"+shipData.URL_Local_picture+"' alt=''>";
        newNode.classList.add("row");
        newNode.classList.add("img");
        newNode.classList.add("image-cont");
        div.appendChild( newNode );

        newNode = document.createElement('div');      
        newNode.innerHTML = "Страна - <p id='Country'>"+shipData.Country+"</p>";
        newNode.classList.add("row");
        div.appendChild( newNode );
        
        newNode = document.createElement('div');      
        newNode.innerHTML = "Кораблей в серии - <p id='Ships_in_series'>"+shipData.Ships_in_series+"</p>";
        newNode.classList.add("row");
        div.appendChild( newNode );

        newNode = document.createElement('div');      
        newNode.innerHTML = "Тип корабля - <p id='Ship_type'>"+shipData.Ship_type+"</p>";
        newNode.classList.add("row");
        div.appendChild( newNode );

        newNode = document.createElement('div');      
        newNode.innerHTML = "Название - <p id='Name'>"+shipData.Name+"</p>";
        newNode.classList.add("row");
        div.appendChild( newNode );        
        
        newNode = document.createElement('div');      
        newNode.innerHTML = "Разработчик - <p id='Developer'>"+shipData.Developer+"</p>";
        newNode.classList.add("row");
        div.appendChild( newNode );  

        newNode = document.createElement('div');      
        newNode.innerHTML = "Место строительства - <p id='Place_of_construction'>"+shipData.Place_of_construction+"</p>";
        newNode.classList.add("row");
        div.appendChild( newNode );  
        
        newNode = document.createElement('div');      
        newNode.innerHTML = "Дата выпуска - <p id='Release_date'>"+shipData.Release_date+"</p>";
        newNode.classList.add("row");
        div.appendChild( newNode );  
        
        newNode = document.createElement('div');      
        newNode.innerHTML = "Дата окончания эксплуатации - <p id='Production_end'>"+shipData.Production_end+"</p>";
        newNode.classList.add("row");
        div.appendChild( newNode );          

        newNode = document.createElement('div');      
        newNode.innerHTML = "Водоизмещение, т - <p id='Displacement_t'>"+shipData.Displacement_t+"</p>";
        newNode.classList.add("row");
        div.appendChild( newNode );            

        newNode = document.createElement('div');      
        newNode.innerHTML = "Место основного сражения - <p id='Place_of_the_main_battle'>"+shipData.Place_of_the_main_battle+"</p>";
        newNode.classList.add("row");
        div.appendChild( newNode );         

        newNode = document.createElement('div');      
        newNode.innerHTML = "Дата основного сражения - <p id='Date_of_the_main_battle'>"+shipData.Date_of_the_main_battle+"</p>";
        newNode.classList.add("row");
        div.appendChild( newNode );  

        newNode = document.createElement('div');      
        newNode.innerHTML = "Результат основного сражения - <p id='Result_of_the_main_battle'>"+shipData.Result_of_the_main_battle+"</p>";
        newNode.classList.add("row");
        div.appendChild( newNode );  

        newNode = document.createElement('div');      
        newNode.innerHTML = "Основной колибр - <p id='Main_humming_force'>"+shipData.Main_humming_force+"</p>";
        newNode.classList.add("row");
        div.appendChild( newNode ); 

        newNode = document.createElement('div');      
        newNode.innerHTML = "Число пушек - <p id='Number_of_guns'>"+shipData.Number_of_guns+"</p>";
        newNode.classList.add("row");
        div.appendChild( newNode ); 

        newNode = document.createElement('div');      
        newNode.innerHTML = "Экипаж - <p id='Crew'>"+shipData.Crew+"</p>";
        newNode.classList.add("row");
        div.appendChild( newNode ); 

        newNode = document.createElement('div');      
        newNode.innerHTML = "Дальность хода, тыс. км - <p id='Range_thousand_km'>"+shipData.Range_thousand_km+"</p>";
        newNode.classList.add("row");
        div.appendChild( newNode ); 

        newNode = document.createElement('div');      
        newNode.innerHTML = "Мощность двигателя, л.с. - <p id='Engine_power_hp'>"+shipData.Engine_power_hp+"</p>";
        newNode.classList.add("row");
        div.appendChild( newNode );         

        newNode = document.createElement('div');      
        newNode.innerHTML = "Длина, м - <p id='Length_m'>"+shipData.Length_m+"</p>";
        newNode.classList.add("row");
        div.appendChild( newNode );    

        newNode = document.createElement('div');      
        newNode.innerHTML = "Броня бортов, мм - <p id='Sidewall_ammunition_mm'>"+shipData.Sidewall_ammunition_mm+"</p>";
        newNode.classList.add("row");
        div.appendChild( newNode );    

        newNode = document.createElement('div');      
        newNode.innerHTML = "Скорость, узлы - <p id='Speed_knots'>"+shipData.Speed_knots+"</p>";
        newNode.classList.add("row");
        div.appendChild( newNode );  

        newNode = document.createElement('div');      
        newNode.innerHTML = "Дальность стрельбы, км - <p id='Firing_range_km'>"+shipData.Firing_range_km+"</p>";
        newNode.classList.add("row");
        div.appendChild( newNode );  

        newNode = document.createElement('div');      
        newNode.innerHTML = "Источник - <p id='Source'><a href='"+shipData.Source+"'>Ссылка</a></p>";
        newNode.classList.add("row");
        div.appendChild( newNode );  

        newNode = document.createElement('div');      
        newNode.innerHTML = "Примечание - <p id='Note'>"+shipData.Note+"</p>";
        newNode.classList.add("row");
        div.appendChild( newNode );  


    }

}