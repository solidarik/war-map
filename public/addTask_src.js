class addPersons {
  constructor(idTable, fileUrl) {
    this.idTable = idTable
    this.fileUrl = fileUrl
    this.data = null
  }

  clearTable() {
    //console.log("clearTable");
    var dvTable = $('#' + this.idTable)
    dvTable.html('')
  }

  rowTableClickHandler(thisThis, thisTr) {
    console.log('clicked ' + $(thisTr).attr('id'))
    var id = parseInt($(thisTr).attr('id'))
    $('#Name').html(thisThis.data[id].Name)
    $('#Workman').html('Исполнитель - ' + thisThis.data[id].Workman)
    $('#Status').html('Состояние - ' + thisThis.data[id].Status)
    $('#Date').html('Срок - ' + thisThis.data[id].Date)
    $('#Description').html('Описание задачи - ' + thisThis.data[id].Description)
    $(thisTr).addClass('event-active-row')
    $(thisTr)
      .siblings()
      .removeClass('event-active-row')
  }

  addDataToTable() {
    //console.log("addDataTotable");

    var obj = this.data
    this.clearTable()
    var table = $('#' + this.idTable)
    //table[0].border = "1";
    var columns = Object.keys(obj[0])
    var columnCount = columns.length
    var row = $(table[0].insertRow(-1))
    for (var i = 0; i < columnCount; i++) {
      if (i == 0 || i == 1 || i == 3 || i == 4) {
        var headerCell = $('<th />')
        if (columns[i] == 'Name') {
          headerCell.html('Задача')
        } else if (columns[i] == 'Workman') {
          headerCell.html('Ответственный')
        } else if (columns[i] == 'Date') {
          headerCell.html('Срок')
        } else if (columns[i] == 'Status') {
          headerCell.html('Статус')
        } else {
          headerCell.html('N/A')
        }
        row.append(headerCell)
      }
    }

    for (var i = 0; i < obj.length; i++) {
      row = $(table[0].insertRow(-1))
      row.addClass('hand-cursor')
      row.attr('id', i)
      for (var j = 0; j < columnCount; j++) {
        if (j == 0 || j == 1 || j == 3 || j == 4) {
          var cell = $('<td />')
          cell.html(obj[i][columns[j]])
          row.append(cell)
        }
      }
    }

    var thisThis = this

    document.querySelectorAll('#' + this.idTable + ' tr').forEach(e =>
      e.addEventListener('click', function() {
        thisThis.rowTableClickHandler(thisThis, this)
      })
    )

    $('#persons-table tr:eq(0) td:first-child span').click()
    $('#0').trigger('click')
  }

  fillTable() {
    //console.log("fillTable");

    if (this.data == null) {
      var thisThis = this

      console.time('load persons')
      d3.json(this.fileUrl, function(error, persons) {
        console.timeEnd('load persons')
        if (error) console.log(error)

        thisThis.data = persons
        thisThis.addDataToTable()
      })
    } else {
      this.addDataToTable()
    }
  }
}
