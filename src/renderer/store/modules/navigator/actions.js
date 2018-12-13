export default {
  updateRootFs: function (context, data) {
    if (
      data && data.constructor === {}.constructor
    ) {
      context.commit('setRootFs', data)
    }
  }
}
