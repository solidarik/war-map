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
}