import io from 'socket.io-client'
import { EventEmitter } from './eventEmitter'
import { CookieHelper } from './cookieHelper'

export class ClientProtocol extends EventEmitter {
  constructor() {
    super()
    let socket = io()

    this.lang = 'rus'
    this.dict = new Map() //key - hash (tobject), value {объект}

    socket.emit('clGetDictEngRus', '', msg => {
      let data = JSON.parse(msg)
      data.res.forEach(item => {
        let obj = { eng: item.eng, rus: item.rus }
        this.dict.set(item.id, obj)
      })
    })

    socket.emit('clGetCurrentYear', '', msg => {
      const data = JSON.parse(msg)
      const serverYear = data.year
      const cookieYear = CookieHelper.getCookie('year')

      this.emit(
        'setCurrentYear',
        serverYear ? serverYear : cookieYear ? cookieYear : '1945'
      )
    })

    socket.on('error', message => {
      console.error(message)
    })

    socket.on('logout', data => {
      socket.disconnect()
      window.location.reload()
    })

    this.socket = socket
  }

  _getStrDateFromEvent(inputDate) {
    let date = new Date(inputDate)
    return (
      ('0' + date.getDate()).slice(-2) +
      '.' +
      ('0' + (date.getMonth() + 1)).slice(-2) +
      '.' +
      date.getFullYear()
    )
  }

  _getDictName(id) {
    if (!this.dict.has(id)) return
    let obj = this.dict.get(id)
    if (!obj) return
    return obj[this.lang]
  }

  getSocket() {
    return this.socket
  }

  setCurrentLanguage(lang) {
    this.lang = lang
  }

  getHistoryEventsByYear(year) {
    if (undefined === year) {
      return
    }

    CookieHelper.setCookie('year', year)

    this.socket.emit('clQueryEvents', JSON.stringify({ year: year }), msg => {
      let data = JSON.parse(msg)
      data.events.sort((a, b) => {})
      let events = data.events.map(event => {
        return {
          ...event,
          id: event._id,
          startDate: this._getStrDateFromEvent(event.startDate),
          endDate: this._getStrDateFromEvent(event.endDate),
          maps: event.maps,
          name: this._getDictName(event._name)
        }
      })

      let agreements = data.agreements.map(agreement => {
        return {
          id: agreement._id,
          kind: agreement.kind,
          placeCoords: agreement.placeCoords,
          startDate: this._getStrDateFromEvent(agreement.startDate),
          endDate: this._getStrDateFromEvent(agreement.endDate),
          player1: agreement.player1,
          player2: agreement.player2,
          results: agreement.results,
          imgUrl: agreement.imgUrl,
          source: agreement.source
        }
      })

      this.emit('refreshHistoryEvents', events)
      this.emit('refreshAgreements', agreements)
    })
  }

  static create() {
    return new ClientProtocol()
  }
}
