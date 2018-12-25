const path = require('path');
const fs = require('fs');

class FileHelper {

    getRoot() {
        return path.dirname(require.main.filename);
    }

    composePath(... paths) {
        return path.join(this.getRoot(),...paths);
    }

    isDirectory(path) {
        var stat = fs.lstatSync(path);
        return stat.isDirectory();
    }

    getFileNameFromPath(filePath) {
        return path.basename(filePath);
    }

    getJsonFromFile(filePath) {
        let obj = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        return obj;
    }

    getFilesFromDir(dataDir, fileType = '.json') {
        let set = new Set();
        fs.readdirSync(dataDir).forEach(fileName => {
            let filePath = path.join(dataDir, fileName);
            if (fileType === path.extname(filePath)) {
                set.add(filePath);
            }
        })
        return set;
    }
}

module.exports = new FileHelper();