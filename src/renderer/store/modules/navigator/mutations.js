export default {
  setRootFs: function (state, data) {
    state.rootFs = data
  },
  setPrevPath: function (state, path) {
    state.prevPath = path
  },
  setSelectionEmpty: function (state) {
    state.selection = []
  },
  setSelection: function (state, selection) {
    state.selection = selection
  },
  setFolderEmpty: function (state, { valid, path }) {
    state.folderEmpty.valid = valid
    state.folderEmpty.path = path
  },
  clearFolderEmpty: function (state, { valid, path }) {
    state.folderEmpty = valid || false
    state.folderEmpty.path = path || ''
  },
  setFetchWait: function (state) {
    state.fetchWait = true
  },
  clearFetchWait: function (state) {
    state.fetchWait = false
  },
  setSelectedItem: function (state, path) {
    state.selectedItem = path
  },
  clearSelectedItem: function (state) {
    state.selectedItem = ''
  },
  pushNavStack: function (state, name) {
    state.navStack.push(name)
  },
  popNavStack: function (state, name) {
    state.navStack.pop()
  },
  clearNavStack: function (state) {
    state.navStack = []
  }
}
