const express = require('express')
const routes = express.Router()

const ProfileController = require('../app/controllers/ProfileController')
const ProfileValidator = require('../app/validators/profile')

const { onlyUsers } = require('../app/middlewares/session')

routes.get('/', onlyUsers, ProfileValidator.index, ProfileController.index)
routes.put('/', onlyUsers, ProfileValidator.put, ProfileController.put)

module.exports = routes
