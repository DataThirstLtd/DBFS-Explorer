'use strict'

import axios from 'axios'
import getStatus from './get-status'
import list from './list'
import create from './create'

class DBFS {
    constructor (props) {
        try {
            // Save authentication data
            this.auth = Object.assign({}, props)

            // Create axios instance
            this.axios = axios.create({
                baseURL: `${this.auth.url}/api`,
                headers: {
                    'Authorization': `Bearer ${props.token}`,
                    'Access-Control-Allow-Origin': '*'
                }
            })

            // Interceptor Request
            this.axios.interceptors.request.use(config => {
                if (process.env.NODE_ENV === 'development') {
                    console.log('Request +++++++++++++++++++++++++++++++')
                    console.log(config)
                    console.log('---------------------------------------')
                }
                return config
            })

            // Interceptor Response
            this.axios.interceptors.response.use(config => {
                if (process.env.NODE_ENV === 'development') {
                    console.log('Response +++++++++++++++++++++++++++++++')
                    console.log(config)
                    console.log('----------------------------------------')
                }
                return config
            })
        } catch (error) {
            throw error
        }
    }
}

DBFS.prototype.getStatus = getStatus
DBFS.prototype.list = list
DBFS.prototype.create = create

export default DBFS
