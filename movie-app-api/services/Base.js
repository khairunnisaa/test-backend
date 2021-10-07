const axios = require('axios')
const Error = require('../errors')

class Base {
  constructor (req) {
    this.req = req
    this.timeout = 3000
    this.client = null
  }

  createClient () {
    return axios.create({
      baseURL: `${this.serviceHost}`,
      timeout: this.timeout,
      headers: this.req ? this.serviceHeader : {}
    })
  }

  createRequest () {
    if (this.req) {
      Object.assign(this.req.headers, this.serviceHeader)
    }

    this.client = this.createClient()
    this.assignClientInterceptors()

    return {
      get (target, method) {
        if (method in target) {
          return target[method]
        } else if (target.client && (method in target.client)) {
          return target.client[method]
        }
      }
    }
  }

  assignClientInterceptors () {
    let service = this
    
    this.client.interceptors.response.use(function (response) {
      return response
    }, function (error) {
      if (error.code === 'ECONNREFUSED') {
        return Promise.reject(new Error.Service(`${service.serviceName} is not available`, 'not_available'))
      }
      
      if (error.code === 'ECONNABORTED') {
        return Promise.reject(new Error.Service(`request to ${service.serviceName} is timeout`, 'timeout'))
      }
      
      return Promise.reject(new Error.ClientService(error.response))
    })
  }
}

module.exports = Base