const express = require('express')
const app = express()

class ArticlesDAO {
  constructor (dbClient) {
    this.db = dbClient
    this.getAll = this.getAll.bind(this)
    this.getById = this.getById.bind(this)
    this.create = this.create.bind(this)
    this.update = this.update.bind(this)
    this.delete = this.delete.bind(this)
  }

  async getAll () {
    const response = await this.db.query('SELECT id, first_name, last_name, email, phone, picture FROM contacto')
    const rows = response[0]
    return rows
  }

  async getById (id) {
    const response = await this.db.query('SELECT id, first_name, last_name, email, phone, picture FROM contacto WHERE id = ?', [id])
    const rows = response[0]
    return rows[0]
  }
 
  async create (article) {
    const response =  await this.db.query('INSERT INTO contacto (first_name, last_name, email, phone, picture) VALUES (?, ?, ?, ?, ?)', [article.firstname, article.lastname, article.email, article.phone, article.upload])        
    const result = response[0] 
    return result.insertId
  }

  async update (article) {
    const response = await this.db.query('UPDATE contacto SET first_name = ?, last_name = ?, email = ?, phone = ?, picture = ? WHERE id = ?', [article.firstname, article.lastname, article.email, article.phone, article.upload, article.id])
    const result = response[0]
    return result
  }

  async delete (id) {
    const response = await this.db.query('DELETE FROM contacto WHERE id = ?', [id])
    const result = response[0]
    return result
  }
}

module.exports = ArticlesDAO
