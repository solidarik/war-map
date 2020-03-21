
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
function startApp() {
    var persons = new addPersons("persons-table", "data/persons_old.json");
    persons.clearTable();
    persons.fillTable();
    $("#persons-table tr:eq(0) td:first-child span").click();
   
    $('#option1').closest('label').off('click').click(function() { 
      var persons = new addPersons("persons-table", "data/persons_old.json");
      persons.clearTable();
      persons.fillTable();
      $("#persons-table tr:eq(0) td:first-child span").click();
    });
    $('#option2').closest('label').off('click').click(function() { 
      var persons = new addPersons("persons-table", "data/persons.json");
      persons.clearTable();
      persons.fillTable();
      $("#persons-table tr:eq(0) td:first-child span").click();
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