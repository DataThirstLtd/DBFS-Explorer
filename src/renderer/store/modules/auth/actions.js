import axios from 'axios'
import appConfig from '@/app.config.js'

const isUrl = require('is-url')

export default {
  login: function (context, callback) {
    const domainOriginal = context.getters.getDomain
    const token = context.getters.getToken
    let domain = null
    if (domainOriginal && isUrl(domainOriginal) && domainOriginal.includes('.azuredatabricks.net')) {
      domain = domainOriginal.split('https://').length > 1
        ? domainOriginal.split('https://')[1].split('.azuredatabricks.net')[0]
        : domainOriginal.split('azuredatabricks.net')[0]
    } else {
      domain = domainOriginal.split('https://').length > 1
        ? domainOriginal.split('https://')[1]
        : domainOriginal
    }
    if (domain && token) {
      axios.get(
        `https://${domain}.azuredatabricks.net/${appConfig.ENDPOINTS.get_status}?path=/`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      ).then(() => {
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
        callback(null)
      }).catch((err) => {
        console.log(err)
        callback(err)
      })
    } else {
      callback(new Error('Invalid Credentials'))
    }
  }
}
