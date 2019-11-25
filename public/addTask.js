"use strict";

function _instanceof(left, right) { if (right != null && typeof Symbol !== "undefined" && right[Symbol.hasInstance]) { return !!right[Symbol.hasInstance](left); } else { return left instanceof right; } }

function _classCallCheck(instance, Constructor) { if (!_instanceof(instance, Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var addPersons =
/*#__PURE__*/
function () {
  function addPersons(idTable, fileUrl) {
    _classCallCheck(this, addPersons);

    this.idTable = idTable;
    this.fileUrl = fileUrl;
    this.data = null;
  }

  _createClass(addPersons, [{
    key: "clearTable",
    value: function clearTable() {
      //console.log("clearTable");
      var dvTable = $("#" + this.idTable);
      dvTable.html("");
    }
  }, {
    key: "rowTableClickHandler",
    value: function rowTableClickHandler(thisThis, thisTr) {
      console.log("clicked " + $(thisTr).attr('id'));
      var id = parseInt($(thisTr).attr("id"));
      $('#Name').html(thisThis.data[id].Name);
      $('#Workman').html("Исполнитель - " + thisThis.data[id].Workman);
      $('#Status').html("Состояние - " + thisThis.data[id].Status);
      $('#Date').html("Срок - " + thisThis.data[id].Date);
      $('#Description').html("Описание задачи - " + thisThis.data[id].Description);
      ;
      $(thisTr).addClass("event-active-row");
      $(thisTr).siblings().removeClass("event-active-row");
    }
  }, {
    key: "addDataToTable",
    value: function addDataToTable() {
      //console.log("addDataTotable");
      var obj = this.data;
      this.clearTable();
      var table = $("#" + this.idTable); //table[0].border = "1";

      var columns = Object.keys(obj[0]);
      var columnCount = columns.length;
      var row = $(table[0].insertRow(-1));

      for (var i = 0; i < columnCount; i++) {
        if (i == 0 || i == 1 || i == 3 || i == 4) {
          var headerCell = $("<th />");

          if (columns[i] == 'Name') {
            headerCell.html('Задача');
          } else if (columns[i] == 'Workman') {
            headerCell.html('Ответсвенный');
          } else if (columns[i] == 'Date') {
            headerCell.html('Срок');
          } else if (columns[i] == 'Status') {
            headerCell.html('Статус');
          } else {
            headerCell.html('N/A');
          }

          row.append(headerCell);
        }
      }

      for (var i = 0; i < obj.length; i++) {
        row = $(table[0].insertRow(-1));
        row.addClass("hand-cursor");
        row.attr("id", i);

        for (var j = 0; j < columnCount; j++) {
          if (j == 0 || j == 1 || j == 3 || j == 4) {
            var cell = $("<td />");
            cell.html(obj[i][columns[j]]);
            row.append(cell);
          }
        }
      }

      var thisThis = this;
      document.querySelectorAll("#" + this.idTable + " tr").forEach(function (e) {
        return e.addEventListener("click", function () {
          thisThis.rowTableClickHandler(thisThis, this);
        });
      });
      $("#persons-table tr:eq(0) td:first-child span").click();
      $('#0').trigger('click');
    }
  }, {
    key: "fillTable",
    value: function fillTable() {
      //console.log("fillTable");
      if (this.data == null) {
        var thisThis = this;
        console.time("load persons");
        d3.json(this.fileUrl, function (error, persons) {
          console.timeEnd("load persons");
          if (error) console.log(error);
          thisThis.data = persons;
          thisThis.addDataToTable();
        });
      } else {
        this.addDataToTable();
      }
    }
  }]);

  return addPersons;
}();