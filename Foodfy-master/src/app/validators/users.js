/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
const User = require('../models/User')
const { compare } = require('bcryptjs')

function checkAllFields (body) {
  const keys = Object.keys(body)

  for (key of keys) {
    if (body[key] === '') {
      return {
        user: body,
        error: 'Preencha todos os campos!'
      }
    }
  }
}

async function post (req, res, next) {
  const fillAllFields = checkAllFields(req.body)
  if (fillAllFields) return res.render('admin/user/create', fillAllFields)

  const { email } = req.body

  const user = await User.findOne({
    where: { email }
  })

  if (user) {
    return res.render('admin/user/create', {
      user: req.body,
      error: 'Usuário já cadastrado'
    })
  }

  next()
}

async function put (req, res, next) {
  const fillAllFields = checkAllFields(req.body)
  if (fillAllFields) return res.render('admin/user/edit', fillAllFields)

  const { email } = req.body

  const user = await User.findOne({
    where: { email }
  })

  if (user) {
    return res.render('admin/user/edit', {
      user: req.body,
      error: 'Email já cadastrado'
    })
  }

  next()
}

async function del (req, res, next) {
  id = req.body.id
  userId = req.session.userId

  const users = await User.all()

  if (id === userId) {
    return res.render('admin/user/index', {
      users,
      error: 'Não é permitido apagar sua conta!'
    })
  }

  next()
}

module.exports = { post, put, del }
