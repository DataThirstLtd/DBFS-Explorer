export default {
  getDomain: function (state) {
    return state.domain
  },
  getToken: function (state) {
    return state.token
  },
  doesAuthDataExists: function (state, getters) {
    return Boolean(getters.getToken && getters.getDomain)
  }
}
