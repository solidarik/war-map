const path = require('path')
const fs = require('fs')

class FileHelper {
  getRoot() {
    return path.dirname(require.main.filename)
  }

  composePath(...paths) {
    return path.join(this.getRoot(), ...paths)
  }

  clearDirectory(dirPath) {
    try {
      try {
        const stats = fs.statSync(dirPath)
      } catch (error) {
        fs.mkdirSync(dirPath, { recursive: true })
        return true
      }

      fs.readdirSync(dirPath).forEach((file) => {
        fs.unlink(path.join(dirPath, file), (err) => {
          if (err) throw err
        })
      })
    } catch (error) {
      throw Error(`Не получилось создать директорию ${dirPath}: ${error}`)
    }
  }

  isDirectory(path) {
    var stat = fs.lstatSync(path)
    return stat.isDirectory()
  }

  isFileExists(path) {
    return fs.existsSync(path)
  }

  getFileNameFromPath(filePath) {
    return path.basename(filePath)
  }

  getJsonFromFile(filePath) {
    let obj = JSON.parse(fs.readFileSync(filePath, 'utf8'))
    return obj
  }

  textJson(json) {
    return JSON.stringify(json, null, 4)
  }

  saveJsonToFileSync(json, filePath) {
    fs.writeFileSync(filePath, this.textJson(json), {
      encoding: 'UTF8',
    })
  }

  getFilesFromDir(dataDir, fileType = '.json') {
    let set = new Set()
    fs.readdirSync(dataDir).forEach((fileName) => {
      let filePath = path.join(dataDir, fileName)
      if (fileType === path.extname(filePath)) {
        set.add(filePath)
      }
    })
    return set
  }
}

module.exports = new FileHelper()
