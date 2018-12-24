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
    }
  },
  drag: false
}
