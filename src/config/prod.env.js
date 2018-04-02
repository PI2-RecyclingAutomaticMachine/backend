module.exports = {
  NODE_ENV: '"production"',
  host: 'localhost',
  port: process.env.PORT || '3000',
  db: {
    name: process.env.DB_NAME || 'trwip-prod',
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 28015,
  },
  SALT_ROUNDS: (Number(process.env.SALT_ROUNDS) || 8),
  secret: '6f6b32a97bfdc5ac3112d782b5a5d7bc7d198e08',
};
