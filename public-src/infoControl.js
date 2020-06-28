import { EventEmitter } from './eventEmitter'
import ClassHelper from '../helper/classHelper'

export class InfoControl extends EventEmitter {
  constructor() {
    super() //first must

    this.contentDiv = document.getElementById('events-info-content')
    this.closeButton = document.getElementById('events-info-closeButton')
    this.imgDiv = document.getElementById('event-image-div')

    this.closeButton.addEventListener('click', () => {
      window.infoControl.hide.call(window.infoControl)
    })

    window.infoControl = this
  }

  hide() {
    ClassHelper.removeClass(window.infoControl.contentDiv, 'events-info-show')
    ClassHelper.addClass(window.infoControl.contentDiv, 'events-info-hide')
    this.emit('hide', undefined)
  }

  showItemInfo(item) {
    ClassHelper.removeClass(window.infoControl.contentDiv, 'events-info-hide')
    ClassHelper.addClass(window.infoControl.contentDiv, 'events-info-show')
    const classFeature = item.get('classFeature')
    const info = item.get('info')
    this.contentDiv.innerHTML = classFeature.getHtmlInfo(info)
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
