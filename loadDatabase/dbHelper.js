const log = require('../helper/logHelper');
const fileHelper = require('../helper/fileHelper');
const mongoose = require('mongoose');
const config = require('config');
const chalk = require('chalk');

class DbHelper {

    getLocalDb() {
        if (process.env.MONGOOSE_DEBUG) {
            mongoose.set('debug', true);
        }

        mongoose.Promise = global.Promise;
        mongoose.connect(config.mongoose.uri, config.mongoose.options);
        return mongoose;
    }

    clearDb() {
        const modelFiles = fs.readdirSync(path.join(__dirname, 'models')).sort();
        modelFiles.forEach(handler => {
            let modelFile = require('./models/' + handler);
            console.log(modelFile);
        });
    }

    constructor(db) {
        this.isOuter = (db != undefined);
        this.db = (db != undefined) ? db : this.getLocalDb();
    }

    free() {
        if (this.isOuter) return;
        setTimeout( () => { this.db.disconnect(); info(chalk.yellow('db disconnected')); }, 100);
    }

    saveFilesFromDir(input) {
        return new Promise((resolve, reject) => {

            let mediator = input.mediator;

            let files = [];

            let source = fileHelper.composePath(input.source);

            if (fileHelper.isDirectory(source)) {
                files = fileHelper.getFilesFromDir(source);
            } else {
                files.push(source);
            }

            let promises = [];
            let countObjects = 0;
            files.forEach( filePath => {
                let json = fileHelper.getJsonFromFile(filePath);
                json.forEach( jsonItem => {
                    promises.push(
                        new Promise( (resolve, reject) => {

                            let newJsonItem = undefined;

                            mediator.processJson(jsonItem)
                            .then(procJsonItem => {
                                newJsonItem = procJsonItem;
                                return mediator.isExistObject(procJsonItem);
                            })
                            .then(isExistObject => {

                                if (!isExistObject)
                                    countObjects += 1;
                                    return mediator.addObjectToBase(newJsonItem);
                            })
                            .then(
                                res => resolve(res)
                            )
                            .catch(err => {
                                log.error(`Ошибка при обработке файла ${fileHelper.getFileNameFromPath(filePath)} элемент {${jsonItem}}: ${err}`);
                                reject();
                            });
                        })
                    );
                });
            });
            log.info(`Количество промисов: ${promises.length}`);
            Promise.all(promises).then(
                res => {
                    log.info(`Обработано ${countObjects} элементов`);
                    resolve(true);
                },
                err => {
                    error.info(`Ошибка при обработке файлов`);
                    reject(false);
                }
            )
            .catch(
                err => { reject(false); throw err; }
            );
        });
    }

    fillDictCountries() {
        const filePath = fileHelper.composePath('samara', 'data', 'countries_centroid.json');
        let obj = fileHelper.getJsonFromFile(filePath);
        obj.forEach( (item, i, arr) => {
            if (i == 0) {
                info(fromLonLat([56.004 , 54.6950]));
                let country = {
                    iso: item['ISO3'],
                    eng: item['NAME'],
                    region: item['REGION'],
                    subregion: item['SUBREGION']
                };
                info('iso: ' + item['ISO3']);
                info(JSON.stringify(item));
            }
        });
        info(obj.length);
    }

    getSamaraSource() {
        const firstSource = new DictSourcesModel({
            source_code: 'samara_json',
            source_name_rus: 'Данные, предоставленные коллегами из Самары',
            source_name_eng: 'Data from Samara colleagues'
        });

        let query = DictSourcesModel.findOne({source_code: firstSource.source_code});
        query.then( (doc) => {

            if (!doc) {
                firstSource.save((err) => {
                    if (!err) success('object created');
                    else error('object did not create', err);
                });
            }

        });

    }
}

module.exports = DbHelper;