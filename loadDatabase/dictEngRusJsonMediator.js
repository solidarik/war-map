const SuperJsonMediator = require('superJsonMediator');
const dictEngRusModel = require('../models/dictEngRusModel');

class DictEngRusJsonMediator extends SuperJsonMediator {

    constructor() {
        super();
        this.equilFields = ['eng'];
        this.model = dictEngRusModel;
    }

    processJson(json) {
        return new Promise( (resolve, reject) => {
            let newJson = {'eng': json[0], 'rus': json[1]}
            resolve(newJson);
        });
    }
}

module.exports = new DictEngRusJsonMediator();