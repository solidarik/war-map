
"use strict";

window.app = {};
var app = window.app;

// Production steps of ECMA-262, Edition 5, 15.4.4.18
// Reference: http://es5.github.io/#x15.4.4.18
if (!Array.prototype.forEach) {

    Array.prototype.forEach = function(callback/*, thisArg*/) {
  
      var T, k;
  
      if (this == null) {
        throw new TypeError('this is null or not defined');
      }
  
      // 1. Let O be the result of calling toObject() passing the
      // |this| value as the argument.
      var O = Object(this);
  
      // 2. Let lenValue be the result of calling the Get() internal
      // method of O with the argument "length".
      // 3. Let len be toUint32(lenValue).
      var len = O.length >>> 0;
  
      // 4. If isCallable(callback) is false, throw a TypeError exception. 
      // See: http://es5.github.com/#x9.11
      if (typeof callback !== 'function') {
        throw new TypeError(callback + ' is not a function');
      }
  
      // 5. If thisArg was supplied, let T be thisArg; else let
      // T be undefined.
      if (arguments.length > 1) {
        T = arguments[1];
      }
  
      // 6. Let k be 0.
      k = 0;
  
      // 7. Repeat while k < len.
      while (k < len) {
  
        var kValue;
  
        // a. Let Pk be ToString(k).
        //    This is implicit for LHS operands of the in operator.
        // b. Let kPresent be the result of calling the HasProperty
        //    internal method of O with argument Pk.
        //    This step can be combined with c.
        // c. If kPresent is true, then
        if (k in O) {
  
          // i. Let kValue be the result of calling the Get internal
          // method of O with argument Pk.
          kValue = O[k];
  
          // ii. Call the Call internal method of callback with T as
          // the this value and argument list containing kValue, k, and O.
          callback.call(T, kValue, k, O);
        }
        // d. Increase k by 1.
        k++;
      }
      // 8. return undefined.
    };
  }

  if (! Object.getOwnPropertyDescriptor(NodeList.prototype, 'forEach')) {
    Object.defineProperty(NodeList.prototype, 'forEach', Object.getOwnPropertyDescriptor(Array.prototype, 'forEach'));
}

//////////////////////////////////////////////////
//console.log('1');
function startApp() {
    //console.log('2');
    //var persons = new addPersons("persons-table", "data/tasks.json");
    //persons.clearTable();
    //console.log('3');
    //persons.fillTable();

    $("#persons-table tr:eq(0) td:first-child span").click();

    var urlHints = 'data/hints.json';

    d3.json(urlHints, function (error, hints) {

      hints.sort(function() { return .5 - Math.random();});

      // $.notify({
      //   // options
      //   message: hints[0].rusFact+'<br><a href="'+hints[0].url+'">Подробнее...</>' 
      // },{
      //   // settings
      //   type: 'info',
      //   delay: 0,
      //   autoHide: false, 
      //   clickToHide: false,
      //   globalPosition: 'middle right',
      // });
    
      $('#Hint').html(hints[0].rusFact+'<br><a href="'+hints[0].url+'">Подробнее...</>');

    });
    
    var urlPersons = 'data/persons.json';

    d3.json(urlPersons, function (error, persons) {

      var dtTemp = new Date();
      var dt = new Date(dtTemp.getFullYear(),dtTemp.getMonth(),dtTemp.getDate());

      var birthPersons=persons.filter(function(d) { 
        var dtDateBirth = d.DateBirth; 
        var datePartsBirth = dtDateBirth.split(".");

        var dtObjectDateBirth = new Date(+datePartsBirth[2], datePartsBirth[1] - 1, +datePartsBirth[0]);
        
        //  console.log('dt.toString='+dt.toString());
        //  console.log('dtObjectDateBirth.toString='+dtObjectDateBirth.toString());
        //  console.log('dt.getDate()='+dt.getDate());
        //  console.log('dtObjectDateBirh.getDate()='+dtObjectDateBirth.getDate());
        //  console.log('dt.getMonth='+dt.getMonth());
        //  console.log('dtObjectDateBirth.getMonth='+dtObjectDateBirth.getMonth());        
        return dt.getDate()==dtObjectDateBirth.getDate()&&dt.getMonth()==dtObjectDateBirth.getMonth();
      });
    
      //console.log(birthPersons);
      $('#100YearsAgo').html('');
      for(var i =0;i<birthPersons.length;i++) {
          var k=birthPersons[i];
          $('#100YearsAgo').html($('#100YearsAgo').html()+'В этот день '+k.DateBirth+' родился '+k.Surname+' '+k.Name+' '+k.MiddleName+'<br><a href="'+k.Source+'">Подробнее...</><br>');
      }
      
      var deathPersons=persons.filter(function(d) { 
        var dtDateDeath = d.DateDeath; 
        var datePartsDeath = dtDateDeath.split(".");

        var dtObjectDateDeath = new Date(+datePartsDeath[2], datePartsDeath[1] - 1, +datePartsDeath[0]);
        
        // console.log('dt.toString='+dt.toString());
        // console.log('dtObjectDateBirth.toString='+dtObjectDateBirth.toString());
        // console.log('dt.getDate()='+dt.getDate());
        // console.log('dtObjectDateBirth.getDate()='+dtObjectDateBirth.getDate());
        // console.log('dt.getMonth='+dt.getMonth());
        // console.log('dtObjectDateBirth.getMonth='+dtObjectDateBirth.getMonth());        
        return dt.getDate()==dtObjectDateDeath.getDate()&&dt.getMonth()==dtObjectDateDeath.getMonth();
      });
     // console.log(eathPersons);
      
      for(var i =0;i<deathPersons.length;i++) {
          var k=deathPersons[i];
          $('#100YearsAgo').html($('#100YearsAgo').html()+'В этот день '+k.DateBirth+' умер '+k.Surname+' '+k.Name+' '+k.MiddleNmae+'<br><a href="'+k.Source+'">Подробнее...</><br>');
      }      

      if(deathPersons.length==0&&birthPersons.length==0){
        $('#100YearsAgo').html('В этот день не было событий');
      }

    });

}

$(document).ready(function () {
 
  $('#collapse-person-button').on('click',function(){
    if($('#collapse-person-button').children().hasClass('mdi-chevron-double-up')){
      $('#collapse-person-button').children().removeClass('mdi-chevron-double-up').addClass('mdi-chevron-double-down');
    }
    else if($('#collapse-person-button').children().hasClass('mdi-chevron-double-down')){
      $('#collapse-person-button').children().removeClass('mdi-chevron-double-down').addClass('mdi-chevron-double-up');
    }
  });

  // $('#collapse-persons-info').on('shown.bs.collapse', function() {
  //   console.log('shown.bs.collapse');
  //   $('#collapse-person-button').children().removeClass('mdi-chevron-double-up').addClass('mdi-chevron-double-down');
  // });

  // $('#collapse-persons-info').on('hidden.bs.collapse', function()  {
  //   console.log('hidden.bs.collapse');
  //   $('#collapse-person-button').children().removeClass('mdi-chevron-double-down').addClass('mdi-chevron-double-up');
  // });
});

/////////////////////////////////////////////////
function addEvent(evnt, elem, func) {
    if (elem.addEventListener)  // W3C DOM
    {
        elem.addEventListener(evnt, func, false);
        //console.log('addeventlistener');
    }
    else if (elem.attachEvent) { // IE DOM
        elem.attachEvent("on" + evnt, func);
        //console.log('attackEvent');
    }
    else { // No much to do
        elem["on" + evnt] = func;
    }
}

addEvent('load', window, startApp);