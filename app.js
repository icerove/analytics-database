const express = require('express')
const logger = require('morgan')
const cors = require('cors')

const app = express()
app.use(cors())
app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use('/', require('./api/index'))

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  if (req.app.get('env') != 'production') {
    console.log(err.stack)
  }
  res.status(err.status || 500).json({errors: [err.message]})
});

module.exports = app