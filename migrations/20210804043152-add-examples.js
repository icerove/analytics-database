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
  return db.createTable('examples', {
    example_id: { type: 'SERIAL', primaryKey: true },
    category: 'string',
    query_id: {
      type: 'int',
      foreignKey: {
        name: 'query_example_id',
        table: 'queries',
        rules: {
          onDelete: 'CASCADE',
          onUpdate: 'RESTRICT',
        },
        mapping: 'query_id',
      },
    },
  })
};

exports.down = function(db) {
  return db.dropTable('examples')
};

exports._meta = {
  "version": 1
};
