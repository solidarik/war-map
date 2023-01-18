import axios from 'axios'
import fs from 'fs'
import path from 'path'
import fileHelper from '../helper/fileHelper.js'

export default class ImageHelper {
  static resizeImage(url, fixWidth, callback) {
    var sourceImage = new Image()

    sourceImage.onload = function () {
      // Create a canvas with the desired dimensions
      var canvas = document.createElement('canvas')

      let imgWidth = this.width
      let aspectRatio = Math.round(imgWidth / fixWidth)

      let imgHeight = this.height
      let fixHeight = Math.round(imgHeight / aspectRatio)

      canvas.width = fixWidth
      canvas.height = fixHeight

      // Scale and draw the source image to the canvas
      let ctx = canvas.getContext('2d')
      ctx.globalAlpha = 0.6
      ctx.drawImage(sourceImage, 0, 0, fixWidth, fixHeight)

      // Convert the canvas to a data URL in PNG format
      if (callback) callback(canvas)
    }

    return (sourceImage.src = url)
  }

  static loadImageToFile(url, fileName) {
    let res = { saved: false, warning: null, error: null, url: url }

    return new Promise((resolve) => {
      try {


        const re = /(?:\.([^.]+))?$/
        const ext = re.exec(url)[1]
        let selectedExt = 'png'

        if (ext) {
          const acceptedExt = ['png', 'jpg', 'gif']
          for (let i = 0; i < acceptedExt.length; i++) {
            if (ext.indexOf(acceptedExt[i])) {
              selectedExt = acceptedExt[i]
              break
            }
          }
        }
        // fileName += '.' + selectedExt

        if (fileHelper.isFileExists(fileName)) {
          res.warning = 'File is exist'
          resolve(res)
          return
        }

        axios({
          method: 'GET',
          url: url,
          responseType: 'stream',
          timeout: 1000,

        })
          .then(response => {
            const w = response.data.pipe(fs.createWriteStream(fileName))
            w.on('finish', () => {
              res.saved = true
              resolve(res)
            })
          })
          .catch(err => {
            res.error = `Error in axios catch ${err}`
            resolve(res)
          })
      } catch (err) {
        res.error = `Program error in ${err}`
        resolve(res)
      }

    })
  }
}