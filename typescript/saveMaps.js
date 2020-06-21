"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = __importDefault(require("http"));
const fs_1 = __importDefault(require("fs"));
const shelljs_1 = __importDefault(require("shelljs"));
class SaveOuterData {
    constructor(rootDir) {
        this.rootDir = rootDir;
        this.createDir(rootDir);
    }
    createDir(dir) {
        shelljs_1.default.mkdir('-p', dir);
    }
    getRandom(start, end) {
        return Math.floor(Math.random() * end) + start;
    }
    getYUrl(xyz) {
        const v = this.getRandom(1, 4);
        return (`http://vec0${v}.maps.yandex.net/tiles?l=map&v=4.55.2` +
            `&z=${xyz.z}&x=${xyz.x}&y=${xyz.y}&scale=2&lang=ru_RU`);
    }
    getGUrl(year, xyz) {
        return `http://cdn.geacron.com/tiles/area/${year}/Z${xyz.z}/${xyz.y}/${xyz.x}.png`;
    }
    writeFile(writeInfo) {
        return new Promise((resolve, _) => {
            http_1.default.get(writeInfo.url, (res) => {
                const { statusCode } = res;
                const contentType = res.headers['content-type'];
                let error;
                if (statusCode !== 200) {
                    error = new Error('Request Failed.\n' + `Status Code: ${statusCode}`);
                }
                else if (!/^image\/png/.test('' + contentType)) {
                    error = new Error(`Invalid content-type. Expected image/png but received ${contentType}`);
                }
                if (error) {
                    console.log(`Ошибка при обработке url ${writeInfo.url}: ${error}`);
                    res.resume();
                    resolve();
                    return;
                }
                const fileStream = fs_1.default.createWriteStream(writeInfo.fileName);
                console.log(`saving.. ${writeInfo.fileName}`);
                res.pipe(fileStream);
                res.on('end', () => resolve());
            });
        });
    }
    saveGMaps() {
        return __awaiter(this, void 0, void 0, function* () {
            for (let year = 1914; year < 1966; year++) {
                const yearDir = `${this.rootDir}/gmaps/${year}`;
                this.createDir(yearDir);
                for (let z = 1; z < 7; z++) {
                    const xyLimit = Math.pow(2, z);
                    for (let x = 0; x < xyLimit; x++) {
                        for (let y = 0; y < xyLimit; y++) {
                            const url = this.getGUrl(year, { x, y, z });
                            const fileName = `${yearDir}/${z}_${x}_${y}.png`;
                            yield this.writeFile({ url, fileName });
                        }
                    }
                }
            }
        });
    }
    saveYMaps() {
        return __awaiter(this, void 0, void 0, function* () {
            const yDir = `${this.rootDir}/ymaps`;
            this.createDir(yDir);
            for (let z = 0; z < 12; z++) {
                const xyLimit = Math.pow(2, z);
                for (let x = 0; x < xyLimit; x++) {
                    for (let y = 0; y < xyLimit; y++) {
                        const url = this.getYUrl({ x, y, z });
                        const fileName = `${yDir}/${z}_${x}_${y}.png`;
                        yield this.writeFile({ url, fileName });
                    }
                }
            }
        });
    }
}
exports.default = SaveOuterData;
