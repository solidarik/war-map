class ClassHelper {
  static addClass(element, className) {
    if (!element || !element.className) return
    let arr = element.className.split(' ')
    if (arr.indexOf(className) == -1) {
      arr.push(className)
    }
    element.className = arr.join(' ')
  }

  static removeClass(element, className) {
    if (!element || !element.className) return
    element.className = element.className.replace(className, '').trim()
  }
}

module.exports = ClassHelper
