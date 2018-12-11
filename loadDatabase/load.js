const chalk = require('chalk');
const log = require('../helper/logHelper');
const geoHelper = require('../helper/geoHelper');
const inetHelper = require('../helper/inetHelper');
const historyEventsModel = require('../models/historyEventsModel');
const DbHelper = require('../helper/dbHelper');

try {
    dbHelper = new DbHelper()
    dbHelper.saveHistoryEvents();
    return;
} finally {
    dbHelper.free();
}