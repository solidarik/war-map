import Log from '../helper/logHelper.js'
const log = Log.create()

import FileHelper from '../helper/fileHelper.js'
import StrHelper from '../helper/strHelper.js'
import axios from 'axios'
import chalk from 'chalk'

class InetHelper {
  constructor() { }

  loadCoords() {

    const filename = FileHelper.composePath('loadDatabase/dataSources/checkedCoords.json')

    this.coords = FileHelper.isFileExists(filename)
      ? FileHelper.getJsonFromFile(filename)
      : {}
    console.log(chalk.gray(`Кол-во сохраненных координат ${Object.keys(this.coords).length}`))
    let itemNames = []
    for (let coordName in this.coords) {
      itemNames.push(coordName)
    }
    itemNames.sort()
    let newCoords = []
    for (let i = 0; i < itemNames.length; i++) {
      const itemName = itemNames[i].toLowerCase().trim()
      const itemCoords = this.coords[itemNames[i]]
      if (!newCoords[itemName]) {
        newCoords[itemName] = { 'lat': itemCoords.lat, 'lon': itemCoords.lon }
      }
    }

    this.coords = { ...newCoords }

    for (let name in this.coords) {
      this.coords[name.trim()] = this.coords[name]
    }
  }

  isExistCoord(coordName) {
    const itemName = coordName.toLowerCase().trim()
    return (itemName in this.coords)
  }

  addCoord(coordName, coordValue) {
    const itemName = coordName.toLowerCase().trim()
    if (itemName in this.coords)
      return false
    this.coords[itemName] = coordValue
  }

  saveCoords() {
    const filename = FileHelper.composePath('loadDatabase/dataSources/checkedCoords.json')
    console.log(`Before saving coords... Length: ${Object.keys(this.coords).length}`)
    FileHelper.saveJsonToFileSync(this.coords, filename)
  }

  getDataFromUrl(url) {
    return new Promise((resolve, reject) => {
      axios
        .get(url)
        .then((response) => {
          resolve(response.data)
        })
        .catch((error) => {
          log.error(`Error! axios was broken: ${error} ${url}`)
          reject(error)
        })
    })
  }

  hashCode(str) {
    var hash = 0,
      i,
      chr
    if (str.length === 0) return hash
    for (i = 0; i < str.length; i++) {
      chr = str.charCodeAt(i)
      hash = (hash << 5) - hash + chr
      hash |= 0 // Convert to 32bit integer
    }
    return hash
  }

  getEngNameFromWiki(rusName) {
    return new Promise((resolve, reject) => {
      resolve(this.hashCode(rusName))

      // this.getWikiPageId(rusName)
      //   .then(pageId => {
      //     return this.getTitleFromPageId(pageId);
      //   })
      //   .then(title => {
      //     resolve(title);
      //   })
      //   .catch(err => reject(err));
    })
  }

