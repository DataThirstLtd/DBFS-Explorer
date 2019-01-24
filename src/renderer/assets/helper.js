'use strict'

const nodePath = require('path')
const filesize = require('filesize')

export default {
  getRegXObject: function (data) {
    return {
      azure: /^https:\/\/?.*\.azuredatabricks\.net$/,
      aws: /^https:\/\/.*\.cloud\.databricks\.com$/,
      domain: /(?:http[s]*:\/\/)*(.*?)\.(?=[^/]*\..{2,5})/
    }
  },
  hasSomeParentTheClass: function (element, classname) {
    if (element.className && element.className.split(' ').indexOf(classname) >= 0) {
      return true
    }
    return element.parentNode && this.hasSomeParentTheClass(element.parentNode, classname)
  },
  getReadableFileSize: function ({ size }) {
    if (size) {
      return filesize(size, {base: 10})
    }
  },
  getParentPath: function (data) {
    if (data && 'path' in data && data.path) {
      return data.path.split(nodePath.basename(data.path))[0] || data.path
    }
    return ''
  }
}
