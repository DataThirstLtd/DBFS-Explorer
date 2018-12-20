export default {
  setRootFs: function (state, data) {
    state.rootFs = data
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
  }
}
