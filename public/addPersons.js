"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var addPersons = function () {
    function addPersons(idTable, fileUrl) {
        _classCallCheck(this, addPersons);

        this.idTable = idTable;
        this.fileUrl = fileUrl;
    }

    _createClass(addPersons, [{
        key: "clearTable",
        value: function clearTable() {
            console.log("clearTable");
            var dvTable = $("#" + this.idTable);
            dvTable.html("");
        }
    }, {
        key: "rowTableClickHandler",
        value: function rowTableClickHandler() {
            $(this).addClass("event-active-row");
            $(this).siblings().removeClass("event-active-row");
            console.log("clicked");
        }
    }, {
        key: "fillTable",
        value: function fillTable() {
            console.log("fillTable");

            var thisThis = this;

            console.time("load persons");
            d3.json(this.fileUrl, function (error, persons) {
                console.timeEnd("load persons");
                if (error) console.log(error);

                var obj = persons;
                thisThis.clearTable();
                var table = $("#" + thisThis.idTable);
                //table[0].border = "1";
                var columns = Object.keys(obj[0]);
                var columnCount = columns.length;
                var row = $(table[0].insertRow(-1));
                for (var i = 0; i < columnCount; i++) {
                    if (i == 0 || i == 1 || i == 2 || i == 5) {
                        var headerCell = $("<th />");
                        headerCell.html([columns[i]]);
                        row.append(headerCell);
                    }
                }

                for (var i = 0; i < obj.length; i++) {
                    row = $(table[0].insertRow(-1));
                    row.addClass("hand-cursor");
                    for (var j = 0; j < columnCount; j++) {
                        if (j == 0 || j == 1 || j == 2 || j == 5) {
                            var cell = $("<td />");
                            cell.html(obj[i][columns[j]]);
                            row.append(cell);
                        }
                    }
                }

                document.querySelectorAll("#" + thisThis.idTable + " tr").forEach(function (e) {
                    return e.addEventListener("click", thisThis.rowTableClickHandler);
                });

                //table.append(table);
            });
        }
    }]);

    return addPersons;
}();