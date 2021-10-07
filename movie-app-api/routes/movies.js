const Controller = require('../controllers/movie')

module.exports = router => {
  router.get('/search', Controller.search)
  router.get('/detail/:id', Controller.show)

  return router
}