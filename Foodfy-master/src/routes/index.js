const express = require('express')
const routes = express.Router()

const WebController = require('../app/controllers/WebController')

const admin = require('./admin')

routes.use('/admin', admin)
routes.get('/', WebController.index)
routes.get('/recipes/search', WebController.search)
routes.get('/about', WebController.about)
routes.get('/recipes', WebController.recipes)
routes.get('/recipes/:index', WebController.recipePage)
routes.get('/chefs', WebController.chefs)

routes.get('/admin', function (req, res) {
  return res.redirect('/admin/recipes')
})

module.exports = routes
