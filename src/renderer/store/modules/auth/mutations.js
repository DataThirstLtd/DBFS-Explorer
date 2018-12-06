export default {
  setDomain: function (state, domain) {
    state.domain = domain
  },
  setToken: function (state, token) {
    state.token = token
  },
  loadUser: function (state, settings) {
    settings.forEach((setting) => {
      state[`${setting.key}`] = `${setting.value}`
    })
    state.tryLogin = this.getters.doesAuthDataExists
  }
}
