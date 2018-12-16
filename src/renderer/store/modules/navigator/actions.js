import axios from 'axios'
import appConfig from '@/app.config.js'
import helper from '@/assets/helper.js'

export default {
  updateRootFs: function (context, data) {
    if (
      data && data.constructor === [].constructor
    ) {
      context.commit('setRootFs', data)
    }
  },
  fetchRootFs: function (context) {
    const url = helper.getUrlFromDomain(context.getters.getDomain)
    const token = context.getters.getToken
    return axios.get(
      `${url}/${appConfig.ENDPOINTS.list}?path=/`,
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    ).then((res) => {
      if (res.data && res.data.files) {
        context.dispatch('updateRootFs', res.data.files)
      }
    })
  },
  clearSelection: function (context) {
    context.commit('setSelectionEmpty')
  },
  fetchSelection: function (context, selection) {
    const url = helper.getUrlFromDomain(context.getters.getDomain)
    const token = context.getters.getToken
    if (selection && selection.is_dir && selection.path) {
      return axios.get(
        `${url}/${appConfig.ENDPOINTS.list}?path=${selection.path}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      ).then((res) => {
        if (res.data && res.data.files) {
          console.log(res.data.files)
          context.commit('setSelection', res.data.files)
        }
      })
    }
  }
}
