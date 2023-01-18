import ClientProtocol from '../public-src/clientProtocol.js'
import EventEmitter from '../public-src/eventEmitter.js'

export default class addPersons extends EventEmitter {

  constructor(idTable, data) {
    super() //first must
    this.idTable = idTable
    this.data = data

    this.protocol = ClientProtocol.create()
    this.protocol.subscribe('onGetPersonItem', (item) => this.showItem(item))

    window.setActiveElement = (elem, b) => {
      const c = 'hover-on-text'
      if (!elem) return
      b
        ? elem.parentElement.classList.add(c)
        : elem.parentElement.classList.remove(c)
    }
  }

  clearTable() {
    //console.log("clearTable");
    var dvTable = $('#' + this.idTable)
    dvTable.html('')
  }

  rowTableClickHandler(thisThis, thisTr) {
    var _id = $(thisTr).attr('id');
    if (!_id) return

    var cur = thisThis.data[_id];
    window.currentTr = thisTr
    this.protocol.getPersonItem(cur._id)
  }

  getLinkUrls(item) {
    if (!item.linkUrls.length) return ''
    let res = ' Доп. информация по внешним сслыкам: '
    for (let urlId = 0; urlId < item.linkUrls.length; urlId++) {
      res += " <a target='_blank' rel='noopener noreferrer' href='" +
        item.linkUrls[urlId] + "'>[" + (urlId + 1) + ']</a>'
    }
    return res
  }

  showItem(item) {
    const cur = item
    $('#FIO').html(cur.surname + ' ' + cur.name + ' ' + cur.middlename)
    $('#LifeTime').html(
      'Дата и место рождения - ' +
        cur.dateBirthStr + ' ' + cur.placeBirth
    )
    $('#AchievementPlace').html(
      'Место активности - ' + cur.placeAchievement
    )
    $('#DeathTime').html(
      'Дата и место смерти - ' +
        cur.dateDeathStr + ' ' + cur.placeDeath
    )
    $('#imgPerson').src = cur.photoFullUrl
    $('#imgPerson').attr('src', cur.photoFullUrl)
    $('#description').html(
      cur.description +
      (!cur.srcUrl ? '' :
        " <a target='_blank' rel='noopener noreferrer' href='" +
        cur.srcUrl +
        "'>" + 'Подробнее...</a>')
    )
    $('#fullDescription').html(cur.fullDescription + this.getLinkUrls(cur))
    $(window.thisTr).addClass('event-active-row')
    $(window.thisTr).siblings().removeClass('event-active-row')
  }

  addDataToTable(currPerson) {
    var obj = this.data

    this.clearTable()
    var table = $('#' + this.idTable)
    //table[0].border = "1";

    var row = $(table[0].insertRow(-1))


    const applyColumns = {
      'surname': 'Фамилия',
      'name': 'Имя',
      'middlename': 'Отчество',
      'activity': 'Сфера деятельности'
    }
    const applyColumnNames = Object.keys(applyColumns)
    for (var i = 0; i < applyColumnNames.length; i++) {
      const columnName = applyColumnNames[i]
      const columnCaption = applyColumns[columnName]
      let headerCell = $('<th />')
      headerCell.html(columnCaption)
      row.append(headerCell)
    }

    for (var i = 0; i < obj.length; i++) {
      row = $(table[0].insertRow(-1))
      row.addClass('hand-cursor')
      row.attr('id', i)
      for (var j = 0; j < applyColumnNames.length; j++) {
        const columnName = applyColumnNames[j]
        let columnValue = columnName == 'place' ? obj[i]['birth']['place'] : obj[i][columnName]
        let cell = $(`<td
          onmouseenter="window.setActiveElement(this, true);"
          onmouseleave="window.setActiveElement(this, false);">
        />`)
        if (columnName == 'birth') {
          columnValue = DateHelper.ymdToStr(columnValue)
        }
        cell.html(columnValue)
        row.append(cell)
      }
      // console.log(currPerson);
      if (currPerson != undefined && currPerson.pageUrl == obj[i]['pageUrl']) {
        curId = i;
      }
    }

    var getCellValue = function (tr, idx) {
      return tr.children[idx].innerText || tr.children[idx].textContent
    }

    var comparer = function (idx, asc) {
      return function (a, b) {
        return (function (v1, v2) {
          return v1 !== '' && v2 !== '' && !isNaN(v1) && !isNaN(v2)
            ? v1 - v2
            : v1.toString().localeCompare(v2)
        })(getCellValue(asc ? a : b, idx), getCellValue(asc ? b : a, idx))
      }
    }

    // do the work...
    Array.prototype.slice
      .call(document.querySelectorAll('th'))
      .forEach(function (th) {
        th.addEventListener('click', function () {
          var table = th.parentNode
          while (table.tagName.toUpperCase() != 'TABLE')
            table = table.parentNode
          Array.prototype.slice
            .call(table.querySelectorAll('tr:nth-child(n+2)'))
            .sort(
              comparer(
                Array.prototype.slice.call(th.parentNode.children).indexOf(th),
                (this.asc = !this.asc)
              )
            )
            .forEach(function (tr) {
              table.appendChild(tr)
            })
        })
      })

    var thisThis = this

    document.querySelectorAll('#' + this.idTable + ' tr').forEach((e) =>
      e.addEventListener('click', function () {
        thisThis.rowTableClickHandler(thisThis, this)
      })
    )

    if (currPerson != undefined) {
      var str = '#' + curId;
      $(str).click();
    } else {
      $('#0').click();
    }
  }

  fillTable(currPerson) {
    //console.log("fillTable");

    if (this.data == null) {
      console.log('data empty')
    } else {
      this.addDataToTable(currPerson)
    }
  }
}
