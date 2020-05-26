class ClassHelper {
  static addClass(element, className) {
    const arr = element.className.split(' ')
    if (arr.indexOf(className) == -1) {
      element.className += className
    }
  }

  static removeClass(element, className) {
    element.className = element.className.replace(className, '')
  }
}

module.exports = ClassHelper
