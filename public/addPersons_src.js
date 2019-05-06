class addPersons {

    constructor(idTable, fileUrl) {
        this.idTable = idTable;
        this.fileUrl = fileUrl;
        this.data = null;
    }

    clearTable() {
        console.log("clearTable");
        var dvTable = $("#" + this.idTable);
        dvTable.html("");
    }

    rowTableClickHandler(thisThis,thisTr) {
        $(thisTr).addClass("event-active-row");
        $(thisTr).siblings().removeClass("event-active-row");
        console.log("clicked " + $(thisTr).attr('id'));
        var id = parseInt($(thisTr).attr("id"));
        $('#FIO').html(thisThis.data[id].Surname+" "+thisThis.data[id].Name+" "+thisThis.data[id].MiddleName);
        $('#LifeTime').html(thisThis.data[id].DateBirth + " - " + thisThis.data[id].DateDeath+"<br>"+thisThis.data[id].PlaceBirth);
        $('#imgPerson').src=thisThis.data[id].PhotoUrl;
        $('#imgPerson').attr('src',thisThis.data[id].PhotoUrl);
        $('#description').html(thisThis.data[id].Description + " <a target='_blank' rel='noopener noreferrer' href='"+thisThis.data[id].Source+"'>"+"Подробнее...</a>");
        
    }

    addDataToTable() {
        console.log("addDataTotable");

        var obj = this.data;
        this.clearTable();
        var table = $("#" + this.idTable);
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
            row.attr("id", i);
            for (var j = 0; j < columnCount; j++) {
                if (j == 0 || j == 1 || j == 2 || j == 5) {
                    var cell = $("<td />");
                    cell.html(obj[i][columns[j]]);
                    row.append(cell);
                }
            }
        }

        var thisThis = this;

        document.querySelectorAll("#" + this.idTable + " tr")
            .forEach(e => e.addEventListener("click", function () {thisThis.rowTableClickHandler(thisThis,this);}));

    }

    fillTable() {
        console.log("fillTable");

        if (this.data == null) {
            var thisThis = this;

            console.time("load persons");
            d3.json(this.fileUrl, function (error, persons) {
                console.timeEnd("load persons");
                if (error) console.log(error);

                thisThis.data = persons;
                thisThis.addDataToTable();

                /*var obj = persons;
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
                    row.id = i;
                    for (var j = 0; j < columnCount; j++) {
                        if (j == 0 || j == 1 || j == 2 || j == 5) {
                            var cell = $("<td />");
                            cell.html(obj[i][columns[j]]);
                            row.append(cell);
                        }
                    }
                }
    
                document.querySelectorAll("#" + thisThis.idTable + " tr")
                    .forEach(e => e.addEventListener("click", thisThis.rowTableClickHandler));
    
                //table.append(table);
                */
            });
        }
        else {
            this.addDataToTable();
        }
    }

}  