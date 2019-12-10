import { isArray } from 'util'
import { remote } from 'electron'

const path = require('path')
const fs = require('fs-extra')
const appDataPath = path.join(
  remote.app.getPath('appData'),
  remote.app.getName()
)

fs.ensureDirSync(appDataPath)

export const state = () => ({
  authUser: null
})

export const getters = {
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
        reject(new Error('Credentials not found.'))
      }
      if (!fs.existsSync(getters.getPathCredentials)) {
        _credentialsNotFound()
      }

      const credentials = fs.readJSONSync(getters.getPathCredentials)
      if (credentials) {
        resolve(credentials)
      } else {
        _credentialsNotFound()
      }
    })
  },
  writeCredentials ({ getters }, data) {
    return new Promise((resolve, reject) => {
      const _unableToWriteCredentials = function (err) {
        reject(new Error('Failed to write credentials.' + err ? err.message : ''))
      }
      const _write = function (credentials) {
        fs.writeJSONSync(
          getters.getPathCredentials,
          credentials
        )
        resolve()
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
          if (
            credentials.filter(x =>
              x.domain === data.domain ||
              x.token === data.token
            ).length > 0
          ) {
            // Credentials are already exists. No need to write them again.
            resolve()
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
  signIn ({ mutations }, data) {
    return new Promise((resolve, reject) => {
      const _unableToSignIn = function (err) {
        reject(new Error('Failed to sign-in.' + err ? err.message : ''))
      }

      if (!isValidCredentials(data)) {
        _unableToSignIn(new Error('Invalid Credentials'))
      }


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
