'use strict';

module.exports = {
  up: (queryInterface) =>
    queryInterface.sequelize.query(`
      CREATE TABLE "auth_tokens" (
        "id" SERIAL UNIQUE,
        "device_id" VARCHAR(255) NOT NULL,
        "user_id" INTEGER REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
        "expires_at" TIMESTAMP WITH TIME ZONE NOT NULL,
        "created_at" TIMESTAMP WITH TIME ZONE NOT NULL,
        "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL,
        "deleted_at" TIMESTAMP WITH TIME ZONE,
        PRIMARY KEY ("id")
      );
    `),

  down: (queryInterface) => queryInterface.dropTable('auth_tokens'),
};
