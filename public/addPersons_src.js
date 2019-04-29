class addPersons {

    constructor(idTable, fileUrl) {
        this.idTable = idTable;
        this.fileUrl = fileUrl;
    }

    clearTable() {
        console.log("clearTable");
        var dvTable = $("#" + this.idTable);
        dvTable.html("");
    }

    rowTableClickHandler() {
        $(this).addClass("event-active-row");
        $(this).siblings().removeClass("event-active-row"); 
        console.log("clicked")
    }
    

    fillTable() {
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

            document.querySelectorAll("#" + thisThis.idTable+" tr")
                .forEach(e => e.addEventListener("click", thisThis.rowTableClickHandler));

            //table.append(table);
        });
    }

}  