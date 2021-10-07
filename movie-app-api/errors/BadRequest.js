const HttpError = require('./Http')

class BadRequest extends HttpError {
  constructor (message, code = 'bad_request') {
    super(400, message, code)
    this.defaultCode = 'bad_request'
  }
}

module.exports = BadRequest
