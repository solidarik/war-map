class addAircrafts{

    static addAircraft(divId,aircraftData){
        // var div = document.getElementById(divId);
        // div.innerHTML = "";

        var newNode = document.getElementById(divId+'-Img');      
        newNode.innerHTML = "<img class='image-center img-rounded resized-image' id='imgPerson' src='"+aircraftData.URL_Local_picture+"' alt=''>";
        newNode.classList.add("row");
        newNode.classList.add("img");
        newNode.classList.add("image-cont");
        //div.appendChild( newNode );


        var newNode = document.getElementById(divId+'-Type');      
        newNode.innerHTML = "Тип - <p id='Type'>"+aircraftData.Type+"</p>";
        newNode.classList.add("row");
        //div.appendChild( newNode );
        
        var newNode = document.getElementById(divId+'-Kind');      
        newNode.innerHTML = "Вид - <p id='Kind'>"+aircraftData.Kind+"</p>";
        newNode.classList.add("row");
        //div.appendChild( newNode );

        var newNode = document.getElementById(divId+'-Brand');      
        newNode.innerHTML = "Название - <p id='Brand'>"+aircraftData.Brand+"</p>";
        newNode.classList.add("row");
        //div.appendChild( newNode );

        var newNode = document.getElementById(divId+'-Country');      
        newNode.innerHTML = "Страна - <p id='Country'>"+aircraftData.Country+"</p>";
        newNode.classList.add("row");
        //div.appendChild( newNode );        
        
        var newNode = document.getElementById(divId+'-Constructor');      
        newNode.innerHTML = "Конструктор - <p id='Constructor'>"+aircraftData.Constructor+"</p>";
        newNode.classList.add("row");
        //div.appendChild( newNode );  

        var newNode = document.getElementById(divId+'-Manufacturer');      
        newNode.innerHTML = "Производитель - <p id='Manufacturer'>"+aircraftData.Manufacturer+"</p>";
        newNode.classList.add("row");
        //div.appendChild( newNode );  
        
        var newNode = document.getElementById(divId+'-Year_creation');      
        newNode.innerHTML = "Дата создания - <p id='Year_creation'>"+aircraftData.Year_creation+"</p>";
        newNode.classList.add("row");
        //div.appendChild( newNode );  
        
        var newNode = document.getElementById(divId+'-Adopted');      
        newNode.innerHTML = "Принят на вооружение - <p id='Adopted'>"+aircraftData.Adopted+"</p>";
        newNode.classList.add("row");
        //div.appendChild( newNode );          

        var newNode = document.getElementById(divId+'-Production_end');      
        newNode.innerHTML = "Окончание производства - <p id='Production_end'>"+aircraftData.Production_end+"</p>";
        newNode.classList.add("row");
        //div.appendChild( newNode );            

        var newNode = document.getElementById(divId+'-Number');      
        newNode.innerHTML = "Количество - <p id='Number'>"+aircraftData.Number+"</p>";
        newNode.classList.add("row");
        //div.appendChild( newNode );         

        var newNode = document.getElementById(divId+'-Weight_kg');      
        newNode.innerHTML = "Вес, кг - <p id='Weight_kg'>"+aircraftData.Weight_kg+"</p>";
        newNode.classList.add("row");
        //div.appendChild( newNode );  

        var newNode = document.getElementById(divId+'-Length_m');      
        newNode.innerHTML = "Длина, м - <p id='Length_m'>"+aircraftData.Length_m+"</p>";
        newNode.classList.add("row");
        //div.appendChild( newNode );  

        var newNode = document.getElementById(divId+'-Production_place');      
        newNode.innerHTML = "Место производства - <p id='Production_place'>"+aircraftData.Production_place+"</p>";
        newNode.classList.add("row");
        //div.appendChild( newNode ); 

        var newNode = document.getElementById(divId+'-Speed_km_h_or_knots');      
        newNode.innerHTML = "Скорость, км/ч - <p id='Speed_km_h_or_knots'>"+aircraftData.Speed_km_h_or_knots+"</p>";
        newNode.classList.add("row");
        //div.appendChild( newNode );  

        var newNode = document.getElementById(divId+'-Crew_person');      
        newNode.innerHTML = "Экипаж - <p id='Crew_person'>"+aircraftData.Crew_person+"</p>";
        newNode.classList.add("row");
        //div.appendChild( newNode );  

        var newNode = document.getElementById(divId+'-Cruising_range_km');      
        newNode.innerHTML = "Дальность полета, км - <p id='Cruising_range_km'>"+aircraftData.Cruising_range_km+"</p>";
        newNode.classList.add("row");
        //div.appendChild( newNode );  

        var newNode = document.getElementById(divId+'-Engine_power_hp');      
        newNode.innerHTML = "Мощность двигателя, л.с. - <p id='Engine_power_hp'>"+aircraftData.Engine_power_hp+"</p>";
        newNode.classList.add("row");
        //div.appendChild( newNode );  

        var newNode = document.getElementById(divId+'-Armament');      
        newNode.innerHTML = "Вооружение - <p id='Armament'>"+aircraftData.Armament+"</p>";
        newNode.classList.add("row");
        //div.appendChild( newNode );  

        var newNode = document.getElementById(divId+'-Practical_ceiling');      
        newNode.innerHTML = "Практический потолок - <p id='Practical_ceiling'>"+aircraftData.Practical_ceiling+"</p>";
        newNode.classList.add("row");
        //div.appendChild( newNode );  

        var newNode = document.getElementById(divId+'-Source');      
        newNode.innerHTML = "Источник - <p id='Source'><a href='"+aircraftData.Source+"'>Ссылка</a></p>";
        newNode.classList.add("row");
        //div.appendChild( newNode );  

        var newNode = document.getElementById(divId+'-Note');      
        newNode.innerHTML = "Примечание - <p id='Note'>"+aircraftData.Note+"</p>";
        newNode.classList.add("row");
        //div.appendChild( newNode );  


    }

}