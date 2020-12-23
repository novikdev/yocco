'use strict';

module.exports = {
  up: (queryInterface) =>
    queryInterface.sequelize.transaction((transaction) =>
      queryInterface.sequelize.query(
        `
          ALTER TABLE "user_instagram_accounts" RENAME COLUMN "instagram_account_id" TO "ig_account_id";
        `,
        { transaction },
      ),
    ),

  down: async (queryInterface) =>
    queryInterface.sequelize.transaction((transaction) =>
      queryInterface.sequelize.query(
        `
        ALTER TABLE "user_instagram_accounts" RENAME COLUMN "ig_account_id" TO "instagram_account_id";
        `,
        { transaction },
      ),
    ),
};
