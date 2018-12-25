require('../helper/logHelper');
const DbHelper = require('../loadDatabase/dbHelper');
const inetHelper = require('../helper/inetHelper');
const historyEventsJsonMediator = require('../loadDatabase/historyEventsJsonMediator');
const dictEngRusJsonMediator = require('../loadDatabase/dictEngRusJsonMediator');


dbHelper = new DbHelper();
dbHelper.clearDb();
dbHelper.free();
return;


dbHelper.saveFilesFromDir({
    source: 'data_sources/engRus.json',
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