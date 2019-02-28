/**
 * Mutations for application User interface configuration.
 */

import appConfig from '@/app.config.js'

export default {
  /**
   * Set (String) current platform
   */
  setPlatform: function (state, platform) {
    state.platform = platform
  },

  /**
   * Set (Array) application settings
   */
  setSettings: function (state, data) {
    if (data && data.constructor === [].constructor) {
      state.settings = Object.assign([], data)
    }
  },

  /**
   * Set (Object) new settings by append
   */
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

  /**
   * Set (Object) snack bar configuration
   */
  setInfoSnackbar: function (state, data) {
    state.info.snackbar.title = data.title || ''
    state.info.snackbar.message = data.message || ''
    state.info.snackbar.status = data.status || false
  },

  /**
   * Set (Boolean) authentication state whether logged-in or not.
   */
  setAuthState: function (state, status) {
    state.loggedIn = status
  },

  /**
   * Set (Boolean) state show of a specified dialog.
   */
  setActiveDialog: function (state, { name, options }) {
    if (name && name in state.dialogs) {
      state.dialogs[`${name}`].active = true
      state.dialogs[`${name}`].options = options || null
      state.dialogs.count += 1
    }
  },

  /**
   * Set (Boolean) hide state of specified dialog.
   * This will also clears the dialog options/data
   */
  setInertDialog: function (state, { name }) {
    if (name && name in state.dialogs) {
      state.dialogs[`${name}`].active = false
      state.dialogs[`${name}`].options = null
      state.dialogs.count -= 1
    }
  },

  /**
   * Set (Boolean) state show of drag banner/info graphics.
   */
  setDragActive: function (state) {
    if (!state.drag) {
      state.drag = true
    }
  },

  /**
   * Set (Boolean) state hide of drag banner/info graphics.
   */
  setDragInert: function (state) {
    if (state.drag) {
      state.drag = false
    }
  },

  /**
   * Set (Boolean) state unchecked of specified drag - dropped transfer item.
   */
  setInertDataTransferItem: function (state, { index }) {
    if (
      state.dialogs.dataTransfer.options.list.length > 0 &&
      state.dialogs.dataTransfer.options.list[index].selected
    ) {
      state.dialogs.dataTransfer.options.list[index].selected = false
    }
  },

  /**
   * Set (Boolean) state checked of specified drag - dropped transfer item.
   */
  setActiveDataTransferItem: function (state, { index }) {
    if (
      state.dialogs.dataTransfer.options.list.length > 0 &&
      !state.dialogs.dataTransfer.options.list[index].selected
    ) {
      state.dialogs.dataTransfer.options.list[index].selected = true
    }
  },

  /**
   * Set (Boolean) state started of wait listed job in queue.
   * This will indicate the user interface that job has started.
   */
  setStartWaitListJob: function (state, { transferId }) {
    const targetIndex = state.dialogs.transferState.list.findIndex(x => x.transferId === transferId)
    if (targetIndex > -1) {
      state.dialogs.transferState.list[targetIndex].started = true
    }
  },

  /**
   * Set (Boolean) state waiting of wait listed job in queue.
   * This will indicate the user interface that job is in wait list.
   */
  setWaitListJob: function (state, data) {
    state.dialogs.transferState.list.push(data)
  },

  /**
   * Set (Boolean) state finished/done of job in running queue.
   * This will indicate the user interface that job is finished successfully.
   */
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

  /**
   * Set (Boolean) state abort of job in running queue.
   * This will indicate the user interface that job is aborted.
   */
  setAbortTransfer: function (state, { transferId }) {
    const index = state.dialogs.transferState.list.map(item => { return item.transferId }).indexOf(transferId)
    index > -1 && (state.dialogs.transferState.list[index].abort = true)
  },

  /**
   * Set (String) progress of specified job.
   */
  setJobProgress: function (state, { transferId, progress }) {
    console.log(transferId, progress)
    const list = Object.assign([], state.dialogs.transferState.list)
    const targetIndex = list.findIndex(x => x.transferId === transferId)
    targetIndex > -1 && (state.dialogs.transferState.list[targetIndex].progress = progress)
  },

  /**
   * Set (String) specified id of transfer list to be cleared.
   */
  clearTransferListItem: function (state, { transferId }) {
    const index = state.dialogs.transferState.list.map(item => { return item.transferId }).indexOf(transferId)
    index > -1 && state.dialogs.transferState.list.splice(index, 1)
  },

  /**
   * Set (Object) default configuration states.
   */
  resetConfigStates: function (state) {
    state = Object.assign({}, appConfig.initialConfigStates)
    console.log(state)
  }
}
