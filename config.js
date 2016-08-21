module.exports = {
  secret: process.env.MONGO_SECRET || 'ChessHurricaneSuperCool',
  database: process.env.MONGO_DB || 'localhost/hc',
  sessions: process.env.MONGO_SESSIONS || 'localhost/sessions'
};
