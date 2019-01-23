
const DEFAULT_THREAD_COUNT = 2

export default {
  ENDPOINTS: {
    addBlock: 'api/2.0/dbfs/add-block',
    close: 'api/2.0/dbfs/close',
    create: 'api/2.0/dbfs/create',
    delete: 'api/2.0/dbfs/delete',
    getStatus: 'api/2.0/dbfs/get-status',
    list: 'api/2.0/dbfs/list',
    mkdirs: 'api/2.0/dbfs/mkdirs',
    move: 'api/2.0/dbfs/move',
    put: 'api/2.0/dbfs/put',
    read: 'api/2.0/dbfs/read'
  },
  defaultThreadCount: DEFAULT_THREAD_COUNT,
  defaultSettings: [
    { key: 'thread-count', value: DEFAULT_THREAD_COUNT }
  ],
  initialAuthStates: {
    token: '',
    domain: ''
  },
  initialConfigStates: {
    platform: '',
    info: {
      snackbar: {
        status: false,
        message: ''
      }
    },
    loggedIn: false,
    dialogs: {
      about: {
        active: false
      },
      properties: {
        active: false
      },
      delete: {
        active: false,
        options: null
      },
      newFolder: {
        active: false,
        options: null
      },
      dataTransfer: {
        active: false,
        options: {
          list: [],
          type: -1
        }
      },
      transferState: {
        active: false,
        list: []
      },
      alert: {
        active: false,
        options: {
          title: '',
          message: ''
        }
      },
      settings: {
        active: false,
        options: {}
      },
      disconnect: {
        active: false,
        options: {}
      },
      persistantLoader: {
        active: false,
        options: {}
      }
    },
    drag: false,
    settings: []
  },
  initialNavigatorStates: {
    rootFs: [],
    fetchWait: false,
    selection: [],
    folderEmpty: {
      valid: false,
      path: ''
    },
    selectedItem: '',
    populateSelection: {},
    prevPath: '',
    currentPath: '',
    navStack: []
  }
}
