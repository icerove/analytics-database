const { Router } = require('express');
const { param, body } = require('express-validator');
const { sanitizeParam } = require('express-validator');

const { validationErrorHandler } = require('./error');
const { pool, sql } = require('../db');

const { tokenRequired } = require('../lib/jwt');

const createQueryValidator = body('content').trim();

const queryIsMine = (id, { req }) => {
  return pool
    .query(sql.checkQuery({ queryId: id, projectId: req.body.projectId }))
    .then((res) => {
      if (res.rows.length == 0) {
        return Promise.reject("Query doesn't exist or doesn't belong to you");
      }
    });
};

const idIntSanitizer = sanitizeParam('id').toInt();

const writeQueryValidator = [idIntSanitizer, param('id').custom(queryIsMine)];

const createQuery = async (req, res) => {
  title = req.body.title;
  query = req.body.query;
  chartType = req.body.chartType;
  projectId = req.body.projectId;

  result = await pool.query(
    sql.createQuery({ title, query, chartType, projectId })
  );
  res.status(201).json(result.rows[0]);
};

const updateQuery = async (req, res) => {
  title = req.body.title;
  query = req.body.query;
  chartType = req.body.chartType;
  projectId = req.body.projectId;

  queryId = req.params.id;

  await pool.query(sql.updateQuery({ title, query, chartType, projectId }));
  res.json('Query is updated');
};

const deleteQuery = async (req, res) => {
  await pool.query(sql.deleteQuery({ queryId: req.params.id }));
  res.json('Query is deleted');
};

const getQuery = async (req, res) => {
  queryId = req.params.id;

  if (queryId === null) {
    return res.status(200).json('Query is not found');
  }

  result = await pool.query(sql.getQuery({ queryId }));
  res.json(result.rows[0]);
};

const router = new Router();
router.post(
  '/',
  tokenRequired,
  createQueryValidator,
  validationErrorHandler,
  createQuery
);
router.post(
  '/:id',
  tokenRequired,
  writeQueryValidator,
  validationErrorHandler,
  updateQuery
);
router.delete(
  '/:id',
  tokenRequired,
  writeQueryValidator,
  validationErrorHandler,
  deleteQuery
);
router.get('/:id', validationErrorHandler, getQuery);

module.exports = router;
