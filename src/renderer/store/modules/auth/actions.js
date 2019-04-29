/**
 * Actions for authentication.
 */

import axios from 'axios'
import appConfig from '@/app.config.js'

export default {
  /**
   * Login with domain and bearer token.
   * For successful authentication, this login action will try to fetch list of folders and files.
   */
  login: function (context, data) {
    const { domain, token } = data
    return axios.get(
      `${domain}/${appConfig.ENDPOINTS.list}?path=/`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Access-Control-Allow-Origin': '*'
        }
      }
    ).then((res) => {
      if (res.status === 200) {
        context.dispatch('writeSql', {
          table: 'user',
          keys: 'key, value',
          values: `"domain", "${domain}"`
        })
        context.dispatch('writeSql', {
          table: 'user',
          keys: 'key, value',
          values: `"token", "${token}"`
        })
        context.dispatch('updateCredentials', { domain, token })
        context.dispatch('authState', true)
      }
    })
  },

  /**
   * Load credentials on request.
   * This loadCredentials action will return an async promise for domain and bearer token.
   */
  loadCredentials: async function (context) {
    return new Promise((resolve, reject) => {
      resolve({
        domain: context.getters.getDomain,
        token: context.getters.getToken
      })
    })
  },

  /**
   * Update auth credential data.
   */
  updateCredentials: function (context, data) {
    context.commit('setCredentials', data)
  },

  /**
   * Logout or disconnect from server.
   * This will dispatch cleanup actions across the application.
   */
  disconnect: async function (context) {
    return new Promise((resolve, reject) => {
      context.dispatch('clearConfigStates')
      context.dispatch('clearNavigatorInitialStates')
      context.dispatch('clearAuthStates')
      resolve()
    })
  },

  /**
   * Clear authentication states
   */
  clearAuthStates: function (context) {
    context.commit('resetAuthStates')
  }
}
