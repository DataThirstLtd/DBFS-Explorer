/**
 * Getters for authentication.
 */

export default {
  /**
   * Get (String) domain
   */
  getDomain: function (state) {
    return state.domain
  },

  /**
   * Get (String) token
   */
  getToken: function (state) {
    return state.token
  },

  /**
   * Get (Boolean) state of authentication credentials
   */
  doesAuthDataExists: function (state, getters) {
    return Boolean(getters.getToken && getters.getDomain)
  }
}
