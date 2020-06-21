import http from 'http'
import fs from 'fs'
import Shell from 'shelljs'

interface ISourceDest {
  url: string
  fileName: string
}

interface ISaveOuterData {
  rootDir: string
}

interface IXYZ {
  readonly x: number
  readonly y: number
  readonly z: number
}

export default class SaveOuterData implements ISaveOuterData {
  rootDir: string

  constructor(rootDir: string) {
    this.rootDir = rootDir
    this.createDir(rootDir)
  }

  private createDir(dir: string): void {
    Shell.mkdir('-p', dir)
  }

  private getRandom(start: number, end: number): number {
    return Math.floor(Math.random() * end) + start
  }

  private getYUrl(xyz: IXYZ): string {
    const v = this.getRandom(1, 4)
    return (
      `http://vec0${v}.maps.yandex.net/tiles?l=map&v=4.55.2` +
      `&z=${xyz.z}&x=${xyz.x}&y=${xyz.y}&scale=2&lang=ru_RU`
    )
  }

  private getGUrl(year: number, xyz: IXYZ): string {
    return `http://cdn.geacron.com/tiles/area/${year}/Z${xyz.z}/${xyz.y}/${xyz.x}.png`
  }

  private writeFile(writeInfo: ISourceDest): Promise<void> {
    return new Promise((resolve, _) => {
      http.get(writeInfo.url, (res) => {
        const { statusCode } = res
        const contentType = res.headers['content-type']

        let error
        if (statusCode !== 200) {
          error = new Error('Request Failed.\n' + `Status Code: ${statusCode}`)
        } else if (!/^image\/png/.test('' + contentType)) {
          error = new Error(
            `Invalid content-type. Expected image/png but received ${contentType}`
          )
        }

        if (error) {
          console.log(`Ошибка при обработке url ${writeInfo.url}: ${error}`)
          res.resume()
          resolve()
          return
        }

        const fileStream = fs.createWriteStream(writeInfo.fileName)
        console.log(`saving.. ${writeInfo.fileName}`)
        res.pipe(fileStream)

        res.on('end', () => resolve())
      })
    })
  }

  public async saveGMaps(): Promise<void> {
    for (let year = 1914; year < 1966; year++) {
      const yearDir = `${this.rootDir}/gmaps/${year}`
      this.createDir(yearDir)

      for (let z = 1; z < 7; z++) {
        const xyLimit = Math.pow(2, z)
        for (let x = 0; x < xyLimit; x++) {
          for (let y = 0; y < xyLimit; y++) {
            const url = this.getGUrl(year, { x, y, z })
            const fileName = `${yearDir}/${z}_${x}_${y}.png`
            await this.writeFile({ url, fileName })
          }
        }
      }
    }
  }

  public async saveYMaps(): Promise<void> {
    const yDir = `${this.rootDir}/ymaps`
    this.createDir(yDir)
    for (let z = 0; z < 12; z++) {
      const xyLimit = Math.pow(2, z)
      for (let x = 0; x < xyLimit; x++) {
        for (let y = 0; y < xyLimit; y++) {
          const url = this.getYUrl({ x, y, z })
          const fileName = `${yDir}/${z}_${x}_${y}.png`
          await this.writeFile({ url, fileName })
        }
      }
    }
  }
}
