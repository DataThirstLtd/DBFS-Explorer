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
    about: {
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
    }
  },
  drag: false
}
