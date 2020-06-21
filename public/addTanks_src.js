class addTanks{

    static addTank(divId,tankData){
        // var div = document.getElementById(divId);
        // div.innerHTML = "";

        var newNode = document.getElementById(divId+'-Img');      
        newNode.innerHTML = "<img class='image-center img-rounded resized-image' id='imgPerson' src='"+tankData.URL_Local_picture+"' alt=''>";
        newNode.classList.add("row");
        newNode.classList.add("img");
        newNode.classList.add("image-cont");
        //div.appendChild( newNode );


        newNode = document.getElementById(divId+'-Type');     
        newNode.innerHTML = "Тип - <p id='Type'>"+tankData.Type+"</p>";
        newNode.classList.add("row");
        //div.appendChild( newNode );
        
        newNode = document.getElementById(divId+'-Kind');     
        newNode.innerHTML = "Вид - <p id='Kind'>"+tankData.Kind+"</p>";
        newNode.classList.add("row");
        //div.appendChild( newNode );

        newNode = document.getElementById(divId+'-Brand');     
        newNode.innerHTML = "Название - <p id='Brand'>"+tankData.Brand+"</p>";
        newNode.classList.add("row");
        //div.appendChild( newNode );

        newNode = document.getElementById(divId+'-Country');     
        newNode.innerHTML = "Страна - <p id='Country'>"+tankData.Country+"</p>";
        newNode.classList.add("row");
        //div.appendChild( newNode );        
        
        newNode = document.getElementById(divId+'-Constructor');     
        newNode.innerHTML = "Конструктор - <p id='Constructor'>"+tankData.Constructor+"</p>";
        newNode.classList.add("row");
        //div.appendChild( newNode );  

        newNode = document.getElementById(divId+'-Manufacturer');     
        newNode.innerHTML = "Производитель - <p id='Manufacturer'>"+tankData.Manufacturer+"</p>";
        newNode.classList.add("row");
        //div.appendChild( newNode );  
        
        newNode = document.getElementById(divId+'-Year_creation');     
        newNode.innerHTML = "Дата создания - <p id='Year_creation'>"+tankData.Year_creation+"</p>";
        newNode.classList.add("row");
        //div.appendChild( newNode );  
        
        newNode = document.getElementById(divId+'-Adopted');     
        newNode.innerHTML = "Принят на вооружение - <p id='Adopted'>"+tankData.Adopted+"</p>";
        newNode.classList.add("row");
        //div.appendChild( newNode );          

        newNode = document.getElementById(divId+'-Production_end');     
        newNode.innerHTML = "Окончание производства - <p id='Production_end'>"+tankData.Production_end+"</p>";
        newNode.classList.add("row");
        //div.appendChild( newNode );            

        newNode = document.getElementById(divId+'-Number');     
        newNode.innerHTML = "Количество - <p id='Number'>"+tankData.Number+"</p>";
        newNode.classList.add("row");
        //div.appendChild( newNode );         

        newNode = document.getElementById(divId+'-Weight_kg');     
        newNode.innerHTML = "Вес, кг - <p id='Weight_kg'>"+tankData.Weight_kg+"</p>";
        newNode.classList.add("row");
        //div.appendChild( newNode );  

        newNode = document.getElementById(divId+'-Length_m');     
        newNode.innerHTML = "Длина, м - <p id='Length_m'>"+tankData.Length_m+"</p>";
        newNode.classList.add("row");
        //div.appendChild( newNode );  

        newNode = document.getElementById(divId+'-Production_place');     
        newNode.innerHTML = "Место производства - <p id='Production_place'>"+tankData.Production_place+"</p>";
        newNode.classList.add("row");
        //div.appendChild( newNode ); 

        newNode = document.getElementById(divId+'-Initial_projectile_speed_m_s');     
        newNode.innerHTML = "Начальная скорость снаряда, м/с - <p id='Initial_projectile_speed_m_s'>"+tankData.Initial_projectile_speed_m_s+"</p>";
        newNode.classList.add("row");
        //div.appendChild( newNode ); 

        newNode = document.getElementById(divId+'-Armor_thickness_mm_board');     
        newNode.innerHTML = "Толщина брони, мм - <p id='Armor_thickness_mm_board'>"+tankData.Armor_thickness_mm_board+"</p>";
        newNode.classList.add("row");
        //div.appendChild( newNode ); 

        newNode = document.getElementById(divId+'-Main_caliber_mm');     
        newNode.innerHTML = "Основной каллибр, мм - <p id='Main_caliber_mm'>"+tankData.Main_caliber_mm+"</p>";
        newNode.classList.add("row");
        //div.appendChild( newNode ); 

        newNode = document.getElementById(divId+'-Ammunition');     
        newNode.innerHTML = "Боекомплект - <p id='Ammunition'>"+tankData.Ammunition+"</p>";
        newNode.classList.add("row");
        //div.appendChild( newNode );         

        newNode = document.getElementById(divId+'-Rate_of_fire');     
        newNode.innerHTML = "Скорострельность - <p id='Rate_of_fire'>"+tankData.Rate_of_fire+"</p>";
        newNode.classList.add("row");
        //div.appendChild( newNode );    

        newNode = document.getElementById(divId+'-Firing_range_km');     
        newNode.innerHTML = "Дальность стрельбы, км - <p id='Firing_range_km'>"+tankData.Firing_range_km+"</p>";
        newNode.classList.add("row");
        //div.appendChild( newNode );    

        newNode = document.getElementById(divId+'-Speed_km_h_or_knots');     
        newNode.innerHTML = "Скорость, км/ч - <p id='Speed_km_h_or_knots'>"+tankData.Speed_km_h_or_knots+"</p>";
        newNode.classList.add("row");
        //div.appendChild( newNode );  

        newNode = document.getElementById(divId+'-Crew_person');     
        newNode.innerHTML = "Экипаж - <p id='Crew_person'>"+tankData.Crew_person+"</p>";
        newNode.classList.add("row");
        //div.appendChild( newNode );  

        newNode = document.getElementById(divId+'-Cruising_range_km');     
        newNode.innerHTML = "Дальность хода, км - <p id='Cruising_range_km'>"+tankData.Cruising_range_km+"</p>";
        newNode.classList.add("row");
        //div.appendChild( newNode );  

        newNode = document.getElementById(divId+'-Engine_power_hp');     
        newNode.innerHTML = "Мощность двигателя, л.с. - <p id='Engine_power_hp'>"+tankData.Engine_power_hp+"</p>";
        newNode.classList.add("row");
        //div.appendChild( newNode );  

        newNode = document.getElementById(divId+'-Armament');     
        newNode.innerHTML = "Вооружение - <p id='Armament'>"+tankData.Armament+"</p>";
        newNode.classList.add("row");
        //div.appendChild( newNode );  

        newNode = document.getElementById(divId+'-Practical_ceiling');     
        newNode.innerHTML = "Практический потолок - <p id='Practical_ceiling'>"+tankData.Practical_ceiling+"</p>";
        newNode.classList.add("row");
        //div.appendChild( newNode );  

        newNode = document.getElementById(divId+'-Source');     
        newNode.innerHTML = "Источник - <p id='Source'><a href='"+tankData.Source+"'>Ссылка</a></p>";
        newNode.classList.add("row");
        //div.appendChild( newNode );  

        newNode = document.getElementById(divId+'-Note');     
        newNode.innerHTML = "Примечание - <p id='Note'>"+tankData.Note+"</p>";
        newNode.classList.add("row");
        //div.appendChild( newNode );  


    }

}