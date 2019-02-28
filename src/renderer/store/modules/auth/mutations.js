/**
 * Mutations for authentication.
 */

import appConfig from '@/app.config.js'

export default {
  /**
   * Set (String) domain.
   */
  setDomain: function (state, domain) {
    state.domain = domain
  },

  /**
   * Set (String) bearer token.
   */
  setToken: function (state, token) {
    state.token = token
  },

  /**
   * Set (Array) credentials from SQL
   */
  setCredentialsFromSql: function (state, data) {
    if (data &&
      data.constructor === [].constructor &&
      data.length > 0
    ) {
      data.forEach((item) => {
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

  /**
   * Set (String) credentials
   */
  setCredentials: function (state, { domain, token }) {
    state.domain = domain
    state.token = token
  },

  /**
   * Set (Object) default auth states.
   */
  resetAuthStates: function (state) {
    state = Object.assign({}, appConfig.initialAuthStates)
  }
}
