import appConfig from '@/app.config.js'

export default {
  setDomain: function (state, domain) {
    state.domain = domain
  },
  setToken: function (state, token) {
    state.token = token
  },
  setUser: function (state, data) {
    console.log(data)
    if (data &&
      data.constructor === [].constructor &&
      data.length > 0
    ) {
      data.forEach((item) => {
        console.log('setUser -> iterate -> item:', item)
        if (
          item && item.constructor === {}.constructor &&
          'key' in item && 'value' in item && item.key
        ) {
          if (item.key in state) {
            state[item.key] = item.value
          }
        }
      })
    }
    state.onAuthReady = true
  },
  setCredentials: function (state, { domain, token }) {
    state.domain = domain
    state.token = token
  },
  resetAuthStates: function (state) {
    state = Object.assign({}, appConfig.initialAuthStates)
    console.log('resetAuthStates', state)
  }
}
