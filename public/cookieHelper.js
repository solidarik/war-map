'use strict';


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var CookieHelper = function () {
  function CookieHelper() {
    _classCallCheck(this, CookieHelper);
  }

  _createClass(CookieHelper, null, [{
    key: 'getCookie',
    value: function getCookie(name) {
      var matches = document.cookie.match(new RegExp('(?:^|; )' + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + '=([^;]*)'));

      if (!matches) return undefined;

      matches = decodeURIComponent(matches[1]);

      return matches == 'undefined' ? undefined : matches;
    }
  }, {
    key: 'setCookie',
    value: function setCookie(name, value, options) {
      options = options || {};

      var expires = options.expires;

      if (typeof expires == 'number' && expires) {
        var d = new Date();
        d.setTime(d.getTime() + expires * 1000);
        expires = options.expires = d;
      }
      if (expires && expires.toUTCString) {
        options.expires = expires.toUTCString();
      }

      value = encodeURIComponent(value);

      var updatedCookie = name + '=' + value;

      for (var propName in options) {
        updatedCookie += '; ' + propName;
        var propValue = options[propName];
        if (propValue !== true) {
          updatedCookie += '=' + propValue;
        }
      }

      document.cookie = updatedCookie;
    }
  }, {
    key: 'deleteCookie',
    value: function deleteCookie(name) {
      setCookie(name, '', {
        expires: -1
      });
    }
  }]);

  return CookieHelper;
}();