'use strict'

import { remote } from 'electron'

function index (props) {
  const {
    type,
    title,
    message,
    detail,
    pButtonLabel,
    nButtonLabel,
    pButtonCallback,
    nButtonCallback
  } = props

  if (
    type &&
    typeof type === 'string' &&
    title &&
    typeof title === 'string' &&
    message &&
    typeof message === 'string' &&
    pButtonCallback &&
    typeof pButtonCallback === 'function'
  ) {
    const selection = remote.dialog.showMessageBox(
      remote.getCurrentWindow(),
      {
        type,
        title,
        message,
        detail,
        buttons: [
          pButtonLabel && typeof pButtonLabel === 'string' ? pButtonLabel : 'Yes',
          nButtonLabel && typeof nButtonLabel === 'string' ? nButtonLabel : 'No'
        ]
      }
    )
    
    if (!selection) {
      pButtonCallback()
    } else if (nButtonCallback && typeof nButtonCallback === 'function') {
      nButtonCallback()
    }
  }
}

export default index
