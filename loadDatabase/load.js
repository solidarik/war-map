const log = require('../helper/logHelper');
const DbHelper = require('../loadDatabase/dbHelper');
const inetHelper = require('../helper/inetHelper');
const historyEventsJsonMediator = require('../loadDatabase/historyEventsJsonMediator');
const usersJsonMediator = require('../loadDatabase/usersJsonMediator');
const dictEngRusJsonMediator = require('../loadDatabase/dictEngRusJsonMediator');

dbHelper = new DbHelper();

Promise.resolve(true)
.then( () => { return dbHelper.clearDb(); })
.then( () => {
    return dbHelper.saveFilesFromDir({
        source: 'data_sources/secretUsers.json',
        mediator: usersJsonMediator
    });
})
.then( () => {
    return dbHelper.saveFilesFromDir({
        source: 'data_sources/engRus.json',
        mediator: dictEngRusJsonMediator
    });
})
.then( () => {
    return dbHelper.saveFilesFromDir({
        source: 'improvedMaps',
        mediator: historyEventsJsonMediator
    });
})
.then(
    () => { log.success(`Успешная загрузка`); dbHelper.free(); }
)
.catch(err => {
    dbHelper.free();
    log.error(`Ошибка загрузки данных: ${err}`);
});