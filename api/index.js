const { Router } = require('express')
const {pool, sql} = require('../db')

const auth = require('./auth')
const project = require('./project')
const query = require('./query')
const result = require('./result')

const router = new Router()

router.use('/user', auth)
router.use('/project', project)
router.use('/query', query)
router.use('./result', result)

const getProjects = async (req, res) => {
  result = await pool.query(sql.getAllProjects())
  res.json(result.rows)
}

const findProject = async (req, res) => {
  projectName = req.body.projectName

  result = await pool.query(sql.findProject({projectName}))
  res.json(result.rows[0])
}

router.get('/', getProjects)
router.get('/search', findProject)

module.exports = router
