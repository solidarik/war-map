const log = require('../helper/logHelper');
const ServerProtocol = require('../libs/serverProtocol');
let HistoryEventsModel = require('../models/historyEventsModel');

class HistoryEventsProtocol extends ServerProtocol {

    init() {
        super.addHandler('clQueryEvents', this.getEventsByYear);
    }

    getEventsByYear(socket, msg, cb) {

        let data = JSON.parse(msg);
        let startDate = (new Date(data.year, 0, 1)).toISOString();
        let endDate = (new Date(data.year, 11, 31)).toISOString();
        HistoryEventsModel.find({
            startDate: {
                $gte: startDate,
                $lt: endDate
            }
        }, (err, events) => {
            let msg = {};
            msg.err = err;
            msg.events = events;
            cb(JSON.stringify(msg));
        });
    }
}

module.exports = new HistoryEventsProtocol();