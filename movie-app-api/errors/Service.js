const HttpError = require('./Http')

class Service extends HttpError {
  constructor (message, code) {
    super(500, message || 'internal_service_error')
    this.code = code
  }

  getCode () {
    return this.code
  }
}

module.exports = Service
