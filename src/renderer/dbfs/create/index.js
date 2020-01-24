'use strict'

const { CREATE } = require('../endpoints')

export default function (props) {
  return new Promise((resolve, reject) => {
    // Default path
    let path = '/'
    let overwrite = false

    if (props && props.constructor === {}.constructor) {
      if (props.path) {
        // Path from the props
        path = props.path
      }
      if (props.overwrite) {
        overwrite = true
      }
    }

    console.log(path, overwrite)

    this.axios({
      method: CREATE.method,
      url: `/${CREATE.route}`,
      data: {
        path,
        overwrite
      }
    })
      .then(res => {
        return resolve(res)
      })
      .catch(err => {
        console.error(err)
        return reject(err)
      })
  })
}
