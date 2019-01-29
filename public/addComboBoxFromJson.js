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
        console.log("1");
        $('#'+divId).children().remove(); 
        console.log('#'+divId+"="+$('#'+divId));
        console.log('#'+divId+"="+$('#'+divId+"dd"));
        console.log($('#'+divId).length);
        console.log("2");
        data.forEach(function (d) {
            console.log("d="+d);
            let a = $('<a />').addClass("dropdown-item").text(d[textField]).click(function(){
                onClickFunction(d);
            });
            $("#"+divId).append(a);
         });
    }    
}