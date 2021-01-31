'use strict';

module.exports = {
  up: (queryInterface) =>
    queryInterface.sequelize.transaction((transaction) =>
      queryInterface.sequelize.query(
        `
          DROP TABLE IF EXISTS "users";

          CREATE TABLE "users" (
            "id" SERIAL UNIQUE,
            "email" VARCHAR(255),
            "name" VARCHAR(255),
            "surname" VARCHAR(255),
            "gender" VARCHAR(255),
            "facebook_id" VARCHAR(255) NOT NULL,
            "facebook_access_token" VARCHAR(255) NOT NULL,
            "created_at" TIMESTAMP WITH TIME ZONE NOT NULL,
            "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL,
            "deleted_at" TIMESTAMP WITH TIME ZONE,
            PRIMARY KEY ("id")
          );

          CREATE INDEX "users_facebook_id" ON "users" ("facebook_id");
        `,
        { transaction },
      ),
    ),

  down: (queryInterface) => queryInterface.dropTable('users'),
};
