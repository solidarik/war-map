import { MapControl } from './mapControl'
import { LegendControl } from './legendControl'
import { ClientProtocol } from './clientProtocol'
import $ from 'jquery'
window.app = {}

function fixMapHeight() {
  console.log('fixMapHeight')
  var mapHeight = $(window).height() - 1
  var navbar = $("nav[data-role='navbar']:visible:visible")
  var mapDiv = $("div[data-role='map']:visible:visible")
  if (navbar.outerHeight()) mapHeight = mapHeight - navbar.outerHeight()

  mapDiv.height(mapHeight)
  if (window.map) window.map.fixMapHeight()
}

function changeWindowSize() {
  fixMapHeight()
}

window.onresize = fixMapHeight //changeWindowSize

function startApp() {
  const protocol = ClientProtocol.create()
  const mapControl = MapControl.create()
  const legendControl = LegendControl.create()

  protocol.subscribe('setCurrentYear', (year) => {
    console.log(`year from server ${year}`)
    mapControl.setCurrentYearFromServer(year)
  })

  protocol.subscribe('refreshInfo', (info) => {
    //сначала данные проходят через одноименный фильтр контрола легенды
    legendControl.refreshInfo(info)
  })

  legendControl.subscribe('refreshInfo', (info) => {
    //...и потом поступают в контрол карты
    mapControl.refreshInfo(info)
  })

  mapControl.subscribe('changeYear', (year) => {
    protocol.getDataByYear(year)
  })

  window.map = mapControl
  window.legend = legendControl

  $(
    document.getElementsByClassName(
      'ol-attribution ol-unselectable ol-control ol-collapsed'
    )
  ).remove()

  changeWindowSize()
}

export { startApp }
