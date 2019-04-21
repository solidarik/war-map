export class CookieHelper {
  static getCookie(name) {
    var matches = document.cookie.match(
      new RegExp(
        '(?:^|; )' +
          name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') +
          '=([^;]*)'
      )
    )

    if (!matches) return undefined

    matches = decodeURIComponent(matches[1])

    return matches == 'undefined' ? undefined : matches
  }

  static setCookie(name, value, options) {
    options = options || {}

    var expires = options.expires

    if (typeof expires == 'number' && expires) {
      var d = new Date()
      d.setTime(d.getTime() + expires * 1000)
      expires = options.expires = d
    }
    if (expires && expires.toUTCString) {
      options.expires = expires.toUTCString()
    }

    value = encodeURIComponent(value)

    var updatedCookie = name + '=' + value

    for (var propName in options) {
      updatedCookie += '; ' + propName
      var propValue = options[propName]
      if (propValue !== true) {
        updatedCookie += '=' + propValue
      }
    }

    document.cookie = updatedCookie
  }

  static deleteCookie(name) {
    setCookie(name, '', {
      expires: -1
    })
  }
}
