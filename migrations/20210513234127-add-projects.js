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
  return db.createTable('projects', {
    project_id: { type: 'SERIAL', primaryKey: true },
    project_name: 'string',
    user_id: {type: 'int', foreignKey: {
      name: 'user_product_id',
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
  return db.dropTable('projects')
};

exports._meta = {
  "version": 1
};
