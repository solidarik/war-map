const log = require('../helper/logHelper');
const DbHelper = require('../loadDatabase/dbHelper');
const historyEventsJsonMediator = require('../loadDatabase/historyEventsJsonMediator');
const dictEngRusJsonMediator = rquire('../loadDatabase/dictEngRusJsonMediator');

dbHelper = new DbHelper();
dbHelper.saveFilesFromDir({
    source: 'dicts.json',
    mediator: dictEngRusJsonMediator
})
.then( res => {
    return dbHelper.saveFilesFromDir({
        source: 'improvedMaps',
        mediator: historyEventsJsonMediator
    })
})
.then(
    () => { log.success(`Успешная загрузка`); dbHelper.free(); },
    (err) => { log.error(`Ошибка загрузи данных: ${err}`); dbHelper.free();}
);