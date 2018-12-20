import axios from 'axios'
import appConfig from '@/app.config.js'
import helper from '@/assets/helper.js'

export default {
  login: function (context, data) {
    console.log(data)
    const domain = helper.filterDomainFromUrl(data.domain)
    const token = data.token
    return axios.get(
      `https://${domain}.azuredatabricks.net/${appConfig.ENDPOINTS.list}?path=/`,
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
        context.dispatch('authState', true)
      }
    })
  }
}
