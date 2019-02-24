/**
 * Actions for application file navigator/explorer.
 */

import axios from 'axios'
import appConfig from '@/app.config.js'
import TransferActivity from '@/threads/TransferActivity'

const fs = require('fs')
const nodePath = require('path')
const base64 = require('base64-js')
const forEach = require('async-foreach').forEach

// Transfer Activity Handle
let transferActivity = null

export default {
  /**
   * Initialize Transfer Activity.
   * Transfer Activity handles upload and download operations
   */
  initTransferActivity: function (context, { threadCount }) {
    if (transferActivity === null) {
      transferActivity = new TransferActivity({
        threadCount: threadCount
      })
      transferActivity.on('startJob', function ({ transferId }) {
        context.dispatch('startListJob', {
          transferId: transferId
        })
      })
      transferActivity.on('waitListJob', function ({ transferId, type, file, targetPath }) {
        context.dispatch('waitListJob', {
          transferId: transferId,
          type: type,
          file: file,
          started: false,
          progress: 0,
          done: false,
          abort: false,
          targetPath
        })
      })
      transferActivity.on('done', function (data) {
        context.dispatch('doneTransfer', data)
      })
      transferActivity.on('progress', function (data) {
        context.dispatch('updateJobProgress', data)
      })
      transferActivity.on('abort', function (data) {
        context.dispatch('abortTransfer', data)
      })
    }
  },

  /**
   * Get status of DBFS remote server.
   * It is used to verify the given domain and bearer token.
   */
  getStatus: function (context, data) {
    const url = context.getters.getDomain
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

  /**
   * Update application root folder.
   */
  updateRootFs: function (context, data) {
    if (
      data && data.constructor === [].constructor
    ) {
      context.commit('setRootFs', data)
    }
  },

  /**
   * Get list of files and folders of root folder
   */
  fetchRootFs: function (context) {
    const url = context.getters.getDomain
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

  /**
   * Clear contents files/folders inside selected folder.
   */
  clearSelection: function (context) {
    context.commit('setSelectionEmpty')
  },

  /**
   * Get list of files and folders of a selected folder
   */
  fetchSelection: function (context, { path }) {
    const url = context.getters.getDomain
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
      context.commit('popNavStack')
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

  /**
   * Create a new folder at specified path
   */
  createNewFolder: function (context, { path, folderName }) {
    const url = context.getters.getDomain
    const token = context.getters.getToken
    context.dispatch('closeDialog', { name: 'newFolder' })
    context.dispatch('openDialog', { name: 'persistantLader' })
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
        context.dispatch('closeDialog', { name: 'persistantLoader' })
      }
    })
  },

  /**
   * Highlight UI selection a folder or file by append.
   * This will highlight select file or folder with background color.
   */
  selectAppendItems: function (context, { path }) {
    const selectedItem = context.getters.getSelectedItems
    const targetIndex = selectedItem.findIndex(x => x === path)
    if (targetIndex < 0) {
      context.commit('appendSelectedPath', path)
    } else {
      context.commit('deleteSelectedPath', targetIndex)
    }
  },

  /**
   * Highlight UI selection a folder or file.
   * This will highlight select file or folder with background color.
   */
  selectItems: function (context, { path }) {
    if (path) {
      context.commit('setSelectedPath', path)
    }
  },

  /**
   * Clear UI selection of a folder or file.
   */
  clearItem: function (context) {
    context.commit('clearSelectedPath')
  },

  /**
   * Delete selected remote file or folder.
   */
  deleteSelected: function (context, { list, pwd }) {
    const url = context.getters.getDomain
    const token = context.getters.getToken
    context.dispatch('closeDialog', { name: 'delete' })
    context.dispatch('openDialog', { name: 'persistantLoader' })
    forEach(list, function (listItem) {
      const asyncDone = this.async()
      axios.post(
        `${url}/${appConfig.ENDPOINTS.delete}`,
        {
          path: listItem,
          recursive: true
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      ).then(({status}) => {
        asyncDone()
      })
    }, function () {
      // All done
      context.dispatch('clearSelection')
      context.dispatch('fetchSelection', {
        path: pwd,
        is_dir: true
      })
      context.dispatch('clearItem')
      context.dispatch('fetchRootFs')
      context.dispatch('closeDialog', { name: 'persistantLoader' })
    })
    /* forEach(list, function (listItem) {
      const asyncDone = this.async()
      axios.post(
        `${url}/${appConfig.ENDPOINTS.delete}`,
        {
          path: listItem,
          recursive: true
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      ).then(({status}) => {
        asyncDone()
        if (status === 200) {
          context.dispatch('clearSelection')
          context.dispatch('fetchSelection', {
            path: pwd,
            is_dir: true
          })
          context.dispatch('clearItem')
          context.dispatch('fetchRootFs')
          context.dispatch('closeDialog', { name: 'delete' })
      }
    }, function () {
      console.log('all done')
    }) */
    /* const url = context.getters.getDomain
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
          path: pwd,
          is_dir: true
        })
        context.dispatch('clearItem')
        context.dispatch('fetchRootFs')
        context.dispatch('closeDialog', { name: 'delete' })
      }
    }) */
  },

  /**
   * Add new transfer job (upload/download)
   */
  addJob: async function (context, data) {
    if (transferActivity) {
      transferActivity.addJob(data)
    }
  },

  /**
   * Prepare upload of specified file.
   */
  prepareUpload: function (context, { options }) {
    // Get target working directory path where file will be created
    const targetPath = context.getters.getCurrentPath
    // Iterate through files selected
    if (options.list.length > 0) {
      // Get domain info
      const url = context.getters.getDomain
      const token = context.getters.getToken
      // Close file selection dialog
      context.dispatch('closeDialog', { name: 'dataTransfer' })
      // Iterate through file selected
      options.list.forEach(({ file, selected, transferId }, index) => {
        if (selected) {
          // Encode data into base64 string
          fs.readFile(file.path, function (err, readData) {
            if (!err) {
              const base64String = base64.fromByteArray(readData)
              if (base64String) {
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
                    transferId: transferId,
                    file: file,
                    targetPath: targetPath,
                    endpoint: appConfig.ENDPOINTS.addBlock,
                    type: 1
                  })
                }).catch((error) => {
                  console.log(error)
                })
              }
            }
          })
        }
      })
    }
  },

  /**
   * Prepare upload of specified file.
   */
  prepareDownload: function (context, { options }) {
    if (options.list.length > 0) {
      const url = context.getters.getDomain
      const token = context.getters.getToken
      context.dispatch('closeDialog', { name: 'dataTransfer' })
      options.list.forEach(({ file, selected, transferId, targetPath }) => {
        if (selected) {
          context.dispatch('addJob', {
            url: url,
            token: token,
            transferId: transferId,
            file: file,
            targetPath: targetPath,
            endpoint: appConfig.ENDPOINTS.read,
            type: 0
          })
        }
      })
    }
  },

  /**
   * Cancel upload or download of specified file.
   */
  cancelTransfer: function (context, data) {
    transferActivity.cancelJob(data)
  },

  /**
   * Cancel upload or download of all files in transfer list.
   */
  cancelAllTransfers: function (context, data) {
    return new Promise((resolve, reject) => {
      const list = context.getters.getTransferStateList
      list && list.constructor === [].constructor && list.forEach((item) => {
        context.dispatch('cancelTransfer', item)
      })
      resolve()
    })
  },

  /**
   * Set previous path in action bar
   */
  setPrevPath: function (context, { path }) {
    context.commit('setPrevPath', path)
  },

  /**
   * Push/Add a folder name to navigation stack.
   * Navigation stacks used to generate relative paths of selected folder.
   */
  pushNavStack: function (context, { path }) {
    const item = path && path.split('/')[path.split('/').length - 1]
    item && context.commit(
      'pushNavStack',
      path.split('/')[path.split('/').length - 1]
    )
    !item && context.dispatch('clearNavStack')
  },

  /**
   * Pop/Remove a folder name from navigation stack.
   * Navigation stacks used to generate relative paths of selected folder.
   */
  popNavStack: function (context) {
    context.commit('popNavStack')
  },

  /**
   * Clear navigation stack by replacing with, '/', root.
   * Navigation stacks used to generate relative paths of selected folder.
   */
  clearNavStack: function (context) {
    context.commit('clearNavStack')
  },

  /**
   * Clear navigation initial states.
   * clearNavigatorInitialStates will be called when user logout.
   */
  clearNavigatorInitialStates: function (context) {
    context.commit('resetNavigatorStates')
  }
}
