import { MapControl } from './mapControl'
import { ClientProtocol } from './clientProtocol'
import { HistoryEventsControl } from './historyEventsControl'
import $ from 'jquery'

window.app = {}
var app = window.app

function fixMapHeight() {
  var mapHeight = $(window).height() - 1
  var navbar = $("nav[data-role='navbar']:visible:visible")
  var mapDiv = $("div[data-role='map']:visible:visible")
  if (navbar.outerHeight()) mapHeight = mapHeight - navbar.outerHeight()

  mapDiv.height(mapHeight)
  if (window.map) window.map.fixMapHeight()
}

function fixMiniMapVisible(isHide) {
  let elem = $('#event-image-div')
  if (isHide) {
    $('#event-image-div')[0].innerHTML = ''
    elem.hide()
    return
  }

  var viewWidth = $(window).width()
  350 < viewWidth ? elem.show() : elem.hide()
}

function changeWindowSize() {
  fixMapHeight()
  //fixMiniMapVisible();
}

window.onresize = fixMapHeight //changeWindowSize

function startApp() {
  let protocol = ClientProtocol.create()

  let mapControl = MapControl.create()
  mapControl.subscribe('changeYear', year => {
    fixMiniMapVisible(true)
    protocol.getHistoryEventsByYear(year)
  })

  let historyEventsControl = HistoryEventsControl.create()

  protocol.subscribe('refreshHistoryEvents', events => {
    console.log('>>>>>> events', events)
    mapControl.setHistoryEvents(events)
    historyEventsControl.showEvents(events)
  })

  protocol.subscribe('refreshAgreements', agreements => {
    mapControl.setAgreements(agreements)
  })

  historyEventsControl.subscribe('refreshedEventList', () => {
    $('table tr').click(function() {
      historyEventsControl.rowEventClick($(this))
      return false
    })

    $('table tr td span').click(function() {
      historyEventsControl.mapEventClick($(this))
      return false
    })
  })

  historyEventsControl.subscribe('activatedEvent', data => {
    mapControl.setCurrentEventMap(data.map)
    fixMiniMapVisible()
  })

  window.map = mapControl

  // var something = document.getElementById('content');
  // something.style.cursor = 'pointer';

  $(
    document.getElementsByClassName(
      'ol-attribution ol-unselectable ol-control ol-collapsed'
    )
  ).remove()

  changeWindowSize()
}

export { startApp }
