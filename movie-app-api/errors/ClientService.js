const HttpError = require('./Http')

class ClientService extends HttpError {
  constructor (response) {
    super(response.status || 500, (response.data && response.data.message) || 'internal_service_error')
    this.response = response
  }

  getData () {
    return this.response.data
  }
}

module.exports = ClientService
