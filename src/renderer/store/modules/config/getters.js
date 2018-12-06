export default {
  getPlatform: function (state) {
    return state.platform
  },
  getInfoSnackbarObject: function (state) {
    return state.info.snackbar
  },
  getInfoSnackbarStatus: function (state) {
    return state.info.snackbar.status
  }
}
