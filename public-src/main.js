import MapControl from './mapControl.js'
import LegendControl from './legendControl.js'
import ClientProtocol from './clientProtocol.js'
import InfoControl from './infoControl.js'

import $ from 'jquery'
window.app = {}

function fixMapHeight() {
  console.log('fixMapHeight')
  var mapHeight = $(window).height() - 1
  var navbar = $("nav[data-role='navbar']:visible:visible")
  var mapDiv = $("div[data-role='map']:visible:visible")
  if (navbar.outerHeight()) mapHeight = mapHeight - navbar.outerHeight()

  mapDiv.height(mapHeight)
  if (window.map && window.map.fixMapHeight) window.map.fixMapHeight()
}

function changeWindowSize() {
  fixMapHeight()
}

window.onresize = fixMapHeight //changeWindowSize

function startApp() {
  const protocol = ClientProtocol.create()
  const mapControl = MapControl.create()
  const legendControl = LegendControl.create()
  const infoControl = InfoControl.create()

  protocol.subscribe('setCurrentYear', (year) => {
    mapControl.setCurrentYearFromServer(year)
  })

  protocol.subscribe('refreshInfo', (info) => {
    //сначала данные проходят через одноименный фильтр контрола легенды
    legendControl.refreshInfo.call(legendControl, info)
  })

  legendControl.subscribe('refreshInfo', (info) => {
    //...и потом поступают в контрол карты
    mapControl.refreshInfo.call(mapControl, info)
  })

  legendControl.subscribe('legendClick', () => {
    mapControl.hidePopup()
    infoControl.hide()
  })

  mapControl.subscribe('changeYear', (year) => {
    protocol.getDataByYear(year)
    infoControl.hide()
  })

  infoControl.subscribe('hide', () => {
    mapControl.returnNormalMode()
    mapControl.hidePulse()
  })

  mapControl.subscribe('selectFeatures', (items) => {
    infoControl.updateItems(items)
  })

  mapControl.subscribe('showAdditionalInfo', () => {
    legendControl.switchOff()
  })

  mapControl.subscribe('returnNormalMode', () => {
    legendControl.switchOn()
  })

  $(
    document.getElementsByClassName(
      'ol-attribution ol-unselectable ol-control ol-collapsed'
    )
  ).remove()

  changeWindowSize()
}

export { startApp }
