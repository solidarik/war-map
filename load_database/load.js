const moment = require('moment');
const chalk = require('chalk');
const db = require('../libs/mongoose');
const MapObject = require('../models/mapObject');
const path = require('path');
const fs = require('fs');

const { createLogger, format, transports } = require('winston');
const { combine, timestamp, label, colorize, splat, printf } = format;

const myFormat = printf(info => {
    return `${moment().format('YYYY-MM-DD hh:mm:ss').trim()} ${info.level}: ${info.message}`;
});
const log = createLogger({
    format: combine(
        splat(),
        colorize(),
        myFormat
    ),
    transports: [new transports.Console()]
});

const root = path.dirname(require.main.filename);
const dataDir = path.join(root, 'samara', 'data');
log.log('info', 'root %s', root);
log.log('info', chalk.green('file directory: ', dataDir));

let set = new Set();
fs.readdirSync(dataDir).forEach(fileName => {
    let filePath = path.join(dataDir, fileName);
    if ('.json' === path.extname(filePath)) {
        let obj = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        obj.forEach( elem => set.add( elem["Indicator Name"] ) );
        log.log('info', 'filename: %s, length: %d', chalk.blue(fileName), obj.length);
    }
})

set.forEach( item => log.info( item ));

const promise = new Promise((resolve, reject) => {
    try
    {
        MapObject.find({}, (err, mapObjects) => {
            if (err) {
                log.error()
                reject(new Error(err));
            }

            log.log('info', 'Found objects: %d', mapObjects.length);
            resolve("complete");
        });

    } catch(ex) {
        reject(new Error(ex.message));
    }
});

promise
    .then(
        result => { log.info(chalk.cyan("Finish!")); db.disconnect(); return "next"; },
        error => log.error(error.message)
    )
    .catch(error => log.error(error));
return;