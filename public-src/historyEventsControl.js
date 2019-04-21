import { EventEmitter } from './eventEmitter'

export class HistoryEventsControl extends EventEmitter {
  constructor() {
    super()

    this.listDiv = $('#eventInfo')[0]
    this.imgDiv = $('#event-image-div')[0]
    this.events = []
    this.active_event = ''
    this.active_map = ''

    $(document).ready(() => {
      const c = $('#collapseEventInfo')
      const ch = $('#collapseButton').children()

      c.on('shown.bs.collapse', () => {
        ch.removeClass('mdi-chevron-double-up').addClass(
          'mdi-chevron-double-down'
        )
      })

      c.on('hidden.bs.collapse', () => {
        ch.removeClass('mdi-chevron-double-down').addClass(
          'mdi-chevron-double-up'
        )
      })
    })
  }

  static create() {
    return new HistoryEventsControl()
  }

  getHtmlForEvent(event, is_active) {
    let html =
      '<tr data-href="' +
      event.id +
      '" class="hand-cursor' +
      (is_active ? ' event-active-row' : '') +
      '">'
    html += '<td>' + event.startDate + '</td>'
    html += '<td>' + event.endDate + '</td>'

    let name = event.name

    if (event.kind == 'wmw') {
      name = '<span class="event-name-color">' + event.name + '</span>'
    }
    if (1 < event.maps.length) {
      let delim = '&nbsp'
      for (let i = 0; i < event.maps.length; i++) {
        name +=
          delim +
          '<span class="event-feature-color" data-href="' +
          i +
          '">' +
          (i + 1) +
          '</span>'
      }
    }

    html += '<td>' + name + '</td>'

    const f = value => {
      if (Array.isArray(value)) {
        return value.length > 0 ? value.join(',') : '-'
      } else {
        if (value == undefined) return '-'
        const tryFloat = parseFloat(value)
        return Number.isNaN(tryFloat) ? value : tryFloat.toString()
      }
    }

    html += '<td>' + f(event.enemies) + '</td>'
    html += '<td>' + f(event.allies) + '</td>'
    html += '<td>' + f(event.ally_troops) + '</td>'
    html += '<td>' + f(event.enem_troops) + '</td>'
    html += '<td>' + f(event.winner) + '</td>'

    html += '</tr>'
    return html
  }

  _resizeImage(url, fixWidth, callback) {
    var sourceImage = new Image()

    sourceImage.onload = function() {
      // Create a canvas with the desired dimensions
      var canvas = document.createElement('canvas')

      let imgWidth = this.width
      let aspectRatio = Math.round(imgWidth / fixWidth)

      let imgHeight = this.height
      let fixHeight = Math.round(imgHeight / aspectRatio)

      canvas.width = fixWidth
      canvas.height = fixHeight

      // Scale and draw the source image to the canvas
      let ctx = canvas.getContext('2d')
      ctx.globalAlpha = 0.6
      ctx.drawImage(sourceImage, 0, 0, fixWidth, fixHeight)

      // Convert the canvas to a data URL in PNG format
      if (callback) callback(canvas)
    }

    return (sourceImage.src = url)
  }

  _refreshEventImage(event) {
    this.imgDiv.innerHTML = ''
    if (!event.imgUrl) return

    this._resizeImage(event.imgUrl, 300, canvas => {
      this.imgDiv.appendChild(canvas)
    })
  }

  setActiveEvent(event, map) {
    if (event == this.active_event && event.maps[map] == this.active_map) return

    if (event != this.active_event) {
      //soli disable minimap this._refreshEventImage(event);
    }

    this.active_event = event
    this.active_map = event.maps[map]
    this.emit('activatedEvent', {
      event: this.active_event,
      map: this.active_map
    })
  }

  rowEventClick(tr, isMapEventClick = false) {
    let id = tr.attr('data-href')
    if (!id) return

    tr.addClass('event-active-row')
      .siblings()
      .removeClass('event-active-row')
    let activeEvent = this.events.filter(event => event.id == id)[0]
    if (!isMapEventClick) {
      this.active_map = 0
      $('table tr td span').removeClass('event-feature-active-color')
      if (1 < activeEvent.maps.length) {
        let firstSpan = $(tr[0].childNodes[2]).children('span:first')
        firstSpan.addClass('event-feature-active-color')
      }
    }
    this.setActiveEvent(activeEvent, this.active_map)
  }

  mapEventClick(a) {
    this.active_map = a.attr('data-href')

    $('table tr td span').removeClass('event-feature-active-color')
    a.addClass('event-feature-active-color')
    let tr = a.parent().parent()
    this.rowEventClick(tr, true)
  }

  showEvents(events) {
    this.active_map = 0
    this.listDiv.innerHTML = ''
    this.events = events

    if (!events || 0 == events.length) return

    let html = `
        <table class="table table-sm table-borderless">
        <thead>
            <tr>
                <th scope="col">Начало</th>
                <th scope="col">Окончание</th>
                <th scope="col">Название</th>
                <th scope="col">Участник 1</th>
                <th scope="col">Участник 2</th>
                <th scope="col">Числ-ть 1</th>
                <th scope="col">Числ-ть 2</th>
                <th scope="col">Победитель</th>
            </tr>
        </thead>
        <tbody>
        `

    let once = true
    events.forEach(event => {
      html += this.getHtmlForEvent(event, once)
      once = false
    })

    html += '</tbody></table>'

    this.listDiv.innerHTML = html

    this.emit('refreshedEventList')

    this.setActiveEvent(events[0], this.active_map)
  }
}
