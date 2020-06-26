import { EventEmitter } from './eventEmitter'

export class InfoControl extends EventEmitter {
  constructor() {
    super() //first must

    window.infoControl = this
  }

  updateItems(items) {
    console.log(`update items: ${JSON.stringify(items)}`)
  }

  static create() {
    return new InfoControl()
  }
}

//https://codesandbox.io/s/rlp1j1183n?file=/src/index.js:240-2385
