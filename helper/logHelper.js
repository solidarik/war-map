import chalk from 'chalk'
import winston from 'winston'

const createLogger = winston.createLogger
const transports = winston.transports
const { combine, colorize, splat, printf } = winston.format;

export default class Log {
    static create(fileName = undefined) {
        return new Log(fileName)
    }

    constructor(fileName = undefined) {

        const myFormat = printf(info => {
            // return `${moment().format('YYYY-MM-DD hh:mm:ss').trim()} ${info.level}: ${info.message}`;
            return `${info.message}`;
        });

        let logTransports = [new transports.Console()]
        if (fileName) {
            logTransports.push(new transports.File({ filename: fileName }))
        }

        const log = createLogger({
            format: combine(
                splat(),
                colorize(),
                myFormat
            ),
            transports: logTransports
        });

        this.log = log;
    }

    info(text) {
        this.log.log('info', text);
    }

    error(text, err) {
        if (err)
            this.log.log('error', [chalk.red(text), err].join(', '));
        else
            this.log.log('error', chalk.red(text));
    }

    warn(text) {
        this.log.log('warn', text);
    }

    success(text) {
        this.log.info(chalk.blue(text));
    }

    boom(text) {
        this.log.info(chalk.magenta(text));
    }
}