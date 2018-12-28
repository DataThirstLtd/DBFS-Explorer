export default {
  getPlatform: function (state) {
    return state.platform
  },
  getInfoSnackbarObject: function (state) {
    return state.info.snackbar
  },
  getInfoSnackbarStatus: function (state) {
    return state.info.snackbar.status
  },
  isLoggedIn: function (state) {
    return state.loggedIn
  },
  getListDataTransfer: function (state) {
    return state.dialogs.dataTransfer.options.list
  },
  getDialogs: function (state) {
    return state.dialogs
  }
}
