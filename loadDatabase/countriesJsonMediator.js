const SuperJsonMediator = require('superJsonMediator')
const dictEngRusProtocol = require('../socketProtocol/dictEngRusProtocol')
const countriesModel = require('../models/countriesModel')

class CountriesJsonMediator extends SuperJsonMediator {
  constructor() {
    this.equilFields = ['_country']
    this.model = countriesModel
  }

  processJson(json) {
    return new Promise((resolve, reject) => {
      let promises = [
        dictEngRusProtocol.getEngRusObjectId(json.name),
        dictEngRusProtocol.getEngRusObjectId(json.capital),
      ]

      Promise.all(promises)
        .then(
          (res) => {
            let [name_id, capital_id] = res

            const newJson = {
              _name: name_id,
              _capital: capital_id,
              iso2: json.alpha2Code,
              iso3: json.alpha3Code,
            }
            resolve(newJson)
          },
          (err) => {
            reject(`ошибка в processJson: ${err}`)
          }
        )
        .catch((err) => {
          throw err
        })
    })
  }
}

module.exports = new CountriesJsonMediator()
