import axios from 'axios'
import appConfig from '@/app.config.js'
import helper from '@/assets/helper.js'

const base64 = require('file-base64')

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
      context.commit('setFetchWait')
      return axios.get(
        `${url}/${appConfig.ENDPOINTS.list}?path=${selection.path}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      ).then((res) => {
        if (res.data && res.data.files) {
          context.commit('setSelection', res.data.files)
          context.commit('clearFetchWait')
          context.commit('clearFolderEmpty')
        } else if (selection.path !== '/') {
          context.commit('setSelection', [])
          context.commit('setFolderEmpty', {
            valid: true,
            path: selection.path
          })
          context.commit('clearFetchWait')
        }
        context.dispatch('clearItem')
      }).catch(() => {
        context.commit('clearFetchWait')
      })
    }
  },
  createNewFolder: function (context, { path, folderName }) {
    const url = helper.getUrlFromDomain(context.getters.getDomain)
    const token = context.getters.getToken
    return axios.post(
      `${url}/${appConfig.ENDPOINTS.mkdirs}`,
      {
        path: `${path === '/' ? path : `${path}/`}${folderName}/`
      },
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    ).then(({status}) => {
      if (status === 200) {
        context.dispatch('clearSelection')
        context.dispatch('fetchSelection', {
          path: path,
          is_dir: true
        })
        context.dispatch('fetchRootFs')
        context.dispatch('closeDialog', { name: 'newFolder' })
      }
    })
  },
  selectItem: function (context, { path }) {
    if (path) {
      context.commit('setSelectedItem', path)
    }
  },
  clearItem: function (context) {
    context.commit('clearSelectedItem')
  },
  deleteSelected: function (context, { path, prevPath }) {
    const url = helper.getUrlFromDomain(context.getters.getDomain)
    const token = context.getters.getToken
    return axios.post(
      `${url}/${appConfig.ENDPOINTS.delete}`,
      {
        path: path,
        recursive: true
      },
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    ).then(({status}) => {
      if (status === 200) {
        context.dispatch('clearSelection')
        context.dispatch('fetchSelection', {
          path: prevPath,
          is_dir: true
        })
        context.dispatch('clearItem')
        context.dispatch('fetchRootFs')
        context.dispatch('closeDialog', { name: 'delete' })
      }
    })
  },
  putList: function (context, { options, path }) {
    const targetPath = path[path.length - 1] === '/' ? path.slice(0, -1) : path
    if (options.list.length > 0) {
      const url = helper.getUrlFromDomain(context.getters.getDomain)
      const token = context.getters.getToken
      options.list.forEach(({ file, selected }) => {
        if (selected) {
          console.log('+++++++++++++++++++++')
          console.log(file.path)
          console.log(file.name)
          console.log('---------------------')
          base64.encode(file.path, function (err, base64String) {
            if (err) {
              return
            }
            axios.post(
              `${url}/${appConfig.ENDPOINTS.put}`,
              {
                path: `${targetPath}/${file.name}`,
                contents: `${base64String}`,
                overwrite: true
              },
              {
                headers: {
                  'Authorization': `Bearer ${token}`
                }
              }
            ).then(({ status }) => {
              if (status !== 200) {
                // Report message
                return
              }
              context.dispatch('clearSelection')
              context.dispatch('fetchSelection', {
                path: targetPath,
                is_dir: true
              })
              context.dispatch('fetchRootFs')
              context.dispatch('closeDialog', { name: 'dataTransfer' })
            }).catch((error) => {
              console.log(error)
              // Report error
            })
          })
        }
      })
    }
  }
}
