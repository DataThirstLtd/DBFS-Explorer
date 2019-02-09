/**
 * Getters for application file navigator/explorer.
 */

export default {
  /**
   * Get (Array) root folder.
   */
  getRootFs: function (state) {
    return state.rootFs
  },

  /**
   * Get (String) File navigator current working path.
   */
  getCurrentPath: function (state) {
    return `/${state.navStack.join('/')}`
  }
}
