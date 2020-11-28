'use strict';

module.exports = {
  up: (queryInterface) =>
    queryInterface.sequelize.query(`
      CREATE TABLE IF NOT EXISTS "instagram_accounts" (
        "id" SERIAL UNIQUE,
        "facebook_id" VARCHAR(255) NOT NULL,
        "username" VARCHAR(255) NOT NULL,
        "profile_picture" VARCHAR(512) NOT NULL,
        "facebook_access_token" VARCHAR(255) NOT NULL,
        "created_at" TIMESTAMP WITH TIME ZONE NOT NULL,
        "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL,
        "deleted_at" TIMESTAMP WITH TIME ZONE,
        PRIMARY KEY ("id")
      );

      CREATE INDEX "instagram_accounts_facebook_id"
      ON "instagram_accounts" ("facebook_id");
    `),

  down: async (queryInterface) => queryInterface.dropTable('instagram_accounts'),
};
