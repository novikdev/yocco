'use strict';

module.exports = {
  up: (queryInterface) =>
    queryInterface.sequelize.transaction((transaction) =>
      queryInterface.sequelize.query(
        `
          CREATE TABLE "ig_account_hour_stats" (
            "id" SERIAL UNIQUE,
            "ig_account_id" INTEGER REFERENCES "instagram_accounts" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
            "datetime" TIMESTAMP WITH TIME ZONE,
            "follows_count" INTEGER,
            "unfollows_count" INTEGER,
            "delta_followers_count" INTEGER,
            "total_folowers_count" INTEGER,
            "raw_delta_followers_count" INTEGER,
            "raw_delta_followers_datetime" TIMESTAMP WITH TIME ZONE,
            "created_at" TIMESTAMP WITH TIME ZONE NOT NULL,
            "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL,
            "deleted_at" TIMESTAMP WITH TIME ZONE,
            PRIMARY KEY ("id")
          );

          CREATE INDEX "ig_account_hour_stats_datetime" ON "ig_account_hour_stats" ("datetime");
        `,
        { transaction },
      ),
    ),

  down: async (queryInterface) => queryInterface.dropTable('ig_account_hour_stats'),
};
