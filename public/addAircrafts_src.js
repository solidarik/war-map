class addAircrafts{

    static addAircraft(divId,aircraftData){
        var div = document.getElementById(divId);
        div.innerHTML = "";

        var newNode = document.createElement('div');      
        newNode.innerHTML = "<img class='image-center img-rounded resized-image' id='imgPerson' src='"+aircraftData.URL_Local_picture+"' alt=''>";
        newNode.classList.add("row");
        newNode.classList.add("img");
        newNode.classList.add("image-cont");
        div.appendChild( newNode );


        newNode = document.createElement('div');      
        newNode.innerHTML = "Тип - <p id='Type'>"+aircraftData.Type+"</p>";
        newNode.classList.add("row");
        div.appendChild( newNode );
        
        newNode = document.createElement('div');      
        newNode.innerHTML = "Вид - <p id='Kind'>"+aircraftData.Kind+"</p>";
        newNode.classList.add("row");
        div.appendChild( newNode );

        newNode = document.createElement('div');      
        newNode.innerHTML = "Название - <p id='Brand'>"+aircraftData.Brand+"</p>";
        newNode.classList.add("row");
        div.appendChild( newNode );

        newNode = document.createElement('div');      
        newNode.innerHTML = "Страна - <p id='Country'>"+aircraftData.Country+"</p>";
        newNode.classList.add("row");
        div.appendChild( newNode );        
        
        newNode = document.createElement('div');      
        newNode.innerHTML = "Конструктор - <p id='Constructor'>"+aircraftData.Constructor+"</p>";
        newNode.classList.add("row");
        div.appendChild( newNode );  

        newNode = document.createElement('div');      
        newNode.innerHTML = "Производитель - <p id='Manufacturer'>"+aircraftData.Manufacturer+"</p>";
        newNode.classList.add("row");
        div.appendChild( newNode );  
        
        newNode = document.createElement('div');      
        newNode.innerHTML = "Дата создания - <p id='Year_creation'>"+aircraftData.Year_creation+"</p>";
        newNode.classList.add("row");
        div.appendChild( newNode );  
        
        newNode = document.createElement('div');      
        newNode.innerHTML = "Принят на вооружение - <p id='Adopted'>"+aircraftData.Adopted+"</p>";
        newNode.classList.add("row");
        div.appendChild( newNode );          

        newNode = document.createElement('div');      
        newNode.innerHTML = "Окончание производства - <p id='Production_end'>"+aircraftData.Production_end+"</p>";
        newNode.classList.add("row");
        div.appendChild( newNode );            

        newNode = document.createElement('div');      
        newNode.innerHTML = "Количество - <p id='Number'>"+aircraftData.Number+"</p>";
        newNode.classList.add("row");
        div.appendChild( newNode );         

        newNode = document.createElement('div');      
        newNode.innerHTML = "Вес, кг - <p id='Weight_kg'>"+aircraftData.Weight_kg+"</p>";
        newNode.classList.add("row");
        div.appendChild( newNode );  

        newNode = document.createElement('div');      
        newNode.innerHTML = "Длина, м - <p id='Length_m'>"+aircraftData.Length_m+"</p>";
        newNode.classList.add("row");
        div.appendChild( newNode );  

        newNode = document.createElement('div');      
        newNode.innerHTML = "Место производства - <p id='Production_place'>"+aircraftData.Production_place+"</p>";
        newNode.classList.add("row");
        div.appendChild( newNode ); 

        // newNode = document.createElement('div');      
        // newNode.innerHTML = "Водоизмещение, т - <p id='Displacement_t'>"+aircraftData.Displacement_t+"</p>";
        // newNode.classList.add("row");
        // div.appendChild( newNode ); 

        // newNode = document.createElement('div');      
        // newNode.innerHTML = "Толщина брони, мм - <p id='Armor_thickness_mm_board'>"+aircraftData.Armor_thickness_mm_board+"</p>";
        // newNode.classList.add("row");
        // div.appendChild( newNode ); 

        // newNode = document.createElement('div');      
        // newNode.innerHTML = "Основной каллибр, мм - <p id='Main_caliber_mm'>"+aircraftData.Main_caliber_mm+"</p>";
        // newNode.classList.add("row");
        // div.appendChild( newNode ); 

        // newNode = document.createElement('div');      
        // newNode.innerHTML = "Боекомплект - <p id='Ammunition'>"+aircraftData.Ammunition+"</p>";
        // newNode.classList.add("row");
        // div.appendChild( newNode );         

        // newNode = document.createElement('div');      
        // newNode.innerHTML = "Скорострельность - <p id='Rate_of_fire'>"+aircraftData.Rate_of_fire+"</p>";
        // newNode.classList.add("row");
        // div.appendChild( newNode );    

        // newNode = document.createElement('div');      
        // newNode.innerHTML = "Дальность стрельбы, км - <p id='Firing_range_km'>"+aircraftData.Firing_range_km+"</p>";
        // newNode.classList.add("row");
        // div.appendChild( newNode );    

        newNode = document.createElement('div');      
        newNode.innerHTML = "Скорость, км/ч - <p id='Speed_km_h_or_knots'>"+aircraftData.Speed_km_h_or_knots+"</p>";
        newNode.classList.add("row");
        div.appendChild( newNode );  

        newNode = document.createElement('div');      
        newNode.innerHTML = "Экипаж - <p id='Crew_person'>"+aircraftData.Crew_person+"</p>";
        newNode.classList.add("row");
        div.appendChild( newNode );  

        newNode = document.createElement('div');      
        newNode.innerHTML = "Дальность полета, км - <p id='Cruising_range_km'>"+aircraftData.Cruising_range_km+"</p>";
        newNode.classList.add("row");
        div.appendChild( newNode );  

        newNode = document.createElement('div');      
        newNode.innerHTML = "Мощность двигателя, л.с. - <p id='Engine_power_hp'>"+aircraftData.Engine_power_hp+"</p>";
        newNode.classList.add("row");
        div.appendChild( newNode );  

        newNode = document.createElement('div');      
        newNode.innerHTML = "Вооружение - <p id='Armament'>"+aircraftData.Armament+"</p>";
        newNode.classList.add("row");
        div.appendChild( newNode );  

        newNode = document.createElement('div');      
        newNode.innerHTML = "Практический потолок - <p id='Practical_ceiling'>"+aircraftData.Practical_ceiling+"</p>";
        newNode.classList.add("row");
        div.appendChild( newNode );  

        newNode = document.createElement('div');      
        newNode.innerHTML = "Источник - <p id='Source'><a href='"+aircraftData.Source+"'>Ссылка</a></p>";
        newNode.classList.add("row");
        div.appendChild( newNode );  

        newNode = document.createElement('div');      
        newNode.innerHTML = "Примечание - <p id='Note'>"+aircraftData.Note+"</p>";
        newNode.classList.add("row");
        div.appendChild( newNode );  


    }

}