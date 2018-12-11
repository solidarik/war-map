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

    constructor(db) {
        this.isOuter = (db == undefined);
        this.db = db ? db : this.getLocalDb();
    }

    free() {
        if (isOuter) return;
        setTimeout( () => { this.db.disconnect(); info(chalk.yellow('db disconnected')); }, 100);
    }

    saveFilesFromDir(input) {
        return new Promise((resolve, reject) => {

            let mediator = input.mediator;

            let files = [];

            if (fileHelper.isDirectory(input.source)) {
                let dirPath = fileHelper.composePath(input.source);
                files = fileHelper.getFilesFromDir(dirPath);
            } else {
                files.add(input.source);
            }

            let promises = [];
            let countFiles = 0;
            files.forEach( filePath => {
                let json = fileHelper.getJsonFromFile(filePath);
                json.forEach( jsonItem => {
                    promises.push(
                        new Promise((resolve, reject) => {
                            mediator.processJson(jsonItem)
                                .then(newJsonItem => {
                                    return mediator.isExistObject(newJsonItem);
                                })
                                .then(isExistObject => {
                                    if (!isExistObject)
                                        mediator.addObjectToBase(newJsonItem);
                                    countFiles += 1;
                                    resolve();
                                })
                                .catch(err => {
                                    log.error(`Ошибка при обработке файла ${filePath} элемент {${itemStr.join(', ')}}: ${err}`);
                                    reject();
                                });
                        })
                    );
                });
            });
            log.info(`Количество промисов: ${promises.length}`);
            Promise.all(promises).then(
                res => {
                    log.info(`Обработано ${countFiles} файлов`);
                    resolve(true);
                },
                err => {
                    error.info(`Ошибка при обработке файлов директории ${dirPath}`);
                    reject(false);
                }
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

            console.log(doc['_id']);

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