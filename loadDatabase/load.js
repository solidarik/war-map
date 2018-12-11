require('../helper/logHelper');
const DbHelper = require('../loadDatabase/dbHelper');
const historyEventsJsonMediator = require('../loadDatabase/historyEventsJsonMediator');
const dictEngRusJsonMediator = require('../loadDatabase/dictEngRusJsonMediator');

dbHelper = new DbHelper();

dbHelper.saveFilesFromDir({
    source: 'engRus.json',
    mediator: dictEngRusJsonMediator
})
.then( res => {
    return dbHelper.saveFilesFromDir({
        source: 'improvedMaps',
        mediator: historyEventsJsonMediator
    })
})
.then(
    () => { success(`Успешная загрузка`); dbHelper.free(); },
    (err) => { throw err; }
)
.catch(err => {
    dbHelper.free();
    error(`Ошибка загрузи данных: ${err}`);
});