const path = require('path');
const fs = require('fs');

class FileHelper {

    getRoot() {
        return path.dirname(require.main.filename);
    }

    composePath(... paths) {
        return path.join(this.getRoot(),...paths);
    }

    getJsonFromFile(filePath) {
        let obj = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        return obj;
    }

    getFilesFromDir(dataDir) {
        let set = new Set();
        fs.readdirSync(dataDir).forEach(fileName => {
            let filePath = path.join(dataDir, fileName);
            if ('.json' === path.extname(filePath)) {
                set.add(filePath);
            }
        })
        return set;
    }
}

module.exports = new FileHelper();