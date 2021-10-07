const HttpError = require('./Http')

module.exports = () => {
  return (err, req, res, next) => {
    if (err.code === 'ECONNREFUSED') {
      console.error('Service Not available')
      console.error(err)
      
      return res.status(500).json({ message: 'Service Not available' })
    }

    if (err.code === 'ECONNABORTED') {
      console.error('Request Timeout')
      console.error(err)
      
      return res.status(408).json({ message: 'Request Timeout' })
    }

    if (err instanceof HttpError) {
      let data = {
        code: err.getCode(),
        message: err.getMessage()
      }

      if (!data.message && data.code) {
        data.message = data.code
      }

      if (!data.message && err.getDefaultCode()) {
        data.message = err.getDefaultCode()
      }

      console.error('Error HTTP')
      console.error(data)

      return res.status(err.getStatus()).json(data)
    }

    console.error('General Error')
    console.error(err)

    return res.status(500).json({ message: err.message || 'Server Error' })
  }
}
