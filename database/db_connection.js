const { Pool } = require('pg');
const url = require('url');
const environment = require('env2');

if (process.env.ENV==='test') {
  environment('./config-test.env');
} else {
  environment('config.env');
}

console.log('environment', process.env.ENV);

if (!process.env.DATABASE_URL) throw new Error('Environment variable DATABASE_URL must be set');

const params = url.parse(process.env.DATABASE_URL);
const [username, password] = params.auth.split(':');

const options = {
  host: params.hostname,
  port: params.port,
  database: params.pathname.split('/')[1],
  max: process.env.DB_MAX_CONNECTIONS || 2,
  idleTimeoutMillis: process.env.ENV === 'test' ? 1000 : 4000
};

options.user = username;
options.password = password;
options.ssl = (options.host !== 'localhost');


module.exports = new Pool(options);
