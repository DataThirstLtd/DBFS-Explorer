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
  setFetchWait: function (state) {
    state.fetchWait = true
  },
  clearFetchWait: function (state) {
    state.fetchWait = false
  }
}
