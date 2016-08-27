module.exports = {
  port:  process.env.PORT || 3000,
  secret: process.env.MONGO_SECRET || 'ChessXSuperCool',
  database: process.env.MONGO_DB || 'localhost/hc',
  sessions: process.env.MONGO_SESSIONS || 'localhost/sessions'
};
