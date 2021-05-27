/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
/* eslint-disable camelcase */
const db = require('../../config/db')
const { hash } = require('bcryptjs')
const crypto = require('crypto')
const mailer = require('../../lib/mailer')

const File = require('../models/File')

module.exports = {
  async findOne (filters) {
    let query = 'SELECT * FROM users'

    Object.keys(filters).map((key) => {
      query = `${query}
      ${key}`

      Object.keys(filters[key]).map((field) => {
        query = `${query} ${field} = '${filters[key][field]}'`
      })
    })

    results = await db.query(query)

    return results.rows[0]
  },
  async all () {
    try {
      results = await db.query('SELECT * FROM users')
      return results.rows
    } catch (err) {
      console.error(err)
    }
  },
  async create (data) {
    try {
      const query = `
      INSERT INTO users (
        name,
        email,
        password,
        is_admin
      ) VALUES ($1, $2, $3, $4)
      RETURNING id
    `
      if (!data.is_admin) data.is_admin = false

      const password = crypto.randomBytes(4).toString('hex')
      const password_hash = await hash(password, 8)
      const values = [data.name, data.email, password_hash, data.is_admin]

      const results = await db.query(query, values)

      await mailer.sendMail({
        to: data.email,
        from: 'nao-responder@foodfy.com.br',
        subject: 'Foodfy!',
        html: `
              <h1>Foodfy!</h1>
              <p>Sua nova senha para acesso ao site: <strong>${password}<strong/></p>
              `
      })

      return results.rows[0].id
    } catch (err) {
      console.error(err)
    }
  },
  async createAdmin (data) {
    try {
      const query = `
      INSERT INTO users (
        name,
        email,
        password,
        is_admin
      ) VALUES ($1, $2, $3, $4)
      RETURNING id
    `
      if (!data.is_admin) data.is_admin = false

      const password = await hash('12345', 8)
      const values = [data.name, data.email, password, data.is_admin]

      const results = await db.query(query, values)

      return results.rows[0].id
    } catch (err) {
      console.error(err)
    }
  },
  async update (id, fields) {
    let query = 'UPDATE users SET'

    Object.keys(fields).map((key, index, array) => {
      if (index + 1 < array.length) {
        query = `${query}
          ${key} = '${fields[key]}',
        `
      } else {
        query = `${query}
          ${key} = '${fields[key]}'
          WHERE id = ${id}
          `
      }
    })

    await db.query(query)
  },
  async delete (id) {
    const results = await db.query('SELECT * FROM recipes WHERE user_id = $1', [id])
    const recipes = results.rows

    const allFilesPromise = recipes.map((recipe) =>
      File.deleteByRecipe(recipe.id)
    )
    const promiseResults = await Promise.all(allFilesPromise)

    await db.query('DELETE FROM users WHERE id = $1', [id])
  }
}
