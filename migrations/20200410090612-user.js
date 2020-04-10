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
  return (async () => {
    await db.runSql('PRAGMA foreign_keys = 1');
    await db.createTable('user', {
      id: {type: 'int', primaryKey: true, autoIncrement: true, notNull: true, unsigned: true },
      username: {type: 'string', notNull: true, length: 60, unique: true},
      password: {type: 'string', notNull: true, length: 255},
      apiKey: {type: 'string', notNull: true, unique: true}
    });
    await db.createTable('comment', {
      id: {type: 'int', primaryKey: true, autoIncrement: true, notNull: true, unsigned: true },
      name: {type: 'string', length: 50},
      surname: {type: 'string', length: 100},
      comment: {type: 'string', length: 280},
      user_id: {type: 'int', notNull: true, unsigned: true,
        foreignKey: {
          name: 'comment_user',
          table: 'user',
          mapping: 'user_id',
          rules: {
            onDelete: 'CASCADE',
            onUpdate: 'RESTRICT'
          }
        }
      },
    });
  })();
};

exports.down = function(db) {
  return (async () => {
    await db.dropTable('comment');
    await db.dropTable('user');
  })();
};

exports._meta = {
  "version": 1
};
