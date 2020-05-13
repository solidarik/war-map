class ImageHelper {
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
}

module.exports = ImageHelper
