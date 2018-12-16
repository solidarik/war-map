require('../helper/logHelper');
const DbHelper = require('../loadDatabase/dbHelper');
const inetHelper = require('../helper/inetHelper');
const historyEventsJsonMediator = require('../loadDatabase/historyEventsJsonMediator');
const dictEngRusJsonMediator = require('../loadDatabase/dictEngRusJsonMediator');

inetHelper.getWikiPageId(['Belgorod-Kharkov Offensive Operation'])
.then( pageId => {
    return inetHelper.getUrlFromPageId(pageId);
})
.then(
    full_url => { console.log(full_url); }
)
.catch(
    err => { console.log(`catch: ${err}`); }
)
return;

dbHelper = new DbHelper();

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