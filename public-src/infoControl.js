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

    window.setActiveElement = (elem, b) => {
      const c = 'hover-on-text'
      if (!elem) return
      b
        ? elem.parentElement.classList.add(c)
        : elem.parentElement.classList.remove(c)
    }

    window.showActiveItem = (id) => {
      const items = window.infoControl.items
      console.log(`showActiveItem: ${id}`)
      for (let i = 0; i < items.length; i++) {
        if (id === items[i].get('info')._id) {
          window.infoControl.showItemInfo(items[i])
          break
        }
      }
    }
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
    this.items = items
    ClassHelper.removeClass(window.infoControl.contentDiv, 'events-info-hide')
    ClassHelper.addClass(window.infoControl.contentDiv, 'events-info-show')
    let html = `<div class='panel-info'>
      <h1>Выберите событие</h1>
      <table class='table table-sm table-borderless'>`
    items.forEach((feature) => {
      const info = feature.get('info')
      html += `<tr>
        <td
          onclick="window.showActiveItem('${info._id}')"
          onmouseenter="window.setActiveElement(this, true);"
          onmouseleave="window.setActiveElement(this, false);">
          <img src="${info.icon}" alt="${info.oneLine}">
        </td>
        <td
          onclick="window.showActiveItem('${info._id}')"
          onmouseenter="window.setActiveElement(this, true);"
          onmouseleave="window.setActiveElement(this, false);">
          <span>${info.oneLine}</span>
        </td>
      </tr>`
    })
    html += `</table></div>`
    this.contentDiv.innerHTML = html
    console.log(`show item list: ${items.length}`)
  }

  updateItems(items) {
    if (1 == items.length) {
      this.showItemInfo(items[0])
    } else {
      this.showItemList(items)
    }
    this.contentDiv.scrollTop = 0
  }

  static create() {
    return new InfoControl()
  }
}

//https://codesandbox.io/s/rlp1j1183n?file=/src/index.js:240-2385
