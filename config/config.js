module.exports = {
  env: process.env.NODE_ENV || 'development',
  port:  process.env.PORT || 3000,
  secret: process.env.MONGO_SECRET || 'ChessXSuperCool',
  database: process.env.MONGODB_URI || 'localhost/cx',
  redis: process.env.REDIS_URL,
  // sendgrid_api_key: process.env.SENDGRID_API_KEY
  sendgrid_api_key: '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'
};
