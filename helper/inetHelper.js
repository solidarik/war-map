const log = require('../helper/logHelper');
const config = require('config');
const chalk = require('chalk');
const request = require('request');

class InetHelper {

    constructor() {
    }

    getDataFromUrl(url) {
        let promise = new Promise( (resolve, reject) => {
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
        return promise;
    }

    async getEngNameFromWiki(rusName) {

        let pageId = await this.getPageId(encodeURI(rusName));
        let engName = await this.getTitleFromPageId(pageId);

        return engName;

    }

    async getTitleFromPageId(pageId) {

        let options = {
            action: 'query',
            prop: 'info',
            inprop: 'url',
            format: 'json',
            pageids: pageId
        };

        let url = this.composeWikiUrl(options);
        log.info(url);
        let body = await this.getDataFromUrl(url);
        let json = JSON.parse(body);
        let title = json['query']['pages'][pageId]['title'];
        return(title);
    }

    async getRusNameFromWiki(engName) {

        let pageId = await this.getPageId(engName);
        let rusName = await this.getLangNameFromPageId(pageId, 'ru');

        return rusName;

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

    async getLangNameFromPageId(pageId, lang) {
        let options = {
            action: 'query',
            prop: 'langlinks',
            lllimit: 100,
            llprop: 'url',
            lllang: lang,
            format: 'json',
            pageids: pageId
        };

        let url = this.composeWikiUrl(options);
        log.info(url);
        let body = await this.getDataFromUrl(url);
        let json = JSON.parse(body);
        let langUrl = json['query']['pages'][pageId]['langlinks'][0]['url'];
        return(decodeURI(/[^/]*$/.exec(langUrl)[0]));
    }

    async getPageId(string_search) {

        let options = {
            action: 'query',
            list: 'search',
            srlimit: 1,
            srprop: 'size',
            format: 'json',
            srsearch: string_search
        };

        let url = this.composeWikiUrl(options);
        let body = await this.getDataFromUrl(url);
        let json = JSON.parse(body);
        return(json['query']['search'][0]['pageid']);
    }
}

module.exports = new InetHelper();