module.exports = {
  port:  process.env.PORT || 3000,
  secret: process.env.MONGO_SECRET || 'ChessHurricaneSuperCool',
  database: process.env.MONGO_DB || 'localhost/hc',
  sessions: process.env.MONGO_SESSIONS || 'localhost/sessions'
};
