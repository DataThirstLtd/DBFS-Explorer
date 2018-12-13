import axios from 'axios'
import appConfig from '@/app.config.js'

const isUrl = require('is-url')

export default {
  login: function (context, data) {
    const domainOriginal = data.domain
    const token = data.token
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
        `https://${domain}.azuredatabricks.net/${appConfig.ENDPOINTS.list}?path=/`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      ).then((res) => {
        if (res.data && 'files' in res.data &&
          res.data.files.constructor === [].constructor) {
          context.dispatch('updateRootFs', res.data.files)
        }
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
        data.callback(null)
      }).catch((err) => {
        console.log(err)
        context.dispatch('authState', false)
        data.callback(err)
      })
    } else {
      data.callback(new Error('Invalid Credentials'))
    }
  }
}
