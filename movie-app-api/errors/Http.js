class HttpError extends Error {
  constructor (status, message, code) {
    super(message || 'http_error')
    this.status = status
    this.code = code
    this.defaultCode = 'http_error'
    this.message = message
  }

  getStatus () {
    return this.status
  }

  getCode () {
    return this.code
  }

  getDefaultCode () {
    return this.defaultCode
  }

  getMessage () {
    return this.message
  }
}

module.exports = HttpError