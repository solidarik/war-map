(function(globals){
    globals.get = function(obj, key) {
        return key.split(".").reduce(function(o, x) {
            return (typeof o == "undefined" || o === null) ? o : o[x];
        }, obj);
    }
}(this));

(function($) {
    var IS_IOS = /iphone|ipad/i.test(navigator.userAgent);
    $.fn.nodoubletapzoom = function() {
      if (IS_IOS)
        $(this).bind('touchstart', function preventZoom(e) {
          var t2 = e.timeStamp
            , t1 = $(this).data('lastTouch') || t2
            , dt = t2 - t1
            , fingers = e.originalEvent.touches.length;
          $(this).data('lastTouch', t2);
          if (!dt || dt > 500 || fingers > 1) return; // not double-tap
  
          e.preventDefault(); // double tap - prevent the zoom
          // also synthesize click events we just swallowed up
          $(this).trigger('click').trigger('click');
        });
    };
  })(jQuery);

// Array Remove - By John Resig (MIT Licensed)
Array.prototype.remove = function(from, to) {
    var rest = this.slice((to || from) + 1 || this.length);
    this.length = from < 0 ? this.length + from : from;
    return this.push.apply(this, rest);
};

// Warn if overriding existing method
if(Array.prototype.equals)
    console.warn("Overriding existing Array.prototype.equals. Possible causes: New API defines the method, there's a framework conflict or you've got double inclusions in your code.");
// attach the .equals method to Array's prototype to call it on any array
Array.prototype.equals = function (array) {
    // if the other array is a falsy value, return
    if (!array)
        return false;

    // compare lengths - can save a lot of time 
    if (this.length != array.length)
        return false;

    for (var i = 0, l=this.length; i < l; i++) {
        // Check if we have nested arrays
        if (this[i] instanceof Array && array[i] instanceof Array) {
            // recurse into the nested arrays
            if (!this[i].equals(array[i]))
                return false;       
        }           
        else if (this[i] != array[i]) { 
            // Warning - two different object instances will never be equal: {x:20} != {x:20}
            return false;   
        }           
    }       
    return true;
}
// Hide method from for-in loops
Object.defineProperty(Array.prototype, "equals", {enumerable: false});

$.fn.exists = function () {
    return this.length !== 0;
}

function enableButton(elem, status){
    elem.prop("disabled", !status);
}

function checkDate(d) {
    if ( Object.prototype.toString.call(d) === "[object Date]" ) {
        // it is a date
        if ( isNaN( d.getTime() ) ) {
            // date is not valid
            return false;
        }
        else {
            // date is valid
            return true;
        }
    }
    else {
        // not a date
        return false;
    }
}