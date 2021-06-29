const { Router } = require('express');
const { param, body } = require('express-validator');
const { sanitizeParam } = require('express-validator');

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
  return pool
    .query(sql.checkProject({ userId: req.user.userid, projectId: id }))
    .then((res) => {
      if (res.rows.length == 0) {
        return Promise.reject("Project doesn't exist or doesn't belong to you");
      }
    });
};

const idIntSanitizer = sanitizeParam('id').toInt();

const writeProjectValidator = [
  idIntSanitizer,
  param('id').custom(projectIsMine),
];

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

const projectExists = (id, { req }) => {
  return pool.query(sql.readProject({ projectId: id })).then((res) => {
    if (res.rows.length === 0) {
      return Promise.reject("Project doesn't exist");
    }
  });
};

const readQueryValidator = [idIntSanitizer, param('id').custom(projectExists)];

const getQueryList = async (req, res) => {
  projectId = req.params.id;
  result = await pool.query(sql.getQueryList({ projectId }));
  res.json(result.rows);
};

const transferQueryToAnotherProject = async (req, res) => {
  projectId = req.params.id;
  queryId = req.body.queryId;

  result = await pool.query(sql.transferQuery({ projectId, queryId }));
  res.json(result.rows[0]);
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
  transferQueryToAnotherProject
);
router.delete(
  '/:id',
  tokenRequired,
  writeProjectValidator,
  validationErrorHandler,
  deleteProject
);
router.get('/:id', readQueryValidator, validationErrorHandler, getQueryList);
router.get('/', tokenRequired, getAllMyProject);

module.exports = router;
