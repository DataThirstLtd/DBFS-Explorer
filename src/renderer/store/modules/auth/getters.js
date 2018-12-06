export default {
  getUrl: function (state) {
    return state.url
  },
  getToken: function (state) {
    return state.token
  },
  isLoggedIn: function (state, getters) {
    return Boolean(getters.getToken && getters.getUrl)
  }
}
