'use strict'

const axios = require('axios')
const { GET_STATUS } = require('@/app.config.js').endpoints

function index (authUser) {
  return new Promise((resolve, reject) => {
    if (!authUser) {
      reject(new Error('Invalid credentials'))
    }

    axios({
      method: GET_STATUS.type,
      url: `${authUser.url}/${GET_STATUS.value}?path=/`,
      headers: {
        'Authorization': `Bearer ${authUser.token}`,
        'Access-Control-Allow-Origin': '*'
      }
    })
      .then(res => {
        return resolve(res)
      })
      .catch(err => {
        return reject(err)
      })
  })
}

export default index
