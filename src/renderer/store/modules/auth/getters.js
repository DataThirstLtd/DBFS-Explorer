export default {
  getToken: function (state) {
    return state.token
  },
  isLoggedIn: function (state, getters) {
    return Boolean(getters.getToken)
  }
}
