const User = require('./src/app/models/User')

async function addAdmin () {
  await User.createAdmin({
    name: 'Admin',
    email: 'foodfy@gmail.com',
    is_admin: true
  })
}

addAdmin()
