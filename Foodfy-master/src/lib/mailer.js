const nodemailer = require('nodemailer')

module.exports = nodemailer.createTransport({
  host: 'smtp.mailtrap.io',
  port: 2525,
  auth: {
    user: '4647b6098dccac',
    pass: '6ed7b9acb843de'
  }
})
