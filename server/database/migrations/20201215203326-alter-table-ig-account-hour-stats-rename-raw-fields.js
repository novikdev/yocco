'use strict';

module.exports = {
  up: (queryInterface) =>
    queryInterface.sequelize.query(
      `
        ALTER TABLE "ig_account_hour_stats"
        RENAME COLUMN "raw_delta_followers_count" TO "raw_follows_count";

        ALTER TABLE "ig_account_hour_stats"
        RENAME COLUMN "raw_delta_followers_datetime" TO "raw_follows_datetime";

        ALTER TABLE "ig_account_hour_stats"
        RENAME COLUMN "total_folowers_count" TO "total_followers_count";
      `,
    ),

  down: async (queryInterface) =>
    queryInterface.sequelize.query(
      `
      ALTER TABLE "ig_account_hour_stats"
      RENAME COLUMN "raw_follows_count" TO "raw_delta_followers_count";

      ALTER TABLE "ig_account_hour_stats"
      RENAME COLUMN "raw_follows_datetime" TO "raw_delta_followers_datetime";

      ALTER TABLE "ig_account_hour_stats"
      RENAME COLUMN "total_followers_count" TO "total_folowers_count";
    `,
    ),
};
