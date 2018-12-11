const dictEngRusProtocol = require('../socketProtocol/DictEngRusProtocol');

class DictEndRusJsonMediator {

    constructor() {
        this.equilFields = ['eng'];
    }

    fillEngRus(input, cb) {
        const engRusFilePath = fileHelper.composePath('engRus.json');
        let obj = fileHelper.getJsonFromFile(engRusFilePath);
        obj.forEach( (item, i, arr) => {
            dbHelper.addEngRus(item[0], item[1]);
        });
        return;
    }

    addObjectToBase(json) {
        dictEngRusProtocol.addEngRus(json.eng, json.rus);
    }

    processJson(json) {
        return new Promise( (resolve, reject) => {
            dictEngRusProtocol.addEngRus()
            resolve(json);
        });
    }

    isExistObject(json) {
        return new Promise( (resolve, reject) => {

        });
    }
}

module.exports = new DictEngRusJsonMediator();