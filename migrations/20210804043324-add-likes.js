'use strict';

var dbm;
var type;
var seed;

/**
 * We receive the dbmigrate dependency from dbmigrate initially.
 * This enables us to not have to rely on NODE_PATH.
 */
exports.setup = function (options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

exports.up = function (db) {
  return db.createTable('query_has_like', {
    query_id: {
      type: 'int',
      foreignKey: {
        name: 'query_like_id',
        table: 'queries',
        rules: {
          onDelete: 'CASCADE',
          onUpdate: 'RESTRICT',
        },
        mapping: 'query_id',
      },
    },
    user_id: {
      type: 'int',
      foreignKey: {
        name: 'user_like_id',
        table: 'users',
        rules: {
          onDelete: 'CASCADE',
          onUpdate: 'RESTRICT',
        },
        mapping: 'user_id',
      },
    },
  });
};

exports.down = function (db) {
  return db.dropTable('query_has_like');
};

exports._meta = {
  version: 1,
};
