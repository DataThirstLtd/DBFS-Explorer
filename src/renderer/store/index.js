import { isArray } from 'util'
import { remote } from 'electron'
import dbfs from '@/dbfs'

const path = require('path')
const fs = require('fs-extra')
const appDataPath = path.join(
  remote.app.getPath('appData'),
  remote.app.getName()
)

fs.ensureDirSync(appDataPath)

function getDefaultStates () {
  return {
    authUser: null,
    explorer: {
      list: [],
      navStack: ['/']
    }
  }
}

export const state = () => (getDefaultStates())

export const mutations = {
  ADD_AUTH_USER (state, data) {
    state.authUser = Object.assign({}, data)
  },
  SET_LIST (state, data) {
    state.explorer.list = Object.assign([], data)
  },
  CLEAR_DATA (state) {
    Object.assign(state, getDefaultStates())
  }
}

export const getters = {
  getAuthUser (state) {
    return state.authUser
  },
  getPathCredentials () {
    return path.join(
      appDataPath,
      'credentials.json'
    )
  }
}

export const actions = {
  readCredentials ({ getters }) {
    return new Promise((resolve, reject) => {
      const _credentialsNotFound = function () {
        return reject(new Error('Credentials not found.'))
      }
      if (!fs.existsSync(getters.getPathCredentials)) {
        _credentialsNotFound()
      }
      if (process.env.NODE_ENV === 'development') {
        console.log(getters.getPathCredentials)
      }
      const credentials = fs.readJSONSync(getters.getPathCredentials)
      if (credentials) {
        return resolve(credentials)
      } else {
        _credentialsNotFound()
      }
    })
  },
  writeCredentials ({ getters }, data) {
    return new Promise((resolve, reject) => {
      const _unableToWriteCredentials = function (err) {
        return reject(new Error('Failed to write credentials.' + err ? err.message : ''))
      }
      const _write = function (credentials) {
        fs.writeJSONSync(
          getters.getPathCredentials,
          credentials
        )
        return resolve()
      }

      if (!isValidCredentials(data)) {
        _unableToWriteCredentials(new Error('Invalid Credentials.'))
      }

      let updatedCredentials = []

      if (fs.existsSync(getters.getPathCredentials)) {
        const credentials = fs.readJSONSync(getters.getPathCredentials)
        if (
          credentials &&
          isArray(credentials) &&
          credentials.length > 0
        ) {
          if (credentials.findIndex(x => x.domain === data.domain && x.token === data.token) > -1) {
            // Credentials are already exists. No need to write them again.
            return resolve()
          }
          // Restore old credentials
          updatedCredentials = Object.assign([], credentials)
        }
      }

      // Update new credentials to write
      updatedCredentials.push(data)
      // Write credentials
      _write(updatedCredentials)
    })
  },
  signIn ({ dispatch, commit }, data) {
    return new Promise((resolve, reject) => {
      const _unableToSignIn = function (err) {
        return reject(new Error('Failed to sign-in.' + err ? err.message : ''))
      }

      if (!isValidCredentials(data)) {
        _unableToSignIn(new Error('Invalid Credentials'))
      }

      dbfs.getStatus(data)
        .then(res => {
          console.log(res)
          if (res.status === 200) {
            if (res.data.constructor === {}.constructor) {
              dispatch('writeCredentials', data)
              commit('ADD_AUTH_USER', data)
              return resolve()
            }
          }
          return reject(new Error('Failed to sign in! Please check your credentials and try again.'))
        })
        .catch(err => {
          return reject(err)
        })
    })
  },
  signOut ({ commit }) {
    return commit('CLEAR_DATA')
  },
  listFolder ({ getters, commit }, { path, save }) {
    console.log('entry list folder')
    return new Promise((resolve, reject) => {
      const authUser = getters.getAuthUser
      if (!authUser) {
        return reject(new Error('Invalid credentials'))
      }

      if (!path) {
        return reject(new Error('Invalid path'))
      }

      dbfs.list(authUser, path)
        .then(res => {
          if (res.status === 200) {
            const { files } = res.data
            if (files && save) {
              commit('SET_LIST', files)
              return resolve(files)
            }

            return reject(new Error('Unable to get files.'))
          } else {
            return reject(res)
          }
        })
        .catch(err => {
          return reject(err)
        })
    })
  }
}

function isValidCredentials (data) {
  if (
    data &&
    data.constructor === {}.constructor &&
    'domain' in data &&
    data.domain &&
    'token' in data &&
    data.token
  ) {
    return true
  }

  return false
}
