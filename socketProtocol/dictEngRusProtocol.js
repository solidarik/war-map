const log = require("../helper/logHelper");
const inetHelper = require("../helper/inetHelper");
const ServerProtocol = require("../libs/serverProtocol");
let dictEngRusModel = require("../models/dictEngRusModel");

class EngRusProtocol extends ServerProtocol {
  init() {
    super.addHandler("clGetDictEngRus", this.getDictEngRus);
  }

  getEngRusObject(name) {
    return new Promise((resolve, reject) => {
      let isRus = /[а-яА-ЯЁё]/.test(name);
      dictEngRusModel
        .findOne(isRus ? { rus: name } : { eng: name })
        .then(doc => {
          if (doc && typeof doc !== "undefined") {
            resolve(doc);
          } else {
            let newObj = {};
            let promise = undefined;
            if (isRus) {
              newObj.rus = name;
              promise = new Promise((resolve, reject) => {
                inetHelper
                  .getEngNameFromWiki(name)
                  .then(engName => {
                    newObj.eng = engName;
                    resolve(newObj);
                  })
                  .catch(err =>
                    reject(
                      `Не удалось найти англ. страницу в Википедии для ${name}: ${err}`
                    )
                  );
              });
            } else {
              newObj.eng = name;
              promise = new Promise((resolve, reject) => {
                inetHelper
                  .getRusNameFromWiki(name)
                  .then(rusName => {
                    newObj.rus = rusName;
                    resolve(newObj);
                  })
                  .catch(err =>
                    reject(
                      `Не удалось найти рус. страницу в Википедии для ${name}: ${err}`
                    )
                  );
              });
            }

            promise
              .then(newObj => {
                log.success(
                  `Пытаемся добавить объект ${JSON.stringify(newObj)}`
                );
                return this.addEngRus(newObj.eng, newObj.rus);
              })
              .then(obj => resolve(obj))
              .catch(err =>
                reject(`Не удалось найти и добавить объект в базу: ${err}`)
              );
          }
        })
        .catch(err =>
          reject(`Ошибка в dictEngRusProtocol.getEndRusObject: ${err}`)
        );
    });
  }

  getEngRusObjectId(name) {
    return new Promise((resolve, reject) => {
      this.getEngRusObject(name)
        .then(doc => resolve(doc.id.toString()))
        .catch(err =>
          reject(`Ошибка в dictEngRusProtocol.getEndRusObjectId: ${err}`)
        );
    });
  }

  addEngRus(eng, rus) {
    return new Promise((resolve, reject) => {
      const engRus = new dictEngRusModel({ eng: eng, rus: rus });
      engRus.save(err => {
        err
          ? reject(`Ошибка в dictEngRusProtocol.addEngRus: ${err}`)
          : resolve(engRus);
      });
    });
  }

  getDictEngRus(socket, msg, cb) {
    dictEngRusModel.find({}, (err, dict) => {
      let msg = {};
      msg.err = err;
      msg.res = [];
      dict.forEach(item =>
        msg.res.push({
          id: item._id,
          eng: item.eng,
          rus: item.rus
        })
      );
      cb(JSON.stringify(msg));
    });
  }
}

module.exports = new EngRusProtocol();
