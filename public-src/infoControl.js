import { EventEmitter } from './eventEmitter'

export class InfoControl extends EventEmitter {
  constructor() {
    super() //first must

    this.listDiv = $('#events-info-content')[0]
    this.imgDiv = $('#event-image-div')[0]

    window.infoControl = this
  }

  showItemInfo(item) {
    const classFeature = item.get('classFeature')
    console.log(`show item info, classFeature: ${classFeature}`)
    this.listDiv.innerHTML = classFeature.getHtmlInfo()
  }

  showItemList(items) {
    console.log(`show item list: ${items.length}`)
  }

  updateItems(items) {
    if (1 == items.length) {
      this.showItemInfo(items[0])
    } else {
      this.showItemList(items)
    }
  }

  static create() {
    return new InfoControl()
  }
}

//https://codesandbox.io/s/rlp1j1183n?file=/src/index.js:240-2385
