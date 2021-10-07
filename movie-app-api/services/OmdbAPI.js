const BaseService = require('./Base')

class OmdbAPI extends BaseService {
  constructor (req) {
    super(req)
    this.serviceName = 'OmdbAPI Service'
    this.serviceHost = 'https://omdbapi.com'
    this.serviceHeader = {
      'Authorize': "Bearer xxxx",
    }
    
    return new Proxy(this, this.createRequest())

  }
}

module.exports = OmdbAPI