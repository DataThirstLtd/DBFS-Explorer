import axios from 'axios'
import appConfig from '@/app.config.js'

export default {
  login: function (context, data) {
    const { domain, token } = data
    return axios.get(
      `${domain}/${appConfig.ENDPOINTS.list}?path=/`,
      {
        headers: {
          'Authorization': `Bearer ${token}`
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
  loadCredentials: async function (context) {
    return new Promise((resolve, reject) => {
      resolve({
        domain: context.getters.getDomain,
        token: context.getters.getToken
      })
    })
  },
  updateCredentials: function (context, data) {
    context.commit('setCredentials', data)
  },
  disconnect: async function (context) {
    return new Promise((resolve, reject) => {
      context.dispatch('clearConfigStates')
      context.dispatch('clearNavigatorStates')
      context.dispatch('clearAuthStates')
      resolve()
    })
  },
  clearAuthStates: function (context) {
    context.commit('resetAuthStates')
  }
}
