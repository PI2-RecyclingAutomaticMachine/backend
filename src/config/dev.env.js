module.exports = {
  NODE_ENV: '"development"',
  host: 'localhost',
  port: process.env.PORT || '3000',
  db: {
    name: process.env.DB_NAME || 'dev',
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 28015,
  },
  SALT_ROUNDS: (Number(process.env.SALT_ROUNDS) || 8),
  secret: 'bora ver de qual eh essa treta',
};
