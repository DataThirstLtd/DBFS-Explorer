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
  },

  /**
   * Get (String) selected items/paths from file navigator
   */
  getSelectedItems: function (state) {
    return state.selectedItem
  },

  /**
   * Get (Array) list of items (Files/Folders) from file navigator
   */
  getSelection: function (state) {
    return state.selection
  }
}
