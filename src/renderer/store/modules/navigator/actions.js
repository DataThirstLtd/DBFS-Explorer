import axios from 'axios'
import appConfig from '@/app.config.js'
import helper from '@/assets/helper.js'
import AddBlock from '@/threads/AddBlock'

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
  addBlockJob: async function (context, { url, token, handle, chunks, transferId, targetPath, endpoint }) {
    const addBlock = new AddBlock()
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
  },
  createList: function (context, { options, path }) {
    // Get target working directory path where file will be created
    const targetPath = path[path.length - 1] === '/' ? path.slice(0, -1) : path
    // Iterate through files selected
    if (options.list.length > 0) {
      // Get domain info
      const url = helper.getUrlFromDomain(context.getters.getDomain)
      const token = context.getters.getToken
      // Close file selection dialog
      context.dispatch('closeDialog', { name: 'dataTransfer' })
      // Iterate through file selected
      options.list.forEach(({ file, selected }) => {
        if (selected) {
          // Generate Uniqid for data transfer (upload/download)
          const id = uniqid()
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
              // Upload/write base64 string into new file as 1 MB chunks
              const chunks = base64String.match(/.{1,512000}/g)
              // Add new thread worker or job into thread pool
              // NOTE: By default 2 threads will be spawned. User can configure this any time.
              // Threads will be created based on CPU cores
              context.dispatch('addBlockJob', {
                url: url,
                token: token,
                handle: data.handle,
                chunks: chunks,
                transferId: id,
                targetPath: targetPath,
                endpoint: appConfig.ENDPOINTS.addBlock
              })
            })
          })
        }
      })
    }
  }
}
