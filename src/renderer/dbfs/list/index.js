'use strict'

const { LIST } = require('../endpoints')

export default function (props) {
  return new Promise((resolve, reject) => {
    // Default path
    let path = '/'

    if (props && props.constructor === {}.constructor) {
      if (props.path) {
        // Path from the props
        path = props.path
      }
    }

    this.axios({
      method: LIST.method,
      url: `/${LIST.route}`,
      data: {
        path
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
