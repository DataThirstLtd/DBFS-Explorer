import axios from 'axios'
import appConfig from '@/app.config.js'
import helper from '@/assets/helper.js'

export default {
  login: function (context, data) {
    const domain = helper.filterDomainFromUrl(data.domain)
    const token = data.token
    if (domain && token) {
      axios.get(
        `https://${domain}.azuredatabricks.net/${appConfig.ENDPOINTS.getStatus}?path=/`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      ).then((res) => {
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
        context.dispatch('authState', true)
        if (data.callback) data.callback(null)
      }).catch((err) => {
        console.log(err)
        context.dispatch('authState', false)
        if (data.callback) data.callback(err)
      })
    } else {
      if (data.callback) data.callback(new Error('Invalid Credentials'))
    }
  }
}