  getLonLatSavedCoords(input) {
    input = input.replace(/"/g, '')
    let testNames = [input]

    input = input.trim().toLowerCase()
    testNames.push(input)

    let name = StrHelper.shrinkStringBeforeDelim(input)
    testNames.push(name)

    input = input.replace(',', '')
    testNames.push(input)

    testNames.push(StrHelper.removeShortStrings(name, '', true).replace('  ', ' '))
    testNames.push(StrHelper.removeShortStrings(name, '', false).replace('  ', ' '))

    testNames = testNames.filter((value, index, self) => self.indexOf(value) === index)

    for (let i = 0; i < testNames.length; i++) {
      const name = testNames[i]
      if (name && this.coords && this.coords[name]) {
        const coords = this.coords[name]
        return coords
      }
    }

    return false
  }

  async searchCoordsByName(input) {

    if (!input) return null

    const existCoords = this.getLonLatSavedCoords(input)
    if (existCoords) {
      return existCoords
    }

    // console.log(`Не найдены предустановленные координаты для ${input}`)

    input = input.replace(',', '')
    let name = StrHelper.shrinkStringBeforeDelim(input)
    name = StrHelper.removeShortStrings(name)

    let coords = null

    try {
      coords = await this.getCoordsFromWiki(name)

      //const isRus = /[а-яА-ЯЁё]/.test(name)
      //if (isRus) {
      //  coords = await this.getCoordsFromWiki(`столица ${name}`)
      //  if (coords) return coords
      //} else {
      //  coords = await this.getCoordsFromWiki(`capital of ${name}`)
      //  if (coords) return coords
      //}
    } catch (error) {
      log.error(`Ошибка получения данных из Wiki ${error}`)
    } finally {
      if (coords && this.coords) {
        this.coords[name] = coords
        log.info(`Новая координата ${JSON.stringify(coords)} для места ${name}`)
      }
    }

    return coords ? coords : null
  }

  async getCoordsByPageId(pageId, isRus) {
    let url = this.composeWikiUrl(
      {
        action: 'query',
        prop: 'coordinates',
        format: 'json',
        pageids: pageId,
      },
      isRus
    )
    const json = await this.getDataFromUrl(url)
    const coords = json['query']['pages'][pageId]['coordinates']
    return coords && coords.length > 0
      ? { lat: coords[0].lat, lon: coords[0].lon }
      : null
  }

  async  getCoordsFromWiki(name) {
    let coords = undefined
    try {
      const isRus = /[а-яА-ЯЁё]/.test(name)

      let pageId = await this.getWikiPageId(name)
      if (!pageId) {
        throw `не удалось найти страницу Wiki для имени ${name}`
      }

      coords = await this.getCoordsByPageId(pageId, isRus)
      //try eng language page
      if (!coords) {
        pageId = await this.getWikiEngPageId(pageId, isRus)
        if (!pageId) {
          throw `не удалось найти координаты страницу Wiki для eng-имени ${name}`
        }
        coords = await this.getCoordsByPageId(pageId, false)
      }
      return coords ? coords : null
    } catch (error) {
      log.error(`ошибка получения координат ${name}: ${error}`)
      return null
    }
  }

  getTitleFromPageId(pageId, isRus = false) {
    return new Promise((resolve, reject) => {
      let url = this.composeWikiUrl(
        {
          action: 'query',
          prop: 'info',
          inprop: 'url',
          format: 'json',
          pageids: pageId,
        },
        isRus
      )

      this.getDataFromUrl(url)
        .then((json) => {
          let title = json['query']['pages'][pageId]['title']
          resolve(title)
        })
        .catch((err) => reject(err))
    })
  }

  getRusNameFromWiki(engName) {
    return new Promise((resolve, reject) => {
      this.getWikiPageId(engName)
        .then((pageId) => {
          return this.getLangTitleFromPageId(pageId, 'ru')
        })
        .then((rusName) => {
          resolve(rusName)
        })
        .catch((err) => {
          reject(err)
        })
    })
  }

  composeWikiUrl(options, isRus = false) {
    let url = isRus
      ? 'https://ru.wikipedia.org/w/api.php?'
      : 'https://en.wikipedia.org/w/api.php?'
    let delim = ''
    for (let key in options) {
      url += delim + key + '=' + options[key]
      delim = '&'
    }
    return url
  }

  //пока не используется
  getUrlFromPageId(pageId, isRus = false) {
    return new Promise((resolve, reject) => {
      let url = this.composeWikiUrl(
        {
          action: 'query',
          prop: 'info',
          inprop: 'url',
          format: 'json',
          pageids: pageId,
        },
        isRus
      )

      this.getDataFromUrl(url)
        .then((json) => {
          resolve(json['query']['pages'][pageId]['fullurl'])
        })
        .catch((err) => {
          reject(err)
        })
    })
  }

  getPageIdFromEngTitle(engTitle) {
    return new Promise((resolve, reject) => {
      let url = this.composeWikiUrl({
        action: 'query',
        format: 'json',
        titles: encodeURI(engTitle),
      })

      this.getDataFromUrl(url)
        .then((json) => {
          let pages = json['query']['pages']
          resolve(Object.keys(pages)[0])
        })
        .catch((err) => reject(`ошибка в getPageIdFromEngTitle ${err}`))
    })
  }

  getLangTitleFromPageId(pageId, lang, isRus = false) {
    return new Promise((resolve, reject) => {
      let url = this.composeWikiUrl(
        {
          action: 'query',
          prop: 'langlinks',
          lllimit: 100,
          llprop: 'url',
          lllang: lang,
          format: 'json',
          pageids: pageId,
        },
        isRus
      )

      this.getDataFromUrl(url)
        .then((json) => {
          let title = json['query']['pages'][pageId]['langlinks'][0]['*']
          resolve(title)
          //let langUrl = json['query']['pages'][pageId]['langlinks'][0]['url'];
          //resolve(decodeURI(/[^/]*$/.exec(langUrl)[0]));
        })
        .catch((err) => {
          reject(err)
        })
    })
  }

  async getWikiEngPageId(pageId, isRus) {
    const engTitle = await this.getLangTitleFromPageId(pageId, 'en', isRus)
    return await this.getPageIdFromEngTitle(engTitle)
  }

  getWikiPageId(stringSearch) {
    return new Promise((resolve) => {
      const isRus = /[а-яА-ЯЁё]/.test(stringSearch)

      const promises = [
        new Promise((resolve) => {
          const url = this.composeWikiUrl(
            {
              action: 'query',
              format: 'json',
              generator: 'prefixsearch',
              prop: encodeURI('pageprops|description'),
              ppprop: 'displaytitle',
              gpssearch: encodeURI(stringSearch)
            },
            isRus
          )

          this.getDataFromUrl(url)
            .then((json) => {
              //если используется другая библиотека может понадобится JSON.parse
              if (!json.hasOwnProperty('query') ||
                !json['query'].hasOwnProperty('pages')) {
                resolve(null)
                return null
              }

              const pages = json['query']['pages']
              resolve(Object.keys(pages)[0])
            })
            .catch((error) => {
              log.error(
                `ошибка при получении данных для ${stringSearch} по url ${url}: ${error}`
              )
              resolve(null)
            })
        }),

        new Promise((resolve) => {
          const url = this.composeWikiUrl(
            {
              action: 'query',
              list: 'search',
              srlimit: 1,
              srprop: 'size',
              format: 'json',
              srsearch: encodeURI(stringSearch),
            },
            isRus
          )

          this.getDataFromUrl(url)
            .then((json) => {
              //если используется другая библиотека может понадобится JSON.parse
              resolve(json['query']['search'][0]['pageid'])
            })
            .catch((error) => {
              log.error(
                `ошибка при получении данных для ${stringSearch} по url ${url}: ${error}`
              )
              resolve(false)
            })
        }),
      ]

      Promise.all(promises).then(
        ([firstPageId, secondPageId]) => {
          const pageId = secondPageId ? secondPageId : firstPageId
          resolve(pageId)

          // if (!isRus) {
          //   resolve(pageId)
          //   return
          // }

          // this.getLangTitleFromPageId(pageId, 'en', isRus)
          //   .then(engTitle => {
          //     return this.getPageIdFromEngTitle(engTitle)
          //   })
          //   .then(pageId => {
          //     resolve(pageId)
          //   })
          //   .catch(err =>
          //     reject(`Не смогли найти глобальный pageId по рус. наводке ${err}`)
          //   )
        },
        (err) => {
          console.log(
            `Не удалось найти wiki-страницу: ${err} для запроса: ${stringSearch}`
          )
          resolve(false)
        }
      )
    })
  }
}

InetHelper.getInstance = function () {
  if (global.singleton_instance === undefined)
    global.singleton_instance = new InetHelper()
  return global.singleton_instance
}

export default InetHelper.getInstance()
