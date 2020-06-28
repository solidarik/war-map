import * as olStyle from 'ol/style'

class SuperFeature {
  static getKind() {
    return undefined
  }

  static getCaptionInfo(info) {
    return 'Суперкласс'
  }

  static getIcon() {
    const icon = 'images/undefined_icon.png'
    //const icon = 'data:image/svg+xml;utf8,'
    // '<svg width="24" height="24" version="1.1" xmlns="http://www.w3.org/2000/svg">' +
    // '<path d="M19.74,7.68l1-1L19.29,5.29l-1,1a10,10,0,1,0,1.42,1.42ZM12,22a8,8,0,1,1,8-8A8,8,0,0,1,12,22Z"/>' +
    // '<rect x="7" y="1" width="10" height="2"/><polygon points="13 14 13 8 11 8 11 16 18 16 18 14 13 14"/>' +
    // '</svg>'
    return icon
  }

  static getStyleFeature(feature, zoom) {
    const style = new olStyle.Style({
      image: new olStyle.Icon({
        // anchor: [0, 0],
        imgSize: [32, 32],
        src: feature.get('info').icon,
        //color: '#ff0000',
        // fill: new olStyle.Fill({ color: 'rgba(153,51,255,1)' }),
        scale: 1,
        radius: 7,
        opacity: 1,
      }),
    })
    return [style]
  }

  static getPopupInfo(feature) {
    return {
      icon: feature.get('info').icon,
      date: now(),
      caption: 'Not implemented',
    }
  }

  static getHtmlInfo(feature) {
    return 'Not implemented'
  }
}

module.exports = SuperFeature
