import appConfig from '@/app.config.js'

export default {
  setPlatform: function (state, platform) {
    state.platform = platform
  },
  setSettings: function (state, data) {
    if (data && data.constructor === [].constructor) {
      state.settings = Object.assign([], data)
    }
  },
  setSettingsEntry: function (state, { key, value }) {
    const index = state.settings.findIndex(
      x => x.key === key
    )
    if (index > -1) {
      state.settings[index].value = value
    } else {
      state.settings.push({ key, value })
    }
  },
  setInfoSnackbar: function (state, data) {
    state.info.snackbar.title = data.title || ''
    state.info.snackbar.message = data.message || ''
    state.info.snackbar.status = data.status || false
  },
  setAuthState: function (state, status) {
    state.loggedIn = status
  },
  setActiveDialog: function (state, { name, options }) {
    if (name && name in state.dialogs) {
      state.dialogs[`${name}`].active = true
      state.dialogs[`${name}`].options = options || null
    }
  },
  setInertDialog: function (state, { name }) {
    if (name && name in state.dialogs) {
      state.dialogs[`${name}`].active = false
      state.dialogs[`${name}`].options = null
    }
  },
  setDragActive: function (state) {
    if (!state.drag) {
      state.drag = true
    }
  },
  setDragInert: function (state) {
    if (state.drag) {
      state.drag = false
    }
  },
  setInertDataTransferItem: function (state, { index }) {
    if (
      state.dialogs.dataTransfer.options.list.length > 0 &&
      state.dialogs.dataTransfer.options.list[index].selected
    ) {
      state.dialogs.dataTransfer.options.list[index].selected = false
    }
  },
  setActiveDataTransferItem: function (state, { index }) {
    if (
      state.dialogs.dataTransfer.options.list.length > 0 &&
      !state.dialogs.dataTransfer.options.list[index].selected
    ) {
      state.dialogs.dataTransfer.options.list[index].selected = true
    }
  },
  setStartWaitListJob: function (state, { transferId }) {
    const targetIndex = state.dialogs.transferState.list.findIndex(x => x.transferId === transferId)
    if (targetIndex > -1) {
      state.dialogs.transferState.list[targetIndex].started = true
    }
  },
  setWaitListJob: function (state, data) {
    state.dialogs.transferState.list.push(data)
  },
  setDoneTransfer: function (state, { transferId }) {
    const list = Object.assign([], state.dialogs.transferState.list)
    const targetIndex = list.findIndex(x => x.transferId === transferId)
    targetIndex > -1 && (state.dialogs.transferState.list[targetIndex].done = true)
  },
  /* setAbortTransfer: function (state, { transferId }) {
    const list = Object.assign([], state.dialogs.transferState.list)
    const targetIndex = list.findIndex(x => x.transferId === transferId)
    console.log('setAbortTransfer', targetIndex)
    targetIndex > -1 && ()
    console.log('setAbortTransfer abort::', state.dialogs.transferState.list[targetIndex].abort)
  }, */
  setAbortTransfer: function (state, { transferId }) {
    const index = state.dialogs.transferState.list.map(item => { return item.transferId }).indexOf(transferId)
    index > -1 && (state.dialogs.transferState.list[index].abort = true)
  },
  setJobProgress: function (state, { transferId, progress }) {
    console.log(transferId, progress)
    const list = Object.assign([], state.dialogs.transferState.list)
    const targetIndex = list.findIndex(x => x.transferId === transferId)
    targetIndex > -1 && (state.dialogs.transferState.list[targetIndex].progress = progress)
  },
  resetConfigStates: function (state) {
    state = Object.assign({}, appConfig.initialConfigStates)
    console.log(state)
  },
  clearTransferListItem: function (state, { transferId }) {
    const index = state.dialogs.transferState.list.map(item => { return item.transferId }).indexOf(transferId)
    index > -1 && state.dialogs.transferState.list.splice(index, 1)
  }
}
