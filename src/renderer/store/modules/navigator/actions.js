import axios from 'axios'
import appConfig from '@/app.config.js'
import helper from '@/assets/helper.js'
import AddBlock from '@/threads/AddBlock'

const addBlock = new AddBlock()
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
    /* if (selection && selection.is_dir && selection.path) {
      context.commit('setFetchWait')
      return axios.get(
        `${url}/${appConfig.ENDPOINTS.list}?path=${selection.path}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      ).then((res) => {
        console.log('DEBUG:1')
        if (res.data && res.data.files) {
          console.log('DEBUG:2')
          context.commit('setSelection', res.data.files)
          context.commit('clearFetchWait')
          context.commit('clearFolderEmpty')
        } else if (selection.path !== '/') {
          console.log('DEBUG:3')
          context.commit('setSelection', [])
          context.commit('setFolderEmpty', {
            valid: true,
            path: selection.path
          })
          context.commit('clearFetchWait')
        }
        console.log('DEBUG:4')
        context.dispatch('clearItem')
      }).catch((err) => {
        console.log('DEBUG:5')
        console.log(err)
        context.commit('clearFetchWait')
      })
    } */
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
  addBlock: async function (context, { url, token, handle, chunks, transferId, targetPath, endpoint }) {
    const addTimer = setInterval(function () {
      addBlock.addJob({
        url: url,
        token: token,
        chunks: chunks,
        handle: handle,
        id: transferId,
        endpoint: endpoint
      })
      addBlock.on('done', function (data) {
        context.dispatch('doneTransfer', data)
      })
      addBlock.on('progress', function (data) {
        context.dispatch('updateJobProgress', data)
      })
      clearInterval(addTimer)
    }, 2000)
  },
  createList: function (context, { options, path }) {
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
              context.dispatch('addBlock', {
                url: url,
                token: token,
                handle: data.handle,
                chunks: chunks,
                transferId: id,
                targetPath: targetPath,
                endpoint: appConfig.ENDPOINTS.addBlock
              })
            }).catch((error) => {
              console.log(error)
            })
          })
        }
      })
    }
  },
  setPrevPath: function (context, { path }) {
    context.commit('setPrevPath', path)
  },
  setCurrentPath: function (context, { path }) {
    context.commit('setCurrentPath', path)
  }
}
