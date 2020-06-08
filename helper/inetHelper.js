const log = require('../helper/logHelper')
const fileHelper = require('../helper/fileHelper')
const geoHelper = require('../helper/geoHelper')
const strHelper = require('../helper/strHelper')
const config = require('config')
const chalk = require('chalk')
const axios = require('axios')

class InetHelper {
  constructor() {}

  loadCoords(filename) {
    this.coords = fileHelper.isFileExists(filename)
      ? fileHelper.getJsonFromFile(filename)
      : {}
  }

  saveCoords(filename) {
    fileHelper.saveJsonToFileSync(this.coords, filename)
  }

  getDataFromUrl(url) {
    return new Promise((resolve, reject) => {
      axios
        .get(url)
        .then((response) => {
          resolve(response.data)
        })
        .catch((error) => {
          log.error(`Error! axios was broken: ${error}`)
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

  async getCoordsForCityOrCountry(input) {
    const promises = input.split(';').map((local) => {
      return this.getLocalCoordsForName(local.trim())
    })

    return await Promise.all(promises)
  }

  async getLocalCoordsForName(input) {
    const name = strHelper.shrinkStringBeforeDelim(input)

    if (!name) {
      return undefined
    }

    const isExistCoords = this.coords && this.coords[name]
    let coords = null
    try {
      coords = isExistCoords
        ? this.coords[name]
        : await this.getCoordsFromWiki(name)

      return coords ? geoHelper.fromLonLat([coords.lon, coords.lat]) : null

      //const isRus = /[а-яА-ЯЁё]/.test(name)
      //if (isRus) {
      //  coords = await this.getCoordsFromWiki(`столица ${name}`)
      //  if (coords) return coords
      //} else {
      //  coords = await this.getCoordsFromWiki(`capital of ${name}`)
      //  if (coords) return coords
      //}
    } catch (error) {
      throw error
    } finally {
      if (this.coords && !isExistCoords && coords) {
        this.coords[name] = coords
        log.info(`новая координата ${JSON.stringify(coords)} для места ${name}`)
      }
    }
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
      ? { lon: coords[0].lon, lat: coords[0].lat }
      : null
  }

  async getCoordsFromWiki(name) {
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
              gpssearch: encodeURI(stringSearch),
              gpsnamespace: 0,
              gpslimit: 6,
            },
            isRus
          )

          this.getDataFromUrl(url)
            .then((json) => {
              //если используется другая библиотека может понадобится JSON.parse
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

module.exports = InetHelper.getInstance()
