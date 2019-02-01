'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var addComboBoxFromJson = function () {
    function addComboBoxFromJson() {
        _classCallCheck(this, addComboBoxFromJson);
    }

    _createClass(addComboBoxFromJson, null, [{
        key: 'addDropDown',
        value: function addDropDown(data, divId, valueField, textField, onChangeFunction) {
            $('#' + divId).val('');
            data.forEach(function (d) {
                var option = $('<option />').val(d[valueField]).text(d[textField]);
                $("#" + divId).append(option);
            });
            $('#' + divId).on('change', function () {
                onChangeFunction($(this).val());
            });
        }
    }, {
        key: 'addBootstrapDropDown',
        value: function addBootstrapDropDown(data, divId, valueField, textField, onClickFunction) {
            $('#' + divId).children().remove();
            data.forEach(function (d) {
                var a = $('<a />').addClass("dropdown-item").text(d[textField]).click(function () {
                    onClickFunction(d);
                });
                $("#" + divId).append(a);
            });
        }
    }]);

    return addComboBoxFromJson;
}();