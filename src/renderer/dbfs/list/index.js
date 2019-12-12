'use strict'

const axios = require('axios')
const { LIST } = require('@/app.config.js').endpoints

function index (authUser, path) {
  return new Promise((resolve, reject) => {
    if (!authUser) {
      reject(new Error('Invalid credentials'))
    }

    axios({
      method: 'get',
      url: `${authUser.url}/${LIST}?path=${path}`,
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
