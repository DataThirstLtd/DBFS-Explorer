import axios from 'axios'
import appConfig from '@/app.config.js'
import helper from '@/assets/helper.js'
import TransferActivity from '@/threads/TransferActivity'

const transferActivity = new TransferActivity()
const nodePath = require('path')
const base64 = require('file-base64')

export default {
  getStatus: function (context, data) {
    const url = helper.getUrlFromDomain(context.getters.getDomain)
    const token = context.getters.getToken
    return axios.get(
      `${url}/${appConfig.ENDPOINTS.getStatus}?path=${data.item}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    )
  },
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
  fetchSelection: function (context, { path }) {
    const url = helper.getUrlFromDomain(context.getters.getDomain)
    const token = context.getters.getToken
    context.commit('setFetchWait')
    return axios.get(
      `${url}/${appConfig.ENDPOINTS.list}?path=${path}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    ).then(({ data }) => {
      context.commit('clearFetchWait')
      if (!data) {
        context.dispatch('openDialog', {
          name: 'alert',
          options: {
            title: 'Unable to fetch files',
            message: 'Unable to fetch files from the server. Please try again later!'
          }
        })
        return
      }
      if (data.files) {
        context.commit('setSelection', data.files)
      }
    }).catch((err) => {
      context.dispatch('fetchSelection', { path: path.split(nodePath.basename(path))[0] })
      context.dispatch('openDialog', {
        name: 'alert',
        options: {
          title: `Failed!`,
          message: `Unable to fetch ${path}! ${err.message}`
        }
      })
    })
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
  addJob: async function (context, data) {
    const addTimer = setInterval(function () {
      transferActivity.addJob(data)
      transferActivity.on('done', function (data) {
        context.dispatch('doneTransfer', data)
      })
      transferActivity.on('progress', function (data) {
        context.dispatch('updateJobProgress', data)
      })
      transferActivity.on('abort', function (data) {
        context.dispatch('abortTransfer', data)
      })
      clearInterval(addTimer)
    }, 2000)
  },
  prepareUpload: function (context, { options, path }) {
    // Get target working directory path where file will be created
    const targetPath = context.getters.getCurrentPath
    // Iterate through files selected
    if (options.list.length > 0) {
      // Get domain info
      const url = helper.getUrlFromDomain(context.getters.getDomain)
      const token = context.getters.getToken
      // Close file selection dialog
      context.dispatch('closeDialog', { name: 'dataTransfer' })
      // Iterate through file selected
      options.list.forEach(({ file, selected, id }) => {
        if (selected) {
          // Update bottom sheet transfer list
          context.dispatch('updateDataTransferList', {
            id: id,
            type: 1,
            file: file,
            progress: 0,
            done: false
          })
          // Encode data into base64 string
          base64.encode(file.path, function (err, base64String) {
            if (err) {
              return
            }
            // Create data hanlde
            axios.post(
              `${url}/${appConfig.ENDPOINTS.create}`,
              {
                path: `${targetPath}${file.name}`,
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
              // Convert base64 string into small chunks
              const chunks = base64String.match(new RegExp('.{1,' + 256000 + '}', 'g'))
              // Add new thread worker or job into thread pool
              // NOTE: By default 2 threads will be spawned. User can configure this any time.
              // Threads will be created based on CPU cores
              context.dispatch('addJob', {
                url: url,
                token: token,
                handle: data.handle,
                chunks: chunks,
                transferId: id,
                targetPath: targetPath,
                endpoint: appConfig.ENDPOINTS.addBlock,
                type: 1
              })
            }).catch((error) => {
              console.log(error)
            })
          })
        }
      })
    }
  },
  prepareDownload: function (context, { options }) {
    console.log(options)
    if (options.list.length > 0) {
      const url = helper.getUrlFromDomain(context.getters.getDomain)
      const token = context.getters.getToken
      context.dispatch('closeDialog', { name: 'dataTransfer' })
      options.list.forEach(({ file, selected, id }) => {
        if (selected) {
          context.dispatch('updateDataTransferList', {
            id: id,
            type: 0,
            file: file,
            progress: 0,
            done: false
          })
          context.dispatch('addJob', {
            url: url,
            token: token,
            transferId: id,
            file: file,
            targetPath: '',
            endpoint: appConfig.ENDPOINTS.read,
            type: 0
          })
        }
      })
    }
  },
  cancelTransfer: function (context, data) {
    transferActivity.cancelJob(data)
  },
  setPrevPath: function (context, { path }) {
    context.commit('setPrevPath', path)
  },
  setCurrentPath: function (context, { path }) {
    context.commit('setCurrentPath', path)
  }
}
