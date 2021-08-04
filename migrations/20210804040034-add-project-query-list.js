'use strict';

var dbm;
var type;
var seed;

/**
  * We receive the dbmigrate dependency from dbmigrate initially.
  * This enables us to not have to rely on NODE_PATH.
  */
exports.setup = function(options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

exports.up = function(db) {
  return db.createTable('project_has_query', {
    project_id: 'int',
    query_id: 'int'
  })
};

exports.down = function(db) {
  return db.dropTable('project_has_query')
};

exports._meta = {
  "version": 1
};
