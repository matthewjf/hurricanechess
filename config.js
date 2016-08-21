module.exports = {
  secret: process.env.MONGO_SECRET || 'ChessHurricaneSuperCool',
  database: process.env.MONGO_URI || 'localhost/hc'
};
