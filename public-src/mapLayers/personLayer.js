class PersonLayer extends SuperLayer {
  constructor() {
    this.kind = undefined
    this.icon = 'public/undefined.icon'
    this.features = []
    // this.icon = 'data:image/svg+xml;utf8,'
    // '<svg width="24" height="24" version="1.1" xmlns="http://www.w3.org/2000/svg">' +
    // '<path d="M19.74,7.68l1-1L19.29,5.29l-1,1a10,10,0,1,0,1.42,1.42ZM12,22a8,8,0,1,1,8-8A8,8,0,0,1,12,22Z"/>' +
    // '<rect x="7" y="1" width="10" height="2"/><polygon points="13 14 13 8 11 8 11 16 18 16 18 14 13 14"/>' +
    // '</svg>'
  }

  addFeatures(feature) {
    feature.kind = this.kind
    this.features.push(feature)
  }

  getPopupInfo(feature) {
    return 'Not implemented'
  }

  getHtmlInfo(feature) {
    return <div>'Not implemented'</div>
  }

  getInnerLayer(feature) {
    throw 'Not implemented'
  }
}

module.exports = PersonLayer
