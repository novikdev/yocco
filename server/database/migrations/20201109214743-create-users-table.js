'use strict';

module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.createTable('users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      email: {
        type: Sequelize.STRING,
      },
      gender: {
        type: Sequelize.STRING,
      },
      facebookId: {
        type: Sequelize.STRING,
        allowNull: false,
        field: 'facebook_id',
      },
      facebookAccessToken: {
        type: Sequelize.STRING,
        allowNull: false,
        field: 'facebook_access_token',
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        field: 'created_at',
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        field: 'updated_at',
      },
    }),

  down: (queryInterface) => queryInterface.dropTable('users'),
};
