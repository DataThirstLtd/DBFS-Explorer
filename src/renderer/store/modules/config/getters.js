/**
 * Getters for application User interface configuration.
 */

export default {
  /**
   * Get (String) current OS platform string
   */
  getPlatform: function (state) {
    return state.platform
  },

  /**
   * Get (Object) snack bar object data
   */
  getInfoSnackbarObject: function (state) {
    return state.info.snackbar
  },

  /**
   * Get (Boolean) status of snack bar whether or not active
   */
  getInfoSnackbarStatus: function (state) {
    return state.info.snackbar.status
  },

  /**
   * Get (Boolean) status whether or not logged-in.
   * A session is treated as "logged-in" when there is valid domain and bearer token.
   */
  isLoggedIn: function (state) {
    return state.loggedIn
  },

  /**
   * Get (Array) list of transfer states (downloads and uploads)
   */
  getTransferDataList: function (state) {
    return state.dialogs.dataTransfer.options.list
  },

  /**
   * Get (Array) list of transfer states (downloads and uploads)
   */
  getTransferStateList: function (state) {
    return state.dialogs.transferState.list
  },

  /**
   * Get (Object) all dialogs and their current configurations
   */
  getDialogs: function (state) {
    return state.dialogs
  },

  /**
   * Get (Object) application settings
   */
  getSettings: function (state) {
    return state.settings
  },

  /**
   * Get (Boolean) if any dialog is opened
   */
  getDialogsCount: function (state) {
    return Boolean(state.dialogs.count > 0)
  }
}
