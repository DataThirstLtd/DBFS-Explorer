'use strict'

import buildMenu from './build-menu.js'
import messageBox from './message-box.js'

function getNameFromFileEntry (item) {
  if (item && item.constructor === {}.constructor && 'path' in item) {
    return item.path.split('/').reverse()[0]
  }

  return ''
}

export {
  buildMenu,
  messageBox,
  getNameFromFileEntry
}
