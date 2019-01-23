export default {
  getRootFs: function (state) {
    return state.rootFs
  },
  getSelection: function (state) {
    return state.selection
  },
  getSelectedItem: function (state) {
    return state.selectedItem
  },
  getPrevPath: function (state) {
    return state.prevPath
  },
  getCurrentPath: function (state) {
    return `/${state.navStack.join('/')}`
  }
}
