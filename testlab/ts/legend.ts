interface ILegendItem {
  imgUrl: string
  caption: string
}

class LegendItem implements ILegendItem {
  constructor(public imgUrl: string, public caption: string) {}
  public toString(): string {
    return this.imgUrl.bold()
  }
}

class Legend {
  private items: Array<ILegendItem> = new Array()
  private addItem(imgUrl: string, caption: string) {
    this.items.push(new LegendItem(imgUrl, caption))
  }
  constructor() {
    this.addItem('source.jpg', 'First Item')
    this.addItem('second.jpg', 'Second')
  }
  public toString(): string {
    let res = ''
    this.items.forEach(item => {
      res += '' + item
    })
    return res
  }
}

const legend = new Legend()
document.body.innerHTML = legend.toString()
