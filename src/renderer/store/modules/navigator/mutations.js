export default {
  setRootFs: function (state, data) {
    state.rootFs = data
  },
  setSelectionEmpty: function (state) {
    state.selection = {}
  },
  setSelection: function (state, selection) {
    state.selection = selection
  }
}
