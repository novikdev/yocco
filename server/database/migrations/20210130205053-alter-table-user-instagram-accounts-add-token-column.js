'use strict';

module.exports = {
  up: async (queryInterface) => {
    await queryInterface.sequelize.transaction((transaction) =>
      queryInterface.sequelize.query(
        `
          DROP TABLE "ig_account_hour_stats";
          DROP TABLE "user_instagram_accounts";
          DROP TABLE "instagram_accounts";

          CREATE TABLE "instagram_accounts" (
            "id" VARCHAR(255) UNIQUE,
            "fb_ig_business_account_id" VARCHAR(255) NOT NULL,
            "username" VARCHAR(255) NOT NULL,
            "profile_picture" VARCHAR(512) NOT NULL,
            "created_at" TIMESTAMP WITH TIME ZONE NOT NULL,
            "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL,
            "deleted_at" TIMESTAMP WITH TIME ZONE,
            PRIMARY KEY ("id")
          );

          CREATE TABLE "user_instagram_accounts" (
            "user_id" INTEGER REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
            "ig_account_id" VARCHAR(255) REFERENCES "instagram_accounts" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
            "fb_access_token" VARCHAR(255) NOT NULL,
            "is_default" BOOLEAN DEFAULT NULL ,
            "created_at" TIMESTAMP WITH TIME ZONE NOT NULL,
            "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL,
            "deleted_at" TIMESTAMP WITH TIME ZONE,
            UNIQUE ("user_id", "is_default"),
            UNIQUE ("ig_account_id", "user_id")
          );

          COMMENT ON COLUMN "user_instagram_accounts"."is_default"
          IS 'It is default instagram account of the user. Can be true or null';

          CREATE TABLE "ig_account_hour_stats" (
            "id" SERIAL UNIQUE,
            "ig_account_id" VARCHAR(255) REFERENCES "instagram_accounts" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
            "datetime" TIMESTAMP WITH TIME ZONE,
            "follows_count" INTEGER,
            "unfollows_count" INTEGER,
            "delta_followers_count" INTEGER,
            "total_followers_count" INTEGER,
            "raw_follows_count" INTEGER,
            "raw_follows_datetime" TIMESTAMP WITH TIME ZONE,
            "created_at" TIMESTAMP WITH TIME ZONE NOT NULL,
            "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL,
            "deleted_at" TIMESTAMP WITH TIME ZONE,
            PRIMARY KEY ("id")
          );
        `,
        { transaction },
      ),
    );
  },

  down: (queryInterface) =>
    queryInterface.sequelize.transaction((transaction) =>
      queryInterface.sequelize.query(
        `
          DROP TABLE "ig_account_hour_stats";
          DROP TABLE "user_instagram_accounts";
          DROP TABLE "instagram_accounts";

          CREATE TABLE "instagram_accounts" (
            "id" SERIAL UNIQUE,
            "fb_ig_account_id" VARCHAR(255) NOT NULL,
            "fb_ig_business_account_id" VARCHAR(255) NOT NULL,
            "username" VARCHAR(255) NOT NULL,
            "profile_picture" VARCHAR(512) NOT NULL,
            "fb_access_token" VARCHAR(255) NOT NULL,
            "created_at" TIMESTAMP WITH TIME ZONE NOT NULL,
            "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL,
            "deleted_at" TIMESTAMP WITH TIME ZONE,
            PRIMARY KEY ("id")
          );

          CREATE TABLE "user_instagram_accounts" (
              "user_id" INTEGER REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
              "ig_account_id" INTEGER REFERENCES "instagram_accounts" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
              "is_default" BOOLEAN DEFAULT NULL,
              "has_permissions" BOOLEAN NOT NULL DEFAULT true,
              "created_at" TIMESTAMP WITH TIME ZONE NOT NULL,
              "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL,
              "delete_
          at" TIMESTAMP WITH TIME ZONE,
              UNIQUE ("user_id", "is_default"),
              UNIQUE ("ig_account_id", "user_id")
          );

          COMMENT ON COLUMN "user_instagram_accounts"."is_default"
          IS 'It is default instagram account of the user. Can be true or null';

          CREATE TABLE "ig_account_hour_stats" (
            "id" SERIAL UNIQUE,
            "ig_account_id" INTEGER REFERENCES "instagram_accounts" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
            "datetime" TIMESTAMP WITH TIME ZONE,
            "follows_count" INTEGER,
            "unfollows_count" INTEGER,
            "delta_followers_count" INTEGER,
            "total_followers_count" INTEGER,
            "raw_follows_count" INTEGER,
            "raw_follows_datetime" TIMESTAMP WITH TIME ZONE,
            "created_at" TIMESTAMP WITH TIME ZONE NOT NULL,
            "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL,
            "deleted_at" TIMESTAMP WITH TIME ZONE,
            PRIMARY KEY ("id")
          );
        `,
        { transaction },
      ),
    ),
};
