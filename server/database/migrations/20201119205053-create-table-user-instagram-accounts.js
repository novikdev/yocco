'use strict';

module.exports = {
  up: (queryInterface) =>
    queryInterface.sequelize.transaction((transaction) =>
      queryInterface.sequelize.query(
        `
          CREATE TABLE "user_instagram_accounts" (
            "user_id" INTEGER REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
            "instagram_account_id" INTEGER REFERENCES "instagram_accounts" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
            "is_default" BOOLEAN DEFAULT NULL,
            "created_at" TIMESTAMP WITH TIME ZONE NOT NULL,
            "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL,
            "deleted_at" TIMESTAMP WITH TIME ZONE,
            UNIQUE ("user_id", "is_default"),
            PRIMARY KEY ("user_id", "instagram_account_id")
          );
          COMMENT ON COLUMN "user_instagram_accounts"."is_default" IS 'It is default instagram account of the user. Can be true or null';
        `,
        { transaction },
      ),
    ),

  down: (queryInterface) => queryInterface.dropTable('user_instagram_accounts'),
};
