'use strict';

module.exports = {
  up: (queryInterface) =>
    queryInterface.sequelize.query(`
      DROP TABLE IF EXISTS "user_instagram_accounts";

      CREATE TABLE IF NOT EXISTS "user_instagram_accounts" (
        "user_id" INTEGER REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
        "ig_account_id" INTEGER REFERENCES "instagram_accounts" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
        "is_default" BOOLEAN DEFAULT NULL,
        "created_at" TIMESTAMP WITH TIME ZONE NOT NULL,
        "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL,
        "deleted_at" TIMESTAMP WITH TIME ZONE,
        UNIQUE ("user_id", "is_default"),
        UNIQUE ("ig_account_id", "user_id")
      );

      COMMENT ON COLUMN "user_instagram_accounts"."is_default" IS 'It is default instagram account of the user. Can be true or null';
    `),

  down: () => Promise.resolve(),
};
