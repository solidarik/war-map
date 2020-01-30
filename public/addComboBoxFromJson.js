"use strict";

function _instanceof(left, right) { if (right != null && typeof Symbol !== "undefined" && right[Symbol.hasInstance]) { return !!right[Symbol.hasInstance](left); } else { return left instanceof right; } }

function _classCallCheck(instance, Constructor) { if (!_instanceof(instance, Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var addComboBoxFromJson =
/*#__PURE__*/
function () {
  function addComboBoxFromJson() {
    _classCallCheck(this, addComboBoxFromJson);
  }

  _createClass(addComboBoxFromJson, null, [{
    key: "addDropDown",
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
    key: "addBootstrapDropDown",
    value: function addBootstrapDropDown(data, divId, valueField, textField, onClickFunction) {
      $('#' + divId).children().remove();
      data.forEach(function (d) {
        var a = $('<a />').addClass("dropdown-item").text(d[textField]).click(function () {
          onClickFunction(d);
        });
        $("#" + divId).append(a);
      });
    }
  }, {
    key: "addBootstrapDropDownSubMenu",
    value: function addBootstrapDropDownSubMenu(data, divId, valueField, textField, onClickFunction, groupField) {
      $('#' + divId).children().remove();
      var group = '';
      var numberGroup = 1;
      var groupID;
      var divSubmenu;
      data.forEach(function (d) {
        //for(let d in data) {//for(var d = 0; d < json.length; d++) {
        if (group != d[groupField]) {
          group = d[groupField];
          groupID = "subMenu" + numberGroup.toString();
          numberGroup++;

          var _a = $('<a />').addClass("dropdown-item submenus").text(d[groupField]).attr('href','#');

          $("#" + divId).append(_a);
          divSubmenu = $('<div />').addClass("dropdown-menu submenus").attr("id", groupID);
          $("#" + divId).append(divSubmenu);
        }

        var a = $('<a />').addClass("dropdown-item").text(d[textField]).click(function () {
          onClickFunction(d);
        });
        $("#" + groupID).append(a);
      });
    }
  }]);

  return addComboBoxFromJson;
}();