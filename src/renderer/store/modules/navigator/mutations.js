/**
 * Mutations for application file navigator/explorer.
 */

import appConfig from '@/app.config.js'

export default {
  /**
   * Set (Array) root folder
   */
  setRootFs: function (state, data) {
    state.rootFs = data
  },

  /**
   * Set (String) previous path
   */
  setPrevPath: function (state, path) {
    state.prevPath = path
  },

  /**
   * Set (Array) current selection folder empty.
   */
  setSelectionEmpty: function (state) {
    state.selection = []
  },

  /**
   * Set (Array) current selection folder
   */
  setSelection: function (state, selection) {
    state.selection = selection
  },

  /**
   * Set (Boolean) state folder to waiting/loading.
   */
  setFetchWait: function (state) {
    state.fetchWait = true
  },

  /**
   * Set (Boolean) state folder to ready.
   */
  clearFetchWait: function (state) {
    state.fetchWait = false
  },

  /**
   * Append (String) selected path.
   */
  appendSelectedPath: function (state, path) {
    state.selectedItem.push(path)
  },

  /**
   * Delete (String) selected path.
   */
  deleteSelectedPath: function (state, index) {
    typeof index === 'number' && state.selectedItem.splice(index, 1)
  },

  /**
   * Set (String) selected path.
   */
  setSelectedPath: function (state, path) {
    state.selectedItem = [path]
  },

  /**
   * Set (String) selected path clear.
   */
  clearSelectedPath: function (state) {
    state.selectedItem = []
  },

  /**
   * Push (String) navigation stack.
   * Navigation stacks used to generate relative paths of selected folder.
   */
  pushNavStack: function (state, name) {
    state.navStack.push(name)
  },

  /**
   * Pop (String) navigation stack.
   * Navigation stacks used to generate relative paths of selected folder.
   */
  popNavStack: function (state, name) {
    state.navStack.pop()
  },

  /**
   * Clear (String) navigation stack.
   * Navigation stacks used to generate relative paths of selected folder.
   */
  clearNavStack: function (state) {
    state.navStack = []
  },

  /**
   * Clear (String) File navigator states.
   */
  resetNavigatorStates: function (state) {
    state = Object.assign({}, appConfig.initialNavigatorStates)
  }
}
