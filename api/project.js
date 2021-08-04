const { Router } = require('express');
const { param, body } = require('express-validator');

const { validationErrorHandler } = require('./error');
const { pool, sql } = require('../db');

const { tokenRequired } = require('../lib/jwt');

const rejectProjectName = (projectName) => {
  return pool.query(sql.findProject({ projectName })).then((res) => {
    if (res.rows.length != 0) {
      return Promise.reject('Project name is already in use');
    }
  });
};

const projectnameNotExistsValidator = body('projectName')
  .trim()
  .custom(rejectProjectName);

const projectnameValidator = body('projectName')
  .trim()
  .matches(/^[\w\.\-_]+$/)
  .withMessage("Can only include letters, numbers, '_', '-' and '.'")
  .isLength({ min: 2 })
  .withMessage('Must be at least 2 characters long');

const projectValidator = [projectnameValidator, projectnameNotExistsValidator];

const createProject = async (req, res) => {
  userId = req.user.userid;

  if (userId === null) {
    return res.status(200).json('User is not found');
  }

  projectName = req.body.projectName;

  result = await pool.query(sql.createProject({ projectName, userId }));
  res.status(201).json(result.rows[0]);
};

const projectIsMine = (id, { req }) => {
  let uid = Number(id);
  return pool
    .query(sql.checkProject({ userId: req.user.userid, projectId: uid }))
    .then((res) => {
      if (res.rows.length == 0) {
        return Promise.reject("Project doesn't exist or doesn't belong to you");
      }
    });
};

const writeProjectValidator = param('id').custom(projectIsMine);

const updateProject = async (req, res) => {
  projectName = req.body.projectName;
  projectId = req.params.id;

  await pool.query(sql.updateProject({ projectName, projectId }));
  res.json('project name updated');
};

const deleteProject = async (req, res) => {
  await pool.query(sql.deleteProject({ projectId: req.params.id }));
  res.json('project is deleted');
};

const getAllMyProject = async (req, res) => {
  userId = req.user.userid;

  if (userId === null) {
    return res.status(200).json('User is not found');
  }

  result = await pool.query(sql.getAllMyProject({ userId }));
  res.json(result.rows);
};

const addQueryToProject = async (req, res) => {
  projectId = req.params.id;
  queryId = req.body.queryId;
  result = await pool.query(sql.addQueryToProject({ projectId, queryId }));
  res.status(201).json('Query is added to project');
};

const deleteQueryFromProject = async (req, res) => {
  projectId = req.params.id;
  queryId = req.body.queryId;
  result = await pool.query(sql.addQueryToProject({ projectId, queryId }));
  res.status(201).json('Query is deleted from project');
};

const getProjectHasQueryList = async (req, res) => {
  projectId = req.params.id;

  result = await pool.query(sql.getProjectHasQueryList({ projectId }));
  res.json(result.rows);
};

const router = new Router();
router.post(
  '/',
  tokenRequired,
  projectValidator,
  validationErrorHandler,
  createProject
);
router.post(
  '/:id',
  tokenRequired,
  writeProjectValidator,
  validationErrorHandler,
  updateProject
);
router.post(
  '/:id',
  tokenRequired,
  writeProjectValidator,
  validationErrorHandler,
  addQueryToProject
);
router.delete(
  '/:id',
  tokenRequired,
  writeProjectValidator,
  validationErrorHandler,
  deleteProject
);
router.delete(
  '/:id',
  tokenRequired,
  writeProjectValidator,
  validationErrorHandler,
  deleteQueryFromProject
);
router.get('/', tokenRequired, validationErrorHandler, getAllMyProject);
router.get('/:id', validationErrorHandler, getProjectHasQueryList);
module.exports = router;
