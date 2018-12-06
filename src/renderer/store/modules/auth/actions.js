import axios from 'axios'
import appConfig from '@/app.config.js'

const isUrl = require('is-url')

export default {
  login: function (context, callback) {
    const url = context.getters.getUrl
    const token = context.getters.getToken

    if (isUrl(url) && token) {
      console.log(appConfig.ENDPOINTS.get_status)
      axios.get(
        `${url}/${appConfig.ENDPOINTS.get_status}?path=/`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      ).then((res) => {
        console.log(res)
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
