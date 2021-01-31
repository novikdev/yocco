'use strict';

module.exports = {
  up: (queryInterface) =>
    queryInterface.sequelize.query(`
      ALTER TABLE "user_instagram_accounts"
      ADD COLUMN "has_permissions" BOOLEAN NOT NULL DEFAULT TRUE;
    `),

  down: (queryInterface) =>
    queryInterface.sequelize.query(`
      ALTER TABLE "user_instagram_accounts"
      DROP COLUMN "has_permissions";
    `),
};
