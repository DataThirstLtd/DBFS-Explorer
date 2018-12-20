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
  }
}
