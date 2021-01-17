/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');

const isProd = process.env.NODE_ENV === 'production';

const envConfigDir = isProd
  ? path.join(process.env.APP_DIR, 'config')
  : path.join(__dirname, '../../deploy');

require('dotenv').config({
  path: path.join(envConfigDir, '.env.api'),
});

module.exports = {
  development: {
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
    host: process.env.POSTGRES_HOST,
    dialect: 'postgres',
    migrationStorageTableName: 'sequelize_meta',
  },
  production: {
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
    host: process.env.POSTGRES_HOST,
    dialect: 'postgres',
    migrationStorageTableName: 'sequelize_meta',
  },
};
