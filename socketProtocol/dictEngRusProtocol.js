const log = require('../helper/logHelper');
const ServerProtocol = require('../libs/serverProtocol');
let DictEngRusModel = require('../models/dictEngRusModel');

class EngRusProtocol extends ServerProtocol {

    init() {
        super.addHandler('clGetDictEngRus', this.getDictEngRus);
    }

    getEngRusObject(name) {
        return new Promise( (resolve, reject) => {
            let isRus = /[а-яА-ЯЁё]/.test(name);
            DictEngRusModel.findOne( (isRus) ? {rus: name} : {eng: name})
            .then(
                doc => resolve((doc && typeof doc !== 'undefined') ? doc : undefined),
                err => reject(`Ошибка в dictEngRusProtocol.getEndRusObject: ${err}`)
            );
        })
    }

    getEngRusObjectId(name) {
        return new Promise( (resolve, reject) => {
            let isRus = /[а-яА-ЯЁё]/.test(name);
            DictEngRusModel.findOne( (isRus) ? {rus: name} : {eng: name})
            .then(
                doc => resolve((doc && typeof doc !== 'undefined') ? doc['_id'].toString() : undefined),
                err => reject(`Ошибка в dictEngRusProtocol.getEndRusObjectId: ${err}`)
            );
        });
    }

    addEngRus(eng, rus) {
        return new Promise( (resolve, reject) => {
            this.getEngRusObjectId(eng)
            .then(
                docId => {
                    if (docId) {
                        resolve(docId);
                        return(docId);
                    }
                    resolve(false);
                }
            )
            .then(
                docId => {
                    if (docId) return(docId);

                    const engRus = new DictEngRusModel({eng: eng, rus: rus});
                    engRus.save()
                    .then(
                        res => resolve(engRus['_id'.toString()]),
                        err => { throw err; }
                    );
                },
                err => reject(`Ошибка в dictEngRusProtocol.addEngRus: ${err}`)
            );
        });
    }

    getDictEngRus(socket, msg, cb) {
        DictEngRusModel.find({}, (err, dict) => {
            let msg = {};
            msg.err = err;
            msg.res = [];
            dict.forEach( (item) => msg.res.push({
                id: item._id,
                eng: item.eng,
                rus: item.rus}));
            cb(JSON.stringify(msg));
        });
    }
}

module.exports = new EngRusProtocol();