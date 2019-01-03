const log = require('../helper/logHelper');
const config = require('config');
const chalk = require('chalk');
const request = require('request');

class InetHelper {

    constructor() {
    }

    getDataFromUrl(url) {
        return new Promise( (resolve, reject) => {
            request(url, (err, res, body) => {
                if (err) {
                    reject(err);
                    error(err);
                    return;
                }
                resolve(body);
                return body;
            });
        });
    }

    getEngNameFromWiki(rusName) {
        return new Promise( (resolve, reject) => {
            this.getWikiPageId(rusName)
            .then( pageId => {
                return this.getTitleFromPageId(pageId);
            })
            .then(title => {
                resolve(title);
            })
            .catch( err => reject(err) );
        });
    }

    getTitleFromPageId(pageId, isRus = false) {
        return new Promise( (resolve, reject) => {
            let url = this.composeWikiUrl({
                action: 'query',
                prop: 'info',
                inprop: 'url',
                format: 'json',
                pageids: pageId
            }, isRus);

            this.getDataFromUrl(url)
                .then(
                    body => {
                        let json = JSON.parse(body);
                        let title = json['query']['pages'][pageId]['title'];
                        resolve(title);
                    }
                )
                .catch( err => reject(err) )
        });
    }

    getRusNameFromWiki(engName) {

        return new Promise( (resolve, reject) => {
            this.getWikiPageId(engName)
                .then( pageId => {
                    return this.getLangTitleFromPageId(pageId, 'ru')
                })
                .then(rusName => {
                    resolve(rusName);
                })
                .catch( err => { reject(err); });
        });
    }

    composeWikiUrl(options, isRus = false) {
        let url = isRus ? 'https://ru.wikipedia.org/w/api.php?' : 'https://en.wikipedia.org/w/api.php?';
        let delim = '';
        for (let key in options) {
            url += delim + key + '=' + options[key];
            delim = '&';
        }
        return url;
    }

    getUrlFromPageId(pageId, isRus = false) {
        return new Promise( (resolve, reject) => {

            let url = this.composeWikiUrl({
                action: 'query',
                prop: 'info',
                inprop: 'url',
                format: 'json',
                pageids: pageId
            }, isRus);

            this.getDataFromUrl(url)
            .then( body => {
                let json = JSON.parse(body);
                resolve(json['query']['pages'][pageId]['fullurl']);
            })
            .catch( err => { reject(err); });
        });
    }

    getPageIdFromEngTitle(engTitle) {
        return new Promise( (resolve, reject) => {

            let url = this.composeWikiUrl({
                action: 'query',
                format: 'json',
                titles: encodeURI(engTitle)
            });

            this.getDataFromUrl(url)
            .then( body => {
                let json = JSON.parse(body);
                let pages = json['query']['pages'];
                resolve(Object.keys(pages)[0]);
            })
            .catch( err => reject(`Ошибка в getPageIdFromEngTitle ${err}`));
        });
    }

    getLangTitleFromPageId(pageId, lang, isRus = false) {
        return new Promise( (resolve, reject) => {

            let url = this.composeWikiUrl({
                action: 'query',
                prop: 'langlinks',
                lllimit: 100,
                llprop: 'url',
                lllang: lang,
                format: 'json',
                pageids: pageId
            }, isRus);

            this.getDataFromUrl(url)
            .then( body => {
                let json = JSON.parse(body);
                let title = json['query']['pages'][pageId]['langlinks'][0]['*'];
                resolve(title);
                //let langUrl = json['query']['pages'][pageId]['langlinks'][0]['url'];
                //resolve(decodeURI(/[^/]*$/.exec(langUrl)[0]));

            })
            .catch( err => { reject(err); });
        });
    }

    getWikiPageId(stringSearch) {
        return new Promise( (resolve, reject) => {

            if (!Array.isArray(stringSearch))
                stringSearch = [stringSearch];

            let promises = [];
            let isRus = false;

            stringSearch.forEach( (str) => {

                isRus = /[а-яА-ЯЁё]/.test(stringSearch);

                promises.push(
                    new Promise( (resolve, reject) => {

                        let url = this.composeWikiUrl({
                            action: 'query',
                            format: 'json',
                            generator: 'prefixsearch',
                            prop: encodeURI('pageprops|description'),
                            ppprop: 'displaytitle',
                            gpssearch: encodeURI(str),
                            gpsnamespace: 0,
                            gpslimit: 6
                        }, isRus);

                        this.getDataFromUrl(url)
                        .then( body => {
                            let json = JSON.parse(body);
                            let pages = json['query']['pages'];
                            resolve(Object.keys(pages)[0]);
                        })
                        .catch(
                            err => { reject(err); }
                        );
                    })
                );

                promises.push(
                    new Promise( (resolve, reject) => {
                        let url = this.composeWikiUrl({
                            action: 'query',
                            list: 'search',
                            srlimit: 1,
                            srprop: 'size',
                            format: 'json',
                            srsearch: encodeURI(str)
                        }, isRus);

                        this.getDataFromUrl(url)
                        .then( body => {
                            let json = JSON.parse(body);
                            resolve(json['query']['search'][0]['pageid']);
                        })
                        .catch(
                            err => { reject(err); }
                        );

                    })
                );
            });

            Promise.race(promises)
            .then( firstPageId => {

                if (!isRus) {
                    resolve(firstPageId);
                    return;
                }

                this.getLangTitleFromPageId(firstPageId, 'en', isRus)
                .then( engTitle => { return this.getPageIdFromEngTitle(engTitle); })
                .then( pageId => { resolve(pageId) })
                .catch( err => reject(`Не смогли найти глобальный pageId по рус. наводке ${err}`));
            })
            .catch(
                err => reject(`Не удалось найти wiki-страницу: ${err}`)
            )
        });
    }
}

module.exports = new InetHelper();