class addPersons {

    constructor(idTable, fileUrl) {
        this.idTable = idTable;
        this.fileUrl = fileUrl;
        this.data = null;
    }

    clearTable() {
        //console.log("clearTable");
        var dvTable = $("#" + this.idTable);
        dvTable.html("");
    }

    rowTableClickHandler(thisThis,thisTr) {
        
        //console.log("clicked " + $(thisTr).attr('id'));
        var id = parseInt($(thisTr).attr("id"));
        $('#FIO').html(thisThis.data[id].Surname+" "+thisThis.data[id].Name+" "+thisThis.data[id].MiddleName);
        $('#LifeTime').html("Дата и место рождения - "+thisThis.data[id].DateBirth + " " + thisThis.data[id].PlaceBirth);
        $('#AchievementPlace').html("Место активности - " + thisThis.data[id].PlaceAchievement);
        $('#DeathTime').html("Дата и место смерти - " + thisThis.data[id].DateDeath + " " + thisThis.data[id].PlaceDeath);
        $('#imgPerson').src=thisThis.data[id].PhotoUrl;
        $('#imgPerson').attr('src',thisThis.data[id].PhotoUrl);
        $('#description').html(thisThis.data[id].Description + " <a target='_blank' rel='noopener noreferrer' href='"+thisThis.data[id].Source+"'>"+"Подробнее...</a>");
        $('#fullDescription').html(thisThis.data[id].FullDescription + " <a target='_blank' rel='noopener noreferrer' href='"+thisThis.data[id].Link+"'>"+"Подробнее...</a>");
        $(thisTr).addClass("event-active-row");
        $(thisTr).siblings().removeClass("event-active-row");
    }

    addDataToTable() {
        //console.log("addDataTotable");

        var obj = this.data;
        this.clearTable();
        var table = $("#" + this.idTable);
        //table[0].border = "1";
        var columns = Object.keys(obj[0]);
        var columnCount = columns.length;
        var row = $(table[0].insertRow(-1));
        for (var i = 0; i < columnCount; i++) {
            if (i == 1 || i == 2 || i == 3 || i == 6) {
                var headerCell = $("<th />");
                if(columns[i]=='Surname'){
                    headerCell.html('Фамилия');
                }
                else if(columns[i]=='Name') {
                    headerCell.html('Имя');
                }
                else if(columns[i]=='MiddleName') {
                    headerCell.html('Отчество');
                }
                else if(columns[i]=='FieldActivity') {
                    headerCell.html('Сфера деятельности');
                }
                else {
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
                if (j == 1 || j == 2 || j == 3 || j == 6) {
                    var cell = $("<td />");
                    cell.html(obj[i][columns[j]]);
                    row.append(cell);
                }
            }
        }

        var thisThis = this;

        document.querySelectorAll("#" + this.idTable + " tr")
            .forEach(e => e.addEventListener("click", function () {thisThis.rowTableClickHandler(thisThis,this);}));

        $("#persons-table tr:eq(0) td:first-child span").click();    
        $('#0').trigger('click');
    }

    fillTable() {
        //console.log("fillTable");

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