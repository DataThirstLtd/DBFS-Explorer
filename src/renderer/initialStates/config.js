export default {
  platform: '',
  info: {
    snackbar: {
      status: false,
      message: ''
    }
  },
  loggedIn: false,
  dialogs: {
    count: 0,
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
}
