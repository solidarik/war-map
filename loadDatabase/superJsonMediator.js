class SuperJsonMediator {
  addObjectToBase(json) {
    return new Promise((resolve, reject) => {
      const obj = new this.model(json)
      obj
        .save()
        .then(res => resolve(obj['_id'.toString()]), err => reject(err))
        .catch(err => {
          reject(err)
        })
    })
  }

  processJson(json, filePath = '') {
    return new Promise((resolve, reject) => {
      let newJson = json
      try {
        resolve(newJson)
      } catch (err) {
        reject(err)
      }
    })
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
