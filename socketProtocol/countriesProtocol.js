const ServerProtocol = require('../libs/serverProtocol')
const dictEngRusProtocol = require('../socketProtocol/dictEngRusProtocol')
let countriesModel = require('../models/countriesModel')

class CountriesProtocol extends ServerProtocol {
  init() {
    super.addHandler('clGetCountries', this.getCountries)
  }

  getCity(name) {
    return new Promise((resolve, reject) => {
      dictEngRusProtocol
        .getEndRusObject(name)
        .then(
          (nameObj) => {
            countriesModel.findOne({ _name: nameObj._id }).then(
              (cityObj) => resolve(cityObj),
              () => resolve(false)
            )
          },
          (err) => reject(err)
        )
        .catch((err) => {
          throw `ошибка поиска города: ${err}`
        })
    })
  }

  addCity(cityObj) {
    return new Promise((resolve, reject) => {
      let promises = [
        dictEngRusProtocol.getEngRusOjbectId(cityObj.country),
        dictEngRusProtocol.getEngRusOjbectId(cityObj.capital),
      ]

      Promise.all(promises).then(
        (res) => {
          let [country_id, capital_id] = res
          ;(objName) => {
            const cityToBase = new countriesModel({
              _country: country_id,
              _capital: capital_id,
              iso2: objName.iso2,
              iso3: objName.iso3,
              centroid: objName.centroid,
            })
            cityToBase.save().then(
              (res) => resolve(cityToBase['_id'].toString()),
              (err) => {
                throw err
              }
            )
          }
        },
        (err) => reject(`ошибка в CountriesProtocol.addCity ${err}`)
      )
    })
  }

  getCountries(socket, msg, cb) {
    countriesModel.find({}, (err, dict) => {
      let msg = {}
      msg.err = err
      msg.res = []
      dict.forEach((item) => msg.res.push(item))
      cb(JSON.stringify(msg))
    })
  }
}

module.exports = new CountriesProtocol()
