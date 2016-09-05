module.exports = {
  port:  process.env.PORT || 3000,
  secret: process.env.MONGO_SECRET || 'ChessXSuperCool',
  database: process.env.MONGO_DB || 'localhost/cx',
  sessions: process.env.MONGO_SESSIONS || 'localhost/sessions',
  redis: process.env.REDIS_URL
};
