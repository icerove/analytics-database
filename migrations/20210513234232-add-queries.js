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
  return db.createTable('queries', {
    query_id: { type: 'SERIAL', primaryKey: true },
    query_name: 'string',
    query: 'text',
    options: 'text',
    formatting: 'text',
    create_time: { type: 'TIMESTAMP' },
    user_id: {type: 'int', foreignKey: {
      name: 'user_query_id',
      table: 'users',
      rules: {
        onDelete: 'CASCADE',
        onUpdate: 'RESTRICT'
      },
      mapping: 'user_id'}
    }
  })
};

exports.down = function(db) {
  return db.dropTable('queries')
};

exports._meta = {
  "version": 1
};
