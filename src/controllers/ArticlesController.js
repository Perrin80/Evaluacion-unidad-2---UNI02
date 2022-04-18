const ArticlesDAO = require('../models/dao/ArticlesDAO')
const Multer = require('multer')
class ArticlesController {
  constructor (db) {
    this.articlesDao = new ArticlesDAO(db)
    this.renderHomeWithArticles = this.renderHomeWithArticles.bind(this)
    this.renderSingleArticle = this.renderSingleArticle.bind(this)
    this.renderArticleCreationForm = this.renderArticleCreationForm.bind(this)
    this.renderArticleUpdateForm = this.renderArticleUpdateForm.bind(this)
    this.insertAndRenderArticle = this.insertAndRenderArticle.bind(this)
    this.updateAndRenderArticle = this.updateAndRenderArticle.bind(this)
    this.deleteArticleAndRenderResponse = this.deleteArticleAndRenderResponse.bind(this)
  }

  async renderHomeWithArticles (req, res) {
    const articles = await this.articlesDao.getAll()
    res.render('home', {
      articles
    })
  }

  async renderSingleArticle (req, res) {
    const id = req.params.id

    try {
      const article = await this.articlesDao.getById(id)

      if (!article) {
        res.status(404).render('404')
        return
      }

      res.render('contact', {
        id,
        first_name: article.first_name,
        last_name: article.last_name,
        email: article.email,
        phone: article.phone,
        picture: article.picture
      })
    } catch (error) {
      console.log(error)
      res.status(500).render('500')
    }
  }

  renderArticleCreationForm (req, res) {
    res.render('contact-form')
  }

  async renderArticleUpdateForm (req, res) {
    const id = req.params.id

    try {
      const article = await this.articlesDao.getById(id)

      if (!article) {
        res.status(404).render('404')
        return
      }

      res.render('contact-form', {
        id,
        first_name: article.first_name,
        last_name: article.last_name,
        email: article.email,
        phone: article.phone,
        picture: article.picture
      })
    } catch (error) {
      console.log(error)
      res.status(500).render('500')
    }
  }

  async insertAndRenderArticle (req, res) {
    const firstname = req.body.first_name
    const lastname  = req.body.last_name
    const email     = req.body.email
    const phone     = req.body.phone
    
    var storage = Multer.diskStorage({
      destination: (req, file, callBack) => {
          callBack('/img/')     // './public/images/' directory name where save the file
      },
      filename: (req, file, callBack) => {
          callBack(file.fieldname + '-' + Date.now() + path.extname(file.originalname))
      }
    })

    const upload = req.file.filename
    const article = { firstname, lastname, email, phone, upload }

    try {
      const id = await this.articlesDao.create(article)

      res.redirect(`/articles/${id}`)
    } catch (error) {
      console.log(error)
      res.status(500).render('500')
    }
  }

  async updateAndRenderArticle (req, res) {
    const id        = req.params.id
    const firstname = req.body.first_name
    const lastname  = req.body.last_name
    const email     = req.body.email
    const phone     = req.body.phone

    var storage = Multer.diskStorage({
      destination: (req, file, callBack) => {
          callBack('/img/')     // './public/images/' directory name where save the file
      },
      filename: (req, file, callBack) => {
          callBack(file.fieldname + '-' + Date.now() + path.extname(file.originalname))
      }
    })

    const upload = req.file.filename
    

    try {
      //const article = { title, content, id, image }
      const article = { id, firstname, lastname, email, phone, upload }

      await this.articlesDao.update(article)

      res.redirect(`/articles/${id}`)
    } catch (error) {
      console.log(error)
      res.status(500).render('500')
    }
  }

  async deleteArticleAndRenderResponse (req, res) {
    const id = req.params.id
    const article = await this.articlesDao.getById(id)

    try {
      const article = await this.articlesDao.getById(id)

      if (!article) {
        res.status(404).render('404')
        return
      }

      await this.articlesDao.delete(id)

      res.render('contact-deleted', {
        id,
        first_name: article.first_name,
        last_name: article.last_name,
        picture: article.picture

      })
    } catch (error) {
      console.log(error)
      res.status(500).render('500')
    }

  }
}

module.exports = ArticlesController
