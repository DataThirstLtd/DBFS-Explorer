import { isArray } from 'util'
import { remote } from 'electron'
import DBFS from '@/DBFS'

const path = require('path')
const fs = require('fs-extra')

// Construct app data path
const appDataPath = path.join(
  remote.app.getPath('appData'),
  remote.app.getName()
)

// Make sure data directory exists at app data path
fs.ensureDirSync(appDataPath)

/**
 * Get default store states
 */
function getDefaultStates () {
  return {
    authUser: null,
    explorer: {
      list: [],
      navStack: ['/']
    },
    dbfs: null
  }
}

/**
 * Store States
 */
export const state = () => (getDefaultStates())

/**
 * Store mutations
 */
export const mutations = {
  SET_DBFS_INSTANCE (state, data) {
    state.dbfs = data
  },
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

/**
 * Store Getters
 */
export const getters = {
  /**
   * Get current authenticated user
   */
  getAuthUser (state) {
    return state.authUser
  },

  /**
   * Get path for credentials
   */
  getPathCredentials () {
    return path.join(
      appDataPath,
      'credentials.json'
    )
  }
}

/**
 * Store Actions
 */
export const actions = {

  /**
   * Read all credentials from app data directory
   */
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

  /**
   * Save or write credentials into app data directory
   * @param {Object} data - Sign in credentials to save { domain, token, url }
   */
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

  /**
   * Sign in by connecting into DBFS
   * @param {Object} data - Authentication data as an object { domain, token, url }
   */
  signIn ({ dispatch, commit }, data) {
    return new Promise((resolve, reject) => {
      const _unableToSignIn = function (err) {
        return reject(new Error('Failed to sign-in.' + err ? err.message : ''))
      }

      if (!isValidCredentials(data)) {
        _unableToSignIn(new Error('Invalid Credentials'))
      }

      const dbfs = new DBFS(data)

      dbfs.getStatus({ path: '/' })
        .then(res => {
          if (res.status === 200) {
            if (res.data.constructor === {}.constructor) {
              dispatch('writeCredentials', data)
              commit('SET_DBFS_INSTANCE', dbfs)
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

  /**
   * Signout by clear all store data
   */
  signOut ({ commit }) {
    return commit('CLEAR_DATA')
  },

  /**
   * List folder contents
   * @param {String} path - target path in DBFS
   * @param {Boolean} save - If true, the data will be saved in store
   */
  listFolder ({ state, getters, commit }, { path, save }) {
    return new Promise((resolve, reject) => {
      const authUser = getters.getAuthUser
      if (!authUser) {
        return reject(new Error('Invalid credentials'))
      }

      if (!path) {
        return reject(new Error('Invalid path'))
      }

      state.dbfs.list({ path })
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
  },

  createFolder ({ state }, data) {
    return state.dbfs.create(data)
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
