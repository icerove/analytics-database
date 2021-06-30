const { Router } = require('express');
const { param, body } = require('express-validator');
const { sanitizeParam } = require('express-validator');

const { validationErrorHandler } = require('./error');
const { pool, sql } = require('../db');

const { tokenRequired } = require('../lib/jwt');

const createResultValidator = body('content').trim();

const resultIsMine = (id, { req }) => {
  return pool
    .query(sql.checkResult({ resultId: id, queryId: req.body.queryId }))
    .then((res) => {
      if (res.rows.length == 0) {
        return Promise.reject(
          "Query Result doesn't exist or doesn't belong to you"
        );
      }
    });
};

const idIntSanitizer = sanitizeParam('id').toInt();

const writeResultValidator = [idIntSanitizer, param('id').custom(resultIsMine)];

const createResult = async (req, res) => {
  (result = req.body.result), (executedAt = req.body.executedAt);
  queryId = req.body.queryId;

  result = await pool.query(sql.createResult({ result, executedAt, queryId }));
  res.status(201).json(result.rows[0]);
};

const updateResult = async (req, res) => {
  result = req.body.result;
  resultId = req.params.id;

  await pool.query(sql.updateResult({ result, executedAt, resultId }));
  res.json('Result is updated');
};

const deleteResult = async (req, res) => {
  await pool.query(sql.deleteResult({ resultId: req.params.id }));
  res.json('Result is deleted');
};

const getResult = async (req, res) => {
  resultId = req.params.id;

  if (resultId === null) {
    return res.status(200).json('Result is not found');
  }

  result = await pool.query(sql.getResult({ resultId }));
  res.json(result.rows[0]);
};

const getResultList = async (req, res) => {
  result = await pool.query(sql.getResultList());
  res.json(result.rows[0]);
};

const router = new Router();
router.post(
  '/',
  tokenRequired,
  createResultValidator,
  validationErrorHandler,
  createResult
);
router.post(
  '/:id',
  tokenRequired,
  writeResultValidator,
  validationErrorHandler,
  updateResult
);
router.delete(
  '/:id',
  tokenRequired,
  writeResultValidator,
  validationErrorHandler,
  deleteResult
);
router.post('/:id', validationErrorHandler, getResult);
router.get('/list', validationErrorHandler, getResultList);
module.exports = router;
