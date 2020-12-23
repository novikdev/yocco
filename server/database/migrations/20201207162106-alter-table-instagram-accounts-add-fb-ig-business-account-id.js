'use strict';

module.exports = {
  up: (queryInterface) =>
    queryInterface.sequelize.transaction((transaction) =>
      queryInterface.sequelize.query(
        `
          DROP INDEX "instagram_accounts_facebook_id";

          DELETE FROM "instagram_accounts";

          ALTER TABLE "instagram_accounts" RENAME COLUMN "facebook_id" TO "fb_ig_account_id";
          ALTER TABLE "instagram_accounts" RENAME COLUMN "facebook_access_token" TO "fb_access_token";

          ALTER TABLE "instagram_accounts"
          ADD COLUMN "fb_ig_business_account_id" VARCHAR(255) NOT NULL;
        `,
        { transaction },
      ),
    ),

  down: async (queryInterface) =>
    queryInterface.sequelize.transaction((transaction) =>
      queryInterface.sequelize.query(
        `
          ALTER TABLE "instagram_accounts" DROP COLUMN "fb_ig_business_account_id";

          ALTER TABLE "instagram_accounts" RENAME COLUMN "fb_ig_account_id" TO "facebook_id";
          ALTER TABLE "instagram_accounts" RENAME COLUMN "fb_access_token" TO "facebook_access_token";

          CREATE INDEX "instagram_accounts_facebook_id"
          ON "instagram_accounts" ("facebook_id");
        `,
        { transaction },
      ),
    ),
};
