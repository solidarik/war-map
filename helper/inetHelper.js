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
                    return this.getTitleFromPageId(pageId)
                })
                .then(engName => {
                    resolve(engName);
                })
                .catch( err => { reject(err); });
        });
    }

    getTitleFromPageId(pageId) {
        return new Promise( (resolve, reject) => {
            let url = this.composeWikiUrl({
                action: 'query',
                prop: 'info',
                inprop: 'url',
                format: 'json',
                pageids: pageId
            });

            this.getDataFromUrl(url)
                .then(
                    body => {
                        let json = JSON.parse(body);
                        let title = json['query']['pages'][pageId]['title'];
                        resolve(title);
                    },
                    err => { reject(err); }
                )
                .catch( err => { reject(err); } )
        });
    }

    getRusNameFromWiki(engName) {

        return new Promise( (resolve, reject) => {
            this.getWikiPageId(engName)
                .then( pageId => {
                    return this.getLangNameFromPageId(pageId, 'ru')
                })
                .then(rusName => {
                    resolve(rusName);
                })
                .catch( err => { reject(err); });
        });
    }

    composeWikiUrl(options) {
        let url = 'https://wikipedia.org/w/api.php?';
        let delim = '';
        for (let key in options) {
            url += delim + key + '=' + options[key];
            delim = '&';
        }
        return url;
    }

    getUrlFromPageId(pageId) {
        return new Promise( (resolve, reject) => {

            let url = this.composeWikiUrl({
                action: 'query',
                prop: 'info',
                inprop: 'url',
                format: 'json',
                pageids: pageId
            });

            this.getDataFromUrl(url)
            .then( body => {
                let json = JSON.parse(body);
                resolve(json['query']['pages'][pageId]['fullurl']);
            })
            .catch( err => { reject(err); });
        });
    }

    getLangNameFromPageId(pageId, lang) {
        return new Promise( (resolve, reject) => {

            let url = this.composeWikiUrl({
                action: 'query',
                prop: 'langlinks',
                lllimit: 100,
                llprop: 'url',
                lllang: lang,
                format: 'json',
                pageids: pageId
            });

            this.getDataFromUrl(url)
            .then( body => {
                let json = JSON.parse(body);
                let langUrl = json['query']['pages'][pageId]['langlinks'][0]['url'];
                resolve(decodeURI(/[^/]*$/.exec(langUrl)[0]));
            })
            .catch( err => { reject(err); });
        });
    }

    getWikiPageId(string_search) {
        return new Promise( (resolve, reject) => {

            if (!Array.isArray(string_search))
                string_search = [string_search];

            let promises = [];
            string_search.forEach( (str) => {
                promises.push(
                    new Promise( (resolve, reject) => {
                        let url = this.composeWikiUrl({
                            action: 'query',
                            list: 'search',
                            srlimit: 1,
                            srprop: 'size',
                            format: 'json',
                            srsearch: encodeURI(str)
                        });

                        this.getDataFromUrl(url)
                        .then( body => {
                            try {
                                let json = JSON.parse(body);
                                resolve(json['query']['search'][0]['pageid']);
                            } catch(_) {
                                reject();
                            }
                        })
                        .catch(
                            err => { reject(err); }
                        );

                    })
                )
            });
            Promise.race(promises)
            .then(
                firstPageId => { resolve(firstPageId); }
            )
            .catch(
                err => { reject(err); }
            )
        });
    }
}

module.exports = new InetHelper();