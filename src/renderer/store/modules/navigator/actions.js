import axios from 'axios'
import appConfig from '@/app.config.js'
import helper from '@/assets/helper.js'

const base64 = require('file-base64')
const uniqid = require('uniqid')

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
  addBlock: async function (context, { handle, base64, transferId, targetPath }) {
    const url = helper.getUrlFromDomain(context.getters.getDomain)
    const token = context.getters.getToken
    const promise = new Promise((resolve, reject) => {
      axios.post(
        `${url}/${appConfig.ENDPOINTS.addBlock}`,
        {
          handle: handle,
          data: base64
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
        resolve()
        /* context.dispatch('clearSelection')
        context.dispatch('fetchSelection', {
          path: targetPath,
          is_dir: true
        })
        context.dispatch('fetchRootFs')
        context.dispatch('doneTransfer', { id: transferId }) */
      }).catch((error) => {
        console.error(error)
        reject(error)
      })
    })
    await promise
    return promise
  },
  createList: function (context, { options, path }) {
    const targetPath = path[path.length - 1] === '/' ? path.slice(0, -1) : path
    if (options.list.length > 0) {
      const url = helper.getUrlFromDomain(context.getters.getDomain)
      const token = context.getters.getToken
      context.dispatch('closeDialog', { name: 'dataTransfer' })
      options.list.forEach(({ file, selected }) => {
        if (selected) {
          console.log('+++++++++++++++++++++')
          console.log(file.path)
          console.log(file.name)
          console.log('---------------------')
          const id = uniqid()
          context.dispatch('updateDataTransferList', {
            id: id,
            type: 1,
            file: file,
            progress: 0,
            done: false
          })
          base64.encode(file.path, function (err, base64String) {
            if (err) {
              return
            }
            console.log('encoded to base64')
            axios.post(
              `${url}/${appConfig.ENDPOINTS.create}`,
              {
                path: `${targetPath}/${file.name}`,
                overwrite: true
              },
              {
                headers: {
                  'Authorization': `Bearer ${token}`
                }
              }
            ).then(({ status, data }) => {
              if (status !== 200) {
                // Report message
                return
              }
              console.log(data)
              const chunks = base64String.match(/.{1,1024}/g)
              context.dispatch('addBlock', {
                handle: data.handle,
                base64: chunks[0],
                transferId: id,
                targetPath: targetPath
              }).then(() => {
                console.log('batman')
              }).catch((error) => {
                console.log('joker', error)
              })
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
