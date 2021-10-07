require('dotenv').config();
const _ = require('lodash')
const OmdbAPI = require('./../services/OmdbAPI')
const Error = require('../errors')

module.exports = {
  search : async (req, res, next) => {
    try {      
      const query = _.pick(req.query, ['title', 'search', 'type', 'year', 'page'])
      
      if (!query.search && !query.title) throw new Error.BadRequest('search query is required')
      if (!query.page) query.page = 1

      const parseQuery = {
        t: query.title,
        s: query.search,
        y: query.year,
        type: query.type,
        page: query.page,
        apiKey: process.env.API_KEY
      }
      
      const response = await new OmdbAPI(req).get('/', {
        params: parseQuery
      })
  
      let pagination = {}
      if (response.data.hasOwnProperty('Search')) {
        pagination = {
          meta : {
            pagination: {
              data_per_page: response.data.Search.length,
              current_page: query.page ? query.page : 1,
              total_page: Math.ceil(response.data.totalResults / 10), // make it simple Omdb provide data per page is 10
            }
          }
        }
      }
  
      const transformer = {
        code: response.status,
        message: 'OK',
        data: response.data,
        ...pagination
      }
  
      res.send(transformer)
    } catch (error) {
      next(error)
    }
    
  },

  show : async (req, res, next) => {
    try {
      const id = req.params.id
      const response = await new OmdbAPI(req).get('/', {
        params: { i: id, apiKey: process.env.API_KEY }
      })
  
      res.send({
        code: response.status,
        message: 'OK',
        data: response.data
      })
    } catch (error) {
      next(error)
    }
  }
}