const log = require('../helper/logHelper');
const ServerProtocol = require('../libs/serverProtocol');
let DictEngRusModel = require('../models/dictEngRusModel');

class EngRusProtocol extends ServerProtocol {

    init() {
        super.addHandler('clGetDictEngRus', this.getDictEngRus);
    }

    getOneEngRus(name, cb) {

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