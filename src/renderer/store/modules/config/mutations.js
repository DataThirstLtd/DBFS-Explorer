export default {
  setPlatform: function (state, platform) {
    state.platform = platform
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
  setDataTransferList: function (state, { id, type, file, done }) {
    state.dialogs.transferState.list.push({
      id: id,
      type: type,
      file: file,
      done: done
    })
  },
  setDoneTransfer: function (state, { id }) {
    const list = Object.assign([], state.dialogs.transferState.list)
    const targetIndex = list.findIndex(x => x.id === id)
    console.log(targetIndex, id, state.dialogs.transferState.list[targetIndex])
    targetIndex > -1 && (state.dialogs.transferState.list[targetIndex].done = true)
    console.log(targetIndex, id, state.dialogs.transferState.list[targetIndex])
  }
}
