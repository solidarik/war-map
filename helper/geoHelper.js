import StrHelper from './strHelper.js'

export default class GeoHelper {
  static fromLonLat(input) {
    if (!input || input.length !== 2) {
      return undefined
    }

    const RADIUS = 6378137
    const HALF_SIZE = Math.PI * RADIUS
    const halfSize = HALF_SIZE
    const length = input.length
    const dimension = 2
    let output = []
    for (let i = 0; i < length; i += dimension) {
      output[i] = (halfSize * input[i]) / 180
      let y = RADIUS * Math.log(Math.tan((Math.PI * (input[i + 1] + 90)) / 360))

      if (y > halfSize) {
        y = halfSize
      } else if (y < -halfSize) {
        y = -halfSize
      }
      output[i + 1] = y
    }
    return output
  }

  static coordsToBaseFormat(coords) {
    if (coords.lon == undefined || coords.lat == undefined) {
      return undefined
    }
    if (coords.lon == 0 && coords.lat == 0) {
      return undefined
    }
    return this.fromLonLat([coords.lon, coords.lat])
  }

  static getCoordsFromHumanCoords(input) {
    //ширина возвращается первым аргументом lat
    //долгота возвращается вторым аргументом lon

    //сначала проверяем на координаты типа x_y
    const arr = input.split('_')
    if (arr.length == 2) {
      return arr.reverse().map(item => Number(item))
    }

    let output = input.replace(/[°]/g, '.')
    output = output.replace(/[′]/g, '')
    output = output.replace(/[″]/g, '')

    let numbers = StrHelper.getAllNumbers(output)
    if (output.includes('ю. ш.') || output.includes('S')) {
      numbers[0] = -numbers[0]
    }
    if (output.includes('з. д.') || output.includes('W')) {
      numbers[1] = -numbers[1]
    }

    return [parseFloat(numbers[0]), parseFloat(numbers[1])].reverse()
  }

  static getCenterCoord(ft) {
    let geom = ft.getGeometry()
    switch (geom.getType()) {
      case 'Point':
        return geom.getCoordinates()
        break
      case 'LineString':
        return this.getMedianXY(geom.getCoordinates())
        break
      case 'Polygon':
        return this.getMedianXY(geom.getCoordinates()[0])
        break
    }
    return kremlinLocation
  }

  static getMedianXY(coords) {
    var valuesX = []
    var valuesY = []
    coords.forEach((coord) => {
      valuesX.push(coord[0])
      valuesY.push(coord[1])
    })
    return [this.getMedian(valuesX), this.getMedian(valuesY)]
  }

  static getMedian(values) {
    values.sort((a, b) => a - b)

    var half = Math.floor(values.length / 2)

    if (values.length % 2) return values[half]
    else return (values[half - 1] + values[half]) / 2.0
  }
}
