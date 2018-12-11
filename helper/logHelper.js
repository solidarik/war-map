const chalk = require('chalk');
const moment = require('moment');
const { createLogger, format, transports } = require('winston');
const { combine, timestamp, label, colorize, splat, printf } = format;

class Log {
    constructor() {

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

        this.log = log;
    }

    info(text) {
        this.log.log('info', text);
    }

    error(text) {
        this.log.log('error', text);
    }

    warn(text) {
        this.log.log('warn', text);
    }
}

let log = new Log();

warn = (text) => { log.warn(text); }
info = (text) => { log.info(text); }
error  = (text, err) => { err ? log.error([chalk.red(text), err].join(', ')) : log.error(chalk.red(text)); }
warn = (text) => { log.warn(text); }
success = (text) => { log.info(chalk.blue(text)); }

module.exports = log;
