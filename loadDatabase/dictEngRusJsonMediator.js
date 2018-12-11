const dictEngRusProtocol = require('../socketProtocol/DictEngRusProtocol');

class DictEngRusJsonMediator {

    constructor() {
        this.equilFields = ['eng'];
    }

    // fillEngRus(input, cb) {
    //     const engRusFilePath = fileHelper.composePath('engRus.json');
    //     let obj = fileHelper.getJsonFromFile(engRusFilePath);
    //     obj.forEach( (item, i, arr) => {
    //         dbHelper.addEngRus(item[0], item[1]);
    //     });
    //     return;
    // }

    addObjectToBase(json) {
        return new Promise( (resolve, reject) => {
            dictEngRusProtocol.addEngRus(json.eng, json.rus)
            .then(
                res => { resolve(true); } )
            .catch(
                err => {
                    reject(false);
                    throw err;
                }
            );
        });
    }

    processJson(json) {
        return new Promise( (resolve, reject) => {
            let newJson = {'eng': json[0], 'rus': json[1]}
            resolve(newJson);
        });
    }

    isExistObject(json) {
        return new Promise( (resolve, reject) => {
            dictEngRusProtocol.getEngRusObjectId(json.eng)
            .then(
                res => resolve(res),
                err => reject(err)
            )
        });
    }
}

module.exports = new DictEngRusJsonMediator();