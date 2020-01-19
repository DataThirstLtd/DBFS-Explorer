'use strict'

const axios = require('axios')
const { LIST } = require('@/app.config.js').endpoints

function index (authUser, path) {
  return new Promise((resolve, reject) => {
    if (!authUser) {
      reject(new Error('Invalid credentials'))
    }

    axios({
      method: LIST.type,
      url: `${authUser.url}/${LIST.value}?path=${path}`,
      headers: {
        'Authorization': `Bearer ${authUser.token}`,
        'Access-Control-Allow-Origin': '*'
      }
    })
      .then(data => {
        return resolve(data)
      })
      .catch(err => {
        return reject(err)
      })
  })
}

export default index
