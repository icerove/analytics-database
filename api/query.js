const { Router } = require('express');
const { param, body } = require('express-validator');

const { validationErrorHandler } = require('./error');
const { pool, sql } = require('../db');

const { tokenRequired } = require('../lib/jwt');

const createQueryValidator = body('content').trim();

const queryIsMine = (id, { req }) => {
  let uid = Number(id);
  return pool
    .query(sql.checkQuery({ queryId: uid, userId: req.user.userid }))
    .then((res) => {
      if (res.rows.length == 0) {
        return Promise.reject("Query doesn't exist or doesn't belong to you");
      }
    });
};

const writeQueryValidator = param('id').custom(queryIsMine);

const createQuery = async (req, res) => {
  queryName = req.body.queryName;
  query = req.body.query;
  options = req.body.options;
  formatting = req.body.formatting;
  createTime = req.body.createTime;
  userId = req.user.userid;

  result = await pool.query(
    sql.createQuery({
      queryName,
      query,
      options,
      formatting,
      createTime,
      userId,
    })
  );
  res.status(201).json(result.rows[0]);
};

const updateQuery = async (req, res) => {
  queryName = req.body.queryName;
  query = req.body.query;
  options = req.body.options;
  formatting = req.body.formatting;
  createTime = req.body.createTime;
  userId = req.user.userid;

  queryId = req.params.id;

  await pool.query(
    sql.updateQuery({
      queryName,
      query,
      options,
      formatting,
      createTime,
      userId,
      queryId,
    })
  );
  res.json('Query is updated');
};

const deleteQuery = async (req, res) => {
  queryId = req.params.id;

  if (queryId === null) {
    return res.status(200).json('Query is not found');
  }

  await pool.query(sql.deleteQuery({ queryId }));
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

const getQueryList = async (req, res) => {
  userId = req.user.userid;

  result = await pool.query(sql.getQueryList({ userId }));
  res.json(result.rows);
};

const getQuerySetProjectList = async (req, res) => {
  queryId = req.params.id;

  projects = await pool.query(sql.getQuerySetProjectList({ queryId }));
  res.json(projects.rows);
};

const setAsExample = async (req, res) => {
  queryId = req.params.id;
  category = req.body.category;

  await pool.query(sql.setAsExample({ queryId, category }));
  res.json('Set as example ' + queryId);
};

const updateCategory = async (req, res) => {
  queryId = req.params.id;
  category = req.body.category;

  await pool.query(sql.updateCategory({ category, queryId }));
  res.json('Update category ' + queryId);
};

const deleteFromExample = async (req, res) => {
  queryId = req.params.id;

  await pool.query(sql.deleteFromExample({ queryId }));
  res.json('Delete from examples ' + queryId);
};

const AddLikeToQuery = async (req, res) => {
  userId = req.user.userid;
  queryId = req.params.id;

  await pool.query(sql.AddLikeToQuery({ queryId, userId }));
  res.json('Like query ' + queryId);
};

const RemoveLikeFromQuery = async (req, res) => {
  userId = req.user.userid;
  queryId = req.params.id;

  await pool.query(sql.RemoveLikeFromQuery({ queryId, userId }));
  res.json('remove like from query ' + queryId);
};

const getLikesForQuery = async (req, res) => {
  queryId = req.params.id;

  result = await pool.query(sql.getLikesForQuery({ queryId }));
  res.json(result.rows);
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
router.post(
  '/set-example/:id',
  tokenRequired,
  writeQueryValidator,
  validationErrorHandler,
  setAsExample
);
router.post(
  '/update-example/:id',
  tokenRequired,
  writeQueryValidator,
  validationErrorHandler,
  updateCategory
);

router.delete(
  '/delete-example/:id',
  tokenRequired,
  writeQueryValidator,
  validationErrorHandler,
  deleteFromExample
);
router.post(
  '/add-like/:id',
  tokenRequired,
  validationErrorHandler,
  AddLikeToQuery
);
router.delete(
  '/remove-like/:id',
  tokenRequired,
  validationErrorHandler,
  RemoveLikeFromQuery
);
router.get('/:id', validationErrorHandler, getQuery);
router.get('/', tokenRequired, validationErrorHandler, getQueryList);
router.get(
  '/added-project/:id',
  validationErrorHandler,
  getQuerySetProjectList
);
router.get('/added-like/:id', validationErrorHandler, getLikesForQuery);
module.exports = router;
