class addComboBoxFromJson {
    static addDropDown(data,divId,valueField,textField,onChangeFunction){
        $('#'+divId).val('');
        data.forEach(function (d) {
            let option = $('<option />').val(d[valueField]).text(d[textField]);
            $("#"+divId).append(option);
         });
         $('#'+divId).on('change', function(){
            onChangeFunction($(this).val());
        });
    }
    static addBootstrapDropDown(data,divId,valueField,textField,onClickFunction){
        $('#'+divId).children().remove(); 
        data.forEach(function (d) {
            let a = $('<a />').addClass("dropdown-item").text(d[textField]).click(function(){
                onClickFunction(d);
            });
            $("#"+divId).append(a);
         });
    }    
    
    static addBootstrapDropDownSubMenu(data,divId,valueField,textField,onClickFunction,groupField){
        $('#'+divId).children().remove(); 

        let group = '';
        let numberGroup=1;
        let groupID;
        let divSubmenu;
        //data.forEach(function (d) {for(let d in data) {//for(var d = 0; d < json.length; d++) {
        for(var i = 0; i < data.length; i++) {
            d=data[i];
            if(group!=d[groupField]){           
                group = d[groupField]      
                groupID= "subMenu"+numberGroup.toString();
                numberGroup++;
                let a = $('<a />').addClass("dropdown-item submenu").text(d[groupField]).attr('href','#');
                $("#"+divId).append(a);
                divSubmenu = $('<div />').addClass("dropdown-menu submenu").attr("id",groupID)
                $("#"+divId).append(divSubmenu);
            }
            let a = $('<a />').addClass("dropdown-item").text(d[textField]).click(function(){
                onClickFunction(d);
            });

            $("#"+groupID).append(a);
         }
         //);


    }  

}