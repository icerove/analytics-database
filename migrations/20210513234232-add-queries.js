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
    title: 'string',
    query: 'text',
    chart_type: 'string',
    project_id:  {type: 'int', foreignKey: {
      name: 'query_product_id',
      table: 'projects',
      rules: {
        onDelete: 'CASCADE',
        onUpdate: 'RESTRICT'
      },
      mapping: 'project_id'}
    }
  })
};

exports.down = function(db) {
  return db.dropTable('queries')
};

exports._meta = {
  "version": 1
};
