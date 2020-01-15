class SuperJsonMediator {
  addObjectToBase(json) {
    return new Promise((resolve, reject) => {
      const obj = new this.model(json)
      obj
        .save()
        .then(res => resolve(obj['_id'.toString()]))
        .catch(err => {
          reject(err)
        })
    })
  }

  processJsonSync(json) {
    return json
  }

  checkJsonSync(json) {
    return true
  }

  isExistObject(json) {
    return new Promise((resolve, reject) => {
      let findJson = {}
      this.equilFields.forEach(element => {
        findJson[element] = json[element]
      })

      this.model.findOne(findJson, (err, res) => {
        if (err) {
          console.log(err)
          reject(`Ошибка в isExistObject: не удалось найти объект ${err}`)
        }

        res ? resolve(res) : resolve(false)
      })
    })
  }
}

module.exports = SuperJsonMediator
