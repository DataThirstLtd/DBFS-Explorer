'use strict'

import { remote } from 'electron'

function index (data) {
  const menu = new remote.Menu()
  if (data && Array.isArray(data)) {
    data.forEach(item => {
      if (
        item &&
        item.constructor === {}.constructor &&
        'label' in item &&
        typeof item.label === 'string' &&
        'id' in item &&
        typeof item.id === 'string' &&
        'callback' in item &&
        typeof item.callback === 'function'
      ) {
        menu.append(
          new remote.MenuItem({
            id: item.id,
            label: item.label,
            click: item.callback,
            enabled: 'enabled' in item && typeof item.enabled === 'boolean'
              ? item.enabled
              : true
          })
        )
      }
    })
  }

  return menu
}

export default index
