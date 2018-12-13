export default {
  setRootFs: function (state, data) {
    state.rootFs = Object.assign({}, data)
  }
}
