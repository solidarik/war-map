"use strict";

function _instanceof(left, right) { if (right != null && typeof Symbol !== "undefined" && right[Symbol.hasInstance]) { return !!right[Symbol.hasInstance](left); } else { return left instanceof right; } }

function _classCallCheck(instance, Constructor) { if (!_instanceof(instance, Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var addHolyPersons = /*#__PURE__*/function () {
  function addHolyPersons(idTable, fileUrl) {
    _classCallCheck(this, addHolyPersons);

    this.idTable = idTable;
    this.fileUrl = fileUrl;
    this.data = null;
  }

  _createClass(addHolyPersons, [{
    key: "clearTable",
    value: function clearTable() {
      //console.log("clearTable");
      var dvTable = $('#' + this.idTable);
      dvTable.html('');
    }
  }, {
    key: "rowTableClickHandler",
    value: function rowTableClickHandler(thisThis, thisTr) {
      //console.log("clicked " + $(thisTr).attr('id'));
      var id = parseInt($(thisTr).attr('id'));
      $('#FIO').html(thisThis.data[id].Surname + ' ' + thisThis.data[id].Name + ' ' + thisThis.data[id].MiddleName);
      $('#LifeTime').html('<b>Дата и место рождения</b> - ' + thisThis.data[id].DateBirth + ' ' + thisThis.data[id].PlaceBirth);
      $('#AchievementPlace').html('<b>Место и дата подвига</b> - ' + thisThis.data[id].PlaceAchievement + '-' + thisThis.data[id].DateAchievement + ';' + thisThis.data[id].PlaceAchievement1 + '-' + thisThis.data[id].DateAchievement1 + ';' + thisThis.data[id].PlaceAchievement2 + thisThis.data[id].DateAchievement2);
      $('#DeathTime').html('<b>Дата смерти, захоронение</b> - ' + thisThis.data[id].DateDeath + ' ' + thisThis.data[id].PlaceDeath);
      $('#DateCanonization').html('<b>Дата канонизации</b> - ' + thisThis.data[id].DateCanonization);
      $('#HolinessStatus').html('<b>Статус святости</b> - ' + thisThis.data[id].HolinessStatus);
      $('#DateVeneration').html('<b>Дата почитания</b> - ' + thisThis.data[id].DateVeneration);
      $('#FieldActivity').html('<b>Сфера деятельности</b> - ' + thisThis.data[id].FieldActivity);
      $('#imgPerson').src = thisThis.data[id].PhotoUrl;
      $('#imgPerson').attr('src', thisThis.data[id].PhotoUrl); // $('#description').html(
      //   thisThis.data[id].Description +
      //     " <a target='_blank' rel='noopener noreferrer' href='" +
      //     thisThis.data[id].Source +
      //     "'>" +
      //     'Подробнее...</a>'
      // )

      $('#fullDescription').html(thisThis.data[id].Description + " <a target='_blank' rel='noopener noreferrer' href='" + thisThis.data[id].Source + "'>" + 'Подробнее...</a>');
      $(thisTr).addClass('event-active-row');
      $(thisTr).siblings().removeClass('event-active-row');
    }
  }, {
    key: "addDataToTable",
    value: function addDataToTable() {
      //console.log("addDataTotable");
      var obj = this.data;
      this.clearTable();
      var table = $('#' + this.idTable); //table[0].border = "1";

      var columns = Object.keys(obj[0]);
      var columnCount = columns.length;
      var row = $(table[0].insertRow(-1));

      for (var i = 0; i < columnCount; i++) {
        if (i == 0 || i == 1 || i == 3 || i == 4 || i == 5) {
          var headerCell = $('<th />');

          if (columns[i] == 'Surname') {
            headerCell.html('Фамилия');
          } else if (columns[i] == 'Name') {
            headerCell.html('Имя');
          } else if (columns[i] == 'DateBirth') {
            headerCell.html('Дата рождения');
          } else if (columns[i] == 'PlaceBirth') {
            headerCell.html('Место рождения');
          } else if (columns[i] == 'NameInMonasticism') {
            headerCell.html('Имя в монашестве');
          } else {
            headerCell.html('N/A');
          }

          row.append(headerCell);
        }
      }

      for (var i = 0; i < obj.length; i++) {
        row = $(table[0].insertRow(-1));
        row.addClass('hand-cursor');
        row.attr('id', i);

        for (var j = 0; j < columnCount; j++) {
          if (j == 0 || j == 1 || j == 3 || j == 4 || j == 5) {
            var cell = $('<td />');
            cell.html(obj[i][columns[j]]);
            row.append(cell);
          }
        }
      }

      var getCellValue = function getCellValue(tr, idx) {
        return tr.children[idx].innerText || tr.children[idx].textContent;
      };

      var comparer = function comparer(idx, asc) {
        return function (a, b) {
          return function (v1, v2) {
            return v1 !== '' && v2 !== '' && !isNaN(v1) && !isNaN(v2) ? v1 - v2 : v1.toString().localeCompare(v2);
          }(getCellValue(asc ? a : b, idx), getCellValue(asc ? b : a, idx));
        };
      }; // do the work...


      Array.prototype.slice.call(document.querySelectorAll('th')).forEach(function (th) {
        th.addEventListener('click', function () {
          var table = th.parentNode;

          while (table.tagName.toUpperCase() != 'TABLE') {
            table = table.parentNode;
          }

          Array.prototype.slice.call(table.querySelectorAll('tr:nth-child(n+2)')).sort(comparer(Array.prototype.slice.call(th.parentNode.children).indexOf(th), this.asc = !this.asc)).forEach(function (tr) {
            table.appendChild(tr);
          });
        });
      });
      var thisThis = this;
      document.querySelectorAll('#' + this.idTable + ' tr').forEach(function (e) {
        return e.addEventListener('click', function () {
          thisThis.rowTableClickHandler(thisThis, this);
        });
      });
      $('#persons-table tr:eq(0) td:first-child span').click();
      $('#0').trigger('click');
    }
  }, {
    key: "fillTable",
    value: function fillTable() {
      //console.log("fillTable");
      if (this.data == null) {
        var thisThis = this;
        console.time('load persons');
        d3.json(this.fileUrl, function (error, persons) {
          console.timeEnd('load persons');
          if (error) console.log(error);
          thisThis.data = persons;
          thisThis.addDataToTable();
        });
      } else {
        this.addDataToTable();
      }
    }
  }]);

  return addHolyPersons;
}();