const express = require('express')
const routes = express.Router()

const UserController = require('../app/controllers/UserController')
const SessionController = require('../app/controllers/SessionController')

const UserValidator = require('../app/validators/users')
const SessionValidator = require('../app/validators/session')

const { onlyAdmin, redirectToAdmin } = require('../app/middlewares/session')

routes.get('/login', redirectToAdmin, SessionController.loginForm)
routes.post('/login', SessionValidator.login, SessionController.login)
routes.post('/logout', SessionController.logout)

routes.get('/forgot-password', SessionController.forgotForm)
routes.get('/password-reset', SessionController.resetForm)
routes.post('/forgot-password', SessionValidator.forgot, SessionController.forgot)
routes.post('/password-reset', SessionValidator.reset, SessionController.reset)

routes.get('/create', onlyAdmin, UserController.create)
routes.get('/edit/:id', onlyAdmin, UserController.edit)

routes.get('/', onlyAdmin, UserController.list)
routes.post('/', onlyAdmin, UserValidator.post, UserController.post)
routes.put('/', onlyAdmin, UserValidator.put, UserController.put)
routes.delete('/', onlyAdmin, UserValidator.del, UserController.delete)

module.exports = routes
